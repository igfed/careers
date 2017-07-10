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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvY2FyZWVycy5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL3NlYXJjaC5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgZmlsZSBpcyBmb3IgbWV0aG9kcyBhbmQgdmFyaWFibGVzIHRoYXQgYXJlIGdvaW5nIHRvIGJlXHJcbiB1c2VmdWwgYWNyb3NzIGFsbCBtb2R1bGVzLiBJbiBvcmRlciB0byB1c2UgdGhlbSBhbnl3aGVyZSwgaW1wb3J0IHdpdGg6XHJcblxyXG4gaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuIGFuZCB0aGVuIGNhbGwgd2l0aCB0aGUgaWcgbmFtZXNwYWNlIChpLmUuLCBpZy5wYXRobmFtZSwgaWcubGFuZywgZXRjKVxyXG4gKi9cclxuXHJcbi8vIHVybCBwYXRoXHJcbmV4cG9ydCB2YXIgcGF0aG5hbWUgPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XHJcbn0pKClcclxuXHJcbi8vIGxhbmd1YWdlXHJcbmV4cG9ydCB2YXIgbGFuZyA9ICgoKSA9PiB7XHJcbiAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIuJykgIT09IC0xIHx8IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIvJykgIT09IC0xKSB7XHJcbiAgICByZXR1cm4gJ2ZyJztcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuICdlbic7XHJcbiAgfVxyXG59KSgpXHJcblxyXG4vLyBicm93c2VyIHdpZHRoXHJcbmV4cG9ydCB2YXIgYnJvd3NlcldpZHRoID0gKCgpID0+IHtcclxuICByZXR1cm4gd2luZG93Lm91dGVyV2lkdGg7XHJcbn0pKClcclxuXHJcbi8vIGNoZWNrIGZvciBJRSAocHJlIEVkZ2UpXHJcbmV4cG9ydCB2YXIgb2xkSUUgPSAoKCkgPT4ge1xyXG4gIGlmIChcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3cpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59KSgpXHJcblxyXG4vLyBiYXNlIGV2ZW50RW1pdHRlclxyXG4vLyBleHBvcnQgdmFyIGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5leHBvcnQgdmFyIGRlYm91bmNlID0gKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkgPT4ge1xyXG4gIHZhciB0aW1lb3V0O1xyXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xyXG4gICAgICBpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgIH07XHJcbiAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcclxuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcclxuICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gIH07XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICB2YXIgZW5kcG9pbnRVUkwsXHJcbiAgICBzdWNjZXNzVVJMLFxyXG4gICAgY2FuY2VsVVJMLFxyXG4gICAgJGZvcm0sXHJcbiAgICAkZm9ybVdyYXBwZXI7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xyXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcclxuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xyXG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcclxuXHJcbiAgICBfdmFsaWRhdGlvbigpO1xyXG4gICAgX3RvZ2dsZXIoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcclxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XHJcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZSxcclxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XHJcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcclxuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xyXG5cclxuICAgICRmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDYXJvdXNlbCBJbml0aWFsaXplZCEnKVxyXG5cclxuICAgIC8vIE5vdCBzdXJlIHdoYXQgdGhpcyBkb2VzIGF0IHRoaXMgcG9pbnQgb3IgaG93IGl0IHJlbGF0ZXMgdG8gQ2Fyb3VzZWxzXHJcbiAgICAkKCdbZGF0YS1yZXNwb25zaXZlLXRvZ2dsZV0gYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ3NpdGUtaGVhZGVyLWlzLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgX2J1aWxkQ2Fyb3VzZWwoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9idWlsZENhcm91c2VsKCkge1xyXG4gICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgbmV4dEFycm93LFxyXG4gICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgJCgnLmlnLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXHJcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxyXG4gICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAgICAgX2NhcmVlcnNMZWdhY3lDb2RlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX2NhcmVlcnNMZWdhY3lDb2RlKCkge1xyXG4gICAgICAgIChmdW5jdGlvbiAoJCkge1xyXG5cclxuICAgICAgICAgICAgJC5mbi5pbmZvVG9nZ2xlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJHJldmVhbCA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyZXZlYWxDb250ZW50ID0gJHJldmVhbC5maW5kKCcuaW5mby10b2dnbGUtY29udGVudCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcmV2ZWFsVHJpZ2dlciA9ICRyZXZlYWwuZmluZCgnLmluZm8tdG9nZ2xlLXRyaWdnZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZml4ZWRIZWlnaHQgPSBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0QXJpYSA9ICRyZXZlYWwuYXR0cignaW5mby10b2dnbGUtYXJpYScpID09PSAndHJ1ZSc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGluaXRUb2dnbGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdFRvZ2dsZSgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHJldmVhbFRyaWdnZXIub24oJ2NsaWNrJywgaGFuZGxlUmV2ZWFsVG9nZ2xlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCByZXNpemVIYW5kbGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFJldmVhbENvbnRlbnRIZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlUmV2ZWFsVG9nZ2xlKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRSZXZlYWxDb250ZW50SGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyZXZlYWwudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChzZXRSZXZlYWxDb250ZW50SGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHJlc2l6ZUhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaXhlZEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJldmVhbENvbnRlbnQuY3NzKHtoZWlnaHQ6ICdhdXRvJ30pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzZXRSZXZlYWxDb250ZW50SGVpZ2h0KCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmluYWxIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHJldmVhbC5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsSGVpZ2h0ID0gJHJldmVhbENvbnRlbnRbMF0uc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZml4ZWRIZWlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxIZWlnaHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZml4ZWRIZWlnaHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcmV2ZWFsQ29udGVudC5jc3Moe2hlaWdodDogZmluYWxIZWlnaHR9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXRBcmlhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcmV2ZWFsQ29udGVudC5hdHRyKCdhcmlhLWhpZGRlbicsICFmaXhlZEhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfSkoalF1ZXJ5KTtcclxuXHJcblxyXG4gICAgICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAgICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAgICAgICAkLmZuLmNpcmNsZUFuaW1hdGlvbiA9IGZ1bmN0aW9uIChtYXhWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FudmFzID0gdGhpcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGNhbnZhcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBjYW52YXMud2lkdGggLyAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJjZW50U3Ryb2tlID0gNyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtYWluaW5nU3Ryb2tlID0gMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFkaXVzID0gZCAtIHBlcmNlbnRTdHJva2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1clBlcmMgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaXJjID0gTWF0aC5QSSAqIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YXJ0ID0gTWF0aC5QSSAvIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGVnYXRlSUQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArICdDQSc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghJGNhbnZhcy5pcygnY2FudmFzJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzBkMjYzYyc7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnI2U1ZThlOCc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRjYW52YXMuYXR0cignY2lyY2xlLWFuaW1hdGlvbi1pZCcsIGRlbGVnYXRlSUQpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZSgnW2NpcmNsZS1hbmltYXRpb24taWQ9JyArIGRlbGVnYXRlSUQgKyAnXScsICdzdGFydEFuaW1hdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1clBlcmMgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmRlbGVnYXRlKCdbY2lyY2xlLWFuaW1hdGlvbi1pZD0nICsgZGVsZWdhdGVJRCArICddJywgJ2NsZWFyQW5pbWF0ZScsIGNsZWFyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZShjdXJyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50ID8gY3VycmVudCA6IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gcGVyY2VudFN0cm9rZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1NYXRoLm1pbihjdXJyZW50LCBtYXhWYWx1ZSAvIDEwMCkpIC0gcXVhcnQsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHJlbWFpbmluZ1N0cm9rZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1jdXJyZW50KSAtIHF1YXJ0LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyUGVyYysrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyUGVyYyA8IDExMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZShjdXJQZXJjIC8gMTAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNsZWFyKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLndpZHRoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfSkoalF1ZXJ5KTtcclxuXHJcbiAgICAgICAgKGZ1bmN0aW9uICgkKSB7XHJcbiAgICAgICAgICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAgICAgICAgICQuZm4uYmxvY2tMaW5rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJGJsb2NrTGluayA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uID0gJGJsb2NrTGluay5maW5kKCdhJykuYXR0cignaHJlZicpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vZGVzdGluYXRpb24gPSAnNDQ0Mi5hc3B4LycgKyBkZXN0aW5hdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBpbml0QmxvY2soKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdEJsb2NrKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkYmxvY2tMaW5rLm9uKCdjbGljaycsIGhhbmRsZUNsaWNrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uID0gZGVzdGluYXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH0pKGpRdWVyeSk7XHJcblxyXG4gICAgICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAgICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAgICAgICB2YXIgZ3VpLFxyXG4gICAgICAgICAgICAgICAgdmlkZW8sXHJcbiAgICAgICAgICAgICAgICBvdmVybGF5O1xyXG5cclxuICAgICAgICAgICAgaW5pdExlZ2FjeSgpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gaW5pdExlZ2FjeSgpIHtcclxuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgd2VpcmQgLSBub3QgZ29pbmcgdG8gdG91Y2ggaXRcclxuICAgICAgICAgICAgICAgIG92ZXJsYXkgPSBuZXcgT3ZlcmxheU1vZHVsZSgpO1xyXG4gICAgICAgICAgICAgICAgZ3VpID0gbmV3IEd1aU1vZHVsZShvdmVybGF5KTtcclxuICAgICAgICAgICAgICAgIC8vIHZpZGVvID0gbmV3IFZpZGVvTW9kdWxlKCk7IC8vIFJlcGxhY2Ugd2l0aCB2aWRlby5qcyBtb2R1bGVcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBOZWVkIHRvIGhhdmUgYSBjbGFzcyB0byBob29rIG9udG8gZm9yIEZyZW5jaCBsYW5ndWFnZSBwYWdlXHJcbiAgICAgICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2ZyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU21vb3RoIHNjcm9sbGluZyBmb3IgYW5jaG9yIGxpbmtzXHJcbiAgICAgICAgICAgICAgICAkKCdhW2hyZWZePVwiI1wiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9ICQodGhpcy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wICsgNTJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNzUwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuc2VsZWN0b3IgIT09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNtYWluLW1lbnUtYW5jaG9yJykuY3NzKHsnZGlzcGxheSc6ICdub25lJ30pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2lzLXJldmVhbC1vcGVuIGJyYW5kZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBNb2JpbGUgbWVudSBuZWVkcyB0byBtaW1pYyBGb3VuZGF0aW9uIHJldmVhbCAtIG5vdCBlbm91Z2ggdGltZSB0byBpbXBsZW1lbnQgZGlmZmVyZW50IG5hdnMgaW4gYSByZXZlYWwgbW9kYWwgcHJvcGVybHlcclxuICAgICAgICAgICAgICAgICQoJy5tZW51LWljb24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaXMtcmV2ZWFsLW9wZW4gYnJhbmRlZCcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gcXVpY2sgYW5kIGRpcnR5IG1vYmlsZSBtZW51IGNsb3NlcyAtIG5vdCBmYW1pbGlhciB3aXRoIEZvdW5kYXRpb24gcGF0dGVybiB0byBmaXJlIHRoZXNlXHJcbiAgICAgICAgICAgICAgICAkKCcudG9wLWJhciAuY2xvc2UtYnV0dG9uLnNob3ctZm9yLXNtYWxsLW9ubHknKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI21haW4tbWVudS1hbmNob3InKS5jc3MoeydkaXNwbGF5JzogJ25vbmUnfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdpcy1yZXZlYWwtb3BlbiBicmFuZGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA2NDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdicmFuZGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIEd1aU1vZHVsZShvdmVybGF5UmVmZXJlbmNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbXVsdGlUYWJUb2dnbGVTZWxlY3RvciA9ICdbY2xhc3MqPVwidG9nZ2xlLVwiXTpub3QoW2NsYXNzKj1cImluZm8tdG9nZ2xlXCJdKScsXHJcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlUYWJDb250ZW50U2VsZWN0b3IgPSAnW2NsYXNzKj1cImNvbnRlbnQtXCJdJyxcclxuICAgICAgICAgICAgICAgICAgICBtdWx0aVRhYlNlbGVjdG9yID0gJy5tdWx0aS10YWItb3V0bGluZScsXHJcbiAgICAgICAgICAgICAgICAgICAgJGVkZ2VPdmVybGF5TG9jYXRpb24gPSAkKCcjZWRnZS1vdmVybGF5LWNvbnRlbnQnKSxcclxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5ID0gb3ZlcmxheVJlZmVyZW5jZSxcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheVNsaWRlcixcclxuICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlcixcclxuICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlclZpZGVvU2VjdGlvbkhvbGRlciA9ICQoJzxkaXY+PC9kaXY+JyksXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93U2l6aW5nRGVsYXksXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93U2Nyb2xsaW5nRGVsYXksXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheU9wZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgaXNSZXNwb25zaXZlU3RhdGUgPSBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxlZFRvVmlldyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGluaXRHdWkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbml0R3VpKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZE11bHRpVGFiVG9nZ2xlSGFuZGxlcnMoKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuYmxvY2stbGluaycpLmJsb2NrTGluaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5U2xpZGVyID0gJCgnLm91ci1idXNpbmVzcy1zbGlkZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjZWRnZS1vdmVybGF5LWNvbnRlbnQnKS5maW5kKCcuY2Fyb3VzZWwtbmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheVNsaWRlci5zbGljaygnc2xpY2tOZXh0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKFwiLnZpZGVvLXNsaWRlLnNsaWNrLWFjdGl2ZVwiKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnNsaWNrLWxpc3QuZHJhZ2dhYmxlJykuY3NzKHtoZWlnaHQ6ICc2NjBweCd9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnNlY3Rpb24ucHJvZmlsZXMtc2xpZGVyJykuY3NzKHtiYWNrZ3JvdW5kQ29sb3I6ICcjZTVlOGU4J30pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zbGljay1saXN0LmRyYWdnYWJsZScpLmNzcyh7aGVpZ2h0OiAnYXV0byd9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnNlY3Rpb24ucHJvZmlsZXMtc2xpZGVyJykuY3NzKHtiYWNrZ3JvdW5kQ29sb3I6ICcjN2VjNGI5J30pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnByb2ZpbGUtY291bnRlcicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnY2FudmFzJykuY2lyY2xlQW5pbWF0aW9uKHBhcnNlSW50KCR0aGlzLmZpbmQoJ3AnKS5odG1sKCkpKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlciA9ICQoJy5wcm9maWxlcy1zbGlkZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCBoYW5kbGVPdmVybGF5RnJvbUhhc2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZU92ZXJsYXlGcm9tSGFzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZGVsYXllZEhhbmRsZVdpbmRvd1NpemluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlV2luZG93U2l6aW5nKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZGVsYXllZEhhbmRsZVdpbmRvd1Njcm9sbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlV2luZG93U2Nyb2xsaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICQoJy5pbmZvLXRvZ2dsZScpLmluZm9Ub2dnbGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcudG9wLWJhciArIC5zY3JlZW4nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ2FbZGF0YS10b2dnbGVdJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTm90IHByZXR0eSAtIGp1c3QgYWRkaW5nIHF1aWNrIGFuZCBkaXJ0eSBzaGFyZSBsaW5rIGFjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICQoJy5zaGFyZS10b2dnbGUtdHJpZ2dlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmluZm8tdG9nZ2xlJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKCcuc2hhcmUtdG9nZ2xlLWNsb3NlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuaW5mby10b2dnbGUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFkZE11bHRpVGFiVG9nZ2xlSGFuZGxlcnMoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmRlbGVnYXRlKG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZUJhc2UgPSAkdGhpcy5hdHRyKCdjbGFzcycpLm1hdGNoKC90b2dnbGUtKFxcUyopPygkfFxccykvKVsxXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkdGhpcy5wYXJlbnRzKG11bHRpVGFiU2VsZWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKG11bHRpVGFiQ29udGVudFNlbGVjdG9yKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKCcuY29udGVudC0nICsgdG9nZ2xlQmFzZSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZVByb2ZpbGVTbGlkZXIoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICRwcm9maWxlUGFuZWxzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlUGFuZWxIZWlnaHQgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsZWRUb1ZpZXcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIuZmluZCgnLnNsaWNrLXNsaWRlJykucmVtb3ZlQ2xhc3MoJ3NsaWNrLWNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLmZpbmQoJy5zbGljay1hY3RpdmUnKS5hZGRDbGFzcygnc2xpY2stY29tcGxldGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuc2xpY2stc2xpZGU6bm90KC5zbGljay1jb21wbGV0ZSknKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5wcm9maWxlLWNvdW50ZXIgY2FudmFzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdjbGVhckFuaW1hdGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuc2xpY2stY29tcGxldGUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5wcm9maWxlLWNvdW50ZXIgY2FudmFzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdzdGFydEFuaW1hdGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRwcm9maWxlU2xpZGVyLmZpbmQoJy5zbGljay1hY3RpdmUnKS5pcygnW2NsYXNzKj1wcm9maWxlLV0nKSB8fCBpc1Jlc3BvbnNpdmVTdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIuYWRkQ2xhc3MoJ2NvbnRyYXN0LWFycm93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5yZW1vdmVDbGFzcygnY29udHJhc3QtYXJyb3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVBhbmVscyA9ICRwcm9maWxlU2xpZGVyLmZpbmQoJy5wcm9maWxlLTEtc2xpZGUsIC5wcm9maWxlLTItc2xpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVQYW5lbHMuY3NzKHtoZWlnaHQ6ICdhdXRvJ30pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVBhbmVscy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gJCh0aGlzKS5vdXRlckhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50ID4gcHJvZmlsZVBhbmVsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZmlsZVBhbmVsSGVpZ2h0ID0gY3VycmVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwcm9maWxlUGFuZWxzLmNzcyh7aGVpZ2h0OiBwcm9maWxlUGFuZWxIZWlnaHR9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY2hhbmdlU2xpZGVyU3RhdGUoc2xpZGVyLCBzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwiYWNjZXNzaWJpbGl0eVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVyLnNsaWNrKFwic2xpY2tTZXRPcHRpb25cIiwgXCJkcmFnZ2FibGVcIiwgc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwic3dpcGVcIiwgc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwidG91Y2hNb3ZlXCIsIHN0YXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBkZWxheWVkSGFuZGxlV2luZG93U2l6aW5nKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3dTaXppbmdEZWxheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHdpbmRvd1NpemluZ0RlbGF5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvd1NpemluZ0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQoaGFuZGxlV2luZG93U2l6aW5nLCAyNTApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWRIYW5kbGVXaW5kb3dTY3JvbGwoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdpbmRvd1Njcm9sbGluZ0RlbGF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQod2luZG93U2Nyb2xsaW5nRGVsYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93U2Nyb2xsaW5nRGVsYXkgPSB3aW5kb3cuc2V0VGltZW91dChoYW5kbGVXaW5kb3dTY3JvbGxpbmcsIDI1MCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUZyb21IYXNoKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZ1bGxIYXNoRnJhZ21lbnQgPSAnI291ci1lZGdlLSc7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW92ZXJsYXlPcGVuICYmIGxvY2F0aW9uLmhhc2guaW5kZXhPZihmdWxsSGFzaEZyYWdtZW50KSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVybGF5Lm9wZW5PdmVybGF5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVkZ2VPdmVybGF5TG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVPdmVybGF5T3BlbiwgaGFuZGxlT3ZlcmxheUNsb3NlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheU9wZW4oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5pdGlhbEluZGV4O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbml0U2xpZGVyKCRvdmVybGF5U2xpZGVyLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxJbmRleCA9ICRvdmVybGF5U2xpZGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuJyArIGxvY2F0aW9uLmhhc2gucmVwbGFjZSgnI291ci0nLCAnJykgKyAnOm5vdCguc2xpY2stY2xvbmVkKScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXlTbGlkZXIuc2xpY2soJ3NsaWNrR29UbycsIGluaXRpYWxJbmRleCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXlTbGlkZXIub24oJ2FmdGVyQ2hhbmdlJywgaGFuZGxlU2xpZGVDaGFuZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVNsaWRlQ2hhbmdlKG51bGwsIG51bGwsIHBhcnNlSW50KCQoJyNtb2RhbE92ZXJsYXkgLnNsaWNrLWFjdGl2ZScpLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVdpbmRvd1NpemluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlPcGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVPdmVybGF5Q2xvc2UoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgeVBvcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUNvbnRlbnQgPSAkKCcjbW9kYWxPdmVybGF5ID4gZGl2Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCd1bnNsaWNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXlTbGlkZXIub2ZmKCdhZnRlckNoYW5nZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5vdmVybGF5LXJlcG9zaXRvcnknKS5hcHBlbmQob3ZlcmxheUNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcInB1c2hTdGF0ZVwiIGluIGhpc3RvcnkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKFwiXCIsIGRvY3VtZW50LnRpdGxlLCBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlQb3MgPSAkKGRvY3VtZW50KS5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24uaGFzaCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQpLnNjcm9sbFRvcCh5UG9zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheU9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVTbGlkZUNoYW5nZShldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0U2xpZGUgPSAoY3VycmVudFNsaWRlICsgMSkgJSAoJCgnLnNsaWNrLXNsaWRlOm5vdCguc2xpY2stY2xvbmVkKScpLmxlbmd0aCAtIDEpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0VGl0bGUgPSAkKCRvdmVybGF5U2xpZGVyLmZpbmQoJ1tkYXRhLXNsaWNrLWluZGV4PScgKyBuZXh0U2xpZGUgKyAnXSAuY29sdW1uczpmaXJzdC1jaGlsZCBwJykuZ2V0KDApKS5odG1sKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hhc2ggPSAnb3VyLScgKyAkb3ZlcmxheVNsaWRlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCdbZGF0YS1zbGljay1pbmRleD0nICsgY3VycmVudFNsaWRlICsgJ10nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hdGNoKC8oZWRnZS1cXFMqKS8pWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKCcjbW9kYWxPdmVybGF5IC5jYXJvdXNlbC1uZXh0IGEnKS5odG1sKG5leHRUaXRsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24uaGFzaCA9IG5ld0hhc2g7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlV2luZG93U2l6aW5nKGluaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2l2ZUxpbWl0ID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3SXNSZXNwb25zaXZlU3RhdGUgPSB3aW5kb3dXaWR0aCA8IHJlc3BvbnNpdmVMaW1pdDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRvdmVybGF5U2xpZGVyLmlzKCcuc2xpY2staW5pdGlhbGl6ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VTbGlkZXJTdGF0ZSgkb3ZlcmxheVNsaWRlciwgIW5ld0lzUmVzcG9uc2l2ZVN0YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1Jlc3BvbnNpdmVTdGF0ZSAhPT0gbmV3SXNSZXNwb25zaXZlU3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNSZXNwb25zaXZlU3RhdGUgPSBuZXdJc1Jlc3BvbnNpdmVTdGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdFByb2ZpbGVTbGlkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlV2luZG93U2Nyb2xsaW5nKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2Nyb2xsZWRUb1ZpZXcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQod2luZG93KS5zY3JvbGxUb3AoKSArICQod2luZG93KS5oZWlnaHQoKSA+ICRwcm9maWxlU2xpZGVyLm9mZnNldCgpLnRvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsZWRUb1ZpZXcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoYW5pbWF0ZVByb2ZpbGVTbGlkZXIsIDUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdFByb2ZpbGVTbGlkZXIoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdFNsaWRlcigkcHJvZmlsZVNsaWRlciwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldkFycm93OiAnPHNwYW4gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2Fyb3VzZWwtcHJldiBnYS1jYXJlZXJzLW91ci1wZW9wbGUtY2Fyb3VzZWwtc2Nyb2xsXCI+PGltZyBzcmM9XCIvY29udGVudC9kYW0vaW52ZXN0b3JzZ3JvdXAvYXBwL2NhcmVlcnMvaW1hZ2VzL0Fycm93LU1haW5BcnRpY2xlLUNhcm91c2VsLUJsYWNrLUwucG5nXCI+PC9zcGFuPicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRBcnJvdzogJzxzcGFuIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNhcm91c2VsLW5leHQgZ2EtY2FyZWVycy1vdXItcGVvcGxlLWNhcm91c2VsLXNjcm9sbFwiPjxpbWcgc3JjPVwiL2NvbnRlbnQvZGFtL2ludmVzdG9yc2dyb3VwL2FwcC9jYXJlZXJzL2ltYWdlcy9BcnJvdy1NYWluQXJ0aWNsZS1DYXJvdXNlbC1CbGFjay1SLnBuZ1wiPjwvc3Bhbj4nXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZVByb2ZpbGVTbGlkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5vbignYWZ0ZXJDaGFuZ2UnLCBhbmltYXRlUHJvZmlsZVNsaWRlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdFNsaWRlcih0YXJnZXQsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwZWVkOiA3NTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvdHNDbGFzczogJ3NsaWNrLWRvdHMgZ2EtY2FyZWVycy1vdXItcGVvcGxlLWNhcm91c2VsLXNjcm9sbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnNsaWNrKCQuZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIE92ZXJsYXlNb2R1bGUoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJG92ZXJsYXksXHJcbiAgICAgICAgICAgICAgICAgICAgJGJvZHkgPSAkKCdib2R5JyksXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVNpemluZ0RlbGF5LFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZSA9IHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIGlzT3BlbkZsYWcgPSBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAkY2xvc2VCdXR0b247XHJcblxyXG4gICAgICAgICAgICAgICAgaW5pdE92ZXJsYXkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wZW5PdmVybGF5OiBvcGVuT3ZlcmxheSxcclxuICAgICAgICAgICAgICAgICAgICBpc09wZW46IGlzT3BlblxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbml0T3ZlcmxheSgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheSA9ICQoJzxkaXY+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuYXR0cignaWQnLCAnbW9kYWxPdmVybGF5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuYXR0cignY2xhc3MnLCAncmV2ZWFsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuYXR0cignZGF0YS1yZXZlYWwnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAkYm9keS5hcHBlbmQoJG92ZXJsYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5Lm9uKCdvcGVuLnpmLnJldmVhbCcsIGhhbmRsZU92ZXJsYXlPcGVuKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oJ2Nsb3NlZC56Zi5yZXZlYWwnLCBoYW5kbGVPdmVybGF5Q2xvc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZGVsYXllZEhhbmRsZU92ZXJsYXlTaXppbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRDbG9zZUJ1dHRvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBGb3VuZGF0aW9uLlJldmVhbCgkb3ZlcmxheSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWRIYW5kbGVPdmVybGF5U2l6aW5nKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvdmVybGF5U2l6aW5nRGVsYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChvdmVybGF5U2l6aW5nRGVsYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVNpemluZ0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQob3ZlcmxheVNpemluZywgMjUwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVPdmVybGF5Q2xvc2UoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpc09wZW5GbGFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZS5jbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5zdGFuY2UuY2xvc2UoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5U2l6ZUNsZWFudXAoKTtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5zdGFuY2UgPSB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVPdmVybGF5T3BlbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNPcGVuRmxhZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdpcy1yZXZlYWwtb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5LmZpbmQoJyonKS5mb3VuZGF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZS5vcGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5vcGVuKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVNpemluZygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXRDbG9zZUJ1dHRvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJGlubmVyU3BhbiA9ICQoJzxzcGFuPjwvc3Bhbj4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGNsb3NlQnV0dG9uID0gJCgnPGJ1dHRvbiBkYXRhLWNsb3NlPjwvYnV0dG9uPicpO1xyXG4gICAgICAgICAgICAgICAgICAgICRjbG9zZUJ1dHRvbi5hZGRDbGFzcygnY2xvc2UtYnV0dG9uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGNsb3NlQnV0dG9uLmF0dHIoJ2FyaWEtbGFiZWwnLCAnQ2xvc2UgbW9kYWwnKTtcclxuICAgICAgICAgICAgICAgICAgICAkaW5uZXJTcGFuLmF0dHIoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlubmVyU3Bhbi5odG1sKCcmdGltZXM7Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGNsb3NlQnV0dG9uLmFwcGVuZCgkaW5uZXJTcGFuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBpc09wZW4oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzT3BlbkZsYWc7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb3Blbk92ZXJsYXkodXJsT3JNYXJrdXAsIG9wZW5DYWxsYmFjaywgY2xvc2VDYWxsYmFjaywgZnVsbFNjcmVlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5vcGVuID0gb3BlbkNhbGxiYWNrO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5jbG9zZSA9IGNsb3NlQ2FsbGJhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEluc3RhbmNlLmZ1bGwgPSBmdWxsU2NyZWVuO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdXJsT3JNYXJrdXAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5PdmVybGF5V2l0aEFqYXgodXJsT3JNYXJrdXApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5PdmVybGF5V2l0aE1hcmt1cCh1cmxPck1hcmt1cCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvcGVuT3ZlcmxheVdpdGhBamF4KHVybCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh1cmwpLmRvbmUob3Blbk92ZXJsYXlXaXRoTWFya3VwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvcGVuT3ZlcmxheVdpdGhNYXJrdXAobWFya3VwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuaHRtbChtYXJrdXApO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5LmFwcGVuZCgkY2xvc2VCdXR0b24pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50SW5zdGFuY2UuZnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5hZGRDbGFzcygnZnVsbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5mb3VuZGF0aW9uKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb3ZlcmxheVNpemVDbGVhbnVwKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5LnJlbW92ZUNsYXNzKCdmdWxsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ3RvdXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5odG1sKCcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvdmVybGF5U2l6aW5nKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvdmVybGF5SGVpZ2h0ID0gJG92ZXJsYXkuaGVpZ2h0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG92ZXJsYXlIZWlnaHQgPiB3aW5kb3dIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ2Z1bGwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSkoalF1ZXJ5KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0XHJcbiAgICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgdmFyIHZpZGVvSURzID0gW10sXHJcbiAgICBwbGF5ZXJzID0gW10sXHJcbiAgICBicmlnaHRDb3ZlLFxyXG4gICAgJHZpZGVvO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG5cclxuICAgIF9wYXJzZVZpZGVvcygpO1xyXG5cclxuICAgIGlmICghaWcub2xkSUUpIHtcclxuXHJcbiAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgVmlkZW9KUyBtZXRob2QgaXMgYXZhaWxhYmxlIGFuZCBmaXJlIHJlYWR5IGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgIGJyaWdodENvdmUgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQoJy52anMtcGx1Z2lucy1yZWFkeScpLmxlbmd0aCkge1xyXG4gICAgICAgICAgX2JyaWdodENvdmVSZWFkeSgpO1xyXG4gICAgICAgICAgY2xlYXJJbnRlcnZhbChicmlnaHRDb3ZlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDUwMCk7XHJcblxyXG4gICAgICAvLyBGdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgdmlkZW8ncyBoYXZlIHNjcm9sbGVkIG9mZiBzY3JlZW4gYW5kIG5lZWQgdG8gYmUgcGF1c2VkXHJcbiAgICAgIF92aWV3U3RhdHVzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfcGFyc2VWaWRlb3MoKSB7XHJcbiAgICB2YXIgJGdyb3VwLFxyXG4gICAgICBkYXRhID0ge30sXHJcbiAgICAgIHByZWxvYWRPcHRpb25zID0gWydhdXRvJywgJ21ldGFkYXRhJywgJ25vbmUnXTtcclxuXHJcbiAgICAvLyBFYWNoIGdyb3VwIGNhbiBlZmZlY3RpdmVseSB1c2UgYSBkaWZmZXJlbnQgcGxheWVyIHdoaWNoIHdpbGwgb25seSBiZSBsb2FkZWQgb25jZVxyXG4gICAgJCgnLmlnLXZpZGVvLWdyb3VwJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRncm91cCA9ICQodGhpcyk7XHJcbiAgICAgIGRhdGEucGxheWVyID0gJGdyb3VwLmRhdGEoJ3BsYXllcicpO1xyXG5cclxuICAgICAgLy8gTG9vcCB0aHJvdWdoIHZpZGVvJ3NcclxuICAgICAgJGdyb3VwLmZpbmQoJy5pZy12aWRlby1qcycpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgJHZpZGVvID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgZGF0YS5pZCA9ICR2aWRlby5kYXRhKCdpZCcpO1xyXG4gICAgICAgIGRhdGEudGl0bGUgPSAkdmlkZW8uZGF0YSgndGl0bGUnKSA/ICR2aWRlby5kYXRhKCd0aXRsZScpIDogJyc7XHJcbiAgICAgICAgZGF0YS5kZXNjcmlwdGlvbiA9ICR2aWRlby5kYXRhKCdkZXNjcmlwdGlvbicpID8gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgOiAnJztcclxuXHJcbiAgICAgICAgaWYgKGlnLm9sZElFKSB7XHJcblxyXG4gICAgICAgICAgX2luamVjdElmcmFtZShkYXRhLCAkdmlkZW8pO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIC8vIENhcHR1cmUgb3B0aW9ucyB0aGF0IGFyZSB1c2VkIHdpdGggbW9kZXJuIGJyb3dzZXJzXHJcbiAgICAgICAgICBkYXRhLm92ZXJsYXkgPSAkdmlkZW8uZGF0YSgnb3ZlcmxheScpXHJcbiAgICAgICAgICAgID8gJHZpZGVvLmRhdGEoJ292ZXJsYXknKVxyXG4gICAgICAgICAgICA6ICcnO1xyXG4gICAgICAgICAgZGF0YS5hdXRvID0gJHZpZGVvLmRhdGEoJ2F1dG9wbGF5JykgPyAnYXV0b3BsYXknIDogJyc7XHJcbiAgICAgICAgICBkYXRhLnByZWxvYWQgPSAocHJlbG9hZE9wdGlvbnMuaW5kZXhPZigkdmlkZW8uZGF0YSgncHJlbG9hZCcpKSA+IC0xKSA/ICR2aWRlby5kYXRhKCdwcmVsb2FkJykgOiAnYXV0byc7XHJcbiAgICAgICAgICBkYXRhLnRyYW5zY3JpcHQgPSAkdmlkZW8uZGF0YSgndHJhbnNjcmlwdCcpID8gJHZpZGVvLmRhdGEoXHJcbiAgICAgICAgICAgICd0cmFuc2NyaXB0JykgOiAnJztcclxuICAgICAgICAgIGRhdGEuY3RhVGVtcGxhdGUgPSAkdmlkZW8uZGF0YSgnY3RhVGVtcGxhdGUnKSA/ICR2aWRlby5kYXRhKFxyXG4gICAgICAgICAgICAnY3RhVGVtcGxhdGUnKSA6ICcnO1xyXG5cclxuICAgICAgICAgIC8vIFN0b3JlIElEJ3MgZm9yIGFsbCB2aWRlbydzIG9uIHRoZSBwYWdlIC0gaW4gY2FzZSB3ZSB3YW50IHRvIHJ1biBhIHBvc3QtbG9hZCBwcm9jZXNzIG9uIGVhY2hcclxuICAgICAgICAgIHZpZGVvSURzLnB1c2goZGF0YS5pZCk7XHJcblxyXG4gICAgICAgICAgLy8gTGV0J3MgcmVwbGFjZSB0aGUgaWctdmlkZW8tanMgJ2RpcmVjdGl2ZScgd2l0aCB0aGUgbmVjZXNzYXJ5IEJyaWdodGNvdmUgY29kZVxyXG4gICAgICAgICAgX2luamVjdFRlbXBsYXRlKGRhdGEsIGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gT25seSBpbmplY3QgQnJpZ2h0Y292ZSBKUyBpZiBtb2Rlcm4gYnJvd3NlclxyXG4gICAgICBpZiAoIWlnLm9sZElFKSB7XHJcbiAgICAgICAgaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfaW5qZWN0VGVtcGxhdGUoZGF0YSwgaW5kZXgpIHtcclxuICAgIHZhciB0cmFuc2NyaXB0VGV4dCA9IHsgJ2VuJzogJ1RyYW5zY3JpcHQnLCAnZnInOiAnVHJhbnNjcmlwdGlvbicgfSxcclxuICAgICAgaHRtbCA9IGA8ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyICR7ZGF0YS5pZH1cIj48ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyLXJlc3BvbnNpdmVcIj5gO1xyXG5cclxuICAgIGlmIChkYXRhLmN0YVRlbXBsYXRlLmxlbmd0aCA+IDApIHtcclxuICAgICAgaHRtbCArPSBgPHNwYW4gY2xhc3M9XCJ2aWRlby1jdGFcIj4ke2RhdGEuY3RhVGVtcGxhdGV9PC9zcGFuPmA7XHJcbiAgICB9XHJcbiAgICBpZiAoZGF0YS5vdmVybGF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgaHRtbCArPSBgPHNwYW4gY2xhc3M9XCJ2aWRlby1vdmVybGF5XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJyR7ZGF0YS5vdmVybGF5fScpO1wiPjwvc3Bhbj5gO1xyXG4gICAgfVxyXG4gICAgaHRtbCArPSBgPHZpZGVvIGRhdGEtc2V0dXA9J3tcInRlY2hPcmRlclwiOiBbXCJodG1sNVwiXX0nIGRhdGEtdmlkZW8taWQ9XCIke2RhdGEuaWR9XCIgcHJlbG9hZD1cIiR7ZGF0YS5wcmVsb2FkfVwiIGRhdGEtYWNjb3VudD1cIjM5MDY5NDI4NjEwMDFcIiBkYXRhLXBsYXllcj1cIiR7ZGF0YS5wbGF5ZXJ9XCIgZGF0YS1lbWJlZD1cImRlZmF1bHRcIiBkYXRhLWFwcGxpY2F0aW9uLWlkPVwiJHtpbmRleH1cIiBjbGFzcz1cInZpZGVvLWpzXCIgaWQ9XCIke2RhdGEuaWR9XCIgY29udHJvbHMgJHtkYXRhLmF1dG99PjwvdmlkZW8+PC9kaXY+YDtcclxuICAgIGlmIChkYXRhLnRyYW5zY3JpcHQubGVuZ3RoID4gMCkge1xyXG4gICAgICBodG1sICs9IGA8ZGl2IGNsYXNzPVwidmlkZW8tdHJhbnNjcmlwdFwiPjxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCIke2RhdGEudHJhbnNjcmlwdH1cIj4ke3RyYW5zY3JpcHRUZXh0W2lnLmxhbmddfTwvYT48L2Rpdj5gO1xyXG4gICAgfVxyXG4gICAgaHRtbCArPSBgPC9kaXY+PGgyIGNsYXNzPVwidmlkZW8tdGl0bGVcIj4ke2RhdGEudGl0bGV9PC9oMj48cCBjbGFzcz1cInZpZGVvLWRlc2NyaXB0aW9uXCI+JHtkYXRhLmRlc2NyaXB0aW9ufTwvcD5gO1xyXG4gICAgJHZpZGVvID0gJHZpZGVvLnJlcGxhY2VXaXRoKGh0bWwpO1xyXG5cclxuICAgIGlmIChkYXRhLm92ZXJsYXkpIHtcclxuICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJyMnICsgZGF0YS5pZCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQodGhpcykuc2libGluZ3MoJy52aWRlby1vdmVybGF5JykuaGlkZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9pbmplY3RJZnJhbWUoZGF0YSkge1xyXG4gICAgdmFyIGh0bWwgPSBgPGRpdiBjbGFzcz1cInZpZGVvLWNvbnRhaW5lclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyLXJlc3BvbnNpdmVcIj5cclxuICAgICAgPGlmcmFtZSBjbGFzcz1cInZpZGVvLWpzXCIgc3JjPScvL3BsYXllcnMuYnJpZ2h0Y292ZS5uZXQvMzkwNjk0Mjg2MTAwMS8ke2RhdGEucGxheWVyfV9kZWZhdWx0L2luZGV4Lmh0bWw/dmlkZW9JZD0ke2RhdGEuaWR9J1xyXG4gICAgYWxsb3dmdWxsc2NyZWVuIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+XHJcbiAgICA8L2Rpdj5cclxuICAgIDwvZGl2PjxoMiBjbGFzcz1cInZpZGVvLXRpdGxlXCI+JHtkYXRhLnRpdGxlfTwvaDI+PHAgY2xhc3M9XCJ2aWRlby1kZXNjcmlwdGlvblwiPiR7ZGF0YS5kZXNjcmlwdGlvbn08L3A+YDtcclxuICAgICR2aWRlbyA9ICR2aWRlby5yZXBsYWNlV2l0aChodG1sKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGluamVjdEJyaWdodENvdmVKUyhkYXRhKSB7XHJcbiAgICB2YXIgaW5kZXhqcyA9IGA8c2NyaXB0IHNyYz1cIi8vcGxheWVycy5icmlnaHRjb3ZlLm5ldC8zOTA2OTQyODYxMDAxLyR7ZGF0YS5wbGF5ZXJ9X2RlZmF1bHQvaW5kZXgubWluLmpzXCI+PC9zY3JpcHQ+YDtcclxuICAgICQoJ2JvZHknKS5hcHBlbmQoaW5kZXhqcyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfYnJpZ2h0Q292ZVJlYWR5KCkge1xyXG4gICAgdmFyIHBsYXllcjtcclxuICAgIHZpZGVvSURzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgIHZpZGVvanMoJyMnICsgZWwpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBhc3NpZ24gdGhpcyBwbGF5ZXIgdG8gYSB2YXJpYWJsZVxyXG4gICAgICAgIHBsYXllciA9IHRoaXM7XHJcbiAgICAgICAgLy8gYXNzaWduIGFuIGV2ZW50IGxpc3RlbmVyIGZvciBwbGF5IGV2ZW50XHJcbiAgICAgICAgcGxheWVyLm9uKCdwbGF5JywgX29uUGxheSk7XHJcbiAgICAgICAgLy8gYXNzaWduIGFuIGV2ZW50IGxpc3RlbmVyIGZvciBlbmRlZCBldmVudFxyXG4gICAgICAgIHBsYXllci5vbignZW5kZWQnLCBfb25Db21wbGV0ZSk7XHJcbiAgICAgICAgLy8gcHVzaCB0aGUgcGxheWVyIHRvIHRoZSBwbGF5ZXJzIGFycmF5XHJcbiAgICAgICAgcGxheWVycy5wdXNoKHBsYXllcik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfb25QbGF5KGUpIHtcclxuICAgIC8vIGRldGVybWluZSB3aGljaCBwbGF5ZXIgdGhlIGV2ZW50IGlzIGNvbWluZyBmcm9tXHJcbiAgICB2YXIgaWQgPSBlLnRhcmdldC5pZDtcclxuICAgIC8vIGdvIHRocm91Z2ggcGxheWVyc1xyXG4gICAgcGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIpIHtcclxuICAgICAgaWYgKHBsYXllci5pZCgpICE9PSBpZCkge1xyXG4gICAgICAgIC8vIHBhdXNlIHRoZSBvdGhlciBwbGF5ZXIocylcclxuICAgICAgICB2aWRlb2pzKHBsYXllci5pZCgpKS5wYXVzZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9vbkNvbXBsZXRlKGUpIHtcclxuICAgICQoJy4nICsgZS50YXJnZXQuaWQpLmFkZENsYXNzKCdjb21wbGV0ZScpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZpZXdTdGF0dXMoKSB7XHJcbiAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgcGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIpIHtcclxuICAgICAgICBpZiAoISQoJyMnICsgcGxheWVyLmlkKCkpLnZpc2libGUoKSkge1xyXG4gICAgICAgICAgdmlkZW9qcyhwbGF5ZXIuaWQoKSkucGF1c2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdCxcclxuICB9O1xyXG59KSgpOyIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBfc2VhcmNoTGVnYWN5Q29kZSgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3NlYXJjaExlZ2FjeUNvZGUoKSB7XHJcblxyXG4vLyBHTE9CQUxTXHJcbiAgICB2YXIgbW9kZWxVcmwgPSAnaHR0cHM6Ly9zZWFyY2guaW52ZXN0b3JzZ3JvdXAuY29tL2FwaS9jd3BzZWFyY2g/JztcclxuICAgIHZhciAkZmllbGQgPSAkKCcjRmluZEFuT2ZmaWNlJyk7XHJcbiAgICB2YXIgbGFuZyA9ICdlbic7XHJcbiAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignL2ZyLycpID4gLTEpIHtcclxuICAgICAgbGFuZyA9ICdmcic7XHJcbiAgICB9XHJcblxyXG4vLyBQcm9jZXNzIHRoZSBsb2NhbCBwcmVmZXRjaGVkIGRhdGFcclxuICAgIHZhciBzdWdnZXN0aW9ucyA9IHt9O1xyXG4gICAgdmFyIGNpdGllcyA9IFtcclxuICAgICAgXCJhdGhhYmFzY2FcIixcclxuICAgICAgXCJibHVmZnRvblwiLFxyXG4gICAgICBcImJvbm55dmlsbGVcIixcclxuICAgICAgXCJicm9va3NcIixcclxuICAgICAgXCJjYWxnYXJ5XCIsXHJcbiAgICAgIFwiY2Ftcm9zZVwiLFxyXG4gICAgICBcImNhbm1vcmVcIixcclxuICAgICAgXCJkcmF5dG9uIHZhbGxleVwiLFxyXG4gICAgICBcImVkbW9udG9uXCIsXHJcbiAgICAgIFwiZm9ydCBtY211cnJheVwiLFxyXG4gICAgICBcImZvcnQgc2Fza2F0Y2hld2FuXCIsXHJcbiAgICAgIFwiZ3JhbmRlIHByYWlyaWVcIixcclxuICAgICAgXCJoYWxraXJrXCIsXHJcbiAgICAgIFwiaGlsbGNyZXN0IG1pbmVzXCIsXHJcbiAgICAgIFwiaGludG9uXCIsXHJcbiAgICAgIFwibGVkdWNcIixcclxuICAgICAgXCJsZXRoYnJpZGdlXCIsXHJcbiAgICAgIFwibGxveWRtaW5zdGVyXCIsXHJcbiAgICAgIFwibWVkaWNpbmUgaGF0XCIsXHJcbiAgICAgIFwibW9yaW52aWxsZVwiLFxyXG4gICAgICBcInBlYWNlIHJpdmVyXCIsXHJcbiAgICAgIFwicGluY2hlciBjcmVla1wiLFxyXG4gICAgICBcInByb3Zvc3RcIixcclxuICAgICAgXCJyZWQgZGVlclwiLFxyXG4gICAgICBcInNoZXJ3b29kIHBhcmtcIixcclxuICAgICAgXCJzcHJ1Y2UgZ3JvdmVcIixcclxuICAgICAgXCJzdC4gYWxiZXJ0XCIsXHJcbiAgICAgIFwic3RldHRsZXJcIixcclxuICAgICAgXCJzdHVyZ2VvbiBjb3VudHlcIixcclxuICAgICAgXCJ0b2ZpZWxkXCIsXHJcbiAgICAgIFwidmVybWlsaW9uXCIsXHJcbiAgICAgIFwid2FpbndyaWdodFwiLFxyXG4gICAgICBcIndlc3Rsb2NrXCIsXHJcbiAgICAgIFwid2hpdGVsYXdcIixcclxuICAgICAgXCJhYmJvdHNmb3JkXCIsXHJcbiAgICAgIFwiYnJhY2tlbmRhbGVcIixcclxuICAgICAgXCJidXJuYWJ5XCIsXHJcbiAgICAgIFwiYnVybnMgbGFrZVwiLFxyXG4gICAgICBcImNhbXBiZWxsIHJpdmVyXCIsXHJcbiAgICAgIFwiY2hhc2VcIixcclxuICAgICAgXCJjaGlsbGl3YWNrXCIsXHJcbiAgICAgIFwiY29tb3hcIixcclxuICAgICAgXCJjb3F1aXRsYW1cIixcclxuICAgICAgXCJjb3VydGVuYXlcIixcclxuICAgICAgXCJjcmFuYnJvb2tcIixcclxuICAgICAgXCJkYXdzb24gY3JlZWtcIixcclxuICAgICAgXCJkdW5jYW5cIixcclxuICAgICAgXCJmb3J0IG5lbHNvblwiLFxyXG4gICAgICBcImZvcnQgc3QuIGpvaG5cIixcclxuICAgICAgXCJpbnZlcm1lcmVcIixcclxuICAgICAgXCJrYW1sb29wc1wiLFxyXG4gICAgICBcImtlbG93bmFcIixcclxuICAgICAgXCJsYW5nbGV5XCIsXHJcbiAgICAgIFwibWVycml0dFwiLFxyXG4gICAgICBcIm5hbmFpbW9cIixcclxuICAgICAgXCJuZWxzb25cIixcclxuICAgICAgXCJub3J0aCB2YW5jb3V2ZXJcIixcclxuICAgICAgXCJvbGl2ZXJcIixcclxuICAgICAgXCJwZW50aWN0b25cIixcclxuICAgICAgXCJwb3J0IGFsYmVybmlcIixcclxuICAgICAgXCJwb3dlbGwgcml2ZXJcIixcclxuICAgICAgXCJwcmluY2UgZ2VvcmdlXCIsXHJcbiAgICAgIFwicXVhbGljdW0gYmVhY2hcIixcclxuICAgICAgXCJxdWVzbmVsXCIsXHJcbiAgICAgIFwicmV2ZWxzdG9rZVwiLFxyXG4gICAgICBcInJpY2htb25kXCIsXHJcbiAgICAgIFwic2FhbmljaHRvblwiLFxyXG4gICAgICBcInNhbG1vbiBhcm1cIixcclxuICAgICAgXCJzYWx0IHNwcmluZyBpc2xhbmRcIixcclxuICAgICAgXCJzZWNoZWx0XCIsXHJcbiAgICAgIFwic2lkbmV5XCIsXHJcbiAgICAgIFwic21pdGhlcnNcIixcclxuICAgICAgXCJzdXJyZXlcIixcclxuICAgICAgXCJ0ZXJyYWNlXCIsXHJcbiAgICAgIFwidHJhaWxcIixcclxuICAgICAgXCJ2YW5jb3V2ZXJcIixcclxuICAgICAgXCJ2ZXJub25cIixcclxuICAgICAgXCJ2aWN0b3JpYVwiLFxyXG4gICAgICBcIndlc3RiYW5rXCIsXHJcbiAgICAgIFwid2lsbGlhbXMgbGFrZVwiLFxyXG4gICAgICBcImJyYW5kb25cIixcclxuICAgICAgXCJkYXVwaGluXCIsXHJcbiAgICAgIFwiZmxpbiBmbG9uXCIsXHJcbiAgICAgIFwiZ2lsbGFtXCIsXHJcbiAgICAgIFwia2lsbGFybmV5XCIsXHJcbiAgICAgIFwibWFuaXRvdVwiLFxyXG4gICAgICBcIm1pYW1pXCIsXHJcbiAgICAgIFwibW9yZGVuXCIsXHJcbiAgICAgIFwibmFyb2xcIixcclxuICAgICAgXCJwb3J0YWdlIGxhIHByYWlyaWVcIixcclxuICAgICAgXCJzZWxraXJrXCIsXHJcbiAgICAgIFwic3dhbiByaXZlclwiLFxyXG4gICAgICBcInRoZSBwYXNcIixcclxuICAgICAgXCJ2aXJkZW5cIixcclxuICAgICAgXCJ3YXJyZW5cIixcclxuICAgICAgXCJ3aW5uaXBlZ1wiLFxyXG4gICAgICBcImJhdGh1cnN0XCIsXHJcbiAgICAgIFwiYmVkZWxsXCIsXHJcbiAgICAgIFwiZWRtdW5kc3RvblwiLFxyXG4gICAgICBcImZyZWRlcmljdG9uXCIsXHJcbiAgICAgIFwibGFuc2Rvd25lXCIsXHJcbiAgICAgIFwibWlyYW1pY2hpXCIsXHJcbiAgICAgIFwibW9uY3RvblwiLFxyXG4gICAgICBcInF1aXNwYW1zaXNcIixcclxuICAgICAgXCJyZXh0b25cIixcclxuICAgICAgXCJyb3RoZXNheVwiLFxyXG4gICAgICBcInNhaW50IGpvaG5cIixcclxuICAgICAgXCJzYWludCBwYXVsXCIsXHJcbiAgICAgIFwic3Vzc2V4XCIsXHJcbiAgICAgIFwiYmxha2V0b3duXCIsXHJcbiAgICAgIFwiY2xhcmVudmlsbGVcIixcclxuICAgICAgXCJjb3JuZXIgYnJvb2tcIixcclxuICAgICAgXCJnYW5kZXJcIixcclxuICAgICAgXCJncmFuZCBmYWxscyAtIHdpbmRzb3JcIixcclxuICAgICAgXCJtYXJ5c3Rvd25cIixcclxuICAgICAgXCJyb2FjaGVzIGxpbmVcIixcclxuICAgICAgXCJzdC4gam9obidzXCIsXHJcbiAgICAgIFwidHJpbml0eVwiLFxyXG4gICAgICBcImFtaGVyc3RcIixcclxuICAgICAgXCJhbnRpZ29uaXNoXCIsXHJcbiAgICAgIFwiYmFycmluZ3RvbiBwYXNzYWdlXCIsXHJcbiAgICAgIFwiYmVsbGl2ZWF1IGNvdmVcIixcclxuICAgICAgXCJicmlkZ2V0b3duXCIsXHJcbiAgICAgIFwiYnJpZGdld2F0ZXJcIixcclxuICAgICAgXCJkYXJ0bW91dGhcIixcclxuICAgICAgXCJkYXl0b25cIixcclxuICAgICAgXCJoYWxpZmF4XCIsXHJcbiAgICAgIFwibWlkZGxldG9uXCIsXHJcbiAgICAgIFwibmV3IGdsYXNnb3dcIixcclxuICAgICAgXCJuZXcgbWluYXNcIixcclxuICAgICAgXCJub3J0aCBzeWRuZXlcIixcclxuICAgICAgXCJwaWN0b3VcIixcclxuICAgICAgXCJwb3J0IGhhd2tlc2J1cnlcIixcclxuICAgICAgXCJzeWRuZXlcIixcclxuICAgICAgXCJ0cnVyb1wiLFxyXG4gICAgICBcInllbGxvd2tuaWZlXCIsXHJcbiAgICAgIFwiYWpheFwiLFxyXG4gICAgICBcImFsZ29ucXVpbiBoaWdobGFuZHNcIixcclxuICAgICAgXCJhbmNhc3RlclwiLFxyXG4gICAgICBcImF0aWtva2FuXCIsXHJcbiAgICAgIFwiYmFycmllXCIsXHJcbiAgICAgIFwiYmVsbGV2aWxsZVwiLFxyXG4gICAgICBcImJvd21hbnZpbGxlXCIsXHJcbiAgICAgIFwiYnJhY2VicmlkZ2VcIixcclxuICAgICAgXCJicmFtcHRvblwiLFxyXG4gICAgICBcImJyYW50Zm9yZFwiLFxyXG4gICAgICBcImJyb2NrdmlsbGVcIixcclxuICAgICAgXCJicm9va2xpblwiLFxyXG4gICAgICBcImJ1cmxpbmd0b25cIixcclxuICAgICAgXCJjYW1icmlkZ2VcIixcclxuICAgICAgXCJjYXJsZXRvbiBwbGFjZVwiLFxyXG4gICAgICBcImNoYXRoYW1cIixcclxuICAgICAgXCJjbGF5dG9uXCIsXHJcbiAgICAgIFwiY2xpbnRvblwiLFxyXG4gICAgICBcImNvYm91cmdcIixcclxuICAgICAgXCJjb2xsaW5nd29vZFwiLFxyXG4gICAgICBcImNvbmNvcmRcIixcclxuICAgICAgXCJjb3Jud2FsbFwiLFxyXG4gICAgICBcImRyeWRlblwiLFxyXG4gICAgICBcImR1bmRhc1wiLFxyXG4gICAgICBcImR1bnNmb3JkXCIsXHJcbiAgICAgIFwiZHV0dG9uXCIsXHJcbiAgICAgIFwiZWxsaW90IGxha2VcIixcclxuICAgICAgXCJldG9iaWNva2VcIixcclxuICAgICAgXCJmb3J0IGZyYW5jZXNcIixcclxuICAgICAgXCJnYW5hbm9xdWVcIixcclxuICAgICAgXCJnYXJzb25cIixcclxuICAgICAgXCJncmVlbHlcIixcclxuICAgICAgXCJncmltc2J5XCIsXHJcbiAgICAgIFwiZ3VlbHBoXCIsXHJcbiAgICAgIFwiaGFpbGV5YnVyeVwiLFxyXG4gICAgICBcImhhbWlsdG9uXCIsXHJcbiAgICAgIFwiaGFub3ZlclwiLFxyXG4gICAgICBcImhlYXJzdFwiLFxyXG4gICAgICBcImh1bnRzdmlsbGVcIixcclxuICAgICAgXCJqZXJzZXl2aWxsZVwiLFxyXG4gICAgICBcImthbmF0YVwiLFxyXG4gICAgICBcImthcHVza2FzaW5nXCIsXHJcbiAgICAgIFwia2Vub3JhXCIsXHJcbiAgICAgIFwia2luZ3N0b25cIixcclxuICAgICAgXCJraXJrbGFuZCBsYWtlXCIsXHJcbiAgICAgIFwia2l0Y2hlbmVyXCIsXHJcbiAgICAgIFwibGFuZ3RvblwiLFxyXG4gICAgICBcImxpbmRzYXlcIixcclxuICAgICAgXCJsb25kb25cIixcclxuICAgICAgXCJtYXBsZVwiLFxyXG4gICAgICBcIm1hcmF0aG9uXCIsXHJcbiAgICAgIFwibWFya2hhbVwiLFxyXG4gICAgICBcIm1lcnJpY2t2aWxsZVwiLFxyXG4gICAgICBcIm1pbHRvblwiLFxyXG4gICAgICBcIm1pbmRlblwiLFxyXG4gICAgICBcIm1pc3Npc3NhdWdhXCIsXHJcbiAgICAgIFwibW91bnQgZm9yZXN0XCIsXHJcbiAgICAgIFwibW91bnQgaG9wZVwiLFxyXG4gICAgICBcIm5lcGVhblwiLFxyXG4gICAgICBcIm5ldyBsaXNrZWFyZFwiLFxyXG4gICAgICBcIm5ld21hcmtldFwiLFxyXG4gICAgICBcIm5pYWdhcmEgZmFsbHNcIixcclxuICAgICAgXCJub3J0aCBiYXlcIixcclxuICAgICAgXCJub3J0aCB5b3JrXCIsXHJcbiAgICAgIFwib2FrIHJpZGdlc1wiLFxyXG4gICAgICBcIm9ha3ZpbGxlXCIsXHJcbiAgICAgIFwib3JhbmdldmlsbGVcIixcclxuICAgICAgXCJvcmlsbGlhXCIsXHJcbiAgICAgIFwib3J0b25cIixcclxuICAgICAgXCJvc2hhd2FcIixcclxuICAgICAgXCJvdHRhd2FcIixcclxuICAgICAgXCJvd2VuIHNvdW5kXCIsXHJcbiAgICAgIFwicGFycnkgc291bmRcIixcclxuICAgICAgXCJwZW1icm9rZVwiLFxyXG4gICAgICBcInBlbmV0YW5ndWlzaGVuZVwiLFxyXG4gICAgICBcInBlcnRoXCIsXHJcbiAgICAgIFwicGV0ZXJib3JvdWdoXCIsXHJcbiAgICAgIFwicGV0cm9saWFcIixcclxuICAgICAgXCJwaWNrZXJpbmdcIixcclxuICAgICAgXCJyZWQgbGFrZVwiLFxyXG4gICAgICBcInJpZGdldG93blwiLFxyXG4gICAgICBcInNhcm5pYVwiLFxyXG4gICAgICBcInNhdWx0IHN0ZS4gbWFyaWVcIixcclxuICAgICAgXCJzY2FyYm9yb3VnaFwiLFxyXG4gICAgICBcInNjaHJlaWJlclwiLFxyXG4gICAgICBcInNpbWNvZVwiLFxyXG4gICAgICBcInNpb3V4IGxvb2tvdXRcIixcclxuICAgICAgXCJzdC4gY2F0aGFyaW5lc1wiLFxyXG4gICAgICBcInN0LiBtYXJ5c1wiLFxyXG4gICAgICBcInN0b3VmZnZpbGxlXCIsXHJcbiAgICAgIFwic3RyYXRmb3JkXCIsXHJcbiAgICAgIFwic3R1cmdlb24gZmFsbHNcIixcclxuICAgICAgXCJzdWRidXJ5XCIsXHJcbiAgICAgIFwic3VuZHJpZGdlXCIsXHJcbiAgICAgIFwidGh1bmRlciBiYXlcIixcclxuICAgICAgXCJ0aWxsc29uYnVyZ1wiLFxyXG4gICAgICBcInRpbW1pbnNcIixcclxuICAgICAgXCJ0b3JvbnRvXCIsXHJcbiAgICAgIFwidHJlbnRvblwiLFxyXG4gICAgICBcIlV4YnJpZGdlXCIsXHJcbiAgICAgIFwidmFsIGNhcm9uXCIsXHJcbiAgICAgIFwid2Fsa2VydG9uXCIsXHJcbiAgICAgIFwid2F0ZXJsb29cIixcclxuICAgICAgXCJ3ZWxsYW5kXCIsXHJcbiAgICAgIFwid2hpdGJ5XCIsXHJcbiAgICAgIFwid2lsbG93ZGFsZVwiLFxyXG4gICAgICBcIndpbmRzb3JcIixcclxuICAgICAgXCJ3aW5naGFtXCIsXHJcbiAgICAgIFwid29vZGJyaWRnZVwiLFxyXG4gICAgICBcImNoYXJsb3R0ZXRvd24sIHBlXCIsXHJcbiAgICAgIFwic291cmlzLCBwZVwiLFxyXG4gICAgICBcInN1bW1lcnNpZGUsIHBlXCIsXHJcbiAgICAgIFwid2VsbGluZ3RvblwiLFxyXG4gICAgICBcImFuam91XCIsXHJcbiAgICAgIFwiYm9pc2JyaWFuZFwiLFxyXG4gICAgICBcImJvdWNoZXJ2aWxsZVwiLFxyXG4gICAgICBcImJyb3NzYXJkXCIsXHJcbiAgICAgIFwiY2jDonRlYXVndWF5XCIsXHJcbiAgICAgIFwiY2hpY291dGltaVwiLFxyXG4gICAgICBcImPDtHRlIHNhaW50LWx1Y1wiLFxyXG4gICAgICBcImRvbGxhcmQtZGVzLW9ybWVhdXhcIixcclxuICAgICAgXCJnYXRpbmVhdVwiLFxyXG4gICAgICBcImdyYW5ieVwiLFxyXG4gICAgICBcImxhdmFsXCIsXHJcbiAgICAgIFwibMOpdmlzXCIsXHJcbiAgICAgIFwibWlyYWJlbFwiLFxyXG4gICAgICBcIm1vbnRyZWFsXCIsXHJcbiAgICAgIFwibmV3IHJpY2htb25kXCIsXHJcbiAgICAgIFwicG9pbnRlLWNsYWlyZVwiLFxyXG4gICAgICBcInF1w6liZWNcIixcclxuICAgICAgXCJzZXB0LWlsZXNcIixcclxuICAgICAgXCJzaGVyYnJvb2tlXCIsXHJcbiAgICAgIFwidmlsbGUgc3QtbGF1cmVudFwiLFxyXG4gICAgICBcIndlc3Rtb3VudFwiLFxyXG4gICAgICBcImVhc3RlbmRcIixcclxuICAgICAgXCJlc3RldmFuXCIsXHJcbiAgICAgIFwiZXN0ZXJoYXp5XCIsXHJcbiAgICAgIFwiZm9hbSBsYWtlXCIsXHJcbiAgICAgIFwiaHVtYm9sZHRcIixcclxuICAgICAgXCJraW5kZXJzbGV5XCIsXHJcbiAgICAgIFwibGVhZGVyXCIsXHJcbiAgICAgIFwibWFwbGUgY3JlZWtcIixcclxuICAgICAgXCJtZWFkb3cgbGFrZVwiLFxyXG4gICAgICBcIm1lbGZvcnRcIixcclxuICAgICAgXCJtZWx2aWxsZVwiLFxyXG4gICAgICBcIm1vb3NlIGphd1wiLFxyXG4gICAgICBcIm5vcnRoIGJhdHRsZWZvcmRcIixcclxuICAgICAgXCJvdXRsb29rXCIsXHJcbiAgICAgIFwib3hib3dcIixcclxuICAgICAgXCJwcmluY2UgYWxiZXJ0XCIsXHJcbiAgICAgIFwicmVnaW5hXCIsXHJcbiAgICAgIFwicmVnaW5hIGJlYWNoXCIsXHJcbiAgICAgIFwicm9zZXRvd25cIixcclxuICAgICAgXCJzYXNrYXRvb25cIixcclxuICAgICAgXCJzaGVsbGJyb29rXCIsXHJcbiAgICAgIFwic3dpZnQgY3VycmVudFwiLFxyXG4gICAgICBcIndhdHJvdXNcIixcclxuICAgICAgXCJ3YXRzb25cIixcclxuICAgICAgXCJ5b3JrdG9uXCIsXHJcbiAgICAgIFwid2hpdGVob3JzZVwiXHJcbiAgICBdO1xyXG4gICAgc3VnZ2VzdGlvbnMubG9jYXRpb25zID0gbmV3IEJsb29kaG91bmQoe1xyXG4gICAgICBkYXR1bVRva2VuaXplcjogQmxvb2Rob3VuZC50b2tlbml6ZXJzLndoaXRlc3BhY2UsXHJcbiAgICAgIHF1ZXJ5VG9rZW5pemVyOiBCbG9vZGhvdW5kLnRva2VuaXplcnMud2hpdGVzcGFjZSxcclxuICAgICAgbG9jYWw6IGNpdGllc1xyXG4gICAgfSk7XHJcblxyXG4vLyBHZXQgdGhlIHJlc3VsdHNcclxuICAgIGZ1bmN0aW9uIGdldFNlYXJjaFJlc3VsdHMocGFyYW1zKSB7XHJcbiAgICAgIHBhcmFtcy5zZWFyY2h0eXBlID0gJ29mZmljZSc7XHJcbiAgICAgIHBhcmFtcy5uYW1lID0gJyc7XHJcblxyXG4gICAgICAvLyBNYWtlIHN1cmUgZXJyb3IgbWVzc2FnZSBpcyBoaWRkZW4gZWFjaCB0aW1lXHJcbiAgICAgICQoJy56ZXJvLXJlc3VsdHMnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cclxuICAgICAgJC5nZXRKU09OKG1vZGVsVXJsLCBwYXJhbXMpXHJcbiAgICAgICAgLmFsd2F5cygpXHJcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgIHZhciByZXN1bHQgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdpcy1yZXZlYWwtb3BlbicpO1xyXG4gICAgICAgICAgICAkKCcjc2VhcmNoUmVzdWx0c01vZGFsJykucmVtb3ZlQ2xhc3MoJ2Nsb3NlZCcpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICBkaXNwbGF5U2VhcmNoUmVzdWx0cygnb2ZmaWNlLXRlbXBsYXRlJywgcmVzdWx0KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy56ZXJvLXJlc3VsdHMnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZhaWwoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0RhdGEgY291bGQgbm90IGJlIHJldHJpZXZlZCwgcGxlYXNlIHRyeSBhZ2FpbicsIHJlc3VsdC5zdGF0dXMgKyAnICcgKyByZXN1bHQuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuLy8gQmVjYXVzZSB3ZSBhcmUgb25seSBzZWFyY2hpbmcgZm9yIGNpdGllcywgdGhpcyBmdW5jdGlvbiBpcyBzbGlnaHRseSByZWR1bmRhbnQgLSBsZWF2aW5nIGl0IGluIHBsYWNlIGZvciBub3dcclxuICAgIGZ1bmN0aW9uIHBhcnNlU2VhcmNoU3RyaW5nKCkge1xyXG4gICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgIHZhciBzZWFyY2ggPSAkZmllbGQudmFsKCk7XHJcblxyXG4gICAgICByZXN1bHQuY2l0eSA9ICcnO1xyXG5cclxuICAgICAgLy8gU2VhcmNoIGluIHRoZSBsYW5ndWFnZSBvZiB0aGUgcGFnZVxyXG4gICAgICByZXN1bHQubGFuZyA9IGxhbmc7XHJcbiAgICAgIC8vIFdlIG9ubHkgc2VhcmNoIGNvbnN1bHRhbnRzIGZyb20gdGhpcyBtZXRob2RcclxuICAgICAgcmVzdWx0LnNlYXJjaHR5cGUgPSAnY29uJztcclxuXHJcbiAgICAgIC8vIENoZWNrIHRoZSBzZWFyY2ggc3RyaW5nIGZvciBhIHByZXZpb3VzbHkgZGVmaW5lZCBsb2NhdGlvblxyXG4gICAgICB2YXIgd29yZHMgPSBzZWFyY2guc3BsaXQoJyAnKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vIENoZWNrIGVhY2ggd29yZCBmb3IgYSBjaXR5IGZyb20gdGhlIHByZWRlZmluZWQgbGlzdFxyXG4gICAgICAgIHZhciBjaXR5ID0gc3VnZ2VzdGlvbnMubG9jYXRpb25zLmdldCh3b3Jkc1tpXSk7XHJcbiAgICAgICAgaWYgKGNpdHkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgcmVzdWx0LmNpdHkgPSBjaXR5WzBdO1xyXG4gICAgICAgICAgd29yZHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFyZXN1bHQuY2l0eSkge1xyXG4gICAgICAgIHJlc3VsdC5jaXR5ID0gd29yZHMuam9pbignICcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRpc3BsYXlTZWFyY2hSZXN1bHRzKHRlbXBsYXRlSUQsIGpzb24pIHtcclxuICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJRCkuaW5uZXJIVE1MO1xyXG4gICAgICBNdXN0YWNoZS5wYXJzZSh0ZW1wbGF0ZSk7XHJcbiAgICAgIHZhciByZW5kZXJlZCA9IE11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwganNvbik7XHJcbiAgICAgICQoJyNzZWFyY2hSZXN1bHRzTW9kYWwnKS5hcHBlbmQocmVuZGVyZWQpO1xyXG4gICAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4vL0luaXQgZXZlcnl0aGluZ1xyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vIFRyeSB0byBwcmVkZXRlcm1pbmUgd2hhdCByZXN1bHRzIHNob3VsZCBzaG93XHJcbiAgICAgIC8vIFNldHVwIHRoZSB0eXBlYWhlYWRcclxuICAgICAgJCgnLnR5cGVhaGVhZCcpLnR5cGVhaGVhZCh7XHJcbiAgICAgICAgICBoaWdobGlnaHQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtuYW1lOiAnbG9jYXRpb25zJywgc291cmNlOiBzdWdnZXN0aW9ucy5sb2NhdGlvbnMsIGxpbWl0OiAyfVxyXG4gICAgICApO1xyXG5cclxuICAgICAgLy8gU2V0dXAgdGhlIGZvcm0gc3VibWlzc2lvblxyXG4gICAgICAkKCcuaWctc2VhcmNoJykuc3VibWl0KGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciBwYXJhbXMgPSBwYXJzZVNlYXJjaFN0cmluZygpO1xyXG4gICAgICAgIGdldFNlYXJjaFJlc3VsdHMocGFyYW1zKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBGYWtlIG1vZGFsIC0gQWRkaW5nIGhhbmRsZXIgb24gZG9jdW1lbnQgc28gaXQgZmlyZXMgZGVzcGl0ZSB0aGUgYnV0dG9uIG5vdCBiZWluZyByZW5kZXJlZCB5ZXRcclxuICAgICAgJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcIiNzZWFyY2hSZXN1bHRzTW9kYWwgLmNsb3NlLWJ1dHRvblwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnI3NlYXJjaFJlc3VsdHNNb2RhbCcpLmFkZENsYXNzKCdjbG9zZWQnKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaXMtcmV2ZWFsLW9wZW4nKTtcclxuICAgICAgICB9LCA0MDApO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiLyogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBmb3Igcm9sbHVwIChodHRwOi8vcm9sbHVwanMub3JnLykgYW5kXHJcbiBlc3NlbnRpb25hbGx5ICdib290c3RyYXBzJyBvdXIgaWcuY29tICdhcHBsaWNhdGlvbicuXHJcblxyXG4gQWxsIG1vZHVsZXMgc2hvdWxkIGJlIGltcG9ydGVkIGhlcmUgc28gdGhhdCB0aGV5IGNhbiBiZSBpbml0aWFsaXplZCBvblxyXG4gYSBjYXNlLWJ5LWNhc2UgYmFzaXMgKG5vdCBhbGwgcGFnZXMgcmVxdWlyZSB0aGUgaW5pdGlhbGl6YXRpb24gb2YgYSBjYXJvdXNlbFxyXG4gZm9yIGluc3RhbmNlKS5cclxuXHJcbiBBbnkgdGFza3Mgb3IgcHJvY2Vzc2VzIHRoYXQgbmVlZCB0byBiZSBpbml0aWF0ZWQgb24gcGFnZSBsb2FkIHNob3VsZCBsaXZlIGluIHRoaXNcclxuIGZpbGUgYXMgd2VsbC4gQW4gaW5jbHVkZWQgZXhhbXBsZSBpcyBhIG1ldGhvZCB0aGF0IGFkZHMgYW4gJ2VuJyBvciAnZnInIGNsYXNzIHRvXHJcbiB0aGUgYm9keSBiYXNlZCBvbiB0aGUgZ2xvYmFsIGxhbmd1YWdlIHZhcmlhYmxlIHRoYXQgd2UgY2FuIHRoZW4gdXNlIHRvIHdyaXRlIGN1c3RvbVxyXG4gc3R5bGVzIGZvciBlYWNoIGxhbmd1YWdlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBmb3JtcyBmcm9tICcuL2Zvcm1zLmpzJztcclxuaW1wb3J0IGNhcm91c2VsIGZyb20gJy4vY2Fyb3VzZWwuanMnO1xyXG5pbXBvcnQgY2FyZWVycyBmcm9tICcuL2NhcmVlcnMuanMnO1xyXG5pbXBvcnQgdmlkZW8gZnJvbSAnLi92aWRlby5qcyc7XHJcbmltcG9ydCBzZWFyY2ggZnJvbSAnLi9zZWFyY2guanMnO1xyXG5pbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5jb25zdCBhcHAgPSAoKCkgPT4ge1xyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBGb3VuZGF0aW9uXHJcbiAgICAgICAgJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xyXG5cclxuICAgICAgICAvLyBDaGVjayBmb3IgY29tcG9uZW50c1xyXG4gICAgICAgIGlmICgkKCcuaWctZm9ybScpLmxlbmd0aCkgZm9ybXMuaW5pdCgpO1xyXG4gICAgICAgIGlmICgkKCcuaWctY2Fyb3VzZWwnKS5sZW5ndGgpIGNhcm91c2VsLmluaXQoKTtcclxuICAgICAgICBpZiAoJCgnLmlnLXNlYXJjaCcpLmxlbmd0aCkgc2VhcmNoLmluaXQoKTtcclxuICAgICAgICBpZiAoJCgnLmlnLWNhcmVlcnMnKS5sZW5ndGgpIGNhcmVlcnMuaW5pdCgpO1xyXG4gICAgICAgIGlmICgkKCcuaWctdmlkZW8tZ3JvdXAnKS5sZW5ndGgpIHZpZGVvLmluaXQoKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGxhbmd1YWdlIGNsYXNzIHRvIGJvZHlcclxuICAgICAgICAvL19sYW5ndWFnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdFxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuLy8gQm9vdHN0cmFwIGFwcFxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICBhcHAuaW5pdCgpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbImxhbmciLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiaW5kZXhPZiIsIm9sZElFIiwiZW5kcG9pbnRVUkwiLCJzdWNjZXNzVVJMIiwiY2FuY2VsVVJMIiwiJGZvcm0iLCIkZm9ybVdyYXBwZXIiLCJpbml0IiwiJCIsImZpbmQiLCJkYXRhIiwiX3ZhbGlkYXRpb24iLCJqSW5wdXQiLCJjaGFuZ2UiLCJvYmpFdmVudCIsImFkZENsYXNzIiwidmFsaWRhdG9yIiwic2V0RGVmYXVsdHMiLCJhZGRNZXRob2QiLCJwb3N0YWwiLCJlbGVtZW50Iiwib3B0aW9uYWwiLCJtYXRjaCIsInZhbGlkYXRlIiwibGFiZWwiLCJjbG9zZXN0IiwibGVuZ3RoIiwicGFyZW50IiwiYXBwZW5kIiwib24iLCJyZXBsYWNlIiwiX3Byb2Nlc3MiLCJmb3JtIiwiZm9ybURhdGFSYXciLCJmb3JtRGF0YVBhcnNlZCIsInZhbGlkIiwicmVtb3ZlQ2xhc3MiLCJzZXJpYWxpemVBcnJheSIsIl9wYXJzZSIsIl9zdWJtaXQiLCJhamF4Iiwic3VjY2VzcyIsIm1zZyIsImVycm9yIiwidG8iLCJfdG9nZ2xlciIsImhpZGUiLCJzaG93IiwibG9nIiwidG9nZ2xlQ2xhc3MiLCJfYnVpbGRDYXJvdXNlbCIsInByZXZBcnJvdyIsIm5leHRBcnJvdyIsIiRjYXJvdXNlbCIsImVhY2giLCJpbmRleCIsInNsaWNrIiwiX2NhcmVlcnNMZWdhY3lDb2RlIiwiZm4iLCJpbmZvVG9nZ2xlIiwiJHJldmVhbCIsIiRyZXZlYWxDb250ZW50IiwiJHJldmVhbFRyaWdnZXIiLCJmaXhlZEhlaWdodCIsInNldEFyaWEiLCJhdHRyIiwiaW5pdFRvZ2dsZSIsImhhbmRsZVJldmVhbFRvZ2dsZSIsInJlc2l6ZUhhbmRsZXIiLCJzZXRUaW1lb3V0Iiwic2V0UmV2ZWFsQ29udGVudEhlaWdodCIsImNzcyIsImhlaWdodCIsImZpbmFsSGVpZ2h0IiwiaGFzQ2xhc3MiLCJzY3JvbGxIZWlnaHQiLCJqUXVlcnkiLCJjaXJjbGVBbmltYXRpb24iLCJtYXhWYWx1ZSIsImNhbnZhcyIsIiRjYW52YXMiLCJjb250ZXh0IiwiZCIsIndpZHRoIiwicGVyY2VudFN0cm9rZSIsInJlbWFpbmluZ1N0cm9rZSIsInJhZGl1cyIsImN1clBlcmMiLCJjaXJjIiwiTWF0aCIsIlBJIiwicXVhcnQiLCJkZWxlZ2F0ZUlEIiwiRGF0ZSIsImdldFRpbWUiLCJpcyIsImdldENvbnRleHQiLCJzdHJva2VTdHlsZSIsImZpbGxTdHlsZSIsImRlbGVnYXRlIiwiY2xlYXIiLCJhbmltYXRlIiwiY3VycmVudCIsImxpbmVXaWR0aCIsImJlZ2luUGF0aCIsImFyYyIsIm1pbiIsInN0cm9rZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImZpbGxSZWN0IiwiYmxvY2tMaW5rIiwiJGJsb2NrTGluayIsImRlc3RpbmF0aW9uIiwiaW5pdEJsb2NrIiwiaGFuZGxlQ2xpY2siLCJndWkiLCJ2aWRlbyIsIm92ZXJsYXkiLCJpbml0TGVnYWN5IiwiT3ZlcmxheU1vZHVsZSIsIkd1aU1vZHVsZSIsImUiLCJ0YXJnZXQiLCJnZXRBdHRyaWJ1dGUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3AiLCJvZmZzZXQiLCJ0b3AiLCJzZWxlY3RvciIsInJlc2l6ZSIsIm92ZXJsYXlSZWZlcmVuY2UiLCJtdWx0aVRhYlRvZ2dsZVNlbGVjdG9yIiwibXVsdGlUYWJDb250ZW50U2VsZWN0b3IiLCJtdWx0aVRhYlNlbGVjdG9yIiwiJGVkZ2VPdmVybGF5TG9jYXRpb24iLCIkb3ZlcmxheVNsaWRlciIsIiRwcm9maWxlU2xpZGVyIiwiJHByb2ZpbGVTbGlkZXJWaWRlb1NlY3Rpb25Ib2xkZXIiLCJ3aW5kb3dTaXppbmdEZWxheSIsIndpbmRvd1Njcm9sbGluZ0RlbGF5Iiwib3ZlcmxheU9wZW4iLCJpc1Jlc3BvbnNpdmVTdGF0ZSIsInNjcm9sbGVkVG9WaWV3IiwiaW5pdEd1aSIsImV2ZW50IiwiYmFja2dyb3VuZENvbG9yIiwiJHRoaXMiLCJwYXJzZUludCIsImh0bWwiLCJoYW5kbGVPdmVybGF5RnJvbUhhc2giLCJkZWxheWVkSGFuZGxlV2luZG93U2l6aW5nIiwiZGVsYXllZEhhbmRsZVdpbmRvd1Njcm9sbCIsInRyaWdnZXIiLCJzdG9wUHJvcGFnYXRpb24iLCJhZGRNdWx0aVRhYlRvZ2dsZUhhbmRsZXJzIiwidG9nZ2xlQmFzZSIsIiRjb250YWluZXIiLCJwYXJlbnRzIiwiYW5pbWF0ZVByb2ZpbGVTbGlkZXIiLCIkcHJvZmlsZVBhbmVscyIsInByb2ZpbGVQYW5lbEhlaWdodCIsIm91dGVySGVpZ2h0IiwiY2hhbmdlU2xpZGVyU3RhdGUiLCJzbGlkZXIiLCJzdGF0ZSIsImNsZWFyVGltZW91dCIsImhhbmRsZVdpbmRvd1NpemluZyIsImhhbmRsZVdpbmRvd1Njcm9sbGluZyIsImZ1bGxIYXNoRnJhZ21lbnQiLCJoYXNoIiwib3Blbk92ZXJsYXkiLCJoYW5kbGVPdmVybGF5T3BlbiIsImhhbmRsZU92ZXJsYXlDbG9zZSIsImluaXRpYWxJbmRleCIsImhhbmRsZVNsaWRlQ2hhbmdlIiwieVBvcyIsIm92ZXJsYXlDb250ZW50Iiwib2ZmIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImRvY3VtZW50IiwidGl0bGUiLCJzZWFyY2giLCJzY3JvbGxUb3AiLCJjdXJyZW50U2xpZGUiLCJuZXh0U2xpZGUiLCJuZXh0VGl0bGUiLCJnZXQiLCJuZXdIYXNoIiwid2luZG93V2lkdGgiLCJyZXNwb25zaXZlTGltaXQiLCJuZXdJc1Jlc3BvbnNpdmVTdGF0ZSIsImluaXRQcm9maWxlU2xpZGVyIiwiaW5pdFNsaWRlciIsIm9wdGlvbnMiLCJkZWZhdWx0cyIsImV4dGVuZCIsIiRvdmVybGF5IiwiJGJvZHkiLCJvdmVybGF5U2l6aW5nRGVsYXkiLCJjdXJyZW50SW5zdGFuY2UiLCJpc09wZW5GbGFnIiwiJGNsb3NlQnV0dG9uIiwiaXNPcGVuIiwiaW5pdE92ZXJsYXkiLCJkZWxheWVkSGFuZGxlT3ZlcmxheVNpemluZyIsIkZvdW5kYXRpb24iLCJSZXZlYWwiLCJvdmVybGF5U2l6aW5nIiwiY2xvc2UiLCJmb3VuZGF0aW9uIiwib3BlbiIsImluaXRDbG9zZUJ1dHRvbiIsIiRpbm5lclNwYW4iLCJ1cmxPck1hcmt1cCIsIm9wZW5DYWxsYmFjayIsImNsb3NlQ2FsbGJhY2siLCJmdWxsU2NyZWVuIiwiZnVsbCIsIm9wZW5PdmVybGF5V2l0aEFqYXgiLCJ1cmwiLCJkb25lIiwib3Blbk92ZXJsYXlXaXRoTWFya3VwIiwibWFya3VwIiwib3ZlcmxheVNpemVDbGVhbnVwIiwib3ZlcmxheUhlaWdodCIsIndpbmRvd0hlaWdodCIsInZpZGVvSURzIiwicGxheWVycyIsImJyaWdodENvdmUiLCIkdmlkZW8iLCJpZyIsInNldEludGVydmFsIiwiX3BhcnNlVmlkZW9zIiwiJGdyb3VwIiwicHJlbG9hZE9wdGlvbnMiLCJwbGF5ZXIiLCJpZCIsImRlc2NyaXB0aW9uIiwiYXV0byIsInByZWxvYWQiLCJ0cmFuc2NyaXB0IiwiY3RhVGVtcGxhdGUiLCJwdXNoIiwiX2luamVjdFRlbXBsYXRlIiwidHJhbnNjcmlwdFRleHQiLCJyZXBsYWNlV2l0aCIsInNpYmxpbmdzIiwiX2luamVjdElmcmFtZSIsImluamVjdEJyaWdodENvdmVKUyIsImluZGV4anMiLCJfYnJpZ2h0Q292ZVJlYWR5IiwiZm9yRWFjaCIsImVsIiwicmVhZHkiLCJfb25QbGF5IiwiX29uQ29tcGxldGUiLCJwYXVzZSIsIl92aWV3U3RhdHVzIiwic2Nyb2xsIiwidmlzaWJsZSIsIl9zZWFyY2hMZWdhY3lDb2RlIiwibW9kZWxVcmwiLCIkZmllbGQiLCJocmVmIiwic3VnZ2VzdGlvbnMiLCJjaXRpZXMiLCJsb2NhdGlvbnMiLCJCbG9vZGhvdW5kIiwidG9rZW5pemVycyIsIndoaXRlc3BhY2UiLCJnZXRTZWFyY2hSZXN1bHRzIiwicGFyYW1zIiwic2VhcmNodHlwZSIsIm5hbWUiLCJnZXRKU09OIiwiYWx3YXlzIiwicmVzdWx0IiwiSlNPTiIsInBhcnNlIiwiZmFpbCIsInN0YXR1cyIsInN0YXR1c1RleHQiLCJwYXJzZVNlYXJjaFN0cmluZyIsInZhbCIsImNpdHkiLCJ3b3JkcyIsInNwbGl0IiwiaSIsInNwbGljZSIsImpvaW4iLCJkaXNwbGF5U2VhcmNoUmVzdWx0cyIsInRlbXBsYXRlSUQiLCJqc29uIiwidGVtcGxhdGUiLCJnZXRFbGVtZW50QnlJZCIsImlubmVySFRNTCIsInJlbmRlcmVkIiwiTXVzdGFjaGUiLCJyZW5kZXIiLCJ0eXBlYWhlYWQiLCJzb3VyY2UiLCJsaW1pdCIsInN1Ym1pdCIsImFwcCIsImZvcm1zIiwiY2Fyb3VzZWwiLCJjYXJlZXJzIl0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7O0FBU0EsQUFBTzs7O0FBS1AsQUFBTyxJQUFJQSxPQUFRLFlBQU07TUFDbkJDLE9BQU9DLFFBQVAsQ0FBZ0JDLFFBQWhCLENBQXlCQyxPQUF6QixDQUFpQyxNQUFqQyxNQUE2QyxDQUFDLENBQTlDLElBQW1ESCxPQUFPQyxRQUFQLENBQWdCQyxRQUFoQixDQUF5QkMsT0FBekIsQ0FBaUMsTUFBakMsTUFBNkMsQ0FBQyxDQUFyRyxFQUF3RztXQUMvRixJQUFQO0dBREYsTUFFTztXQUNFLElBQVA7O0NBSmMsRUFBWDs7O0FBU1AsQUFBTzs7O0FBS1AsQUFBTyxJQUFJQyxRQUFTLFlBQU07TUFDcEIsbUJBQW1CSixNQUF2QixFQUErQjtXQUN0QixJQUFQO0dBREYsTUFFTztXQUNFLEtBQVA7O0NBSmUsRUFBWjs7OzJDQVdQLEFBQU87O0FDckNQLFlBQWUsQ0FBQyxZQUFNOztNQUVoQkssV0FBSixFQUNFQyxVQURGLEVBRUVDLFNBRkYsRUFHRUMsS0FIRixFQUlFQyxZQUpGOztXQU1TQyxJQUFULEdBQWdCOzttQkFFQ0MsRUFBRSxVQUFGLENBQWY7WUFDUUYsYUFBYUcsSUFBYixDQUFrQixNQUFsQixDQUFSO2tCQUNjSCxhQUFhRyxJQUFiLENBQWtCLE1BQWxC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