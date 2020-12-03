<?php

/**
 * Plugin Name: BDT Customisations
 * Plugin URI: https://github.com/simons/tdee-plaything/packages/bdt-customisations
 * Description: Little self-rolled plugin to customise my rubbish blog in a non-themey way, requires a TMDB_API_KEY defined in wp-config
 * Version: 1.2.0
 * Author: Simon Scarfe
 * Author URI: https://breakfastdinnertea.co.uk
 * License: GPL
 */

require_once dirname(__FILE__) . '/lib/register-films.php';
require_once dirname(__FILE__) . '/lib/register-weighins.php';
