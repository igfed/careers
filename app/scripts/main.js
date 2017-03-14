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
          destination = '4442.aspx/' + destination;
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
            prevArrow: '<span type="button" class="carousel-prev"><img src="../images/Arrow-MainArticle-Carousel-Black-L.png"></span>',
            nextArrow: '<span type="button" class="carousel-next"><img src="../images/Arrow-MainArticle-Carousel-Black-R.png"></span>'
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvY2FyZWVycy5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL3NlYXJjaC5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgZmlsZSBpcyBmb3IgbWV0aG9kcyBhbmQgdmFyaWFibGVzIHRoYXQgYXJlIGdvaW5nIHRvIGJlXHJcbnVzZWZ1bCBhY3Jvc3MgYWxsIG1vZHVsZXMuIEluIG9yZGVyIHRvIHVzZSB0aGVtIGFueXdoZXJlLCBpbXBvcnQgd2l0aDpcclxuXHJcbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4gYW5kIHRoZW4gY2FsbCB3aXRoIHRoZSBpZyBuYW1lc3BhY2UgKGkuZS4sIGlnLnBhdGhuYW1lLCBpZy5sYW5nLCBldGMpXHJcbiAqL1xyXG5cclxuLy8gdXJsIHBhdGhcclxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XHJcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxufSkoKVxyXG5cclxuLy8gbGFuZ3VhZ2VcclxuZXhwb3J0IHZhciBsYW5nID0gKCgpID0+IHtcclxuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgIHJldHVybiAnZnInO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gJ2VuJztcclxuICB9XHJcbn0pKClcclxuXHJcbi8vIGJyb3dzZXIgd2lkdGhcclxuZXhwb3J0IHZhciBicm93c2VyV2lkdGggPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcclxufSkoKVxyXG5cclxuLy8gYmFzZSBldmVudEVtaXR0ZXJcclxuZXhwb3J0IHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICB2YXIgZW5kcG9pbnRVUkwsXHJcbiAgICBzdWNjZXNzVVJMLFxyXG4gICAgY2FuY2VsVVJMLFxyXG4gICAgJGZvcm0sXHJcbiAgICAkZm9ybVdyYXBwZXI7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xyXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcclxuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xyXG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcclxuXHJcbiAgICBfdmFsaWRhdGlvbigpO1xyXG4gICAgX3RvZ2dsZXIoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcclxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XHJcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZSxcclxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XHJcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcclxuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xyXG5cclxuICAgICRmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDYXJvdXNlbCBJbml0aWFsaXplZCEnKVxyXG5cclxuICAgIC8vIE5vdCBzdXJlIHdoYXQgdGhpcyBkb2VzIGF0IHRoaXMgcG9pbnQgb3IgaG93IGl0IHJlbGF0ZXMgdG8gQ2Fyb3VzZWxzXHJcbiAgICAkKCdbZGF0YS1yZXNwb25zaXZlLXRvZ2dsZV0gYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ3NpdGUtaGVhZGVyLWlzLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgX2J1aWxkQ2Fyb3VzZWwoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9idWlsZENhcm91c2VsKCkge1xyXG4gICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgbmV4dEFycm93LFxyXG4gICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgJCgnLmlnLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXHJcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxyXG4gICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgX2NhcmVlcnNMZWdhY3lDb2RlKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfY2FyZWVyc0xlZ2FjeUNvZGUoKSB7XHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuXHJcbiAgICAgICQuZm4uaW5mb1RvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyICRyZXZlYWwgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAkcmV2ZWFsQ29udGVudCA9ICRyZXZlYWwuZmluZCgnLmluZm8tdG9nZ2xlLWNvbnRlbnQnKSxcclxuICAgICAgICAgICAgJHJldmVhbFRyaWdnZXIgPSAkcmV2ZWFsLmZpbmQoJy5pbmZvLXRvZ2dsZS10cmlnZ2VyJyksXHJcbiAgICAgICAgICAgIGZpeGVkSGVpZ2h0ID0gZmFsc2UsXHJcbiAgICAgICAgICAgIHNldEFyaWEgPSAkcmV2ZWFsLmF0dHIoJ2luZm8tdG9nZ2xlLWFyaWEnKSA9PT0gJ3RydWUnO1xyXG5cclxuICAgICAgICAgIGluaXRUb2dnbGUoKTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBpbml0VG9nZ2xlKCkge1xyXG4gICAgICAgICAgICAkcmV2ZWFsVHJpZ2dlci5vbignY2xpY2snLCBoYW5kbGVSZXZlYWxUb2dnbGUpO1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIHJlc2l6ZUhhbmRsZXIpO1xyXG5cclxuICAgICAgICAgICAgc2V0UmV2ZWFsQ29udGVudEhlaWdodCgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVSZXZlYWxUb2dnbGUoKSB7XHJcbiAgICAgICAgICAgIHNldFJldmVhbENvbnRlbnRIZWlnaHQoKTtcclxuICAgICAgICAgICAgJHJldmVhbC50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHNldFJldmVhbENvbnRlbnRIZWlnaHQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIHJlc2l6ZUhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIGlmIChmaXhlZEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmNzcyh7IGhlaWdodDogJ2F1dG8nIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gc2V0UmV2ZWFsQ29udGVudEhlaWdodCgpIHtcclxuICAgICAgICAgICAgdmFyIGZpbmFsSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgaWYgKCRyZXZlYWwuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgZmluYWxIZWlnaHQgPSAkcmV2ZWFsQ29udGVudFswXS5zY3JvbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgZml4ZWRIZWlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGZpbmFsSGVpZ2h0ID0gMDtcclxuICAgICAgICAgICAgICBmaXhlZEhlaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmNzcyh7IGhlaWdodDogZmluYWxIZWlnaHQgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2V0QXJpYSkge1xyXG4gICAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgIWZpeGVkSGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfTtcclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuXHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuICAgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICAgJC5mbi5jaXJjbGVBbmltYXRpb24gPSBmdW5jdGlvbiAobWF4VmFsdWUpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyIGNhbnZhcyA9IHRoaXMsXHJcbiAgICAgICAgICAgICRjYW52YXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBjb250ZXh0LFxyXG4gICAgICAgICAgICBkID0gY2FudmFzLndpZHRoIC8gMixcclxuICAgICAgICAgICAgcGVyY2VudFN0cm9rZSA9IDcsXHJcbiAgICAgICAgICAgIHJlbWFpbmluZ1N0cm9rZSA9IDEsXHJcbiAgICAgICAgICAgIHJhZGl1cyA9IGQgLSBwZXJjZW50U3Ryb2tlLFxyXG4gICAgICAgICAgICBjdXJQZXJjID0gMCxcclxuICAgICAgICAgICAgY2lyYyA9IE1hdGguUEkgKiAyLFxyXG4gICAgICAgICAgICBxdWFydCA9IE1hdGguUEkgLyAyLFxyXG4gICAgICAgICAgICBkZWxlZ2F0ZUlEID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgKyAnQ0EnO1xyXG5cclxuICAgICAgICAgIGlmICghJGNhbnZhcy5pcygnY2FudmFzJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzBkMjYzYyc7XHJcbiAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjZTVlOGU4JztcclxuXHJcbiAgICAgICAgICAkY2FudmFzLmF0dHIoJ2NpcmNsZS1hbmltYXRpb24taWQnLCBkZWxlZ2F0ZUlEKTtcclxuICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZSgnW2NpcmNsZS1hbmltYXRpb24taWQ9JyArIGRlbGVnYXRlSUQgKyAnXScsICdzdGFydEFuaW1hdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGN1clBlcmMgPSAwO1xyXG4gICAgICAgICAgICBhbmltYXRlKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZSgnW2NpcmNsZS1hbmltYXRpb24taWQ9JyArIGRlbGVnYXRlSUQgKyAnXScsICdjbGVhckFuaW1hdGUnLCBjbGVhcik7XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZShjdXJyZW50KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50ID8gY3VycmVudCA6IDA7XHJcbiAgICAgICAgICAgIGNsZWFyKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gcGVyY2VudFN0cm9rZTtcclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1NYXRoLm1pbihjdXJyZW50LCBtYXhWYWx1ZSAvIDEwMCkpIC0gcXVhcnQsIHRydWUpO1xyXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHJlbWFpbmluZ1N0cm9rZTtcclxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1jdXJyZW50KSAtIHF1YXJ0LCB0cnVlKTtcclxuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICAgICAgY3VyUGVyYysrO1xyXG4gICAgICAgICAgICBpZiAoY3VyUGVyYyA8IDExMCkge1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZShjdXJQZXJjIC8gMTAwKVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gY2xlYXIoKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMud2lkdGgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfTtcclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAkLmZuLmJsb2NrTGluayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyICRibG9ja0xpbmsgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICBkZXN0aW5hdGlvbiA9ICRibG9ja0xpbmsuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgICAgICAgZGVzdGluYXRpb24gPSAnNDQ0Mi5hc3B4LycgKyBkZXN0aW5hdGlvbjtcclxuICAgICAgICAgIGluaXRCbG9jaygpO1xyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIGluaXRCbG9jaygpIHtcclxuICAgICAgICAgICAgJGJsb2NrTGluay5vbignY2xpY2snLCBoYW5kbGVDbGljayk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKCkge1xyXG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBsb2NhdGlvbiA9IGRlc3RpbmF0aW9uO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfTtcclxuXHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICB2YXIgZ3VpLFxyXG4gICAgICAgIHZpZGVvLFxyXG4gICAgICAgIG92ZXJsYXk7XHJcblxyXG4gICAgICBpbml0TGVnYWN5KCk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBpbml0TGVnYWN5KCkge1xyXG4gICAgICAgIC8vIFRoaXMgaXMgd2VpcmQgLSBub3QgZ29pbmcgdG8gdG91Y2ggaXRcclxuICAgICAgICBvdmVybGF5ID0gbmV3IE92ZXJsYXlNb2R1bGUoKTtcclxuICAgICAgICBndWkgPSBuZXcgR3VpTW9kdWxlKG92ZXJsYXkpO1xyXG4gICAgICAgIC8vIHZpZGVvID0gbmV3IFZpZGVvTW9kdWxlKCk7IC8vIFJlcGxhY2Ugd2l0aCB2aWRlby5qcyBtb2R1bGVcclxuXHJcbiAgICAgICAgLy8gTmVlZCB0byBoYXZlIGEgY2xhc3MgdG8gaG9vayBvbnRvIGZvciBGcmVuY2ggbGFuZ3VhZ2UgcGFnZVxyXG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZignL2ZyLycpICE9PSAtMSkge1xyXG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdmcicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU21vb3RoIHNjcm9sbGluZyBmb3IgYW5jaG9yIGxpbmtzXHJcbiAgICAgICAgJCgnYVtocmVmXj1cIiNcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgdmFyIHRhcmdldCA9ICQodGhpcy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XHJcbiAgICAgICAgICBpZiAodGFyZ2V0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgc2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wICsgNTJcclxuICAgICAgICAgICAgfSwgNzUwKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGFyZ2V0LnNlbGVjdG9yICE9PSBcIiNcIikge1xyXG4gICAgICAgICAgICAkKCcjbWFpbi1tZW51LWFuY2hvcicpLmNzcyh7ICdkaXNwbGF5JzogJ25vbmUnIH0pO1xyXG4gICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2lzLXJldmVhbC1vcGVuIGJyYW5kZWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gTW9iaWxlIG1lbnUgbmVlZHMgdG8gbWltaWMgRm91bmRhdGlvbiByZXZlYWwgLSBub3QgZW5vdWdoIHRpbWUgdG8gaW1wbGVtZW50IGRpZmZlcmVudCBuYXZzIGluIGEgcmV2ZWFsIG1vZGFsIHByb3Blcmx5XHJcbiAgICAgICAgJCgnLm1lbnUtaWNvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2lzLXJldmVhbC1vcGVuIGJyYW5kZWQnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gcXVpY2sgYW5kIGRpcnR5IG1vYmlsZSBtZW51IGNsb3NlcyAtIG5vdCBmYW1pbGlhciB3aXRoIEZvdW5kYXRpb24gcGF0dGVybiB0byBmaXJlIHRoZXNlXHJcbiAgICAgICAgJCgnLnRvcC1iYXIgLmNsb3NlLWJ1dHRvbi5zaG93LWZvci1zbWFsbC1vbmx5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgJCgnI21haW4tbWVudS1hbmNob3InKS5jc3MoeyAnZGlzcGxheSc6ICdub25lJyB9KTtcclxuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaXMtcmV2ZWFsLW9wZW4gYnJhbmRlZCcpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDY0MCkge1xyXG4gICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2JyYW5kZWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgZnVuY3Rpb24gR3VpTW9kdWxlKG92ZXJsYXlSZWZlcmVuY2UpIHtcclxuICAgICAgICB2YXIgbXVsdGlUYWJUb2dnbGVTZWxlY3RvciA9ICdbY2xhc3MqPVwidG9nZ2xlLVwiXTpub3QoW2NsYXNzKj1cImluZm8tdG9nZ2xlXCJdKScsXHJcbiAgICAgICAgICBtdWx0aVRhYkNvbnRlbnRTZWxlY3RvciA9ICdbY2xhc3MqPVwiY29udGVudC1cIl0nLFxyXG4gICAgICAgICAgbXVsdGlUYWJTZWxlY3RvciA9ICcubXVsdGktdGFiLW91dGxpbmUnLFxyXG4gICAgICAgICAgJGVkZ2VPdmVybGF5TG9jYXRpb24gPSAkKCcjZWRnZS1vdmVybGF5LWNvbnRlbnQnKSxcclxuICAgICAgICAgIG92ZXJsYXkgPSBvdmVybGF5UmVmZXJlbmNlLFxyXG4gICAgICAgICAgJG92ZXJsYXlTbGlkZXIsXHJcbiAgICAgICAgICAkcHJvZmlsZVNsaWRlcixcclxuICAgICAgICAgICRwcm9maWxlU2xpZGVyVmlkZW9TZWN0aW9uSG9sZGVyID0gJCgnPGRpdj48L2Rpdj4nKSxcclxuICAgICAgICAgIHdpbmRvd1NpemluZ0RlbGF5LFxyXG4gICAgICAgICAgd2luZG93U2Nyb2xsaW5nRGVsYXksXHJcbiAgICAgICAgICBvdmVybGF5T3BlbixcclxuICAgICAgICAgIGlzUmVzcG9uc2l2ZVN0YXRlID0gZmFsc2UsXHJcbiAgICAgICAgICBzY3JvbGxlZFRvVmlldyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpbml0R3VpKCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXRHdWkoKSB7XHJcbiAgICAgICAgICBhZGRNdWx0aVRhYlRvZ2dsZUhhbmRsZXJzKCk7XHJcbiAgICAgICAgICAkKCcuYmxvY2stbGluaycpLmJsb2NrTGluaygpO1xyXG4gICAgICAgICAgJG92ZXJsYXlTbGlkZXIgPSAkKCcub3VyLWJ1c2luZXNzLXNsaWRlcicpO1xyXG4gICAgICAgICAgJCgnI2VkZ2Utb3ZlcmxheS1jb250ZW50JykuZmluZCgnLmNhcm91c2VsLW5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJG92ZXJsYXlTbGlkZXIuc2xpY2soJ3NsaWNrTmV4dCcpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgaWYgKCQoXCIudmlkZW8tc2xpZGUuc2xpY2stYWN0aXZlXCIpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAkKCcuc2xpY2stbGlzdC5kcmFnZ2FibGUnKS5jc3MoeyBoZWlnaHQ6ICc2NjBweCcgfSk7XHJcbiAgICAgICAgICAgICQoJy5zZWN0aW9uLnByb2ZpbGVzLXNsaWRlcicpLmNzcyh7IGJhY2tncm91bmRDb2xvcjogJyNlNWU4ZTgnIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJCgnLnNsaWNrLWxpc3QuZHJhZ2dhYmxlJykuY3NzKHsgaGVpZ2h0OiAnYXV0bycgfSk7XHJcbiAgICAgICAgICAgICQoJy5zZWN0aW9uLnByb2ZpbGVzLXNsaWRlcicpLmNzcyh7IGJhY2tncm91bmRDb2xvcjogJyM3ZWM0YjknIH0pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICQoJy5wcm9maWxlLWNvdW50ZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJ2NhbnZhcycpLmNpcmNsZUFuaW1hdGlvbihwYXJzZUludCgkdGhpcy5maW5kKCdwJykuaHRtbCgpKSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgICRwcm9maWxlU2xpZGVyID0gJCgnLnByb2ZpbGVzLXNsaWRlcicpO1xyXG4gICAgICAgICAgJCh3aW5kb3cpLm9uKCdoYXNoY2hhbmdlJywgaGFuZGxlT3ZlcmxheUZyb21IYXNoKTtcclxuICAgICAgICAgIGhhbmRsZU92ZXJsYXlGcm9tSGFzaCgpO1xyXG4gICAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBkZWxheWVkSGFuZGxlV2luZG93U2l6aW5nKTtcclxuICAgICAgICAgIGhhbmRsZVdpbmRvd1NpemluZyh0cnVlKTtcclxuICAgICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZGVsYXllZEhhbmRsZVdpbmRvd1Njcm9sbCk7XHJcbiAgICAgICAgICBoYW5kbGVXaW5kb3dTY3JvbGxpbmcoKTtcclxuXHJcbiAgICAgICAgICAkKCcuaW5mby10b2dnbGUnKS5pbmZvVG9nZ2xlKCk7XHJcbiAgICAgICAgICAkKCcudG9wLWJhciArIC5zY3JlZW4nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJ2FbZGF0YS10b2dnbGVdJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIC8vIE5vdCBwcmV0dHkgLSBqdXN0IGFkZGluZyBxdWljayBhbmQgZGlydHkgc2hhcmUgbGluayBhY3Rpb25cclxuICAgICAgICAgICQoJy5zaGFyZS10b2dnbGUtdHJpZ2dlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJCgnLmluZm8tdG9nZ2xlJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgJCgnLnNoYXJlLXRvZ2dsZS1jbG9zZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJCgnLmluZm8tdG9nZ2xlJykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy0tLS0tXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFkZE11bHRpVGFiVG9nZ2xlSGFuZGxlcnMoKSB7XHJcbiAgICAgICAgICAkKCdib2R5JykuZGVsZWdhdGUobXVsdGlUYWJUb2dnbGVTZWxlY3RvciwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgIHRvZ2dsZUJhc2UgPSAkdGhpcy5hdHRyKCdjbGFzcycpLm1hdGNoKC90b2dnbGUtKFxcUyopPygkfFxccykvKVsxXSxcclxuICAgICAgICAgICAgICAkY29udGFpbmVyID0gJHRoaXMucGFyZW50cyhtdWx0aVRhYlNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgICAgICRjb250YWluZXIuZmluZChtdWx0aVRhYlRvZ2dsZVNlbGVjdG9yKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICRjb250YWluZXIuZmluZChtdWx0aVRhYkNvbnRlbnRTZWxlY3RvcikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkdGhpcy5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICRjb250YWluZXIuZmluZCgnLmNvbnRlbnQtJyArIHRvZ2dsZUJhc2UpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhbmltYXRlUHJvZmlsZVNsaWRlcigpIHtcclxuICAgICAgICAgIHZhciAkcHJvZmlsZVBhbmVscyxcclxuICAgICAgICAgICAgcHJvZmlsZVBhbmVsSGVpZ2h0ID0gMDtcclxuXHJcbiAgICAgICAgICBpZiAoc2Nyb2xsZWRUb1ZpZXcpIHtcclxuICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIuZmluZCgnLnNsaWNrLXNsaWRlJykucmVtb3ZlQ2xhc3MoJ3NsaWNrLWNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLmZpbmQoJy5zbGljay1hY3RpdmUnKS5hZGRDbGFzcygnc2xpY2stY29tcGxldGUnKTtcclxuICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXJcclxuICAgICAgICAgICAgICAuZmluZCgnLnNsaWNrLXNsaWRlOm5vdCguc2xpY2stY29tcGxldGUpJylcclxuICAgICAgICAgICAgICAuZmluZCgnLnByb2ZpbGUtY291bnRlciBjYW52YXMnKVxyXG4gICAgICAgICAgICAgIC50cmlnZ2VyKCdjbGVhckFuaW1hdGUnKTtcclxuICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXJcclxuICAgICAgICAgICAgICAuZmluZCgnLnNsaWNrLWNvbXBsZXRlJylcclxuICAgICAgICAgICAgICAuZmluZCgnLnByb2ZpbGUtY291bnRlciBjYW52YXMnKVxyXG4gICAgICAgICAgICAgIC50cmlnZ2VyKCdzdGFydEFuaW1hdGUnKTtcclxuICAgICAgICAgICAgaWYgKCRwcm9maWxlU2xpZGVyLmZpbmQoJy5zbGljay1hY3RpdmUnKS5pcygnW2NsYXNzKj1wcm9maWxlLV0nKSB8fCBpc1Jlc3BvbnNpdmVTdGF0ZSkge1xyXG4gICAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLmFkZENsYXNzKCdjb250cmFzdC1hcnJvdycpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLnJlbW92ZUNsYXNzKCdjb250cmFzdC1hcnJvdycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRwcm9maWxlUGFuZWxzID0gJHByb2ZpbGVTbGlkZXIuZmluZCgnLnByb2ZpbGUtMS1zbGlkZSwgLnByb2ZpbGUtMi1zbGlkZScpO1xyXG4gICAgICAgICAgICAkcHJvZmlsZVBhbmVscy5jc3MoeyBoZWlnaHQ6ICdhdXRvJyB9KTtcclxuICAgICAgICAgICAgJHByb2ZpbGVQYW5lbHMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSAkKHRoaXMpLm91dGVySGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChjdXJyZW50ID4gcHJvZmlsZVBhbmVsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICBwcm9maWxlUGFuZWxIZWlnaHQgPSBjdXJyZW50O1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRwcm9maWxlUGFuZWxzLmNzcyh7IGhlaWdodDogcHJvZmlsZVBhbmVsSGVpZ2h0IH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlU2xpZGVyU3RhdGUoc2xpZGVyLCBzdGF0ZSkge1xyXG4gICAgICAgICAgc2xpZGVyLnNsaWNrKFwic2xpY2tTZXRPcHRpb25cIiwgXCJhY2Nlc3NpYmlsaXR5XCIsIHN0YXRlKTtcclxuICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwiZHJhZ2dhYmxlXCIsIHN0YXRlKTtcclxuICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwic3dpcGVcIiwgc3RhdGUpO1xyXG4gICAgICAgICAgc2xpZGVyLnNsaWNrKFwic2xpY2tTZXRPcHRpb25cIiwgXCJ0b3VjaE1vdmVcIiwgc3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZGVsYXllZEhhbmRsZVdpbmRvd1NpemluZygpIHtcclxuICAgICAgICAgIGlmICh3aW5kb3dTaXppbmdEZWxheSkge1xyXG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHdpbmRvd1NpemluZ0RlbGF5KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB3aW5kb3dTaXppbmdEZWxheSA9IHdpbmRvdy5zZXRUaW1lb3V0KGhhbmRsZVdpbmRvd1NpemluZywgMjUwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWRIYW5kbGVXaW5kb3dTY3JvbGwoKSB7XHJcbiAgICAgICAgICBpZiAod2luZG93U2Nyb2xsaW5nRGVsYXkpIHtcclxuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh3aW5kb3dTY3JvbGxpbmdEZWxheSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgd2luZG93U2Nyb2xsaW5nRGVsYXkgPSB3aW5kb3cuc2V0VGltZW91dChoYW5kbGVXaW5kb3dTY3JvbGxpbmcsIDI1MCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVPdmVybGF5RnJvbUhhc2goZXZlbnQpIHtcclxuICAgICAgICAgIHZhciBmdWxsSGFzaEZyYWdtZW50ID0gJyNvdXItZWRnZS0nO1xyXG4gICAgICAgICAgLy9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGlmICghb3ZlcmxheU9wZW4gJiYgbG9jYXRpb24uaGFzaC5pbmRleE9mKGZ1bGxIYXNoRnJhZ21lbnQpID09PSAwKSB7XHJcbiAgICAgICAgICAgIG92ZXJsYXkub3Blbk92ZXJsYXkoXHJcbiAgICAgICAgICAgICAgJGVkZ2VPdmVybGF5TG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgaGFuZGxlT3ZlcmxheU9wZW4sIGhhbmRsZU92ZXJsYXlDbG9zZSwgdHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVPdmVybGF5T3BlbihldmVudCkge1xyXG4gICAgICAgICAgdmFyIGluaXRpYWxJbmRleDtcclxuXHJcbiAgICAgICAgICBpbml0U2xpZGVyKCRvdmVybGF5U2xpZGVyLCB7XHJcbiAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpbml0aWFsSW5kZXggPSAkb3ZlcmxheVNsaWRlclxyXG4gICAgICAgICAgICAuZmluZCgnLicgKyBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyNvdXItJywgJycpICsgJzpub3QoLnNsaWNrLWNsb25lZCknKVxyXG4gICAgICAgICAgICAuYXR0cignZGF0YS1zbGljay1pbmRleCcpO1xyXG4gICAgICAgICAgJG92ZXJsYXlTbGlkZXIuc2xpY2soJ3NsaWNrR29UbycsIGluaXRpYWxJbmRleCwgdHJ1ZSk7XHJcbiAgICAgICAgICAkb3ZlcmxheVNsaWRlci5vbignYWZ0ZXJDaGFuZ2UnLCBoYW5kbGVTbGlkZUNoYW5nZSk7XHJcbiAgICAgICAgICBoYW5kbGVTbGlkZUNoYW5nZShudWxsLCBudWxsLCBwYXJzZUludCgkKCcjbW9kYWxPdmVybGF5IC5zbGljay1hY3RpdmUnKS5hdHRyKCdkYXRhLXNsaWNrLWluZGV4JykpKTtcclxuICAgICAgICAgIGhhbmRsZVdpbmRvd1NpemluZygpO1xyXG4gICAgICAgICAgb3ZlcmxheU9wZW4gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUNsb3NlKGV2ZW50KSB7XHJcbiAgICAgICAgICB2YXIgeVBvcyxcclxuICAgICAgICAgICAgb3ZlcmxheUNvbnRlbnQgPSAkKCcjbW9kYWxPdmVybGF5ID4gZGl2Jyk7XHJcblxyXG4gICAgICAgICAgJG92ZXJsYXlTbGlkZXIuc2xpY2soJ3Vuc2xpY2snKTtcclxuICAgICAgICAgICRvdmVybGF5U2xpZGVyLm9mZignYWZ0ZXJDaGFuZ2UnKTtcclxuICAgICAgICAgICQoJy5vdmVybGF5LXJlcG9zaXRvcnknKS5hcHBlbmQob3ZlcmxheUNvbnRlbnQpO1xyXG4gICAgICAgICAgaWYgKFwicHVzaFN0YXRlXCIgaW4gaGlzdG9yeSlcclxuICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoXCJcIiwgZG9jdW1lbnQudGl0bGUsIGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoKTtcclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB5UG9zID0gJChkb2N1bWVudCkuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uLmhhc2ggPSBcIlwiO1xyXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoeVBvcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvdmVybGF5T3BlbiA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlU2xpZGVDaGFuZ2UoZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUpIHtcclxuICAgICAgICAgIHZhciBuZXh0U2xpZGUgPSAoY3VycmVudFNsaWRlICsgMSkgJSAoJCgnLnNsaWNrLXNsaWRlOm5vdCguc2xpY2stY2xvbmVkKScpLmxlbmd0aCAtIDEpLFxyXG4gICAgICAgICAgICBuZXh0VGl0bGUgPSAkKCRvdmVybGF5U2xpZGVyLmZpbmQoJ1tkYXRhLXNsaWNrLWluZGV4PScgKyBuZXh0U2xpZGUgKyAnXSAuY29sdW1uczpmaXJzdC1jaGlsZCBwJykuZ2V0KDApKS5odG1sKCksXHJcbiAgICAgICAgICAgIG5ld0hhc2ggPSAnb3VyLScgKyAkb3ZlcmxheVNsaWRlclxyXG4gICAgICAgICAgICAgICAgLmZpbmQoJ1tkYXRhLXNsaWNrLWluZGV4PScgKyBjdXJyZW50U2xpZGUgKyAnXScpXHJcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnKVxyXG4gICAgICAgICAgICAgICAgLm1hdGNoKC8oZWRnZS1cXFMqKS8pWzFdO1xyXG5cclxuICAgICAgICAgICQoJyNtb2RhbE92ZXJsYXkgLmNhcm91c2VsLW5leHQgYScpLmh0bWwobmV4dFRpdGxlKTtcclxuICAgICAgICAgIGxvY2F0aW9uLmhhc2ggPSBuZXdIYXNoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlV2luZG93U2l6aW5nKGluaXQpIHtcclxuICAgICAgICAgIHZhciB3aW5kb3dXaWR0aCA9ICQod2luZG93KS53aWR0aCgpLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlTGltaXQgPSAwLFxyXG4gICAgICAgICAgICBuZXdJc1Jlc3BvbnNpdmVTdGF0ZSA9IHdpbmRvd1dpZHRoIDwgcmVzcG9uc2l2ZUxpbWl0O1xyXG5cclxuICAgICAgICAgIGlmICgkb3ZlcmxheVNsaWRlci5pcygnLnNsaWNrLWluaXRpYWxpemVkJykpIHtcclxuICAgICAgICAgICAgY2hhbmdlU2xpZGVyU3RhdGUoJG92ZXJsYXlTbGlkZXIsICFuZXdJc1Jlc3BvbnNpdmVTdGF0ZSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGlzUmVzcG9uc2l2ZVN0YXRlICE9PSBuZXdJc1Jlc3BvbnNpdmVTdGF0ZSkge1xyXG4gICAgICAgICAgICBpc1Jlc3BvbnNpdmVTdGF0ZSA9IG5ld0lzUmVzcG9uc2l2ZVN0YXRlO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpbml0KSB7XHJcbiAgICAgICAgICAgIGluaXRQcm9maWxlU2xpZGVyKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVXaW5kb3dTY3JvbGxpbmcoKSB7XHJcbiAgICAgICAgICBpZiAoIXNjcm9sbGVkVG9WaWV3KSB7XHJcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyAkKHdpbmRvdykuaGVpZ2h0KCkgPiAkcHJvZmlsZVNsaWRlci5vZmZzZXQoKS50b3ApIHtcclxuICAgICAgICAgICAgICBzY3JvbGxlZFRvVmlldyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoYW5pbWF0ZVByb2ZpbGVTbGlkZXIsIDUwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXRQcm9maWxlU2xpZGVyKCkge1xyXG4gICAgICAgICAgaW5pdFNsaWRlcigkcHJvZmlsZVNsaWRlciwge1xyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogdHJ1ZSxcclxuICAgICAgICAgICAgcHJldkFycm93OiAnPHNwYW4gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2Fyb3VzZWwtcHJldlwiPjxpbWcgc3JjPVwiLi4vaW1hZ2VzL0Fycm93LU1haW5BcnRpY2xlLUNhcm91c2VsLUJsYWNrLUwucG5nXCI+PC9zcGFuPicsXHJcbiAgICAgICAgICAgIG5leHRBcnJvdzogJzxzcGFuIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNhcm91c2VsLW5leHRcIj48aW1nIHNyYz1cIi4uL2ltYWdlcy9BcnJvdy1NYWluQXJ0aWNsZS1DYXJvdXNlbC1CbGFjay1SLnBuZ1wiPjwvc3Bhbj4nXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGFuaW1hdGVQcm9maWxlU2xpZGVyKCk7XHJcbiAgICAgICAgICAkcHJvZmlsZVNsaWRlci5vbignYWZ0ZXJDaGFuZ2UnLCBhbmltYXRlUHJvZmlsZVNsaWRlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0U2xpZGVyKHRhcmdldCwgb3B0aW9ucykge1xyXG4gICAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICBzcGVlZDogNzUwLFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXHJcbiAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAyLFxyXG4gICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2OCxcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHRhcmdldC5zbGljaygkLmV4dGVuZChkZWZhdWx0cywgb3B0aW9ucykpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gT3ZlcmxheU1vZHVsZSgpIHtcclxuICAgICAgICB2YXIgJG92ZXJsYXksXHJcbiAgICAgICAgICAkYm9keSA9ICQoJ2JvZHknKSxcclxuICAgICAgICAgIG92ZXJsYXlTaXppbmdEZWxheSxcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZSA9IHt9LFxyXG4gICAgICAgICAgaXNPcGVuRmxhZyA9IGZhbHNlLFxyXG4gICAgICAgICAgJGNsb3NlQnV0dG9uO1xyXG5cclxuICAgICAgICBpbml0T3ZlcmxheSgpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgb3Blbk92ZXJsYXk6IG9wZW5PdmVybGF5LFxyXG4gICAgICAgICAgaXNPcGVuOiBpc09wZW5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0T3ZlcmxheSgpIHtcclxuICAgICAgICAgICRvdmVybGF5ID0gJCgnPGRpdj48L2Rpdj4nKTtcclxuICAgICAgICAgICRvdmVybGF5LmF0dHIoJ2lkJywgJ21vZGFsT3ZlcmxheScpO1xyXG4gICAgICAgICAgJG92ZXJsYXkuYXR0cignY2xhc3MnLCAncmV2ZWFsJyk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5hdHRyKCdkYXRhLXJldmVhbCcsIHRydWUpO1xyXG4gICAgICAgICAgJGJvZHkuYXBwZW5kKCRvdmVybGF5KTtcclxuICAgICAgICAgICRvdmVybGF5Lm9uKCdvcGVuLnpmLnJldmVhbCcsIGhhbmRsZU92ZXJsYXlPcGVuKTtcclxuICAgICAgICAgICQod2luZG93KS5vbignY2xvc2VkLnpmLnJldmVhbCcsIGhhbmRsZU92ZXJsYXlDbG9zZSk7XHJcbiAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGRlbGF5ZWRIYW5kbGVPdmVybGF5U2l6aW5nKTtcclxuICAgICAgICAgIGluaXRDbG9zZUJ1dHRvbigpO1xyXG4gICAgICAgICAgbmV3IEZvdW5kYXRpb24uUmV2ZWFsKCRvdmVybGF5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZGVsYXllZEhhbmRsZU92ZXJsYXlTaXppbmcoKSB7XHJcbiAgICAgICAgICBpZiAob3ZlcmxheVNpemluZ0RlbGF5KSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQob3ZlcmxheVNpemluZ0RlbGF5KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBvdmVybGF5U2l6aW5nRGVsYXkgPSB3aW5kb3cuc2V0VGltZW91dChvdmVybGF5U2l6aW5nLCAyNTApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUNsb3NlKGV2ZW50KSB7XHJcbiAgICAgICAgICBpc09wZW5GbGFnID0gZmFsc2U7XHJcbiAgICAgICAgICBpZiAoY3VycmVudEluc3RhbmNlLmNsb3NlKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5jbG9zZShldmVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvdmVybGF5U2l6ZUNsZWFudXAoKTtcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZSA9IHt9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheU9wZW4oZXZlbnQpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBpc09wZW5GbGFnID0gdHJ1ZTtcclxuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICAgICRvdmVybGF5LmZpbmQoJyonKS5mb3VuZGF0aW9uKCk7XHJcbiAgICAgICAgICBpZiAoY3VycmVudEluc3RhbmNlLm9wZW4pIHtcclxuICAgICAgICAgICAgY3VycmVudEluc3RhbmNlLm9wZW4oZXZlbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3ZlcmxheVNpemluZygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdENsb3NlQnV0dG9uKCkge1xyXG4gICAgICAgICAgdmFyICRpbm5lclNwYW4gPSAkKCc8c3Bhbj48L3NwYW4+Jyk7XHJcblxyXG4gICAgICAgICAgJGNsb3NlQnV0dG9uID0gJCgnPGJ1dHRvbiBkYXRhLWNsb3NlPjwvYnV0dG9uPicpO1xyXG4gICAgICAgICAgJGNsb3NlQnV0dG9uLmFkZENsYXNzKCdjbG9zZS1idXR0b24nKTtcclxuICAgICAgICAgICRjbG9zZUJ1dHRvbi5hdHRyKCdhcmlhLWxhYmVsJywgJ0Nsb3NlIG1vZGFsJyk7XHJcbiAgICAgICAgICAkaW5uZXJTcGFuLmF0dHIoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XHJcbiAgICAgICAgICAkaW5uZXJTcGFuLmh0bWwoJyZ0aW1lczsnKTtcclxuICAgICAgICAgICRjbG9zZUJ1dHRvbi5hcHBlbmQoJGlubmVyU3Bhbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc09wZW4oKSB7XHJcbiAgICAgICAgICByZXR1cm4gaXNPcGVuRmxhZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5PdmVybGF5KHVybE9yTWFya3VwLCBvcGVuQ2FsbGJhY2ssIGNsb3NlQ2FsbGJhY2ssIGZ1bGxTY3JlZW4pIHtcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5vcGVuID0gb3BlbkNhbGxiYWNrO1xyXG4gICAgICAgICAgY3VycmVudEluc3RhbmNlLmNsb3NlID0gY2xvc2VDYWxsYmFjaztcclxuICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5mdWxsID0gZnVsbFNjcmVlbjtcclxuICAgICAgICAgIGlmICh0eXBlb2YgdXJsT3JNYXJrdXAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIG9wZW5PdmVybGF5V2l0aEFqYXgodXJsT3JNYXJrdXApO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3Blbk92ZXJsYXlXaXRoTWFya3VwKHVybE9yTWFya3VwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvcGVuT3ZlcmxheVdpdGhBamF4KHVybCkge1xyXG4gICAgICAgICAgJC5hamF4KHVybCkuZG9uZShvcGVuT3ZlcmxheVdpdGhNYXJrdXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb3Blbk92ZXJsYXlXaXRoTWFya3VwKG1hcmt1cCkge1xyXG4gICAgICAgICAgJG92ZXJsYXkuaHRtbChtYXJrdXApO1xyXG4gICAgICAgICAgJG92ZXJsYXkuYXBwZW5kKCRjbG9zZUJ1dHRvbik7XHJcbiAgICAgICAgICBpZiAoY3VycmVudEluc3RhbmNlLmZ1bGwpIHtcclxuICAgICAgICAgICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ2Z1bGwnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICRvdmVybGF5LmZvdW5kYXRpb24oJ29wZW4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG92ZXJsYXlTaXplQ2xlYW51cCgpIHtcclxuICAgICAgICAgICRvdmVybGF5LnJlbW92ZUNsYXNzKCdmdWxsJyk7XHJcbiAgICAgICAgICAkb3ZlcmxheS5yZW1vdmVDbGFzcygndG91cicpO1xyXG4gICAgICAgICAgJG92ZXJsYXkuaHRtbCgnJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBvdmVybGF5U2l6aW5nKCkge1xyXG4gICAgICAgICAgdmFyIG92ZXJsYXlIZWlnaHQgPSAkb3ZlcmxheS5oZWlnaHQoKSxcclxuICAgICAgICAgICAgd2luZG93SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG5cclxuICAgICAgICAgIGlmIChvdmVybGF5SGVpZ2h0ID4gd2luZG93SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICRvdmVybGF5LmNzcyh7XHJcbiAgICAgICAgICAgICAgdG9wOiAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkb3ZlcmxheS5hZGRDbGFzcygnZnVsbCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH0pKGpRdWVyeSk7XHJcblxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgdmFyIHZpZHMgPSBbXSwgYnJpZ2h0Q292ZTtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIF9wYXJzZVZpZGVvcygpO1xyXG5cclxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgVmlkZW9KUyBtZXRob2QgaXMgYXZhaWxhYmxlIGFuZCBmaXJlIHJlYWR5IGV2ZW50IGhhbmRsZXJzIGlmIHNvXHJcbiAgICAvLyBicmlnaHRDb3ZlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gICBpZiAoJCgnLnZqcy1wbHVnaW5zLXJlYWR5JykubGVuZ3RoKSB7XHJcbiAgICAvLyAgICAgX2JyaWdodENvdmVSZWFkeSgpO1xyXG4gICAgLy8gICAgIGNsZWFySW50ZXJ2YWwoYnJpZ2h0Q292ZSk7XHJcbiAgICAvLyAgIH1cclxuICAgIC8vIH0sIDUwMClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wYXJzZVZpZGVvcygpIHtcclxuICAgIHZhciAkZ3JvdXAsXHJcbiAgICAgICR2aWRlbyxcclxuICAgICAgZGF0YSA9IHt9LFxyXG4gICAgICBwcmVsb2FkT3B0aW9ucyA9IFsnYXV0bycsICdtZXRhZGF0YScsICdub25lJ11cclxuXHJcbiAgICAvLyBFYWNoIGdyb3VwIGNhbiBlZmZlY3RpdmVseSB1c2UgYSBkaWZmZXJlbnQgcGxheWVyIHdoaWNoIHdpbGwgb25seSBiZSBsb2FkZWQgb25jZVxyXG4gICAgJCgnLmlnLXZpZGVvLWdyb3VwJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRncm91cCA9ICQodGhpcyk7XHJcbiAgICAgIGRhdGEuYWNjb3VudCA9ICRncm91cC5kYXRhKCdhY2NvdW50Jyk7XHJcbiAgICAgIGRhdGEucGxheWVyID0gJGdyb3VwLmRhdGEoJ3BsYXllcicpO1xyXG5cclxuICAgICAgLy8gTG9hZCByZXF1aXJlZCBKUyBmb3IgYSBwbGF5ZXJcclxuICAgICAgX2luamVjdEJyaWdodENvdmVKUyhkYXRhKTtcclxuXHJcbiAgICAgIC8vIExvb3AgdGhyb3VnaCB2aWRlbydzXHJcbiAgICAgICRncm91cC5maW5kKCcuaWctdmlkZW8tanMnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICR2aWRlbyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyAocmVxdWlyZWQpXHJcbiAgICAgICAgZGF0YS5pZCA9ICR2aWRlby5kYXRhKCdpZCcpO1xyXG5cclxuICAgICAgICAvLyBDYXB0dXJlIG9wdGlvbnMgKG9wdGlvbmFsKVxyXG4gICAgICAgIGRhdGEudGl0bGUgPSAkdmlkZW8uZGF0YSgndGl0bGUnKSA/ICR2aWRlby5kYXRhKCd0aXRsZScpIDogJyc7XHJcbiAgICAgICAgZGF0YS5kZXNjcmlwdGlvbiA9ICR2aWRlby5kYXRhKCdkZXNjcmlwdGlvbicpID8gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgOiAnJztcclxuICAgICAgICBkYXRhLmF1dG8gPSAkdmlkZW8uZGF0YSgnYXV0b3BsYXknKSA/ICdhdXRvcGxheScgOiAnJztcclxuICAgICAgICBkYXRhLmN0cmwgPSAkdmlkZW8uZGF0YSgnY29udHJvbHMnKSA/ICdjb250cm9scycgOiAnJztcclxuICAgICAgICBkYXRhLnByZWxvYWQgPSAocHJlbG9hZE9wdGlvbnMuaW5kZXhPZigkdmlkZW8uZGF0YSgncHJlbG9hZCcpKSA+IC0xKSA/ICR2aWRlby5kYXRhKCdwcmVsb2FkJykgOiAnYXV0byc7XHJcblxyXG4gICAgICAgIC8vIFN0b3JlIElEJ3MgZm9yIGFsbCB2aWRlbydzIG9uIHRoZSBwYWdlIC0gaW4gY2FzZSB3ZSB3YW50IHRvIHJ1biBhIHBvc3QtbG9hZCBwcm9jZXNzIG9uIGVhY2hcclxuICAgICAgICB2aWRzLnB1c2goZGF0YS5pZCk7XHJcblxyXG4gICAgICAgIC8vIExldCdzIHJlcGxhY2UgdGhlIGlnLXZpZGVvLWpzICdkaXJlY3RpdmUnIHdpdGggdGhlIG5lY2Vzc2FyeSBCcmlnaHRjb3ZlIGNvZGVcclxuICAgICAgICBfaW5qZWN0VGVtcGxhdGUoJHZpZGVvLCBkYXRhLCBpbmRleClcclxuICAgICAgfSk7XHJcblxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9pbmplY3RCcmlnaHRDb3ZlSlMoZGF0YSkge1xyXG4gICAgdmFyIGluZGV4anMgPSBgPHNjcmlwdCBzcmM9XCIvL3BsYXllcnMuYnJpZ2h0Y292ZS5uZXQvJHtkYXRhLmFjY291bnR9LyR7ZGF0YS5wbGF5ZXJ9X2RlZmF1bHQvaW5kZXgubWluLmpzXCI+PC9zY3JpcHQ+YDtcclxuICAgICQoJ2JvZHknKS5hcHBlbmQoaW5kZXhqcyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfaW5qZWN0VGVtcGxhdGUoJHZpZGVvLCBkYXRhLCBpbmRleCkge1xyXG4gICAgdmFyIGh0bWwgPSBgPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lclwiPjxzcGFuIGNsYXNzPVwidmlkZW8tb3ZlcmxheSAke2RhdGEuaWR9XCI+PC9zcGFuPjxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXItcmVzcG9uc2l2ZVwiPjx2aWRlbyBkYXRhLXNldHVwPSd7XCJ0ZWNoT3JkZXJcIjogW1wiaHRtbDVcIl19JyBkYXRhLXZpZGVvLWlkPVwiJHtkYXRhLmlkfVwiIHByZWxvYWQ9XCIke2RhdGEucHJlbG9hZH1cIiBkYXRhLWFjY291bnQ9XCIke2RhdGEuYWNjb3VudH1cIiBkYXRhLXBsYXllcj1cIiR7ZGF0YS5wbGF5ZXJ9XCIgZGF0YS1lbWJlZD1cImRlZmF1bHRcIiBkYXRhLWFwcGxpY2F0aW9uLWlkPVwiJHtpbmRleH1cIiBjbGFzcz1cInZpZGVvLWpzXCIgaWQ9XCIke2RhdGEuaWR9XCIgJHtkYXRhLmN0cmx9ICR7ZGF0YS5hdXRvfT48L3ZpZGVvPjwvZGl2PjwvZGl2PjxoMiBjbGFzcz1cInZpZGVvLXRpdGxlXCI+JHtkYXRhLnRpdGxlfTwvaDI+PHAgY2xhc3M9XCJ2aWRlby1kZXNjcmlwdGlvblwiPiR7ZGF0YS5kZXNjcmlwdGlvbn08L3A+YDtcclxuICAgICR2aWRlby5yZXBsYWNlV2l0aChodG1sKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9icmlnaHRDb3ZlUmVhZHkoKSB7XHJcbiAgICB2aWRzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgIHZpZGVvanMoJyMnICsgZWwpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyAkKCcudmlkZW8tb3ZlcmxheS4nKyBlbCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgX3NlYXJjaExlZ2FjeUNvZGUoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zZWFyY2hMZWdhY3lDb2RlKCkge1xyXG5cclxuLy8gR0xPQkFMU1xyXG4gICAgdmFyIG1vZGVsVXJsID0gJ2h0dHBzOi8vc2VhcmNoLmludmVzdG9yc2dyb3VwLmNvbS9hcGkvY3dwc2VhcmNoPyc7XHJcbiAgICB2YXIgJGZpZWxkID0gJCgnI0ZpbmRBbk9mZmljZScpO1xyXG4gICAgdmFyIGxhbmcgPSAnZW4nO1xyXG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJy9mci8nKSA+IC0xKSB7XHJcbiAgICAgIGxhbmcgPSAnZnInO1xyXG4gICAgfVxyXG5cclxuLy8gUHJvY2VzcyB0aGUgbG9jYWwgcHJlZmV0Y2hlZCBkYXRhXHJcbiAgICB2YXIgc3VnZ2VzdGlvbnMgPSB7fTtcclxuICAgIHZhciBjaXRpZXMgPSBbXHJcbiAgICAgIFwiYXRoYWJhc2NhXCIsXHJcbiAgICAgIFwiYmx1ZmZ0b25cIixcclxuICAgICAgXCJib25ueXZpbGxlXCIsXHJcbiAgICAgIFwiYnJvb2tzXCIsXHJcbiAgICAgIFwiY2FsZ2FyeVwiLFxyXG4gICAgICBcImNhbXJvc2VcIixcclxuICAgICAgXCJjYW5tb3JlXCIsXHJcbiAgICAgIFwiZHJheXRvbiB2YWxsZXlcIixcclxuICAgICAgXCJlZG1vbnRvblwiLFxyXG4gICAgICBcImZvcnQgbWNtdXJyYXlcIixcclxuICAgICAgXCJmb3J0IHNhc2thdGNoZXdhblwiLFxyXG4gICAgICBcImdyYW5kZSBwcmFpcmllXCIsXHJcbiAgICAgIFwiaGFsa2lya1wiLFxyXG4gICAgICBcImhpbGxjcmVzdCBtaW5lc1wiLFxyXG4gICAgICBcImhpbnRvblwiLFxyXG4gICAgICBcImxlZHVjXCIsXHJcbiAgICAgIFwibGV0aGJyaWRnZVwiLFxyXG4gICAgICBcImxsb3lkbWluc3RlclwiLFxyXG4gICAgICBcIm1lZGljaW5lIGhhdFwiLFxyXG4gICAgICBcIm1vcmludmlsbGVcIixcclxuICAgICAgXCJwZWFjZSByaXZlclwiLFxyXG4gICAgICBcInBpbmNoZXIgY3JlZWtcIixcclxuICAgICAgXCJwcm92b3N0XCIsXHJcbiAgICAgIFwicmVkIGRlZXJcIixcclxuICAgICAgXCJzaGVyd29vZCBwYXJrXCIsXHJcbiAgICAgIFwic3BydWNlIGdyb3ZlXCIsXHJcbiAgICAgIFwic3QuIGFsYmVydFwiLFxyXG4gICAgICBcInN0ZXR0bGVyXCIsXHJcbiAgICAgIFwic3R1cmdlb24gY291bnR5XCIsXHJcbiAgICAgIFwidG9maWVsZFwiLFxyXG4gICAgICBcInZlcm1pbGlvblwiLFxyXG4gICAgICBcIndhaW53cmlnaHRcIixcclxuICAgICAgXCJ3ZXN0bG9ja1wiLFxyXG4gICAgICBcIndoaXRlbGF3XCIsXHJcbiAgICAgIFwiYWJib3RzZm9yZFwiLFxyXG4gICAgICBcImJyYWNrZW5kYWxlXCIsXHJcbiAgICAgIFwiYnVybmFieVwiLFxyXG4gICAgICBcImJ1cm5zIGxha2VcIixcclxuICAgICAgXCJjYW1wYmVsbCByaXZlclwiLFxyXG4gICAgICBcImNoYXNlXCIsXHJcbiAgICAgIFwiY2hpbGxpd2Fja1wiLFxyXG4gICAgICBcImNvbW94XCIsXHJcbiAgICAgIFwiY29xdWl0bGFtXCIsXHJcbiAgICAgIFwiY291cnRlbmF5XCIsXHJcbiAgICAgIFwiY3JhbmJyb29rXCIsXHJcbiAgICAgIFwiZGF3c29uIGNyZWVrXCIsXHJcbiAgICAgIFwiZHVuY2FuXCIsXHJcbiAgICAgIFwiZm9ydCBuZWxzb25cIixcclxuICAgICAgXCJmb3J0IHN0LiBqb2huXCIsXHJcbiAgICAgIFwiaW52ZXJtZXJlXCIsXHJcbiAgICAgIFwia2FtbG9vcHNcIixcclxuICAgICAgXCJrZWxvd25hXCIsXHJcbiAgICAgIFwibGFuZ2xleVwiLFxyXG4gICAgICBcIm1lcnJpdHRcIixcclxuICAgICAgXCJuYW5haW1vXCIsXHJcbiAgICAgIFwibmVsc29uXCIsXHJcbiAgICAgIFwibm9ydGggdmFuY291dmVyXCIsXHJcbiAgICAgIFwib2xpdmVyXCIsXHJcbiAgICAgIFwicGVudGljdG9uXCIsXHJcbiAgICAgIFwicG9ydCBhbGJlcm5pXCIsXHJcbiAgICAgIFwicG93ZWxsIHJpdmVyXCIsXHJcbiAgICAgIFwicHJpbmNlIGdlb3JnZVwiLFxyXG4gICAgICBcInF1YWxpY3VtIGJlYWNoXCIsXHJcbiAgICAgIFwicXVlc25lbFwiLFxyXG4gICAgICBcInJldmVsc3Rva2VcIixcclxuICAgICAgXCJyaWNobW9uZFwiLFxyXG4gICAgICBcInNhYW5pY2h0b25cIixcclxuICAgICAgXCJzYWxtb24gYXJtXCIsXHJcbiAgICAgIFwic2FsdCBzcHJpbmcgaXNsYW5kXCIsXHJcbiAgICAgIFwic2VjaGVsdFwiLFxyXG4gICAgICBcInNpZG5leVwiLFxyXG4gICAgICBcInNtaXRoZXJzXCIsXHJcbiAgICAgIFwic3VycmV5XCIsXHJcbiAgICAgIFwidGVycmFjZVwiLFxyXG4gICAgICBcInRyYWlsXCIsXHJcbiAgICAgIFwidmFuY291dmVyXCIsXHJcbiAgICAgIFwidmVybm9uXCIsXHJcbiAgICAgIFwidmljdG9yaWFcIixcclxuICAgICAgXCJ3ZXN0YmFua1wiLFxyXG4gICAgICBcIndpbGxpYW1zIGxha2VcIixcclxuICAgICAgXCJicmFuZG9uXCIsXHJcbiAgICAgIFwiZGF1cGhpblwiLFxyXG4gICAgICBcImZsaW4gZmxvblwiLFxyXG4gICAgICBcImdpbGxhbVwiLFxyXG4gICAgICBcImtpbGxhcm5leVwiLFxyXG4gICAgICBcIm1hbml0b3VcIixcclxuICAgICAgXCJtaWFtaVwiLFxyXG4gICAgICBcIm1vcmRlblwiLFxyXG4gICAgICBcIm5hcm9sXCIsXHJcbiAgICAgIFwicG9ydGFnZSBsYSBwcmFpcmllXCIsXHJcbiAgICAgIFwic2Vsa2lya1wiLFxyXG4gICAgICBcInN3YW4gcml2ZXJcIixcclxuICAgICAgXCJ0aGUgcGFzXCIsXHJcbiAgICAgIFwidmlyZGVuXCIsXHJcbiAgICAgIFwid2FycmVuXCIsXHJcbiAgICAgIFwid2lubmlwZWdcIixcclxuICAgICAgXCJiYXRodXJzdFwiLFxyXG4gICAgICBcImJlZGVsbFwiLFxyXG4gICAgICBcImVkbXVuZHN0b25cIixcclxuICAgICAgXCJmcmVkZXJpY3RvblwiLFxyXG4gICAgICBcImxhbnNkb3duZVwiLFxyXG4gICAgICBcIm1pcmFtaWNoaVwiLFxyXG4gICAgICBcIm1vbmN0b25cIixcclxuICAgICAgXCJxdWlzcGFtc2lzXCIsXHJcbiAgICAgIFwicmV4dG9uXCIsXHJcbiAgICAgIFwicm90aGVzYXlcIixcclxuICAgICAgXCJzYWludCBqb2huXCIsXHJcbiAgICAgIFwic2FpbnQgcGF1bFwiLFxyXG4gICAgICBcInN1c3NleFwiLFxyXG4gICAgICBcImJsYWtldG93blwiLFxyXG4gICAgICBcImNsYXJlbnZpbGxlXCIsXHJcbiAgICAgIFwiY29ybmVyIGJyb29rXCIsXHJcbiAgICAgIFwiZ2FuZGVyXCIsXHJcbiAgICAgIFwiZ3JhbmQgZmFsbHMgLSB3aW5kc29yXCIsXHJcbiAgICAgIFwibWFyeXN0b3duXCIsXHJcbiAgICAgIFwicm9hY2hlcyBsaW5lXCIsXHJcbiAgICAgIFwic3QuIGpvaG4nc1wiLFxyXG4gICAgICBcInRyaW5pdHlcIixcclxuICAgICAgXCJhbWhlcnN0XCIsXHJcbiAgICAgIFwiYW50aWdvbmlzaFwiLFxyXG4gICAgICBcImJhcnJpbmd0b24gcGFzc2FnZVwiLFxyXG4gICAgICBcImJlbGxpdmVhdSBjb3ZlXCIsXHJcbiAgICAgIFwiYnJpZGdldG93blwiLFxyXG4gICAgICBcImJyaWRnZXdhdGVyXCIsXHJcbiAgICAgIFwiZGFydG1vdXRoXCIsXHJcbiAgICAgIFwiZGF5dG9uXCIsXHJcbiAgICAgIFwiaGFsaWZheFwiLFxyXG4gICAgICBcIm1pZGRsZXRvblwiLFxyXG4gICAgICBcIm5ldyBnbGFzZ293XCIsXHJcbiAgICAgIFwibmV3IG1pbmFzXCIsXHJcbiAgICAgIFwibm9ydGggc3lkbmV5XCIsXHJcbiAgICAgIFwicGljdG91XCIsXHJcbiAgICAgIFwicG9ydCBoYXdrZXNidXJ5XCIsXHJcbiAgICAgIFwic3lkbmV5XCIsXHJcbiAgICAgIFwidHJ1cm9cIixcclxuICAgICAgXCJ5ZWxsb3drbmlmZVwiLFxyXG4gICAgICBcImFqYXhcIixcclxuICAgICAgXCJhbGdvbnF1aW4gaGlnaGxhbmRzXCIsXHJcbiAgICAgIFwiYW5jYXN0ZXJcIixcclxuICAgICAgXCJhdGlrb2thblwiLFxyXG4gICAgICBcImJhcnJpZVwiLFxyXG4gICAgICBcImJlbGxldmlsbGVcIixcclxuICAgICAgXCJib3dtYW52aWxsZVwiLFxyXG4gICAgICBcImJyYWNlYnJpZGdlXCIsXHJcbiAgICAgIFwiYnJhbXB0b25cIixcclxuICAgICAgXCJicmFudGZvcmRcIixcclxuICAgICAgXCJicm9ja3ZpbGxlXCIsXHJcbiAgICAgIFwiYnJvb2tsaW5cIixcclxuICAgICAgXCJidXJsaW5ndG9uXCIsXHJcbiAgICAgIFwiY2FtYnJpZGdlXCIsXHJcbiAgICAgIFwiY2FybGV0b24gcGxhY2VcIixcclxuICAgICAgXCJjaGF0aGFtXCIsXHJcbiAgICAgIFwiY2xheXRvblwiLFxyXG4gICAgICBcImNsaW50b25cIixcclxuICAgICAgXCJjb2JvdXJnXCIsXHJcbiAgICAgIFwiY29sbGluZ3dvb2RcIixcclxuICAgICAgXCJjb25jb3JkXCIsXHJcbiAgICAgIFwiY29ybndhbGxcIixcclxuICAgICAgXCJkcnlkZW5cIixcclxuICAgICAgXCJkdW5kYXNcIixcclxuICAgICAgXCJkdW5zZm9yZFwiLFxyXG4gICAgICBcImR1dHRvblwiLFxyXG4gICAgICBcImVsbGlvdCBsYWtlXCIsXHJcbiAgICAgIFwiZXRvYmljb2tlXCIsXHJcbiAgICAgIFwiZm9ydCBmcmFuY2VzXCIsXHJcbiAgICAgIFwiZ2FuYW5vcXVlXCIsXHJcbiAgICAgIFwiZ2Fyc29uXCIsXHJcbiAgICAgIFwiZ3JlZWx5XCIsXHJcbiAgICAgIFwiZ3JpbXNieVwiLFxyXG4gICAgICBcImd1ZWxwaFwiLFxyXG4gICAgICBcImhhaWxleWJ1cnlcIixcclxuICAgICAgXCJoYW1pbHRvblwiLFxyXG4gICAgICBcImhhbm92ZXJcIixcclxuICAgICAgXCJoZWFyc3RcIixcclxuICAgICAgXCJodW50c3ZpbGxlXCIsXHJcbiAgICAgIFwiamVyc2V5dmlsbGVcIixcclxuICAgICAgXCJrYW5hdGFcIixcclxuICAgICAgXCJrYXB1c2thc2luZ1wiLFxyXG4gICAgICBcImtlbm9yYVwiLFxyXG4gICAgICBcImtpbmdzdG9uXCIsXHJcbiAgICAgIFwia2lya2xhbmQgbGFrZVwiLFxyXG4gICAgICBcImtpdGNoZW5lclwiLFxyXG4gICAgICBcImxhbmd0b25cIixcclxuICAgICAgXCJsaW5kc2F5XCIsXHJcbiAgICAgIFwibG9uZG9uXCIsXHJcbiAgICAgIFwibWFwbGVcIixcclxuICAgICAgXCJtYXJhdGhvblwiLFxyXG4gICAgICBcIm1hcmtoYW1cIixcclxuICAgICAgXCJtZXJyaWNrdmlsbGVcIixcclxuICAgICAgXCJtaWx0b25cIixcclxuICAgICAgXCJtaW5kZW5cIixcclxuICAgICAgXCJtaXNzaXNzYXVnYVwiLFxyXG4gICAgICBcIm1vdW50IGZvcmVzdFwiLFxyXG4gICAgICBcIm1vdW50IGhvcGVcIixcclxuICAgICAgXCJuZXBlYW5cIixcclxuICAgICAgXCJuZXcgbGlza2VhcmRcIixcclxuICAgICAgXCJuZXdtYXJrZXRcIixcclxuICAgICAgXCJuaWFnYXJhIGZhbGxzXCIsXHJcbiAgICAgIFwibm9ydGggYmF5XCIsXHJcbiAgICAgIFwibm9ydGggeW9ya1wiLFxyXG4gICAgICBcIm9hayByaWRnZXNcIixcclxuICAgICAgXCJvYWt2aWxsZVwiLFxyXG4gICAgICBcIm9yYW5nZXZpbGxlXCIsXHJcbiAgICAgIFwib3JpbGxpYVwiLFxyXG4gICAgICBcIm9ydG9uXCIsXHJcbiAgICAgIFwib3NoYXdhXCIsXHJcbiAgICAgIFwib3R0YXdhXCIsXHJcbiAgICAgIFwib3dlbiBzb3VuZFwiLFxyXG4gICAgICBcInBhcnJ5IHNvdW5kXCIsXHJcbiAgICAgIFwicGVtYnJva2VcIixcclxuICAgICAgXCJwZW5ldGFuZ3Vpc2hlbmVcIixcclxuICAgICAgXCJwZXJ0aFwiLFxyXG4gICAgICBcInBldGVyYm9yb3VnaFwiLFxyXG4gICAgICBcInBldHJvbGlhXCIsXHJcbiAgICAgIFwicGlja2VyaW5nXCIsXHJcbiAgICAgIFwicmVkIGxha2VcIixcclxuICAgICAgXCJyaWRnZXRvd25cIixcclxuICAgICAgXCJzYXJuaWFcIixcclxuICAgICAgXCJzYXVsdCBzdGUuIG1hcmllXCIsXHJcbiAgICAgIFwic2NhcmJvcm91Z2hcIixcclxuICAgICAgXCJzY2hyZWliZXJcIixcclxuICAgICAgXCJzaW1jb2VcIixcclxuICAgICAgXCJzaW91eCBsb29rb3V0XCIsXHJcbiAgICAgIFwic3QuIGNhdGhhcmluZXNcIixcclxuICAgICAgXCJzdC4gbWFyeXNcIixcclxuICAgICAgXCJzdG91ZmZ2aWxsZVwiLFxyXG4gICAgICBcInN0cmF0Zm9yZFwiLFxyXG4gICAgICBcInN0dXJnZW9uIGZhbGxzXCIsXHJcbiAgICAgIFwic3VkYnVyeVwiLFxyXG4gICAgICBcInN1bmRyaWRnZVwiLFxyXG4gICAgICBcInRodW5kZXIgYmF5XCIsXHJcbiAgICAgIFwidGlsbHNvbmJ1cmdcIixcclxuICAgICAgXCJ0aW1taW5zXCIsXHJcbiAgICAgIFwidG9yb250b1wiLFxyXG4gICAgICBcInRyZW50b25cIixcclxuICAgICAgXCJVeGJyaWRnZVwiLFxyXG4gICAgICBcInZhbCBjYXJvblwiLFxyXG4gICAgICBcIndhbGtlcnRvblwiLFxyXG4gICAgICBcIndhdGVybG9vXCIsXHJcbiAgICAgIFwid2VsbGFuZFwiLFxyXG4gICAgICBcIndoaXRieVwiLFxyXG4gICAgICBcIndpbGxvd2RhbGVcIixcclxuICAgICAgXCJ3aW5kc29yXCIsXHJcbiAgICAgIFwid2luZ2hhbVwiLFxyXG4gICAgICBcIndvb2RicmlkZ2VcIixcclxuICAgICAgXCJjaGFybG90dGV0b3duLCBwZVwiLFxyXG4gICAgICBcInNvdXJpcywgcGVcIixcclxuICAgICAgXCJzdW1tZXJzaWRlLCBwZVwiLFxyXG4gICAgICBcIndlbGxpbmd0b25cIixcclxuICAgICAgXCJhbmpvdVwiLFxyXG4gICAgICBcImJvaXNicmlhbmRcIixcclxuICAgICAgXCJib3VjaGVydmlsbGVcIixcclxuICAgICAgXCJicm9zc2FyZFwiLFxyXG4gICAgICBcImNow6J0ZWF1Z3VheVwiLFxyXG4gICAgICBcImNoaWNvdXRpbWlcIixcclxuICAgICAgXCJjw7R0ZSBzYWludC1sdWNcIixcclxuICAgICAgXCJkb2xsYXJkLWRlcy1vcm1lYXV4XCIsXHJcbiAgICAgIFwiZ2F0aW5lYXVcIixcclxuICAgICAgXCJncmFuYnlcIixcclxuICAgICAgXCJsYXZhbFwiLFxyXG4gICAgICBcImzDqXZpc1wiLFxyXG4gICAgICBcIm1pcmFiZWxcIixcclxuICAgICAgXCJtb250cmVhbFwiLFxyXG4gICAgICBcIm5ldyByaWNobW9uZFwiLFxyXG4gICAgICBcInBvaW50ZS1jbGFpcmVcIixcclxuICAgICAgXCJxdcOpYmVjXCIsXHJcbiAgICAgIFwic2VwdC1pbGVzXCIsXHJcbiAgICAgIFwic2hlcmJyb29rZVwiLFxyXG4gICAgICBcInZpbGxlIHN0LWxhdXJlbnRcIixcclxuICAgICAgXCJ3ZXN0bW91bnRcIixcclxuICAgICAgXCJlYXN0ZW5kXCIsXHJcbiAgICAgIFwiZXN0ZXZhblwiLFxyXG4gICAgICBcImVzdGVyaGF6eVwiLFxyXG4gICAgICBcImZvYW0gbGFrZVwiLFxyXG4gICAgICBcImh1bWJvbGR0XCIsXHJcbiAgICAgIFwia2luZGVyc2xleVwiLFxyXG4gICAgICBcImxlYWRlclwiLFxyXG4gICAgICBcIm1hcGxlIGNyZWVrXCIsXHJcbiAgICAgIFwibWVhZG93IGxha2VcIixcclxuICAgICAgXCJtZWxmb3J0XCIsXHJcbiAgICAgIFwibWVsdmlsbGVcIixcclxuICAgICAgXCJtb29zZSBqYXdcIixcclxuICAgICAgXCJub3J0aCBiYXR0bGVmb3JkXCIsXHJcbiAgICAgIFwib3V0bG9va1wiLFxyXG4gICAgICBcIm94Ym93XCIsXHJcbiAgICAgIFwicHJpbmNlIGFsYmVydFwiLFxyXG4gICAgICBcInJlZ2luYVwiLFxyXG4gICAgICBcInJlZ2luYSBiZWFjaFwiLFxyXG4gICAgICBcInJvc2V0b3duXCIsXHJcbiAgICAgIFwic2Fza2F0b29uXCIsXHJcbiAgICAgIFwic2hlbGxicm9va1wiLFxyXG4gICAgICBcInN3aWZ0IGN1cnJlbnRcIixcclxuICAgICAgXCJ3YXRyb3VzXCIsXHJcbiAgICAgIFwid2F0c29uXCIsXHJcbiAgICAgIFwieW9ya3RvblwiLFxyXG4gICAgICBcIndoaXRlaG9yc2VcIlxyXG4gICAgXTtcclxuICAgIHN1Z2dlc3Rpb25zLmxvY2F0aW9ucyA9IG5ldyBCbG9vZGhvdW5kKHtcclxuICAgICAgZGF0dW1Ub2tlbml6ZXI6IEJsb29kaG91bmQudG9rZW5pemVycy53aGl0ZXNwYWNlLFxyXG4gICAgICBxdWVyeVRva2VuaXplcjogQmxvb2Rob3VuZC50b2tlbml6ZXJzLndoaXRlc3BhY2UsXHJcbiAgICAgIGxvY2FsOiBjaXRpZXNcclxuICAgIH0pO1xyXG5cclxuLy8gR2V0IHRoZSByZXN1bHRzXHJcbiAgICBmdW5jdGlvbiBnZXRTZWFyY2hSZXN1bHRzKHBhcmFtcykge1xyXG4gICAgICBwYXJhbXMuc2VhcmNodHlwZSA9ICdvZmZpY2UnO1xyXG4gICAgICBwYXJhbXMubmFtZSA9ICcnO1xyXG5cclxuICAgICAgLy8gTWFrZSBzdXJlIGVycm9yIG1lc3NhZ2UgaXMgaGlkZGVuIGVhY2ggdGltZVxyXG4gICAgICAkKCcuemVyby1yZXN1bHRzJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHJcbiAgICAgICQuZ2V0SlNPTihtb2RlbFVybCwgcGFyYW1zKVxyXG4gICAgICAgIC5hbHdheXMoKVxyXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICAgICAgJCgnI3NlYXJjaFJlc3VsdHNNb2RhbCcpLnJlbW92ZUNsYXNzKCdjbG9zZWQnKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgZGlzcGxheVNlYXJjaFJlc3VsdHMoJ29mZmljZS10ZW1wbGF0ZScsIHJlc3VsdCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCcuemVyby1yZXN1bHRzJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdEYXRhIGNvdWxkIG5vdCBiZSByZXRyaWV2ZWQsIHBsZWFzZSB0cnkgYWdhaW4nLCByZXN1bHQuc3RhdHVzICsgJyAnICsgcmVzdWx0LnN0YXR1c1RleHQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbi8vIEJlY2F1c2Ugd2UgYXJlIG9ubHkgc2VhcmNoaW5nIGZvciBjaXRpZXMsIHRoaXMgZnVuY3Rpb24gaXMgc2xpZ2h0bHkgcmVkdW5kYW50IC0gbGVhdmluZyBpdCBpbiBwbGFjZSBmb3Igbm93XHJcbiAgICBmdW5jdGlvbiBwYXJzZVNlYXJjaFN0cmluZygpIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICB2YXIgc2VhcmNoID0gJGZpZWxkLnZhbCgpO1xyXG5cclxuICAgICAgcmVzdWx0LmNpdHkgPSAnJztcclxuXHJcbiAgICAgIC8vIFNlYXJjaCBpbiB0aGUgbGFuZ3VhZ2Ugb2YgdGhlIHBhZ2VcclxuICAgICAgcmVzdWx0LmxhbmcgPSBsYW5nO1xyXG4gICAgICAvLyBXZSBvbmx5IHNlYXJjaCBjb25zdWx0YW50cyBmcm9tIHRoaXMgbWV0aG9kXHJcbiAgICAgIHJlc3VsdC5zZWFyY2h0eXBlID0gJ2Nvbic7XHJcblxyXG4gICAgICAvLyBDaGVjayB0aGUgc2VhcmNoIHN0cmluZyBmb3IgYSBwcmV2aW91c2x5IGRlZmluZWQgbG9jYXRpb25cclxuICAgICAgdmFyIHdvcmRzID0gc2VhcmNoLnNwbGl0KCcgJyk7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyBDaGVjayBlYWNoIHdvcmQgZm9yIGEgY2l0eSBmcm9tIHRoZSBwcmVkZWZpbmVkIGxpc3RcclxuICAgICAgICB2YXIgY2l0eSA9IHN1Z2dlc3Rpb25zLmxvY2F0aW9ucy5nZXQod29yZHNbaV0pO1xyXG4gICAgICAgIGlmIChjaXR5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJlc3VsdC5jaXR5ID0gY2l0eVswXTtcclxuICAgICAgICAgIHdvcmRzLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghcmVzdWx0LmNpdHkpIHtcclxuICAgICAgICByZXN1bHQuY2l0eSA9IHdvcmRzLmpvaW4oJyAnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkaXNwbGF5U2VhcmNoUmVzdWx0cyh0ZW1wbGF0ZUlELCBqc29uKSB7XHJcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSUQpLmlubmVySFRNTDtcclxuICAgICAgTXVzdGFjaGUucGFyc2UodGVtcGxhdGUpO1xyXG4gICAgICB2YXIgcmVuZGVyZWQgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIGpzb24pO1xyXG4gICAgICAkKCcjc2VhcmNoUmVzdWx0c01vZGFsJykuYXBwZW5kKHJlbmRlcmVkKTtcclxuICAgICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuLy9Jbml0IGV2ZXJ5dGhpbmdcclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBUcnkgdG8gcHJlZGV0ZXJtaW5lIHdoYXQgcmVzdWx0cyBzaG91bGQgc2hvd1xyXG4gICAgICAvLyBTZXR1cCB0aGUgdHlwZWFoZWFkXHJcbiAgICAgICQoJy50eXBlYWhlYWQnKS50eXBlYWhlYWQoe1xyXG4gICAgICAgICAgaGlnaGxpZ2h0OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7bmFtZTogJ2xvY2F0aW9ucycsIHNvdXJjZTogc3VnZ2VzdGlvbnMubG9jYXRpb25zLCBsaW1pdDogMn1cclxuICAgICAgKTtcclxuXHJcbiAgICAgIC8vIFNldHVwIHRoZSBmb3JtIHN1Ym1pc3Npb25cclxuICAgICAgJCgnLmlnLXNlYXJjaCcpLnN1Ym1pdChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXIgcGFyYW1zID0gcGFyc2VTZWFyY2hTdHJpbmcoKTtcclxuICAgICAgICBnZXRTZWFyY2hSZXN1bHRzKHBhcmFtcyk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gRmFrZSBtb2RhbCAtIEFkZGluZyBoYW5kbGVyIG9uIGRvY3VtZW50IHNvIGl0IGZpcmVzIGRlc3BpdGUgdGhlIGJ1dHRvbiBub3QgYmVpbmcgcmVuZGVyZWQgeWV0XHJcbiAgICAgICQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCIjc2VhcmNoUmVzdWx0c01vZGFsIC5jbG9zZS1idXR0b25cIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJyNzZWFyY2hSZXN1bHRzTW9kYWwnKS5hZGRDbGFzcygnY2xvc2VkJyk7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2lzLXJldmVhbC1vcGVuJyk7XHJcbiAgICAgICAgfSwgNDAwKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsIi8qIFRoaXMgZmlsZSBpcyB0aGUgZW50cnkgcG9pbnQgZm9yIHJvbGx1cCAoaHR0cDovL3JvbGx1cGpzLm9yZy8pIGFuZFxyXG4gZXNzZW50aW9uYWxseSAnYm9vdHN0cmFwcycgb3VyIGlnLmNvbSAnYXBwbGljYXRpb24nLlxyXG5cclxuIEFsbCBtb2R1bGVzIHNob3VsZCBiZSBpbXBvcnRlZCBoZXJlIHNvIHRoYXQgdGhleSBjYW4gYmUgaW5pdGlhbGl6ZWQgb25cclxuIGEgY2FzZS1ieS1jYXNlIGJhc2lzIChub3QgYWxsIHBhZ2VzIHJlcXVpcmUgdGhlIGluaXRpYWxpemF0aW9uIG9mIGEgY2Fyb3VzZWxcclxuIGZvciBpbnN0YW5jZSkuXHJcblxyXG4gQW55IHRhc2tzIG9yIHByb2Nlc3NlcyB0aGF0IG5lZWQgdG8gYmUgaW5pdGlhdGVkIG9uIHBhZ2UgbG9hZCBzaG91bGQgbGl2ZSBpbiB0aGlzXHJcbiBmaWxlIGFzIHdlbGwuIEFuIGluY2x1ZGVkIGV4YW1wbGUgaXMgYSBtZXRob2QgdGhhdCBhZGRzIGFuICdlbicgb3IgJ2ZyJyBjbGFzcyB0b1xyXG4gdGhlIGJvZHkgYmFzZWQgb24gdGhlIGdsb2JhbCBsYW5ndWFnZSB2YXJpYWJsZSB0aGF0IHdlIGNhbiB0aGVuIHVzZSB0byB3cml0ZSBjdXN0b21cclxuIHN0eWxlcyBmb3IgZWFjaCBsYW5ndWFnZS5cclxuICovXHJcblxyXG5pbXBvcnQgZm9ybXMgZnJvbSAnLi9mb3Jtcy5qcyc7XHJcbmltcG9ydCBjYXJvdXNlbCBmcm9tICcuL2Nhcm91c2VsLmpzJztcclxuaW1wb3J0IGNhcmVlcnMgZnJvbSAnLi9jYXJlZXJzLmpzJztcclxuaW1wb3J0IHZpZGVvIGZyb20gJy4vdmlkZW8uanMnO1xyXG5pbXBvcnQgc2VhcmNoIGZyb20gJy4vc2VhcmNoLmpzJztcclxuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuLy8gRXZlbnQgRW1pdHRlciB0ZXN0IG1vZHVsZXNcclxuLy8gaW1wb3J0IGV2dDEgZnJvbSAnLi9ldmVudC10ZXN0LTEuanMnO1xyXG4vLyBpbXBvcnQgZXZ0MiBmcm9tICcuL2V2ZW50LXRlc3QtMi5qcyc7XHJcblxyXG5jb25zdCBhcHAgPSAoKCkgPT4ge1xyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBGb3VuZGF0aW9uXHJcbiAgICAgICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xyXG5cclxuICAgICAgICAvLyBDaGVjayBmb3IgY29tcG9uZW50c1xyXG4gICAgICAgIGlmICgkKCcuaWctZm9ybScpLmxlbmd0aCkgZm9ybXMuaW5pdCgpO1xyXG4gICAgICAgIGlmICgkKCcuaWctY2Fyb3VzZWwnKS5sZW5ndGgpIGNhcm91c2VsLmluaXQoKTtcclxuICAgICAgICBpZiAoJCgnLmlnLXNlYXJjaCcpLmxlbmd0aCkgc2VhcmNoLmluaXQoKTtcclxuICAgICAgICBpZiAoJCgnLmlnLWNhcmVlcnMnKS5sZW5ndGgpIGNhcmVlcnMuaW5pdCgpO1xyXG4gICAgICAgIGlmICgkKCcuaWctdmlkZW8tZ3JvdXAnKS5sZW5ndGgpIHZpZGVvLmluaXQoKTtcclxuXHJcbiAgICAgICAgLy8gQ29tcG9uZW50cyBjYW4gYWxzbyBiZSBzZXR1cCB0byByZWNlaXZlIGFuIEhUTUwgJ3Njb3BlJyAoLmlnLWV2dDEuLi4gLmlnLWV2dDIuLi4uIGV0YylcclxuICAgICAgICBpZiAoJCgnLmlnLWV2dDEnKS5sZW5ndGgpIGV2dDEuaW5pdCgnLmlnLWV2dDEnKTtcclxuICAgICAgICBpZiAoJCgnLmlnLWV2dDInKS5sZW5ndGgpIGV2dDIuaW5pdCgnLmlnLWV2dDInKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGxhbmd1YWdlIGNsYXNzIHRvIGJvZHlcclxuICAgICAgICBfbGFuZ3VhZ2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBMZXQncyB1c2UgYSBnbG9iYWwgdmFyaWFibGUgKGdsb2JhbCBhcyBpbiBhdmFpbGFibGUgdG8gYWxsIG91ciBjb21wb25lbnRzIC0gbm90IHRoZSB3aW5kb3cgb2JqZWN0ISlcclxuICAgIC8vIHRvIGFkZCBhIGNsYXNzIHRvIHRoZSBib2R5IHRhZ1xyXG4gICAgZnVuY3Rpb24gX2xhbmd1YWdlKCkge1xyXG4gICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcyhpZy5sYW5nKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXRcclxuICAgIH1cclxufSkoKTtcclxuXHJcbi8vIEJvb3RzdHJhcCBhcHBcclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgYXBwLmluaXQoKTtcclxufSk7XHJcbiJdLCJuYW1lcyI6WyJsYW5nIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsImluZGV4T2YiLCJlbWl0dGVyIiwiRXZlbnRFbWl0dGVyIiwiZW5kcG9pbnRVUkwiLCJzdWNjZXNzVVJMIiwiY2FuY2VsVVJMIiwiJGZvcm0iLCIkZm9ybVdyYXBwZXIiLCJpbml0IiwiJCIsImZpbmQiLCJkYXRhIiwiX3ZhbGlkYXRpb24iLCJqSW5wdXQiLCJjaGFuZ2UiLCJvYmpFdmVudCIsImFkZENsYXNzIiwidmFsaWRhdG9yIiwic2V0RGVmYXVsdHMiLCJhZGRNZXRob2QiLCJwb3N0YWwiLCJlbGVtZW50Iiwib3B0aW9uYWwiLCJtYXRjaCIsInZhbGlkYXRlIiwibGFiZWwiLCJjbG9zZXN0IiwibGVuZ3RoIiwicGFyZW50IiwiYXBwZW5kIiwib24iLCJyZXBsYWNlIiwiX3Byb2Nlc3MiLCJmb3JtIiwiZm9ybURhdGFSYXciLCJmb3JtRGF0YVBhcnNlZCIsInZhbGlkIiwicmVtb3ZlQ2xhc3MiLCJzZXJpYWxpemVBcnJheSIsIl9wYXJzZSIsIl9zdWJtaXQiLCJhamF4Iiwic3VjY2VzcyIsIm1zZyIsImVycm9yIiwidG8iLCJfdG9nZ2xlciIsImhpZGUiLCJzaG93IiwibG9nIiwidG9nZ2xlQ2xhc3MiLCJfYnVpbGRDYXJvdXNlbCIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsIiRjYXJvdXNlbCIsImVhY2giLCJpbmRleCIsInNsaWNrIiwiX2NhcmVlcnNMZWdhY3lDb2RlIiwiZm4iLCJpbmZvVG9nZ2xlIiwiJHJldmVhbCIsIiRyZXZlYWxDb250ZW50IiwiJHJldmVhbFRyaWdnZXIiLCJmaXhlZEhlaWdodCIsInNldEFyaWEiLCJhdHRyIiwiaW5pdFRvZ2dsZSIsImhhbmRsZVJldmVhbFRvZ2dsZSIsInJlc2l6ZUhhbmRsZXIiLCJzZXRUaW1lb3V0Iiwic2V0UmV2ZWFsQ29udGVudEhlaWdodCIsImNzcyIsImhlaWdodCIsImZpbmFsSGVpZ2h0IiwiaGFzQ2xhc3MiLCJzY3JvbGxIZWlnaHQiLCJqUXVlcnkiLCJjaXJjbGVBbmltYXRpb24iLCJtYXhWYWx1ZSIsImNhbnZhcyIsIiRjYW52YXMiLCJjb250ZXh0IiwiZCIsIndpZHRoIiwicGVyY2VudFN0cm9rZSIsInJlbWFpbmluZ1N0cm9rZSIsInJhZGl1cyIsImN1clBlcmMiLCJjaXJjIiwiTWF0aCIsIlBJIiwicXVhcnQiLCJkZWxlZ2F0ZUlEIiwiRGF0ZSIsImdldFRpbWUiLCJpcyIsImdldENvbnRleHQiLCJzdHJva2VTdHlsZSIsImZpbGxTdHlsZSIsImRlbGVnYXRlIiwiY2xlYXIiLCJhbmltYXRlIiwiY3VycmVudCIsImxpbmVXaWR0aCIsImJlZ2luUGF0aCIsImFyYyIsIm1pbiIsInN0cm9rZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImZpbGxSZWN0IiwiYmxvY2tMaW5rIiwiJGJsb2NrTGluayIsImRlc3RpbmF0aW9uIiwiaW5pdEJsb2NrIiwiaGFuZGxlQ2xpY2siLCJndWkiLCJ2aWRlbyIsIm92ZXJsYXkiLCJpbml0TGVnYWN5IiwiT3ZlcmxheU1vZHVsZSIsIkd1aU1vZHVsZSIsImUiLCJ0YXJnZXQiLCJnZXRBdHRyaWJ1dGUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3AiLCJvZmZzZXQiLCJ0b3AiLCJzZWxlY3RvciIsInJlc2l6ZSIsIm92ZXJsYXlSZWZlcmVuY2UiLCJtdWx0aVRhYlRvZ2dsZVNlbGVjdG9yIiwibXVsdGlUYWJDb250ZW50U2VsZWN0b3IiLCJtdWx0aVRhYlNlbGVjdG9yIiwiJGVkZ2VPdmVybGF5TG9jYXRpb24iLCIkb3ZlcmxheVNsaWRlciIsIiRwcm9maWxlU2xpZGVyIiwiJHByb2ZpbGVTbGlkZXJWaWRlb1NlY3Rpb25Ib2xkZXIiLCJ3aW5kb3dTaXppbmdEZWxheSIsIndpbmRvd1Njcm9sbGluZ0RlbGF5Iiwib3ZlcmxheU9wZW4iLCJpc1Jlc3BvbnNpdmVTdGF0ZSIsInNjcm9sbGVkVG9WaWV3IiwiaW5pdEd1aSIsImV2ZW50IiwiYmFja2dyb3VuZENvbG9yIiwiJHRoaXMiLCJwYXJzZUludCIsImh0bWwiLCJoYW5kbGVPdmVybGF5RnJvbUhhc2giLCJkZWxheWVkSGFuZGxlV2luZG93U2l6aW5nIiwiZGVsYXllZEhhbmRsZVdpbmRvd1Njcm9sbCIsInRyaWdnZXIiLCJzdG9wUHJvcGFnYXRpb24iLCJhZGRNdWx0aVRhYlRvZ2dsZUhhbmRsZXJzIiwidG9nZ2xlQmFzZSIsIiRjb250YWluZXIiLCJwYXJlbnRzIiwiYW5pbWF0ZVByb2ZpbGVTbGlkZXIiLCIkcHJvZmlsZVBhbmVscyIsInByb2ZpbGVQYW5lbEhlaWdodCIsIm91dGVySGVpZ2h0IiwiY2hhbmdlU2xpZGVyU3RhdGUiLCJzbGlkZXIiLCJzdGF0ZSIsImNsZWFyVGltZW91dCIsImhhbmRsZVdpbmRvd1NpemluZyIsImhhbmRsZVdpbmRvd1Njcm9sbGluZyIsImZ1bGxIYXNoRnJhZ21lbnQiLCJoYXNoIiwib3Blbk92ZXJsYXkiLCJoYW5kbGVPdmVybGF5T3BlbiIsImhhbmRsZU92ZXJsYXlDbG9zZSIsImluaXRpYWxJbmRleCIsImhhbmRsZVNsaWRlQ2hhbmdlIiwieVBvcyIsIm92ZXJsYXlDb250ZW50Iiwib2ZmIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImRvY3VtZW50IiwidGl0bGUiLCJzZWFyY2giLCJzY3JvbGxUb3AiLCJjdXJyZW50U2xpZGUiLCJuZXh0U2xpZGUiLCJuZXh0VGl0bGUiLCJnZXQiLCJuZXdIYXNoIiwid2luZG93V2lkdGgiLCJyZXNwb25zaXZlTGltaXQiLCJuZXdJc1Jlc3BvbnNpdmVTdGF0ZSIsImluaXRQcm9maWxlU2xpZGVyIiwiaW5pdFNsaWRlciIsIm9wdGlvbnMiLCJkZWZhdWx0cyIsImV4dGVuZCIsIiRvdmVybGF5IiwiJGJvZHkiLCJvdmVybGF5U2l6aW5nRGVsYXkiLCJjdXJyZW50SW5zdGFuY2UiLCJpc09wZW5GbGFnIiwiJGNsb3NlQnV0dG9uIiwiaXNPcGVuIiwiaW5pdE92ZXJsYXkiLCJkZWxheWVkSGFuZGxlT3ZlcmxheVNpemluZyIsIkZvdW5kYXRpb24iLCJSZXZlYWwiLCJvdmVybGF5U2l6aW5nIiwiY2xvc2UiLCJmb3VuZGF0aW9uIiwib3BlbiIsImluaXRDbG9zZUJ1dHRvbiIsIiRpbm5lclNwYW4iLCJ1cmxPck1hcmt1cCIsIm9wZW5DYWxsYmFjayIsImNsb3NlQ2FsbGJhY2siLCJmdWxsU2NyZWVuIiwiZnVsbCIsIm9wZW5PdmVybGF5V2l0aEFqYXgiLCJ1cmwiLCJkb25lIiwib3Blbk92ZXJsYXlXaXRoTWFya3VwIiwibWFya3VwIiwib3ZlcmxheVNpemVDbGVhbnVwIiwib3ZlcmxheUhlaWdodCIsIndpbmRvd0hlaWdodCIsInZpZHMiLCJicmlnaHRDb3ZlIiwiX3BhcnNlVmlkZW9zIiwiJGdyb3VwIiwiJHZpZGVvIiwicHJlbG9hZE9wdGlvbnMiLCJhY2NvdW50IiwicGxheWVyIiwiaWQiLCJkZXNjcmlwdGlvbiIsImF1dG8iLCJjdHJsIiwicHJlbG9hZCIsInB1c2giLCJfaW5qZWN0QnJpZ2h0Q292ZUpTIiwiaW5kZXhqcyIsIl9pbmplY3RUZW1wbGF0ZSIsInJlcGxhY2VXaXRoIiwiX3NlYXJjaExlZ2FjeUNvZGUiLCJtb2RlbFVybCIsIiRmaWVsZCIsImhyZWYiLCJzdWdnZXN0aW9ucyIsImNpdGllcyIsImxvY2F0aW9ucyIsIkJsb29kaG91bmQiLCJ0b2tlbml6ZXJzIiwid2hpdGVzcGFjZSIsImdldFNlYXJjaFJlc3VsdHMiLCJwYXJhbXMiLCJzZWFyY2h0eXBlIiwibmFtZSIsImdldEpTT04iLCJhbHdheXMiLCJyZXN1bHQiLCJKU09OIiwicGFyc2UiLCJmYWlsIiwic3RhdHVzIiwic3RhdHVzVGV4dCIsInBhcnNlU2VhcmNoU3RyaW5nIiwidmFsIiwiY2l0eSIsIndvcmRzIiwic3BsaXQiLCJpIiwic3BsaWNlIiwiam9pbiIsImRpc3BsYXlTZWFyY2hSZXN1bHRzIiwidGVtcGxhdGVJRCIsImpzb24iLCJ0ZW1wbGF0ZSIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwicmVuZGVyZWQiLCJNdXN0YWNoZSIsInJlbmRlciIsInR5cGVhaGVhZCIsInNvdXJjZSIsImxpbWl0Iiwic3VibWl0IiwiYXBwIiwiZm9ybXMiLCJjYXJvdXNlbCIsImNhcmVlcnMiLCJldnQxIiwiZXZ0MiIsIl9sYW5ndWFnZSIsImlnIiwicmVhZHkiXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7Ozs7Ozs7QUFTQSxBQUFPOzs7QUFLUCxBQUFPLElBQUlBLE9BQVEsWUFBTTtNQUNuQkMsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBeUJDLE9BQXpCLENBQWlDLE1BQWpDLE1BQTZDLENBQUMsQ0FBbEQsRUFBcUQ7V0FDNUMsSUFBUDtHQURGLE1BRU87V0FDRSxJQUFQOztDQUpjLEVBQVg7OztBQVNQLEFBQU87OztBQUtQLEFBQU8sSUFBSUMsVUFBVSxJQUFJQyxZQUFKLEVBQWQ7O0FDMUJQLFlBQWUsQ0FBQyxZQUFNOztNQUVoQkMsV0FBSixFQUNFQyxVQURGLEVBRUVDLFNBRkYsRUFHRUMsS0FIRixFQUlFQyxZQUpGOztXQU1TQyxJQUFULEdBQWdCOzttQkFFQ0MsRUFBRSxVQUFGLENBQWY7WUFDUUYsYUFBYUcsSUFBYixDQUFrQixNQUFsQixDQUFSO2tCQUNjSCxhQUFhRyxJQUFiLENBQWtCLE1BQWxCLEVBQTBCQyxJQUExQixDQUErQixVQUEvQixDQUFkO2dCQUNZSixhQUFhRyxJQUFiLENBQWtCLE1BQWxCLEVBQTBCQyxJQUExQixDQUErQixRQUEvQixDQUFaOzs7Ozs7V0FNT0MsV0FBVCxHQUF1Qjs7UUFFakJDLFNBQVNKLEVBQUUsa0JBQUYsQ0FBYjtXQUNPSyxNQUFQLENBQWMsVUFBVUMsUUFBVixFQUFvQjtRQUM5QixJQUFGLEVBQVFDLFFBQVIsQ0FBaUIsT0FBakI7S0FERjs7TUFJRUMsU0FBRixDQUFZQyxXQUFaLENBQXdCO2FBQ2YsSUFEZTtlQUVi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