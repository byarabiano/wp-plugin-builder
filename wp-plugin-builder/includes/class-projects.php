<?php
if ( ! defined('ABSPATH') ) exit;

class WPB_Projects {

    // create a project (static helper)
    public static function create_project( $project ) {
        $key = 'wpb_project_' . $project['id'];
        $value = wp_json_encode($project);
        update_option($key, $value);
        // maintain index list
        $list = get_option('wpb_projects_list', []);
        $list[$project['id']] = [
            'id' => $project['id'],
            'name' => $project['name'],
            'created' => $project['created']
        ];
        update_option('wpb_projects_list', $list);
        return true;
    }

    // save project data (override)
    public static function save_project_data( $project_id, $data ) {
        $key = 'wpb_project_' . $project_id;
        $existing = get_option($key);
        if ( ! $existing ) return false;

        $obj = json_decode($existing, true);
        $obj['data'] = $data;
        $obj['modified'] = current_time('mysql');
        update_option($key, wp_json_encode($obj));

        // update small index info
        $list = get_option('wpb_projects_list', []);
        if ( isset($list[$project_id]) ) {
            $list[$project_id]['modified'] = $obj['modified'];
            update_option('wpb_projects_list', $list);
        }
        return true;
    }

    // get project
    public static function get_project( $project_id ) {
        $key = 'wpb_project_' . $project_id;
        $val = get_option($key);
        if ( ! $val ) return false;
        return json_decode($val, true);
    }

    // list projects
    public static function list_projects() {
        $list = get_option('wpb_projects_list', []);
        // convert to indexed array
        return array_values($list);
    }
}
