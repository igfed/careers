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
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });

    suggestions.locations.add(cities);

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvY2FyZWVycy5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL3NlYXJjaC5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgZmlsZSBpcyBmb3IgbWV0aG9kcyBhbmQgdmFyaWFibGVzIHRoYXQgYXJlIGdvaW5nIHRvIGJlXHJcbnVzZWZ1bCBhY3Jvc3MgYWxsIG1vZHVsZXMuIEluIG9yZGVyIHRvIHVzZSB0aGVtIGFueXdoZXJlLCBpbXBvcnQgd2l0aDpcclxuXHJcbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4gYW5kIHRoZW4gY2FsbCB3aXRoIHRoZSBpZyBuYW1lc3BhY2UgKGkuZS4sIGlnLnBhdGhuYW1lLCBpZy5sYW5nLCBldGMpXHJcbiAqL1xyXG5cclxuLy8gdXJsIHBhdGhcclxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XHJcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxufSkoKVxyXG5cclxuLy8gbGFuZ3VhZ2VcclxuZXhwb3J0IHZhciBsYW5nID0gKCgpID0+IHtcclxuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgIHJldHVybiAnZnInO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gJ2VuJztcclxuICB9XHJcbn0pKClcclxuXHJcbi8vIGJyb3dzZXIgd2lkdGhcclxuZXhwb3J0IHZhciBicm93c2VyV2lkdGggPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcclxufSkoKVxyXG5cclxuLy8gYmFzZSBldmVudEVtaXR0ZXJcclxuZXhwb3J0IHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICB2YXIgZW5kcG9pbnRVUkwsXHJcbiAgICBzdWNjZXNzVVJMLFxyXG4gICAgY2FuY2VsVVJMLFxyXG4gICAgJGZvcm0sXHJcbiAgICAkZm9ybVdyYXBwZXI7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xyXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcclxuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xyXG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcclxuXHJcbiAgICBfdmFsaWRhdGlvbigpO1xyXG4gICAgX3RvZ2dsZXIoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcclxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XHJcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZSxcclxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XHJcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcclxuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xyXG5cclxuICAgICRmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDYXJvdXNlbCBJbml0aWFsaXplZCEnKVxyXG5cclxuICAgIC8vIE5vdCBzdXJlIHdoYXQgdGhpcyBkb2VzIGF0IHRoaXMgcG9pbnQgb3IgaG93IGl0IHJlbGF0ZXMgdG8gQ2Fyb3VzZWxzXHJcbiAgICAkKCdbZGF0YS1yZXNwb25zaXZlLXRvZ2dsZV0gYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ3NpdGUtaGVhZGVyLWlzLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgX2J1aWxkQ2Fyb3VzZWwoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9idWlsZENhcm91c2VsKCkge1xyXG4gICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgbmV4dEFycm93LFxyXG4gICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgJCgnLmlnLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXHJcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxyXG4gICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgX2NhcmVlcnNMZWdhY3lDb2RlKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfY2FyZWVyc0xlZ2FjeUNvZGUoKSB7XHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuXHJcbiAgICAgICQuZm4uaW5mb1RvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyICRyZXZlYWwgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAkcmV2ZWFsQ29udGVudCA9ICRyZXZlYWwuZmluZCgnLmluZm8tdG9nZ2xlLWNvbnRlbnQnKSxcclxuICAgICAgICAgICAgJHJldmVhbFRyaWdnZXIgPSAkcmV2ZWFsLmZpbmQoJy5pbmZvLXRvZ2dsZS10cmlnZ2VyJyksXHJcbiAgICAgICAgICAgIGZpeGVkSGVpZ2h0ID0gZmFsc2UsXHJcbiAgICAgICAgICAgIHNldEFyaWEgPSAkcmV2ZWFsLmF0dHIoJ2luZm8tdG9nZ2xlLWFyaWEnKSA9PT0gJ3RydWUnO1xyXG5cclxuICAgICAgICAgIGluaXRUb2dnbGUoKTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBpbml0VG9nZ2xlKCkge1xyXG4gICAgICAgICAgICAkcmV2ZWFsVHJpZ2dlci5vbignY2xpY2snLCBoYW5kbGVSZXZlYWxUb2dnbGUpO1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXIpO1xyXG5cclxuICAgICAgICAgICAgc2V0UmV2ZWFsQ29udGVudEhlaWdodCgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVSZXZlYWxUb2dnbGUoKSB7XHJcbiAgICAgICAgICAgIHNldFJldmVhbENvbnRlbnRIZWlnaHQoKTtcclxuICAgICAgICAgICAgJHJldmVhbC50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHNldFJldmVhbENvbnRlbnRIZWlnaHQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIHJlc2l6ZUhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIGlmIChmaXhlZEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmNzcyh7IGhlaWdodDogJ2F1dG8nIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gc2V0UmV2ZWFsQ29udGVudEhlaWdodCgpIHtcclxuICAgICAgICAgICAgdmFyIGZpbmFsSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgaWYgKCRyZXZlYWwuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgZmluYWxIZWlnaHQgPSAkcmV2ZWFsQ29udGVudFswXS5zY3JvbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgZml4ZWRIZWlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGZpbmFsSGVpZ2h0ID0gMDtcclxuICAgICAgICAgICAgICBmaXhlZEhlaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmNzcyh7IGhlaWdodDogZmluYWxIZWlnaHQgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2V0QXJpYSkge1xyXG4gICAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgIWZpeGVkSGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfTtcclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuXHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuICAgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICAgJC5mbi5jaXJjbGVBbmltYXRpb24gPSBmdW5jdGlvbiAobWF4VmFsdWUpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyIGNhbnZhcyA9IHRoaXMsXHJcbiAgICAgICAgICAgICRjYW52YXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBjb250ZXh0LFxyXG4gICAgICAgICAgICBkID0gY2FudmFzLndpZHRoIC8gMixcclxuICAgICAgICAgICAgcGVyY2VudFN0cm9rZSA9IDcsXHJcbiAgICAgICAgICAgIHJlbWFpbmluZ1N0cm9rZSA9IDEsXHJcbiAgICAgICAgICAgIHJhZGl1cyA9IGQgLSBwZXJjZW50U3Ryb2tlLFxyXG4gICAgICAgICAgICBjdXJQZXJjID0gMCxcclxuICAgICAgICAgICAgY2lyYyA9IE1hdGguUEkgKiAyLFxyXG4gICAgICAgICAgICBxdWFydCA9IE1hdGguUEkgLyAyLFxyXG4gICAgICAgICAgICBkZWxlZ2F0ZUlEID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgKyAnQ0EnO1xyXG5cclxuICAgICAgICAgIGlmICghJGNhbnZhcy5pcygnY2FudmFzJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzBkMjYzYyc7XHJcbiAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjZTVlOGU4JztcclxuXHJcbiAgICAgICAgICAkY2FudmFzLmF0dHIoJ2NpcmNsZS1hbmltYXRpb24taWQnLCBkZWxlZ2F0ZUlEKTtcclxuICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZSgnW2NpcmNsZS1hbmltYXRpb24taWQ9JyArIGRlbGVnYXRlSUQgKyAnXScsICdzdGFydEFuaW1hdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGN1clBlcmMgPSAwO1xyXG4gICAgICAgICAgICBhbmltYXRlKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZSgnW2NpcmNsZS1hbmltYXRpb24taWQ9JyArIGRlbGVnYXRlSUQgKyAnXScsICdjbGVhckFuaW1hdGUnLCBjbGVhcik7XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZShjdXJyZW50KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50ID8gY3VycmVudCA6IDA7XHJcbiAgICAgICAgICAgIGNsZWFyKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gcGVyY2VudFN0cm9rZTtcclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1NYXRoLm1pbihjdXJyZW50LCBtYXhWYWx1ZSAvIDEwMCkpIC0gcXVhcnQsIHRydWUpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHJlbWFpbmluZ1N0cm9rZTtcclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1jdXJyZW50KSAtIHF1YXJ0LCB0cnVlKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICAgICAgY3VyUGVyYysrO1xyXG4gICAgICAgICAgICBpZiAoY3VyUGVyYyA8IDExMCkge1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZShjdXJQZXJjIC8gMTAwKVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gY2xlYXIoKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMud2lkdGgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfTtcclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAkLmZuLmJsb2NrTGluayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyICRibG9ja0xpbmsgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBkZXN0aW5hdGlvbiA9ICRibG9ja0xpbmsuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgICAgIC8vIGRlc3RpbmF0aW9uID0gJzQ0NDIuYXNweC8nICsgZGVzdGluYXRpb247XHJcbiAgICAgICAgICBpbml0QmxvY2soKTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBpbml0QmxvY2soKSB7XHJcbiAgICAgICAgICAgICRibG9ja0xpbmsub24oJ2NsaWNrJywgaGFuZGxlQ2xpY2spO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVDbGljaygpIHtcclxuICAgICAgICAgICAgLy9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgbG9jYXRpb24gPSBkZXN0aW5hdGlvbjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH07XHJcblxyXG4gICAgfSkoalF1ZXJ5KTtcclxuXHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuICAgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICAgdmFyIGd1aSxcclxuICAgICAgICB2aWRlbyxcclxuICAgICAgICBvdmVybGF5O1xyXG5cclxuICAgICAgaW5pdExlZ2FjeSgpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gaW5pdExlZ2FjeSgpIHtcclxuICAgICAgICAvLyBUaGlzIGlzIHdlaXJkIC0gbm90IGdvaW5nIHRvIHRvdWNoIGl0XHJcbiAgICAgICAgb3ZlcmxheSA9IG5ldyBPdmVybGF5TW9kdWxlKCk7XHJcbiAgICAgICAgZ3VpID0gbmV3IEd1aU1vZHVsZShvdmVybGF5KTtcclxuICAgICAgICAvLyB2aWRlbyA9IG5ldyBWaWRlb01vZHVsZSgpOyAvLyBSZXBsYWNlIHdpdGggdmlkZW8uanMgbW9kdWxlXHJcblxyXG4gICAgICAgIC8vIE5lZWQgdG8gaGF2ZSBhIGNsYXNzIHRvIGhvb2sgb250byBmb3IgRnJlbmNoIGxhbmd1YWdlIHBhZ2VcclxuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnZnInKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNtb290aCBzY3JvbGxpbmcgZm9yIGFuY2hvciBsaW5rc1xyXG4gICAgICAgICQoJ2FbaHJlZl49XCIjXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xyXG4gICAgICAgICAgaWYgKHRhcmdldC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgIHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcCArIDUyXHJcbiAgICAgICAgICAgIH0sIDc1MCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRhcmdldC5zZWxlY3RvciAhPT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgJCgnI21haW4tbWVudS1hbmNob3InKS5jc3MoeyAnZGlzcGxheSc6ICdub25lJyB9KTtcclxuICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdpcy1yZXZlYWwtb3BlbiBicmFuZGVkJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIE1vYmlsZSBtZW51IG5lZWRzIHRvIG1pbWljIEZvdW5kYXRpb24gcmV2ZWFsIC0gbm90IGVub3VnaCB0aW1lIHRvIGltcGxlbWVudCBkaWZmZXJlbnQgbmF2cyBpbiBhIHJldmVhbCBtb2RhbCBwcm9wZXJseVxyXG4gICAgICAgICQoJy5tZW51LWljb24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdpcy1yZXZlYWwtb3BlbiBicmFuZGVkJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHF1aWNrIGFuZCBkaXJ0eSBtb2JpbGUgbWVudSBjbG9zZXMgLSBub3QgZmFtaWxpYXIgd2l0aCBGb3VuZGF0aW9uIHBhdHRlcm4gdG8gZmlyZSB0aGVzZVxyXG4gICAgICAgICQoJy50b3AtYmFyIC5jbG9zZS1idXR0b24uc2hvdy1mb3Itc21hbGwtb25seScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQoJyNtYWluLW1lbnUtYW5jaG9yJykuY3NzKHsgJ2Rpc3BsYXknOiAnbm9uZScgfSk7XHJcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2lzLXJldmVhbC1vcGVuIGJyYW5kZWQnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA2NDApIHtcclxuICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdicmFuZGVkJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIEd1aU1vZHVsZShvdmVybGF5UmVmZXJlbmNlKSB7XHJcbiAgICAgICAgdmFyIG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IgPSAnW2NsYXNzKj1cInRvZ2dsZS1cIl06bm90KFtjbGFzcyo9XCJpbmZvLXRvZ2dsZVwiXSknLFxyXG4gICAgICAgICAgbXVsdGlUYWJDb250ZW50U2VsZWN0b3IgPSAnW2NsYXNzKj1cImNvbnRlbnQtXCJdJyxcclxuICAgICAgICAgIG11bHRpVGFiU2VsZWN0b3IgPSAnLm11bHRpLXRhYi1vdXRsaW5lJyxcclxuICAgICAgICAgICRlZGdlT3ZlcmxheUxvY2F0aW9uID0gJCgnI2VkZ2Utb3ZlcmxheS1jb250ZW50JyksXHJcbiAgICAgICAgICBvdmVybGF5ID0gb3ZlcmxheVJlZmVyZW5jZSxcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLFxyXG4gICAgICAgICAgJHByb2ZpbGVTbGlkZXIsXHJcbiAgICAgICAgICAkcHJvZmlsZVNsaWRlclZpZGVvU2VjdGlvbkhvbGRlciA9ICQoJzxkaXY+PC9kaXY+JyksXHJcbiAgICAgICAgICB3aW5kb3dTaXppbmdEZWxheSxcclxuICAgICAgICAgIHdpbmRvd1Njcm9sbGluZ0RlbGF5LFxyXG4gICAgICAgICAgb3ZlcmxheU9wZW4sXHJcbiAgICAgICAgICBpc1Jlc3BvbnNpdmVTdGF0ZSA9IGZhbHNlLFxyXG4gICAgICAgICAgc2Nyb2xsZWRUb1ZpZXcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaW5pdEd1aSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0R3VpKCkge1xyXG4gICAgICAgICAgYWRkTXVsdGlUYWJUb2dnbGVIYW5kbGVycygpO1xyXG4gICAgICAgICAgJCgnLmJsb2NrLWxpbmsnKS5ibG9ja0xpbmsoKTtcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyID0gJCgnLm91ci1idXNpbmVzcy1zbGlkZXInKTtcclxuICAgICAgICAgICQoJyNlZGdlLW92ZXJsYXktY29udGVudCcpLmZpbmQoJy5jYXJvdXNlbC1uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCdzbGlja05leHQnKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGlmICgkKFwiLnZpZGVvLXNsaWRlLnNsaWNrLWFjdGl2ZVwiKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJCgnLnNsaWNrLWxpc3QuZHJhZ2dhYmxlJykuY3NzKHsgaGVpZ2h0OiAnNjYwcHgnIH0pO1xyXG4gICAgICAgICAgICAkKCcuc2VjdGlvbi5wcm9maWxlcy1zbGlkZXInKS5jc3MoeyBiYWNrZ3JvdW5kQ29sb3I6ICcjZTVlOGU4JyB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy5zbGljay1saXN0LmRyYWdnYWJsZScpLmNzcyh7IGhlaWdodDogJ2F1dG8nIH0pO1xyXG4gICAgICAgICAgICAkKCcuc2VjdGlvbi5wcm9maWxlcy1zbGlkZXInKS5jc3MoeyBiYWNrZ3JvdW5kQ29sb3I6ICcjN2VjNGI5JyB9KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAkKCcucHJvZmlsZS1jb3VudGVyJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAkdGhpcy5maW5kKCdjYW52YXMnKS5jaXJjbGVBbmltYXRpb24ocGFyc2VJbnQoJHRoaXMuZmluZCgncCcpLmh0bWwoKSkpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICAkcHJvZmlsZVNsaWRlciA9ICQoJy5wcm9maWxlcy1zbGlkZXInKTtcclxuICAgICAgICAgICQod2luZG93KS5vbignaGFzaGNoYW5nZScsIGhhbmRsZU92ZXJsYXlGcm9tSGFzaCk7XHJcbiAgICAgICAgICBoYW5kbGVPdmVybGF5RnJvbUhhc2goKTtcclxuICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZGVsYXllZEhhbmRsZVdpbmRvd1NpemluZyk7XHJcbiAgICAgICAgICBoYW5kbGVXaW5kb3dTaXppbmcodHJ1ZSk7XHJcbiAgICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGRlbGF5ZWRIYW5kbGVXaW5kb3dTY3JvbGwpO1xyXG4gICAgICAgICAgaGFuZGxlV2luZG93U2Nyb2xsaW5nKCk7XHJcblxyXG4gICAgICAgICAgJCgnLmluZm8tdG9nZ2xlJykuaW5mb1RvZ2dsZSgpO1xyXG4gICAgICAgICAgJCgnLnRvcC1iYXIgKyAuc2NyZWVuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCdhW2RhdGEtdG9nZ2xlXScpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAvLyBOb3QgcHJldHR5IC0ganVzdCBhZGRpbmcgcXVpY2sgYW5kIGRpcnR5IHNoYXJlIGxpbmsgYWN0aW9uXHJcbiAgICAgICAgICAkKCcuc2hhcmUtdG9nZ2xlLXRyaWdnZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJy5pbmZvLXRvZ2dsZScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICQoJy5zaGFyZS10b2dnbGUtY2xvc2UnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJy5pbmZvLXRvZ2dsZScpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRNdWx0aVRhYlRvZ2dsZUhhbmRsZXJzKCkge1xyXG4gICAgICAgICAgJCgnYm9keScpLmRlbGVnYXRlKG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICB0b2dnbGVCYXNlID0gJHRoaXMuYXR0cignY2xhc3MnKS5tYXRjaCgvdG9nZ2xlLShcXFMqKT8oJHxcXHMpLylbMV0sXHJcbiAgICAgICAgICAgICAgJGNvbnRhaW5lciA9ICR0aGlzLnBhcmVudHMobXVsdGlUYWJTZWxlY3Rvcik7XHJcblxyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQobXVsdGlUYWJUb2dnbGVTZWxlY3RvcikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQobXVsdGlUYWJDb250ZW50U2VsZWN0b3IpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQoJy5jb250ZW50LScgKyB0b2dnbGVCYXNlKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZVByb2ZpbGVTbGlkZXIoKSB7XHJcbiAgICAgICAgICB2YXIgJHByb2ZpbGVQYW5lbHMsXHJcbiAgICAgICAgICAgIHByb2ZpbGVQYW5lbEhlaWdodCA9IDA7XHJcblxyXG4gICAgICAgICAgaWYgKHNjcm9sbGVkVG9WaWV3KSB7XHJcbiAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLmZpbmQoJy5zbGljay1zbGlkZScpLnJlbW92ZUNsYXNzKCdzbGljay1jb21wbGV0ZScpO1xyXG4gICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5maW5kKCcuc2xpY2stYWN0aXZlJykuYWRkQ2xhc3MoJ3NsaWNrLWNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgICRwcm9maWxlU2xpZGVyXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5zbGljay1zbGlkZTpub3QoLnNsaWNrLWNvbXBsZXRlKScpXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5wcm9maWxlLWNvdW50ZXIgY2FudmFzJylcclxuICAgICAgICAgICAgICAudHJpZ2dlcignY2xlYXJBbmltYXRlJyk7XHJcbiAgICAgICAgICAgICRwcm9maWxlU2xpZGVyXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5zbGljay1jb21wbGV0ZScpXHJcbiAgICAgICAgICAgICAgLmZpbmQoJy5wcm9maWxlLWNvdW50ZXIgY2FudmFzJylcclxuICAgICAgICAgICAgICAudHJpZ2dlcignc3RhcnRBbmltYXRlJyk7XHJcbiAgICAgICAgICAgIGlmICgkcHJvZmlsZVNsaWRlci5maW5kKCcuc2xpY2stYWN0aXZlJykuaXMoJ1tjbGFzcyo9cHJvZmlsZS1dJykgfHwgaXNSZXNwb25zaXZlU3RhdGUpIHtcclxuICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5hZGRDbGFzcygnY29udHJhc3QtYXJyb3cnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5yZW1vdmVDbGFzcygnY29udHJhc3QtYXJyb3cnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkcHJvZmlsZVBhbmVscyA9ICRwcm9maWxlU2xpZGVyLmZpbmQoJy5wcm9maWxlLTEtc2xpZGUsIC5wcm9maWxlLTItc2xpZGUnKTtcclxuICAgICAgICAgICAgJHByb2ZpbGVQYW5lbHMuY3NzKHsgaGVpZ2h0OiAnYXV0bycgfSk7XHJcbiAgICAgICAgICAgICRwcm9maWxlUGFuZWxzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gJCh0aGlzKS5vdXRlckhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgICBpZiAoY3VycmVudCA+IHByb2ZpbGVQYW5lbEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgcHJvZmlsZVBhbmVsSGVpZ2h0ID0gY3VycmVudDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkcHJvZmlsZVBhbmVscy5jc3MoeyBoZWlnaHQ6IHByb2ZpbGVQYW5lbEhlaWdodCB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZVNsaWRlclN0YXRlKHNsaWRlciwgc3RhdGUpIHtcclxuICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwiYWNjZXNzaWJpbGl0eVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcImRyYWdnYWJsZVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcInN3aXBlXCIsIHN0YXRlKTtcclxuICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwidG91Y2hNb3ZlXCIsIHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWRIYW5kbGVXaW5kb3dTaXppbmcoKSB7XHJcbiAgICAgICAgICBpZiAod2luZG93U2l6aW5nRGVsYXkpIHtcclxuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh3aW5kb3dTaXppbmdEZWxheSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgd2luZG93U2l6aW5nRGVsYXkgPSB3aW5kb3cuc2V0VGltZW91dChoYW5kbGVXaW5kb3dTaXppbmcsIDI1MCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkZWxheWVkSGFuZGxlV2luZG93U2Nyb2xsKCkge1xyXG4gICAgICAgICAgaWYgKHdpbmRvd1Njcm9sbGluZ0RlbGF5KSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQod2luZG93U2Nyb2xsaW5nRGVsYXkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHdpbmRvd1Njcm9sbGluZ0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQoaGFuZGxlV2luZG93U2Nyb2xsaW5nLCAyNTApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUZyb21IYXNoKGV2ZW50KSB7XHJcbiAgICAgICAgICB2YXIgZnVsbEhhc2hGcmFnbWVudCA9ICcjb3VyLWVkZ2UtJztcclxuICAgICAgICAgIC8vZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBpZiAoIW92ZXJsYXlPcGVuICYmIGxvY2F0aW9uLmhhc2guaW5kZXhPZihmdWxsSGFzaEZyYWdtZW50KSA9PT0gMCkge1xyXG4gICAgICAgICAgICBvdmVybGF5Lm9wZW5PdmVybGF5KFxyXG4gICAgICAgICAgICAgICRlZGdlT3ZlcmxheUxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgIGhhbmRsZU92ZXJsYXlPcGVuLCBoYW5kbGVPdmVybGF5Q2xvc2UsIHRydWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheU9wZW4oZXZlbnQpIHtcclxuICAgICAgICAgIHZhciBpbml0aWFsSW5kZXg7XHJcblxyXG4gICAgICAgICAgaW5pdFNsaWRlcigkb3ZlcmxheVNsaWRlciwge1xyXG4gICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgaW5pdGlhbEluZGV4ID0gJG92ZXJsYXlTbGlkZXJcclxuICAgICAgICAgICAgLmZpbmQoJy4nICsgbG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjb3VyLScsICcnKSArICc6bm90KC5zbGljay1jbG9uZWQpJylcclxuICAgICAgICAgICAgLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnKTtcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCdzbGlja0dvVG8nLCBpbml0aWFsSW5kZXgsIHRydWUpO1xyXG4gICAgICAgICAgJG92ZXJsYXlTbGlkZXIub24oJ2FmdGVyQ2hhbmdlJywgaGFuZGxlU2xpZGVDaGFuZ2UpO1xyXG4gICAgICAgICAgaGFuZGxlU2xpZGVDaGFuZ2UobnVsbCwgbnVsbCwgcGFyc2VJbnQoJCgnI21vZGFsT3ZlcmxheSAuc2xpY2stYWN0aXZlJykuYXR0cignZGF0YS1zbGljay1pbmRleCcpKSk7XHJcbiAgICAgICAgICBoYW5kbGVXaW5kb3dTaXppbmcoKTtcclxuICAgICAgICAgIG92ZXJsYXlPcGVuID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlDbG9zZShldmVudCkge1xyXG4gICAgICAgICAgdmFyIHlQb3MsXHJcbiAgICAgICAgICAgIG92ZXJsYXlDb250ZW50ID0gJCgnI21vZGFsT3ZlcmxheSA+IGRpdicpO1xyXG5cclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCd1bnNsaWNrJyk7XHJcbiAgICAgICAgICAkb3ZlcmxheVNsaWRlci5vZmYoJ2FmdGVyQ2hhbmdlJyk7XHJcbiAgICAgICAgICAkKCcub3ZlcmxheS1yZXBvc2l0b3J5JykuYXBwZW5kKG92ZXJsYXlDb250ZW50KTtcclxuICAgICAgICAgIGlmIChcInB1c2hTdGF0ZVwiIGluIGhpc3RvcnkpXHJcbiAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKFwiXCIsIGRvY3VtZW50LnRpdGxlLCBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCk7XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgeVBvcyA9ICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gXCJcIjtcclxuICAgICAgICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKHlQb3MpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3ZlcmxheU9wZW4gPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVNsaWRlQ2hhbmdlKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlKSB7XHJcbiAgICAgICAgICB2YXIgbmV4dFNsaWRlID0gKGN1cnJlbnRTbGlkZSArIDEpICUgKCQoJy5zbGljay1zbGlkZTpub3QoLnNsaWNrLWNsb25lZCknKS5sZW5ndGggLSAxKSxcclxuICAgICAgICAgICAgbmV4dFRpdGxlID0gJCgkb3ZlcmxheVNsaWRlci5maW5kKCdbZGF0YS1zbGljay1pbmRleD0nICsgbmV4dFNsaWRlICsgJ10gLmNvbHVtbnM6Zmlyc3QtY2hpbGQgcCcpLmdldCgwKSkuaHRtbCgpLFxyXG4gICAgICAgICAgICBuZXdIYXNoID0gJ291ci0nICsgJG92ZXJsYXlTbGlkZXJcclxuICAgICAgICAgICAgICAgIC5maW5kKCdbZGF0YS1zbGljay1pbmRleD0nICsgY3VycmVudFNsaWRlICsgJ10nKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJylcclxuICAgICAgICAgICAgICAgIC5tYXRjaCgvKGVkZ2UtXFxTKikvKVsxXTtcclxuXHJcbiAgICAgICAgICAkKCcjbW9kYWxPdmVybGF5IC5jYXJvdXNlbC1uZXh0IGEnKS5odG1sKG5leHRUaXRsZSk7XHJcbiAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gbmV3SGFzaDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVdpbmRvd1NpemluZyhpbml0KSB7XHJcbiAgICAgICAgICB2YXIgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZUxpbWl0ID0gMCxcclxuICAgICAgICAgICAgbmV3SXNSZXNwb25zaXZlU3RhdGUgPSB3aW5kb3dXaWR0aCA8IHJlc3BvbnNpdmVMaW1pdDtcclxuXHJcbiAgICAgICAgICBpZiAoJG92ZXJsYXlTbGlkZXIuaXMoJy5zbGljay1pbml0aWFsaXplZCcpKSB7XHJcbiAgICAgICAgICAgIGNoYW5nZVNsaWRlclN0YXRlKCRvdmVybGF5U2xpZGVyLCAhbmV3SXNSZXNwb25zaXZlU3RhdGUpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChpc1Jlc3BvbnNpdmVTdGF0ZSAhPT0gbmV3SXNSZXNwb25zaXZlU3RhdGUpIHtcclxuICAgICAgICAgICAgaXNSZXNwb25zaXZlU3RhdGUgPSBuZXdJc1Jlc3BvbnNpdmVTdGF0ZTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoaW5pdCkge1xyXG4gICAgICAgICAgICBpbml0UHJvZmlsZVNsaWRlcigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlV2luZG93U2Nyb2xsaW5nKCkge1xyXG4gICAgICAgICAgaWYgKCFzY3JvbGxlZFRvVmlldykge1xyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpID4gJHByb2ZpbGVTbGlkZXIub2Zmc2V0KCkudG9wKSB7XHJcbiAgICAgICAgICAgICAgc2Nyb2xsZWRUb1ZpZXcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGFuaW1hdGVQcm9maWxlU2xpZGVyLCA1MDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0UHJvZmlsZVNsaWRlcigpIHtcclxuICAgICAgICAgIGluaXRTbGlkZXIoJHByb2ZpbGVTbGlkZXIsIHtcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6IHRydWUsXHJcbiAgICAgICAgICAgIHByZXZBcnJvdzogJzxzcGFuIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNhcm91c2VsLXByZXZcIj48aW1nIHNyYz1cIi9jb250ZW50L2RhbS9pbnZlc3RvcnNncm91cC9hcHAvY2FyZWVycy9pbWFnZXMvQXJyb3ctTWFpbkFydGljbGUtQ2Fyb3VzZWwtQmxhY2stTC5wbmdcIj48L3NwYW4+JyxcclxuICAgICAgICAgICAgbmV4dEFycm93OiAnPHNwYW4gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2Fyb3VzZWwtbmV4dFwiPjxpbWcgc3JjPVwiL2NvbnRlbnQvZGFtL2ludmVzdG9yc2dyb3VwL2FwcC9jYXJlZXJzL2ltYWdlcy9BcnJvdy1NYWluQXJ0aWNsZS1DYXJvdXNlbC1CbGFjay1SLnBuZ1wiPjwvc3Bhbj4nXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGFuaW1hdGVQcm9maWxlU2xpZGVyKCk7XHJcbiAgICAgICAgICAkcHJvZmlsZVNsaWRlci5vbignYWZ0ZXJDaGFuZ2UnLCBhbmltYXRlUHJvZmlsZVNsaWRlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0U2xpZGVyKHRhcmdldCwgb3B0aW9ucykge1xyXG4gICAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICBzcGVlZDogNzUwLFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXHJcbiAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAyLFxyXG4gICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2OCxcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHRhcmdldC5zbGljaygkLmV4dGVuZChkZWZhdWx0cywgb3B0aW9ucykpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gT3ZlcmxheU1vZHVsZSgpIHtcclxuICAgICAgICB2YXIgJG92ZXJsYXksXHJcbiAgICAgICAgICAkYm9keSA9ICQoJ2JvZHknKSxcclxuICAgICAgICAgIG92ZXJsYXlTaXppbmdEZWxheSxcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZSA9IHt9LFxyXG4gICAgICAgICAgaXNPcGVuRmxhZyA9IGZhbHNlLFxyXG4gICAgICAgICAgJGNsb3NlQnV0dG9uO1xyXG5cclxuICAgICAgICBpbml0T3ZlcmxheSgpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgb3Blbk92ZXJsYXk6IG9wZW5PdmVybGF5LFxyXG4gICAgICAgICAgaXNPcGVuOiBpc09wZW5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0T3ZlcmxheSgpIHtcclxuICAgICAgICAgICRvdmVybGF5ID0gJCgnPGRpdj48L2Rpdj4nKTtcclxuICAgICAgICAgICRvdmVybGF5LmF0dHIoJ2lkJywgJ21vZGFsT3ZlcmxheScpO1xyXG4gICAgICAgICAgJG92ZXJsYXkuYXR0cignY2xhc3MnLCAncmV2ZWFsJyk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5hdHRyKCdkYXRhLXJldmVhbCcsIHRydWUpO1xyXG4gICAgICAgICAgJGJvZHkuYXBwZW5kKCRvdmVybGF5KTtcclxuICAgICAgICAgICRvdmVybGF5Lm9uKCdvcGVuLnpmLnJldmVhbCcsIGhhbmRsZU92ZXJsYXlPcGVuKTtcclxuICAgICAgICAgICQod2luZG93KS5vbignY2xvc2VkLnpmLnJldmVhbCcsIGhhbmRsZU92ZXJsYXlDbG9zZSk7XHJcbiAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGRlbGF5ZWRIYW5kbGVPdmVybGF5U2l6aW5nKTtcclxuICAgICAgICAgIGluaXRDbG9zZUJ1dHRvbigpO1xyXG4gICAgICAgICAgbmV3IEZvdW5kYXRpb24uUmV2ZWFsKCRvdmVybGF5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZGVsYXllZEhhbmRsZU92ZXJsYXlTaXppbmcoKSB7XHJcbiAgICAgICAgICBpZiAob3ZlcmxheVNpemluZ0RlbGF5KSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQob3ZlcmxheVNpemluZ0RlbGF5KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBvdmVybGF5U2l6aW5nRGVsYXkgPSB3aW5kb3cuc2V0VGltZW91dChvdmVybGF5U2l6aW5nLCAyNTApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUNsb3NlKGV2ZW50KSB7XHJcbiAgICAgICAgICBpc09wZW5GbGFnID0gZmFsc2U7XHJcbiAgICAgICAgICBpZiAoY3VycmVudEluc3RhbmNlLmNsb3NlKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5jbG9zZShldmVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvdmVybGF5U2l6ZUNsZWFudXAoKTtcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZSA9IHt9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheU9wZW4oZXZlbnQpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBpc09wZW5GbGFnID0gdHJ1ZTtcclxuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICAgICRvdmVybGF5LmZpbmQoJyonKS5mb3VuZGF0aW9uKCk7XHJcbiAgICAgICAgICBpZiAoY3VycmVudEluc3RhbmNlLm9wZW4pIHtcclxuICAgICAgICAgICAgY3VycmVudEluc3RhbmNlLm9wZW4oZXZlbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3ZlcmxheVNpemluZygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdENsb3NlQnV0dG9uKCkge1xyXG4gICAgICAgICAgdmFyICRpbm5lclNwYW4gPSAkKCc8c3Bhbj48L3NwYW4+Jyk7XHJcblxyXG4gICAgICAgICAgJGNsb3NlQnV0dG9uID0gJCgnPGJ1dHRvbiBkYXRhLWNsb3NlPjwvYnV0dG9uPicpO1xyXG4gICAgICAgICAgJGNsb3NlQnV0dG9uLmFkZENsYXNzKCdjbG9zZS1idXR0b24nKTtcclxuICAgICAgICAgICRjbG9zZUJ1dHRvbi5hdHRyKCdhcmlhLWxhYmVsJywgJ0Nsb3NlIG1vZGFsJyk7XHJcbiAgICAgICAgICAkaW5uZXJTcGFuLmF0dHIoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XHJcbiAgICAgICAgICAkaW5uZXJTcGFuLmh0bWwoJyZ0aW1lczsnKTtcclxuICAgICAgICAgICRjbG9zZUJ1dHRvbi5hcHBlbmQoJGlubmVyU3Bhbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc09wZW4oKSB7XHJcbiAgICAgICAgICByZXR1cm4gaXNPcGVuRmxhZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5PdmVybGF5KHVybE9yTWFya3VwLCBvcGVuQ2FsbGJhY2ssIGNsb3NlQ2FsbGJhY2ssIGZ1bGxTY3JlZW4pIHtcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5vcGVuID0gb3BlbkNhbGxiYWNrO1xyXG4gICAgICAgICAgY3VycmVudEluc3RhbmNlLmNsb3NlID0gY2xvc2VDYWxsYmFjaztcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5mdWxsID0gZnVsbFNjcmVlbjtcclxuICAgICAgICAgIGlmICh0eXBlb2YgdXJsT3JNYXJrdXAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIG9wZW5PdmVybGF5V2l0aEFqYXgodXJsT3JNYXJrdXApO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3Blbk92ZXJsYXlXaXRoTWFya3VwKHVybE9yTWFya3VwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvcGVuT3ZlcmxheVdpdGhBamF4KHVybCkge1xyXG4gICAgICAgICAgJC5hamF4KHVybCkuZG9uZShvcGVuT3ZlcmxheVdpdGhNYXJrdXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb3Blbk92ZXJsYXlXaXRoTWFya3VwKG1hcmt1cCkge1xyXG4gICAgICAgICAgJG92ZXJsYXkuaHRtbChtYXJrdXApO1xyXG4gICAgICAgICAgJG92ZXJsYXkuYXBwZW5kKCRjbG9zZUJ1dHRvbik7XHJcbiAgICAgICAgICBpZiAoY3VycmVudEluc3RhbmNlLmZ1bGwpIHtcclxuICAgICAgICAgICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ2Z1bGwnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICRvdmVybGF5LmZvdW5kYXRpb24oJ29wZW4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG92ZXJsYXlTaXplQ2xlYW51cCgpIHtcclxuICAgICAgICAgICRvdmVybGF5LnJlbW92ZUNsYXNzKCdmdWxsJyk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5yZW1vdmVDbGFzcygndG91cicpO1xyXG4gICAgICAgICAgJG92ZXJsYXkuaHRtbCgnJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvdmVybGF5U2l6aW5nKCkge1xyXG4gICAgICAgICAgdmFyIG92ZXJsYXlIZWlnaHQgPSAkb3ZlcmxheS5oZWlnaHQoKSxcclxuICAgICAgICAgICAgd2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG5cclxuICAgICAgICAgIGlmIChvdmVybGF5SGVpZ2h0ID4gd2luZG93SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICRvdmVybGF5LmNzcyh7XHJcbiAgICAgICAgICAgICAgdG9wOiAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkb3ZlcmxheS5hZGRDbGFzcygnZnVsbCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH0pKGpRdWVyeSk7XHJcblxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgdmFyIHZpZHMgPSBbXSwgYnJpZ2h0Q292ZTtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIF9wYXJzZVZpZGVvcygpO1xyXG5cclxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgVmlkZW9KUyBtZXRob2QgaXMgYXZhaWxhYmxlIGFuZCBmaXJlIHJlYWR5IGV2ZW50IGhhbmRsZXJzIGlmIHNvXHJcbiAgICAvLyBicmlnaHRDb3ZlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gICBpZiAoJCgnLnZqcy1wbHVnaW5zLXJlYWR5JykubGVuZ3RoKSB7XHJcbiAgICAvLyAgICAgX2JyaWdodENvdmVSZWFkeSgpO1xyXG4gICAgLy8gICAgIGNsZWFySW50ZXJ2YWwoYnJpZ2h0Q292ZSk7XHJcbiAgICAvLyAgIH1cclxuICAgIC8vIH0sIDUwMClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wYXJzZVZpZGVvcygpIHtcclxuICAgIHZhciAkZ3JvdXAsXHJcbiAgICAgICR2aWRlbyxcclxuICAgICAgZGF0YSA9IHt9LFxyXG4gICAgICBwcmVsb2FkT3B0aW9ucyA9IFsnYXV0bycsICdtZXRhZGF0YScsICdub25lJ11cclxuXHJcbiAgICAvLyBFYWNoIGdyb3VwIGNhbiBlZmZlY3RpdmVseSB1c2UgYSBkaWZmZXJlbnQgcGxheWVyIHdoaWNoIHdpbGwgb25seSBiZSBsb2FkZWQgb25jZVxyXG4gICAgJCgnLmlnLXZpZGVvLWdyb3VwJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRncm91cCA9ICQodGhpcyk7XHJcbiAgICAgIGRhdGEuYWNjb3VudCA9ICRncm91cC5kYXRhKCdhY2NvdW50Jyk7XHJcbiAgICAgIGRhdGEucGxheWVyID0gJGdyb3VwLmRhdGEoJ3BsYXllcicpO1xyXG5cclxuICAgICAgLy8gTG9hZCByZXF1aXJlZCBKUyBmb3IgYSBwbGF5ZXJcclxuICAgICAgX2luamVjdEJyaWdodENvdmVKUyhkYXRhKTtcclxuXHJcbiAgICAgIC8vIExvb3AgdGhyb3VnaCB2aWRlbydzXHJcbiAgICAgICRncm91cC5maW5kKCcuaWctdmlkZW8tanMnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICR2aWRlbyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyAocmVxdWlyZWQpXHJcbiAgICAgICAgZGF0YS5pZCA9ICR2aWRlby5kYXRhKCdpZCcpO1xyXG5cclxuICAgICAgICAvLyBDYXB0dXJlIG9wdGlvbnMgKG9wdGlvbmFsKVxyXG4gICAgICAgIGRhdGEudGl0bGUgPSAkdmlkZW8uZGF0YSgndGl0bGUnKSA/ICR2aWRlby5kYXRhKCd0aXRsZScpIDogJyc7XHJcbiAgICAgICAgZGF0YS5kZXNjcmlwdGlvbiA9ICR2aWRlby5kYXRhKCdkZXNjcmlwdGlvbicpID8gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgOiAnJztcclxuICAgICAgICBkYXRhLmF1dG8gPSAkdmlkZW8uZGF0YSgnYXV0b3BsYXknKSA/ICdhdXRvcGxheScgOiAnJztcclxuICAgICAgICBkYXRhLmN0cmwgPSAkdmlkZW8uZGF0YSgnY29udHJvbHMnKSA/ICdjb250cm9scycgOiAnJztcclxuICAgICAgICBkYXRhLnByZWxvYWQgPSAocHJlbG9hZE9wdGlvbnMuaW5kZXhPZigkdmlkZW8uZGF0YSgncHJlbG9hZCcpKSA+IC0xKSA/ICR2aWRlby5kYXRhKCdwcmVsb2FkJykgOiAnYXV0byc7XHJcblxyXG4gICAgICAgIC8vIFN0b3JlIElEJ3MgZm9yIGFsbCB2aWRlbydzIG9uIHRoZSBwYWdlIC0gaW4gY2FzZSB3ZSB3YW50IHRvIHJ1biBhIHBvc3QtbG9hZCBwcm9jZXNzIG9uIGVhY2hcclxuICAgICAgICB2aWRzLnB1c2goZGF0YS5pZCk7XHJcblxyXG4gICAgICAgIC8vIExldCdzIHJlcGxhY2UgdGhlIGlnLXZpZGVvLWpzICdkaXJlY3RpdmUnIHdpdGggdGhlIG5lY2Vzc2FyeSBCcmlnaHRjb3ZlIGNvZGVcclxuICAgICAgICBfaW5qZWN0VGVtcGxhdGUoJHZpZGVvLCBkYXRhLCBpbmRleClcclxuICAgICAgfSk7XHJcblxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9pbmplY3RCcmlnaHRDb3ZlSlMoZGF0YSkge1xyXG4gICAgdmFyIGluZGV4anMgPSBgPHNjcmlwdCBzcmM9XCIvL3BsYXllcnMuYnJpZ2h0Y292ZS5uZXQvJHtkYXRhLmFjY291bnR9LyR7ZGF0YS5wbGF5ZXJ9X2RlZmF1bHQvaW5kZXgubWluLmpzXCI+PC9zY3JpcHQ+YDtcclxuICAgICQoJ2JvZHknKS5hcHBlbmQoaW5kZXhqcyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfaW5qZWN0VGVtcGxhdGUoJHZpZGVvLCBkYXRhLCBpbmRleCkge1xyXG4gICAgdmFyIGh0bWwgPSBgPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lclwiPjxzcGFuIGNsYXNzPVwidmlkZW8tb3ZlcmxheSAke2RhdGEuaWR9XCI+PC9zcGFuPjxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXItcmVzcG9uc2l2ZVwiPjx2aWRlbyBkYXRhLXZpZGVvLWlkPVwiJHtkYXRhLmlkfVwiIHByZWxvYWQ9XCIke2RhdGEucHJlbG9hZH1cIiBkYXRhLWFjY291bnQ9XCIke2RhdGEuYWNjb3VudH1cIiBkYXRhLXBsYXllcj1cIiR7ZGF0YS5wbGF5ZXJ9XCIgZGF0YS1lbWJlZD1cImRlZmF1bHRcIiBkYXRhLWFwcGxpY2F0aW9uLWlkPVwiJHtpbmRleH1cIiBjbGFzcz1cInZpZGVvLWpzXCIgaWQ9XCIke2RhdGEuaWR9XCIgJHtkYXRhLmN0cmx9ICR7ZGF0YS5hdXRvfT48L3ZpZGVvPjwvZGl2PjwvZGl2PjxoMiBjbGFzcz1cInZpZGVvLXRpdGxlXCI+JHtkYXRhLnRpdGxlfTwvaDI+PHAgY2xhc3M9XCJ2aWRlby1kZXNjcmlwdGlvblwiPiR7ZGF0YS5kZXNjcmlwdGlvbn08L3A+YDtcclxuICAgICR2aWRlby5yZXBsYWNlV2l0aChodG1sKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9icmlnaHRDb3ZlUmVhZHkoKSB7XHJcbiAgICB2aWRzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgIHZpZGVvanMoJyMnICsgZWwpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyAkKCcudmlkZW8tb3ZlcmxheS4nKyBlbCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgX3NlYXJjaExlZ2FjeUNvZGUoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zZWFyY2hMZWdhY3lDb2RlKCkge1xyXG5cclxuLy8gR0xPQkFMU1xyXG4gICAgdmFyIG1vZGVsVXJsID0gJ2h0dHBzOi8vc2VhcmNoLmludmVzdG9yc2dyb3VwLmNvbS9hcGkvY3dwc2VhcmNoPyc7XHJcbiAgICB2YXIgJGZpZWxkID0gJCgnI0ZpbmRBbk9mZmljZScpO1xyXG4gICAgdmFyIGxhbmcgPSAnZW4nO1xyXG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJy9mci8nKSA+IC0xKSB7XHJcbiAgICAgIGxhbmcgPSAnZnInO1xyXG4gICAgfVxyXG5cclxuLy8gUHJvY2VzcyB0aGUgbG9jYWwgcHJlZmV0Y2hlZCBkYXRhXHJcbiAgICB2YXIgc3VnZ2VzdGlvbnMgPSB7fTtcclxuICAgIHZhciBjaXRpZXMgPSBbXHJcbiAgICAgIFwiYXRoYWJhc2NhXCIsXHJcbiAgICAgIFwiYmx1ZmZ0b25cIixcclxuICAgICAgXCJib25ueXZpbGxlXCIsXHJcbiAgICAgIFwiYnJvb2tzXCIsXHJcbiAgICAgIFwiY2FsZ2FyeVwiLFxyXG4gICAgICBcImNhbXJvc2VcIixcclxuICAgICAgXCJjYW5tb3JlXCIsXHJcbiAgICAgIFwiZHJheXRvbiB2YWxsZXlcIixcclxuICAgICAgXCJlZG1vbnRvblwiLFxyXG4gICAgICBcImZvcnQgbWNtdXJyYXlcIixcclxuICAgICAgXCJmb3J0IHNhc2thdGNoZXdhblwiLFxyXG4gICAgICBcImdyYW5kZSBwcmFpcmllXCIsXHJcbiAgICAgIFwiaGFsa2lya1wiLFxyXG4gICAgICBcImhpbGxjcmVzdCBtaW5lc1wiLFxyXG4gICAgICBcImhpbnRvblwiLFxyXG4gICAgICBcImxlZHVjXCIsXHJcbiAgICAgIFwibGV0aGJyaWRnZVwiLFxyXG4gICAgICBcImxsb3lkbWluc3RlclwiLFxyXG4gICAgICBcIm1lZGljaW5lIGhhdFwiLFxyXG4gICAgICBcIm1vcmludmlsbGVcIixcclxuICAgICAgXCJwZWFjZSByaXZlclwiLFxyXG4gICAgICBcInBpbmNoZXIgY3JlZWtcIixcclxuICAgICAgXCJwcm92b3N0XCIsXHJcbiAgICAgIFwicmVkIGRlZXJcIixcclxuICAgICAgXCJzaGVyd29vZCBwYXJrXCIsXHJcbiAgICAgIFwic3BydWNlIGdyb3ZlXCIsXHJcbiAgICAgIFwic3QuIGFsYmVydFwiLFxyXG4gICAgICBcInN0ZXR0bGVyXCIsXHJcbiAgICAgIFwic3R1cmdlb24gY291bnR5XCIsXHJcbiAgICAgIFwidG9maWVsZFwiLFxyXG4gICAgICBcInZlcm1pbGlvblwiLFxyXG4gICAgICBcIndhaW53cmlnaHRcIixcclxuICAgICAgXCJ3ZXN0bG9ja1wiLFxyXG4gICAgICBcIndoaXRlbGF3XCIsXHJcbiAgICAgIFwiYWJib3RzZm9yZFwiLFxyXG4gICAgICBcImJyYWNrZW5kYWxlXCIsXHJcbiAgICAgIFwiYnVybmFieVwiLFxyXG4gICAgICBcImJ1cm5zIGxha2VcIixcclxuICAgICAgXCJjYW1wYmVsbCByaXZlclwiLFxyXG4gICAgICBcImNoYXNlXCIsXHJcbiAgICAgIFwiY2hpbGxpd2Fja1wiLFxyXG4gICAgICBcImNvbW94XCIsXHJcbiAgICAgIFwiY29xdWl0bGFtXCIsXHJcbiAgICAgIFwiY291cnRlbmF5XCIsXHJcbiAgICAgIFwiY3JhbmJyb29rXCIsXHJcbiAgICAgIFwiZGF3c29uIGNyZWVrXCIsXHJcbiAgICAgIFwiZHVuY2FuXCIsXHJcbiAgICAgIFwiZm9ydCBuZWxzb25cIixcclxuICAgICAgXCJmb3J0IHN0LiBqb2huXCIsXHJcbiAgICAgIFwiaW52ZXJtZXJlXCIsXHJcbiAgICAgIFwia2FtbG9vcHNcIixcclxuICAgICAgXCJrZWxvd25hXCIsXHJcbiAgICAgIFwibGFuZ2xleVwiLFxyXG4gICAgICBcIm1lcnJpdHRcIixcclxuICAgICAgXCJuYW5haW1vXCIsXHJcbiAgICAgIFwibmVsc29uXCIsXHJcbiAgICAgIFwibm9ydGggdmFuY291dmVyXCIsXHJcbiAgICAgIFwib2xpdmVyXCIsXHJcbiAgICAgIFwicGVudGljdG9uXCIsXHJcbiAgICAgIFwicG9ydCBhbGJlcm5pXCIsXHJcbiAgICAgIFwicG93ZWxsIHJpdmVyXCIsXHJcbiAgICAgIFwicHJpbmNlIGdlb3JnZVwiLFxyXG4gICAgICBcInF1YWxpY3VtIGJlYWNoXCIsXHJcbiAgICAgIFwicXVlc25lbFwiLFxyXG4gICAgICBcInJldmVsc3Rva2VcIixcclxuICAgICAgXCJyaWNobW9uZFwiLFxyXG4gICAgICBcInNhYW5pY2h0b25cIixcclxuICAgICAgXCJzYWxtb24gYXJtXCIsXHJcbiAgICAgIFwic2FsdCBzcHJpbmcgaXNsYW5kXCIsXHJcbiAgICAgIFwic2VjaGVsdFwiLFxyXG4gICAgICBcInNpZG5leVwiLFxyXG4gICAgICBcInNtaXRoZXJzXCIsXHJcbiAgICAgIFwic3VycmV5XCIsXHJcbiAgICAgIFwidGVycmFjZVwiLFxyXG4gICAgICBcInRyYWlsXCIsXHJcbiAgICAgIFwidmFuY291dmVyXCIsXHJcbiAgICAgIFwidmVybm9uXCIsXHJcbiAgICAgIFwidmljdG9yaWFcIixcclxuICAgICAgXCJ3ZXN0YmFua1wiLFxyXG4gICAgICBcIndpbGxpYW1zIGxha2VcIixcclxuICAgICAgXCJicmFuZG9uXCIsXHJcbiAgICAgIFwiZGF1cGhpblwiLFxyXG4gICAgICBcImZsaW4gZmxvblwiLFxyXG4gICAgICBcImdpbGxhbVwiLFxyXG4gICAgICBcImtpbGxhcm5leVwiLFxyXG4gICAgICBcIm1hbml0b3VcIixcclxuICAgICAgXCJtaWFtaVwiLFxyXG4gICAgICBcIm1vcmRlblwiLFxyXG4gICAgICBcIm5hcm9sXCIsXHJcbiAgICAgIFwicG9ydGFnZSBsYSBwcmFpcmllXCIsXHJcbiAgICAgIFwic2Vsa2lya1wiLFxyXG4gICAgICBcInN3YW4gcml2ZXJcIixcclxuICAgICAgXCJ0aGUgcGFzXCIsXHJcbiAgICAgIFwidmlyZGVuXCIsXHJcbiAgICAgIFwid2FycmVuXCIsXHJcbiAgICAgIFwid2lubmlwZWdcIixcclxuICAgICAgXCJiYXRodXJzdFwiLFxyXG4gICAgICBcImJlZGVsbFwiLFxyXG4gICAgICBcImVkbXVuZHN0b25cIixcclxuICAgICAgXCJmcmVkZXJpY3RvblwiLFxyXG4gICAgICBcImxhbnNkb3duZVwiLFxyXG4gICAgICBcIm1pcmFtaWNoaVwiLFxyXG4gICAgICBcIm1vbmN0b25cIixcclxuICAgICAgXCJxdWlzcGFtc2lzXCIsXHJcbiAgICAgIFwicmV4dG9uXCIsXHJcbiAgICAgIFwicm90aGVzYXlcIixcclxuICAgICAgXCJzYWludCBqb2huXCIsXHJcbiAgICAgIFwic2FpbnQgcGF1bFwiLFxyXG4gICAgICBcInN1c3NleFwiLFxyXG4gICAgICBcImJsYWtldG93blwiLFxyXG4gICAgICBcImNsYXJlbnZpbGxlXCIsXHJcbiAgICAgIFwiY29ybmVyIGJyb29rXCIsXHJcbiAgICAgIFwiZ2FuZGVyXCIsXHJcbiAgICAgIFwiZ3JhbmQgZmFsbHMgLSB3aW5kc29yXCIsXHJcbiAgICAgIFwibWFyeXN0b3duXCIsXHJcbiAgICAgIFwicm9hY2hlcyBsaW5lXCIsXHJcbiAgICAgIFwic3QuIGpvaG4nc1wiLFxyXG4gICAgICBcInRyaW5pdHlcIixcclxuICAgICAgXCJhbWhlcnN0XCIsXHJcbiAgICAgIFwiYW50aWdvbmlzaFwiLFxyXG4gICAgICBcImJhcnJpbmd0b24gcGFzc2FnZVwiLFxyXG4gICAgICBcImJlbGxpdmVhdSBjb3ZlXCIsXHJcbiAgICAgIFwiYnJpZGdldG93blwiLFxyXG4gICAgICBcImJyaWRnZXdhdGVyXCIsXHJcbiAgICAgIFwiZGFydG1vdXRoXCIsXHJcbiAgICAgIFwiZGF5dG9uXCIsXHJcbiAgICAgIFwiaGFsaWZheFwiLFxyXG4gICAgICBcIm1pZGRsZXRvblwiLFxyXG4gICAgICBcIm5ldyBnbGFzZ293XCIsXHJcbiAgICAgIFwibmV3IG1pbmFzXCIsXHJcbiAgICAgIFwibm9ydGggc3lkbmV5XCIsXHJcbiAgICAgIFwicGljdG91XCIsXHJcbiAgICAgIFwicG9ydCBoYXdrZXNidXJ5XCIsXHJcbiAgICAgIFwic3lkbmV5XCIsXHJcbiAgICAgIFwidHJ1cm9cIixcclxuICAgICAgXCJ5ZWxsb3drbmlmZVwiLFxyXG4gICAgICBcImFqYXhcIixcclxuICAgICAgXCJhbGdvbnF1aW4gaGlnaGxhbmRzXCIsXHJcbiAgICAgIFwiYW5jYXN0ZXJcIixcclxuICAgICAgXCJhdGlrb2thblwiLFxyXG4gICAgICBcImJhcnJpZVwiLFxyXG4gICAgICBcImJlbGxldmlsbGVcIixcclxuICAgICAgXCJib3dtYW52aWxsZVwiLFxyXG4gICAgICBcImJyYWNlYnJpZGdlXCIsXHJcbiAgICAgIFwiYnJhbXB0b25cIixcclxuICAgICAgXCJicmFudGZvcmRcIixcclxuICAgICAgXCJicm9ja3ZpbGxlXCIsXHJcbiAgICAgIFwiYnJvb2tsaW5cIixcclxuICAgICAgXCJidXJsaW5ndG9uXCIsXHJcbiAgICAgIFwiY2FtYnJpZGdlXCIsXHJcbiAgICAgIFwiY2FybGV0b24gcGxhY2VcIixcclxuICAgICAgXCJjaGF0aGFtXCIsXHJcbiAgICAgIFwiY2xheXRvblwiLFxyXG4gICAgICBcImNsaW50b25cIixcclxuICAgICAgXCJjb2JvdXJnXCIsXHJcbiAgICAgIFwiY29sbGluZ3dvb2RcIixcclxuICAgICAgXCJjb25jb3JkXCIsXHJcbiAgICAgIFwiY29ybndhbGxcIixcclxuICAgICAgXCJkcnlkZW5cIixcclxuICAgICAgXCJkdW5kYXNcIixcclxuICAgICAgXCJkdW5zZm9yZFwiLFxyXG4gICAgICBcImR1dHRvblwiLFxyXG4gICAgICBcImVsbGlvdCBsYWtlXCIsXHJcbiAgICAgIFwiZXRvYmljb2tlXCIsXHJcbiAgICAgIFwiZm9ydCBmcmFuY2VzXCIsXHJcbiAgICAgIFwiZ2FuYW5vcXVlXCIsXHJcbiAgICAgIFwiZ2Fyc29uXCIsXHJcbiAgICAgIFwiZ3JlZWx5XCIsXHJcbiAgICAgIFwiZ3JpbXNieVwiLFxyXG4gICAgICBcImd1ZWxwaFwiLFxyXG4gICAgICBcImhhaWxleWJ1cnlcIixcclxuICAgICAgXCJoYW1pbHRvblwiLFxyXG4gICAgICBcImhhbm92ZXJcIixcclxuICAgICAgXCJoZWFyc3RcIixcclxuICAgICAgXCJodW50c3ZpbGxlXCIsXHJcbiAgICAgIFwiamVyc2V5dmlsbGVcIixcclxuICAgICAgXCJrYW5hdGFcIixcclxuICAgICAgXCJrYXB1c2thc2luZ1wiLFxyXG4gICAgICBcImtlbm9yYVwiLFxyXG4gICAgICBcImtpbmdzdG9uXCIsXHJcbiAgICAgIFwia2lya2xhbmQgbGFrZVwiLFxyXG4gICAgICBcImtpdGNoZW5lclwiLFxyXG4gICAgICBcImxhbmd0b25cIixcclxuICAgICAgXCJsaW5kc2F5XCIsXHJcbiAgICAgIFwibG9uZG9uXCIsXHJcbiAgICAgIFwibWFwbGVcIixcclxuICAgICAgXCJtYXJhdGhvblwiLFxyXG4gICAgICBcIm1hcmtoYW1cIixcclxuICAgICAgXCJtZXJyaWNrdmlsbGVcIixcclxuICAgICAgXCJtaWx0b25cIixcclxuICAgICAgXCJtaW5kZW5cIixcclxuICAgICAgXCJtaXNzaXNzYXVnYVwiLFxyXG4gICAgICBcIm1vdW50IGZvcmVzdFwiLFxyXG4gICAgICBcIm1vdW50IGhvcGVcIixcclxuICAgICAgXCJuZXBlYW5cIixcclxuICAgICAgXCJuZXcgbGlza2VhcmRcIixcclxuICAgICAgXCJuZXdtYXJrZXRcIixcclxuICAgICAgXCJuaWFnYXJhIGZhbGxzXCIsXHJcbiAgICAgIFwibm9ydGggYmF5XCIsXHJcbiAgICAgIFwibm9ydGggeW9ya1wiLFxyXG4gICAgICBcIm9hayByaWRnZXNcIixcclxuICAgICAgXCJvYWt2aWxsZVwiLFxyXG4gICAgICBcIm9yYW5nZXZpbGxlXCIsXHJcbiAgICAgIFwib3JpbGxpYVwiLFxyXG4gICAgICBcIm9ydG9uXCIsXHJcbiAgICAgIFwib3NoYXdhXCIsXHJcbiAgICAgIFwib3R0YXdhXCIsXHJcbiAgICAgIFwib3dlbiBzb3VuZFwiLFxyXG4gICAgICBcInBhcnJ5IHNvdW5kXCIsXHJcbiAgICAgIFwicGVtYnJva2VcIixcclxuICAgICAgXCJwZW5ldGFuZ3Vpc2hlbmVcIixcclxuICAgICAgXCJwZXJ0aFwiLFxyXG4gICAgICBcInBldGVyYm9yb3VnaFwiLFxyXG4gICAgICBcInBldHJvbGlhXCIsXHJcbiAgICAgIFwicGlja2VyaW5nXCIsXHJcbiAgICAgIFwicmVkIGxha2VcIixcclxuICAgICAgXCJyaWRnZXRvd25cIixcclxuICAgICAgXCJzYXJuaWFcIixcclxuICAgICAgXCJzYXVsdCBzdGUuIG1hcmllXCIsXHJcbiAgICAgIFwic2NhcmJvcm91Z2hcIixcclxuICAgICAgXCJzY2hyZWliZXJcIixcclxuICAgICAgXCJzaW1jb2VcIixcclxuICAgICAgXCJzaW91eCBsb29rb3V0XCIsXHJcbiAgICAgIFwic3QuIGNhdGhhcmluZXNcIixcclxuICAgICAgXCJzdC4gbWFyeXNcIixcclxuICAgICAgXCJzdG91ZmZ2aWxsZVwiLFxyXG4gICAgICBcInN0cmF0Zm9yZFwiLFxyXG4gICAgICBcInN0dXJnZW9uIGZhbGxzXCIsXHJcbiAgICAgIFwic3VkYnVyeVwiLFxyXG4gICAgICBcInN1bmRyaWRnZVwiLFxyXG4gICAgICBcInRodW5kZXIgYmF5XCIsXHJcbiAgICAgIFwidGlsbHNvbmJ1cmdcIixcclxuICAgICAgXCJ0aW1taW5zXCIsXHJcbiAgICAgIFwidG9yb250b1wiLFxyXG4gICAgICBcInRyZW50b25cIixcclxuICAgICAgXCJVeGJyaWRnZVwiLFxyXG4gICAgICBcInZhbCBjYXJvblwiLFxyXG4gICAgICBcIndhbGtlcnRvblwiLFxyXG4gICAgICBcIndhdGVybG9vXCIsXHJcbiAgICAgIFwid2VsbGFuZFwiLFxyXG4gICAgICBcIndoaXRieVwiLFxyXG4gICAgICBcIndpbGxvd2RhbGVcIixcclxuICAgICAgXCJ3aW5kc29yXCIsXHJcbiAgICAgIFwid2luZ2hhbVwiLFxyXG4gICAgICBcIndvb2RicmlkZ2VcIixcclxuICAgICAgXCJjaGFybG90dGV0b3duLCBwZVwiLFxyXG4gICAgICBcInNvdXJpcywgcGVcIixcclxuICAgICAgXCJzdW1tZXJzaWRlLCBwZVwiLFxyXG4gICAgICBcIndlbGxpbmd0b25cIixcclxuICAgICAgXCJhbmpvdVwiLFxyXG4gICAgICBcImJvaXNicmlhbmRcIixcclxuICAgICAgXCJib3VjaGVydmlsbGVcIixcclxuICAgICAgXCJicm9zc2FyZFwiLFxyXG4gICAgICBcImNow6J0ZWF1Z3VheVwiLFxyXG4gICAgICBcImNoaWNvdXRpbWlcIixcclxuICAgICAgXCJjw7R0ZSBzYWludC1sdWNcIixcclxuICAgICAgXCJkb2xsYXJkLWRlcy1vcm1lYXV4XCIsXHJcbiAgICAgIFwiZ2F0aW5lYXVcIixcclxuICAgICAgXCJncmFuYnlcIixcclxuICAgICAgXCJsYXZhbFwiLFxyXG4gICAgICBcImzDqXZpc1wiLFxyXG4gICAgICBcIm1pcmFiZWxcIixcclxuICAgICAgXCJtb250cmVhbFwiLFxyXG4gICAgICBcIm5ldyByaWNobW9uZFwiLFxyXG4gICAgICBcInBvaW50ZS1jbGFpcmVcIixcclxuICAgICAgXCJxdcOpYmVjXCIsXHJcbiAgICAgIFwic2VwdC1pbGVzXCIsXHJcbiAgICAgIFwic2hlcmJyb29rZVwiLFxyXG4gICAgICBcInZpbGxlIHN0LWxhdXJlbnRcIixcclxuICAgICAgXCJ3ZXN0bW91bnRcIixcclxuICAgICAgXCJlYXN0ZW5kXCIsXHJcbiAgICAgIFwiZXN0ZXZhblwiLFxyXG4gICAgICBcImVzdGVyaGF6eVwiLFxyXG4gICAgICBcImZvYW0gbGFrZVwiLFxyXG4gICAgICBcImh1bWJvbGR0XCIsXHJcbiAgICAgIFwia2luZGVyc2xleVwiLFxyXG4gICAgICBcImxlYWRlclwiLFxyXG4gICAgICBcIm1hcGxlIGNyZWVrXCIsXHJcbiAgICAgIFwibWVhZG93IGxha2VcIixcclxuICAgICAgXCJtZWxmb3J0XCIsXHJcbiAgICAgIFwibWVsdmlsbGVcIixcclxuICAgICAgXCJtb29zZSBqYXdcIixcclxuICAgICAgXCJub3J0aCBiYXR0bGVmb3JkXCIsXHJcbiAgICAgIFwib3V0bG9va1wiLFxyXG4gICAgICBcIm94Ym93XCIsXHJcbiAgICAgIFwicHJpbmNlIGFsYmVydFwiLFxyXG4gICAgICBcInJlZ2luYVwiLFxyXG4gICAgICBcInJlZ2luYSBiZWFjaFwiLFxyXG4gICAgICBcInJvc2V0b3duXCIsXHJcbiAgICAgIFwic2Fza2F0b29uXCIsXHJcbiAgICAgIFwic2hlbGxicm9va1wiLFxyXG4gICAgICBcInN3aWZ0IGN1cnJlbnRcIixcclxuICAgICAgXCJ3YXRyb3VzXCIsXHJcbiAgICAgIFwid2F0c29uXCIsXHJcbiAgICAgIFwieW9ya3RvblwiLFxyXG4gICAgICBcIndoaXRlaG9yc2VcIlxyXG4gICAgXTtcclxuICAgIHN1Z2dlc3Rpb25zLmxvY2F0aW9ucyA9IG5ldyBCbG9vZGhvdW5kKHtcclxuICAgICAgZGF0dW1Ub2tlbml6ZXI6IEJsb29kaG91bmQudG9rZW5pemVycy53aGl0ZXNwYWNlLFxyXG4gICAgICBxdWVyeVRva2VuaXplcjogQmxvb2Rob3VuZC50b2tlbml6ZXJzLndoaXRlc3BhY2UsXHJcbiAgICB9KTtcclxuXHJcbiAgICBzdWdnZXN0aW9ucy5sb2NhdGlvbnMuYWRkKGNpdGllcyk7XHJcblxyXG4vLyBHZXQgdGhlIHJlc3VsdHNcclxuICAgIGZ1bmN0aW9uIGdldFNlYXJjaFJlc3VsdHMocGFyYW1zKSB7XHJcbiAgICAgIHBhcmFtcy5zZWFyY2h0eXBlID0gJ29mZmljZSc7XHJcbiAgICAgIHBhcmFtcy5uYW1lID0gJyc7XHJcblxyXG4gICAgICAvLyBNYWtlIHN1cmUgZXJyb3IgbWVzc2FnZSBpcyBoaWRkZW4gZWFjaCB0aW1lXHJcbiAgICAgICQoJy56ZXJvLXJlc3VsdHMnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cclxuICAgICAgJC5nZXRKU09OKG1vZGVsVXJsLCBwYXJhbXMpXHJcbiAgICAgICAgLmFsd2F5cygpXHJcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgIHZhciByZXN1bHQgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdpcy1yZXZlYWwtb3BlbicpO1xyXG4gICAgICAgICAgICAkKCcjc2VhcmNoUmVzdWx0c01vZGFsJykucmVtb3ZlQ2xhc3MoJ2Nsb3NlZCcpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICBkaXNwbGF5U2VhcmNoUmVzdWx0cygnb2ZmaWNlLXRlbXBsYXRlJywgcmVzdWx0KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy56ZXJvLXJlc3VsdHMnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZhaWwoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0RhdGEgY291bGQgbm90IGJlIHJldHJpZXZlZCwgcGxlYXNlIHRyeSBhZ2FpbicsIHJlc3VsdC5zdGF0dXMgKyAnICcgKyByZXN1bHQuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuLy8gQmVjYXVzZSB3ZSBhcmUgb25seSBzZWFyY2hpbmcgZm9yIGNpdGllcywgdGhpcyBmdW5jdGlvbiBpcyBzbGlnaHRseSByZWR1bmRhbnQgLSBsZWF2aW5nIGl0IGluIHBsYWNlIGZvciBub3dcclxuICAgIGZ1bmN0aW9uIHBhcnNlU2VhcmNoU3RyaW5nKCkge1xyXG4gICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgIHZhciBzZWFyY2ggPSAkZmllbGQudmFsKCk7XHJcblxyXG4gICAgICByZXN1bHQuY2l0eSA9ICcnO1xyXG5cclxuICAgICAgLy8gU2VhcmNoIGluIHRoZSBsYW5ndWFnZSBvZiB0aGUgcGFnZVxyXG4gICAgICByZXN1bHQubGFuZyA9IGxhbmc7XHJcbiAgICAgIC8vIFdlIG9ubHkgc2VhcmNoIGNvbnN1bHRhbnRzIGZyb20gdGhpcyBtZXRob2RcclxuICAgICAgcmVzdWx0LnNlYXJjaHR5cGUgPSAnY29uJztcclxuXHJcbiAgICAgIC8vIENoZWNrIHRoZSBzZWFyY2ggc3RyaW5nIGZvciBhIHByZXZpb3VzbHkgZGVmaW5lZCBsb2NhdGlvblxyXG4gICAgICB2YXIgd29yZHMgPSBzZWFyY2guc3BsaXQoJyAnKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vIENoZWNrIGVhY2ggd29yZCBmb3IgYSBjaXR5IGZyb20gdGhlIHByZWRlZmluZWQgbGlzdFxyXG4gICAgICAgIHZhciBjaXR5ID0gc3VnZ2VzdGlvbnMubG9jYXRpb25zLmdldCh3b3Jkc1tpXSk7XHJcbiAgICAgICAgaWYgKGNpdHkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgcmVzdWx0LmNpdHkgPSBjaXR5WzBdO1xyXG4gICAgICAgICAgd29yZHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFyZXN1bHQuY2l0eSkge1xyXG4gICAgICAgIHJlc3VsdC5jaXR5ID0gd29yZHMuam9pbignICcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRpc3BsYXlTZWFyY2hSZXN1bHRzKHRlbXBsYXRlSUQsIGpzb24pIHtcclxuICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJRCkuaW5uZXJIVE1MO1xyXG4gICAgICBNdXN0YWNoZS5wYXJzZSh0ZW1wbGF0ZSk7XHJcbiAgICAgIHZhciByZW5kZXJlZCA9IE11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwganNvbik7XHJcbiAgICAgICQoJyNzZWFyY2hSZXN1bHRzTW9kYWwnKS5hcHBlbmQocmVuZGVyZWQpO1xyXG4gICAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4vL0luaXQgZXZlcnl0aGluZ1xyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vIFRyeSB0byBwcmVkZXRlcm1pbmUgd2hhdCByZXN1bHRzIHNob3VsZCBzaG93XHJcbiAgICAgIC8vIFNldHVwIHRoZSB0eXBlYWhlYWRcclxuICAgICAgJCgnLnR5cGVhaGVhZCcpLnR5cGVhaGVhZCh7XHJcbiAgICAgICAgICBoaWdobGlnaHQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtuYW1lOiAnbG9jYXRpb25zJywgc291cmNlOiBzdWdnZXN0aW9ucy5sb2NhdGlvbnMsIGxpbWl0OiAyfVxyXG4gICAgICApO1xyXG5cclxuICAgICAgLy8gU2V0dXAgdGhlIGZvcm0gc3VibWlzc2lvblxyXG4gICAgICAkKCcuaWctc2VhcmNoJykuc3VibWl0KGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciBwYXJhbXMgPSBwYXJzZVNlYXJjaFN0cmluZygpO1xyXG4gICAgICAgIGdldFNlYXJjaFJlc3VsdHMocGFyYW1zKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBGYWtlIG1vZGFsIC0gQWRkaW5nIGhhbmRsZXIgb24gZG9jdW1lbnQgc28gaXQgZmlyZXMgZGVzcGl0ZSB0aGUgYnV0dG9uIG5vdCBiZWluZyByZW5kZXJlZCB5ZXRcclxuICAgICAgJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcIiNzZWFyY2hSZXN1bHRzTW9kYWwgLmNsb3NlLWJ1dHRvblwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnI3NlYXJjaFJlc3VsdHNNb2RhbCcpLmFkZENsYXNzKCdjbG9zZWQnKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICB9LCA0MDApO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiLyogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBmb3Igcm9sbHVwIChodHRwOi8vcm9sbHVwanMub3JnLykgYW5kXHJcbiBlc3NlbnRpb25hbGx5ICdib290c3RyYXBzJyBvdXIgaWcuY29tICdhcHBsaWNhdGlvbicuXHJcblxyXG4gQWxsIG1vZHVsZXMgc2hvdWxkIGJlIGltcG9ydGVkIGhlcmUgc28gdGhhdCB0aGV5IGNhbiBiZSBpbml0aWFsaXplZCBvblxyXG4gYSBjYXNlLWJ5LWNhc2UgYmFzaXMgKG5vdCBhbGwgcGFnZXMgcmVxdWlyZSB0aGUgaW5pdGlhbGl6YXRpb24gb2YgYSBjYXJvdXNlbFxyXG4gZm9yIGluc3RhbmNlKS5cclxuXHJcbiBBbnkgdGFza3Mgb3IgcHJvY2Vzc2VzIHRoYXQgbmVlZCB0byBiZSBpbml0aWF0ZWQgb24gcGFnZSBsb2FkIHNob3VsZCBsaXZlIGluIHRoaXNcclxuIGZpbGUgYXMgd2VsbC4gQW4gaW5jbHVkZWQgZXhhbXBsZSBpcyBhIG1ldGhvZCB0aGF0IGFkZHMgYW4gJ2VuJyBvciAnZnInIGNsYXNzIHRvXHJcbiB0aGUgYm9keSBiYXNlZCBvbiB0aGUgZ2xvYmFsIGxhbmd1YWdlIHZhcmlhYmxlIHRoYXQgd2UgY2FuIHRoZW4gdXNlIHRvIHdyaXRlIGN1c3RvbVxyXG4gc3R5bGVzIGZvciBlYWNoIGxhbmd1YWdlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBmb3JtcyBmcm9tICcuL2Zvcm1zLmpzJztcclxuaW1wb3J0IGNhcm91c2VsIGZyb20gJy4vY2Fyb3VzZWwuanMnO1xyXG5pbXBvcnQgY2FyZWVycyBmcm9tICcuL2NhcmVlcnMuanMnO1xyXG5pbXBvcnQgdmlkZW8gZnJvbSAnLi92aWRlby5qcyc7XHJcbmltcG9ydCBzZWFyY2ggZnJvbSAnLi9zZWFyY2guanMnO1xyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4vLyBFdmVudCBFbWl0dGVyIHRlc3QgbW9kdWxlc1xyXG4vLyBpbXBvcnQgZXZ0MSBmcm9tICcuL2V2ZW50LXRlc3QtMS5qcyc7XHJcbi8vIGltcG9ydCBldnQyIGZyb20gJy4vZXZlbnQtdGVzdC0yLmpzJztcclxuXHJcbmNvbnN0IGFwcCA9ICgoKSA9PiB7XHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAvLyBJbml0aWFsaXplIEZvdW5kYXRpb25cclxuICAgICQoZG9jdW1lbnQpLmZvdW5kYXRpb24oKTtcclxuXHJcbiAgICAvLyBDaGVjayBmb3IgY29tcG9uZW50c1xyXG4gICAgaWYgKCQoJy5pZy1mb3JtJykubGVuZ3RoKSBmb3Jtcy5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmlnLWNhcm91c2VsJykubGVuZ3RoKSBjYXJvdXNlbC5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmlnLXNlYXJjaCcpLmxlbmd0aCkgc2VhcmNoLmluaXQoKTtcclxuICAgIGlmICgkKCcuaWctY2FyZWVycycpLmxlbmd0aCkgY2FyZWVycy5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmlnLXZpZGVvLWdyb3VwJykubGVuZ3RoKSB2aWRlby5pbml0KCk7XHJcblxyXG4gICAgLy8gQ29tcG9uZW50cyBjYW4gYWxzbyBiZSBzZXR1cCB0byByZWNlaXZlIGFuIEhUTUwgJ3Njb3BlJyAoLmlnLWV2dDEuLi4gLmlnLWV2dDIuLi4uIGV0YylcclxuICAgIC8vIGlmICgkKCcuaWctZXZ0MScpLmxlbmd0aCkgZXZ0MS5pbml0KCcuaWctZXZ0MScpO1xyXG4gICAgLy8gaWYgKCQoJy5pZy1ldnQyJykubGVuZ3RoKSBldnQyLmluaXQoJy5pZy1ldnQyJyk7XHJcblxyXG4gICAgLy8gQWRkIGxhbmd1YWdlIGNsYXNzIHRvIGJvZHlcclxuICAgIC8vIF9sYW5ndWFnZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gTGV0J3MgdXNlIGEgZ2xvYmFsIHZhcmlhYmxlIChnbG9iYWwgYXMgaW4gYXZhaWxhYmxlIHRvIGFsbCBvdXIgY29tcG9uZW50cyAtIG5vdCB0aGUgd2luZG93IG9iamVjdCEpXHJcbiAgLy8gdG8gYWRkIGEgY2xhc3MgdG8gdGhlIGJvZHkgdGFnXHJcbiAgLy8gZnVuY3Rpb24gX2xhbmd1YWdlKCkge1xyXG4gIC8vICAgJCgnYm9keScpLmFkZENsYXNzKGlnLmxhbmcpO1xyXG4gIC8vIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9XHJcbn0pKCk7XHJcblxyXG4vLyBCb290c3RyYXAgYXBwXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICBhcHAuaW5pdCgpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbImxhbmciLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiaW5kZXhPZiIsImVtaXR0ZXIiLCJFdmVudEVtaXR0ZXIiLCJlbmRwb2ludFVSTCIsInN1Y2Nlc3NVUkwiLCJjYW5jZWxVUkwiLCIkZm9ybSIsIiRmb3JtV3JhcHBlciIsImluaXQiLCIkIiwiZmluZCIsImRhdGEiLCJfdmFsaWRhdGlvbiIsImpJbnB1dCIsImNoYW5nZSIsIm9iakV2ZW50IiwiYWRkQ2xhc3MiLCJ2YWxpZGF0b3IiLCJzZXREZWZhdWx0cyIsImFkZE1ldGhvZCIsInBvc3RhbCIsImVsZW1lbnQiLCJvcHRpb25hbCIsIm1hdGNoIiwidmFsaWRhdGUiLCJsYWJlbCIsImNsb3Nlc3QiLCJsZW5ndGgiLCJwYXJlbnQiLCJhcHBlbmQiLCJvbiIsInJlcGxhY2UiLCJfcHJvY2VzcyIsImZvcm0iLCJmb3JtRGF0YVJhdyIsImZvcm1EYXRhUGFyc2VkIiwidmFsaWQiLCJyZW1vdmVDbGFzcyIsInNlcmlhbGl6ZUFycmF5IiwiX3BhcnNlIiwiX3N1Ym1pdCIsImFqYXgiLCJzdWNjZXNzIiwibXNnIiwiZXJyb3IiLCJ0byIsIl90b2dnbGVyIiwiaGlkZSIsInNob3ciLCJsb2ciLCJ0b2dnbGVDbGFzcyIsIl9idWlsZENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiJGNhcm91c2VsIiwiZWFjaCIsImluZGV4Iiwic2xpY2siLCJfY2FyZWVyc0xlZ2FjeUNvZGUiLCJmbiIsImluZm9Ub2dnbGUiLCIkcmV2ZWFsIiwiJHJldmVhbENvbnRlbnQiLCIkcmV2ZWFsVHJpZ2dlciIsImZpeGVkSGVpZ2h0Iiwic2V0QXJpYSIsImF0dHIiLCJpbml0VG9nZ2xlIiwiaGFuZGxlUmV2ZWFsVG9nZ2xlIiwicmVzaXplSGFuZGxlciIsInNldFRpbWVvdXQiLCJzZXRSZXZlYWxDb250ZW50SGVpZ2h0IiwiY3NzIiwiaGVpZ2h0IiwiZmluYWxIZWlnaHQiLCJoYXNDbGFzcyIsInNjcm9sbEhlaWdodCIsImpRdWVyeSIsImNpcmNsZUFuaW1hdGlvbiIsIm1heFZhbHVlIiwiY2FudmFzIiwiJGNhbnZhcyIsImNvbnRleHQiLCJkIiwid2lkdGgiLCJwZXJjZW50U3Ryb2tlIiwicmVtYWluaW5nU3Ryb2tlIiwicmFkaXVzIiwiY3VyUGVyYyIsImNpcmMiLCJNYXRoIiwiUEkiLCJxdWFydCIsImRlbGVnYXRlSUQiLCJEYXRlIiwiZ2V0VGltZSIsImlzIiwiZ2V0Q29udGV4dCIsInN0cm9rZVN0eWxlIiwiZmlsbFN0eWxlIiwiZGVsZWdhdGUiLCJjbGVhciIsImFuaW1hdGUiLCJjdXJyZW50IiwibGluZVdpZHRoIiwiYmVnaW5QYXRoIiwiYXJjIiwibWluIiwic3Ryb2tlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiZmlsbFJlY3QiLCJibG9ja0xpbmsiLCIkYmxvY2tMaW5rIiwiZGVzdGluYXRpb24iLCJpbml0QmxvY2siLCJoYW5kbGVDbGljayIsImd1aSIsInZpZGVvIiwib3ZlcmxheSIsImluaXRMZWdhY3kiLCJPdmVybGF5TW9kdWxlIiwiR3VpTW9kdWxlIiwiZSIsInRhcmdldCIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcCIsIm9mZnNldCIsInRvcCIsInNlbGVjdG9yIiwicmVzaXplIiwib3ZlcmxheVJlZmVyZW5jZSIsIm11bHRpVGFiVG9nZ2xlU2VsZWN0b3IiLCJtdWx0aVRhYkNvbnRlbnRTZWxlY3RvciIsIm11bHRpVGFiU2VsZWN0b3IiLCIkZWRnZU92ZXJsYXlMb2NhdGlvbiIsIiRvdmVybGF5U2xpZGVyIiwiJHByb2ZpbGVTbGlkZXIiLCIkcHJvZmlsZVNsaWRlclZpZGVvU2VjdGlvbkhvbGRlciIsIndpbmRvd1NpemluZ0RlbGF5Iiwid2luZG93U2Nyb2xsaW5nRGVsYXkiLCJvdmVybGF5T3BlbiIsImlzUmVzcG9uc2l2ZVN0YXRlIiwic2Nyb2xsZWRUb1ZpZXciLCJpbml0R3VpIiwiZXZlbnQiLCJiYWNrZ3JvdW5kQ29sb3IiLCIkdGhpcyIsInBhcnNlSW50IiwiaHRtbCIsImhhbmRsZU92ZXJsYXlGcm9tSGFzaCIsImRlbGF5ZWRIYW5kbGVXaW5kb3dTaXppbmciLCJkZWxheWVkSGFuZGxlV2luZG93U2Nyb2xsIiwidHJpZ2dlciIsInN0b3BQcm9wYWdhdGlvbiIsImFkZE11bHRpVGFiVG9nZ2xlSGFuZGxlcnMiLCJ0b2dnbGVCYXNlIiwiJGNvbnRhaW5lciIsInBhcmVudHMiLCJhbmltYXRlUHJvZmlsZVNsaWRlciIsIiRwcm9maWxlUGFuZWxzIiwicHJvZmlsZVBhbmVsSGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJjaGFuZ2VTbGlkZXJTdGF0ZSIsInNsaWRlciIsInN0YXRlIiwiY2xlYXJUaW1lb3V0IiwiaGFuZGxlV2luZG93U2l6aW5nIiwiaGFuZGxlV2luZG93U2Nyb2xsaW5nIiwiZnVsbEhhc2hGcmFnbWVudCIsImhhc2giLCJvcGVuT3ZlcmxheSIsImhhbmRsZU92ZXJsYXlPcGVuIiwiaGFuZGxlT3ZlcmxheUNsb3NlIiwiaW5pdGlhbEluZGV4IiwiaGFuZGxlU2xpZGVDaGFuZ2UiLCJ5UG9zIiwib3ZlcmxheUNvbnRlbnQiLCJvZmYiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiZG9jdW1lbnQiLCJ0aXRsZSIsInNlYXJjaCIsInNjcm9sbFRvcCIsImN1cnJlbnRTbGlkZSIsIm5leHRTbGlkZSIsIm5leHRUaXRsZSIsImdldCIsIm5ld0hhc2giLCJ3aW5kb3dXaWR0aCIsInJlc3BvbnNpdmVMaW1pdCIsIm5ld0lzUmVzcG9uc2l2ZVN0YXRlIiwiaW5pdFByb2ZpbGVTbGlkZXIiLCJpbml0U2xpZGVyIiwib3B0aW9ucyIsImRlZmF1bHRzIiwiZXh0ZW5kIiwiJG92ZXJsYXkiLCIkYm9keSIsIm92ZXJsYXlTaXppbmdEZWxheSIsImN1cnJlbnRJbnN0YW5jZSIsImlzT3BlbkZsYWciLCIkY2xvc2VCdXR0b24iLCJpc09wZW4iLCJpbml0T3ZlcmxheSIsImRlbGF5ZWRIYW5kbGVPdmVybGF5U2l6aW5nIiwiRm91bmRhdGlvbiIsIlJldmVhbCIsIm92ZXJsYXlTaXppbmciLCJjbG9zZSIsImZvdW5kYXRpb24iLCJvcGVuIiwiaW5pdENsb3NlQnV0dG9uIiwiJGlubmVyU3BhbiIsInVybE9yTWFya3VwIiwib3BlbkNhbGxiYWNrIiwiY2xvc2VDYWxsYmFjayIsImZ1bGxTY3JlZW4iLCJmdWxsIiwib3Blbk92ZXJsYXlXaXRoQWpheCIsInVybCIsImRvbmUiLCJvcGVuT3ZlcmxheVdpdGhNYXJrdXAiLCJtYXJrdXAiLCJvdmVybGF5U2l6ZUNsZWFudXAiLCJvdmVybGF5SGVpZ2h0Iiwid2luZG93SGVpZ2h0IiwidmlkcyIsImJyaWdodENvdmUiLCJfcGFyc2VWaWRlb3MiLCIkZ3JvdXAiLCIkdmlkZW8iLCJwcmVsb2FkT3B0aW9ucyIsImFjY291bnQiLCJwbGF5ZXIiLCJpZCIsImRlc2NyaXB0aW9uIiwiYXV0byIsImN0cmwiLCJwcmVsb2FkIiwicHVzaCIsIl9pbmplY3RCcmlnaHRDb3ZlSlMiLCJpbmRleGpzIiwiX2luamVjdFRlbXBsYXRlIiwicmVwbGFjZVdpdGgiLCJfc2VhcmNoTGVnYWN5Q29kZSIsIm1vZGVsVXJsIiwiJGZpZWxkIiwiaHJlZiIsInN1Z2dlc3Rpb25zIiwiY2l0aWVzIiwibG9jYXRpb25zIiwiQmxvb2Rob3VuZCIsInRva2VuaXplcnMiLCJ3aGl0ZXNwYWNlIiwiYWRkIiwiZ2V0U2VhcmNoUmVzdWx0cyIsInBhcmFtcyIsInNlYXJjaHR5cGUiLCJuYW1lIiwiZ2V0SlNPTiIsImFsd2F5cyIsInJlc3VsdCIsIkpTT04iLCJwYXJzZSIsImZhaWwiLCJzdGF0dXMiLCJzdGF0dXNUZXh0IiwicGFyc2VTZWFyY2hTdHJpbmciLCJ2YWwiLCJjaXR5Iiwid29yZHMiLCJzcGxpdCIsImkiLCJzcGxpY2UiLCJqb2luIiwiZGlzcGxheVNlYXJjaFJlc3VsdHMiLCJ0ZW1wbGF0ZUlEIiwianNvbiIsInRlbXBsYXRlIiwiZ2V0RWxlbWVudEJ5SWQiLCJpbm5lckhUTUwiLCJyZW5kZXJlZCIsIk11c3RhY2hlIiwicmVuZGVyIiwidHlwZWFoZWFkIiwic291cmNlIiwibGltaXQiLCJzdWJtaXQiLCJhcHAiLCJmb3JtcyIsImNhcm91c2VsIiwiY2FyZWVycyIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7O0FBU0EsQUFBTzs7O0FBS1AsQUFBTyxJQUFJQSxPQUFRLFlBQU07TUFDbkJDLE9BQU9DLFFBQVAsQ0FBZ0JDLFFBQWhCLENBQXlCQyxPQUF6QixDQUFpQyxNQUFqQyxNQUE2QyxDQUFDLENBQWxELEVBQXFEO1dBQzVDLElBQVA7R0FERixNQUVPO1dBQ0UsSUFBUDs7Q0FKYyxFQUFYOzs7QUFTUCxBQUFPOzs7QUFLUCxBQUFPLElBQUlDLFVBQVUsSUFBSUMsWUFBSixFQUFkOztBQzFCUCxZQUFlLENBQUMsWUFBTTs7TUFFaEJDLFdBQUosRUFDRUMsVUFERixFQUVFQyxTQUZGLEVBR0VDLEtBSEYsRUFJRUMsWUFKRjs7V0FNU0MsSUFBVCxHQUFnQjs7bUJBRUNDLEVBQUUsVUFBRixDQUFmO1lBQ1FGLGFBQWFHLElBQWIsQ0FBa0IsTUFBbEIsQ0FBUjtrQkFDY0gsYUFBYUcsSUFBYixDQUFrQixNQUFsQixFQUEwQkMsSUFBMUIsQ0FBK0IsVUFBL0IsQ0FBZDtnQkFDWUosYUFBYUcsSUFBYixDQUFrQixNQUFsQixFQUEwQkMsSUFBMUIsQ0FBK0IsUUFBL0IsQ0FBWjs7Ozs7O1dBTU9DLFdBQVQsR0FBdUI7O1FBRWpCQyxTQUFTSixFQUFFLGtCQUFGLENBQWI7V0FDT0ssTUFBUCxDQUFjLFVBQVVDLFFBQVYsRUFBb0I7UUFDOUIsSUFBRixFQUFRQyxRQUFSLENBQWlCLE9BQWpCO0tBREY7O01BSUVDLFNBQUYsQ0FBWUMsV0FBWixDQUF3QjthQUNmLElBRGU7ZUFFYjtLQUZYOztNQUtFRCxTQUFGLENBQVlFLFNBQVos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