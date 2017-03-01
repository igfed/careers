(function () {
'use strict';

/* This file is for methods and variables that are going to be
useful across all modules. In order to use them anywhere, import with:

 import * as ig from './global.js';

 and then call with the ig namespace (i.e., ig.pathname, ig.lang, etc)
 */

// url path


// language
var lang = function () {
  if (window.location.pathname.indexOf('/fr/') !== -1) {
    return 'fr';
  } else {
    return 'en';
  }
}();

// browser width


// base eventEmitter
var emitter = new EventEmitter();

var forms = (function () {

  var endpointURL, successURL, cancelURL, $form, $formWrapper;

  function init() {
    // Forms should always be wrapped in '.ig-form'
    $formWrapper = $('.ig-form');
    $form = $formWrapper.find('form');
    endpointURL = $formWrapper.find('form').data('endpoint');
    cancelURL = $formWrapper.find('form').data('cancel');

    _validation();
    _toggler();
  }

  function _validation() {
    // We need to check whether an input is 'dirty' or not (similar to how Angular 1 works) in order for labels to behave properly
    var jInput = $(':input, textarea');
    jInput.change(function (objEvent) {
      $(this).addClass('dirty');
    });

    $.validator.setDefaults({
      debug: true,
      success: 'valid'
    });

    $.validator.addMethod('cdnPostal', function (postal, element) {
      return this.optional(element) || postal.match(/[a-zA-Z][0-9][a-zA-Z](-| |)[0-9][a-zA-Z][0-9]/);
    }, 'Please specify a valid postal code.');

    $form.validate({
      submitHandler: function submitHandler() {
        _process();
      },
      errorPlacement: function errorPlacement(label, element) {
        // Use the custom-error-location marker class to change where the error label shows up
        if (!$(element).closest('.row').find('.custom-error-location').length) {
          $(element).parent().append(label);
        } else {
          $(element).closest('.row').find('.custom-error-location').append(label);
        }
      },
      rules: {
        phone: {
          required: true,
          phoneUS: true
        },
        phone2: {
          required: true,
          phoneUS: true
        },
        postal_code: {
          required: true,
          cdnPostal: true
        },
        firstname: {
          required: true,
          maxlength: 100
        },
        lastname: {
          required: true,
          maxlength: 100
        },
        email: {
          required: true,
          maxlength: 100
        },
        email2: {
          required: true,
          maxlength: 100
        }
      }
    });

    $form.find('button.cancel').on('click', function () {
      window.location.replace(cancelURL);
    });
  }

  function _process(form) {
    var formDataRaw, formDataParsed;

    if ($form.valid()) {
      $form.removeClass('server-error');
      $formWrapper.addClass('submitting');
      formDataRaw = $form.serializeArray();
      // If we need to modify the data, use parse method
      formDataParsed = _parse(formDataRaw);
      // Submit final data
      _submit(formDataParsed);
    }
    return false;
  }

  function _parse(data) {
    // Execute any custom logic here


    return data;
  }

  function _submit(data) {
    $.ajax({
      method: 'POST',
      url: endpointURL,
      data: data
    }).success(function (msg) {
      $formWrapper.addClass('success');
      $formWrapper.removeClass('submitting');
    }).error(function (msg) {
      $form.addClass('server-error');
      $formWrapper.removeClass('submitting');
      ScrollMan.to($('#server-error'));
    });
  }

  function _toggler() {
    // Very simple form toggler
    $('.toggler').on('click', function () {
      $('.toggle-content').hide();
      $('.' + $(this).data('content')).show();
    });
  }

  return {
    init: init
  };
})();

var carousel = (function () {

  function init() {
    console.log('Carousel Initialized!');

    // Not sure what this does at this point or how it relates to Carousels
    $('[data-responsive-toggle] button').on('click', function () {
      $('body').toggleClass('site-header-is-active');
    });

    _buildCarousel();
  }

  function _buildCarousel() {
    var prevArrow, nextArrow, $carousel;

    $('.ig-carousel').each(function (index) {
      $carousel = $(this);
      prevArrow = $carousel.data('prevArrowText') ? '<button type="button" class="slick-prev"><span class="show-for-sr">' + $carousel.data('prevArrowText') + '</span></button>' : '<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>';
      nextArrow = $carousel.data('nextArrowText') ? '<button type="button" class="slick-next"><span class="show-for-sr">' + $carousel.data('nextArrowText') + '</span></button>' : '<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>';

      $carousel.slick({
        adaptiveHeight: $carousel.data('adaptiveHeight') || false,
        arrows: $carousel.data('arrows') || false,
        autoPlay: $carousel.data('autoPlay') || false,
        dots: $carousel.data('dots') || false,
        fade: $carousel.data('fade') || false,
        infinite: $carousel.data('infinite') || false,
        mobileFirst: true,
        nextArrow: nextArrow,
        prevArrow: prevArrow,
        responsive: $carousel.data('responsive') || '',
        slide: $carousel.data('slide') || '',
        slidesToScroll: $carousel.data('slideToScroll') || 1,
        slidesToShow: $carousel.data('slidesToShow') || 1,
        speed: $carousel.data('speed') || 300
      });
    });
  }

  return {
    init: init
  };
})();

var careers = (function () {

  function init() {

    _careersLegacyCode();
  }

  function _careersLegacyCode() {
    (function ($) {

      $.fn.infoToggle = function () {
        this.each(function () {
          var $reveal = $(this),
              $revealContent = $reveal.find('.info-toggle-content'),
              $revealTrigger = $reveal.find('.info-toggle-trigger'),
              fixedHeight = false,
              setAria = $reveal.attr('info-toggle-aria') === 'true';

          initToggle();

          function initToggle() {
            $revealTrigger.on('click', handleRevealToggle);
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
              $revealContent.css({ height: 'auto' });
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
            $revealContent.css({ height: finalHeight });

            if (setAria) {
              $revealContent.attr('aria-hidden', !fixedHeight);
            }
          }
        });

        return this;
      };
    })(jQuery);

    (function ($) {
      'use strict';

      $.fn.circleAnimation = function (maxValue) {
        this.each(function () {
          var canvas = this,
              $canvas = $(this),
              context,
              d = canvas.width / 2,
              percentStroke = 7,
              remainingStroke = 1,
              radius = d - percentStroke,
              curPerc = 0,
              circ = Math.PI * 2,
              quart = Math.PI / 2,
              delegateID = new Date().getTime() + 'CA';

          if (!$canvas.is('canvas')) {
            return;
          }

          context = canvas.getContext('2d');
          context.strokeStyle = '#0d263c';
          context.fillStyle = '#e5e8e8';

          $canvas.attr('circle-animation-id', delegateID);
          $('body').delegate('[circle-animation-id=' + delegateID + ']', 'startAnimate', function () {
            curPerc = 0;
            animate();
          });
          $('body').delegate('[circle-animation-id=' + delegateID + ']', 'clearAnimate', clear);

          function animate(current) {
            current = current ? current : 0;
            clear();
            context.lineWidth = percentStroke;
            context.beginPath();
            context.arc(d, d, radius, -quart, circ * -Math.min(current, maxValue / 100) - quart, true);
            context.stroke();
            context.lineWidth = remainingStroke;
            context.beginPath();
            context.arc(d, d, radius, -quart, circ * -current - quart, true);
            context.stroke();
            curPerc++;
            if (curPerc < 110) {
              window.requestAnimationFrame(function () {
                animate(curPerc / 100);
              });
            }
          }

          function clear() {
            context.fillRect(0, 0, canvas.width, canvas.width);
          }
        });

        return this;
      };
    })(jQuery);

    (function ($) {
      'use strict';

      $.fn.blockLink = function () {
        this.each(function () {
          var $blockLink = $(this),
              destination = $blockLink.find('a').attr('href');
          // destination = '4442.aspx/' + destination;
          initBlock();

          function initBlock() {
            $blockLink.on('click', handleClick);
          }

          //-----

          function handleClick() {
            //event.stopPropagation();
            location = destination;
          }
        });

        return this;
      };
    })(jQuery);

    (function ($) {
      'use strict';

      var gui, video, overlay;

      initLegacy();

      function initLegacy() {
        // This is weird - not going to touch it
        overlay = new OverlayModule();
        gui = new GuiModule(overlay);
        video = new VideoModule();

        // Need to have a class to hook onto for French language page
        if (window.location.pathname.indexOf('/fr/') !== -1) {
          $('body').addClass('fr');
        }

        // Smooth scrolling for anchor links
        $('a[href^="#"]').on('click', function (e) {
          var target = $(this.getAttribute('href'));
          if (target.length) {
            e.preventDefault();
            $('html, body').stop().animate({
              scrollTop: target.offset().top + 52
            }, 750);
          }

          if (target.selector !== "#") {
            $('#main-menu-anchor').css({ 'display': 'none' });
            $('body').removeClass('is-reveal-open branded');
          }
        });

        // Mobile menu needs to mimic Foundation reveal - not enough time to implement different navs in a reveal modal properly
        $('.menu-icon').on('click', function (e) {
          $('body').addClass('is-reveal-open branded');
        });

        // quick and dirty mobile menu closes - not familiar with Foundation pattern to fire these
        $('.top-bar .close-button.show-for-small-only').on('click', function () {
          $('#main-menu-anchor').css({ 'display': 'none' });
          $('body').removeClass('is-reveal-open branded');
        });

        $(window).resize(function () {
          if ($(window).width() > 640) {
            $('body').removeClass('branded');
          }
        });
      }

      //-----

      function GuiModule(overlayReference) {
        var multiTabToggleSelector = '[class*="toggle-"]:not([class*="info-toggle"])',
            multiTabContentSelector = '[class*="content-"]',
            multiTabSelector = '.multi-tab-outline',
            $edgeOverlayLocation = $('#edge-overlay-content'),
            overlay = overlayReference,
            $overlaySlider,
            $profileSlider,
            $profileSliderVideoSectionHolder = $('<div></div>'),
            windowSizingDelay,
            windowScrollingDelay,
            overlayOpen,
            isResponsiveState = false,
            scrolledToView = false;

        initGui();

        function initGui() {
          addMultiTabToggleHandlers();
          $('.block-link').blockLink();
          $overlaySlider = $('.our-business-slider');
          $('#edge-overlay-content').find('.carousel-next').on('click', function (event) {
            event.preventDefault();
            $overlaySlider.slick('slickNext');
          });

          if ($(".video-slide.slick-active").length) {
            $('.slick-list.draggable').css({ height: '660px' });
            $('.section.profiles-slider').css({ backgroundColor: '#e5e8e8' });
          } else {
            $('.slick-list.draggable').css({ height: 'auto' });
            $('.section.profiles-slider').css({ backgroundColor: '#7ec4b9' });
          }

          $('.profile-counter').each(function () {
            var $this = $(this);

            $this.find('canvas').circleAnimation(parseInt($this.find('p').html()));
          });
          $profileSlider = $('.profiles-slider');
          $(window).on('hashchange', handleOverlayFromHash);
          handleOverlayFromHash();
          $(window).on('resize', delayedHandleWindowSizing);
          handleWindowSizing(true);
          $(window).on('scroll', delayedHandleWindowScroll);
          handleWindowScrolling();

          $('.info-toggle').infoToggle();
          $('.top-bar + .screen').on('click', function () {
            $('a[data-toggle]').trigger('click');
          });

          // Not pretty - just adding quick and dirty share link action
          $('.share-toggle-trigger').on('click', function (e) {
            e.preventDefault();
            $('.info-toggle').addClass('active');
          });

          $('.share-toggle-close').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            $('.info-toggle').toggleClass('active');
          });
        }

        //-----

        function addMultiTabToggleHandlers() {
          $('body').delegate(multiTabToggleSelector, 'click', function () {
            var $this = $(this),
                toggleBase = $this.attr('class').match(/toggle-(\S*)?($|\s)/)[1],
                $container = $this.parents(multiTabSelector);

            $container.find(multiTabToggleSelector).removeClass('active');
            $container.find(multiTabContentSelector).removeClass('active');
            $this.addClass('active');
            $container.find('.content-' + toggleBase).addClass('active');
          });
        }

        function animateProfileSlider() {
          var $profilePanels,
              profilePanelHeight = 0;

          if (scrolledToView) {
            $profileSlider.find('.slick-slide').removeClass('slick-complete');
            $profileSlider.find('.slick-active').addClass('slick-complete');
            $profileSlider.find('.slick-slide:not(.slick-complete)').find('.profile-counter canvas').trigger('clearAnimate');
            $profileSlider.find('.slick-complete').find('.profile-counter canvas').trigger('startAnimate');
            if ($profileSlider.find('.slick-active').is('[class*=profile-]') || isResponsiveState) {
              $profileSlider.addClass('contrast-arrow');
            } else {
              $profileSlider.removeClass('contrast-arrow');
            }
            $profilePanels = $profileSlider.find('.profile-1-slide, .profile-2-slide');
            $profilePanels.css({ height: 'auto' });
            $profilePanels.each(function () {
              var current = $(this).outerHeight();

              if (current > profilePanelHeight) {
                profilePanelHeight = current;
              }
            });
            $profilePanels.css({ height: profilePanelHeight });
          }
        }

        function changeSliderState(slider, state) {
          slider.slick("slickSetOption", "accessibility", state);
          slider.slick("slickSetOption", "draggable", state);
          slider.slick("slickSetOption", "swipe", state);
          slider.slick("slickSetOption", "touchMove", state);
        }

        function delayedHandleWindowSizing() {
          if (windowSizingDelay) {
            window.clearTimeout(windowSizingDelay);
          }

          windowSizingDelay = window.setTimeout(handleWindowSizing, 250);
        }

        function delayedHandleWindowScroll() {
          if (windowScrollingDelay) {
            window.clearTimeout(windowScrollingDelay);
          }

          windowScrollingDelay = window.setTimeout(handleWindowScrolling, 250);
        }

        function handleOverlayFromHash(event) {
          var fullHashFragment = '#our-edge-';
          //event.stopPropagation();
          if (!overlayOpen && location.hash.indexOf(fullHashFragment) === 0) {
            overlay.openOverlay($edgeOverlayLocation, handleOverlayOpen, handleOverlayClose, true);
          }
        }

        function handleOverlayOpen(event) {
          var initialIndex;

          initSlider($overlaySlider, {
            dots: false,
            slidesToShow: 1,
            slidesToScroll: 1
          });

          initialIndex = $overlaySlider.find('.' + location.hash.replace('#our-', '') + ':not(.slick-cloned)').attr('data-slick-index');
          $overlaySlider.slick('slickGoTo', initialIndex, true);
          $overlaySlider.on('afterChange', handleSlideChange);
          handleSlideChange(null, null, parseInt($('#modalOverlay .slick-active').attr('data-slick-index')));
          handleWindowSizing();
          overlayOpen = true;
        }

        function handleOverlayClose(event) {
          var yPos,
              overlayContent = $('#modalOverlay > div');

          $overlaySlider.slick('unslick');
          $overlaySlider.off('afterChange');
          $('.overlay-repository').append(overlayContent);
          if ("pushState" in history) history.pushState("", document.title, location.pathname + location.search);else {
            yPos = $(document).scrollTop();
            location.hash = "";
            $(document).scrollTop(yPos);
          }
          overlayOpen = false;
        }

        function handleSlideChange(event, slick, currentSlide) {
          var nextSlide = (currentSlide + 1) % ($('.slick-slide:not(.slick-cloned)').length - 1),
              nextTitle = $($overlaySlider.find('[data-slick-index=' + nextSlide + '] .columns:first-child p').get(0)).html(),
              newHash = 'our-' + $overlaySlider.find('[data-slick-index=' + currentSlide + ']').attr('class').match(/(edge-\S*)/)[1];

          $('#modalOverlay .carousel-next a').html(nextTitle);
          location.hash = newHash;
        }

        function handleWindowSizing(init) {
          var windowWidth = $(window).width(),
              responsiveLimit = 0,
              newIsResponsiveState = windowWidth < responsiveLimit;

          if ($overlaySlider.is('.slick-initialized')) {
            changeSliderState($overlaySlider, !newIsResponsiveState);
          }

          if (isResponsiveState !== newIsResponsiveState) {
            isResponsiveState = newIsResponsiveState;
          } else if (init) {
            initProfileSlider();
          }
        }

        function handleWindowScrolling() {
          if (!scrolledToView) {
            if ($(window).scrollTop() + $(window).height() > $profileSlider.offset().top) {
              scrolledToView = true;
              window.setTimeout(animateProfileSlider, 500);
            }
          }
        }

        function initProfileSlider() {
          initSlider($profileSlider, {
            dots: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            prevArrow: '<span type="button" class="carousel-prev"><img src="images/Arrow-MainArticle-Carousel-Black-L.svg"></span>',
            nextArrow: '<span type="button" class="carousel-next"><img src="images/Arrow-MainArticle-Carousel-Black-R.svg"></span>'
          });
          animateProfileSlider();
          $profileSlider.on('afterChange', animateProfileSlider);
        }

        function initSlider(target, options) {
          var defaults = {
            speed: 750,
            dots: true,
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true,
            responsive: [{
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true
              }
            }]
          };

          target.slick($.extend(defaults, options));
        }
      }

      function OverlayModule() {
        var $overlay,
            $body = $('body'),
            overlaySizingDelay,
            currentInstance = {},
            isOpenFlag = false,
            $closeButton;

        initOverlay();

        return {
          openOverlay: openOverlay,
          isOpen: isOpen
        };

        function initOverlay() {
          $overlay = $('<div></div>');
          $overlay.attr('id', 'modalOverlay');
          $overlay.attr('class', 'reveal');
          $overlay.attr('data-reveal', true);
          $body.append($overlay);
          $overlay.on('open.zf.reveal', handleOverlayOpen);
          $(window).on('closed.zf.reveal', handleOverlayClose);
          $(window).on('resize', delayedHandleOverlaySizing);
          initCloseButton();
          new Foundation.Reveal($overlay);
        }

        //-----

        function delayedHandleOverlaySizing() {
          if (overlaySizingDelay) {
            window.clearTimeout(overlaySizingDelay);
          }

          overlaySizingDelay = window.setTimeout(overlaySizing, 250);
        }

        function handleOverlayClose(event) {
          isOpenFlag = false;
          if (currentInstance.close) {
            currentInstance.close(event);
          }
          overlaySizeCleanup();
          currentInstance = {};
        }

        function handleOverlayOpen(event) {
          event.preventDefault();
          isOpenFlag = true;
          $('body').addClass('is-reveal-open');
          $overlay.find('*').foundation();
          if (currentInstance.open) {
            currentInstance.open(event);
          }
          overlaySizing();
        }

        function initCloseButton() {
          var $innerSpan = $('<span></span>');

          $closeButton = $('<button data-close></button>');
          $closeButton.addClass('close-button');
          $closeButton.attr('aria-label', 'Close modal');
          $innerSpan.attr('aria-hidden', true);
          $innerSpan.html('&times;');
          $closeButton.append($innerSpan);
        }

        function isOpen() {
          return isOpenFlag;
        }

        function openOverlay(urlOrMarkup, openCallback, closeCallback, fullScreen) {
          currentInstance.open = openCallback;
          currentInstance.close = closeCallback;
          currentInstance.full = fullScreen;
          if (typeof urlOrMarkup === 'string') {
            openOverlayWithAjax(urlOrMarkup);
          } else {
            openOverlayWithMarkup(urlOrMarkup);
          }
        }

        function openOverlayWithAjax(url) {
          $.ajax(url).done(openOverlayWithMarkup);
        }

        function openOverlayWithMarkup(markup) {
          $overlay.html(markup);
          $overlay.append($closeButton);
          if (currentInstance.full) {
            $overlay.addClass('full');
          }
          $overlay.foundation('open');
        }

        function overlaySizeCleanup() {
          $overlay.removeClass('full');
          $overlay.removeClass('tour');
          $overlay.html('');
        }

        function overlaySizing() {
          var overlayHeight = $overlay.height(),
              windowHeight = $(window).height();

          if (overlayHeight > windowHeight) {
            $overlay.css({
              top: 0
            });
            $overlay.addClass('full');
          }
        }
      }

      function VideoModule() {
        var player,
            APIModules,
            videoPlayer,
            experienceModule,
            apiInterval,
            templateInterval,
            $resizeWrapper = $('.video-container-responsive'),
            $spinner = $('.video-spinner-container'),
            $placeholder = $('.js-video-play'),
            $playAnchor = $('.js-video-play-btn');

        initVideo();

        function initVideo() {
          if ($(window).width() < 640) {
            mobileVideoLayout();
          }
          window.onTemplateLoad = onTemplateLoad;
          window.onTemplateReady = onTemplateReady;
        }

        function mobileVideoLayout() {
          var i, rnd;
          rnd = Math.floor(Math.random() * 3);
          var $clone = $('.video-wrapper .video-subsection').eq(rnd);
          $('.video-wrapper .video-subsection').remove();
          $('.video-wrapper').append($clone);
        }

        function handleResize() {
          if (player.getModule(APIModules.EXPERIENCE).experience.type === "html") {
            var resizeWidth = $resizeWrapper.innerWidth();
            var resizeHeight = $resizeWrapper.innerHeight();
            player.getModule(APIModules.EXPERIENCE).setSize(resizeWidth, resizeHeight);
          }
        }

        function onTemplateLoad(experienceID) {
          player = brightcove.api.getExperience(experienceID);
          APIModules = brightcove.api.modules.APIModules;
        }

        function onTemplateReady(evt) {
          $spinner.hide();
          $placeholder.show();
          $playAnchor.on('click', playVideo);
          $(window).on('resize', handleResize);

          videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);
          videoPlayer.getCurrentVideo(function (videoData) {
            if (videoData && videoData.id) {
              if (videoData.id === 4219153214001 || videoData.id === 4228888626001) {
                $('.video-container.one span').delay(1500).fadeOut('slow');
              }
              if (videoData.id === 4193078404001 || videoData.id === 4226046989001) {
                $('.video-container.two span').delay(1500).fadeOut('slow');
              }
              if (videoData.id === 4193078348001 || videoData.id === 4219568841001) {
                $('.video-container.three span').delay(1500).fadeOut('slow');
              }
            }
          });
        }

        function playVideo(event) {
          event.preventDefault ? event.preventDefault() : event.returnValue = false;
          $placeholder.hide();
          videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);
          experienceModule = player.getModule(APIModules.EXPERIENCE);
          videoPlayer.play();
        }
      }
    })(jQuery);
  }

  return {
    init: init
  };
})();

var search = (function () {

  function init() {
    _searchLegacyCode();
  }

  function _searchLegacyCode() {

    // GLOBALS
    var modelUrl = 'https://search.investorsgroup.com/api/cwpsearch?';
    var $field = $('#FindAnOffice');
    var lang$$1 = 'en';
    if (window.location.href.indexOf('/fr/') > -1) {
      lang$$1 = 'fr';
    }

    // Process the local prefetched data
    var suggestions = {};
    suggestions.locations = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: 'data/cities.json'
    });

    // Get the results
    function getSearchResults(params) {
      params.searchtype = 'office';
      params.name = '';

      // Make sure error message is hidden each time
      $('.zero-results').addClass('hide');

      $.getJSON(modelUrl, params).always().done(function (data) {
        var result = JSON.parse(data);
        if (result.length) {
          $('body').addClass('is-reveal-open');
          $('#searchResultsModal').removeClass('closed').html('');
          displaySearchResults('office-template', result);
        } else {
          $('.zero-results').removeClass('hide');
        }
      }).fail(function (result) {
        console.log('Data could not be retrieved, please try again', result.status + ' ' + result.statusText);
      });
    }

    // Because we are only searching for cities, this function is slightly redundant - leaving it in place for now
    function parseSearchString() {
      var result = {};
      var search = $field.val();

      result.city = '';

      // Search in the language of the page
      result.lang = lang$$1;
      // We only search consultants from this method
      result.searchtype = 'con';

      // Check the search string for a previously defined location
      var words = search.split(' ');
      for (var i = 0; i < words.length; i++) {
        // Check each word for a city from the predefined list
        var city = suggestions.locations.get(words[i]);
        if (city.length > 0) {
          result.city = city[0];
          words.splice(i, 1);
        }
      }

      if (!result.city) {
        result.city = words.join(' ');
      }

      return result;
    }

    function displaySearchResults(templateID, json) {
      var template = document.getElementById(templateID).innerHTML;
      Mustache.parse(template);
      var rendered = Mustache.render(template, json);
      $('#searchResultsModal').append(rendered);
      $(document).foundation();
    }

    //Init everything
    $(function () {
      // Try to predetermine what results should show
      // Setup the typeahead
      $('.typeahead').typeahead({
        highlight: true
      }, { name: 'locations', source: suggestions.locations, limit: 2 });

      // Setup the form submission
      $('.ig-search').submit(function (e) {
        e.preventDefault();
        var params = parseSearchString();
        getSearchResults(params);
      });

      // Fake modal - Adding handler on document so it fires despite the button not being rendered yet
      $(document).on("click", "#searchResultsModal .close-button", function () {
        $('#searchResultsModal').addClass('closed');
        setTimeout(function () {
          $('body').removeClass('is-reveal-open');
        }, 400);
      });
    });
  }

  return {
    init: init
  };
})();

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

// Event Emitter test modules
// import evt1 from './event-test-1.js';
// import evt2 from './event-test-2.js';

var app = function () {
  function init() {

    // Initialize Foundation
    $(document).foundation();

    // Check for components
    if ($('.ig-form').length) forms.init();
    if ($('.ig-carousel').length) carousel.init();
    if ($('.ig-search').length) search.init();
    if ($('.ig-careers').length) careers.init();

    // Components can also be setup to receive an HTML 'scope' (.ig-evt1... .ig-evt2.... etc)
    // if ($('.ig-evt1').length) evt1.init('.ig-evt1');
    // if ($('.ig-evt2').length) evt2.init('.ig-evt2');

    // Add language class to body
    _language();
  }

  // Let's use a global variable (global as in available to all our components - not the window object!)
  // to add a class to the body tag
  function _language() {
    $('body').addClass(lang);
  }

  return {
    init: init
  };
}();

// Bootstrap app
$(document).ready(function () {
  app.init();
});

}());

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvY2FyZWVycy5qcyIsIm1vZHVsZXMvc2VhcmNoLmpzIiwibW9kdWxlcy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogVGhpcyBmaWxlIGlzIGZvciBtZXRob2RzIGFuZCB2YXJpYWJsZXMgdGhhdCBhcmUgZ29pbmcgdG8gYmVcclxudXNlZnVsIGFjcm9zcyBhbGwgbW9kdWxlcy4gSW4gb3JkZXIgdG8gdXNlIHRoZW0gYW55d2hlcmUsIGltcG9ydCB3aXRoOlxyXG5cclxuIGltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbiBhbmQgdGhlbiBjYWxsIHdpdGggdGhlIGlnIG5hbWVzcGFjZSAoaS5lLiwgaWcucGF0aG5hbWUsIGlnLmxhbmcsIGV0YylcclxuICovXHJcblxyXG4vLyB1cmwgcGF0aFxyXG5leHBvcnQgdmFyIHBhdGhuYW1lID0gKCgpID0+IHtcclxuICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xyXG59KSgpXHJcblxyXG4vLyBsYW5ndWFnZVxyXG5leHBvcnQgdmFyIGxhbmcgPSAoKCkgPT4ge1xyXG4gIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZignL2ZyLycpICE9PSAtMSkge1xyXG4gICAgcmV0dXJuICdmcic7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAnZW4nO1xyXG4gIH1cclxufSkoKVxyXG5cclxuLy8gYnJvd3NlciB3aWR0aFxyXG5leHBvcnQgdmFyIGJyb3dzZXJXaWR0aCA9ICgoKSA9PiB7XHJcbiAgcmV0dXJuIHdpbmRvdy5vdXRlcldpZHRoO1xyXG59KSgpXHJcblxyXG4vLyBiYXNlIGV2ZW50RW1pdHRlclxyXG5leHBvcnQgdmFyIGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cclxuXHJcbiIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIHZhciBlbmRwb2ludFVSTCxcclxuICAgIHN1Y2Nlc3NVUkwsXHJcbiAgICBjYW5jZWxVUkwsXHJcbiAgICAkZm9ybSxcclxuICAgICRmb3JtV3JhcHBlcjtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIC8vIEZvcm1zIHNob3VsZCBhbHdheXMgYmUgd3JhcHBlZCBpbiAnLmlnLWZvcm0nXHJcbiAgICAkZm9ybVdyYXBwZXIgPSAkKCcuaWctZm9ybScpO1xyXG4gICAgJGZvcm0gPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpO1xyXG4gICAgZW5kcG9pbnRVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2VuZHBvaW50Jyk7XHJcbiAgICBjYW5jZWxVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2NhbmNlbCcpO1xyXG5cclxuICAgIF92YWxpZGF0aW9uKCk7XHJcbiAgICBfdG9nZ2xlcigpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdmFsaWRhdGlvbigpIHtcclxuICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgd2hldGhlciBhbiBpbnB1dCBpcyAnZGlydHknIG9yIG5vdCAoc2ltaWxhciB0byBob3cgQW5ndWxhciAxIHdvcmtzKSBpbiBvcmRlciBmb3IgbGFiZWxzIHRvIGJlaGF2ZSBwcm9wZXJseVxyXG4gICAgdmFyIGpJbnB1dCA9ICQoJzppbnB1dCwgdGV4dGFyZWEnKTtcclxuICAgIGpJbnB1dC5jaGFuZ2UoZnVuY3Rpb24gKG9iakV2ZW50KSB7XHJcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2RpcnR5Jyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkLnZhbGlkYXRvci5zZXREZWZhdWx0cyh7XHJcbiAgICAgIGRlYnVnOiB0cnVlLFxyXG4gICAgICBzdWNjZXNzOiAndmFsaWQnXHJcbiAgICB9KTtcclxuXHJcbiAgICAkLnZhbGlkYXRvci5hZGRNZXRob2QoJ2NkblBvc3RhbCcsIGZ1bmN0aW9uIChwb3N0YWwsIGVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoZWxlbWVudCkgfHxcclxuICAgICAgICBwb3N0YWwubWF0Y2goL1thLXpBLVpdWzAtOV1bYS16QS1aXSgtfCB8KVswLTldW2EtekEtWl1bMC05XS8pO1xyXG4gICAgfSwgJ1BsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgcG9zdGFsIGNvZGUuJyk7XHJcblxyXG4gICAgJGZvcm0udmFsaWRhdGUoe1xyXG4gICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgX3Byb2Nlc3MoKTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uIChsYWJlbCwgZWxlbWVudCkge1xyXG4gICAgICAgIC8vIFVzZSB0aGUgY3VzdG9tLWVycm9yLWxvY2F0aW9uIG1hcmtlciBjbGFzcyB0byBjaGFuZ2Ugd2hlcmUgdGhlIGVycm9yIGxhYmVsIHNob3dzIHVwXHJcbiAgICAgICAgaWYgKCEkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLmFwcGVuZChsYWJlbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcnVsZXM6IHtcclxuICAgICAgICBwaG9uZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBwaG9uZVVTOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwaG9uZTI6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdGFsX2NvZGU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgY2RuUG9zdGFsOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaXJzdG5hbWU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxhc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWwyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkZm9ybS5maW5kKCdidXR0b24uY2FuY2VsJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShjYW5jZWxVUkwpO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3Byb2Nlc3MoZm9ybSkge1xyXG4gICAgdmFyIGZvcm1EYXRhUmF3LFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZDtcclxuXHJcbiAgICBpZiAoJGZvcm0udmFsaWQoKSkge1xyXG4gICAgICAkZm9ybS5yZW1vdmVDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5hZGRDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgICBmb3JtRGF0YVJhdyA9ICRmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XHJcbiAgICAgIC8vIElmIHdlIG5lZWQgdG8gbW9kaWZ5IHRoZSBkYXRhLCB1c2UgcGFyc2UgbWV0aG9kXHJcbiAgICAgIGZvcm1EYXRhUGFyc2VkID0gX3BhcnNlKGZvcm1EYXRhUmF3KTtcclxuICAgICAgLy8gU3VibWl0IGZpbmFsIGRhdGFcclxuICAgICAgX3N1Ym1pdChmb3JtRGF0YVBhcnNlZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcGFyc2UoZGF0YSkge1xyXG4gICAgLy8gRXhlY3V0ZSBhbnkgY3VzdG9tIGxvZ2ljIGhlcmVcclxuXHJcblxyXG4gICAgcmV0dXJuIGRhdGFcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zdWJtaXQoZGF0YSkge1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIHVybDogZW5kcG9pbnRVUkwsXHJcbiAgICAgIGRhdGE6IGRhdGFcclxuICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICB9KVxyXG4gICAgICAuZXJyb3IoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICRmb3JtLmFkZENsYXNzKCdzZXJ2ZXItZXJyb3InKTtcclxuICAgICAgICAkZm9ybVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgICBTY3JvbGxNYW4udG8oJCgnI3NlcnZlci1lcnJvcicpKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdG9nZ2xlcigpIHtcclxuICAgIC8vIFZlcnkgc2ltcGxlIGZvcm0gdG9nZ2xlclxyXG4gICAgJCgnLnRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQoJy50b2dnbGUtY29udGVudCcpLmhpZGUoKTtcclxuICAgICAgJCgnLicgKyAkKHRoaXMpLmRhdGEoJ2NvbnRlbnQnKSkuc2hvdygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgY29uc29sZS5sb2coJ0Nhcm91c2VsIEluaXRpYWxpemVkIScpXHJcblxyXG4gICAgLy8gTm90IHN1cmUgd2hhdCB0aGlzIGRvZXMgYXQgdGhpcyBwb2ludCBvciBob3cgaXQgcmVsYXRlcyB0byBDYXJvdXNlbHNcclxuICAgICQoJ1tkYXRhLXJlc3BvbnNpdmUtdG9nZ2xlXSBidXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnc2l0ZS1oZWFkZXItaXMtYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBfYnVpbGRDYXJvdXNlbCgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2J1aWxkQ2Fyb3VzZWwoKSB7XHJcbiAgICB2YXIgcHJldkFycm93LFxyXG4gICAgICBuZXh0QXJyb3csXHJcbiAgICAgICRjYXJvdXNlbDtcclxuXHJcbiAgICAkKCcuaWctY2Fyb3VzZWwnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xyXG4gICAgICBwcmV2QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5QcmV2aW91czwvc3Bhbj48L2J1dHRvbj4nO1xyXG4gICAgICBuZXh0QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5OZXh0PC9zcGFuPjwvYnV0dG9uPic7XHJcblxyXG4gICAgICAkY2Fyb3VzZWwuc2xpY2soe1xyXG4gICAgICAgIGFkYXB0aXZlSGVpZ2h0OiAkY2Fyb3VzZWwuZGF0YSgnYWRhcHRpdmVIZWlnaHQnKSB8fCBmYWxzZSxcclxuICAgICAgICBhcnJvd3M6ICRjYXJvdXNlbC5kYXRhKCdhcnJvd3MnKSB8fCBmYWxzZSxcclxuICAgICAgICBhdXRvUGxheTogJGNhcm91c2VsLmRhdGEoJ2F1dG9QbGF5JykgfHwgZmFsc2UsXHJcbiAgICAgICAgZG90czogJGNhcm91c2VsLmRhdGEoJ2RvdHMnKSB8fCBmYWxzZSxcclxuICAgICAgICBmYWRlOiAkY2Fyb3VzZWwuZGF0YSgnZmFkZScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGluZmluaXRlOiAkY2Fyb3VzZWwuZGF0YSgnaW5maW5pdGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcclxuICAgICAgICBuZXh0QXJyb3c6IG5leHRBcnJvdyxcclxuICAgICAgICBwcmV2QXJyb3c6IHByZXZBcnJvdyxcclxuICAgICAgICByZXNwb25zaXZlOiAkY2Fyb3VzZWwuZGF0YSgncmVzcG9uc2l2ZScpIHx8ICcnLFxyXG4gICAgICAgIHNsaWRlOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogJGNhcm91c2VsLmRhdGEoJ3NsaWRlVG9TY3JvbGwnKSB8fCAxLFxyXG4gICAgICAgIHNsaWRlc1RvU2hvdzogJGNhcm91c2VsLmRhdGEoJ3NsaWRlc1RvU2hvdycpIHx8IDEsXHJcbiAgICAgICAgc3BlZWQ6ICRjYXJvdXNlbC5kYXRhKCdzcGVlZCcpIHx8IDMwMCxcclxuICAgICAgfSlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICBfY2FyZWVyc0xlZ2FjeUNvZGUoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9jYXJlZXJzTGVnYWN5Q29kZSgpIHtcclxuICAgIChmdW5jdGlvbiAoJCkge1xyXG5cclxuICAgICAgJC5mbi5pbmZvVG9nZ2xlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB2YXIgJHJldmVhbCA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICRyZXZlYWxDb250ZW50ID0gJHJldmVhbC5maW5kKCcuaW5mby10b2dnbGUtY29udGVudCcpLFxyXG4gICAgICAgICAgICAkcmV2ZWFsVHJpZ2dlciA9ICRyZXZlYWwuZmluZCgnLmluZm8tdG9nZ2xlLXRyaWdnZXInKSxcclxuICAgICAgICAgICAgZml4ZWRIZWlnaHQgPSBmYWxzZSxcclxuICAgICAgICAgICAgc2V0QXJpYSA9ICRyZXZlYWwuYXR0cignaW5mby10b2dnbGUtYXJpYScpID09PSAndHJ1ZSc7XHJcblxyXG4gICAgICAgICAgaW5pdFRvZ2dsZSgpO1xyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIGluaXRUb2dnbGUoKSB7XHJcbiAgICAgICAgICAgICRyZXZlYWxUcmlnZ2VyLm9uKCdjbGljaycsIGhhbmRsZVJldmVhbFRvZ2dsZSk7XHJcbiAgICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgcmVzaXplSGFuZGxlcik7XHJcblxyXG4gICAgICAgICAgICBzZXRSZXZlYWxDb250ZW50SGVpZ2h0KCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZVJldmVhbFRvZ2dsZSgpIHtcclxuICAgICAgICAgICAgc2V0UmV2ZWFsQ29udGVudEhlaWdodCgpO1xyXG4gICAgICAgICAgICAkcmV2ZWFsLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoc2V0UmV2ZWFsQ29udGVudEhlaWdodCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gcmVzaXplSGFuZGxlcigpIHtcclxuICAgICAgICAgICAgaWYgKGZpeGVkSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgJHJldmVhbENvbnRlbnQuY3NzKHsgaGVpZ2h0OiAnYXV0bycgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBzZXRSZXZlYWxDb250ZW50SGVpZ2h0KCkge1xyXG4gICAgICAgICAgICB2YXIgZmluYWxIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoJHJldmVhbC5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICBmaW5hbEhlaWdodCA9ICRyZXZlYWxDb250ZW50WzBdLnNjcm9sbEhlaWdodDtcclxuICAgICAgICAgICAgICBmaXhlZEhlaWdodCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgZmluYWxIZWlnaHQgPSAwO1xyXG4gICAgICAgICAgICAgIGZpeGVkSGVpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHJldmVhbENvbnRlbnQuY3NzKHsgaGVpZ2h0OiBmaW5hbEhlaWdodCB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZXRBcmlhKSB7XHJcbiAgICAgICAgICAgICAgJHJldmVhbENvbnRlbnQuYXR0cignYXJpYS1oaWRkZW4nLCAhZml4ZWRIZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICB9O1xyXG5cclxuICAgIH0pKGpRdWVyeSk7XHJcblxyXG5cclxuICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAkLmZuLmNpcmNsZUFuaW1hdGlvbiA9IGZ1bmN0aW9uIChtYXhWYWx1ZSkge1xyXG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB2YXIgY2FudmFzID0gdGhpcyxcclxuICAgICAgICAgICAgJGNhbnZhcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgIGNvbnRleHQsXHJcbiAgICAgICAgICAgIGQgPSBjYW52YXMud2lkdGggLyAyLFxyXG4gICAgICAgICAgICBwZXJjZW50U3Ryb2tlID0gNyxcclxuICAgICAgICAgICAgcmVtYWluaW5nU3Ryb2tlID0gMSxcclxuICAgICAgICAgICAgcmFkaXVzID0gZCAtIHBlcmNlbnRTdHJva2UsXHJcbiAgICAgICAgICAgIGN1clBlcmMgPSAwLFxyXG4gICAgICAgICAgICBjaXJjID0gTWF0aC5QSSAqIDIsXHJcbiAgICAgICAgICAgIHF1YXJ0ID0gTWF0aC5QSSAvIDIsXHJcbiAgICAgICAgICAgIGRlbGVnYXRlSUQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArICdDQSc7XHJcblxyXG4gICAgICAgICAgaWYgKCEkY2FudmFzLmlzKCdjYW52YXMnKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICcjMGQyNjNjJztcclxuICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyNlNWU4ZTgnO1xyXG5cclxuICAgICAgICAgICRjYW52YXMuYXR0cignY2lyY2xlLWFuaW1hdGlvbi1pZCcsIGRlbGVnYXRlSUQpO1xyXG4gICAgICAgICAgJCgnYm9keScpLmRlbGVnYXRlKCdbY2lyY2xlLWFuaW1hdGlvbi1pZD0nICsgZGVsZWdhdGVJRCArICddJywgJ3N0YXJ0QW5pbWF0ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY3VyUGVyYyA9IDA7XHJcbiAgICAgICAgICAgIGFuaW1hdGUoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgJCgnYm9keScpLmRlbGVnYXRlKCdbY2lyY2xlLWFuaW1hdGlvbi1pZD0nICsgZGVsZWdhdGVJRCArICddJywgJ2NsZWFyQW5pbWF0ZScsIGNsZWFyKTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBhbmltYXRlKGN1cnJlbnQpIHtcclxuICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQgPyBjdXJyZW50IDogMDtcclxuICAgICAgICAgICAgY2xlYXIoKTtcclxuICAgICAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSBwZXJjZW50U3Ryb2tlO1xyXG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmFyYyhkLCBkLCByYWRpdXMsIC0ocXVhcnQpLCAoKGNpcmMpICogLU1hdGgubWluKGN1cnJlbnQsIG1heFZhbHVlIC8gMTAwKSkgLSBxdWFydCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gcmVtYWluaW5nU3Ryb2tlO1xyXG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmFyYyhkLCBkLCByYWRpdXMsIC0ocXVhcnQpLCAoKGNpcmMpICogLWN1cnJlbnQpIC0gcXVhcnQsIHRydWUpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjdXJQZXJjKys7XHJcbiAgICAgICAgICAgIGlmIChjdXJQZXJjIDwgMTEwKSB7XHJcbiAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRlKGN1clBlcmMgLyAxMDApXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy53aWR0aCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICB9O1xyXG5cclxuICAgIH0pKGpRdWVyeSk7XHJcblxyXG4gICAgKGZ1bmN0aW9uICgkKSB7XHJcbiAgICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAgICQuZm4uYmxvY2tMaW5rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB2YXIgJGJsb2NrTGluayA9ICQodGhpcyksXHJcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uID0gJGJsb2NrTGluay5maW5kKCdhJykuYXR0cignaHJlZicpO1xyXG4gICAgICAgICAgLy8gZGVzdGluYXRpb24gPSAnNDQ0Mi5hc3B4LycgKyBkZXN0aW5hdGlvbjtcclxuICAgICAgICAgIGluaXRCbG9jaygpO1xyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIGluaXRCbG9jaygpIHtcclxuICAgICAgICAgICAgJGJsb2NrTGluay5vbignY2xpY2snLCBoYW5kbGVDbGljayk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKCkge1xyXG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsb2NhdGlvbiA9IGRlc3RpbmF0aW9uO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfTtcclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICB2YXIgZ3VpLFxyXG4gICAgICAgIHZpZGVvLFxyXG4gICAgICAgIG92ZXJsYXk7XHJcblxyXG4gICAgICBpbml0TGVnYWN5KCk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBpbml0TGVnYWN5KCkge1xyXG4gICAgICAgIC8vIFRoaXMgaXMgd2VpcmQgLSBub3QgZ29pbmcgdG8gdG91Y2ggaXRcclxuICAgICAgICBvdmVybGF5ID0gbmV3IE92ZXJsYXlNb2R1bGUoKTtcclxuICAgICAgICBndWkgPSBuZXcgR3VpTW9kdWxlKG92ZXJsYXkpO1xyXG4gICAgICAgIHZpZGVvID0gbmV3IFZpZGVvTW9kdWxlKCk7XHJcblxyXG4gICAgICAgIC8vIE5lZWQgdG8gaGF2ZSBhIGNsYXNzIHRvIGhvb2sgb250byBmb3IgRnJlbmNoIGxhbmd1YWdlIHBhZ2VcclxuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnZnInKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNtb290aCBzY3JvbGxpbmcgZm9yIGFuY2hvciBsaW5rc1xyXG4gICAgICAgICQoJ2FbaHJlZl49XCIjXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xyXG4gICAgICAgICAgaWYgKHRhcmdldC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgIHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcCArIDUyXHJcbiAgICAgICAgICAgIH0sIDc1MCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRhcmdldC5zZWxlY3RvciAhPT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgJCgnI21haW4tbWVudS1hbmNob3InKS5jc3MoeyAnZGlzcGxheSc6ICdub25lJyB9KTtcclxuICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdpcy1yZXZlYWwtb3BlbiBicmFuZGVkJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIE1vYmlsZSBtZW51IG5lZWRzIHRvIG1pbWljIEZvdW5kYXRpb24gcmV2ZWFsIC0gbm90IGVub3VnaCB0aW1lIHRvIGltcGxlbWVudCBkaWZmZXJlbnQgbmF2cyBpbiBhIHJldmVhbCBtb2RhbCBwcm9wZXJseVxyXG4gICAgICAgICQoJy5tZW51LWljb24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdpcy1yZXZlYWwtb3BlbiBicmFuZGVkJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHF1aWNrIGFuZCBkaXJ0eSBtb2JpbGUgbWVudSBjbG9zZXMgLSBub3QgZmFtaWxpYXIgd2l0aCBGb3VuZGF0aW9uIHBhdHRlcm4gdG8gZmlyZSB0aGVzZVxyXG4gICAgICAgICQoJy50b3AtYmFyIC5jbG9zZS1idXR0b24uc2hvdy1mb3Itc21hbGwtb25seScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQoJyNtYWluLW1lbnUtYW5jaG9yJykuY3NzKHsgJ2Rpc3BsYXknOiAnbm9uZScgfSk7XHJcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2lzLXJldmVhbC1vcGVuIGJyYW5kZWQnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA2NDApIHtcclxuICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdicmFuZGVkJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIEd1aU1vZHVsZShvdmVybGF5UmVmZXJlbmNlKSB7XHJcbiAgICAgICAgdmFyIG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IgPSAnW2NsYXNzKj1cInRvZ2dsZS1cIl06bm90KFtjbGFzcyo9XCJpbmZvLXRvZ2dsZVwiXSknLFxyXG4gICAgICAgICAgbXVsdGlUYWJDb250ZW50U2VsZWN0b3IgPSAnW2NsYXNzKj1cImNvbnRlbnQtXCJdJyxcclxuICAgICAgICAgIG11bHRpVGFiU2VsZWN0b3IgPSAnLm11bHRpLXRhYi1vdXRsaW5lJyxcclxuICAgICAgICAgICRlZGdlT3ZlcmxheUxvY2F0aW9uID0gJCgnI2VkZ2Utb3ZlcmxheS1jb250ZW50JyksXHJcbiAgICAgICAgICBvdmVybGF5ID0gb3ZlcmxheVJlZmVyZW5jZSxcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLFxyXG4gICAgICAgICAgJHByb2ZpbGVTbGlkZXIsXHJcbiAgICAgICAgICAkcHJvZmlsZVNsaWRlclZpZGVvU2VjdGlvbkhvbGRlciA9ICQoJzxkaXY+PC9kaXY+JyksXHJcbiAgICAgICAgICB3aW5kb3dTaXppbmdEZWxheSxcclxuICAgICAgICAgIHdpbmRvd1Njcm9sbGluZ0RlbGF5LFxyXG4gICAgICAgICAgb3ZlcmxheU9wZW4sXHJcbiAgICAgICAgICBpc1Jlc3BvbnNpdmVTdGF0ZSA9IGZhbHNlLFxyXG4gICAgICAgICAgc2Nyb2xsZWRUb1ZpZXcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaW5pdEd1aSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0R3VpKCkge1xyXG4gICAgICAgICAgYWRkTXVsdGlUYWJUb2dnbGVIYW5kbGVycygpO1xyXG4gICAgICAgICAgJCgnLmJsb2NrLWxpbmsnKS5ibG9ja0xpbmsoKTtcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyID0gJCgnLm91ci1idXNpbmVzcy1zbGlkZXInKTtcclxuICAgICAgICAgICQoJyNlZGdlLW92ZXJsYXktY29udGVudCcpLmZpbmQoJy5jYXJvdXNlbC1uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCdzbGlja05leHQnKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGlmICgkKFwiLnZpZGVvLXNsaWRlLnNsaWNrLWFjdGl2ZVwiKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJCgnLnNsaWNrLWxpc3QuZHJhZ2dhYmxlJykuY3NzKHsgaGVpZ2h0OiAnNjYwcHgnIH0pO1xyXG4gICAgICAgICAgICAkKCcuc2VjdGlvbi5wcm9maWxlcy1zbGlkZXInKS5jc3MoeyBiYWNrZ3JvdW5kQ29sb3I6ICcjZTVlOGU4JyB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy5zbGljay1saXN0LmRyYWdnYWJsZScpLmNzcyh7IGhlaWdodDogJ2F1dG8nIH0pO1xyXG4gICAgICAgICAgICAkKCcuc2VjdGlvbi5wcm9maWxlcy1zbGlkZXInKS5jc3MoeyBiYWNrZ3JvdW5kQ29sb3I6ICcjN2VjNGI5JyB9KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAkKCcucHJvZmlsZS1jb3VudGVyJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAkdGhpcy5maW5kKCdjYW52YXMnKS5jaXJjbGVBbmltYXRpb24ocGFyc2VJbnQoJHRoaXMuZmluZCgncCcpLmh0bWwoKSkpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICAkcHJvZmlsZVNsaWRlciA9ICQoJy5wcm9maWxlcy1zbGlkZXInKTtcclxuICAgICAgICAgICQod2luZG93KS5vbignaGFzaGNoYW5nZScsIGhhbmRsZU92ZXJsYXlGcm9tSGFzaCk7XHJcbiAgICAgICAgICBoYW5kbGVPdmVybGF5RnJvbUhhc2goKTtcclxuICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZGVsYXllZEhhbmRsZVdpbmRvd1NpemluZyk7XHJcbiAgICAgICAgICBoYW5kbGVXaW5kb3dTaXppbmcodHJ1ZSk7XHJcbiAgICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGRlbGF5ZWRIYW5kbGVXaW5kb3dTY3JvbGwpO1xyXG4gICAgICAgICAgaGFuZGxlV2luZG93U2Nyb2xsaW5nKCk7XHJcblxyXG4gICAgICAgICAgJCgnLmluZm8tdG9nZ2xlJykuaW5mb1RvZ2dsZSgpO1xyXG4gICAgICAgICAgJCgnLnRvcC1iYXIgKyAuc2NyZWVuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCdhW2RhdGEtdG9nZ2xlXScpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAvLyBOb3QgcHJldHR5IC0ganVzdCBhZGRpbmcgcXVpY2sgYW5kIGRpcnR5IHNoYXJlIGxpbmsgYWN0aW9uXHJcbiAgICAgICAgICAkKCcuc2hhcmUtdG9nZ2xlLXRyaWdnZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJy5pbmZvLXRvZ2dsZScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICQoJy5zaGFyZS10b2dnbGUtY2xvc2UnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJy5pbmZvLXRvZ2dsZScpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRNdWx0aVRhYlRvZ2dsZUhhbmRsZXJzKCkge1xyXG4gICAgICAgICAgJCgnYm9keScpLmRlbGVnYXRlKG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICB0b2dnbGVCYXNlID0gJHRoaXMuYXR0cignY2xhc3MnKS5tYXRjaCgvdG9nZ2xlLShcXFMqKT8oJHxcXHMpLylbMV0sXHJcbiAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICR0aGlzLnBhcmVudHMobXVsdGlUYWJTZWxlY3Rvcik7XHJcblxyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQobXVsdGlUYWJUb2dnbGVTZWxlY3RvcikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQobXVsdGlUYWJDb250ZW50U2VsZWN0b3IpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQoJy5jb250ZW50LScgKyB0b2dnbGVCYXNlKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZVByb2ZpbGVTbGlkZXIoKSB7XHJcbiAgICAgICAgICB2YXIgJHByb2ZpbGVQYW5lbHMsXHJcbiAgICAgICAgICAgIHByb2ZpbGVQYW5lbEhlaWdodCA9IDA7XHJcblxyXG4gICAgICAgICAgaWYgKHNjcm9sbGVkVG9WaWV3KSB7XHJcbiAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLmZpbmQoJy5zbGljay1zbGlkZScpLnJlbW92ZUNsYXNzKCdzbGljay1jb21wbGV0ZScpO1xyXG4gICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5maW5kKCcuc2xpY2stYWN0aXZlJykuYWRkQ2xhc3MoJ3NsaWNrLWNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgICRwcm9maWxlU2xpZGVyXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5zbGljay1zbGlkZTpub3QoLnNsaWNrLWNvbXBsZXRlKScpXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5wcm9maWxlLWNvdW50ZXIgY2FudmFzJylcclxuICAgICAgICAgICAgICAudHJpZ2dlcignY2xlYXJBbmltYXRlJyk7XHJcbiAgICAgICAgICAgICRwcm9maWxlU2xpZGVyXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5zbGljay1jb21wbGV0ZScpXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5wcm9maWxlLWNvdW50ZXIgY2FudmFzJylcclxuICAgICAgICAgICAgICAudHJpZ2dlcignc3RhcnRBbmltYXRlJyk7XHJcbiAgICAgICAgICAgIGlmICgkcHJvZmlsZVNsaWRlci5maW5kKCcuc2xpY2stYWN0aXZlJykuaXMoJ1tjbGFzcyo9cHJvZmlsZS1dJykgfHwgaXNSZXNwb25zaXZlU3RhdGUpIHtcclxuICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5hZGRDbGFzcygnY29udHJhc3QtYXJyb3cnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5yZW1vdmVDbGFzcygnY29udHJhc3QtYXJyb3cnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkcHJvZmlsZVBhbmVscyA9ICRwcm9maWxlU2xpZGVyLmZpbmQoJy5wcm9maWxlLTEtc2xpZGUsIC5wcm9maWxlLTItc2xpZGUnKTtcclxuICAgICAgICAgICAgJHByb2ZpbGVQYW5lbHMuY3NzKHsgaGVpZ2h0OiAnYXV0bycgfSk7XHJcbiAgICAgICAgICAgICRwcm9maWxlUGFuZWxzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gJCh0aGlzKS5vdXRlckhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgICBpZiAoY3VycmVudCA+IHByb2ZpbGVQYW5lbEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgcHJvZmlsZVBhbmVsSGVpZ2h0ID0gY3VycmVudDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkcHJvZmlsZVBhbmVscy5jc3MoeyBoZWlnaHQ6IHByb2ZpbGVQYW5lbEhlaWdodCB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZVNsaWRlclN0YXRlKHNsaWRlciwgc3RhdGUpIHtcclxuICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwiYWNjZXNzaWJpbGl0eVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcImRyYWdnYWJsZVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcInN3aXBlXCIsIHN0YXRlKTtcclxuICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwidG91Y2hNb3ZlXCIsIHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWRIYW5kbGVXaW5kb3dTaXppbmcoKSB7XHJcbiAgICAgICAgICBpZiAod2luZG93U2l6aW5nRGVsYXkpIHtcclxuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh3aW5kb3dTaXppbmdEZWxheSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgd2luZG93U2l6aW5nRGVsYXkgPSB3aW5kb3cuc2V0VGltZW91dChoYW5kbGVXaW5kb3dTaXppbmcsIDI1MCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZWxheWVkSGFuZGxlV2luZG93U2Nyb2xsKCkge1xyXG4gICAgICAgICAgaWYgKHdpbmRvd1Njcm9sbGluZ0RlbGF5KSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQod2luZG93U2Nyb2xsaW5nRGVsYXkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHdpbmRvd1Njcm9sbGluZ0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQoaGFuZGxlV2luZG93U2Nyb2xsaW5nLCAyNTApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUZyb21IYXNoKGV2ZW50KSB7XHJcbiAgICAgICAgICB2YXIgZnVsbEhhc2hGcmFnbWVudCA9ICcjb3VyLWVkZ2UtJztcclxuICAgICAgICAgIC8vZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBpZiAoIW92ZXJsYXlPcGVuICYmIGxvY2F0aW9uLmhhc2guaW5kZXhPZihmdWxsSGFzaEZyYWdtZW50KSA9PT0gMCkge1xyXG4gICAgICAgICAgICBvdmVybGF5Lm9wZW5PdmVybGF5KFxyXG4gICAgICAgICAgICAgICRlZGdlT3ZlcmxheUxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgIGhhbmRsZU92ZXJsYXlPcGVuLCBoYW5kbGVPdmVybGF5Q2xvc2UsIHRydWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheU9wZW4oZXZlbnQpIHtcclxuICAgICAgICAgIHZhciBpbml0aWFsSW5kZXg7XHJcblxyXG4gICAgICAgICAgaW5pdFNsaWRlcigkb3ZlcmxheVNsaWRlciwge1xyXG4gICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgaW5pdGlhbEluZGV4ID0gJG92ZXJsYXlTbGlkZXJcclxuICAgICAgICAgICAgLmZpbmQoJy4nICsgbG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjb3VyLScsICcnKSArICc6bm90KC5zbGljay1jbG9uZWQpJylcclxuICAgICAgICAgICAgLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnKTtcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCdzbGlja0dvVG8nLCBpbml0aWFsSW5kZXgsIHRydWUpO1xyXG4gICAgICAgICAgJG92ZXJsYXlTbGlkZXIub24oJ2FmdGVyQ2hhbmdlJywgaGFuZGxlU2xpZGVDaGFuZ2UpO1xyXG4gICAgICAgICAgaGFuZGxlU2xpZGVDaGFuZ2UobnVsbCwgbnVsbCwgcGFyc2VJbnQoJCgnI21vZGFsT3ZlcmxheSAuc2xpY2stYWN0aXZlJykuYXR0cignZGF0YS1zbGljay1pbmRleCcpKSk7XHJcbiAgICAgICAgICBoYW5kbGVXaW5kb3dTaXppbmcoKTtcclxuICAgICAgICAgIG92ZXJsYXlPcGVuID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlDbG9zZShldmVudCkge1xyXG4gICAgICAgICAgdmFyIHlQb3MsXHJcbiAgICAgICAgICAgIG92ZXJsYXlDb250ZW50ID0gJCgnI21vZGFsT3ZlcmxheSA+IGRpdicpO1xyXG5cclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCd1bnNsaWNrJyk7XHJcbiAgICAgICAgICAkb3ZlcmxheVNsaWRlci5vZmYoJ2FmdGVyQ2hhbmdlJyk7XHJcbiAgICAgICAgICAkKCcub3ZlcmxheS1yZXBvc2l0b3J5JykuYXBwZW5kKG92ZXJsYXlDb250ZW50KTtcclxuICAgICAgICAgIGlmIChcInB1c2hTdGF0ZVwiIGluIGhpc3RvcnkpXHJcbiAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKFwiXCIsIGRvY3VtZW50LnRpdGxlLCBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCk7XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgeVBvcyA9ICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gXCJcIjtcclxuICAgICAgICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKHlQb3MpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3ZlcmxheU9wZW4gPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVNsaWRlQ2hhbmdlKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlKSB7XHJcbiAgICAgICAgICB2YXIgbmV4dFNsaWRlID0gKGN1cnJlbnRTbGlkZSArIDEpICUgKCQoJy5zbGljay1zbGlkZTpub3QoLnNsaWNrLWNsb25lZCknKS5sZW5ndGggLSAxKSxcclxuICAgICAgICAgICAgbmV4dFRpdGxlID0gJCgkb3ZlcmxheVNsaWRlci5maW5kKCdbZGF0YS1zbGljay1pbmRleD0nICsgbmV4dFNsaWRlICsgJ10gLmNvbHVtbnM6Zmlyc3QtY2hpbGQgcCcpLmdldCgwKSkuaHRtbCgpLFxyXG4gICAgICAgICAgICBuZXdIYXNoID0gJ291ci0nICsgJG92ZXJsYXlTbGlkZXJcclxuICAgICAgICAgICAgICAgIC5maW5kKCdbZGF0YS1zbGljay1pbmRleD0nICsgY3VycmVudFNsaWRlICsgJ10nKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJylcclxuICAgICAgICAgICAgICAgIC5tYXRjaCgvKGVkZ2UtXFxTKikvKVsxXTtcclxuXHJcbiAgICAgICAgICAkKCcjbW9kYWxPdmVybGF5IC5jYXJvdXNlbC1uZXh0IGEnKS5odG1sKG5leHRUaXRsZSk7XHJcbiAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gbmV3SGFzaDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVdpbmRvd1NpemluZyhpbml0KSB7XHJcbiAgICAgICAgICB2YXIgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZUxpbWl0ID0gMCxcclxuICAgICAgICAgICAgbmV3SXNSZXNwb25zaXZlU3RhdGUgPSB3aW5kb3dXaWR0aCA8IHJlc3BvbnNpdmVMaW1pdDtcclxuXHJcbiAgICAgICAgICBpZiAoJG92ZXJsYXlTbGlkZXIuaXMoJy5zbGljay1pbml0aWFsaXplZCcpKSB7XHJcbiAgICAgICAgICAgIGNoYW5nZVNsaWRlclN0YXRlKCRvdmVybGF5U2xpZGVyLCAhbmV3SXNSZXNwb25zaXZlU3RhdGUpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChpc1Jlc3BvbnNpdmVTdGF0ZSAhPT0gbmV3SXNSZXNwb25zaXZlU3RhdGUpIHtcclxuICAgICAgICAgICAgaXNSZXNwb25zaXZlU3RhdGUgPSBuZXdJc1Jlc3BvbnNpdmVTdGF0ZTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoaW5pdCkge1xyXG4gICAgICAgICAgICBpbml0UHJvZmlsZVNsaWRlcigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlV2luZG93U2Nyb2xsaW5nKCkge1xyXG4gICAgICAgICAgaWYgKCFzY3JvbGxlZFRvVmlldykge1xyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpID4gJHByb2ZpbGVTbGlkZXIub2Zmc2V0KCkudG9wKSB7XHJcbiAgICAgICAgICAgICAgc2Nyb2xsZWRUb1ZpZXcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGFuaW1hdGVQcm9maWxlU2xpZGVyLCA1MDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0UHJvZmlsZVNsaWRlcigpIHtcclxuICAgICAgICAgIGluaXRTbGlkZXIoJHByb2ZpbGVTbGlkZXIsIHtcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6IHRydWUsXHJcbiAgICAgICAgICAgIHByZXZBcnJvdzogJzxzcGFuIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNhcm91c2VsLXByZXZcIj48aW1nIHNyYz1cImltYWdlcy9BcnJvdy1NYWluQXJ0aWNsZS1DYXJvdXNlbC1CbGFjay1MLnN2Z1wiPjwvc3Bhbj4nLFxyXG4gICAgICAgICAgICBuZXh0QXJyb3c6ICc8c3BhbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjYXJvdXNlbC1uZXh0XCI+PGltZyBzcmM9XCJpbWFnZXMvQXJyb3ctTWFpbkFydGljbGUtQ2Fyb3VzZWwtQmxhY2stUi5zdmdcIj48L3NwYW4+J1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBhbmltYXRlUHJvZmlsZVNsaWRlcigpO1xyXG4gICAgICAgICAgJHByb2ZpbGVTbGlkZXIub24oJ2FmdGVyQ2hhbmdlJywgYW5pbWF0ZVByb2ZpbGVTbGlkZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdFNsaWRlcih0YXJnZXQsIG9wdGlvbnMpIHtcclxuICAgICAgICAgIHZhciBkZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgc3BlZWQ6IDc1MCxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAyLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMixcclxuICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjgsXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICB0YXJnZXQuc2xpY2soJC5leHRlbmQoZGVmYXVsdHMsIG9wdGlvbnMpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIE92ZXJsYXlNb2R1bGUoKSB7XHJcbiAgICAgICAgdmFyICRvdmVybGF5LFxyXG4gICAgICAgICAgJGJvZHkgPSAkKCdib2R5JyksXHJcbiAgICAgICAgICBvdmVybGF5U2l6aW5nRGVsYXksXHJcbiAgICAgICAgICBjdXJyZW50SW5zdGFuY2UgPSB7fSxcclxuICAgICAgICAgIGlzT3BlbkZsYWcgPSBmYWxzZSxcclxuICAgICAgICAgICRjbG9zZUJ1dHRvbjtcclxuXHJcbiAgICAgICAgaW5pdE92ZXJsYXkoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIG9wZW5PdmVybGF5OiBvcGVuT3ZlcmxheSxcclxuICAgICAgICAgIGlzT3BlbjogaXNPcGVuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdE92ZXJsYXkoKSB7XHJcbiAgICAgICAgICAkb3ZlcmxheSA9ICQoJzxkaXY+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5hdHRyKCdpZCcsICdtb2RhbE92ZXJsYXknKTtcclxuICAgICAgICAgICRvdmVybGF5LmF0dHIoJ2NsYXNzJywgJ3JldmVhbCcpO1xyXG4gICAgICAgICAgJG92ZXJsYXkuYXR0cignZGF0YS1yZXZlYWwnLCB0cnVlKTtcclxuICAgICAgICAgICRib2R5LmFwcGVuZCgkb3ZlcmxheSk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5vbignb3Blbi56Zi5yZXZlYWwnLCBoYW5kbGVPdmVybGF5T3Blbik7XHJcbiAgICAgICAgICAkKHdpbmRvdykub24oJ2Nsb3NlZC56Zi5yZXZlYWwnLCBoYW5kbGVPdmVybGF5Q2xvc2UpO1xyXG4gICAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBkZWxheWVkSGFuZGxlT3ZlcmxheVNpemluZyk7XHJcbiAgICAgICAgICBpbml0Q2xvc2VCdXR0b24oKTtcclxuICAgICAgICAgIG5ldyBGb3VuZGF0aW9uLlJldmVhbCgkb3ZlcmxheSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy0tLS0tXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWRIYW5kbGVPdmVybGF5U2l6aW5nKCkge1xyXG4gICAgICAgICAgaWYgKG92ZXJsYXlTaXppbmdEZWxheSkge1xyXG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KG92ZXJsYXlTaXppbmdEZWxheSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgb3ZlcmxheVNpemluZ0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQob3ZlcmxheVNpemluZywgMjUwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlDbG9zZShldmVudCkge1xyXG4gICAgICAgICAgaXNPcGVuRmxhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZS5jbG9zZSkge1xyXG4gICAgICAgICAgICBjdXJyZW50SW5zdGFuY2UuY2xvc2UoZXZlbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3ZlcmxheVNpemVDbGVhbnVwKCk7XHJcbiAgICAgICAgICBjdXJyZW50SW5zdGFuY2UgPSB7fTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlPcGVuKGV2ZW50KSB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgaXNPcGVuRmxhZyA9IHRydWU7XHJcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2lzLXJldmVhbC1vcGVuJyk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5maW5kKCcqJykuZm91bmRhdGlvbigpO1xyXG4gICAgICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZS5vcGVuKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5vcGVuKGV2ZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIG92ZXJsYXlTaXppbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXRDbG9zZUJ1dHRvbigpIHtcclxuICAgICAgICAgIHZhciAkaW5uZXJTcGFuID0gJCgnPHNwYW4+PC9zcGFuPicpO1xyXG5cclxuICAgICAgICAgICRjbG9zZUJ1dHRvbiA9ICQoJzxidXR0b24gZGF0YS1jbG9zZT48L2J1dHRvbj4nKTtcclxuICAgICAgICAgICRjbG9zZUJ1dHRvbi5hZGRDbGFzcygnY2xvc2UtYnV0dG9uJyk7XHJcbiAgICAgICAgICAkY2xvc2VCdXR0b24uYXR0cignYXJpYS1sYWJlbCcsICdDbG9zZSBtb2RhbCcpO1xyXG4gICAgICAgICAgJGlubmVyU3Bhbi5hdHRyKCdhcmlhLWhpZGRlbicsIHRydWUpO1xyXG4gICAgICAgICAgJGlubmVyU3Bhbi5odG1sKCcmdGltZXM7Jyk7XHJcbiAgICAgICAgICAkY2xvc2VCdXR0b24uYXBwZW5kKCRpbm5lclNwYW4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNPcGVuKCkge1xyXG4gICAgICAgICAgcmV0dXJuIGlzT3BlbkZsYWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvcGVuT3ZlcmxheSh1cmxPck1hcmt1cCwgb3BlbkNhbGxiYWNrLCBjbG9zZUNhbGxiYWNrLCBmdWxsU2NyZWVuKSB7XHJcbiAgICAgICAgICBjdXJyZW50SW5zdGFuY2Uub3BlbiA9IG9wZW5DYWxsYmFjaztcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5jbG9zZSA9IGNsb3NlQ2FsbGJhY2s7XHJcbiAgICAgICAgICBjdXJyZW50SW5zdGFuY2UuZnVsbCA9IGZ1bGxTY3JlZW47XHJcbiAgICAgICAgICBpZiAodHlwZW9mIHVybE9yTWFya3VwID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBvcGVuT3ZlcmxheVdpdGhBamF4KHVybE9yTWFya3VwKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9wZW5PdmVybGF5V2l0aE1hcmt1cCh1cmxPck1hcmt1cCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb3Blbk92ZXJsYXlXaXRoQWpheCh1cmwpIHtcclxuICAgICAgICAgICQuYWpheCh1cmwpLmRvbmUob3Blbk92ZXJsYXlXaXRoTWFya3VwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5PdmVybGF5V2l0aE1hcmt1cChtYXJrdXApIHtcclxuICAgICAgICAgICRvdmVybGF5Lmh0bWwobWFya3VwKTtcclxuICAgICAgICAgICRvdmVybGF5LmFwcGVuZCgkY2xvc2VCdXR0b24pO1xyXG4gICAgICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZS5mdWxsKSB7XHJcbiAgICAgICAgICAgICRvdmVybGF5LmFkZENsYXNzKCdmdWxsJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAkb3ZlcmxheS5mb3VuZGF0aW9uKCdvcGVuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvdmVybGF5U2l6ZUNsZWFudXAoKSB7XHJcbiAgICAgICAgICAkb3ZlcmxheS5yZW1vdmVDbGFzcygnZnVsbCcpO1xyXG4gICAgICAgICAgJG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ3RvdXInKTtcclxuICAgICAgICAgICRvdmVybGF5Lmh0bWwoJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb3ZlcmxheVNpemluZygpIHtcclxuICAgICAgICAgIHZhciBvdmVybGF5SGVpZ2h0ID0gJG92ZXJsYXkuaGVpZ2h0KCksXHJcbiAgICAgICAgICAgIHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICBpZiAob3ZlcmxheUhlaWdodCA+IHdpbmRvd0hlaWdodCkge1xyXG4gICAgICAgICAgICAkb3ZlcmxheS5jc3Moe1xyXG4gICAgICAgICAgICAgIHRvcDogMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ2Z1bGwnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIFZpZGVvTW9kdWxlKCkge1xyXG4gICAgICAgIHZhciBwbGF5ZXIsXHJcbiAgICAgICAgICBBUElNb2R1bGVzLFxyXG4gICAgICAgICAgdmlkZW9QbGF5ZXIsXHJcbiAgICAgICAgICBleHBlcmllbmNlTW9kdWxlLFxyXG4gICAgICAgICAgYXBpSW50ZXJ2YWwsXHJcbiAgICAgICAgICB0ZW1wbGF0ZUludGVydmFsLFxyXG4gICAgICAgICAgJHJlc2l6ZVdyYXBwZXIgPSAkKCcudmlkZW8tY29udGFpbmVyLXJlc3BvbnNpdmUnKSxcclxuICAgICAgICAgICRzcGlubmVyID0gJCgnLnZpZGVvLXNwaW5uZXItY29udGFpbmVyJyksXHJcbiAgICAgICAgICAkcGxhY2Vob2xkZXIgPSAkKCcuanMtdmlkZW8tcGxheScpLFxyXG4gICAgICAgICAgJHBsYXlBbmNob3IgPSAkKCcuanMtdmlkZW8tcGxheS1idG4nKTtcclxuXHJcbiAgICAgICAgaW5pdFZpZGVvKCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXRWaWRlbygpIHtcclxuICAgICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8IDY0MCkge1xyXG4gICAgICAgICAgICBtb2JpbGVWaWRlb0xheW91dCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgd2luZG93Lm9uVGVtcGxhdGVMb2FkID0gb25UZW1wbGF0ZUxvYWQ7XHJcbiAgICAgICAgICB3aW5kb3cub25UZW1wbGF0ZVJlYWR5ID0gb25UZW1wbGF0ZVJlYWR5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbW9iaWxlVmlkZW9MYXlvdXQoKSB7XHJcbiAgICAgICAgICB2YXIgaSwgcm5kO1xyXG4gICAgICAgICAgcm5kID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDMpKTtcclxuICAgICAgICAgIHZhciAkY2xvbmUgPSAkKCcudmlkZW8td3JhcHBlciAudmlkZW8tc3Vic2VjdGlvbicpLmVxKHJuZCk7XHJcbiAgICAgICAgICAkKCcudmlkZW8td3JhcHBlciAudmlkZW8tc3Vic2VjdGlvbicpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgJCgnLnZpZGVvLXdyYXBwZXInKS5hcHBlbmQoJGNsb25lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVJlc2l6ZSgpIHtcclxuICAgICAgICAgIGlmIChwbGF5ZXIuZ2V0TW9kdWxlKEFQSU1vZHVsZXMuRVhQRVJJRU5DRSkuZXhwZXJpZW5jZS50eXBlID09PSBcImh0bWxcIikge1xyXG4gICAgICAgICAgICB2YXIgcmVzaXplV2lkdGggPSAkcmVzaXplV3JhcHBlci5pbm5lcldpZHRoKCk7XHJcbiAgICAgICAgICAgIHZhciByZXNpemVIZWlnaHQgPSAkcmVzaXplV3JhcHBlci5pbm5lckhlaWdodCgpO1xyXG4gICAgICAgICAgICBwbGF5ZXIuZ2V0TW9kdWxlKEFQSU1vZHVsZXMuRVhQRVJJRU5DRSkuc2V0U2l6ZShyZXNpemVXaWR0aCwgcmVzaXplSGVpZ2h0KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9uVGVtcGxhdGVMb2FkKGV4cGVyaWVuY2VJRCkge1xyXG4gICAgICAgICAgcGxheWVyID0gYnJpZ2h0Y292ZS5hcGkuZ2V0RXhwZXJpZW5jZShleHBlcmllbmNlSUQpO1xyXG4gICAgICAgICAgQVBJTW9kdWxlcyA9IGJyaWdodGNvdmUuYXBpLm1vZHVsZXMuQVBJTW9kdWxlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9uVGVtcGxhdGVSZWFkeShldnQpIHtcclxuICAgICAgICAgICRzcGlubmVyLmhpZGUoKTtcclxuICAgICAgICAgICRwbGFjZWhvbGRlci5zaG93KCk7XHJcbiAgICAgICAgICAkcGxheUFuY2hvci5vbignY2xpY2snLCBwbGF5VmlkZW8pO1xyXG4gICAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBoYW5kbGVSZXNpemUpO1xyXG5cclxuICAgICAgICAgIHZpZGVvUGxheWVyID0gcGxheWVyLmdldE1vZHVsZShBUElNb2R1bGVzLlZJREVPX1BMQVlFUik7XHJcbiAgICAgICAgICB2aWRlb1BsYXllci5nZXRDdXJyZW50VmlkZW8oZnVuY3Rpb24gKHZpZGVvRGF0YSkge1xyXG4gICAgICAgICAgICBpZiAodmlkZW9EYXRhICYmIHZpZGVvRGF0YS5pZCkge1xyXG4gICAgICAgICAgICAgIGlmICh2aWRlb0RhdGEuaWQgPT09IDQyMTkxNTMyMTQwMDEgfHwgdmlkZW9EYXRhLmlkID09PSA0MjI4ODg4NjI2MDAxKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcudmlkZW8tY29udGFpbmVyLm9uZSBzcGFuJykuZGVsYXkoMTUwMCkuZmFkZU91dCgnc2xvdycpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZiAodmlkZW9EYXRhLmlkID09PSA0MTkzMDc4NDA0MDAxIHx8IHZpZGVvRGF0YS5pZCA9PT0gNDIyNjA0Njk4OTAwMSkge1xyXG4gICAgICAgICAgICAgICAgJCgnLnZpZGVvLWNvbnRhaW5lci50d28gc3BhbicpLmRlbGF5KDE1MDApLmZhZGVPdXQoJ3Nsb3cnKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYgKHZpZGVvRGF0YS5pZCA9PT0gNDE5MzA3ODM0ODAwMSB8fCB2aWRlb0RhdGEuaWQgPT09IDQyMTk1Njg4NDEwMDEpIHtcclxuICAgICAgICAgICAgICAgICQoJy52aWRlby1jb250YWluZXIudGhyZWUgc3BhbicpLmRlbGF5KDE1MDApLmZhZGVPdXQoJ3Nsb3cnKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBsYXlWaWRlbyhldmVudCkge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPyBldmVudC5wcmV2ZW50RGVmYXVsdCgpIDogKGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2UpO1xyXG4gICAgICAgICAgJHBsYWNlaG9sZGVyLmhpZGUoKTtcclxuICAgICAgICAgIHZpZGVvUGxheWVyID0gcGxheWVyLmdldE1vZHVsZShBUElNb2R1bGVzLlZJREVPX1BMQVlFUik7XHJcbiAgICAgICAgICBleHBlcmllbmNlTW9kdWxlID0gcGxheWVyLmdldE1vZHVsZShBUElNb2R1bGVzLkVYUEVSSUVOQ0UpO1xyXG4gICAgICAgICAgdmlkZW9QbGF5ZXIucGxheSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgX3NlYXJjaExlZ2FjeUNvZGUoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zZWFyY2hMZWdhY3lDb2RlKCkge1xyXG5cclxuLy8gR0xPQkFMU1xyXG4gICAgdmFyIG1vZGVsVXJsID0gJ2h0dHBzOi8vc2VhcmNoLmludmVzdG9yc2dyb3VwLmNvbS9hcGkvY3dwc2VhcmNoPyc7XHJcbiAgICB2YXIgJGZpZWxkID0gJCgnI0ZpbmRBbk9mZmljZScpO1xyXG4gICAgdmFyIGxhbmcgPSAnZW4nO1xyXG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJy9mci8nKSA+IC0xKSB7XHJcbiAgICAgIGxhbmcgPSAnZnInO1xyXG4gICAgfVxyXG5cclxuLy8gUHJvY2VzcyB0aGUgbG9jYWwgcHJlZmV0Y2hlZCBkYXRhXHJcbiAgICB2YXIgc3VnZ2VzdGlvbnMgPSB7fTtcclxuICAgIHN1Z2dlc3Rpb25zLmxvY2F0aW9ucyA9IG5ldyBCbG9vZGhvdW5kKHtcclxuICAgICAgZGF0dW1Ub2tlbml6ZXI6IEJsb29kaG91bmQudG9rZW5pemVycy53aGl0ZXNwYWNlLFxyXG4gICAgICBxdWVyeVRva2VuaXplcjogQmxvb2Rob3VuZC50b2tlbml6ZXJzLndoaXRlc3BhY2UsXHJcbiAgICAgIHByZWZldGNoOiAnZGF0YS9jaXRpZXMuanNvbidcclxuICAgIH0pO1xyXG5cclxuLy8gR2V0IHRoZSByZXN1bHRzXHJcbiAgICBmdW5jdGlvbiBnZXRTZWFyY2hSZXN1bHRzKHBhcmFtcykge1xyXG4gICAgICBwYXJhbXMuc2VhcmNodHlwZSA9ICdvZmZpY2UnO1xyXG4gICAgICBwYXJhbXMubmFtZSA9ICcnO1xyXG5cclxuICAgICAgLy8gTWFrZSBzdXJlIGVycm9yIG1lc3NhZ2UgaXMgaGlkZGVuIGVhY2ggdGltZVxyXG4gICAgICAkKCcuemVyby1yZXN1bHRzJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHJcbiAgICAgICQuZ2V0SlNPTihtb2RlbFVybCwgcGFyYW1zKVxyXG4gICAgICAgIC5hbHdheXMoKVxyXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICAgICAgJCgnI3NlYXJjaFJlc3VsdHNNb2RhbCcpLnJlbW92ZUNsYXNzKCdjbG9zZWQnKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgZGlzcGxheVNlYXJjaFJlc3VsdHMoJ29mZmljZS10ZW1wbGF0ZScsIHJlc3VsdCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCcuemVyby1yZXN1bHRzJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdEYXRhIGNvdWxkIG5vdCBiZSByZXRyaWV2ZWQsIHBsZWFzZSB0cnkgYWdhaW4nLCByZXN1bHQuc3RhdHVzICsgJyAnICsgcmVzdWx0LnN0YXR1c1RleHQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbi8vIEJlY2F1c2Ugd2UgYXJlIG9ubHkgc2VhcmNoaW5nIGZvciBjaXRpZXMsIHRoaXMgZnVuY3Rpb24gaXMgc2xpZ2h0bHkgcmVkdW5kYW50IC0gbGVhdmluZyBpdCBpbiBwbGFjZSBmb3Igbm93XHJcbiAgICBmdW5jdGlvbiBwYXJzZVNlYXJjaFN0cmluZygpIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICB2YXIgc2VhcmNoID0gJGZpZWxkLnZhbCgpO1xyXG5cclxuICAgICAgcmVzdWx0LmNpdHkgPSAnJztcclxuXHJcbiAgICAgIC8vIFNlYXJjaCBpbiB0aGUgbGFuZ3VhZ2Ugb2YgdGhlIHBhZ2VcclxuICAgICAgcmVzdWx0LmxhbmcgPSBsYW5nO1xyXG4gICAgICAvLyBXZSBvbmx5IHNlYXJjaCBjb25zdWx0YW50cyBmcm9tIHRoaXMgbWV0aG9kXHJcbiAgICAgIHJlc3VsdC5zZWFyY2h0eXBlID0gJ2Nvbic7XHJcblxyXG4gICAgICAvLyBDaGVjayB0aGUgc2VhcmNoIHN0cmluZyBmb3IgYSBwcmV2aW91c2x5IGRlZmluZWQgbG9jYXRpb25cclxuICAgICAgdmFyIHdvcmRzID0gc2VhcmNoLnNwbGl0KCcgJyk7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyBDaGVjayBlYWNoIHdvcmQgZm9yIGEgY2l0eSBmcm9tIHRoZSBwcmVkZWZpbmVkIGxpc3RcclxuICAgICAgICB2YXIgY2l0eSA9IHN1Z2dlc3Rpb25zLmxvY2F0aW9ucy5nZXQod29yZHNbaV0pO1xyXG4gICAgICAgIGlmIChjaXR5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJlc3VsdC5jaXR5ID0gY2l0eVswXTtcclxuICAgICAgICAgIHdvcmRzLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghcmVzdWx0LmNpdHkpIHtcclxuICAgICAgICByZXN1bHQuY2l0eSA9IHdvcmRzLmpvaW4oJyAnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkaXNwbGF5U2VhcmNoUmVzdWx0cyh0ZW1wbGF0ZUlELCBqc29uKSB7XHJcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSUQpLmlubmVySFRNTDtcclxuICAgICAgTXVzdGFjaGUucGFyc2UodGVtcGxhdGUpO1xyXG4gICAgICB2YXIgcmVuZGVyZWQgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIGpzb24pO1xyXG4gICAgICAkKCcjc2VhcmNoUmVzdWx0c01vZGFsJykuYXBwZW5kKHJlbmRlcmVkKTtcclxuICAgICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuLy9Jbml0IGV2ZXJ5dGhpbmdcclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBUcnkgdG8gcHJlZGV0ZXJtaW5lIHdoYXQgcmVzdWx0cyBzaG91bGQgc2hvd1xyXG4gICAgICAvLyBTZXR1cCB0aGUgdHlwZWFoZWFkXHJcbiAgICAgICQoJy50eXBlYWhlYWQnKS50eXBlYWhlYWQoe1xyXG4gICAgICAgICAgaGlnaGxpZ2h0OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7bmFtZTogJ2xvY2F0aW9ucycsIHNvdXJjZTogc3VnZ2VzdGlvbnMubG9jYXRpb25zLCBsaW1pdDogMn1cclxuICAgICAgKTtcclxuXHJcbiAgICAgIC8vIFNldHVwIHRoZSBmb3JtIHN1Ym1pc3Npb25cclxuICAgICAgJCgnLmlnLXNlYXJjaCcpLnN1Ym1pdChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXIgcGFyYW1zID0gcGFyc2VTZWFyY2hTdHJpbmcoKTtcclxuICAgICAgICBnZXRTZWFyY2hSZXN1bHRzKHBhcmFtcyk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gRmFrZSBtb2RhbCAtIEFkZGluZyBoYW5kbGVyIG9uIGRvY3VtZW50IHNvIGl0IGZpcmVzIGRlc3BpdGUgdGhlIGJ1dHRvbiBub3QgYmVpbmcgcmVuZGVyZWQgeWV0XHJcbiAgICAgICQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCIjc2VhcmNoUmVzdWx0c01vZGFsIC5jbG9zZS1idXR0b25cIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJyNzZWFyY2hSZXN1bHRzTW9kYWwnKS5hZGRDbGFzcygnY2xvc2VkJyk7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2lzLXJldmVhbC1vcGVuJyk7XHJcbiAgICAgICAgfSwgNDAwKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsIi8qIFRoaXMgZmlsZSBpcyB0aGUgZW50cnkgcG9pbnQgZm9yIHJvbGx1cCAoaHR0cDovL3JvbGx1cGpzLm9yZy8pIGFuZFxyXG4gZXNzZW50aW9uYWxseSAnYm9vdHN0cmFwcycgb3VyIGlnLmNvbSAnYXBwbGljYXRpb24nLlxyXG5cclxuIEFsbCBtb2R1bGVzIHNob3VsZCBiZSBpbXBvcnRlZCBoZXJlIHNvIHRoYXQgdGhleSBjYW4gYmUgaW5pdGlhbGl6ZWQgb25cclxuIGEgY2FzZS1ieS1jYXNlIGJhc2lzIChub3QgYWxsIHBhZ2VzIHJlcXVpcmUgdGhlIGluaXRpYWxpemF0aW9uIG9mIGEgY2Fyb3VzZWxcclxuIGZvciBpbnN0YW5jZSkuXHJcblxyXG4gQW55IHRhc2tzIG9yIHByb2Nlc3NlcyB0aGF0IG5lZWQgdG8gYmUgaW5pdGlhdGVkIG9uIHBhZ2UgbG9hZCBzaG91bGQgbGl2ZSBpbiB0aGlzXHJcbiBmaWxlIGFzIHdlbGwuIEFuIGluY2x1ZGVkIGV4YW1wbGUgaXMgYSBtZXRob2QgdGhhdCBhZGRzIGFuICdlbicgb3IgJ2ZyJyBjbGFzcyB0b1xyXG4gdGhlIGJvZHkgYmFzZWQgb24gdGhlIGdsb2JhbCBsYW5ndWFnZSB2YXJpYWJsZSB0aGF0IHdlIGNhbiB0aGVuIHVzZSB0byB3cml0ZSBjdXN0b21cclxuIHN0eWxlcyBmb3IgZWFjaCBsYW5ndWFnZS5cclxuICovXHJcblxyXG5pbXBvcnQgZm9ybXMgZnJvbSAnLi9mb3Jtcy5qcyc7XHJcbmltcG9ydCBjYXJvdXNlbCBmcm9tICcuL2Nhcm91c2VsLmpzJztcclxuaW1wb3J0IGNhcmVlcnMgZnJvbSAnLi9jYXJlZXJzLmpzJztcclxuaW1wb3J0IHNlYXJjaCBmcm9tICcuL3NlYXJjaC5qcyc7XHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbi8vIEV2ZW50IEVtaXR0ZXIgdGVzdCBtb2R1bGVzXHJcbi8vIGltcG9ydCBldnQxIGZyb20gJy4vZXZlbnQtdGVzdC0xLmpzJztcclxuLy8gaW1wb3J0IGV2dDIgZnJvbSAnLi9ldmVudC10ZXN0LTIuanMnO1xyXG5cclxuY29uc3QgYXBwID0gKCgpID0+IHtcclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG5cclxuICAgIC8vIEluaXRpYWxpemUgRm91bmRhdGlvblxyXG4gICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xyXG5cclxuICAgIC8vIENoZWNrIGZvciBjb21wb25lbnRzXHJcbiAgICBpZiAoJCgnLmlnLWZvcm0nKS5sZW5ndGgpIGZvcm1zLmluaXQoKTtcclxuICAgIGlmICgkKCcuaWctY2Fyb3VzZWwnKS5sZW5ndGgpIGNhcm91c2VsLmluaXQoKTtcclxuICAgIGlmICgkKCcuaWctc2VhcmNoJykubGVuZ3RoKSBzZWFyY2guaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1jYXJlZXJzJykubGVuZ3RoKSBjYXJlZXJzLmluaXQoKTtcclxuXHJcbiAgICAvLyBDb21wb25lbnRzIGNhbiBhbHNvIGJlIHNldHVwIHRvIHJlY2VpdmUgYW4gSFRNTCAnc2NvcGUnICguaWctZXZ0MS4uLiAuaWctZXZ0Mi4uLi4gZXRjKVxyXG4gICAgLy8gaWYgKCQoJy5pZy1ldnQxJykubGVuZ3RoKSBldnQxLmluaXQoJy5pZy1ldnQxJyk7XHJcbiAgICAvLyBpZiAoJCgnLmlnLWV2dDInKS5sZW5ndGgpIGV2dDIuaW5pdCgnLmlnLWV2dDInKTtcclxuXHJcbiAgICAvLyBBZGQgbGFuZ3VhZ2UgY2xhc3MgdG8gYm9keVxyXG4gICAgX2xhbmd1YWdlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBMZXQncyB1c2UgYSBnbG9iYWwgdmFyaWFibGUgKGdsb2JhbCBhcyBpbiBhdmFpbGFibGUgdG8gYWxsIG91ciBjb21wb25lbnRzIC0gbm90IHRoZSB3aW5kb3cgb2JqZWN0ISlcclxuICAvLyB0byBhZGQgYSBjbGFzcyB0byB0aGUgYm9keSB0YWdcclxuICBmdW5jdGlvbiBfbGFuZ3VhZ2UoKSB7XHJcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoaWcubGFuZyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH1cclxufSkoKTtcclxuXHJcbi8vIEJvb3RzdHJhcCBhcHBcclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gIGFwcC5pbml0KCk7XHJcbn0pO1xyXG4iXSwibmFtZXMiOlsibGFuZyIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJpbmRleE9mIiwiZW1pdHRlciIsIkV2ZW50RW1pdHRlciIsImVuZHBvaW50VVJMIiwic3VjY2Vzc1VSTCIsImNhbmNlbFVSTCIsIiRmb3JtIiwiJGZvcm1XcmFwcGVyIiwiaW5pdCIsIiQiLCJmaW5kIiwiZGF0YSIsIl92YWxpZGF0aW9uIiwiaklucHV0IiwiY2hhbmdlIiwib2JqRXZlbnQiLCJhZGRDbGFzcyIsInZhbGlkYXRvciIsInNldERlZmF1bHRzIiwiYWRkTWV0aG9kIiwicG9zdGFsIiwiZWxlbWVudCIsIm9wdGlvbmFsIiwibWF0Y2giLCJ2YWxpZGF0ZSIsImxhYmVsIiwiY2xvc2VzdCIsImxlbmd0aCIsInBhcmVudCIsImFwcGVuZCIsIm9uIiwicmVwbGFjZSIsIl9wcm9jZXNzIiwiZm9ybSIsImZvcm1EYXRhUmF3IiwiZm9ybURhdGFQYXJzZWQiLCJ2YWxpZCIsInJlbW92ZUNsYXNzIiwic2VyaWFsaXplQXJyYXkiLCJfcGFyc2UiLCJfc3VibWl0IiwiYWpheCIsInN1Y2Nlc3MiLCJtc2ciLCJlcnJvciIsInRvIiwiX3RvZ2dsZXIiLCJoaWRlIiwic2hvdyIsImxvZyIsInRvZ2dsZUNsYXNzIiwiX2J1aWxkQ2Fyb3VzZWwiLCJwcmV2QXJyb3ciLCJuZXh0QXJyb3ciLCIkY2Fyb3VzZWwiLCJlYWNoIiwiaW5kZXgiLCJzbGljayIsIl9jYXJlZXJzTGVnYWN5Q29kZSIsImZuIiwiaW5mb1RvZ2dsZSIsIiRyZXZlYWwiLCIkcmV2ZWFsQ29udGVudCIsIiRyZXZlYWxUcmlnZ2VyIiwiZml4ZWRIZWlnaHQiLCJzZXRBcmlhIiwiYXR0ciIsImluaXRUb2dnbGUiLCJoYW5kbGVSZXZlYWxUb2dnbGUiLCJyZXNpemVIYW5kbGVyIiwic2V0VGltZW91dCIsInNldFJldmVhbENvbnRlbnRIZWlnaHQiLCJjc3MiLCJoZWlnaHQiLCJmaW5hbEhlaWdodCIsImhhc0NsYXNzIiwic2Nyb2xsSGVpZ2h0IiwialF1ZXJ5IiwiY2lyY2xlQW5pbWF0aW9uIiwibWF4VmFsdWUiLCJjYW52YXMiLCIkY2FudmFzIiwiY29udGV4dCIsImQiLCJ3aWR0aCIsInBlcmNlbnRTdHJva2UiLCJyZW1haW5pbmdTdHJva2UiLCJyYWRpdXMiLCJjdXJQZXJjIiwiY2lyYyIsIk1hdGgiLCJQSSIsInF1YXJ0IiwiZGVsZWdhdGVJRCIsIkRhdGUiLCJnZXRUaW1lIiwiaXMiLCJnZXRDb250ZXh0Iiwic3Ryb2tlU3R5bGUiLCJmaWxsU3R5bGUiLCJkZWxlZ2F0ZSIsImNsZWFyIiwiYW5pbWF0ZSIsImN1cnJlbnQiLCJsaW5lV2lkdGgiLCJiZWdpblBhdGgiLCJhcmMiLCJtaW4iLCJzdHJva2UiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJmaWxsUmVjdCIsImJsb2NrTGluayIsIiRibG9ja0xpbmsiLCJkZXN0aW5hdGlvbiIsImluaXRCbG9jayIsImhhbmRsZUNsaWNrIiwiZ3VpIiwidmlkZW8iLCJvdmVybGF5IiwiaW5pdExlZ2FjeSIsIk92ZXJsYXlNb2R1bGUiLCJHdWlNb2R1bGUiLCJWaWRlb01vZHVsZSIsImUiLCJ0YXJnZXQiLCJnZXRBdHRyaWJ1dGUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3AiLCJvZmZzZXQiLCJ0b3AiLCJzZWxlY3RvciIsInJlc2l6ZSIsIm92ZXJsYXlSZWZlcmVuY2UiLCJtdWx0aVRhYlRvZ2dsZVNlbGVjdG9yIiwibXVsdGlUYWJDb250ZW50U2VsZWN0b3IiLCJtdWx0aVRhYlNlbGVjdG9yIiwiJGVkZ2VPdmVybGF5TG9jYXRpb24iLCIkb3ZlcmxheVNsaWRlciIsIiRwcm9maWxlU2xpZGVyIiwiJHByb2ZpbGVTbGlkZXJWaWRlb1NlY3Rpb25Ib2xkZXIiLCJ3aW5kb3dTaXppbmdEZWxheSIsIndpbmRvd1Njcm9sbGluZ0RlbGF5Iiwib3ZlcmxheU9wZW4iLCJpc1Jlc3BvbnNpdmVTdGF0ZSIsInNjcm9sbGVkVG9WaWV3IiwiaW5pdEd1aSIsImV2ZW50IiwiYmFja2dyb3VuZENvbG9yIiwiJHRoaXMiLCJwYXJzZUludCIsImh0bWwiLCJoYW5kbGVPdmVybGF5RnJvbUhhc2giLCJkZWxheWVkSGFuZGxlV2luZG93U2l6aW5nIiwiZGVsYXllZEhhbmRsZVdpbmRvd1Njcm9sbCIsInRyaWdnZXIiLCJzdG9wUHJvcGFnYXRpb24iLCJhZGRNdWx0aVRhYlRvZ2dsZUhhbmRsZXJzIiwidG9nZ2xlQmFzZSIsIiRjb250YWluZXIiLCJwYXJlbnRzIiwiYW5pbWF0ZVByb2ZpbGVTbGlkZXIiLCIkcHJvZmlsZVBhbmVscyIsInByb2ZpbGVQYW5lbEhlaWdodCIsIm91dGVySGVpZ2h0IiwiY2hhbmdlU2xpZGVyU3RhdGUiLCJzbGlkZXIiLCJzdGF0ZSIsImNsZWFyVGltZW91dCIsImhhbmRsZVdpbmRvd1NpemluZyIsImhhbmRsZVdpbmRvd1Njcm9sbGluZyIsImZ1bGxIYXNoRnJhZ21lbnQiLCJoYXNoIiwib3Blbk92ZXJsYXkiLCJoYW5kbGVPdmVybGF5T3BlbiIsImhhbmRsZU92ZXJsYXlDbG9zZSIsImluaXRpYWxJbmRleCIsImhhbmRsZVNsaWRlQ2hhbmdlIiwieVBvcyIsIm92ZXJsYXlDb250ZW50Iiwib2ZmIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImRvY3VtZW50IiwidGl0bGUiLCJzZWFyY2giLCJzY3JvbGxUb3AiLCJjdXJyZW50U2xpZGUiLCJuZXh0U2xpZGUiLCJuZXh0VGl0bGUiLCJnZXQiLCJuZXdIYXNoIiwid2luZG93V2lkdGgiLCJyZXNwb25zaXZlTGltaXQiLCJuZXdJc1Jlc3BvbnNpdmVTdGF0ZSIsImluaXRQcm9maWxlU2xpZGVyIiwiaW5pdFNsaWRlciIsIm9wdGlvbnMiLCJkZWZhdWx0cyIsImV4dGVuZCIsIiRvdmVybGF5IiwiJGJvZHkiLCJvdmVybGF5U2l6aW5nRGVsYXkiLCJjdXJyZW50SW5zdGFuY2UiLCJpc09wZW5GbGFnIiwiJGNsb3NlQnV0dG9uIiwiaXNPcGVuIiwiaW5pdE92ZXJsYXkiLCJkZWxheWVkSGFuZGxlT3ZlcmxheVNpemluZyIsIkZvdW5kYXRpb24iLCJSZXZlYWwiLCJvdmVybGF5U2l6aW5nIiwiY2xvc2UiLCJmb3VuZGF0aW9uIiwib3BlbiIsImluaXRDbG9zZUJ1dHRvbiIsIiRpbm5lclNwYW4iLCJ1cmxPck1hcmt1cCIsIm9wZW5DYWxsYmFjayIsImNsb3NlQ2FsbGJhY2siLCJmdWxsU2NyZWVuIiwiZnVsbCIsIm9wZW5PdmVybGF5V2l0aEFqYXgiLCJ1cmwiLCJkb25lIiwib3Blbk92ZXJsYXlXaXRoTWFya3VwIiwibWFya3VwIiwib3ZlcmxheVNpemVDbGVhbnVwIiwib3ZlcmxheUhlaWdodCIsIndpbmRvd0hlaWdodCIsInBsYXllciIsIkFQSU1vZHVsZXMiLCJ2aWRlb1BsYXllciIsImV4cGVyaWVuY2VNb2R1bGUiLCJhcGlJbnRlcnZhbCIsInRlbXBsYXRlSW50ZXJ2YWwiLCIkcmVzaXplV3JhcHBlciIsIiRzcGlubmVyIiwiJHBsYWNlaG9sZGVyIiwiJHBsYXlBbmNob3IiLCJpbml0VmlkZW8iLCJvblRlbXBsYXRlTG9hZCIsIm9uVGVtcGxhdGVSZWFkeSIsIm1vYmlsZVZpZGVvTGF5b3V0IiwiaSIsInJuZCIsImZsb29yIiwicmFuZG9tIiwiJGNsb25lIiwiZXEiLCJyZW1vdmUiLCJoYW5kbGVSZXNpemUiLCJnZXRNb2R1bGUiLCJFWFBFUklFTkNFIiwiZXhwZXJpZW5jZSIsInR5cGUiLCJyZXNpemVXaWR0aCIsImlubmVyV2lkdGgiLCJyZXNpemVIZWlnaHQiLCJpbm5lckhlaWdodCIsInNldFNpemUiLCJleHBlcmllbmNlSUQiLCJicmlnaHRjb3ZlIiwiYXBpIiwiZ2V0RXhwZXJpZW5jZSIsIm1vZHVsZXMiLCJldnQiLCJwbGF5VmlkZW8iLCJWSURFT19QTEFZRVIiLCJnZXRDdXJyZW50VmlkZW8iLCJ2aWRlb0RhdGEiLCJpZCIsImRlbGF5IiwiZmFkZU91dCIsInJldHVyblZhbHVlIiwicGxheSIsIl9zZWFyY2hMZWdhY3lDb2RlIiwibW9kZWxVcmwiLCIkZmllbGQiLCJocmVmIiwic3VnZ2VzdGlvbnMiLCJsb2NhdGlvbnMiLCJCbG9vZGhvdW5kIiwidG9rZW5pemVycyIsIndoaXRlc3BhY2UiLCJnZXRTZWFyY2hSZXN1bHRzIiwicGFyYW1zIiwic2VhcmNodHlwZSIsIm5hbWUiLCJnZXRKU09OIiwiYWx3YXlzIiwicmVzdWx0IiwiSlNPTiIsInBhcnNlIiwiZmFpbCIsInN0YXR1cyIsInN0YXR1c1RleHQiLCJwYXJzZVNlYXJjaFN0cmluZyIsInZhbCIsImNpdHkiLCJ3b3JkcyIsInNwbGl0Iiwic3BsaWNlIiwiam9pbiIsImRpc3BsYXlTZWFyY2hSZXN1bHRzIiwidGVtcGxhdGVJRCIsImpzb24iLCJ0ZW1wbGF0ZSIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwicmVuZGVyZWQiLCJNdXN0YWNoZSIsInJlbmRlciIsInR5cGVhaGVhZCIsInNvdXJjZSIsImxpbWl0Iiwic3VibWl0IiwiYXBwIiwiZm9ybXMiLCJjYXJvdXNlbCIsImNhcmVlcnMiLCJfbGFuZ3VhZ2UiLCJpZyIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7O0FBU0EsQUFBTzs7O0FBS1AsQUFBTyxJQUFJQSxPQUFRLFlBQU07TUFDbkJDLE9BQU9DLFFBQVAsQ0FBZ0JDLFFBQWhCLENBQXlCQyxPQUF6QixDQUFpQyxNQUFqQyxNQUE2QyxDQUFDLENBQWxELEVBQXFEO1dBQzVDLElBQVA7R0FERixNQUVPO1dBQ0UsSUFBUDs7Q0FKYyxFQUFYOzs7QUFTUCxBQUFPOzs7QUFLUCxBQUFPLElBQUlDLFVBQVUsSUFBSUMsWUFBSixFQUFkOztBQzFCUCxZQUFlLENBQUMsWUFBTTs7TUFFaEJDLFdBQUosRUFDRUMsVUFERixFQUVFQyxTQUZGLEVBR0VDLEtBSEYsRUFJRUMsWUFKRjs7V0FNU0MsSUFBVCxHQUFnQjs7bUJBRUNDLEVBQUUsVUFBRixDQUFmO1lBQ1FGLGFBQWFHLElBQWIsQ0FBa0IsTUFBbEIsQ0FBUjtrQkFDY0gsYUFBYUcsSUFBYixDQUFrQixNQUFsQixFQUEwQkMsSUFBMUIsQ0FBK0IsVUFBL0IsQ0FBZDtnQkFDWUosYUFBYUcsSUFBYixDQUFrQixNQUFsQixFQUEwQkMsSUFBMUIsQ0FBK0IsUUFBL0IsQ0FBWjs7Ozs7O1dBTU9DLFdBQVQsR0FBdUI7O1FBRWpCQyxTQUFTSixFQUFFLGtCQUFGLENBQWI7V0FDT0ssTUFBUCxDQUFjLFVBQVVDLFFBQVYsRUFBb0I7UUFDOUIs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