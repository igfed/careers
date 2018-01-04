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
  if (window.location.pathname.indexOf('/fr.') !== -1 || window.location.pathname.indexOf('/fr/') !== -1) {
    return 'fr';
  } else {
    return 'en';
  }
}();

// browser width


// check for IE (pre Edge)
var oldIE = function () {
  if ("ActiveXObject" in window) {
    return true;
  } else {
    return false;
  }
}();

// base eventEmitter
// export var emitter = new EventEmitter();

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

var careers = (function (window) {

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

                        _satellite.track('carousel_scroll');
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
})(window);

var video = (function (window) {

  var videoIDs = [],
      players = [],
      brightCove,
      $video;

  function init() {
    _parseVideos();

    if (!oldIE) {

      // Make sure the VideoJS method is available and fire ready event handlers
      brightCove = setInterval(function () {
        if ($('.vjs-plugins-ready').length) {
          _brightCoveReady();
          clearInterval(brightCove);
        }
      }, 500);

      // Function for checking if video's have scrolled off screen and need to be paused
      _viewStatus();
    }
  }

  function _parseVideos() {
    var $group,
        data = {},
        preloadOptions = ['auto', 'metadata', 'none'];

    // Each group can effectively use a different player which will only be loaded once
    $('.ig-video-group').each(function () {
      $group = $(this);
      data.player = $group.data('player');

      // Loop through video's
      $group.find('.ig-video-js').each(function (index) {
        $video = $(this);

        data.id = $video.data('id');
        data.title = $video.data('title') ? $video.data('title') : '';
        data.description = $video.data('description') ? $video.data('description') : '';

        if (oldIE) {

          _injectIframe(data, $video);
        } else {

          // Capture options that are used with modern browsers
          data.overlay = $video.data('overlay') ? $video.data('overlay') : '';
          data.auto = $video.data('autoplay') ? 'autoplay' : '';
          data.preload = preloadOptions.indexOf($video.data('preload')) > -1 ? $video.data('preload') : 'auto';
          data.transcript = $video.data('transcript') ? $video.data('transcript') : '';
          data.ctaTemplate = $video.data('ctaTemplate') ? $video.data('ctaTemplate') : '';

          // Store ID's for all video's on the page - in case we want to run a post-load process on each
          if (videoIDs.indexOf(data.id) === -1) {
            videoIDs.push(data.id);
          }

          // Let's replace the ig-video-js 'directive' with the necessary Brightcove code
          _injectTemplate(data, index);
        }
      });

      // Only inject Brightcove JS if modern browser
      if (!oldIE) {
        injectBrightCoveJS(data);
      }
    });
  }

  function _injectTemplate(data, index) {
    var transcriptText = {
      'en': 'Transcript',
      'fr': 'Transcription'
    },
        html = '<div class="video-container ' + data.id + '"><div class="video-container-responsive">';

    if (data.ctaTemplate.length > 0) {
      html += '<span class="video-cta">' + data.ctaTemplate + '</span>';
    }
    if (data.overlay.length > 0) {
      html += '<span class="video-overlay" style="background-image: url(\'' + data.overlay + '\');"></span>';
    }
    html += '<video data-setup=\'{"techOrder": ["html5"]}\' data-video-id="' + data.id + '" preload="' + data.preload + '" data-account="3906942861001" data-player="' + data.player + '" data-embed="default" data-application-id="' + index + '" class="video-js" id="' + data.id + '" controls ' + data.auto + '></video></div>';
    if (data.transcript.length > 0) {
      html += '<div class="video-transcript"><a target="_blank" href="' + data.transcript + '">' + transcriptText[lang] + '</a></div>';
    }
    html += '</div><h2 class="video-title ' + data.id + '">' + data.title + '</h2><p class="video-description">' + data.description + '</p>';
    $video = $video.replaceWith(html);

    if (data.overlay) {
      $(document).on('click', '#' + data.id, function () {
        $(this).siblings('.video-overlay').hide();
      });
    }
  }

  function _injectIframe(data) {
    var html = '<div class="video-container">\n      <div class="video-container-responsive">\n      <iframe class="video-js" src=\'//players.brightcove.net/3906942861001/' + data.player + '_default/index.html?videoId=' + data.id + '\'\n    allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>\n    </div>\n    </div><h2 class="video-title ' + data.id + '">' + data.title + '</h2><p class="video-description">' + data.description + '</p>';
    $video = $video.replaceWith(html);
  }

  function injectBrightCoveJS(data) {
    var indexjs = '<script src="//players.brightcove.net/3906942861001/' + data.player + '_default/index.min.js"></script>';
    $('body').append(indexjs);
  }

  function _brightCoveReady() {
    var player;
    videoIDs.forEach(function (el) {
      videojs('#' + el).ready(function () {
        // assign this player to a variable
        player = this;
        // assign an event listener for play event
        player.on('play', _onPlay);
        // assign an event listener for ended event
        player.on('ended', _onComplete);
        // push the player to the players array
        players.push(player);
      });
    });
  }

  function _onPlay(e) {
    // Adobe Analytics
    if (!$('.' + e.target.id).hasClass('played')) {
      $('.' + e.target.id).addClass('played');
      window.digitalData.event.id = e.target.id;
      window.digitalData.event.title = _retrieveTitle(e.target.id);
      _satellite.track('video_start');
    }

    // determine which player the event is coming from
    var id = e.target.id;
    // go through players
    players.forEach(function (player) {
      if (player.id() !== id) {
        // pause the other player(s)
        videojs(player.id()).pause();
      }
    });
  }

  function _onComplete(e) {
    // Adobe Analytics
    window.digitalData.event.id = e.target.id;
    window.digitalData.event.title = _retrieveTitle(e.target.id);
    _satellite.track('video_end');

    $('.' + e.target.id).addClass('complete');
  }

  function _viewStatus() {
    $(window).scroll(function () {
      players.forEach(function (player) {
        if (!$('#' + player.id()).visible()) {
          videojs(player.id()).pause();
        }
      });
    });
  }

  function _retrieveTitle(id) {
    return $('.video-title.' + id).first().text();
  }

  return {
    init: init
  };
})(window);

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

        // Adobe Analytics
        window.digitalData.event.searchResults = result.length > 0 ? result.length : 0;
        window.digitalData.event.searchType = 'careers';
        window.digitalData.event.searchTerm = $field.val();
        _satellite.track('search_careers');

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
      }, {
        name: 'locations',
        source: suggestions.locations,
        limit: 2
      });

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

var modal = (function () {

		var directCallRule = 'modal_click';

		function init() {
				// $(document).on('click', '.ga-careers-city-search, .ga-careers-learn-more', function () {
				// 	window._satellite = window._satellite || {};
				// 	window._satellite.track = window._satellite.track || function(){};
				// 	_satellite.track(directCallRule);
				// });

				$(document).on('click', '.ga-careers-city-search, .ga-careers-learn-more', function () {
						setTimeout(function () {
								if ($('body.is-reveal-open').length > 0) {
										window._satellite = window._satellite || {};
										window._satellite.track = window._satellite.track || function () {};
										_satellite.track(directCallRule);
								}
						}, 1500);
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

// Init Satellite and event object
window._satellite = window._satellite || {};
window._satellite.track = window._satellite.track || function () {};
window.digitalData.event = {};

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
    // Following is only for Adobe Analytics
    modal.init();
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvY2FyZWVycy5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL3NlYXJjaC5qcyIsIm1vZHVsZXMvbW9kYWwuanMiLCJtb2R1bGVzL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBUaGlzIGZpbGUgaXMgZm9yIG1ldGhvZHMgYW5kIHZhcmlhYmxlcyB0aGF0IGFyZSBnb2luZyB0byBiZVxyXG4gdXNlZnVsIGFjcm9zcyBhbGwgbW9kdWxlcy4gSW4gb3JkZXIgdG8gdXNlIHRoZW0gYW55d2hlcmUsIGltcG9ydCB3aXRoOlxyXG5cclxuIGltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbiBhbmQgdGhlbiBjYWxsIHdpdGggdGhlIGlnIG5hbWVzcGFjZSAoaS5lLiwgaWcucGF0aG5hbWUsIGlnLmxhbmcsIGV0YylcclxuICovXHJcblxyXG4vLyB1cmwgcGF0aFxyXG5leHBvcnQgdmFyIHBhdGhuYW1lID0gKCgpID0+IHtcclxuICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xyXG59KSgpXHJcblxyXG4vLyBsYW5ndWFnZVxyXG5leHBvcnQgdmFyIGxhbmcgPSAoKCkgPT4ge1xyXG4gIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZignL2ZyLicpICE9PSAtMSB8fCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZignL2ZyLycpICE9PSAtMSkge1xyXG4gICAgcmV0dXJuICdmcic7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAnZW4nO1xyXG4gIH1cclxufSkoKVxyXG5cclxuLy8gYnJvd3NlciB3aWR0aFxyXG5leHBvcnQgdmFyIGJyb3dzZXJXaWR0aCA9ICgoKSA9PiB7XHJcbiAgcmV0dXJuIHdpbmRvdy5vdXRlcldpZHRoO1xyXG59KSgpXHJcblxyXG4vLyBjaGVjayBmb3IgSUUgKHByZSBFZGdlKVxyXG5leHBvcnQgdmFyIG9sZElFID0gKCgpID0+IHtcclxuICBpZiAoXCJBY3RpdmVYT2JqZWN0XCIgaW4gd2luZG93KSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufSkoKVxyXG5cclxuLy8gYmFzZSBldmVudEVtaXR0ZXJcclxuLy8gZXhwb3J0IHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuZXhwb3J0IHZhciBkZWJvdW5jZSA9IChmdW5jLCB3YWl0LCBpbW1lZGlhdGUpID0+IHtcclxuICB2YXIgdGltZW91dDtcclxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aW1lb3V0ID0gbnVsbDtcclxuICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICB9O1xyXG4gICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XHJcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XHJcbiAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5cclxuIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgdmFyIGVuZHBvaW50VVJMLFxyXG4gICAgc3VjY2Vzc1VSTCxcclxuICAgIGNhbmNlbFVSTCxcclxuICAgICRmb3JtLFxyXG4gICAgJGZvcm1XcmFwcGVyO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgLy8gRm9ybXMgc2hvdWxkIGFsd2F5cyBiZSB3cmFwcGVkIGluICcuaWctZm9ybSdcclxuICAgICRmb3JtV3JhcHBlciA9ICQoJy5pZy1mb3JtJyk7XHJcbiAgICAkZm9ybSA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJyk7XHJcbiAgICBlbmRwb2ludFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnZW5kcG9pbnQnKTtcclxuICAgIGNhbmNlbFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnY2FuY2VsJyk7XHJcblxyXG4gICAgX3ZhbGlkYXRpb24oKTtcclxuICAgIF90b2dnbGVyKClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF92YWxpZGF0aW9uKCkge1xyXG4gICAgLy8gV2UgbmVlZCB0byBjaGVjayB3aGV0aGVyIGFuIGlucHV0IGlzICdkaXJ0eScgb3Igbm90IChzaW1pbGFyIHRvIGhvdyBBbmd1bGFyIDEgd29ya3MpIGluIG9yZGVyIGZvciBsYWJlbHMgdG8gYmVoYXZlIHByb3Blcmx5XHJcbiAgICB2YXIgaklucHV0ID0gJCgnOmlucHV0LCB0ZXh0YXJlYScpO1xyXG4gICAgaklucHV0LmNoYW5nZShmdW5jdGlvbiAob2JqRXZlbnQpIHtcclxuICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZGlydHknKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQudmFsaWRhdG9yLnNldERlZmF1bHRzKHtcclxuICAgICAgZGVidWc6IHRydWUsXHJcbiAgICAgIHN1Y2Nlc3M6ICd2YWxpZCdcclxuICAgIH0pO1xyXG5cclxuICAgICQudmFsaWRhdG9yLmFkZE1ldGhvZCgnY2RuUG9zdGFsJywgZnVuY3Rpb24gKHBvc3RhbCwgZWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25hbChlbGVtZW50KSB8fFxyXG4gICAgICAgIHBvc3RhbC5tYXRjaCgvW2EtekEtWl1bMC05XVthLXpBLVpdKC18IHwpWzAtOV1bYS16QS1aXVswLTldLyk7XHJcbiAgICB9LCAnUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBwb3N0YWwgY29kZS4nKTtcclxuXHJcbiAgICAkZm9ybS52YWxpZGF0ZSh7XHJcbiAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBfcHJvY2VzcygpO1xyXG4gICAgICB9LFxyXG4gICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24gKGxhYmVsLCBlbGVtZW50KSB7XHJcbiAgICAgICAgLy8gVXNlIHRoZSBjdXN0b20tZXJyb3ItbG9jYXRpb24gbWFya2VyIGNsYXNzIHRvIGNoYW5nZSB3aGVyZSB0aGUgZXJyb3IgbGFiZWwgc2hvd3MgdXBcclxuICAgICAgICBpZiAoISQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5sZW5ndGgpIHtcclxuICAgICAgICAgICQoZWxlbWVudCkucGFyZW50KCkuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmFwcGVuZChsYWJlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBydWxlczoge1xyXG4gICAgICAgIHBob25lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBob25lMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBwaG9uZVVTOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3N0YWxfY29kZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBjZG5Qb3N0YWw6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZpcnN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGFzdG5hbWU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbWFpbDI6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICRmb3JtLmZpbmQoJ2J1dHRvbi5jYW5jZWwnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKGNhbmNlbFVSTCk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcHJvY2Vzcyhmb3JtKSB7XHJcbiAgICB2YXIgZm9ybURhdGFSYXcsXHJcbiAgICAgIGZvcm1EYXRhUGFyc2VkO1xyXG5cclxuICAgIGlmICgkZm9ybS52YWxpZCgpKSB7XHJcbiAgICAgICRmb3JtLnJlbW92ZUNsYXNzKCdzZXJ2ZXItZXJyb3InKTtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgIGZvcm1EYXRhUmF3ID0gJGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcclxuICAgICAgLy8gSWYgd2UgbmVlZCB0byBtb2RpZnkgdGhlIGRhdGEsIHVzZSBwYXJzZSBtZXRob2RcclxuICAgICAgZm9ybURhdGFQYXJzZWQgPSBfcGFyc2UoZm9ybURhdGFSYXcpO1xyXG4gICAgICAvLyBTdWJtaXQgZmluYWwgZGF0YVxyXG4gICAgICBfc3VibWl0KGZvcm1EYXRhUGFyc2VkKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wYXJzZShkYXRhKSB7XHJcbiAgICAvLyBFeGVjdXRlIGFueSBjdXN0b20gbG9naWMgaGVyZVxyXG5cclxuXHJcbiAgICByZXR1cm4gZGF0YVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3N1Ym1pdChkYXRhKSB7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgdXJsOiBlbmRwb2ludFVSTCxcclxuICAgICAgZGF0YTogZGF0YVxyXG4gICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICRmb3JtV3JhcHBlci5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgIH0pXHJcbiAgICAgIC5lcnJvcihmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgJGZvcm0uYWRkQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgICAgIFNjcm9sbE1hbi50bygkKCcjc2VydmVyLWVycm9yJykpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF90b2dnbGVyKCkge1xyXG4gICAgLy8gVmVyeSBzaW1wbGUgZm9ybSB0b2dnbGVyXHJcbiAgICAkKCcudG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnLnRvZ2dsZS1jb250ZW50JykuaGlkZSgpO1xyXG4gICAgICAkKCcuJyArICQodGhpcykuZGF0YSgnY29udGVudCcpKS5zaG93KCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnQ2Fyb3VzZWwgSW5pdGlhbGl6ZWQhJylcclxuXHJcbiAgICAvLyBOb3Qgc3VyZSB3aGF0IHRoaXMgZG9lcyBhdCB0aGlzIHBvaW50IG9yIGhvdyBpdCByZWxhdGVzIHRvIENhcm91c2Vsc1xyXG4gICAgJCgnW2RhdGEtcmVzcG9uc2l2ZS10b2dnbGVdIGJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCdzaXRlLWhlYWRlci1pcy1hY3RpdmUnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIF9idWlsZENhcm91c2VsKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYnVpbGRDYXJvdXNlbCgpIHtcclxuICAgIHZhciBwcmV2QXJyb3csXHJcbiAgICAgIG5leHRBcnJvdyxcclxuICAgICAgJGNhcm91c2VsO1xyXG5cclxuICAgICQoJy5pZy1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICRjYXJvdXNlbCA9ICQodGhpcyk7XHJcbiAgICAgIHByZXZBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPlByZXZpb3VzPC9zcGFuPjwvYnV0dG9uPic7XHJcbiAgICAgIG5leHRBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPk5leHQ8L3NwYW4+PC9idXR0b24+JztcclxuXHJcbiAgICAgICRjYXJvdXNlbC5zbGljayh7XHJcbiAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxyXG4gICAgICAgIGFycm93czogJGNhcm91c2VsLmRhdGEoJ2Fycm93cycpIHx8IGZhbHNlLFxyXG4gICAgICAgIGF1dG9QbGF5OiAkY2Fyb3VzZWwuZGF0YSgnYXV0b1BsYXknKSB8fCBmYWxzZSxcclxuICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxyXG4gICAgICAgIGZhZGU6ICRjYXJvdXNlbC5kYXRhKCdmYWRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgaW5maW5pdGU6ICRjYXJvdXNlbC5kYXRhKCdpbmZpbml0ZScpIHx8IGZhbHNlLFxyXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxyXG4gICAgICAgIG5leHRBcnJvdzogbmV4dEFycm93LFxyXG4gICAgICAgIHByZXZBcnJvdzogcHJldkFycm93LFxyXG4gICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGU6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZScpIHx8ICcnLFxyXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVUb1Njcm9sbCcpIHx8IDEsXHJcbiAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcclxuICAgICAgICBzcGVlZDogJGNhcm91c2VsLmRhdGEoJ3NwZWVkJykgfHwgMzAwLFxyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKHdpbmRvdykgPT4ge1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgICAgIF9jYXJlZXJzTGVnYWN5Q29kZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9jYXJlZXJzTGVnYWN5Q29kZSgpIHtcclxuICAgICAgICAoZnVuY3Rpb24gKCQpIHtcclxuXHJcbiAgICAgICAgICAgICQuZm4uaW5mb1RvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICRyZXZlYWwgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcmV2ZWFsQ29udGVudCA9ICRyZXZlYWwuZmluZCgnLmluZm8tdG9nZ2xlLWNvbnRlbnQnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHJldmVhbFRyaWdnZXIgPSAkcmV2ZWFsLmZpbmQoJy5pbmZvLXRvZ2dsZS10cmlnZ2VyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpeGVkSGVpZ2h0ID0gZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEFyaWEgPSAkcmV2ZWFsLmF0dHIoJ2luZm8tdG9nZ2xlLWFyaWEnKSA9PT0gJ3RydWUnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbml0VG9nZ2xlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXRUb2dnbGUoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyZXZlYWxUcmlnZ2VyLm9uKCdjbGljaycsIGhhbmRsZVJldmVhbFRvZ2dsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgcmVzaXplSGFuZGxlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRSZXZlYWxDb250ZW50SGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLy0tLS0tXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZVJldmVhbFRvZ2dsZSgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0UmV2ZWFsQ29udGVudEhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcmV2ZWFsLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoc2V0UmV2ZWFsQ29udGVudEhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiByZXNpemVIYW5kbGVyKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZml4ZWRIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmNzcyh7aGVpZ2h0OiAnYXV0byd9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gc2V0UmV2ZWFsQ29udGVudEhlaWdodCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbmFsSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRyZXZlYWwuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbEhlaWdodCA9ICRyZXZlYWxDb250ZW50WzBdLnNjcm9sbEhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpeGVkSGVpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsSGVpZ2h0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpeGVkSGVpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHJldmVhbENvbnRlbnQuY3NzKHtoZWlnaHQ6IGZpbmFsSGVpZ2h0fSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2V0QXJpYSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJldmVhbENvbnRlbnQuYXR0cignYXJpYS1oaWRkZW4nLCAhZml4ZWRIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH0pKGpRdWVyeSk7XHJcblxyXG5cclxuICAgICAgICAoZnVuY3Rpb24gKCQpIHtcclxuICAgICAgICAgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICAgICAgICAgJC5mbi5jaXJjbGVBbmltYXRpb24gPSBmdW5jdGlvbiAobWF4VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbnZhcyA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRjYW52YXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkID0gY2FudmFzLndpZHRoIC8gMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGVyY2VudFN0cm9rZSA9IDcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbWFpbmluZ1N0cm9rZSA9IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhZGl1cyA9IGQgLSBwZXJjZW50U3Ryb2tlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJQZXJjID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2lyYyA9IE1hdGguUEkgKiAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFydCA9IE1hdGguUEkgLyAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxlZ2F0ZUlEID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgKyAnQ0EnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoISRjYW52YXMuaXMoJ2NhbnZhcycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gJyMwZDI2M2MnO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyNlNWU4ZTgnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkY2FudmFzLmF0dHIoJ2NpcmNsZS1hbmltYXRpb24taWQnLCBkZWxlZ2F0ZUlEKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuZGVsZWdhdGUoJ1tjaXJjbGUtYW5pbWF0aW9uLWlkPScgKyBkZWxlZ2F0ZUlEICsgJ10nLCAnc3RhcnRBbmltYXRlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJQZXJjID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZSgnW2NpcmNsZS1hbmltYXRpb24taWQ9JyArIGRlbGVnYXRlSUQgKyAnXScsICdjbGVhckFuaW1hdGUnLCBjbGVhcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFuaW1hdGUoY3VycmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50ID0gY3VycmVudCA/IGN1cnJlbnQgOiAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHBlcmNlbnRTdHJva2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuYXJjKGQsIGQsIHJhZGl1cywgLShxdWFydCksICgoY2lyYykgKiAtTWF0aC5taW4oY3VycmVudCwgbWF4VmFsdWUgLyAxMDApKSAtIHF1YXJ0LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSByZW1haW5pbmdTdHJva2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuYXJjKGQsIGQsIHJhZGl1cywgLShxdWFydCksICgoY2lyYykgKiAtY3VycmVudCkgLSBxdWFydCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1clBlcmMrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1clBlcmMgPCAxMTApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGUoY3VyUGVyYyAvIDEwMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH0pKGpRdWVyeSk7XHJcblxyXG4gICAgICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAgICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAgICAgICAkLmZuLmJsb2NrTGluayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICRibG9ja0xpbmsgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbiA9ICRibG9ja0xpbmsuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2Rlc3RpbmF0aW9uID0gJzQ0NDIuYXNweC8nICsgZGVzdGluYXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdEJsb2NrKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXRCbG9jaygpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGJsb2NrTGluay5vbignY2xpY2snLCBoYW5kbGVDbGljayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLy0tLS0tXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbiA9IGRlc3RpbmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICB9KShqUXVlcnkpO1xyXG5cclxuICAgICAgICAoZnVuY3Rpb24gKCQpIHtcclxuICAgICAgICAgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICAgICAgICAgdmFyIGd1aSxcclxuICAgICAgICAgICAgICAgIHZpZGVvLFxyXG4gICAgICAgICAgICAgICAgb3ZlcmxheTtcclxuXHJcbiAgICAgICAgICAgIGluaXRMZWdhY3koKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGluaXRMZWdhY3koKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIHdlaXJkIC0gbm90IGdvaW5nIHRvIHRvdWNoIGl0XHJcbiAgICAgICAgICAgICAgICBvdmVybGF5ID0gbmV3IE92ZXJsYXlNb2R1bGUoKTtcclxuICAgICAgICAgICAgICAgIGd1aSA9IG5ldyBHdWlNb2R1bGUob3ZlcmxheSk7XHJcbiAgICAgICAgICAgICAgICAvLyB2aWRlbyA9IG5ldyBWaWRlb01vZHVsZSgpOyAvLyBSZXBsYWNlIHdpdGggdmlkZW8uanMgbW9kdWxlXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTmVlZCB0byBoYXZlIGEgY2xhc3MgdG8gaG9vayBvbnRvIGZvciBGcmVuY2ggbGFuZ3VhZ2UgcGFnZVxyXG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIvJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdmcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNtb290aCBzY3JvbGxpbmcgZm9yIGFuY2hvciBsaW5rc1xyXG4gICAgICAgICAgICAgICAgJCgnYVtocmVmXj1cIiNcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLnN0b3AoKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcCArIDUyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDc1MCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LnNlbGVjdG9yICE9PSBcIiNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjbWFpbi1tZW51LWFuY2hvcicpLmNzcyh7J2Rpc3BsYXknOiAnbm9uZSd9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdpcy1yZXZlYWwtb3BlbiBicmFuZGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTW9iaWxlIG1lbnUgbmVlZHMgdG8gbWltaWMgRm91bmRhdGlvbiByZXZlYWwgLSBub3QgZW5vdWdoIHRpbWUgdG8gaW1wbGVtZW50IGRpZmZlcmVudCBuYXZzIGluIGEgcmV2ZWFsIG1vZGFsIHByb3Blcmx5XHJcbiAgICAgICAgICAgICAgICAkKCcubWVudS1pY29uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2lzLXJldmVhbC1vcGVuIGJyYW5kZWQnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHF1aWNrIGFuZCBkaXJ0eSBtb2JpbGUgbWVudSBjbG9zZXMgLSBub3QgZmFtaWxpYXIgd2l0aCBGb3VuZGF0aW9uIHBhdHRlcm4gdG8gZmlyZSB0aGVzZVxyXG4gICAgICAgICAgICAgICAgJCgnLnRvcC1iYXIgLmNsb3NlLWJ1dHRvbi5zaG93LWZvci1zbWFsbC1vbmx5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNtYWluLW1lbnUtYW5jaG9yJykuY3NzKHsnZGlzcGxheSc6ICdub25lJ30pO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaXMtcmV2ZWFsLW9wZW4gYnJhbmRlZCcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gNjQwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnYnJhbmRlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLy0tLS0tXHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBHdWlNb2R1bGUob3ZlcmxheVJlZmVyZW5jZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IgPSAnW2NsYXNzKj1cInRvZ2dsZS1cIl06bm90KFtjbGFzcyo9XCJpbmZvLXRvZ2dsZVwiXSknLFxyXG4gICAgICAgICAgICAgICAgICAgIG11bHRpVGFiQ29udGVudFNlbGVjdG9yID0gJ1tjbGFzcyo9XCJjb250ZW50LVwiXScsXHJcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlUYWJTZWxlY3RvciA9ICcubXVsdGktdGFiLW91dGxpbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICRlZGdlT3ZlcmxheUxvY2F0aW9uID0gJCgnI2VkZ2Utb3ZlcmxheS1jb250ZW50JyksXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheSA9IG92ZXJsYXlSZWZlcmVuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXlTbGlkZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXJWaWRlb1NlY3Rpb25Ib2xkZXIgPSAkKCc8ZGl2PjwvZGl2PicpLFxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvd1NpemluZ0RlbGF5LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvd1Njcm9sbGluZ0RlbGF5LFxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlPcGVuLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzUmVzcG9uc2l2ZVN0YXRlID0gZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsZWRUb1ZpZXcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbml0R3VpKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdEd1aSgpIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRNdWx0aVRhYlRvZ2dsZUhhbmRsZXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmJsb2NrLWxpbmsnKS5ibG9ja0xpbmsoKTtcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheVNsaWRlciA9ICQoJy5vdXItYnVzaW5lc3Mtc2xpZGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2VkZ2Utb3ZlcmxheS1jb250ZW50JykuZmluZCgnLmNhcm91c2VsLW5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXlTbGlkZXIuc2xpY2soJ3NsaWNrTmV4dCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgX3NhdGVsbGl0ZS50cmFjaygnY2Fyb3VzZWxfc2Nyb2xsJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoJChcIi52aWRlby1zbGlkZS5zbGljay1hY3RpdmVcIikubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zbGljay1saXN0LmRyYWdnYWJsZScpLmNzcyh7aGVpZ2h0OiAnNjYwcHgnfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zZWN0aW9uLnByb2ZpbGVzLXNsaWRlcicpLmNzcyh7YmFja2dyb3VuZENvbG9yOiAnI2U1ZThlOCd9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuc2xpY2stbGlzdC5kcmFnZ2FibGUnKS5jc3Moe2hlaWdodDogJ2F1dG8nfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zZWN0aW9uLnByb2ZpbGVzLXNsaWRlcicpLmNzcyh7YmFja2dyb3VuZENvbG9yOiAnIzdlYzRiOSd9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICQoJy5wcm9maWxlLWNvdW50ZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ2NhbnZhcycpLmNpcmNsZUFuaW1hdGlvbihwYXJzZUludCgkdGhpcy5maW5kKCdwJykuaHRtbCgpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIgPSAkKCcucHJvZmlsZXMtc2xpZGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdoYXNoY2hhbmdlJywgaGFuZGxlT3ZlcmxheUZyb21IYXNoKTtcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVPdmVybGF5RnJvbUhhc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGRlbGF5ZWRIYW5kbGVXaW5kb3dTaXppbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVdpbmRvd1NpemluZyh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGRlbGF5ZWRIYW5kbGVXaW5kb3dTY3JvbGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVdpbmRvd1Njcm9sbGluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKCcuaW5mby10b2dnbGUnKS5pbmZvVG9nZ2xlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnRvcC1iYXIgKyAuc2NyZWVuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdhW2RhdGEtdG9nZ2xlXScpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIE5vdCBwcmV0dHkgLSBqdXN0IGFkZGluZyBxdWljayBhbmQgZGlydHkgc2hhcmUgbGluayBhY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAkKCcuc2hhcmUtdG9nZ2xlLXRyaWdnZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5pbmZvLXRvZ2dsZScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNoYXJlLXRvZ2dsZS1jbG9zZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmluZm8tdG9nZ2xlJykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBhZGRNdWx0aVRhYlRvZ2dsZUhhbmRsZXJzKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZShtdWx0aVRhYlRvZ2dsZVNlbGVjdG9yLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVCYXNlID0gJHRoaXMuYXR0cignY2xhc3MnKS5tYXRjaCgvdG9nZ2xlLShcXFMqKT8oJHxcXHMpLylbMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJHRoaXMucGFyZW50cyhtdWx0aVRhYlNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb250YWluZXIuZmluZChtdWx0aVRhYlRvZ2dsZVNlbGVjdG9yKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb250YWluZXIuZmluZChtdWx0aVRhYkNvbnRlbnRTZWxlY3RvcikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb250YWluZXIuZmluZCgnLmNvbnRlbnQtJyArIHRvZ2dsZUJhc2UpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFuaW1hdGVQcm9maWxlU2xpZGVyKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciAkcHJvZmlsZVBhbmVscyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZmlsZVBhbmVsSGVpZ2h0ID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjcm9sbGVkVG9WaWV3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLmZpbmQoJy5zbGljay1zbGlkZScpLnJlbW92ZUNsYXNzKCdzbGljay1jb21wbGV0ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5maW5kKCcuc2xpY2stYWN0aXZlJykuYWRkQ2xhc3MoJ3NsaWNrLWNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwcm9maWxlU2xpZGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnLnNsaWNrLXNsaWRlOm5vdCguc2xpY2stY29tcGxldGUpJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcucHJvZmlsZS1jb3VudGVyIGNhbnZhcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpZ2dlcignY2xlYXJBbmltYXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwcm9maWxlU2xpZGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnLnNsaWNrLWNvbXBsZXRlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcucHJvZmlsZS1jb3VudGVyIGNhbnZhcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpZ2dlcignc3RhcnRBbmltYXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkcHJvZmlsZVNsaWRlci5maW5kKCcuc2xpY2stYWN0aXZlJykuaXMoJ1tjbGFzcyo9cHJvZmlsZS1dJykgfHwgaXNSZXNwb25zaXZlU3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLmFkZENsYXNzKCdjb250cmFzdC1hcnJvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIucmVtb3ZlQ2xhc3MoJ2NvbnRyYXN0LWFycm93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVQYW5lbHMgPSAkcHJvZmlsZVNsaWRlci5maW5kKCcucHJvZmlsZS0xLXNsaWRlLCAucHJvZmlsZS0yLXNsaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwcm9maWxlUGFuZWxzLmNzcyh7aGVpZ2h0OiAnYXV0byd9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVQYW5lbHMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudCA9ICQodGhpcykub3V0ZXJIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudCA+IHByb2ZpbGVQYW5lbEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2ZpbGVQYW5lbEhlaWdodCA9IGN1cnJlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVBhbmVscy5jc3Moe2hlaWdodDogcHJvZmlsZVBhbmVsSGVpZ2h0fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNoYW5nZVNsaWRlclN0YXRlKHNsaWRlciwgc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcImFjY2Vzc2liaWxpdHlcIiwgc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwiZHJhZ2dhYmxlXCIsIHN0YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcInN3aXBlXCIsIHN0YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcInRvdWNoTW92ZVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZGVsYXllZEhhbmRsZVdpbmRvd1NpemluZygpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAod2luZG93U2l6aW5nRGVsYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh3aW5kb3dTaXppbmdEZWxheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3dTaXppbmdEZWxheSA9IHdpbmRvdy5zZXRUaW1lb3V0KGhhbmRsZVdpbmRvd1NpemluZywgMjUwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBkZWxheWVkSGFuZGxlV2luZG93U2Nyb2xsKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3dTY3JvbGxpbmdEZWxheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHdpbmRvd1Njcm9sbGluZ0RlbGF5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvd1Njcm9sbGluZ0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQoaGFuZGxlV2luZG93U2Nyb2xsaW5nLCAyNTApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlGcm9tSGFzaChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmdWxsSGFzaEZyYWdtZW50ID0gJyNvdXItZWRnZS0nO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvdmVybGF5T3BlbiAmJiBsb2NhdGlvbi5oYXNoLmluZGV4T2YoZnVsbEhhc2hGcmFnbWVudCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheS5vcGVuT3ZlcmxheShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRlZGdlT3ZlcmxheUxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlT3ZlcmxheU9wZW4sIGhhbmRsZU92ZXJsYXlDbG9zZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlPcGVuKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluaXRpYWxJbmRleDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdFNsaWRlcigkb3ZlcmxheVNsaWRlciwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsSW5kZXggPSAkb3ZlcmxheVNsaWRlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnLicgKyBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyNvdXItJywgJycpICsgJzpub3QoLnNsaWNrLWNsb25lZCknKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1zbGljay1pbmRleCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCdzbGlja0dvVG8nLCBpbml0aWFsSW5kZXgsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5U2xpZGVyLm9uKCdhZnRlckNoYW5nZScsIGhhbmRsZVNsaWRlQ2hhbmdlKTtcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVTbGlkZUNoYW5nZShudWxsLCBudWxsLCBwYXJzZUludCgkKCcjbW9kYWxPdmVybGF5IC5zbGljay1hY3RpdmUnKS5hdHRyKCdkYXRhLXNsaWNrLWluZGV4JykpKTtcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVXaW5kb3dTaXppbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5T3BlbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUNsb3NlKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHlQb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJsYXlDb250ZW50ID0gJCgnI21vZGFsT3ZlcmxheSA+IGRpdicpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheVNsaWRlci5zbGljaygndW5zbGljaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5U2xpZGVyLm9mZignYWZ0ZXJDaGFuZ2UnKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcub3ZlcmxheS1yZXBvc2l0b3J5JykuYXBwZW5kKG92ZXJsYXlDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJwdXNoU3RhdGVcIiBpbiBoaXN0b3J5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZShcIlwiLCBkb2N1bWVudC50aXRsZSwgbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB5UG9zID0gJChkb2N1bWVudCkuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLmhhc2ggPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoeVBvcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlU2xpZGVDaGFuZ2UoZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dFNsaWRlID0gKGN1cnJlbnRTbGlkZSArIDEpICUgKCQoJy5zbGljay1zbGlkZTpub3QoLnNsaWNrLWNsb25lZCknKS5sZW5ndGggLSAxKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFRpdGxlID0gJCgkb3ZlcmxheVNsaWRlci5maW5kKCdbZGF0YS1zbGljay1pbmRleD0nICsgbmV4dFNsaWRlICsgJ10gLmNvbHVtbnM6Zmlyc3QtY2hpbGQgcCcpLmdldCgwKSkuaHRtbCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdIYXNoID0gJ291ci0nICsgJG92ZXJsYXlTbGlkZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnW2RhdGEtc2xpY2staW5kZXg9JyArIGN1cnJlbnRTbGlkZSArICddJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXRjaCgvKGVkZ2UtXFxTKikvKVsxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI21vZGFsT3ZlcmxheSAuY2Fyb3VzZWwtbmV4dCBhJykuaHRtbChuZXh0VGl0bGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLmhhc2ggPSBuZXdIYXNoO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZVdpbmRvd1NpemluZyhpbml0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNpdmVMaW1pdCA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0lzUmVzcG9uc2l2ZVN0YXRlID0gd2luZG93V2lkdGggPCByZXNwb25zaXZlTGltaXQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkb3ZlcmxheVNsaWRlci5pcygnLnNsaWNrLWluaXRpYWxpemVkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlU2xpZGVyU3RhdGUoJG92ZXJsYXlTbGlkZXIsICFuZXdJc1Jlc3BvbnNpdmVTdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNSZXNwb25zaXZlU3RhdGUgIT09IG5ld0lzUmVzcG9uc2l2ZVN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUmVzcG9uc2l2ZVN0YXRlID0gbmV3SXNSZXNwb25zaXZlU3RhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbml0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXRQcm9maWxlU2xpZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZVdpbmRvd1Njcm9sbGluZygpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNjcm9sbGVkVG9WaWV3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyAkKHdpbmRvdykuaGVpZ2h0KCkgPiAkcHJvZmlsZVNsaWRlci5vZmZzZXQoKS50b3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbGVkVG9WaWV3ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGFuaW1hdGVQcm9maWxlU2xpZGVyLCA1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXRQcm9maWxlU2xpZGVyKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRTbGlkZXIoJHByb2ZpbGVTbGlkZXIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZBcnJvdzogJzxzcGFuIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNhcm91c2VsLXByZXYgZ2EtY2FyZWVycy1vdXItcGVvcGxlLWNhcm91c2VsLXNjcm9sbFwiPjxpbWcgc3JjPVwiL2NvbnRlbnQvZGFtL2ludmVzdG9yc2dyb3VwL2FwcC9jYXJlZXJzL2ltYWdlcy9BcnJvdy1NYWluQXJ0aWNsZS1DYXJvdXNlbC1CbGFjay1MLnBuZ1wiPjwvc3Bhbj4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0QXJyb3c6ICc8c3BhbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjYXJvdXNlbC1uZXh0IGdhLWNhcmVlcnMtb3VyLXBlb3BsZS1jYXJvdXNlbC1zY3JvbGxcIj48aW1nIHNyYz1cIi9jb250ZW50L2RhbS9pbnZlc3RvcnNncm91cC9hcHAvY2FyZWVycy9pbWFnZXMvQXJyb3ctTWFpbkFydGljbGUtQ2Fyb3VzZWwtQmxhY2stUi5wbmdcIj48L3NwYW4+J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGVQcm9maWxlU2xpZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIub24oJ2FmdGVyQ2hhbmdlJywgYW5pbWF0ZVByb2ZpbGVTbGlkZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXRTbGlkZXIodGFyZ2V0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGVlZDogNzUwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb3RzQ2xhc3M6ICdzbGljay1kb3RzIGdhLWNhcmVlcnMtb3VyLXBlb3BsZS1jYXJvdXNlbC1zY3JvbGwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2OCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5zbGljaygkLmV4dGVuZChkZWZhdWx0cywgb3B0aW9ucykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBPdmVybGF5TW9kdWxlKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyICRvdmVybGF5LFxyXG4gICAgICAgICAgICAgICAgICAgICRib2R5ID0gJCgnYm9keScpLFxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlTaXppbmdEZWxheSxcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5zdGFuY2UgPSB7fSxcclxuICAgICAgICAgICAgICAgICAgICBpc09wZW5GbGFnID0gZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgJGNsb3NlQnV0dG9uO1xyXG5cclxuICAgICAgICAgICAgICAgIGluaXRPdmVybGF5KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBvcGVuT3ZlcmxheTogb3Blbk92ZXJsYXksXHJcbiAgICAgICAgICAgICAgICAgICAgaXNPcGVuOiBpc09wZW5cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdE92ZXJsYXkoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkgPSAkKCc8ZGl2PjwvZGl2PicpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5LmF0dHIoJ2lkJywgJ21vZGFsT3ZlcmxheScpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5LmF0dHIoJ2NsYXNzJywgJ3JldmVhbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5LmF0dHIoJ2RhdGEtcmV2ZWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGJvZHkuYXBwZW5kKCRvdmVybGF5KTtcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5vbignb3Blbi56Zi5yZXZlYWwnLCBoYW5kbGVPdmVybGF5T3Blbik7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdjbG9zZWQuemYucmV2ZWFsJywgaGFuZGxlT3ZlcmxheUNsb3NlKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGRlbGF5ZWRIYW5kbGVPdmVybGF5U2l6aW5nKTtcclxuICAgICAgICAgICAgICAgICAgICBpbml0Q2xvc2VCdXR0b24oKTtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgRm91bmRhdGlvbi5SZXZlYWwoJG92ZXJsYXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBkZWxheWVkSGFuZGxlT3ZlcmxheVNpemluZygpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3ZlcmxheVNpemluZ0RlbGF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQob3ZlcmxheVNpemluZ0RlbGF5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlTaXppbmdEZWxheSA9IHdpbmRvdy5zZXRUaW1lb3V0KG92ZXJsYXlTaXppbmcsIDI1MCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUNsb3NlKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNPcGVuRmxhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50SW5zdGFuY2UuY2xvc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEluc3RhbmNlLmNsb3NlKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVNpemVDbGVhbnVwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEluc3RhbmNlID0ge307XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheU9wZW4oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzT3BlbkZsYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5maW5kKCcqJykuZm91bmRhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50SW5zdGFuY2Uub3Blbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5zdGFuY2Uub3BlbihldmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlTaXppbmcoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbml0Q2xvc2VCdXR0b24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICRpbm5lclNwYW4gPSAkKCc8c3Bhbj48L3NwYW4+Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRjbG9zZUJ1dHRvbiA9ICQoJzxidXR0b24gZGF0YS1jbG9zZT48L2J1dHRvbj4nKTtcclxuICAgICAgICAgICAgICAgICAgICAkY2xvc2VCdXR0b24uYWRkQ2xhc3MoJ2Nsb3NlLWJ1dHRvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICRjbG9zZUJ1dHRvbi5hdHRyKCdhcmlhLWxhYmVsJywgJ0Nsb3NlIG1vZGFsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlubmVyU3Bhbi5hdHRyKCdhcmlhLWhpZGRlbicsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICRpbm5lclNwYW4uaHRtbCgnJnRpbWVzOycpO1xyXG4gICAgICAgICAgICAgICAgICAgICRjbG9zZUJ1dHRvbi5hcHBlbmQoJGlubmVyU3Bhbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaXNPcGVuKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc09wZW5GbGFnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG9wZW5PdmVybGF5KHVybE9yTWFya3VwLCBvcGVuQ2FsbGJhY2ssIGNsb3NlQ2FsbGJhY2ssIGZ1bGxTY3JlZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5zdGFuY2Uub3BlbiA9IG9wZW5DYWxsYmFjaztcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5zdGFuY2UuY2xvc2UgPSBjbG9zZUNhbGxiYWNrO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5mdWxsID0gZnVsbFNjcmVlbjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHVybE9yTWFya3VwID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuT3ZlcmxheVdpdGhBamF4KHVybE9yTWFya3VwKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuT3ZlcmxheVdpdGhNYXJrdXAodXJsT3JNYXJrdXApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb3Blbk92ZXJsYXlXaXRoQWpheCh1cmwpIHtcclxuICAgICAgICAgICAgICAgICAgICAkLmFqYXgodXJsKS5kb25lKG9wZW5PdmVybGF5V2l0aE1hcmt1cCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb3Blbk92ZXJsYXlXaXRoTWFya3VwKG1hcmt1cCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5Lmh0bWwobWFya3VwKTtcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5hcHBlbmQoJGNsb3NlQnV0dG9uKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEluc3RhbmNlLmZ1bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ2Z1bGwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuZm91bmRhdGlvbignb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG92ZXJsYXlTaXplQ2xlYW51cCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5yZW1vdmVDbGFzcygnZnVsbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5LnJlbW92ZUNsYXNzKCd0b3VyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuaHRtbCgnJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb3ZlcmxheVNpemluZygpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb3ZlcmxheUhlaWdodCA9ICRvdmVybGF5LmhlaWdodCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvdmVybGF5SGVpZ2h0ID4gd2luZG93SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRvdmVybGF5LmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRvdmVybGF5LmFkZENsYXNzKCdmdWxsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pKGpRdWVyeSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdFxyXG4gICAgfTtcclxufSkod2luZG93KSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgod2luZG93KSA9PiB7XHJcblxyXG4gIHZhciB2aWRlb0lEcyA9IFtdLFxyXG4gICAgcGxheWVycyA9IFtdLFxyXG4gICAgYnJpZ2h0Q292ZSxcclxuICAgICR2aWRlbztcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIF9wYXJzZVZpZGVvcygpO1xyXG5cclxuICAgIGlmICghaWcub2xkSUUpIHtcclxuXHJcbiAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgVmlkZW9KUyBtZXRob2QgaXMgYXZhaWxhYmxlIGFuZCBmaXJlIHJlYWR5IGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgIGJyaWdodENvdmUgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQoJy52anMtcGx1Z2lucy1yZWFkeScpLmxlbmd0aCkge1xyXG4gICAgICAgICAgX2JyaWdodENvdmVSZWFkeSgpO1xyXG4gICAgICAgICAgY2xlYXJJbnRlcnZhbChicmlnaHRDb3ZlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDUwMCk7XHJcblxyXG4gICAgICAvLyBGdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgdmlkZW8ncyBoYXZlIHNjcm9sbGVkIG9mZiBzY3JlZW4gYW5kIG5lZWQgdG8gYmUgcGF1c2VkXHJcbiAgICAgIF92aWV3U3RhdHVzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcGFyc2VWaWRlb3MoKSB7XHJcbiAgICB2YXIgJGdyb3VwLFxyXG4gICAgICBkYXRhID0ge30sXHJcbiAgICAgIHByZWxvYWRPcHRpb25zID0gWydhdXRvJywgJ21ldGFkYXRhJywgJ25vbmUnXTtcclxuXHJcbiAgICAvLyBFYWNoIGdyb3VwIGNhbiBlZmZlY3RpdmVseSB1c2UgYSBkaWZmZXJlbnQgcGxheWVyIHdoaWNoIHdpbGwgb25seSBiZSBsb2FkZWQgb25jZVxyXG4gICAgJCgnLmlnLXZpZGVvLWdyb3VwJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRncm91cCA9ICQodGhpcyk7XHJcbiAgICAgIGRhdGEucGxheWVyID0gJGdyb3VwLmRhdGEoJ3BsYXllcicpO1xyXG5cclxuICAgICAgLy8gTG9vcCB0aHJvdWdoIHZpZGVvJ3NcclxuICAgICAgJGdyb3VwLmZpbmQoJy5pZy12aWRlby1qcycpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgJHZpZGVvID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgZGF0YS5pZCA9ICR2aWRlby5kYXRhKCdpZCcpO1xyXG4gICAgICAgIGRhdGEudGl0bGUgPSAkdmlkZW8uZGF0YSgndGl0bGUnKSA/ICR2aWRlby5kYXRhKCd0aXRsZScpIDogJyc7XHJcbiAgICAgICAgZGF0YS5kZXNjcmlwdGlvbiA9ICR2aWRlby5kYXRhKCdkZXNjcmlwdGlvbicpID8gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgOiAnJztcclxuXHJcbiAgICAgICAgaWYgKGlnLm9sZElFKSB7XHJcblxyXG4gICAgICAgICAgX2luamVjdElmcmFtZShkYXRhLCAkdmlkZW8pO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyB0aGF0IGFyZSB1c2VkIHdpdGggbW9kZXJuIGJyb3dzZXJzXHJcbiAgICAgICAgICBkYXRhLm92ZXJsYXkgPSAkdmlkZW8uZGF0YSgnb3ZlcmxheScpID9cclxuICAgICAgICAgICAgJHZpZGVvLmRhdGEoJ292ZXJsYXknKSA6XHJcbiAgICAgICAgICAgICcnO1xyXG4gICAgICAgICAgZGF0YS5hdXRvID0gJHZpZGVvLmRhdGEoJ2F1dG9wbGF5JykgPyAnYXV0b3BsYXknIDogJyc7XHJcbiAgICAgICAgICBkYXRhLnByZWxvYWQgPSAocHJlbG9hZE9wdGlvbnMuaW5kZXhPZigkdmlkZW8uZGF0YSgncHJlbG9hZCcpKSA+IC0xKSA/ICR2aWRlby5kYXRhKCdwcmVsb2FkJykgOiAnYXV0byc7XHJcbiAgICAgICAgICBkYXRhLnRyYW5zY3JpcHQgPSAkdmlkZW8uZGF0YSgndHJhbnNjcmlwdCcpID8gJHZpZGVvLmRhdGEoXHJcbiAgICAgICAgICAgICd0cmFuc2NyaXB0JykgOiAnJztcclxuICAgICAgICAgIGRhdGEuY3RhVGVtcGxhdGUgPSAkdmlkZW8uZGF0YSgnY3RhVGVtcGxhdGUnKSA/ICR2aWRlby5kYXRhKFxyXG4gICAgICAgICAgICAnY3RhVGVtcGxhdGUnKSA6ICcnO1xyXG5cclxuICAgICAgICAgIC8vIFN0b3JlIElEJ3MgZm9yIGFsbCB2aWRlbydzIG9uIHRoZSBwYWdlIC0gaW4gY2FzZSB3ZSB3YW50IHRvIHJ1biBhIHBvc3QtbG9hZCBwcm9jZXNzIG9uIGVhY2hcclxuICAgICAgICAgIGlmICh2aWRlb0lEcy5pbmRleE9mKGRhdGEuaWQpID09PSAtMSkge1xyXG4gICAgICAgICAgICB2aWRlb0lEcy5wdXNoKGRhdGEuaWQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIExldCdzIHJlcGxhY2UgdGhlIGlnLXZpZGVvLWpzICdkaXJlY3RpdmUnIHdpdGggdGhlIG5lY2Vzc2FyeSBCcmlnaHRjb3ZlIGNvZGVcclxuICAgICAgICAgIF9pbmplY3RUZW1wbGF0ZShkYXRhLCBpbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIE9ubHkgaW5qZWN0IEJyaWdodGNvdmUgSlMgaWYgbW9kZXJuIGJyb3dzZXJcclxuICAgICAgaWYgKCFpZy5vbGRJRSkge1xyXG4gICAgICAgIGluamVjdEJyaWdodENvdmVKUyhkYXRhKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2luamVjdFRlbXBsYXRlKGRhdGEsIGluZGV4KSB7XHJcbiAgICB2YXIgdHJhbnNjcmlwdFRleHQgPSB7XHJcbiAgICAgICAgJ2VuJzogJ1RyYW5zY3JpcHQnLFxyXG4gICAgICAgICdmcic6ICdUcmFuc2NyaXB0aW9uJ1xyXG4gICAgICB9LFxyXG4gICAgICBodG1sID0gYDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXIgJHtkYXRhLmlkfVwiPjxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXItcmVzcG9uc2l2ZVwiPmA7XHJcblxyXG4gICAgaWYgKGRhdGEuY3RhVGVtcGxhdGUubGVuZ3RoID4gMCkge1xyXG4gICAgICBodG1sICs9IGA8c3BhbiBjbGFzcz1cInZpZGVvLWN0YVwiPiR7ZGF0YS5jdGFUZW1wbGF0ZX08L3NwYW4+YDtcclxuICAgIH1cclxuICAgIGlmIChkYXRhLm92ZXJsYXkubGVuZ3RoID4gMCkge1xyXG4gICAgICBodG1sICs9IGA8c3BhbiBjbGFzcz1cInZpZGVvLW92ZXJsYXlcIiBzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6IHVybCgnJHtkYXRhLm92ZXJsYXl9Jyk7XCI+PC9zcGFuPmA7XHJcbiAgICB9XHJcbiAgICBodG1sICs9IGA8dmlkZW8gZGF0YS1zZXR1cD0ne1widGVjaE9yZGVyXCI6IFtcImh0bWw1XCJdfScgZGF0YS12aWRlby1pZD1cIiR7ZGF0YS5pZH1cIiBwcmVsb2FkPVwiJHtkYXRhLnByZWxvYWR9XCIgZGF0YS1hY2NvdW50PVwiMzkwNjk0Mjg2MTAwMVwiIGRhdGEtcGxheWVyPVwiJHtkYXRhLnBsYXllcn1cIiBkYXRhLWVtYmVkPVwiZGVmYXVsdFwiIGRhdGEtYXBwbGljYXRpb24taWQ9XCIke2luZGV4fVwiIGNsYXNzPVwidmlkZW8tanNcIiBpZD1cIiR7ZGF0YS5pZH1cIiBjb250cm9scyAke2RhdGEuYXV0b30+PC92aWRlbz48L2Rpdj5gO1xyXG4gICAgaWYgKGRhdGEudHJhbnNjcmlwdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGh0bWwgKz0gYDxkaXYgY2xhc3M9XCJ2aWRlby10cmFuc2NyaXB0XCI+PGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIiR7ZGF0YS50cmFuc2NyaXB0fVwiPiR7dHJhbnNjcmlwdFRleHRbaWcubGFuZ119PC9hPjwvZGl2PmA7XHJcbiAgICB9XHJcbiAgICBodG1sICs9IGA8L2Rpdj48aDIgY2xhc3M9XCJ2aWRlby10aXRsZSAke2RhdGEuaWR9XCI+JHtkYXRhLnRpdGxlfTwvaDI+PHAgY2xhc3M9XCJ2aWRlby1kZXNjcmlwdGlvblwiPiR7ZGF0YS5kZXNjcmlwdGlvbn08L3A+YDtcclxuICAgICR2aWRlbyA9ICR2aWRlby5yZXBsYWNlV2l0aChodG1sKTtcclxuXHJcbiAgICBpZiAoZGF0YS5vdmVybGF5KSB7XHJcbiAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcjJyArIGRhdGEuaWQsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcudmlkZW8tb3ZlcmxheScpLmhpZGUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfaW5qZWN0SWZyYW1lKGRhdGEpIHtcclxuICAgIHZhciBodG1sID0gYDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lci1yZXNwb25zaXZlXCI+XHJcbiAgICAgIDxpZnJhbWUgY2xhc3M9XCJ2aWRlby1qc1wiIHNyYz0nLy9wbGF5ZXJzLmJyaWdodGNvdmUubmV0LzM5MDY5NDI4NjEwMDEvJHtkYXRhLnBsYXllcn1fZGVmYXVsdC9pbmRleC5odG1sP3ZpZGVvSWQ9JHtkYXRhLmlkfSdcclxuICAgIGFsbG93ZnVsbHNjcmVlbiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8L2Rpdj48aDIgY2xhc3M9XCJ2aWRlby10aXRsZSAke2RhdGEuaWR9XCI+JHtkYXRhLnRpdGxlfTwvaDI+PHAgY2xhc3M9XCJ2aWRlby1kZXNjcmlwdGlvblwiPiR7ZGF0YS5kZXNjcmlwdGlvbn08L3A+YDtcclxuICAgICR2aWRlbyA9ICR2aWRlby5yZXBsYWNlV2l0aChodG1sKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGluamVjdEJyaWdodENvdmVKUyhkYXRhKSB7XHJcbiAgICB2YXIgaW5kZXhqcyA9IGA8c2NyaXB0IHNyYz1cIi8vcGxheWVycy5icmlnaHRjb3ZlLm5ldC8zOTA2OTQyODYxMDAxLyR7ZGF0YS5wbGF5ZXJ9X2RlZmF1bHQvaW5kZXgubWluLmpzXCI+PC9zY3JpcHQ+YDtcclxuICAgICQoJ2JvZHknKS5hcHBlbmQoaW5kZXhqcyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYnJpZ2h0Q292ZVJlYWR5KCkge1xyXG4gICAgdmFyIHBsYXllcjtcclxuICAgIHZpZGVvSURzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgIHZpZGVvanMoJyMnICsgZWwpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBhc3NpZ24gdGhpcyBwbGF5ZXIgdG8gYSB2YXJpYWJsZVxyXG4gICAgICAgIHBsYXllciA9IHRoaXM7XHJcbiAgICAgICAgLy8gYXNzaWduIGFuIGV2ZW50IGxpc3RlbmVyIGZvciBwbGF5IGV2ZW50XHJcbiAgICAgICAgcGxheWVyLm9uKCdwbGF5JywgX29uUGxheSk7XHJcbiAgICAgICAgLy8gYXNzaWduIGFuIGV2ZW50IGxpc3RlbmVyIGZvciBlbmRlZCBldmVudFxyXG4gICAgICAgIHBsYXllci5vbignZW5kZWQnLCBfb25Db21wbGV0ZSk7XHJcbiAgICAgICAgLy8gcHVzaCB0aGUgcGxheWVyIHRvIHRoZSBwbGF5ZXJzIGFycmF5XHJcbiAgICAgICAgcGxheWVycy5wdXNoKHBsYXllcik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfb25QbGF5KGUpIHtcclxuICAgIC8vIEFkb2JlIEFuYWx5dGljc1xyXG4gICAgaWYgKCEkKCcuJyArIGUudGFyZ2V0LmlkKS5oYXNDbGFzcygncGxheWVkJykpIHtcclxuICAgICAgJCgnLicgKyBlLnRhcmdldC5pZCkuYWRkQ2xhc3MoJ3BsYXllZCcpO1xyXG4gICAgICB3aW5kb3cuZGlnaXRhbERhdGEuZXZlbnQuaWQgPSBlLnRhcmdldC5pZDtcclxuICAgICAgd2luZG93LmRpZ2l0YWxEYXRhLmV2ZW50LnRpdGxlID0gX3JldHJpZXZlVGl0bGUoZS50YXJnZXQuaWQpO1xyXG4gICAgICBfc2F0ZWxsaXRlLnRyYWNrKCd2aWRlb19zdGFydCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRldGVybWluZSB3aGljaCBwbGF5ZXIgdGhlIGV2ZW50IGlzIGNvbWluZyBmcm9tXHJcbiAgICB2YXIgaWQgPSBlLnRhcmdldC5pZDtcclxuICAgIC8vIGdvIHRocm91Z2ggcGxheWVyc1xyXG4gICAgcGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIpIHtcclxuICAgICAgaWYgKHBsYXllci5pZCgpICE9PSBpZCkge1xyXG4gICAgICAgIC8vIHBhdXNlIHRoZSBvdGhlciBwbGF5ZXIocylcclxuICAgICAgICB2aWRlb2pzKHBsYXllci5pZCgpKS5wYXVzZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9vbkNvbXBsZXRlKGUpIHtcclxuICAgIC8vIEFkb2JlIEFuYWx5dGljc1xyXG4gICAgd2luZG93LmRpZ2l0YWxEYXRhLmV2ZW50LmlkID0gZS50YXJnZXQuaWQ7XHJcbiAgICB3aW5kb3cuZGlnaXRhbERhdGEuZXZlbnQudGl0bGUgPSBfcmV0cmlldmVUaXRsZShlLnRhcmdldC5pZCk7XHJcbiAgICBfc2F0ZWxsaXRlLnRyYWNrKCd2aWRlb19lbmQnKTtcclxuXHJcbiAgICAkKCcuJyArIGUudGFyZ2V0LmlkKS5hZGRDbGFzcygnY29tcGxldGUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF92aWV3U3RhdHVzKCkge1xyXG4gICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHBsYXllcnMuZm9yRWFjaChmdW5jdGlvbiAocGxheWVyKSB7XHJcbiAgICAgICAgaWYgKCEkKCcjJyArIHBsYXllci5pZCgpKS52aXNpYmxlKCkpIHtcclxuICAgICAgICAgIHZpZGVvanMocGxheWVyLmlkKCkpLnBhdXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3JldHJpZXZlVGl0bGUoaWQpIHtcclxuICAgIHJldHVybiAkKCcudmlkZW8tdGl0bGUuJyArIGlkKS5maXJzdCgpLnRleHQoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0LFxyXG4gIH07XHJcbn0pKHdpbmRvdyk7XHJcbiIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBfc2VhcmNoTGVnYWN5Q29kZSgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3NlYXJjaExlZ2FjeUNvZGUoKSB7XHJcblxyXG4gICAgLy8gR0xPQkFMU1xyXG4gICAgdmFyIG1vZGVsVXJsID0gJ2h0dHBzOi8vc2VhcmNoLmludmVzdG9yc2dyb3VwLmNvbS9hcGkvY3dwc2VhcmNoPyc7XHJcbiAgICB2YXIgJGZpZWxkID0gJCgnI0ZpbmRBbk9mZmljZScpO1xyXG4gICAgdmFyIGxhbmcgPSAnZW4nO1xyXG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJy9mci8nKSA+IC0xKSB7XHJcbiAgICAgIGxhbmcgPSAnZnInO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFByb2Nlc3MgdGhlIGxvY2FsIHByZWZldGNoZWQgZGF0YVxyXG4gICAgdmFyIHN1Z2dlc3Rpb25zID0ge307XHJcbiAgICB2YXIgY2l0aWVzID0gW1xyXG4gICAgICBcImF0aGFiYXNjYVwiLFxyXG4gICAgICBcImJsdWZmdG9uXCIsXHJcbiAgICAgIFwiYm9ubnl2aWxsZVwiLFxyXG4gICAgICBcImJyb29rc1wiLFxyXG4gICAgICBcImNhbGdhcnlcIixcclxuICAgICAgXCJjYW1yb3NlXCIsXHJcbiAgICAgIFwiY2FubW9yZVwiLFxyXG4gICAgICBcImRyYXl0b24gdmFsbGV5XCIsXHJcbiAgICAgIFwiZWRtb250b25cIixcclxuICAgICAgXCJmb3J0IG1jbXVycmF5XCIsXHJcbiAgICAgIFwiZm9ydCBzYXNrYXRjaGV3YW5cIixcclxuICAgICAgXCJncmFuZGUgcHJhaXJpZVwiLFxyXG4gICAgICBcImhhbGtpcmtcIixcclxuICAgICAgXCJoaWxsY3Jlc3QgbWluZXNcIixcclxuICAgICAgXCJoaW50b25cIixcclxuICAgICAgXCJsZWR1Y1wiLFxyXG4gICAgICBcImxldGhicmlkZ2VcIixcclxuICAgICAgXCJsbG95ZG1pbnN0ZXJcIixcclxuICAgICAgXCJtZWRpY2luZSBoYXRcIixcclxuICAgICAgXCJtb3JpbnZpbGxlXCIsXHJcbiAgICAgIFwicGVhY2Ugcml2ZXJcIixcclxuICAgICAgXCJwaW5jaGVyIGNyZWVrXCIsXHJcbiAgICAgIFwicHJvdm9zdFwiLFxyXG4gICAgICBcInJlZCBkZWVyXCIsXHJcbiAgICAgIFwic2hlcndvb2QgcGFya1wiLFxyXG4gICAgICBcInNwcnVjZSBncm92ZVwiLFxyXG4gICAgICBcInN0LiBhbGJlcnRcIixcclxuICAgICAgXCJzdGV0dGxlclwiLFxyXG4gICAgICBcInN0dXJnZW9uIGNvdW50eVwiLFxyXG4gICAgICBcInRvZmllbGRcIixcclxuICAgICAgXCJ2ZXJtaWxpb25cIixcclxuICAgICAgXCJ3YWlud3JpZ2h0XCIsXHJcbiAgICAgIFwid2VzdGxvY2tcIixcclxuICAgICAgXCJ3aGl0ZWxhd1wiLFxyXG4gICAgICBcImFiYm90c2ZvcmRcIixcclxuICAgICAgXCJicmFja2VuZGFsZVwiLFxyXG4gICAgICBcImJ1cm5hYnlcIixcclxuICAgICAgXCJidXJucyBsYWtlXCIsXHJcbiAgICAgIFwiY2FtcGJlbGwgcml2ZXJcIixcclxuICAgICAgXCJjaGFzZVwiLFxyXG4gICAgICBcImNoaWxsaXdhY2tcIixcclxuICAgICAgXCJjb21veFwiLFxyXG4gICAgICBcImNvcXVpdGxhbVwiLFxyXG4gICAgICBcImNvdXJ0ZW5heVwiLFxyXG4gICAgICBcImNyYW5icm9va1wiLFxyXG4gICAgICBcImRhd3NvbiBjcmVla1wiLFxyXG4gICAgICBcImR1bmNhblwiLFxyXG4gICAgICBcImZvcnQgbmVsc29uXCIsXHJcbiAgICAgIFwiZm9ydCBzdC4gam9oblwiLFxyXG4gICAgICBcImludmVybWVyZVwiLFxyXG4gICAgICBcImthbWxvb3BzXCIsXHJcbiAgICAgIFwia2Vsb3duYVwiLFxyXG4gICAgICBcImxhbmdsZXlcIixcclxuICAgICAgXCJtZXJyaXR0XCIsXHJcbiAgICAgIFwibmFuYWltb1wiLFxyXG4gICAgICBcIm5lbHNvblwiLFxyXG4gICAgICBcIm5vcnRoIHZhbmNvdXZlclwiLFxyXG4gICAgICBcIm9saXZlclwiLFxyXG4gICAgICBcInBlbnRpY3RvblwiLFxyXG4gICAgICBcInBvcnQgYWxiZXJuaVwiLFxyXG4gICAgICBcInBvd2VsbCByaXZlclwiLFxyXG4gICAgICBcInByaW5jZSBnZW9yZ2VcIixcclxuICAgICAgXCJxdWFsaWN1bSBiZWFjaFwiLFxyXG4gICAgICBcInF1ZXNuZWxcIixcclxuICAgICAgXCJyZXZlbHN0b2tlXCIsXHJcbiAgICAgIFwicmljaG1vbmRcIixcclxuICAgICAgXCJzYWFuaWNodG9uXCIsXHJcbiAgICAgIFwic2FsbW9uIGFybVwiLFxyXG4gICAgICBcInNhbHQgc3ByaW5nIGlzbGFuZFwiLFxyXG4gICAgICBcInNlY2hlbHRcIixcclxuICAgICAgXCJzaWRuZXlcIixcclxuICAgICAgXCJzbWl0aGVyc1wiLFxyXG4gICAgICBcInN1cnJleVwiLFxyXG4gICAgICBcInRlcnJhY2VcIixcclxuICAgICAgXCJ0cmFpbFwiLFxyXG4gICAgICBcInZhbmNvdXZlclwiLFxyXG4gICAgICBcInZlcm5vblwiLFxyXG4gICAgICBcInZpY3RvcmlhXCIsXHJcbiAgICAgIFwid2VzdGJhbmtcIixcclxuICAgICAgXCJ3aWxsaWFtcyBsYWtlXCIsXHJcbiAgICAgIFwiYnJhbmRvblwiLFxyXG4gICAgICBcImRhdXBoaW5cIixcclxuICAgICAgXCJmbGluIGZsb25cIixcclxuICAgICAgXCJnaWxsYW1cIixcclxuICAgICAgXCJraWxsYXJuZXlcIixcclxuICAgICAgXCJtYW5pdG91XCIsXHJcbiAgICAgIFwibWlhbWlcIixcclxuICAgICAgXCJtb3JkZW5cIixcclxuICAgICAgXCJuYXJvbFwiLFxyXG4gICAgICBcInBvcnRhZ2UgbGEgcHJhaXJpZVwiLFxyXG4gICAgICBcInNlbGtpcmtcIixcclxuICAgICAgXCJzd2FuIHJpdmVyXCIsXHJcbiAgICAgIFwidGhlIHBhc1wiLFxyXG4gICAgICBcInZpcmRlblwiLFxyXG4gICAgICBcIndhcnJlblwiLFxyXG4gICAgICBcIndpbm5pcGVnXCIsXHJcbiAgICAgIFwiYmF0aHVyc3RcIixcclxuICAgICAgXCJiZWRlbGxcIixcclxuICAgICAgXCJlZG11bmRzdG9uXCIsXHJcbiAgICAgIFwiZnJlZGVyaWN0b25cIixcclxuICAgICAgXCJsYW5zZG93bmVcIixcclxuICAgICAgXCJtaXJhbWljaGlcIixcclxuICAgICAgXCJtb25jdG9uXCIsXHJcbiAgICAgIFwicXVpc3BhbXNpc1wiLFxyXG4gICAgICBcInJleHRvblwiLFxyXG4gICAgICBcInJvdGhlc2F5XCIsXHJcbiAgICAgIFwic2FpbnQgam9oblwiLFxyXG4gICAgICBcInNhaW50IHBhdWxcIixcclxuICAgICAgXCJzdXNzZXhcIixcclxuICAgICAgXCJibGFrZXRvd25cIixcclxuICAgICAgXCJjbGFyZW52aWxsZVwiLFxyXG4gICAgICBcImNvcm5lciBicm9va1wiLFxyXG4gICAgICBcImdhbmRlclwiLFxyXG4gICAgICBcImdyYW5kIGZhbGxzIC0gd2luZHNvclwiLFxyXG4gICAgICBcIm1hcnlzdG93blwiLFxyXG4gICAgICBcInJvYWNoZXMgbGluZVwiLFxyXG4gICAgICBcInN0LiBqb2huJ3NcIixcclxuICAgICAgXCJ0cmluaXR5XCIsXHJcbiAgICAgIFwiYW1oZXJzdFwiLFxyXG4gICAgICBcImFudGlnb25pc2hcIixcclxuICAgICAgXCJiYXJyaW5ndG9uIHBhc3NhZ2VcIixcclxuICAgICAgXCJiZWxsaXZlYXUgY292ZVwiLFxyXG4gICAgICBcImJyaWRnZXRvd25cIixcclxuICAgICAgXCJicmlkZ2V3YXRlclwiLFxyXG4gICAgICBcImRhcnRtb3V0aFwiLFxyXG4gICAgICBcImRheXRvblwiLFxyXG4gICAgICBcImhhbGlmYXhcIixcclxuICAgICAgXCJtaWRkbGV0b25cIixcclxuICAgICAgXCJuZXcgZ2xhc2dvd1wiLFxyXG4gICAgICBcIm5ldyBtaW5hc1wiLFxyXG4gICAgICBcIm5vcnRoIHN5ZG5leVwiLFxyXG4gICAgICBcInBpY3RvdVwiLFxyXG4gICAgICBcInBvcnQgaGF3a2VzYnVyeVwiLFxyXG4gICAgICBcInN5ZG5leVwiLFxyXG4gICAgICBcInRydXJvXCIsXHJcbiAgICAgIFwieWVsbG93a25pZmVcIixcclxuICAgICAgXCJhamF4XCIsXHJcbiAgICAgIFwiYWxnb25xdWluIGhpZ2hsYW5kc1wiLFxyXG4gICAgICBcImFuY2FzdGVyXCIsXHJcbiAgICAgIFwiYXRpa29rYW5cIixcclxuICAgICAgXCJiYXJyaWVcIixcclxuICAgICAgXCJiZWxsZXZpbGxlXCIsXHJcbiAgICAgIFwiYm93bWFudmlsbGVcIixcclxuICAgICAgXCJicmFjZWJyaWRnZVwiLFxyXG4gICAgICBcImJyYW1wdG9uXCIsXHJcbiAgICAgIFwiYnJhbnRmb3JkXCIsXHJcbiAgICAgIFwiYnJvY2t2aWxsZVwiLFxyXG4gICAgICBcImJyb29rbGluXCIsXHJcbiAgICAgIFwiYnVybGluZ3RvblwiLFxyXG4gICAgICBcImNhbWJyaWRnZVwiLFxyXG4gICAgICBcImNhcmxldG9uIHBsYWNlXCIsXHJcbiAgICAgIFwiY2hhdGhhbVwiLFxyXG4gICAgICBcImNsYXl0b25cIixcclxuICAgICAgXCJjbGludG9uXCIsXHJcbiAgICAgIFwiY29ib3VyZ1wiLFxyXG4gICAgICBcImNvbGxpbmd3b29kXCIsXHJcbiAgICAgIFwiY29uY29yZFwiLFxyXG4gICAgICBcImNvcm53YWxsXCIsXHJcbiAgICAgIFwiZHJ5ZGVuXCIsXHJcbiAgICAgIFwiZHVuZGFzXCIsXHJcbiAgICAgIFwiZHVuc2ZvcmRcIixcclxuICAgICAgXCJkdXR0b25cIixcclxuICAgICAgXCJlbGxpb3QgbGFrZVwiLFxyXG4gICAgICBcImV0b2JpY29rZVwiLFxyXG4gICAgICBcImZvcnQgZnJhbmNlc1wiLFxyXG4gICAgICBcImdhbmFub3F1ZVwiLFxyXG4gICAgICBcImdhcnNvblwiLFxyXG4gICAgICBcImdyZWVseVwiLFxyXG4gICAgICBcImdyaW1zYnlcIixcclxuICAgICAgXCJndWVscGhcIixcclxuICAgICAgXCJoYWlsZXlidXJ5XCIsXHJcbiAgICAgIFwiaGFtaWx0b25cIixcclxuICAgICAgXCJoYW5vdmVyXCIsXHJcbiAgICAgIFwiaGVhcnN0XCIsXHJcbiAgICAgIFwiaHVudHN2aWxsZVwiLFxyXG4gICAgICBcImplcnNleXZpbGxlXCIsXHJcbiAgICAgIFwia2FuYXRhXCIsXHJcbiAgICAgIFwia2FwdXNrYXNpbmdcIixcclxuICAgICAgXCJrZW5vcmFcIixcclxuICAgICAgXCJraW5nc3RvblwiLFxyXG4gICAgICBcImtpcmtsYW5kIGxha2VcIixcclxuICAgICAgXCJraXRjaGVuZXJcIixcclxuICAgICAgXCJsYW5ndG9uXCIsXHJcbiAgICAgIFwibGluZHNheVwiLFxyXG4gICAgICBcImxvbmRvblwiLFxyXG4gICAgICBcIm1hcGxlXCIsXHJcbiAgICAgIFwibWFyYXRob25cIixcclxuICAgICAgXCJtYXJraGFtXCIsXHJcbiAgICAgIFwibWVycmlja3ZpbGxlXCIsXHJcbiAgICAgIFwibWlsdG9uXCIsXHJcbiAgICAgIFwibWluZGVuXCIsXHJcbiAgICAgIFwibWlzc2lzc2F1Z2FcIixcclxuICAgICAgXCJtb3VudCBmb3Jlc3RcIixcclxuICAgICAgXCJtb3VudCBob3BlXCIsXHJcbiAgICAgIFwibmVwZWFuXCIsXHJcbiAgICAgIFwibmV3IGxpc2tlYXJkXCIsXHJcbiAgICAgIFwibmV3bWFya2V0XCIsXHJcbiAgICAgIFwibmlhZ2FyYSBmYWxsc1wiLFxyXG4gICAgICBcIm5vcnRoIGJheVwiLFxyXG4gICAgICBcIm5vcnRoIHlvcmtcIixcclxuICAgICAgXCJvYWsgcmlkZ2VzXCIsXHJcbiAgICAgIFwib2FrdmlsbGVcIixcclxuICAgICAgXCJvcmFuZ2V2aWxsZVwiLFxyXG4gICAgICBcIm9yaWxsaWFcIixcclxuICAgICAgXCJvcnRvblwiLFxyXG4gICAgICBcIm9zaGF3YVwiLFxyXG4gICAgICBcIm90dGF3YVwiLFxyXG4gICAgICBcIm93ZW4gc291bmRcIixcclxuICAgICAgXCJwYXJyeSBzb3VuZFwiLFxyXG4gICAgICBcInBlbWJyb2tlXCIsXHJcbiAgICAgIFwicGVuZXRhbmd1aXNoZW5lXCIsXHJcbiAgICAgIFwicGVydGhcIixcclxuICAgICAgXCJwZXRlcmJvcm91Z2hcIixcclxuICAgICAgXCJwZXRyb2xpYVwiLFxyXG4gICAgICBcInBpY2tlcmluZ1wiLFxyXG4gICAgICBcInJlZCBsYWtlXCIsXHJcbiAgICAgIFwicmlkZ2V0b3duXCIsXHJcbiAgICAgIFwic2FybmlhXCIsXHJcbiAgICAgIFwic2F1bHQgc3RlLiBtYXJpZVwiLFxyXG4gICAgICBcInNjYXJib3JvdWdoXCIsXHJcbiAgICAgIFwic2NocmVpYmVyXCIsXHJcbiAgICAgIFwic2ltY29lXCIsXHJcbiAgICAgIFwic2lvdXggbG9va291dFwiLFxyXG4gICAgICBcInN0LiBjYXRoYXJpbmVzXCIsXHJcbiAgICAgIFwic3QuIG1hcnlzXCIsXHJcbiAgICAgIFwic3RvdWZmdmlsbGVcIixcclxuICAgICAgXCJzdHJhdGZvcmRcIixcclxuICAgICAgXCJzdHVyZ2VvbiBmYWxsc1wiLFxyXG4gICAgICBcInN1ZGJ1cnlcIixcclxuICAgICAgXCJzdW5kcmlkZ2VcIixcclxuICAgICAgXCJ0aHVuZGVyIGJheVwiLFxyXG4gICAgICBcInRpbGxzb25idXJnXCIsXHJcbiAgICAgIFwidGltbWluc1wiLFxyXG4gICAgICBcInRvcm9udG9cIixcclxuICAgICAgXCJ0cmVudG9uXCIsXHJcbiAgICAgIFwiVXhicmlkZ2VcIixcclxuICAgICAgXCJ2YWwgY2Fyb25cIixcclxuICAgICAgXCJ3YWxrZXJ0b25cIixcclxuICAgICAgXCJ3YXRlcmxvb1wiLFxyXG4gICAgICBcIndlbGxhbmRcIixcclxuICAgICAgXCJ3aGl0YnlcIixcclxuICAgICAgXCJ3aWxsb3dkYWxlXCIsXHJcbiAgICAgIFwid2luZHNvclwiLFxyXG4gICAgICBcIndpbmdoYW1cIixcclxuICAgICAgXCJ3b29kYnJpZGdlXCIsXHJcbiAgICAgIFwiY2hhcmxvdHRldG93biwgcGVcIixcclxuICAgICAgXCJzb3VyaXMsIHBlXCIsXHJcbiAgICAgIFwic3VtbWVyc2lkZSwgcGVcIixcclxuICAgICAgXCJ3ZWxsaW5ndG9uXCIsXHJcbiAgICAgIFwiYW5qb3VcIixcclxuICAgICAgXCJib2lzYnJpYW5kXCIsXHJcbiAgICAgIFwiYm91Y2hlcnZpbGxlXCIsXHJcbiAgICAgIFwiYnJvc3NhcmRcIixcclxuICAgICAgXCJjaMOidGVhdWd1YXlcIixcclxuICAgICAgXCJjaGljb3V0aW1pXCIsXHJcbiAgICAgIFwiY8O0dGUgc2FpbnQtbHVjXCIsXHJcbiAgICAgIFwiZG9sbGFyZC1kZXMtb3JtZWF1eFwiLFxyXG4gICAgICBcImdhdGluZWF1XCIsXHJcbiAgICAgIFwiZ3JhbmJ5XCIsXHJcbiAgICAgIFwibGF2YWxcIixcclxuICAgICAgXCJsw6l2aXNcIixcclxuICAgICAgXCJtaXJhYmVsXCIsXHJcbiAgICAgIFwibW9udHJlYWxcIixcclxuICAgICAgXCJuZXcgcmljaG1vbmRcIixcclxuICAgICAgXCJwb2ludGUtY2xhaXJlXCIsXHJcbiAgICAgIFwicXXDqWJlY1wiLFxyXG4gICAgICBcInNlcHQtaWxlc1wiLFxyXG4gICAgICBcInNoZXJicm9va2VcIixcclxuICAgICAgXCJ2aWxsZSBzdC1sYXVyZW50XCIsXHJcbiAgICAgIFwid2VzdG1vdW50XCIsXHJcbiAgICAgIFwiZWFzdGVuZFwiLFxyXG4gICAgICBcImVzdGV2YW5cIixcclxuICAgICAgXCJlc3RlcmhhenlcIixcclxuICAgICAgXCJmb2FtIGxha2VcIixcclxuICAgICAgXCJodW1ib2xkdFwiLFxyXG4gICAgICBcImtpbmRlcnNsZXlcIixcclxuICAgICAgXCJsZWFkZXJcIixcclxuICAgICAgXCJtYXBsZSBjcmVla1wiLFxyXG4gICAgICBcIm1lYWRvdyBsYWtlXCIsXHJcbiAgICAgIFwibWVsZm9ydFwiLFxyXG4gICAgICBcIm1lbHZpbGxlXCIsXHJcbiAgICAgIFwibW9vc2UgamF3XCIsXHJcbiAgICAgIFwibm9ydGggYmF0dGxlZm9yZFwiLFxyXG4gICAgICBcIm91dGxvb2tcIixcclxuICAgICAgXCJveGJvd1wiLFxyXG4gICAgICBcInByaW5jZSBhbGJlcnRcIixcclxuICAgICAgXCJyZWdpbmFcIixcclxuICAgICAgXCJyZWdpbmEgYmVhY2hcIixcclxuICAgICAgXCJyb3NldG93blwiLFxyXG4gICAgICBcInNhc2thdG9vblwiLFxyXG4gICAgICBcInNoZWxsYnJvb2tcIixcclxuICAgICAgXCJzd2lmdCBjdXJyZW50XCIsXHJcbiAgICAgIFwid2F0cm91c1wiLFxyXG4gICAgICBcIndhdHNvblwiLFxyXG4gICAgICBcInlvcmt0b25cIixcclxuICAgICAgXCJ3aGl0ZWhvcnNlXCJcclxuICAgIF07XHJcbiAgICBzdWdnZXN0aW9ucy5sb2NhdGlvbnMgPSBuZXcgQmxvb2Rob3VuZCh7XHJcbiAgICAgIGRhdHVtVG9rZW5pemVyOiBCbG9vZGhvdW5kLnRva2VuaXplcnMud2hpdGVzcGFjZSxcclxuICAgICAgcXVlcnlUb2tlbml6ZXI6IEJsb29kaG91bmQudG9rZW5pemVycy53aGl0ZXNwYWNlLFxyXG4gICAgICBsb2NhbDogY2l0aWVzXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBHZXQgdGhlIHJlc3VsdHNcclxuICAgIGZ1bmN0aW9uIGdldFNlYXJjaFJlc3VsdHMocGFyYW1zKSB7XHJcbiAgICAgIHBhcmFtcy5zZWFyY2h0eXBlID0gJ29mZmljZSc7XHJcbiAgICAgIHBhcmFtcy5uYW1lID0gJyc7XHJcblxyXG4gICAgICAvLyBNYWtlIHN1cmUgZXJyb3IgbWVzc2FnZSBpcyBoaWRkZW4gZWFjaCB0aW1lXHJcbiAgICAgICQoJy56ZXJvLXJlc3VsdHMnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cclxuICAgICAgJC5nZXRKU09OKG1vZGVsVXJsLCBwYXJhbXMpXHJcbiAgICAgICAgLmFsd2F5cygpXHJcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgIHZhciByZXN1bHQgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG5cclxuICAgICAgICAgIC8vIEFkb2JlIEFuYWx5dGljc1xyXG4gICAgICAgICAgd2luZG93LmRpZ2l0YWxEYXRhLmV2ZW50LnNlYXJjaFJlc3VsdHMgPSByZXN1bHQubGVuZ3RoID4gMCA/IHJlc3VsdC5sZW5ndGggOiAwO1xyXG4gICAgICAgICAgd2luZG93LmRpZ2l0YWxEYXRhLmV2ZW50LnNlYXJjaFR5cGUgPSAnY2FyZWVycyc7XHJcbiAgICAgICAgICB3aW5kb3cuZGlnaXRhbERhdGEuZXZlbnQuc2VhcmNoVGVybSA9ICRmaWVsZC52YWwoKTtcclxuICAgICAgICAgIF9zYXRlbGxpdGUudHJhY2soJ3NlYXJjaF9jYXJlZXJzJyk7XHJcblxyXG4gICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdpcy1yZXZlYWwtb3BlbicpO1xyXG4gICAgICAgICAgICAkKCcjc2VhcmNoUmVzdWx0c01vZGFsJykucmVtb3ZlQ2xhc3MoJ2Nsb3NlZCcpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICBkaXNwbGF5U2VhcmNoUmVzdWx0cygnb2ZmaWNlLXRlbXBsYXRlJywgcmVzdWx0KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy56ZXJvLXJlc3VsdHMnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZhaWwoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0RhdGEgY291bGQgbm90IGJlIHJldHJpZXZlZCwgcGxlYXNlIHRyeSBhZ2FpbicsIHJlc3VsdC5zdGF0dXMgKyAnICcgKyByZXN1bHQuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vIEJlY2F1c2Ugd2UgYXJlIG9ubHkgc2VhcmNoaW5nIGZvciBjaXRpZXMsIHRoaXMgZnVuY3Rpb24gaXMgc2xpZ2h0bHkgcmVkdW5kYW50IC0gbGVhdmluZyBpdCBpbiBwbGFjZSBmb3Igbm93XHJcbiAgICBmdW5jdGlvbiBwYXJzZVNlYXJjaFN0cmluZygpIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICB2YXIgc2VhcmNoID0gJGZpZWxkLnZhbCgpO1xyXG5cclxuICAgICAgcmVzdWx0LmNpdHkgPSAnJztcclxuXHJcbiAgICAgIC8vIFNlYXJjaCBpbiB0aGUgbGFuZ3VhZ2Ugb2YgdGhlIHBhZ2VcclxuICAgICAgcmVzdWx0LmxhbmcgPSBsYW5nO1xyXG4gICAgICAvLyBXZSBvbmx5IHNlYXJjaCBjb25zdWx0YW50cyBmcm9tIHRoaXMgbWV0aG9kXHJcbiAgICAgIHJlc3VsdC5zZWFyY2h0eXBlID0gJ2Nvbic7XHJcblxyXG4gICAgICAvLyBDaGVjayB0aGUgc2VhcmNoIHN0cmluZyBmb3IgYSBwcmV2aW91c2x5IGRlZmluZWQgbG9jYXRpb25cclxuICAgICAgdmFyIHdvcmRzID0gc2VhcmNoLnNwbGl0KCcgJyk7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyBDaGVjayBlYWNoIHdvcmQgZm9yIGEgY2l0eSBmcm9tIHRoZSBwcmVkZWZpbmVkIGxpc3RcclxuICAgICAgICB2YXIgY2l0eSA9IHN1Z2dlc3Rpb25zLmxvY2F0aW9ucy5nZXQod29yZHNbaV0pO1xyXG4gICAgICAgIGlmIChjaXR5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJlc3VsdC5jaXR5ID0gY2l0eVswXTtcclxuICAgICAgICAgIHdvcmRzLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghcmVzdWx0LmNpdHkpIHtcclxuICAgICAgICByZXN1bHQuY2l0eSA9IHdvcmRzLmpvaW4oJyAnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkaXNwbGF5U2VhcmNoUmVzdWx0cyh0ZW1wbGF0ZUlELCBqc29uKSB7XHJcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSUQpLmlubmVySFRNTDtcclxuICAgICAgTXVzdGFjaGUucGFyc2UodGVtcGxhdGUpO1xyXG4gICAgICB2YXIgcmVuZGVyZWQgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIGpzb24pO1xyXG4gICAgICAkKCcjc2VhcmNoUmVzdWx0c01vZGFsJykuYXBwZW5kKHJlbmRlcmVkKTtcclxuICAgICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vSW5pdCBldmVyeXRoaW5nXHJcbiAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gVHJ5IHRvIHByZWRldGVybWluZSB3aGF0IHJlc3VsdHMgc2hvdWxkIHNob3dcclxuICAgICAgLy8gU2V0dXAgdGhlIHR5cGVhaGVhZFxyXG4gICAgICAkKCcudHlwZWFoZWFkJykudHlwZWFoZWFkKHtcclxuICAgICAgICBoaWdobGlnaHQ6IHRydWVcclxuICAgICAgfSwge1xyXG4gICAgICAgIG5hbWU6ICdsb2NhdGlvbnMnLFxyXG4gICAgICAgIHNvdXJjZTogc3VnZ2VzdGlvbnMubG9jYXRpb25zLFxyXG4gICAgICAgIGxpbWl0OiAyXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gU2V0dXAgdGhlIGZvcm0gc3VibWlzc2lvblxyXG4gICAgICAkKCcuaWctc2VhcmNoJykuc3VibWl0KGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciBwYXJhbXMgPSBwYXJzZVNlYXJjaFN0cmluZygpO1xyXG4gICAgICAgIGdldFNlYXJjaFJlc3VsdHMocGFyYW1zKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBGYWtlIG1vZGFsIC0gQWRkaW5nIGhhbmRsZXIgb24gZG9jdW1lbnQgc28gaXQgZmlyZXMgZGVzcGl0ZSB0aGUgYnV0dG9uIG5vdCBiZWluZyByZW5kZXJlZCB5ZXRcclxuICAgICAgJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcIiNzZWFyY2hSZXN1bHRzTW9kYWwgLmNsb3NlLWJ1dHRvblwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnI3NlYXJjaFJlc3VsdHNNb2RhbCcpLmFkZENsYXNzKCdjbG9zZWQnKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICB9LCA0MDApO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuXG5cdGxldCBkaXJlY3RDYWxsUnVsZSA9ICdtb2RhbF9jbGljayc7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHQvLyAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmdhLWNhcmVlcnMtY2l0eS1zZWFyY2gsIC5nYS1jYXJlZXJzLWxlYXJuLW1vcmUnLCBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gXHR3aW5kb3cuX3NhdGVsbGl0ZSA9IHdpbmRvdy5fc2F0ZWxsaXRlIHx8IHt9O1xuXHRcdC8vIFx0d2luZG93Ll9zYXRlbGxpdGUudHJhY2sgPSB3aW5kb3cuX3NhdGVsbGl0ZS50cmFjayB8fCBmdW5jdGlvbigpe307XG5cdFx0Ly8gXHRfc2F0ZWxsaXRlLnRyYWNrKGRpcmVjdENhbGxSdWxlKTtcblx0XHQvLyB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuZ2EtY2FyZWVycy1jaXR5LXNlYXJjaCwgLmdhLWNhcmVlcnMtbGVhcm4tbW9yZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgkKCdib2R5LmlzLXJldmVhbC1vcGVuJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHdpbmRvdy5fc2F0ZWxsaXRlID0gd2luZG93Ll9zYXRlbGxpdGUgfHwge307XG4gICAgICAgICAgd2luZG93Ll9zYXRlbGxpdGUudHJhY2sgPSB3aW5kb3cuX3NhdGVsbGl0ZS50cmFjayB8fCBmdW5jdGlvbigpe307XG4gICAgICAgICAgX3NhdGVsbGl0ZS50cmFjayhkaXJlY3RDYWxsUnVsZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIDE1MDApO1xuICAgIH0pO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0XG5cdH07XG59KSgpXG5cblxuIiwiLyogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBmb3Igcm9sbHVwIChodHRwOi8vcm9sbHVwanMub3JnLykgYW5kXHJcbiBlc3NlbnRpb25hbGx5ICdib290c3RyYXBzJyBvdXIgaWcuY29tICdhcHBsaWNhdGlvbicuXHJcblxyXG4gQWxsIG1vZHVsZXMgc2hvdWxkIGJlIGltcG9ydGVkIGhlcmUgc28gdGhhdCB0aGV5IGNhbiBiZSBpbml0aWFsaXplZCBvblxyXG4gYSBjYXNlLWJ5LWNhc2UgYmFzaXMgKG5vdCBhbGwgcGFnZXMgcmVxdWlyZSB0aGUgaW5pdGlhbGl6YXRpb24gb2YgYSBjYXJvdXNlbFxyXG4gZm9yIGluc3RhbmNlKS5cclxuXHJcbiBBbnkgdGFza3Mgb3IgcHJvY2Vzc2VzIHRoYXQgbmVlZCB0byBiZSBpbml0aWF0ZWQgb24gcGFnZSBsb2FkIHNob3VsZCBsaXZlIGluIHRoaXNcclxuIGZpbGUgYXMgd2VsbC4gQW4gaW5jbHVkZWQgZXhhbXBsZSBpcyBhIG1ldGhvZCB0aGF0IGFkZHMgYW4gJ2VuJyBvciAnZnInIGNsYXNzIHRvXHJcbiB0aGUgYm9keSBiYXNlZCBvbiB0aGUgZ2xvYmFsIGxhbmd1YWdlIHZhcmlhYmxlIHRoYXQgd2UgY2FuIHRoZW4gdXNlIHRvIHdyaXRlIGN1c3RvbVxyXG4gc3R5bGVzIGZvciBlYWNoIGxhbmd1YWdlLlxyXG4gKi9cclxuXHJcbi8vIEluaXQgU2F0ZWxsaXRlIGFuZCBldmVudCBvYmplY3Rcclxud2luZG93Ll9zYXRlbGxpdGUgPSB3aW5kb3cuX3NhdGVsbGl0ZSB8fCB7fTtcclxud2luZG93Ll9zYXRlbGxpdGUudHJhY2sgPSB3aW5kb3cuX3NhdGVsbGl0ZS50cmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcclxud2luZG93LmRpZ2l0YWxEYXRhLmV2ZW50ID0ge307XHJcblxyXG5pbXBvcnQgZm9ybXMgZnJvbSAnLi9mb3Jtcy5qcyc7XHJcbmltcG9ydCBjYXJvdXNlbCBmcm9tICcuL2Nhcm91c2VsLmpzJztcclxuaW1wb3J0IGNhcmVlcnMgZnJvbSAnLi9jYXJlZXJzLmpzJztcclxuaW1wb3J0IHZpZGVvIGZyb20gJy4vdmlkZW8uanMnO1xyXG5pbXBvcnQgc2VhcmNoIGZyb20gJy4vc2VhcmNoLmpzJztcclxuaW1wb3J0IG1vZGFsIGZyb20gJy4vbW9kYWwuanMnO1xyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5jb25zdCBhcHAgPSAoKCkgPT4ge1xyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBGb3VuZGF0aW9uXHJcbiAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XHJcblxyXG4gICAgLy8gQ2hlY2sgZm9yIGNvbXBvbmVudHNcclxuICAgIGlmICgkKCcuaWctZm9ybScpLmxlbmd0aCkgZm9ybXMuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1jYXJvdXNlbCcpLmxlbmd0aCkgY2Fyb3VzZWwuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1zZWFyY2gnKS5sZW5ndGgpIHNlYXJjaC5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmlnLWNhcmVlcnMnKS5sZW5ndGgpIGNhcmVlcnMuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy12aWRlby1ncm91cCcpLmxlbmd0aCkgdmlkZW8uaW5pdCgpO1xyXG4gICAgLy8gRm9sbG93aW5nIGlzIG9ubHkgZm9yIEFkb2JlIEFuYWx5dGljc1xyXG4gICAgbW9kYWwuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9XHJcbn0pKCk7XHJcblxyXG4vLyBCb290c3RyYXAgYXBwXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICBhcHAuaW5pdCgpO1xyXG59KTsiXSwibmFtZXMiOlsibGFuZyIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJpbmRleE9mIiwib2xkSUUiLCJlbmRwb2ludFVSTCIsInN1Y2Nlc3NVUkwiLCJjYW5jZWxVUkwiLCIkZm9ybSIsIiRmb3JtV3JhcHBlciIsImluaXQiLCIkIiwiZmluZCIsImRhdGEiLCJfdmFsaWRhdGlvbiIsImpJbnB1dCIsImNoYW5nZSIsIm9iakV2ZW50IiwiYWRkQ2xhc3MiLCJ2YWxpZGF0b3IiLCJzZXREZWZhdWx0cyIsImFkZE1ldGhvZCIsInBvc3RhbCIsImVsZW1lbnQiLCJvcHRpb25hbCIsIm1hdGNoIiwidmFsaWRhdGUiLCJsYWJlbCIsImNsb3Nlc3QiLCJsZW5ndGgiLCJwYXJlbnQiLCJhcHBlbmQiLCJvbiIsInJlcGxhY2UiLCJfcHJvY2VzcyIsImZvcm0iLCJmb3JtRGF0YVJhdyIsImZvcm1EYXRhUGFyc2VkIiwidmFsaWQiLCJyZW1vdmVDbGFzcyIsInNlcmlhbGl6ZUFycmF5IiwiX3BhcnNlIiwiX3N1Ym1pdCIsImFqYXgiLCJzdWNjZXNzIiwibXNnIiwiZXJyb3IiLCJ0byIsIl90b2dnbGVyIiwiaGlkZSIsInNob3ciLCJsb2ciLCJ0b2dnbGVDbGFzcyIsIl9idWlsZENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiJGNhcm91c2VsIiwiZWFjaCIsImluZGV4Iiwic2xpY2siLCJfY2FyZWVyc0xlZ2FjeUNvZGUiLCJmbiIsImluZm9Ub2dnbGUiLCIkcmV2ZWFsIiwiJHJldmVhbENvbnRlbnQiLCIkcmV2ZWFsVHJpZ2dlciIsImZpeGVkSGVpZ2h0Iiwic2V0QXJpYSIsImF0dHIiLCJpbml0VG9nZ2xlIiwiaGFuZGxlUmV2ZWFsVG9nZ2xlIiwicmVzaXplSGFuZGxlciIsInNldFRpbWVvdXQiLCJzZXRSZXZlYWxDb250ZW50SGVpZ2h0IiwiY3NzIiwiaGVpZ2h0IiwiZmluYWxIZWlnaHQiLCJoYXNDbGFzcyIsInNjcm9sbEhlaWdodCIsImpRdWVyeSIsImNpcmNsZUFuaW1hdGlvbiIsIm1heFZhbHVlIiwiY2FudmFzIiwiJGNhbnZhcyIsImNvbnRleHQiLCJkIiwid2lkdGgiLCJwZXJjZW50U3Ryb2tlIiwicmVtYWluaW5nU3Ryb2tlIiwicmFkaXVzIiwiY3VyUGVyYyIsImNpcmMiLCJNYXRoIiwiUEkiLCJxdWFydCIsImRlbGVnYXRlSUQiLCJEYXRlIiwiZ2V0VGltZSIsImlzIiwiZ2V0Q29udGV4dCIsInN0cm9rZVN0eWxlIiwiZmlsbFN0eWxlIiwiZGVsZWdhdGUiLCJjbGVhciIsImFuaW1hdGUiLCJjdXJyZW50IiwibGluZVdpZHRoIiwiYmVnaW5QYXRoIiwiYXJjIiwibWluIiwic3Ryb2tlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiZmlsbFJlY3QiLCJibG9ja0xpbmsiLCIkYmxvY2tMaW5rIiwiZGVzdGluYXRpb24iLCJpbml0QmxvY2siLCJoYW5kbGVDbGljayIsImd1aSIsInZpZGVvIiwib3ZlcmxheSIsImluaXRMZWdhY3kiLCJPdmVybGF5TW9kdWxlIiwiR3VpTW9kdWxlIiwiZSIsInRhcmdldCIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcCIsIm9mZnNldCIsInRvcCIsInNlbGVjdG9yIiwicmVzaXplIiwib3ZlcmxheVJlZmVyZW5jZSIsIm11bHRpVGFiVG9nZ2xlU2VsZWN0b3IiLCJtdWx0aVRhYkNvbnRlbnRTZWxlY3RvciIsIm11bHRpVGFiU2VsZWN0b3IiLCIkZWRnZU92ZXJsYXlMb2NhdGlvbiIsIiRvdmVybGF5U2xpZGVyIiwiJHByb2ZpbGVTbGlkZXIiLCIkcHJvZmlsZVNsaWRlclZpZGVvU2VjdGlvbkhvbGRlciIsIndpbmRvd1NpemluZ0RlbGF5Iiwid2luZG93U2Nyb2xsaW5nRGVsYXkiLCJvdmVybGF5T3BlbiIsImlzUmVzcG9uc2l2ZVN0YXRlIiwic2Nyb2xsZWRUb1ZpZXciLCJpbml0R3VpIiwiZXZlbnQiLCJ0cmFjayIsImJhY2tncm91bmRDb2xvciIsIiR0aGlzIiwicGFyc2VJbnQiLCJodG1sIiwiaGFuZGxlT3ZlcmxheUZyb21IYXNoIiwiZGVsYXllZEhhbmRsZVdpbmRvd1NpemluZyIsImRlbGF5ZWRIYW5kbGVXaW5kb3dTY3JvbGwiLCJ0cmlnZ2VyIiwic3RvcFByb3BhZ2F0aW9uIiwiYWRkTXVsdGlUYWJUb2dnbGVIYW5kbGVycyIsInRvZ2dsZUJhc2UiLCIkY29udGFpbmVyIiwicGFyZW50cyIsImFuaW1hdGVQcm9maWxlU2xpZGVyIiwiJHByb2ZpbGVQYW5lbHMiLCJwcm9maWxlUGFuZWxIZWlnaHQiLCJvdXRlckhlaWdodCIsImNoYW5nZVNsaWRlclN0YXRlIiwic2xpZGVyIiwic3RhdGUiLCJjbGVhclRpbWVvdXQiLCJoYW5kbGVXaW5kb3dTaXppbmciLCJoYW5kbGVXaW5kb3dTY3JvbGxpbmciLCJmdWxsSGFzaEZyYWdtZW50IiwiaGFzaCIsIm9wZW5PdmVybGF5IiwiaGFuZGxlT3ZlcmxheU9wZW4iLCJoYW5kbGVPdmVybGF5Q2xvc2UiLCJpbml0aWFsSW5kZXgiLCJoYW5kbGVTbGlkZUNoYW5nZSIsInlQb3MiLCJvdmVybGF5Q29udGVudCIsIm9mZiIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJkb2N1bWVudCIsInRpdGxlIiwic2VhcmNoIiwic2Nyb2xsVG9wIiwiY3VycmVudFNsaWRlIiwibmV4dFNsaWRlIiwibmV4dFRpdGxlIiwiZ2V0IiwibmV3SGFzaCIsIndpbmRvd1dpZHRoIiwicmVzcG9uc2l2ZUxpbWl0IiwibmV3SXNSZXNwb25zaXZlU3RhdGUiLCJpbml0UHJvZmlsZVNsaWRlciIsImluaXRTbGlkZXIiLCJvcHRpb25zIiwiZGVmYXVsdHMiLCJleHRlbmQiLCIkb3ZlcmxheSIsIiRib2R5Iiwib3ZlcmxheVNpemluZ0RlbGF5IiwiY3VycmVudEluc3RhbmNlIiwiaXNPcGVuRmxhZyIsIiRjbG9zZUJ1dHRvbiIsImlzT3BlbiIsImluaXRPdmVybGF5IiwiZGVsYXllZEhhbmRsZU92ZXJsYXlTaXppbmciLCJGb3VuZGF0aW9uIiwiUmV2ZWFsIiwib3ZlcmxheVNpemluZyIsImNsb3NlIiwiZm91bmRhdGlvbiIsIm9wZW4iLCJpbml0Q2xvc2VCdXR0b24iLCIkaW5uZXJTcGFuIiwidXJsT3JNYXJrdXAiLCJvcGVuQ2FsbGJhY2siLCJjbG9zZUNhbGxiYWNrIiwiZnVsbFNjcmVlbiIsImZ1bGwiLCJvcGVuT3ZlcmxheVdpdGhBamF4IiwidXJsIiwiZG9uZSIsIm9wZW5PdmVybGF5V2l0aE1hcmt1cCIsIm1hcmt1cCIsIm92ZXJsYXlTaXplQ2xlYW51cCIsIm92ZXJsYXlIZWlnaHQiLCJ3aW5kb3dIZWlnaHQiLCJ2aWRlb0lEcyIsInBsYXllcnMiLCJicmlnaHRDb3ZlIiwiJHZpZGVvIiwiaWciLCJzZXRJbnRlcnZhbCIsIl9wYXJzZVZpZGVvcyIsIiRncm91cCIsInByZWxvYWRPcHRpb25zIiwicGxheWVyIiwiaWQiLCJkZXNjcmlwdGlvbiIsImF1dG8iLCJwcmVsb2FkIiwidHJhbnNjcmlwdCIsImN0YVRlbXBsYXRlIiwicHVzaCIsIl9pbmplY3RUZW1wbGF0ZSIsInRyYW5zY3JpcHRUZXh0IiwicmVwbGFjZVdpdGgiLCJzaWJsaW5ncyIsIl9pbmplY3RJZnJhbWUiLCJpbmplY3RCcmlnaHRDb3ZlSlMiLCJpbmRleGpzIiwiX2JyaWdodENvdmVSZWFkeSIsImZvckVhY2giLCJlbCIsInJlYWR5IiwiX29uUGxheSIsIl9vbkNvbXBsZXRlIiwiZGlnaXRhbERhdGEiLCJfcmV0cmlldmVUaXRsZSIsInBhdXNlIiwiX3ZpZXdTdGF0dXMiLCJzY3JvbGwiLCJ2aXNpYmxlIiwiZmlyc3QiLCJ0ZXh0IiwiX3NlYXJjaExlZ2FjeUNvZGUiLCJtb2RlbFVybCIsIiRmaWVsZCIsImhyZWYiLCJzdWdnZXN0aW9ucyIsImNpdGllcyIsImxvY2F0aW9ucyIsIkJsb29kaG91bmQiLCJ0b2tlbml6ZXJzIiwid2hpdGVzcGFjZSIsImdldFNlYXJjaFJlc3VsdHMiLCJwYXJhbXMiLCJzZWFyY2h0eXBlIiwibmFtZSIsImdldEpTT04iLCJhbHdheXMiLCJyZXN1bHQiLCJKU09OIiwicGFyc2UiLCJzZWFyY2hSZXN1bHRzIiwic2VhcmNoVHlwZSIsInNlYXJjaFRlcm0iLCJ2YWwiLCJmYWlsIiwic3RhdHVzIiwic3RhdHVzVGV4dCIsInBhcnNlU2VhcmNoU3RyaW5nIiwiY2l0eSIsIndvcmRzIiwic3BsaXQiLCJpIiwic3BsaWNlIiwiam9pbiIsImRpc3BsYXlTZWFyY2hSZXN1bHRzIiwidGVtcGxhdGVJRCIsImpzb24iLCJ0ZW1wbGF0ZSIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwicmVuZGVyZWQiLCJNdXN0YWNoZSIsInJlbmRlciIsInR5cGVhaGVhZCIsInN1Ym1pdCIsImRpcmVjdENhbGxSdWxlIiwiX3NhdGVsbGl0ZSIsImFwcCIsImZvcm1zIiwiY2Fyb3VzZWwiLCJjYXJlZXJzIl0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7O0FBU0E7OztBQUtB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