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
            prevArrow: '<span type="button" class="carousel-prev"><img src="/content/dam/investorsgroup/app/careers/images/Arrow-MainArticle-Carousel-Black-L.png"></span>',
            nextArrow: '<span type="button" class="carousel-next"><img src="/content/dam/investorsgroup/app/careers/images/Arrow-MainArticle-Carousel-Black-R.png"></span>'
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
    // if ($('.ig-evt1').length) evt1.init('.ig-evt1');
    // if ($('.ig-evt2').length) evt2.init('.ig-evt2');

    // Add language class to body
    // _language();
  }

  // Let's use a global variable (global as in available to all our components - not the window object!)
  // to add a class to the body tag
  // function _language() {
  //   $('body').addClass(ig.lang);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvY2FyZWVycy5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL3NlYXJjaC5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgZmlsZSBpcyBmb3IgbWV0aG9kcyBhbmQgdmFyaWFibGVzIHRoYXQgYXJlIGdvaW5nIHRvIGJlXHJcbnVzZWZ1bCBhY3Jvc3MgYWxsIG1vZHVsZXMuIEluIG9yZGVyIHRvIHVzZSB0aGVtIGFueXdoZXJlLCBpbXBvcnQgd2l0aDpcclxuXHJcbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4gYW5kIHRoZW4gY2FsbCB3aXRoIHRoZSBpZyBuYW1lc3BhY2UgKGkuZS4sIGlnLnBhdGhuYW1lLCBpZy5sYW5nLCBldGMpXHJcbiAqL1xyXG5cclxuLy8gdXJsIHBhdGhcclxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XHJcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxufSkoKVxyXG5cclxuLy8gbGFuZ3VhZ2VcclxuZXhwb3J0IHZhciBsYW5nID0gKCgpID0+IHtcclxuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgIHJldHVybiAnZnInO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gJ2VuJztcclxuICB9XHJcbn0pKClcclxuXHJcbi8vIGJyb3dzZXIgd2lkdGhcclxuZXhwb3J0IHZhciBicm93c2VyV2lkdGggPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcclxufSkoKVxyXG5cclxuLy8gYmFzZSBldmVudEVtaXR0ZXJcclxuZXhwb3J0IHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICB2YXIgZW5kcG9pbnRVUkwsXHJcbiAgICBzdWNjZXNzVVJMLFxyXG4gICAgY2FuY2VsVVJMLFxyXG4gICAgJGZvcm0sXHJcbiAgICAkZm9ybVdyYXBwZXI7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xyXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcclxuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xyXG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcclxuXHJcbiAgICBfdmFsaWRhdGlvbigpO1xyXG4gICAgX3RvZ2dsZXIoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcclxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XHJcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZSxcclxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XHJcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcclxuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xyXG5cclxuICAgICRmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDYXJvdXNlbCBJbml0aWFsaXplZCEnKVxyXG5cclxuICAgIC8vIE5vdCBzdXJlIHdoYXQgdGhpcyBkb2VzIGF0IHRoaXMgcG9pbnQgb3IgaG93IGl0IHJlbGF0ZXMgdG8gQ2Fyb3VzZWxzXHJcbiAgICAkKCdbZGF0YS1yZXNwb25zaXZlLXRvZ2dsZV0gYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ3NpdGUtaGVhZGVyLWlzLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgX2J1aWxkQ2Fyb3VzZWwoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9idWlsZENhcm91c2VsKCkge1xyXG4gICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgbmV4dEFycm93LFxyXG4gICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgJCgnLmlnLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXHJcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxyXG4gICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgX2NhcmVlcnNMZWdhY3lDb2RlKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfY2FyZWVyc0xlZ2FjeUNvZGUoKSB7XHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuXHJcbiAgICAgICQuZm4uaW5mb1RvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyICRyZXZlYWwgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAkcmV2ZWFsQ29udGVudCA9ICRyZXZlYWwuZmluZCgnLmluZm8tdG9nZ2xlLWNvbnRlbnQnKSxcclxuICAgICAgICAgICAgJHJldmVhbFRyaWdnZXIgPSAkcmV2ZWFsLmZpbmQoJy5pbmZvLXRvZ2dsZS10cmlnZ2VyJyksXHJcbiAgICAgICAgICAgIGZpeGVkSGVpZ2h0ID0gZmFsc2UsXHJcbiAgICAgICAgICAgIHNldEFyaWEgPSAkcmV2ZWFsLmF0dHIoJ2luZm8tdG9nZ2xlLWFyaWEnKSA9PT0gJ3RydWUnO1xyXG5cclxuICAgICAgICAgIGluaXRUb2dnbGUoKTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBpbml0VG9nZ2xlKCkge1xyXG4gICAgICAgICAgICAkcmV2ZWFsVHJpZ2dlci5vbignY2xpY2snLCBoYW5kbGVSZXZlYWxUb2dnbGUpO1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXIpO1xyXG5cclxuICAgICAgICAgICAgc2V0UmV2ZWFsQ29udGVudEhlaWdodCgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVSZXZlYWxUb2dnbGUoKSB7XHJcbiAgICAgICAgICAgIHNldFJldmVhbENvbnRlbnRIZWlnaHQoKTtcclxuICAgICAgICAgICAgJHJldmVhbC50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHNldFJldmVhbENvbnRlbnRIZWlnaHQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIHJlc2l6ZUhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIGlmIChmaXhlZEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmNzcyh7IGhlaWdodDogJ2F1dG8nIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gc2V0UmV2ZWFsQ29udGVudEhlaWdodCgpIHtcclxuICAgICAgICAgICAgdmFyIGZpbmFsSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgaWYgKCRyZXZlYWwuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgZmluYWxIZWlnaHQgPSAkcmV2ZWFsQ29udGVudFswXS5zY3JvbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgZml4ZWRIZWlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGZpbmFsSGVpZ2h0ID0gMDtcclxuICAgICAgICAgICAgICBmaXhlZEhlaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmNzcyh7IGhlaWdodDogZmluYWxIZWlnaHQgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2V0QXJpYSkge1xyXG4gICAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgIWZpeGVkSGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfTtcclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuXHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuICAgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICAgJC5mbi5jaXJjbGVBbmltYXRpb24gPSBmdW5jdGlvbiAobWF4VmFsdWUpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyIGNhbnZhcyA9IHRoaXMsXHJcbiAgICAgICAgICAgICRjYW52YXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBjb250ZXh0LFxyXG4gICAgICAgICAgICBkID0gY2FudmFzLndpZHRoIC8gMixcclxuICAgICAgICAgICAgcGVyY2VudFN0cm9rZSA9IDcsXHJcbiAgICAgICAgICAgIHJlbWFpbmluZ1N0cm9rZSA9IDEsXHJcbiAgICAgICAgICAgIHJhZGl1cyA9IGQgLSBwZXJjZW50U3Ryb2tlLFxyXG4gICAgICAgICAgICBjdXJQZXJjID0gMCxcclxuICAgICAgICAgICAgY2lyYyA9IE1hdGguUEkgKiAyLFxyXG4gICAgICAgICAgICBxdWFydCA9IE1hdGguUEkgLyAyLFxyXG4gICAgICAgICAgICBkZWxlZ2F0ZUlEID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgKyAnQ0EnO1xyXG5cclxuICAgICAgICAgIGlmICghJGNhbnZhcy5pcygnY2FudmFzJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzBkMjYzYyc7XHJcbiAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjZTVlOGU4JztcclxuXHJcbiAgICAgICAgICAkY2FudmFzLmF0dHIoJ2NpcmNsZS1hbmltYXRpb24taWQnLCBkZWxlZ2F0ZUlEKTtcclxuICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZSgnW2NpcmNsZS1hbmltYXRpb24taWQ9JyArIGRlbGVnYXRlSUQgKyAnXScsICdzdGFydEFuaW1hdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGN1clBlcmMgPSAwO1xyXG4gICAgICAgICAgICBhbmltYXRlKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZSgnW2NpcmNsZS1hbmltYXRpb24taWQ9JyArIGRlbGVnYXRlSUQgKyAnXScsICdjbGVhckFuaW1hdGUnLCBjbGVhcik7XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZShjdXJyZW50KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50ID8gY3VycmVudCA6IDA7XHJcbiAgICAgICAgICAgIGNsZWFyKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gcGVyY2VudFN0cm9rZTtcclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1NYXRoLm1pbihjdXJyZW50LCBtYXhWYWx1ZSAvIDEwMCkpIC0gcXVhcnQsIHRydWUpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHJlbWFpbmluZ1N0cm9rZTtcclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1jdXJyZW50KSAtIHF1YXJ0LCB0cnVlKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICAgICAgY3VyUGVyYysrO1xyXG4gICAgICAgICAgICBpZiAoY3VyUGVyYyA8IDExMCkge1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZShjdXJQZXJjIC8gMTAwKVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gY2xlYXIoKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMud2lkdGgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfTtcclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAkLmZuLmJsb2NrTGluayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyICRibG9ja0xpbmsgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBkZXN0aW5hdGlvbiA9ICRibG9ja0xpbmsuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgICAgIC8vIGRlc3RpbmF0aW9uID0gJzQ0NDIuYXNweC8nICsgZGVzdGluYXRpb247XHJcbiAgICAgICAgICBpbml0QmxvY2soKTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBpbml0QmxvY2soKSB7XHJcbiAgICAgICAgICAgICRibG9ja0xpbmsub24oJ2NsaWNrJywgaGFuZGxlQ2xpY2spO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVDbGljaygpIHtcclxuICAgICAgICAgICAgLy9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgbG9jYXRpb24gPSBkZXN0aW5hdGlvbjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH07XHJcblxyXG4gICAgfSkoalF1ZXJ5KTtcclxuXHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuICAgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICAgdmFyIGd1aSxcclxuICAgICAgICB2aWRlbyxcclxuICAgICAgICBvdmVybGF5O1xyXG5cclxuICAgICAgaW5pdExlZ2FjeSgpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gaW5pdExlZ2FjeSgpIHtcclxuICAgICAgICAvLyBUaGlzIGlzIHdlaXJkIC0gbm90IGdvaW5nIHRvIHRvdWNoIGl0XHJcbiAgICAgICAgb3ZlcmxheSA9IG5ldyBPdmVybGF5TW9kdWxlKCk7XHJcbiAgICAgICAgZ3VpID0gbmV3IEd1aU1vZHVsZShvdmVybGF5KTtcclxuICAgICAgICAvLyB2aWRlbyA9IG5ldyBWaWRlb01vZHVsZSgpOyAvLyBSZXBsYWNlIHdpdGggdmlkZW8uanMgbW9kdWxlXHJcblxyXG4gICAgICAgIC8vIE5lZWQgdG8gaGF2ZSBhIGNsYXNzIHRvIGhvb2sgb250byBmb3IgRnJlbmNoIGxhbmd1YWdlIHBhZ2VcclxuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnZnInKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNtb290aCBzY3JvbGxpbmcgZm9yIGFuY2hvciBsaW5rc1xyXG4gICAgICAgICQoJ2FbaHJlZl49XCIjXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xyXG4gICAgICAgICAgaWYgKHRhcmdldC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgIHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcCArIDUyXHJcbiAgICAgICAgICAgIH0sIDc1MCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRhcmdldC5zZWxlY3RvciAhPT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgJCgnI21haW4tbWVudS1hbmNob3InKS5jc3MoeyAnZGlzcGxheSc6ICdub25lJyB9KTtcclxuICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdpcy1yZXZlYWwtb3BlbiBicmFuZGVkJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIE1vYmlsZSBtZW51IG5lZWRzIHRvIG1pbWljIEZvdW5kYXRpb24gcmV2ZWFsIC0gbm90IGVub3VnaCB0aW1lIHRvIGltcGxlbWVudCBkaWZmZXJlbnQgbmF2cyBpbiBhIHJldmVhbCBtb2RhbCBwcm9wZXJseVxyXG4gICAgICAgICQoJy5tZW51LWljb24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdpcy1yZXZlYWwtb3BlbiBicmFuZGVkJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHF1aWNrIGFuZCBkaXJ0eSBtb2JpbGUgbWVudSBjbG9zZXMgLSBub3QgZmFtaWxpYXIgd2l0aCBGb3VuZGF0aW9uIHBhdHRlcm4gdG8gZmlyZSB0aGVzZVxyXG4gICAgICAgICQoJy50b3AtYmFyIC5jbG9zZS1idXR0b24uc2hvdy1mb3Itc21hbGwtb25seScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQoJyNtYWluLW1lbnUtYW5jaG9yJykuY3NzKHsgJ2Rpc3BsYXknOiAnbm9uZScgfSk7XHJcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2lzLXJldmVhbC1vcGVuIGJyYW5kZWQnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA2NDApIHtcclxuICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdicmFuZGVkJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIEd1aU1vZHVsZShvdmVybGF5UmVmZXJlbmNlKSB7XHJcbiAgICAgICAgdmFyIG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IgPSAnW2NsYXNzKj1cInRvZ2dsZS1cIl06bm90KFtjbGFzcyo9XCJpbmZvLXRvZ2dsZVwiXSknLFxyXG4gICAgICAgICAgbXVsdGlUYWJDb250ZW50U2VsZWN0b3IgPSAnW2NsYXNzKj1cImNvbnRlbnQtXCJdJyxcclxuICAgICAgICAgIG11bHRpVGFiU2VsZWN0b3IgPSAnLm11bHRpLXRhYi1vdXRsaW5lJyxcclxuICAgICAgICAgICRlZGdlT3ZlcmxheUxvY2F0aW9uID0gJCgnI2VkZ2Utb3ZlcmxheS1jb250ZW50JyksXHJcbiAgICAgICAgICBvdmVybGF5ID0gb3ZlcmxheVJlZmVyZW5jZSxcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLFxyXG4gICAgICAgICAgJHByb2ZpbGVTbGlkZXIsXHJcbiAgICAgICAgICAkcHJvZmlsZVNsaWRlclZpZGVvU2VjdGlvbkhvbGRlciA9ICQoJzxkaXY+PC9kaXY+JyksXHJcbiAgICAgICAgICB3aW5kb3dTaXppbmdEZWxheSxcclxuICAgICAgICAgIHdpbmRvd1Njcm9sbGluZ0RlbGF5LFxyXG4gICAgICAgICAgb3ZlcmxheU9wZW4sXHJcbiAgICAgICAgICBpc1Jlc3BvbnNpdmVTdGF0ZSA9IGZhbHNlLFxyXG4gICAgICAgICAgc2Nyb2xsZWRUb1ZpZXcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaW5pdEd1aSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0R3VpKCkge1xyXG4gICAgICAgICAgYWRkTXVsdGlUYWJUb2dnbGVIYW5kbGVycygpO1xyXG4gICAgICAgICAgJCgnLmJsb2NrLWxpbmsnKS5ibG9ja0xpbmsoKTtcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyID0gJCgnLm91ci1idXNpbmVzcy1zbGlkZXInKTtcclxuICAgICAgICAgICQoJyNlZGdlLW92ZXJsYXktY29udGVudCcpLmZpbmQoJy5jYXJvdXNlbC1uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCdzbGlja05leHQnKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGlmICgkKFwiLnZpZGVvLXNsaWRlLnNsaWNrLWFjdGl2ZVwiKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJCgnLnNsaWNrLWxpc3QuZHJhZ2dhYmxlJykuY3NzKHsgaGVpZ2h0OiAnNjYwcHgnIH0pO1xyXG4gICAgICAgICAgICAkKCcuc2VjdGlvbi5wcm9maWxlcy1zbGlkZXInKS5jc3MoeyBiYWNrZ3JvdW5kQ29sb3I6ICcjZTVlOGU4JyB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy5zbGljay1saXN0LmRyYWdnYWJsZScpLmNzcyh7IGhlaWdodDogJ2F1dG8nIH0pO1xyXG4gICAgICAgICAgICAkKCcuc2VjdGlvbi5wcm9maWxlcy1zbGlkZXInKS5jc3MoeyBiYWNrZ3JvdW5kQ29sb3I6ICcjN2VjNGI5JyB9KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAkKCcucHJvZmlsZS1jb3VudGVyJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAkdGhpcy5maW5kKCdjYW52YXMnKS5jaXJjbGVBbmltYXRpb24ocGFyc2VJbnQoJHRoaXMuZmluZCgncCcpLmh0bWwoKSkpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICAkcHJvZmlsZVNsaWRlciA9ICQoJy5wcm9maWxlcy1zbGlkZXInKTtcclxuICAgICAgICAgICQod2luZG93KS5vbignaGFzaGNoYW5nZScsIGhhbmRsZU92ZXJsYXlGcm9tSGFzaCk7XHJcbiAgICAgICAgICBoYW5kbGVPdmVybGF5RnJvbUhhc2goKTtcclxuICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZGVsYXllZEhhbmRsZVdpbmRvd1NpemluZyk7XHJcbiAgICAgICAgICBoYW5kbGVXaW5kb3dTaXppbmcodHJ1ZSk7XHJcbiAgICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGRlbGF5ZWRIYW5kbGVXaW5kb3dTY3JvbGwpO1xyXG4gICAgICAgICAgaGFuZGxlV2luZG93U2Nyb2xsaW5nKCk7XHJcblxyXG4gICAgICAgICAgJCgnLmluZm8tdG9nZ2xlJykuaW5mb1RvZ2dsZSgpO1xyXG4gICAgICAgICAgJCgnLnRvcC1iYXIgKyAuc2NyZWVuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCdhW2RhdGEtdG9nZ2xlXScpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAvLyBOb3QgcHJldHR5IC0ganVzdCBhZGRpbmcgcXVpY2sgYW5kIGRpcnR5IHNoYXJlIGxpbmsgYWN0aW9uXHJcbiAgICAgICAgICAkKCcuc2hhcmUtdG9nZ2xlLXRyaWdnZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJy5pbmZvLXRvZ2dsZScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICQoJy5zaGFyZS10b2dnbGUtY2xvc2UnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJy5pbmZvLXRvZ2dsZScpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRNdWx0aVRhYlRvZ2dsZUhhbmRsZXJzKCkge1xyXG4gICAgICAgICAgJCgnYm9keScpLmRlbGVnYXRlKG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICB0b2dnbGVCYXNlID0gJHRoaXMuYXR0cignY2xhc3MnKS5tYXRjaCgvdG9nZ2xlLShcXFMqKT8oJHxcXHMpLylbMV0sXHJcbiAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICR0aGlzLnBhcmVudHMobXVsdGlUYWJTZWxlY3Rvcik7XHJcblxyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQobXVsdGlUYWJUb2dnbGVTZWxlY3RvcikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQobXVsdGlUYWJDb250ZW50U2VsZWN0b3IpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQoJy5jb250ZW50LScgKyB0b2dnbGVCYXNlKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZVByb2ZpbGVTbGlkZXIoKSB7XHJcbiAgICAgICAgICB2YXIgJHByb2ZpbGVQYW5lbHMsXHJcbiAgICAgICAgICAgIHByb2ZpbGVQYW5lbEhlaWdodCA9IDA7XHJcblxyXG4gICAgICAgICAgaWYgKHNjcm9sbGVkVG9WaWV3KSB7XHJcbiAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLmZpbmQoJy5zbGljay1zbGlkZScpLnJlbW92ZUNsYXNzKCdzbGljay1jb21wbGV0ZScpO1xyXG4gICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5maW5kKCcuc2xpY2stYWN0aXZlJykuYWRkQ2xhc3MoJ3NsaWNrLWNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgICRwcm9maWxlU2xpZGVyXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5zbGljay1zbGlkZTpub3QoLnNsaWNrLWNvbXBsZXRlKScpXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5wcm9maWxlLWNvdW50ZXIgY2FudmFzJylcclxuICAgICAgICAgICAgICAudHJpZ2dlcignY2xlYXJBbmltYXRlJyk7XHJcbiAgICAgICAgICAgICRwcm9maWxlU2xpZGVyXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5zbGljay1jb21wbGV0ZScpXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5wcm9maWxlLWNvdW50ZXIgY2FudmFzJylcclxuICAgICAgICAgICAgICAudHJpZ2dlcignc3RhcnRBbmltYXRlJyk7XHJcbiAgICAgICAgICAgIGlmICgkcHJvZmlsZVNsaWRlci5maW5kKCcuc2xpY2stYWN0aXZlJykuaXMoJ1tjbGFzcyo9cHJvZmlsZS1dJykgfHwgaXNSZXNwb25zaXZlU3RhdGUpIHtcclxuICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5hZGRDbGFzcygnY29udHJhc3QtYXJyb3cnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5yZW1vdmVDbGFzcygnY29udHJhc3QtYXJyb3cnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkcHJvZmlsZVBhbmVscyA9ICRwcm9maWxlU2xpZGVyLmZpbmQoJy5wcm9maWxlLTEtc2xpZGUsIC5wcm9maWxlLTItc2xpZGUnKTtcclxuICAgICAgICAgICAgJHByb2ZpbGVQYW5lbHMuY3NzKHsgaGVpZ2h0OiAnYXV0bycgfSk7XHJcbiAgICAgICAgICAgICRwcm9maWxlUGFuZWxzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gJCh0aGlzKS5vdXRlckhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgICBpZiAoY3VycmVudCA+IHByb2ZpbGVQYW5lbEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgcHJvZmlsZVBhbmVsSGVpZ2h0ID0gY3VycmVudDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkcHJvZmlsZVBhbmVscy5jc3MoeyBoZWlnaHQ6IHByb2ZpbGVQYW5lbEhlaWdodCB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZVNsaWRlclN0YXRlKHNsaWRlciwgc3RhdGUpIHtcclxuICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwiYWNjZXNzaWJpbGl0eVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcImRyYWdnYWJsZVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcInN3aXBlXCIsIHN0YXRlKTtcclxuICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwidG91Y2hNb3ZlXCIsIHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWRIYW5kbGVXaW5kb3dTaXppbmcoKSB7XHJcbiAgICAgICAgICBpZiAod2luZG93U2l6aW5nRGVsYXkpIHtcclxuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh3aW5kb3dTaXppbmdEZWxheSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgd2luZG93U2l6aW5nRGVsYXkgPSB3aW5kb3cuc2V0VGltZW91dChoYW5kbGVXaW5kb3dTaXppbmcsIDI1MCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZWxheWVkSGFuZGxlV2luZG93U2Nyb2xsKCkge1xyXG4gICAgICAgICAgaWYgKHdpbmRvd1Njcm9sbGluZ0RlbGF5KSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQod2luZG93U2Nyb2xsaW5nRGVsYXkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHdpbmRvd1Njcm9sbGluZ0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQoaGFuZGxlV2luZG93U2Nyb2xsaW5nLCAyNTApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUZyb21IYXNoKGV2ZW50KSB7XHJcbiAgICAgICAgICB2YXIgZnVsbEhhc2hGcmFnbWVudCA9ICcjb3VyLWVkZ2UtJztcclxuICAgICAgICAgIC8vZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBpZiAoIW92ZXJsYXlPcGVuICYmIGxvY2F0aW9uLmhhc2guaW5kZXhPZihmdWxsSGFzaEZyYWdtZW50KSA9PT0gMCkge1xyXG4gICAgICAgICAgICBvdmVybGF5Lm9wZW5PdmVybGF5KFxyXG4gICAgICAgICAgICAgICRlZGdlT3ZlcmxheUxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgIGhhbmRsZU92ZXJsYXlPcGVuLCBoYW5kbGVPdmVybGF5Q2xvc2UsIHRydWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheU9wZW4oZXZlbnQpIHtcclxuICAgICAgICAgIHZhciBpbml0aWFsSW5kZXg7XHJcblxyXG4gICAgICAgICAgaW5pdFNsaWRlcigkb3ZlcmxheVNsaWRlciwge1xyXG4gICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgaW5pdGlhbEluZGV4ID0gJG92ZXJsYXlTbGlkZXJcclxuICAgICAgICAgICAgLmZpbmQoJy4nICsgbG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjb3VyLScsICcnKSArICc6bm90KC5zbGljay1jbG9uZWQpJylcclxuICAgICAgICAgICAgLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnKTtcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCdzbGlja0dvVG8nLCBpbml0aWFsSW5kZXgsIHRydWUpO1xyXG4gICAgICAgICAgJG92ZXJsYXlTbGlkZXIub24oJ2FmdGVyQ2hhbmdlJywgaGFuZGxlU2xpZGVDaGFuZ2UpO1xyXG4gICAgICAgICAgaGFuZGxlU2xpZGVDaGFuZ2UobnVsbCwgbnVsbCwgcGFyc2VJbnQoJCgnI21vZGFsT3ZlcmxheSAuc2xpY2stYWN0aXZlJykuYXR0cignZGF0YS1zbGljay1pbmRleCcpKSk7XHJcbiAgICAgICAgICBoYW5kbGVXaW5kb3dTaXppbmcoKTtcclxuICAgICAgICAgIG92ZXJsYXlPcGVuID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlDbG9zZShldmVudCkge1xyXG4gICAgICAgICAgdmFyIHlQb3MsXHJcbiAgICAgICAgICAgIG92ZXJsYXlDb250ZW50ID0gJCgnI21vZGFsT3ZlcmxheSA+IGRpdicpO1xyXG5cclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCd1bnNsaWNrJyk7XHJcbiAgICAgICAgICAkb3ZlcmxheVNsaWRlci5vZmYoJ2FmdGVyQ2hhbmdlJyk7XHJcbiAgICAgICAgICAkKCcub3ZlcmxheS1yZXBvc2l0b3J5JykuYXBwZW5kKG92ZXJsYXlDb250ZW50KTtcclxuICAgICAgICAgIGlmIChcInB1c2hTdGF0ZVwiIGluIGhpc3RvcnkpXHJcbiAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKFwiXCIsIGRvY3VtZW50LnRpdGxlLCBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCk7XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgeVBvcyA9ICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gXCJcIjtcclxuICAgICAgICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKHlQb3MpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3ZlcmxheU9wZW4gPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVNsaWRlQ2hhbmdlKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlKSB7XHJcbiAgICAgICAgICB2YXIgbmV4dFNsaWRlID0gKGN1cnJlbnRTbGlkZSArIDEpICUgKCQoJy5zbGljay1zbGlkZTpub3QoLnNsaWNrLWNsb25lZCknKS5sZW5ndGggLSAxKSxcclxuICAgICAgICAgICAgbmV4dFRpdGxlID0gJCgkb3ZlcmxheVNsaWRlci5maW5kKCdbZGF0YS1zbGljay1pbmRleD0nICsgbmV4dFNsaWRlICsgJ10gLmNvbHVtbnM6Zmlyc3QtY2hpbGQgcCcpLmdldCgwKSkuaHRtbCgpLFxyXG4gICAgICAgICAgICBuZXdIYXNoID0gJ291ci0nICsgJG92ZXJsYXlTbGlkZXJcclxuICAgICAgICAgICAgICAgIC5maW5kKCdbZGF0YS1zbGljay1pbmRleD0nICsgY3VycmVudFNsaWRlICsgJ10nKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJylcclxuICAgICAgICAgICAgICAgIC5tYXRjaCgvKGVkZ2UtXFxTKikvKVsxXTtcclxuXHJcbiAgICAgICAgICAkKCcjbW9kYWxPdmVybGF5IC5jYXJvdXNlbC1uZXh0IGEnKS5odG1sKG5leHRUaXRsZSk7XHJcbiAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gbmV3SGFzaDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVdpbmRvd1NpemluZyhpbml0KSB7XHJcbiAgICAgICAgICB2YXIgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZUxpbWl0ID0gMCxcclxuICAgICAgICAgICAgbmV3SXNSZXNwb25zaXZlU3RhdGUgPSB3aW5kb3dXaWR0aCA8IHJlc3BvbnNpdmVMaW1pdDtcclxuXHJcbiAgICAgICAgICBpZiAoJG92ZXJsYXlTbGlkZXIuaXMoJy5zbGljay1pbml0aWFsaXplZCcpKSB7XHJcbiAgICAgICAgICAgIGNoYW5nZVNsaWRlclN0YXRlKCRvdmVybGF5U2xpZGVyLCAhbmV3SXNSZXNwb25zaXZlU3RhdGUpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChpc1Jlc3BvbnNpdmVTdGF0ZSAhPT0gbmV3SXNSZXNwb25zaXZlU3RhdGUpIHtcclxuICAgICAgICAgICAgaXNSZXNwb25zaXZlU3RhdGUgPSBuZXdJc1Jlc3BvbnNpdmVTdGF0ZTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoaW5pdCkge1xyXG4gICAgICAgICAgICBpbml0UHJvZmlsZVNsaWRlcigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlV2luZG93U2Nyb2xsaW5nKCkge1xyXG4gICAgICAgICAgaWYgKCFzY3JvbGxlZFRvVmlldykge1xyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpID4gJHByb2ZpbGVTbGlkZXIub2Zmc2V0KCkudG9wKSB7XHJcbiAgICAgICAgICAgICAgc2Nyb2xsZWRUb1ZpZXcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGFuaW1hdGVQcm9maWxlU2xpZGVyLCA1MDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0UHJvZmlsZVNsaWRlcigpIHtcclxuICAgICAgICAgIGluaXRTbGlkZXIoJHByb2ZpbGVTbGlkZXIsIHtcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6IHRydWUsXHJcbiAgICAgICAgICAgIHByZXZBcnJvdzogJzxzcGFuIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNhcm91c2VsLXByZXZcIj48aW1nIHNyYz1cIi9jb250ZW50L2RhbS9pbnZlc3RvcnNncm91cC9hcHAvY2FyZWVycy9pbWFnZXMvQXJyb3ctTWFpbkFydGljbGUtQ2Fyb3VzZWwtQmxhY2stTC5wbmdcIj48L3NwYW4+JyxcclxuICAgICAgICAgICAgbmV4dEFycm93OiAnPHNwYW4gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2Fyb3VzZWwtbmV4dFwiPjxpbWcgc3JjPVwiL2NvbnRlbnQvZGFtL2ludmVzdG9yc2dyb3VwL2FwcC9jYXJlZXJzL2ltYWdlcy9BcnJvdy1NYWluQXJ0aWNsZS1DYXJvdXNlbC1CbGFjay1SLnBuZ1wiPjwvc3Bhbj4nXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGFuaW1hdGVQcm9maWxlU2xpZGVyKCk7XHJcbiAgICAgICAgICAkcHJvZmlsZVNsaWRlci5vbignYWZ0ZXJDaGFuZ2UnLCBhbmltYXRlUHJvZmlsZVNsaWRlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0U2xpZGVyKHRhcmdldCwgb3B0aW9ucykge1xyXG4gICAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICBzcGVlZDogNzUwLFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXHJcbiAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAyLFxyXG4gICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2OCxcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHRhcmdldC5zbGljaygkLmV4dGVuZChkZWZhdWx0cywgb3B0aW9ucykpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gT3ZlcmxheU1vZHVsZSgpIHtcclxuICAgICAgICB2YXIgJG92ZXJsYXksXHJcbiAgICAgICAgICAkYm9keSA9ICQoJ2JvZHknKSxcclxuICAgICAgICAgIG92ZXJsYXlTaXppbmdEZWxheSxcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZSA9IHt9LFxyXG4gICAgICAgICAgaXNPcGVuRmxhZyA9IGZhbHNlLFxyXG4gICAgICAgICAgJGNsb3NlQnV0dG9uO1xyXG5cclxuICAgICAgICBpbml0T3ZlcmxheSgpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgb3Blbk92ZXJsYXk6IG9wZW5PdmVybGF5LFxyXG4gICAgICAgICAgaXNPcGVuOiBpc09wZW5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0T3ZlcmxheSgpIHtcclxuICAgICAgICAgICRvdmVybGF5ID0gJCgnPGRpdj48L2Rpdj4nKTtcclxuICAgICAgICAgICRvdmVybGF5LmF0dHIoJ2lkJywgJ21vZGFsT3ZlcmxheScpO1xyXG4gICAgICAgICAgJG92ZXJsYXkuYXR0cignY2xhc3MnLCAncmV2ZWFsJyk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5hdHRyKCdkYXRhLXJldmVhbCcsIHRydWUpO1xyXG4gICAgICAgICAgJGJvZHkuYXBwZW5kKCRvdmVybGF5KTtcclxuICAgICAgICAgICRvdmVybGF5Lm9uKCdvcGVuLnpmLnJldmVhbCcsIGhhbmRsZU92ZXJsYXlPcGVuKTtcclxuICAgICAgICAgICQod2luZG93KS5vbignY2xvc2VkLnpmLnJldmVhbCcsIGhhbmRsZU92ZXJsYXlDbG9zZSk7XHJcbiAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGRlbGF5ZWRIYW5kbGVPdmVybGF5U2l6aW5nKTtcclxuICAgICAgICAgIGluaXRDbG9zZUJ1dHRvbigpO1xyXG4gICAgICAgICAgbmV3IEZvdW5kYXRpb24uUmV2ZWFsKCRvdmVybGF5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZGVsYXllZEhhbmRsZU92ZXJsYXlTaXppbmcoKSB7XHJcbiAgICAgICAgICBpZiAob3ZlcmxheVNpemluZ0RlbGF5KSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQob3ZlcmxheVNpemluZ0RlbGF5KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBvdmVybGF5U2l6aW5nRGVsYXkgPSB3aW5kb3cuc2V0VGltZW91dChvdmVybGF5U2l6aW5nLCAyNTApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUNsb3NlKGV2ZW50KSB7XHJcbiAgICAgICAgICBpc09wZW5GbGFnID0gZmFsc2U7XHJcbiAgICAgICAgICBpZiAoY3VycmVudEluc3RhbmNlLmNsb3NlKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5jbG9zZShldmVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvdmVybGF5U2l6ZUNsZWFudXAoKTtcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZSA9IHt9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheU9wZW4oZXZlbnQpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBpc09wZW5GbGFnID0gdHJ1ZTtcclxuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICAgICRvdmVybGF5LmZpbmQoJyonKS5mb3VuZGF0aW9uKCk7XHJcbiAgICAgICAgICBpZiAoY3VycmVudEluc3RhbmNlLm9wZW4pIHtcclxuICAgICAgICAgICAgY3VycmVudEluc3RhbmNlLm9wZW4oZXZlbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3ZlcmxheVNpemluZygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdENsb3NlQnV0dG9uKCkge1xyXG4gICAgICAgICAgdmFyICRpbm5lclNwYW4gPSAkKCc8c3Bhbj48L3NwYW4+Jyk7XHJcblxyXG4gICAgICAgICAgJGNsb3NlQnV0dG9uID0gJCgnPGJ1dHRvbiBkYXRhLWNsb3NlPjwvYnV0dG9uPicpO1xyXG4gICAgICAgICAgJGNsb3NlQnV0dG9uLmFkZENsYXNzKCdjbG9zZS1idXR0b24nKTtcclxuICAgICAgICAgICRjbG9zZUJ1dHRvbi5hdHRyKCdhcmlhLWxhYmVsJywgJ0Nsb3NlIG1vZGFsJyk7XHJcbiAgICAgICAgICAkaW5uZXJTcGFuLmF0dHIoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XHJcbiAgICAgICAgICAkaW5uZXJTcGFuLmh0bWwoJyZ0aW1lczsnKTtcclxuICAgICAgICAgICRjbG9zZUJ1dHRvbi5hcHBlbmQoJGlubmVyU3Bhbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc09wZW4oKSB7XHJcbiAgICAgICAgICByZXR1cm4gaXNPcGVuRmxhZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5PdmVybGF5KHVybE9yTWFya3VwLCBvcGVuQ2FsbGJhY2ssIGNsb3NlQ2FsbGJhY2ssIGZ1bGxTY3JlZW4pIHtcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5vcGVuID0gb3BlbkNhbGxiYWNrO1xyXG4gICAgICAgICAgY3VycmVudEluc3RhbmNlLmNsb3NlID0gY2xvc2VDYWxsYmFjaztcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5mdWxsID0gZnVsbFNjcmVlbjtcclxuICAgICAgICAgIGlmICh0eXBlb2YgdXJsT3JNYXJrdXAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIG9wZW5PdmVybGF5V2l0aEFqYXgodXJsT3JNYXJrdXApO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3Blbk92ZXJsYXlXaXRoTWFya3VwKHVybE9yTWFya3VwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvcGVuT3ZlcmxheVdpdGhBamF4KHVybCkge1xyXG4gICAgICAgICAgJC5hamF4KHVybCkuZG9uZShvcGVuT3ZlcmxheVdpdGhNYXJrdXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb3Blbk92ZXJsYXlXaXRoTWFya3VwKG1hcmt1cCkge1xyXG4gICAgICAgICAgJG92ZXJsYXkuaHRtbChtYXJrdXApO1xyXG4gICAgICAgICAgJG92ZXJsYXkuYXBwZW5kKCRjbG9zZUJ1dHRvbik7XHJcbiAgICAgICAgICBpZiAoY3VycmVudEluc3RhbmNlLmZ1bGwpIHtcclxuICAgICAgICAgICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ2Z1bGwnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICRvdmVybGF5LmZvdW5kYXRpb24oJ29wZW4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG92ZXJsYXlTaXplQ2xlYW51cCgpIHtcclxuICAgICAgICAgICRvdmVybGF5LnJlbW92ZUNsYXNzKCdmdWxsJyk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5yZW1vdmVDbGFzcygndG91cicpO1xyXG4gICAgICAgICAgJG92ZXJsYXkuaHRtbCgnJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvdmVybGF5U2l6aW5nKCkge1xyXG4gICAgICAgICAgdmFyIG92ZXJsYXlIZWlnaHQgPSAkb3ZlcmxheS5oZWlnaHQoKSxcclxuICAgICAgICAgICAgd2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG5cclxuICAgICAgICAgIGlmIChvdmVybGF5SGVpZ2h0ID4gd2luZG93SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICRvdmVybGF5LmNzcyh7XHJcbiAgICAgICAgICAgICAgdG9wOiAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkb3ZlcmxheS5hZGRDbGFzcygnZnVsbCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH0pKGpRdWVyeSk7XHJcblxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgdmFyIHZpZHMgPSBbXSwgYnJpZ2h0Q292ZTtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIF9wYXJzZVZpZGVvcygpO1xyXG5cclxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgVmlkZW9KUyBtZXRob2QgaXMgYXZhaWxhYmxlIGFuZCBmaXJlIHJlYWR5IGV2ZW50IGhhbmRsZXJzIGlmIHNvXHJcbiAgICAvLyBicmlnaHRDb3ZlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gICBpZiAoJCgnLnZqcy1wbHVnaW5zLXJlYWR5JykubGVuZ3RoKSB7XHJcbiAgICAvLyAgICAgX2JyaWdodENvdmVSZWFkeSgpO1xyXG4gICAgLy8gICAgIGNsZWFySW50ZXJ2YWwoYnJpZ2h0Q292ZSk7XHJcbiAgICAvLyAgIH1cclxuICAgIC8vIH0sIDUwMClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wYXJzZVZpZGVvcygpIHtcclxuICAgIHZhciAkZ3JvdXAsXHJcbiAgICAgICR2aWRlbyxcclxuICAgICAgZGF0YSA9IHt9LFxyXG4gICAgICBwcmVsb2FkT3B0aW9ucyA9IFsnYXV0bycsICdtZXRhZGF0YScsICdub25lJ11cclxuXHJcbiAgICAvLyBFYWNoIGdyb3VwIGNhbiBlZmZlY3RpdmVseSB1c2UgYSBkaWZmZXJlbnQgcGxheWVyIHdoaWNoIHdpbGwgb25seSBiZSBsb2FkZWQgb25jZVxyXG4gICAgJCgnLmlnLXZpZGVvLWdyb3VwJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRncm91cCA9ICQodGhpcyk7XHJcbiAgICAgIGRhdGEuYWNjb3VudCA9ICRncm91cC5kYXRhKCdhY2NvdW50Jyk7XHJcbiAgICAgIGRhdGEucGxheWVyID0gJGdyb3VwLmRhdGEoJ3BsYXllcicpO1xyXG5cclxuICAgICAgLy8gTG9hZCByZXF1aXJlZCBKUyBmb3IgYSBwbGF5ZXJcclxuICAgICAgX2luamVjdEJyaWdodENvdmVKUyhkYXRhKTtcclxuXHJcbiAgICAgIC8vIExvb3AgdGhyb3VnaCB2aWRlbydzXHJcbiAgICAgICRncm91cC5maW5kKCcuaWctdmlkZW8tanMnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICR2aWRlbyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyAocmVxdWlyZWQpXHJcbiAgICAgICAgZGF0YS5pZCA9ICR2aWRlby5kYXRhKCdpZCcpO1xyXG5cclxuICAgICAgICAvLyBDYXB0dXJlIG9wdGlvbnMgKG9wdGlvbmFsKVxyXG4gICAgICAgIGRhdGEudGl0bGUgPSAkdmlkZW8uZGF0YSgndGl0bGUnKSA/ICR2aWRlby5kYXRhKCd0aXRsZScpIDogJyc7XHJcbiAgICAgICAgZGF0YS5kZXNjcmlwdGlvbiA9ICR2aWRlby5kYXRhKCdkZXNjcmlwdGlvbicpID8gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgOiAnJztcclxuICAgICAgICBkYXRhLmF1dG8gPSAkdmlkZW8uZGF0YSgnYXV0b3BsYXknKSA/ICdhdXRvcGxheScgOiAnJztcclxuICAgICAgICBkYXRhLmN0cmwgPSAkdmlkZW8uZGF0YSgnY29udHJvbHMnKSA/ICdjb250cm9scycgOiAnJztcclxuICAgICAgICBkYXRhLnByZWxvYWQgPSAocHJlbG9hZE9wdGlvbnMuaW5kZXhPZigkdmlkZW8uZGF0YSgncHJlbG9hZCcpKSA+IC0xKSA/ICR2aWRlby5kYXRhKCdwcmVsb2FkJykgOiAnYXV0byc7XHJcblxyXG4gICAgICAgIC8vIFN0b3JlIElEJ3MgZm9yIGFsbCB2aWRlbydzIG9uIHRoZSBwYWdlIC0gaW4gY2FzZSB3ZSB3YW50IHRvIHJ1biBhIHBvc3QtbG9hZCBwcm9jZXNzIG9uIGVhY2hcclxuICAgICAgICB2aWRzLnB1c2goZGF0YS5pZCk7XHJcblxyXG4gICAgICAgIC8vIExldCdzIHJlcGxhY2UgdGhlIGlnLXZpZGVvLWpzICdkaXJlY3RpdmUnIHdpdGggdGhlIG5lY2Vzc2FyeSBCcmlnaHRjb3ZlIGNvZGVcclxuICAgICAgICBfaW5qZWN0VGVtcGxhdGUoJHZpZGVvLCBkYXRhLCBpbmRleClcclxuICAgICAgfSk7XHJcblxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9pbmplY3RCcmlnaHRDb3ZlSlMoZGF0YSkge1xyXG4gICAgdmFyIGluZGV4anMgPSBgPHNjcmlwdCBzcmM9XCIvL3BsYXllcnMuYnJpZ2h0Y292ZS5uZXQvJHtkYXRhLmFjY291bnR9LyR7ZGF0YS5wbGF5ZXJ9X2RlZmF1bHQvaW5kZXgubWluLmpzXCI+PC9zY3JpcHQ+YDtcclxuICAgICQoJ2JvZHknKS5hcHBlbmQoaW5kZXhqcyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfaW5qZWN0VGVtcGxhdGUoJHZpZGVvLCBkYXRhLCBpbmRleCkge1xyXG4gICAgdmFyIGh0bWwgPSBgPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lclwiPjxzcGFuIGNsYXNzPVwidmlkZW8tb3ZlcmxheSAke2RhdGEuaWR9XCI+PC9zcGFuPjxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXItcmVzcG9uc2l2ZVwiPjx2aWRlbyBkYXRhLXZpZGVvLWlkPVwiJHtkYXRhLmlkfVwiIHByZWxvYWQ9XCIke2RhdGEucHJlbG9hZH1cIiBkYXRhLWFjY291bnQ9XCIke2RhdGEuYWNjb3VudH1cIiBkYXRhLXBsYXllcj1cIiR7ZGF0YS5wbGF5ZXJ9XCIgZGF0YS1lbWJlZD1cImRlZmF1bHRcIiBkYXRhLWFwcGxpY2F0aW9uLWlkPVwiJHtpbmRleH1cIiBjbGFzcz1cInZpZGVvLWpzXCIgaWQ9XCIke2RhdGEuaWR9XCIgJHtkYXRhLmN0cmx9ICR7ZGF0YS5hdXRvfT48L3ZpZGVvPjwvZGl2PjwvZGl2PjxoMiBjbGFzcz1cInZpZGVvLXRpdGxlXCI+JHtkYXRhLnRpdGxlfTwvaDI+PHAgY2xhc3M9XCJ2aWRlby1kZXNjcmlwdGlvblwiPiR7ZGF0YS5kZXNjcmlwdGlvbn08L3A+YDtcclxuICAgICR2aWRlby5yZXBsYWNlV2l0aChodG1sKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9icmlnaHRDb3ZlUmVhZHkoKSB7XHJcbiAgICB2aWRzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgIHZpZGVvanMoJyMnICsgZWwpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyAkKCcudmlkZW8tb3ZlcmxheS4nKyBlbCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgX3NlYXJjaExlZ2FjeUNvZGUoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zZWFyY2hMZWdhY3lDb2RlKCkge1xyXG5cclxuLy8gR0xPQkFMU1xyXG4gICAgdmFyIG1vZGVsVXJsID0gJ2h0dHBzOi8vc2VhcmNoLmludmVzdG9yc2dyb3VwLmNvbS9hcGkvY3dwc2VhcmNoPyc7XHJcbiAgICB2YXIgJGZpZWxkID0gJCgnI0ZpbmRBbk9mZmljZScpO1xyXG4gICAgdmFyIGxhbmcgPSAnZW4nO1xyXG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJy9mci8nKSA+IC0xKSB7XHJcbiAgICAgIGxhbmcgPSAnZnInO1xyXG4gICAgfVxyXG5cclxuLy8gUHJvY2VzcyB0aGUgbG9jYWwgcHJlZmV0Y2hlZCBkYXRhXHJcbiAgICB2YXIgc3VnZ2VzdGlvbnMgPSB7fTtcclxuICAgIHZhciBjaXRpZXMgPSBbXHJcbiAgICAgIFwiYXRoYWJhc2NhXCIsXHJcbiAgICAgIFwiYmx1ZmZ0b25cIixcclxuICAgICAgXCJib25ueXZpbGxlXCIsXHJcbiAgICAgIFwiYnJvb2tzXCIsXHJcbiAgICAgIFwiY2FsZ2FyeVwiLFxyXG4gICAgICBcImNhbXJvc2VcIixcclxuICAgICAgXCJjYW5tb3JlXCIsXHJcbiAgICAgIFwiZHJheXRvbiB2YWxsZXlcIixcclxuICAgICAgXCJlZG1vbnRvblwiLFxyXG4gICAgICBcImZvcnQgbWNtdXJyYXlcIixcclxuICAgICAgXCJmb3J0IHNhc2thdGNoZXdhblwiLFxyXG4gICAgICBcImdyYW5kZSBwcmFpcmllXCIsXHJcbiAgICAgIFwiaGFsa2lya1wiLFxyXG4gICAgICBcImhpbGxjcmVzdCBtaW5lc1wiLFxyXG4gICAgICBcImhpbnRvblwiLFxyXG4gICAgICBcImxlZHVjXCIsXHJcbiAgICAgIFwibGV0aGJyaWRnZVwiLFxyXG4gICAgICBcImxsb3lkbWluc3RlclwiLFxyXG4gICAgICBcIm1lZGljaW5lIGhhdFwiLFxyXG4gICAgICBcIm1vcmludmlsbGVcIixcclxuICAgICAgXCJwZWFjZSByaXZlclwiLFxyXG4gICAgICBcInBpbmNoZXIgY3JlZWtcIixcclxuICAgICAgXCJwcm92b3N0XCIsXHJcbiAgICAgIFwicmVkIGRlZXJcIixcclxuICAgICAgXCJzaGVyd29vZCBwYXJrXCIsXHJcbiAgICAgIFwic3BydWNlIGdyb3ZlXCIsXHJcbiAgICAgIFwic3QuIGFsYmVydFwiLFxyXG4gICAgICBcInN0ZXR0bGVyXCIsXHJcbiAgICAgIFwic3R1cmdlb24gY291bnR5XCIsXHJcbiAgICAgIFwidG9maWVsZFwiLFxyXG4gICAgICBcInZlcm1pbGlvblwiLFxyXG4gICAgICBcIndhaW53cmlnaHRcIixcclxuICAgICAgXCJ3ZXN0bG9ja1wiLFxyXG4gICAgICBcIndoaXRlbGF3XCIsXHJcbiAgICAgIFwiYWJib3RzZm9yZFwiLFxyXG4gICAgICBcImJyYWNrZW5kYWxlXCIsXHJcbiAgICAgIFwiYnVybmFieVwiLFxyXG4gICAgICBcImJ1cm5zIGxha2VcIixcclxuICAgICAgXCJjYW1wYmVsbCByaXZlclwiLFxyXG4gICAgICBcImNoYXNlXCIsXHJcbiAgICAgIFwiY2hpbGxpd2Fja1wiLFxyXG4gICAgICBcImNvbW94XCIsXHJcbiAgICAgIFwiY29xdWl0bGFtXCIsXHJcbiAgICAgIFwiY291cnRlbmF5XCIsXHJcbiAgICAgIFwiY3JhbmJyb29rXCIsXHJcbiAgICAgIFwiZGF3c29uIGNyZWVrXCIsXHJcbiAgICAgIFwiZHVuY2FuXCIsXHJcbiAgICAgIFwiZm9ydCBuZWxzb25cIixcclxuICAgICAgXCJmb3J0IHN0LiBqb2huXCIsXHJcbiAgICAgIFwiaW52ZXJtZXJlXCIsXHJcbiAgICAgIFwia2FtbG9vcHNcIixcclxuICAgICAgXCJrZWxvd25hXCIsXHJcbiAgICAgIFwibGFuZ2xleVwiLFxyXG4gICAgICBcIm1lcnJpdHRcIixcclxuICAgICAgXCJuYW5haW1vXCIsXHJcbiAgICAgIFwibmVsc29uXCIsXHJcbiAgICAgIFwibm9ydGggdmFuY291dmVyXCIsXHJcbiAgICAgIFwib2xpdmVyXCIsXHJcbiAgICAgIFwicGVudGljdG9uXCIsXHJcbiAgICAgIFwicG9ydCBhbGJlcm5pXCIsXHJcbiAgICAgIFwicG93ZWxsIHJpdmVyXCIsXHJcbiAgICAgIFwicHJpbmNlIGdlb3JnZVwiLFxyXG4gICAgICBcInF1YWxpY3VtIGJlYWNoXCIsXHJcbiAgICAgIFwicXVlc25lbFwiLFxyXG4gICAgICBcInJldmVsc3Rva2VcIixcclxuICAgICAgXCJyaWNobW9uZFwiLFxyXG4gICAgICBcInNhYW5pY2h0b25cIixcclxuICAgICAgXCJzYWxtb24gYXJtXCIsXHJcbiAgICAgIFwic2FsdCBzcHJpbmcgaXNsYW5kXCIsXHJcbiAgICAgIFwic2VjaGVsdFwiLFxyXG4gICAgICBcInNpZG5leVwiLFxyXG4gICAgICBcInNtaXRoZXJzXCIsXHJcbiAgICAgIFwic3VycmV5XCIsXHJcbiAgICAgIFwidGVycmFjZVwiLFxyXG4gICAgICBcInRyYWlsXCIsXHJcbiAgICAgIFwidmFuY291dmVyXCIsXHJcbiAgICAgIFwidmVybm9uXCIsXHJcbiAgICAgIFwidmljdG9yaWFcIixcclxuICAgICAgXCJ3ZXN0YmFua1wiLFxyXG4gICAgICBcIndpbGxpYW1zIGxha2VcIixcclxuICAgICAgXCJicmFuZG9uXCIsXHJcbiAgICAgIFwiZGF1cGhpblwiLFxyXG4gICAgICBcImZsaW4gZmxvblwiLFxyXG4gICAgICBcImdpbGxhbVwiLFxyXG4gICAgICBcImtpbGxhcm5leVwiLFxyXG4gICAgICBcIm1hbml0b3VcIixcclxuICAgICAgXCJtaWFtaVwiLFxyXG4gICAgICBcIm1vcmRlblwiLFxyXG4gICAgICBcIm5hcm9sXCIsXHJcbiAgICAgIFwicG9ydGFnZSBsYSBwcmFpcmllXCIsXHJcbiAgICAgIFwic2Vsa2lya1wiLFxyXG4gICAgICBcInN3YW4gcml2ZXJcIixcclxuICAgICAgXCJ0aGUgcGFzXCIsXHJcbiAgICAgIFwidmlyZGVuXCIsXHJcbiAgICAgIFwid2FycmVuXCIsXHJcbiAgICAgIFwid2lubmlwZWdcIixcclxuICAgICAgXCJiYXRodXJzdFwiLFxyXG4gICAgICBcImJlZGVsbFwiLFxyXG4gICAgICBcImVkbXVuZHN0b25cIixcclxuICAgICAgXCJmcmVkZXJpY3RvblwiLFxyXG4gICAgICBcImxhbnNkb3duZVwiLFxyXG4gICAgICBcIm1pcmFtaWNoaVwiLFxyXG4gICAgICBcIm1vbmN0b25cIixcclxuICAgICAgXCJxdWlzcGFtc2lzXCIsXHJcbiAgICAgIFwicmV4dG9uXCIsXHJcbiAgICAgIFwicm90aGVzYXlcIixcclxuICAgICAgXCJzYWludCBqb2huXCIsXHJcbiAgICAgIFwic2FpbnQgcGF1bFwiLFxyXG4gICAgICBcInN1c3NleFwiLFxyXG4gICAgICBcImJsYWtldG93blwiLFxyXG4gICAgICBcImNsYXJlbnZpbGxlXCIsXHJcbiAgICAgIFwiY29ybmVyIGJyb29rXCIsXHJcbiAgICAgIFwiZ2FuZGVyXCIsXHJcbiAgICAgIFwiZ3JhbmQgZmFsbHMgLSB3aW5kc29yXCIsXHJcbiAgICAgIFwibWFyeXN0b3duXCIsXHJcbiAgICAgIFwicm9hY2hlcyBsaW5lXCIsXHJcbiAgICAgIFwic3QuIGpvaG4nc1wiLFxyXG4gICAgICBcInRyaW5pdHlcIixcclxuICAgICAgXCJhbWhlcnN0XCIsXHJcbiAgICAgIFwiYW50aWdvbmlzaFwiLFxyXG4gICAgICBcImJhcnJpbmd0b24gcGFzc2FnZVwiLFxyXG4gICAgICBcImJlbGxpdmVhdSBjb3ZlXCIsXHJcbiAgICAgIFwiYnJpZGdldG93blwiLFxyXG4gICAgICBcImJyaWRnZXdhdGVyXCIsXHJcbiAgICAgIFwiZGFydG1vdXRoXCIsXHJcbiAgICAgIFwiZGF5dG9uXCIsXHJcbiAgICAgIFwiaGFsaWZheFwiLFxyXG4gICAgICBcIm1pZGRsZXRvblwiLFxyXG4gICAgICBcIm5ldyBnbGFzZ293XCIsXHJcbiAgICAgIFwibmV3IG1pbmFzXCIsXHJcbiAgICAgIFwibm9ydGggc3lkbmV5XCIsXHJcbiAgICAgIFwicGljdG91XCIsXHJcbiAgICAgIFwicG9ydCBoYXdrZXNidXJ5XCIsXHJcbiAgICAgIFwic3lkbmV5XCIsXHJcbiAgICAgIFwidHJ1cm9cIixcclxuICAgICAgXCJ5ZWxsb3drbmlmZVwiLFxyXG4gICAgICBcImFqYXhcIixcclxuICAgICAgXCJhbGdvbnF1aW4gaGlnaGxhbmRzXCIsXHJcbiAgICAgIFwiYW5jYXN0ZXJcIixcclxuICAgICAgXCJhdGlrb2thblwiLFxyXG4gICAgICBcImJhcnJpZVwiLFxyXG4gICAgICBcImJlbGxldmlsbGVcIixcclxuICAgICAgXCJib3dtYW52aWxsZVwiLFxyXG4gICAgICBcImJyYWNlYnJpZGdlXCIsXHJcbiAgICAgIFwiYnJhbXB0b25cIixcclxuICAgICAgXCJicmFudGZvcmRcIixcclxuICAgICAgXCJicm9ja3ZpbGxlXCIsXHJcbiAgICAgIFwiYnJvb2tsaW5cIixcclxuICAgICAgXCJidXJsaW5ndG9uXCIsXHJcbiAgICAgIFwiY2FtYnJpZGdlXCIsXHJcbiAgICAgIFwiY2FybGV0b24gcGxhY2VcIixcclxuICAgICAgXCJjaGF0aGFtXCIsXHJcbiAgICAgIFwiY2xheXRvblwiLFxyXG4gICAgICBcImNsaW50b25cIixcclxuICAgICAgXCJjb2JvdXJnXCIsXHJcbiAgICAgIFwiY29sbGluZ3dvb2RcIixcclxuICAgICAgXCJjb25jb3JkXCIsXHJcbiAgICAgIFwiY29ybndhbGxcIixcclxuICAgICAgXCJkcnlkZW5cIixcclxuICAgICAgXCJkdW5kYXNcIixcclxuICAgICAgXCJkdW5zZm9yZFwiLFxyXG4gICAgICBcImR1dHRvblwiLFxyXG4gICAgICBcImVsbGlvdCBsYWtlXCIsXHJcbiAgICAgIFwiZXRvYmljb2tlXCIsXHJcbiAgICAgIFwiZm9ydCBmcmFuY2VzXCIsXHJcbiAgICAgIFwiZ2FuYW5vcXVlXCIsXHJcbiAgICAgIFwiZ2Fyc29uXCIsXHJcbiAgICAgIFwiZ3JlZWx5XCIsXHJcbiAgICAgIFwiZ3JpbXNieVwiLFxyXG4gICAgICBcImd1ZWxwaFwiLFxyXG4gICAgICBcImhhaWxleWJ1cnlcIixcclxuICAgICAgXCJoYW1pbHRvblwiLFxyXG4gICAgICBcImhhbm92ZXJcIixcclxuICAgICAgXCJoZWFyc3RcIixcclxuICAgICAgXCJodW50c3ZpbGxlXCIsXHJcbiAgICAgIFwiamVyc2V5dmlsbGVcIixcclxuICAgICAgXCJrYW5hdGFcIixcclxuICAgICAgXCJrYXB1c2thc2luZ1wiLFxyXG4gICAgICBcImtlbm9yYVwiLFxyXG4gICAgICBcImtpbmdzdG9uXCIsXHJcbiAgICAgIFwia2lya2xhbmQgbGFrZVwiLFxyXG4gICAgICBcImtpdGNoZW5lclwiLFxyXG4gICAgICBcImxhbmd0b25cIixcclxuICAgICAgXCJsaW5kc2F5XCIsXHJcbiAgICAgIFwibG9uZG9uXCIsXHJcbiAgICAgIFwibWFwbGVcIixcclxuICAgICAgXCJtYXJhdGhvblwiLFxyXG4gICAgICBcIm1hcmtoYW1cIixcclxuICAgICAgXCJtZXJyaWNrdmlsbGVcIixcclxuICAgICAgXCJtaWx0b25cIixcclxuICAgICAgXCJtaW5kZW5cIixcclxuICAgICAgXCJtaXNzaXNzYXVnYVwiLFxyXG4gICAgICBcIm1vdW50IGZvcmVzdFwiLFxyXG4gICAgICBcIm1vdW50IGhvcGVcIixcclxuICAgICAgXCJuZXBlYW5cIixcclxuICAgICAgXCJuZXcgbGlza2VhcmRcIixcclxuICAgICAgXCJuZXdtYXJrZXRcIixcclxuICAgICAgXCJuaWFnYXJhIGZhbGxzXCIsXHJcbiAgICAgIFwibm9ydGggYmF5XCIsXHJcbiAgICAgIFwibm9ydGggeW9ya1wiLFxyXG4gICAgICBcIm9hayByaWRnZXNcIixcclxuICAgICAgXCJvYWt2aWxsZVwiLFxyXG4gICAgICBcIm9yYW5nZXZpbGxlXCIsXHJcbiAgICAgIFwib3JpbGxpYVwiLFxyXG4gICAgICBcIm9ydG9uXCIsXHJcbiAgICAgIFwib3NoYXdhXCIsXHJcbiAgICAgIFwib3R0YXdhXCIsXHJcbiAgICAgIFwib3dlbiBzb3VuZFwiLFxyXG4gICAgICBcInBhcnJ5IHNvdW5kXCIsXHJcbiAgICAgIFwicGVtYnJva2VcIixcclxuICAgICAgXCJwZW5ldGFuZ3Vpc2hlbmVcIixcclxuICAgICAgXCJwZXJ0aFwiLFxyXG4gICAgICBcInBldGVyYm9yb3VnaFwiLFxyXG4gICAgICBcInBldHJvbGlhXCIsXHJcbiAgICAgIFwicGlja2VyaW5nXCIsXHJcbiAgICAgIFwicmVkIGxha2VcIixcclxuICAgICAgXCJyaWRnZXRvd25cIixcclxuICAgICAgXCJzYXJuaWFcIixcclxuICAgICAgXCJzYXVsdCBzdGUuIG1hcmllXCIsXHJcbiAgICAgIFwic2NhcmJvcm91Z2hcIixcclxuICAgICAgXCJzY2hyZWliZXJcIixcclxuICAgICAgXCJzaW1jb2VcIixcclxuICAgICAgXCJzaW91eCBsb29rb3V0XCIsXHJcbiAgICAgIFwic3QuIGNhdGhhcmluZXNcIixcclxuICAgICAgXCJzdC4gbWFyeXNcIixcclxuICAgICAgXCJzdG91ZmZ2aWxsZVwiLFxyXG4gICAgICBcInN0cmF0Zm9yZFwiLFxyXG4gICAgICBcInN0dXJnZW9uIGZhbGxzXCIsXHJcbiAgICAgIFwic3VkYnVyeVwiLFxyXG4gICAgICBcInN1bmRyaWRnZVwiLFxyXG4gICAgICBcInRodW5kZXIgYmF5XCIsXHJcbiAgICAgIFwidGlsbHNvbmJ1cmdcIixcclxuICAgICAgXCJ0aW1taW5zXCIsXHJcbiAgICAgIFwidG9yb250b1wiLFxyXG4gICAgICBcInRyZW50b25cIixcclxuICAgICAgXCJVeGJyaWRnZVwiLFxyXG4gICAgICBcInZhbCBjYXJvblwiLFxyXG4gICAgICBcIndhbGtlcnRvblwiLFxyXG4gICAgICBcIndhdGVybG9vXCIsXHJcbiAgICAgIFwid2VsbGFuZFwiLFxyXG4gICAgICBcIndoaXRieVwiLFxyXG4gICAgICBcIndpbGxvd2RhbGVcIixcclxuICAgICAgXCJ3aW5kc29yXCIsXHJcbiAgICAgIFwid2luZ2hhbVwiLFxyXG4gICAgICBcIndvb2RicmlkZ2VcIixcclxuICAgICAgXCJjaGFybG90dGV0b3duLCBwZVwiLFxyXG4gICAgICBcInNvdXJpcywgcGVcIixcclxuICAgICAgXCJzdW1tZXJzaWRlLCBwZVwiLFxyXG4gICAgICBcIndlbGxpbmd0b25cIixcclxuICAgICAgXCJhbmpvdVwiLFxyXG4gICAgICBcImJvaXNicmlhbmRcIixcclxuICAgICAgXCJib3VjaGVydmlsbGVcIixcclxuICAgICAgXCJicm9zc2FyZFwiLFxyXG4gICAgICBcImNow6J0ZWF1Z3VheVwiLFxyXG4gICAgICBcImNoaWNvdXRpbWlcIixcclxuICAgICAgXCJjw7R0ZSBzYWludC1sdWNcIixcclxuICAgICAgXCJkb2xsYXJkLWRlcy1vcm1lYXV4XCIsXHJcbiAgICAgIFwiZ2F0aW5lYXVcIixcclxuICAgICAgXCJncmFuYnlcIixcclxuICAgICAgXCJsYXZhbFwiLFxyXG4gICAgICBcImzDqXZpc1wiLFxyXG4gICAgICBcIm1pcmFiZWxcIixcclxuICAgICAgXCJtb250cmVhbFwiLFxyXG4gICAgICBcIm5ldyByaWNobW9uZFwiLFxyXG4gICAgICBcInBvaW50ZS1jbGFpcmVcIixcclxuICAgICAgXCJxdcOpYmVjXCIsXHJcbiAgICAgIFwic2VwdC1pbGVzXCIsXHJcbiAgICAgIFwic2hlcmJyb29rZVwiLFxyXG4gICAgICBcInZpbGxlIHN0LWxhdXJlbnRcIixcclxuICAgICAgXCJ3ZXN0bW91bnRcIixcclxuICAgICAgXCJlYXN0ZW5kXCIsXHJcbiAgICAgIFwiZXN0ZXZhblwiLFxyXG4gICAgICBcImVzdGVyaGF6eVwiLFxyXG4gICAgICBcImZvYW0gbGFrZVwiLFxyXG4gICAgICBcImh1bWJvbGR0XCIsXHJcbiAgICAgIFwia2luZGVyc2xleVwiLFxyXG4gICAgICBcImxlYWRlclwiLFxyXG4gICAgICBcIm1hcGxlIGNyZWVrXCIsXHJcbiAgICAgIFwibWVhZG93IGxha2VcIixcclxuICAgICAgXCJtZWxmb3J0XCIsXHJcbiAgICAgIFwibWVsdmlsbGVcIixcclxuICAgICAgXCJtb29zZSBqYXdcIixcclxuICAgICAgXCJub3J0aCBiYXR0bGVmb3JkXCIsXHJcbiAgICAgIFwib3V0bG9va1wiLFxyXG4gICAgICBcIm94Ym93XCIsXHJcbiAgICAgIFwicHJpbmNlIGFsYmVydFwiLFxyXG4gICAgICBcInJlZ2luYVwiLFxyXG4gICAgICBcInJlZ2luYSBiZWFjaFwiLFxyXG4gICAgICBcInJvc2V0b3duXCIsXHJcbiAgICAgIFwic2Fza2F0b29uXCIsXHJcbiAgICAgIFwic2hlbGxicm9va1wiLFxyXG4gICAgICBcInN3aWZ0IGN1cnJlbnRcIixcclxuICAgICAgXCJ3YXRyb3VzXCIsXHJcbiAgICAgIFwid2F0c29uXCIsXHJcbiAgICAgIFwieW9ya3RvblwiLFxyXG4gICAgICBcIndoaXRlaG9yc2VcIlxyXG4gICAgXTtcclxuICAgIHN1Z2dlc3Rpb25zLmxvY2F0aW9ucyA9IG5ldyBCbG9vZGhvdW5kKHtcclxuICAgICAgZGF0dW1Ub2tlbml6ZXI6IEJsb29kaG91bmQudG9rZW5pemVycy53aGl0ZXNwYWNlLFxyXG4gICAgICBxdWVyeVRva2VuaXplcjogQmxvb2Rob3VuZC50b2tlbml6ZXJzLndoaXRlc3BhY2UsXHJcbiAgICAgIGxvY2FsOiBjaXRpZXNcclxuICAgIH0pO1xyXG5cclxuLy8gR2V0IHRoZSByZXN1bHRzXHJcbiAgICBmdW5jdGlvbiBnZXRTZWFyY2hSZXN1bHRzKHBhcmFtcykge1xyXG4gICAgICBwYXJhbXMuc2VhcmNodHlwZSA9ICdvZmZpY2UnO1xyXG4gICAgICBwYXJhbXMubmFtZSA9ICcnO1xyXG5cclxuICAgICAgLy8gTWFrZSBzdXJlIGVycm9yIG1lc3NhZ2UgaXMgaGlkZGVuIGVhY2ggdGltZVxyXG4gICAgICAkKCcuemVyby1yZXN1bHRzJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHJcbiAgICAgICQuZ2V0SlNPTihtb2RlbFVybCwgcGFyYW1zKVxyXG4gICAgICAgIC5hbHdheXMoKVxyXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICAgICAgJCgnI3NlYXJjaFJlc3VsdHNNb2RhbCcpLnJlbW92ZUNsYXNzKCdjbG9zZWQnKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgZGlzcGxheVNlYXJjaFJlc3VsdHMoJ29mZmljZS10ZW1wbGF0ZScsIHJlc3VsdCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCcuemVyby1yZXN1bHRzJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdEYXRhIGNvdWxkIG5vdCBiZSByZXRyaWV2ZWQsIHBsZWFzZSB0cnkgYWdhaW4nLCByZXN1bHQuc3RhdHVzICsgJyAnICsgcmVzdWx0LnN0YXR1c1RleHQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbi8vIEJlY2F1c2Ugd2UgYXJlIG9ubHkgc2VhcmNoaW5nIGZvciBjaXRpZXMsIHRoaXMgZnVuY3Rpb24gaXMgc2xpZ2h0bHkgcmVkdW5kYW50IC0gbGVhdmluZyBpdCBpbiBwbGFjZSBmb3Igbm93XHJcbiAgICBmdW5jdGlvbiBwYXJzZVNlYXJjaFN0cmluZygpIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICB2YXIgc2VhcmNoID0gJGZpZWxkLnZhbCgpO1xyXG5cclxuICAgICAgcmVzdWx0LmNpdHkgPSAnJztcclxuXHJcbiAgICAgIC8vIFNlYXJjaCBpbiB0aGUgbGFuZ3VhZ2Ugb2YgdGhlIHBhZ2VcclxuICAgICAgcmVzdWx0LmxhbmcgPSBsYW5nO1xyXG4gICAgICAvLyBXZSBvbmx5IHNlYXJjaCBjb25zdWx0YW50cyBmcm9tIHRoaXMgbWV0aG9kXHJcbiAgICAgIHJlc3VsdC5zZWFyY2h0eXBlID0gJ2Nvbic7XHJcblxyXG4gICAgICAvLyBDaGVjayB0aGUgc2VhcmNoIHN0cmluZyBmb3IgYSBwcmV2aW91c2x5IGRlZmluZWQgbG9jYXRpb25cclxuICAgICAgdmFyIHdvcmRzID0gc2VhcmNoLnNwbGl0KCcgJyk7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyBDaGVjayBlYWNoIHdvcmQgZm9yIGEgY2l0eSBmcm9tIHRoZSBwcmVkZWZpbmVkIGxpc3RcclxuICAgICAgICB2YXIgY2l0eSA9IHN1Z2dlc3Rpb25zLmxvY2F0aW9ucy5nZXQod29yZHNbaV0pO1xyXG4gICAgICAgIGlmIChjaXR5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJlc3VsdC5jaXR5ID0gY2l0eVswXTtcclxuICAgICAgICAgIHdvcmRzLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghcmVzdWx0LmNpdHkpIHtcclxuICAgICAgICByZXN1bHQuY2l0eSA9IHdvcmRzLmpvaW4oJyAnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkaXNwbGF5U2VhcmNoUmVzdWx0cyh0ZW1wbGF0ZUlELCBqc29uKSB7XHJcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSUQpLmlubmVySFRNTDtcclxuICAgICAgTXVzdGFjaGUucGFyc2UodGVtcGxhdGUpO1xyXG4gICAgICB2YXIgcmVuZGVyZWQgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIGpzb24pO1xyXG4gICAgICAkKCcjc2VhcmNoUmVzdWx0c01vZGFsJykuYXBwZW5kKHJlbmRlcmVkKTtcclxuICAgICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuLy9Jbml0IGV2ZXJ5dGhpbmdcclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBUcnkgdG8gcHJlZGV0ZXJtaW5lIHdoYXQgcmVzdWx0cyBzaG91bGQgc2hvd1xyXG4gICAgICAvLyBTZXR1cCB0aGUgdHlwZWFoZWFkXHJcbiAgICAgICQoJy50eXBlYWhlYWQnKS50eXBlYWhlYWQoe1xyXG4gICAgICAgICAgaGlnaGxpZ2h0OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7bmFtZTogJ2xvY2F0aW9ucycsIHNvdXJjZTogc3VnZ2VzdGlvbnMubG9jYXRpb25zLCBsaW1pdDogMn1cclxuICAgICAgKTtcclxuXHJcbiAgICAgIC8vIFNldHVwIHRoZSBmb3JtIHN1Ym1pc3Npb25cclxuICAgICAgJCgnLmlnLXNlYXJjaCcpLnN1Ym1pdChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXIgcGFyYW1zID0gcGFyc2VTZWFyY2hTdHJpbmcoKTtcclxuICAgICAgICBnZXRTZWFyY2hSZXN1bHRzKHBhcmFtcyk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gRmFrZSBtb2RhbCAtIEFkZGluZyBoYW5kbGVyIG9uIGRvY3VtZW50IHNvIGl0IGZpcmVzIGRlc3BpdGUgdGhlIGJ1dHRvbiBub3QgYmVpbmcgcmVuZGVyZWQgeWV0XHJcbiAgICAgICQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCIjc2VhcmNoUmVzdWx0c01vZGFsIC5jbG9zZS1idXR0b25cIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJyNzZWFyY2hSZXN1bHRzTW9kYWwnKS5hZGRDbGFzcygnY2xvc2VkJyk7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2lzLXJldmVhbC1vcGVuJyk7XHJcbiAgICAgICAgfSwgNDAwKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsIi8qIFRoaXMgZmlsZSBpcyB0aGUgZW50cnkgcG9pbnQgZm9yIHJvbGx1cCAoaHR0cDovL3JvbGx1cGpzLm9yZy8pIGFuZFxyXG4gZXNzZW50aW9uYWxseSAnYm9vdHN0cmFwcycgb3VyIGlnLmNvbSAnYXBwbGljYXRpb24nLlxyXG5cclxuIEFsbCBtb2R1bGVzIHNob3VsZCBiZSBpbXBvcnRlZCBoZXJlIHNvIHRoYXQgdGhleSBjYW4gYmUgaW5pdGlhbGl6ZWQgb25cclxuIGEgY2FzZS1ieS1jYXNlIGJhc2lzIChub3QgYWxsIHBhZ2VzIHJlcXVpcmUgdGhlIGluaXRpYWxpemF0aW9uIG9mIGEgY2Fyb3VzZWxcclxuIGZvciBpbnN0YW5jZSkuXHJcblxyXG4gQW55IHRhc2tzIG9yIHByb2Nlc3NlcyB0aGF0IG5lZWQgdG8gYmUgaW5pdGlhdGVkIG9uIHBhZ2UgbG9hZCBzaG91bGQgbGl2ZSBpbiB0aGlzXHJcbiBmaWxlIGFzIHdlbGwuIEFuIGluY2x1ZGVkIGV4YW1wbGUgaXMgYSBtZXRob2QgdGhhdCBhZGRzIGFuICdlbicgb3IgJ2ZyJyBjbGFzcyB0b1xyXG4gdGhlIGJvZHkgYmFzZWQgb24gdGhlIGdsb2JhbCBsYW5ndWFnZSB2YXJpYWJsZSB0aGF0IHdlIGNhbiB0aGVuIHVzZSB0byB3cml0ZSBjdXN0b21cclxuIHN0eWxlcyBmb3IgZWFjaCBsYW5ndWFnZS5cclxuICovXHJcblxyXG5pbXBvcnQgZm9ybXMgZnJvbSAnLi9mb3Jtcy5qcyc7XHJcbmltcG9ydCBjYXJvdXNlbCBmcm9tICcuL2Nhcm91c2VsLmpzJztcclxuaW1wb3J0IGNhcmVlcnMgZnJvbSAnLi9jYXJlZXJzLmpzJztcclxuaW1wb3J0IHZpZGVvIGZyb20gJy4vdmlkZW8uanMnO1xyXG5pbXBvcnQgc2VhcmNoIGZyb20gJy4vc2VhcmNoLmpzJztcclxuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuLy8gRXZlbnQgRW1pdHRlciB0ZXN0IG1vZHVsZXNcclxuLy8gaW1wb3J0IGV2dDEgZnJvbSAnLi9ldmVudC10ZXN0LTEuanMnO1xyXG4vLyBpbXBvcnQgZXZ0MiBmcm9tICcuL2V2ZW50LXRlc3QtMi5qcyc7XHJcblxyXG5jb25zdCBhcHAgPSAoKCkgPT4ge1xyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBGb3VuZGF0aW9uXHJcbiAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XHJcblxyXG4gICAgLy8gQ2hlY2sgZm9yIGNvbXBvbmVudHNcclxuICAgIGlmICgkKCcuaWctZm9ybScpLmxlbmd0aCkgZm9ybXMuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1jYXJvdXNlbCcpLmxlbmd0aCkgY2Fyb3VzZWwuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1zZWFyY2gnKS5sZW5ndGgpIHNlYXJjaC5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmlnLWNhcmVlcnMnKS5sZW5ndGgpIGNhcmVlcnMuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy12aWRlby1ncm91cCcpLmxlbmd0aCkgdmlkZW8uaW5pdCgpO1xyXG5cclxuICAgIC8vIENvbXBvbmVudHMgY2FuIGFsc28gYmUgc2V0dXAgdG8gcmVjZWl2ZSBhbiBIVE1MICdzY29wZScgKC5pZy1ldnQxLi4uIC5pZy1ldnQyLi4uLiBldGMpXHJcbiAgICAvLyBpZiAoJCgnLmlnLWV2dDEnKS5sZW5ndGgpIGV2dDEuaW5pdCgnLmlnLWV2dDEnKTtcclxuICAgIC8vIGlmICgkKCcuaWctZXZ0MicpLmxlbmd0aCkgZXZ0Mi5pbml0KCcuaWctZXZ0MicpO1xyXG5cclxuICAgIC8vIEFkZCBsYW5ndWFnZSBjbGFzcyB0byBib2R5XHJcbiAgICAvLyBfbGFuZ3VhZ2UoKTtcclxuICB9XHJcblxyXG4gIC8vIExldCdzIHVzZSBhIGdsb2JhbCB2YXJpYWJsZSAoZ2xvYmFsIGFzIGluIGF2YWlsYWJsZSB0byBhbGwgb3VyIGNvbXBvbmVudHMgLSBub3QgdGhlIHdpbmRvdyBvYmplY3QhKVxyXG4gIC8vIHRvIGFkZCBhIGNsYXNzIHRvIHRoZSBib2R5IHRhZ1xyXG4gIC8vIGZ1bmN0aW9uIF9sYW5ndWFnZSgpIHtcclxuICAvLyAgICQoJ2JvZHknKS5hZGRDbGFzcyhpZy5sYW5nKTtcclxuICAvLyB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfVxyXG59KSgpO1xyXG5cclxuLy8gQm9vdHN0cmFwIGFwcFxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgYXBwLmluaXQoKTtcclxufSk7XHJcbiJdLCJuYW1lcyI6WyJsYW5nIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsImluZGV4T2YiLCJlbWl0dGVyIiwiRXZlbnRFbWl0dGVyIiwiZW5kcG9pbnRVUkwiLCJzdWNjZXNzVVJMIiwiY2FuY2VsVVJMIiwiJGZvcm0iLCIkZm9ybVdyYXBwZXIiLCJpbml0IiwiJCIsImZpbmQiLCJkYXRhIiwiX3ZhbGlkYXRpb24iLCJqSW5wdXQiLCJjaGFuZ2UiLCJvYmpFdmVudCIsImFkZENsYXNzIiwidmFsaWRhdG9yIiwic2V0RGVmYXVsdHMiLCJhZGRNZXRob2QiLCJwb3N0YWwiLCJlbGVtZW50Iiwib3B0aW9uYWwiLCJtYXRjaCIsInZhbGlkYXRlIiwibGFiZWwiLCJjbG9zZXN0IiwibGVuZ3RoIiwicGFyZW50IiwiYXBwZW5kIiwib24iLCJyZXBsYWNlIiwiX3Byb2Nlc3MiLCJmb3JtIiwiZm9ybURhdGFSYXciLCJmb3JtRGF0YVBhcnNlZCIsInZhbGlkIiwicmVtb3ZlQ2xhc3MiLCJzZXJpYWxpemVBcnJheSIsIl9wYXJzZSIsIl9zdWJtaXQiLCJhamF4Iiwic3VjY2VzcyIsIm1zZyIsImVycm9yIiwidG8iLCJfdG9nZ2xlciIsImhpZGUiLCJzaG93IiwibG9nIiwidG9nZ2xlQ2xhc3MiLCJfYnVpbGRDYXJvdXNlbCIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsIiRjYXJvdXNlbCIsImVhY2giLCJpbmRleCIsInNsaWNrIiwiX2NhcmVlcnNMZWdhY3lDb2RlIiwiZm4iLCJpbmZvVG9nZ2xlIiwiJHJldmVhbCIsIiRyZXZlYWxDb250ZW50IiwiJHJldmVhbFRyaWdnZXIiLCJmaXhlZEhlaWdodCIsInNldEFyaWEiLCJhdHRyIiwiaW5pdFRvZ2dsZSIsImhhbmRsZVJldmVhbFRvZ2dsZSIsInJlc2l6ZUhhbmRsZXIiLCJzZXRUaW1lb3V0Iiwic2V0UmV2ZWFsQ29udGVudEhlaWdodCIsImNzcyIsImhlaWdodCIsImZpbmFsSGVpZ2h0IiwiaGFzQ2xhc3MiLCJzY3JvbGxIZWlnaHQiLCJqUXVlcnkiLCJjaXJjbGVBbmltYXRpb24iLCJtYXhWYWx1ZSIsImNhbnZhcyIsIiRjYW52YXMiLCJjb250ZXh0IiwiZCIsIndpZHRoIiwicGVyY2VudFN0cm9rZSIsInJlbWFpbmluZ1N0cm9rZSIsInJhZGl1cyIsImN1clBlcmMiLCJjaXJjIiwiTWF0aCIsIlBJIiwicXVhcnQiLCJkZWxlZ2F0ZUlEIiwiRGF0ZSIsImdldFRpbWUiLCJpcyIsImdldENvbnRleHQiLCJzdHJva2VTdHlsZSIsImZpbGxTdHlsZSIsImRlbGVnYXRlIiwiY2xlYXIiLCJhbmltYXRlIiwiY3VycmVudCIsImxpbmVXaWR0aCIsImJlZ2luUGF0aCIsImFyYyIsIm1pbiIsInN0cm9rZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImZpbGxSZWN0IiwiYmxvY2tMaW5rIiwiJGJsb2NrTGluayIsImRlc3RpbmF0aW9uIiwiaW5pdEJsb2NrIiwiaGFuZGxlQ2xpY2siLCJndWkiLCJ2aWRlbyIsIm92ZXJsYXkiLCJpbml0TGVnYWN5IiwiT3ZlcmxheU1vZHVsZSIsIkd1aU1vZHVsZSIsImUiLCJ0YXJnZXQiLCJnZXRBdHRyaWJ1dGUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3AiLCJvZmZzZXQiLCJ0b3AiLCJzZWxlY3RvciIsInJlc2l6ZSIsIm92ZXJsYXlSZWZlcmVuY2UiLCJtdWx0aVRhYlRvZ2dsZVNlbGVjdG9yIiwibXVsdGlUYWJDb250ZW50U2VsZWN0b3IiLCJtdWx0aVRhYlNlbGVjdG9yIiwiJGVkZ2VPdmVybGF5TG9jYXRpb24iLCIkb3ZlcmxheVNsaWRlciIsIiRwcm9maWxlU2xpZGVyIiwiJHByb2ZpbGVTbGlkZXJWaWRlb1NlY3Rpb25Ib2xkZXIiLCJ3aW5kb3dTaXppbmdEZWxheSIsIndpbmRvd1Njcm9sbGluZ0RlbGF5Iiwib3ZlcmxheU9wZW4iLCJpc1Jlc3BvbnNpdmVTdGF0ZSIsInNjcm9sbGVkVG9WaWV3IiwiaW5pdEd1aSIsImV2ZW50IiwiYmFja2dyb3VuZENvbG9yIiwiJHRoaXMiLCJwYXJzZUludCIsImh0bWwiLCJoYW5kbGVPdmVybGF5RnJvbUhhc2giLCJkZWxheWVkSGFuZGxlV2luZG93U2l6aW5nIiwiZGVsYXllZEhhbmRsZVdpbmRvd1Njcm9sbCIsInRyaWdnZXIiLCJzdG9wUHJvcGFnYXRpb24iLCJhZGRNdWx0aVRhYlRvZ2dsZUhhbmRsZXJzIiwidG9nZ2xlQmFzZSIsIiRjb250YWluZXIiLCJwYXJlbnRzIiwiYW5pbWF0ZVByb2ZpbGVTbGlkZXIiLCIkcHJvZmlsZVBhbmVscyIsInByb2ZpbGVQYW5lbEhlaWdodCIsIm91dGVySGVpZ2h0IiwiY2hhbmdlU2xpZGVyU3RhdGUiLCJzbGlkZXIiLCJzdGF0ZSIsImNsZWFyVGltZW91dCIsImhhbmRsZVdpbmRvd1NpemluZyIsImhhbmRsZVdpbmRvd1Njcm9sbGluZyIsImZ1bGxIYXNoRnJhZ21lbnQiLCJoYXNoIiwib3Blbk92ZXJsYXkiLCJoYW5kbGVPdmVybGF5T3BlbiIsImhhbmRsZU92ZXJsYXlDbG9zZSIsImluaXRpYWxJbmRleCIsImhhbmRsZVNsaWRlQ2hhbmdlIiwieVBvcyIsIm92ZXJsYXlDb250ZW50Iiwib2ZmIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImRvY3VtZW50IiwidGl0bGUiLCJzZWFyY2giLCJzY3JvbGxUb3AiLCJjdXJyZW50U2xpZGUiLCJuZXh0U2xpZGUiLCJuZXh0VGl0bGUiLCJnZXQiLCJuZXdIYXNoIiwid2luZG93V2lkdGgiLCJyZXNwb25zaXZlTGltaXQiLCJuZXdJc1Jlc3BvbnNpdmVTdGF0ZSIsImluaXRQcm9maWxlU2xpZGVyIiwiaW5pdFNsaWRlciIsIm9wdGlvbnMiLCJkZWZhdWx0cyIsImV4dGVuZCIsIiRvdmVybGF5IiwiJGJvZHkiLCJvdmVybGF5U2l6aW5nRGVsYXkiLCJjdXJyZW50SW5zdGFuY2UiLCJpc09wZW5GbGFnIiwiJGNsb3NlQnV0dG9uIiwiaXNPcGVuIiwiaW5pdE92ZXJsYXkiLCJkZWxheWVkSGFuZGxlT3ZlcmxheVNpemluZyIsIkZvdW5kYXRpb24iLCJSZXZlYWwiLCJvdmVybGF5U2l6aW5nIiwiY2xvc2UiLCJmb3VuZGF0aW9uIiwib3BlbiIsImluaXRDbG9zZUJ1dHRvbiIsIiRpbm5lclNwYW4iLCJ1cmxPck1hcmt1cCIsIm9wZW5DYWxsYmFjayIsImNsb3NlQ2FsbGJhY2siLCJmdWxsU2NyZWVuIiwiZnVsbCIsIm9wZW5PdmVybGF5V2l0aEFqYXgiLCJ1cmwiLCJkb25lIiwib3Blbk92ZXJsYXlXaXRoTWFya3VwIiwibWFya3VwIiwib3ZlcmxheVNpemVDbGVhbnVwIiwib3ZlcmxheUhlaWdodCIsIndpbmRvd0hlaWdodCIsInZpZHMiLCJicmlnaHRDb3ZlIiwiX3BhcnNlVmlkZW9zIiwiJGdyb3VwIiwiJHZpZGVvIiwicHJlbG9hZE9wdGlvbnMiLCJhY2NvdW50IiwicGxheWVyIiwiaWQiLCJkZXNjcmlwdGlvbiIsImF1dG8iLCJjdHJsIiwicHJlbG9hZCIsInB1c2giLCJfaW5qZWN0QnJpZ2h0Q292ZUpTIiwiaW5kZXhqcyIsIl9pbmplY3RUZW1wbGF0ZSIsInJlcGxhY2VXaXRoIiwiX3NlYXJjaExlZ2FjeUNvZGUiLCJtb2RlbFVybCIsIiRmaWVsZCIsImhyZWYiLCJzdWdnZXN0aW9ucyIsImNpdGllcyIsImxvY2F0aW9ucyIsIkJsb29kaG91bmQiLCJ0b2tlbml6ZXJzIiwid2hpdGVzcGFjZSIsImdldFNlYXJjaFJlc3VsdHMiLCJwYXJhbXMiLCJzZWFyY2h0eXBlIiwibmFtZSIsImdldEpTT04iLCJhbHdheXMiLCJyZXN1bHQiLCJKU09OIiwicGFyc2UiLCJmYWlsIiwic3RhdHVzIiwic3RhdHVzVGV4dCIsInBhcnNlU2VhcmNoU3RyaW5nIiwidmFsIiwiY2l0eSIsIndvcmRzIiwic3BsaXQiLCJpIiwic3BsaWNlIiwiam9pbiIsImRpc3BsYXlTZWFyY2hSZXN1bHRzIiwidGVtcGxhdGVJRCIsImpzb24iLCJ0ZW1wbGF0ZSIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwicmVuZGVyZWQiLCJNdXN0YWNoZSIsInJlbmRlciIsInR5cGVhaGVhZCIsInNvdXJjZSIsImxpbWl0Iiwic3VibWl0IiwiYXBwIiwiZm9ybXMiLCJjYXJvdXNlbCIsImNhcmVlcnMiLCJyZWFkeSJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7Ozs7OztBQVNBLEFBQU87OztBQUtQLEFBQU8sSUFBSUEsT0FBUSxZQUFNO01BQ25CQyxPQUFPQyxRQUFQLENBQWdCQyxRQUFoQixDQUF5QkMsT0FBekIsQ0FBaUMsTUFBakMsTUFBNkMsQ0FBQyxDQUFsRCxFQUFxRDtXQUM1QyxJQUFQO0dBREYsTUFFTztXQUNFLElBQVA7O0NBSmMsRUFBWDs7O0FBU1AsQUFBTzs7O0FBS1AsQUFBTyxJQUFJQyxVQUFVLElBQUlDLFlBQUosRUFBZDs7QUMxQlAsWUFBZSxDQUFDLFlBQU07O01BRWhCQyxXQUFKLEVBQ0VDLFVBREYsRUFFRUMsU0FGRixFQUdFQyxLQUhGLEVBSUVDLFlBSkY7O1dBTVNDLElBQVQsR0FBZ0I7O21CQUVDQyxFQUFFLFVBQUYsQ0FBZjtZQUNRRixhQUFhRyxJQUFiLENBQWtCLE1BQWxCLENBQVI7a0JBQ2NILGFBQWFHLElBQWIsQ0FBa0IsTUFBbEIsRUFBMEJDLElBQTFCLENBQStCLFVBQS9CLENBQWQ7Z0JBQ1lKLGFBQWFHLElBQWIsQ0FBa0IsTUFBbEIsRUFBMEJDLElBQTFCLENBQStCLFFBQS9CLENBQVo7Ozs7OztXQU1PQyxXQUFULEdBQXVCOztRQUVqQkMsU0FBU0osRUFBRSxrQkFBRixDQUFiO1dBQ09LLE1BQVAsQ0FBYyxVQUFVQyxRQUFWLEVBQW9CO1FBQzlCLElBQUYsRUFBUUMsUUFBUixDQUFpQixPQUFqQjtLQURGOztNQUlFQyxTQUFGLENBQVlDLFdBQVosQ0FBd0I7YUFDZixJQURlO2VBRWI7S0FGWDs7TUFLRUQsU0FBRixDQUFZRSxTQUFaLENBQXNCLFdBQXRCLEVBQW1DLFVBQVVDLE1BQVYs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