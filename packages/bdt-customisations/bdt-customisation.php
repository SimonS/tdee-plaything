<?php

/**
 * Plugin Name: BDT Customisations
 * Plugin URI: https://github.com/simons/tdee-plaything
 * Description: Little self-rolled plugin to customise my rubbish blog in a non-themey way, requires a TMDB_API_KEY defined in wp-config
 * Version: 1.1.1
 * Author: Simon Scarfe
 * Author URI: https://breakfastdinnertea.co.uk
 * License: MIT
 */

use function bdt\fetchMovieMetaData;

require dirname(__FILE__) . '/lib/tmdb-fetcher.php';

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
            'year' => [
                'type' => 'Integer',
                'description' => __('The year the film of TV show was released', 'bdt'),
            ],
            'meta' => [
                'type' => 'FilmMeta',
                'description' => __('Metadata around a film, retrieved from TMDB', 'bdt'),
            ]
        ],
    ]);
}

add_action('graphql_register_types', 'register_film_meta_type');

function register_film_meta_type()
{
    register_graphql_object_type('FilmMeta', [
        'description' => __("Metadata around a film", 'bdt'),
        'fields' => [
            'runtime' => [
                'type' => 'Integer',
                'description' => __('Film length in minutes', 'bdt'),
            ],
            'original_language' => [
                'type' => 'String',
                'description' => __('Language it was filmed in iso-...', 'bdt'),
            ],
            'image' => [
                'type' => 'String',
                'description' => __('a link to the poster image', 'bdt'),
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

                        preg_match('/A (\x{2605}*\x{00BD}?)(?:\s)?(?:review of|diary entry for) (.*) \((\d+)\)/u', $props['name'][0], $splitTitle);

                        $watchOfObject["name"] = $splitTitle[2];
                        $watchOfObject["year"] = $splitTitle[3];
                        $watchOfObject["rating"] = rating_to_float($splitTitle[1]) > 0 ? rating_to_float($splitTitle[1]) : null;

                        $watchOfObject["meta"] = fetchMovieMetaData($watchOfObject["name"], $watchOfObject["year"]);
                    }
                    return !empty($watchOfObject) ? $watchOfObject : null;
                },
            ]);
        }
    }
});
