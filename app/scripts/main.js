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
          // context.shadowOffsetX = 0;
          // context.shadowOffsetY = 0;
          // context.shadowBlur = 1;
          // context.shadowColor = '#656565';

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

        // $('.block-link .js-prevent').on('click', function (e) {
        //   e.preventDefault();
        // });

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
          $(document).foundation();
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
            prevArrow: '<span type="button" class="carousel-prev"><img src="../images/Arrow-MainArticle-Carousel-Black-L.svg"></span>',
            nextArrow: '<span type="button" class="carousel-next"><img src="../images/Arrow-MainArticle-Carousel-Black-R.svg"></span>'
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

          // $('.video-container').each(function(){
          //
          //   if ($(this).find('object')) {
          //
          //     $(this).children('span').delay().hide();
          //   }
          // });
          // if (evt.target.experience.id === 'bcExperienceObj0') {
          //   $('.video-container.one span').delay().fadeOut('slow');
          // }
          // if (evt.target.experience.id === 'bcExperienceObj1') {
          //   $('.video-container.two span').delay().fadeOut('slow');
          // }
          // if (evt.target.experience.id === 'bcExperienceObj2') {
          //   $('.video-container.three span').delay().fadeOut('slow');
          // }
        }

        function playVideo(event) {
          event.preventDefault ? event.preventDefault() : event.returnValue = false;
          $placeholder.hide();
          videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);
          experienceModule = player.getModule(APIModules.EXPERIENCE);
          videoPlayer.play();
        }
      }

      //

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
      $('.search-form').submit(function (e) {
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvY2FyZWVycy5qcyIsIm1vZHVsZXMvc2VhcmNoLmpzIiwibW9kdWxlcy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogVGhpcyBmaWxlIGlzIGZvciBtZXRob2RzIGFuZCB2YXJpYWJsZXMgdGhhdCBhcmUgZ29pbmcgdG8gYmVcclxudXNlZnVsIGFjcm9zcyBhbGwgbW9kdWxlcy4gSW4gb3JkZXIgdG8gdXNlIHRoZW0gYW55d2hlcmUsIGltcG9ydCB3aXRoOlxyXG5cclxuIGltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbiBhbmQgdGhlbiBjYWxsIHdpdGggdGhlIGlnIG5hbWVzcGFjZSAoaS5lLiwgaWcucGF0aG5hbWUsIGlnLmxhbmcsIGV0YylcclxuICovXHJcblxyXG4vLyB1cmwgcGF0aFxyXG5leHBvcnQgdmFyIHBhdGhuYW1lID0gKCgpID0+IHtcclxuICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xyXG59KSgpXHJcblxyXG4vLyBsYW5ndWFnZVxyXG5leHBvcnQgdmFyIGxhbmcgPSAoKCkgPT4ge1xyXG4gIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZignL2ZyLycpICE9PSAtMSkge1xyXG4gICAgcmV0dXJuICdmcic7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAnZW4nO1xyXG4gIH1cclxufSkoKVxyXG5cclxuLy8gYnJvd3NlciB3aWR0aFxyXG5leHBvcnQgdmFyIGJyb3dzZXJXaWR0aCA9ICgoKSA9PiB7XHJcbiAgcmV0dXJuIHdpbmRvdy5vdXRlcldpZHRoO1xyXG59KSgpXHJcblxyXG4vLyBiYXNlIGV2ZW50RW1pdHRlclxyXG5leHBvcnQgdmFyIGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cclxuXHJcbiIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIHZhciBlbmRwb2ludFVSTCxcclxuICAgIHN1Y2Nlc3NVUkwsXHJcbiAgICBjYW5jZWxVUkwsXHJcbiAgICAkZm9ybSxcclxuICAgICRmb3JtV3JhcHBlcjtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIC8vIEZvcm1zIHNob3VsZCBhbHdheXMgYmUgd3JhcHBlZCBpbiAnLmlnLWZvcm0nXHJcbiAgICAkZm9ybVdyYXBwZXIgPSAkKCcuaWctZm9ybScpO1xyXG4gICAgJGZvcm0gPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpO1xyXG4gICAgZW5kcG9pbnRVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2VuZHBvaW50Jyk7XHJcbiAgICBjYW5jZWxVUkwgPSAkZm9ybVdyYXBwZXIuZmluZCgnZm9ybScpLmRhdGEoJ2NhbmNlbCcpO1xyXG5cclxuICAgIF92YWxpZGF0aW9uKCk7XHJcbiAgICBfdG9nZ2xlcigpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdmFsaWRhdGlvbigpIHtcclxuICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgd2hldGhlciBhbiBpbnB1dCBpcyAnZGlydHknIG9yIG5vdCAoc2ltaWxhciB0byBob3cgQW5ndWxhciAxIHdvcmtzKSBpbiBvcmRlciBmb3IgbGFiZWxzIHRvIGJlaGF2ZSBwcm9wZXJseVxyXG4gICAgdmFyIGpJbnB1dCA9ICQoJzppbnB1dCwgdGV4dGFyZWEnKTtcclxuICAgIGpJbnB1dC5jaGFuZ2UoZnVuY3Rpb24gKG9iakV2ZW50KSB7XHJcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2RpcnR5Jyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkLnZhbGlkYXRvci5zZXREZWZhdWx0cyh7XHJcbiAgICAgIGRlYnVnOiB0cnVlLFxyXG4gICAgICBzdWNjZXNzOiAndmFsaWQnXHJcbiAgICB9KTtcclxuXHJcbiAgICAkLnZhbGlkYXRvci5hZGRNZXRob2QoJ2NkblBvc3RhbCcsIGZ1bmN0aW9uIChwb3N0YWwsIGVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWwoZWxlbWVudCkgfHxcclxuICAgICAgICBwb3N0YWwubWF0Y2goL1thLXpBLVpdWzAtOV1bYS16QS1aXSgtfCB8KVswLTldW2EtekEtWl1bMC05XS8pO1xyXG4gICAgfSwgJ1BsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgcG9zdGFsIGNvZGUuJyk7XHJcblxyXG4gICAgJGZvcm0udmFsaWRhdGUoe1xyXG4gICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgX3Byb2Nlc3MoKTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uIChsYWJlbCwgZWxlbWVudCkge1xyXG4gICAgICAgIC8vIFVzZSB0aGUgY3VzdG9tLWVycm9yLWxvY2F0aW9uIG1hcmtlciBjbGFzcyB0byBjaGFuZ2Ugd2hlcmUgdGhlIGVycm9yIGxhYmVsIHNob3dzIHVwXHJcbiAgICAgICAgaWYgKCEkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykubGVuZ3RoKSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLnBhcmVudCgpLmFwcGVuZChsYWJlbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcnVsZXM6IHtcclxuICAgICAgICBwaG9uZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBwaG9uZVVTOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwaG9uZTI6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcG9zdGFsX2NvZGU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgY2RuUG9zdGFsOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaXJzdG5hbWU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxhc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWwyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkZm9ybS5maW5kKCdidXR0b24uY2FuY2VsJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShjYW5jZWxVUkwpO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3Byb2Nlc3MoZm9ybSkge1xyXG4gICAgdmFyIGZvcm1EYXRhUmF3LFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZDtcclxuXHJcbiAgICBpZiAoJGZvcm0udmFsaWQoKSkge1xyXG4gICAgICAkZm9ybS5yZW1vdmVDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5hZGRDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgICBmb3JtRGF0YVJhdyA9ICRmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XHJcbiAgICAgIC8vIElmIHdlIG5lZWQgdG8gbW9kaWZ5IHRoZSBkYXRhLCB1c2UgcGFyc2UgbWV0aG9kXHJcbiAgICAgIGZvcm1EYXRhUGFyc2VkID0gX3BhcnNlKGZvcm1EYXRhUmF3KTtcclxuICAgICAgLy8gU3VibWl0IGZpbmFsIGRhdGFcclxuICAgICAgX3N1Ym1pdChmb3JtRGF0YVBhcnNlZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcGFyc2UoZGF0YSkge1xyXG4gICAgLy8gRXhlY3V0ZSBhbnkgY3VzdG9tIGxvZ2ljIGhlcmVcclxuXHJcblxyXG4gICAgcmV0dXJuIGRhdGFcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zdWJtaXQoZGF0YSkge1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIHVybDogZW5kcG9pbnRVUkwsXHJcbiAgICAgIGRhdGE6IGRhdGFcclxuICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcclxuICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICB9KVxyXG4gICAgICAuZXJyb3IoZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICRmb3JtLmFkZENsYXNzKCdzZXJ2ZXItZXJyb3InKTtcclxuICAgICAgICAkZm9ybVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgICBTY3JvbGxNYW4udG8oJCgnI3NlcnZlci1lcnJvcicpKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdG9nZ2xlcigpIHtcclxuICAgIC8vIFZlcnkgc2ltcGxlIGZvcm0gdG9nZ2xlclxyXG4gICAgJCgnLnRvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQoJy50b2dnbGUtY29udGVudCcpLmhpZGUoKTtcclxuICAgICAgJCgnLicgKyAkKHRoaXMpLmRhdGEoJ2NvbnRlbnQnKSkuc2hvdygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgY29uc29sZS5sb2coJ0Nhcm91c2VsIEluaXRpYWxpemVkIScpXHJcblxyXG4gICAgLy8gTm90IHN1cmUgd2hhdCB0aGlzIGRvZXMgYXQgdGhpcyBwb2ludCBvciBob3cgaXQgcmVsYXRlcyB0byBDYXJvdXNlbHNcclxuICAgICQoJ1tkYXRhLXJlc3BvbnNpdmUtdG9nZ2xlXSBidXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQoJ2JvZHknKS50b2dnbGVDbGFzcygnc2l0ZS1oZWFkZXItaXMtYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBfYnVpbGRDYXJvdXNlbCgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2J1aWxkQ2Fyb3VzZWwoKSB7XHJcbiAgICB2YXIgcHJldkFycm93LFxyXG4gICAgICBuZXh0QXJyb3csXHJcbiAgICAgICRjYXJvdXNlbDtcclxuXHJcbiAgICAkKCcuaWctY2Fyb3VzZWwnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAkY2Fyb3VzZWwgPSAkKHRoaXMpO1xyXG4gICAgICBwcmV2QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5QcmV2aW91czwvc3Bhbj48L2J1dHRvbj4nO1xyXG4gICAgICBuZXh0QXJyb3cgPSAoJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSkgPyAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPicgKyAkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpICsgJzwvc3Bhbj48L2J1dHRvbj4nIDogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj5OZXh0PC9zcGFuPjwvYnV0dG9uPic7XHJcblxyXG4gICAgICAkY2Fyb3VzZWwuc2xpY2soe1xyXG4gICAgICAgIGFkYXB0aXZlSGVpZ2h0OiAkY2Fyb3VzZWwuZGF0YSgnYWRhcHRpdmVIZWlnaHQnKSB8fCBmYWxzZSxcclxuICAgICAgICBhcnJvd3M6ICRjYXJvdXNlbC5kYXRhKCdhcnJvd3MnKSB8fCBmYWxzZSxcclxuICAgICAgICBhdXRvUGxheTogJGNhcm91c2VsLmRhdGEoJ2F1dG9QbGF5JykgfHwgZmFsc2UsXHJcbiAgICAgICAgZG90czogJGNhcm91c2VsLmRhdGEoJ2RvdHMnKSB8fCBmYWxzZSxcclxuICAgICAgICBmYWRlOiAkY2Fyb3VzZWwuZGF0YSgnZmFkZScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGluZmluaXRlOiAkY2Fyb3VzZWwuZGF0YSgnaW5maW5pdGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcclxuICAgICAgICBuZXh0QXJyb3c6IG5leHRBcnJvdyxcclxuICAgICAgICBwcmV2QXJyb3c6IHByZXZBcnJvdyxcclxuICAgICAgICByZXNwb25zaXZlOiAkY2Fyb3VzZWwuZGF0YSgncmVzcG9uc2l2ZScpIHx8ICcnLFxyXG4gICAgICAgIHNsaWRlOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogJGNhcm91c2VsLmRhdGEoJ3NsaWRlVG9TY3JvbGwnKSB8fCAxLFxyXG4gICAgICAgIHNsaWRlc1RvU2hvdzogJGNhcm91c2VsLmRhdGEoJ3NsaWRlc1RvU2hvdycpIHx8IDEsXHJcbiAgICAgICAgc3BlZWQ6ICRjYXJvdXNlbC5kYXRhKCdzcGVlZCcpIHx8IDMwMCxcclxuICAgICAgfSlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICBfY2FyZWVyc0xlZ2FjeUNvZGUoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9jYXJlZXJzTGVnYWN5Q29kZSgpIHtcclxuXHJcblxyXG4gICAgKGZ1bmN0aW9uICgkKSB7XHJcblxyXG4gICAgICAkLmZuLmluZm9Ub2dnbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciAkcmV2ZWFsID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgJHJldmVhbENvbnRlbnQgPSAkcmV2ZWFsLmZpbmQoJy5pbmZvLXRvZ2dsZS1jb250ZW50JyksXHJcbiAgICAgICAgICAgICRyZXZlYWxUcmlnZ2VyID0gJHJldmVhbC5maW5kKCcuaW5mby10b2dnbGUtdHJpZ2dlcicpLFxyXG4gICAgICAgICAgICBmaXhlZEhlaWdodCA9IGZhbHNlLFxyXG4gICAgICAgICAgICBzZXRBcmlhID0gJHJldmVhbC5hdHRyKCdpbmZvLXRvZ2dsZS1hcmlhJykgPT09ICd0cnVlJztcclxuXHJcbiAgICAgICAgICBpbml0VG9nZ2xlKCk7XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gaW5pdFRvZ2dsZSgpIHtcclxuICAgICAgICAgICAgJHJldmVhbFRyaWdnZXIub24oJ2NsaWNrJywgaGFuZGxlUmV2ZWFsVG9nZ2xlKTtcclxuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCByZXNpemVIYW5kbGVyKTtcclxuXHJcbiAgICAgICAgICAgIHNldFJldmVhbENvbnRlbnRIZWlnaHQoKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLy0tLS0tXHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gaGFuZGxlUmV2ZWFsVG9nZ2xlKCkge1xyXG4gICAgICAgICAgICBzZXRSZXZlYWxDb250ZW50SGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICRyZXZlYWwudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChzZXRSZXZlYWxDb250ZW50SGVpZ2h0KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiByZXNpemVIYW5kbGVyKCkge1xyXG4gICAgICAgICAgICBpZiAoZml4ZWRIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAkcmV2ZWFsQ29udGVudC5jc3MoeyBoZWlnaHQ6ICdhdXRvJyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIHNldFJldmVhbENvbnRlbnRIZWlnaHQoKSB7XHJcbiAgICAgICAgICAgIHZhciBmaW5hbEhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGlmICgkcmV2ZWFsLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICAgIGZpbmFsSGVpZ2h0ID0gJHJldmVhbENvbnRlbnRbMF0uc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICAgICAgICAgIGZpeGVkSGVpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBmaW5hbEhlaWdodCA9IDA7XHJcbiAgICAgICAgICAgICAgZml4ZWRIZWlnaHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkcmV2ZWFsQ29udGVudC5jc3MoeyBoZWlnaHQ6IGZpbmFsSGVpZ2h0IH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNldEFyaWEpIHtcclxuICAgICAgICAgICAgICAkcmV2ZWFsQ29udGVudC5hdHRyKCdhcmlhLWhpZGRlbicsICFmaXhlZEhlaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH07XHJcblxyXG4gICAgfSkoalF1ZXJ5KTtcclxuXHJcblxyXG4gICAgKGZ1bmN0aW9uICgkKSB7XHJcbiAgICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAgICQuZm4uY2lyY2xlQW5pbWF0aW9uID0gZnVuY3Rpb24gKG1heFZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBjYW52YXMgPSB0aGlzLFxyXG4gICAgICAgICAgICAkY2FudmFzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgY29udGV4dCxcclxuICAgICAgICAgICAgZCA9IGNhbnZhcy53aWR0aCAvIDIsXHJcbiAgICAgICAgICAgIHBlcmNlbnRTdHJva2UgPSA3LFxyXG4gICAgICAgICAgICByZW1haW5pbmdTdHJva2UgPSAxLFxyXG4gICAgICAgICAgICByYWRpdXMgPSBkIC0gcGVyY2VudFN0cm9rZSxcclxuICAgICAgICAgICAgY3VyUGVyYyA9IDAsXHJcbiAgICAgICAgICAgIGNpcmMgPSBNYXRoLlBJICogMixcclxuICAgICAgICAgICAgcXVhcnQgPSBNYXRoLlBJIC8gMixcclxuICAgICAgICAgICAgZGVsZWdhdGVJRCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgJ0NBJztcclxuXHJcbiAgICAgICAgICBpZiAoISRjYW52YXMuaXMoJ2NhbnZhcycpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gJyMwZDI2M2MnO1xyXG4gICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnI2U1ZThlOCc7XHJcbiAgICAgICAgICAvLyBjb250ZXh0LnNoYWRvd09mZnNldFggPSAwO1xyXG4gICAgICAgICAgLy8gY29udGV4dC5zaGFkb3dPZmZzZXRZID0gMDtcclxuICAgICAgICAgIC8vIGNvbnRleHQuc2hhZG93Qmx1ciA9IDE7XHJcbiAgICAgICAgICAvLyBjb250ZXh0LnNoYWRvd0NvbG9yID0gJyM2NTY1NjUnO1xyXG5cclxuICAgICAgICAgICRjYW52YXMuYXR0cignY2lyY2xlLWFuaW1hdGlvbi1pZCcsIGRlbGVnYXRlSUQpO1xyXG4gICAgICAgICAgJCgnYm9keScpLmRlbGVnYXRlKCdbY2lyY2xlLWFuaW1hdGlvbi1pZD0nICsgZGVsZWdhdGVJRCArICddJywgJ3N0YXJ0QW5pbWF0ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY3VyUGVyYyA9IDA7XHJcbiAgICAgICAgICAgIGFuaW1hdGUoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgJCgnYm9keScpLmRlbGVnYXRlKCdbY2lyY2xlLWFuaW1hdGlvbi1pZD0nICsgZGVsZWdhdGVJRCArICddJywgJ2NsZWFyQW5pbWF0ZScsIGNsZWFyKTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBhbmltYXRlKGN1cnJlbnQpIHtcclxuICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQgPyBjdXJyZW50IDogMDtcclxuICAgICAgICAgICAgY2xlYXIoKTtcclxuICAgICAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSBwZXJjZW50U3Ryb2tlO1xyXG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmFyYyhkLCBkLCByYWRpdXMsIC0ocXVhcnQpLCAoKGNpcmMpICogLU1hdGgubWluKGN1cnJlbnQsIG1heFZhbHVlIC8gMTAwKSkgLSBxdWFydCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gcmVtYWluaW5nU3Ryb2tlO1xyXG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmFyYyhkLCBkLCByYWRpdXMsIC0ocXVhcnQpLCAoKGNpcmMpICogLWN1cnJlbnQpIC0gcXVhcnQsIHRydWUpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjdXJQZXJjKys7XHJcbiAgICAgICAgICAgIGlmIChjdXJQZXJjIDwgMTEwKSB7XHJcbiAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRlKGN1clBlcmMgLyAxMDApXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy53aWR0aCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICB9O1xyXG5cclxuICAgIH0pKGpRdWVyeSk7XHJcblxyXG4gICAgKGZ1bmN0aW9uICgkKSB7XHJcbiAgICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAgICQuZm4uYmxvY2tMaW5rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB2YXIgJGJsb2NrTGluayA9ICQodGhpcyksXHJcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uID0gJGJsb2NrTGluay5maW5kKCdhJykuYXR0cignaHJlZicpO1xyXG4gICAgICAgICAgLy8gZGVzdGluYXRpb24gPSAnNDQ0Mi5hc3B4LycgKyBkZXN0aW5hdGlvbjtcclxuICAgICAgICAgIGluaXRCbG9jaygpO1xyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIGluaXRCbG9jaygpIHtcclxuICAgICAgICAgICAgJGJsb2NrTGluay5vbignY2xpY2snLCBoYW5kbGVDbGljayk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKCkge1xyXG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsb2NhdGlvbiA9IGRlc3RpbmF0aW9uO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfTtcclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICB2YXIgZ3VpLFxyXG4gICAgICAgIHZpZGVvLFxyXG4gICAgICAgIG92ZXJsYXk7XHJcblxyXG4gICAgICBpbml0TGVnYWN5KCk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBpbml0TGVnYWN5KCkge1xyXG4gICAgICAgIC8vIFRoaXMgaXMgd2VpcmQgLSBub3QgZ29pbmcgdG8gdG91Y2ggaXRcclxuICAgICAgICBvdmVybGF5ID0gbmV3IE92ZXJsYXlNb2R1bGUoKTtcclxuICAgICAgICBndWkgPSBuZXcgR3VpTW9kdWxlKG92ZXJsYXkpO1xyXG4gICAgICAgIHZpZGVvID0gbmV3IFZpZGVvTW9kdWxlKCk7XHJcblxyXG4gICAgICAgIC8vIE5lZWQgdG8gaGF2ZSBhIGNsYXNzIHRvIGhvb2sgb250byBmb3IgRnJlbmNoIGxhbmd1YWdlIHBhZ2VcclxuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnZnInKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vICQoJy5ibG9jay1saW5rIC5qcy1wcmV2ZW50Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAvLyAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAvLyB9KTtcclxuXHJcbiAgICAgICAgLy8gU21vb3RoIHNjcm9sbGluZyBmb3IgYW5jaG9yIGxpbmtzXHJcbiAgICAgICAgJCgnYVtocmVmXj1cIiNcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgdmFyIHRhcmdldCA9ICQodGhpcy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XHJcbiAgICAgICAgICBpZiAodGFyZ2V0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgc2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wICsgNTJcclxuICAgICAgICAgICAgfSwgNzUwKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGFyZ2V0LnNlbGVjdG9yICE9PSBcIiNcIikge1xyXG4gICAgICAgICAgICAkKCcjbWFpbi1tZW51LWFuY2hvcicpLmNzcyh7ICdkaXNwbGF5JzogJ25vbmUnIH0pO1xyXG4gICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2lzLXJldmVhbC1vcGVuIGJyYW5kZWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gTW9iaWxlIG1lbnUgbmVlZHMgdG8gbWltaWMgRm91bmRhdGlvbiByZXZlYWwgLSBub3QgZW5vdWdoIHRpbWUgdG8gaW1wbGVtZW50IGRpZmZlcmVudCBuYXZzIGluIGEgcmV2ZWFsIG1vZGFsIHByb3Blcmx5XHJcbiAgICAgICAgJCgnLm1lbnUtaWNvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2lzLXJldmVhbC1vcGVuIGJyYW5kZWQnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gcXVpY2sgYW5kIGRpcnR5IG1vYmlsZSBtZW51IGNsb3NlcyAtIG5vdCBmYW1pbGlhciB3aXRoIEZvdW5kYXRpb24gcGF0dGVybiB0byBmaXJlIHRoZXNlXHJcbiAgICAgICAgJCgnLnRvcC1iYXIgLmNsb3NlLWJ1dHRvbi5zaG93LWZvci1zbWFsbC1vbmx5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgJCgnI21haW4tbWVudS1hbmNob3InKS5jc3MoeyAnZGlzcGxheSc6ICdub25lJyB9KTtcclxuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaXMtcmV2ZWFsLW9wZW4gYnJhbmRlZCcpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDY0MCkge1xyXG4gICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2JyYW5kZWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgZnVuY3Rpb24gR3VpTW9kdWxlKG92ZXJsYXlSZWZlcmVuY2UpIHtcclxuICAgICAgICB2YXIgbXVsdGlUYWJUb2dnbGVTZWxlY3RvciA9ICdbY2xhc3MqPVwidG9nZ2xlLVwiXTpub3QoW2NsYXNzKj1cImluZm8tdG9nZ2xlXCJdKScsXHJcbiAgICAgICAgICBtdWx0aVRhYkNvbnRlbnRTZWxlY3RvciA9ICdbY2xhc3MqPVwiY29udGVudC1cIl0nLFxyXG4gICAgICAgICAgbXVsdGlUYWJTZWxlY3RvciA9ICcubXVsdGktdGFiLW91dGxpbmUnLFxyXG4gICAgICAgICAgJGVkZ2VPdmVybGF5TG9jYXRpb24gPSAkKCcjZWRnZS1vdmVybGF5LWNvbnRlbnQnKSxcclxuICAgICAgICAgIG92ZXJsYXkgPSBvdmVybGF5UmVmZXJlbmNlLFxyXG4gICAgICAgICAgJG92ZXJsYXlTbGlkZXIsXHJcbiAgICAgICAgICAkcHJvZmlsZVNsaWRlcixcclxuICAgICAgICAgICRwcm9maWxlU2xpZGVyVmlkZW9TZWN0aW9uSG9sZGVyID0gJCgnPGRpdj48L2Rpdj4nKSxcclxuICAgICAgICAgIHdpbmRvd1NpemluZ0RlbGF5LFxyXG4gICAgICAgICAgd2luZG93U2Nyb2xsaW5nRGVsYXksXHJcbiAgICAgICAgICBvdmVybGF5T3BlbixcclxuICAgICAgICAgIGlzUmVzcG9uc2l2ZVN0YXRlID0gZmFsc2UsXHJcbiAgICAgICAgICBzY3JvbGxlZFRvVmlldyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpbml0R3VpKCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXRHdWkoKSB7XHJcbiAgICAgICAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XHJcbiAgICAgICAgICBhZGRNdWx0aVRhYlRvZ2dsZUhhbmRsZXJzKCk7XHJcbiAgICAgICAgICAkKCcuYmxvY2stbGluaycpLmJsb2NrTGluaygpO1xyXG4gICAgICAgICAgJG92ZXJsYXlTbGlkZXIgPSAkKCcub3VyLWJ1c2luZXNzLXNsaWRlcicpO1xyXG4gICAgICAgICAgJCgnI2VkZ2Utb3ZlcmxheS1jb250ZW50JykuZmluZCgnLmNhcm91c2VsLW5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJG92ZXJsYXlTbGlkZXIuc2xpY2soJ3NsaWNrTmV4dCcpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgaWYgKCQoXCIudmlkZW8tc2xpZGUuc2xpY2stYWN0aXZlXCIpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAkKCcuc2xpY2stbGlzdC5kcmFnZ2FibGUnKS5jc3MoeyBoZWlnaHQ6ICc2NjBweCcgfSk7XHJcbiAgICAgICAgICAgICQoJy5zZWN0aW9uLnByb2ZpbGVzLXNsaWRlcicpLmNzcyh7IGJhY2tncm91bmRDb2xvcjogJyNlNWU4ZTgnIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJCgnLnNsaWNrLWxpc3QuZHJhZ2dhYmxlJykuY3NzKHsgaGVpZ2h0OiAnYXV0bycgfSk7XHJcbiAgICAgICAgICAgICQoJy5zZWN0aW9uLnByb2ZpbGVzLXNsaWRlcicpLmNzcyh7IGJhY2tncm91bmRDb2xvcjogJyM3ZWM0YjknIH0pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICQoJy5wcm9maWxlLWNvdW50ZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJ2NhbnZhcycpLmNpcmNsZUFuaW1hdGlvbihwYXJzZUludCgkdGhpcy5maW5kKCdwJykuaHRtbCgpKSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgICRwcm9maWxlU2xpZGVyID0gJCgnLnByb2ZpbGVzLXNsaWRlcicpO1xyXG4gICAgICAgICAgJCh3aW5kb3cpLm9uKCdoYXNoY2hhbmdlJywgaGFuZGxlT3ZlcmxheUZyb21IYXNoKTtcclxuICAgICAgICAgIGhhbmRsZU92ZXJsYXlGcm9tSGFzaCgpO1xyXG4gICAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBkZWxheWVkSGFuZGxlV2luZG93U2l6aW5nKTtcclxuICAgICAgICAgIGhhbmRsZVdpbmRvd1NpemluZyh0cnVlKTtcclxuICAgICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZGVsYXllZEhhbmRsZVdpbmRvd1Njcm9sbCk7XHJcbiAgICAgICAgICBoYW5kbGVXaW5kb3dTY3JvbGxpbmcoKTtcclxuXHJcbiAgICAgICAgICAkKCcuaW5mby10b2dnbGUnKS5pbmZvVG9nZ2xlKCk7XHJcbiAgICAgICAgICAkKCcudG9wLWJhciArIC5zY3JlZW4nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJ2FbZGF0YS10b2dnbGVdJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIC8vIE5vdCBwcmV0dHkgLSBqdXN0IGFkZGluZyBxdWljayBhbmQgZGlydHkgc2hhcmUgbGluayBhY3Rpb25cclxuICAgICAgICAgICQoJy5zaGFyZS10b2dnbGUtdHJpZ2dlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJCgnLmluZm8tdG9nZ2xlJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgJCgnLnNoYXJlLXRvZ2dsZS1jbG9zZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJCgnLmluZm8tdG9nZ2xlJykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy0tLS0tXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZE11bHRpVGFiVG9nZ2xlSGFuZGxlcnMoKSB7XHJcbiAgICAgICAgICAkKCdib2R5JykuZGVsZWdhdGUobXVsdGlUYWJUb2dnbGVTZWxlY3RvciwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgIHRvZ2dsZUJhc2UgPSAkdGhpcy5hdHRyKCdjbGFzcycpLm1hdGNoKC90b2dnbGUtKFxcUyopPygkfFxccykvKVsxXSxcclxuICAgICAgICAgICAgICAkY29udGFpbmVyID0gJHRoaXMucGFyZW50cyhtdWx0aVRhYlNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgICAgICRjb250YWluZXIuZmluZChtdWx0aVRhYlRvZ2dsZVNlbGVjdG9yKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICRjb250YWluZXIuZmluZChtdWx0aVRhYkNvbnRlbnRTZWxlY3RvcikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkdGhpcy5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICRjb250YWluZXIuZmluZCgnLmNvbnRlbnQtJyArIHRvZ2dsZUJhc2UpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhbmltYXRlUHJvZmlsZVNsaWRlcigpIHtcclxuICAgICAgICAgIHZhciAkcHJvZmlsZVBhbmVscyxcclxuICAgICAgICAgICAgcHJvZmlsZVBhbmVsSGVpZ2h0ID0gMDtcclxuXHJcbiAgICAgICAgICBpZiAoc2Nyb2xsZWRUb1ZpZXcpIHtcclxuICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIuZmluZCgnLnNsaWNrLXNsaWRlJykucmVtb3ZlQ2xhc3MoJ3NsaWNrLWNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLmZpbmQoJy5zbGljay1hY3RpdmUnKS5hZGRDbGFzcygnc2xpY2stY29tcGxldGUnKTtcclxuICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXJcclxuICAgICAgICAgICAgICAuZmluZCgnLnNsaWNrLXNsaWRlOm5vdCguc2xpY2stY29tcGxldGUpJylcclxuICAgICAgICAgICAgICAuZmluZCgnLnByb2ZpbGUtY291bnRlciBjYW52YXMnKVxyXG4gICAgICAgICAgICAgIC50cmlnZ2VyKCdjbGVhckFuaW1hdGUnKTtcclxuICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXJcclxuICAgICAgICAgICAgICAuZmluZCgnLnNsaWNrLWNvbXBsZXRlJylcclxuICAgICAgICAgICAgICAuZmluZCgnLnByb2ZpbGUtY291bnRlciBjYW52YXMnKVxyXG4gICAgICAgICAgICAgIC50cmlnZ2VyKCdzdGFydEFuaW1hdGUnKTtcclxuICAgICAgICAgICAgaWYgKCRwcm9maWxlU2xpZGVyLmZpbmQoJy5zbGljay1hY3RpdmUnKS5pcygnW2NsYXNzKj1wcm9maWxlLV0nKSB8fCBpc1Jlc3BvbnNpdmVTdGF0ZSkge1xyXG4gICAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLmFkZENsYXNzKCdjb250cmFzdC1hcnJvdycpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLnJlbW92ZUNsYXNzKCdjb250cmFzdC1hcnJvdycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRwcm9maWxlUGFuZWxzID0gJHByb2ZpbGVTbGlkZXIuZmluZCgnLnByb2ZpbGUtMS1zbGlkZSwgLnByb2ZpbGUtMi1zbGlkZScpO1xyXG4gICAgICAgICAgICAkcHJvZmlsZVBhbmVscy5jc3MoeyBoZWlnaHQ6ICdhdXRvJyB9KTtcclxuICAgICAgICAgICAgJHByb2ZpbGVQYW5lbHMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSAkKHRoaXMpLm91dGVySGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChjdXJyZW50ID4gcHJvZmlsZVBhbmVsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICBwcm9maWxlUGFuZWxIZWlnaHQgPSBjdXJyZW50O1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRwcm9maWxlUGFuZWxzLmNzcyh7IGhlaWdodDogcHJvZmlsZVBhbmVsSGVpZ2h0IH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlU2xpZGVyU3RhdGUoc2xpZGVyLCBzdGF0ZSkge1xyXG4gICAgICAgICAgc2xpZGVyLnNsaWNrKFwic2xpY2tTZXRPcHRpb25cIiwgXCJhY2Nlc3NpYmlsaXR5XCIsIHN0YXRlKTtcclxuICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwiZHJhZ2dhYmxlXCIsIHN0YXRlKTtcclxuICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwic3dpcGVcIiwgc3RhdGUpO1xyXG4gICAgICAgICAgc2xpZGVyLnNsaWNrKFwic2xpY2tTZXRPcHRpb25cIiwgXCJ0b3VjaE1vdmVcIiwgc3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZGVsYXllZEhhbmRsZVdpbmRvd1NpemluZygpIHtcclxuICAgICAgICAgIGlmICh3aW5kb3dTaXppbmdEZWxheSkge1xyXG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHdpbmRvd1NpemluZ0RlbGF5KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB3aW5kb3dTaXppbmdEZWxheSA9IHdpbmRvdy5zZXRUaW1lb3V0KGhhbmRsZVdpbmRvd1NpemluZywgMjUwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWRIYW5kbGVXaW5kb3dTY3JvbGwoKSB7XHJcbiAgICAgICAgICBpZiAod2luZG93U2Nyb2xsaW5nRGVsYXkpIHtcclxuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh3aW5kb3dTY3JvbGxpbmdEZWxheSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgd2luZG93U2Nyb2xsaW5nRGVsYXkgPSB3aW5kb3cuc2V0VGltZW91dChoYW5kbGVXaW5kb3dTY3JvbGxpbmcsIDI1MCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVPdmVybGF5RnJvbUhhc2goZXZlbnQpIHtcclxuICAgICAgICAgIHZhciBmdWxsSGFzaEZyYWdtZW50ID0gJyNvdXItZWRnZS0nO1xyXG4gICAgICAgICAgLy9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGlmICghb3ZlcmxheU9wZW4gJiYgbG9jYXRpb24uaGFzaC5pbmRleE9mKGZ1bGxIYXNoRnJhZ21lbnQpID09PSAwKSB7XHJcbiAgICAgICAgICAgIG92ZXJsYXkub3Blbk92ZXJsYXkoXHJcbiAgICAgICAgICAgICAgJGVkZ2VPdmVybGF5TG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgaGFuZGxlT3ZlcmxheU9wZW4sIGhhbmRsZU92ZXJsYXlDbG9zZSwgdHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVPdmVybGF5T3BlbihldmVudCkge1xyXG4gICAgICAgICAgdmFyIGluaXRpYWxJbmRleDtcclxuXHJcbiAgICAgICAgICBpbml0U2xpZGVyKCRvdmVybGF5U2xpZGVyLCB7XHJcbiAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpbml0aWFsSW5kZXggPSAkb3ZlcmxheVNsaWRlclxyXG4gICAgICAgICAgICAuZmluZCgnLicgKyBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyNvdXItJywgJycpICsgJzpub3QoLnNsaWNrLWNsb25lZCknKVxyXG4gICAgICAgICAgICAuYXR0cignZGF0YS1zbGljay1pbmRleCcpO1xyXG4gICAgICAgICAgJG92ZXJsYXlTbGlkZXIuc2xpY2soJ3NsaWNrR29UbycsIGluaXRpYWxJbmRleCwgdHJ1ZSk7XHJcbiAgICAgICAgICAkb3ZlcmxheVNsaWRlci5vbignYWZ0ZXJDaGFuZ2UnLCBoYW5kbGVTbGlkZUNoYW5nZSk7XHJcbiAgICAgICAgICBoYW5kbGVTbGlkZUNoYW5nZShudWxsLCBudWxsLCBwYXJzZUludCgkKCcjbW9kYWxPdmVybGF5IC5zbGljay1hY3RpdmUnKS5hdHRyKCdkYXRhLXNsaWNrLWluZGV4JykpKTtcclxuICAgICAgICAgIGhhbmRsZVdpbmRvd1NpemluZygpO1xyXG4gICAgICAgICAgb3ZlcmxheU9wZW4gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUNsb3NlKGV2ZW50KSB7XHJcbiAgICAgICAgICB2YXIgeVBvcyxcclxuICAgICAgICAgICAgb3ZlcmxheUNvbnRlbnQgPSAkKCcjbW9kYWxPdmVybGF5ID4gZGl2Jyk7XHJcblxyXG4gICAgICAgICAgJG92ZXJsYXlTbGlkZXIuc2xpY2soJ3Vuc2xpY2snKTtcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLm9mZignYWZ0ZXJDaGFuZ2UnKTtcclxuICAgICAgICAgICQoJy5vdmVybGF5LXJlcG9zaXRvcnknKS5hcHBlbmQob3ZlcmxheUNvbnRlbnQpO1xyXG4gICAgICAgICAgaWYgKFwicHVzaFN0YXRlXCIgaW4gaGlzdG9yeSlcclxuICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoXCJcIiwgZG9jdW1lbnQudGl0bGUsIGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoKTtcclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB5UG9zID0gJChkb2N1bWVudCkuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uLmhhc2ggPSBcIlwiO1xyXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoeVBvcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvdmVybGF5T3BlbiA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU2xpZGVDaGFuZ2UoZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUpIHtcclxuICAgICAgICAgIHZhciBuZXh0U2xpZGUgPSAoY3VycmVudFNsaWRlICsgMSkgJSAoJCgnLnNsaWNrLXNsaWRlOm5vdCguc2xpY2stY2xvbmVkKScpLmxlbmd0aCAtIDEpLFxyXG4gICAgICAgICAgICBuZXh0VGl0bGUgPSAkKCRvdmVybGF5U2xpZGVyLmZpbmQoJ1tkYXRhLXNsaWNrLWluZGV4PScgKyBuZXh0U2xpZGUgKyAnXSAuY29sdW1uczpmaXJzdC1jaGlsZCBwJykuZ2V0KDApKS5odG1sKCksXHJcbiAgICAgICAgICAgIG5ld0hhc2ggPSAnb3VyLScgKyAkb3ZlcmxheVNsaWRlclxyXG4gICAgICAgICAgICAgICAgLmZpbmQoJ1tkYXRhLXNsaWNrLWluZGV4PScgKyBjdXJyZW50U2xpZGUgKyAnXScpXHJcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnKVxyXG4gICAgICAgICAgICAgICAgLm1hdGNoKC8oZWRnZS1cXFMqKS8pWzFdO1xyXG5cclxuICAgICAgICAgICQoJyNtb2RhbE92ZXJsYXkgLmNhcm91c2VsLW5leHQgYScpLmh0bWwobmV4dFRpdGxlKTtcclxuICAgICAgICAgIGxvY2F0aW9uLmhhc2ggPSBuZXdIYXNoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlV2luZG93U2l6aW5nKGluaXQpIHtcclxuICAgICAgICAgIHZhciB3aW5kb3dXaWR0aCA9ICQod2luZG93KS53aWR0aCgpLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlTGltaXQgPSAwLFxyXG4gICAgICAgICAgICBuZXdJc1Jlc3BvbnNpdmVTdGF0ZSA9IHdpbmRvd1dpZHRoIDwgcmVzcG9uc2l2ZUxpbWl0O1xyXG5cclxuICAgICAgICAgIGlmICgkb3ZlcmxheVNsaWRlci5pcygnLnNsaWNrLWluaXRpYWxpemVkJykpIHtcclxuICAgICAgICAgICAgY2hhbmdlU2xpZGVyU3RhdGUoJG92ZXJsYXlTbGlkZXIsICFuZXdJc1Jlc3BvbnNpdmVTdGF0ZSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGlzUmVzcG9uc2l2ZVN0YXRlICE9PSBuZXdJc1Jlc3BvbnNpdmVTdGF0ZSkge1xyXG4gICAgICAgICAgICBpc1Jlc3BvbnNpdmVTdGF0ZSA9IG5ld0lzUmVzcG9uc2l2ZVN0YXRlO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpbml0KSB7XHJcbiAgICAgICAgICAgIGluaXRQcm9maWxlU2xpZGVyKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVXaW5kb3dTY3JvbGxpbmcoKSB7XHJcbiAgICAgICAgICBpZiAoIXNjcm9sbGVkVG9WaWV3KSB7XHJcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyAkKHdpbmRvdykuaGVpZ2h0KCkgPiAkcHJvZmlsZVNsaWRlci5vZmZzZXQoKS50b3ApIHtcclxuICAgICAgICAgICAgICBzY3JvbGxlZFRvVmlldyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoYW5pbWF0ZVByb2ZpbGVTbGlkZXIsIDUwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXRQcm9maWxlU2xpZGVyKCkge1xyXG4gICAgICAgICAgaW5pdFNsaWRlcigkcHJvZmlsZVNsaWRlciwge1xyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogdHJ1ZSxcclxuICAgICAgICAgICAgcHJldkFycm93OiAnPHNwYW4gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2Fyb3VzZWwtcHJldlwiPjxpbWcgc3JjPVwiLi4vaW1hZ2VzL0Fycm93LU1haW5BcnRpY2xlLUNhcm91c2VsLUJsYWNrLUwuc3ZnXCI+PC9zcGFuPicsXHJcbiAgICAgICAgICAgIG5leHRBcnJvdzogJzxzcGFuIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNhcm91c2VsLW5leHRcIj48aW1nIHNyYz1cIi4uL2ltYWdlcy9BcnJvdy1NYWluQXJ0aWNsZS1DYXJvdXNlbC1CbGFjay1SLnN2Z1wiPjwvc3Bhbj4nXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGFuaW1hdGVQcm9maWxlU2xpZGVyKCk7XHJcbiAgICAgICAgICAkcHJvZmlsZVNsaWRlci5vbignYWZ0ZXJDaGFuZ2UnLCBhbmltYXRlUHJvZmlsZVNsaWRlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0U2xpZGVyKHRhcmdldCwgb3B0aW9ucykge1xyXG4gICAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICBzcGVlZDogNzUwLFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXHJcbiAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAyLFxyXG4gICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2OCxcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHRhcmdldC5zbGljaygkLmV4dGVuZChkZWZhdWx0cywgb3B0aW9ucykpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gT3ZlcmxheU1vZHVsZSgpIHtcclxuICAgICAgICB2YXIgJG92ZXJsYXksXHJcbiAgICAgICAgICAkYm9keSA9ICQoJ2JvZHknKSxcclxuICAgICAgICAgIG92ZXJsYXlTaXppbmdEZWxheSxcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZSA9IHt9LFxyXG4gICAgICAgICAgaXNPcGVuRmxhZyA9IGZhbHNlLFxyXG4gICAgICAgICAgJGNsb3NlQnV0dG9uO1xyXG5cclxuICAgICAgICBpbml0T3ZlcmxheSgpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgb3Blbk92ZXJsYXk6IG9wZW5PdmVybGF5LFxyXG4gICAgICAgICAgaXNPcGVuOiBpc09wZW5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0T3ZlcmxheSgpIHtcclxuICAgICAgICAgICRvdmVybGF5ID0gJCgnPGRpdj48L2Rpdj4nKTtcclxuICAgICAgICAgICRvdmVybGF5LmF0dHIoJ2lkJywgJ21vZGFsT3ZlcmxheScpO1xyXG4gICAgICAgICAgJG92ZXJsYXkuYXR0cignY2xhc3MnLCAncmV2ZWFsJyk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5hdHRyKCdkYXRhLXJldmVhbCcsIHRydWUpO1xyXG4gICAgICAgICAgJGJvZHkuYXBwZW5kKCRvdmVybGF5KTtcclxuICAgICAgICAgICRvdmVybGF5Lm9uKCdvcGVuLnpmLnJldmVhbCcsIGhhbmRsZU92ZXJsYXlPcGVuKTtcclxuICAgICAgICAgICQod2luZG93KS5vbignY2xvc2VkLnpmLnJldmVhbCcsIGhhbmRsZU92ZXJsYXlDbG9zZSk7XHJcbiAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGRlbGF5ZWRIYW5kbGVPdmVybGF5U2l6aW5nKTtcclxuICAgICAgICAgIGluaXRDbG9zZUJ1dHRvbigpO1xyXG4gICAgICAgICAgbmV3IEZvdW5kYXRpb24uUmV2ZWFsKCRvdmVybGF5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZGVsYXllZEhhbmRsZU92ZXJsYXlTaXppbmcoKSB7XHJcbiAgICAgICAgICBpZiAob3ZlcmxheVNpemluZ0RlbGF5KSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQob3ZlcmxheVNpemluZ0RlbGF5KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBvdmVybGF5U2l6aW5nRGVsYXkgPSB3aW5kb3cuc2V0VGltZW91dChvdmVybGF5U2l6aW5nLCAyNTApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUNsb3NlKGV2ZW50KSB7XHJcbiAgICAgICAgICBpc09wZW5GbGFnID0gZmFsc2U7XHJcbiAgICAgICAgICBpZiAoY3VycmVudEluc3RhbmNlLmNsb3NlKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5jbG9zZShldmVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvdmVybGF5U2l6ZUNsZWFudXAoKTtcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZSA9IHt9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheU9wZW4oZXZlbnQpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBpc09wZW5GbGFnID0gdHJ1ZTtcclxuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICAgICRvdmVybGF5LmZpbmQoJyonKS5mb3VuZGF0aW9uKCk7XHJcbiAgICAgICAgICBpZiAoY3VycmVudEluc3RhbmNlLm9wZW4pIHtcclxuICAgICAgICAgICAgY3VycmVudEluc3RhbmNlLm9wZW4oZXZlbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3ZlcmxheVNpemluZygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdENsb3NlQnV0dG9uKCkge1xyXG4gICAgICAgICAgdmFyICRpbm5lclNwYW4gPSAkKCc8c3Bhbj48L3NwYW4+Jyk7XHJcblxyXG4gICAgICAgICAgJGNsb3NlQnV0dG9uID0gJCgnPGJ1dHRvbiBkYXRhLWNsb3NlPjwvYnV0dG9uPicpO1xyXG4gICAgICAgICAgJGNsb3NlQnV0dG9uLmFkZENsYXNzKCdjbG9zZS1idXR0b24nKTtcclxuICAgICAgICAgICRjbG9zZUJ1dHRvbi5hdHRyKCdhcmlhLWxhYmVsJywgJ0Nsb3NlIG1vZGFsJyk7XHJcbiAgICAgICAgICAkaW5uZXJTcGFuLmF0dHIoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XHJcbiAgICAgICAgICAkaW5uZXJTcGFuLmh0bWwoJyZ0aW1lczsnKTtcclxuICAgICAgICAgICRjbG9zZUJ1dHRvbi5hcHBlbmQoJGlubmVyU3Bhbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc09wZW4oKSB7XHJcbiAgICAgICAgICByZXR1cm4gaXNPcGVuRmxhZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5PdmVybGF5KHVybE9yTWFya3VwLCBvcGVuQ2FsbGJhY2ssIGNsb3NlQ2FsbGJhY2ssIGZ1bGxTY3JlZW4pIHtcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5vcGVuID0gb3BlbkNhbGxiYWNrO1xyXG4gICAgICAgICAgY3VycmVudEluc3RhbmNlLmNsb3NlID0gY2xvc2VDYWxsYmFjaztcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5mdWxsID0gZnVsbFNjcmVlbjtcclxuICAgICAgICAgIGlmICh0eXBlb2YgdXJsT3JNYXJrdXAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIG9wZW5PdmVybGF5V2l0aEFqYXgodXJsT3JNYXJrdXApO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3Blbk92ZXJsYXlXaXRoTWFya3VwKHVybE9yTWFya3VwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvcGVuT3ZlcmxheVdpdGhBamF4KHVybCkge1xyXG4gICAgICAgICAgJC5hamF4KHVybCkuZG9uZShvcGVuT3ZlcmxheVdpdGhNYXJrdXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb3Blbk92ZXJsYXlXaXRoTWFya3VwKG1hcmt1cCkge1xyXG4gICAgICAgICAgJG92ZXJsYXkuaHRtbChtYXJrdXApO1xyXG4gICAgICAgICAgJG92ZXJsYXkuYXBwZW5kKCRjbG9zZUJ1dHRvbik7XHJcbiAgICAgICAgICBpZiAoY3VycmVudEluc3RhbmNlLmZ1bGwpIHtcclxuICAgICAgICAgICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ2Z1bGwnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICRvdmVybGF5LmZvdW5kYXRpb24oJ29wZW4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG92ZXJsYXlTaXplQ2xlYW51cCgpIHtcclxuICAgICAgICAgICRvdmVybGF5LnJlbW92ZUNsYXNzKCdmdWxsJyk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5yZW1vdmVDbGFzcygndG91cicpO1xyXG4gICAgICAgICAgJG92ZXJsYXkuaHRtbCgnJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvdmVybGF5U2l6aW5nKCkge1xyXG4gICAgICAgICAgdmFyIG92ZXJsYXlIZWlnaHQgPSAkb3ZlcmxheS5oZWlnaHQoKSxcclxuICAgICAgICAgICAgd2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG5cclxuICAgICAgICAgIGlmIChvdmVybGF5SGVpZ2h0ID4gd2luZG93SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICRvdmVybGF5LmNzcyh7XHJcbiAgICAgICAgICAgICAgdG9wOiAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkb3ZlcmxheS5hZGRDbGFzcygnZnVsbCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gVmlkZW9Nb2R1bGUoKSB7XHJcbiAgICAgICAgdmFyIHBsYXllcixcclxuICAgICAgICAgIEFQSU1vZHVsZXMsXHJcbiAgICAgICAgICB2aWRlb1BsYXllcixcclxuICAgICAgICAgIGV4cGVyaWVuY2VNb2R1bGUsXHJcbiAgICAgICAgICBhcGlJbnRlcnZhbCxcclxuICAgICAgICAgIHRlbXBsYXRlSW50ZXJ2YWwsXHJcbiAgICAgICAgICAkcmVzaXplV3JhcHBlciA9ICQoJy52aWRlby1jb250YWluZXItcmVzcG9uc2l2ZScpLFxyXG4gICAgICAgICAgJHNwaW5uZXIgPSAkKCcudmlkZW8tc3Bpbm5lci1jb250YWluZXInKSxcclxuICAgICAgICAgICRwbGFjZWhvbGRlciA9ICQoJy5qcy12aWRlby1wbGF5JyksXHJcbiAgICAgICAgICAkcGxheUFuY2hvciA9ICQoJy5qcy12aWRlby1wbGF5LWJ0bicpO1xyXG5cclxuICAgICAgICBpbml0VmlkZW8oKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdFZpZGVvKCkge1xyXG4gICAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgNjQwKSB7XHJcbiAgICAgICAgICAgIG1vYmlsZVZpZGVvTGF5b3V0KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB3aW5kb3cub25UZW1wbGF0ZUxvYWQgPSBvblRlbXBsYXRlTG9hZDtcclxuICAgICAgICAgIHdpbmRvdy5vblRlbXBsYXRlUmVhZHkgPSBvblRlbXBsYXRlUmVhZHk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBtb2JpbGVWaWRlb0xheW91dCgpIHtcclxuICAgICAgICAgIHZhciBpLCBybmQ7XHJcbiAgICAgICAgICBybmQgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMykpO1xyXG4gICAgICAgICAgdmFyICRjbG9uZSA9ICQoJy52aWRlby13cmFwcGVyIC52aWRlby1zdWJzZWN0aW9uJykuZXEocm5kKTtcclxuICAgICAgICAgICQoJy52aWRlby13cmFwcGVyIC52aWRlby1zdWJzZWN0aW9uJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAkKCcudmlkZW8td3JhcHBlcicpLmFwcGVuZCgkY2xvbmUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlUmVzaXplKCkge1xyXG4gICAgICAgICAgaWYgKHBsYXllci5nZXRNb2R1bGUoQVBJTW9kdWxlcy5FWFBFUklFTkNFKS5leHBlcmllbmNlLnR5cGUgPT09IFwiaHRtbFwiKSB7XHJcbiAgICAgICAgICAgIHZhciByZXNpemVXaWR0aCA9ICRyZXNpemVXcmFwcGVyLmlubmVyV2lkdGgoKTtcclxuICAgICAgICAgICAgdmFyIHJlc2l6ZUhlaWdodCA9ICRyZXNpemVXcmFwcGVyLmlubmVySGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIHBsYXllci5nZXRNb2R1bGUoQVBJTW9kdWxlcy5FWFBFUklFTkNFKS5zZXRTaXplKHJlc2l6ZVdpZHRoLCByZXNpemVIZWlnaHQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb25UZW1wbGF0ZUxvYWQoZXhwZXJpZW5jZUlEKSB7XHJcbiAgICAgICAgICBwbGF5ZXIgPSBicmlnaHRjb3ZlLmFwaS5nZXRFeHBlcmllbmNlKGV4cGVyaWVuY2VJRCk7XHJcbiAgICAgICAgICBBUElNb2R1bGVzID0gYnJpZ2h0Y292ZS5hcGkubW9kdWxlcy5BUElNb2R1bGVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb25UZW1wbGF0ZVJlYWR5KGV2dCkge1xyXG4gICAgICAgICAgJHNwaW5uZXIuaGlkZSgpO1xyXG4gICAgICAgICAgJHBsYWNlaG9sZGVyLnNob3coKTtcclxuICAgICAgICAgICRwbGF5QW5jaG9yLm9uKCdjbGljaycsIHBsYXlWaWRlbyk7XHJcbiAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGhhbmRsZVJlc2l6ZSk7XHJcblxyXG4gICAgICAgICAgdmlkZW9QbGF5ZXIgPSBwbGF5ZXIuZ2V0TW9kdWxlKEFQSU1vZHVsZXMuVklERU9fUExBWUVSKTtcclxuICAgICAgICAgIHZpZGVvUGxheWVyLmdldEN1cnJlbnRWaWRlbyhmdW5jdGlvbiAodmlkZW9EYXRhKSB7XHJcbiAgICAgICAgICAgIGlmICh2aWRlb0RhdGEgJiYgdmlkZW9EYXRhLmlkKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHZpZGVvRGF0YS5pZCA9PT0gNDIxOTE1MzIxNDAwMSB8fCB2aWRlb0RhdGEuaWQgPT09IDQyMjg4ODg2MjYwMDEpIHtcclxuICAgICAgICAgICAgICAgICQoJy52aWRlby1jb250YWluZXIub25lIHNwYW4nKS5kZWxheSgxNTAwKS5mYWRlT3V0KCdzbG93Jyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmICh2aWRlb0RhdGEuaWQgPT09IDQxOTMwNzg0MDQwMDEgfHwgdmlkZW9EYXRhLmlkID09PSA0MjI2MDQ2OTg5MDAxKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcudmlkZW8tY29udGFpbmVyLnR3byBzcGFuJykuZGVsYXkoMTUwMCkuZmFkZU91dCgnc2xvdycpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZiAodmlkZW9EYXRhLmlkID09PSA0MTkzMDc4MzQ4MDAxIHx8IHZpZGVvRGF0YS5pZCA9PT0gNDIxOTU2ODg0MTAwMSkge1xyXG4gICAgICAgICAgICAgICAgJCgnLnZpZGVvLWNvbnRhaW5lci50aHJlZSBzcGFuJykuZGVsYXkoMTUwMCkuZmFkZU91dCgnc2xvdycpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgLy8gJCgnLnZpZGVvLWNvbnRhaW5lcicpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgIC8vXHJcbiAgICAgICAgICAvLyAgIGlmICgkKHRoaXMpLmZpbmQoJ29iamVjdCcpKSB7XHJcbiAgICAgICAgICAvL1xyXG4gICAgICAgICAgLy8gICAgICQodGhpcykuY2hpbGRyZW4oJ3NwYW4nKS5kZWxheSgpLmhpZGUoKTtcclxuICAgICAgICAgIC8vICAgfVxyXG4gICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgICAvLyBpZiAoZXZ0LnRhcmdldC5leHBlcmllbmNlLmlkID09PSAnYmNFeHBlcmllbmNlT2JqMCcpIHtcclxuICAgICAgICAgIC8vICAgJCgnLnZpZGVvLWNvbnRhaW5lci5vbmUgc3BhbicpLmRlbGF5KCkuZmFkZU91dCgnc2xvdycpO1xyXG4gICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgLy8gaWYgKGV2dC50YXJnZXQuZXhwZXJpZW5jZS5pZCA9PT0gJ2JjRXhwZXJpZW5jZU9iajEnKSB7XHJcbiAgICAgICAgICAvLyAgICQoJy52aWRlby1jb250YWluZXIudHdvIHNwYW4nKS5kZWxheSgpLmZhZGVPdXQoJ3Nsb3cnKTtcclxuICAgICAgICAgIC8vIH1cclxuICAgICAgICAgIC8vIGlmIChldnQudGFyZ2V0LmV4cGVyaWVuY2UuaWQgPT09ICdiY0V4cGVyaWVuY2VPYmoyJykge1xyXG4gICAgICAgICAgLy8gICAkKCcudmlkZW8tY29udGFpbmVyLnRocmVlIHNwYW4nKS5kZWxheSgpLmZhZGVPdXQoJ3Nsb3cnKTtcclxuICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBsYXlWaWRlbyhldmVudCkge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQgPyBldmVudC5wcmV2ZW50RGVmYXVsdCgpIDogKGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2UpO1xyXG4gICAgICAgICAgJHBsYWNlaG9sZGVyLmhpZGUoKTtcclxuICAgICAgICAgIHZpZGVvUGxheWVyID0gcGxheWVyLmdldE1vZHVsZShBUElNb2R1bGVzLlZJREVPX1BMQVlFUik7XHJcbiAgICAgICAgICBleHBlcmllbmNlTW9kdWxlID0gcGxheWVyLmdldE1vZHVsZShBUElNb2R1bGVzLkVYUEVSSUVOQ0UpO1xyXG4gICAgICAgICAgdmlkZW9QbGF5ZXIucGxheSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAvL1xyXG5cclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgX3NlYXJjaExlZ2FjeUNvZGUoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zZWFyY2hMZWdhY3lDb2RlKCkge1xyXG5cclxuLy8gR0xPQkFMU1xyXG4gICAgdmFyIG1vZGVsVXJsID0gJ2h0dHBzOi8vc2VhcmNoLmludmVzdG9yc2dyb3VwLmNvbS9hcGkvY3dwc2VhcmNoPyc7XHJcbiAgICB2YXIgJGZpZWxkID0gJCgnI0ZpbmRBbk9mZmljZScpO1xyXG4gICAgdmFyIGxhbmcgPSAnZW4nO1xyXG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJy9mci8nKSA+IC0xKSB7XHJcbiAgICAgIGxhbmcgPSAnZnInO1xyXG4gICAgfVxyXG5cclxuLy8gUHJvY2VzcyB0aGUgbG9jYWwgcHJlZmV0Y2hlZCBkYXRhXHJcbiAgICB2YXIgc3VnZ2VzdGlvbnMgPSB7fTtcclxuICAgIHN1Z2dlc3Rpb25zLmxvY2F0aW9ucyA9IG5ldyBCbG9vZGhvdW5kKHtcclxuICAgICAgZGF0dW1Ub2tlbml6ZXI6IEJsb29kaG91bmQudG9rZW5pemVycy53aGl0ZXNwYWNlLFxyXG4gICAgICBxdWVyeVRva2VuaXplcjogQmxvb2Rob3VuZC50b2tlbml6ZXJzLndoaXRlc3BhY2UsXHJcbiAgICAgIHByZWZldGNoOiAnZGF0YS9jaXRpZXMuanNvbidcclxuICAgIH0pO1xyXG5cclxuLy8gR2V0IHRoZSByZXN1bHRzXHJcbiAgICBmdW5jdGlvbiBnZXRTZWFyY2hSZXN1bHRzKHBhcmFtcykge1xyXG4gICAgICBwYXJhbXMuc2VhcmNodHlwZSA9ICdvZmZpY2UnO1xyXG4gICAgICBwYXJhbXMubmFtZSA9ICcnO1xyXG5cclxuICAgICAgLy8gTWFrZSBzdXJlIGVycm9yIG1lc3NhZ2UgaXMgaGlkZGVuIGVhY2ggdGltZVxyXG4gICAgICAkKCcuemVyby1yZXN1bHRzJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHJcbiAgICAgICQuZ2V0SlNPTihtb2RlbFVybCwgcGFyYW1zKVxyXG4gICAgICAgIC5hbHdheXMoKVxyXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICAgICAgJCgnI3NlYXJjaFJlc3VsdHNNb2RhbCcpLnJlbW92ZUNsYXNzKCdjbG9zZWQnKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgZGlzcGxheVNlYXJjaFJlc3VsdHMoJ29mZmljZS10ZW1wbGF0ZScsIHJlc3VsdCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCcuemVyby1yZXN1bHRzJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdEYXRhIGNvdWxkIG5vdCBiZSByZXRyaWV2ZWQsIHBsZWFzZSB0cnkgYWdhaW4nLCByZXN1bHQuc3RhdHVzICsgJyAnICsgcmVzdWx0LnN0YXR1c1RleHQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbi8vIEJlY2F1c2Ugd2UgYXJlIG9ubHkgc2VhcmNoaW5nIGZvciBjaXRpZXMsIHRoaXMgZnVuY3Rpb24gaXMgc2xpZ2h0bHkgcmVkdW5kYW50IC0gbGVhdmluZyBpdCBpbiBwbGFjZSBmb3Igbm93XHJcbiAgICBmdW5jdGlvbiBwYXJzZVNlYXJjaFN0cmluZygpIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICB2YXIgc2VhcmNoID0gJGZpZWxkLnZhbCgpO1xyXG5cclxuICAgICAgcmVzdWx0LmNpdHkgPSAnJztcclxuXHJcbiAgICAgIC8vIFNlYXJjaCBpbiB0aGUgbGFuZ3VhZ2Ugb2YgdGhlIHBhZ2VcclxuICAgICAgcmVzdWx0LmxhbmcgPSBsYW5nO1xyXG4gICAgICAvLyBXZSBvbmx5IHNlYXJjaCBjb25zdWx0YW50cyBmcm9tIHRoaXMgbWV0aG9kXHJcbiAgICAgIHJlc3VsdC5zZWFyY2h0eXBlID0gJ2Nvbic7XHJcblxyXG4gICAgICAvLyBDaGVjayB0aGUgc2VhcmNoIHN0cmluZyBmb3IgYSBwcmV2aW91c2x5IGRlZmluZWQgbG9jYXRpb25cclxuICAgICAgdmFyIHdvcmRzID0gc2VhcmNoLnNwbGl0KCcgJyk7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyBDaGVjayBlYWNoIHdvcmQgZm9yIGEgY2l0eSBmcm9tIHRoZSBwcmVkZWZpbmVkIGxpc3RcclxuICAgICAgICB2YXIgY2l0eSA9IHN1Z2dlc3Rpb25zLmxvY2F0aW9ucy5nZXQod29yZHNbaV0pO1xyXG4gICAgICAgIGlmIChjaXR5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJlc3VsdC5jaXR5ID0gY2l0eVswXTtcclxuICAgICAgICAgIHdvcmRzLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghcmVzdWx0LmNpdHkpIHtcclxuICAgICAgICByZXN1bHQuY2l0eSA9IHdvcmRzLmpvaW4oJyAnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkaXNwbGF5U2VhcmNoUmVzdWx0cyh0ZW1wbGF0ZUlELCBqc29uKSB7XHJcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSUQpLmlubmVySFRNTDtcclxuICAgICAgTXVzdGFjaGUucGFyc2UodGVtcGxhdGUpO1xyXG4gICAgICB2YXIgcmVuZGVyZWQgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIGpzb24pO1xyXG4gICAgICAkKCcjc2VhcmNoUmVzdWx0c01vZGFsJykuYXBwZW5kKHJlbmRlcmVkKTtcclxuICAgICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuLy9Jbml0IGV2ZXJ5dGhpbmdcclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBUcnkgdG8gcHJlZGV0ZXJtaW5lIHdoYXQgcmVzdWx0cyBzaG91bGQgc2hvd1xyXG4gICAgICAvLyBTZXR1cCB0aGUgdHlwZWFoZWFkXHJcbiAgICAgICQoJy50eXBlYWhlYWQnKS50eXBlYWhlYWQoe1xyXG4gICAgICAgICAgaGlnaGxpZ2h0OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7bmFtZTogJ2xvY2F0aW9ucycsIHNvdXJjZTogc3VnZ2VzdGlvbnMubG9jYXRpb25zLCBsaW1pdDogMn1cclxuICAgICAgKTtcclxuXHJcbiAgICAgIC8vIFNldHVwIHRoZSBmb3JtIHN1Ym1pc3Npb25cclxuICAgICAgJCgnLnNlYXJjaC1mb3JtJykuc3VibWl0KGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciBwYXJhbXMgPSBwYXJzZVNlYXJjaFN0cmluZygpO1xyXG4gICAgICAgIGdldFNlYXJjaFJlc3VsdHMocGFyYW1zKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBGYWtlIG1vZGFsIC0gQWRkaW5nIGhhbmRsZXIgb24gZG9jdW1lbnQgc28gaXQgZmlyZXMgZGVzcGl0ZSB0aGUgYnV0dG9uIG5vdCBiZWluZyByZW5kZXJlZCB5ZXRcclxuICAgICAgJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcIiNzZWFyY2hSZXN1bHRzTW9kYWwgLmNsb3NlLWJ1dHRvblwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnI3NlYXJjaFJlc3VsdHNNb2RhbCcpLmFkZENsYXNzKCdjbG9zZWQnKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICB9LCA0MDApO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiLyogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBmb3Igcm9sbHVwIChodHRwOi8vcm9sbHVwanMub3JnLykgYW5kXHJcbiBlc3NlbnRpb25hbGx5ICdib290c3RyYXBzJyBvdXIgaWcuY29tICdhcHBsaWNhdGlvbicuXHJcblxyXG4gQWxsIG1vZHVsZXMgc2hvdWxkIGJlIGltcG9ydGVkIGhlcmUgc28gdGhhdCB0aGV5IGNhbiBiZSBpbml0aWFsaXplZCBvblxyXG4gYSBjYXNlLWJ5LWNhc2UgYmFzaXMgKG5vdCBhbGwgcGFnZXMgcmVxdWlyZSB0aGUgaW5pdGlhbGl6YXRpb24gb2YgYSBjYXJvdXNlbFxyXG4gZm9yIGluc3RhbmNlKS5cclxuXHJcbiBBbnkgdGFza3Mgb3IgcHJvY2Vzc2VzIHRoYXQgbmVlZCB0byBiZSBpbml0aWF0ZWQgb24gcGFnZSBsb2FkIHNob3VsZCBsaXZlIGluIHRoaXNcclxuIGZpbGUgYXMgd2VsbC4gQW4gaW5jbHVkZWQgZXhhbXBsZSBpcyBhIG1ldGhvZCB0aGF0IGFkZHMgYW4gJ2VuJyBvciAnZnInIGNsYXNzIHRvXHJcbiB0aGUgYm9keSBiYXNlZCBvbiB0aGUgZ2xvYmFsIGxhbmd1YWdlIHZhcmlhYmxlIHRoYXQgd2UgY2FuIHRoZW4gdXNlIHRvIHdyaXRlIGN1c3RvbVxyXG4gc3R5bGVzIGZvciBlYWNoIGxhbmd1YWdlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBmb3JtcyBmcm9tICcuL2Zvcm1zLmpzJztcclxuaW1wb3J0IGNhcm91c2VsIGZyb20gJy4vY2Fyb3VzZWwuanMnO1xyXG5pbXBvcnQgY2FyZWVycyBmcm9tICcuL2NhcmVlcnMuanMnO1xyXG5pbXBvcnQgc2VhcmNoIGZyb20gJy4vc2VhcmNoLmpzJztcclxuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuLy8gRXZlbnQgRW1pdHRlciB0ZXN0IG1vZHVsZXNcclxuLy8gaW1wb3J0IGV2dDEgZnJvbSAnLi9ldmVudC10ZXN0LTEuanMnO1xyXG4vLyBpbXBvcnQgZXZ0MiBmcm9tICcuL2V2ZW50LXRlc3QtMi5qcyc7XHJcblxyXG5jb25zdCBhcHAgPSAoKCkgPT4ge1xyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBGb3VuZGF0aW9uXHJcbiAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XHJcblxyXG4gICAgLy8gQ2hlY2sgZm9yIGNvbXBvbmVudHNcclxuICAgIGlmICgkKCcuaWctZm9ybScpLmxlbmd0aCkgZm9ybXMuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1jYXJvdXNlbCcpLmxlbmd0aCkgY2Fyb3VzZWwuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1zZWFyY2gnKS5sZW5ndGgpIHNlYXJjaC5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmlnLWNhcmVlcnMnKS5sZW5ndGgpIGNhcmVlcnMuaW5pdCgpO1xyXG5cclxuICAgIC8vIENvbXBvbmVudHMgY2FuIGFsc28gYmUgc2V0dXAgdG8gcmVjZWl2ZSBhbiBIVE1MICdzY29wZScgKC5pZy1ldnQxLi4uIC5pZy1ldnQyLi4uLiBldGMpXHJcbiAgICAvLyBpZiAoJCgnLmlnLWV2dDEnKS5sZW5ndGgpIGV2dDEuaW5pdCgnLmlnLWV2dDEnKTtcclxuICAgIC8vIGlmICgkKCcuaWctZXZ0MicpLmxlbmd0aCkgZXZ0Mi5pbml0KCcuaWctZXZ0MicpO1xyXG5cclxuICAgIC8vIEFkZCBsYW5ndWFnZSBjbGFzcyB0byBib2R5XHJcbiAgICBfbGFuZ3VhZ2UoKTtcclxuICB9XHJcblxyXG4gIC8vIExldCdzIHVzZSBhIGdsb2JhbCB2YXJpYWJsZSAoZ2xvYmFsIGFzIGluIGF2YWlsYWJsZSB0byBhbGwgb3VyIGNvbXBvbmVudHMgLSBub3QgdGhlIHdpbmRvdyBvYmplY3QhKVxyXG4gIC8vIHRvIGFkZCBhIGNsYXNzIHRvIHRoZSBib2R5IHRhZ1xyXG4gIGZ1bmN0aW9uIF9sYW5ndWFnZSgpIHtcclxuICAgICQoJ2JvZHknKS5hZGRDbGFzcyhpZy5sYW5nKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfVxyXG59KSgpO1xyXG5cclxuLy8gQm9vdHN0cmFwIGFwcFxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgYXBwLmluaXQoKTtcclxufSk7XHJcbiJdLCJuYW1lcyI6WyJsYW5nIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsImluZGV4T2YiLCJlbWl0dGVyIiwiRXZlbnRFbWl0dGVyIiwiZW5kcG9pbnRVUkwiLCJzdWNjZXNzVVJMIiwiY2FuY2VsVVJMIiwiJGZvcm0iLCIkZm9ybVdyYXBwZXIiLCJpbml0IiwiJCIsImZpbmQiLCJkYXRhIiwiX3ZhbGlkYXRpb24iLCJqSW5wdXQiLCJjaGFuZ2UiLCJvYmpFdmVudCIsImFkZENsYXNzIiwidmFsaWRhdG9yIiwic2V0RGVmYXVsdHMiLCJhZGRNZXRob2QiLCJwb3N0YWwiLCJlbGVtZW50Iiwib3B0aW9uYWwiLCJtYXRjaCIsInZhbGlkYXRlIiwibGFiZWwiLCJjbG9zZXN0IiwibGVuZ3RoIiwicGFyZW50IiwiYXBwZW5kIiwib24iLCJyZXBsYWNlIiwiX3Byb2Nlc3MiLCJmb3JtIiwiZm9ybURhdGFSYXciLCJmb3JtRGF0YVBhcnNlZCIsInZhbGlkIiwicmVtb3ZlQ2xhc3MiLCJzZXJpYWxpemVBcnJheSIsIl9wYXJzZSIsIl9zdWJtaXQiLCJhamF4Iiwic3VjY2VzcyIsIm1zZyIsImVycm9yIiwidG8iLCJfdG9nZ2xlciIsImhpZGUiLCJzaG93IiwibG9nIiwidG9nZ2xlQ2xhc3MiLCJfYnVpbGRDYXJvdXNlbCIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsIiRjYXJvdXNlbCIsImVhY2giLCJpbmRleCIsInNsaWNrIiwiX2NhcmVlcnNMZWdhY3lDb2RlIiwiZm4iLCJpbmZvVG9nZ2xlIiwiJHJldmVhbCIsIiRyZXZlYWxDb250ZW50IiwiJHJldmVhbFRyaWdnZXIiLCJmaXhlZEhlaWdodCIsInNldEFyaWEiLCJhdHRyIiwiaW5pdFRvZ2dsZSIsImhhbmRsZVJldmVhbFRvZ2dsZSIsInJlc2l6ZUhhbmRsZXIiLCJzZXRUaW1lb3V0Iiwic2V0UmV2ZWFsQ29udGVudEhlaWdodCIsImNzcyIsImhlaWdodCIsImZpbmFsSGVpZ2h0IiwiaGFzQ2xhc3MiLCJzY3JvbGxIZWlnaHQiLCJqUXVlcnkiLCJjaXJjbGVBbmltYXRpb24iLCJtYXhWYWx1ZSIsImNhbnZhcyIsIiRjYW52YXMiLCJjb250ZXh0IiwiZCIsIndpZHRoIiwicGVyY2VudFN0cm9rZSIsInJlbWFpbmluZ1N0cm9rZSIsInJhZGl1cyIsImN1clBlcmMiLCJjaXJjIiwiTWF0aCIsIlBJIiwicXVhcnQiLCJkZWxlZ2F0ZUlEIiwiRGF0ZSIsImdldFRpbWUiLCJpcyIsImdldENvbnRleHQiLCJzdHJva2VTdHlsZSIsImZpbGxTdHlsZSIsImRlbGVnYXRlIiwiY2xlYXIiLCJhbmltYXRlIiwiY3VycmVudCIsImxpbmVXaWR0aCIsImJlZ2luUGF0aCIsImFyYyIsIm1pbiIsInN0cm9rZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImZpbGxSZWN0IiwiYmxvY2tMaW5rIiwiJGJsb2NrTGluayIsImRlc3RpbmF0aW9uIiwiaW5pdEJsb2NrIiwiaGFuZGxlQ2xpY2siLCJndWkiLCJ2aWRlbyIsIm92ZXJsYXkiLCJpbml0TGVnYWN5IiwiT3ZlcmxheU1vZHVsZSIsIkd1aU1vZHVsZSIsIlZpZGVvTW9kdWxlIiwiZSIsInRhcmdldCIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcCIsIm9mZnNldCIsInRvcCIsInNlbGVjdG9yIiwicmVzaXplIiwib3ZlcmxheVJlZmVyZW5jZSIsIm11bHRpVGFiVG9nZ2xlU2VsZWN0b3IiLCJtdWx0aVRhYkNvbnRlbnRTZWxlY3RvciIsIm11bHRpVGFiU2VsZWN0b3IiLCIkZWRnZU92ZXJsYXlMb2NhdGlvbiIsIiRvdmVybGF5U2xpZGVyIiwiJHByb2ZpbGVTbGlkZXIiLCIkcHJvZmlsZVNsaWRlclZpZGVvU2VjdGlvbkhvbGRlciIsIndpbmRvd1NpemluZ0RlbGF5Iiwid2luZG93U2Nyb2xsaW5nRGVsYXkiLCJvdmVybGF5T3BlbiIsImlzUmVzcG9uc2l2ZVN0YXRlIiwic2Nyb2xsZWRUb1ZpZXciLCJpbml0R3VpIiwiZG9jdW1lbnQiLCJmb3VuZGF0aW9uIiwiZXZlbnQiLCJiYWNrZ3JvdW5kQ29sb3IiLCIkdGhpcyIsInBhcnNlSW50IiwiaHRtbCIsImhhbmRsZU92ZXJsYXlGcm9tSGFzaCIsImRlbGF5ZWRIYW5kbGVXaW5kb3dTaXppbmciLCJkZWxheWVkSGFuZGxlV2luZG93U2Nyb2xsIiwidHJpZ2dlciIsInN0b3BQcm9wYWdhdGlvbiIsImFkZE11bHRpVGFiVG9nZ2xlSGFuZGxlcnMiLCJ0b2dnbGVCYXNlIiwiJGNvbnRhaW5lciIsInBhcmVudHMiLCJhbmltYXRlUHJvZmlsZVNsaWRlciIsIiRwcm9maWxlUGFuZWxzIiwicHJvZmlsZVBhbmVsSGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJjaGFuZ2VTbGlkZXJTdGF0ZSIsInNsaWRlciIsInN0YXRlIiwiY2xlYXJUaW1lb3V0IiwiaGFuZGxlV2luZG93U2l6aW5nIiwiaGFuZGxlV2luZG93U2Nyb2xsaW5nIiwiZnVsbEhhc2hGcmFnbWVudCIsImhhc2giLCJvcGVuT3ZlcmxheSIsImhhbmRsZU92ZXJsYXlPcGVuIiwiaGFuZGxlT3ZlcmxheUNsb3NlIiwiaW5pdGlhbEluZGV4IiwiaGFuZGxlU2xpZGVDaGFuZ2UiLCJ5UG9zIiwib3ZlcmxheUNvbnRlbnQiLCJvZmYiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwidGl0bGUiLCJzZWFyY2giLCJzY3JvbGxUb3AiLCJjdXJyZW50U2xpZGUiLCJuZXh0U2xpZGUiLCJuZXh0VGl0bGUiLCJnZXQiLCJuZXdIYXNoIiwid2luZG93V2lkdGgiLCJyZXNwb25zaXZlTGltaXQiLCJuZXdJc1Jlc3BvbnNpdmVTdGF0ZSIsImluaXRQcm9maWxlU2xpZGVyIiwiaW5pdFNsaWRlciIsIm9wdGlvbnMiLCJkZWZhdWx0cyIsImV4dGVuZCIsIiRvdmVybGF5IiwiJGJvZHkiLCJvdmVybGF5U2l6aW5nRGVsYXkiLCJjdXJyZW50SW5zdGFuY2UiLCJpc09wZW5GbGFnIiwiJGNsb3NlQnV0dG9uIiwiaXNPcGVuIiwiaW5pdE92ZXJsYXkiLCJkZWxheWVkSGFuZGxlT3ZlcmxheVNpemluZyIsIkZvdW5kYXRpb24iLCJSZXZlYWwiLCJvdmVybGF5U2l6aW5nIiwiY2xvc2UiLCJvcGVuIiwiaW5pdENsb3NlQnV0dG9uIiwiJGlubmVyU3BhbiIsInVybE9yTWFya3VwIiwib3BlbkNhbGxiYWNrIiwiY2xvc2VDYWxsYmFjayIsImZ1bGxTY3JlZW4iLCJmdWxsIiwib3Blbk92ZXJsYXlXaXRoQWpheCIsInVybCIsImRvbmUiLCJvcGVuT3ZlcmxheVdpdGhNYXJrdXAiLCJtYXJrdXAiLCJvdmVybGF5U2l6ZUNsZWFudXAiLCJvdmVybGF5SGVpZ2h0Iiwid2luZG93SGVpZ2h0IiwicGxheWVyIiwiQVBJTW9kdWxlcyIsInZpZGVvUGxheWVyIiwiZXhwZXJpZW5jZU1vZHVsZSIsImFwaUludGVydmFsIiwidGVtcGxhdGVJbnRlcnZhbCIsIiRyZXNpemVXcmFwcGVyIiwiJHNwaW5uZXIiLCIkcGxhY2Vob2xkZXIiLCIkcGxheUFuY2hvciIsImluaXRWaWRlbyIsIm9uVGVtcGxhdGVMb2FkIiwib25UZW1wbGF0ZVJlYWR5IiwibW9iaWxlVmlkZW9MYXlvdXQiLCJpIiwicm5kIiwiZmxvb3IiLCJyYW5kb20iLCIkY2xvbmUiLCJlcSIsInJlbW92ZSIsImhhbmRsZVJlc2l6ZSIsImdldE1vZHVsZSIsIkVYUEVSSUVOQ0UiLCJleHBlcmllbmNlIiwidHlwZSIsInJlc2l6ZVdpZHRoIiwiaW5uZXJXaWR0aCIsInJlc2l6ZUhlaWdodCIsImlubmVySGVpZ2h0Iiwic2V0U2l6ZSIsImV4cGVyaWVuY2VJRCIsImJyaWdodGNvdmUiLCJhcGkiLCJnZXRFeHBlcmllbmNlIiwibW9kdWxlcyIsImV2dCIsInBsYXlWaWRlbyIsIlZJREVPX1BMQVlFUiIsImdldEN1cnJlbnRWaWRlbyIsInZpZGVvRGF0YSIsImlkIiwiZGVsYXkiLCJmYWRlT3V0IiwicmV0dXJuVmFsdWUiLCJwbGF5IiwiX3NlYXJjaExlZ2FjeUNvZGUiLCJtb2RlbFVybCIsIiRmaWVsZCIsImhyZWYiLCJzdWdnZXN0aW9ucyIsImxvY2F0aW9ucyIsIkJsb29kaG91bmQiLCJ0b2tlbml6ZXJzIiwid2hpdGVzcGFjZSIsImdldFNlYXJjaFJlc3VsdHMiLCJwYXJhbXMiLCJzZWFyY2h0eXBlIiwibmFtZSIsImdldEpTT04iLCJhbHdheXMiLCJyZXN1bHQiLCJKU09OIiwicGFyc2UiLCJmYWlsIiwic3RhdHVzIiwic3RhdHVzVGV4dCIsInBhcnNlU2VhcmNoU3RyaW5nIiwidmFsIiwiY2l0eSIsIndvcmRzIiwic3BsaXQiLCJzcGxpY2UiLCJqb2luIiwiZGlzcGxheVNlYXJjaFJlc3VsdHMiLCJ0ZW1wbGF0ZUlEIiwianNvbiIsInRlbXBsYXRlIiwiZ2V0RWxlbWVudEJ5SWQiLCJpbm5lckhUTUwiLCJyZW5kZXJlZCIsIk11c3RhY2hlIiwicmVuZGVyIiwidHlwZWFoZWFkIiwic291cmNlIiwibGltaXQiLCJzdWJtaXQiLCJhcHAiLCJmb3JtcyIsImNhcm91c2VsIiwiY2FyZWVycyIsIl9sYW5ndWFnZSIsImlnIiwicmVhZHkiXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7Ozs7Ozs7QUFTQSxBQUFPOzs7QUFLUCxBQUFPLElBQUlBLE9BQVEsWUFBTTtNQUNuQkMsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBeUJDLE9BQXpCLENBQWlDLE1BQWpDLE1BQTZDLENBQUMsQ0FBbEQsRUFBcUQ7V0FDNUMsSUFBUDtHQURGLE1BRU87V0FDRSxJQUFQOztDQUpjLEVBQVg7OztBQVNQLEFBQU87OztBQUtQLEFBQU8sSUFBSUMsVUFBVSxJQUFJQyxZQUFKLEVBQWQ7O0FDMUJQLFlBQWUsQ0FBQyxZQUFNOztNQUVoQkMsV0FBSixFQUNFQyxVQURGLEVBRUVDLFNBRkYsRUFHRUMsS0FIRixFQUlFQyxZQUpGOztXQU1TQyxJQUFULEdBQWdCOzttQkFFQ0MsRUFBRSxVQUFGLENBQWY7WUFDUUYsYUFBYUcsSUFBYixDQUFrQixNQUFsQixDQUFSO2tCQUNjSCxhQUFhRyxJQUFiLENBQWtCLE1BQWxCLEVBQTBCQyxJQUExQixDQUErQixVQUEvQixDQUFkO2dCQUNZSixhQUFhRyxJQUFiLENBQWtCLE1BQWxCLEVBQTBCQyxJQUExQixDQUErQixRQUEvQixDQUFaOzs7Ozs7V0FNT0MsV0FBVCxHQUF1Qjs7UUFFakJDLFNBQVNKLEVBQUUsa0JBQUYsQ0FBYjtXQUNPSyxNQUFQLENBQWMsVUFBVUMsUUFBVixFQUFvQjtRQUM5QixJQUFGLEVBQVFDLFFBQVIsQ0FBaUIsT0FBakI7S0FERjs7TUFJRUMsU0FBRixDQUFZQyxXQUFaLENBQXdCO2FBQ2YsSUFEZTtlQUViO0tBRlg7O01BS0VELFNBQUYsQ0FBWUUsU0FBWixDQUFzQixXQUF0QixFQUFtQyxVQUFVQyxNQUFWLEVBQWtCQyxPQUFsQixFQUEyQjthQUNyRCxLQUFLQyxRQUFMLENBQWNELE9BQWQsS0FDTEQsT0FBT0csS0FBUCxDQUFhLCtDQUFiLENBREY7S0FERixFQUdHLHFDQUhIOztVQUtNQyxRQUFOLENBQWU7cUJBQ0UseUJBQVk7O09BRGQ7c0JBSUcsd0JBQVVDLEtBQVYsRUFBaUJKLE9BQWpCLEVBQTBCOztZQUVwQyxDQUFDWixFQUFFWSxPQUFGLEVBQVdLLE9BQVgsQ0FBbUIsTUFBbkIsRUFBMkJoQixJQUEzQixDQUFnQyx3QkFBaEMsRUFBMERpQixNQUEvRCxFQUF1RTtZQUNuRU4sT0FBRixFQUFXTyxNQUFYLEdBQW9CQyxNQUFwQixDQUEyQkosS0FBM0I7U0FERixNQUVPO1lBQ0hKLE9BQUYsRUFBV0ssT0FBWCxDQUFtQixNQUFuQixFQUEyQmhCLElBQTNCLENBQWdDLHdCQUFoQyxFQUEwRG1CLE1BQTFELENBQWlFSixLQUFqRTs7T0FUUzthQVlOO2VBQ0U7b0JBQ0ssSUFETDttQkFFSTtTQUhOO2dCQUtHO29CQUNJLElBREo7bUJBRUc7U0FQTjtxQkFTUTtvQkFDRCxJQURDO3FCQUVBO1NBWFI7bUJBYU07b0JBQ0MsSUFERDtxQkFFRTtTQWZSO2tCQWlCSztvQkFDRSxJQURGO3FCQUVHO1NBbkJSO2VBcUJFO29CQUNLLElBREw7cUJBRU07U0F2QlI7Z0JBeUJHO29CQUNJLElBREo7cUJBRUs7OztLQXZDakI7O1VBNENNZixJQUFOLENBQVcsZUFBWCxFQUE0Qm9CLEVBQTVCLENBQStCLE9BQS9CLEVBQXdDLFlBQVk7YUFDM0NoQyxRQUFQLENBQWdCaUMsT0FBaEIsQ0FBd0IxQixTQUF4QjtLQURGOzs7V0FNTzJCLFFBQVQsQ0FBa0JDLElBQWxCLEVBQXdCO1FBQ2xCQyxXQUFKLEVBQ0VDLGNBREY7O1FBR0k3QixNQUFNOEIsS0FBTixFQUFKLEVBQW1CO1lBQ1hDLFdBQU4sQ0FBa0IsY0FBbEI7bUJBQ2FyQixRQUFiLENBQXNCLFlBQXRCO29CQUNjVixNQUFNZ0MsY0FBTixFQUFkOzt1QkFFaUJDLE9BQU9MLFdBQVAsQ0FBakI7O2NBRVFDLGNBQVI7O1dBRUssS0FBUDs7O1dBR09JLE1BQVQsQ0FBZ0I1QixJQUFoQixFQUFzQjs7OztXQUliQSxJQUFQOzs7V0FHTzZCLE9BQVQsQ0FBaUI3QixJQUFqQixFQUF1QjtNQUNuQjhCLElBQUYsQ0FBTztjQUNHLE1BREg7V0FFQXRDLFdBRkE7WUFHQ1E7S0FIUixFQUlHK0IsT0FKSCxDQUlXLFVBQVVDLEdBQVYsRUFBZTttQkFDWDNCLFFBQWIsQ0FBc0IsU0FBdEI7bUJBQ2FxQixXQUFiLENBQXlCLFlBQXpCO0tBTkYsRUFRR08sS0FSSCxDQVFTLFVBQVVELEdBQVYsRUFBZTtZQUNkM0IsUUFBTixDQUFlLGNBQWY7bUJBQ2FxQixXQUFiLENBQXlCLFlBQXpCO2dCQUNVUSxFQUFWLENBQWFwQyxFQUFFLGVBQUYsQ0FBYjtLQVhKOzs7V0FlT3FDLFFBQVQsR0FBb0I7O01BRWhCLFVBQUYsRUFBY2hCLEVBQWQsQ0FBaUIsT0FBakIsRUFBMEIsWUFBWTtRQUNsQyxpQkFBRixFQUFxQmlCLElBQXJCO1FBQ0UsTUFBTXRDLEVBQUUsSUFBRixFQUFRRSxJQUFSLENBQWEsU0FBYixDQUFSLEVBQWlDcUMsSUFBakM7S0FGRjs7O1NBTUs7O0dBQVA7Q0FySWEsR0FBZjs7QUNBQSxlQUFlLENBQUMsWUFBTTs7V0FFWHhDLElBQVQsR0FBZ0I7WUFDTnlDLEdBQVIsQ0FBWSx1QkFBWjs7O01BR0UsaUNBQUYsRUFBcUNuQixFQUFyQyxDQUF3QyxPQUF4QyxFQUFpRCxZQUFZO1FBQ3pELE1BQUYsRUFBVW9CLFdBQVYsQ0FBc0IsdUJBQXRCO0tBREY7Ozs7O1dBT09DLGNBQVQsR0FBMEI7UUFDcEJDLFNBQUosRUFDRUMsU0FERixFQUVFQyxTQUZGOztNQUlFLGNBQUYsRUFBa0JDLElBQWxCLENBQXVCLFVBQVVDLEtBQVYsRUFBaUI7a0JBQzFCL0MsRUFBRSxJQUFGLENBQVo7a0JBQ2E2QyxVQUFVM0MsSUFBVixDQUFlLGVBQWYsQ0FBRCxHQUFvQyx3RUFBd0UyQyxVQUFVM0MsSUFBVixDQUFlLGVBQWYsQ0FBeEUsR0FBMEcsa0JBQTlJLEdBQW1LLDZGQUEvSztrQkFDYTJDLFVBQVUzQyxJQUFWLENBQWUsZUFBZixDQUFELEdBQW9DLHdFQUF3RTJDLFVBQVUzQyxJQUFWLENBQWUsZUFBZixDQUF4RSxHQUEwRyxrQkFBOUksR0FBbUsseUZBQS9LOztnQkFFVThDLEtBQVYsQ0FBZ0I7d0JBQ0VILFVBQVUzQyxJQUFWLENBQWUsZ0JBQWYsS0FBb0MsS0FEdEM7Z0JBRU4yQyxVQUFVM0MsSUFBVixDQUFlLFFBQWYsS0FBNEIsS0FGdEI7a0JBR0oyQyxVQUFVM0MsSUFBVixDQUFlLFVBQWYsS0FBOEIsS0FIMUI7Y0FJUjJDLFVBQVUzQyxJQUFWLENBQWUsTUFBZixLQUEwQixLQUpsQjtjQUtSMkMsVUFBVTNDLElBQVYsQ0FBZSxNQUFmLEtBQTBCLEtBTGxCO2tCQU1KMkMsVUFBVTNDLElBQVYsQ0FBZSxVQUFmLEtBQThCLEtBTjFCO3FCQU9ELElBUEM7bUJBUUgwQyxTQVJHO21CQVNIRCxTQVRHO29CQVVGRSxVQUFVM0MsSUFBVixDQUFlLFlBQWYsS0FBZ0MsRUFWOUI7ZUFXUDJDLFVBQVUzQyxJQUFWLENBQWUsT0FBZixLQUEyQixFQVhwQjt3QkFZRTJDLFVBQVUzQyxJQUFWLENBQWUsZUFBZixLQUFtQyxDQVpyQztzQkFhQTJDLFVBQVUzQyxJQUFWLENBQWUsY0FBZixLQUFrQyxDQWJsQztlQWNQMkMsVUFBVTNDLElBQVYsQ0FBZSxPQUFmLEtBQTJCO09BZHBDO0tBTEY7OztTQXdCSzs7R0FBUDtDQTFDYSxHQUFmOztBQ0FBLGNBQWUsQ0FBQyxZQUFNOztXQUVYSCxJQUFULEdBQWdCOzs7OztXQUtQa0Qsa0JBQVQsR0FBOEI7O0tBRzNCLFVBQVVqRCxDQUFWLEVBQWE7O1FBRVZrRCxFQUFGLENBQUtDLFVBQUwsR0FBa0IsWUFBWTthQUN2QkwsSUFBTCxDQUFVLFlBQVk7Y0FDaEJNLFVBQVVwRCxFQUFFLElBQUYsQ0FBZDtjQUNFcUQsaUJBQWlCRCxRQUFRbkQsSUFBUixDQUFhLHNCQUFiLENBRG5CO2NBRUVxRCxpQkFBaUJGLFFBQVFuRCxJQUFSLENBQWEsc0JBQWIsQ0FGbkI7Y0FHRXNELGNBQWMsS0FIaEI7Y0FJRUMsVUFBVUosUUFBUUssSUFBUixDQUFhLGtCQUFiLE1BQXFDLE1BSmpEOzs7O21CQVFTQyxVQUFULEdBQXNCOzJCQUNMckMsRUFBZixDQUFrQixPQUFsQixFQUEyQnNDLGtCQUEzQjtjQUNFdkUsTUFBRixFQUFVaUMsRUFBVixDQUFhLFFBQWIsRUFBdUJ1QyxhQUF2Qjs7Ozs7OzttQkFPT0Qsa0JBQVQsR0FBOEI7O29CQUVwQmxCLFdBQVIsQ0FBb0IsUUFBcEI7bUJBQ09vQixVQUFQLENBQWtCQyxzQkFBbEI7OzttQkFHT0YsYUFBVCxHQUF5QjtnQkFDbkJMLFdBQUosRUFBaUI7NkJBQ0FRLEdBQWYsQ0FBbUIsRUFBRUMsUUFBUSxNQUFWLEVBQW5COzs7O21CQUlLRixzQkFBVCxHQUFrQztnQkFDNUJHLFdBQUo7O2dCQUVJYixRQUFRYyxRQUFSLENBQWlCLFFBQWpCLENBQUosRUFBZ0M7NEJBQ2hCYixlQUFlLENBQWYsRUFBa0JjLFlBQWhDOzRCQUNjLElBQWQ7YUFGRixNQUdPOzRCQUNTLENBQWQ7NEJBQ2MsS0FBZDs7MkJBRWFKLEdBQWYsQ0FBbUIsRUFBRUMsUUFBUUMsV0FBVixFQUFuQjs7Z0JBRUlULE9BQUosRUFBYTs2QkFDSUMsSUFBZixDQUFvQixhQUFwQixFQUFtQyxDQUFDRixXQUFwQzs7O1NBM0NOOztlQWdETyxJQUFQO09BakRGO0tBRkYsRUFzREdhLE1BdERIOztLQXlEQyxVQUFVcEUsQ0FBVixFQUFhOzs7UUFHVmtELEVBQUYsQ0FBS21CLGVBQUwsR0FBdUIsVUFBVUMsUUFBVixFQUFvQjthQUNwQ3hCLElBQUwsQ0FBVSxZQUFZO2NBQ2hCeUIsU0FBUyxJQUFiO2NBQ0VDLFVBQVV4RSxFQUFFLElBQUYsQ0FEWjtjQUVFeUUsT0FGRjtjQUdFQyxJQUFJSCxPQUFPSSxLQUFQLEdBQWUsQ0FIckI7Y0FJRUMsZ0JBQWdCLENBSmxCO2NBS0VDLGtCQUFrQixDQUxwQjtjQU1FQyxTQUFTSixJQUFJRSxhQU5mO2NBT0VHLFVBQVUsQ0FQWjtjQVFFQyxPQUFPQyxLQUFLQyxFQUFMLEdBQVUsQ0FSbkI7Y0FTRUMsUUFBUUYsS0FBS0MsRUFBTCxHQUFVLENBVHBCO2NBVUVFLGFBQWEsSUFBSUMsSUFBSixHQUFXQyxPQUFYLEtBQXVCLElBVnRDOztjQVlJLENBQUNkLFFBQVFlLEVBQVIsQ0FBVyxRQUFYLENBQUwsRUFBMkI7Ozs7b0JBSWpCaEIsT0FBT2lCLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBVjtrQkFDUUMsV0FBUixHQUFzQixTQUF0QjtrQkFDUUMsU0FBUixHQUFvQixTQUFwQjs7Ozs7O2tCQU1RakMsSUFBUixDQUFhLHFCQUFiLEVBQW9DMkIsVUFBcEM7WUFDRSxNQUFGLEVBQVVPLFFBQVYsQ0FBbUIsMEJBQTBCUCxVQUExQixHQUF1QyxHQUExRCxFQUErRCxjQUEvRCxFQUErRSxZQUFZO3NCQUMvRSxDQUFWOztXQURGO1lBSUUsTUFBRixFQUFVTyxRQUFWLENBQW1CLDBCQUEwQlAsVUFBMUIsR0FBdUMsR0FBMUQsRUFBK0QsY0FBL0QsRUFBK0VRLEtBQS9FOzttQkFFU0MsT0FBVCxDQUFpQkMsT0FBakIsRUFBMEI7c0JBQ2RBLFVBQVVBLE9BQVYsR0FBb0IsQ0FBOUI7O29CQUVRQyxTQUFSLEdBQW9CbkIsYUFBcEI7b0JBQ1FvQixTQUFSO29CQUNRQyxHQUFSLENBQVl2QixDQUFaLEVBQWVBLENBQWYsRUFBa0JJLE1BQWxCLEVBQTBCLENBQUVLLEtBQTVCLEVBQXNDSCxJQUFELEdBQVMsQ0FBQ0MsS0FBS2lCLEdBQUwsQ0FBU0osT0FBVCxFQUFrQnhCLFdBQVcsR0FBN0IsQ0FBWCxHQUFnRGEsS0FBcEYsRUFBMkYsSUFBM0Y7b0JBQ1FnQixNQUFSO29CQUNRSixTQUFSLEdBQW9CbEIsZUFBcEI7b0JBQ1FtQixTQUFSO29CQUNRQyxHQUFSLENBQVl2QixDQUFaLEVBQWVBLENBQWYsRUFBa0JJLE1BQWxCLEVBQTBCLENBQUVLLEtBQTVCLEVBQXNDSCxJQUFELEdBQVMsQ0FBQ2MsT0FBWCxHQUFzQlgsS0FBMUQsRUFBaUUsSUFBakU7b0JBQ1FnQixNQUFSOztnQkFFSXBCLFVBQVUsR0FBZCxFQUFtQjtxQkFDVnFCLHFCQUFQLENBQTZCLFlBQVk7d0JBQy9CckIsVUFBVSxHQUFsQjtlQURGOzs7O21CQU1LYSxLQUFULEdBQWlCO29CQUNQUyxRQUFSLENBQWlCLENBQWpCLEVBQW9CLENBQXBCLEVBQXVCOUIsT0FBT0ksS0FBOUIsRUFBcUNKLE9BQU9JLEtBQTVDOztTQXBESjs7ZUF3RE8sSUFBUDtPQXpERjtLQUhGLEVBK0RHUCxNQS9ESDs7S0FpRUMsVUFBVXBFLENBQVYsRUFBYTs7O1FBR1ZrRCxFQUFGLENBQUtvRCxTQUFMLEdBQWlCLFlBQVk7YUFDdEJ4RCxJQUFMLENBQVUsWUFBWTtjQUNoQnlELGFBQWF2RyxFQUFFLElBQUYsQ0FBakI7Y0FDRXdHLGNBQWNELFdBQVd0RyxJQUFYLENBQWdCLEdBQWhCLEVBQXFCd0QsSUFBckIsQ0FBMEIsTUFBMUIsQ0FEaEI7Ozs7bUJBS1NnRCxTQUFULEdBQXFCO3VCQUNScEYsRUFBWCxDQUFjLE9BQWQsRUFBdUJxRixXQUF2Qjs7Ozs7bUJBS09BLFdBQVQsR0FBdUI7O3VCQUVWRixXQUFYOztTQWRKOztlQWtCTyxJQUFQO09BbkJGO0tBSEYsRUF5QkdwQyxNQXpCSDs7S0EyQkMsVUFBVXBFLENBQVYsRUFBYTs7O1VBR1IyRyxHQUFKLEVBQ0VDLEtBREYsRUFFRUMsT0FGRjs7OztlQU1TQyxVQUFULEdBQXNCOztrQkFFVixJQUFJQyxhQUFKLEVBQVY7Y0FDTSxJQUFJQyxTQUFKLENBQWNILE9BQWQsQ0FBTjtnQkFDUSxJQUFJSSxXQUFKLEVBQVI7OztZQUdJN0gsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBeUJDLE9BQXpCLENBQWlDLE1BQWpDLE1BQTZDLENBQUMsQ0FBbEQsRUFBcUQ7WUFDakQsTUFBRixFQUFVZ0IsUUFBVixDQUFtQixJQUFuQjs7Ozs7Ozs7VUFRQSxjQUFGLEVBQWtCYyxFQUFsQixDQUFxQixPQUFyQixFQUE4QixVQUFVNkYsQ0FBVixFQUFhO2NBQ3JDQyxTQUFTbkgsRUFBRSxLQUFLb0gsWUFBTCxDQUFrQixNQUFsQixDQUFGLENBQWI7Y0FDSUQsT0FBT2pHLE1BQVgsRUFBbUI7Y0FDZm1HLGNBQUY7Y0FDRSxZQUFGLEVBQWdCQyxJQUFoQixHQUF1QnpCLE9BQXZCLENBQStCO3lCQUNsQnNCLE9BQU9JLE1BQVAsR0FBZ0JDLEdBQWhCLEdBQXNCO2FBRG5DLEVBRUcsR0FGSDs7O2NBS0VMLE9BQU9NLFFBQVAsS0FBb0IsR0FBeEIsRUFBNkI7Y0FDekIsbUJBQUYsRUFBdUIxRCxHQUF2QixDQUEyQixFQUFFLFdBQVcsTUFBYixFQUEzQjtjQUNFLE1BQUYsRUFBVW5DLFdBQVYsQ0FBc0Isd0JBQXRCOztTQVhKOzs7VUFnQkUsWUFBRixFQUFnQlAsRUFBaEIsQ0FBbUIsT0FBbkIsRUFBNEIsVUFBVTZGLENBQVYsRUFBYTtZQUNyQyxNQUFGLEVBQVUzRyxRQUFWLENBQW1CLHdCQUFuQjtTQURGOzs7VUFLRSw0Q0FBRixFQUFnRGMsRUFBaEQsQ0FBbUQsT0FBbkQsRUFBNEQsWUFBWTtZQUNwRSxtQkFBRixFQUF1QjBDLEdBQXZCLENBQTJCLEVBQUUsV0FBVyxNQUFiLEVBQTNCO1lBQ0UsTUFBRixFQUFVbkMsV0FBVixDQUFzQix3QkFBdEI7U0FGRjs7VUFLRXhDLE1BQUYsRUFBVXNJLE1BQVYsQ0FBaUIsWUFBWTtjQUN2QjFILEVBQUVaLE1BQUYsRUFBVXVGLEtBQVYsS0FBb0IsR0FBeEIsRUFBNkI7Y0FDekIsTUFBRixFQUFVL0MsV0FBVixDQUFzQixTQUF0Qjs7U0FGSjs7Ozs7ZUFTT29GLFNBQVQsQ0FBbUJXLGdCQUFuQixFQUFxQztZQUMvQkMseUJBQXlCLGdEQUE3QjtZQUNFQywwQkFBMEIscUJBRDVCO1lBRUVDLG1CQUFtQixvQkFGckI7WUFHRUMsdUJBQXVCL0gsRUFBRSx1QkFBRixDQUh6QjtZQUlFNkcsVUFBVWMsZ0JBSlo7WUFLRUssY0FMRjtZQU1FQyxjQU5GO1lBT0VDLG1DQUFtQ2xJLEVBQUUsYUFBRixDQVByQztZQVFFbUksaUJBUkY7WUFTRUMsb0JBVEY7WUFVRUMsV0FWRjtZQVdFQyxvQkFBb0IsS0FYdEI7WUFZRUMsaUJBQWlCLEtBWm5COzs7O2lCQWdCU0MsT0FBVCxHQUFtQjtZQUNmQyxRQUFGLEVBQVlDLFVBQVo7O1lBRUUsYUFBRixFQUFpQnBDLFNBQWpCOzJCQUNpQnRHLEVBQUUsc0JBQUYsQ0FBakI7WUFDRSx1QkFBRixFQUEyQkMsSUFBM0IsQ0FBZ0MsZ0JBQWhDLEVBQWtEb0IsRUFBbEQsQ0FBcUQsT0FBckQsRUFBOEQsVUFBVXNILEtBQVYsRUFBaUI7a0JBQ3ZFdEIsY0FBTjsyQkFDZXJFLEtBQWYsQ0FBcUIsV0FBckI7V0FGRjs7Y0FLSWhELEVBQUUsMkJBQUYsRUFBK0JrQixNQUFuQyxFQUEyQztjQUN2Qyx1QkFBRixFQUEyQjZDLEdBQTNCLENBQStCLEVBQUVDLFFBQVEsT0FBVixFQUEvQjtjQUNFLDBCQUFGLEVBQThCRCxHQUE5QixDQUFrQyxFQUFFNkUsaUJBQWlCLFNBQW5CLEVBQWxDO1dBRkYsTUFHTztjQUNILHVCQUFGLEVBQTJCN0UsR0FBM0IsQ0FBK0IsRUFBRUMsUUFBUSxNQUFWLEVBQS9CO2NBQ0UsMEJBQUYsRUFBOEJELEdBQTlCLENBQWtDLEVBQUU2RSxpQkFBaUIsU0FBbkIsRUFBbEM7OztZQUdBLGtCQUFGLEVBQXNCOUYsSUFBdEIsQ0FBMkIsWUFBWTtnQkFDakMrRixRQUFRN0ksRUFBRSxJQUFGLENBQVo7O2tCQUVNQyxJQUFOLENBQVcsUUFBWCxFQUFxQm9FLGVBQXJCLENBQXFDeUUsU0FBU0QsTUFBTTVJLElBQU4sQ0FBVyxHQUFYLEVBQWdCOEksSUFBaEIsRUFBVCxDQUFyQztXQUhGOzJCQUtpQi9JLEVBQUUsa0JBQUYsQ0FBakI7WUFDRVosTUFBRixFQUFVaUMsRUFBVixDQUFhLFlBQWIsRUFBMkIySCxxQkFBM0I7O1lBRUU1SixNQUFGLEVBQVVpQyxFQUFWLENBQWEsUUFBYixFQUF1QjRILHlCQUF2Qjs2QkFDbUIsSUFBbkI7WUFDRTdKLE1BQUYsRUFBVWlDLEVBQVYsQ0FBYSxRQUFiLEVBQXVCNkgseUJBQXZCOzs7WUFHRSxjQUFGLEVBQWtCL0YsVUFBbEI7WUFDRSxvQkFBRixFQUF3QjlCLEVBQXhCLENBQTJCLE9BQTNCLEVBQW9DLFlBQVk7Y0FDNUMsZ0JBQUYsRUFBb0I4SCxPQUFwQixDQUE0QixPQUE1QjtXQURGOzs7WUFLRSx1QkFBRixFQUEyQjlILEVBQTNCLENBQThCLE9BQTlCLEVBQXVDLFVBQVU2RixDQUFWLEVBQWE7Y0FDaERHLGNBQUY7Y0FDRSxjQUFGLEVBQWtCOUcsUUFBbEIsQ0FBMkIsUUFBM0I7V0FGRjs7WUFLRSxxQkFBRixFQUF5QmMsRUFBekIsQ0FBNEIsT0FBNUIsRUFBcUMsVUFBVTZGLENBQVYsRUFBYTtjQUM5Q2tDLGVBQUY7Y0FDRS9CLGNBQUY7Y0FDRSxjQUFGLEVBQWtCNUUsV0FBbEIsQ0FBOEIsUUFBOUI7V0FIRjs7Ozs7aUJBU080Ryx5QkFBVCxHQUFxQztZQUNqQyxNQUFGLEVBQVUxRCxRQUFWLENBQW1CaUMsc0JBQW5CLEVBQTJDLE9BQTNDLEVBQW9ELFlBQVk7Z0JBQzFEaUIsUUFBUTdJLEVBQUUsSUFBRixDQUFaO2dCQUNFc0osYUFBYVQsTUFBTXBGLElBQU4sQ0FBVyxPQUFYLEVBQW9CM0MsS0FBcEIsQ0FBMEIscUJBQTFCLEVBQWlELENBQWpELENBRGY7Z0JBRUV5SSxhQUFhVixNQUFNVyxPQUFOLENBQWMxQixnQkFBZCxDQUZmOzt1QkFJVzdILElBQVgsQ0FBZ0IySCxzQkFBaEIsRUFBd0NoRyxXQUF4QyxDQUFvRCxRQUFwRDt1QkFDVzNCLElBQVgsQ0FBZ0I0SCx1QkFBaEIsRUFBeUNqRyxXQUF6QyxDQUFxRCxRQUFyRDtrQkFDTXJCLFFBQU4sQ0FBZSxRQUFmO3VCQUNXTixJQUFYLENBQWdCLGNBQWNxSixVQUE5QixFQUEwQy9JLFFBQTFDLENBQW1ELFFBQW5EO1dBUkY7OztpQkFZT2tKLG9CQUFULEdBQWdDO2NBQzFCQyxjQUFKO2NBQ0VDLHFCQUFxQixDQUR2Qjs7Y0FHSXBCLGNBQUosRUFBb0I7MkJBQ0h0SSxJQUFmLENBQW9CLGNBQXBCLEVBQW9DMkIsV0FBcEMsQ0FBZ0QsZ0JBQWhEOzJCQUNlM0IsSUFBZixDQUFvQixlQUFwQixFQUFxQ00sUUFBckMsQ0FBOEMsZ0JBQTlDOzJCQUVHTixJQURILENBQ1EsbUNBRFIsRUFFR0EsSUFGSCxDQUVRLHlCQUZSLEVBR0drSixPQUhILENBR1csY0FIWDsyQkFLR2xKLElBREgsQ0FDUSxpQkFEUixFQUVHQSxJQUZILENBRVEseUJBRlIsRUFHR2tKLE9BSEgsQ0FHVyxjQUhYO2dCQUlJbEIsZUFBZWhJLElBQWYsQ0FBb0IsZUFBcEIsRUFBcUNzRixFQUFyQyxDQUF3QyxtQkFBeEMsS0FBZ0UrQyxpQkFBcEUsRUFBdUY7NkJBQ3RFL0gsUUFBZixDQUF3QixnQkFBeEI7YUFERixNQUVPOzZCQUNVcUIsV0FBZixDQUEyQixnQkFBM0I7OzZCQUVlcUcsZUFBZWhJLElBQWYsQ0FBb0Isb0NBQXBCLENBQWpCOzJCQUNlOEQsR0FBZixDQUFtQixFQUFFQyxRQUFRLE1BQVYsRUFBbkI7MkJBQ2VsQixJQUFmLENBQW9CLFlBQVk7a0JBQzFCZ0QsVUFBVTlGLEVBQUUsSUFBRixFQUFRNEosV0FBUixFQUFkOztrQkFFSTlELFVBQVU2RCxrQkFBZCxFQUFrQztxQ0FDWDdELE9BQXJCOzthQUpKOzJCQU9lL0IsR0FBZixDQUFtQixFQUFFQyxRQUFRMkYsa0JBQVYsRUFBbkI7Ozs7aUJBSUtFLGlCQUFULENBQTJCQyxNQUEzQixFQUFtQ0MsS0FBbkMsRUFBMEM7aUJBQ2pDL0csS0FBUCxDQUFhLGdCQUFiLEVBQStCLGVBQS9CLEVBQWdEK0csS0FBaEQ7aUJBQ08vRyxLQUFQLENBQWEsZ0JBQWIsRUFBK0IsV0FBL0IsRUFBNEMrRyxLQUE1QztpQkFDTy9HLEtBQVAsQ0FBYSxnQkFBYixFQUErQixPQUEvQixFQUF3QytHLEtBQXhDO2lCQUNPL0csS0FBUCxDQUFhLGdCQUFiLEVBQStCLFdBQS9CLEVBQTRDK0csS0FBNUM7OztpQkFHT2QseUJBQVQsR0FBcUM7Y0FDL0JkLGlCQUFKLEVBQXVCO21CQUNkNkIsWUFBUCxDQUFvQjdCLGlCQUFwQjs7OzhCQUdrQi9JLE9BQU95RSxVQUFQLENBQWtCb0csa0JBQWxCLEVBQXNDLEdBQXRDLENBQXBCOzs7aUJBR09mLHlCQUFULEdBQXFDO2NBQy9CZCxvQkFBSixFQUEwQjttQkFDakI0QixZQUFQLENBQW9CNUIsb0JBQXBCOzs7aUNBR3FCaEosT0FBT3lFLFVBQVAsQ0FBa0JxRyxxQkFBbEIsRUFBeUMsR0FBekMsQ0FBdkI7OztpQkFHT2xCLHFCQUFULENBQStCTCxLQUEvQixFQUFzQztjQUNoQ3dCLG1CQUFtQixZQUF2Qjs7Y0FFSSxDQUFDOUIsV0FBRCxJQUFnQmhKLFNBQVMrSyxJQUFULENBQWM3SyxPQUFkLENBQXNCNEssZ0JBQXRCLE1BQTRDLENBQWhFLEVBQW1FO29CQUN6REUsV0FBUixDQUNFdEMsb0JBREYsRUFFRXVDLGlCQUZGLEVBRXFCQyxrQkFGckIsRUFFeUMsSUFGekM7Ozs7aUJBTUtELGlCQUFULENBQTJCM0IsS0FBM0IsRUFBa0M7Y0FDNUI2QixZQUFKOztxQkFFV3hDLGNBQVgsRUFBMkI7a0JBQ25CLEtBRG1COzBCQUVYLENBRlc7NEJBR1Q7V0FIbEI7O3lCQU1lQSxlQUNaL0gsSUFEWSxDQUNQLE1BQU1aLFNBQVMrSyxJQUFULENBQWM5SSxPQUFkLENBQXNCLE9BQXRCLEVBQStCLEVBQS9CLENBQU4sR0FBMkMscUJBRHBDLEVBRVptQyxJQUZZLENBRVAsa0JBRk8sQ0FBZjt5QkFHZVQsS0FBZixDQUFxQixXQUFyQixFQUFrQ3dILFlBQWxDLEVBQWdELElBQWhEO3lCQUNlbkosRUFBZixDQUFrQixhQUFsQixFQUFpQ29KLGlCQUFqQzs0QkFDa0IsSUFBbEIsRUFBd0IsSUFBeEIsRUFBOEIzQixTQUFTOUksRUFBRSw2QkFBRixFQUFpQ3lELElBQWpDLENBQXNDLGtCQUF0QyxDQUFULENBQTlCOzt3QkFFYyxJQUFkOzs7aUJBR084RyxrQkFBVCxDQUE0QjVCLEtBQTVCLEVBQW1DO2NBQzdCK0IsSUFBSjtjQUNFQyxpQkFBaUIzSyxFQUFFLHFCQUFGLENBRG5COzt5QkFHZWdELEtBQWYsQ0FBcUIsU0FBckI7eUJBQ2U0SCxHQUFmLENBQW1CLGFBQW5CO1lBQ0UscUJBQUYsRUFBeUJ4SixNQUF6QixDQUFnQ3VKLGNBQWhDO2NBQ0ksZUFBZUUsT0FBbkIsRUFDRUEsUUFBUUMsU0FBUixDQUFrQixFQUFsQixFQUFzQnJDLFNBQVNzQyxLQUEvQixFQUFzQzFMLFNBQVNDLFFBQVQsR0FBb0JELFNBQVMyTCxNQUFuRSxFQURGLEtBRUs7bUJBQ0loTCxFQUFFeUksUUFBRixFQUFZd0MsU0FBWixFQUFQO3FCQUNTYixJQUFULEdBQWdCLEVBQWhCO2NBQ0UzQixRQUFGLEVBQVl3QyxTQUFaLENBQXNCUCxJQUF0Qjs7d0JBRVksS0FBZDs7O2lCQUdPRCxpQkFBVCxDQUEyQjlCLEtBQTNCLEVBQWtDM0YsS0FBbEMsRUFBeUNrSSxZQUF6QyxFQUF1RDtjQUNqREMsWUFBWSxDQUFDRCxlQUFlLENBQWhCLEtBQXNCbEwsRUFBRSxpQ0FBRixFQUFxQ2tCLE1BQXJDLEdBQThDLENBQXBFLENBQWhCO2NBQ0VrSyxZQUFZcEwsRUFBRWdJLGVBQWUvSCxJQUFmLENBQW9CLHVCQUF1QmtMLFNBQXZCLEdBQW1DLDBCQUF2RCxFQUFtRkUsR0FBbkYsQ0FBdUYsQ0FBdkYsQ0FBRixFQUE2RnRDLElBQTdGLEVBRGQ7Y0FFRXVDLFVBQVUsU0FBU3RELGVBQ2QvSCxJQURjLENBQ1QsdUJBQXVCaUwsWUFBdkIsR0FBc0MsR0FEN0IsRUFFZHpILElBRmMsQ0FFVCxPQUZTLEVBR2QzQyxLQUhjLENBR1IsWUFIUSxFQUdNLENBSE4sQ0FGckI7O1lBT0UsZ0NBQUYsRUFBb0NpSSxJQUFwQyxDQUF5Q3FDLFNBQXpDO21CQUNTaEIsSUFBVCxHQUFnQmtCLE9BQWhCOzs7aUJBR09yQixrQkFBVCxDQUE0QmxLLElBQTVCLEVBQWtDO2NBQzVCd0wsY0FBY3ZMLEVBQUVaLE1BQUYsRUFBVXVGLEtBQVYsRUFBbEI7Y0FDRTZHLGtCQUFrQixDQURwQjtjQUVFQyx1QkFBdUJGLGNBQWNDLGVBRnZDOztjQUlJeEQsZUFBZXpDLEVBQWYsQ0FBa0Isb0JBQWxCLENBQUosRUFBNkM7OEJBQ3pCeUMsY0FBbEIsRUFBa0MsQ0FBQ3lELG9CQUFuQzs7O2NBR0VuRCxzQkFBc0JtRCxvQkFBMUIsRUFBZ0Q7Z0NBQzFCQSxvQkFBcEI7V0FERixNQUVPLElBQUkxTCxJQUFKLEVBQVU7Ozs7O2lCQUtWbUsscUJBQVQsR0FBaUM7Y0FDM0IsQ0FBQzNCLGNBQUwsRUFBcUI7Z0JBQ2Z2SSxFQUFFWixNQUFGLEVBQVU2TCxTQUFWLEtBQXdCakwsRUFBRVosTUFBRixFQUFVNEUsTUFBVixFQUF4QixHQUE2Q2lFLGVBQWVWLE1BQWYsR0FBd0JDLEdBQXpFLEVBQThFOytCQUMzRCxJQUFqQjtxQkFDTzNELFVBQVAsQ0FBa0I0RixvQkFBbEIsRUFBd0MsR0FBeEM7Ozs7O2lCQUtHaUMsaUJBQVQsR0FBNkI7cUJBQ2hCekQsY0FBWCxFQUEyQjtrQkFDbkIsSUFEbUI7MEJBRVgsQ0FGVzs0QkFHVCxDQUhTOzRCQUlULElBSlM7dUJBS2QsK0dBTGM7dUJBTWQ7V0FOYjs7eUJBU2U1RyxFQUFmLENBQWtCLGFBQWxCLEVBQWlDb0ksb0JBQWpDOzs7aUJBR09rQyxVQUFULENBQW9CeEUsTUFBcEIsRUFBNEJ5RSxPQUE1QixFQUFxQztjQUMvQkMsV0FBVzttQkFDTixHQURNO2tCQUVQLElBRk87MEJBR0MsQ0FIRDs0QkFJRyxDQUpIO3NCQUtILElBTEc7d0JBTUQsQ0FDVjswQkFDYyxHQURkO3dCQUVZOzhCQUNNLENBRE47Z0NBRVEsQ0FGUjswQkFHRTs7YUFOSjtXQU5kOztpQkFrQk83SSxLQUFQLENBQWFoRCxFQUFFOEwsTUFBRixDQUFTRCxRQUFULEVBQW1CRCxPQUFuQixDQUFiOzs7O2VBSUs3RSxhQUFULEdBQXlCO1lBQ25CZ0YsUUFBSjtZQUNFQyxRQUFRaE0sRUFBRSxNQUFGLENBRFY7WUFFRWlNLGtCQUZGO1lBR0VDLGtCQUFrQixFQUhwQjtZQUlFQyxhQUFhLEtBSmY7WUFLRUMsWUFMRjs7OztlQVNPO3VCQUNRL0IsV0FEUjtrQkFFR2dDO1NBRlY7O2lCQUtTQyxXQUFULEdBQXVCO3FCQUNWdE0sRUFBRSxhQUFGLENBQVg7bUJBQ1N5RCxJQUFULENBQWMsSUFBZCxFQUFvQixjQUFwQjttQkFDU0EsSUFBVCxDQUFjLE9BQWQsRUFBdUIsUUFBdkI7bUJBQ1NBLElBQVQsQ0FBYyxhQUFkLEVBQTZCLElBQTdCO2dCQUNNckMsTUFBTixDQUFhMkssUUFBYjttQkFDUzFLLEVBQVQsQ0FBWSxnQkFBWixFQUE4QmlKLGlCQUE5QjtZQUNFbEwsTUFBRixFQUFVaUMsRUFBVixDQUFhLGtCQUFiLEVBQWlDa0osa0JBQWpDO1lBQ0VuTCxNQUFGLEVBQVVpQyxFQUFWLENBQWEsUUFBYixFQUF1QmtMLDBCQUF2Qjs7Y0FFSUMsV0FBV0MsTUFBZixDQUFzQlYsUUFBdEI7Ozs7O2lCQUtPUSwwQkFBVCxHQUFzQztjQUNoQ04sa0JBQUosRUFBd0I7bUJBQ2ZqQyxZQUFQLENBQW9CaUMsa0JBQXBCOzs7K0JBR21CN00sT0FBT3lFLFVBQVAsQ0FBa0I2SSxhQUFsQixFQUFpQyxHQUFqQyxDQUFyQjs7O2lCQUdPbkMsa0JBQVQsQ0FBNEI1QixLQUE1QixFQUFtQzt1QkFDcEIsS0FBYjtjQUNJdUQsZ0JBQWdCUyxLQUFwQixFQUEyQjs0QkFDVEEsS0FBaEIsQ0FBc0JoRSxLQUF0Qjs7OzRCQUdnQixFQUFsQjs7O2lCQUdPMkIsaUJBQVQsQ0FBMkIzQixLQUEzQixFQUFrQztnQkFDMUJ0QixjQUFOO3VCQUNhLElBQWI7WUFDRSxNQUFGLEVBQVU5RyxRQUFWLENBQW1CLGdCQUFuQjttQkFDU04sSUFBVCxDQUFjLEdBQWQsRUFBbUJ5SSxVQUFuQjtjQUNJd0QsZ0JBQWdCVSxJQUFwQixFQUEwQjs0QkFDUkEsSUFBaEIsQ0FBcUJqRSxLQUFyQjs7Ozs7aUJBS0trRSxlQUFULEdBQTJCO2NBQ3JCQyxhQUFhOU0sRUFBRSxlQUFGLENBQWpCOzt5QkFFZUEsRUFBRSw4QkFBRixDQUFmO3VCQUNhTyxRQUFiLENBQXNCLGNBQXRCO3VCQUNha0QsSUFBYixDQUFrQixZQUFsQixFQUFnQyxhQUFoQztxQkFDV0EsSUFBWCxDQUFnQixhQUFoQixFQUErQixJQUEvQjtxQkFDV3NGLElBQVgsQ0FBZ0IsU0FBaEI7dUJBQ2EzSCxNQUFiLENBQW9CMEwsVUFBcEI7OztpQkFHT1QsTUFBVCxHQUFrQjtpQkFDVEYsVUFBUDs7O2lCQUdPOUIsV0FBVCxDQUFxQjBDLFdBQXJCLEVBQWtDQyxZQUFsQyxFQUFnREMsYUFBaEQsRUFBK0RDLFVBQS9ELEVBQTJFOzBCQUN6RE4sSUFBaEIsR0FBdUJJLFlBQXZCOzBCQUNnQkwsS0FBaEIsR0FBd0JNLGFBQXhCOzBCQUNnQkUsSUFBaEIsR0FBdUJELFVBQXZCO2NBQ0ksT0FBT0gsV0FBUCxLQUF1QixRQUEzQixFQUFxQztnQ0FDZkEsV0FBcEI7V0FERixNQUVPO2tDQUNpQkEsV0FBdEI7Ozs7aUJBS0tLLG1CQUFULENBQTZCQyxHQUE3QixFQUFrQztZQUM5QnJMLElBQUYsQ0FBT3FMLEdBQVAsRUFBWUMsSUFBWixDQUFpQkMscUJBQWpCOzs7aUJBR09BLHFCQUFULENBQStCQyxNQUEvQixFQUF1QzttQkFDNUJ6RSxJQUFULENBQWN5RSxNQUFkO21CQUNTcE0sTUFBVCxDQUFnQmdMLFlBQWhCO2NBQ0lGLGdCQUFnQmlCLElBQXBCLEVBQTBCO3FCQUNmNU0sUUFBVCxDQUFrQixNQUFsQjs7bUJBRU9tSSxVQUFULENBQW9CLE1BQXBCOzs7aUJBR08rRSxrQkFBVCxHQUE4QjttQkFDbkI3TCxXQUFULENBQXFCLE1BQXJCO21CQUNTQSxXQUFULENBQXFCLE1BQXJCO21CQUNTbUgsSUFBVCxDQUFjLEVBQWQ7OztpQkFHTzJELGFBQVQsR0FBeUI7Y0FDbkJnQixnQkFBZ0IzQixTQUFTL0gsTUFBVCxFQUFwQjtjQUNFMkosZUFBZTNOLEVBQUVaLE1BQUYsRUFBVTRFLE1BQVYsRUFEakI7O2NBR0kwSixnQkFBZ0JDLFlBQXBCLEVBQWtDO3FCQUN2QjVKLEdBQVQsQ0FBYTttQkFDTjthQURQO3FCQUdTeEQsUUFBVCxDQUFrQixNQUFsQjs7Ozs7ZUFLRzBHLFdBQVQsR0FBdUI7WUFDakIyRyxNQUFKO1lBQ0VDLFVBREY7WUFFRUMsV0FGRjtZQUdFQyxnQkFIRjtZQUlFQyxXQUpGO1lBS0VDLGdCQUxGO1lBTUVDLGlCQUFpQmxPLEVBQUUsNkJBQUYsQ0FObkI7WUFPRW1PLFdBQVduTyxFQUFFLDBCQUFGLENBUGI7WUFRRW9PLGVBQWVwTyxFQUFFLGdCQUFGLENBUmpCO1lBU0VxTyxjQUFjck8sRUFBRSxvQkFBRixDQVRoQjs7OztpQkFhU3NPLFNBQVQsR0FBcUI7Y0FDZnRPLEVBQUVaLE1BQUYsRUFBVXVGLEtBQVYsS0FBb0IsR0FBeEIsRUFBNkI7OztpQkFHdEI0SixjQUFQLEdBQXdCQSxjQUF4QjtpQkFDT0MsZUFBUCxHQUF5QkEsZUFBekI7OztpQkFHT0MsaUJBQVQsR0FBNkI7Y0FDdkJDLENBQUosRUFBT0MsR0FBUDtnQkFDTTFKLEtBQUsySixLQUFMLENBQVkzSixLQUFLNEosTUFBTCxLQUFnQixDQUE1QixDQUFOO2NBQ0lDLFNBQVM5TyxFQUFFLGtDQUFGLEVBQXNDK08sRUFBdEMsQ0FBeUNKLEdBQXpDLENBQWI7WUFDRSxrQ0FBRixFQUFzQ0ssTUFBdEM7WUFDRSxnQkFBRixFQUFvQjVOLE1BQXBCLENBQTJCME4sTUFBM0I7OztpQkFHT0csWUFBVCxHQUF3QjtjQUNsQnJCLE9BQU9zQixTQUFQLENBQWlCckIsV0FBV3NCLFVBQTVCLEVBQXdDQyxVQUF4QyxDQUFtREMsSUFBbkQsS0FBNEQsTUFBaEUsRUFBd0U7Z0JBQ2xFQyxjQUFjcEIsZUFBZXFCLFVBQWYsRUFBbEI7Z0JBQ0lDLGVBQWV0QixlQUFldUIsV0FBZixFQUFuQjttQkFDT1AsU0FBUCxDQUFpQnJCLFdBQVdzQixVQUE1QixFQUF3Q08sT0FBeEMsQ0FBZ0RKLFdBQWhELEVBQTZERSxZQUE3RDs7OztpQkFJS2pCLGNBQVQsQ0FBd0JvQixZQUF4QixFQUFzQzttQkFDM0JDLFdBQVdDLEdBQVgsQ0FBZUMsYUFBZixDQUE2QkgsWUFBN0IsQ0FBVDt1QkFDYUMsV0FBV0MsR0FBWCxDQUFlRSxPQUFmLENBQXVCbEMsVUFBcEM7OztpQkFHT1csZUFBVCxDQUF5QndCLEdBQXpCLEVBQThCO21CQUNuQjFOLElBQVQ7dUJBQ2FDLElBQWI7c0JBQ1lsQixFQUFaLENBQWUsT0FBZixFQUF3QjRPLFNBQXhCO1lBQ0U3USxNQUFGLEVBQVVpQyxFQUFWLENBQWEsUUFBYixFQUF1QjROLFlBQXZCOzt3QkFFY3JCLE9BQU9zQixTQUFQLENBQWlCckIsV0FBV3FDLFlBQTVCLENBQWQ7c0JBQ1lDLGVBQVosQ0FBNEIsVUFBVUMsU0FBVixFQUFxQjtnQkFDM0NBLGFBQWFBLFVBQVVDLEVBQTNCLEVBQStCO2tCQUN6QkQsVUFBVUMsRUFBVixLQUFpQixhQUFqQixJQUFrQ0QsVUFBVUMsRUFBVixLQUFpQixhQUF2RCxFQUFzRTtrQkFDbEUsMkJBQUYsRUFBK0JDLEtBQS9CLENBQXFDLElBQXJDLEVBQTJDQyxPQUEzQyxDQUFtRCxNQUFuRDs7a0JBRUVILFVBQVVDLEVBQVYsS0FBaUIsYUFBakIsSUFBa0NELFVBQVVDLEVBQVYsS0FBaUIsYUFBdkQsRUFBc0U7a0JBQ2xFLDJCQUFGLEVBQStCQyxLQUEvQixDQUFxQyxJQUFyQyxFQUEyQ0MsT0FBM0MsQ0FBbUQsTUFBbkQ7O2tCQUVFSCxVQUFVQyxFQUFWLEtBQWlCLGFBQWpCLElBQWtDRCxVQUFVQyxFQUFWLEtBQWlCLGFBQXZELEVBQXNFO2tCQUNsRSw2QkFBRixFQUFpQ0MsS0FBakMsQ0FBdUMsSUFBdkMsRUFBNkNDLE9BQTdDLENBQXFELE1BQXJEOzs7V0FUTjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7aUJBZ0NPTixTQUFULENBQW1CdEgsS0FBbkIsRUFBMEI7Z0JBQ2xCdEIsY0FBTixHQUF1QnNCLE1BQU10QixjQUFOLEVBQXZCLEdBQWlEc0IsTUFBTTZILFdBQU4sR0FBb0IsS0FBckU7dUJBQ2FsTyxJQUFiO3dCQUNjc0wsT0FBT3NCLFNBQVAsQ0FBaUJyQixXQUFXcUMsWUFBNUIsQ0FBZDs2QkFDbUJ0QyxPQUFPc0IsU0FBUCxDQUFpQnJCLFdBQVdzQixVQUE1QixDQUFuQjtzQkFDWXNCLElBQVo7Ozs7OztLQXhnQk4sRUFpaEJHck0sTUFqaEJIOzs7U0FzaEJLOztHQUFQO0NBcnJCYSxHQUFmOztBQ0FBLGFBQWUsQ0FBQyxZQUFNOztXQUVYckUsSUFBVCxHQUFnQjs7OztXQUlQMlEsaUJBQVQsR0FBNkI7OztRQUd2QkMsV0FBVyxrREFBZjtRQUNJQyxTQUFTNVEsRUFBRSxlQUFGLENBQWI7UUFDSWIsVUFBTyxJQUFYO1FBQ0lDLE9BQU9DLFFBQVAsQ0FBZ0J3UixJQUFoQixDQUFxQnRSLE9BQXJCLENBQTZCLE1BQTdCLElBQXVDLENBQUMsQ0FBNUMsRUFBK0M7Z0JBQ3RDLElBQVA7Ozs7UUFJRXVSLGNBQWMsRUFBbEI7Z0JBQ1lDLFNBQVosR0FBd0IsSUFBSUMsVUFBSixDQUFlO3NCQUNyQkEsV0FBV0MsVUFBWCxDQUFzQkMsVUFERDtzQkFFckJGLFdBQVdDLFVBQVgsQ0FBc0JDLFVBRkQ7Z0JBRzNCO0tBSFksQ0FBeEI7OzthQU9TQyxnQkFBVCxDQUEwQkMsTUFBMUIsRUFBa0M7YUFDekJDLFVBQVAsR0FBb0IsUUFBcEI7YUFDT0MsSUFBUCxHQUFjLEVBQWQ7OztRQUdFLGVBQUYsRUFBbUIvUSxRQUFuQixDQUE0QixNQUE1Qjs7UUFFRWdSLE9BQUYsQ0FBVVosUUFBVixFQUFvQlMsTUFBcEIsRUFDR0ksTUFESCxHQUVHbEUsSUFGSCxDQUVRLFVBQVVwTixJQUFWLEVBQWdCO1lBQ2hCdVIsU0FBU0MsS0FBS0MsS0FBTCxDQUFXelIsSUFBWCxDQUFiO1lBQ0l1UixPQUFPdlEsTUFBWCxFQUFtQjtZQUNmLE1BQUYsRUFBVVgsUUFBVixDQUFtQixnQkFBbkI7WUFDRSxxQkFBRixFQUF5QnFCLFdBQXpCLENBQXFDLFFBQXJDLEVBQStDbUgsSUFBL0MsQ0FBb0QsRUFBcEQ7K0JBQ3FCLGlCQUFyQixFQUF3QzBJLE1BQXhDO1NBSEYsTUFJTztZQUNILGVBQUYsRUFBbUI3UCxXQUFuQixDQUErQixNQUEvQjs7T0FUTixFQVlHZ1EsSUFaSCxDQVlRLFVBQVVILE1BQVYsRUFBa0I7Z0JBQ2RqUCxHQUFSLENBQVksK0NBQVosRUFBNkRpUCxPQUFPSSxNQUFQLEdBQWdCLEdBQWhCLEdBQXNCSixPQUFPSyxVQUExRjtPQWJKOzs7O2FBbUJPQyxpQkFBVCxHQUE2QjtVQUN2Qk4sU0FBUyxFQUFiO1VBQ0l6RyxTQUFTNEYsT0FBT29CLEdBQVAsRUFBYjs7YUFFT0MsSUFBUCxHQUFjLEVBQWQ7OzthQUdPOVMsSUFBUCxHQUFjQSxPQUFkOzthQUVPa1MsVUFBUCxHQUFvQixLQUFwQjs7O1VBR0lhLFFBQVFsSCxPQUFPbUgsS0FBUCxDQUFhLEdBQWIsQ0FBWjtXQUNLLElBQUl6RCxJQUFJLENBQWIsRUFBZ0JBLElBQUl3RCxNQUFNaFIsTUFBMUIsRUFBa0N3TixHQUFsQyxFQUF1Qzs7WUFFakN1RCxPQUFPbkIsWUFBWUMsU0FBWixDQUFzQjFGLEdBQXRCLENBQTBCNkcsTUFBTXhELENBQU4sQ0FBMUIsQ0FBWDtZQUNJdUQsS0FBSy9RLE1BQUwsR0FBYyxDQUFsQixFQUFxQjtpQkFDWitRLElBQVAsR0FBY0EsS0FBSyxDQUFMLENBQWQ7Z0JBQ01HLE1BQU4sQ0FBYTFELENBQWIsRUFBZ0IsQ0FBaEI7Ozs7VUFJQSxDQUFDK0MsT0FBT1EsSUFBWixFQUFrQjtlQUNUQSxJQUFQLEdBQWNDLE1BQU1HLElBQU4sQ0FBVyxHQUFYLENBQWQ7OzthQUdLWixNQUFQOzs7YUFHT2Esb0JBQVQsQ0FBOEJDLFVBQTlCLEVBQTBDQyxJQUExQyxFQUFnRDtVQUMxQ0MsV0FBV2hLLFNBQVNpSyxjQUFULENBQXdCSCxVQUF4QixFQUFvQ0ksU0FBbkQ7ZUFDU2hCLEtBQVQsQ0FBZWMsUUFBZjtVQUNJRyxXQUFXQyxTQUFTQyxNQUFULENBQWdCTCxRQUFoQixFQUEwQkQsSUFBMUIsQ0FBZjtRQUNFLHFCQUFGLEVBQXlCcFIsTUFBekIsQ0FBZ0N3UixRQUFoQztRQUNFbkssUUFBRixFQUFZQyxVQUFaOzs7O01BSUEsWUFBWTs7O1FBR1YsWUFBRixFQUFnQnFLLFNBQWhCLENBQTBCO21CQUNYO09BRGYsRUFHRSxFQUFDekIsTUFBTSxXQUFQLEVBQW9CMEIsUUFBUWxDLFlBQVlDLFNBQXhDLEVBQW1Ea0MsT0FBTyxDQUExRCxFQUhGOzs7UUFPRSxjQUFGLEVBQWtCQyxNQUFsQixDQUF5QixVQUFVaE0sQ0FBVixFQUFhO1VBQ2xDRyxjQUFGO1lBQ0krSixTQUFTVyxtQkFBYjt5QkFDaUJYLE1BQWpCO09BSEY7OztRQU9FM0ksUUFBRixFQUFZcEgsRUFBWixDQUFlLE9BQWYsRUFBd0IsbUNBQXhCLEVBQTZELFlBQVk7VUFDckUscUJBQUYsRUFBeUJkLFFBQXpCLENBQWtDLFFBQWxDO21CQUNXLFlBQVk7WUFDbkIsTUFBRixFQUFVcUIsV0FBVixDQUFzQixnQkFBdEI7U0FERixFQUVHLEdBRkg7T0FGRjtLQWpCRjs7O1NBMEJLOztHQUFQO0NBbkhhLEdBQWY7O0FDRkE7Ozs7Ozs7Ozs7Ozs7QUFhQSxBQUNBLEFBQ0EsQUFDQSxBQUNBLEFBRUE7Ozs7QUFJQSxJQUFNdVIsTUFBTyxZQUFNO1dBQ1JwVCxJQUFULEdBQWdCOzs7TUFHWjBJLFFBQUYsRUFBWUMsVUFBWjs7O1FBR0kxSSxFQUFFLFVBQUYsRUFBY2tCLE1BQWxCLEVBQTBCa1MsTUFBTXJULElBQU47UUFDdEJDLEVBQUUsY0FBRixFQUFrQmtCLE1BQXRCLEVBQThCbVMsU0FBU3RULElBQVQ7UUFDMUJDLEVBQUUsWUFBRixFQUFnQmtCLE1BQXBCLEVBQTRCOEosT0FBT2pMLElBQVA7UUFDeEJDLEVBQUUsYUFBRixFQUFpQmtCLE1BQXJCLEVBQTZCb1MsUUFBUXZULElBQVI7Ozs7Ozs7Ozs7OztXQVl0QndULFNBQVQsR0FBcUI7TUFDakIsTUFBRixFQUFVaFQsUUFBVixDQUFtQmlULElBQW5COzs7U0FHSzs7R0FBUDtDQTFCVSxFQUFaOzs7QUFnQ0F4VCxFQUFFeUksUUFBRixFQUFZZ0wsS0FBWixDQUFrQixZQUFZO01BQ3hCMVQsSUFBSjtDQURGOzsifQ==