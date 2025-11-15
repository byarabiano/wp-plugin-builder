<?php
if (!defined('ABSPATH')) exit;

class WPB_Loader {

    public function __construct() {
        $this->includes();
        $this->init_hooks();
    }

    private function includes() {
        require_once WPB_PATH . 'includes/class-api.php';
        require_once WPB_PATH . 'includes/class-projects.php';
    }

    private function init_hooks() {
        if (class_exists('WPB_API')) new WPB_API();
        if (class_exists('WPB_Projects')) new WPB_Projects();
    }
}
