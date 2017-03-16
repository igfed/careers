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
          //destination = '4442.aspx/' + destination;
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
            prevArrow: '<span type="button" class="carousel-prev ga-careers-our-people-carousel-scroll"><img src="/content/dam/investorsgroup/app/careers/images/Arrow-MainArticle-Carousel-Black-L.png"></span>',
            nextArrow: '<span type="button" class="carousel-next ga-careers-our-people-carousel-scroll"><img src="/content/dam/investorsgroup/app/careers/images/Arrow-MainArticle-Carousel-Black-R.png"></span>'
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
    var html = '<div class="video-container"><span class="video-overlay ' + data.id + '"></span><div class="video-container-responsive"><video data-setup=\'{"techOrder": ["html5"]}\' data-video-id="' + data.id + '" preload="' + data.preload + '" data-account="' + data.account + '" data-player="' + data.player + '" data-embed="default" data-application-id="' + index + '" class="video-js" id="' + data.id + '" ' + data.ctrl + ' ' + data.auto + '></video></div></div><h2 class="video-title">' + data.title + '</h2><p class="video-description">' + data.description + '</p>';
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
    var cities = ["athabasca", "bluffton", "bonnyville", "brooks", "calgary", "camrose", "canmore", "drayton valley", "edmonton", "fort mcmurray", "fort saskatchewan", "grande prairie", "halkirk", "hillcrest mines", "hinton", "leduc", "lethbridge", "lloydminster", "medicine hat", "morinville", "peace river", "pincher creek", "provost", "red deer", "sherwood park", "spruce grove", "st. albert", "stettler", "sturgeon county", "tofield", "vermilion", "wainwright", "westlock", "whitelaw", "abbotsford", "brackendale", "burnaby", "burns lake", "campbell river", "chase", "chilliwack", "comox", "coquitlam", "courtenay", "cranbrook", "dawson creek", "duncan", "fort nelson", "fort st. john", "invermere", "kamloops", "kelowna", "langley", "merritt", "nanaimo", "nelson", "north vancouver", "oliver", "penticton", "port alberni", "powell river", "prince george", "qualicum beach", "quesnel", "revelstoke", "richmond", "saanichton", "salmon arm", "salt spring island", "sechelt", "sidney", "smithers", "surrey", "terrace", "trail", "vancouver", "vernon", "victoria", "westbank", "williams lake", "brandon", "dauphin", "flin flon", "gillam", "killarney", "manitou", "miami", "morden", "narol", "portage la prairie", "selkirk", "swan river", "the pas", "virden", "warren", "winnipeg", "bathurst", "bedell", "edmundston", "fredericton", "lansdowne", "miramichi", "moncton", "quispamsis", "rexton", "rothesay", "saint john", "saint paul", "sussex", "blaketown", "clarenville", "corner brook", "gander", "grand falls - windsor", "marystown", "roaches line", "st. john's", "trinity", "amherst", "antigonish", "barrington passage", "belliveau cove", "bridgetown", "bridgewater", "dartmouth", "dayton", "halifax", "middleton", "new glasgow", "new minas", "north sydney", "pictou", "port hawkesbury", "sydney", "truro", "yellowknife", "ajax", "algonquin highlands", "ancaster", "atikokan", "barrie", "belleville", "bowmanville", "bracebridge", "brampton", "brantford", "brockville", "brooklin", "burlington", "cambridge", "carleton place", "chatham", "clayton", "clinton", "cobourg", "collingwood", "concord", "cornwall", "dryden", "dundas", "dunsford", "dutton", "elliot lake", "etobicoke", "fort frances", "gananoque", "garson", "greely", "grimsby", "guelph", "haileybury", "hamilton", "hanover", "hearst", "huntsville", "jerseyville", "kanata", "kapuskasing", "kenora", "kingston", "kirkland lake", "kitchener", "langton", "lindsay", "london", "maple", "marathon", "markham", "merrickville", "milton", "minden", "mississauga", "mount forest", "mount hope", "nepean", "new liskeard", "newmarket", "niagara falls", "north bay", "north york", "oak ridges", "oakville", "orangeville", "orillia", "orton", "oshawa", "ottawa", "owen sound", "parry sound", "pembroke", "penetanguishene", "perth", "peterborough", "petrolia", "pickering", "red lake", "ridgetown", "sarnia", "sault ste. marie", "scarborough", "schreiber", "simcoe", "sioux lookout", "st. catharines", "st. marys", "stouffville", "stratford", "sturgeon falls", "sudbury", "sundridge", "thunder bay", "tillsonburg", "timmins", "toronto", "trenton", "Uxbridge", "val caron", "walkerton", "waterloo", "welland", "whitby", "willowdale", "windsor", "wingham", "woodbridge", "charlottetown, pe", "souris, pe", "summerside, pe", "wellington", "anjou", "boisbriand", "boucherville", "brossard", "châteauguay", "chicoutimi", "côte saint-luc", "dollard-des-ormeaux", "gatineau", "granby", "laval", "lévis", "mirabel", "montreal", "new richmond", "pointe-claire", "québec", "sept-iles", "sherbrooke", "ville st-laurent", "westmount", "eastend", "estevan", "esterhazy", "foam lake", "humboldt", "kindersley", "leader", "maple creek", "meadow lake", "melfort", "melville", "moose jaw", "north battleford", "outlook", "oxbow", "prince albert", "regina", "regina beach", "rosetown", "saskatoon", "shellbrook", "swift current", "watrous", "watson", "yorkton", "whitehorse"];
    suggestions.locations = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: cities
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
        if ($('.ig-evt1').length) evt1.init('.ig-evt1');
        if ($('.ig-evt2').length) evt2.init('.ig-evt2');

        // Add language class to body
        //_language();
    }

    // Let's use a global variable (global as in available to all our components - not the window object!)
    // to add a class to the body tag
    // function _language() {
    //     $('body').addClass(ig.lang);
    // }

    return {
        init: init
    };
}();

// Bootstrap app
$(document).ready(function () {
    app.init();
});

}());

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvY2FyZWVycy5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL3NlYXJjaC5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgZmlsZSBpcyBmb3IgbWV0aG9kcyBhbmQgdmFyaWFibGVzIHRoYXQgYXJlIGdvaW5nIHRvIGJlXHJcbnVzZWZ1bCBhY3Jvc3MgYWxsIG1vZHVsZXMuIEluIG9yZGVyIHRvIHVzZSB0aGVtIGFueXdoZXJlLCBpbXBvcnQgd2l0aDpcclxuXHJcbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4gYW5kIHRoZW4gY2FsbCB3aXRoIHRoZSBpZyBuYW1lc3BhY2UgKGkuZS4sIGlnLnBhdGhuYW1lLCBpZy5sYW5nLCBldGMpXHJcbiAqL1xyXG5cclxuLy8gdXJsIHBhdGhcclxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XHJcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxufSkoKVxyXG5cclxuLy8gbGFuZ3VhZ2VcclxuZXhwb3J0IHZhciBsYW5nID0gKCgpID0+IHtcclxuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgIHJldHVybiAnZnInO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gJ2VuJztcclxuICB9XHJcbn0pKClcclxuXHJcbi8vIGJyb3dzZXIgd2lkdGhcclxuZXhwb3J0IHZhciBicm93c2VyV2lkdGggPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcclxufSkoKVxyXG5cclxuLy8gYmFzZSBldmVudEVtaXR0ZXJcclxuZXhwb3J0IHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICB2YXIgZW5kcG9pbnRVUkwsXHJcbiAgICBzdWNjZXNzVVJMLFxyXG4gICAgY2FuY2VsVVJMLFxyXG4gICAgJGZvcm0sXHJcbiAgICAkZm9ybVdyYXBwZXI7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xyXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcclxuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xyXG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcclxuXHJcbiAgICBfdmFsaWRhdGlvbigpO1xyXG4gICAgX3RvZ2dsZXIoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcclxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XHJcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZSxcclxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XHJcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcclxuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xyXG5cclxuICAgICRmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDYXJvdXNlbCBJbml0aWFsaXplZCEnKVxyXG5cclxuICAgIC8vIE5vdCBzdXJlIHdoYXQgdGhpcyBkb2VzIGF0IHRoaXMgcG9pbnQgb3IgaG93IGl0IHJlbGF0ZXMgdG8gQ2Fyb3VzZWxzXHJcbiAgICAkKCdbZGF0YS1yZXNwb25zaXZlLXRvZ2dsZV0gYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ3NpdGUtaGVhZGVyLWlzLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgX2J1aWxkQ2Fyb3VzZWwoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9idWlsZENhcm91c2VsKCkge1xyXG4gICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgbmV4dEFycm93LFxyXG4gICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgJCgnLmlnLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXHJcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxyXG4gICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgX2NhcmVlcnNMZWdhY3lDb2RlKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfY2FyZWVyc0xlZ2FjeUNvZGUoKSB7XHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuXHJcbiAgICAgICQuZm4uaW5mb1RvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyICRyZXZlYWwgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAkcmV2ZWFsQ29udGVudCA9ICRyZXZlYWwuZmluZCgnLmluZm8tdG9nZ2xlLWNvbnRlbnQnKSxcclxuICAgICAgICAgICAgJHJldmVhbFRyaWdnZXIgPSAkcmV2ZWFsLmZpbmQoJy5pbmZvLXRvZ2dsZS10cmlnZ2VyJyksXHJcbiAgICAgICAgICAgIGZpeGVkSGVpZ2h0ID0gZmFsc2UsXHJcbiAgICAgICAgICAgIHNldEFyaWEgPSAkcmV2ZWFsLmF0dHIoJ2luZm8tdG9nZ2xlLWFyaWEnKSA9PT0gJ3RydWUnO1xyXG5cclxuICAgICAgICAgIGluaXRUb2dnbGUoKTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBpbml0VG9nZ2xlKCkge1xyXG4gICAgICAgICAgICAkcmV2ZWFsVHJpZ2dlci5vbignY2xpY2snLCBoYW5kbGVSZXZlYWxUb2dnbGUpO1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXIpO1xyXG5cclxuICAgICAgICAgICAgc2V0UmV2ZWFsQ29udGVudEhlaWdodCgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVSZXZlYWxUb2dnbGUoKSB7XHJcbiAgICAgICAgICAgIHNldFJldmVhbENvbnRlbnRIZWlnaHQoKTtcclxuICAgICAgICAgICAgJHJldmVhbC50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHNldFJldmVhbENvbnRlbnRIZWlnaHQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIHJlc2l6ZUhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIGlmIChmaXhlZEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmNzcyh7IGhlaWdodDogJ2F1dG8nIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gc2V0UmV2ZWFsQ29udGVudEhlaWdodCgpIHtcclxuICAgICAgICAgICAgdmFyIGZpbmFsSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgaWYgKCRyZXZlYWwuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgZmluYWxIZWlnaHQgPSAkcmV2ZWFsQ29udGVudFswXS5zY3JvbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgZml4ZWRIZWlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGZpbmFsSGVpZ2h0ID0gMDtcclxuICAgICAgICAgICAgICBmaXhlZEhlaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmNzcyh7IGhlaWdodDogZmluYWxIZWlnaHQgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2V0QXJpYSkge1xyXG4gICAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgIWZpeGVkSGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfTtcclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuXHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuICAgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICAgJC5mbi5jaXJjbGVBbmltYXRpb24gPSBmdW5jdGlvbiAobWF4VmFsdWUpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyIGNhbnZhcyA9IHRoaXMsXHJcbiAgICAgICAgICAgICRjYW52YXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBjb250ZXh0LFxyXG4gICAgICAgICAgICBkID0gY2FudmFzLndpZHRoIC8gMixcclxuICAgICAgICAgICAgcGVyY2VudFN0cm9rZSA9IDcsXHJcbiAgICAgICAgICAgIHJlbWFpbmluZ1N0cm9rZSA9IDEsXHJcbiAgICAgICAgICAgIHJhZGl1cyA9IGQgLSBwZXJjZW50U3Ryb2tlLFxyXG4gICAgICAgICAgICBjdXJQZXJjID0gMCxcclxuICAgICAgICAgICAgY2lyYyA9IE1hdGguUEkgKiAyLFxyXG4gICAgICAgICAgICBxdWFydCA9IE1hdGguUEkgLyAyLFxyXG4gICAgICAgICAgICBkZWxlZ2F0ZUlEID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgKyAnQ0EnO1xyXG5cclxuICAgICAgICAgIGlmICghJGNhbnZhcy5pcygnY2FudmFzJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzBkMjYzYyc7XHJcbiAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjZTVlOGU4JztcclxuXHJcbiAgICAgICAgICAkY2FudmFzLmF0dHIoJ2NpcmNsZS1hbmltYXRpb24taWQnLCBkZWxlZ2F0ZUlEKTtcclxuICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZSgnW2NpcmNsZS1hbmltYXRpb24taWQ9JyArIGRlbGVnYXRlSUQgKyAnXScsICdzdGFydEFuaW1hdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGN1clBlcmMgPSAwO1xyXG4gICAgICAgICAgICBhbmltYXRlKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZSgnW2NpcmNsZS1hbmltYXRpb24taWQ9JyArIGRlbGVnYXRlSUQgKyAnXScsICdjbGVhckFuaW1hdGUnLCBjbGVhcik7XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZShjdXJyZW50KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50ID8gY3VycmVudCA6IDA7XHJcbiAgICAgICAgICAgIGNsZWFyKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gcGVyY2VudFN0cm9rZTtcclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1NYXRoLm1pbihjdXJyZW50LCBtYXhWYWx1ZSAvIDEwMCkpIC0gcXVhcnQsIHRydWUpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHJlbWFpbmluZ1N0cm9rZTtcclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1jdXJyZW50KSAtIHF1YXJ0LCB0cnVlKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICAgICAgY3VyUGVyYysrO1xyXG4gICAgICAgICAgICBpZiAoY3VyUGVyYyA8IDExMCkge1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZShjdXJQZXJjIC8gMTAwKVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gY2xlYXIoKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMud2lkdGgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfTtcclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAkLmZuLmJsb2NrTGluayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyICRibG9ja0xpbmsgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBkZXN0aW5hdGlvbiA9ICRibG9ja0xpbmsuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgICAgICAgLy9kZXN0aW5hdGlvbiA9ICc0NDQyLmFzcHgvJyArIGRlc3RpbmF0aW9uO1xyXG4gICAgICAgICAgaW5pdEJsb2NrKCk7XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gaW5pdEJsb2NrKCkge1xyXG4gICAgICAgICAgICAkYmxvY2tMaW5rLm9uKCdjbGljaycsIGhhbmRsZUNsaWNrKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLy0tLS0tXHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soKSB7XHJcbiAgICAgICAgICAgIC8vZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uID0gZGVzdGluYXRpb247XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICB9O1xyXG5cclxuICAgIH0pKGpRdWVyeSk7XHJcblxyXG4gICAgKGZ1bmN0aW9uICgkKSB7XHJcbiAgICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAgIHZhciBndWksXHJcbiAgICAgICAgdmlkZW8sXHJcbiAgICAgICAgb3ZlcmxheTtcclxuXHJcbiAgICAgIGluaXRMZWdhY3koKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGluaXRMZWdhY3koKSB7XHJcbiAgICAgICAgLy8gVGhpcyBpcyB3ZWlyZCAtIG5vdCBnb2luZyB0byB0b3VjaCBpdFxyXG4gICAgICAgIG92ZXJsYXkgPSBuZXcgT3ZlcmxheU1vZHVsZSgpO1xyXG4gICAgICAgIGd1aSA9IG5ldyBHdWlNb2R1bGUob3ZlcmxheSk7XHJcbiAgICAgICAgLy8gdmlkZW8gPSBuZXcgVmlkZW9Nb2R1bGUoKTsgLy8gUmVwbGFjZSB3aXRoIHZpZGVvLmpzIG1vZHVsZVxyXG5cclxuICAgICAgICAvLyBOZWVkIHRvIGhhdmUgYSBjbGFzcyB0byBob29rIG9udG8gZm9yIEZyZW5jaCBsYW5ndWFnZSBwYWdlXHJcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIvJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2ZyJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTbW9vdGggc2Nyb2xsaW5nIGZvciBhbmNob3IgbGlua3NcclxuICAgICAgICAkKCdhW2hyZWZePVwiI1wiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICB2YXIgdGFyZ2V0ID0gJCh0aGlzLmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcclxuICAgICAgICAgIGlmICh0YXJnZXQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLnN0b3AoKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICBzY3JvbGxUb3A6IHRhcmdldC5vZmZzZXQoKS50b3AgKyA1MlxyXG4gICAgICAgICAgICB9LCA3NTApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICh0YXJnZXQuc2VsZWN0b3IgIT09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgICQoJyNtYWluLW1lbnUtYW5jaG9yJykuY3NzKHsgJ2Rpc3BsYXknOiAnbm9uZScgfSk7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaXMtcmV2ZWFsLW9wZW4gYnJhbmRlZCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBNb2JpbGUgbWVudSBuZWVkcyB0byBtaW1pYyBGb3VuZGF0aW9uIHJldmVhbCAtIG5vdCBlbm91Z2ggdGltZSB0byBpbXBsZW1lbnQgZGlmZmVyZW50IG5hdnMgaW4gYSByZXZlYWwgbW9kYWwgcHJvcGVybHlcclxuICAgICAgICAkKCcubWVudS1pY29uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaXMtcmV2ZWFsLW9wZW4gYnJhbmRlZCcpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBxdWljayBhbmQgZGlydHkgbW9iaWxlIG1lbnUgY2xvc2VzIC0gbm90IGZhbWlsaWFyIHdpdGggRm91bmRhdGlvbiBwYXR0ZXJuIHRvIGZpcmUgdGhlc2VcclxuICAgICAgICAkKCcudG9wLWJhciAuY2xvc2UtYnV0dG9uLnNob3ctZm9yLXNtYWxsLW9ubHknKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkKCcjbWFpbi1tZW51LWFuY2hvcicpLmNzcyh7ICdkaXNwbGF5JzogJ25vbmUnIH0pO1xyXG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdpcy1yZXZlYWwtb3BlbiBicmFuZGVkJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gNjQwKSB7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnYnJhbmRlZCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLy0tLS0tXHJcblxyXG4gICAgICBmdW5jdGlvbiBHdWlNb2R1bGUob3ZlcmxheVJlZmVyZW5jZSkge1xyXG4gICAgICAgIHZhciBtdWx0aVRhYlRvZ2dsZVNlbGVjdG9yID0gJ1tjbGFzcyo9XCJ0b2dnbGUtXCJdOm5vdChbY2xhc3MqPVwiaW5mby10b2dnbGVcIl0pJyxcclxuICAgICAgICAgIG11bHRpVGFiQ29udGVudFNlbGVjdG9yID0gJ1tjbGFzcyo9XCJjb250ZW50LVwiXScsXHJcbiAgICAgICAgICBtdWx0aVRhYlNlbGVjdG9yID0gJy5tdWx0aS10YWItb3V0bGluZScsXHJcbiAgICAgICAgICAkZWRnZU92ZXJsYXlMb2NhdGlvbiA9ICQoJyNlZGdlLW92ZXJsYXktY29udGVudCcpLFxyXG4gICAgICAgICAgb3ZlcmxheSA9IG92ZXJsYXlSZWZlcmVuY2UsXHJcbiAgICAgICAgICAkb3ZlcmxheVNsaWRlcixcclxuICAgICAgICAgICRwcm9maWxlU2xpZGVyLFxyXG4gICAgICAgICAgJHByb2ZpbGVTbGlkZXJWaWRlb1NlY3Rpb25Ib2xkZXIgPSAkKCc8ZGl2PjwvZGl2PicpLFxyXG4gICAgICAgICAgd2luZG93U2l6aW5nRGVsYXksXHJcbiAgICAgICAgICB3aW5kb3dTY3JvbGxpbmdEZWxheSxcclxuICAgICAgICAgIG92ZXJsYXlPcGVuLFxyXG4gICAgICAgICAgaXNSZXNwb25zaXZlU3RhdGUgPSBmYWxzZSxcclxuICAgICAgICAgIHNjcm9sbGVkVG9WaWV3ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGluaXRHdWkoKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdEd1aSgpIHtcclxuICAgICAgICAgIGFkZE11bHRpVGFiVG9nZ2xlSGFuZGxlcnMoKTtcclxuICAgICAgICAgICQoJy5ibG9jay1saW5rJykuYmxvY2tMaW5rKCk7XHJcbiAgICAgICAgICAkb3ZlcmxheVNsaWRlciA9ICQoJy5vdXItYnVzaW5lc3Mtc2xpZGVyJyk7XHJcbiAgICAgICAgICAkKCcjZWRnZS1vdmVybGF5LWNvbnRlbnQnKS5maW5kKCcuY2Fyb3VzZWwtbmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkb3ZlcmxheVNsaWRlci5zbGljaygnc2xpY2tOZXh0Jyk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpZiAoJChcIi52aWRlby1zbGlkZS5zbGljay1hY3RpdmVcIikubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICQoJy5zbGljay1saXN0LmRyYWdnYWJsZScpLmNzcyh7IGhlaWdodDogJzY2MHB4JyB9KTtcclxuICAgICAgICAgICAgJCgnLnNlY3Rpb24ucHJvZmlsZXMtc2xpZGVyJykuY3NzKHsgYmFja2dyb3VuZENvbG9yOiAnI2U1ZThlOCcgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCcuc2xpY2stbGlzdC5kcmFnZ2FibGUnKS5jc3MoeyBoZWlnaHQ6ICdhdXRvJyB9KTtcclxuICAgICAgICAgICAgJCgnLnNlY3Rpb24ucHJvZmlsZXMtc2xpZGVyJykuY3NzKHsgYmFja2dyb3VuZENvbG9yOiAnIzdlYzRiOScgfSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgJCgnLnByb2ZpbGUtY291bnRlcicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgJHRoaXMuZmluZCgnY2FudmFzJykuY2lyY2xlQW5pbWF0aW9uKHBhcnNlSW50KCR0aGlzLmZpbmQoJ3AnKS5odG1sKCkpKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgJHByb2ZpbGVTbGlkZXIgPSAkKCcucHJvZmlsZXMtc2xpZGVyJyk7XHJcbiAgICAgICAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCBoYW5kbGVPdmVybGF5RnJvbUhhc2gpO1xyXG4gICAgICAgICAgaGFuZGxlT3ZlcmxheUZyb21IYXNoKCk7XHJcbiAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGRlbGF5ZWRIYW5kbGVXaW5kb3dTaXppbmcpO1xyXG4gICAgICAgICAgaGFuZGxlV2luZG93U2l6aW5nKHRydWUpO1xyXG4gICAgICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBkZWxheWVkSGFuZGxlV2luZG93U2Nyb2xsKTtcclxuICAgICAgICAgIGhhbmRsZVdpbmRvd1Njcm9sbGluZygpO1xyXG5cclxuICAgICAgICAgICQoJy5pbmZvLXRvZ2dsZScpLmluZm9Ub2dnbGUoKTtcclxuICAgICAgICAgICQoJy50b3AtYmFyICsgLnNjcmVlbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCgnYVtkYXRhLXRvZ2dsZV0nKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgLy8gTm90IHByZXR0eSAtIGp1c3QgYWRkaW5nIHF1aWNrIGFuZCBkaXJ0eSBzaGFyZSBsaW5rIGFjdGlvblxyXG4gICAgICAgICAgJCgnLnNoYXJlLXRvZ2dsZS10cmlnZ2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCcuaW5mby10b2dnbGUnKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAkKCcuc2hhcmUtdG9nZ2xlLWNsb3NlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCcuaW5mby10b2dnbGUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkTXVsdGlUYWJUb2dnbGVIYW5kbGVycygpIHtcclxuICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZShtdWx0aVRhYlRvZ2dsZVNlbGVjdG9yLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgdG9nZ2xlQmFzZSA9ICR0aGlzLmF0dHIoJ2NsYXNzJykubWF0Y2goL3RvZ2dsZS0oXFxTKik/KCR8XFxzKS8pWzFdLFxyXG4gICAgICAgICAgICAgICRjb250YWluZXIgPSAkdGhpcy5wYXJlbnRzKG11bHRpVGFiU2VsZWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKG11bHRpVGFiQ29udGVudFNlbGVjdG9yKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKCcuY29udGVudC0nICsgdG9nZ2xlQmFzZSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFuaW1hdGVQcm9maWxlU2xpZGVyKCkge1xyXG4gICAgICAgICAgdmFyICRwcm9maWxlUGFuZWxzLFxyXG4gICAgICAgICAgICBwcm9maWxlUGFuZWxIZWlnaHQgPSAwO1xyXG5cclxuICAgICAgICAgIGlmIChzY3JvbGxlZFRvVmlldykge1xyXG4gICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5maW5kKCcuc2xpY2stc2xpZGUnKS5yZW1vdmVDbGFzcygnc2xpY2stY29tcGxldGUnKTtcclxuICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIuZmluZCgnLnNsaWNrLWFjdGl2ZScpLmFkZENsYXNzKCdzbGljay1jb21wbGV0ZScpO1xyXG4gICAgICAgICAgICAkcHJvZmlsZVNsaWRlclxyXG4gICAgICAgICAgICAgIC5maW5kKCcuc2xpY2stc2xpZGU6bm90KC5zbGljay1jb21wbGV0ZSknKVxyXG4gICAgICAgICAgICAgIC5maW5kKCcucHJvZmlsZS1jb3VudGVyIGNhbnZhcycpXHJcbiAgICAgICAgICAgICAgLnRyaWdnZXIoJ2NsZWFyQW5pbWF0ZScpO1xyXG4gICAgICAgICAgICAkcHJvZmlsZVNsaWRlclxyXG4gICAgICAgICAgICAgIC5maW5kKCcuc2xpY2stY29tcGxldGUnKVxyXG4gICAgICAgICAgICAgIC5maW5kKCcucHJvZmlsZS1jb3VudGVyIGNhbnZhcycpXHJcbiAgICAgICAgICAgICAgLnRyaWdnZXIoJ3N0YXJ0QW5pbWF0ZScpO1xyXG4gICAgICAgICAgICBpZiAoJHByb2ZpbGVTbGlkZXIuZmluZCgnLnNsaWNrLWFjdGl2ZScpLmlzKCdbY2xhc3MqPXByb2ZpbGUtXScpIHx8IGlzUmVzcG9uc2l2ZVN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIuYWRkQ2xhc3MoJ2NvbnRyYXN0LWFycm93Jyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIucmVtb3ZlQ2xhc3MoJ2NvbnRyYXN0LWFycm93Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHByb2ZpbGVQYW5lbHMgPSAkcHJvZmlsZVNsaWRlci5maW5kKCcucHJvZmlsZS0xLXNsaWRlLCAucHJvZmlsZS0yLXNsaWRlJyk7XHJcbiAgICAgICAgICAgICRwcm9maWxlUGFuZWxzLmNzcyh7IGhlaWdodDogJ2F1dG8nIH0pO1xyXG4gICAgICAgICAgICAkcHJvZmlsZVBhbmVscy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICB2YXIgY3VycmVudCA9ICQodGhpcykub3V0ZXJIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGN1cnJlbnQgPiBwcm9maWxlUGFuZWxIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHByb2ZpbGVQYW5lbEhlaWdodCA9IGN1cnJlbnQ7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHByb2ZpbGVQYW5lbHMuY3NzKHsgaGVpZ2h0OiBwcm9maWxlUGFuZWxIZWlnaHQgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBjaGFuZ2VTbGlkZXJTdGF0ZShzbGlkZXIsIHN0YXRlKSB7XHJcbiAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcImFjY2Vzc2liaWxpdHlcIiwgc3RhdGUpO1xyXG4gICAgICAgICAgc2xpZGVyLnNsaWNrKFwic2xpY2tTZXRPcHRpb25cIiwgXCJkcmFnZ2FibGVcIiwgc3RhdGUpO1xyXG4gICAgICAgICAgc2xpZGVyLnNsaWNrKFwic2xpY2tTZXRPcHRpb25cIiwgXCJzd2lwZVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcInRvdWNoTW92ZVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZWxheWVkSGFuZGxlV2luZG93U2l6aW5nKCkge1xyXG4gICAgICAgICAgaWYgKHdpbmRvd1NpemluZ0RlbGF5KSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQod2luZG93U2l6aW5nRGVsYXkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHdpbmRvd1NpemluZ0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQoaGFuZGxlV2luZG93U2l6aW5nLCAyNTApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZGVsYXllZEhhbmRsZVdpbmRvd1Njcm9sbCgpIHtcclxuICAgICAgICAgIGlmICh3aW5kb3dTY3JvbGxpbmdEZWxheSkge1xyXG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHdpbmRvd1Njcm9sbGluZ0RlbGF5KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB3aW5kb3dTY3JvbGxpbmdEZWxheSA9IHdpbmRvdy5zZXRUaW1lb3V0KGhhbmRsZVdpbmRvd1Njcm9sbGluZywgMjUwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlGcm9tSGFzaChldmVudCkge1xyXG4gICAgICAgICAgdmFyIGZ1bGxIYXNoRnJhZ21lbnQgPSAnI291ci1lZGdlLSc7XHJcbiAgICAgICAgICAvL2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgaWYgKCFvdmVybGF5T3BlbiAmJiBsb2NhdGlvbi5oYXNoLmluZGV4T2YoZnVsbEhhc2hGcmFnbWVudCkgPT09IDApIHtcclxuICAgICAgICAgICAgb3ZlcmxheS5vcGVuT3ZlcmxheShcclxuICAgICAgICAgICAgICAkZWRnZU92ZXJsYXlMb2NhdGlvbixcclxuICAgICAgICAgICAgICBoYW5kbGVPdmVybGF5T3BlbiwgaGFuZGxlT3ZlcmxheUNsb3NlLCB0cnVlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlPcGVuKGV2ZW50KSB7XHJcbiAgICAgICAgICB2YXIgaW5pdGlhbEluZGV4O1xyXG5cclxuICAgICAgICAgIGluaXRTbGlkZXIoJG92ZXJsYXlTbGlkZXIsIHtcclxuICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDFcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGluaXRpYWxJbmRleCA9ICRvdmVybGF5U2xpZGVyXHJcbiAgICAgICAgICAgIC5maW5kKCcuJyArIGxvY2F0aW9uLmhhc2gucmVwbGFjZSgnI291ci0nLCAnJykgKyAnOm5vdCguc2xpY2stY2xvbmVkKScpXHJcbiAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4Jyk7XHJcbiAgICAgICAgICAkb3ZlcmxheVNsaWRlci5zbGljaygnc2xpY2tHb1RvJywgaW5pdGlhbEluZGV4LCB0cnVlKTtcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLm9uKCdhZnRlckNoYW5nZScsIGhhbmRsZVNsaWRlQ2hhbmdlKTtcclxuICAgICAgICAgIGhhbmRsZVNsaWRlQ2hhbmdlKG51bGwsIG51bGwsIHBhcnNlSW50KCQoJyNtb2RhbE92ZXJsYXkgLnNsaWNrLWFjdGl2ZScpLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnKSkpO1xyXG4gICAgICAgICAgaGFuZGxlV2luZG93U2l6aW5nKCk7XHJcbiAgICAgICAgICBvdmVybGF5T3BlbiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVPdmVybGF5Q2xvc2UoZXZlbnQpIHtcclxuICAgICAgICAgIHZhciB5UG9zLFxyXG4gICAgICAgICAgICBvdmVybGF5Q29udGVudCA9ICQoJyNtb2RhbE92ZXJsYXkgPiBkaXYnKTtcclxuXHJcbiAgICAgICAgICAkb3ZlcmxheVNsaWRlci5zbGljaygndW5zbGljaycpO1xyXG4gICAgICAgICAgJG92ZXJsYXlTbGlkZXIub2ZmKCdhZnRlckNoYW5nZScpO1xyXG4gICAgICAgICAgJCgnLm92ZXJsYXktcmVwb3NpdG9yeScpLmFwcGVuZChvdmVybGF5Q29udGVudCk7XHJcbiAgICAgICAgICBpZiAoXCJwdXNoU3RhdGVcIiBpbiBoaXN0b3J5KVxyXG4gICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZShcIlwiLCBkb2N1bWVudC50aXRsZSwgbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2gpO1xyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHlQb3MgPSAkKGRvY3VtZW50KS5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgbG9jYXRpb24uaGFzaCA9IFwiXCI7XHJcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLnNjcm9sbFRvcCh5UG9zKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIG92ZXJsYXlPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVTbGlkZUNoYW5nZShldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSkge1xyXG4gICAgICAgICAgdmFyIG5leHRTbGlkZSA9IChjdXJyZW50U2xpZGUgKyAxKSAlICgkKCcuc2xpY2stc2xpZGU6bm90KC5zbGljay1jbG9uZWQpJykubGVuZ3RoIC0gMSksXHJcbiAgICAgICAgICAgIG5leHRUaXRsZSA9ICQoJG92ZXJsYXlTbGlkZXIuZmluZCgnW2RhdGEtc2xpY2staW5kZXg9JyArIG5leHRTbGlkZSArICddIC5jb2x1bW5zOmZpcnN0LWNoaWxkIHAnKS5nZXQoMCkpLmh0bWwoKSxcclxuICAgICAgICAgICAgbmV3SGFzaCA9ICdvdXItJyArICRvdmVybGF5U2xpZGVyXHJcbiAgICAgICAgICAgICAgICAuZmluZCgnW2RhdGEtc2xpY2staW5kZXg9JyArIGN1cnJlbnRTbGlkZSArICddJylcclxuICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycpXHJcbiAgICAgICAgICAgICAgICAubWF0Y2goLyhlZGdlLVxcUyopLylbMV07XHJcblxyXG4gICAgICAgICAgJCgnI21vZGFsT3ZlcmxheSAuY2Fyb3VzZWwtbmV4dCBhJykuaHRtbChuZXh0VGl0bGUpO1xyXG4gICAgICAgICAgbG9jYXRpb24uaGFzaCA9IG5ld0hhc2g7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVXaW5kb3dTaXppbmcoaW5pdCkge1xyXG4gICAgICAgICAgdmFyIHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCksXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmVMaW1pdCA9IDAsXHJcbiAgICAgICAgICAgIG5ld0lzUmVzcG9uc2l2ZVN0YXRlID0gd2luZG93V2lkdGggPCByZXNwb25zaXZlTGltaXQ7XHJcblxyXG4gICAgICAgICAgaWYgKCRvdmVybGF5U2xpZGVyLmlzKCcuc2xpY2staW5pdGlhbGl6ZWQnKSkge1xyXG4gICAgICAgICAgICBjaGFuZ2VTbGlkZXJTdGF0ZSgkb3ZlcmxheVNsaWRlciwgIW5ld0lzUmVzcG9uc2l2ZVN0YXRlKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoaXNSZXNwb25zaXZlU3RhdGUgIT09IG5ld0lzUmVzcG9uc2l2ZVN0YXRlKSB7XHJcbiAgICAgICAgICAgIGlzUmVzcG9uc2l2ZVN0YXRlID0gbmV3SXNSZXNwb25zaXZlU3RhdGU7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGluaXQpIHtcclxuICAgICAgICAgICAgaW5pdFByb2ZpbGVTbGlkZXIoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVdpbmRvd1Njcm9sbGluZygpIHtcclxuICAgICAgICAgIGlmICghc2Nyb2xsZWRUb1ZpZXcpIHtcclxuICAgICAgICAgICAgaWYgKCQod2luZG93KS5zY3JvbGxUb3AoKSArICQod2luZG93KS5oZWlnaHQoKSA+ICRwcm9maWxlU2xpZGVyLm9mZnNldCgpLnRvcCkge1xyXG4gICAgICAgICAgICAgIHNjcm9sbGVkVG9WaWV3ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChhbmltYXRlUHJvZmlsZVNsaWRlciwgNTAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdFByb2ZpbGVTbGlkZXIoKSB7XHJcbiAgICAgICAgICBpbml0U2xpZGVyKCRwcm9maWxlU2xpZGVyLCB7XHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgIGFkYXB0aXZlSGVpZ2h0OiB0cnVlLFxyXG4gICAgICAgICAgICBwcmV2QXJyb3c6ICc8c3BhbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjYXJvdXNlbC1wcmV2IGdhLWNhcmVlcnMtb3VyLXBlb3BsZS1jYXJvdXNlbC1zY3JvbGxcIj48aW1nIHNyYz1cIi9jb250ZW50L2RhbS9pbnZlc3RvcnNncm91cC9hcHAvY2FyZWVycy9pbWFnZXMvQXJyb3ctTWFpbkFydGljbGUtQ2Fyb3VzZWwtQmxhY2stTC5wbmdcIj48L3NwYW4+JyxcclxuICAgICAgICAgICAgbmV4dEFycm93OiAnPHNwYW4gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2Fyb3VzZWwtbmV4dCBnYS1jYXJlZXJzLW91ci1wZW9wbGUtY2Fyb3VzZWwtc2Nyb2xsXCI+PGltZyBzcmM9XCIvY29udGVudC9kYW0vaW52ZXN0b3JzZ3JvdXAvYXBwL2NhcmVlcnMvaW1hZ2VzL0Fycm93LU1haW5BcnRpY2xlLUNhcm91c2VsLUJsYWNrLVIucG5nXCI+PC9zcGFuPidcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgYW5pbWF0ZVByb2ZpbGVTbGlkZXIoKTtcclxuICAgICAgICAgICRwcm9maWxlU2xpZGVyLm9uKCdhZnRlckNoYW5nZScsIGFuaW1hdGVQcm9maWxlU2xpZGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXRTbGlkZXIodGFyZ2V0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgICAgIHNwZWVkOiA3NTAsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMixcclxuICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDIsXHJcbiAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY4LFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICAgICAgICAgICAgaW5maW5pdGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgdGFyZ2V0LnNsaWNrKCQuZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBPdmVybGF5TW9kdWxlKCkge1xyXG4gICAgICAgIHZhciAkb3ZlcmxheSxcclxuICAgICAgICAgICRib2R5ID0gJCgnYm9keScpLFxyXG4gICAgICAgICAgb3ZlcmxheVNpemluZ0RlbGF5LFxyXG4gICAgICAgICAgY3VycmVudEluc3RhbmNlID0ge30sXHJcbiAgICAgICAgICBpc09wZW5GbGFnID0gZmFsc2UsXHJcbiAgICAgICAgICAkY2xvc2VCdXR0b247XHJcblxyXG4gICAgICAgIGluaXRPdmVybGF5KCk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBvcGVuT3ZlcmxheTogb3Blbk92ZXJsYXksXHJcbiAgICAgICAgICBpc09wZW46IGlzT3BlblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXRPdmVybGF5KCkge1xyXG4gICAgICAgICAgJG92ZXJsYXkgPSAkKCc8ZGl2PjwvZGl2PicpO1xyXG4gICAgICAgICAgJG92ZXJsYXkuYXR0cignaWQnLCAnbW9kYWxPdmVybGF5Jyk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5hdHRyKCdjbGFzcycsICdyZXZlYWwnKTtcclxuICAgICAgICAgICRvdmVybGF5LmF0dHIoJ2RhdGEtcmV2ZWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgICAkYm9keS5hcHBlbmQoJG92ZXJsYXkpO1xyXG4gICAgICAgICAgJG92ZXJsYXkub24oJ29wZW4uemYucmV2ZWFsJywgaGFuZGxlT3ZlcmxheU9wZW4pO1xyXG4gICAgICAgICAgJCh3aW5kb3cpLm9uKCdjbG9zZWQuemYucmV2ZWFsJywgaGFuZGxlT3ZlcmxheUNsb3NlKTtcclxuICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZGVsYXllZEhhbmRsZU92ZXJsYXlTaXppbmcpO1xyXG4gICAgICAgICAgaW5pdENsb3NlQnV0dG9uKCk7XHJcbiAgICAgICAgICBuZXcgRm91bmRhdGlvbi5SZXZlYWwoJG92ZXJsYXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZWxheWVkSGFuZGxlT3ZlcmxheVNpemluZygpIHtcclxuICAgICAgICAgIGlmIChvdmVybGF5U2l6aW5nRGVsYXkpIHtcclxuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChvdmVybGF5U2l6aW5nRGVsYXkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIG92ZXJsYXlTaXppbmdEZWxheSA9IHdpbmRvdy5zZXRUaW1lb3V0KG92ZXJsYXlTaXppbmcsIDI1MCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVPdmVybGF5Q2xvc2UoZXZlbnQpIHtcclxuICAgICAgICAgIGlzT3BlbkZsYWcgPSBmYWxzZTtcclxuICAgICAgICAgIGlmIChjdXJyZW50SW5zdGFuY2UuY2xvc2UpIHtcclxuICAgICAgICAgICAgY3VycmVudEluc3RhbmNlLmNsb3NlKGV2ZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIG92ZXJsYXlTaXplQ2xlYW51cCgpO1xyXG4gICAgICAgICAgY3VycmVudEluc3RhbmNlID0ge307XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVPdmVybGF5T3BlbihldmVudCkge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGlzT3BlbkZsYWcgPSB0cnVlO1xyXG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdpcy1yZXZlYWwtb3BlbicpO1xyXG4gICAgICAgICAgJG92ZXJsYXkuZmluZCgnKicpLmZvdW5kYXRpb24oKTtcclxuICAgICAgICAgIGlmIChjdXJyZW50SW5zdGFuY2Uub3Blbikge1xyXG4gICAgICAgICAgICBjdXJyZW50SW5zdGFuY2Uub3BlbihldmVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvdmVybGF5U2l6aW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0Q2xvc2VCdXR0b24oKSB7XHJcbiAgICAgICAgICB2YXIgJGlubmVyU3BhbiA9ICQoJzxzcGFuPjwvc3Bhbj4nKTtcclxuXHJcbiAgICAgICAgICAkY2xvc2VCdXR0b24gPSAkKCc8YnV0dG9uIGRhdGEtY2xvc2U+PC9idXR0b24+Jyk7XHJcbiAgICAgICAgICAkY2xvc2VCdXR0b24uYWRkQ2xhc3MoJ2Nsb3NlLWJ1dHRvbicpO1xyXG4gICAgICAgICAgJGNsb3NlQnV0dG9uLmF0dHIoJ2FyaWEtbGFiZWwnLCAnQ2xvc2UgbW9kYWwnKTtcclxuICAgICAgICAgICRpbm5lclNwYW4uYXR0cignYXJpYS1oaWRkZW4nLCB0cnVlKTtcclxuICAgICAgICAgICRpbm5lclNwYW4uaHRtbCgnJnRpbWVzOycpO1xyXG4gICAgICAgICAgJGNsb3NlQnV0dG9uLmFwcGVuZCgkaW5uZXJTcGFuKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGlzT3BlbigpIHtcclxuICAgICAgICAgIHJldHVybiBpc09wZW5GbGFnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb3Blbk92ZXJsYXkodXJsT3JNYXJrdXAsIG9wZW5DYWxsYmFjaywgY2xvc2VDYWxsYmFjaywgZnVsbFNjcmVlbikge1xyXG4gICAgICAgICAgY3VycmVudEluc3RhbmNlLm9wZW4gPSBvcGVuQ2FsbGJhY2s7XHJcbiAgICAgICAgICBjdXJyZW50SW5zdGFuY2UuY2xvc2UgPSBjbG9zZUNhbGxiYWNrO1xyXG4gICAgICAgICAgY3VycmVudEluc3RhbmNlLmZ1bGwgPSBmdWxsU2NyZWVuO1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiB1cmxPck1hcmt1cCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgb3Blbk92ZXJsYXlXaXRoQWpheCh1cmxPck1hcmt1cCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvcGVuT3ZlcmxheVdpdGhNYXJrdXAodXJsT3JNYXJrdXApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5PdmVybGF5V2l0aEFqYXgodXJsKSB7XHJcbiAgICAgICAgICAkLmFqYXgodXJsKS5kb25lKG9wZW5PdmVybGF5V2l0aE1hcmt1cCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvcGVuT3ZlcmxheVdpdGhNYXJrdXAobWFya3VwKSB7XHJcbiAgICAgICAgICAkb3ZlcmxheS5odG1sKG1hcmt1cCk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5hcHBlbmQoJGNsb3NlQnV0dG9uKTtcclxuICAgICAgICAgIGlmIChjdXJyZW50SW5zdGFuY2UuZnVsbCkge1xyXG4gICAgICAgICAgICAkb3ZlcmxheS5hZGRDbGFzcygnZnVsbCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgJG92ZXJsYXkuZm91bmRhdGlvbignb3BlbicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb3ZlcmxheVNpemVDbGVhbnVwKCkge1xyXG4gICAgICAgICAgJG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ2Z1bGwnKTtcclxuICAgICAgICAgICRvdmVybGF5LnJlbW92ZUNsYXNzKCd0b3VyJyk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5odG1sKCcnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG92ZXJsYXlTaXppbmcoKSB7XHJcbiAgICAgICAgICB2YXIgb3ZlcmxheUhlaWdodCA9ICRvdmVybGF5LmhlaWdodCgpLFxyXG4gICAgICAgICAgICB3aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgaWYgKG92ZXJsYXlIZWlnaHQgPiB3aW5kb3dIZWlnaHQpIHtcclxuICAgICAgICAgICAgJG92ZXJsYXkuY3NzKHtcclxuICAgICAgICAgICAgICB0b3A6IDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRvdmVybGF5LmFkZENsYXNzKCdmdWxsJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfSkoalF1ZXJ5KTtcclxuXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICB2YXIgdmlkcyA9IFtdLCBicmlnaHRDb3ZlO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgX3BhcnNlVmlkZW9zKCk7XHJcblxyXG4gICAgLy8gTWFrZSBzdXJlIHRoZSBWaWRlb0pTIG1ldGhvZCBpcyBhdmFpbGFibGUgYW5kIGZpcmUgcmVhZHkgZXZlbnQgaGFuZGxlcnMgaWYgc29cclxuICAgIC8vIGJyaWdodENvdmUgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyAgIGlmICgkKCcudmpzLXBsdWdpbnMtcmVhZHknKS5sZW5ndGgpIHtcclxuICAgIC8vICAgICBfYnJpZ2h0Q292ZVJlYWR5KCk7XHJcbiAgICAvLyAgICAgY2xlYXJJbnRlcnZhbChicmlnaHRDb3ZlKTtcclxuICAgIC8vICAgfVxyXG4gICAgLy8gfSwgNTAwKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlVmlkZW9zKCkge1xyXG4gICAgdmFyICRncm91cCxcclxuICAgICAgJHZpZGVvLFxyXG4gICAgICBkYXRhID0ge30sXHJcbiAgICAgIHByZWxvYWRPcHRpb25zID0gWydhdXRvJywgJ21ldGFkYXRhJywgJ25vbmUnXVxyXG5cclxuICAgIC8vIEVhY2ggZ3JvdXAgY2FuIGVmZmVjdGl2ZWx5IHVzZSBhIGRpZmZlcmVudCBwbGF5ZXIgd2hpY2ggd2lsbCBvbmx5IGJlIGxvYWRlZCBvbmNlXHJcbiAgICAkKCcuaWctdmlkZW8tZ3JvdXAnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgJGdyb3VwID0gJCh0aGlzKTtcclxuICAgICAgZGF0YS5hY2NvdW50ID0gJGdyb3VwLmRhdGEoJ2FjY291bnQnKTtcclxuICAgICAgZGF0YS5wbGF5ZXIgPSAkZ3JvdXAuZGF0YSgncGxheWVyJyk7XHJcblxyXG4gICAgICAvLyBMb2FkIHJlcXVpcmVkIEpTIGZvciBhIHBsYXllclxyXG4gICAgICBfaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpO1xyXG5cclxuICAgICAgLy8gTG9vcCB0aHJvdWdoIHZpZGVvJ3NcclxuICAgICAgJGdyb3VwLmZpbmQoJy5pZy12aWRlby1qcycpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgJHZpZGVvID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgLy8gQ2FwdHVyZSBvcHRpb25zIChyZXF1aXJlZClcclxuICAgICAgICBkYXRhLmlkID0gJHZpZGVvLmRhdGEoJ2lkJyk7XHJcblxyXG4gICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyAob3B0aW9uYWwpXHJcbiAgICAgICAgZGF0YS50aXRsZSA9ICR2aWRlby5kYXRhKCd0aXRsZScpID8gJHZpZGVvLmRhdGEoJ3RpdGxlJykgOiAnJztcclxuICAgICAgICBkYXRhLmRlc2NyaXB0aW9uID0gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgPyAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKSA6ICcnO1xyXG4gICAgICAgIGRhdGEuYXV0byA9ICR2aWRlby5kYXRhKCdhdXRvcGxheScpID8gJ2F1dG9wbGF5JyA6ICcnO1xyXG4gICAgICAgIGRhdGEuY3RybCA9ICR2aWRlby5kYXRhKCdjb250cm9scycpID8gJ2NvbnRyb2xzJyA6ICcnO1xyXG4gICAgICAgIGRhdGEucHJlbG9hZCA9IChwcmVsb2FkT3B0aW9ucy5pbmRleE9mKCR2aWRlby5kYXRhKCdwcmVsb2FkJykpID4gLTEpID8gJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSA6ICdhdXRvJztcclxuXHJcbiAgICAgICAgLy8gU3RvcmUgSUQncyBmb3IgYWxsIHZpZGVvJ3Mgb24gdGhlIHBhZ2UgLSBpbiBjYXNlIHdlIHdhbnQgdG8gcnVuIGEgcG9zdC1sb2FkIHByb2Nlc3Mgb24gZWFjaFxyXG4gICAgICAgIHZpZHMucHVzaChkYXRhLmlkKTtcclxuXHJcbiAgICAgICAgLy8gTGV0J3MgcmVwbGFjZSB0aGUgaWctdmlkZW8tanMgJ2RpcmVjdGl2ZScgd2l0aCB0aGUgbmVjZXNzYXJ5IEJyaWdodGNvdmUgY29kZVxyXG4gICAgICAgIF9pbmplY3RUZW1wbGF0ZSgkdmlkZW8sIGRhdGEsIGluZGV4KVxyXG4gICAgICB9KTtcclxuXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2luamVjdEJyaWdodENvdmVKUyhkYXRhKSB7XHJcbiAgICB2YXIgaW5kZXhqcyA9IGA8c2NyaXB0IHNyYz1cIi8vcGxheWVycy5icmlnaHRjb3ZlLm5ldC8ke2RhdGEuYWNjb3VudH0vJHtkYXRhLnBsYXllcn1fZGVmYXVsdC9pbmRleC5taW4uanNcIj48L3NjcmlwdD5gO1xyXG4gICAgJCgnYm9keScpLmFwcGVuZChpbmRleGpzKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9pbmplY3RUZW1wbGF0ZSgkdmlkZW8sIGRhdGEsIGluZGV4KSB7XHJcbiAgICB2YXIgaHRtbCA9IGA8ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyXCI+PHNwYW4gY2xhc3M9XCJ2aWRlby1vdmVybGF5ICR7ZGF0YS5pZH1cIj48L3NwYW4+PGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lci1yZXNwb25zaXZlXCI+PHZpZGVvIGRhdGEtc2V0dXA9J3tcInRlY2hPcmRlclwiOiBbXCJodG1sNVwiXX0nIGRhdGEtdmlkZW8taWQ9XCIke2RhdGEuaWR9XCIgcHJlbG9hZD1cIiR7ZGF0YS5wcmVsb2FkfVwiIGRhdGEtYWNjb3VudD1cIiR7ZGF0YS5hY2NvdW50fVwiIGRhdGEtcGxheWVyPVwiJHtkYXRhLnBsYXllcn1cIiBkYXRhLWVtYmVkPVwiZGVmYXVsdFwiIGRhdGEtYXBwbGljYXRpb24taWQ9XCIke2luZGV4fVwiIGNsYXNzPVwidmlkZW8tanNcIiBpZD1cIiR7ZGF0YS5pZH1cIiAke2RhdGEuY3RybH0gJHtkYXRhLmF1dG99PjwvdmlkZW8+PC9kaXY+PC9kaXY+PGgyIGNsYXNzPVwidmlkZW8tdGl0bGVcIj4ke2RhdGEudGl0bGV9PC9oMj48cCBjbGFzcz1cInZpZGVvLWRlc2NyaXB0aW9uXCI+JHtkYXRhLmRlc2NyaXB0aW9ufTwvcD5gO1xyXG4gICAgJHZpZGVvLnJlcGxhY2VXaXRoKGh0bWwpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2JyaWdodENvdmVSZWFkeSgpIHtcclxuICAgIHZpZHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgdmlkZW9qcygnIycgKyBlbCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vICQoJy52aWRlby1vdmVybGF5LicrIGVsKS5hZGRDbGFzcygnaGlkZGVuJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBfc2VhcmNoTGVnYWN5Q29kZSgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3NlYXJjaExlZ2FjeUNvZGUoKSB7XHJcblxyXG4vLyBHTE9CQUxTXHJcbiAgICB2YXIgbW9kZWxVcmwgPSAnaHR0cHM6Ly9zZWFyY2guaW52ZXN0b3JzZ3JvdXAuY29tL2FwaS9jd3BzZWFyY2g/JztcclxuICAgIHZhciAkZmllbGQgPSAkKCcjRmluZEFuT2ZmaWNlJyk7XHJcbiAgICB2YXIgbGFuZyA9ICdlbic7XHJcbiAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignL2ZyLycpID4gLTEpIHtcclxuICAgICAgbGFuZyA9ICdmcic7XHJcbiAgICB9XHJcblxyXG4vLyBQcm9jZXNzIHRoZSBsb2NhbCBwcmVmZXRjaGVkIGRhdGFcclxuICAgIHZhciBzdWdnZXN0aW9ucyA9IHt9O1xyXG4gICAgdmFyIGNpdGllcyA9IFtcclxuICAgICAgXCJhdGhhYmFzY2FcIixcclxuICAgICAgXCJibHVmZnRvblwiLFxyXG4gICAgICBcImJvbm55dmlsbGVcIixcclxuICAgICAgXCJicm9va3NcIixcclxuICAgICAgXCJjYWxnYXJ5XCIsXHJcbiAgICAgIFwiY2Ftcm9zZVwiLFxyXG4gICAgICBcImNhbm1vcmVcIixcclxuICAgICAgXCJkcmF5dG9uIHZhbGxleVwiLFxyXG4gICAgICBcImVkbW9udG9uXCIsXHJcbiAgICAgIFwiZm9ydCBtY211cnJheVwiLFxyXG4gICAgICBcImZvcnQgc2Fza2F0Y2hld2FuXCIsXHJcbiAgICAgIFwiZ3JhbmRlIHByYWlyaWVcIixcclxuICAgICAgXCJoYWxraXJrXCIsXHJcbiAgICAgIFwiaGlsbGNyZXN0IG1pbmVzXCIsXHJcbiAgICAgIFwiaGludG9uXCIsXHJcbiAgICAgIFwibGVkdWNcIixcclxuICAgICAgXCJsZXRoYnJpZGdlXCIsXHJcbiAgICAgIFwibGxveWRtaW5zdGVyXCIsXHJcbiAgICAgIFwibWVkaWNpbmUgaGF0XCIsXHJcbiAgICAgIFwibW9yaW52aWxsZVwiLFxyXG4gICAgICBcInBlYWNlIHJpdmVyXCIsXHJcbiAgICAgIFwicGluY2hlciBjcmVla1wiLFxyXG4gICAgICBcInByb3Zvc3RcIixcclxuICAgICAgXCJyZWQgZGVlclwiLFxyXG4gICAgICBcInNoZXJ3b29kIHBhcmtcIixcclxuICAgICAgXCJzcHJ1Y2UgZ3JvdmVcIixcclxuICAgICAgXCJzdC4gYWxiZXJ0XCIsXHJcbiAgICAgIFwic3RldHRsZXJcIixcclxuICAgICAgXCJzdHVyZ2VvbiBjb3VudHlcIixcclxuICAgICAgXCJ0b2ZpZWxkXCIsXHJcbiAgICAgIFwidmVybWlsaW9uXCIsXHJcbiAgICAgIFwid2FpbndyaWdodFwiLFxyXG4gICAgICBcIndlc3Rsb2NrXCIsXHJcbiAgICAgIFwid2hpdGVsYXdcIixcclxuICAgICAgXCJhYmJvdHNmb3JkXCIsXHJcbiAgICAgIFwiYnJhY2tlbmRhbGVcIixcclxuICAgICAgXCJidXJuYWJ5XCIsXHJcbiAgICAgIFwiYnVybnMgbGFrZVwiLFxyXG4gICAgICBcImNhbXBiZWxsIHJpdmVyXCIsXHJcbiAgICAgIFwiY2hhc2VcIixcclxuICAgICAgXCJjaGlsbGl3YWNrXCIsXHJcbiAgICAgIFwiY29tb3hcIixcclxuICAgICAgXCJjb3F1aXRsYW1cIixcclxuICAgICAgXCJjb3VydGVuYXlcIixcclxuICAgICAgXCJjcmFuYnJvb2tcIixcclxuICAgICAgXCJkYXdzb24gY3JlZWtcIixcclxuICAgICAgXCJkdW5jYW5cIixcclxuICAgICAgXCJmb3J0IG5lbHNvblwiLFxyXG4gICAgICBcImZvcnQgc3QuIGpvaG5cIixcclxuICAgICAgXCJpbnZlcm1lcmVcIixcclxuICAgICAgXCJrYW1sb29wc1wiLFxyXG4gICAgICBcImtlbG93bmFcIixcclxuICAgICAgXCJsYW5nbGV5XCIsXHJcbiAgICAgIFwibWVycml0dFwiLFxyXG4gICAgICBcIm5hbmFpbW9cIixcclxuICAgICAgXCJuZWxzb25cIixcclxuICAgICAgXCJub3J0aCB2YW5jb3V2ZXJcIixcclxuICAgICAgXCJvbGl2ZXJcIixcclxuICAgICAgXCJwZW50aWN0b25cIixcclxuICAgICAgXCJwb3J0IGFsYmVybmlcIixcclxuICAgICAgXCJwb3dlbGwgcml2ZXJcIixcclxuICAgICAgXCJwcmluY2UgZ2VvcmdlXCIsXHJcbiAgICAgIFwicXVhbGljdW0gYmVhY2hcIixcclxuICAgICAgXCJxdWVzbmVsXCIsXHJcbiAgICAgIFwicmV2ZWxzdG9rZVwiLFxyXG4gICAgICBcInJpY2htb25kXCIsXHJcbiAgICAgIFwic2FhbmljaHRvblwiLFxyXG4gICAgICBcInNhbG1vbiBhcm1cIixcclxuICAgICAgXCJzYWx0IHNwcmluZyBpc2xhbmRcIixcclxuICAgICAgXCJzZWNoZWx0XCIsXHJcbiAgICAgIFwic2lkbmV5XCIsXHJcbiAgICAgIFwic21pdGhlcnNcIixcclxuICAgICAgXCJzdXJyZXlcIixcclxuICAgICAgXCJ0ZXJyYWNlXCIsXHJcbiAgICAgIFwidHJhaWxcIixcclxuICAgICAgXCJ2YW5jb3V2ZXJcIixcclxuICAgICAgXCJ2ZXJub25cIixcclxuICAgICAgXCJ2aWN0b3JpYVwiLFxyXG4gICAgICBcIndlc3RiYW5rXCIsXHJcbiAgICAgIFwid2lsbGlhbXMgbGFrZVwiLFxyXG4gICAgICBcImJyYW5kb25cIixcclxuICAgICAgXCJkYXVwaGluXCIsXHJcbiAgICAgIFwiZmxpbiBmbG9uXCIsXHJcbiAgICAgIFwiZ2lsbGFtXCIsXHJcbiAgICAgIFwia2lsbGFybmV5XCIsXHJcbiAgICAgIFwibWFuaXRvdVwiLFxyXG4gICAgICBcIm1pYW1pXCIsXHJcbiAgICAgIFwibW9yZGVuXCIsXHJcbiAgICAgIFwibmFyb2xcIixcclxuICAgICAgXCJwb3J0YWdlIGxhIHByYWlyaWVcIixcclxuICAgICAgXCJzZWxraXJrXCIsXHJcbiAgICAgIFwic3dhbiByaXZlclwiLFxyXG4gICAgICBcInRoZSBwYXNcIixcclxuICAgICAgXCJ2aXJkZW5cIixcclxuICAgICAgXCJ3YXJyZW5cIixcclxuICAgICAgXCJ3aW5uaXBlZ1wiLFxyXG4gICAgICBcImJhdGh1cnN0XCIsXHJcbiAgICAgIFwiYmVkZWxsXCIsXHJcbiAgICAgIFwiZWRtdW5kc3RvblwiLFxyXG4gICAgICBcImZyZWRlcmljdG9uXCIsXHJcbiAgICAgIFwibGFuc2Rvd25lXCIsXHJcbiAgICAgIFwibWlyYW1pY2hpXCIsXHJcbiAgICAgIFwibW9uY3RvblwiLFxyXG4gICAgICBcInF1aXNwYW1zaXNcIixcclxuICAgICAgXCJyZXh0b25cIixcclxuICAgICAgXCJyb3RoZXNheVwiLFxyXG4gICAgICBcInNhaW50IGpvaG5cIixcclxuICAgICAgXCJzYWludCBwYXVsXCIsXHJcbiAgICAgIFwic3Vzc2V4XCIsXHJcbiAgICAgIFwiYmxha2V0b3duXCIsXHJcbiAgICAgIFwiY2xhcmVudmlsbGVcIixcclxuICAgICAgXCJjb3JuZXIgYnJvb2tcIixcclxuICAgICAgXCJnYW5kZXJcIixcclxuICAgICAgXCJncmFuZCBmYWxscyAtIHdpbmRzb3JcIixcclxuICAgICAgXCJtYXJ5c3Rvd25cIixcclxuICAgICAgXCJyb2FjaGVzIGxpbmVcIixcclxuICAgICAgXCJzdC4gam9obidzXCIsXHJcbiAgICAgIFwidHJpbml0eVwiLFxyXG4gICAgICBcImFtaGVyc3RcIixcclxuICAgICAgXCJhbnRpZ29uaXNoXCIsXHJcbiAgICAgIFwiYmFycmluZ3RvbiBwYXNzYWdlXCIsXHJcbiAgICAgIFwiYmVsbGl2ZWF1IGNvdmVcIixcclxuICAgICAgXCJicmlkZ2V0b3duXCIsXHJcbiAgICAgIFwiYnJpZGdld2F0ZXJcIixcclxuICAgICAgXCJkYXJ0bW91dGhcIixcclxuICAgICAgXCJkYXl0b25cIixcclxuICAgICAgXCJoYWxpZmF4XCIsXHJcbiAgICAgIFwibWlkZGxldG9uXCIsXHJcbiAgICAgIFwibmV3IGdsYXNnb3dcIixcclxuICAgICAgXCJuZXcgbWluYXNcIixcclxuICAgICAgXCJub3J0aCBzeWRuZXlcIixcclxuICAgICAgXCJwaWN0b3VcIixcclxuICAgICAgXCJwb3J0IGhhd2tlc2J1cnlcIixcclxuICAgICAgXCJzeWRuZXlcIixcclxuICAgICAgXCJ0cnVyb1wiLFxyXG4gICAgICBcInllbGxvd2tuaWZlXCIsXHJcbiAgICAgIFwiYWpheFwiLFxyXG4gICAgICBcImFsZ29ucXVpbiBoaWdobGFuZHNcIixcclxuICAgICAgXCJhbmNhc3RlclwiLFxyXG4gICAgICBcImF0aWtva2FuXCIsXHJcbiAgICAgIFwiYmFycmllXCIsXHJcbiAgICAgIFwiYmVsbGV2aWxsZVwiLFxyXG4gICAgICBcImJvd21hbnZpbGxlXCIsXHJcbiAgICAgIFwiYnJhY2VicmlkZ2VcIixcclxuICAgICAgXCJicmFtcHRvblwiLFxyXG4gICAgICBcImJyYW50Zm9yZFwiLFxyXG4gICAgICBcImJyb2NrdmlsbGVcIixcclxuICAgICAgXCJicm9va2xpblwiLFxyXG4gICAgICBcImJ1cmxpbmd0b25cIixcclxuICAgICAgXCJjYW1icmlkZ2VcIixcclxuICAgICAgXCJjYXJsZXRvbiBwbGFjZVwiLFxyXG4gICAgICBcImNoYXRoYW1cIixcclxuICAgICAgXCJjbGF5dG9uXCIsXHJcbiAgICAgIFwiY2xpbnRvblwiLFxyXG4gICAgICBcImNvYm91cmdcIixcclxuICAgICAgXCJjb2xsaW5nd29vZFwiLFxyXG4gICAgICBcImNvbmNvcmRcIixcclxuICAgICAgXCJjb3Jud2FsbFwiLFxyXG4gICAgICBcImRyeWRlblwiLFxyXG4gICAgICBcImR1bmRhc1wiLFxyXG4gICAgICBcImR1bnNmb3JkXCIsXHJcbiAgICAgIFwiZHV0dG9uXCIsXHJcbiAgICAgIFwiZWxsaW90IGxha2VcIixcclxuICAgICAgXCJldG9iaWNva2VcIixcclxuICAgICAgXCJmb3J0IGZyYW5jZXNcIixcclxuICAgICAgXCJnYW5hbm9xdWVcIixcclxuICAgICAgXCJnYXJzb25cIixcclxuICAgICAgXCJncmVlbHlcIixcclxuICAgICAgXCJncmltc2J5XCIsXHJcbiAgICAgIFwiZ3VlbHBoXCIsXHJcbiAgICAgIFwiaGFpbGV5YnVyeVwiLFxyXG4gICAgICBcImhhbWlsdG9uXCIsXHJcbiAgICAgIFwiaGFub3ZlclwiLFxyXG4gICAgICBcImhlYXJzdFwiLFxyXG4gICAgICBcImh1bnRzdmlsbGVcIixcclxuICAgICAgXCJqZXJzZXl2aWxsZVwiLFxyXG4gICAgICBcImthbmF0YVwiLFxyXG4gICAgICBcImthcHVza2FzaW5nXCIsXHJcbiAgICAgIFwia2Vub3JhXCIsXHJcbiAgICAgIFwia2luZ3N0b25cIixcclxuICAgICAgXCJraXJrbGFuZCBsYWtlXCIsXHJcbiAgICAgIFwia2l0Y2hlbmVyXCIsXHJcbiAgICAgIFwibGFuZ3RvblwiLFxyXG4gICAgICBcImxpbmRzYXlcIixcclxuICAgICAgXCJsb25kb25cIixcclxuICAgICAgXCJtYXBsZVwiLFxyXG4gICAgICBcIm1hcmF0aG9uXCIsXHJcbiAgICAgIFwibWFya2hhbVwiLFxyXG4gICAgICBcIm1lcnJpY2t2aWxsZVwiLFxyXG4gICAgICBcIm1pbHRvblwiLFxyXG4gICAgICBcIm1pbmRlblwiLFxyXG4gICAgICBcIm1pc3Npc3NhdWdhXCIsXHJcbiAgICAgIFwibW91bnQgZm9yZXN0XCIsXHJcbiAgICAgIFwibW91bnQgaG9wZVwiLFxyXG4gICAgICBcIm5lcGVhblwiLFxyXG4gICAgICBcIm5ldyBsaXNrZWFyZFwiLFxyXG4gICAgICBcIm5ld21hcmtldFwiLFxyXG4gICAgICBcIm5pYWdhcmEgZmFsbHNcIixcclxuICAgICAgXCJub3J0aCBiYXlcIixcclxuICAgICAgXCJub3J0aCB5b3JrXCIsXHJcbiAgICAgIFwib2FrIHJpZGdlc1wiLFxyXG4gICAgICBcIm9ha3ZpbGxlXCIsXHJcbiAgICAgIFwib3JhbmdldmlsbGVcIixcclxuICAgICAgXCJvcmlsbGlhXCIsXHJcbiAgICAgIFwib3J0b25cIixcclxuICAgICAgXCJvc2hhd2FcIixcclxuICAgICAgXCJvdHRhd2FcIixcclxuICAgICAgXCJvd2VuIHNvdW5kXCIsXHJcbiAgICAgIFwicGFycnkgc291bmRcIixcclxuICAgICAgXCJwZW1icm9rZVwiLFxyXG4gICAgICBcInBlbmV0YW5ndWlzaGVuZVwiLFxyXG4gICAgICBcInBlcnRoXCIsXHJcbiAgICAgIFwicGV0ZXJib3JvdWdoXCIsXHJcbiAgICAgIFwicGV0cm9saWFcIixcclxuICAgICAgXCJwaWNrZXJpbmdcIixcclxuICAgICAgXCJyZWQgbGFrZVwiLFxyXG4gICAgICBcInJpZGdldG93blwiLFxyXG4gICAgICBcInNhcm5pYVwiLFxyXG4gICAgICBcInNhdWx0IHN0ZS4gbWFyaWVcIixcclxuICAgICAgXCJzY2FyYm9yb3VnaFwiLFxyXG4gICAgICBcInNjaHJlaWJlclwiLFxyXG4gICAgICBcInNpbWNvZVwiLFxyXG4gICAgICBcInNpb3V4IGxvb2tvdXRcIixcclxuICAgICAgXCJzdC4gY2F0aGFyaW5lc1wiLFxyXG4gICAgICBcInN0LiBtYXJ5c1wiLFxyXG4gICAgICBcInN0b3VmZnZpbGxlXCIsXHJcbiAgICAgIFwic3RyYXRmb3JkXCIsXHJcbiAgICAgIFwic3R1cmdlb24gZmFsbHNcIixcclxuICAgICAgXCJzdWRidXJ5XCIsXHJcbiAgICAgIFwic3VuZHJpZGdlXCIsXHJcbiAgICAgIFwidGh1bmRlciBiYXlcIixcclxuICAgICAgXCJ0aWxsc29uYnVyZ1wiLFxyXG4gICAgICBcInRpbW1pbnNcIixcclxuICAgICAgXCJ0b3JvbnRvXCIsXHJcbiAgICAgIFwidHJlbnRvblwiLFxyXG4gICAgICBcIlV4YnJpZGdlXCIsXHJcbiAgICAgIFwidmFsIGNhcm9uXCIsXHJcbiAgICAgIFwid2Fsa2VydG9uXCIsXHJcbiAgICAgIFwid2F0ZXJsb29cIixcclxuICAgICAgXCJ3ZWxsYW5kXCIsXHJcbiAgICAgIFwid2hpdGJ5XCIsXHJcbiAgICAgIFwid2lsbG93ZGFsZVwiLFxyXG4gICAgICBcIndpbmRzb3JcIixcclxuICAgICAgXCJ3aW5naGFtXCIsXHJcbiAgICAgIFwid29vZGJyaWRnZVwiLFxyXG4gICAgICBcImNoYXJsb3R0ZXRvd24sIHBlXCIsXHJcbiAgICAgIFwic291cmlzLCBwZVwiLFxyXG4gICAgICBcInN1bW1lcnNpZGUsIHBlXCIsXHJcbiAgICAgIFwid2VsbGluZ3RvblwiLFxyXG4gICAgICBcImFuam91XCIsXHJcbiAgICAgIFwiYm9pc2JyaWFuZFwiLFxyXG4gICAgICBcImJvdWNoZXJ2aWxsZVwiLFxyXG4gICAgICBcImJyb3NzYXJkXCIsXHJcbiAgICAgIFwiY2jDonRlYXVndWF5XCIsXHJcbiAgICAgIFwiY2hpY291dGltaVwiLFxyXG4gICAgICBcImPDtHRlIHNhaW50LWx1Y1wiLFxyXG4gICAgICBcImRvbGxhcmQtZGVzLW9ybWVhdXhcIixcclxuICAgICAgXCJnYXRpbmVhdVwiLFxyXG4gICAgICBcImdyYW5ieVwiLFxyXG4gICAgICBcImxhdmFsXCIsXHJcbiAgICAgIFwibMOpdmlzXCIsXHJcbiAgICAgIFwibWlyYWJlbFwiLFxyXG4gICAgICBcIm1vbnRyZWFsXCIsXHJcbiAgICAgIFwibmV3IHJpY2htb25kXCIsXHJcbiAgICAgIFwicG9pbnRlLWNsYWlyZVwiLFxyXG4gICAgICBcInF1w6liZWNcIixcclxuICAgICAgXCJzZXB0LWlsZXNcIixcclxuICAgICAgXCJzaGVyYnJvb2tlXCIsXHJcbiAgICAgIFwidmlsbGUgc3QtbGF1cmVudFwiLFxyXG4gICAgICBcIndlc3Rtb3VudFwiLFxyXG4gICAgICBcImVhc3RlbmRcIixcclxuICAgICAgXCJlc3RldmFuXCIsXHJcbiAgICAgIFwiZXN0ZXJoYXp5XCIsXHJcbiAgICAgIFwiZm9hbSBsYWtlXCIsXHJcbiAgICAgIFwiaHVtYm9sZHRcIixcclxuICAgICAgXCJraW5kZXJzbGV5XCIsXHJcbiAgICAgIFwibGVhZGVyXCIsXHJcbiAgICAgIFwibWFwbGUgY3JlZWtcIixcclxuICAgICAgXCJtZWFkb3cgbGFrZVwiLFxyXG4gICAgICBcIm1lbGZvcnRcIixcclxuICAgICAgXCJtZWx2aWxsZVwiLFxyXG4gICAgICBcIm1vb3NlIGphd1wiLFxyXG4gICAgICBcIm5vcnRoIGJhdHRsZWZvcmRcIixcclxuICAgICAgXCJvdXRsb29rXCIsXHJcbiAgICAgIFwib3hib3dcIixcclxuICAgICAgXCJwcmluY2UgYWxiZXJ0XCIsXHJcbiAgICAgIFwicmVnaW5hXCIsXHJcbiAgICAgIFwicmVnaW5hIGJlYWNoXCIsXHJcbiAgICAgIFwicm9zZXRvd25cIixcclxuICAgICAgXCJzYXNrYXRvb25cIixcclxuICAgICAgXCJzaGVsbGJyb29rXCIsXHJcbiAgICAgIFwic3dpZnQgY3VycmVudFwiLFxyXG4gICAgICBcIndhdHJvdXNcIixcclxuICAgICAgXCJ3YXRzb25cIixcclxuICAgICAgXCJ5b3JrdG9uXCIsXHJcbiAgICAgIFwid2hpdGVob3JzZVwiXHJcbiAgICBdO1xyXG4gICAgc3VnZ2VzdGlvbnMubG9jYXRpb25zID0gbmV3IEJsb29kaG91bmQoe1xyXG4gICAgICBkYXR1bVRva2VuaXplcjogQmxvb2Rob3VuZC50b2tlbml6ZXJzLndoaXRlc3BhY2UsXHJcbiAgICAgIHF1ZXJ5VG9rZW5pemVyOiBCbG9vZGhvdW5kLnRva2VuaXplcnMud2hpdGVzcGFjZSxcclxuICAgICAgbG9jYWw6IGNpdGllc1xyXG4gICAgfSk7XHJcblxyXG4vLyBHZXQgdGhlIHJlc3VsdHNcclxuICAgIGZ1bmN0aW9uIGdldFNlYXJjaFJlc3VsdHMocGFyYW1zKSB7XHJcbiAgICAgIHBhcmFtcy5zZWFyY2h0eXBlID0gJ29mZmljZSc7XHJcbiAgICAgIHBhcmFtcy5uYW1lID0gJyc7XHJcblxyXG4gICAgICAvLyBNYWtlIHN1cmUgZXJyb3IgbWVzc2FnZSBpcyBoaWRkZW4gZWFjaCB0aW1lXHJcbiAgICAgICQoJy56ZXJvLXJlc3VsdHMnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cclxuICAgICAgJC5nZXRKU09OKG1vZGVsVXJsLCBwYXJhbXMpXHJcbiAgICAgICAgLmFsd2F5cygpXHJcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgIHZhciByZXN1bHQgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdpcy1yZXZlYWwtb3BlbicpO1xyXG4gICAgICAgICAgICAkKCcjc2VhcmNoUmVzdWx0c01vZGFsJykucmVtb3ZlQ2xhc3MoJ2Nsb3NlZCcpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICBkaXNwbGF5U2VhcmNoUmVzdWx0cygnb2ZmaWNlLXRlbXBsYXRlJywgcmVzdWx0KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy56ZXJvLXJlc3VsdHMnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZhaWwoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0RhdGEgY291bGQgbm90IGJlIHJldHJpZXZlZCwgcGxlYXNlIHRyeSBhZ2FpbicsIHJlc3VsdC5zdGF0dXMgKyAnICcgKyByZXN1bHQuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuLy8gQmVjYXVzZSB3ZSBhcmUgb25seSBzZWFyY2hpbmcgZm9yIGNpdGllcywgdGhpcyBmdW5jdGlvbiBpcyBzbGlnaHRseSByZWR1bmRhbnQgLSBsZWF2aW5nIGl0IGluIHBsYWNlIGZvciBub3dcclxuICAgIGZ1bmN0aW9uIHBhcnNlU2VhcmNoU3RyaW5nKCkge1xyXG4gICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgIHZhciBzZWFyY2ggPSAkZmllbGQudmFsKCk7XHJcblxyXG4gICAgICByZXN1bHQuY2l0eSA9ICcnO1xyXG5cclxuICAgICAgLy8gU2VhcmNoIGluIHRoZSBsYW5ndWFnZSBvZiB0aGUgcGFnZVxyXG4gICAgICByZXN1bHQubGFuZyA9IGxhbmc7XHJcbiAgICAgIC8vIFdlIG9ubHkgc2VhcmNoIGNvbnN1bHRhbnRzIGZyb20gdGhpcyBtZXRob2RcclxuICAgICAgcmVzdWx0LnNlYXJjaHR5cGUgPSAnY29uJztcclxuXHJcbiAgICAgIC8vIENoZWNrIHRoZSBzZWFyY2ggc3RyaW5nIGZvciBhIHByZXZpb3VzbHkgZGVmaW5lZCBsb2NhdGlvblxyXG4gICAgICB2YXIgd29yZHMgPSBzZWFyY2guc3BsaXQoJyAnKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vIENoZWNrIGVhY2ggd29yZCBmb3IgYSBjaXR5IGZyb20gdGhlIHByZWRlZmluZWQgbGlzdFxyXG4gICAgICAgIHZhciBjaXR5ID0gc3VnZ2VzdGlvbnMubG9jYXRpb25zLmdldCh3b3Jkc1tpXSk7XHJcbiAgICAgICAgaWYgKGNpdHkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgcmVzdWx0LmNpdHkgPSBjaXR5WzBdO1xyXG4gICAgICAgICAgd29yZHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFyZXN1bHQuY2l0eSkge1xyXG4gICAgICAgIHJlc3VsdC5jaXR5ID0gd29yZHMuam9pbignICcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRpc3BsYXlTZWFyY2hSZXN1bHRzKHRlbXBsYXRlSUQsIGpzb24pIHtcclxuICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJRCkuaW5uZXJIVE1MO1xyXG4gICAgICBNdXN0YWNoZS5wYXJzZSh0ZW1wbGF0ZSk7XHJcbiAgICAgIHZhciByZW5kZXJlZCA9IE11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwganNvbik7XHJcbiAgICAgICQoJyNzZWFyY2hSZXN1bHRzTW9kYWwnKS5hcHBlbmQocmVuZGVyZWQpO1xyXG4gICAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4vL0luaXQgZXZlcnl0aGluZ1xyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vIFRyeSB0byBwcmVkZXRlcm1pbmUgd2hhdCByZXN1bHRzIHNob3VsZCBzaG93XHJcbiAgICAgIC8vIFNldHVwIHRoZSB0eXBlYWhlYWRcclxuICAgICAgJCgnLnR5cGVhaGVhZCcpLnR5cGVhaGVhZCh7XHJcbiAgICAgICAgICBoaWdobGlnaHQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtuYW1lOiAnbG9jYXRpb25zJywgc291cmNlOiBzdWdnZXN0aW9ucy5sb2NhdGlvbnMsIGxpbWl0OiAyfVxyXG4gICAgICApO1xyXG5cclxuICAgICAgLy8gU2V0dXAgdGhlIGZvcm0gc3VibWlzc2lvblxyXG4gICAgICAkKCcuaWctc2VhcmNoJykuc3VibWl0KGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciBwYXJhbXMgPSBwYXJzZVNlYXJjaFN0cmluZygpO1xyXG4gICAgICAgIGdldFNlYXJjaFJlc3VsdHMocGFyYW1zKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBGYWtlIG1vZGFsIC0gQWRkaW5nIGhhbmRsZXIgb24gZG9jdW1lbnQgc28gaXQgZmlyZXMgZGVzcGl0ZSB0aGUgYnV0dG9uIG5vdCBiZWluZyByZW5kZXJlZCB5ZXRcclxuICAgICAgJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcIiNzZWFyY2hSZXN1bHRzTW9kYWwgLmNsb3NlLWJ1dHRvblwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnI3NlYXJjaFJlc3VsdHNNb2RhbCcpLmFkZENsYXNzKCdjbG9zZWQnKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICB9LCA0MDApO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiLyogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBmb3Igcm9sbHVwIChodHRwOi8vcm9sbHVwanMub3JnLykgYW5kXHJcbiBlc3NlbnRpb25hbGx5ICdib290c3RyYXBzJyBvdXIgaWcuY29tICdhcHBsaWNhdGlvbicuXHJcblxyXG4gQWxsIG1vZHVsZXMgc2hvdWxkIGJlIGltcG9ydGVkIGhlcmUgc28gdGhhdCB0aGV5IGNhbiBiZSBpbml0aWFsaXplZCBvblxyXG4gYSBjYXNlLWJ5LWNhc2UgYmFzaXMgKG5vdCBhbGwgcGFnZXMgcmVxdWlyZSB0aGUgaW5pdGlhbGl6YXRpb24gb2YgYSBjYXJvdXNlbFxyXG4gZm9yIGluc3RhbmNlKS5cclxuXHJcbiBBbnkgdGFza3Mgb3IgcHJvY2Vzc2VzIHRoYXQgbmVlZCB0byBiZSBpbml0aWF0ZWQgb24gcGFnZSBsb2FkIHNob3VsZCBsaXZlIGluIHRoaXNcclxuIGZpbGUgYXMgd2VsbC4gQW4gaW5jbHVkZWQgZXhhbXBsZSBpcyBhIG1ldGhvZCB0aGF0IGFkZHMgYW4gJ2VuJyBvciAnZnInIGNsYXNzIHRvXHJcbiB0aGUgYm9keSBiYXNlZCBvbiB0aGUgZ2xvYmFsIGxhbmd1YWdlIHZhcmlhYmxlIHRoYXQgd2UgY2FuIHRoZW4gdXNlIHRvIHdyaXRlIGN1c3RvbVxyXG4gc3R5bGVzIGZvciBlYWNoIGxhbmd1YWdlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBmb3JtcyBmcm9tICcuL2Zvcm1zLmpzJztcclxuaW1wb3J0IGNhcm91c2VsIGZyb20gJy4vY2Fyb3VzZWwuanMnO1xyXG5pbXBvcnQgY2FyZWVycyBmcm9tICcuL2NhcmVlcnMuanMnO1xyXG5pbXBvcnQgdmlkZW8gZnJvbSAnLi92aWRlby5qcyc7XHJcbmltcG9ydCBzZWFyY2ggZnJvbSAnLi9zZWFyY2guanMnO1xyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4vLyBFdmVudCBFbWl0dGVyIHRlc3QgbW9kdWxlc1xyXG4vLyBpbXBvcnQgZXZ0MSBmcm9tICcuL2V2ZW50LXRlc3QtMS5qcyc7XHJcbi8vIGltcG9ydCBldnQyIGZyb20gJy4vZXZlbnQtdGVzdC0yLmpzJztcclxuXHJcbmNvbnN0IGFwcCA9ICgoKSA9PiB7XHJcbiAgICBmdW5jdGlvbiBpbml0KCkge1xyXG5cclxuICAgICAgICAvLyBJbml0aWFsaXplIEZvdW5kYXRpb25cclxuICAgICAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGZvciBjb21wb25lbnRzXHJcbiAgICAgICAgaWYgKCQoJy5pZy1mb3JtJykubGVuZ3RoKSBmb3Jtcy5pbml0KCk7XHJcbiAgICAgICAgaWYgKCQoJy5pZy1jYXJvdXNlbCcpLmxlbmd0aCkgY2Fyb3VzZWwuaW5pdCgpO1xyXG4gICAgICAgIGlmICgkKCcuaWctc2VhcmNoJykubGVuZ3RoKSBzZWFyY2guaW5pdCgpO1xyXG4gICAgICAgIGlmICgkKCcuaWctY2FyZWVycycpLmxlbmd0aCkgY2FyZWVycy5pbml0KCk7XHJcbiAgICAgICAgaWYgKCQoJy5pZy12aWRlby1ncm91cCcpLmxlbmd0aCkgdmlkZW8uaW5pdCgpO1xyXG5cclxuICAgICAgICAvLyBDb21wb25lbnRzIGNhbiBhbHNvIGJlIHNldHVwIHRvIHJlY2VpdmUgYW4gSFRNTCAnc2NvcGUnICguaWctZXZ0MS4uLiAuaWctZXZ0Mi4uLi4gZXRjKVxyXG4gICAgICAgIGlmICgkKCcuaWctZXZ0MScpLmxlbmd0aCkgZXZ0MS5pbml0KCcuaWctZXZ0MScpO1xyXG4gICAgICAgIGlmICgkKCcuaWctZXZ0MicpLmxlbmd0aCkgZXZ0Mi5pbml0KCcuaWctZXZ0MicpO1xyXG5cclxuICAgICAgICAvLyBBZGQgbGFuZ3VhZ2UgY2xhc3MgdG8gYm9keVxyXG4gICAgICAgIC8vX2xhbmd1YWdlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTGV0J3MgdXNlIGEgZ2xvYmFsIHZhcmlhYmxlIChnbG9iYWwgYXMgaW4gYXZhaWxhYmxlIHRvIGFsbCBvdXIgY29tcG9uZW50cyAtIG5vdCB0aGUgd2luZG93IG9iamVjdCEpXHJcbiAgICAvLyB0byBhZGQgYSBjbGFzcyB0byB0aGUgYm9keSB0YWdcclxuICAgIC8vIGZ1bmN0aW9uIF9sYW5ndWFnZSgpIHtcclxuICAgIC8vICAgICAkKCdib2R5JykuYWRkQ2xhc3MoaWcubGFuZyk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0XHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG4vLyBCb290c3RyYXAgYXBwXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgIGFwcC5pbml0KCk7XHJcbn0pO1xyXG4iXSwibmFtZXMiOlsibGFuZyIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJpbmRleE9mIiwiZW1pdHRlciIsIkV2ZW50RW1pdHRlciIsImVuZHBvaW50VVJMIiwic3VjY2Vzc1VSTCIsImNhbmNlbFVSTCIsIiRmb3JtIiwiJGZvcm1XcmFwcGVyIiwiaW5pdCIsIiQiLCJmaW5kIiwiZGF0YSIsIl92YWxpZGF0aW9uIiwiaklucHV0IiwiY2hhbmdlIiwib2JqRXZlbnQiLCJhZGRDbGFzcyIsInZhbGlkYXRvciIsInNldERlZmF1bHRzIiwiYWRkTWV0aG9kIiwicG9zdGFsIiwiZWxlbWVudCIsIm9wdGlvbmFsIiwibWF0Y2giLCJ2YWxpZGF0ZSIsImxhYmVsIiwiY2xvc2VzdCIsImxlbmd0aCIsInBhcmVudCIsImFwcGVuZCIsIm9uIiwicmVwbGFjZSIsIl9wcm9jZXNzIiwiZm9ybSIsImZvcm1EYXRhUmF3IiwiZm9ybURhdGFQYXJzZWQiLCJ2YWxpZCIsInJlbW92ZUNsYXNzIiwic2VyaWFsaXplQXJyYXkiLCJfcGFyc2UiLCJfc3VibWl0IiwiYWpheCIsInN1Y2Nlc3MiLCJtc2ciLCJlcnJvciIsInRvIiwiX3RvZ2dsZXIiLCJoaWRlIiwic2hvdyIsImxvZyIsInRvZ2dsZUNsYXNzIiwiX2J1aWxkQ2Fyb3VzZWwiLCJwcmV2QXJyb3ciLCJuZXh0QXJyb3ciLCIkY2Fyb3VzZWwiLCJlYWNoIiwiaW5kZXgiLCJzbGljayIsIl9jYXJlZXJzTGVnYWN5Q29kZSIsImZuIiwiaW5mb1RvZ2dsZSIsIiRyZXZlYWwiLCIkcmV2ZWFsQ29udGVudCIsIiRyZXZlYWxUcmlnZ2VyIiwiZml4ZWRIZWlnaHQiLCJzZXRBcmlhIiwiYXR0ciIsImluaXRUb2dnbGUiLCJoYW5kbGVSZXZlYWxUb2dnbGUiLCJyZXNpemVIYW5kbGVyIiwic2V0VGltZW91dCIsInNldFJldmVhbENvbnRlbnRIZWlnaHQiLCJjc3MiLCJoZWlnaHQiLCJmaW5hbEhlaWdodCIsImhhc0NsYXNzIiwic2Nyb2xsSGVpZ2h0IiwialF1ZXJ5IiwiY2lyY2xlQW5pbWF0aW9uIiwibWF4VmFsdWUiLCJjYW52YXMiLCIkY2FudmFzIiwiY29udGV4dCIsImQiLCJ3aWR0aCIsInBlcmNlbnRTdHJva2UiLCJyZW1haW5pbmdTdHJva2UiLCJyYWRpdXMiLCJjdXJQZXJjIiwiY2lyYyIsIk1hdGgiLCJQSSIsInF1YXJ0IiwiZGVsZWdhdGVJRCIsIkRhdGUiLCJnZXRUaW1lIiwiaXMiLCJnZXRDb250ZXh0Iiwic3Ryb2tlU3R5bGUiLCJmaWxsU3R5bGUiLCJkZWxlZ2F0ZSIsImNsZWFyIiwiYW5pbWF0ZSIsImN1cnJlbnQiLCJsaW5lV2lkdGgiLCJiZWdpblBhdGgiLCJhcmMiLCJtaW4iLCJzdHJva2UiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJmaWxsUmVjdCIsImJsb2NrTGluayIsIiRibG9ja0xpbmsiLCJkZXN0aW5hdGlvbiIsImluaXRCbG9jayIsImhhbmRsZUNsaWNrIiwiZ3VpIiwidmlkZW8iLCJvdmVybGF5IiwiaW5pdExlZ2FjeSIsIk92ZXJsYXlNb2R1bGUiLCJHdWlNb2R1bGUiLCJlIiwidGFyZ2V0IiwiZ2V0QXR0cmlidXRlIiwicHJldmVudERlZmF1bHQiLCJzdG9wIiwib2Zmc2V0IiwidG9wIiwic2VsZWN0b3IiLCJyZXNpemUiLCJvdmVybGF5UmVmZXJlbmNlIiwibXVsdGlUYWJUb2dnbGVTZWxlY3RvciIsIm11bHRpVGFiQ29udGVudFNlbGVjdG9yIiwibXVsdGlUYWJTZWxlY3RvciIsIiRlZGdlT3ZlcmxheUxvY2F0aW9uIiwiJG92ZXJsYXlTbGlkZXIiLCIkcHJvZmlsZVNsaWRlciIsIiRwcm9maWxlU2xpZGVyVmlkZW9TZWN0aW9uSG9sZGVyIiwid2luZG93U2l6aW5nRGVsYXkiLCJ3aW5kb3dTY3JvbGxpbmdEZWxheSIsIm92ZXJsYXlPcGVuIiwiaXNSZXNwb25zaXZlU3RhdGUiLCJzY3JvbGxlZFRvVmlldyIsImluaXRHdWkiLCJldmVudCIsImJhY2tncm91bmRDb2xvciIsIiR0aGlzIiwicGFyc2VJbnQiLCJodG1sIiwiaGFuZGxlT3ZlcmxheUZyb21IYXNoIiwiZGVsYXllZEhhbmRsZVdpbmRvd1NpemluZyIsImRlbGF5ZWRIYW5kbGVXaW5kb3dTY3JvbGwiLCJ0cmlnZ2VyIiwic3RvcFByb3BhZ2F0aW9uIiwiYWRkTXVsdGlUYWJUb2dnbGVIYW5kbGVycyIsInRvZ2dsZUJhc2UiLCIkY29udGFpbmVyIiwicGFyZW50cyIsImFuaW1hdGVQcm9maWxlU2xpZGVyIiwiJHByb2ZpbGVQYW5lbHMiLCJwcm9maWxlUGFuZWxIZWlnaHQiLCJvdXRlckhlaWdodCIsImNoYW5nZVNsaWRlclN0YXRlIiwic2xpZGVyIiwic3RhdGUiLCJjbGVhclRpbWVvdXQiLCJoYW5kbGVXaW5kb3dTaXppbmciLCJoYW5kbGVXaW5kb3dTY3JvbGxpbmciLCJmdWxsSGFzaEZyYWdtZW50IiwiaGFzaCIsIm9wZW5PdmVybGF5IiwiaGFuZGxlT3ZlcmxheU9wZW4iLCJoYW5kbGVPdmVybGF5Q2xvc2UiLCJpbml0aWFsSW5kZXgiLCJoYW5kbGVTbGlkZUNoYW5nZSIsInlQb3MiLCJvdmVybGF5Q29udGVudCIsIm9mZiIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJkb2N1bWVudCIsInRpdGxlIiwic2VhcmNoIiwic2Nyb2xsVG9wIiwiY3VycmVudFNsaWRlIiwibmV4dFNsaWRlIiwibmV4dFRpdGxlIiwiZ2V0IiwibmV3SGFzaCIsIndpbmRvd1dpZHRoIiwicmVzcG9uc2l2ZUxpbWl0IiwibmV3SXNSZXNwb25zaXZlU3RhdGUiLCJpbml0UHJvZmlsZVNsaWRlciIsImluaXRTbGlkZXIiLCJvcHRpb25zIiwiZGVmYXVsdHMiLCJleHRlbmQiLCIkb3ZlcmxheSIsIiRib2R5Iiwib3ZlcmxheVNpemluZ0RlbGF5IiwiY3VycmVudEluc3RhbmNlIiwiaXNPcGVuRmxhZyIsIiRjbG9zZUJ1dHRvbiIsImlzT3BlbiIsImluaXRPdmVybGF5IiwiZGVsYXllZEhhbmRsZU92ZXJsYXlTaXppbmciLCJGb3VuZGF0aW9uIiwiUmV2ZWFsIiwib3ZlcmxheVNpemluZyIsImNsb3NlIiwiZm91bmRhdGlvbiIsIm9wZW4iLCJpbml0Q2xvc2VCdXR0b24iLCIkaW5uZXJTcGFuIiwidXJsT3JNYXJrdXAiLCJvcGVuQ2FsbGJhY2siLCJjbG9zZUNhbGxiYWNrIiwiZnVsbFNjcmVlbiIsImZ1bGwiLCJvcGVuT3ZlcmxheVdpdGhBamF4IiwidXJsIiwiZG9uZSIsIm9wZW5PdmVybGF5V2l0aE1hcmt1cCIsIm1hcmt1cCIsIm92ZXJsYXlTaXplQ2xlYW51cCIsIm92ZXJsYXlIZWlnaHQiLCJ3aW5kb3dIZWlnaHQiLCJ2aWRzIiwiYnJpZ2h0Q292ZSIsIl9wYXJzZVZpZGVvcyIsIiRncm91cCIsIiR2aWRlbyIsInByZWxvYWRPcHRpb25zIiwiYWNjb3VudCIsInBsYXllciIsImlkIiwiZGVzY3JpcHRpb24iLCJhdXRvIiwiY3RybCIsInByZWxvYWQiLCJwdXNoIiwiX2luamVjdEJyaWdodENvdmVKUyIsImluZGV4anMiLCJfaW5qZWN0VGVtcGxhdGUiLCJyZXBsYWNlV2l0aCIsIl9zZWFyY2hMZWdhY3lDb2RlIiwibW9kZWxVcmwiLCIkZmllbGQiLCJocmVmIiwic3VnZ2VzdGlvbnMiLCJjaXRpZXMiLCJsb2NhdGlvbnMiLCJCbG9vZGhvdW5kIiwidG9rZW5pemVycyIsIndoaXRlc3BhY2UiLCJnZXRTZWFyY2hSZXN1bHRzIiwicGFyYW1zIiwic2VhcmNodHlwZSIsIm5hbWUiLCJnZXRKU09OIiwiYWx3YXlzIiwicmVzdWx0IiwiSlNPTiIsInBhcnNlIiwiZmFpbCIsInN0YXR1cyIsInN0YXR1c1RleHQiLCJwYXJzZVNlYXJjaFN0cmluZyIsInZhbCIsImNpdHkiLCJ3b3JkcyIsInNwbGl0IiwiaSIsInNwbGljZSIsImpvaW4iLCJkaXNwbGF5U2VhcmNoUmVzdWx0cyIsInRlbXBsYXRlSUQiLCJqc29uIiwidGVtcGxhdGUiLCJnZXRFbGVtZW50QnlJZCIsImlubmVySFRNTCIsInJlbmRlcmVkIiwiTXVzdGFjaGUiLCJyZW5kZXIiLCJ0eXBlYWhlYWQiLCJzb3VyY2UiLCJsaW1pdCIsInN1Ym1pdCIsImFwcCIsImZvcm1zIiwiY2Fyb3VzZWwiLCJjYXJlZXJzIiwiZXZ0MSIsImV2dDIiLCJyZWFkeSJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7Ozs7OztBQVNBLEFBQU87OztBQUtQLEFBQU8sSUFBSUEsT0FBUSxZQUFNO01BQ25CQyxPQUFPQyxRQUFQLENBQWdCQyxRQUFoQixDQUF5QkMsT0FBekIsQ0FBaUMsTUFBakMsTUFBNkMsQ0FBQyxDQUFsRCxFQUFxRDtXQUM1QyxJQUFQO0dBREYsTUFFTztXQUNFLElBQVA7O0NBSmMsRUFBWDs7O0FBU1AsQUFBTzs7O0FBS1AsQUFBTyxJQUFJQyxVQUFVLElBQUlDLFlBQUosRUFBZDs7QUMxQlAsWUFBZSxDQUFDLFlBQU07O01BRWhCQyxXQUFKLEVBQ0VDLFVBREYsRUFFRUMsU0FGRixFQUdFQyxLQUhGLEVBSUVDLFlBSkY7O1dBTVNDLElBQVQsR0FBZ0I7O21CQUVDQyxFQUFFLFVBQUYsQ0FBZjtZQUNRRixhQUFhRyxJQUFiLENBQWtCLE1BQWxCLENBQVI7a0JBQ2NILGFBQWFHLElBQWIsQ0FBa0IsTUFBbEIsRUFBMEJDLElBQTFCLENBQStCLFVBQS9CLENBQWQ7Z0JBQ1lKLGFBQWFHLElBQWIsQ0FBa0IsTUFBbEIsRUFBMEJDLElBQTFCLENBQStCLFFBQS9CLENBQVo7Ozs7OztXQU1PQyxXQUFULEdBQXVC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