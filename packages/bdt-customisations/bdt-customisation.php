<?php

/**
 * Plugin Name: BDT Customisations
 * Plugin URI: https://github.com/simons/tdee-plaything/packages/bdt-customisations
 * Description: Little self-rolled plugin to customise my rubbish blog in a non-themey way, requires a TMDB_API_KEY defined in wp-config
 * Version: 1.4.0
 * Author: Simon Scarfe
 * Author URI: https://breakfastdinnertea.co.uk
 * License: GPL
 */

require_once dirname(__FILE__) . '/lib/register-films.php';
require_once dirname(__FILE__) . '/lib/register-weighins.php';
require_once dirname(__FILE__) . '/lib/register-podcasts.php';

add_filter('acf/settings/remove_wp_meta_box', '__return_false');

add_action('graphql_register_types', function () {
    register_graphql_field('RootQueryToPageConnectionWhereArgs', 'playground', [
        'type' => 'string',
        'description' => __('A string indicating to consume this page in the playground.', 'bdt'),
    ]);
});

add_filter('graphql_post_object_connection_query_args', function ($query_args, $source, $args, $context, $info) {
    $playground = $args['where']['playground'];

    if (isset($playground)) {
        $query_args['meta_query'] = [
            [
                'key' => 'playground',
                'value' => $playground,
                'compare' => '='
            ]
        ];
    }

    return $query_args;
}, 10, 5);
