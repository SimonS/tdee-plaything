<?php
namespace bdt;

function fetchMovie($title, $year=2012)
{
    return wp_remote_get("https://google.com");
}
