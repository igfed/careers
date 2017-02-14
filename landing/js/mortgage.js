(function() {
    'use strict';

    var ratePopulation,
    	gui;

    init();

    function init() {
        ratePopulation = new RatePopulationModule();
        gui = new GuiModule();
    }

    //-----

    function GuiModule() {
    	var $reveal = $('.reveal'),
    		$revealContent = $('.reveal-content'),
    		fixedHeight = false;

        init();

        function init() {
		    $('.js-slick-wrap').slick({
			    prevArrow: '<span type="button" class="carousel-prev"><img src="http://investorsgroup.com/external/app/tribal/images/Arrow-MainArticle-Carousel-Green-L.svg"></span>',
			    nextArrow: '<span type="button" class="carousel-next"><img src="http://investorsgroup.com/external/app/tribal/images/Arrow-MainArticle-Carousel-Green-R.svg"></span>',
			    speed: 1200,
			    dots: true,
			    slidesToShow: 1,
			    slidesToScroll: 1,
			    infinite: true
			});

			$('.reveal .reveal-trigger h3').on('click', handleRevealToggle);
			$(window).on('resize', resizeHandler);

			setRevealContentHeight();
        }

        //-----

        function handleRevealToggle() {
			setRevealContentHeight();
			$reveal.toggleClass('active');
			window.setTimeout(setRevealContentHeight);
        }

        function resizeHandler() {
            if (fixedHeight) {
            	$revealContent.css({height: ''});
            }
        }

        function setRevealContentHeight() {
			var finalHeight;

			if ($reveal.hasClass('active')) {
				finalHeight = $revealContent[0].scrollHeight;
				fixedHeight = true;
			} else {
				finalHeight = 0;
				fixedHeight = false;
			}
			$revealContent
				.css({height: finalHeight})
				.attr('aria-hidden', !fixedHeight);
        }
    }

    function RatePopulationModule() {
        var rateDataURL = '/external/data/rates/igadr_prices_rates_mortgage.json',
        	rateParameter = 'dynamic-rate';

       	init();

        function init() {
    		requestRateData();
        }

        //-----

        function requestRateData() {
	        $.ajax ({
		        url: rateDataURL,
		        datatype: "json",
		        success: populateRates
		    });
        }

        function populateRates(data) {
        	$('[' + rateParameter + ']').each(function(i, el) {
        		var $el = $(el),
        			rateID = $el.attr(rateParameter),
        			rate = $.map(data, function(val) {
        				if (val['mortgageProductId'] == rateID) return val;
        			});

        		$el.html(rate[0].mortgageRateVO.mortgageBaseRate + '%').removeAttr(rateParameter);
        	});
        }
    }
})();
