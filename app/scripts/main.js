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
          videoIDs.push(data.id);

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
    var transcriptText = { 'en': 'Transcript', 'fr': 'Transcription' },
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
    html += '</div><h2 class="video-title">' + data.title + '</h2><p class="video-description">' + data.description + '</p>';
    $video = $video.replaceWith(html);

    if (data.overlay) {
      $(document).on('click', '#' + data.id, function () {
        $(this).siblings('.video-overlay').hide();
      });
    }
  }

  function _injectIframe(data) {
    var html = '<div class="video-container">\n      <div class="video-container-responsive">\n      <iframe class="video-js" src=\'//players.brightcove.net/3906942861001/' + data.player + '_default/index.html?videoId=' + data.id + '\'\n    allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>\n    </div>\n    </div><h2 class="video-title">' + data.title + '</h2><p class="video-description">' + data.description + '</p>';
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

    // Add language class to body
    //_language();
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvY2FyZWVycy5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL3NlYXJjaC5qcyIsIm1vZHVsZXMvbW9kYWwuanMiLCJtb2R1bGVzL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBUaGlzIGZpbGUgaXMgZm9yIG1ldGhvZHMgYW5kIHZhcmlhYmxlcyB0aGF0IGFyZSBnb2luZyB0byBiZVxyXG4gdXNlZnVsIGFjcm9zcyBhbGwgbW9kdWxlcy4gSW4gb3JkZXIgdG8gdXNlIHRoZW0gYW55d2hlcmUsIGltcG9ydCB3aXRoOlxyXG5cclxuIGltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbiBhbmQgdGhlbiBjYWxsIHdpdGggdGhlIGlnIG5hbWVzcGFjZSAoaS5lLiwgaWcucGF0aG5hbWUsIGlnLmxhbmcsIGV0YylcclxuICovXHJcblxyXG4vLyB1cmwgcGF0aFxyXG5leHBvcnQgdmFyIHBhdGhuYW1lID0gKCgpID0+IHtcclxuICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xyXG59KSgpXHJcblxyXG4vLyBsYW5ndWFnZVxyXG5leHBvcnQgdmFyIGxhbmcgPSAoKCkgPT4ge1xyXG4gIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZignL2ZyLicpICE9PSAtMSB8fCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZignL2ZyLycpICE9PSAtMSkge1xyXG4gICAgcmV0dXJuICdmcic7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAnZW4nO1xyXG4gIH1cclxufSkoKVxyXG5cclxuLy8gYnJvd3NlciB3aWR0aFxyXG5leHBvcnQgdmFyIGJyb3dzZXJXaWR0aCA9ICgoKSA9PiB7XHJcbiAgcmV0dXJuIHdpbmRvdy5vdXRlcldpZHRoO1xyXG59KSgpXHJcblxyXG4vLyBjaGVjayBmb3IgSUUgKHByZSBFZGdlKVxyXG5leHBvcnQgdmFyIG9sZElFID0gKCgpID0+IHtcclxuICBpZiAoXCJBY3RpdmVYT2JqZWN0XCIgaW4gd2luZG93KSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufSkoKVxyXG5cclxuLy8gYmFzZSBldmVudEVtaXR0ZXJcclxuLy8gZXhwb3J0IHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuZXhwb3J0IHZhciBkZWJvdW5jZSA9IChmdW5jLCB3YWl0LCBpbW1lZGlhdGUpID0+IHtcclxuICB2YXIgdGltZW91dDtcclxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aW1lb3V0ID0gbnVsbDtcclxuICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICB9O1xyXG4gICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XHJcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XHJcbiAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICB9O1xyXG59O1xyXG5cclxuXHJcblxyXG5cclxuIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgdmFyIGVuZHBvaW50VVJMLFxyXG4gICAgc3VjY2Vzc1VSTCxcclxuICAgIGNhbmNlbFVSTCxcclxuICAgICRmb3JtLFxyXG4gICAgJGZvcm1XcmFwcGVyO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgLy8gRm9ybXMgc2hvdWxkIGFsd2F5cyBiZSB3cmFwcGVkIGluICcuaWctZm9ybSdcclxuICAgICRmb3JtV3JhcHBlciA9ICQoJy5pZy1mb3JtJyk7XHJcbiAgICAkZm9ybSA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJyk7XHJcbiAgICBlbmRwb2ludFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnZW5kcG9pbnQnKTtcclxuICAgIGNhbmNlbFVSTCA9ICRmb3JtV3JhcHBlci5maW5kKCdmb3JtJykuZGF0YSgnY2FuY2VsJyk7XHJcblxyXG4gICAgX3ZhbGlkYXRpb24oKTtcclxuICAgIF90b2dnbGVyKClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF92YWxpZGF0aW9uKCkge1xyXG4gICAgLy8gV2UgbmVlZCB0byBjaGVjayB3aGV0aGVyIGFuIGlucHV0IGlzICdkaXJ0eScgb3Igbm90IChzaW1pbGFyIHRvIGhvdyBBbmd1bGFyIDEgd29ya3MpIGluIG9yZGVyIGZvciBsYWJlbHMgdG8gYmVoYXZlIHByb3Blcmx5XHJcbiAgICB2YXIgaklucHV0ID0gJCgnOmlucHV0LCB0ZXh0YXJlYScpO1xyXG4gICAgaklucHV0LmNoYW5nZShmdW5jdGlvbiAob2JqRXZlbnQpIHtcclxuICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZGlydHknKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQudmFsaWRhdG9yLnNldERlZmF1bHRzKHtcclxuICAgICAgZGVidWc6IHRydWUsXHJcbiAgICAgIHN1Y2Nlc3M6ICd2YWxpZCdcclxuICAgIH0pO1xyXG5cclxuICAgICQudmFsaWRhdG9yLmFkZE1ldGhvZCgnY2RuUG9zdGFsJywgZnVuY3Rpb24gKHBvc3RhbCwgZWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25hbChlbGVtZW50KSB8fFxyXG4gICAgICAgIHBvc3RhbC5tYXRjaCgvW2EtekEtWl1bMC05XVthLXpBLVpdKC18IHwpWzAtOV1bYS16QS1aXVswLTldLyk7XHJcbiAgICB9LCAnUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBwb3N0YWwgY29kZS4nKTtcclxuXHJcbiAgICAkZm9ybS52YWxpZGF0ZSh7XHJcbiAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBfcHJvY2VzcygpO1xyXG4gICAgICB9LFxyXG4gICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24gKGxhYmVsLCBlbGVtZW50KSB7XHJcbiAgICAgICAgLy8gVXNlIHRoZSBjdXN0b20tZXJyb3ItbG9jYXRpb24gbWFya2VyIGNsYXNzIHRvIGNoYW5nZSB3aGVyZSB0aGUgZXJyb3IgbGFiZWwgc2hvd3MgdXBcclxuICAgICAgICBpZiAoISQoZWxlbWVudCkuY2xvc2VzdCgnLnJvdycpLmZpbmQoJy5jdXN0b20tZXJyb3ItbG9jYXRpb24nKS5sZW5ndGgpIHtcclxuICAgICAgICAgICQoZWxlbWVudCkucGFyZW50KCkuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmFwcGVuZChsYWJlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBydWxlczoge1xyXG4gICAgICAgIHBob25lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBob25lMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBwaG9uZVVTOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3N0YWxfY29kZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBjZG5Qb3N0YWw6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZpcnN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGFzdG5hbWU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbWFpbDI6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICRmb3JtLmZpbmQoJ2J1dHRvbi5jYW5jZWwnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKGNhbmNlbFVSTCk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcHJvY2Vzcyhmb3JtKSB7XHJcbiAgICB2YXIgZm9ybURhdGFSYXcsXHJcbiAgICAgIGZvcm1EYXRhUGFyc2VkO1xyXG5cclxuICAgIGlmICgkZm9ybS52YWxpZCgpKSB7XHJcbiAgICAgICRmb3JtLnJlbW92ZUNsYXNzKCdzZXJ2ZXItZXJyb3InKTtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgIGZvcm1EYXRhUmF3ID0gJGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcclxuICAgICAgLy8gSWYgd2UgbmVlZCB0byBtb2RpZnkgdGhlIGRhdGEsIHVzZSBwYXJzZSBtZXRob2RcclxuICAgICAgZm9ybURhdGFQYXJzZWQgPSBfcGFyc2UoZm9ybURhdGFSYXcpO1xyXG4gICAgICAvLyBTdWJtaXQgZmluYWwgZGF0YVxyXG4gICAgICBfc3VibWl0KGZvcm1EYXRhUGFyc2VkKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wYXJzZShkYXRhKSB7XHJcbiAgICAvLyBFeGVjdXRlIGFueSBjdXN0b20gbG9naWMgaGVyZVxyXG5cclxuXHJcbiAgICByZXR1cm4gZGF0YVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3N1Ym1pdChkYXRhKSB7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgdXJsOiBlbmRwb2ludFVSTCxcclxuICAgICAgZGF0YTogZGF0YVxyXG4gICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICRmb3JtV3JhcHBlci5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIucmVtb3ZlQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgIH0pXHJcbiAgICAgIC5lcnJvcihmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgJGZvcm0uYWRkQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgICAgIFNjcm9sbE1hbi50bygkKCcjc2VydmVyLWVycm9yJykpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF90b2dnbGVyKCkge1xyXG4gICAgLy8gVmVyeSBzaW1wbGUgZm9ybSB0b2dnbGVyXHJcbiAgICAkKCcudG9nZ2xlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnLnRvZ2dsZS1jb250ZW50JykuaGlkZSgpO1xyXG4gICAgICAkKCcuJyArICQodGhpcykuZGF0YSgnY29udGVudCcpKS5zaG93KCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnQ2Fyb3VzZWwgSW5pdGlhbGl6ZWQhJylcclxuXHJcbiAgICAvLyBOb3Qgc3VyZSB3aGF0IHRoaXMgZG9lcyBhdCB0aGlzIHBvaW50IG9yIGhvdyBpdCByZWxhdGVzIHRvIENhcm91c2Vsc1xyXG4gICAgJCgnW2RhdGEtcmVzcG9uc2l2ZS10b2dnbGVdIGJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCdzaXRlLWhlYWRlci1pcy1hY3RpdmUnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIF9idWlsZENhcm91c2VsKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYnVpbGRDYXJvdXNlbCgpIHtcclxuICAgIHZhciBwcmV2QXJyb3csXHJcbiAgICAgIG5leHRBcnJvdyxcclxuICAgICAgJGNhcm91c2VsO1xyXG5cclxuICAgICQoJy5pZy1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICRjYXJvdXNlbCA9ICQodGhpcyk7XHJcbiAgICAgIHByZXZBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgncHJldkFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPlByZXZpb3VzPC9zcGFuPjwvYnV0dG9uPic7XHJcbiAgICAgIG5leHRBcnJvdyA9ICgkY2Fyb3VzZWwuZGF0YSgnbmV4dEFycm93VGV4dCcpKSA/ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+JyArICRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykgKyAnPC9zcGFuPjwvYnV0dG9uPicgOiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+PHNwYW4gY2xhc3M9XCJzaG93LWZvci1zclwiPk5leHQ8L3NwYW4+PC9idXR0b24+JztcclxuXHJcbiAgICAgICRjYXJvdXNlbC5zbGljayh7XHJcbiAgICAgICAgYWRhcHRpdmVIZWlnaHQ6ICRjYXJvdXNlbC5kYXRhKCdhZGFwdGl2ZUhlaWdodCcpIHx8IGZhbHNlLFxyXG4gICAgICAgIGFycm93czogJGNhcm91c2VsLmRhdGEoJ2Fycm93cycpIHx8IGZhbHNlLFxyXG4gICAgICAgIGF1dG9QbGF5OiAkY2Fyb3VzZWwuZGF0YSgnYXV0b1BsYXknKSB8fCBmYWxzZSxcclxuICAgICAgICBkb3RzOiAkY2Fyb3VzZWwuZGF0YSgnZG90cycpIHx8IGZhbHNlLFxyXG4gICAgICAgIGZhZGU6ICRjYXJvdXNlbC5kYXRhKCdmYWRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgaW5maW5pdGU6ICRjYXJvdXNlbC5kYXRhKCdpbmZpbml0ZScpIHx8IGZhbHNlLFxyXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxyXG4gICAgICAgIG5leHRBcnJvdzogbmV4dEFycm93LFxyXG4gICAgICAgIHByZXZBcnJvdzogcHJldkFycm93LFxyXG4gICAgICAgIHJlc3BvbnNpdmU6ICRjYXJvdXNlbC5kYXRhKCdyZXNwb25zaXZlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGU6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZScpIHx8ICcnLFxyXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVUb1Njcm9sbCcpIHx8IDEsXHJcbiAgICAgICAgc2xpZGVzVG9TaG93OiAkY2Fyb3VzZWwuZGF0YSgnc2xpZGVzVG9TaG93JykgfHwgMSxcclxuICAgICAgICBzcGVlZDogJGNhcm91c2VsLmRhdGEoJ3NwZWVkJykgfHwgMzAwLFxyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgICAgIF9jYXJlZXJzTGVnYWN5Q29kZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9jYXJlZXJzTGVnYWN5Q29kZSgpIHtcclxuICAgICAgICAoZnVuY3Rpb24gKCQpIHtcclxuXHJcbiAgICAgICAgICAgICQuZm4uaW5mb1RvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICRyZXZlYWwgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcmV2ZWFsQ29udGVudCA9ICRyZXZlYWwuZmluZCgnLmluZm8tdG9nZ2xlLWNvbnRlbnQnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHJldmVhbFRyaWdnZXIgPSAkcmV2ZWFsLmZpbmQoJy5pbmZvLXRvZ2dsZS10cmlnZ2VyJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpeGVkSGVpZ2h0ID0gZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEFyaWEgPSAkcmV2ZWFsLmF0dHIoJ2luZm8tdG9nZ2xlLWFyaWEnKSA9PT0gJ3RydWUnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbml0VG9nZ2xlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXRUb2dnbGUoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyZXZlYWxUcmlnZ2VyLm9uKCdjbGljaycsIGhhbmRsZVJldmVhbFRvZ2dsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgcmVzaXplSGFuZGxlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRSZXZlYWxDb250ZW50SGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLy0tLS0tXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZVJldmVhbFRvZ2dsZSgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0UmV2ZWFsQ29udGVudEhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcmV2ZWFsLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoc2V0UmV2ZWFsQ29udGVudEhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiByZXNpemVIYW5kbGVyKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZml4ZWRIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyZXZlYWxDb250ZW50LmNzcyh7aGVpZ2h0OiAnYXV0byd9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gc2V0UmV2ZWFsQ29udGVudEhlaWdodCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZpbmFsSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRyZXZlYWwuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbEhlaWdodCA9ICRyZXZlYWxDb250ZW50WzBdLnNjcm9sbEhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpeGVkSGVpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsSGVpZ2h0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpeGVkSGVpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHJldmVhbENvbnRlbnQuY3NzKHtoZWlnaHQ6IGZpbmFsSGVpZ2h0fSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2V0QXJpYSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJldmVhbENvbnRlbnQuYXR0cignYXJpYS1oaWRkZW4nLCAhZml4ZWRIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH0pKGpRdWVyeSk7XHJcblxyXG5cclxuICAgICAgICAoZnVuY3Rpb24gKCQpIHtcclxuICAgICAgICAgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICAgICAgICAgJC5mbi5jaXJjbGVBbmltYXRpb24gPSBmdW5jdGlvbiAobWF4VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbnZhcyA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRjYW52YXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkID0gY2FudmFzLndpZHRoIC8gMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGVyY2VudFN0cm9rZSA9IDcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbWFpbmluZ1N0cm9rZSA9IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhZGl1cyA9IGQgLSBwZXJjZW50U3Ryb2tlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJQZXJjID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2lyYyA9IE1hdGguUEkgKiAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFydCA9IE1hdGguUEkgLyAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxlZ2F0ZUlEID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgKyAnQ0EnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoISRjYW52YXMuaXMoJ2NhbnZhcycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gJyMwZDI2M2MnO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyNlNWU4ZTgnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkY2FudmFzLmF0dHIoJ2NpcmNsZS1hbmltYXRpb24taWQnLCBkZWxlZ2F0ZUlEKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuZGVsZWdhdGUoJ1tjaXJjbGUtYW5pbWF0aW9uLWlkPScgKyBkZWxlZ2F0ZUlEICsgJ10nLCAnc3RhcnRBbmltYXRlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJQZXJjID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZSgnW2NpcmNsZS1hbmltYXRpb24taWQ9JyArIGRlbGVnYXRlSUQgKyAnXScsICdjbGVhckFuaW1hdGUnLCBjbGVhcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFuaW1hdGUoY3VycmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50ID0gY3VycmVudCA/IGN1cnJlbnQgOiAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHBlcmNlbnRTdHJva2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuYXJjKGQsIGQsIHJhZGl1cywgLShxdWFydCksICgoY2lyYykgKiAtTWF0aC5taW4oY3VycmVudCwgbWF4VmFsdWUgLyAxMDApKSAtIHF1YXJ0LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSByZW1haW5pbmdTdHJva2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuYXJjKGQsIGQsIHJhZGl1cywgLShxdWFydCksICgoY2lyYykgKiAtY3VycmVudCkgLSBxdWFydCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1clBlcmMrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1clBlcmMgPCAxMTApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGUoY3VyUGVyYyAvIDEwMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy53aWR0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH0pKGpRdWVyeSk7XHJcblxyXG4gICAgICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAgICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAgICAgICAkLmZuLmJsb2NrTGluayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICRibG9ja0xpbmsgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbiA9ICRibG9ja0xpbmsuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2Rlc3RpbmF0aW9uID0gJzQ0NDIuYXNweC8nICsgZGVzdGluYXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdEJsb2NrKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXRCbG9jaygpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGJsb2NrTGluay5vbignY2xpY2snLCBoYW5kbGVDbGljayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLy0tLS0tXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbiA9IGRlc3RpbmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICB9KShqUXVlcnkpO1xyXG5cclxuICAgICAgICAoZnVuY3Rpb24gKCQpIHtcclxuICAgICAgICAgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICAgICAgICAgdmFyIGd1aSxcclxuICAgICAgICAgICAgICAgIHZpZGVvLFxyXG4gICAgICAgICAgICAgICAgb3ZlcmxheTtcclxuXHJcbiAgICAgICAgICAgIGluaXRMZWdhY3koKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGluaXRMZWdhY3koKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIHdlaXJkIC0gbm90IGdvaW5nIHRvIHRvdWNoIGl0XHJcbiAgICAgICAgICAgICAgICBvdmVybGF5ID0gbmV3IE92ZXJsYXlNb2R1bGUoKTtcclxuICAgICAgICAgICAgICAgIGd1aSA9IG5ldyBHdWlNb2R1bGUob3ZlcmxheSk7XHJcbiAgICAgICAgICAgICAgICAvLyB2aWRlbyA9IG5ldyBWaWRlb01vZHVsZSgpOyAvLyBSZXBsYWNlIHdpdGggdmlkZW8uanMgbW9kdWxlXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTmVlZCB0byBoYXZlIGEgY2xhc3MgdG8gaG9vayBvbnRvIGZvciBGcmVuY2ggbGFuZ3VhZ2UgcGFnZVxyXG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIvJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdmcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNtb290aCBzY3JvbGxpbmcgZm9yIGFuY2hvciBsaW5rc1xyXG4gICAgICAgICAgICAgICAgJCgnYVtocmVmXj1cIiNcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLnN0b3AoKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcCArIDUyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDc1MCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LnNlbGVjdG9yICE9PSBcIiNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjbWFpbi1tZW51LWFuY2hvcicpLmNzcyh7J2Rpc3BsYXknOiAnbm9uZSd9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdpcy1yZXZlYWwtb3BlbiBicmFuZGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTW9iaWxlIG1lbnUgbmVlZHMgdG8gbWltaWMgRm91bmRhdGlvbiByZXZlYWwgLSBub3QgZW5vdWdoIHRpbWUgdG8gaW1wbGVtZW50IGRpZmZlcmVudCBuYXZzIGluIGEgcmV2ZWFsIG1vZGFsIHByb3Blcmx5XHJcbiAgICAgICAgICAgICAgICAkKCcubWVudS1pY29uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2lzLXJldmVhbC1vcGVuIGJyYW5kZWQnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHF1aWNrIGFuZCBkaXJ0eSBtb2JpbGUgbWVudSBjbG9zZXMgLSBub3QgZmFtaWxpYXIgd2l0aCBGb3VuZGF0aW9uIHBhdHRlcm4gdG8gZmlyZSB0aGVzZVxyXG4gICAgICAgICAgICAgICAgJCgnLnRvcC1iYXIgLmNsb3NlLWJ1dHRvbi5zaG93LWZvci1zbWFsbC1vbmx5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNtYWluLW1lbnUtYW5jaG9yJykuY3NzKHsnZGlzcGxheSc6ICdub25lJ30pO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaXMtcmV2ZWFsLW9wZW4gYnJhbmRlZCcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gNjQwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnYnJhbmRlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLy0tLS0tXHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBHdWlNb2R1bGUob3ZlcmxheVJlZmVyZW5jZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IgPSAnW2NsYXNzKj1cInRvZ2dsZS1cIl06bm90KFtjbGFzcyo9XCJpbmZvLXRvZ2dsZVwiXSknLFxyXG4gICAgICAgICAgICAgICAgICAgIG11bHRpVGFiQ29udGVudFNlbGVjdG9yID0gJ1tjbGFzcyo9XCJjb250ZW50LVwiXScsXHJcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlUYWJTZWxlY3RvciA9ICcubXVsdGktdGFiLW91dGxpbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICRlZGdlT3ZlcmxheUxvY2F0aW9uID0gJCgnI2VkZ2Utb3ZlcmxheS1jb250ZW50JyksXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheSA9IG92ZXJsYXlSZWZlcmVuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXlTbGlkZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXJWaWRlb1NlY3Rpb25Ib2xkZXIgPSAkKCc8ZGl2PjwvZGl2PicpLFxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvd1NpemluZ0RlbGF5LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvd1Njcm9sbGluZ0RlbGF5LFxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlPcGVuLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzUmVzcG9uc2l2ZVN0YXRlID0gZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsZWRUb1ZpZXcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbml0R3VpKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdEd1aSgpIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRNdWx0aVRhYlRvZ2dsZUhhbmRsZXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmJsb2NrLWxpbmsnKS5ibG9ja0xpbmsoKTtcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheVNsaWRlciA9ICQoJy5vdXItYnVzaW5lc3Mtc2xpZGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2VkZ2Utb3ZlcmxheS1jb250ZW50JykuZmluZCgnLmNhcm91c2VsLW5leHQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXlTbGlkZXIuc2xpY2soJ3NsaWNrTmV4dCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoJChcIi52aWRlby1zbGlkZS5zbGljay1hY3RpdmVcIikubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zbGljay1saXN0LmRyYWdnYWJsZScpLmNzcyh7aGVpZ2h0OiAnNjYwcHgnfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zZWN0aW9uLnByb2ZpbGVzLXNsaWRlcicpLmNzcyh7YmFja2dyb3VuZENvbG9yOiAnI2U1ZThlOCd9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuc2xpY2stbGlzdC5kcmFnZ2FibGUnKS5jc3Moe2hlaWdodDogJ2F1dG8nfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zZWN0aW9uLnByb2ZpbGVzLXNsaWRlcicpLmNzcyh7YmFja2dyb3VuZENvbG9yOiAnIzdlYzRiOSd9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICQoJy5wcm9maWxlLWNvdW50ZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ2NhbnZhcycpLmNpcmNsZUFuaW1hdGlvbihwYXJzZUludCgkdGhpcy5maW5kKCdwJykuaHRtbCgpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIgPSAkKCcucHJvZmlsZXMtc2xpZGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdoYXNoY2hhbmdlJywgaGFuZGxlT3ZlcmxheUZyb21IYXNoKTtcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVPdmVybGF5RnJvbUhhc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGRlbGF5ZWRIYW5kbGVXaW5kb3dTaXppbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVdpbmRvd1NpemluZyh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGRlbGF5ZWRIYW5kbGVXaW5kb3dTY3JvbGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVdpbmRvd1Njcm9sbGluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKCcuaW5mby10b2dnbGUnKS5pbmZvVG9nZ2xlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnRvcC1iYXIgKyAuc2NyZWVuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdhW2RhdGEtdG9nZ2xlXScpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIE5vdCBwcmV0dHkgLSBqdXN0IGFkZGluZyBxdWljayBhbmQgZGlydHkgc2hhcmUgbGluayBhY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAkKCcuc2hhcmUtdG9nZ2xlLXRyaWdnZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5pbmZvLXRvZ2dsZScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnNoYXJlLXRvZ2dsZS1jbG9zZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmluZm8tdG9nZ2xlJykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBhZGRNdWx0aVRhYlRvZ2dsZUhhbmRsZXJzKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZShtdWx0aVRhYlRvZ2dsZVNlbGVjdG9yLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVCYXNlID0gJHRoaXMuYXR0cignY2xhc3MnKS5tYXRjaCgvdG9nZ2xlLShcXFMqKT8oJHxcXHMpLylbMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gJHRoaXMucGFyZW50cyhtdWx0aVRhYlNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb250YWluZXIuZmluZChtdWx0aVRhYlRvZ2dsZVNlbGVjdG9yKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb250YWluZXIuZmluZChtdWx0aVRhYkNvbnRlbnRTZWxlY3RvcikucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb250YWluZXIuZmluZCgnLmNvbnRlbnQtJyArIHRvZ2dsZUJhc2UpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFuaW1hdGVQcm9maWxlU2xpZGVyKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciAkcHJvZmlsZVBhbmVscyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZmlsZVBhbmVsSGVpZ2h0ID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjcm9sbGVkVG9WaWV3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLmZpbmQoJy5zbGljay1zbGlkZScpLnJlbW92ZUNsYXNzKCdzbGljay1jb21wbGV0ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5maW5kKCcuc2xpY2stYWN0aXZlJykuYWRkQ2xhc3MoJ3NsaWNrLWNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwcm9maWxlU2xpZGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnLnNsaWNrLXNsaWRlOm5vdCguc2xpY2stY29tcGxldGUpJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcucHJvZmlsZS1jb3VudGVyIGNhbnZhcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpZ2dlcignY2xlYXJBbmltYXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwcm9maWxlU2xpZGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnLnNsaWNrLWNvbXBsZXRlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcucHJvZmlsZS1jb3VudGVyIGNhbnZhcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpZ2dlcignc3RhcnRBbmltYXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkcHJvZmlsZVNsaWRlci5maW5kKCcuc2xpY2stYWN0aXZlJykuaXMoJ1tjbGFzcyo9cHJvZmlsZS1dJykgfHwgaXNSZXNwb25zaXZlU3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLmFkZENsYXNzKCdjb250cmFzdC1hcnJvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIucmVtb3ZlQ2xhc3MoJ2NvbnRyYXN0LWFycm93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVQYW5lbHMgPSAkcHJvZmlsZVNsaWRlci5maW5kKCcucHJvZmlsZS0xLXNsaWRlLCAucHJvZmlsZS0yLXNsaWRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwcm9maWxlUGFuZWxzLmNzcyh7aGVpZ2h0OiAnYXV0byd9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVQYW5lbHMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudCA9ICQodGhpcykub3V0ZXJIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudCA+IHByb2ZpbGVQYW5lbEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2ZpbGVQYW5lbEhlaWdodCA9IGN1cnJlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVBhbmVscy5jc3Moe2hlaWdodDogcHJvZmlsZVBhbmVsSGVpZ2h0fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNoYW5nZVNsaWRlclN0YXRlKHNsaWRlciwgc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcImFjY2Vzc2liaWxpdHlcIiwgc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwiZHJhZ2dhYmxlXCIsIHN0YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcInN3aXBlXCIsIHN0YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXIuc2xpY2soXCJzbGlja1NldE9wdGlvblwiLCBcInRvdWNoTW92ZVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZGVsYXllZEhhbmRsZVdpbmRvd1NpemluZygpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAod2luZG93U2l6aW5nRGVsYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh3aW5kb3dTaXppbmdEZWxheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3dTaXppbmdEZWxheSA9IHdpbmRvdy5zZXRUaW1lb3V0KGhhbmRsZVdpbmRvd1NpemluZywgMjUwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBkZWxheWVkSGFuZGxlV2luZG93U2Nyb2xsKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3dTY3JvbGxpbmdEZWxheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHdpbmRvd1Njcm9sbGluZ0RlbGF5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvd1Njcm9sbGluZ0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQoaGFuZGxlV2luZG93U2Nyb2xsaW5nLCAyNTApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlGcm9tSGFzaChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmdWxsSGFzaEZyYWdtZW50ID0gJyNvdXItZWRnZS0nO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvdmVybGF5T3BlbiAmJiBsb2NhdGlvbi5oYXNoLmluZGV4T2YoZnVsbEhhc2hGcmFnbWVudCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheS5vcGVuT3ZlcmxheShcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRlZGdlT3ZlcmxheUxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlT3ZlcmxheU9wZW4sIGhhbmRsZU92ZXJsYXlDbG9zZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZU92ZXJsYXlPcGVuKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluaXRpYWxJbmRleDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdFNsaWRlcigkb3ZlcmxheVNsaWRlciwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsSW5kZXggPSAkb3ZlcmxheVNsaWRlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnLicgKyBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyNvdXItJywgJycpICsgJzpub3QoLnNsaWNrLWNsb25lZCknKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1zbGljay1pbmRleCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCdzbGlja0dvVG8nLCBpbml0aWFsSW5kZXgsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5U2xpZGVyLm9uKCdhZnRlckNoYW5nZScsIGhhbmRsZVNsaWRlQ2hhbmdlKTtcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVTbGlkZUNoYW5nZShudWxsLCBudWxsLCBwYXJzZUludCgkKCcjbW9kYWxPdmVybGF5IC5zbGljay1hY3RpdmUnKS5hdHRyKCdkYXRhLXNsaWNrLWluZGV4JykpKTtcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVXaW5kb3dTaXppbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5T3BlbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUNsb3NlKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHlQb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJsYXlDb250ZW50ID0gJCgnI21vZGFsT3ZlcmxheSA+IGRpdicpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheVNsaWRlci5zbGljaygndW5zbGljaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5U2xpZGVyLm9mZignYWZ0ZXJDaGFuZ2UnKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcub3ZlcmxheS1yZXBvc2l0b3J5JykuYXBwZW5kKG92ZXJsYXlDb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJwdXNoU3RhdGVcIiBpbiBoaXN0b3J5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZShcIlwiLCBkb2N1bWVudC50aXRsZSwgbG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB5UG9zID0gJChkb2N1bWVudCkuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLmhhc2ggPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoeVBvcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlU2xpZGVDaGFuZ2UoZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dFNsaWRlID0gKGN1cnJlbnRTbGlkZSArIDEpICUgKCQoJy5zbGljay1zbGlkZTpub3QoLnNsaWNrLWNsb25lZCknKS5sZW5ndGggLSAxKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFRpdGxlID0gJCgkb3ZlcmxheVNsaWRlci5maW5kKCdbZGF0YS1zbGljay1pbmRleD0nICsgbmV4dFNsaWRlICsgJ10gLmNvbHVtbnM6Zmlyc3QtY2hpbGQgcCcpLmdldCgwKSkuaHRtbCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdIYXNoID0gJ291ci0nICsgJG92ZXJsYXlTbGlkZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnW2RhdGEtc2xpY2staW5kZXg9JyArIGN1cnJlbnRTbGlkZSArICddJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXRjaCgvKGVkZ2UtXFxTKikvKVsxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI21vZGFsT3ZlcmxheSAuY2Fyb3VzZWwtbmV4dCBhJykuaHRtbChuZXh0VGl0bGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLmhhc2ggPSBuZXdIYXNoO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZVdpbmRvd1NpemluZyhpbml0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNpdmVMaW1pdCA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0lzUmVzcG9uc2l2ZVN0YXRlID0gd2luZG93V2lkdGggPCByZXNwb25zaXZlTGltaXQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkb3ZlcmxheVNsaWRlci5pcygnLnNsaWNrLWluaXRpYWxpemVkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlU2xpZGVyU3RhdGUoJG92ZXJsYXlTbGlkZXIsICFuZXdJc1Jlc3BvbnNpdmVTdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNSZXNwb25zaXZlU3RhdGUgIT09IG5ld0lzUmVzcG9uc2l2ZVN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUmVzcG9uc2l2ZVN0YXRlID0gbmV3SXNSZXNwb25zaXZlU3RhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbml0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXRQcm9maWxlU2xpZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZVdpbmRvd1Njcm9sbGluZygpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNjcm9sbGVkVG9WaWV3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyAkKHdpbmRvdykuaGVpZ2h0KCkgPiAkcHJvZmlsZVNsaWRlci5vZmZzZXQoKS50b3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbGVkVG9WaWV3ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGFuaW1hdGVQcm9maWxlU2xpZGVyLCA1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXRQcm9maWxlU2xpZGVyKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRTbGlkZXIoJHByb2ZpbGVTbGlkZXIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZBcnJvdzogJzxzcGFuIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNhcm91c2VsLXByZXYgZ2EtY2FyZWVycy1vdXItcGVvcGxlLWNhcm91c2VsLXNjcm9sbFwiPjxpbWcgc3JjPVwiL2NvbnRlbnQvZGFtL2ludmVzdG9yc2dyb3VwL2FwcC9jYXJlZXJzL2ltYWdlcy9BcnJvdy1NYWluQXJ0aWNsZS1DYXJvdXNlbC1CbGFjay1MLnBuZ1wiPjwvc3Bhbj4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0QXJyb3c6ICc8c3BhbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjYXJvdXNlbC1uZXh0IGdhLWNhcmVlcnMtb3VyLXBlb3BsZS1jYXJvdXNlbC1zY3JvbGxcIj48aW1nIHNyYz1cIi9jb250ZW50L2RhbS9pbnZlc3RvcnNncm91cC9hcHAvY2FyZWVycy9pbWFnZXMvQXJyb3ctTWFpbkFydGljbGUtQ2Fyb3VzZWwtQmxhY2stUi5wbmdcIj48L3NwYW4+J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGVQcm9maWxlU2xpZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIub24oJ2FmdGVyQ2hhbmdlJywgYW5pbWF0ZVByb2ZpbGVTbGlkZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXRTbGlkZXIodGFyZ2V0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGVlZDogNzUwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb3RzQ2xhc3M6ICdzbGljay1kb3RzIGdhLWNhcmVlcnMtb3VyLXBlb3BsZS1jYXJvdXNlbC1zY3JvbGwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2OCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5zbGljaygkLmV4dGVuZChkZWZhdWx0cywgb3B0aW9ucykpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBPdmVybGF5TW9kdWxlKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyICRvdmVybGF5LFxyXG4gICAgICAgICAgICAgICAgICAgICRib2R5ID0gJCgnYm9keScpLFxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlTaXppbmdEZWxheSxcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5zdGFuY2UgPSB7fSxcclxuICAgICAgICAgICAgICAgICAgICBpc09wZW5GbGFnID0gZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgJGNsb3NlQnV0dG9uO1xyXG5cclxuICAgICAgICAgICAgICAgIGluaXRPdmVybGF5KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBvcGVuT3ZlcmxheTogb3Blbk92ZXJsYXksXHJcbiAgICAgICAgICAgICAgICAgICAgaXNPcGVuOiBpc09wZW5cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdE92ZXJsYXkoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkgPSAkKCc8ZGl2PjwvZGl2PicpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5LmF0dHIoJ2lkJywgJ21vZGFsT3ZlcmxheScpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5LmF0dHIoJ2NsYXNzJywgJ3JldmVhbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5LmF0dHIoJ2RhdGEtcmV2ZWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGJvZHkuYXBwZW5kKCRvdmVybGF5KTtcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5vbignb3Blbi56Zi5yZXZlYWwnLCBoYW5kbGVPdmVybGF5T3Blbik7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdjbG9zZWQuemYucmV2ZWFsJywgaGFuZGxlT3ZlcmxheUNsb3NlKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGRlbGF5ZWRIYW5kbGVPdmVybGF5U2l6aW5nKTtcclxuICAgICAgICAgICAgICAgICAgICBpbml0Q2xvc2VCdXR0b24oKTtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgRm91bmRhdGlvbi5SZXZlYWwoJG92ZXJsYXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBkZWxheWVkSGFuZGxlT3ZlcmxheVNpemluZygpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3ZlcmxheVNpemluZ0RlbGF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQob3ZlcmxheVNpemluZ0RlbGF5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlTaXppbmdEZWxheSA9IHdpbmRvdy5zZXRUaW1lb3V0KG92ZXJsYXlTaXppbmcsIDI1MCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUNsb3NlKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNPcGVuRmxhZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50SW5zdGFuY2UuY2xvc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEluc3RhbmNlLmNsb3NlKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVNpemVDbGVhbnVwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEluc3RhbmNlID0ge307XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheU9wZW4oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzT3BlbkZsYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5maW5kKCcqJykuZm91bmRhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50SW5zdGFuY2Uub3Blbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5zdGFuY2Uub3BlbihldmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlTaXppbmcoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbml0Q2xvc2VCdXR0b24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICRpbm5lclNwYW4gPSAkKCc8c3Bhbj48L3NwYW4+Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRjbG9zZUJ1dHRvbiA9ICQoJzxidXR0b24gZGF0YS1jbG9zZT48L2J1dHRvbj4nKTtcclxuICAgICAgICAgICAgICAgICAgICAkY2xvc2VCdXR0b24uYWRkQ2xhc3MoJ2Nsb3NlLWJ1dHRvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICRjbG9zZUJ1dHRvbi5hdHRyKCdhcmlhLWxhYmVsJywgJ0Nsb3NlIG1vZGFsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlubmVyU3Bhbi5hdHRyKCdhcmlhLWhpZGRlbicsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICRpbm5lclNwYW4uaHRtbCgnJnRpbWVzOycpO1xyXG4gICAgICAgICAgICAgICAgICAgICRjbG9zZUJ1dHRvbi5hcHBlbmQoJGlubmVyU3Bhbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaXNPcGVuKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc09wZW5GbGFnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG9wZW5PdmVybGF5KHVybE9yTWFya3VwLCBvcGVuQ2FsbGJhY2ssIGNsb3NlQ2FsbGJhY2ssIGZ1bGxTY3JlZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5zdGFuY2Uub3BlbiA9IG9wZW5DYWxsYmFjaztcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5zdGFuY2UuY2xvc2UgPSBjbG9zZUNhbGxiYWNrO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5mdWxsID0gZnVsbFNjcmVlbjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHVybE9yTWFya3VwID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuT3ZlcmxheVdpdGhBamF4KHVybE9yTWFya3VwKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuT3ZlcmxheVdpdGhNYXJrdXAodXJsT3JNYXJrdXApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb3Blbk92ZXJsYXlXaXRoQWpheCh1cmwpIHtcclxuICAgICAgICAgICAgICAgICAgICAkLmFqYXgodXJsKS5kb25lKG9wZW5PdmVybGF5V2l0aE1hcmt1cCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb3Blbk92ZXJsYXlXaXRoTWFya3VwKG1hcmt1cCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5Lmh0bWwobWFya3VwKTtcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5hcHBlbmQoJGNsb3NlQnV0dG9uKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudEluc3RhbmNlLmZ1bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ2Z1bGwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuZm91bmRhdGlvbignb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG92ZXJsYXlTaXplQ2xlYW51cCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5yZW1vdmVDbGFzcygnZnVsbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5LnJlbW92ZUNsYXNzKCd0b3VyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuaHRtbCgnJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb3ZlcmxheVNpemluZygpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb3ZlcmxheUhlaWdodCA9ICRvdmVybGF5LmhlaWdodCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3dIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvdmVybGF5SGVpZ2h0ID4gd2luZG93SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRvdmVybGF5LmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRvdmVybGF5LmFkZENsYXNzKCdmdWxsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pKGpRdWVyeSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdFxyXG4gICAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIHZhciB2aWRlb0lEcyA9IFtdLFxyXG4gICAgcGxheWVycyA9IFtdLFxyXG4gICAgYnJpZ2h0Q292ZSxcclxuICAgICR2aWRlbztcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICBfcGFyc2VWaWRlb3MoKTtcclxuXHJcbiAgICBpZiAoIWlnLm9sZElFKSB7XHJcblxyXG4gICAgICAvLyBNYWtlIHN1cmUgdGhlIFZpZGVvSlMgbWV0aG9kIGlzIGF2YWlsYWJsZSBhbmQgZmlyZSByZWFkeSBldmVudCBoYW5kbGVyc1xyXG4gICAgICBicmlnaHRDb3ZlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICgkKCcudmpzLXBsdWdpbnMtcmVhZHknKS5sZW5ndGgpIHtcclxuICAgICAgICAgIF9icmlnaHRDb3ZlUmVhZHkoKTtcclxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoYnJpZ2h0Q292ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCA1MDApO1xyXG5cclxuICAgICAgLy8gRnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIHZpZGVvJ3MgaGF2ZSBzY3JvbGxlZCBvZmYgc2NyZWVuIGFuZCBuZWVkIHRvIGJlIHBhdXNlZFxyXG4gICAgICBfdmlld1N0YXR1cygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlVmlkZW9zKCkge1xyXG4gICAgdmFyICRncm91cCxcclxuICAgICAgZGF0YSA9IHt9LFxyXG4gICAgICBwcmVsb2FkT3B0aW9ucyA9IFsnYXV0bycsICdtZXRhZGF0YScsICdub25lJ107XHJcblxyXG4gICAgLy8gRWFjaCBncm91cCBjYW4gZWZmZWN0aXZlbHkgdXNlIGEgZGlmZmVyZW50IHBsYXllciB3aGljaCB3aWxsIG9ubHkgYmUgbG9hZGVkIG9uY2VcclxuICAgICQoJy5pZy12aWRlby1ncm91cCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAkZ3JvdXAgPSAkKHRoaXMpO1xyXG4gICAgICBkYXRhLnBsYXllciA9ICRncm91cC5kYXRhKCdwbGF5ZXInKTtcclxuXHJcbiAgICAgIC8vIExvb3AgdGhyb3VnaCB2aWRlbydzXHJcbiAgICAgICRncm91cC5maW5kKCcuaWctdmlkZW8tanMnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICR2aWRlbyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgIGRhdGEuaWQgPSAkdmlkZW8uZGF0YSgnaWQnKTtcclxuICAgICAgICBkYXRhLnRpdGxlID0gJHZpZGVvLmRhdGEoJ3RpdGxlJykgPyAkdmlkZW8uZGF0YSgndGl0bGUnKSA6ICcnO1xyXG4gICAgICAgIGRhdGEuZGVzY3JpcHRpb24gPSAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKSA/ICR2aWRlby5kYXRhKCdkZXNjcmlwdGlvbicpIDogJyc7XHJcblxyXG4gICAgICAgIGlmIChpZy5vbGRJRSkge1xyXG5cclxuICAgICAgICAgIF9pbmplY3RJZnJhbWUoZGF0YSwgJHZpZGVvKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAvLyBDYXB0dXJlIG9wdGlvbnMgdGhhdCBhcmUgdXNlZCB3aXRoIG1vZGVybiBicm93c2Vyc1xyXG4gICAgICAgICAgZGF0YS5vdmVybGF5ID0gJHZpZGVvLmRhdGEoJ292ZXJsYXknKVxyXG4gICAgICAgICAgICA/ICR2aWRlby5kYXRhKCdvdmVybGF5JylcclxuICAgICAgICAgICAgOiAnJztcclxuICAgICAgICAgIGRhdGEuYXV0byA9ICR2aWRlby5kYXRhKCdhdXRvcGxheScpID8gJ2F1dG9wbGF5JyA6ICcnO1xyXG4gICAgICAgICAgZGF0YS5wcmVsb2FkID0gKHByZWxvYWRPcHRpb25zLmluZGV4T2YoJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSkgPiAtMSkgPyAkdmlkZW8uZGF0YSgncHJlbG9hZCcpIDogJ2F1dG8nO1xyXG4gICAgICAgICAgZGF0YS50cmFuc2NyaXB0ID0gJHZpZGVvLmRhdGEoJ3RyYW5zY3JpcHQnKSA/ICR2aWRlby5kYXRhKFxyXG4gICAgICAgICAgICAndHJhbnNjcmlwdCcpIDogJyc7XHJcbiAgICAgICAgICBkYXRhLmN0YVRlbXBsYXRlID0gJHZpZGVvLmRhdGEoJ2N0YVRlbXBsYXRlJykgPyAkdmlkZW8uZGF0YShcclxuICAgICAgICAgICAgJ2N0YVRlbXBsYXRlJykgOiAnJztcclxuXHJcbiAgICAgICAgICAvLyBTdG9yZSBJRCdzIGZvciBhbGwgdmlkZW8ncyBvbiB0aGUgcGFnZSAtIGluIGNhc2Ugd2Ugd2FudCB0byBydW4gYSBwb3N0LWxvYWQgcHJvY2VzcyBvbiBlYWNoXHJcbiAgICAgICAgICB2aWRlb0lEcy5wdXNoKGRhdGEuaWQpO1xyXG5cclxuICAgICAgICAgIC8vIExldCdzIHJlcGxhY2UgdGhlIGlnLXZpZGVvLWpzICdkaXJlY3RpdmUnIHdpdGggdGhlIG5lY2Vzc2FyeSBCcmlnaHRjb3ZlIGNvZGVcclxuICAgICAgICAgIF9pbmplY3RUZW1wbGF0ZShkYXRhLCBpbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIE9ubHkgaW5qZWN0IEJyaWdodGNvdmUgSlMgaWYgbW9kZXJuIGJyb3dzZXJcclxuICAgICAgaWYgKCFpZy5vbGRJRSkge1xyXG4gICAgICAgIGluamVjdEJyaWdodENvdmVKUyhkYXRhKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2luamVjdFRlbXBsYXRlKGRhdGEsIGluZGV4KSB7XHJcbiAgICB2YXIgdHJhbnNjcmlwdFRleHQgPSB7ICdlbic6ICdUcmFuc2NyaXB0JywgJ2ZyJzogJ1RyYW5zY3JpcHRpb24nIH0sXHJcbiAgICAgIGh0bWwgPSBgPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lciAke2RhdGEuaWR9XCI+PGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lci1yZXNwb25zaXZlXCI+YDtcclxuXHJcbiAgICBpZiAoZGF0YS5jdGFUZW1wbGF0ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGh0bWwgKz0gYDxzcGFuIGNsYXNzPVwidmlkZW8tY3RhXCI+JHtkYXRhLmN0YVRlbXBsYXRlfTwvc3Bhbj5gO1xyXG4gICAgfVxyXG4gICAgaWYgKGRhdGEub3ZlcmxheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGh0bWwgKz0gYDxzcGFuIGNsYXNzPVwidmlkZW8tb3ZlcmxheVwiIHN0eWxlPVwiYmFja2dyb3VuZC1pbWFnZTogdXJsKCcke2RhdGEub3ZlcmxheX0nKTtcIj48L3NwYW4+YDtcclxuICAgIH1cclxuICAgIGh0bWwgKz0gYDx2aWRlbyBkYXRhLXNldHVwPSd7XCJ0ZWNoT3JkZXJcIjogW1wiaHRtbDVcIl19JyBkYXRhLXZpZGVvLWlkPVwiJHtkYXRhLmlkfVwiIHByZWxvYWQ9XCIke2RhdGEucHJlbG9hZH1cIiBkYXRhLWFjY291bnQ9XCIzOTA2OTQyODYxMDAxXCIgZGF0YS1wbGF5ZXI9XCIke2RhdGEucGxheWVyfVwiIGRhdGEtZW1iZWQ9XCJkZWZhdWx0XCIgZGF0YS1hcHBsaWNhdGlvbi1pZD1cIiR7aW5kZXh9XCIgY2xhc3M9XCJ2aWRlby1qc1wiIGlkPVwiJHtkYXRhLmlkfVwiIGNvbnRyb2xzICR7ZGF0YS5hdXRvfT48L3ZpZGVvPjwvZGl2PmA7XHJcbiAgICBpZiAoZGF0YS50cmFuc2NyaXB0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgaHRtbCArPSBgPGRpdiBjbGFzcz1cInZpZGVvLXRyYW5zY3JpcHRcIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJHtkYXRhLnRyYW5zY3JpcHR9XCI+JHt0cmFuc2NyaXB0VGV4dFtpZy5sYW5nXX08L2E+PC9kaXY+YDtcclxuICAgIH1cclxuICAgIGh0bWwgKz0gYDwvZGl2PjxoMiBjbGFzcz1cInZpZGVvLXRpdGxlXCI+JHtkYXRhLnRpdGxlfTwvaDI+PHAgY2xhc3M9XCJ2aWRlby1kZXNjcmlwdGlvblwiPiR7ZGF0YS5kZXNjcmlwdGlvbn08L3A+YDtcclxuICAgICR2aWRlbyA9ICR2aWRlby5yZXBsYWNlV2l0aChodG1sKTtcclxuXHJcbiAgICBpZiAoZGF0YS5vdmVybGF5KSB7XHJcbiAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcjJyArIGRhdGEuaWQsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcudmlkZW8tb3ZlcmxheScpLmhpZGUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfaW5qZWN0SWZyYW1lKGRhdGEpIHtcclxuICAgIHZhciBodG1sID0gYDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lci1yZXNwb25zaXZlXCI+XHJcbiAgICAgIDxpZnJhbWUgY2xhc3M9XCJ2aWRlby1qc1wiIHNyYz0nLy9wbGF5ZXJzLmJyaWdodGNvdmUubmV0LzM5MDY5NDI4NjEwMDEvJHtkYXRhLnBsYXllcn1fZGVmYXVsdC9pbmRleC5odG1sP3ZpZGVvSWQ9JHtkYXRhLmlkfSdcclxuICAgIGFsbG93ZnVsbHNjcmVlbiB3ZWJraXRhbGxvd2Z1bGxzY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8L2Rpdj48aDIgY2xhc3M9XCJ2aWRlby10aXRsZVwiPiR7ZGF0YS50aXRsZX08L2gyPjxwIGNsYXNzPVwidmlkZW8tZGVzY3JpcHRpb25cIj4ke2RhdGEuZGVzY3JpcHRpb259PC9wPmA7XHJcbiAgICAkdmlkZW8gPSAkdmlkZW8ucmVwbGFjZVdpdGgoaHRtbCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbmplY3RCcmlnaHRDb3ZlSlMoZGF0YSkge1xyXG4gICAgdmFyIGluZGV4anMgPSBgPHNjcmlwdCBzcmM9XCIvL3BsYXllcnMuYnJpZ2h0Y292ZS5uZXQvMzkwNjk0Mjg2MTAwMS8ke2RhdGEucGxheWVyfV9kZWZhdWx0L2luZGV4Lm1pbi5qc1wiPjwvc2NyaXB0PmA7XHJcbiAgICAkKCdib2R5JykuYXBwZW5kKGluZGV4anMpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2JyaWdodENvdmVSZWFkeSgpIHtcclxuICAgIHZhciBwbGF5ZXI7XHJcbiAgICB2aWRlb0lEcy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICB2aWRlb2pzKCcjJyArIGVsKS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gYXNzaWduIHRoaXMgcGxheWVyIHRvIGEgdmFyaWFibGVcclxuICAgICAgICBwbGF5ZXIgPSB0aGlzO1xyXG4gICAgICAgIC8vIGFzc2lnbiBhbiBldmVudCBsaXN0ZW5lciBmb3IgcGxheSBldmVudFxyXG4gICAgICAgIHBsYXllci5vbigncGxheScsIF9vblBsYXkpO1xyXG4gICAgICAgIC8vIGFzc2lnbiBhbiBldmVudCBsaXN0ZW5lciBmb3IgZW5kZWQgZXZlbnRcclxuICAgICAgICBwbGF5ZXIub24oJ2VuZGVkJywgX29uQ29tcGxldGUpO1xyXG4gICAgICAgIC8vIHB1c2ggdGhlIHBsYXllciB0byB0aGUgcGxheWVycyBhcnJheVxyXG4gICAgICAgIHBsYXllcnMucHVzaChwbGF5ZXIpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX29uUGxheShlKSB7XHJcbiAgICAvLyBkZXRlcm1pbmUgd2hpY2ggcGxheWVyIHRoZSBldmVudCBpcyBjb21pbmcgZnJvbVxyXG4gICAgdmFyIGlkID0gZS50YXJnZXQuaWQ7XHJcbiAgICAvLyBnbyB0aHJvdWdoIHBsYXllcnNcclxuICAgIHBsYXllcnMuZm9yRWFjaChmdW5jdGlvbiAocGxheWVyKSB7XHJcbiAgICAgIGlmIChwbGF5ZXIuaWQoKSAhPT0gaWQpIHtcclxuICAgICAgICAvLyBwYXVzZSB0aGUgb3RoZXIgcGxheWVyKHMpXHJcbiAgICAgICAgdmlkZW9qcyhwbGF5ZXIuaWQoKSkucGF1c2UoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfb25Db21wbGV0ZShlKSB7XHJcbiAgICAkKCcuJyArIGUudGFyZ2V0LmlkKS5hZGRDbGFzcygnY29tcGxldGUnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF92aWV3U3RhdHVzKCkge1xyXG4gICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHBsYXllcnMuZm9yRWFjaChmdW5jdGlvbiAocGxheWVyKSB7XHJcbiAgICAgICAgaWYgKCEkKCcjJyArIHBsYXllci5pZCgpKS52aXNpYmxlKCkpIHtcclxuICAgICAgICAgIHZpZGVvanMocGxheWVyLmlkKCkpLnBhdXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXQsXHJcbiAgfTtcclxufSkoKTsiLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgX3NlYXJjaExlZ2FjeUNvZGUoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9zZWFyY2hMZWdhY3lDb2RlKCkge1xyXG5cclxuLy8gR0xPQkFMU1xyXG4gICAgdmFyIG1vZGVsVXJsID0gJ2h0dHBzOi8vc2VhcmNoLmludmVzdG9yc2dyb3VwLmNvbS9hcGkvY3dwc2VhcmNoPyc7XHJcbiAgICB2YXIgJGZpZWxkID0gJCgnI0ZpbmRBbk9mZmljZScpO1xyXG4gICAgdmFyIGxhbmcgPSAnZW4nO1xyXG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJy9mci8nKSA+IC0xKSB7XHJcbiAgICAgIGxhbmcgPSAnZnInO1xyXG4gICAgfVxyXG5cclxuLy8gUHJvY2VzcyB0aGUgbG9jYWwgcHJlZmV0Y2hlZCBkYXRhXHJcbiAgICB2YXIgc3VnZ2VzdGlvbnMgPSB7fTtcclxuICAgIHZhciBjaXRpZXMgPSBbXHJcbiAgICAgIFwiYXRoYWJhc2NhXCIsXHJcbiAgICAgIFwiYmx1ZmZ0b25cIixcclxuICAgICAgXCJib25ueXZpbGxlXCIsXHJcbiAgICAgIFwiYnJvb2tzXCIsXHJcbiAgICAgIFwiY2FsZ2FyeVwiLFxyXG4gICAgICBcImNhbXJvc2VcIixcclxuICAgICAgXCJjYW5tb3JlXCIsXHJcbiAgICAgIFwiZHJheXRvbiB2YWxsZXlcIixcclxuICAgICAgXCJlZG1vbnRvblwiLFxyXG4gICAgICBcImZvcnQgbWNtdXJyYXlcIixcclxuICAgICAgXCJmb3J0IHNhc2thdGNoZXdhblwiLFxyXG4gICAgICBcImdyYW5kZSBwcmFpcmllXCIsXHJcbiAgICAgIFwiaGFsa2lya1wiLFxyXG4gICAgICBcImhpbGxjcmVzdCBtaW5lc1wiLFxyXG4gICAgICBcImhpbnRvblwiLFxyXG4gICAgICBcImxlZHVjXCIsXHJcbiAgICAgIFwibGV0aGJyaWRnZVwiLFxyXG4gICAgICBcImxsb3lkbWluc3RlclwiLFxyXG4gICAgICBcIm1lZGljaW5lIGhhdFwiLFxyXG4gICAgICBcIm1vcmludmlsbGVcIixcclxuICAgICAgXCJwZWFjZSByaXZlclwiLFxyXG4gICAgICBcInBpbmNoZXIgY3JlZWtcIixcclxuICAgICAgXCJwcm92b3N0XCIsXHJcbiAgICAgIFwicmVkIGRlZXJcIixcclxuICAgICAgXCJzaGVyd29vZCBwYXJrXCIsXHJcbiAgICAgIFwic3BydWNlIGdyb3ZlXCIsXHJcbiAgICAgIFwic3QuIGFsYmVydFwiLFxyXG4gICAgICBcInN0ZXR0bGVyXCIsXHJcbiAgICAgIFwic3R1cmdlb24gY291bnR5XCIsXHJcbiAgICAgIFwidG9maWVsZFwiLFxyXG4gICAgICBcInZlcm1pbGlvblwiLFxyXG4gICAgICBcIndhaW53cmlnaHRcIixcclxuICAgICAgXCJ3ZXN0bG9ja1wiLFxyXG4gICAgICBcIndoaXRlbGF3XCIsXHJcbiAgICAgIFwiYWJib3RzZm9yZFwiLFxyXG4gICAgICBcImJyYWNrZW5kYWxlXCIsXHJcbiAgICAgIFwiYnVybmFieVwiLFxyXG4gICAgICBcImJ1cm5zIGxha2VcIixcclxuICAgICAgXCJjYW1wYmVsbCByaXZlclwiLFxyXG4gICAgICBcImNoYXNlXCIsXHJcbiAgICAgIFwiY2hpbGxpd2Fja1wiLFxyXG4gICAgICBcImNvbW94XCIsXHJcbiAgICAgIFwiY29xdWl0bGFtXCIsXHJcbiAgICAgIFwiY291cnRlbmF5XCIsXHJcbiAgICAgIFwiY3JhbmJyb29rXCIsXHJcbiAgICAgIFwiZGF3c29uIGNyZWVrXCIsXHJcbiAgICAgIFwiZHVuY2FuXCIsXHJcbiAgICAgIFwiZm9ydCBuZWxzb25cIixcclxuICAgICAgXCJmb3J0IHN0LiBqb2huXCIsXHJcbiAgICAgIFwiaW52ZXJtZXJlXCIsXHJcbiAgICAgIFwia2FtbG9vcHNcIixcclxuICAgICAgXCJrZWxvd25hXCIsXHJcbiAgICAgIFwibGFuZ2xleVwiLFxyXG4gICAgICBcIm1lcnJpdHRcIixcclxuICAgICAgXCJuYW5haW1vXCIsXHJcbiAgICAgIFwibmVsc29uXCIsXHJcbiAgICAgIFwibm9ydGggdmFuY291dmVyXCIsXHJcbiAgICAgIFwib2xpdmVyXCIsXHJcbiAgICAgIFwicGVudGljdG9uXCIsXHJcbiAgICAgIFwicG9ydCBhbGJlcm5pXCIsXHJcbiAgICAgIFwicG93ZWxsIHJpdmVyXCIsXHJcbiAgICAgIFwicHJpbmNlIGdlb3JnZVwiLFxyXG4gICAgICBcInF1YWxpY3VtIGJlYWNoXCIsXHJcbiAgICAgIFwicXVlc25lbFwiLFxyXG4gICAgICBcInJldmVsc3Rva2VcIixcclxuICAgICAgXCJyaWNobW9uZFwiLFxyXG4gICAgICBcInNhYW5pY2h0b25cIixcclxuICAgICAgXCJzYWxtb24gYXJtXCIsXHJcbiAgICAgIFwic2FsdCBzcHJpbmcgaXNsYW5kXCIsXHJcbiAgICAgIFwic2VjaGVsdFwiLFxyXG4gICAgICBcInNpZG5leVwiLFxyXG4gICAgICBcInNtaXRoZXJzXCIsXHJcbiAgICAgIFwic3VycmV5XCIsXHJcbiAgICAgIFwidGVycmFjZVwiLFxyXG4gICAgICBcInRyYWlsXCIsXHJcbiAgICAgIFwidmFuY291dmVyXCIsXHJcbiAgICAgIFwidmVybm9uXCIsXHJcbiAgICAgIFwidmljdG9yaWFcIixcclxuICAgICAgXCJ3ZXN0YmFua1wiLFxyXG4gICAgICBcIndpbGxpYW1zIGxha2VcIixcclxuICAgICAgXCJicmFuZG9uXCIsXHJcbiAgICAgIFwiZGF1cGhpblwiLFxyXG4gICAgICBcImZsaW4gZmxvblwiLFxyXG4gICAgICBcImdpbGxhbVwiLFxyXG4gICAgICBcImtpbGxhcm5leVwiLFxyXG4gICAgICBcIm1hbml0b3VcIixcclxuICAgICAgXCJtaWFtaVwiLFxyXG4gICAgICBcIm1vcmRlblwiLFxyXG4gICAgICBcIm5hcm9sXCIsXHJcbiAgICAgIFwicG9ydGFnZSBsYSBwcmFpcmllXCIsXHJcbiAgICAgIFwic2Vsa2lya1wiLFxyXG4gICAgICBcInN3YW4gcml2ZXJcIixcclxuICAgICAgXCJ0aGUgcGFzXCIsXHJcbiAgICAgIFwidmlyZGVuXCIsXHJcbiAgICAgIFwid2FycmVuXCIsXHJcbiAgICAgIFwid2lubmlwZWdcIixcclxuICAgICAgXCJiYXRodXJzdFwiLFxyXG4gICAgICBcImJlZGVsbFwiLFxyXG4gICAgICBcImVkbXVuZHN0b25cIixcclxuICAgICAgXCJmcmVkZXJpY3RvblwiLFxyXG4gICAgICBcImxhbnNkb3duZVwiLFxyXG4gICAgICBcIm1pcmFtaWNoaVwiLFxyXG4gICAgICBcIm1vbmN0b25cIixcclxuICAgICAgXCJxdWlzcGFtc2lzXCIsXHJcbiAgICAgIFwicmV4dG9uXCIsXHJcbiAgICAgIFwicm90aGVzYXlcIixcclxuICAgICAgXCJzYWludCBqb2huXCIsXHJcbiAgICAgIFwic2FpbnQgcGF1bFwiLFxyXG4gICAgICBcInN1c3NleFwiLFxyXG4gICAgICBcImJsYWtldG93blwiLFxyXG4gICAgICBcImNsYXJlbnZpbGxlXCIsXHJcbiAgICAgIFwiY29ybmVyIGJyb29rXCIsXHJcbiAgICAgIFwiZ2FuZGVyXCIsXHJcbiAgICAgIFwiZ3JhbmQgZmFsbHMgLSB3aW5kc29yXCIsXHJcbiAgICAgIFwibWFyeXN0b3duXCIsXHJcbiAgICAgIFwicm9hY2hlcyBsaW5lXCIsXHJcbiAgICAgIFwic3QuIGpvaG4nc1wiLFxyXG4gICAgICBcInRyaW5pdHlcIixcclxuICAgICAgXCJhbWhlcnN0XCIsXHJcbiAgICAgIFwiYW50aWdvbmlzaFwiLFxyXG4gICAgICBcImJhcnJpbmd0b24gcGFzc2FnZVwiLFxyXG4gICAgICBcImJlbGxpdmVhdSBjb3ZlXCIsXHJcbiAgICAgIFwiYnJpZGdldG93blwiLFxyXG4gICAgICBcImJyaWRnZXdhdGVyXCIsXHJcbiAgICAgIFwiZGFydG1vdXRoXCIsXHJcbiAgICAgIFwiZGF5dG9uXCIsXHJcbiAgICAgIFwiaGFsaWZheFwiLFxyXG4gICAgICBcIm1pZGRsZXRvblwiLFxyXG4gICAgICBcIm5ldyBnbGFzZ293XCIsXHJcbiAgICAgIFwibmV3IG1pbmFzXCIsXHJcbiAgICAgIFwibm9ydGggc3lkbmV5XCIsXHJcbiAgICAgIFwicGljdG91XCIsXHJcbiAgICAgIFwicG9ydCBoYXdrZXNidXJ5XCIsXHJcbiAgICAgIFwic3lkbmV5XCIsXHJcbiAgICAgIFwidHJ1cm9cIixcclxuICAgICAgXCJ5ZWxsb3drbmlmZVwiLFxyXG4gICAgICBcImFqYXhcIixcclxuICAgICAgXCJhbGdvbnF1aW4gaGlnaGxhbmRzXCIsXHJcbiAgICAgIFwiYW5jYXN0ZXJcIixcclxuICAgICAgXCJhdGlrb2thblwiLFxyXG4gICAgICBcImJhcnJpZVwiLFxyXG4gICAgICBcImJlbGxldmlsbGVcIixcclxuICAgICAgXCJib3dtYW52aWxsZVwiLFxyXG4gICAgICBcImJyYWNlYnJpZGdlXCIsXHJcbiAgICAgIFwiYnJhbXB0b25cIixcclxuICAgICAgXCJicmFudGZvcmRcIixcclxuICAgICAgXCJicm9ja3ZpbGxlXCIsXHJcbiAgICAgIFwiYnJvb2tsaW5cIixcclxuICAgICAgXCJidXJsaW5ndG9uXCIsXHJcbiAgICAgIFwiY2FtYnJpZGdlXCIsXHJcbiAgICAgIFwiY2FybGV0b24gcGxhY2VcIixcclxuICAgICAgXCJjaGF0aGFtXCIsXHJcbiAgICAgIFwiY2xheXRvblwiLFxyXG4gICAgICBcImNsaW50b25cIixcclxuICAgICAgXCJjb2JvdXJnXCIsXHJcbiAgICAgIFwiY29sbGluZ3dvb2RcIixcclxuICAgICAgXCJjb25jb3JkXCIsXHJcbiAgICAgIFwiY29ybndhbGxcIixcclxuICAgICAgXCJkcnlkZW5cIixcclxuICAgICAgXCJkdW5kYXNcIixcclxuICAgICAgXCJkdW5zZm9yZFwiLFxyXG4gICAgICBcImR1dHRvblwiLFxyXG4gICAgICBcImVsbGlvdCBsYWtlXCIsXHJcbiAgICAgIFwiZXRvYmljb2tlXCIsXHJcbiAgICAgIFwiZm9ydCBmcmFuY2VzXCIsXHJcbiAgICAgIFwiZ2FuYW5vcXVlXCIsXHJcbiAgICAgIFwiZ2Fyc29uXCIsXHJcbiAgICAgIFwiZ3JlZWx5XCIsXHJcbiAgICAgIFwiZ3JpbXNieVwiLFxyXG4gICAgICBcImd1ZWxwaFwiLFxyXG4gICAgICBcImhhaWxleWJ1cnlcIixcclxuICAgICAgXCJoYW1pbHRvblwiLFxyXG4gICAgICBcImhhbm92ZXJcIixcclxuICAgICAgXCJoZWFyc3RcIixcclxuICAgICAgXCJodW50c3ZpbGxlXCIsXHJcbiAgICAgIFwiamVyc2V5dmlsbGVcIixcclxuICAgICAgXCJrYW5hdGFcIixcclxuICAgICAgXCJrYXB1c2thc2luZ1wiLFxyXG4gICAgICBcImtlbm9yYVwiLFxyXG4gICAgICBcImtpbmdzdG9uXCIsXHJcbiAgICAgIFwia2lya2xhbmQgbGFrZVwiLFxyXG4gICAgICBcImtpdGNoZW5lclwiLFxyXG4gICAgICBcImxhbmd0b25cIixcclxuICAgICAgXCJsaW5kc2F5XCIsXHJcbiAgICAgIFwibG9uZG9uXCIsXHJcbiAgICAgIFwibWFwbGVcIixcclxuICAgICAgXCJtYXJhdGhvblwiLFxyXG4gICAgICBcIm1hcmtoYW1cIixcclxuICAgICAgXCJtZXJyaWNrdmlsbGVcIixcclxuICAgICAgXCJtaWx0b25cIixcclxuICAgICAgXCJtaW5kZW5cIixcclxuICAgICAgXCJtaXNzaXNzYXVnYVwiLFxyXG4gICAgICBcIm1vdW50IGZvcmVzdFwiLFxyXG4gICAgICBcIm1vdW50IGhvcGVcIixcclxuICAgICAgXCJuZXBlYW5cIixcclxuICAgICAgXCJuZXcgbGlza2VhcmRcIixcclxuICAgICAgXCJuZXdtYXJrZXRcIixcclxuICAgICAgXCJuaWFnYXJhIGZhbGxzXCIsXHJcbiAgICAgIFwibm9ydGggYmF5XCIsXHJcbiAgICAgIFwibm9ydGggeW9ya1wiLFxyXG4gICAgICBcIm9hayByaWRnZXNcIixcclxuICAgICAgXCJvYWt2aWxsZVwiLFxyXG4gICAgICBcIm9yYW5nZXZpbGxlXCIsXHJcbiAgICAgIFwib3JpbGxpYVwiLFxyXG4gICAgICBcIm9ydG9uXCIsXHJcbiAgICAgIFwib3NoYXdhXCIsXHJcbiAgICAgIFwib3R0YXdhXCIsXHJcbiAgICAgIFwib3dlbiBzb3VuZFwiLFxyXG4gICAgICBcInBhcnJ5IHNvdW5kXCIsXHJcbiAgICAgIFwicGVtYnJva2VcIixcclxuICAgICAgXCJwZW5ldGFuZ3Vpc2hlbmVcIixcclxuICAgICAgXCJwZXJ0aFwiLFxyXG4gICAgICBcInBldGVyYm9yb3VnaFwiLFxyXG4gICAgICBcInBldHJvbGlhXCIsXHJcbiAgICAgIFwicGlja2VyaW5nXCIsXHJcbiAgICAgIFwicmVkIGxha2VcIixcclxuICAgICAgXCJyaWRnZXRvd25cIixcclxuICAgICAgXCJzYXJuaWFcIixcclxuICAgICAgXCJzYXVsdCBzdGUuIG1hcmllXCIsXHJcbiAgICAgIFwic2NhcmJvcm91Z2hcIixcclxuICAgICAgXCJzY2hyZWliZXJcIixcclxuICAgICAgXCJzaW1jb2VcIixcclxuICAgICAgXCJzaW91eCBsb29rb3V0XCIsXHJcbiAgICAgIFwic3QuIGNhdGhhcmluZXNcIixcclxuICAgICAgXCJzdC4gbWFyeXNcIixcclxuICAgICAgXCJzdG91ZmZ2aWxsZVwiLFxyXG4gICAgICBcInN0cmF0Zm9yZFwiLFxyXG4gICAgICBcInN0dXJnZW9uIGZhbGxzXCIsXHJcbiAgICAgIFwic3VkYnVyeVwiLFxyXG4gICAgICBcInN1bmRyaWRnZVwiLFxyXG4gICAgICBcInRodW5kZXIgYmF5XCIsXHJcbiAgICAgIFwidGlsbHNvbmJ1cmdcIixcclxuICAgICAgXCJ0aW1taW5zXCIsXHJcbiAgICAgIFwidG9yb250b1wiLFxyXG4gICAgICBcInRyZW50b25cIixcclxuICAgICAgXCJVeGJyaWRnZVwiLFxyXG4gICAgICBcInZhbCBjYXJvblwiLFxyXG4gICAgICBcIndhbGtlcnRvblwiLFxyXG4gICAgICBcIndhdGVybG9vXCIsXHJcbiAgICAgIFwid2VsbGFuZFwiLFxyXG4gICAgICBcIndoaXRieVwiLFxyXG4gICAgICBcIndpbGxvd2RhbGVcIixcclxuICAgICAgXCJ3aW5kc29yXCIsXHJcbiAgICAgIFwid2luZ2hhbVwiLFxyXG4gICAgICBcIndvb2RicmlkZ2VcIixcclxuICAgICAgXCJjaGFybG90dGV0b3duLCBwZVwiLFxyXG4gICAgICBcInNvdXJpcywgcGVcIixcclxuICAgICAgXCJzdW1tZXJzaWRlLCBwZVwiLFxyXG4gICAgICBcIndlbGxpbmd0b25cIixcclxuICAgICAgXCJhbmpvdVwiLFxyXG4gICAgICBcImJvaXNicmlhbmRcIixcclxuICAgICAgXCJib3VjaGVydmlsbGVcIixcclxuICAgICAgXCJicm9zc2FyZFwiLFxyXG4gICAgICBcImNow6J0ZWF1Z3VheVwiLFxyXG4gICAgICBcImNoaWNvdXRpbWlcIixcclxuICAgICAgXCJjw7R0ZSBzYWludC1sdWNcIixcclxuICAgICAgXCJkb2xsYXJkLWRlcy1vcm1lYXV4XCIsXHJcbiAgICAgIFwiZ2F0aW5lYXVcIixcclxuICAgICAgXCJncmFuYnlcIixcclxuICAgICAgXCJsYXZhbFwiLFxyXG4gICAgICBcImzDqXZpc1wiLFxyXG4gICAgICBcIm1pcmFiZWxcIixcclxuICAgICAgXCJtb250cmVhbFwiLFxyXG4gICAgICBcIm5ldyByaWNobW9uZFwiLFxyXG4gICAgICBcInBvaW50ZS1jbGFpcmVcIixcclxuICAgICAgXCJxdcOpYmVjXCIsXHJcbiAgICAgIFwic2VwdC1pbGVzXCIsXHJcbiAgICAgIFwic2hlcmJyb29rZVwiLFxyXG4gICAgICBcInZpbGxlIHN0LWxhdXJlbnRcIixcclxuICAgICAgXCJ3ZXN0bW91bnRcIixcclxuICAgICAgXCJlYXN0ZW5kXCIsXHJcbiAgICAgIFwiZXN0ZXZhblwiLFxyXG4gICAgICBcImVzdGVyaGF6eVwiLFxyXG4gICAgICBcImZvYW0gbGFrZVwiLFxyXG4gICAgICBcImh1bWJvbGR0XCIsXHJcbiAgICAgIFwia2luZGVyc2xleVwiLFxyXG4gICAgICBcImxlYWRlclwiLFxyXG4gICAgICBcIm1hcGxlIGNyZWVrXCIsXHJcbiAgICAgIFwibWVhZG93IGxha2VcIixcclxuICAgICAgXCJtZWxmb3J0XCIsXHJcbiAgICAgIFwibWVsdmlsbGVcIixcclxuICAgICAgXCJtb29zZSBqYXdcIixcclxuICAgICAgXCJub3J0aCBiYXR0bGVmb3JkXCIsXHJcbiAgICAgIFwib3V0bG9va1wiLFxyXG4gICAgICBcIm94Ym93XCIsXHJcbiAgICAgIFwicHJpbmNlIGFsYmVydFwiLFxyXG4gICAgICBcInJlZ2luYVwiLFxyXG4gICAgICBcInJlZ2luYSBiZWFjaFwiLFxyXG4gICAgICBcInJvc2V0b3duXCIsXHJcbiAgICAgIFwic2Fza2F0b29uXCIsXHJcbiAgICAgIFwic2hlbGxicm9va1wiLFxyXG4gICAgICBcInN3aWZ0IGN1cnJlbnRcIixcclxuICAgICAgXCJ3YXRyb3VzXCIsXHJcbiAgICAgIFwid2F0c29uXCIsXHJcbiAgICAgIFwieW9ya3RvblwiLFxyXG4gICAgICBcIndoaXRlaG9yc2VcIlxyXG4gICAgXTtcclxuICAgIHN1Z2dlc3Rpb25zLmxvY2F0aW9ucyA9IG5ldyBCbG9vZGhvdW5kKHtcclxuICAgICAgZGF0dW1Ub2tlbml6ZXI6IEJsb29kaG91bmQudG9rZW5pemVycy53aGl0ZXNwYWNlLFxyXG4gICAgICBxdWVyeVRva2VuaXplcjogQmxvb2Rob3VuZC50b2tlbml6ZXJzLndoaXRlc3BhY2UsXHJcbiAgICAgIGxvY2FsOiBjaXRpZXNcclxuICAgIH0pO1xyXG5cclxuLy8gR2V0IHRoZSByZXN1bHRzXHJcbiAgICBmdW5jdGlvbiBnZXRTZWFyY2hSZXN1bHRzKHBhcmFtcykge1xyXG4gICAgICBwYXJhbXMuc2VhcmNodHlwZSA9ICdvZmZpY2UnO1xyXG4gICAgICBwYXJhbXMubmFtZSA9ICcnO1xyXG5cclxuICAgICAgLy8gTWFrZSBzdXJlIGVycm9yIG1lc3NhZ2UgaXMgaGlkZGVuIGVhY2ggdGltZVxyXG4gICAgICAkKCcuemVyby1yZXN1bHRzJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHJcbiAgICAgICQuZ2V0SlNPTihtb2RlbFVybCwgcGFyYW1zKVxyXG4gICAgICAgIC5hbHdheXMoKVxyXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICAgICAgJCgnI3NlYXJjaFJlc3VsdHNNb2RhbCcpLnJlbW92ZUNsYXNzKCdjbG9zZWQnKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgZGlzcGxheVNlYXJjaFJlc3VsdHMoJ29mZmljZS10ZW1wbGF0ZScsIHJlc3VsdCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCcuemVyby1yZXN1bHRzJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdEYXRhIGNvdWxkIG5vdCBiZSByZXRyaWV2ZWQsIHBsZWFzZSB0cnkgYWdhaW4nLCByZXN1bHQuc3RhdHVzICsgJyAnICsgcmVzdWx0LnN0YXR1c1RleHQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbi8vIEJlY2F1c2Ugd2UgYXJlIG9ubHkgc2VhcmNoaW5nIGZvciBjaXRpZXMsIHRoaXMgZnVuY3Rpb24gaXMgc2xpZ2h0bHkgcmVkdW5kYW50IC0gbGVhdmluZyBpdCBpbiBwbGFjZSBmb3Igbm93XHJcbiAgICBmdW5jdGlvbiBwYXJzZVNlYXJjaFN0cmluZygpIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICB2YXIgc2VhcmNoID0gJGZpZWxkLnZhbCgpO1xyXG5cclxuICAgICAgcmVzdWx0LmNpdHkgPSAnJztcclxuXHJcbiAgICAgIC8vIFNlYXJjaCBpbiB0aGUgbGFuZ3VhZ2Ugb2YgdGhlIHBhZ2VcclxuICAgICAgcmVzdWx0LmxhbmcgPSBsYW5nO1xyXG4gICAgICAvLyBXZSBvbmx5IHNlYXJjaCBjb25zdWx0YW50cyBmcm9tIHRoaXMgbWV0aG9kXHJcbiAgICAgIHJlc3VsdC5zZWFyY2h0eXBlID0gJ2Nvbic7XHJcblxyXG4gICAgICAvLyBDaGVjayB0aGUgc2VhcmNoIHN0cmluZyBmb3IgYSBwcmV2aW91c2x5IGRlZmluZWQgbG9jYXRpb25cclxuICAgICAgdmFyIHdvcmRzID0gc2VhcmNoLnNwbGl0KCcgJyk7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyBDaGVjayBlYWNoIHdvcmQgZm9yIGEgY2l0eSBmcm9tIHRoZSBwcmVkZWZpbmVkIGxpc3RcclxuICAgICAgICB2YXIgY2l0eSA9IHN1Z2dlc3Rpb25zLmxvY2F0aW9ucy5nZXQod29yZHNbaV0pO1xyXG4gICAgICAgIGlmIChjaXR5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJlc3VsdC5jaXR5ID0gY2l0eVswXTtcclxuICAgICAgICAgIHdvcmRzLnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghcmVzdWx0LmNpdHkpIHtcclxuICAgICAgICByZXN1bHQuY2l0eSA9IHdvcmRzLmpvaW4oJyAnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkaXNwbGF5U2VhcmNoUmVzdWx0cyh0ZW1wbGF0ZUlELCBqc29uKSB7XHJcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSUQpLmlubmVySFRNTDtcclxuICAgICAgTXVzdGFjaGUucGFyc2UodGVtcGxhdGUpO1xyXG4gICAgICB2YXIgcmVuZGVyZWQgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIGpzb24pO1xyXG4gICAgICAkKCcjc2VhcmNoUmVzdWx0c01vZGFsJykuYXBwZW5kKHJlbmRlcmVkKTtcclxuICAgICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuLy9Jbml0IGV2ZXJ5dGhpbmdcclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBUcnkgdG8gcHJlZGV0ZXJtaW5lIHdoYXQgcmVzdWx0cyBzaG91bGQgc2hvd1xyXG4gICAgICAvLyBTZXR1cCB0aGUgdHlwZWFoZWFkXHJcbiAgICAgICQoJy50eXBlYWhlYWQnKS50eXBlYWhlYWQoe1xyXG4gICAgICAgICAgaGlnaGxpZ2h0OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7bmFtZTogJ2xvY2F0aW9ucycsIHNvdXJjZTogc3VnZ2VzdGlvbnMubG9jYXRpb25zLCBsaW1pdDogMn1cclxuICAgICAgKTtcclxuXHJcbiAgICAgIC8vIFNldHVwIHRoZSBmb3JtIHN1Ym1pc3Npb25cclxuICAgICAgJCgnLmlnLXNlYXJjaCcpLnN1Ym1pdChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXIgcGFyYW1zID0gcGFyc2VTZWFyY2hTdHJpbmcoKTtcclxuICAgICAgICBnZXRTZWFyY2hSZXN1bHRzKHBhcmFtcyk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gRmFrZSBtb2RhbCAtIEFkZGluZyBoYW5kbGVyIG9uIGRvY3VtZW50IHNvIGl0IGZpcmVzIGRlc3BpdGUgdGhlIGJ1dHRvbiBub3QgYmVpbmcgcmVuZGVyZWQgeWV0XHJcbiAgICAgICQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCIjc2VhcmNoUmVzdWx0c01vZGFsIC5jbG9zZS1idXR0b25cIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJyNzZWFyY2hSZXN1bHRzTW9kYWwnKS5hZGRDbGFzcygnY2xvc2VkJyk7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2lzLXJldmVhbC1vcGVuJyk7XHJcbiAgICAgICAgfSwgNDAwKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcblxuXHRsZXQgZGlyZWN0Q2FsbFJ1bGUgPSAnbW9kYWxfY2xpY2snO1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0Ly8gJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5nYS1jYXJlZXJzLWNpdHktc2VhcmNoLCAuZ2EtY2FyZWVycy1sZWFybi1tb3JlJywgZnVuY3Rpb24gKCkge1xuXHRcdC8vIFx0d2luZG93Ll9zYXRlbGxpdGUgPSB3aW5kb3cuX3NhdGVsbGl0ZSB8fCB7fTtcblx0XHQvLyBcdHdpbmRvdy5fc2F0ZWxsaXRlLnRyYWNrID0gd2luZG93Ll9zYXRlbGxpdGUudHJhY2sgfHwgZnVuY3Rpb24oKXt9O1xuXHRcdC8vIFx0X3NhdGVsbGl0ZS50cmFjayhkaXJlY3RDYWxsUnVsZSk7XG5cdFx0Ly8gfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmdhLWNhcmVlcnMtY2l0eS1zZWFyY2gsIC5nYS1jYXJlZXJzLWxlYXJuLW1vcmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJCgnYm9keS5pcy1yZXZlYWwtb3BlbicpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB3aW5kb3cuX3NhdGVsbGl0ZSA9IHdpbmRvdy5fc2F0ZWxsaXRlIHx8IHt9O1xuICAgICAgICAgIHdpbmRvdy5fc2F0ZWxsaXRlLnRyYWNrID0gd2luZG93Ll9zYXRlbGxpdGUudHJhY2sgfHwgZnVuY3Rpb24oKXt9O1xuICAgICAgICAgIF9zYXRlbGxpdGUudHJhY2soZGlyZWN0Q2FsbFJ1bGUpO1xuICAgICAgICB9XG4gICAgICB9LCAxNTAwKTtcbiAgICB9KTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdFxuXHR9O1xufSkoKVxuXG5cbiIsIi8qIFRoaXMgZmlsZSBpcyB0aGUgZW50cnkgcG9pbnQgZm9yIHJvbGx1cCAoaHR0cDovL3JvbGx1cGpzLm9yZy8pIGFuZFxyXG4gZXNzZW50aW9uYWxseSAnYm9vdHN0cmFwcycgb3VyIGlnLmNvbSAnYXBwbGljYXRpb24nLlxyXG5cclxuIEFsbCBtb2R1bGVzIHNob3VsZCBiZSBpbXBvcnRlZCBoZXJlIHNvIHRoYXQgdGhleSBjYW4gYmUgaW5pdGlhbGl6ZWQgb25cclxuIGEgY2FzZS1ieS1jYXNlIGJhc2lzIChub3QgYWxsIHBhZ2VzIHJlcXVpcmUgdGhlIGluaXRpYWxpemF0aW9uIG9mIGEgY2Fyb3VzZWxcclxuIGZvciBpbnN0YW5jZSkuXHJcblxyXG4gQW55IHRhc2tzIG9yIHByb2Nlc3NlcyB0aGF0IG5lZWQgdG8gYmUgaW5pdGlhdGVkIG9uIHBhZ2UgbG9hZCBzaG91bGQgbGl2ZSBpbiB0aGlzXHJcbiBmaWxlIGFzIHdlbGwuIEFuIGluY2x1ZGVkIGV4YW1wbGUgaXMgYSBtZXRob2QgdGhhdCBhZGRzIGFuICdlbicgb3IgJ2ZyJyBjbGFzcyB0b1xyXG4gdGhlIGJvZHkgYmFzZWQgb24gdGhlIGdsb2JhbCBsYW5ndWFnZSB2YXJpYWJsZSB0aGF0IHdlIGNhbiB0aGVuIHVzZSB0byB3cml0ZSBjdXN0b21cclxuIHN0eWxlcyBmb3IgZWFjaCBsYW5ndWFnZS5cclxuICovXHJcblxyXG5pbXBvcnQgZm9ybXMgZnJvbSAnLi9mb3Jtcy5qcyc7XHJcbmltcG9ydCBjYXJvdXNlbCBmcm9tICcuL2Nhcm91c2VsLmpzJztcclxuaW1wb3J0IGNhcmVlcnMgZnJvbSAnLi9jYXJlZXJzLmpzJztcclxuaW1wb3J0IHZpZGVvIGZyb20gJy4vdmlkZW8uanMnO1xyXG5pbXBvcnQgc2VhcmNoIGZyb20gJy4vc2VhcmNoLmpzJztcclxuaW1wb3J0IG1vZGFsIGZyb20gJy4vbW9kYWwuanMnO1xyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5jb25zdCBhcHAgPSAoKCkgPT4ge1xyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBGb3VuZGF0aW9uXHJcbiAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XHJcblxyXG4gICAgLy8gQ2hlY2sgZm9yIGNvbXBvbmVudHNcclxuICAgIGlmICgkKCcuaWctZm9ybScpLmxlbmd0aCkgZm9ybXMuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1jYXJvdXNlbCcpLmxlbmd0aCkgY2Fyb3VzZWwuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy1zZWFyY2gnKS5sZW5ndGgpIHNlYXJjaC5pbml0KCk7XHJcbiAgICBpZiAoJCgnLmlnLWNhcmVlcnMnKS5sZW5ndGgpIGNhcmVlcnMuaW5pdCgpO1xyXG4gICAgaWYgKCQoJy5pZy12aWRlby1ncm91cCcpLmxlbmd0aCkgdmlkZW8uaW5pdCgpO1xyXG4gICAgLy8gRm9sbG93aW5nIGlzIG9ubHkgZm9yIEFkb2JlIEFuYWx5dGljc1xyXG4gICAgbW9kYWwuaW5pdCgpO1xyXG5cclxuICAgIC8vIEFkZCBsYW5ndWFnZSBjbGFzcyB0byBib2R5XHJcbiAgICAvL19sYW5ndWFnZSgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9XHJcbn0pKCk7XHJcblxyXG4vLyBCb290c3RyYXAgYXBwXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICBhcHAuaW5pdCgpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbImxhbmciLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiaW5kZXhPZiIsIm9sZElFIiwiZW5kcG9pbnRVUkwiLCJzdWNjZXNzVVJMIiwiY2FuY2VsVVJMIiwiJGZvcm0iLCIkZm9ybVdyYXBwZXIiLCJpbml0IiwiJCIsImZpbmQiLCJkYXRhIiwiX3ZhbGlkYXRpb24iLCJqSW5wdXQiLCJjaGFuZ2UiLCJvYmpFdmVudCIsImFkZENsYXNzIiwidmFsaWRhdG9yIiwic2V0RGVmYXVsdHMiLCJhZGRNZXRob2QiLCJwb3N0YWwiLCJlbGVtZW50Iiwib3B0aW9uYWwiLCJtYXRjaCIsInZhbGlkYXRlIiwibGFiZWwiLCJjbG9zZXN0IiwibGVuZ3RoIiwicGFyZW50IiwiYXBwZW5kIiwib24iLCJyZXBsYWNlIiwiX3Byb2Nlc3MiLCJmb3JtIiwiZm9ybURhdGFSYXciLCJmb3JtRGF0YVBhcnNlZCIsInZhbGlkIiwicmVtb3ZlQ2xhc3MiLCJzZXJpYWxpemVBcnJheSIsIl9wYXJzZSIsIl9zdWJtaXQiLCJhamF4Iiwic3VjY2VzcyIsIm1zZyIsImVycm9yIiwidG8iLCJfdG9nZ2xlciIsImhpZGUiLCJzaG93IiwibG9nIiwidG9nZ2xlQ2xhc3MiLCJfYnVpbGRDYXJvdXNlbCIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsIiRjYXJvdXNlbCIsImVhY2giLCJpbmRleCIsInNsaWNrIiwiX2NhcmVlcnNMZWdhY3lDb2RlIiwiZm4iLCJpbmZvVG9nZ2xlIiwiJHJldmVhbCIsIiRyZXZlYWxDb250ZW50IiwiJHJldmVhbFRyaWdnZXIiLCJmaXhlZEhlaWdodCIsInNldEFyaWEiLCJhdHRyIiwiaW5pdFRvZ2dsZSIsImhhbmRsZVJldmVhbFRvZ2dsZSIsInJlc2l6ZUhhbmRsZXIiLCJzZXRUaW1lb3V0Iiwic2V0UmV2ZWFsQ29udGVudEhlaWdodCIsImNzcyIsImhlaWdodCIsImZpbmFsSGVpZ2h0IiwiaGFzQ2xhc3MiLCJzY3JvbGxIZWlnaHQiLCJqUXVlcnkiLCJjaXJjbGVBbmltYXRpb24iLCJtYXhWYWx1ZSIsImNhbnZhcyIsIiRjYW52YXMiLCJjb250ZXh0IiwiZCIsIndpZHRoIiwicGVyY2VudFN0cm9rZSIsInJlbWFpbmluZ1N0cm9rZSIsInJhZGl1cyIsImN1clBlcmMiLCJjaXJjIiwiTWF0aCIsIlBJIiwicXVhcnQiLCJkZWxlZ2F0ZUlEIiwiRGF0ZSIsImdldFRpbWUiLCJpcyIsImdldENvbnRleHQiLCJzdHJva2VTdHlsZSIsImZpbGxTdHlsZSIsImRlbGVnYXRlIiwiY2xlYXIiLCJhbmltYXRlIiwiY3VycmVudCIsImxpbmVXaWR0aCIsImJlZ2luUGF0aCIsImFyYyIsIm1pbiIsInN0cm9rZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImZpbGxSZWN0IiwiYmxvY2tMaW5rIiwiJGJsb2NrTGluayIsImRlc3RpbmF0aW9uIiwiaW5pdEJsb2NrIiwiaGFuZGxlQ2xpY2siLCJndWkiLCJ2aWRlbyIsIm92ZXJsYXkiLCJpbml0TGVnYWN5IiwiT3ZlcmxheU1vZHVsZSIsIkd1aU1vZHVsZSIsImUiLCJ0YXJnZXQiLCJnZXRBdHRyaWJ1dGUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3AiLCJvZmZzZXQiLCJ0b3AiLCJzZWxlY3RvciIsInJlc2l6ZSIsIm92ZXJsYXlSZWZlcmVuY2UiLCJtdWx0aVRhYlRvZ2dsZVNlbGVjdG9yIiwibXVsdGlUYWJDb250ZW50U2VsZWN0b3IiLCJtdWx0aVRhYlNlbGVjdG9yIiwiJGVkZ2VPdmVybGF5TG9jYXRpb24iLCIkb3ZlcmxheVNsaWRlciIsIiRwcm9maWxlU2xpZGVyIiwiJHByb2ZpbGVTbGlkZXJWaWRlb1NlY3Rpb25Ib2xkZXIiLCJ3aW5kb3dTaXppbmdEZWxheSIsIndpbmRvd1Njcm9sbGluZ0RlbGF5Iiwib3ZlcmxheU9wZW4iLCJpc1Jlc3BvbnNpdmVTdGF0ZSIsInNjcm9sbGVkVG9WaWV3IiwiaW5pdEd1aSIsImV2ZW50IiwiYmFja2dyb3VuZENvbG9yIiwiJHRoaXMiLCJwYXJzZUludCIsImh0bWwiLCJoYW5kbGVPdmVybGF5RnJvbUhhc2giLCJkZWxheWVkSGFuZGxlV2luZG93U2l6aW5nIiwiZGVsYXllZEhhbmRsZVdpbmRvd1Njcm9sbCIsInRyaWdnZXIiLCJzdG9wUHJvcGFnYXRpb24iLCJhZGRNdWx0aVRhYlRvZ2dsZUhhbmRsZXJzIiwidG9nZ2xlQmFzZSIsIiRjb250YWluZXIiLCJwYXJlbnRzIiwiYW5pbWF0ZVByb2ZpbGVTbGlkZXIiLCIkcHJvZmlsZVBhbmVscyIsInByb2ZpbGVQYW5lbEhlaWdodCIsIm91dGVySGVpZ2h0IiwiY2hhbmdlU2xpZGVyU3RhdGUiLCJzbGlkZXIiLCJzdGF0ZSIsImNsZWFyVGltZW91dCIsImhhbmRsZVdpbmRvd1NpemluZyIsImhhbmRsZVdpbmRvd1Njcm9sbGluZyIsImZ1bGxIYXNoRnJhZ21lbnQiLCJoYXNoIiwib3Blbk92ZXJsYXkiLCJoYW5kbGVPdmVybGF5T3BlbiIsImhhbmRsZU92ZXJsYXlDbG9zZSIsImluaXRpYWxJbmRleCIsImhhbmRsZVNsaWRlQ2hhbmdlIiwieVBvcyIsIm92ZXJsYXlDb250ZW50Iiwib2ZmIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImRvY3VtZW50IiwidGl0bGUiLCJzZWFyY2giLCJzY3JvbGxUb3AiLCJjdXJyZW50U2xpZGUiLCJuZXh0U2xpZGUiLCJuZXh0VGl0bGUiLCJnZXQiLCJuZXdIYXNoIiwid2luZG93V2lkdGgiLCJyZXNwb25zaXZlTGltaXQiLCJuZXdJc1Jlc3BvbnNpdmVTdGF0ZSIsImluaXRQcm9maWxlU2xpZGVyIiwiaW5pdFNsaWRlciIsIm9wdGlvbnMiLCJkZWZhdWx0cyIsImV4dGVuZCIsIiRvdmVybGF5IiwiJGJvZHkiLCJvdmVybGF5U2l6aW5nRGVsYXkiLCJjdXJyZW50SW5zdGFuY2UiLCJpc09wZW5GbGFnIiwiJGNsb3NlQnV0dG9uIiwiaXNPcGVuIiwiaW5pdE92ZXJsYXkiLCJkZWxheWVkSGFuZGxlT3ZlcmxheVNpemluZyIsIkZvdW5kYXRpb24iLCJSZXZlYWwiLCJvdmVybGF5U2l6aW5nIiwiY2xvc2UiLCJmb3VuZGF0aW9uIiwib3BlbiIsImluaXRDbG9zZUJ1dHRvbiIsIiRpbm5lclNwYW4iLCJ1cmxPck1hcmt1cCIsIm9wZW5DYWxsYmFjayIsImNsb3NlQ2FsbGJhY2siLCJmdWxsU2NyZWVuIiwiZnVsbCIsIm9wZW5PdmVybGF5V2l0aEFqYXgiLCJ1cmwiLCJkb25lIiwib3Blbk92ZXJsYXlXaXRoTWFya3VwIiwibWFya3VwIiwib3ZlcmxheVNpemVDbGVhbnVwIiwib3ZlcmxheUhlaWdodCIsIndpbmRvd0hlaWdodCIsInZpZGVvSURzIiwicGxheWVycyIsImJyaWdodENvdmUiLCIkdmlkZW8iLCJpZyIsInNldEludGVydmFsIiwiX3BhcnNlVmlkZW9zIiwiJGdyb3VwIiwicHJlbG9hZE9wdGlvbnMiLCJwbGF5ZXIiLCJpZCIsImRlc2NyaXB0aW9uIiwiYXV0byIsInByZWxvYWQiLCJ0cmFuc2NyaXB0IiwiY3RhVGVtcGxhdGUiLCJwdXNoIiwiX2luamVjdFRlbXBsYXRlIiwidHJhbnNjcmlwdFRleHQiLCJyZXBsYWNlV2l0aCIsInNpYmxpbmdzIiwiX2luamVjdElmcmFtZSIsImluamVjdEJyaWdodENvdmVKUyIsImluZGV4anMiLCJfYnJpZ2h0Q292ZVJlYWR5IiwiZm9yRWFjaCIsImVsIiwicmVhZHkiLCJfb25QbGF5IiwiX29uQ29tcGxldGUiLCJwYXVzZSIsIl92aWV3U3RhdHVzIiwic2Nyb2xsIiwidmlzaWJsZSIsIl9zZWFyY2hMZWdhY3lDb2RlIiwibW9kZWxVcmwiLCIkZmllbGQiLCJocmVmIiwic3VnZ2VzdGlvbnMiLCJjaXRpZXMiLCJsb2NhdGlvbnMiLCJCbG9vZGhvdW5kIiwidG9rZW5pemVycyIsIndoaXRlc3BhY2UiLCJnZXRTZWFyY2hSZXN1bHRzIiwicGFyYW1zIiwic2VhcmNodHlwZSIsIm5hbWUiLCJnZXRKU09OIiwiYWx3YXlzIiwicmVzdWx0IiwiSlNPTiIsInBhcnNlIiwiZmFpbCIsInN0YXR1cyIsInN0YXR1c1RleHQiLCJwYXJzZVNlYXJjaFN0cmluZyIsInZhbCIsImNpdHkiLCJ3b3JkcyIsInNwbGl0IiwiaSIsInNwbGljZSIsImpvaW4iLCJkaXNwbGF5U2VhcmNoUmVzdWx0cyIsInRlbXBsYXRlSUQiLCJqc29uIiwidGVtcGxhdGUiLCJnZXRFbGVtZW50QnlJZCIsImlubmVySFRNTCIsInJlbmRlcmVkIiwiTXVzdGFjaGUiLCJyZW5kZXIiLCJ0eXBlYWhlYWQiLCJzb3VyY2UiLCJsaW1pdCIsInN1Ym1pdCIsImRpcmVjdENhbGxSdWxlIiwiX3NhdGVsbGl0ZSIsInRyYWNrIiwiYXBwIiwiZm9ybXMiLCJjYXJvdXNlbCIsImNhcmVlcnMiXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7Ozs7Ozs7QUFTQSxBQUFPOzs7QUFLUCxBQUFPLElBQUlBLE9BQVEsWUFBTTtNQUNuQkMsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBeUJDLE9BQXpCLENBQWlDLE1BQWpDLE1BQTZDLENBQUMsQ0FBOUMsSUFBbURILE9BQU9DLFFBQVAsQ0FBZ0JDLFFBQWhCLENBQXlCQyxPQUF6QixDQUFpQyxNQUFqQyxNQUE2QyxDQUFDLENBQXJHLEVBQXdHO1dBQy9GLElBQVA7R0FERixNQUVPO1dBQ0UsSUFBUDs7Q0FKYyxFQUFYOzs7QUFTUCxBQUFPOzs7QUFLUCxBQUFPLElBQUlDLFFBQVMsWUFBTTtNQUNwQixtQkFBbUJKLE1BQXZCLEVBQStCO1dBQ3RCLElBQVA7R0FERixNQUVPO1dBQ0UsS0FBUDs7Q0FKZSxFQUFaOzs7MkNBV1AsQUFBTzs7QUNyQ1AsWUFBZSxDQUFDLFlBQU07O01BRWhCSyxXQUFKLEVBQ0VDLFVBREYsRUFFRUMsU0FGRixFQUdFQyxLQUhGLEVBSUVDLFlBSkY7O1dBTVNDLElBQVQsR0FBZ0I7O21CQUVDQyxFQUFFLFVBQUYsQ0FBZjtZ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