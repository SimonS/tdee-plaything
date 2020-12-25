<?php
namespace bdt;

function get_updated_feeds()
{
    $films = fetch_feed("https://letterboxd.com/simonscarfe/rss/")->get_items();
    return array_filter($films, function ($film) {
        return !empty($film->get_item_tags("https://letterboxd.com", "filmTitle"));
    });
}
