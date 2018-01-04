/* This file is the entry point for rollup (http://rollupjs.org/) and
 essentionally 'bootstraps' our ig.com 'application'.

 All modules should be imported here so that they can be initialized on
 a case-by-case basis (not all pages require the initialization of a carousel
 for instance).

 Any tasks or processes that need to be initiated on page load should live in this
 file as well. An included example is a method that adds an 'en' or 'fr' class to
 the body based on the global language variable that we can then use to write custom
 styles for each language.
 */

// Init Satellite and event object
window._satellite = window._satellite || {};
window._satellite.track = window._satellite.track || function () {};
window.digitalData.event = {};

import forms from './forms.js';
import carousel from './carousel.js';
import careers from './careers.js';
import video from './video.js';
import search from './search.js';
import modal from './modal.js';
import * as ig from './global.js';

const app = (() => {
  function init() {

    // Initialize Foundation
    $(document).foundation();

    // Check for components
    if ($('.ig-form').length) forms.init();
    if ($('.ig-carousel').length) carousel.init();
    if ($('.ig-search').length) search.init();
    if ($('.ig-careers').length) careers.init();
    if ($('.ig-video-group').length) video.init();
    // Following is only for Adobe Analytics
    modal.init();
  }

  return {
    init
  }
})();

// Bootstrap app
$(document).ready(function () {
  app.init();
});