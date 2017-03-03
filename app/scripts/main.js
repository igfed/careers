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
        // video = new VideoModule(); // Replace with video.js module

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
    })(jQuery);
  }

  return {
    init: init
  };
})();

var video = (function () {

  var vids = [],
      brightCove;

  function init() {
    _parseVideos();

    // Make sure the VideoJS method is available and fire ready event handlers if so
    // brightCove = setInterval(function () {
    //   if ($('.vjs-plugins-ready').length) {
    //     _brightCoveReady();
    //     clearInterval(brightCove);
    //   }
    // }, 500)
  }

  function _parseVideos() {
    var $group,
        $video,
        data = {},
        preloadOptions = ['auto', 'metadata', 'none'];

    // Each group can effectively use a different player which will only be loaded once
    $('.ig-video-group').each(function () {
      $group = $(this);
      console.log($(this));
      data.account = $group.data('account');
      data.player = $group.data('player');

      // Load required JS for a player
      _injectBrightCoveJS(data);

      // Loop through video's
      $group.find('.ig-video-js').each(function (index) {
        $video = $(this);

        // Capture options (required)
        data.id = $video.data('id');

        // Capture options (optional)
        data.title = $video.data('title') ? $video.data('title') : '';
        data.description = $video.data('description') ? $video.data('description') : '';
        data.auto = $video.data('autoplay') ? 'autoplay' : '';
        data.ctrl = $video.data('controls') ? 'controls' : '';
        data.preload = preloadOptions.indexOf($video.data('preload')) > -1 ? $video.data('preload') : 'auto';

        // Store ID's for all video's on the page - in case we want to run a post-load process on each
        vids.push(data.id);

        // Let's replace the ig-video-js 'directive' with the necessary Brightcove code
        _injectTemplate($video, data, index);
      });
    });
  }

  function _injectBrightCoveJS(data) {
    var indexjs = '<script src="//players.brightcove.net/' + data.account + '/' + data.player + '_default/index.min.js"></script>';
    $('body').append(indexjs);
  }

  function _injectTemplate($video, data, index) {
    var html = '<div class="video-container"><span class="video-overlay ' + data.id + '"></span><div class="video-container-responsive"><video data-video-id="' + data.id + '" preload="' + data.preload + '" data-account="' + data.account + '" data-player="' + data.player + '" data-embed="default" data-application-id="' + index + '" class="video-js" id="' + data.id + '" ' + data.ctrl + ' ' + data.auto + '></video></div></div><h2 class="video-title">' + data.title + '</h2><p class="video-description">' + data.description + '</p>';
    $video.replaceWith(html);
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
    if ($('.ig-video-group').length) video.init();

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvY2FyZWVycy5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL3NlYXJjaC5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgZmlsZSBpcyBmb3IgbWV0aG9kcyBhbmQgdmFyaWFibGVzIHRoYXQgYXJlIGdvaW5nIHRvIGJlXHJcbnVzZWZ1bCBhY3Jvc3MgYWxsIG1vZHVsZXMuIEluIG9yZGVyIHRvIHVzZSB0aGVtIGFueXdoZXJlLCBpbXBvcnQgd2l0aDpcclxuXHJcbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4gYW5kIHRoZW4gY2FsbCB3aXRoIHRoZSBpZyBuYW1lc3BhY2UgKGkuZS4sIGlnLnBhdGhuYW1lLCBpZy5sYW5nLCBldGMpXHJcbiAqL1xyXG5cclxuLy8gdXJsIHBhdGhcclxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XHJcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxufSkoKVxyXG5cclxuLy8gbGFuZ3VhZ2VcclxuZXhwb3J0IHZhciBsYW5nID0gKCgpID0+IHtcclxuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgIHJldHVybiAnZnInO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gJ2VuJztcclxuICB9XHJcbn0pKClcclxuXHJcbi8vIGJyb3dzZXIgd2lkdGhcclxuZXhwb3J0IHZhciBicm93c2VyV2lkdGggPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcclxufSkoKVxyXG5cclxuLy8gYmFzZSBldmVudEVtaXR0ZXJcclxuZXhwb3J0IHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICB2YXIgZW5kcG9pbnRVUkwsXHJcbiAgICBzdWNjZXNzVVJMLFxyXG4gICAgY2FuY2VsVVJMLFxyXG4gICAgJGZvcm0sXHJcbiAgICAkZm9ybVdyYXBwZXI7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xyXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcclxuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xyXG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcclxuXHJcbiAgICBfdmFsaWRhdGlvbigpO1xyXG4gICAgX3RvZ2dsZXIoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcclxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XHJcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZSxcclxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XHJcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcclxuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xyXG5cclxuICAgICRmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDYXJvdXNlbCBJbml0aWFsaXplZCEnKVxyXG5cclxuICAgIC8vIE5vdCBzdXJlIHdoYXQgdGhpcyBkb2VzIGF0IHRoaXMgcG9pbnQgb3IgaG93IGl0IHJlbGF0ZXMgdG8gQ2Fyb3VzZWxzXHJcbiAgICAkKCdbZGF0YS1yZXNwb25zaXZlLXRvZ2dsZV0gYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ3NpdGUtaGVhZGVyLWlzLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgX2J1aWxkQ2Fyb3VzZWwoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9idWlsZENhcm91c2VsKCkge1xyXG4gICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgbmV4dEFycm93LFxyXG4gICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgJCgnLmlnLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXHJcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxyXG4gICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgX2NhcmVlcnNMZWdhY3lDb2RlKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfY2FyZWVyc0xlZ2FjeUNvZGUoKSB7XHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuXHJcbiAgICAgICQuZm4uaW5mb1RvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyICRyZXZlYWwgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAkcmV2ZWFsQ29udGVudCA9ICRyZXZlYWwuZmluZCgnLmluZm8tdG9nZ2xlLWNvbnRlbnQnKSxcclxuICAgICAgICAgICAgJHJldmVhbFRyaWdnZXIgPSAkcmV2ZWFsLmZpbmQoJy5pbmZvLXRvZ2dsZS10cmlnZ2VyJyksXHJcbiAgICAgICAgICAgIGZpeGVkSGVpZ2h0ID0gZmFsc2UsXHJcbiAgICAgICAgICAgIHNldEFyaWEgPSAkcmV2ZWFsLmF0dHIoJ2luZm8tdG9nZ2xlLWFyaWEnKSA9PT0gJ3RydWUnO1xyXG5cclxuICAgICAgICAgIGluaXRUb2dnbGUoKTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBpbml0VG9nZ2xlKCkge1xyXG4gICAgICAgICAgICAkcmV2ZWFsVHJpZ2dlci5vbignY2xpY2snLCBoYW5kbGVSZXZlYWxUb2dnbGUpO1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXIpO1xyXG5cclxuICAgICAgICAgICAgc2V0UmV2ZWFsQ29udGVudEhlaWdodCgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVSZXZlYWxUb2dnbGUoKSB7XHJcbiAgICAgICAgICAgIHNldFJldmVhbENvbnRlbnRIZWlnaHQoKTtcclxuICAgICAgICAgICAgJHJldmVhbC50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHNldFJldmVhbENvbnRlbnRIZWlnaHQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIHJlc2l6ZUhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIGlmIChmaXhlZEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmNzcyh7IGhlaWdodDogJ2F1dG8nIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gc2V0UmV2ZWFsQ29udGVudEhlaWdodCgpIHtcclxuICAgICAgICAgICAgdmFyIGZpbmFsSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgaWYgKCRyZXZlYWwuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgZmluYWxIZWlnaHQgPSAkcmV2ZWFsQ29udGVudFswXS5zY3JvbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgZml4ZWRIZWlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGZpbmFsSGVpZ2h0ID0gMDtcclxuICAgICAgICAgICAgICBmaXhlZEhlaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmNzcyh7IGhlaWdodDogZmluYWxIZWlnaHQgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2V0QXJpYSkge1xyXG4gICAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgIWZpeGVkSGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfTtcclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuXHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuICAgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICAgJC5mbi5jaXJjbGVBbmltYXRpb24gPSBmdW5jdGlvbiAobWF4VmFsdWUpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyIGNhbnZhcyA9IHRoaXMsXHJcbiAgICAgICAgICAgICRjYW52YXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBjb250ZXh0LFxyXG4gICAgICAgICAgICBkID0gY2FudmFzLndpZHRoIC8gMixcclxuICAgICAgICAgICAgcGVyY2VudFN0cm9rZSA9IDcsXHJcbiAgICAgICAgICAgIHJlbWFpbmluZ1N0cm9rZSA9IDEsXHJcbiAgICAgICAgICAgIHJhZGl1cyA9IGQgLSBwZXJjZW50U3Ryb2tlLFxyXG4gICAgICAgICAgICBjdXJQZXJjID0gMCxcclxuICAgICAgICAgICAgY2lyYyA9IE1hdGguUEkgKiAyLFxyXG4gICAgICAgICAgICBxdWFydCA9IE1hdGguUEkgLyAyLFxyXG4gICAgICAgICAgICBkZWxlZ2F0ZUlEID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgKyAnQ0EnO1xyXG5cclxuICAgICAgICAgIGlmICghJGNhbnZhcy5pcygnY2FudmFzJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzBkMjYzYyc7XHJcbiAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjZTVlOGU4JztcclxuXHJcbiAgICAgICAgICAkY2FudmFzLmF0dHIoJ2NpcmNsZS1hbmltYXRpb24taWQnLCBkZWxlZ2F0ZUlEKTtcclxuICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZSgnW2NpcmNsZS1hbmltYXRpb24taWQ9JyArIGRlbGVnYXRlSUQgKyAnXScsICdzdGFydEFuaW1hdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGN1clBlcmMgPSAwO1xyXG4gICAgICAgICAgICBhbmltYXRlKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZSgnW2NpcmNsZS1hbmltYXRpb24taWQ9JyArIGRlbGVnYXRlSUQgKyAnXScsICdjbGVhckFuaW1hdGUnLCBjbGVhcik7XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZShjdXJyZW50KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50ID8gY3VycmVudCA6IDA7XHJcbiAgICAgICAgICAgIGNsZWFyKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gcGVyY2VudFN0cm9rZTtcclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1NYXRoLm1pbihjdXJyZW50LCBtYXhWYWx1ZSAvIDEwMCkpIC0gcXVhcnQsIHRydWUpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHJlbWFpbmluZ1N0cm9rZTtcclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1jdXJyZW50KSAtIHF1YXJ0LCB0cnVlKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICAgICAgY3VyUGVyYysrO1xyXG4gICAgICAgICAgICBpZiAoY3VyUGVyYyA8IDExMCkge1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZShjdXJQZXJjIC8gMTAwKVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gY2xlYXIoKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMud2lkdGgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfTtcclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAkLmZuLmJsb2NrTGluayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyICRibG9ja0xpbmsgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBkZXN0aW5hdGlvbiA9ICRibG9ja0xpbmsuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgICAgIC8vIGRlc3RpbmF0aW9uID0gJzQ0NDIuYXNweC8nICsgZGVzdGluYXRpb247XHJcbiAgICAgICAgICBpbml0QmxvY2soKTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBpbml0QmxvY2soKSB7XHJcbiAgICAgICAgICAgICRibG9ja0xpbmsub24oJ2NsaWNrJywgaGFuZGxlQ2xpY2spO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVDbGljaygpIHtcclxuICAgICAgICAgICAgLy9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgbG9jYXRpb24gPSBkZXN0aW5hdGlvbjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH07XHJcblxyXG4gICAgfSkoalF1ZXJ5KTtcclxuXHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuICAgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICAgdmFyIGd1aSxcclxuICAgICAgICB2aWRlbyxcclxuICAgICAgICBvdmVybGF5O1xyXG5cclxuICAgICAgaW5pdExlZ2FjeSgpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gaW5pdExlZ2FjeSgpIHtcclxuICAgICAgICAvLyBUaGlzIGlzIHdlaXJkIC0gbm90IGdvaW5nIHRvIHRvdWNoIGl0XHJcbiAgICAgICAgb3ZlcmxheSA9IG5ldyBPdmVybGF5TW9kdWxlKCk7XHJcbiAgICAgICAgZ3VpID0gbmV3IEd1aU1vZHVsZShvdmVybGF5KTtcclxuICAgICAgICAvLyB2aWRlbyA9IG5ldyBWaWRlb01vZHVsZSgpOyAvLyBSZXBsYWNlIHdpdGggdmlkZW8uanMgbW9kdWxlXHJcblxyXG4gICAgICAgIC8vIE5lZWQgdG8gaGF2ZSBhIGNsYXNzIHRvIGhvb2sgb250byBmb3IgRnJlbmNoIGxhbmd1YWdlIHBhZ2VcclxuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnZnInKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNtb290aCBzY3JvbGxpbmcgZm9yIGFuY2hvciBsaW5rc1xyXG4gICAgICAgICQoJ2FbaHJlZl49XCIjXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xyXG4gICAgICAgICAgaWYgKHRhcmdldC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgIHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcCArIDUyXHJcbiAgICAgICAgICAgIH0sIDc1MCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRhcmdldC5zZWxlY3RvciAhPT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgJCgnI21haW4tbWVudS1hbmNob3InKS5jc3MoeyAnZGlzcGxheSc6ICdub25lJyB9KTtcclxuICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdpcy1yZXZlYWwtb3BlbiBicmFuZGVkJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIE1vYmlsZSBtZW51IG5lZWRzIHRvIG1pbWljIEZvdW5kYXRpb24gcmV2ZWFsIC0gbm90IGVub3VnaCB0aW1lIHRvIGltcGxlbWVudCBkaWZmZXJlbnQgbmF2cyBpbiBhIHJldmVhbCBtb2RhbCBwcm9wZXJseVxyXG4gICAgICAgICQoJy5tZW51LWljb24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdpcy1yZXZlYWwtb3BlbiBicmFuZGVkJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHF1aWNrIGFuZCBkaXJ0eSBtb2JpbGUgbWVudSBjbG9zZXMgLSBub3QgZmFtaWxpYXIgd2l0aCBGb3VuZGF0aW9uIHBhdHRlcm4gdG8gZmlyZSB0aGVzZVxyXG4gICAgICAgICQoJy50b3AtYmFyIC5jbG9zZS1idXR0b24uc2hvdy1mb3Itc21hbGwtb25seScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQoJyNtYWluLW1lbnUtYW5jaG9yJykuY3NzKHsgJ2Rpc3BsYXknOiAnbm9uZScgfSk7XHJcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2lzLXJldmVhbC1vcGVuIGJyYW5kZWQnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA2NDApIHtcclxuICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdicmFuZGVkJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIEd1aU1vZHVsZShvdmVybGF5UmVmZXJlbmNlKSB7XHJcbiAgICAgICAgdmFyIG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IgPSAnW2NsYXNzKj1cInRvZ2dsZS1cIl06bm90KFtjbGFzcyo9XCJpbmZvLXRvZ2dsZVwiXSknLFxyXG4gICAgICAgICAgbXVsdGlUYWJDb250ZW50U2VsZWN0b3IgPSAnW2NsYXNzKj1cImNvbnRlbnQtXCJdJyxcclxuICAgICAgICAgIG11bHRpVGFiU2VsZWN0b3IgPSAnLm11bHRpLXRhYi1vdXRsaW5lJyxcclxuICAgICAgICAgICRlZGdlT3ZlcmxheUxvY2F0aW9uID0gJCgnI2VkZ2Utb3ZlcmxheS1jb250ZW50JyksXHJcbiAgICAgICAgICBvdmVybGF5ID0gb3ZlcmxheVJlZmVyZW5jZSxcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLFxyXG4gICAgICAgICAgJHByb2ZpbGVTbGlkZXIsXHJcbiAgICAgICAgICAkcHJvZmlsZVNsaWRlclZpZGVvU2VjdGlvbkhvbGRlciA9ICQoJzxkaXY+PC9kaXY+JyksXHJcbiAgICAgICAgICB3aW5kb3dTaXppbmdEZWxheSxcclxuICAgICAgICAgIHdpbmRvd1Njcm9sbGluZ0RlbGF5LFxyXG4gICAgICAgICAgb3ZlcmxheU9wZW4sXHJcbiAgICAgICAgICBpc1Jlc3BvbnNpdmVTdGF0ZSA9IGZhbHNlLFxyXG4gICAgICAgICAgc2Nyb2xsZWRUb1ZpZXcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaW5pdEd1aSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0R3VpKCkge1xyXG4gICAgICAgICAgYWRkTXVsdGlUYWJUb2dnbGVIYW5kbGVycygpO1xyXG4gICAgICAgICAgJCgnLmJsb2NrLWxpbmsnKS5ibG9ja0xpbmsoKTtcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyID0gJCgnLm91ci1idXNpbmVzcy1zbGlkZXInKTtcclxuICAgICAgICAgICQoJyNlZGdlLW92ZXJsYXktY29udGVudCcpLmZpbmQoJy5jYXJvdXNlbC1uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCdzbGlja05leHQnKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGlmICgkKFwiLnZpZGVvLXNsaWRlLnNsaWNrLWFjdGl2ZVwiKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJCgnLnNsaWNrLWxpc3QuZHJhZ2dhYmxlJykuY3NzKHsgaGVpZ2h0OiAnNjYwcHgnIH0pO1xyXG4gICAgICAgICAgICAkKCcuc2VjdGlvbi5wcm9maWxlcy1zbGlkZXInKS5jc3MoeyBiYWNrZ3JvdW5kQ29sb3I6ICcjZTVlOGU4JyB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy5zbGljay1saXN0LmRyYWdnYWJsZScpLmNzcyh7IGhlaWdodDogJ2F1dG8nIH0pO1xyXG4gICAgICAgICAgICAkKCcuc2VjdGlvbi5wcm9maWxlcy1zbGlkZXInKS5jc3MoeyBiYWNrZ3JvdW5kQ29sb3I6ICcjN2VjNGI5JyB9KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAkKCcucHJvZmlsZS1jb3VudGVyJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAkdGhpcy5maW5kKCdjYW52YXMnKS5jaXJjbGVBbmltYXRpb24ocGFyc2VJbnQoJHRoaXMuZmluZCgncCcpLmh0bWwoKSkpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICAkcHJvZmlsZVNsaWRlciA9ICQoJy5wcm9maWxlcy1zbGlkZXInKTtcclxuICAgICAgICAgICQod2luZG93KS5vbignaGFzaGNoYW5nZScsIGhhbmRsZU92ZXJsYXlGcm9tSGFzaCk7XHJcbiAgICAgICAgICBoYW5kbGVPdmVybGF5RnJvbUhhc2goKTtcclxuICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZGVsYXllZEhhbmRsZVdpbmRvd1NpemluZyk7XHJcbiAgICAgICAgICBoYW5kbGVXaW5kb3dTaXppbmcodHJ1ZSk7XHJcbiAgICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGRlbGF5ZWRIYW5kbGVXaW5kb3dTY3JvbGwpO1xyXG4gICAgICAgICAgaGFuZGxlV2luZG93U2Nyb2xsaW5nKCk7XHJcblxyXG4gICAgICAgICAgJCgnLmluZm8tdG9nZ2xlJykuaW5mb1RvZ2dsZSgpO1xyXG4gICAgICAgICAgJCgnLnRvcC1iYXIgKyAuc2NyZWVuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCdhW2RhdGEtdG9nZ2xlXScpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAvLyBOb3QgcHJldHR5IC0ganVzdCBhZGRpbmcgcXVpY2sgYW5kIGRpcnR5IHNoYXJlIGxpbmsgYWN0aW9uXHJcbiAgICAgICAgICAkKCcuc2hhcmUtdG9nZ2xlLXRyaWdnZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJy5pbmZvLXRvZ2dsZScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICQoJy5zaGFyZS10b2dnbGUtY2xvc2UnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJy5pbmZvLXRvZ2dsZScpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRNdWx0aVRhYlRvZ2dsZUhhbmRsZXJzKCkge1xyXG4gICAgICAgICAgJCgnYm9keScpLmRlbGVnYXRlKG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICB0b2dnbGVCYXNlID0gJHRoaXMuYXR0cignY2xhc3MnKS5tYXRjaCgvdG9nZ2xlLShcXFMqKT8oJHxcXHMpLylbMV0sXHJcbiAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICR0aGlzLnBhcmVudHMobXVsdGlUYWJTZWxlY3Rvcik7XHJcblxyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQobXVsdGlUYWJUb2dnbGVTZWxlY3RvcikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQobXVsdGlUYWJDb250ZW50U2VsZWN0b3IpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQoJy5jb250ZW50LScgKyB0b2dnbGVCYXNlKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZVByb2ZpbGVTbGlkZXIoKSB7XHJcbiAgICAgICAgICB2YXIgJHByb2ZpbGVQYW5lbHMsXHJcbiAgICAgICAgICAgIHByb2ZpbGVQYW5lbEhlaWdodCA9IDA7XHJcblxyXG4gICAgICAgICAgaWYgKHNjcm9sbGVkVG9WaWV3KSB7XHJcbiAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLmZpbmQoJy5zbGljay1zbGlkZScpLnJlbW92ZUNsYXNzKCdzbGljay1jb21wbGV0ZScpO1xyXG4gICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5maW5kKCcuc2xpY2stYWN0aXZlJykuYWRkQ2xhc3MoJ3NsaWNrLWNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgICRwcm9maWxlU2xpZGVyXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5zbGljay1zbGlkZTpub3QoLnNsaWNrLWNvbXBsZXRlKScpXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5wcm9maWxlLWNvdW50ZXIgY2FudmFzJylcclxuICAgICAgICAgICAgICAudHJpZ2dlcignY2xlYXJBbmltYXRlJyk7XHJcbiAgICAgICAgICAgICRwcm9maWxlU2xpZGVyXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5zbGljay1jb21wbGV0ZScpXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5wcm9maWxlLWNvdW50ZXIgY2FudmFzJylcclxuICAgICAgICAgICAgICAudHJpZ2dlcignc3RhcnRBbmltYXRlJyk7XHJcbiAgICAgICAgICAgIGlmICgkcHJvZmlsZVNsaWRlci5maW5kKCcuc2xpY2stYWN0aXZlJykuaXMoJ1tjbGFzcyo9cHJvZmlsZS1dJykgfHwgaXNSZXNwb25zaXZlU3RhdGUpIHtcclxuICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5hZGRDbGFzcygnY29udHJhc3QtYXJyb3cnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5yZW1vdmVDbGFzcygnY29udHJhc3QtYXJyb3cnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkcHJvZmlsZVBhbmVscyA9ICRwcm9maWxlU2xpZGVyLmZpbmQoJy5wcm9maWxlLTEtc2xpZGUsIC5wcm9maWxlLTItc2xpZGUnKTtcclxuICAgICAgICAgICAgJHByb2ZpbGVQYW5lbHMuY3NzKHsgaGVpZ2h0OiAnYXV0bycgfSk7XHJcbiAgICAgICAgICAgICRwcm9maWxlUGFuZWxzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gJCh0aGlzKS5vdXRlckhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgICBpZiAoY3VycmVudCA+IHByb2ZpbGVQYW5lbEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgcHJvZmlsZVBhbmVsSGVpZ2h0ID0gY3VycmVudDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkcHJvZmlsZVBhbmVscy5jc3MoeyBoZWlnaHQ6IHByb2ZpbGVQYW5lbEhlaWdodCB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZVNsaWRlclN0YXRlKHNsaWRlciwgc3RhdGUpIHtcclxuICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwiYWNjZXNzaWJpbGl0eVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcImRyYWdnYWJsZVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcInN3aXBlXCIsIHN0YXRlKTtcclxuICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwidG91Y2hNb3ZlXCIsIHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWRIYW5kbGVXaW5kb3dTaXppbmcoKSB7XHJcbiAgICAgICAgICBpZiAod2luZG93U2l6aW5nRGVsYXkpIHtcclxuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh3aW5kb3dTaXppbmdEZWxheSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgd2luZG93U2l6aW5nRGVsYXkgPSB3aW5kb3cuc2V0VGltZW91dChoYW5kbGVXaW5kb3dTaXppbmcsIDI1MCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZWxheWVkSGFuZGxlV2luZG93U2Nyb2xsKCkge1xyXG4gICAgICAgICAgaWYgKHdpbmRvd1Njcm9sbGluZ0RlbGF5KSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQod2luZG93U2Nyb2xsaW5nRGVsYXkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHdpbmRvd1Njcm9sbGluZ0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQoaGFuZGxlV2luZG93U2Nyb2xsaW5nLCAyNTApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUZyb21IYXNoKGV2ZW50KSB7XHJcbiAgICAgICAgICB2YXIgZnVsbEhhc2hGcmFnbWVudCA9ICcjb3VyLWVkZ2UtJztcclxuICAgICAgICAgIC8vZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBpZiAoIW92ZXJsYXlPcGVuICYmIGxvY2F0aW9uLmhhc2guaW5kZXhPZihmdWxsSGFzaEZyYWdtZW50KSA9PT0gMCkge1xyXG4gICAgICAgICAgICBvdmVybGF5Lm9wZW5PdmVybGF5KFxyXG4gICAgICAgICAgICAgICRlZGdlT3ZlcmxheUxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgIGhhbmRsZU92ZXJsYXlPcGVuLCBoYW5kbGVPdmVybGF5Q2xvc2UsIHRydWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheU9wZW4oZXZlbnQpIHtcclxuICAgICAgICAgIHZhciBpbml0aWFsSW5kZXg7XHJcblxyXG4gICAgICAgICAgaW5pdFNsaWRlcigkb3ZlcmxheVNsaWRlciwge1xyXG4gICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgaW5pdGlhbEluZGV4ID0gJG92ZXJsYXlTbGlkZXJcclxuICAgICAgICAgICAgLmZpbmQoJy4nICsgbG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjb3VyLScsICcnKSArICc6bm90KC5zbGljay1jbG9uZWQpJylcclxuICAgICAgICAgICAgLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnKTtcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCdzbGlja0dvVG8nLCBpbml0aWFsSW5kZXgsIHRydWUpO1xyXG4gICAgICAgICAgJG92ZXJsYXlTbGlkZXIub24oJ2FmdGVyQ2hhbmdlJywgaGFuZGxlU2xpZGVDaGFuZ2UpO1xyXG4gICAgICAgICAgaGFuZGxlU2xpZGVDaGFuZ2UobnVsbCwgbnVsbCwgcGFyc2VJbnQoJCgnI21vZGFsT3ZlcmxheSAuc2xpY2stYWN0aXZlJykuYXR0cignZGF0YS1zbGljay1pbmRleCcpKSk7XHJcbiAgICAgICAgICBoYW5kbGVXaW5kb3dTaXppbmcoKTtcclxuICAgICAgICAgIG92ZXJsYXlPcGVuID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlDbG9zZShldmVudCkge1xyXG4gICAgICAgICAgdmFyIHlQb3MsXHJcbiAgICAgICAgICAgIG92ZXJsYXlDb250ZW50ID0gJCgnI21vZGFsT3ZlcmxheSA+IGRpdicpO1xyXG5cclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCd1bnNsaWNrJyk7XHJcbiAgICAgICAgICAkb3ZlcmxheVNsaWRlci5vZmYoJ2FmdGVyQ2hhbmdlJyk7XHJcbiAgICAgICAgICAkKCcub3ZlcmxheS1yZXBvc2l0b3J5JykuYXBwZW5kKG92ZXJsYXlDb250ZW50KTtcclxuICAgICAgICAgIGlmIChcInB1c2hTdGF0ZVwiIGluIGhpc3RvcnkpXHJcbiAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKFwiXCIsIGRvY3VtZW50LnRpdGxlLCBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCk7XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgeVBvcyA9ICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gXCJcIjtcclxuICAgICAgICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKHlQb3MpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3ZlcmxheU9wZW4gPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVNsaWRlQ2hhbmdlKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlKSB7XHJcbiAgICAgICAgICB2YXIgbmV4dFNsaWRlID0gKGN1cnJlbnRTbGlkZSArIDEpICUgKCQoJy5zbGljay1zbGlkZTpub3QoLnNsaWNrLWNsb25lZCknKS5sZW5ndGggLSAxKSxcclxuICAgICAgICAgICAgbmV4dFRpdGxlID0gJCgkb3ZlcmxheVNsaWRlci5maW5kKCdbZGF0YS1zbGljay1pbmRleD0nICsgbmV4dFNsaWRlICsgJ10gLmNvbHVtbnM6Zmlyc3QtY2hpbGQgcCcpLmdldCgwKSkuaHRtbCgpLFxyXG4gICAgICAgICAgICBuZXdIYXNoID0gJ291ci0nICsgJG92ZXJsYXlTbGlkZXJcclxuICAgICAgICAgICAgICAgIC5maW5kKCdbZGF0YS1zbGljay1pbmRleD0nICsgY3VycmVudFNsaWRlICsgJ10nKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJylcclxuICAgICAgICAgICAgICAgIC5tYXRjaCgvKGVkZ2UtXFxTKikvKVsxXTtcclxuXHJcbiAgICAgICAgICAkKCcjbW9kYWxPdmVybGF5IC5jYXJvdXNlbC1uZXh0IGEnKS5odG1sKG5leHRUaXRsZSk7XHJcbiAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gbmV3SGFzaDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVdpbmRvd1NpemluZyhpbml0KSB7XHJcbiAgICAgICAgICB2YXIgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZUxpbWl0ID0gMCxcclxuICAgICAgICAgICAgbmV3SXNSZXNwb25zaXZlU3RhdGUgPSB3aW5kb3dXaWR0aCA8IHJlc3BvbnNpdmVMaW1pdDtcclxuXHJcbiAgICAgICAgICBpZiAoJG92ZXJsYXlTbGlkZXIuaXMoJy5zbGljay1pbml0aWFsaXplZCcpKSB7XHJcbiAgICAgICAgICAgIGNoYW5nZVNsaWRlclN0YXRlKCRvdmVybGF5U2xpZGVyLCAhbmV3SXNSZXNwb25zaXZlU3RhdGUpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChpc1Jlc3BvbnNpdmVTdGF0ZSAhPT0gbmV3SXNSZXNwb25zaXZlU3RhdGUpIHtcclxuICAgICAgICAgICAgaXNSZXNwb25zaXZlU3RhdGUgPSBuZXdJc1Jlc3BvbnNpdmVTdGF0ZTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoaW5pdCkge1xyXG4gICAgICAgICAgICBpbml0UHJvZmlsZVNsaWRlcigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlV2luZG93U2Nyb2xsaW5nKCkge1xyXG4gICAgICAgICAgaWYgKCFzY3JvbGxlZFRvVmlldykge1xyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpID4gJHByb2ZpbGVTbGlkZXIub2Zmc2V0KCkudG9wKSB7XHJcbiAgICAgICAgICAgICAgc2Nyb2xsZWRUb1ZpZXcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGFuaW1hdGVQcm9maWxlU2xpZGVyLCA1MDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0UHJvZmlsZVNsaWRlcigpIHtcclxuICAgICAgICAgIGluaXRTbGlkZXIoJHByb2ZpbGVTbGlkZXIsIHtcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6IHRydWUsXHJcbiAgICAgICAgICAgIHByZXZBcnJvdzogJzxzcGFuIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNhcm91c2VsLXByZXZcIj48aW1nIHNyYz1cImltYWdlcy9BcnJvdy1NYWluQXJ0aWNsZS1DYXJvdXNlbC1CbGFjay1MLnN2Z1wiPjwvc3Bhbj4nLFxyXG4gICAgICAgICAgICBuZXh0QXJyb3c6ICc8c3BhbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjYXJvdXNlbC1uZXh0XCI+PGltZyBzcmM9XCJpbWFnZXMvQXJyb3ctTWFpbkFydGljbGUtQ2Fyb3VzZWwtQmxhY2stUi5zdmdcIj48L3NwYW4+J1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBhbmltYXRlUHJvZmlsZVNsaWRlcigpO1xyXG4gICAgICAgICAgJHByb2ZpbGVTbGlkZXIub24oJ2FmdGVyQ2hhbmdlJywgYW5pbWF0ZVByb2ZpbGVTbGlkZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdFNsaWRlcih0YXJnZXQsIG9wdGlvbnMpIHtcclxuICAgICAgICAgIHZhciBkZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgc3BlZWQ6IDc1MCxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAyLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMixcclxuICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjgsXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICB0YXJnZXQuc2xpY2soJC5leHRlbmQoZGVmYXVsdHMsIG9wdGlvbnMpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIE92ZXJsYXlNb2R1bGUoKSB7XHJcbiAgICAgICAgdmFyICRvdmVybGF5LFxyXG4gICAgICAgICAgJGJvZHkgPSAkKCdib2R5JyksXHJcbiAgICAgICAgICBvdmVybGF5U2l6aW5nRGVsYXksXHJcbiAgICAgICAgICBjdXJyZW50SW5zdGFuY2UgPSB7fSxcclxuICAgICAgICAgIGlzT3BlbkZsYWcgPSBmYWxzZSxcclxuICAgICAgICAgICRjbG9zZUJ1dHRvbjtcclxuXHJcbiAgICAgICAgaW5pdE92ZXJsYXkoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIG9wZW5PdmVybGF5OiBvcGVuT3ZlcmxheSxcclxuICAgICAgICAgIGlzT3BlbjogaXNPcGVuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdE92ZXJsYXkoKSB7XHJcbiAgICAgICAgICAkb3ZlcmxheSA9ICQoJzxkaXY+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5hdHRyKCdpZCcsICdtb2RhbE92ZXJsYXknKTtcclxuICAgICAgICAgICRvdmVybGF5LmF0dHIoJ2NsYXNzJywgJ3JldmVhbCcpO1xyXG4gICAgICAgICAgJG92ZXJsYXkuYXR0cignZGF0YS1yZXZlYWwnLCB0cnVlKTtcclxuICAgICAgICAgICRib2R5LmFwcGVuZCgkb3ZlcmxheSk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5vbignb3Blbi56Zi5yZXZlYWwnLCBoYW5kbGVPdmVybGF5T3Blbik7XHJcbiAgICAgICAgICAkKHdpbmRvdykub24oJ2Nsb3NlZC56Zi5yZXZlYWwnLCBoYW5kbGVPdmVybGF5Q2xvc2UpO1xyXG4gICAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBkZWxheWVkSGFuZGxlT3ZlcmxheVNpemluZyk7XHJcbiAgICAgICAgICBpbml0Q2xvc2VCdXR0b24oKTtcclxuICAgICAgICAgIG5ldyBGb3VuZGF0aW9uLlJldmVhbCgkb3ZlcmxheSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy0tLS0tXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWRIYW5kbGVPdmVybGF5U2l6aW5nKCkge1xyXG4gICAgICAgICAgaWYgKG92ZXJsYXlTaXppbmdEZWxheSkge1xyXG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KG92ZXJsYXlTaXppbmdEZWxheSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgb3ZlcmxheVNpemluZ0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQob3ZlcmxheVNpemluZywgMjUwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlDbG9zZShldmVudCkge1xyXG4gICAgICAgICAgaXNPcGVuRmxhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZS5jbG9zZSkge1xyXG4gICAgICAgICAgICBjdXJyZW50SW5zdGFuY2UuY2xvc2UoZXZlbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3ZlcmxheVNpemVDbGVhbnVwKCk7XHJcbiAgICAgICAgICBjdXJyZW50SW5zdGFuY2UgPSB7fTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlPcGVuKGV2ZW50KSB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgaXNPcGVuRmxhZyA9IHRydWU7XHJcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2lzLXJldmVhbC1vcGVuJyk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5maW5kKCcqJykuZm91bmRhdGlvbigpO1xyXG4gICAgICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZS5vcGVuKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5vcGVuKGV2ZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIG92ZXJsYXlTaXppbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXRDbG9zZUJ1dHRvbigpIHtcclxuICAgICAgICAgIHZhciAkaW5uZXJTcGFuID0gJCgnPHNwYW4+PC9zcGFuPicpO1xyXG5cclxuICAgICAgICAgICRjbG9zZUJ1dHRvbiA9ICQoJzxidXR0b24gZGF0YS1jbG9zZT48L2J1dHRvbj4nKTtcclxuICAgICAgICAgICRjbG9zZUJ1dHRvbi5hZGRDbGFzcygnY2xvc2UtYnV0dG9uJyk7XHJcbiAgICAgICAgICAkY2xvc2VCdXR0b24uYXR0cignYXJpYS1sYWJlbCcsICdDbG9zZSBtb2RhbCcpO1xyXG4gICAgICAgICAgJGlubmVyU3Bhbi5hdHRyKCdhcmlhLWhpZGRlbicsIHRydWUpO1xyXG4gICAgICAgICAgJGlubmVyU3Bhbi5odG1sKCcmdGltZXM7Jyk7XHJcbiAgICAgICAgICAkY2xvc2VCdXR0b24uYXBwZW5kKCRpbm5lclNwYW4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNPcGVuKCkge1xyXG4gICAgICAgICAgcmV0dXJuIGlzT3BlbkZsYWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvcGVuT3ZlcmxheSh1cmxPck1hcmt1cCwgb3BlbkNhbGxiYWNrLCBjbG9zZUNhbGxiYWNrLCBmdWxsU2NyZWVuKSB7XHJcbiAgICAgICAgICBjdXJyZW50SW5zdGFuY2Uub3BlbiA9IG9wZW5DYWxsYmFjaztcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5jbG9zZSA9IGNsb3NlQ2FsbGJhY2s7XHJcbiAgICAgICAgICBjdXJyZW50SW5zdGFuY2UuZnVsbCA9IGZ1bGxTY3JlZW47XHJcbiAgICAgICAgICBpZiAodHlwZW9mIHVybE9yTWFya3VwID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBvcGVuT3ZlcmxheVdpdGhBamF4KHVybE9yTWFya3VwKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9wZW5PdmVybGF5V2l0aE1hcmt1cCh1cmxPck1hcmt1cCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb3Blbk92ZXJsYXlXaXRoQWpheCh1cmwpIHtcclxuICAgICAgICAgICQuYWpheCh1cmwpLmRvbmUob3Blbk92ZXJsYXlXaXRoTWFya3VwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5PdmVybGF5V2l0aE1hcmt1cChtYXJrdXApIHtcclxuICAgICAgICAgICRvdmVybGF5Lmh0bWwobWFya3VwKTtcclxuICAgICAgICAgICRvdmVybGF5LmFwcGVuZCgkY2xvc2VCdXR0b24pO1xyXG4gICAgICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZS5mdWxsKSB7XHJcbiAgICAgICAgICAgICRvdmVybGF5LmFkZENsYXNzKCdmdWxsJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAkb3ZlcmxheS5mb3VuZGF0aW9uKCdvcGVuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvdmVybGF5U2l6ZUNsZWFudXAoKSB7XHJcbiAgICAgICAgICAkb3ZlcmxheS5yZW1vdmVDbGFzcygnZnVsbCcpO1xyXG4gICAgICAgICAgJG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ3RvdXInKTtcclxuICAgICAgICAgICRvdmVybGF5Lmh0bWwoJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb3ZlcmxheVNpemluZygpIHtcclxuICAgICAgICAgIHZhciBvdmVybGF5SGVpZ2h0ID0gJG92ZXJsYXkuaGVpZ2h0KCksXHJcbiAgICAgICAgICAgIHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICBpZiAob3ZlcmxheUhlaWdodCA+IHdpbmRvd0hlaWdodCkge1xyXG4gICAgICAgICAgICAkb3ZlcmxheS5jc3Moe1xyXG4gICAgICAgICAgICAgIHRvcDogMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ2Z1bGwnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIHZhciB2aWRzID0gW10sIGJyaWdodENvdmU7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBfcGFyc2VWaWRlb3MoKTtcclxuXHJcbiAgICAvLyBNYWtlIHN1cmUgdGhlIFZpZGVvSlMgbWV0aG9kIGlzIGF2YWlsYWJsZSBhbmQgZmlyZSByZWFkeSBldmVudCBoYW5kbGVycyBpZiBzb1xyXG4gICAgLy8gYnJpZ2h0Q292ZSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgIC8vICAgaWYgKCQoJy52anMtcGx1Z2lucy1yZWFkeScpLmxlbmd0aCkge1xyXG4gICAgLy8gICAgIF9icmlnaHRDb3ZlUmVhZHkoKTtcclxuICAgIC8vICAgICBjbGVhckludGVydmFsKGJyaWdodENvdmUpO1xyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9LCA1MDApXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcGFyc2VWaWRlb3MoKSB7XHJcbiAgICB2YXIgJGdyb3VwLFxyXG4gICAgICAkdmlkZW8sXHJcbiAgICAgIGRhdGEgPSB7fSxcclxuICAgICAgcHJlbG9hZE9wdGlvbnMgPSBbJ2F1dG8nLCAnbWV0YWRhdGEnLCAnbm9uZSddXHJcblxyXG4gICAgLy8gRWFjaCBncm91cCBjYW4gZWZmZWN0aXZlbHkgdXNlIGEgZGlmZmVyZW50IHBsYXllciB3aGljaCB3aWxsIG9ubHkgYmUgbG9hZGVkIG9uY2VcclxuICAgICQoJy5pZy12aWRlby1ncm91cCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAkZ3JvdXAgPSAkKHRoaXMpO1xyXG4gICAgICBjb25zb2xlLmxvZygkKHRoaXMpKTtcclxuICAgICAgZGF0YS5hY2NvdW50ID0gJGdyb3VwLmRhdGEoJ2FjY291bnQnKTtcclxuICAgICAgZGF0YS5wbGF5ZXIgPSAkZ3JvdXAuZGF0YSgncGxheWVyJyk7XHJcblxyXG4gICAgICAvLyBMb2FkIHJlcXVpcmVkIEpTIGZvciBhIHBsYXllclxyXG4gICAgICBfaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpO1xyXG5cclxuICAgICAgLy8gTG9vcCB0aHJvdWdoIHZpZGVvJ3NcclxuICAgICAgJGdyb3VwLmZpbmQoJy5pZy12aWRlby1qcycpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgJHZpZGVvID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgLy8gQ2FwdHVyZSBvcHRpb25zIChyZXF1aXJlZClcclxuICAgICAgICBkYXRhLmlkID0gJHZpZGVvLmRhdGEoJ2lkJyk7XHJcblxyXG4gICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyAob3B0aW9uYWwpXHJcbiAgICAgICAgZGF0YS50aXRsZSA9ICR2aWRlby5kYXRhKCd0aXRsZScpID8gJHZpZGVvLmRhdGEoJ3RpdGxlJykgOiAnJztcclxuICAgICAgICBkYXRhLmRlc2NyaXB0aW9uID0gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgPyAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKSA6ICcnO1xyXG4gICAgICAgIGRhdGEuYXV0byA9ICR2aWRlby5kYXRhKCdhdXRvcGxheScpID8gJ2F1dG9wbGF5JyA6ICcnO1xyXG4gICAgICAgIGRhdGEuY3RybCA9ICR2aWRlby5kYXRhKCdjb250cm9scycpID8gJ2NvbnRyb2xzJyA6ICcnO1xyXG4gICAgICAgIGRhdGEucHJlbG9hZCA9IChwcmVsb2FkT3B0aW9ucy5pbmRleE9mKCR2aWRlby5kYXRhKCdwcmVsb2FkJykpID4gLTEpID8gJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSA6ICdhdXRvJztcclxuXHJcbiAgICAgICAgLy8gU3RvcmUgSUQncyBmb3IgYWxsIHZpZGVvJ3Mgb24gdGhlIHBhZ2UgLSBpbiBjYXNlIHdlIHdhbnQgdG8gcnVuIGEgcG9zdC1sb2FkIHByb2Nlc3Mgb24gZWFjaFxyXG4gICAgICAgIHZpZHMucHVzaChkYXRhLmlkKTtcclxuXHJcbiAgICAgICAgLy8gTGV0J3MgcmVwbGFjZSB0aGUgaWctdmlkZW8tanMgJ2RpcmVjdGl2ZScgd2l0aCB0aGUgbmVjZXNzYXJ5IEJyaWdodGNvdmUgY29kZVxyXG4gICAgICAgIF9pbmplY3RUZW1wbGF0ZSgkdmlkZW8sIGRhdGEsIGluZGV4KVxyXG4gICAgICB9KTtcclxuXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2luamVjdEJyaWdodENvdmVKUyhkYXRhKSB7XHJcbiAgICB2YXIgaW5kZXhqcyA9IGA8c2NyaXB0IHNyYz1cIi8vcGxheWVycy5icmlnaHRjb3ZlLm5ldC8ke2RhdGEuYWNjb3VudH0vJHtkYXRhLnBsYXllcn1fZGVmYXVsdC9pbmRleC5taW4uanNcIj48L3NjcmlwdD5gO1xyXG4gICAgJCgnYm9keScpLmFwcGVuZChpbmRleGpzKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9pbmplY3RUZW1wbGF0ZSgkdmlkZW8sIGRhdGEsIGluZGV4KSB7XHJcbiAgICB2YXIgaHRtbCA9IGA8ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyXCI+PHNwYW4gY2xhc3M9XCJ2aWRlby1vdmVybGF5ICR7ZGF0YS5pZH1cIj48L3NwYW4+PGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lci1yZXNwb25zaXZlXCI+PHZpZGVvIGRhdGEtdmlkZW8taWQ9XCIke2RhdGEuaWR9XCIgcHJlbG9hZD1cIiR7ZGF0YS5wcmVsb2FkfVwiIGRhdGEtYWNjb3VudD1cIiR7ZGF0YS5hY2NvdW50fVwiIGRhdGEtcGxheWVyPVwiJHtkYXRhLnBsYXllcn1cIiBkYXRhLWVtYmVkPVwiZGVmYXVsdFwiIGRhdGEtYXBwbGljYXRpb24taWQ9XCIke2luZGV4fVwiIGNsYXNzPVwidmlkZW8tanNcIiBpZD1cIiR7ZGF0YS5pZH1cIiAke2RhdGEuY3RybH0gJHtkYXRhLmF1dG99PjwvdmlkZW8+PC9kaXY+PC9kaXY+PGgyIGNsYXNzPVwidmlkZW8tdGl0bGVcIj4ke2RhdGEudGl0bGV9PC9oMj48cCBjbGFzcz1cInZpZGVvLWRlc2NyaXB0aW9uXCI+JHtkYXRhLmRlc2NyaXB0aW9ufTwvcD5gO1xyXG4gICAgJHZpZGVvLnJlcGxhY2VXaXRoKGh0bWwpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2JyaWdodENvdmVSZWFkeSgpIHtcclxuICAgIHZpZHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgdmlkZW9qcygnIycgKyBlbCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vICQoJy52aWRlby1vdmVybGF5LicrIGVsKS5hZGRDbGFzcygnaGlkZGVuJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBfc2VhcmNoTGVnYWN5Q29kZSgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3NlYXJjaExlZ2FjeUNvZGUoKSB7XHJcblxyXG4vLyBHTE9CQUxTXHJcbiAgICB2YXIgbW9kZWxVcmwgPSAnaHR0cHM6Ly9zZWFyY2guaW52ZXN0b3JzZ3JvdXAuY29tL2FwaS9jd3BzZWFyY2g/JztcclxuICAgIHZhciAkZmllbGQgPSAkKCcjRmluZEFuT2ZmaWNlJyk7XHJcbiAgICB2YXIgbGFuZyA9ICdlbic7XHJcbiAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignL2ZyLycpID4gLTEpIHtcclxuICAgICAgbGFuZyA9ICdmcic7XHJcbiAgICB9XHJcblxyXG4vLyBQcm9jZXNzIHRoZSBsb2NhbCBwcmVmZXRjaGVkIGRhdGFcclxuICAgIHZhciBzdWdnZXN0aW9ucyA9IHt9O1xyXG4gICAgc3VnZ2VzdGlvbnMubG9jYXRpb25zID0gbmV3IEJsb29kaG91bmQoe1xyXG4gICAgICBkYXR1bVRva2VuaXplcjogQmxvb2Rob3VuZC50b2tlbml6ZXJzLndoaXRlc3BhY2UsXHJcbiAgICAgIHF1ZXJ5VG9rZW5pemVyOiBCbG9vZGhvdW5kLnRva2VuaXplcnMud2hpdGVzcGFjZSxcclxuICAgICAgcHJlZmV0Y2g6ICdkYXRhL2NpdGllcy5qc29uJ1xyXG4gICAgfSk7XHJcblxyXG4vLyBHZXQgdGhlIHJlc3VsdHNcclxuICAgIGZ1bmN0aW9uIGdldFNlYXJjaFJlc3VsdHMocGFyYW1zKSB7XHJcbiAgICAgIHBhcmFtcy5zZWFyY2h0eXBlID0gJ29mZmljZSc7XHJcbiAgICAgIHBhcmFtcy5uYW1lID0gJyc7XHJcblxyXG4gICAgICAvLyBNYWtlIHN1cmUgZXJyb3IgbWVzc2FnZSBpcyBoaWRkZW4gZWFjaCB0aW1lXHJcbiAgICAgICQoJy56ZXJvLXJlc3VsdHMnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cclxuICAgICAgJC5nZXRKU09OKG1vZGVsVXJsLCBwYXJhbXMpXHJcbiAgICAgICAgLmFsd2F5cygpXHJcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgIHZhciByZXN1bHQgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdpcy1yZXZlYWwtb3BlbicpO1xyXG4gICAgICAgICAgICAkKCcjc2VhcmNoUmVzdWx0c01vZGFsJykucmVtb3ZlQ2xhc3MoJ2Nsb3NlZCcpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICBkaXNwbGF5U2VhcmNoUmVzdWx0cygnb2ZmaWNlLXRlbXBsYXRlJywgcmVzdWx0KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy56ZXJvLXJlc3VsdHMnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZhaWwoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0RhdGEgY291bGQgbm90IGJlIHJldHJpZXZlZCwgcGxlYXNlIHRyeSBhZ2FpbicsIHJlc3VsdC5zdGF0dXMgKyAnICcgKyByZXN1bHQuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuLy8gQmVjYXVzZSB3ZSBhcmUgb25seSBzZWFyY2hpbmcgZm9yIGNpdGllcywgdGhpcyBmdW5jdGlvbiBpcyBzbGlnaHRseSByZWR1bmRhbnQgLSBsZWF2aW5nIGl0IGluIHBsYWNlIGZvciBub3dcclxuICAgIGZ1bmN0aW9uIHBhcnNlU2VhcmNoU3RyaW5nKCkge1xyXG4gICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgIHZhciBzZWFyY2ggPSAkZmllbGQudmFsKCk7XHJcblxyXG4gICAgICByZXN1bHQuY2l0eSA9ICcnO1xyXG5cclxuICAgICAgLy8gU2VhcmNoIGluIHRoZSBsYW5ndWFnZSBvZiB0aGUgcGFnZVxyXG4gICAgICByZXN1bHQubGFuZyA9IGxhbmc7XHJcbiAgICAgIC8vIFdlIG9ubHkgc2VhcmNoIGNvbnN1bHRhbnRzIGZyb20gdGhpcyBtZXRob2RcclxuICAgICAgcmVzdWx0LnNlYXJjaHR5cGUgPSAnY29uJztcclxuXHJcbiAgICAgIC8vIENoZWNrIHRoZSBzZWFyY2ggc3RyaW5nIGZvciBhIHByZXZpb3VzbHkgZGVmaW5lZCBsb2NhdGlvblxyXG4gICAgICB2YXIgd29yZHMgPSBzZWFyY2guc3BsaXQoJyAnKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vIENoZWNrIGVhY2ggd29yZCBmb3IgYSBjaXR5IGZyb20gdGhlIHByZWRlZmluZWQgbGlzdFxyXG4gICAgICAgIHZhciBjaXR5ID0gc3VnZ2VzdGlvbnMubG9jYXRpb25zLmdldCh3b3Jkc1tpXSk7XHJcbiAgICAgICAgaWYgKGNpdHkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgcmVzdWx0LmNpdHkgPSBjaXR5WzBdO1xyXG4gICAgICAgICAgd29yZHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFyZXN1bHQuY2l0eSkge1xyXG4gICAgICAgIHJlc3VsdC5jaXR5ID0gd29yZHMuam9pbignICcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRpc3BsYXlTZWFyY2hSZXN1bHRzKHRlbXBsYXRlSUQsIGpzb24pIHtcclxuICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJRCkuaW5uZXJIVE1MO1xyXG4gICAgICBNdXN0YWNoZS5wYXJzZSh0ZW1wbGF0ZSk7XHJcbiAgICAgIHZhciByZW5kZXJlZCA9IE11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwganNvbik7XHJcbiAgICAgICQoJyNzZWFyY2hSZXN1bHRzTW9kYWwnKS5hcHBlbmQocmVuZGVyZWQpO1xyXG4gICAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4vL0luaXQgZXZlcnl0aGluZ1xyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vIFRyeSB0byBwcmVkZXRlcm1pbmUgd2hhdCByZXN1bHRzIHNob3VsZCBzaG93XHJcbiAgICAgIC8vIFNldHVwIHRoZSB0eXBlYWhlYWRcclxuICAgICAgJCgnLnR5cGVhaGVhZCcpLnR5cGVhaGVhZCh7XHJcbiAgICAgICAgICBoaWdobGlnaHQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtuYW1lOiAnbG9jYXRpb25zJywgc291cmNlOiBzdWdnZXN0aW9ucy5sb2NhdGlvbnMsIGxpbWl0OiAyfVxyXG4gICAgICApO1xyXG5cclxuICAgICAgLy8gU2V0dXAgdGhlIGZvcm0gc3VibWlzc2lvblxyXG4gICAgICAkKCcuaWctc2VhcmNoJykuc3VibWl0KGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciBwYXJhbXMgPSBwYXJzZVNlYXJjaFN0cmluZygpO1xyXG4gICAgICAgIGdldFNlYXJjaFJlc3VsdHMocGFyYW1zKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBGYWtlIG1vZGFsIC0gQWRkaW5nIGhhbmRsZXIgb24gZG9jdW1lbnQgc28gaXQgZmlyZXMgZGVzcGl0ZSB0aGUgYnV0dG9uIG5vdCBiZWluZyByZW5kZXJlZCB5ZXRcclxuICAgICAgJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcIiNzZWFyY2hSZXN1bHRzTW9kYWwgLmNsb3NlLWJ1dHRvblwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnI3NlYXJjaFJlc3VsdHNNb2RhbCcpLmFkZENsYXNzKCdjbG9zZWQnKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICB9LCA0MDApO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiLyogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBmb3Igcm9sbHVwIChodHRwOi8vcm9sbHVwanMub3JnLykgYW5kXHJcbiBlc3NlbnRpb25hbGx5ICdib290c3RyYXBzJyBvdXIgaWcuY29tICdhcHBsaWNhdGlvbicuXHJcblxyXG4gQWxsIG1vZHVsZXMgc2hvdWxkIGJlIGltcG9ydGVkIGhlcmUgc28gdGhhdCB0aGV5IGNhbiBiZSBpbml0aWFsaXplZCBvblxyXG4gYSBjYXNlLWJ5LWNhc2UgYmFzaXMgKG5vdCBhbGwgcGFnZXMgcmVxdWlyZSB0aGUgaW5pdGlhbGl6YXRpb24gb2YgYSBjYXJvdXNlbFxyXG4gZm9yIGluc3RhbmNlKS5cclxuXHJcbiBBbnkgdGFza3Mgb3IgcHJvY2Vzc2VzIHRoYXQgbmVlZCB0byBiZSBpbml0aWF0ZWQgb24gcGFnZSBsb2FkIHNob3VsZCBsaXZlIGluIHRoaXNcclxuIGZpbGUgYXMgd2VsbC4gQW4gaW5jbHVkZWQgZXhhbXBsZSBpcyBhIG1ldGhvZCB0aGF0IGFkZHMgYW4gJ2VuJyBvciAnZnInIGNsYXNzIHRvXHJcbiB0aGUgYm9keSBiYXNlZCBvbiB0aGUgZ2xvYmFsIGxhbmd1YWdlIHZhcmlhYmxlIHRoYXQgd2UgY2FuIHRoZW4gdXNlIHRvIHdyaXRlIGN1c3RvbVxyXG4gc3R5bGVzIGZvciBlYWNoIGxhbmd1YWdlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBmb3JtcyBmcm9tICcuL2Zvcm1zLmpzJztcclxuaW1wb3J0IGNhcm91c2VsIGZyb20gJy4vY2Fyb3VzZWwuanMnO1xyXG5pbXBvcnQgY2FyZWVycyBmcm9tICcuL2NhcmVlcnMuanMnO1xyXG5pbXBvcnQgdmlkZW8gZnJvbSAnLi92aWRlby5qcyc7XHJcbmltcG9ydCBzZWFyY2ggZnJvbSAnLi9zZWFyY2guanMnO1xyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4vLyBFdmVudCBFbWl0dGVyIHRlc3QgbW9kdWxlc1xyXG4vLyBpbXBvcnQgZXZ0MSBmcm9tICcuL2V2ZW50LXRlc3QtMS5qcyc7XHJcbi8vIGltcG9ydCBldnQyIGZyb20gJy4vZXZlbnQtdGVzdC0yLmpzJztcclxuXHJcbmNvbnN0IGFwcCA9ICgoKSA9PiB7XHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAvLyBJbml0aWFsaXplIEZvdW5kYXRpb25cclxuICAgICQoZG9jdW1lbnQpLmZvdW5kYXRpb24oKTtcclxuXHJcbiAgICAvLyBDaGVjayBmb3IgY29tcG9uZW50c1xyXG4gICAgaWYgKCQoJy5pZy1mb3JtJykubGVuZ3RoKSBmb3Jtcy5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmlnLWNhcm91c2VsJykubGVuZ3RoKSBjYXJvdXNlbC5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmlnLXNlYXJjaCcpLmxlbmd0aCkgc2VhcmNoLmluaXQoKTtcclxuICAgIGlmICgkKCcuaWctY2FyZWVycycpLmxlbmd0aCkgY2FyZWVycy5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmlnLXZpZGVvLWdyb3VwJykubGVuZ3RoKSB2aWRlby5pbml0KCk7XHJcblxyXG4gICAgLy8gQ29tcG9uZW50cyBjYW4gYWxzbyBiZSBzZXR1cCB0byByZWNlaXZlIGFuIEhUTUwgJ3Njb3BlJyAoLmlnLWV2dDEuLi4gLmlnLWV2dDIuLi4uIGV0YylcclxuICAgIC8vIGlmICgkKCcuaWctZXZ0MScpLmxlbmd0aCkgZXZ0MS5pbml0KCcuaWctZXZ0MScpO1xyXG4gICAgLy8gaWYgKCQoJy5pZy1ldnQyJykubGVuZ3RoKSBldnQyLmluaXQoJy5pZy1ldnQyJyk7XHJcblxyXG4gICAgLy8gQWRkIGxhbmd1YWdlIGNsYXNzIHRvIGJvZHlcclxuICAgIF9sYW5ndWFnZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gTGV0J3MgdXNlIGEgZ2xvYmFsIHZhcmlhYmxlIChnbG9iYWwgYXMgaW4gYXZhaWxhYmxlIHRvIGFsbCBvdXIgY29tcG9uZW50cyAtIG5vdCB0aGUgd2luZG93IG9iamVjdCEpXHJcbiAgLy8gdG8gYWRkIGEgY2xhc3MgdG8gdGhlIGJvZHkgdGFnXHJcbiAgZnVuY3Rpb24gX2xhbmd1YWdlKCkge1xyXG4gICAgJCgnYm9keScpLmFkZENsYXNzKGlnLmxhbmcpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9XHJcbn0pKCk7XHJcblxyXG4vLyBCb290c3RyYXAgYXBwXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICBhcHAuaW5pdCgpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbImxhbmciLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiaW5kZXhPZiIsImVtaXR0ZXIiLCJFdmVudEVtaXR0ZXIiLCJlbmRwb2ludFVSTCIsInN1Y2Nlc3NVUkwiLCJjYW5jZWxVUkwiLCIkZm9ybSIsIiRmb3JtV3JhcHBlciIsImluaXQiLCIkIiwiZmluZCIsImRhdGEiLCJfdmFsaWRhdGlvbiIsImpJbnB1dCIsImNoYW5nZSIsIm9iakV2ZW50IiwiYWRkQ2xhc3MiLCJ2YWxpZGF0b3IiLCJzZXREZWZhdWx0cyIsImFkZE1ldGhvZCIsInBvc3RhbCIsImVsZW1lbnQiLCJvcHRpb25hbCIsIm1hdGNoIiwidmFsaWRhdGUiLCJsYWJlbCIsImNsb3Nlc3QiLCJsZW5ndGgiLCJwYXJlbnQiLCJhcHBlbmQiLCJvbiIsInJlcGxhY2UiLCJfcHJvY2VzcyIsImZvcm0iLCJmb3JtRGF0YVJhdyIsImZvcm1EYXRhUGFyc2VkIiwidmFsaWQiLCJyZW1vdmVDbGFzcyIsInNlcmlhbGl6ZUFycmF5IiwiX3BhcnNlIiwiX3N1Ym1pdCIsImFqYXgiLCJzdWNjZXNzIiwibXNnIiwiZXJyb3IiLCJ0byIsIl90b2dnbGVyIiwiaGlkZSIsInNob3ciLCJsb2ciLCJ0b2dnbGVDbGFzcyIsIl9idWlsZENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiJGNhcm91c2VsIiwiZWFjaCIsImluZGV4Iiwic2xpY2siLCJfY2FyZWVyc0xlZ2FjeUNvZGUiLCJmbiIsImluZm9Ub2dnbGUiLCIkcmV2ZWFsIiwiJHJldmVhbENvbnRlbnQiLCIkcmV2ZWFsVHJpZ2dlciIsImZpeGVkSGVpZ2h0Iiwic2V0QXJpYSIsImF0dHIiLCJpbml0VG9nZ2xlIiwiaGFuZGxlUmV2ZWFsVG9nZ2xlIiwicmVzaXplSGFuZGxlciIsInNldFRpbWVvdXQiLCJzZXRSZXZlYWxDb250ZW50SGVpZ2h0IiwiY3NzIiwiaGVpZ2h0IiwiZmluYWxIZWlnaHQiLCJoYXNDbGFzcyIsInNjcm9sbEhlaWdodCIsImpRdWVyeSIsImNpcmNsZUFuaW1hdGlvbiIsIm1heFZhbHVlIiwiY2FudmFzIiwiJGNhbnZhcyIsImNvbnRleHQiLCJkIiwid2lkdGgiLCJwZXJjZW50U3Ryb2tlIiwicmVtYWluaW5nU3Ryb2tlIiwicmFkaXVzIiwiY3VyUGVyYyIsImNpcmMiLCJNYXRoIiwiUEkiLCJxdWFydCIsImRlbGVnYXRlSUQiLCJEYXRlIiwiZ2V0VGltZSIsImlzIiwiZ2V0Q29udGV4dCIsInN0cm9rZVN0eWxlIiwiZmlsbFN0eWxlIiwiZGVsZWdhdGUiLCJjbGVhciIsImFuaW1hdGUiLCJjdXJyZW50IiwibGluZVdpZHRoIiwiYmVnaW5QYXRoIiwiYXJjIiwibWluIiwic3Ryb2tlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiZmlsbFJlY3QiLCJibG9ja0xpbmsiLCIkYmxvY2tMaW5rIiwiZGVzdGluYXRpb24iLCJpbml0QmxvY2siLCJoYW5kbGVDbGljayIsImd1aSIsInZpZGVvIiwib3ZlcmxheSIsImluaXRMZWdhY3kiLCJPdmVybGF5TW9kdWxlIiwiR3VpTW9kdWxlIiwiZSIsInRhcmdldCIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcCIsIm9mZnNldCIsInRvcCIsInNlbGVjdG9yIiwicmVzaXplIiwib3ZlcmxheVJlZmVyZW5jZSIsIm11bHRpVGFiVG9nZ2xlU2VsZWN0b3IiLCJtdWx0aVRhYkNvbnRlbnRTZWxlY3RvciIsIm11bHRpVGFiU2VsZWN0b3IiLCIkZWRnZU92ZXJsYXlMb2NhdGlvbiIsIiRvdmVybGF5U2xpZGVyIiwiJHByb2ZpbGVTbGlkZXIiLCIkcHJvZmlsZVNsaWRlclZpZGVvU2VjdGlvbkhvbGRlciIsIndpbmRvd1NpemluZ0RlbGF5Iiwid2luZG93U2Nyb2xsaW5nRGVsYXkiLCJvdmVybGF5T3BlbiIsImlzUmVzcG9uc2l2ZVN0YXRlIiwic2Nyb2xsZWRUb1ZpZXciLCJpbml0R3VpIiwiZXZlbnQiLCJiYWNrZ3JvdW5kQ29sb3IiLCIkdGhpcyIsInBhcnNlSW50IiwiaHRtbCIsImhhbmRsZU92ZXJsYXlGcm9tSGFzaCIsImRlbGF5ZWRIYW5kbGVXaW5kb3dTaXppbmciLCJkZWxheWVkSGFuZGxlV2luZG93U2Nyb2xsIiwidHJpZ2dlciIsInN0b3BQcm9wYWdhdGlvbiIsImFkZE11bHRpVGFiVG9nZ2xlSGFuZGxlcnMiLCJ0b2dnbGVCYXNlIiwiJGNvbnRhaW5lciIsInBhcmVudHMiLCJhbmltYXRlUHJvZmlsZVNsaWRlciIsIiRwcm9maWxlUGFuZWxzIiwicHJvZmlsZVBhbmVsSGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJjaGFuZ2VTbGlkZXJTdGF0ZSIsInNsaWRlciIsInN0YXRlIiwiY2xlYXJUaW1lb3V0IiwiaGFuZGxlV2luZG93U2l6aW5nIiwiaGFuZGxlV2luZG93U2Nyb2xsaW5nIiwiZnVsbEhhc2hGcmFnbWVudCIsImhhc2giLCJvcGVuT3ZlcmxheSIsImhhbmRsZU92ZXJsYXlPcGVuIiwiaGFuZGxlT3ZlcmxheUNsb3NlIiwiaW5pdGlhbEluZGV4IiwiaGFuZGxlU2xpZGVDaGFuZ2UiLCJ5UG9zIiwib3ZlcmxheUNvbnRlbnQiLCJvZmYiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiZG9jdW1lbnQiLCJ0aXRsZSIsInNlYXJjaCIsInNjcm9sbFRvcCIsImN1cnJlbnRTbGlkZSIsIm5leHRTbGlkZSIsIm5leHRUaXRsZSIsImdldCIsIm5ld0hhc2giLCJ3aW5kb3dXaWR0aCIsInJlc3BvbnNpdmVMaW1pdCIsIm5ld0lzUmVzcG9uc2l2ZVN0YXRlIiwiaW5pdFByb2ZpbGVTbGlkZXIiLCJpbml0U2xpZGVyIiwib3B0aW9ucyIsImRlZmF1bHRzIiwiZXh0ZW5kIiwiJG92ZXJsYXkiLCIkYm9keSIsIm92ZXJsYXlTaXppbmdEZWxheSIsImN1cnJlbnRJbnN0YW5jZSIsImlzT3BlbkZsYWciLCIkY2xvc2VCdXR0b24iLCJpc09wZW4iLCJpbml0T3ZlcmxheSIsImRlbGF5ZWRIYW5kbGVPdmVybGF5U2l6aW5nIiwiRm91bmRhdGlvbiIsIlJldmVhbCIsIm92ZXJsYXlTaXppbmciLCJjbG9zZSIsImZvdW5kYXRpb24iLCJvcGVuIiwiaW5pdENsb3NlQnV0dG9uIiwiJGlubmVyU3BhbiIsInVybE9yTWFya3VwIiwib3BlbkNhbGxiYWNrIiwiY2xvc2VDYWxsYmFjayIsImZ1bGxTY3JlZW4iLCJmdWxsIiwib3Blbk92ZXJsYXlXaXRoQWpheCIsInVybCIsImRvbmUiLCJvcGVuT3ZlcmxheVdpdGhNYXJrdXAiLCJtYXJrdXAiLCJvdmVybGF5U2l6ZUNsZWFudXAiLCJvdmVybGF5SGVpZ2h0Iiwid2luZG93SGVpZ2h0IiwidmlkcyIsImJyaWdodENvdmUiLCJfcGFyc2VWaWRlb3MiLCIkZ3JvdXAiLCIkdmlkZW8iLCJwcmVsb2FkT3B0aW9ucyIsImFjY291bnQiLCJwbGF5ZXIiLCJpZCIsImRlc2NyaXB0aW9uIiwiYXV0byIsImN0cmwiLCJwcmVsb2FkIiwicHVzaCIsIl9pbmplY3RCcmlnaHRDb3ZlSlMiLCJpbmRleGpzIiwiX2luamVjdFRlbXBsYXRlIiwicmVwbGFjZVdpdGgiLCJfc2VhcmNoTGVnYWN5Q29kZSIsIm1vZGVsVXJsIiwiJGZpZWxkIiwiaHJlZiIsInN1Z2dlc3Rpb25zIiwibG9jYXRpb25zIiwiQmxvb2Rob3VuZCIsInRva2VuaXplcnMiLCJ3aGl0ZXNwYWNlIiwiZ2V0U2VhcmNoUmVzdWx0cyIsInBhcmFtcyIsInNlYXJjaHR5cGUiLCJuYW1lIiwiZ2V0SlNPTiIsImFsd2F5cyIsInJlc3VsdCIsIkpTT04iLCJwYXJzZSIsImZhaWwiLCJzdGF0dXMiLCJzdGF0dXNUZXh0IiwicGFyc2VTZWFyY2hTdHJpbmciLCJ2YWwiLCJjaXR5Iiwid29yZHMiLCJzcGxpdCIsImkiLCJzcGxpY2UiLCJqb2luIiwiZGlzcGxheVNlYXJjaFJlc3VsdHMiLCJ0ZW1wbGF0ZUlEIiwianNvbiIsInRlbXBsYXRlIiwiZ2V0RWxlbWVudEJ5SWQiLCJpbm5lckhUTUwiLCJyZW5kZXJlZCIsIk11c3RhY2hlIiwicmVuZGVyIiwidHlwZWFoZWFkIiwic291cmNlIiwibGltaXQiLCJzdWJtaXQiLCJhcHAiLCJmb3JtcyIsImNhcm91c2VsIiwiY2FyZWVycyIsIl9sYW5ndWFnZSIsImlnIiwicmVhZHkiXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7Ozs7Ozs7QUFTQSxBQUFPOzs7QUFLUCxBQUFPLElBQUlBLE9BQVEsWUFBTTtNQUNuQkMsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBeUJDLE9BQXpCLENBQWlDLE1BQWpDLE1BQTZDLENBQUMsQ0FBbEQsRUFBcUQ7V0FDNUMsSUFBUDtHQURGLE1BRU87V0FDRSxJQUFQOztDQUpjLEVBQVg7OztBQVNQLEFBQU87OztBQUtQLEFBQU8sSUFBSUMsVUFBVSxJQUFJQyxZQUFKLEVBQWQ7O0FDMUJQLFlBQWUsQ0FBQyxZQUFNOztNQUVoQkMsV0FBSixFQUNFQyxVQURGLEVBRUVDLFNBRkYsRUFHRUMsS0FIRixFQUlFQyxZQUpGOztXQU1TQyxJQUFULEdBQWdCOzttQkFFQ0MsRUFBRSxVQUFGLENBQWY7WUFDUUYsYUFBYUcsSUFBYixDQUFrQixNQUFsQixDQUFSO2tCQUNjSCxhQUFhRyxJQUFiLENBQWtCLE1BQWxCLEVBQTBCQyxJQUExQixDQUErQixVQUEvQixDQUFkO2dCQUNZSixhQUFhRyxJQUFiLENBQWtCLE1BQWxCLEVBQTBCQyxJQUExQixDQUErQixRQUEvQixDQUFaOzs7Ozs7V0FNT0MsV0FBVCxHQUF1Qjs7UUFFakJDLFNBQVNKLEVBQUUsa0JBQUYsQ0FBYjtXQUNPSyxNQUFQLENBQWMsVUFBVUMsUUFBVixFQUFvQjtRQUM5QixJQUFGLEVBQVFDLFFBQVIsQ0FBaUIsT0FBakI7S0FERjs7TUFJRUMsU0FBRixDQUFZQyxXQUFaLENBQXdCO2FBQ2YsSUFEZTtlQUViO0tBRlg7O01BS0VELFNBQUYsQ0FBWUUsU0FBWixDQUFzQixXQUF0QixFQUFtQyxVQUFVQyxNQUFWLEVBQWtCQyxPQUFsQixFQUEy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