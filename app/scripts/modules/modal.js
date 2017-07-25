import * as ig from './global.js';

export default (() => {

	let directCallRule = 'modal_click';

	function init() {
		// $(document).on('click', '.ga-careers-city-search, .ga-careers-learn-more', function () {
		// 	window._satellite = window._satellite || {};
		// 	window._satellite.track = window._satellite.track || function(){};
		// 	_satellite.track(directCallRule);
		// });

    $(document).on('click', '.ga-careers-city-search, .ga-careers-learn-more', function () {
      setTimeout(function() {
        if ($('body.is-reveal-open').length > 0) {
          window._satellite = window._satellite || {};
          window._satellite.track = window._satellite.track || function(){};
          _satellite.track(directCallRule);
        }
      }, 1500);
    });
	}

	return {
		init
	};
})()


