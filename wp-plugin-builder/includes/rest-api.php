<?php
// includes/rest-api.php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route('wpb/v1', '/export', array(
        'methods'  => 'POST',
        'callback' => 'wpb_rest_export_project',
        'permission_callback' => function (WP_REST_Request $request) {
            return current_user_can('manage_options'); // أو capability تريدها
        }
    ));

    register_rest_route('wpb/v1', '/delete_export', array(
        'methods'  => 'POST',
        'callback' => 'wpb_rest_delete_export',
        'permission_callback' => function (WP_REST_Request $request) {
            return current_user_can('manage_options');
        }
    ));
});

// Helper: sanitize path segments (no traversal)
function wpb_sanitize_path_segment($s) {
    $s = str_replace(['..','\\','/'], '', $s);
    $s = preg_replace('/[^A-Za-z0-9_\-\.]/', '_', $s);
    return trim($s, '_-');
}

function wpb_write_files_to_dir( $base_dir, $files ) {
    foreach ( $files as $path => $content ) {
        // normalize path and prevent traversal
        $parts = explode('/', $path);
        $safe_parts = array_map('wpb_sanitize_path_segment', $parts);
        $rel_path = implode(DIRECTORY_SEPARATOR, $safe_parts);
        $full_path = trailingslashit($base_dir) . $rel_path;

        $dir = dirname( $full_path );
        if ( ! file_exists( $dir ) ) {
            wp_mkdir_p( $dir );
        }

        file_put_contents( $full_path, $content );
    }
}

function wpb_rest_export_project( WP_REST_Request $request ) {
    $params = $request->get_json_params();

    if ( empty( $params['project'] ) || empty( $params['project']['name'] ) || ! isset($params['files']) ) {
        return new WP_REST_Response( array('success' => false, 'message' => 'بيانات غير مكتملة'), 400 );
    }

    $project = $params['project'];
    $files = $params['files']; // expected: { "path": "content", ... }
    $saveProject = isset($params['save_project']) ? boolval($params['save_project']) : true;
    $deleteAfter = isset($params['delete_after']) ? boolval($params['delete_after']) : false;

    $uploads = wp_get_upload_dir();
    $base_upload_dir = trailingslashit( $uploads['basedir'] ) . 'wp-plugin-builder';
    if ( ! file_exists( $base_upload_dir ) ) {
        wp_mkdir_p( $base_upload_dir );
    }

    // create project folder
    $slug = ! empty($project['info']['slug']) ? wpb_sanitize_path_segment( $project['info']['slug'] ) : wpb_sanitize_path_segment( $project['name'] );
    $time = date('Ymd-His');
    $proj_folder = trailingslashit( $base_upload_dir ) . $slug . '-' . $time;
    wp_mkdir_p( $proj_folder );

    // write project JSON (metadata)
    $meta_file = trailingslashit($proj_folder) . 'project.json';
    file_put_contents( $meta_file, wp_json_encode( $project, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE ) );

    // write files to folder
    wpb_write_files_to_dir( $proj_folder, $files );

    // create ZIP
    $zip_path = trailingslashit( $base_upload_dir ) . $slug . '-' . $time . '.zip';

    $zip = new ZipArchive();
    if ( $zip->open( $zip_path, ZipArchive::CREATE ) !== TRUE ) {
        return new WP_REST_Response( array('success' => false, 'message' => 'خطأ في إنشاء ملف ZIP'), 500 );
    }

    // add all files recursively
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($proj_folder));
    foreach ($iterator as $file) {
        if ($file->isDir()) continue;
        $filePath = $file->getPathname();
        $relativePath = substr($filePath, strlen($proj_folder));
        $zip->addFile($filePath, $relativePath);
    }

    $zip->close();

    // Optionally save project metadata to wp_options for quick listing (optional)
    if ( $saveProject ) {
        $stored = get_option('wpb_saved_projects', array());
        $stored[] = array(
            'id' => $slug . '-' . $time,
            'name' => $project['name'],
            'folder' => $proj_folder,
            'zip' => $zip_path,
            'created' => current_time('mysql', 1)
        );
        update_option('wpb_saved_projects', $stored);
    }

    $zip_url = trailingslashit( $uploads['baseurl'] ) . 'wp-plugin-builder/' . basename($zip_path);

    // Response
    return new WP_REST_Response( array(
        'success' => true,
        'zip_url' => $zip_url,
        'project_folder' => $proj_folder,
        'zip_path' => $zip_path,
    ), 200 );
}

function wpb_rest_delete_export( WP_REST_Request $request ) {
    $params = $request->get_json_params();
    $zip_path = isset($params['zip_path']) ? $params['zip_path'] : '';
    $project_folder = isset($params['project_folder']) ? $params['project_folder'] : '';

    // sanitize and ensure inside uploads/wp-plugin-builder
    $uploads = wp_get_upload_dir();
    $base_upload_dir = trailingslashit( $uploads['basedir'] ) . 'wp-plugin-builder';

    if ( $zip_path ) {
        // Only allow deletion if in our base dir
        if ( strpos( realpath($zip_path), realpath($base_upload_dir) ) === 0 && file_exists($zip_path) ) {
            unlink($zip_path);
        }
    }

    if ( $project_folder ) {
        if ( strpos( realpath($project_folder), realpath($base_upload_dir) ) === 0 && file_exists($project_folder) ) {
            // recursive remove
            $it = new RecursiveDirectoryIterator($project_folder, RecursiveDirectoryIterator::SKIP_DOTS);
            $files = new RecursiveIteratorIterator($it, RecursiveIteratorIterator::CHILD_FIRST);
            foreach($files as $file) {
                if ($file->isDir()){
                    @rmdir($file->getRealPath());
                } else {
                    @unlink($file->getRealPath());
                }
            }
            @rmdir($project_folder);
        }
    }

    return new WP_REST_Response(array('success' => true), 200);
}
