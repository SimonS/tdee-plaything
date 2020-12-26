<?php

/**
 * Plugin Name: BDT Customisations
 * Plugin URI: https://github.com/simons/tdee-plaything/packages/bdt-customisations
 * Description: Little self-rolled plugin to customise my rubbish blog in a non-themey way, requires a TMDB_API_KEY defined in wp-config
 * Version: 1.3.0
 * Author: Simon Scarfe
 * Author URI: https://breakfastdinnertea.co.uk
 * License: GPL
 */

require_once dirname(__FILE__) . '/lib/register-films.php';
require_once dirname(__FILE__) . '/lib/register-weighins.php';

add_filter('acf/settings/remove_wp_meta_box', '__return_false');
