<?php
namespace bdt;

function get_updated_feeds()
{
    $films = fetch_feed("https://letterboxd.com/simonscarfe/rss/")->get_items();
    $updated = array_filter($films, function ($film) {
        return !(empty($film->get_item_tags("https://letterboxd.com", "filmTitle")) ||
            (new \WP_Query([
                'post_type'=>'bdt_film',
                'meta_key' => 'link',
                'meta_value' => $film->get_link()
            ]))->have_posts());
    });

    return array_map(function ($film) {
        return [
            "filmTitle" => $film->get_item_tags("https://letterboxd.com", "filmTitle")[0]["data"],
            "watchedDate" => $film->get_item_tags("https://letterboxd.com", "watchedDate")[0]["data"],
            "rating" => $film->get_item_tags("https://letterboxd.com", "memberRating")[0]["data"],
            "link" => $film->get_link(),
            "filmYear" => $film->get_item_tags("https://letterboxd.com", "filmYear")[0]["data"],
        ];
    }, $updated);
}
