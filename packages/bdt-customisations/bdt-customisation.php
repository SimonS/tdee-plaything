<?php

/**
 * Plugin Name: BDT Customisations
 * Plugin URI: https://github.com/simons/tdee-plaything/packages/bdt-customisations
 * Description: Little self-rolled plugin to customise my rubbish blog in a non-themey way, requires a TMDB_API_KEY defined in wp-config
 * Version: 1.2.0
 * Author: Simon Scarfe
 * Author URI: https://breakfastdinnertea.co.uk
 * License: GPL
 */

require_once dirname(__FILE__) . '/lib/register-films.php';

add_filter('acf/settings/remove_wp_meta_box', '__return_false');

// Register Weigh In Post Type
function bdt_register_weighin()
{
    $labels = array(
        'name'                  => 'Weigh Ins',
        'singular_name'         => 'Weigh In',
        'add_new'               => 'New Weigh In',
        'add_new_item'          => 'Add New Weigh In',
        'edit_item'             => 'Edit Weigh In',
        'new_item'              => 'New Weigh In',
        'view_item'             => 'View Weigh In',
        'view_items'            => 'View Weigh Ins',
        'not_found'             => 'No Weigh Ins Found',
        'not_found_in_trash'    => 'No Weigh Ins in Trash',
    );
    $args = array(
        'labels'                => $labels,
        'has_archive'           => false,
        'public'                => true,
        'hierarchical'          => false,
        'supports'              => array( 'title', 'custom-fields'),
        'rewrite'               => array( 'slug' => 'weighin' ),
        'show_in_rest'          => true,
    );
    register_post_type('bdt_weighin', $args);
}
add_action('init', 'bdt_register_weighin', 0);
