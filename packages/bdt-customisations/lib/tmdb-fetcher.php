<?php
namespace bdt;

function fetchMovieMetaData($title, $year=2012)
{
    $apiKey = TMDB_API_KEY;
    $searchResults = json_decode(wp_remote_get("https://api.themoviedb.org/3/search/movie?year=$year&query=$title&api_key=$apiKey")['body']);
    $id = $searchResults->results[0]->id;

    $rawMovieMetadata = json_decode(wp_remote_get("https://api.themoviedb.org/3/movie/${id}?api_key=$apiKey")['body']);
    
    return array('runtime' => $rawMovieMetadata->runtime);
}
