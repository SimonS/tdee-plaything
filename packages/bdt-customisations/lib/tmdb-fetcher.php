<?php
namespace bdt;

const TRANSIENT_NS = 'bdt_meta';

function fetchMovieMetaData($title, $year=2012)
{
    $slugifiedTitle = sanitize_title_with_dashes($title);
    $transientKey = TRANSIENT_NS . "_{$slugifiedTitle}_{$year}";

    $cached = get_transient($transientKey);
    if ($cached) {
        return $cached;
    }

    $imageWidth = 154;
    $apiKey = TMDB_API_KEY;
    $searchResults = json_decode(wp_remote_get("https://api.themoviedb.org/3/search/movie?year=$year&query=$title&api_key=$apiKey")['body']);

    if (count($searchResults->results) === 0) {
        return array();
    }

    $id = $searchResults->results[0]->id;
    $rawMovieMetadata = json_decode(wp_remote_get("https://api.themoviedb.org/3/movie/${id}?api_key=$apiKey")['body']);
    
    $result = array(
        'runtime' => $rawMovieMetadata->runtime,
        'original_language' => $rawMovieMetadata->original_language,
        'image' => "https://image.tmdb.org/t/p/w$imageWidth{$rawMovieMetadata->poster_path}"
    );

    set_transient($transientKey, $result, YEAR_IN_SECONDS);

    return $result;
}
