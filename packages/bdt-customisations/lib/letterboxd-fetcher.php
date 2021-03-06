<?php
namespace bdt;

function extract_image($html)
{
    $dom = new \DOMDocument;
    $dom->loadHTML($html);
    return $dom->getElementsByTagName("img")[0]->getAttribute("src");
}

function extract_review($html)
{
    // there is one flaw in this ingenious plan. I can never reference when
    // I have watched a film using this exact formatting. 👀
    if (preg_match("/Watched on (.*), \d{4}\./", $html)) {
        return false;
    }

    $dom = new \DOMDocument;
    $dom->loadHTML("<div>$html</div>");

    $xpath = new \DOMXPath($dom);

    foreach ($xpath->query('//*[not(node())]') as $node) {
        $node->parentNode->removeChild($node);
    }

    foreach ($xpath->query('//*[not(node())]') as $node) {
        $node->parentNode->removeChild($node);
    }

    return trim(substr($dom->saveXML($dom->getElementsByTagName('div')->item(0)), 5, -6));
}

function get_updated_feeds()
{
    $films = fetch_feed("https://letterboxd.com/simonscarfe/rss/")->get_items();
    $updated = array_filter($films, function ($film) {
        return !(empty($film->get_item_tags("https://letterboxd.com", "filmTitle")) ||
            (new \WP_Query([
                'post_type'=>'bdt_film',
                'meta_key' => 'review_link',
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
            "image" => extract_image($film->get_description()),
            "review" => extract_review($film->get_description())
        ];
    }, $updated);
}
