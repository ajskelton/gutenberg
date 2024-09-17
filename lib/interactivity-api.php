<?php
/**
 * Interactivity API functions specific for the Gutenberg editor plugin.
 *
 * @package gutenberg
 */

/**
 * Deregisters the Core Interactivity API Modules and replace them
 * with the ones from the Gutenberg plugin.
 */
function gutenberg_reregister_interactivity_script_modules() {
	$default_version = defined( 'GUTENBERG_VERSION' ) && ! SCRIPT_DEBUG ? GUTENBERG_VERSION : time();
	wp_deregister_script_module( '@wordpress/interactivity' );
	wp_deregister_script_module( '@wordpress/interactivity-router' );

	$experiments                  = get_option( 'gutenberg-experiments' );
	$full_page_navigation_enabled = isset( $experiments['gutenberg-full-page-client-side-navigation'] );

	$index_path    = gutenberg_dir_path() . 'build/interactivity/index.min.asset.php';
	$index_asset   = file_exists( $index_path ) ? require $index_path : null;
	$index_version = isset( $index_asset['version'] ) ? $index_asset['version'] : $default_version;

	wp_register_script_module(
		'@wordpress/interactivity',
		gutenberg_url( '/build-module/' . ( SCRIPT_DEBUG ? 'interactivity/debug.min.js' : 'interactivity/index.min.js' ) ),
		array(),
		$full_page_navigation_enabled ? null : $index_version
	);

	$router_path    = gutenberg_dir_path() . 'build/interactivity/router.min.asset.php';
	$router_asset   = file_exists( $router_path ) ? require $router_path : null;
	$router_version = isset( $router_asset['version'] ) ? $router_asset['version'] : $default_version;

	wp_register_script_module(
		'@wordpress/interactivity-router',
		gutenberg_url( '/build-module/interactivity-router/index.min.js' ),
		array(
			array(
				'id'     => '@wordpress/a11y',
				'import' => 'dynamic',
			),
			'@wordpress/interactivity',
		),
		$full_page_navigation_enabled ? null : $router_version
	);
}
add_action( 'init', 'gutenberg_reregister_interactivity_script_modules' );

/**
 * Adds script data to the interactivity-router script module.
 *
 * This filter is registered conditionally anticipating a WordPress Core change to add the script module data.
 * The filter runs on 'after_setup_theme' (when Core registers Interactivity and Script Modules hooks)
 * to ensure that the conditional registration happens after Core and correctly determine whether
 * the filter should be added.
 *
 * @see https://github.com/WordPress/wordpress-develop/pull/7304
 */
function gutenberg_register_interactivity_script_module_data_hooks() {
	if ( ! has_filter( 'script_module_data_@wordpress/interactivity-router', array( wp_interactivity(), 'filter_script_module_interactivity_router_data' ) ) ) {
		add_filter(
			'script_module_data_@wordpress/interactivity-router',
			function ( $data ) {
				if ( ! isset( $data['i18n'] ) ) {
					$data['i18n'] = array();
				}
				$data['i18n']['loading'] = __( 'Loading page, please wait.', 'default' );
				$data['i18n']['loaded']  = __( 'Page Loaded.', 'default' );
				return $data;
			}
		);
	}
}
add_action( 'after_setup_theme', 'gutenberg_register_interactivity_script_module_data_hooks', 20 );
