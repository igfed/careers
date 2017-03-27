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
                        dotsClass: 'slick-dots ga-careers-our-people-carousel-scroll',
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvY2FyZWVycy5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL3NlYXJjaC5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgZmlsZSBpcyBmb3IgbWV0aG9kcyBhbmQgdmFyaWFibGVzIHRoYXQgYXJlIGdvaW5nIHRvIGJlXHJcbnVzZWZ1bCBhY3Jvc3MgYWxsIG1vZHVsZXMuIEluIG9yZGVyIHRvIHVzZSB0aGVtIGFueXdoZXJlLCBpbXBvcnQgd2l0aDpcclxuXHJcbiBpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG4gYW5kIHRoZW4gY2FsbCB3aXRoIHRoZSBpZyBuYW1lc3BhY2UgKGkuZS4sIGlnLnBhdGhuYW1lLCBpZy5sYW5nLCBldGMpXHJcbiAqL1xyXG5cclxuLy8gdXJsIHBhdGhcclxuZXhwb3J0IHZhciBwYXRobmFtZSA9ICgoKSA9PiB7XHJcbiAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxufSkoKVxyXG5cclxuLy8gbGFuZ3VhZ2VcclxuZXhwb3J0IHZhciBsYW5nID0gKCgpID0+IHtcclxuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgIHJldHVybiAnZnInO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gJ2VuJztcclxuICB9XHJcbn0pKClcclxuXHJcbi8vIGJyb3dzZXIgd2lkdGhcclxuZXhwb3J0IHZhciBicm93c2VyV2lkdGggPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cub3V0ZXJXaWR0aDtcclxufSkoKVxyXG5cclxuLy8gYmFzZSBldmVudEVtaXR0ZXJcclxuZXhwb3J0IHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICB2YXIgZW5kcG9pbnRVUkwsXHJcbiAgICBzdWNjZXNzVVJMLFxyXG4gICAgY2FuY2VsVVJMLFxyXG4gICAgJGZvcm0sXHJcbiAgICAkZm9ybVdyYXBwZXI7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xyXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcclxuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xyXG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcclxuXHJcbiAgICBfdmFsaWRhdGlvbigpO1xyXG4gICAgX3RvZ2dsZXIoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcclxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XHJcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZSxcclxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XHJcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcclxuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xyXG5cclxuICAgICRmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDYXJvdXNlbCBJbml0aWFsaXplZCEnKVxyXG5cclxuICAgIC8vIE5vdCBzdXJlIHdoYXQgdGhpcyBkb2VzIGF0IHRoaXMgcG9pbnQgb3IgaG93IGl0IHJlbGF0ZXMgdG8gQ2Fyb3VzZWxzXHJcbiAgICAkKCdbZGF0YS1yZXNwb25zaXZlLXRvZ2dsZV0gYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ3NpdGUtaGVhZGVyLWlzLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgX2J1aWxkQ2Fyb3VzZWwoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9idWlsZENhcm91c2VsKCkge1xyXG4gICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgbmV4dEFycm93LFxyXG4gICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgJCgnLmlnLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXHJcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxyXG4gICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAgICAgX2NhcmVlcnNMZWdhY3lDb2RlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX2NhcmVlcnNMZWdhY3lDb2RlKCkge1xyXG4gICAgICAgIChmdW5jdGlvbiAoJCkge1xyXG5cclxuICAgICAgICAgICAgJC5mbi5pbmZvVG9nZ2xlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJHJldmVhbCA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyZXZlYWxDb250ZW50ID0gJHJldmVhbC5maW5kKCcuaW5mby10b2dnbGUtY29udGVudCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcmV2ZWFsVHJpZ2dlciA9ICRyZXZlYWwuZmluZCgnLmluZm8tdG9nZ2xlLXRyaWdnZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZml4ZWRIZWlnaHQgPSBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0QXJpYSA9ICRyZXZlYWwuYXR0cignaW5mby10b2dnbGUtYXJpYScpID09PSAndHJ1ZSc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGluaXRUb2dnbGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdFRvZ2dsZSgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHJldmVhbFRyaWdnZXIub24oJ2NsaWNrJywgaGFuZGxlUmV2ZWFsVG9nZ2xlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCByZXNpemVIYW5kbGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFJldmVhbENvbnRlbnRIZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlUmV2ZWFsVG9nZ2xlKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRSZXZlYWxDb250ZW50SGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyZXZlYWwudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChzZXRSZXZlYWxDb250ZW50SGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHJlc2l6ZUhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaXhlZEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJldmVhbENvbnRlbnQuY3NzKHtoZWlnaHQ6ICdhdXRvJ30pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzZXRSZXZlYWxDb250ZW50SGVpZ2h0KCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmluYWxIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHJldmVhbC5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsSGVpZ2h0ID0gJHJldmVhbENvbnRlbnRbMF0uc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZml4ZWRIZWlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxIZWlnaHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZml4ZWRIZWlnaHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcmV2ZWFsQ29udGVudC5jc3Moe2hlaWdodDogZmluYWxIZWlnaHR9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXRBcmlhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcmV2ZWFsQ29udGVudC5hdHRyKCdhcmlhLWhpZGRlbicsICFmaXhlZEhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfSkoalF1ZXJ5KTtcclxuXHJcblxyXG4gICAgICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAgICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAgICAgICAkLmZuLmNpcmNsZUFuaW1hdGlvbiA9IGZ1bmN0aW9uIChtYXhWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FudmFzID0gdGhpcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGNhbnZhcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBjYW52YXMud2lkdGggLyAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJjZW50U3Ryb2tlID0gNyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtYWluaW5nU3Ryb2tlID0gMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFkaXVzID0gZCAtIHBlcmNlbnRTdHJva2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1clBlcmMgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaXJjID0gTWF0aC5QSSAqIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YXJ0ID0gTWF0aC5QSSAvIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGVnYXRlSUQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArICdDQSc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghJGNhbnZhcy5pcygnY2FudmFzJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzBkMjYzYyc7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnI2U1ZThlOCc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRjYW52YXMuYXR0cignY2lyY2xlLWFuaW1hdGlvbi1pZCcsIGRlbGVnYXRlSUQpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZSgnW2NpcmNsZS1hbmltYXRpb24taWQ9JyArIGRlbGVnYXRlSUQgKyAnXScsICdzdGFydEFuaW1hdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1clBlcmMgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmRlbGVnYXRlKCdbY2lyY2xlLWFuaW1hdGlvbi1pZD0nICsgZGVsZWdhdGVJRCArICddJywgJ2NsZWFyQW5pbWF0ZScsIGNsZWFyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZShjdXJyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50ID8gY3VycmVudCA6IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gcGVyY2VudFN0cm9rZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1NYXRoLm1pbihjdXJyZW50LCBtYXhWYWx1ZSAvIDEwMCkpIC0gcXVhcnQsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHJlbWFpbmluZ1N0cm9rZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1jdXJyZW50KSAtIHF1YXJ0LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyUGVyYysrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyUGVyYyA8IDExMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZShjdXJQZXJjIC8gMTAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNsZWFyKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLndpZHRoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfSkoalF1ZXJ5KTtcclxuXHJcbiAgICAgICAgKGZ1bmN0aW9uICgkKSB7XHJcbiAgICAgICAgICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAgICAgICAgICQuZm4uYmxvY2tMaW5rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJGJsb2NrTGluayA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uID0gJGJsb2NrTGluay5maW5kKCdhJykuYXR0cignaHJlZicpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vZGVzdGluYXRpb24gPSAnNDQ0Mi5hc3B4LycgKyBkZXN0aW5hdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBpbml0QmxvY2soKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdEJsb2NrKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkYmxvY2tMaW5rLm9uKCdjbGljaycsIGhhbmRsZUNsaWNrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uID0gZGVzdGluYXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH0pKGpRdWVyeSk7XHJcblxyXG4gICAgICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAgICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAgICAgICB2YXIgZ3VpLFxyXG4gICAgICAgICAgICAgICAgdmlkZW8sXHJcbiAgICAgICAgICAgICAgICBvdmVybGF5O1xyXG5cclxuICAgICAgICAgICAgaW5pdExlZ2FjeSgpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gaW5pdExlZ2FjeSgpIHtcclxuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgd2VpcmQgLSBub3QgZ29pbmcgdG8gdG91Y2ggaXRcclxuICAgICAgICAgICAgICAgIG92ZXJsYXkgPSBuZXcgT3ZlcmxheU1vZHVsZSgpO1xyXG4gICAgICAgICAgICAgICAgZ3VpID0gbmV3IEd1aU1vZHVsZShvdmVybGF5KTtcclxuICAgICAgICAgICAgICAgIC8vIHZpZGVvID0gbmV3IFZpZGVvTW9kdWxlKCk7IC8vIFJlcGxhY2Ugd2l0aCB2aWRlby5qcyBtb2R1bGVcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBOZWVkIHRvIGhhdmUgYSBjbGFzcyB0byBob29rIG9udG8gZm9yIEZyZW5jaCBsYW5ndWFnZSBwYWdlXHJcbiAgICAgICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2ZyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU21vb3RoIHNjcm9sbGluZyBmb3IgYW5jaG9yIGxpbmtzXHJcbiAgICAgICAgICAgICAgICAkKCdhW2hyZWZePVwiI1wiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9ICQodGhpcy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wICsgNTJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNzUwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuc2VsZWN0b3IgIT09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNtYWluLW1lbnUtYW5jaG9yJykuY3NzKHsnZGlzcGxheSc6ICdub25lJ30pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2lzLXJldmVhbC1vcGVuIGJyYW5kZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBNb2JpbGUgbWVudSBuZWVkcyB0byBtaW1pYyBGb3VuZGF0aW9uIHJldmVhbCAtIG5vdCBlbm91Z2ggdGltZSB0byBpbXBsZW1lbnQgZGlmZmVyZW50IG5hdnMgaW4gYSByZXZlYWwgbW9kYWwgcHJvcGVybHlcclxuICAgICAgICAgICAgICAgICQoJy5tZW51LWljb24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaXMtcmV2ZWFsLW9wZW4gYnJhbmRlZCcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gcXVpY2sgYW5kIGRpcnR5IG1vYmlsZSBtZW51IGNsb3NlcyAtIG5vdCBmYW1pbGlhciB3aXRoIEZvdW5kYXRpb24gcGF0dGVybiB0byBmaXJlIHRoZXNlXHJcbiAgICAgICAgICAgICAgICAkKCcudG9wLWJhciAuY2xvc2UtYnV0dG9uLnNob3ctZm9yLXNtYWxsLW9ubHknKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI21haW4tbWVudS1hbmNob3InKS5jc3MoeydkaXNwbGF5JzogJ25vbmUnfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdpcy1yZXZlYWwtb3BlbiBicmFuZGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA2NDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdicmFuZGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIEd1aU1vZHVsZShvdmVybGF5UmVmZXJlbmNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbXVsdGlUYWJUb2dnbGVTZWxlY3RvciA9ICdbY2xhc3MqPVwidG9nZ2xlLVwiXTpub3QoW2NsYXNzKj1cImluZm8tdG9nZ2xlXCJdKScsXHJcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlUYWJDb250ZW50U2VsZWN0b3IgPSAnW2NsYXNzKj1cImNvbnRlbnQtXCJdJyxcclxuICAgICAgICAgICAgICAgICAgICBtdWx0aVRhYlNlbGVjdG9yID0gJy5tdWx0aS10YWItb3V0bGluZScsXHJcbiAgICAgICAgICAgICAgICAgICAgJGVkZ2VPdmVybGF5TG9jYXRpb24gPSAkKCcjZWRnZS1vdmVybGF5LWNvbnRlbnQnKSxcclxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5ID0gb3ZlcmxheVJlZmVyZW5jZSxcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheVNsaWRlcixcclxuICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlcixcclxuICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlclZpZGVvU2VjdGlvbkhvbGRlciA9ICQoJzxkaXY+PC9kaXY+JyksXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93U2l6aW5nRGVsYXksXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93U2Nyb2xsaW5nRGVsYXksXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheU9wZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgaXNSZXNwb25zaXZlU3RhdGUgPSBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxlZFRvVmlldyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGluaXRHdWkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbml0R3VpKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZE11bHRpVGFiVG9nZ2xlSGFuZGxlcnMoKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuYmxvY2stbGluaycpLmJsb2NrTGluaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5U2xpZGVyID0gJCgnLm91ci1idXNpbmVzcy1zbGlkZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjZWRnZS1vdmVybGF5LWNvbnRlbnQnKS5maW5kKCcuY2Fyb3VzZWwtbmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheVNsaWRlci5zbGljaygnc2xpY2tOZXh0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKFwiLnZpZGVvLXNsaWRlLnNsaWNrLWFjdGl2ZVwiKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnNsaWNrLWxpc3QuZHJhZ2dhYmxlJykuY3NzKHtoZWlnaHQ6ICc2NjBweCd9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnNlY3Rpb24ucHJvZmlsZXMtc2xpZGVyJykuY3NzKHtiYWNrZ3JvdW5kQ29sb3I6ICcjZTVlOGU4J30pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zbGljay1saXN0LmRyYWdnYWJsZScpLmNzcyh7aGVpZ2h0OiAnYXV0byd9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnNlY3Rpb24ucHJvZmlsZXMtc2xpZGVyJykuY3NzKHtiYWNrZ3JvdW5kQ29sb3I6ICcjN2VjNGI5J30pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnByb2ZpbGUtY291bnRlcicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnY2FudmFzJykuY2lyY2xlQW5pbWF0aW9uKHBhcnNlSW50KCR0aGlzLmZpbmQoJ3AnKS5odG1sKCkpKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlciA9ICQoJy5wcm9maWxlcy1zbGlkZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCBoYW5kbGVPdmVybGF5RnJvbUhhc2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZU92ZXJsYXlGcm9tSGFzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZGVsYXllZEhhbmRsZVdpbmRvd1NpemluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlV2luZG93U2l6aW5nKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZGVsYXllZEhhbmRsZVdpbmRvd1Njcm9sbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlV2luZG93U2Nyb2xsaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICQoJy5pbmZvLXRvZ2dsZScpLmluZm9Ub2dnbGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcudG9wLWJhciArIC5zY3JlZW4nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ2FbZGF0YS10b2dnbGVdJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTm90IHByZXR0eSAtIGp1c3QgYWRkaW5nIHF1aWNrIGFuZCBkaXJ0eSBzaGFyZSBsaW5rIGFjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICQoJy5zaGFyZS10b2dnbGUtdHJpZ2dlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmluZm8tdG9nZ2xlJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKCcuc2hhcmUtdG9nZ2xlLWNsb3NlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuaW5mby10b2dnbGUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFkZE11bHRpVGFiVG9nZ2xlSGFuZGxlcnMoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmRlbGVnYXRlKG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZUJhc2UgPSAkdGhpcy5hdHRyKCdjbGFzcycpLm1hdGNoKC90b2dnbGUtKFxcUyopPygkfFxccykvKVsxXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkdGhpcy5wYXJlbnRzKG11bHRpVGFiU2VsZWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKG11bHRpVGFiQ29udGVudFNlbGVjdG9yKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKCcuY29udGVudC0nICsgdG9nZ2xlQmFzZSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZVByb2ZpbGVTbGlkZXIoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICRwcm9maWxlUGFuZWxzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlUGFuZWxIZWlnaHQgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsZWRUb1ZpZXcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIuZmluZCgnLnNsaWNrLXNsaWRlJykucmVtb3ZlQ2xhc3MoJ3NsaWNrLWNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLmZpbmQoJy5zbGljay1hY3RpdmUnKS5hZGRDbGFzcygnc2xpY2stY29tcGxldGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuc2xpY2stc2xpZGU6bm90KC5zbGljay1jb21wbGV0ZSknKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5wcm9maWxlLWNvdW50ZXIgY2FudmFzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdjbGVhckFuaW1hdGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuc2xpY2stY29tcGxldGUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5wcm9maWxlLWNvdW50ZXIgY2FudmFzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdzdGFydEFuaW1hdGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRwcm9maWxlU2xpZGVyLmZpbmQoJy5zbGljay1hY3RpdmUnKS5pcygnW2NsYXNzKj1wcm9maWxlLV0nKSB8fCBpc1Jlc3BvbnNpdmVTdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIuYWRkQ2xhc3MoJ2NvbnRyYXN0LWFycm93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5yZW1vdmVDbGFzcygnY29udHJhc3QtYXJyb3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVBhbmVscyA9ICRwcm9maWxlU2xpZGVyLmZpbmQoJy5wcm9maWxlLTEtc2xpZGUsIC5wcm9maWxlLTItc2xpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVQYW5lbHMuY3NzKHtoZWlnaHQ6ICdhdXRvJ30pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVBhbmVscy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gJCh0aGlzKS5vdXRlckhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50ID4gcHJvZmlsZVBhbmVsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZmlsZVBhbmVsSGVpZ2h0ID0gY3VycmVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwcm9maWxlUGFuZWxzLmNzcyh7aGVpZ2h0OiBwcm9maWxlUGFuZWxIZWlnaHR9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY2hhbmdlU2xpZGVyU3RhdGUoc2xpZGVyLCBzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwiYWNjZXNzaWJpbGl0eVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVyLnNsaWNrKFwic2xpY2tTZXRPcHRpb25cIiwgXCJkcmFnZ2FibGVcIiwgc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwic3dpcGVcIiwgc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwidG91Y2hNb3ZlXCIsIHN0YXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBkZWxheWVkSGFuZGxlV2luZG93U2l6aW5nKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3dTaXppbmdEZWxheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHdpbmRvd1NpemluZ0RlbGF5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvd1NpemluZ0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQoaGFuZGxlV2luZG93U2l6aW5nLCAyNTApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWRIYW5kbGVXaW5kb3dTY3JvbGwoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdpbmRvd1Njcm9sbGluZ0RlbGF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQod2luZG93U2Nyb2xsaW5nRGVsYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93U2Nyb2xsaW5nRGVsYXkgPSB3aW5kb3cuc2V0VGltZW91dChoYW5kbGVXaW5kb3dTY3JvbGxpbmcsIDI1MCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUZyb21IYXNoKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZ1bGxIYXNoRnJhZ21lbnQgPSAnI291ci1lZGdlLSc7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW92ZXJsYXlPcGVuICYmIGxvY2F0aW9uLmhhc2guaW5kZXhPZihmdWxsSGFzaEZyYWdtZW50KSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVybGF5Lm9wZW5PdmVybGF5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVkZ2VPdmVybGF5TG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVPdmVybGF5T3BlbiwgaGFuZGxlT3ZlcmxheUNsb3NlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheU9wZW4oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5pdGlhbEluZGV4O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbml0U2xpZGVyKCRvdmVybGF5U2xpZGVyLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxJbmRleCA9ICRvdmVybGF5U2xpZGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuJyArIGxvY2F0aW9uLmhhc2gucmVwbGFjZSgnI291ci0nLCAnJykgKyAnOm5vdCguc2xpY2stY2xvbmVkKScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXlTbGlkZXIuc2xpY2soJ3NsaWNrR29UbycsIGluaXRpYWxJbmRleCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXlTbGlkZXIub24oJ2FmdGVyQ2hhbmdlJywgaGFuZGxlU2xpZGVDaGFuZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVNsaWRlQ2hhbmdlKG51bGwsIG51bGwsIHBhcnNlSW50KCQoJyNtb2RhbE92ZXJsYXkgLnNsaWNrLWFjdGl2ZScpLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVdpbmRvd1NpemluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlPcGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVPdmVybGF5Q2xvc2UoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgeVBvcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUNvbnRlbnQgPSAkKCcjbW9kYWxPdmVybGF5ID4gZGl2Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCd1bnNsaWNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXlTbGlkZXIub2ZmKCdhZnRlckNoYW5nZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5vdmVybGF5LXJlcG9zaXRvcnknKS5hcHBlbmQob3ZlcmxheUNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcInB1c2hTdGF0ZVwiIGluIGhpc3RvcnkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKFwiXCIsIGRvY3VtZW50LnRpdGxlLCBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlQb3MgPSAkKGRvY3VtZW50KS5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24uaGFzaCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQpLnNjcm9sbFRvcCh5UG9zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheU9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVTbGlkZUNoYW5nZShldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0U2xpZGUgPSAoY3VycmVudFNsaWRlICsgMSkgJSAoJCgnLnNsaWNrLXNsaWRlOm5vdCguc2xpY2stY2xvbmVkKScpLmxlbmd0aCAtIDEpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0VGl0bGUgPSAkKCRvdmVybGF5U2xpZGVyLmZpbmQoJ1tkYXRhLXNsaWNrLWluZGV4PScgKyBuZXh0U2xpZGUgKyAnXSAuY29sdW1uczpmaXJzdC1jaGlsZCBwJykuZ2V0KDApKS5odG1sKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hhc2ggPSAnb3VyLScgKyAkb3ZlcmxheVNsaWRlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCdbZGF0YS1zbGljay1pbmRleD0nICsgY3VycmVudFNsaWRlICsgJ10nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hdGNoKC8oZWRnZS1cXFMqKS8pWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKCcjbW9kYWxPdmVybGF5IC5jYXJvdXNlbC1uZXh0IGEnKS5odG1sKG5leHRUaXRsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24uaGFzaCA9IG5ld0hhc2g7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlV2luZG93U2l6aW5nKGluaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2l2ZUxpbWl0ID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3SXNSZXNwb25zaXZlU3RhdGUgPSB3aW5kb3dXaWR0aCA8IHJlc3BvbnNpdmVMaW1pdDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRvdmVybGF5U2xpZGVyLmlzKCcuc2xpY2staW5pdGlhbGl6ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VTbGlkZXJTdGF0ZSgkb3ZlcmxheVNsaWRlciwgIW5ld0lzUmVzcG9uc2l2ZVN0YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1Jlc3BvbnNpdmVTdGF0ZSAhPT0gbmV3SXNSZXNwb25zaXZlU3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNSZXNwb25zaXZlU3RhdGUgPSBuZXdJc1Jlc3BvbnNpdmVTdGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdFByb2ZpbGVTbGlkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlV2luZG93U2Nyb2xsaW5nKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2Nyb2xsZWRUb1ZpZXcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQod2luZG93KS5zY3JvbGxUb3AoKSArICQod2luZG93KS5oZWlnaHQoKSA+ICRwcm9maWxlU2xpZGVyLm9mZnNldCgpLnRvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsZWRUb1ZpZXcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoYW5pbWF0ZVByb2ZpbGVTbGlkZXIsIDUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdFByb2ZpbGVTbGlkZXIoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdFNsaWRlcigkcHJvZmlsZVNsaWRlciwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldkFycm93OiAnPHNwYW4gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2Fyb3VzZWwtcHJldiBnYS1jYXJlZXJzLW91ci1wZW9wbGUtY2Fyb3VzZWwtc2Nyb2xsXCI+PGltZyBzcmM9XCIvY29udGVudC9kYW0vaW52ZXN0b3JzZ3JvdXAvYXBwL2NhcmVlcnMvaW1hZ2VzL0Fycm93LU1haW5BcnRpY2xlLUNhcm91c2VsLUJsYWNrLUwucG5nXCI+PC9zcGFuPicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRBcnJvdzogJzxzcGFuIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNhcm91c2VsLW5leHQgZ2EtY2FyZWVycy1vdXItcGVvcGxlLWNhcm91c2VsLXNjcm9sbFwiPjxpbWcgc3JjPVwiL2NvbnRlbnQvZGFtL2ludmVzdG9yc2dyb3VwL2FwcC9jYXJlZXJzL2ltYWdlcy9BcnJvdy1NYWluQXJ0aWNsZS1DYXJvdXNlbC1CbGFjay1SLnBuZ1wiPjwvc3Bhbj4nXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZVByb2ZpbGVTbGlkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5vbignYWZ0ZXJDaGFuZ2UnLCBhbmltYXRlUHJvZmlsZVNsaWRlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdFNsaWRlcih0YXJnZXQsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwZWVkOiA3NTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvdHNDbGFzczogJ3NsaWNrLWRvdHMgZ2EtY2FyZWVycy1vdXItcGVvcGxlLWNhcm91c2VsLXNjcm9sbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnNsaWNrKCQuZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIE92ZXJsYXlNb2R1bGUoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJG92ZXJsYXksXHJcbiAgICAgICAgICAgICAgICAgICAgJGJvZHkgPSAkKCdib2R5JyksXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVNpemluZ0RlbGF5LFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZSA9IHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIGlzT3BlbkZsYWcgPSBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAkY2xvc2VCdXR0b247XHJcblxyXG4gICAgICAgICAgICAgICAgaW5pdE92ZXJsYXkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wZW5PdmVybGF5OiBvcGVuT3ZlcmxheSxcclxuICAgICAgICAgICAgICAgICAgICBpc09wZW46IGlzT3BlblxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbml0T3ZlcmxheSgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheSA9ICQoJzxkaXY+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuYXR0cignaWQnLCAnbW9kYWxPdmVybGF5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuYXR0cignY2xhc3MnLCAncmV2ZWFsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuYXR0cignZGF0YS1yZXZlYWwnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAkYm9keS5hcHBlbmQoJG92ZXJsYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5Lm9uKCdvcGVuLnpmLnJldmVhbCcsIGhhbmRsZU92ZXJsYXlPcGVuKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oJ2Nsb3NlZC56Zi5yZXZlYWwnLCBoYW5kbGVPdmVybGF5Q2xvc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZGVsYXllZEhhbmRsZU92ZXJsYXlTaXppbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRDbG9zZUJ1dHRvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBGb3VuZGF0aW9uLlJldmVhbCgkb3ZlcmxheSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWRIYW5kbGVPdmVybGF5U2l6aW5nKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvdmVybGF5U2l6aW5nRGVsYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChvdmVybGF5U2l6aW5nRGVsYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVNpemluZ0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQob3ZlcmxheVNpemluZywgMjUwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVPdmVybGF5Q2xvc2UoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpc09wZW5GbGFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZS5jbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5zdGFuY2UuY2xvc2UoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5U2l6ZUNsZWFudXAoKTtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5zdGFuY2UgPSB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVPdmVybGF5T3BlbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNPcGVuRmxhZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdpcy1yZXZlYWwtb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5LmZpbmQoJyonKS5mb3VuZGF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZS5vcGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5vcGVuKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVNpemluZygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXRDbG9zZUJ1dHRvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJGlubmVyU3BhbiA9ICQoJzxzcGFuPjwvc3Bhbj4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGNsb3NlQnV0dG9uID0gJCgnPGJ1dHRvbiBkYXRhLWNsb3NlPjwvYnV0dG9uPicpO1xyXG4gICAgICAgICAgICAgICAgICAgICRjbG9zZUJ1dHRvbi5hZGRDbGFzcygnY2xvc2UtYnV0dG9uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGNsb3NlQnV0dG9uLmF0dHIoJ2FyaWEtbGFiZWwnLCAnQ2xvc2UgbW9kYWwnKTtcclxuICAgICAgICAgICAgICAgICAgICAkaW5uZXJTcGFuLmF0dHIoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlubmVyU3Bhbi5odG1sKCcmdGltZXM7Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGNsb3NlQnV0dG9uLmFwcGVuZCgkaW5uZXJTcGFuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBpc09wZW4oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzT3BlbkZsYWc7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb3Blbk92ZXJsYXkodXJsT3JNYXJrdXAsIG9wZW5DYWxsYmFjaywgY2xvc2VDYWxsYmFjaywgZnVsbFNjcmVlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5vcGVuID0gb3BlbkNhbGxiYWNrO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5jbG9zZSA9IGNsb3NlQ2FsbGJhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEluc3RhbmNlLmZ1bGwgPSBmdWxsU2NyZWVuO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdXJsT3JNYXJrdXAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5PdmVybGF5V2l0aEFqYXgodXJsT3JNYXJrdXApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5PdmVybGF5V2l0aE1hcmt1cCh1cmxPck1hcmt1cCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvcGVuT3ZlcmxheVdpdGhBamF4KHVybCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh1cmwpLmRvbmUob3Blbk92ZXJsYXlXaXRoTWFya3VwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvcGVuT3ZlcmxheVdpdGhNYXJrdXAobWFya3VwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuaHRtbChtYXJrdXApO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5LmFwcGVuZCgkY2xvc2VCdXR0b24pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50SW5zdGFuY2UuZnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5hZGRDbGFzcygnZnVsbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5mb3VuZGF0aW9uKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb3ZlcmxheVNpemVDbGVhbnVwKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5LnJlbW92ZUNsYXNzKCdmdWxsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ3RvdXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5odG1sKCcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvdmVybGF5U2l6aW5nKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvdmVybGF5SGVpZ2h0ID0gJG92ZXJsYXkuaGVpZ2h0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG92ZXJsYXlIZWlnaHQgPiB3aW5kb3dIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ2Z1bGwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSkoalF1ZXJ5KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0XHJcbiAgICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgdmFyIHZpZHMgPSBbXSwgYnJpZ2h0Q292ZTtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIF9wYXJzZVZpZGVvcygpO1xyXG5cclxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgVmlkZW9KUyBtZXRob2QgaXMgYXZhaWxhYmxlIGFuZCBmaXJlIHJlYWR5IGV2ZW50IGhhbmRsZXJzIGlmIHNvXHJcbiAgICAvLyBicmlnaHRDb3ZlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gICBpZiAoJCgnLnZqcy1wbHVnaW5zLXJlYWR5JykubGVuZ3RoKSB7XHJcbiAgICAvLyAgICAgX2JyaWdodENvdmVSZWFkeSgpO1xyXG4gICAgLy8gICAgIGNsZWFySW50ZXJ2YWwoYnJpZ2h0Q292ZSk7XHJcbiAgICAvLyAgIH1cclxuICAgIC8vIH0sIDUwMClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wYXJzZVZpZGVvcygpIHtcclxuICAgIHZhciAkZ3JvdXAsXHJcbiAgICAgICR2aWRlbyxcclxuICAgICAgZGF0YSA9IHt9LFxyXG4gICAgICBwcmVsb2FkT3B0aW9ucyA9IFsnYXV0bycsICdtZXRhZGF0YScsICdub25lJ11cclxuXHJcbiAgICAvLyBFYWNoIGdyb3VwIGNhbiBlZmZlY3RpdmVseSB1c2UgYSBkaWZmZXJlbnQgcGxheWVyIHdoaWNoIHdpbGwgb25seSBiZSBsb2FkZWQgb25jZVxyXG4gICAgJCgnLmlnLXZpZGVvLWdyb3VwJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRncm91cCA9ICQodGhpcyk7XHJcbiAgICAgIGRhdGEuYWNjb3VudCA9ICRncm91cC5kYXRhKCdhY2NvdW50Jyk7XHJcbiAgICAgIGRhdGEucGxheWVyID0gJGdyb3VwLmRhdGEoJ3BsYXllcicpO1xyXG5cclxuICAgICAgLy8gTG9hZCByZXF1aXJlZCBKUyBmb3IgYSBwbGF5ZXJcclxuICAgICAgX2luamVjdEJyaWdodENvdmVKUyhkYXRhKTtcclxuXHJcbiAgICAgIC8vIExvb3AgdGhyb3VnaCB2aWRlbydzXHJcbiAgICAgICRncm91cC5maW5kKCcuaWctdmlkZW8tanMnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICR2aWRlbyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyAocmVxdWlyZWQpXHJcbiAgICAgICAgZGF0YS5pZCA9ICR2aWRlby5kYXRhKCdpZCcpO1xyXG5cclxuICAgICAgICAvLyBDYXB0dXJlIG9wdGlvbnMgKG9wdGlvbmFsKVxyXG4gICAgICAgIGRhdGEudGl0bGUgPSAkdmlkZW8uZGF0YSgndGl0bGUnKSA/ICR2aWRlby5kYXRhKCd0aXRsZScpIDogJyc7XHJcbiAgICAgICAgZGF0YS5kZXNjcmlwdGlvbiA9ICR2aWRlby5kYXRhKCdkZXNjcmlwdGlvbicpID8gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgOiAnJztcclxuICAgICAgICBkYXRhLmF1dG8gPSAkdmlkZW8uZGF0YSgnYXV0b3BsYXknKSA/ICdhdXRvcGxheScgOiAnJztcclxuICAgICAgICBkYXRhLmN0cmwgPSAkdmlkZW8uZGF0YSgnY29udHJvbHMnKSA/ICdjb250cm9scycgOiAnJztcclxuICAgICAgICBkYXRhLnByZWxvYWQgPSAocHJlbG9hZE9wdGlvbnMuaW5kZXhPZigkdmlkZW8uZGF0YSgncHJlbG9hZCcpKSA+IC0xKSA/ICR2aWRlby5kYXRhKCdwcmVsb2FkJykgOiAnYXV0byc7XHJcblxyXG4gICAgICAgIC8vIFN0b3JlIElEJ3MgZm9yIGFsbCB2aWRlbydzIG9uIHRoZSBwYWdlIC0gaW4gY2FzZSB3ZSB3YW50IHRvIHJ1biBhIHBvc3QtbG9hZCBwcm9jZXNzIG9uIGVhY2hcclxuICAgICAgICB2aWRzLnB1c2goZGF0YS5pZCk7XHJcblxyXG4gICAgICAgIC8vIExldCdzIHJlcGxhY2UgdGhlIGlnLXZpZGVvLWpzICdkaXJlY3RpdmUnIHdpdGggdGhlIG5lY2Vzc2FyeSBCcmlnaHRjb3ZlIGNvZGVcclxuICAgICAgICBfaW5qZWN0VGVtcGxhdGUoJHZpZGVvLCBkYXRhLCBpbmRleClcclxuICAgICAgfSk7XHJcblxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9pbmplY3RCcmlnaHRDb3ZlSlMoZGF0YSkge1xyXG4gICAgdmFyIGluZGV4anMgPSBgPHNjcmlwdCBzcmM9XCIvL3BsYXllcnMuYnJpZ2h0Y292ZS5uZXQvJHtkYXRhLmFjY291bnR9LyR7ZGF0YS5wbGF5ZXJ9X2RlZmF1bHQvaW5kZXgubWluLmpzXCI+PC9zY3JpcHQ+YDtcclxuICAgICQoJ2JvZHknKS5hcHBlbmQoaW5kZXhqcyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfaW5qZWN0VGVtcGxhdGUoJHZpZGVvLCBkYXRhLCBpbmRleCkge1xyXG4gICAgdmFyIGh0bWwgPSBgPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lclwiPjxzcGFuIGNsYXNzPVwidmlkZW8tb3ZlcmxheSAke2RhdGEuaWR9XCI+PC9zcGFuPjxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXItcmVzcG9uc2l2ZVwiPjx2aWRlbyBkYXRhLXNldHVwPSd7XCJ0ZWNoT3JkZXJcIjogW1wiaHRtbDVcIl19JyBkYXRhLXZpZGVvLWlkPVwiJHtkYXRhLmlkfVwiIHByZWxvYWQ9XCIke2RhdGEucHJlbG9hZH1cIiBkYXRhLWFjY291bnQ9XCIke2RhdGEuYWNjb3VudH1cIiBkYXRhLXBsYXllcj1cIiR7ZGF0YS5wbGF5ZXJ9XCIgZGF0YS1lbWJlZD1cImRlZmF1bHRcIiBkYXRhLWFwcGxpY2F0aW9uLWlkPVwiJHtpbmRleH1cIiBjbGFzcz1cInZpZGVvLWpzXCIgaWQ9XCIke2RhdGEuaWR9XCIgJHtkYXRhLmN0cmx9ICR7ZGF0YS5hdXRvfT48L3ZpZGVvPjwvZGl2PjwvZGl2PjxoMiBjbGFzcz1cInZpZGVvLXRpdGxlXCI+JHtkYXRhLnRpdGxlfTwvaDI+PHAgY2xhc3M9XCJ2aWRlby1kZXNjcmlwdGlvblwiPiR7ZGF0YS5kZXNjcmlwdGlvbn08L3A+YDtcclxuICAgICR2aWRlby5yZXBsYWNlV2l0aChodG1sKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9icmlnaHRDb3ZlUmVhZHkoKSB7XHJcbiAgICB2aWRzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgIHZpZGVvanMoJyMnICsgZWwpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyAkKCcudmlkZW8tb3ZlcmxheS4nKyBlbCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgX3NlYXJjaExlZ2FjeUNvZGUoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zZWFyY2hMZWdhY3lDb2RlKCkge1xyXG5cclxuLy8gR0xPQkFMU1xyXG4gICAgdmFyIG1vZGVsVXJsID0gJ2h0dHBzOi8vc2VhcmNoLmludmVzdG9yc2dyb3VwLmNvbS9hcGkvY3dwc2VhcmNoPyc7XHJcbiAgICB2YXIgJGZpZWxkID0gJCgnI0ZpbmRBbk9mZmljZScpO1xyXG4gICAgdmFyIGxhbmcgPSAnZW4nO1xyXG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJy9mci8nKSA+IC0xKSB7XHJcbiAgICAgIGxhbmcgPSAnZnInO1xyXG4gICAgfVxyXG5cclxuLy8gUHJvY2VzcyB0aGUgbG9jYWwgcHJlZmV0Y2hlZCBkYXRhXHJcbiAgICB2YXIgc3VnZ2VzdGlvbnMgPSB7fTtcclxuICAgIHZhciBjaXRpZXMgPSBbXHJcbiAgICAgIFwiYXRoYWJhc2NhXCIsXHJcbiAgICAgIFwiYmx1ZmZ0b25cIixcclxuICAgICAgXCJib25ueXZpbGxlXCIsXHJcbiAgICAgIFwiYnJvb2tzXCIsXHJcbiAgICAgIFwiY2FsZ2FyeVwiLFxyXG4gICAgICBcImNhbXJvc2VcIixcclxuICAgICAgXCJjYW5tb3JlXCIsXHJcbiAgICAgIFwiZHJheXRvbiB2YWxsZXlcIixcclxuICAgICAgXCJlZG1vbnRvblwiLFxyXG4gICAgICBcImZvcnQgbWNtdXJyYXlcIixcclxuICAgICAgXCJmb3J0IHNhc2thdGNoZXdhblwiLFxyXG4gICAgICBcImdyYW5kZSBwcmFpcmllXCIsXHJcbiAgICAgIFwiaGFsa2lya1wiLFxyXG4gICAgICBcImhpbGxjcmVzdCBtaW5lc1wiLFxyXG4gICAgICBcImhpbnRvblwiLFxyXG4gICAgICBcImxlZHVjXCIsXHJcbiAgICAgIFwibGV0aGJyaWRnZVwiLFxyXG4gICAgICBcImxsb3lkbWluc3RlclwiLFxyXG4gICAgICBcIm1lZGljaW5lIGhhdFwiLFxyXG4gICAgICBcIm1vcmludmlsbGVcIixcclxuICAgICAgXCJwZWFjZSByaXZlclwiLFxyXG4gICAgICBcInBpbmNoZXIgY3JlZWtcIixcclxuICAgICAgXCJwcm92b3N0XCIsXHJcbiAgICAgIFwicmVkIGRlZXJcIixcclxuICAgICAgXCJzaGVyd29vZCBwYXJrXCIsXHJcbiAgICAgIFwic3BydWNlIGdyb3ZlXCIsXHJcbiAgICAgIFwic3QuIGFsYmVydFwiLFxyXG4gICAgICBcInN0ZXR0bGVyXCIsXHJcbiAgICAgIFwic3R1cmdlb24gY291bnR5XCIsXHJcbiAgICAgIFwidG9maWVsZFwiLFxyXG4gICAgICBcInZlcm1pbGlvblwiLFxyXG4gICAgICBcIndhaW53cmlnaHRcIixcclxuICAgICAgXCJ3ZXN0bG9ja1wiLFxyXG4gICAgICBcIndoaXRlbGF3XCIsXHJcbiAgICAgIFwiYWJib3RzZm9yZFwiLFxyXG4gICAgICBcImJyYWNrZW5kYWxlXCIsXHJcbiAgICAgIFwiYnVybmFieVwiLFxyXG4gICAgICBcImJ1cm5zIGxha2VcIixcclxuICAgICAgXCJjYW1wYmVsbCByaXZlclwiLFxyXG4gICAgICBcImNoYXNlXCIsXHJcbiAgICAgIFwiY2hpbGxpd2Fja1wiLFxyXG4gICAgICBcImNvbW94XCIsXHJcbiAgICAgIFwiY29xdWl0bGFtXCIsXHJcbiAgICAgIFwiY291cnRlbmF5XCIsXHJcbiAgICAgIFwiY3JhbmJyb29rXCIsXHJcbiAgICAgIFwiZGF3c29uIGNyZWVrXCIsXHJcbiAgICAgIFwiZHVuY2FuXCIsXHJcbiAgICAgIFwiZm9ydCBuZWxzb25cIixcclxuICAgICAgXCJmb3J0IHN0LiBqb2huXCIsXHJcbiAgICAgIFwiaW52ZXJtZXJlXCIsXHJcbiAgICAgIFwia2FtbG9vcHNcIixcclxuICAgICAgXCJrZWxvd25hXCIsXHJcbiAgICAgIFwibGFuZ2xleVwiLFxyXG4gICAgICBcIm1lcnJpdHRcIixcclxuICAgICAgXCJuYW5haW1vXCIsXHJcbiAgICAgIFwibmVsc29uXCIsXHJcbiAgICAgIFwibm9ydGggdmFuY291dmVyXCIsXHJcbiAgICAgIFwib2xpdmVyXCIsXHJcbiAgICAgIFwicGVudGljdG9uXCIsXHJcbiAgICAgIFwicG9ydCBhbGJlcm5pXCIsXHJcbiAgICAgIFwicG93ZWxsIHJpdmVyXCIsXHJcbiAgICAgIFwicHJpbmNlIGdlb3JnZVwiLFxyXG4gICAgICBcInF1YWxpY3VtIGJlYWNoXCIsXHJcbiAgICAgIFwicXVlc25lbFwiLFxyXG4gICAgICBcInJldmVsc3Rva2VcIixcclxuICAgICAgXCJyaWNobW9uZFwiLFxyXG4gICAgICBcInNhYW5pY2h0b25cIixcclxuICAgICAgXCJzYWxtb24gYXJtXCIsXHJcbiAgICAgIFwic2FsdCBzcHJpbmcgaXNsYW5kXCIsXHJcbiAgICAgIFwic2VjaGVsdFwiLFxyXG4gICAgICBcInNpZG5leVwiLFxyXG4gICAgICBcInNtaXRoZXJzXCIsXHJcbiAgICAgIFwic3VycmV5XCIsXHJcbiAgICAgIFwidGVycmFjZVwiLFxyXG4gICAgICBcInRyYWlsXCIsXHJcbiAgICAgIFwidmFuY291dmVyXCIsXHJcbiAgICAgIFwidmVybm9uXCIsXHJcbiAgICAgIFwidmljdG9yaWFcIixcclxuICAgICAgXCJ3ZXN0YmFua1wiLFxyXG4gICAgICBcIndpbGxpYW1zIGxha2VcIixcclxuICAgICAgXCJicmFuZG9uXCIsXHJcbiAgICAgIFwiZGF1cGhpblwiLFxyXG4gICAgICBcImZsaW4gZmxvblwiLFxyXG4gICAgICBcImdpbGxhbVwiLFxyXG4gICAgICBcImtpbGxhcm5leVwiLFxyXG4gICAgICBcIm1hbml0b3VcIixcclxuICAgICAgXCJtaWFtaVwiLFxyXG4gICAgICBcIm1vcmRlblwiLFxyXG4gICAgICBcIm5hcm9sXCIsXHJcbiAgICAgIFwicG9ydGFnZSBsYSBwcmFpcmllXCIsXHJcbiAgICAgIFwic2Vsa2lya1wiLFxyXG4gICAgICBcInN3YW4gcml2ZXJcIixcclxuICAgICAgXCJ0aGUgcGFzXCIsXHJcbiAgICAgIFwidmlyZGVuXCIsXHJcbiAgICAgIFwid2FycmVuXCIsXHJcbiAgICAgIFwid2lubmlwZWdcIixcclxuICAgICAgXCJiYXRodXJzdFwiLFxyXG4gICAgICBcImJlZGVsbFwiLFxyXG4gICAgICBcImVkbXVuZHN0b25cIixcclxuICAgICAgXCJmcmVkZXJpY3RvblwiLFxyXG4gICAgICBcImxhbnNkb3duZVwiLFxyXG4gICAgICBcIm1pcmFtaWNoaVwiLFxyXG4gICAgICBcIm1vbmN0b25cIixcclxuICAgICAgXCJxdWlzcGFtc2lzXCIsXHJcbiAgICAgIFwicmV4dG9uXCIsXHJcbiAgICAgIFwicm90aGVzYXlcIixcclxuICAgICAgXCJzYWludCBqb2huXCIsXHJcbiAgICAgIFwic2FpbnQgcGF1bFwiLFxyXG4gICAgICBcInN1c3NleFwiLFxyXG4gICAgICBcImJsYWtldG93blwiLFxyXG4gICAgICBcImNsYXJlbnZpbGxlXCIsXHJcbiAgICAgIFwiY29ybmVyIGJyb29rXCIsXHJcbiAgICAgIFwiZ2FuZGVyXCIsXHJcbiAgICAgIFwiZ3JhbmQgZmFsbHMgLSB3aW5kc29yXCIsXHJcbiAgICAgIFwibWFyeXN0b3duXCIsXHJcbiAgICAgIFwicm9hY2hlcyBsaW5lXCIsXHJcbiAgICAgIFwic3QuIGpvaG4nc1wiLFxyXG4gICAgICBcInRyaW5pdHlcIixcclxuICAgICAgXCJhbWhlcnN0XCIsXHJcbiAgICAgIFwiYW50aWdvbmlzaFwiLFxyXG4gICAgICBcImJhcnJpbmd0b24gcGFzc2FnZVwiLFxyXG4gICAgICBcImJlbGxpdmVhdSBjb3ZlXCIsXHJcbiAgICAgIFwiYnJpZGdldG93blwiLFxyXG4gICAgICBcImJyaWRnZXdhdGVyXCIsXHJcbiAgICAgIFwiZGFydG1vdXRoXCIsXHJcbiAgICAgIFwiZGF5dG9uXCIsXHJcbiAgICAgIFwiaGFsaWZheFwiLFxyXG4gICAgICBcIm1pZGRsZXRvblwiLFxyXG4gICAgICBcIm5ldyBnbGFzZ293XCIsXHJcbiAgICAgIFwibmV3IG1pbmFzXCIsXHJcbiAgICAgIFwibm9ydGggc3lkbmV5XCIsXHJcbiAgICAgIFwicGljdG91XCIsXHJcbiAgICAgIFwicG9ydCBoYXdrZXNidXJ5XCIsXHJcbiAgICAgIFwic3lkbmV5XCIsXHJcbiAgICAgIFwidHJ1cm9cIixcclxuICAgICAgXCJ5ZWxsb3drbmlmZVwiLFxyXG4gICAgICBcImFqYXhcIixcclxuICAgICAgXCJhbGdvbnF1aW4gaGlnaGxhbmRzXCIsXHJcbiAgICAgIFwiYW5jYXN0ZXJcIixcclxuICAgICAgXCJhdGlrb2thblwiLFxyXG4gICAgICBcImJhcnJpZVwiLFxyXG4gICAgICBcImJlbGxldmlsbGVcIixcclxuICAgICAgXCJib3dtYW52aWxsZVwiLFxyXG4gICAgICBcImJyYWNlYnJpZGdlXCIsXHJcbiAgICAgIFwiYnJhbXB0b25cIixcclxuICAgICAgXCJicmFudGZvcmRcIixcclxuICAgICAgXCJicm9ja3ZpbGxlXCIsXHJcbiAgICAgIFwiYnJvb2tsaW5cIixcclxuICAgICAgXCJidXJsaW5ndG9uXCIsXHJcbiAgICAgIFwiY2FtYnJpZGdlXCIsXHJcbiAgICAgIFwiY2FybGV0b24gcGxhY2VcIixcclxuICAgICAgXCJjaGF0aGFtXCIsXHJcbiAgICAgIFwiY2xheXRvblwiLFxyXG4gICAgICBcImNsaW50b25cIixcclxuICAgICAgXCJjb2JvdXJnXCIsXHJcbiAgICAgIFwiY29sbGluZ3dvb2RcIixcclxuICAgICAgXCJjb25jb3JkXCIsXHJcbiAgICAgIFwiY29ybndhbGxcIixcclxuICAgICAgXCJkcnlkZW5cIixcclxuICAgICAgXCJkdW5kYXNcIixcclxuICAgICAgXCJkdW5zZm9yZFwiLFxyXG4gICAgICBcImR1dHRvblwiLFxyXG4gICAgICBcImVsbGlvdCBsYWtlXCIsXHJcbiAgICAgIFwiZXRvYmljb2tlXCIsXHJcbiAgICAgIFwiZm9ydCBmcmFuY2VzXCIsXHJcbiAgICAgIFwiZ2FuYW5vcXVlXCIsXHJcbiAgICAgIFwiZ2Fyc29uXCIsXHJcbiAgICAgIFwiZ3JlZWx5XCIsXHJcbiAgICAgIFwiZ3JpbXNieVwiLFxyXG4gICAgICBcImd1ZWxwaFwiLFxyXG4gICAgICBcImhhaWxleWJ1cnlcIixcclxuICAgICAgXCJoYW1pbHRvblwiLFxyXG4gICAgICBcImhhbm92ZXJcIixcclxuICAgICAgXCJoZWFyc3RcIixcclxuICAgICAgXCJodW50c3ZpbGxlXCIsXHJcbiAgICAgIFwiamVyc2V5dmlsbGVcIixcclxuICAgICAgXCJrYW5hdGFcIixcclxuICAgICAgXCJrYXB1c2thc2luZ1wiLFxyXG4gICAgICBcImtlbm9yYVwiLFxyXG4gICAgICBcImtpbmdzdG9uXCIsXHJcbiAgICAgIFwia2lya2xhbmQgbGFrZVwiLFxyXG4gICAgICBcImtpdGNoZW5lclwiLFxyXG4gICAgICBcImxhbmd0b25cIixcclxuICAgICAgXCJsaW5kc2F5XCIsXHJcbiAgICAgIFwibG9uZG9uXCIsXHJcbiAgICAgIFwibWFwbGVcIixcclxuICAgICAgXCJtYXJhdGhvblwiLFxyXG4gICAgICBcIm1hcmtoYW1cIixcclxuICAgICAgXCJtZXJyaWNrdmlsbGVcIixcclxuICAgICAgXCJtaWx0b25cIixcclxuICAgICAgXCJtaW5kZW5cIixcclxuICAgICAgXCJtaXNzaXNzYXVnYVwiLFxyXG4gICAgICBcIm1vdW50IGZvcmVzdFwiLFxyXG4gICAgICBcIm1vdW50IGhvcGVcIixcclxuICAgICAgXCJuZXBlYW5cIixcclxuICAgICAgXCJuZXcgbGlza2VhcmRcIixcclxuICAgICAgXCJuZXdtYXJrZXRcIixcclxuICAgICAgXCJuaWFnYXJhIGZhbGxzXCIsXHJcbiAgICAgIFwibm9ydGggYmF5XCIsXHJcbiAgICAgIFwibm9ydGggeW9ya1wiLFxyXG4gICAgICBcIm9hayByaWRnZXNcIixcclxuICAgICAgXCJvYWt2aWxsZVwiLFxyXG4gICAgICBcIm9yYW5nZXZpbGxlXCIsXHJcbiAgICAgIFwib3JpbGxpYVwiLFxyXG4gICAgICBcIm9ydG9uXCIsXHJcbiAgICAgIFwib3NoYXdhXCIsXHJcbiAgICAgIFwib3R0YXdhXCIsXHJcbiAgICAgIFwib3dlbiBzb3VuZFwiLFxyXG4gICAgICBcInBhcnJ5IHNvdW5kXCIsXHJcbiAgICAgIFwicGVtYnJva2VcIixcclxuICAgICAgXCJwZW5ldGFuZ3Vpc2hlbmVcIixcclxuICAgICAgXCJwZXJ0aFwiLFxyXG4gICAgICBcInBldGVyYm9yb3VnaFwiLFxyXG4gICAgICBcInBldHJvbGlhXCIsXHJcbiAgICAgIFwicGlja2VyaW5nXCIsXHJcbiAgICAgIFwicmVkIGxha2VcIixcclxuICAgICAgXCJyaWRnZXRvd25cIixcclxuICAgICAgXCJzYXJuaWFcIixcclxuICAgICAgXCJzYXVsdCBzdGUuIG1hcmllXCIsXHJcbiAgICAgIFwic2NhcmJvcm91Z2hcIixcclxuICAgICAgXCJzY2hyZWliZXJcIixcclxuICAgICAgXCJzaW1jb2VcIixcclxuICAgICAgXCJzaW91eCBsb29rb3V0XCIsXHJcbiAgICAgIFwic3QuIGNhdGhhcmluZXNcIixcclxuICAgICAgXCJzdC4gbWFyeXNcIixcclxuICAgICAgXCJzdG91ZmZ2aWxsZVwiLFxyXG4gICAgICBcInN0cmF0Zm9yZFwiLFxyXG4gICAgICBcInN0dXJnZW9uIGZhbGxzXCIsXHJcbiAgICAgIFwic3VkYnVyeVwiLFxyXG4gICAgICBcInN1bmRyaWRnZVwiLFxyXG4gICAgICBcInRodW5kZXIgYmF5XCIsXHJcbiAgICAgIFwidGlsbHNvbmJ1cmdcIixcclxuICAgICAgXCJ0aW1taW5zXCIsXHJcbiAgICAgIFwidG9yb250b1wiLFxyXG4gICAgICBcInRyZW50b25cIixcclxuICAgICAgXCJVeGJyaWRnZVwiLFxyXG4gICAgICBcInZhbCBjYXJvblwiLFxyXG4gICAgICBcIndhbGtlcnRvblwiLFxyXG4gICAgICBcIndhdGVybG9vXCIsXHJcbiAgICAgIFwid2VsbGFuZFwiLFxyXG4gICAgICBcIndoaXRieVwiLFxyXG4gICAgICBcIndpbGxvd2RhbGVcIixcclxuICAgICAgXCJ3aW5kc29yXCIsXHJcbiAgICAgIFwid2luZ2hhbVwiLFxyXG4gICAgICBcIndvb2RicmlkZ2VcIixcclxuICAgICAgXCJjaGFybG90dGV0b3duLCBwZVwiLFxyXG4gICAgICBcInNvdXJpcywgcGVcIixcclxuICAgICAgXCJzdW1tZXJzaWRlLCBwZVwiLFxyXG4gICAgICBcIndlbGxpbmd0b25cIixcclxuICAgICAgXCJhbmpvdVwiLFxyXG4gICAgICBcImJvaXNicmlhbmRcIixcclxuICAgICAgXCJib3VjaGVydmlsbGVcIixcclxuICAgICAgXCJicm9zc2FyZFwiLFxyXG4gICAgICBcImNow6J0ZWF1Z3VheVwiLFxyXG4gICAgICBcImNoaWNvdXRpbWlcIixcclxuICAgICAgXCJjw7R0ZSBzYWludC1sdWNcIixcclxuICAgICAgXCJkb2xsYXJkLWRlcy1vcm1lYXV4XCIsXHJcbiAgICAgIFwiZ2F0aW5lYXVcIixcclxuICAgICAgXCJncmFuYnlcIixcclxuICAgICAgXCJsYXZhbFwiLFxyXG4gICAgICBcImzDqXZpc1wiLFxyXG4gICAgICBcIm1pcmFiZWxcIixcclxuICAgICAgXCJtb250cmVhbFwiLFxyXG4gICAgICBcIm5ldyByaWNobW9uZFwiLFxyXG4gICAgICBcInBvaW50ZS1jbGFpcmVcIixcclxuICAgICAgXCJxdcOpYmVjXCIsXHJcbiAgICAgIFwic2VwdC1pbGVzXCIsXHJcbiAgICAgIFwic2hlcmJyb29rZVwiLFxyXG4gICAgICBcInZpbGxlIHN0LWxhdXJlbnRcIixcclxuICAgICAgXCJ3ZXN0bW91bnRcIixcclxuICAgICAgXCJlYXN0ZW5kXCIsXHJcbiAgICAgIFwiZXN0ZXZhblwiLFxyXG4gICAgICBcImVzdGVyaGF6eVwiLFxyXG4gICAgICBcImZvYW0gbGFrZVwiLFxyXG4gICAgICBcImh1bWJvbGR0XCIsXHJcbiAgICAgIFwia2luZGVyc2xleVwiLFxyXG4gICAgICBcImxlYWRlclwiLFxyXG4gICAgICBcIm1hcGxlIGNyZWVrXCIsXHJcbiAgICAgIFwibWVhZG93IGxha2VcIixcclxuICAgICAgXCJtZWxmb3J0XCIsXHJcbiAgICAgIFwibWVsdmlsbGVcIixcclxuICAgICAgXCJtb29zZSBqYXdcIixcclxuICAgICAgXCJub3J0aCBiYXR0bGVmb3JkXCIsXHJcbiAgICAgIFwib3V0bG9va1wiLFxyXG4gICAgICBcIm94Ym93XCIsXHJcbiAgICAgIFwicHJpbmNlIGFsYmVydFwiLFxyXG4gICAgICBcInJlZ2luYVwiLFxyXG4gICAgICBcInJlZ2luYSBiZWFjaFwiLFxyXG4gICAgICBcInJvc2V0b3duXCIsXHJcbiAgICAgIFwic2Fza2F0b29uXCIsXHJcbiAgICAgIFwic2hlbGxicm9va1wiLFxyXG4gICAgICBcInN3aWZ0IGN1cnJlbnRcIixcclxuICAgICAgXCJ3YXRyb3VzXCIsXHJcbiAgICAgIFwid2F0c29uXCIsXHJcbiAgICAgIFwieW9ya3RvblwiLFxyXG4gICAgICBcIndoaXRlaG9yc2VcIlxyXG4gICAgXTtcclxuICAgIHN1Z2dlc3Rpb25zLmxvY2F0aW9ucyA9IG5ldyBCbG9vZGhvdW5kKHtcclxuICAgICAgZGF0dW1Ub2tlbml6ZXI6IEJsb29kaG91bmQudG9rZW5pemVycy53aGl0ZXNwYWNlLFxyXG4gICAgICBxdWVyeVRva2VuaXplcjogQmxvb2Rob3VuZC50b2tlbml6ZXJzLndoaXRlc3BhY2UsXHJcbiAgICAgIGxvY2FsOiBjaXRpZXNcclxuICAgIH0pO1xyXG5cclxuLy8gR2V0IHRoZSByZXN1bHRzXHJcbiAgICBmdW5jdGlvbiBnZXRTZWFyY2hSZXN1bHRzKHBhcmFtcykge1xyXG4gICAgICBwYXJhbXMuc2VhcmNodHlwZSA9ICdvZmZpY2UnO1xyXG4gICAgICBwYXJhbXMubmFtZSA9ICcnO1xyXG5cclxuICAgICAgLy8gTWFrZSBzdXJlIGVycm9yIG1lc3NhZ2UgaXMgaGlkZGVuIGVhY2ggdGltZVxyXG4gICAgICAkKCcuemVyby1yZXN1bHRzJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHJcbiAgICAgICQuZ2V0SlNPTihtb2RlbFVybCwgcGFyYW1zKVxyXG4gICAgICAgIC5hbHdheXMoKVxyXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICAgICAgJCgnI3NlYXJjaFJlc3VsdHNNb2RhbCcpLnJlbW92ZUNsYXNzKCdjbG9zZWQnKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgZGlzcGxheVNlYXJjaFJlc3VsdHMoJ29mZmljZS10ZW1wbGF0ZScsIHJlc3VsdCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCcuemVyby1yZXN1bHRzJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdEYXRhIGNvdWxkIG5vdCBiZSByZXRyaWV2ZWQsIHBsZWFzZSB0cnkgYWdhaW4nLCByZXN1bHQuc3RhdHVzICsgJyAnICsgcmVzdWx0LnN0YXR1c1RleHQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbi8vIEJlY2F1c2Ugd2UgYXJlIG9ubHkgc2VhcmNoaW5nIGZvciBjaXRpZXMsIHRoaXMgZnVuY3Rpb24gaXMgc2xpZ2h0bHkgcmVkdW5kYW50IC0gbGVhdmluZyBpdCBpbiBwbGFjZSBmb3Igbm93XHJcbiAgICBmdW5jdGlvbiBwYXJzZVNlYXJjaFN0cmluZygpIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICB2YXIgc2VhcmNoID0gJGZpZWxkLnZhbCgpO1xyXG5cclxuICAgICAgcmVzdWx0LmNpdHkgPSAnJztcclxuXHJcbiAgICAgIC8vIFNlYXJjaCBpbiB0aGUgbGFuZ3VhZ2Ugb2YgdGhlIHBhZ2VcclxuICAgICAgcmVzdWx0LmxhbmcgPSBsYW5nO1xyXG4gICAgICAvLyBXZSBvbmx5IHNlYXJjaCBjb25zdWx0YW50cyBmcm9tIHRoaXMgbWV0aG9kXHJcbiAgICAgIHJlc3VsdC5zZWFyY2h0eXBlID0gJ2Nvbic7XHJcblxyXG4gICAgICAvLyBDaGVjayB0aGUgc2VhcmNoIHN0cmluZyBmb3IgYSBwcmV2aW91c2x5IGRlZmluZWQgbG9jYXRpb25cclxuICAgICAgdmFyIHdvcmRzID0gc2VhcmNoLnNwbGl0KCcgJyk7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyBDaGVjayBlYWNoIHdvcmQgZm9yIGEgY2l0eSBmcm9tIHRoZSBwcmVkZWZpbmVkIGxpc3RcclxuICAgICAgICB2YXIgY2l0eSA9IHN1Z2dlc3Rpb25zLmxvY2F0aW9ucy5nZXQod29yZHNbaV0pO1xyXG4gICAgICAgIGlmIChjaXR5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJlc3VsdC5jaXR5ID0gY2l0eVswXTtcclxuICAgICAgICAgIHdvcmRzLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghcmVzdWx0LmNpdHkpIHtcclxuICAgICAgICByZXN1bHQuY2l0eSA9IHdvcmRzLmpvaW4oJyAnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkaXNwbGF5U2VhcmNoUmVzdWx0cyh0ZW1wbGF0ZUlELCBqc29uKSB7XHJcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSUQpLmlubmVySFRNTDtcclxuICAgICAgTXVzdGFjaGUucGFyc2UodGVtcGxhdGUpO1xyXG4gICAgICB2YXIgcmVuZGVyZWQgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIGpzb24pO1xyXG4gICAgICAkKCcjc2VhcmNoUmVzdWx0c01vZGFsJykuYXBwZW5kKHJlbmRlcmVkKTtcclxuICAgICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuLy9Jbml0IGV2ZXJ5dGhpbmdcclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBUcnkgdG8gcHJlZGV0ZXJtaW5lIHdoYXQgcmVzdWx0cyBzaG91bGQgc2hvd1xyXG4gICAgICAvLyBTZXR1cCB0aGUgdHlwZWFoZWFkXHJcbiAgICAgICQoJy50eXBlYWhlYWQnKS50eXBlYWhlYWQoe1xyXG4gICAgICAgICAgaGlnaGxpZ2h0OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7bmFtZTogJ2xvY2F0aW9ucycsIHNvdXJjZTogc3VnZ2VzdGlvbnMubG9jYXRpb25zLCBsaW1pdDogMn1cclxuICAgICAgKTtcclxuXHJcbiAgICAgIC8vIFNldHVwIHRoZSBmb3JtIHN1Ym1pc3Npb25cclxuICAgICAgJCgnLmlnLXNlYXJjaCcpLnN1Ym1pdChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXIgcGFyYW1zID0gcGFyc2VTZWFyY2hTdHJpbmcoKTtcclxuICAgICAgICBnZXRTZWFyY2hSZXN1bHRzKHBhcmFtcyk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gRmFrZSBtb2RhbCAtIEFkZGluZyBoYW5kbGVyIG9uIGRvY3VtZW50IHNvIGl0IGZpcmVzIGRlc3BpdGUgdGhlIGJ1dHRvbiBub3QgYmVpbmcgcmVuZGVyZWQgeWV0XHJcbiAgICAgICQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCIjc2VhcmNoUmVzdWx0c01vZGFsIC5jbG9zZS1idXR0b25cIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJyNzZWFyY2hSZXN1bHRzTW9kYWwnKS5hZGRDbGFzcygnY2xvc2VkJyk7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2lzLXJldmVhbC1vcGVuJyk7XHJcbiAgICAgICAgfSwgNDAwKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsIi8qIFRoaXMgZmlsZSBpcyB0aGUgZW50cnkgcG9pbnQgZm9yIHJvbGx1cCAoaHR0cDovL3JvbGx1cGpzLm9yZy8pIGFuZFxyXG4gZXNzZW50aW9uYWxseSAnYm9vdHN0cmFwcycgb3VyIGlnLmNvbSAnYXBwbGljYXRpb24nLlxyXG5cclxuIEFsbCBtb2R1bGVzIHNob3VsZCBiZSBpbXBvcnRlZCBoZXJlIHNvIHRoYXQgdGhleSBjYW4gYmUgaW5pdGlhbGl6ZWQgb25cclxuIGEgY2FzZS1ieS1jYXNlIGJhc2lzIChub3QgYWxsIHBhZ2VzIHJlcXVpcmUgdGhlIGluaXRpYWxpemF0aW9uIG9mIGEgY2Fyb3VzZWxcclxuIGZvciBpbnN0YW5jZSkuXHJcblxyXG4gQW55IHRhc2tzIG9yIHByb2Nlc3NlcyB0aGF0IG5lZWQgdG8gYmUgaW5pdGlhdGVkIG9uIHBhZ2UgbG9hZCBzaG91bGQgbGl2ZSBpbiB0aGlzXHJcbiBmaWxlIGFzIHdlbGwuIEFuIGluY2x1ZGVkIGV4YW1wbGUgaXMgYSBtZXRob2QgdGhhdCBhZGRzIGFuICdlbicgb3IgJ2ZyJyBjbGFzcyB0b1xyXG4gdGhlIGJvZHkgYmFzZWQgb24gdGhlIGdsb2JhbCBsYW5ndWFnZSB2YXJpYWJsZSB0aGF0IHdlIGNhbiB0aGVuIHVzZSB0byB3cml0ZSBjdXN0b21cclxuIHN0eWxlcyBmb3IgZWFjaCBsYW5ndWFnZS5cclxuICovXHJcblxyXG5pbXBvcnQgZm9ybXMgZnJvbSAnLi9mb3Jtcy5qcyc7XHJcbmltcG9ydCBjYXJvdXNlbCBmcm9tICcuL2Nhcm91c2VsLmpzJztcclxuaW1wb3J0IGNhcmVlcnMgZnJvbSAnLi9jYXJlZXJzLmpzJztcclxuaW1wb3J0IHZpZGVvIGZyb20gJy4vdmlkZW8uanMnO1xyXG5pbXBvcnQgc2VhcmNoIGZyb20gJy4vc2VhcmNoLmpzJztcclxuaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuLy8gRXZlbnQgRW1pdHRlciB0ZXN0IG1vZHVsZXNcclxuLy8gaW1wb3J0IGV2dDEgZnJvbSAnLi9ldmVudC10ZXN0LTEuanMnO1xyXG4vLyBpbXBvcnQgZXZ0MiBmcm9tICcuL2V2ZW50LXRlc3QtMi5qcyc7XHJcblxyXG5jb25zdCBhcHAgPSAoKCkgPT4ge1xyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBGb3VuZGF0aW9uXHJcbiAgICAgICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xyXG5cclxuICAgICAgICAvLyBDaGVjayBmb3IgY29tcG9uZW50c1xyXG4gICAgICAgIGlmICgkKCcuaWctZm9ybScpLmxlbmd0aCkgZm9ybXMuaW5pdCgpO1xyXG4gICAgICAgIGlmICgkKCcuaWctY2Fyb3VzZWwnKS5sZW5ndGgpIGNhcm91c2VsLmluaXQoKTtcclxuICAgICAgICBpZiAoJCgnLmlnLXNlYXJjaCcpLmxlbmd0aCkgc2VhcmNoLmluaXQoKTtcclxuICAgICAgICBpZiAoJCgnLmlnLWNhcmVlcnMnKS5sZW5ndGgpIGNhcmVlcnMuaW5pdCgpO1xyXG4gICAgICAgIGlmICgkKCcuaWctdmlkZW8tZ3JvdXAnKS5sZW5ndGgpIHZpZGVvLmluaXQoKTtcclxuXHJcbiAgICAgICAgLy8gQ29tcG9uZW50cyBjYW4gYWxzbyBiZSBzZXR1cCB0byByZWNlaXZlIGFuIEhUTUwgJ3Njb3BlJyAoLmlnLWV2dDEuLi4gLmlnLWV2dDIuLi4uIGV0YylcclxuICAgICAgICBpZiAoJCgnLmlnLWV2dDEnKS5sZW5ndGgpIGV2dDEuaW5pdCgnLmlnLWV2dDEnKTtcclxuICAgICAgICBpZiAoJCgnLmlnLWV2dDInKS5sZW5ndGgpIGV2dDIuaW5pdCgnLmlnLWV2dDInKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGxhbmd1YWdlIGNsYXNzIHRvIGJvZHlcclxuICAgICAgICAvL19sYW5ndWFnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIExldCdzIHVzZSBhIGdsb2JhbCB2YXJpYWJsZSAoZ2xvYmFsIGFzIGluIGF2YWlsYWJsZSB0byBhbGwgb3VyIGNvbXBvbmVudHMgLSBub3QgdGhlIHdpbmRvdyBvYmplY3QhKVxyXG4gICAgLy8gdG8gYWRkIGEgY2xhc3MgdG8gdGhlIGJvZHkgdGFnXHJcbiAgICAvLyBmdW5jdGlvbiBfbGFuZ3VhZ2UoKSB7XHJcbiAgICAvLyAgICAgJCgnYm9keScpLmFkZENsYXNzKGlnLmxhbmcpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdFxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuLy8gQm9vdHN0cmFwIGFwcFxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICBhcHAuaW5pdCgpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbImxhbmciLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiaW5kZXhPZiIsImVtaXR0ZXIiLCJFdmVudEVtaXR0ZXIiLCJlbmRwb2ludFVSTCIsInN1Y2Nlc3NVUkwiLCJjYW5jZWxVUkwiLCIkZm9ybSIsIiRmb3JtV3JhcHBlciIsImluaXQiLCIkIiwiZmluZCIsImRhdGEiLCJfdmFsaWRhdGlvbiIsImpJbnB1dCIsImNoYW5nZSIsIm9iakV2ZW50IiwiYWRkQ2xhc3MiLCJ2YWxpZGF0b3IiLCJzZXREZWZhdWx0cyIsImFkZE1ldGhvZCIsInBvc3RhbCIsImVsZW1lbnQiLCJvcHRpb25hbCIsIm1hdGNoIiwidmFsaWRhdGUiLCJsYWJlbCIsImNsb3Nlc3QiLCJsZW5ndGgiLCJwYXJlbnQiLCJhcHBlbmQiLCJvbiIsInJlcGxhY2UiLCJfcHJvY2VzcyIsImZvcm0iLCJmb3JtRGF0YVJhdyIsImZvcm1EYXRhUGFyc2VkIiwidmFsaWQiLCJyZW1vdmVDbGFzcyIsInNlcmlhbGl6ZUFycmF5IiwiX3BhcnNlIiwiX3N1Ym1pdCIsImFqYXgiLCJzdWNjZXNzIiwibXNnIiwiZXJyb3IiLCJ0byIsIl90b2dnbGVyIiwiaGlkZSIsInNob3ciLCJsb2ciLCJ0b2dnbGVDbGFzcyIsIl9idWlsZENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiJGNhcm91c2VsIiwiZWFjaCIsImluZGV4Iiwic2xpY2siLCJfY2FyZWVyc0xlZ2FjeUNvZGUiLCJmbiIsImluZm9Ub2dnbGUiLCIkcmV2ZWFsIiwiJHJldmVhbENvbnRlbnQiLCIkcmV2ZWFsVHJpZ2dlciIsImZpeGVkSGVpZ2h0Iiwic2V0QXJpYSIsImF0dHIiLCJpbml0VG9nZ2xlIiwiaGFuZGxlUmV2ZWFsVG9nZ2xlIiwicmVzaXplSGFuZGxlciIsInNldFRpbWVvdXQiLCJzZXRSZXZlYWxDb250ZW50SGVpZ2h0IiwiY3NzIiwiaGVpZ2h0IiwiZmluYWxIZWlnaHQiLCJoYXNDbGFzcyIsInNjcm9sbEhlaWdodCIsImpRdWVyeSIsImNpcmNsZUFuaW1hdGlvbiIsIm1heFZhbHVlIiwiY2FudmFzIiwiJGNhbnZhcyIsImNvbnRleHQiLCJkIiwid2lkdGgiLCJwZXJjZW50U3Ryb2tlIiwicmVtYWluaW5nU3Ryb2tlIiwicmFkaXVzIiwiY3VyUGVyYyIsImNpcmMiLCJNYXRoIiwiUEkiLCJxdWFydCIsImRlbGVnYXRlSUQiLCJEYXRlIiwiZ2V0VGltZSIsImlzIiwiZ2V0Q29udGV4dCIsInN0cm9rZVN0eWxlIiwiZmlsbFN0eWxlIiwiZGVsZWdhdGUiLCJjbGVhciIsImFuaW1hdGUiLCJjdXJyZW50IiwibGluZVdpZHRoIiwiYmVnaW5QYXRoIiwiYXJjIiwibWluIiwic3Ryb2tlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiZmlsbFJlY3QiLCJibG9ja0xpbmsiLCIkYmxvY2tMaW5rIiwiZGVzdGluYXRpb24iLCJpbml0QmxvY2siLCJoYW5kbGVDbGljayIsImd1aSIsInZpZGVvIiwib3ZlcmxheSIsImluaXRMZWdhY3kiLCJPdmVybGF5TW9kdWxlIiwiR3VpTW9kdWxlIiwiZSIsInRhcmdldCIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcCIsIm9mZnNldCIsInRvcCIsInNlbGVjdG9yIiwicmVzaXplIiwib3ZlcmxheVJlZmVyZW5jZSIsIm11bHRpVGFiVG9nZ2xlU2VsZWN0b3IiLCJtdWx0aVRhYkNvbnRlbnRTZWxlY3RvciIsIm11bHRpVGFiU2VsZWN0b3IiLCIkZWRnZU92ZXJsYXlMb2NhdGlvbiIsIiRvdmVybGF5U2xpZGVyIiwiJHByb2ZpbGVTbGlkZXIiLCIkcHJvZmlsZVNsaWRlclZpZGVvU2VjdGlvbkhvbGRlciIsIndpbmRvd1NpemluZ0RlbGF5Iiwid2luZG93U2Nyb2xsaW5nRGVsYXkiLCJvdmVybGF5T3BlbiIsImlzUmVzcG9uc2l2ZVN0YXRlIiwic2Nyb2xsZWRUb1ZpZXciLCJpbml0R3VpIiwiZXZlbnQiLCJiYWNrZ3JvdW5kQ29sb3IiLCIkdGhpcyIsInBhcnNlSW50IiwiaHRtbCIsImhhbmRsZU92ZXJsYXlGcm9tSGFzaCIsImRlbGF5ZWRIYW5kbGVXaW5kb3dTaXppbmciLCJkZWxheWVkSGFuZGxlV2luZG93U2Nyb2xsIiwidHJpZ2dlciIsInN0b3BQcm9wYWdhdGlvbiIsImFkZE11bHRpVGFiVG9nZ2xlSGFuZGxlcnMiLCJ0b2dnbGVCYXNlIiwiJGNvbnRhaW5lciIsInBhcmVudHMiLCJhbmltYXRlUHJvZmlsZVNsaWRlciIsIiRwcm9maWxlUGFuZWxzIiwicHJvZmlsZVBhbmVsSGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJjaGFuZ2VTbGlkZXJTdGF0ZSIsInNsaWRlciIsInN0YXRlIiwiY2xlYXJUaW1lb3V0IiwiaGFuZGxlV2luZG93U2l6aW5nIiwiaGFuZGxlV2luZG93U2Nyb2xsaW5nIiwiZnVsbEhhc2hGcmFnbWVudCIsImhhc2giLCJvcGVuT3ZlcmxheSIsImhhbmRsZU92ZXJsYXlPcGVuIiwiaGFuZGxlT3ZlcmxheUNsb3NlIiwiaW5pdGlhbEluZGV4IiwiaGFuZGxlU2xpZGVDaGFuZ2UiLCJ5UG9zIiwib3ZlcmxheUNvbnRlbnQiLCJvZmYiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiZG9jdW1lbnQiLCJ0aXRsZSIsInNlYXJjaCIsInNjcm9sbFRvcCIsImN1cnJlbnRTbGlkZSIsIm5leHRTbGlkZSIsIm5leHRUaXRsZSIsImdldCIsIm5ld0hhc2giLCJ3aW5kb3dXaWR0aCIsInJlc3BvbnNpdmVMaW1pdCIsIm5ld0lzUmVzcG9uc2l2ZVN0YXRlIiwiaW5pdFByb2ZpbGVTbGlkZXIiLCJpbml0U2xpZGVyIiwib3B0aW9ucyIsImRlZmF1bHRzIiwiZXh0ZW5kIiwiJG92ZXJsYXkiLCIkYm9keSIsIm92ZXJsYXlTaXppbmdEZWxheSIsImN1cnJlbnRJbnN0YW5jZSIsImlzT3BlbkZsYWciLCIkY2xvc2VCdXR0b24iLCJpc09wZW4iLCJpbml0T3ZlcmxheSIsImRlbGF5ZWRIYW5kbGVPdmVybGF5U2l6aW5nIiwiRm91bmRhdGlvbiIsIlJldmVhbCIsIm92ZXJsYXlTaXppbmciLCJjbG9zZSIsImZvdW5kYXRpb24iLCJvcGVuIiwiaW5pdENsb3NlQnV0dG9uIiwiJGlubmVyU3BhbiIsInVybE9yTWFya3VwIiwib3BlbkNhbGxiYWNrIiwiY2xvc2VDYWxsYmFjayIsImZ1bGxTY3JlZW4iLCJmdWxsIiwib3Blbk92ZXJsYXlXaXRoQWpheCIsInVybCIsImRvbmUiLCJvcGVuT3ZlcmxheVdpdGhNYXJrdXAiLCJtYXJrdXAiLCJvdmVybGF5U2l6ZUNsZWFudXAiLCJvdmVybGF5SGVpZ2h0Iiwid2luZG93SGVpZ2h0IiwidmlkcyIsImJyaWdodENvdmUiLCJfcGFyc2VWaWRlb3MiLCIkZ3JvdXAiLCIkdmlkZW8iLCJwcmVsb2FkT3B0aW9ucyIsImFjY291bnQiLCJwbGF5ZXIiLCJpZCIsImRlc2NyaXB0aW9uIiwiYXV0byIsImN0cmwiLCJwcmVsb2FkIiwicHVzaCIsIl9pbmplY3RCcmlnaHRDb3ZlSlMiLCJpbmRleGpzIiwiX2luamVjdFRlbXBsYXRlIiwicmVwbGFjZVdpdGgiLCJfc2VhcmNoTGVnYWN5Q29kZSIsIm1vZGVsVXJsIiwiJGZpZWxkIiwiaHJlZiIsInN1Z2dlc3Rpb25zIiwiY2l0aWVzIiwibG9jYXRpb25zIiwiQmxvb2Rob3VuZCIsInRva2VuaXplcnMiLCJ3aGl0ZXNwYWNlIiwiZ2V0U2VhcmNoUmVzdWx0cyIsInBhcmFtcyIsInNlYXJjaHR5cGUiLCJuYW1lIiwiZ2V0SlNPTiIsImFsd2F5cyIsInJlc3VsdCIsIkpTT04iLCJwYXJzZSIsImZhaWwiLCJzdGF0dXMiLCJzdGF0dXNUZXh0IiwicGFyc2VTZWFyY2hTdHJpbmciLCJ2YWwiLCJjaXR5Iiwid29yZHMiLCJzcGxpdCIsImkiLCJzcGxpY2UiLCJqb2luIiwiZGlzcGxheVNlYXJjaFJlc3VsdHMiLCJ0ZW1wbGF0ZUlEIiwianNvbiIsInRlbXBsYXRlIiwiZ2V0RWxlbWVudEJ5SWQiLCJpbm5lckhUTUwiLCJyZW5kZXJlZCIsIk11c3RhY2hlIiwicmVuZGVyIiwidHlwZWFoZWFkIiwic291cmNlIiwibGltaXQiLCJzdWJtaXQiLCJhcHAiLCJmb3JtcyIsImNhcm91c2VsIiwiY2FyZWVycyIsImV2dDEiLCJldnQyIiwicmVh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