<?php
if ( ! defined('ABSPATH') ) exit;

class WPB_API {

    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes() {
        register_rest_route('wpb/v1', '/new_project', [
            'methods' => 'POST',
            'callback' => [$this, 'new_project'],
            'permission_callback' => function() {
                return current_user_can('manage_options');
            },
        ]);

        register_rest_route('wpb/v1', '/save_project', [
            'methods' => 'POST',
            'callback' => [$this, 'save_project'],
            'permission_callback' => function() {
                return current_user_can('manage_options');
            },
        ]);

        register_rest_route('wpb/v1', '/load_project', [
            'methods' => 'GET',
            'callback' => [$this, 'load_project'],
            'permission_callback' => function() {
                return current_user_can('manage_options');
            },
        ]);

        register_rest_route('wpb/v1', '/list_projects', [
            'methods' => 'GET',
            'callback' => [$this, 'list_projects'],
            'permission_callback' => function() {
                return current_user_can('manage_options');
            },
        ]);
    }

    public function new_project( $request ) {
        $body = $request->get_json_params();
        $name = isset($body['name']) ? sanitize_text_field( $body['name'] ) : 'Untitled Project';
        $id   = 'wpb_' . time();

        $project = [
            'id' => $id,
            'name' => $name,
            'created' => current_time('mysql'),
            'data' => (object)[] // placeholder for project JSON
        ];

        // save via Projects class helper
        if ( class_exists('WPB_Projects') ) {
            WPB_Projects::create_project( $project );
        }

        return rest_ensure_response(['success' => true, 'project' => $project]);
    }

    public function save_project( $request ) {
        $body = $request->get_json_params();
        if ( empty($body['id']) ) {
            return new WP_Error('missing_id', 'Project id is required', ['status'=>400]);
        }

        $id = sanitize_text_field($body['id']);
        $data = isset($body['data']) ? $body['data'] : null;

        if ( class_exists('WPB_Projects') ) {
            $saved = WPB_Projects::save_project_data($id, $data);
            if ($saved) {
                return rest_ensure_response(['success' => true, 'message' => 'Saved']);
            }
        }

        return new WP_Error('save_failed', 'Save failed', ['status' => 500]);
    }

    public function load_project( $request ) {
        $id = $request->get_param('id');
        if ( empty($id) ) {
            return new WP_Error('missing_id', 'Project id is required', ['status'=>400]);
        }
        $id = sanitize_text_field($id);

        if ( class_exists('WPB_Projects') ) {
            $project = WPB_Projects::get_project($id);
            if ( $project ) {
                return rest_ensure_response(['success'=>true, 'project'=>$project]);
            }
        }

        return new WP_Error('not_found', 'Project not found', ['status'=>404]);
    }

    public function list_projects() {
        if ( class_exists('WPB_Projects') ) {
            $list = WPB_Projects::list_projects();
            return rest_ensure_response(['success'=>true, 'projects'=>$list]);
        }
        return rest_ensure_response(['success'=>true, 'projects'=>[]]);
    }
}
