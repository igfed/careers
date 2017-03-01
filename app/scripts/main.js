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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvY2FyZWVycy5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL3NlYXJjaC5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgZmlsZSBpcyBmb3IgbWV0aG9kcyBhbmQgdmFyaWFibGVzIHRoYXQgYXJlIGdvaW5nIHRvIGJlXHJcbnVzZWZ1bCBhY3Jvc3MgYWxsIG1vZHVsZXMuIEluIG9yZGVyIHRvIHVzZSB0aGVtIGFueXdoZXJlLCBpbXBvcnQgd2l0aDpcclxuXHJcbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4gYW5kIHRoZW4gY2FsbCB3aXRoIHRoZSBpZyBuYW1lc3BhY2UgKGkuZS4sIGlnLnBhdGhuYW1lLCBpZy5sYW5nLCBldGMpXHJcbiAqL1xyXG5cclxuLy8gdXJsIHBhdGhcclxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XHJcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxufSkoKVxyXG5cclxuLy8gbGFuZ3VhZ2VcclxuZXhwb3J0IHZhciBsYW5nID0gKCgpID0+IHtcclxuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgIHJldHVybiAnZnInO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gJ2VuJztcclxuICB9XHJcbn0pKClcclxuXHJcbi8vIGJyb3dzZXIgd2lkdGhcclxuZXhwb3J0IHZhciBicm93c2VyV2lkdGggPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcclxufSkoKVxyXG5cclxuLy8gYmFzZSBldmVudEVtaXR0ZXJcclxuZXhwb3J0IHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICB2YXIgZW5kcG9pbnRVUkwsXHJcbiAgICBzdWNjZXNzVVJMLFxyXG4gICAgY2FuY2VsVVJMLFxyXG4gICAgJGZvcm0sXHJcbiAgICAkZm9ybVdyYXBwZXI7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xyXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcclxuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xyXG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcclxuXHJcbiAgICBfdmFsaWRhdGlvbigpO1xyXG4gICAgX3RvZ2dsZXIoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcclxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XHJcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZSxcclxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XHJcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcclxuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xyXG5cclxuICAgICRmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDYXJvdXNlbCBJbml0aWFsaXplZCEnKVxyXG5cclxuICAgIC8vIE5vdCBzdXJlIHdoYXQgdGhpcyBkb2VzIGF0IHRoaXMgcG9pbnQgb3IgaG93IGl0IHJlbGF0ZXMgdG8gQ2Fyb3VzZWxzXHJcbiAgICAkKCdbZGF0YS1yZXNwb25zaXZlLXRvZ2dsZV0gYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ3NpdGUtaGVhZGVyLWlzLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgX2J1aWxkQ2Fyb3VzZWwoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9idWlsZENhcm91c2VsKCkge1xyXG4gICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgbmV4dEFycm93LFxyXG4gICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgJCgnLmlnLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXHJcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxyXG4gICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgX2NhcmVlcnNMZWdhY3lDb2RlKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfY2FyZWVyc0xlZ2FjeUNvZGUoKSB7XHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuXHJcbiAgICAgICQuZm4uaW5mb1RvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyICRyZXZlYWwgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAkcmV2ZWFsQ29udGVudCA9ICRyZXZlYWwuZmluZCgnLmluZm8tdG9nZ2xlLWNvbnRlbnQnKSxcclxuICAgICAgICAgICAgJHJldmVhbFRyaWdnZXIgPSAkcmV2ZWFsLmZpbmQoJy5pbmZvLXRvZ2dsZS10cmlnZ2VyJyksXHJcbiAgICAgICAgICAgIGZpeGVkSGVpZ2h0ID0gZmFsc2UsXHJcbiAgICAgICAgICAgIHNldEFyaWEgPSAkcmV2ZWFsLmF0dHIoJ2luZm8tdG9nZ2xlLWFyaWEnKSA9PT0gJ3RydWUnO1xyXG5cclxuICAgICAgICAgIGluaXRUb2dnbGUoKTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBpbml0VG9nZ2xlKCkge1xyXG4gICAgICAgICAgICAkcmV2ZWFsVHJpZ2dlci5vbignY2xpY2snLCBoYW5kbGVSZXZlYWxUb2dnbGUpO1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXIpO1xyXG5cclxuICAgICAgICAgICAgc2V0UmV2ZWFsQ29udGVudEhlaWdodCgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVSZXZlYWxUb2dnbGUoKSB7XHJcbiAgICAgICAgICAgIHNldFJldmVhbENvbnRlbnRIZWlnaHQoKTtcclxuICAgICAgICAgICAgJHJldmVhbC50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHNldFJldmVhbENvbnRlbnRIZWlnaHQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIHJlc2l6ZUhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIGlmIChmaXhlZEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmNzcyh7IGhlaWdodDogJ2F1dG8nIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gc2V0UmV2ZWFsQ29udGVudEhlaWdodCgpIHtcclxuICAgICAgICAgICAgdmFyIGZpbmFsSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgaWYgKCRyZXZlYWwuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgZmluYWxIZWlnaHQgPSAkcmV2ZWFsQ29udGVudFswXS5zY3JvbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgZml4ZWRIZWlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGZpbmFsSGVpZ2h0ID0gMDtcclxuICAgICAgICAgICAgICBmaXhlZEhlaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmNzcyh7IGhlaWdodDogZmluYWxIZWlnaHQgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2V0QXJpYSkge1xyXG4gICAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgIWZpeGVkSGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfTtcclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuXHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuICAgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICAgJC5mbi5jaXJjbGVBbmltYXRpb24gPSBmdW5jdGlvbiAobWF4VmFsdWUpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyIGNhbnZhcyA9IHRoaXMsXHJcbiAgICAgICAgICAgICRjYW52YXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBjb250ZXh0LFxyXG4gICAgICAgICAgICBkID0gY2FudmFzLndpZHRoIC8gMixcclxuICAgICAgICAgICAgcGVyY2VudFN0cm9rZSA9IDcsXHJcbiAgICAgICAgICAgIHJlbWFpbmluZ1N0cm9rZSA9IDEsXHJcbiAgICAgICAgICAgIHJhZGl1cyA9IGQgLSBwZXJjZW50U3Ryb2tlLFxyXG4gICAgICAgICAgICBjdXJQZXJjID0gMCxcclxuICAgICAgICAgICAgY2lyYyA9IE1hdGguUEkgKiAyLFxyXG4gICAgICAgICAgICBxdWFydCA9IE1hdGguUEkgLyAyLFxyXG4gICAgICAgICAgICBkZWxlZ2F0ZUlEID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgKyAnQ0EnO1xyXG5cclxuICAgICAgICAgIGlmICghJGNhbnZhcy5pcygnY2FudmFzJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzBkMjYzYyc7XHJcbiAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjZTVlOGU4JztcclxuXHJcbiAgICAgICAgICAkY2FudmFzLmF0dHIoJ2NpcmNsZS1hbmltYXRpb24taWQnLCBkZWxlZ2F0ZUlEKTtcclxuICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZSgnW2NpcmNsZS1hbmltYXRpb24taWQ9JyArIGRlbGVnYXRlSUQgKyAnXScsICdzdGFydEFuaW1hdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGN1clBlcmMgPSAwO1xyXG4gICAgICAgICAgICBhbmltYXRlKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZSgnW2NpcmNsZS1hbmltYXRpb24taWQ9JyArIGRlbGVnYXRlSUQgKyAnXScsICdjbGVhckFuaW1hdGUnLCBjbGVhcik7XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZShjdXJyZW50KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50ID8gY3VycmVudCA6IDA7XHJcbiAgICAgICAgICAgIGNsZWFyKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gcGVyY2VudFN0cm9rZTtcclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1NYXRoLm1pbihjdXJyZW50LCBtYXhWYWx1ZSAvIDEwMCkpIC0gcXVhcnQsIHRydWUpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHJlbWFpbmluZ1N0cm9rZTtcclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1jdXJyZW50KSAtIHF1YXJ0LCB0cnVlKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICAgICAgY3VyUGVyYysrO1xyXG4gICAgICAgICAgICBpZiAoY3VyUGVyYyA8IDExMCkge1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZShjdXJQZXJjIC8gMTAwKVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gY2xlYXIoKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMud2lkdGgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfTtcclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAkLmZuLmJsb2NrTGluayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyICRibG9ja0xpbmsgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBkZXN0aW5hdGlvbiA9ICRibG9ja0xpbmsuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgICAgIC8vIGRlc3RpbmF0aW9uID0gJzQ0NDIuYXNweC8nICsgZGVzdGluYXRpb247XHJcbiAgICAgICAgICBpbml0QmxvY2soKTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBpbml0QmxvY2soKSB7XHJcbiAgICAgICAgICAgICRibG9ja0xpbmsub24oJ2NsaWNrJywgaGFuZGxlQ2xpY2spO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVDbGljaygpIHtcclxuICAgICAgICAgICAgLy9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgbG9jYXRpb24gPSBkZXN0aW5hdGlvbjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH07XHJcblxyXG4gICAgfSkoalF1ZXJ5KTtcclxuXHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuICAgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICAgdmFyIGd1aSxcclxuICAgICAgICB2aWRlbyxcclxuICAgICAgICBvdmVybGF5O1xyXG5cclxuICAgICAgaW5pdExlZ2FjeSgpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gaW5pdExlZ2FjeSgpIHtcclxuICAgICAgICAvLyBUaGlzIGlzIHdlaXJkIC0gbm90IGdvaW5nIHRvIHRvdWNoIGl0XHJcbiAgICAgICAgb3ZlcmxheSA9IG5ldyBPdmVybGF5TW9kdWxlKCk7XHJcbiAgICAgICAgZ3VpID0gbmV3IEd1aU1vZHVsZShvdmVybGF5KTtcclxuICAgICAgICAvLyB2aWRlbyA9IG5ldyBWaWRlb01vZHVsZSgpOyAvLyBSZXBsYWNlIHdpdGggdmlkZW8uanMgbW9kdWxlXHJcblxyXG4gICAgICAgIC8vIE5lZWQgdG8gaGF2ZSBhIGNsYXNzIHRvIGhvb2sgb250byBmb3IgRnJlbmNoIGxhbmd1YWdlIHBhZ2VcclxuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnZnInKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNtb290aCBzY3JvbGxpbmcgZm9yIGFuY2hvciBsaW5rc1xyXG4gICAgICAgICQoJ2FbaHJlZl49XCIjXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xyXG4gICAgICAgICAgaWYgKHRhcmdldC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgIHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcCArIDUyXHJcbiAgICAgICAgICAgIH0sIDc1MCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRhcmdldC5zZWxlY3RvciAhPT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgJCgnI21haW4tbWVudS1hbmNob3InKS5jc3MoeyAnZGlzcGxheSc6ICdub25lJyB9KTtcclxuICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdpcy1yZXZlYWwtb3BlbiBicmFuZGVkJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIE1vYmlsZSBtZW51IG5lZWRzIHRvIG1pbWljIEZvdW5kYXRpb24gcmV2ZWFsIC0gbm90IGVub3VnaCB0aW1lIHRvIGltcGxlbWVudCBkaWZmZXJlbnQgbmF2cyBpbiBhIHJldmVhbCBtb2RhbCBwcm9wZXJseVxyXG4gICAgICAgICQoJy5tZW51LWljb24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdpcy1yZXZlYWwtb3BlbiBicmFuZGVkJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHF1aWNrIGFuZCBkaXJ0eSBtb2JpbGUgbWVudSBjbG9zZXMgLSBub3QgZmFtaWxpYXIgd2l0aCBGb3VuZGF0aW9uIHBhdHRlcm4gdG8gZmlyZSB0aGVzZVxyXG4gICAgICAgICQoJy50b3AtYmFyIC5jbG9zZS1idXR0b24uc2hvdy1mb3Itc21hbGwtb25seScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQoJyNtYWluLW1lbnUtYW5jaG9yJykuY3NzKHsgJ2Rpc3BsYXknOiAnbm9uZScgfSk7XHJcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2lzLXJldmVhbC1vcGVuIGJyYW5kZWQnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA2NDApIHtcclxuICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdicmFuZGVkJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIEd1aU1vZHVsZShvdmVybGF5UmVmZXJlbmNlKSB7XHJcbiAgICAgICAgdmFyIG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IgPSAnW2NsYXNzKj1cInRvZ2dsZS1cIl06bm90KFtjbGFzcyo9XCJpbmZvLXRvZ2dsZVwiXSknLFxyXG4gICAgICAgICAgbXVsdGlUYWJDb250ZW50U2VsZWN0b3IgPSAnW2NsYXNzKj1cImNvbnRlbnQtXCJdJyxcclxuICAgICAgICAgIG11bHRpVGFiU2VsZWN0b3IgPSAnLm11bHRpLXRhYi1vdXRsaW5lJyxcclxuICAgICAgICAgICRlZGdlT3ZlcmxheUxvY2F0aW9uID0gJCgnI2VkZ2Utb3ZlcmxheS1jb250ZW50JyksXHJcbiAgICAgICAgICBvdmVybGF5ID0gb3ZlcmxheVJlZmVyZW5jZSxcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLFxyXG4gICAgICAgICAgJHByb2ZpbGVTbGlkZXIsXHJcbiAgICAgICAgICAkcHJvZmlsZVNsaWRlclZpZGVvU2VjdGlvbkhvbGRlciA9ICQoJzxkaXY+PC9kaXY+JyksXHJcbiAgICAgICAgICB3aW5kb3dTaXppbmdEZWxheSxcclxuICAgICAgICAgIHdpbmRvd1Njcm9sbGluZ0RlbGF5LFxyXG4gICAgICAgICAgb3ZlcmxheU9wZW4sXHJcbiAgICAgICAgICBpc1Jlc3BvbnNpdmVTdGF0ZSA9IGZhbHNlLFxyXG4gICAgICAgICAgc2Nyb2xsZWRUb1ZpZXcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaW5pdEd1aSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0R3VpKCkge1xyXG4gICAgICAgICAgYWRkTXVsdGlUYWJUb2dnbGVIYW5kbGVycygpO1xyXG4gICAgICAgICAgJCgnLmJsb2NrLWxpbmsnKS5ibG9ja0xpbmsoKTtcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyID0gJCgnLm91ci1idXNpbmVzcy1zbGlkZXInKTtcclxuICAgICAgICAgICQoJyNlZGdlLW92ZXJsYXktY29udGVudCcpLmZpbmQoJy5jYXJvdXNlbC1uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCdzbGlja05leHQnKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGlmICgkKFwiLnZpZGVvLXNsaWRlLnNsaWNrLWFjdGl2ZVwiKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJCgnLnNsaWNrLWxpc3QuZHJhZ2dhYmxlJykuY3NzKHsgaGVpZ2h0OiAnNjYwcHgnIH0pO1xyXG4gICAgICAgICAgICAkKCcuc2VjdGlvbi5wcm9maWxlcy1zbGlkZXInKS5jc3MoeyBiYWNrZ3JvdW5kQ29sb3I6ICcjZTVlOGU4JyB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy5zbGljay1saXN0LmRyYWdnYWJsZScpLmNzcyh7IGhlaWdodDogJ2F1dG8nIH0pO1xyXG4gICAgICAgICAgICAkKCcuc2VjdGlvbi5wcm9maWxlcy1zbGlkZXInKS5jc3MoeyBiYWNrZ3JvdW5kQ29sb3I6ICcjN2VjNGI5JyB9KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAkKCcucHJvZmlsZS1jb3VudGVyJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAkdGhpcy5maW5kKCdjYW52YXMnKS5jaXJjbGVBbmltYXRpb24ocGFyc2VJbnQoJHRoaXMuZmluZCgncCcpLmh0bWwoKSkpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICAkcHJvZmlsZVNsaWRlciA9ICQoJy5wcm9maWxlcy1zbGlkZXInKTtcclxuICAgICAgICAgICQod2luZG93KS5vbignaGFzaGNoYW5nZScsIGhhbmRsZU92ZXJsYXlGcm9tSGFzaCk7XHJcbiAgICAgICAgICBoYW5kbGVPdmVybGF5RnJvbUhhc2goKTtcclxuICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZGVsYXllZEhhbmRsZVdpbmRvd1NpemluZyk7XHJcbiAgICAgICAgICBoYW5kbGVXaW5kb3dTaXppbmcodHJ1ZSk7XHJcbiAgICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGRlbGF5ZWRIYW5kbGVXaW5kb3dTY3JvbGwpO1xyXG4gICAgICAgICAgaGFuZGxlV2luZG93U2Nyb2xsaW5nKCk7XHJcblxyXG4gICAgICAgICAgJCgnLmluZm8tdG9nZ2xlJykuaW5mb1RvZ2dsZSgpO1xyXG4gICAgICAgICAgJCgnLnRvcC1iYXIgKyAuc2NyZWVuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCdhW2RhdGEtdG9nZ2xlXScpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAvLyBOb3QgcHJldHR5IC0ganVzdCBhZGRpbmcgcXVpY2sgYW5kIGRpcnR5IHNoYXJlIGxpbmsgYWN0aW9uXHJcbiAgICAgICAgICAkKCcuc2hhcmUtdG9nZ2xlLXRyaWdnZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJy5pbmZvLXRvZ2dsZScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICQoJy5zaGFyZS10b2dnbGUtY2xvc2UnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJy5pbmZvLXRvZ2dsZScpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRNdWx0aVRhYlRvZ2dsZUhhbmRsZXJzKCkge1xyXG4gICAgICAgICAgJCgnYm9keScpLmRlbGVnYXRlKG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICB0b2dnbGVCYXNlID0gJHRoaXMuYXR0cignY2xhc3MnKS5tYXRjaCgvdG9nZ2xlLShcXFMqKT8oJHxcXHMpLylbMV0sXHJcbiAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICR0aGlzLnBhcmVudHMobXVsdGlUYWJTZWxlY3Rvcik7XHJcblxyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQobXVsdGlUYWJUb2dnbGVTZWxlY3RvcikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQobXVsdGlUYWJDb250ZW50U2VsZWN0b3IpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQoJy5jb250ZW50LScgKyB0b2dnbGVCYXNlKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZVByb2ZpbGVTbGlkZXIoKSB7XHJcbiAgICAgICAgICB2YXIgJHByb2ZpbGVQYW5lbHMsXHJcbiAgICAgICAgICAgIHByb2ZpbGVQYW5lbEhlaWdodCA9IDA7XHJcblxyXG4gICAgICAgICAgaWYgKHNjcm9sbGVkVG9WaWV3KSB7XHJcbiAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLmZpbmQoJy5zbGljay1zbGlkZScpLnJlbW92ZUNsYXNzKCdzbGljay1jb21wbGV0ZScpO1xyXG4gICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5maW5kKCcuc2xpY2stYWN0aXZlJykuYWRkQ2xhc3MoJ3NsaWNrLWNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgICRwcm9maWxlU2xpZGVyXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5zbGljay1zbGlkZTpub3QoLnNsaWNrLWNvbXBsZXRlKScpXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5wcm9maWxlLWNvdW50ZXIgY2FudmFzJylcclxuICAgICAgICAgICAgICAudHJpZ2dlcignY2xlYXJBbmltYXRlJyk7XHJcbiAgICAgICAgICAgICRwcm9maWxlU2xpZGVyXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5zbGljay1jb21wbGV0ZScpXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5wcm9maWxlLWNvdW50ZXIgY2FudmFzJylcclxuICAgICAgICAgICAgICAudHJpZ2dlcignc3RhcnRBbmltYXRlJyk7XHJcbiAgICAgICAgICAgIGlmICgkcHJvZmlsZVNsaWRlci5maW5kKCcuc2xpY2stYWN0aXZlJykuaXMoJ1tjbGFzcyo9cHJvZmlsZS1dJykgfHwgaXNSZXNwb25zaXZlU3RhdGUpIHtcclxuICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5hZGRDbGFzcygnY29udHJhc3QtYXJyb3cnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5yZW1vdmVDbGFzcygnY29udHJhc3QtYXJyb3cnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkcHJvZmlsZVBhbmVscyA9ICRwcm9maWxlU2xpZGVyLmZpbmQoJy5wcm9maWxlLTEtc2xpZGUsIC5wcm9maWxlLTItc2xpZGUnKTtcclxuICAgICAgICAgICAgJHByb2ZpbGVQYW5lbHMuY3NzKHsgaGVpZ2h0OiAnYXV0bycgfSk7XHJcbiAgICAgICAgICAgICRwcm9maWxlUGFuZWxzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gJCh0aGlzKS5vdXRlckhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgICBpZiAoY3VycmVudCA+IHByb2ZpbGVQYW5lbEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgcHJvZmlsZVBhbmVsSGVpZ2h0ID0gY3VycmVudDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkcHJvZmlsZVBhbmVscy5jc3MoeyBoZWlnaHQ6IHByb2ZpbGVQYW5lbEhlaWdodCB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZVNsaWRlclN0YXRlKHNsaWRlciwgc3RhdGUpIHtcclxuICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwiYWNjZXNzaWJpbGl0eVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcImRyYWdnYWJsZVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcInN3aXBlXCIsIHN0YXRlKTtcclxuICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwidG91Y2hNb3ZlXCIsIHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWRIYW5kbGVXaW5kb3dTaXppbmcoKSB7XHJcbiAgICAgICAgICBpZiAod2luZG93U2l6aW5nRGVsYXkpIHtcclxuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh3aW5kb3dTaXppbmdEZWxheSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgd2luZG93U2l6aW5nRGVsYXkgPSB3aW5kb3cuc2V0VGltZW91dChoYW5kbGVXaW5kb3dTaXppbmcsIDI1MCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZWxheWVkSGFuZGxlV2luZG93U2Nyb2xsKCkge1xyXG4gICAgICAgICAgaWYgKHdpbmRvd1Njcm9sbGluZ0RlbGF5KSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQod2luZG93U2Nyb2xsaW5nRGVsYXkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHdpbmRvd1Njcm9sbGluZ0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQoaGFuZGxlV2luZG93U2Nyb2xsaW5nLCAyNTApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUZyb21IYXNoKGV2ZW50KSB7XHJcbiAgICAgICAgICB2YXIgZnVsbEhhc2hGcmFnbWVudCA9ICcjb3VyLWVkZ2UtJztcclxuICAgICAgICAgIC8vZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBpZiAoIW92ZXJsYXlPcGVuICYmIGxvY2F0aW9uLmhhc2guaW5kZXhPZihmdWxsSGFzaEZyYWdtZW50KSA9PT0gMCkge1xyXG4gICAgICAgICAgICBvdmVybGF5Lm9wZW5PdmVybGF5KFxyXG4gICAgICAgICAgICAgICRlZGdlT3ZlcmxheUxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgIGhhbmRsZU92ZXJsYXlPcGVuLCBoYW5kbGVPdmVybGF5Q2xvc2UsIHRydWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheU9wZW4oZXZlbnQpIHtcclxuICAgICAgICAgIHZhciBpbml0aWFsSW5kZXg7XHJcblxyXG4gICAgICAgICAgaW5pdFNsaWRlcigkb3ZlcmxheVNsaWRlciwge1xyXG4gICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgaW5pdGlhbEluZGV4ID0gJG92ZXJsYXlTbGlkZXJcclxuICAgICAgICAgICAgLmZpbmQoJy4nICsgbG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjb3VyLScsICcnKSArICc6bm90KC5zbGljay1jbG9uZWQpJylcclxuICAgICAgICAgICAgLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnKTtcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCdzbGlja0dvVG8nLCBpbml0aWFsSW5kZXgsIHRydWUpO1xyXG4gICAgICAgICAgJG92ZXJsYXlTbGlkZXIub24oJ2FmdGVyQ2hhbmdlJywgaGFuZGxlU2xpZGVDaGFuZ2UpO1xyXG4gICAgICAgICAgaGFuZGxlU2xpZGVDaGFuZ2UobnVsbCwgbnVsbCwgcGFyc2VJbnQoJCgnI21vZGFsT3ZlcmxheSAuc2xpY2stYWN0aXZlJykuYXR0cignZGF0YS1zbGljay1pbmRleCcpKSk7XHJcbiAgICAgICAgICBoYW5kbGVXaW5kb3dTaXppbmcoKTtcclxuICAgICAgICAgIG92ZXJsYXlPcGVuID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlDbG9zZShldmVudCkge1xyXG4gICAgICAgICAgdmFyIHlQb3MsXHJcbiAgICAgICAgICAgIG92ZXJsYXlDb250ZW50ID0gJCgnI21vZGFsT3ZlcmxheSA+IGRpdicpO1xyXG5cclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCd1bnNsaWNrJyk7XHJcbiAgICAgICAgICAkb3ZlcmxheVNsaWRlci5vZmYoJ2FmdGVyQ2hhbmdlJyk7XHJcbiAgICAgICAgICAkKCcub3ZlcmxheS1yZXBvc2l0b3J5JykuYXBwZW5kKG92ZXJsYXlDb250ZW50KTtcclxuICAgICAgICAgIGlmIChcInB1c2hTdGF0ZVwiIGluIGhpc3RvcnkpXHJcbiAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKFwiXCIsIGRvY3VtZW50LnRpdGxlLCBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCk7XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgeVBvcyA9ICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gXCJcIjtcclxuICAgICAgICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKHlQb3MpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3ZlcmxheU9wZW4gPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVNsaWRlQ2hhbmdlKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlKSB7XHJcbiAgICAgICAgICB2YXIgbmV4dFNsaWRlID0gKGN1cnJlbnRTbGlkZSArIDEpICUgKCQoJy5zbGljay1zbGlkZTpub3QoLnNsaWNrLWNsb25lZCknKS5sZW5ndGggLSAxKSxcclxuICAgICAgICAgICAgbmV4dFRpdGxlID0gJCgkb3ZlcmxheVNsaWRlci5maW5kKCdbZGF0YS1zbGljay1pbmRleD0nICsgbmV4dFNsaWRlICsgJ10gLmNvbHVtbnM6Zmlyc3QtY2hpbGQgcCcpLmdldCgwKSkuaHRtbCgpLFxyXG4gICAgICAgICAgICBuZXdIYXNoID0gJ291ci0nICsgJG92ZXJsYXlTbGlkZXJcclxuICAgICAgICAgICAgICAgIC5maW5kKCdbZGF0YS1zbGljay1pbmRleD0nICsgY3VycmVudFNsaWRlICsgJ10nKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJylcclxuICAgICAgICAgICAgICAgIC5tYXRjaCgvKGVkZ2UtXFxTKikvKVsxXTtcclxuXHJcbiAgICAgICAgICAkKCcjbW9kYWxPdmVybGF5IC5jYXJvdXNlbC1uZXh0IGEnKS5odG1sKG5leHRUaXRsZSk7XHJcbiAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gbmV3SGFzaDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVdpbmRvd1NpemluZyhpbml0KSB7XHJcbiAgICAgICAgICB2YXIgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZUxpbWl0ID0gMCxcclxuICAgICAgICAgICAgbmV3SXNSZXNwb25zaXZlU3RhdGUgPSB3aW5kb3dXaWR0aCA8IHJlc3BvbnNpdmVMaW1pdDtcclxuXHJcbiAgICAgICAgICBpZiAoJG92ZXJsYXlTbGlkZXIuaXMoJy5zbGljay1pbml0aWFsaXplZCcpKSB7XHJcbiAgICAgICAgICAgIGNoYW5nZVNsaWRlclN0YXRlKCRvdmVybGF5U2xpZGVyLCAhbmV3SXNSZXNwb25zaXZlU3RhdGUpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChpc1Jlc3BvbnNpdmVTdGF0ZSAhPT0gbmV3SXNSZXNwb25zaXZlU3RhdGUpIHtcclxuICAgICAgICAgICAgaXNSZXNwb25zaXZlU3RhdGUgPSBuZXdJc1Jlc3BvbnNpdmVTdGF0ZTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoaW5pdCkge1xyXG4gICAgICAgICAgICBpbml0UHJvZmlsZVNsaWRlcigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlV2luZG93U2Nyb2xsaW5nKCkge1xyXG4gICAgICAgICAgaWYgKCFzY3JvbGxlZFRvVmlldykge1xyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpID4gJHByb2ZpbGVTbGlkZXIub2Zmc2V0KCkudG9wKSB7XHJcbiAgICAgICAgICAgICAgc2Nyb2xsZWRUb1ZpZXcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGFuaW1hdGVQcm9maWxlU2xpZGVyLCA1MDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0UHJvZmlsZVNsaWRlcigpIHtcclxuICAgICAgICAgIGluaXRTbGlkZXIoJHByb2ZpbGVTbGlkZXIsIHtcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6IHRydWUsXHJcbiAgICAgICAgICAgIHByZXZBcnJvdzogJzxzcGFuIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNhcm91c2VsLXByZXZcIj48aW1nIHNyYz1cImltYWdlcy9BcnJvdy1NYWluQXJ0aWNsZS1DYXJvdXNlbC1CbGFjay1MLnN2Z1wiPjwvc3Bhbj4nLFxyXG4gICAgICAgICAgICBuZXh0QXJyb3c6ICc8c3BhbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjYXJvdXNlbC1uZXh0XCI+PGltZyBzcmM9XCJpbWFnZXMvQXJyb3ctTWFpbkFydGljbGUtQ2Fyb3VzZWwtQmxhY2stUi5zdmdcIj48L3NwYW4+J1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBhbmltYXRlUHJvZmlsZVNsaWRlcigpO1xyXG4gICAgICAgICAgJHByb2ZpbGVTbGlkZXIub24oJ2FmdGVyQ2hhbmdlJywgYW5pbWF0ZVByb2ZpbGVTbGlkZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdFNsaWRlcih0YXJnZXQsIG9wdGlvbnMpIHtcclxuICAgICAgICAgIHZhciBkZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgc3BlZWQ6IDc1MCxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAyLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMixcclxuICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjgsXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICB0YXJnZXQuc2xpY2soJC5leHRlbmQoZGVmYXVsdHMsIG9wdGlvbnMpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIE92ZXJsYXlNb2R1bGUoKSB7XHJcbiAgICAgICAgdmFyICRvdmVybGF5LFxyXG4gICAgICAgICAgJGJvZHkgPSAkKCdib2R5JyksXHJcbiAgICAgICAgICBvdmVybGF5U2l6aW5nRGVsYXksXHJcbiAgICAgICAgICBjdXJyZW50SW5zdGFuY2UgPSB7fSxcclxuICAgICAgICAgIGlzT3BlbkZsYWcgPSBmYWxzZSxcclxuICAgICAgICAgICRjbG9zZUJ1dHRvbjtcclxuXHJcbiAgICAgICAgaW5pdE92ZXJsYXkoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIG9wZW5PdmVybGF5OiBvcGVuT3ZlcmxheSxcclxuICAgICAgICAgIGlzT3BlbjogaXNPcGVuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdE92ZXJsYXkoKSB7XHJcbiAgICAgICAgICAkb3ZlcmxheSA9ICQoJzxkaXY+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5hdHRyKCdpZCcsICdtb2RhbE92ZXJsYXknKTtcclxuICAgICAgICAgICRvdmVybGF5LmF0dHIoJ2NsYXNzJywgJ3JldmVhbCcpO1xyXG4gICAgICAgICAgJG92ZXJsYXkuYXR0cignZGF0YS1yZXZlYWwnLCB0cnVlKTtcclxuICAgICAgICAgICRib2R5LmFwcGVuZCgkb3ZlcmxheSk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5vbignb3Blbi56Zi5yZXZlYWwnLCBoYW5kbGVPdmVybGF5T3Blbik7XHJcbiAgICAgICAgICAkKHdpbmRvdykub24oJ2Nsb3NlZC56Zi5yZXZlYWwnLCBoYW5kbGVPdmVybGF5Q2xvc2UpO1xyXG4gICAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBkZWxheWVkSGFuZGxlT3ZlcmxheVNpemluZyk7XHJcbiAgICAgICAgICBpbml0Q2xvc2VCdXR0b24oKTtcclxuICAgICAgICAgIG5ldyBGb3VuZGF0aW9uLlJldmVhbCgkb3ZlcmxheSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy0tLS0tXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWRIYW5kbGVPdmVybGF5U2l6aW5nKCkge1xyXG4gICAgICAgICAgaWYgKG92ZXJsYXlTaXppbmdEZWxheSkge1xyXG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KG92ZXJsYXlTaXppbmdEZWxheSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgb3ZlcmxheVNpemluZ0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQob3ZlcmxheVNpemluZywgMjUwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlDbG9zZShldmVudCkge1xyXG4gICAgICAgICAgaXNPcGVuRmxhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZS5jbG9zZSkge1xyXG4gICAgICAgICAgICBjdXJyZW50SW5zdGFuY2UuY2xvc2UoZXZlbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3ZlcmxheVNpemVDbGVhbnVwKCk7XHJcbiAgICAgICAgICBjdXJyZW50SW5zdGFuY2UgPSB7fTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlPcGVuKGV2ZW50KSB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgaXNPcGVuRmxhZyA9IHRydWU7XHJcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2lzLXJldmVhbC1vcGVuJyk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5maW5kKCcqJykuZm91bmRhdGlvbigpO1xyXG4gICAgICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZS5vcGVuKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5vcGVuKGV2ZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIG92ZXJsYXlTaXppbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXRDbG9zZUJ1dHRvbigpIHtcclxuICAgICAgICAgIHZhciAkaW5uZXJTcGFuID0gJCgnPHNwYW4+PC9zcGFuPicpO1xyXG5cclxuICAgICAgICAgICRjbG9zZUJ1dHRvbiA9ICQoJzxidXR0b24gZGF0YS1jbG9zZT48L2J1dHRvbj4nKTtcclxuICAgICAgICAgICRjbG9zZUJ1dHRvbi5hZGRDbGFzcygnY2xvc2UtYnV0dG9uJyk7XHJcbiAgICAgICAgICAkY2xvc2VCdXR0b24uYXR0cignYXJpYS1sYWJlbCcsICdDbG9zZSBtb2RhbCcpO1xyXG4gICAgICAgICAgJGlubmVyU3Bhbi5hdHRyKCdhcmlhLWhpZGRlbicsIHRydWUpO1xyXG4gICAgICAgICAgJGlubmVyU3Bhbi5odG1sKCcmdGltZXM7Jyk7XHJcbiAgICAgICAgICAkY2xvc2VCdXR0b24uYXBwZW5kKCRpbm5lclNwYW4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNPcGVuKCkge1xyXG4gICAgICAgICAgcmV0dXJuIGlzT3BlbkZsYWc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvcGVuT3ZlcmxheSh1cmxPck1hcmt1cCwgb3BlbkNhbGxiYWNrLCBjbG9zZUNhbGxiYWNrLCBmdWxsU2NyZWVuKSB7XHJcbiAgICAgICAgICBjdXJyZW50SW5zdGFuY2Uub3BlbiA9IG9wZW5DYWxsYmFjaztcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5jbG9zZSA9IGNsb3NlQ2FsbGJhY2s7XHJcbiAgICAgICAgICBjdXJyZW50SW5zdGFuY2UuZnVsbCA9IGZ1bGxTY3JlZW47XHJcbiAgICAgICAgICBpZiAodHlwZW9mIHVybE9yTWFya3VwID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBvcGVuT3ZlcmxheVdpdGhBamF4KHVybE9yTWFya3VwKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9wZW5PdmVybGF5V2l0aE1hcmt1cCh1cmxPck1hcmt1cCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb3Blbk92ZXJsYXlXaXRoQWpheCh1cmwpIHtcclxuICAgICAgICAgICQuYWpheCh1cmwpLmRvbmUob3Blbk92ZXJsYXlXaXRoTWFya3VwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5PdmVybGF5V2l0aE1hcmt1cChtYXJrdXApIHtcclxuICAgICAgICAgICRvdmVybGF5Lmh0bWwobWFya3VwKTtcclxuICAgICAgICAgICRvdmVybGF5LmFwcGVuZCgkY2xvc2VCdXR0b24pO1xyXG4gICAgICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZS5mdWxsKSB7XHJcbiAgICAgICAgICAgICRvdmVybGF5LmFkZENsYXNzKCdmdWxsJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAkb3ZlcmxheS5mb3VuZGF0aW9uKCdvcGVuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvdmVybGF5U2l6ZUNsZWFudXAoKSB7XHJcbiAgICAgICAgICAkb3ZlcmxheS5yZW1vdmVDbGFzcygnZnVsbCcpO1xyXG4gICAgICAgICAgJG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ3RvdXInKTtcclxuICAgICAgICAgICRvdmVybGF5Lmh0bWwoJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb3ZlcmxheVNpemluZygpIHtcclxuICAgICAgICAgIHZhciBvdmVybGF5SGVpZ2h0ID0gJG92ZXJsYXkuaGVpZ2h0KCksXHJcbiAgICAgICAgICAgIHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICBpZiAob3ZlcmxheUhlaWdodCA+IHdpbmRvd0hlaWdodCkge1xyXG4gICAgICAgICAgICAkb3ZlcmxheS5jc3Moe1xyXG4gICAgICAgICAgICAgIHRvcDogMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ2Z1bGwnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIHZhciB2aWRzID0gW10sIGJyaWdodENvdmU7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBfcGFyc2VWaWRlb3MoKTtcclxuXHJcbiAgICAvLyBNYWtlIHN1cmUgdGhlIFZpZGVvSlMgbWV0aG9kIGlzIGF2YWlsYWJsZSBhbmQgZmlyZSByZWFkeSBldmVudCBoYW5kbGVycyBpZiBzb1xyXG4gICAgLy8gYnJpZ2h0Q292ZSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgIC8vICAgaWYgKCQoJy52anMtcGx1Z2lucy1yZWFkeScpLmxlbmd0aCkge1xyXG4gICAgLy8gICAgIF9icmlnaHRDb3ZlUmVhZHkoKTtcclxuICAgIC8vICAgICBjbGVhckludGVydmFsKGJyaWdodENvdmUpO1xyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9LCA1MDApXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcGFyc2VWaWRlb3MoKSB7XHJcbiAgICB2YXIgJGdyb3VwLFxyXG4gICAgICAkdmlkZW8sXHJcbiAgICAgIGRhdGEgPSB7fSxcclxuICAgICAgcHJlbG9hZE9wdGlvbnMgPSBbJ2F1dG8nLCAnbWV0YWRhdGEnLCAnbm9uZSddXHJcblxyXG4gICAgLy8gRWFjaCBncm91cCBjYW4gZWZmZWN0aXZlbHkgdXNlIGEgZGlmZmVyZW50IHBsYXllciB3aGljaCB3aWxsIG9ubHkgYmUgbG9hZGVkIG9uY2VcclxuICAgICQoJy5pZy12aWRlby1ncm91cCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAkZ3JvdXAgPSAkKHRoaXMpO1xyXG4gICAgICBkYXRhLmFjY291bnQgPSAkZ3JvdXAuZGF0YSgnYWNjb3VudCcpO1xyXG4gICAgICBkYXRhLnBsYXllciA9ICRncm91cC5kYXRhKCdwbGF5ZXInKTtcclxuXHJcbiAgICAgIC8vIExvYWQgcmVxdWlyZWQgSlMgZm9yIGEgcGxheWVyXHJcbiAgICAgIF9pbmplY3RCcmlnaHRDb3ZlSlMoZGF0YSk7XHJcblxyXG4gICAgICAvLyBMb29wIHRocm91Z2ggdmlkZW8nc1xyXG4gICAgICAkZ3JvdXAuZmluZCgnLmlnLXZpZGVvLWpzJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAkdmlkZW8gPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAvLyBDYXB0dXJlIG9wdGlvbnMgKHJlcXVpcmVkKVxyXG4gICAgICAgIGRhdGEuaWQgPSAkdmlkZW8uZGF0YSgnaWQnKTtcclxuXHJcbiAgICAgICAgLy8gQ2FwdHVyZSBvcHRpb25zIChvcHRpb25hbClcclxuICAgICAgICBkYXRhLnRpdGxlID0gJHZpZGVvLmRhdGEoJ3RpdGxlJykgPyAkdmlkZW8uZGF0YSgndGl0bGUnKSA6ICcnO1xyXG4gICAgICAgIGRhdGEuZGVzY3JpcHRpb24gPSAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKSA/ICR2aWRlby5kYXRhKCdkZXNjcmlwdGlvbicpIDogJyc7XHJcbiAgICAgICAgZGF0YS5hdXRvID0gJHZpZGVvLmRhdGEoJ2F1dG9wbGF5JykgPyAnYXV0b3BsYXknIDogJyc7XHJcbiAgICAgICAgZGF0YS5jdHJsID0gJHZpZGVvLmRhdGEoJ2NvbnRyb2xzJykgPyAnY29udHJvbHMnIDogJyc7XHJcbiAgICAgICAgZGF0YS5wcmVsb2FkID0gKHByZWxvYWRPcHRpb25zLmluZGV4T2YoJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSkgPiAtMSkgPyAkdmlkZW8uZGF0YSgncHJlbG9hZCcpIDogJ2F1dG8nO1xyXG5cclxuICAgICAgICAvLyBTdG9yZSBJRCdzIGZvciBhbGwgdmlkZW8ncyBvbiB0aGUgcGFnZSAtIGluIGNhc2Ugd2Ugd2FudCB0byBydW4gYSBwb3N0LWxvYWQgcHJvY2VzcyBvbiBlYWNoXHJcbiAgICAgICAgdmlkcy5wdXNoKGRhdGEuaWQpO1xyXG5cclxuICAgICAgICAvLyBMZXQncyByZXBsYWNlIHRoZSBpZy12aWRlby1qcyAnZGlyZWN0aXZlJyB3aXRoIHRoZSBuZWNlc3NhcnkgQnJpZ2h0Y292ZSBjb2RlXHJcbiAgICAgICAgX2luamVjdFRlbXBsYXRlKCR2aWRlbywgZGF0YSwgaW5kZXgpXHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpIHtcclxuICAgIHZhciBpbmRleGpzID0gYDxzY3JpcHQgc3JjPVwiLy9wbGF5ZXJzLmJyaWdodGNvdmUubmV0LyR7ZGF0YS5hY2NvdW50fS8ke2RhdGEucGxheWVyfV9kZWZhdWx0L2luZGV4Lm1pbi5qc1wiPjwvc2NyaXB0PmA7XHJcbiAgICAkKCdib2R5JykuYXBwZW5kKGluZGV4anMpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2luamVjdFRlbXBsYXRlKCR2aWRlbywgZGF0YSwgaW5kZXgpIHtcclxuICAgIHZhciBodG1sID0gYDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXJcIj48c3BhbiBjbGFzcz1cInZpZGVvLW92ZXJsYXkgJHtkYXRhLmlkfVwiPjwvc3Bhbj48ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyLXJlc3BvbnNpdmVcIj48dmlkZW8gZGF0YS12aWRlby1pZD1cIiR7ZGF0YS5pZH1cIiBwcmVsb2FkPVwiJHtkYXRhLnByZWxvYWR9XCIgZGF0YS1hY2NvdW50PVwiJHtkYXRhLmFjY291bnR9XCIgZGF0YS1wbGF5ZXI9XCIke2RhdGEucGxheWVyfVwiIGRhdGEtZW1iZWQ9XCJkZWZhdWx0XCIgZGF0YS1hcHBsaWNhdGlvbi1pZD1cIiR7aW5kZXh9XCIgY2xhc3M9XCJ2aWRlby1qc1wiIGlkPVwiJHtkYXRhLmlkfVwiICR7ZGF0YS5jdHJsfSAke2RhdGEuYXV0b30+PC92aWRlbz48L2Rpdj48L2Rpdj48aDIgY2xhc3M9XCJ2aWRlby10aXRsZVwiPiR7ZGF0YS50aXRsZX08L2gyPjxwIGNsYXNzPVwidmlkZW8tZGVzY3JpcHRpb25cIj4ke2RhdGEuZGVzY3JpcHRpb259PC9wPmA7XHJcbiAgICAkdmlkZW8ucmVwbGFjZVdpdGgoaHRtbCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYnJpZ2h0Q292ZVJlYWR5KCkge1xyXG4gICAgdmlkcy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICB2aWRlb2pzKCcjJyArIGVsKS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gJCgnLnZpZGVvLW92ZXJsYXkuJysgZWwpLmFkZENsYXNzKCdoaWRkZW4nKTtcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIF9zZWFyY2hMZWdhY3lDb2RlKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc2VhcmNoTGVnYWN5Q29kZSgpIHtcclxuXHJcbi8vIEdMT0JBTFNcclxuICAgIHZhciBtb2RlbFVybCA9ICdodHRwczovL3NlYXJjaC5pbnZlc3RvcnNncm91cC5jb20vYXBpL2N3cHNlYXJjaD8nO1xyXG4gICAgdmFyICRmaWVsZCA9ICQoJyNGaW5kQW5PZmZpY2UnKTtcclxuICAgIHZhciBsYW5nID0gJ2VuJztcclxuICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCcvZnIvJykgPiAtMSkge1xyXG4gICAgICBsYW5nID0gJ2ZyJztcclxuICAgIH1cclxuXHJcbi8vIFByb2Nlc3MgdGhlIGxvY2FsIHByZWZldGNoZWQgZGF0YVxyXG4gICAgdmFyIHN1Z2dlc3Rpb25zID0ge307XHJcbiAgICBzdWdnZXN0aW9ucy5sb2NhdGlvbnMgPSBuZXcgQmxvb2Rob3VuZCh7XHJcbiAgICAgIGRhdHVtVG9rZW5pemVyOiBCbG9vZGhvdW5kLnRva2VuaXplcnMud2hpdGVzcGFjZSxcclxuICAgICAgcXVlcnlUb2tlbml6ZXI6IEJsb29kaG91bmQudG9rZW5pemVycy53aGl0ZXNwYWNlLFxyXG4gICAgICBwcmVmZXRjaDogJ2RhdGEvY2l0aWVzLmpzb24nXHJcbiAgICB9KTtcclxuXHJcbi8vIEdldCB0aGUgcmVzdWx0c1xyXG4gICAgZnVuY3Rpb24gZ2V0U2VhcmNoUmVzdWx0cyhwYXJhbXMpIHtcclxuICAgICAgcGFyYW1zLnNlYXJjaHR5cGUgPSAnb2ZmaWNlJztcclxuICAgICAgcGFyYW1zLm5hbWUgPSAnJztcclxuXHJcbiAgICAgIC8vIE1ha2Ugc3VyZSBlcnJvciBtZXNzYWdlIGlzIGhpZGRlbiBlYWNoIHRpbWVcclxuICAgICAgJCgnLnplcm8tcmVzdWx0cycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblxyXG4gICAgICAkLmdldEpTT04obW9kZWxVcmwsIHBhcmFtcylcclxuICAgICAgICAuYWx3YXlzKClcclxuICAgICAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgdmFyIHJlc3VsdCA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2lzLXJldmVhbC1vcGVuJyk7XHJcbiAgICAgICAgICAgICQoJyNzZWFyY2hSZXN1bHRzTW9kYWwnKS5yZW1vdmVDbGFzcygnY2xvc2VkJykuaHRtbCgnJyk7XHJcbiAgICAgICAgICAgIGRpc3BsYXlTZWFyY2hSZXN1bHRzKCdvZmZpY2UtdGVtcGxhdGUnLCByZXN1bHQpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJCgnLnplcm8tcmVzdWx0cycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZmFpbChmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnRGF0YSBjb3VsZCBub3QgYmUgcmV0cmlldmVkLCBwbGVhc2UgdHJ5IGFnYWluJywgcmVzdWx0LnN0YXR1cyArICcgJyArIHJlc3VsdC5zdGF0dXNUZXh0KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4vLyBCZWNhdXNlIHdlIGFyZSBvbmx5IHNlYXJjaGluZyBmb3IgY2l0aWVzLCB0aGlzIGZ1bmN0aW9uIGlzIHNsaWdodGx5IHJlZHVuZGFudCAtIGxlYXZpbmcgaXQgaW4gcGxhY2UgZm9yIG5vd1xyXG4gICAgZnVuY3Rpb24gcGFyc2VTZWFyY2hTdHJpbmcoKSB7XHJcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgdmFyIHNlYXJjaCA9ICRmaWVsZC52YWwoKTtcclxuXHJcbiAgICAgIHJlc3VsdC5jaXR5ID0gJyc7XHJcblxyXG4gICAgICAvLyBTZWFyY2ggaW4gdGhlIGxhbmd1YWdlIG9mIHRoZSBwYWdlXHJcbiAgICAgIHJlc3VsdC5sYW5nID0gbGFuZztcclxuICAgICAgLy8gV2Ugb25seSBzZWFyY2ggY29uc3VsdGFudHMgZnJvbSB0aGlzIG1ldGhvZFxyXG4gICAgICByZXN1bHQuc2VhcmNodHlwZSA9ICdjb24nO1xyXG5cclxuICAgICAgLy8gQ2hlY2sgdGhlIHNlYXJjaCBzdHJpbmcgZm9yIGEgcHJldmlvdXNseSBkZWZpbmVkIGxvY2F0aW9uXHJcbiAgICAgIHZhciB3b3JkcyA9IHNlYXJjaC5zcGxpdCgnICcpO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgLy8gQ2hlY2sgZWFjaCB3b3JkIGZvciBhIGNpdHkgZnJvbSB0aGUgcHJlZGVmaW5lZCBsaXN0XHJcbiAgICAgICAgdmFyIGNpdHkgPSBzdWdnZXN0aW9ucy5sb2NhdGlvbnMuZ2V0KHdvcmRzW2ldKTtcclxuICAgICAgICBpZiAoY2l0eS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXN1bHQuY2l0eSA9IGNpdHlbMF07XHJcbiAgICAgICAgICB3b3Jkcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXJlc3VsdC5jaXR5KSB7XHJcbiAgICAgICAgcmVzdWx0LmNpdHkgPSB3b3Jkcy5qb2luKCcgJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGlzcGxheVNlYXJjaFJlc3VsdHModGVtcGxhdGVJRCwganNvbikge1xyXG4gICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZUlEKS5pbm5lckhUTUw7XHJcbiAgICAgIE11c3RhY2hlLnBhcnNlKHRlbXBsYXRlKTtcclxuICAgICAgdmFyIHJlbmRlcmVkID0gTXVzdGFjaGUucmVuZGVyKHRlbXBsYXRlLCBqc29uKTtcclxuICAgICAgJCgnI3NlYXJjaFJlc3VsdHNNb2RhbCcpLmFwcGVuZChyZW5kZXJlZCk7XHJcbiAgICAgICQoZG9jdW1lbnQpLmZvdW5kYXRpb24oKTtcclxuICAgIH1cclxuXHJcbi8vSW5pdCBldmVyeXRoaW5nXHJcbiAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gVHJ5IHRvIHByZWRldGVybWluZSB3aGF0IHJlc3VsdHMgc2hvdWxkIHNob3dcclxuICAgICAgLy8gU2V0dXAgdGhlIHR5cGVhaGVhZFxyXG4gICAgICAkKCcudHlwZWFoZWFkJykudHlwZWFoZWFkKHtcclxuICAgICAgICAgIGhpZ2hsaWdodDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge25hbWU6ICdsb2NhdGlvbnMnLCBzb3VyY2U6IHN1Z2dlc3Rpb25zLmxvY2F0aW9ucywgbGltaXQ6IDJ9XHJcbiAgICAgICk7XHJcblxyXG4gICAgICAvLyBTZXR1cCB0aGUgZm9ybSBzdWJtaXNzaW9uXHJcbiAgICAgICQoJy5pZy1zZWFyY2gnKS5zdWJtaXQoZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdmFyIHBhcmFtcyA9IHBhcnNlU2VhcmNoU3RyaW5nKCk7XHJcbiAgICAgICAgZ2V0U2VhcmNoUmVzdWx0cyhwYXJhbXMpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIEZha2UgbW9kYWwgLSBBZGRpbmcgaGFuZGxlciBvbiBkb2N1bWVudCBzbyBpdCBmaXJlcyBkZXNwaXRlIHRoZSBidXR0b24gbm90IGJlaW5nIHJlbmRlcmVkIHlldFxyXG4gICAgICAkKGRvY3VtZW50KS5vbihcImNsaWNrXCIsIFwiI3NlYXJjaFJlc3VsdHNNb2RhbCAuY2xvc2UtYnV0dG9uXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcjc2VhcmNoUmVzdWx0c01vZGFsJykuYWRkQ2xhc3MoJ2Nsb3NlZCcpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdpcy1yZXZlYWwtb3BlbicpO1xyXG4gICAgICAgIH0sIDQwMCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCIvKiBUaGlzIGZpbGUgaXMgdGhlIGVudHJ5IHBvaW50IGZvciByb2xsdXAgKGh0dHA6Ly9yb2xsdXBqcy5vcmcvKSBhbmRcclxuIGVzc2VudGlvbmFsbHkgJ2Jvb3RzdHJhcHMnIG91ciBpZy5jb20gJ2FwcGxpY2F0aW9uJy5cclxuXHJcbiBBbGwgbW9kdWxlcyBzaG91bGQgYmUgaW1wb3J0ZWQgaGVyZSBzbyB0aGF0IHRoZXkgY2FuIGJlIGluaXRpYWxpemVkIG9uXHJcbiBhIGNhc2UtYnktY2FzZSBiYXNpcyAobm90IGFsbCBwYWdlcyByZXF1aXJlIHRoZSBpbml0aWFsaXphdGlvbiBvZiBhIGNhcm91c2VsXHJcbiBmb3IgaW5zdGFuY2UpLlxyXG5cclxuIEFueSB0YXNrcyBvciBwcm9jZXNzZXMgdGhhdCBuZWVkIHRvIGJlIGluaXRpYXRlZCBvbiBwYWdlIGxvYWQgc2hvdWxkIGxpdmUgaW4gdGhpc1xyXG4gZmlsZSBhcyB3ZWxsLiBBbiBpbmNsdWRlZCBleGFtcGxlIGlzIGEgbWV0aG9kIHRoYXQgYWRkcyBhbiAnZW4nIG9yICdmcicgY2xhc3MgdG9cclxuIHRoZSBib2R5IGJhc2VkIG9uIHRoZSBnbG9iYWwgbGFuZ3VhZ2UgdmFyaWFibGUgdGhhdCB3ZSBjYW4gdGhlbiB1c2UgdG8gd3JpdGUgY3VzdG9tXHJcbiBzdHlsZXMgZm9yIGVhY2ggbGFuZ3VhZ2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGZvcm1zIGZyb20gJy4vZm9ybXMuanMnO1xyXG5pbXBvcnQgY2Fyb3VzZWwgZnJvbSAnLi9jYXJvdXNlbC5qcyc7XHJcbmltcG9ydCBjYXJlZXJzIGZyb20gJy4vY2FyZWVycy5qcyc7XHJcbmltcG9ydCB2aWRlbyBmcm9tICcuL3ZpZGVvLmpzJztcclxuaW1wb3J0IHNlYXJjaCBmcm9tICcuL3NlYXJjaC5qcyc7XHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbi8vIEV2ZW50IEVtaXR0ZXIgdGVzdCBtb2R1bGVzXHJcbi8vIGltcG9ydCBldnQxIGZyb20gJy4vZXZlbnQtdGVzdC0xLmpzJztcclxuLy8gaW1wb3J0IGV2dDIgZnJvbSAnLi9ldmVudC10ZXN0LTIuanMnO1xyXG5cclxuY29uc3QgYXBwID0gKCgpID0+IHtcclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG5cclxuICAgIC8vIEluaXRpYWxpemUgRm91bmRhdGlvblxyXG4gICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xyXG5cclxuICAgIC8vIENoZWNrIGZvciBjb21wb25lbnRzXHJcbiAgICBpZiAoJCgnLmlnLWZvcm0nKS5sZW5ndGgpIGZvcm1zLmluaXQoKTtcclxuICAgIGlmICgkKCcuaWctY2Fyb3VzZWwnKS5sZW5ndGgpIGNhcm91c2VsLmluaXQoKTtcclxuICAgIGlmICgkKCcuaWctc2VhcmNoJykubGVuZ3RoKSBzZWFyY2guaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1jYXJlZXJzJykubGVuZ3RoKSBjYXJlZXJzLmluaXQoKTtcclxuICAgIGlmICgkKCcuaWctdmlkZW8tZ3JvdXAnKS5sZW5ndGgpIHZpZGVvLmluaXQoKTtcclxuXHJcbiAgICAvLyBDb21wb25lbnRzIGNhbiBhbHNvIGJlIHNldHVwIHRvIHJlY2VpdmUgYW4gSFRNTCAnc2NvcGUnICguaWctZXZ0MS4uLiAuaWctZXZ0Mi4uLi4gZXRjKVxyXG4gICAgLy8gaWYgKCQoJy5pZy1ldnQxJykubGVuZ3RoKSBldnQxLmluaXQoJy5pZy1ldnQxJyk7XHJcbiAgICAvLyBpZiAoJCgnLmlnLWV2dDInKS5sZW5ndGgpIGV2dDIuaW5pdCgnLmlnLWV2dDInKTtcclxuXHJcbiAgICAvLyBBZGQgbGFuZ3VhZ2UgY2xhc3MgdG8gYm9keVxyXG4gICAgX2xhbmd1YWdlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBMZXQncyB1c2UgYSBnbG9iYWwgdmFyaWFibGUgKGdsb2JhbCBhcyBpbiBhdmFpbGFibGUgdG8gYWxsIG91ciBjb21wb25lbnRzIC0gbm90IHRoZSB3aW5kb3cgb2JqZWN0ISlcclxuICAvLyB0byBhZGQgYSBjbGFzcyB0byB0aGUgYm9keSB0YWdcclxuICBmdW5jdGlvbiBfbGFuZ3VhZ2UoKSB7XHJcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoaWcubGFuZyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH1cclxufSkoKTtcclxuXHJcbi8vIEJvb3RzdHJhcCBhcHBcclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gIGFwcC5pbml0KCk7XHJcbn0pO1xyXG4iXSwibmFtZXMiOlsibGFuZyIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJpbmRleE9mIiwiZW1pdHRlciIsIkV2ZW50RW1pdHRlciIsImVuZHBvaW50VVJMIiwic3VjY2Vzc1VSTCIsImNhbmNlbFVSTCIsIiRmb3JtIiwiJGZvcm1XcmFwcGVyIiwiaW5pdCIsIiQiLCJmaW5kIiwiZGF0YSIsIl92YWxpZGF0aW9uIiwiaklucHV0IiwiY2hhbmdlIiwib2JqRXZlbnQiLCJhZGRDbGFzcyIsInZhbGlkYXRvciIsInNldERlZmF1bHRzIiwiYWRkTWV0aG9kIiwicG9zdGFsIiwiZWxlbWVudCIsIm9wdGlvbmFsIiwibWF0Y2giLCJ2YWxpZGF0ZSIsImxhYmVsIiwiY2xvc2VzdCIsImxlbmd0aCIsInBhcmVudCIsImFwcGVuZCIsIm9uIiwicmVwbGFjZSIsIl9wcm9jZXNzIiwiZm9ybSIsImZvcm1EYXRhUmF3IiwiZm9ybURhdGFQYXJzZWQiLCJ2YWxpZCIsInJlbW92ZUNsYXNzIiwic2VyaWFsaXplQXJyYXkiLCJfcGFyc2UiLCJfc3VibWl0IiwiYWpheCIsInN1Y2Nlc3MiLCJtc2ciLCJlcnJvciIsInRvIiwiX3RvZ2dsZXIiLCJoaWRlIiwic2hvdyIsImxvZyIsInRvZ2dsZUNsYXNzIiwiX2J1aWxkQ2Fyb3VzZWwiLCJwcmV2QXJyb3ciLCJuZXh0QXJyb3ciLCIkY2Fyb3VzZWwiLCJlYWNoIiwiaW5kZXgiLCJzbGljayIsIl9jYXJlZXJzTGVnYWN5Q29kZSIsImZuIiwiaW5mb1RvZ2dsZSIsIiRyZXZlYWwiLCIkcmV2ZWFsQ29udGVudCIsIiRyZXZlYWxUcmlnZ2VyIiwiZml4ZWRIZWlnaHQiLCJzZXRBcmlhIiwiYXR0ciIsImluaXRUb2dnbGUiLCJoYW5kbGVSZXZlYWxUb2dnbGUiLCJyZXNpemVIYW5kbGVyIiwic2V0VGltZW91dCIsInNldFJldmVhbENvbnRlbnRIZWlnaHQiLCJjc3MiLCJoZWlnaHQiLCJmaW5hbEhlaWdodCIsImhhc0NsYXNzIiwic2Nyb2xsSGVpZ2h0IiwialF1ZXJ5IiwiY2lyY2xlQW5pbWF0aW9uIiwibWF4VmFsdWUiLCJjYW52YXMiLCIkY2FudmFzIiwiY29udGV4dCIsImQiLCJ3aWR0aCIsInBlcmNlbnRTdHJva2UiLCJyZW1haW5pbmdTdHJva2UiLCJyYWRpdXMiLCJjdXJQZXJjIiwiY2lyYyIsIk1hdGgiLCJQSSIsInF1YXJ0IiwiZGVsZWdhdGVJRCIsIkRhdGUiLCJnZXRUaW1lIiwiaXMiLCJnZXRDb250ZXh0Iiwic3Ryb2tlU3R5bGUiLCJmaWxsU3R5bGUiLCJkZWxlZ2F0ZSIsImNsZWFyIiwiYW5pbWF0ZSIsImN1cnJlbnQiLCJsaW5lV2lkdGgiLCJiZWdpblBhdGgiLCJhcmMiLCJtaW4iLCJzdHJva2UiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJmaWxsUmVjdCIsImJsb2NrTGluayIsIiRibG9ja0xpbmsiLCJkZXN0aW5hdGlvbiIsImluaXRCbG9jayIsImhhbmRsZUNsaWNrIiwiZ3VpIiwidmlkZW8iLCJvdmVybGF5IiwiaW5pdExlZ2FjeSIsIk92ZXJsYXlNb2R1bGUiLCJHdWlNb2R1bGUiLCJlIiwidGFyZ2V0IiwiZ2V0QXR0cmlidXRlIiwicHJldmVudERlZmF1bHQiLCJzdG9wIiwib2Zmc2V0IiwidG9wIiwic2VsZWN0b3IiLCJyZXNpemUiLCJvdmVybGF5UmVmZXJlbmNlIiwibXVsdGlUYWJUb2dnbGVTZWxlY3RvciIsIm11bHRpVGFiQ29udGVudFNlbGVjdG9yIiwibXVsdGlUYWJTZWxlY3RvciIsIiRlZGdlT3ZlcmxheUxvY2F0aW9uIiwiJG92ZXJsYXlTbGlkZXIiLCIkcHJvZmlsZVNsaWRlciIsIiRwcm9maWxlU2xpZGVyVmlkZW9TZWN0aW9uSG9sZGVyIiwid2luZG93U2l6aW5nRGVsYXkiLCJ3aW5kb3dTY3JvbGxpbmdEZWxheSIsIm92ZXJsYXlPcGVuIiwiaXNSZXNwb25zaXZlU3RhdGUiLCJzY3JvbGxlZFRvVmlldyIsImluaXRHdWkiLCJldmVudCIsImJhY2tncm91bmRDb2xvciIsIiR0aGlzIiwicGFyc2VJbnQiLCJodG1sIiwiaGFuZGxlT3ZlcmxheUZyb21IYXNoIiwiZGVsYXllZEhhbmRsZVdpbmRvd1NpemluZyIsImRlbGF5ZWRIYW5kbGVXaW5kb3dTY3JvbGwiLCJ0cmlnZ2VyIiwic3RvcFByb3BhZ2F0aW9uIiwiYWRkTXVsdGlUYWJUb2dnbGVIYW5kbGVycyIsInRvZ2dsZUJhc2UiLCIkY29udGFpbmVyIiwicGFyZW50cyIsImFuaW1hdGVQcm9maWxlU2xpZGVyIiwiJHByb2ZpbGVQYW5lbHMiLCJwcm9maWxlUGFuZWxIZWlnaHQiLCJvdXRlckhlaWdodCIsImNoYW5nZVNsaWRlclN0YXRlIiwic2xpZGVyIiwic3RhdGUiLCJjbGVhclRpbWVvdXQiLCJoYW5kbGVXaW5kb3dTaXppbmciLCJoYW5kbGVXaW5kb3dTY3JvbGxpbmciLCJmdWxsSGFzaEZyYWdtZW50IiwiaGFzaCIsIm9wZW5PdmVybGF5IiwiaGFuZGxlT3ZlcmxheU9wZW4iLCJoYW5kbGVPdmVybGF5Q2xvc2UiLCJpbml0aWFsSW5kZXgiLCJoYW5kbGVTbGlkZUNoYW5nZSIsInlQb3MiLCJvdmVybGF5Q29udGVudCIsIm9mZiIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJkb2N1bWVudCIsInRpdGxlIiwic2VhcmNoIiwic2Nyb2xsVG9wIiwiY3VycmVudFNsaWRlIiwibmV4dFNsaWRlIiwibmV4dFRpdGxlIiwiZ2V0IiwibmV3SGFzaCIsIndpbmRvd1dpZHRoIiwicmVzcG9uc2l2ZUxpbWl0IiwibmV3SXNSZXNwb25zaXZlU3RhdGUiLCJpbml0UHJvZmlsZVNsaWRlciIsImluaXRTbGlkZXIiLCJvcHRpb25zIiwiZGVmYXVsdHMiLCJleHRlbmQiLCIkb3ZlcmxheSIsIiRib2R5Iiwib3ZlcmxheVNpemluZ0RlbGF5IiwiY3VycmVudEluc3RhbmNlIiwiaXNPcGVuRmxhZyIsIiRjbG9zZUJ1dHRvbiIsImlzT3BlbiIsImluaXRPdmVybGF5IiwiZGVsYXllZEhhbmRsZU92ZXJsYXlTaXppbmciLCJGb3VuZGF0aW9uIiwiUmV2ZWFsIiwib3ZlcmxheVNpemluZyIsImNsb3NlIiwiZm91bmRhdGlvbiIsIm9wZW4iLCJpbml0Q2xvc2VCdXR0b24iLCIkaW5uZXJTcGFuIiwidXJsT3JNYXJrdXAiLCJvcGVuQ2FsbGJhY2siLCJjbG9zZUNhbGxiYWNrIiwiZnVsbFNjcmVlbiIsImZ1bGwiLCJvcGVuT3ZlcmxheVdpdGhBamF4IiwidXJsIiwiZG9uZSIsIm9wZW5PdmVybGF5V2l0aE1hcmt1cCIsIm1hcmt1cCIsIm92ZXJsYXlTaXplQ2xlYW51cCIsIm92ZXJsYXlIZWlnaHQiLCJ3aW5kb3dIZWlnaHQiLCJ2aWRzIiwiYnJpZ2h0Q292ZSIsIl9wYXJzZVZpZGVvcyIsIiRncm91cCIsIiR2aWRlbyIsInByZWxvYWRPcHRpb25zIiwiYWNjb3VudCIsInBsYXllciIsImlkIiwiZGVzY3JpcHRpb24iLCJhdXRvIiwiY3RybCIsInByZWxvYWQiLCJwdXNoIiwiX2luamVjdEJyaWdodENvdmVKUyIsImluZGV4anMiLCJfaW5qZWN0VGVtcGxhdGUiLCJyZXBsYWNlV2l0aCIsIl9zZWFyY2hMZWdhY3lDb2RlIiwibW9kZWxVcmwiLCIkZmllbGQiLCJocmVmIiwic3VnZ2VzdGlvbnMiLCJsb2NhdGlvbnMiLCJCbG9vZGhvdW5kIiwidG9rZW5pemVycyIsIndoaXRlc3BhY2UiLCJnZXRTZWFyY2hSZXN1bHRzIiwicGFyYW1zIiwic2VhcmNodHlwZSIsIm5hbWUiLCJnZXRKU09OIiwiYWx3YXlzIiwicmVzdWx0IiwiSlNPTiIsInBhcnNlIiwiZmFpbCIsInN0YXR1cyIsInN0YXR1c1RleHQiLCJwYXJzZVNlYXJjaFN0cmluZyIsInZhbCIsImNpdHkiLCJ3b3JkcyIsInNwbGl0IiwiaSIsInNwbGljZSIsImpvaW4iLCJkaXNwbGF5U2VhcmNoUmVzdWx0cyIsInRlbXBsYXRlSUQiLCJqc29uIiwidGVtcGxhdGUiLCJnZXRFbGVtZW50QnlJZCIsImlubmVySFRNTCIsInJlbmRlcmVkIiwiTXVzdGFjaGUiLCJyZW5kZXIiLCJ0eXBlYWhlYWQiLCJzb3VyY2UiLCJsaW1pdCIsInN1Ym1pdCIsImFwcCIsImZvcm1zIiwiY2Fyb3VzZWwiLCJjYXJlZXJzIiwiX2xhbmd1YWdlIiwiaWciLCJyZWFkeSJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7Ozs7OztBQVNBLEFBQU87OztBQUtQLEFBQU8sSUFBSUEsT0FBUSxZQUFNO01BQ25CQyxPQUFPQyxRQUFQLENBQWdCQyxRQUFoQixDQUF5QkMsT0FBekIsQ0FBaUMsTUFBakMsTUFBNkMsQ0FBQyxDQUFsRCxFQUFxRDtXQUM1QyxJQUFQO0dBREYsTUFFTztXQUNFLElBQVA7O0NBSmMsRUFBWDs7O0FBU1AsQUFBTzs7O0FBS1AsQUFBTyxJQUFJQyxVQUFVLElBQUlDLFlBQUosRUFBZDs7QUMxQlAsWUFBZSxDQUFDLFlBQU07O01BRWhCQyxXQUFKLEVBQ0VDLFVBREYsRUFFRUMsU0FGRixFQUdFQyxLQUhGLEVBSUVDLFlBSkY7O1dBTVNDLElBQVQsR0FBZ0I7O21CQUVDQyxFQUFFLFVBQUYsQ0FBZjtZQUNRRixhQUFhRyxJQUFiLENBQWtCLE1BQWxCLENBQVI7a0JBQ2NILGFBQWFHLElBQWIsQ0FBa0IsTUFBbEIsRUFBMEJDLElBQTFCLENBQStCLFVBQS9CLENBQWQ7Z0JBQ1lKLGFBQWFHLElBQWIsQ0FBa0IsTUFBbEIsRUFBMEJDLElBQTFCLENBQStCLFFBQS9CLENBQVo7Ozs7OztXQU1PQyxXQUFULEdBQXVCOztRQUVqQkMsU0FBU0osRUFBRSxrQkFBRixDQUFiO1dBQ09LLE1BQVAsQ0FBYyxVQUFVQyxRQUFWLEVBQW9CO1FBQzlCLElBQUYsRUFBUUMsUUFBUixDQUFpQixPQUFqQjtLQURGOztNQUlFQyxTQUFGLENBQVlDLFdBQVosQ0FBd0I7YUFDZixJQURlO2VBRWI7S0FGWDs7TUFLRUQsU0FBRixDQUFZRSxTQUFaLENBQXNCLFdBQXRCLEVBQW1DLFVBQVVDLE1BQVYsRUFBa0JDLE9BQWxCLEVBQTJCO2FBQ3JELEtBQUtDLFFBQUwsQ0FBY0QsT0FBZCxL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