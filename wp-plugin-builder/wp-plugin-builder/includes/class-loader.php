<?php
if ( ! defined('ABSPATH') ) exit;

class WPB_Loader {

    public function __construct() {
        $this->includes();
        $this->init_hooks();
    }

    private function includes() {
        // API
        require_once WPB_PATH . 'includes/class-api.php';

        // Projects manager (backend logic)
        require_once WPB_PATH . 'includes/class-projects.php';
    }

    private function init_hooks() {
        // init API classes
        if ( class_exists('WPB_API') ) {
            new WPB_API();
        }

        if ( class_exists('WPB_Projects') ) {
            new WPB_Projects();
        }

        // Admin menu
        add_action('admin_menu', [$this, 'register_admin_menu']);

        // enqueue admin scripts/styles
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
    }

    public function register_admin_menu() {
        add_menu_page(
            'WP Plugin Builder',
            'Plugin Builder',
            'manage_options',
            'wpb-builder',
            [$this, 'render_admin_page'],
            'dashicons-admin-plugins',
            58
        );
    }

    public function render_admin_page() {
        // root element for React or JS app
        echo '<div class="wrap"><h1>WP Plugin Builder Studio</h1><div id="wpb-root">Loading app...</div></div>';
    }

    public function enqueue_admin_assets($hook) {
        // ensure we only load on our plugin page
        if ( $hook !== 'toplevel_page_wpb-builder' ) return;

        $plugin_url = WPB_URL;

        // simple admin JS (you can replace with built React bundle later)
        wp_enqueue_script(
            'wpb-admin-js',
            $plugin_url . 'admin/build/admin.js',
            ['jquery'],
            WPB_VERSION,
            true
        );

        // localize rest url & nonce for JS
        wp_localize_script('wpb-admin-js', 'WPB_DATA', [
            'rest_url' => esc_url_raw( rest_url('wpb/v1/') ),
            'nonce'    => wp_create_nonce('wp_rest'),
        ]);

        // admin css if exists
        if ( file_exists( WPB_PATH . 'admin/build/admin.css' ) ) {
            wp_enqueue_style('wpb-admin-css', $plugin_url . 'admin/build/admin.css', [], WPB_VERSION);
        }
    }

}
