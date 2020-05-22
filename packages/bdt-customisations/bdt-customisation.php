<?php

/**
 * Plugin Name: BDT Customisations
 * Plugin URI: https://github.com/simons/bdt-customisations
 * Description: Little self-rolled plugin to customise my rubbish blog in a non-themey way
 * Version: 1.0.0
 * Author: Simon Scarfe
 * Author URI: https://breakfastdinnertea.co.uk
 * License: MIT
 */

add_filter('register_taxonomy_args', function ($args, $taxonomy) {
    if ('kind' === $taxonomy) {
        $args['show_in_graphql'] = true;
        $args['graphql_single_name'] = 'Kind';
        $args['graphql_plural_name'] = 'Kinds';
    }

    return $args;
}, 10, 2);

add_action('graphql_register_types', 'register_watchof_type');

function register_watchof_type()
{
    register_graphql_object_type('WatchOf', [
        'description' => __("A watch, typically of a film or TV show", 'bdt'),
        'fields' => [
            'name' => [
                'type' => 'String',
                'description' => __('The title of the film', 'bdt'),
            ],
            'rating' => [
                'type' => 'Float',
                'description' => __('My rating, if applicable', 'bdt'),
            ],
            'review' => [
                'type' => 'String',
                'description' => __('A review or summary, if applicable', 'bdt'),
            ],
            'url' => [
                'type' => 'String',
                'description' => __('The URL of thing we have watched', 'bdt'),
            ],
        ],
    ]);
}

function rating_to_float($rating)
{
    return (mb_substr($rating, -1) === '½') ? mb_strlen($rating) - .5 : mb_strlen($rating);
}

add_action('graphql_register_types', function () {
    $post_types = WPGraphQL::get_allowed_post_types();

    if (!empty($post_types) && is_array($post_types)) {
        foreach ($post_types as $post_type) {
            $post_type_object = get_post_type_object($post_type);

            register_graphql_field($post_type_object->graphql_single_name, 'syndication', [
                'type' => 'String',
                'description' => __('Syndication', 'mf2'),
                'resolve' => function ($post) {
                    $syndication = get_post_meta($post->ID, 'mf2_syndication', true);
                    return !empty($syndication) ? $syndication[0] : null;
                },
            ]);

            register_graphql_field($post_type_object->graphql_single_name, 'watchOf', [
                'type' => 'WatchOf',
                'description' => __('Watch Of', 'mf2'),
                'resolve' => function ($post) {
                    $watchOf = get_post_meta($post->ID, 'mf2_watch-of', true);

                    $watchOfObject = array();

                    if (!empty($watchOf["properties"])) {
                        $props = $watchOf["properties"];
                        if (!empty($props["summary"])) {
                            $watchOfObject["review"] = $props["summary"][0];
                        }
                        $watchOfObject["url"] = $props["url"][0];

                        preg_match('/A (\x{2605}*\x{00BD}?) (?:review of|diary entry for) (.*)/u', $props['name'][0], $splitTitle);
                        $watchOfObject["name"] = $splitTitle[2];
                        $watchOfObject["rating"] = rating_to_float($splitTitle[1]);
                    }
                    return !empty($watchOfObject) ? $watchOfObject : null;
                },
            ]);
        }
    }
});
