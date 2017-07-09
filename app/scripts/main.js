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
      //_viewStatus();
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibW9kdWxlcy9nbG9iYWwuanMiLCJtb2R1bGVzL2Zvcm1zLmpzIiwibW9kdWxlcy9jYXJvdXNlbC5qcyIsIm1vZHVsZXMvY2FyZWVycy5qcyIsIm1vZHVsZXMvdmlkZW8uanMiLCJtb2R1bGVzL3NlYXJjaC5qcyIsIm1vZHVsZXMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFRoaXMgZmlsZSBpcyBmb3IgbWV0aG9kcyBhbmQgdmFyaWFibGVzIHRoYXQgYXJlIGdvaW5nIHRvIGJlXHJcbiB1c2VmdWwgYWNyb3NzIGFsbCBtb2R1bGVzLiBJbiBvcmRlciB0byB1c2UgdGhlbSBhbnl3aGVyZSwgaW1wb3J0IHdpdGg6XHJcblxyXG4gaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuIGFuZCB0aGVuIGNhbGwgd2l0aCB0aGUgaWcgbmFtZXNwYWNlIChpLmUuLCBpZy5wYXRobmFtZSwgaWcubGFuZywgZXRjKVxyXG4gKi9cclxuXHJcbi8vIHVybCBwYXRoXHJcbmV4cG9ydCB2YXIgcGF0aG5hbWUgPSAoKCkgPT4ge1xyXG4gIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XHJcbn0pKClcclxuXHJcbi8vIGxhbmd1YWdlXHJcbmV4cG9ydCB2YXIgbGFuZyA9ICgoKSA9PiB7XHJcbiAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIuJykgIT09IC0xIHx8IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKCcvZnIvJykgIT09IC0xKSB7XHJcbiAgICByZXR1cm4gJ2ZyJztcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuICdlbic7XHJcbiAgfVxyXG59KSgpXHJcblxyXG4vLyBicm93c2VyIHdpZHRoXHJcbmV4cG9ydCB2YXIgYnJvd3NlcldpZHRoID0gKCgpID0+IHtcclxuICByZXR1cm4gd2luZG93Lm91dGVyV2lkdGg7XHJcbn0pKClcclxuXHJcbi8vIGNoZWNrIGZvciBJRSAocHJlIEVkZ2UpXHJcbmV4cG9ydCB2YXIgb2xkSUUgPSAoKCkgPT4ge1xyXG4gIGlmIChcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3cpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59KSgpXHJcblxyXG4vLyBiYXNlIGV2ZW50RW1pdHRlclxyXG4vLyBleHBvcnQgdmFyIGVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5leHBvcnQgdmFyIGRlYm91bmNlID0gKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkgPT4ge1xyXG4gIHZhciB0aW1lb3V0O1xyXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xyXG4gICAgICBpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgIH07XHJcbiAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcclxuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcclxuICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gIH07XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG4iLCJpbXBvcnQgKiBhcyBpZyBmcm9tICcuL2dsb2JhbC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xyXG5cclxuICB2YXIgZW5kcG9pbnRVUkwsXHJcbiAgICBzdWNjZXNzVVJMLFxyXG4gICAgY2FuY2VsVVJMLFxyXG4gICAgJGZvcm0sXHJcbiAgICAkZm9ybVdyYXBwZXI7XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBGb3JtcyBzaG91bGQgYWx3YXlzIGJlIHdyYXBwZWQgaW4gJy5pZy1mb3JtJ1xyXG4gICAgJGZvcm1XcmFwcGVyID0gJCgnLmlnLWZvcm0nKTtcclxuICAgICRmb3JtID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGVuZHBvaW50VVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdlbmRwb2ludCcpO1xyXG4gICAgY2FuY2VsVVJMID0gJGZvcm1XcmFwcGVyLmZpbmQoJ2Zvcm0nKS5kYXRhKCdjYW5jZWwnKTtcclxuXHJcbiAgICBfdmFsaWRhdGlvbigpO1xyXG4gICAgX3RvZ2dsZXIoKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3ZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgYW4gaW5wdXQgaXMgJ2RpcnR5JyBvciBub3QgKHNpbWlsYXIgdG8gaG93IEFuZ3VsYXIgMSB3b3JrcykgaW4gb3JkZXIgZm9yIGxhYmVscyB0byBiZWhhdmUgcHJvcGVybHlcclxuICAgIHZhciBqSW5wdXQgPSAkKCc6aW5wdXQsIHRleHRhcmVhJyk7XHJcbiAgICBqSW5wdXQuY2hhbmdlKGZ1bmN0aW9uIChvYmpFdmVudCkge1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXJ0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICBkZWJ1ZzogdHJ1ZSxcclxuICAgICAgc3VjY2VzczogJ3ZhbGlkJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdjZG5Qb3N0YWwnLCBmdW5jdGlvbiAocG9zdGFsLCBlbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsKGVsZW1lbnQpIHx8XHJcbiAgICAgICAgcG9zdGFsLm1hdGNoKC9bYS16QS1aXVswLTldW2EtekEtWl0oLXwgfClbMC05XVthLXpBLVpdWzAtOV0vKTtcclxuICAgIH0sICdQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHBvc3RhbCBjb2RlLicpO1xyXG5cclxuICAgICRmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9wcm9jZXNzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiAobGFiZWwsIGVsZW1lbnQpIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGN1c3RvbS1lcnJvci1sb2NhdGlvbiBtYXJrZXIgY2xhc3MgdG8gY2hhbmdlIHdoZXJlIHRoZSBlcnJvciBsYWJlbCBzaG93cyB1cFxyXG4gICAgICAgIGlmICghJChlbGVtZW50KS5jbG9zZXN0KCcucm93JykuZmluZCgnLmN1c3RvbS1lcnJvci1sb2NhdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5wYXJlbnQoKS5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJy5yb3cnKS5maW5kKCcuY3VzdG9tLWVycm9yLWxvY2F0aW9uJykuYXBwZW5kKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgcGhvbmVVUzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGhvbmUyOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHBob25lVVM6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBvc3RhbF9jb2RlOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIGNkblBvc3RhbDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1heGxlbmd0aDogMTAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWF4bGVuZ3RoOiAxMDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtYWlsMjoge1xyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICBtYXhsZW5ndGg6IDEwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGZvcm0uZmluZCgnYnV0dG9uLmNhbmNlbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoY2FuY2VsVVJMKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wcm9jZXNzKGZvcm0pIHtcclxuICAgIHZhciBmb3JtRGF0YVJhdyxcclxuICAgICAgZm9ybURhdGFQYXJzZWQ7XHJcblxyXG4gICAgaWYgKCRmb3JtLnZhbGlkKCkpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ3NlcnZlci1lcnJvcicpO1xyXG4gICAgICAkZm9ybVdyYXBwZXIuYWRkQ2xhc3MoJ3N1Ym1pdHRpbmcnKTtcclxuICAgICAgZm9ybURhdGFSYXcgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgZGF0YSwgdXNlIHBhcnNlIG1ldGhvZFxyXG4gICAgICBmb3JtRGF0YVBhcnNlZCA9IF9wYXJzZShmb3JtRGF0YVJhdyk7XHJcbiAgICAgIC8vIFN1Ym1pdCBmaW5hbCBkYXRhXHJcbiAgICAgIF9zdWJtaXQoZm9ybURhdGFQYXJzZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3BhcnNlKGRhdGEpIHtcclxuICAgIC8vIEV4ZWN1dGUgYW55IGN1c3RvbSBsb2dpYyBoZXJlXHJcblxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc3VibWl0KGRhdGEpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IGVuZHBvaW50VVJMLFxyXG4gICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgJGZvcm1XcmFwcGVyLmFkZENsYXNzKCdzdWNjZXNzJyk7XHJcbiAgICAgICRmb3JtV3JhcHBlci5yZW1vdmVDbGFzcygnc3VibWl0dGluZycpO1xyXG4gICAgfSlcclxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAkZm9ybS5hZGRDbGFzcygnc2VydmVyLWVycm9yJyk7XHJcbiAgICAgICAgJGZvcm1XcmFwcGVyLnJlbW92ZUNsYXNzKCdzdWJtaXR0aW5nJyk7XHJcbiAgICAgICAgU2Nyb2xsTWFuLnRvKCQoJyNzZXJ2ZXItZXJyb3InKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX3RvZ2dsZXIoKSB7XHJcbiAgICAvLyBWZXJ5IHNpbXBsZSBmb3JtIHRvZ2dsZXJcclxuICAgICQoJy50b2dnbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCcudG9nZ2xlLWNvbnRlbnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJy4nICsgJCh0aGlzKS5kYXRhKCdjb250ZW50JykpLnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXRcclxuICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdDYXJvdXNlbCBJbml0aWFsaXplZCEnKVxyXG5cclxuICAgIC8vIE5vdCBzdXJlIHdoYXQgdGhpcyBkb2VzIGF0IHRoaXMgcG9pbnQgb3IgaG93IGl0IHJlbGF0ZXMgdG8gQ2Fyb3VzZWxzXHJcbiAgICAkKCdbZGF0YS1yZXNwb25zaXZlLXRvZ2dsZV0gYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ3NpdGUtaGVhZGVyLWlzLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgX2J1aWxkQ2Fyb3VzZWwoKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9idWlsZENhcm91c2VsKCkge1xyXG4gICAgdmFyIHByZXZBcnJvdyxcclxuICAgICAgbmV4dEFycm93LFxyXG4gICAgICAkY2Fyb3VzZWw7XHJcblxyXG4gICAgJCgnLmlnLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgJGNhcm91c2VsID0gJCh0aGlzKTtcclxuICAgICAgcHJldkFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCdwcmV2QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ3ByZXZBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+UHJldmlvdXM8L3NwYW4+PC9idXR0b24+JztcclxuICAgICAgbmV4dEFycm93ID0gKCRjYXJvdXNlbC5kYXRhKCduZXh0QXJyb3dUZXh0JykpID8gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPjxzcGFuIGNsYXNzPVwic2hvdy1mb3Itc3JcIj4nICsgJGNhcm91c2VsLmRhdGEoJ25leHRBcnJvd1RleHQnKSArICc8L3NwYW4+PC9idXR0b24+JyA6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj48c3BhbiBjbGFzcz1cInNob3ctZm9yLXNyXCI+TmV4dDwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuICAgICAgJGNhcm91c2VsLnNsaWNrKHtcclxuICAgICAgICBhZGFwdGl2ZUhlaWdodDogJGNhcm91c2VsLmRhdGEoJ2FkYXB0aXZlSGVpZ2h0JykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXJyb3dzOiAkY2Fyb3VzZWwuZGF0YSgnYXJyb3dzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgYXV0b1BsYXk6ICRjYXJvdXNlbC5kYXRhKCdhdXRvUGxheScpIHx8IGZhbHNlLFxyXG4gICAgICAgIGRvdHM6ICRjYXJvdXNlbC5kYXRhKCdkb3RzJykgfHwgZmFsc2UsXHJcbiAgICAgICAgZmFkZTogJGNhcm91c2VsLmRhdGEoJ2ZhZGUnKSB8fCBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogJGNhcm91c2VsLmRhdGEoJ2luZmluaXRlJykgfHwgZmFsc2UsXHJcbiAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXHJcbiAgICAgICAgbmV4dEFycm93OiBuZXh0QXJyb3csXHJcbiAgICAgICAgcHJldkFycm93OiBwcmV2QXJyb3csXHJcbiAgICAgICAgcmVzcG9uc2l2ZTogJGNhcm91c2VsLmRhdGEoJ3Jlc3BvbnNpdmUnKSB8fCAnJyxcclxuICAgICAgICBzbGlkZTogJGNhcm91c2VsLmRhdGEoJ3NsaWRlJykgfHwgJycsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZVRvU2Nyb2xsJykgfHwgMSxcclxuICAgICAgICBzbGlkZXNUb1Nob3c6ICRjYXJvdXNlbC5kYXRhKCdzbGlkZXNUb1Nob3cnKSB8fCAxLFxyXG4gICAgICAgIHNwZWVkOiAkY2Fyb3VzZWwuZGF0YSgnc3BlZWQnKSB8fCAzMDAsXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0XHJcbiAgfTtcclxufSkoKSIsImltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgoKSA9PiB7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuXHJcbiAgICAgICAgX2NhcmVlcnNMZWdhY3lDb2RlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gX2NhcmVlcnNMZWdhY3lDb2RlKCkge1xyXG4gICAgICAgIChmdW5jdGlvbiAoJCkge1xyXG5cclxuICAgICAgICAgICAgJC5mbi5pbmZvVG9nZ2xlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJHJldmVhbCA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyZXZlYWxDb250ZW50ID0gJHJldmVhbC5maW5kKCcuaW5mby10b2dnbGUtY29udGVudCcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcmV2ZWFsVHJpZ2dlciA9ICRyZXZlYWwuZmluZCgnLmluZm8tdG9nZ2xlLXRyaWdnZXInKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZml4ZWRIZWlnaHQgPSBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0QXJpYSA9ICRyZXZlYWwuYXR0cignaW5mby10b2dnbGUtYXJpYScpID09PSAndHJ1ZSc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGluaXRUb2dnbGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdFRvZ2dsZSgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHJldmVhbFRyaWdnZXIub24oJ2NsaWNrJywgaGFuZGxlUmV2ZWFsVG9nZ2xlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCByZXNpemVIYW5kbGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFJldmVhbENvbnRlbnRIZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlUmV2ZWFsVG9nZ2xlKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRSZXZlYWxDb250ZW50SGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyZXZlYWwudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChzZXRSZXZlYWxDb250ZW50SGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHJlc2l6ZUhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaXhlZEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJldmVhbENvbnRlbnQuY3NzKHtoZWlnaHQ6ICdhdXRvJ30pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzZXRSZXZlYWxDb250ZW50SGVpZ2h0KCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmluYWxIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHJldmVhbC5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsSGVpZ2h0ID0gJHJldmVhbENvbnRlbnRbMF0uc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZml4ZWRIZWlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxIZWlnaHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZml4ZWRIZWlnaHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcmV2ZWFsQ29udGVudC5jc3Moe2hlaWdodDogZmluYWxIZWlnaHR9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXRBcmlhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcmV2ZWFsQ29udGVudC5hdHRyKCdhcmlhLWhpZGRlbicsICFmaXhlZEhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfSkoalF1ZXJ5KTtcclxuXHJcblxyXG4gICAgICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAgICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAgICAgICAkLmZuLmNpcmNsZUFuaW1hdGlvbiA9IGZ1bmN0aW9uIChtYXhWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FudmFzID0gdGhpcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGNhbnZhcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBjYW52YXMud2lkdGggLyAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJjZW50U3Ryb2tlID0gNyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtYWluaW5nU3Ryb2tlID0gMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFkaXVzID0gZCAtIHBlcmNlbnRTdHJva2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1clBlcmMgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaXJjID0gTWF0aC5QSSAqIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YXJ0ID0gTWF0aC5QSSAvIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGVnYXRlSUQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArICdDQSc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghJGNhbnZhcy5pcygnY2FudmFzJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzBkMjYzYyc7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnI2U1ZThlOCc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRjYW52YXMuYXR0cignY2lyY2xlLWFuaW1hdGlvbi1pZCcsIGRlbGVnYXRlSUQpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5kZWxlZ2F0ZSgnW2NpcmNsZS1hbmltYXRpb24taWQ9JyArIGRlbGVnYXRlSUQgKyAnXScsICdzdGFydEFuaW1hdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1clBlcmMgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmRlbGVnYXRlKCdbY2lyY2xlLWFuaW1hdGlvbi1pZD0nICsgZGVsZWdhdGVJRCArICddJywgJ2NsZWFyQW5pbWF0ZScsIGNsZWFyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZShjdXJyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50ID8gY3VycmVudCA6IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gcGVyY2VudFN0cm9rZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1NYXRoLm1pbihjdXJyZW50LCBtYXhWYWx1ZSAvIDEwMCkpIC0gcXVhcnQsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IHJlbWFpbmluZ1N0cm9rZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5hcmMoZCwgZCwgcmFkaXVzLCAtKHF1YXJ0KSwgKChjaXJjKSAqIC1jdXJyZW50KSAtIHF1YXJ0LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyUGVyYysrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyUGVyYyA8IDExMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZShjdXJQZXJjIC8gMTAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNsZWFyKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLndpZHRoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfSkoalF1ZXJ5KTtcclxuXHJcbiAgICAgICAgKGZ1bmN0aW9uICgkKSB7XHJcbiAgICAgICAgICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAgICAgICAgICQuZm4uYmxvY2tMaW5rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJGJsb2NrTGluayA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uID0gJGJsb2NrTGluay5maW5kKCdhJykuYXR0cignaHJlZicpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vZGVzdGluYXRpb24gPSAnNDQ0Mi5hc3B4LycgKyBkZXN0aW5hdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBpbml0QmxvY2soKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdEJsb2NrKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkYmxvY2tMaW5rLm9uKCdjbGljaycsIGhhbmRsZUNsaWNrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uID0gZGVzdGluYXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH0pKGpRdWVyeSk7XHJcblxyXG4gICAgICAgIChmdW5jdGlvbiAoJCkge1xyXG4gICAgICAgICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAgICAgICB2YXIgZ3VpLFxyXG4gICAgICAgICAgICAgICAgdmlkZW8sXHJcbiAgICAgICAgICAgICAgICBvdmVybGF5O1xyXG5cclxuICAgICAgICAgICAgaW5pdExlZ2FjeSgpO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gaW5pdExlZ2FjeSgpIHtcclxuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgd2VpcmQgLSBub3QgZ29pbmcgdG8gdG91Y2ggaXRcclxuICAgICAgICAgICAgICAgIG92ZXJsYXkgPSBuZXcgT3ZlcmxheU1vZHVsZSgpO1xyXG4gICAgICAgICAgICAgICAgZ3VpID0gbmV3IEd1aU1vZHVsZShvdmVybGF5KTtcclxuICAgICAgICAgICAgICAgIC8vIHZpZGVvID0gbmV3IFZpZGVvTW9kdWxlKCk7IC8vIFJlcGxhY2Ugd2l0aCB2aWRlby5qcyBtb2R1bGVcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBOZWVkIHRvIGhhdmUgYSBjbGFzcyB0byBob29rIG9udG8gZm9yIEZyZW5jaCBsYW5ndWFnZSBwYWdlXHJcbiAgICAgICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoJy9mci8nKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2ZyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU21vb3RoIHNjcm9sbGluZyBmb3IgYW5jaG9yIGxpbmtzXHJcbiAgICAgICAgICAgICAgICAkKCdhW2hyZWZePVwiI1wiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9ICQodGhpcy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wICsgNTJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNzUwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuc2VsZWN0b3IgIT09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNtYWluLW1lbnUtYW5jaG9yJykuY3NzKHsnZGlzcGxheSc6ICdub25lJ30pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2lzLXJldmVhbC1vcGVuIGJyYW5kZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBNb2JpbGUgbWVudSBuZWVkcyB0byBtaW1pYyBGb3VuZGF0aW9uIHJldmVhbCAtIG5vdCBlbm91Z2ggdGltZSB0byBpbXBsZW1lbnQgZGlmZmVyZW50IG5hdnMgaW4gYSByZXZlYWwgbW9kYWwgcHJvcGVybHlcclxuICAgICAgICAgICAgICAgICQoJy5tZW51LWljb24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaXMtcmV2ZWFsLW9wZW4gYnJhbmRlZCcpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gcXVpY2sgYW5kIGRpcnR5IG1vYmlsZSBtZW51IGNsb3NlcyAtIG5vdCBmYW1pbGlhciB3aXRoIEZvdW5kYXRpb24gcGF0dGVybiB0byBmaXJlIHRoZXNlXHJcbiAgICAgICAgICAgICAgICAkKCcudG9wLWJhciAuY2xvc2UtYnV0dG9uLnNob3ctZm9yLXNtYWxsLW9ubHknKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI21haW4tbWVudS1hbmNob3InKS5jc3MoeydkaXNwbGF5JzogJ25vbmUnfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdpcy1yZXZlYWwtb3BlbiBicmFuZGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA2NDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdicmFuZGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vLS0tLS1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIEd1aU1vZHVsZShvdmVybGF5UmVmZXJlbmNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbXVsdGlUYWJUb2dnbGVTZWxlY3RvciA9ICdbY2xhc3MqPVwidG9nZ2xlLVwiXTpub3QoW2NsYXNzKj1cImluZm8tdG9nZ2xlXCJdKScsXHJcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlUYWJDb250ZW50U2VsZWN0b3IgPSAnW2NsYXNzKj1cImNvbnRlbnQtXCJdJyxcclxuICAgICAgICAgICAgICAgICAgICBtdWx0aVRhYlNlbGVjdG9yID0gJy5tdWx0aS10YWItb3V0bGluZScsXHJcbiAgICAgICAgICAgICAgICAgICAgJGVkZ2VPdmVybGF5TG9jYXRpb24gPSAkKCcjZWRnZS1vdmVybGF5LWNvbnRlbnQnKSxcclxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5ID0gb3ZlcmxheVJlZmVyZW5jZSxcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheVNsaWRlcixcclxuICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlcixcclxuICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlclZpZGVvU2VjdGlvbkhvbGRlciA9ICQoJzxkaXY+PC9kaXY+JyksXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93U2l6aW5nRGVsYXksXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93U2Nyb2xsaW5nRGVsYXksXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheU9wZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgaXNSZXNwb25zaXZlU3RhdGUgPSBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxlZFRvVmlldyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGluaXRHdWkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbml0R3VpKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZE11bHRpVGFiVG9nZ2xlSGFuZGxlcnMoKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuYmxvY2stbGluaycpLmJsb2NrTGluaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5U2xpZGVyID0gJCgnLm91ci1idXNpbmVzcy1zbGlkZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjZWRnZS1vdmVybGF5LWNvbnRlbnQnKS5maW5kKCcuY2Fyb3VzZWwtbmV4dCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheVNsaWRlci5zbGljaygnc2xpY2tOZXh0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKFwiLnZpZGVvLXNsaWRlLnNsaWNrLWFjdGl2ZVwiKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnNsaWNrLWxpc3QuZHJhZ2dhYmxlJykuY3NzKHtoZWlnaHQ6ICc2NjBweCd9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnNlY3Rpb24ucHJvZmlsZXMtc2xpZGVyJykuY3NzKHtiYWNrZ3JvdW5kQ29sb3I6ICcjZTVlOGU4J30pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5zbGljay1saXN0LmRyYWdnYWJsZScpLmNzcyh7aGVpZ2h0OiAnYXV0byd9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnNlY3Rpb24ucHJvZmlsZXMtc2xpZGVyJykuY3NzKHtiYWNrZ3JvdW5kQ29sb3I6ICcjN2VjNGI5J30pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnByb2ZpbGUtY291bnRlcicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnY2FudmFzJykuY2lyY2xlQW5pbWF0aW9uKHBhcnNlSW50KCR0aGlzLmZpbmQoJ3AnKS5odG1sKCkpKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlciA9ICQoJy5wcm9maWxlcy1zbGlkZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCBoYW5kbGVPdmVybGF5RnJvbUhhc2gpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZU92ZXJsYXlGcm9tSGFzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZGVsYXllZEhhbmRsZVdpbmRvd1NpemluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlV2luZG93U2l6aW5nKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZGVsYXllZEhhbmRsZVdpbmRvd1Njcm9sbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlV2luZG93U2Nyb2xsaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICQoJy5pbmZvLXRvZ2dsZScpLmluZm9Ub2dnbGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcudG9wLWJhciArIC5zY3JlZW4nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ2FbZGF0YS10b2dnbGVdJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTm90IHByZXR0eSAtIGp1c3QgYWRkaW5nIHF1aWNrIGFuZCBkaXJ0eSBzaGFyZSBsaW5rIGFjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICQoJy5zaGFyZS10b2dnbGUtdHJpZ2dlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmluZm8tdG9nZ2xlJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKCcuc2hhcmUtdG9nZ2xlLWNsb3NlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuaW5mby10b2dnbGUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFkZE11bHRpVGFiVG9nZ2xlSGFuZGxlcnMoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmRlbGVnYXRlKG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZUJhc2UgPSAkdGhpcy5hdHRyKCdjbGFzcycpLm1hdGNoKC90b2dnbGUtKFxcUyopPygkfFxccykvKVsxXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAkdGhpcy5wYXJlbnRzKG11bHRpVGFiU2VsZWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKG11bHRpVGFiVG9nZ2xlU2VsZWN0b3IpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKG11bHRpVGFiQ29udGVudFNlbGVjdG9yKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKCcuY29udGVudC0nICsgdG9nZ2xlQmFzZSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZVByb2ZpbGVTbGlkZXIoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICRwcm9maWxlUGFuZWxzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlUGFuZWxIZWlnaHQgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsZWRUb1ZpZXcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIuZmluZCgnLnNsaWNrLXNsaWRlJykucmVtb3ZlQ2xhc3MoJ3NsaWNrLWNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwcm9maWxlU2xpZGVyLmZpbmQoJy5zbGljay1hY3RpdmUnKS5hZGRDbGFzcygnc2xpY2stY29tcGxldGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuc2xpY2stc2xpZGU6bm90KC5zbGljay1jb21wbGV0ZSknKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5wcm9maWxlLWNvdW50ZXIgY2FudmFzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdjbGVhckFuaW1hdGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuc2xpY2stY29tcGxldGUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5wcm9maWxlLWNvdW50ZXIgY2FudmFzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdzdGFydEFuaW1hdGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRwcm9maWxlU2xpZGVyLmZpbmQoJy5zbGljay1hY3RpdmUnKS5pcygnW2NsYXNzKj1wcm9maWxlLV0nKSB8fCBpc1Jlc3BvbnNpdmVTdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVTbGlkZXIuYWRkQ2xhc3MoJ2NvbnRyYXN0LWFycm93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5yZW1vdmVDbGFzcygnY29udHJhc3QtYXJyb3cnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVBhbmVscyA9ICRwcm9maWxlU2xpZGVyLmZpbmQoJy5wcm9maWxlLTEtc2xpZGUsIC5wcm9maWxlLTItc2xpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2ZpbGVQYW5lbHMuY3NzKHtoZWlnaHQ6ICdhdXRvJ30pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVBhbmVscy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gJCh0aGlzKS5vdXRlckhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50ID4gcHJvZmlsZVBhbmVsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZmlsZVBhbmVsSGVpZ2h0ID0gY3VycmVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwcm9maWxlUGFuZWxzLmNzcyh7aGVpZ2h0OiBwcm9maWxlUGFuZWxIZWlnaHR9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY2hhbmdlU2xpZGVyU3RhdGUoc2xpZGVyLCBzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwiYWNjZXNzaWJpbGl0eVwiLCBzdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVyLnNsaWNrKFwic2xpY2tTZXRPcHRpb25cIiwgXCJkcmFnZ2FibGVcIiwgc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwic3dpcGVcIiwgc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5zbGljayhcInNsaWNrU2V0T3B0aW9uXCIsIFwidG91Y2hNb3ZlXCIsIHN0YXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBkZWxheWVkSGFuZGxlV2luZG93U2l6aW5nKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3dTaXppbmdEZWxheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHdpbmRvd1NpemluZ0RlbGF5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvd1NpemluZ0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQoaGFuZGxlV2luZG93U2l6aW5nLCAyNTApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWRIYW5kbGVXaW5kb3dTY3JvbGwoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdpbmRvd1Njcm9sbGluZ0RlbGF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQod2luZG93U2Nyb2xsaW5nRGVsYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93U2Nyb2xsaW5nRGVsYXkgPSB3aW5kb3cuc2V0VGltZW91dChoYW5kbGVXaW5kb3dTY3JvbGxpbmcsIDI1MCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheUZyb21IYXNoKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZ1bGxIYXNoRnJhZ21lbnQgPSAnI291ci1lZGdlLSc7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW92ZXJsYXlPcGVuICYmIGxvY2F0aW9uLmhhc2guaW5kZXhPZihmdWxsSGFzaEZyYWdtZW50KSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVybGF5Lm9wZW5PdmVybGF5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVkZ2VPdmVybGF5TG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVPdmVybGF5T3BlbiwgaGFuZGxlT3ZlcmxheUNsb3NlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlT3ZlcmxheU9wZW4oZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5pdGlhbEluZGV4O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbml0U2xpZGVyKCRvdmVybGF5U2xpZGVyLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxJbmRleCA9ICRvdmVybGF5U2xpZGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuJyArIGxvY2F0aW9uLmhhc2gucmVwbGFjZSgnI291ci0nLCAnJykgKyAnOm5vdCguc2xpY2stY2xvbmVkKScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXlTbGlkZXIuc2xpY2soJ3NsaWNrR29UbycsIGluaXRpYWxJbmRleCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXlTbGlkZXIub24oJ2FmdGVyQ2hhbmdlJywgaGFuZGxlU2xpZGVDaGFuZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVNsaWRlQ2hhbmdlKG51bGwsIG51bGwsIHBhcnNlSW50KCQoJyNtb2RhbE92ZXJsYXkgLnNsaWNrLWFjdGl2ZScpLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVdpbmRvd1NpemluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXlPcGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVPdmVybGF5Q2xvc2UoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgeVBvcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUNvbnRlbnQgPSAkKCcjbW9kYWxPdmVybGF5ID4gZGl2Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5U2xpZGVyLnNsaWNrKCd1bnNsaWNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXlTbGlkZXIub2ZmKCdhZnRlckNoYW5nZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5vdmVybGF5LXJlcG9zaXRvcnknKS5hcHBlbmQob3ZlcmxheUNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcInB1c2hTdGF0ZVwiIGluIGhpc3RvcnkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKFwiXCIsIGRvY3VtZW50LnRpdGxlLCBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlQb3MgPSAkKGRvY3VtZW50KS5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24uaGFzaCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQpLnNjcm9sbFRvcCh5UG9zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheU9wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVTbGlkZUNoYW5nZShldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0U2xpZGUgPSAoY3VycmVudFNsaWRlICsgMSkgJSAoJCgnLnNsaWNrLXNsaWRlOm5vdCguc2xpY2stY2xvbmVkKScpLmxlbmd0aCAtIDEpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0VGl0bGUgPSAkKCRvdmVybGF5U2xpZGVyLmZpbmQoJ1tkYXRhLXNsaWNrLWluZGV4PScgKyBuZXh0U2xpZGUgKyAnXSAuY29sdW1uczpmaXJzdC1jaGlsZCBwJykuZ2V0KDApKS5odG1sKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hhc2ggPSAnb3VyLScgKyAkb3ZlcmxheVNsaWRlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCdbZGF0YS1zbGljay1pbmRleD0nICsgY3VycmVudFNsaWRlICsgJ10nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hdGNoKC8oZWRnZS1cXFMqKS8pWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKCcjbW9kYWxPdmVybGF5IC5jYXJvdXNlbC1uZXh0IGEnKS5odG1sKG5leHRUaXRsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24uaGFzaCA9IG5ld0hhc2g7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlV2luZG93U2l6aW5nKGluaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgd2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2l2ZUxpbWl0ID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3SXNSZXNwb25zaXZlU3RhdGUgPSB3aW5kb3dXaWR0aCA8IHJlc3BvbnNpdmVMaW1pdDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRvdmVybGF5U2xpZGVyLmlzKCcuc2xpY2staW5pdGlhbGl6ZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VTbGlkZXJTdGF0ZSgkb3ZlcmxheVNsaWRlciwgIW5ld0lzUmVzcG9uc2l2ZVN0YXRlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1Jlc3BvbnNpdmVTdGF0ZSAhPT0gbmV3SXNSZXNwb25zaXZlU3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNSZXNwb25zaXZlU3RhdGUgPSBuZXdJc1Jlc3BvbnNpdmVTdGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdFByb2ZpbGVTbGlkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlV2luZG93U2Nyb2xsaW5nKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2Nyb2xsZWRUb1ZpZXcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQod2luZG93KS5zY3JvbGxUb3AoKSArICQod2luZG93KS5oZWlnaHQoKSA+ICRwcm9maWxlU2xpZGVyLm9mZnNldCgpLnRvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsZWRUb1ZpZXcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoYW5pbWF0ZVByb2ZpbGVTbGlkZXIsIDUwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdFByb2ZpbGVTbGlkZXIoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdFNsaWRlcigkcHJvZmlsZVNsaWRlciwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldkFycm93OiAnPHNwYW4gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2Fyb3VzZWwtcHJldiBnYS1jYXJlZXJzLW91ci1wZW9wbGUtY2Fyb3VzZWwtc2Nyb2xsXCI+PGltZyBzcmM9XCIvY29udGVudC9kYW0vaW52ZXN0b3JzZ3JvdXAvYXBwL2NhcmVlcnMvaW1hZ2VzL0Fycm93LU1haW5BcnRpY2xlLUNhcm91c2VsLUJsYWNrLUwucG5nXCI+PC9zcGFuPicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRBcnJvdzogJzxzcGFuIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNhcm91c2VsLW5leHQgZ2EtY2FyZWVycy1vdXItcGVvcGxlLWNhcm91c2VsLXNjcm9sbFwiPjxpbWcgc3JjPVwiL2NvbnRlbnQvZGFtL2ludmVzdG9yc2dyb3VwL2FwcC9jYXJlZXJzL2ltYWdlcy9BcnJvdy1NYWluQXJ0aWNsZS1DYXJvdXNlbC1CbGFjay1SLnBuZ1wiPjwvc3Bhbj4nXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZVByb2ZpbGVTbGlkZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAkcHJvZmlsZVNsaWRlci5vbignYWZ0ZXJDaGFuZ2UnLCBhbmltYXRlUHJvZmlsZVNsaWRlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdFNsaWRlcih0YXJnZXQsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwZWVkOiA3NTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvdHNDbGFzczogJ3NsaWNrLWRvdHMgZ2EtY2FyZWVycy1vdXItcGVvcGxlLWNhcm91c2VsLXNjcm9sbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zaXZlOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnNsaWNrKCQuZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIE92ZXJsYXlNb2R1bGUoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJG92ZXJsYXksXHJcbiAgICAgICAgICAgICAgICAgICAgJGJvZHkgPSAkKCdib2R5JyksXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVNpemluZ0RlbGF5LFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZSA9IHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIGlzT3BlbkZsYWcgPSBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAkY2xvc2VCdXR0b247XHJcblxyXG4gICAgICAgICAgICAgICAgaW5pdE92ZXJsYXkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wZW5PdmVybGF5OiBvcGVuT3ZlcmxheSxcclxuICAgICAgICAgICAgICAgICAgICBpc09wZW46IGlzT3BlblxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbml0T3ZlcmxheSgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheSA9ICQoJzxkaXY+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuYXR0cignaWQnLCAnbW9kYWxPdmVybGF5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuYXR0cignY2xhc3MnLCAncmV2ZWFsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuYXR0cignZGF0YS1yZXZlYWwnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAkYm9keS5hcHBlbmQoJG92ZXJsYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5Lm9uKCdvcGVuLnpmLnJldmVhbCcsIGhhbmRsZU92ZXJsYXlPcGVuKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oJ2Nsb3NlZC56Zi5yZXZlYWwnLCBoYW5kbGVPdmVybGF5Q2xvc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZGVsYXllZEhhbmRsZU92ZXJsYXlTaXppbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRDbG9zZUJ1dHRvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBGb3VuZGF0aW9uLlJldmVhbCgkb3ZlcmxheSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8tLS0tLVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRlbGF5ZWRIYW5kbGVPdmVybGF5U2l6aW5nKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvdmVybGF5U2l6aW5nRGVsYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChvdmVybGF5U2l6aW5nRGVsYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVNpemluZ0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQob3ZlcmxheVNpemluZywgMjUwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVPdmVybGF5Q2xvc2UoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpc09wZW5GbGFnID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZS5jbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5zdGFuY2UuY2xvc2UoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5U2l6ZUNsZWFudXAoKTtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5zdGFuY2UgPSB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBoYW5kbGVPdmVybGF5T3BlbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNPcGVuRmxhZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdpcy1yZXZlYWwtb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5LmZpbmQoJyonKS5mb3VuZGF0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRJbnN0YW5jZS5vcGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5vcGVuKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVNpemluZygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXRDbG9zZUJ1dHRvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJGlubmVyU3BhbiA9ICQoJzxzcGFuPjwvc3Bhbj4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGNsb3NlQnV0dG9uID0gJCgnPGJ1dHRvbiBkYXRhLWNsb3NlPjwvYnV0dG9uPicpO1xyXG4gICAgICAgICAgICAgICAgICAgICRjbG9zZUJ1dHRvbi5hZGRDbGFzcygnY2xvc2UtYnV0dG9uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGNsb3NlQnV0dG9uLmF0dHIoJ2FyaWEtbGFiZWwnLCAnQ2xvc2UgbW9kYWwnKTtcclxuICAgICAgICAgICAgICAgICAgICAkaW5uZXJTcGFuLmF0dHIoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlubmVyU3Bhbi5odG1sKCcmdGltZXM7Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGNsb3NlQnV0dG9uLmFwcGVuZCgkaW5uZXJTcGFuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBpc09wZW4oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzT3BlbkZsYWc7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb3Blbk92ZXJsYXkodXJsT3JNYXJrdXAsIG9wZW5DYWxsYmFjaywgY2xvc2VDYWxsYmFjaywgZnVsbFNjcmVlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5vcGVuID0gb3BlbkNhbGxiYWNrO1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbnN0YW5jZS5jbG9zZSA9IGNsb3NlQ2FsbGJhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEluc3RhbmNlLmZ1bGwgPSBmdWxsU2NyZWVuO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdXJsT3JNYXJrdXAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5PdmVybGF5V2l0aEFqYXgodXJsT3JNYXJrdXApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5PdmVybGF5V2l0aE1hcmt1cCh1cmxPck1hcmt1cCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvcGVuT3ZlcmxheVdpdGhBamF4KHVybCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh1cmwpLmRvbmUob3Blbk92ZXJsYXlXaXRoTWFya3VwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvcGVuT3ZlcmxheVdpdGhNYXJrdXAobWFya3VwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuaHRtbChtYXJrdXApO1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5LmFwcGVuZCgkY2xvc2VCdXR0b24pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50SW5zdGFuY2UuZnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5hZGRDbGFzcygnZnVsbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5mb3VuZGF0aW9uKCdvcGVuJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gb3ZlcmxheVNpemVDbGVhbnVwKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRvdmVybGF5LnJlbW92ZUNsYXNzKCdmdWxsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ3RvdXInKTtcclxuICAgICAgICAgICAgICAgICAgICAkb3ZlcmxheS5odG1sKCcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvdmVybGF5U2l6aW5nKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvdmVybGF5SGVpZ2h0ID0gJG92ZXJsYXkuaGVpZ2h0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvd0hlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG92ZXJsYXlIZWlnaHQgPiB3aW5kb3dIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG92ZXJsYXkuYWRkQ2xhc3MoJ2Z1bGwnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSkoalF1ZXJ5KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0XHJcbiAgICB9O1xyXG59KSgpIiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgdmFyIHZpZGVvSURzID0gW10sXHJcbiAgICBwbGF5ZXJzID0gW10sXHJcbiAgICBicmlnaHRDb3ZlLFxyXG4gICAgJHZpZGVvO1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG5cclxuICAgIF9wYXJzZVZpZGVvcygpO1xyXG5cclxuICAgIGlmICghaWcub2xkSUUpIHtcclxuXHJcbiAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgVmlkZW9KUyBtZXRob2QgaXMgYXZhaWxhYmxlIGFuZCBmaXJlIHJlYWR5IGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgIGJyaWdodENvdmUgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQoJy52anMtcGx1Z2lucy1yZWFkeScpLmxlbmd0aCkge1xyXG4gICAgICAgICAgX2JyaWdodENvdmVSZWFkeSgpO1xyXG4gICAgICAgICAgY2xlYXJJbnRlcnZhbChicmlnaHRDb3ZlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDUwMCk7XHJcblxyXG4gICAgICAvLyBGdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgdmlkZW8ncyBoYXZlIHNjcm9sbGVkIG9mZiBzY3JlZW4gYW5kIG5lZWQgdG8gYmUgcGF1c2VkXHJcbiAgICAgIC8vX3ZpZXdTdGF0dXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9wYXJzZVZpZGVvcygpIHtcclxuICAgIHZhciAkZ3JvdXAsXHJcbiAgICAgIGRhdGEgPSB7fSxcclxuICAgICAgcHJlbG9hZE9wdGlvbnMgPSBbJ2F1dG8nLCAnbWV0YWRhdGEnLCAnbm9uZSddO1xyXG5cclxuICAgIC8vIEVhY2ggZ3JvdXAgY2FuIGVmZmVjdGl2ZWx5IHVzZSBhIGRpZmZlcmVudCBwbGF5ZXIgd2hpY2ggd2lsbCBvbmx5IGJlIGxvYWRlZCBvbmNlXHJcbiAgICAkKCcuaWctdmlkZW8tZ3JvdXAnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgJGdyb3VwID0gJCh0aGlzKTtcclxuICAgICAgZGF0YS5wbGF5ZXIgPSAkZ3JvdXAuZGF0YSgncGxheWVyJyk7XHJcblxyXG4gICAgICAvLyBMb29wIHRocm91Z2ggdmlkZW8nc1xyXG4gICAgICAkZ3JvdXAuZmluZCgnLmlnLXZpZGVvLWpzJykuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAkdmlkZW8gPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICBkYXRhLmlkID0gJHZpZGVvLmRhdGEoJ2lkJyk7XHJcbiAgICAgICAgZGF0YS50aXRsZSA9ICR2aWRlby5kYXRhKCd0aXRsZScpID8gJHZpZGVvLmRhdGEoJ3RpdGxlJykgOiAnJztcclxuICAgICAgICBkYXRhLmRlc2NyaXB0aW9uID0gJHZpZGVvLmRhdGEoJ2Rlc2NyaXB0aW9uJykgPyAkdmlkZW8uZGF0YSgnZGVzY3JpcHRpb24nKSA6ICcnO1xyXG5cclxuICAgICAgICBpZiAoaWcub2xkSUUpIHtcclxuXHJcbiAgICAgICAgICBfaW5qZWN0SWZyYW1lKGRhdGEsICR2aWRlbyk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgLy8gQ2FwdHVyZSBvcHRpb25zIHRoYXQgYXJlIHVzZWQgd2l0aCBtb2Rlcm4gYnJvd3NlcnNcclxuICAgICAgICAgIGRhdGEub3ZlcmxheSA9ICR2aWRlby5kYXRhKCdvdmVybGF5JylcclxuICAgICAgICAgICAgPyAkdmlkZW8uZGF0YSgnb3ZlcmxheScpXHJcbiAgICAgICAgICAgIDogJyc7XHJcbiAgICAgICAgICBkYXRhLmF1dG8gPSAkdmlkZW8uZGF0YSgnYXV0b3BsYXknKSA/ICdhdXRvcGxheScgOiAnJztcclxuICAgICAgICAgIGRhdGEucHJlbG9hZCA9IChwcmVsb2FkT3B0aW9ucy5pbmRleE9mKCR2aWRlby5kYXRhKCdwcmVsb2FkJykpID4gLTEpID8gJHZpZGVvLmRhdGEoJ3ByZWxvYWQnKSA6ICdhdXRvJztcclxuICAgICAgICAgIGRhdGEudHJhbnNjcmlwdCA9ICR2aWRlby5kYXRhKCd0cmFuc2NyaXB0JykgPyAkdmlkZW8uZGF0YShcclxuICAgICAgICAgICAgJ3RyYW5zY3JpcHQnKSA6ICcnO1xyXG4gICAgICAgICAgZGF0YS5jdGFUZW1wbGF0ZSA9ICR2aWRlby5kYXRhKCdjdGFUZW1wbGF0ZScpID8gJHZpZGVvLmRhdGEoXHJcbiAgICAgICAgICAgICdjdGFUZW1wbGF0ZScpIDogJyc7XHJcblxyXG4gICAgICAgICAgLy8gU3RvcmUgSUQncyBmb3IgYWxsIHZpZGVvJ3Mgb24gdGhlIHBhZ2UgLSBpbiBjYXNlIHdlIHdhbnQgdG8gcnVuIGEgcG9zdC1sb2FkIHByb2Nlc3Mgb24gZWFjaFxyXG4gICAgICAgICAgdmlkZW9JRHMucHVzaChkYXRhLmlkKTtcclxuXHJcbiAgICAgICAgICAvLyBMZXQncyByZXBsYWNlIHRoZSBpZy12aWRlby1qcyAnZGlyZWN0aXZlJyB3aXRoIHRoZSBuZWNlc3NhcnkgQnJpZ2h0Y292ZSBjb2RlXHJcbiAgICAgICAgICBfaW5qZWN0VGVtcGxhdGUoZGF0YSwgaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBPbmx5IGluamVjdCBCcmlnaHRjb3ZlIEpTIGlmIG1vZGVybiBicm93c2VyXHJcbiAgICAgIGlmICghaWcub2xkSUUpIHtcclxuICAgICAgICBpbmplY3RCcmlnaHRDb3ZlSlMoZGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9pbmplY3RUZW1wbGF0ZShkYXRhLCBpbmRleCkge1xyXG4gICAgdmFyIHRyYW5zY3JpcHRUZXh0ID0geyAnZW4nOiAnVHJhbnNjcmlwdCcsICdmcic6ICdUcmFuc2NyaXB0aW9uJyB9LFxyXG4gICAgICBodG1sID0gYDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXIgJHtkYXRhLmlkfVwiPjxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXItcmVzcG9uc2l2ZVwiPmA7XHJcblxyXG4gICAgaWYgKGRhdGEuY3RhVGVtcGxhdGUubGVuZ3RoID4gMCkge1xyXG4gICAgICBodG1sICs9IGA8c3BhbiBjbGFzcz1cInZpZGVvLWN0YVwiPiR7ZGF0YS5jdGFUZW1wbGF0ZX08L3NwYW4+YDtcclxuICAgIH1cclxuICAgIGlmIChkYXRhLm92ZXJsYXkubGVuZ3RoID4gMCkge1xyXG4gICAgICBodG1sICs9IGA8c3BhbiBjbGFzcz1cInZpZGVvLW92ZXJsYXlcIiBzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6IHVybCgnJHtkYXRhLm92ZXJsYXl9Jyk7XCI+PC9zcGFuPmA7XHJcbiAgICB9XHJcbiAgICBodG1sICs9IGA8dmlkZW8gZGF0YS1zZXR1cD0ne1widGVjaE9yZGVyXCI6IFtcImh0bWw1XCJdfScgZGF0YS12aWRlby1pZD1cIiR7ZGF0YS5pZH1cIiBwcmVsb2FkPVwiJHtkYXRhLnByZWxvYWR9XCIgZGF0YS1hY2NvdW50PVwiMzkwNjk0Mjg2MTAwMVwiIGRhdGEtcGxheWVyPVwiJHtkYXRhLnBsYXllcn1cIiBkYXRhLWVtYmVkPVwiZGVmYXVsdFwiIGRhdGEtYXBwbGljYXRpb24taWQ9XCIke2luZGV4fVwiIGNsYXNzPVwidmlkZW8tanNcIiBpZD1cIiR7ZGF0YS5pZH1cIiBjb250cm9scyAke2RhdGEuYXV0b30+PC92aWRlbz48L2Rpdj5gO1xyXG4gICAgaWYgKGRhdGEudHJhbnNjcmlwdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGh0bWwgKz0gYDxkaXYgY2xhc3M9XCJ2aWRlby10cmFuc2NyaXB0XCI+PGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIiR7ZGF0YS50cmFuc2NyaXB0fVwiPiR7dHJhbnNjcmlwdFRleHRbaWcubGFuZ119PC9hPjwvZGl2PmA7XHJcbiAgICB9XHJcbiAgICBodG1sICs9IGA8L2Rpdj48aDIgY2xhc3M9XCJ2aWRlby10aXRsZVwiPiR7ZGF0YS50aXRsZX08L2gyPjxwIGNsYXNzPVwidmlkZW8tZGVzY3JpcHRpb25cIj4ke2RhdGEuZGVzY3JpcHRpb259PC9wPmA7XHJcbiAgICAkdmlkZW8gPSAkdmlkZW8ucmVwbGFjZVdpdGgoaHRtbCk7XHJcblxyXG4gICAgaWYgKGRhdGEub3ZlcmxheSkge1xyXG4gICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnIycgKyBkYXRhLmlkLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLnZpZGVvLW92ZXJsYXknKS5oaWRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2luamVjdElmcmFtZShkYXRhKSB7XHJcbiAgICB2YXIgaHRtbCA9IGA8ZGl2IGNsYXNzPVwidmlkZW8tY29udGFpbmVyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJ2aWRlby1jb250YWluZXItcmVzcG9uc2l2ZVwiPlxyXG4gICAgICA8aWZyYW1lIGNsYXNzPVwidmlkZW8tanNcIiBzcmM9Jy8vcGxheWVycy5icmlnaHRjb3ZlLm5ldC8zOTA2OTQyODYxMDAxLyR7ZGF0YS5wbGF5ZXJ9X2RlZmF1bHQvaW5kZXguaHRtbD92aWRlb0lkPSR7ZGF0YS5pZH0nXHJcbiAgICBhbGxvd2Z1bGxzY3JlZW4gd2Via2l0YWxsb3dmdWxsc2NyZWVuIG1vemFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT5cclxuICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+PGgyIGNsYXNzPVwidmlkZW8tdGl0bGVcIj4ke2RhdGEudGl0bGV9PC9oMj48cCBjbGFzcz1cInZpZGVvLWRlc2NyaXB0aW9uXCI+JHtkYXRhLmRlc2NyaXB0aW9ufTwvcD5gO1xyXG4gICAgJHZpZGVvID0gJHZpZGVvLnJlcGxhY2VXaXRoKGh0bWwpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaW5qZWN0QnJpZ2h0Q292ZUpTKGRhdGEpIHtcclxuICAgIHZhciBpbmRleGpzID0gYDxzY3JpcHQgc3JjPVwiLy9wbGF5ZXJzLmJyaWdodGNvdmUubmV0LzM5MDY5NDI4NjEwMDEvJHtkYXRhLnBsYXllcn1fZGVmYXVsdC9pbmRleC5taW4uanNcIj48L3NjcmlwdD5gO1xyXG4gICAgJCgnYm9keScpLmFwcGVuZChpbmRleGpzKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9icmlnaHRDb3ZlUmVhZHkoKSB7XHJcbiAgICB2YXIgcGxheWVyO1xyXG4gICAgdmlkZW9JRHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgdmlkZW9qcygnIycgKyBlbCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIGFzc2lnbiB0aGlzIHBsYXllciB0byBhIHZhcmlhYmxlXHJcbiAgICAgICAgcGxheWVyID0gdGhpcztcclxuICAgICAgICAvLyBhc3NpZ24gYW4gZXZlbnQgbGlzdGVuZXIgZm9yIHBsYXkgZXZlbnRcclxuICAgICAgICBwbGF5ZXIub24oJ3BsYXknLCBfb25QbGF5KTtcclxuICAgICAgICAvLyBhc3NpZ24gYW4gZXZlbnQgbGlzdGVuZXIgZm9yIGVuZGVkIGV2ZW50XHJcbiAgICAgICAgcGxheWVyLm9uKCdlbmRlZCcsIF9vbkNvbXBsZXRlKTtcclxuICAgICAgICAvLyBwdXNoIHRoZSBwbGF5ZXIgdG8gdGhlIHBsYXllcnMgYXJyYXlcclxuICAgICAgICBwbGF5ZXJzLnB1c2gocGxheWVyKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9vblBsYXkoZSkge1xyXG4gICAgLy8gZGV0ZXJtaW5lIHdoaWNoIHBsYXllciB0aGUgZXZlbnQgaXMgY29taW5nIGZyb21cclxuICAgIHZhciBpZCA9IGUudGFyZ2V0LmlkO1xyXG4gICAgLy8gZ28gdGhyb3VnaCBwbGF5ZXJzXHJcbiAgICBwbGF5ZXJzLmZvckVhY2goZnVuY3Rpb24gKHBsYXllcikge1xyXG4gICAgICBpZiAocGxheWVyLmlkKCkgIT09IGlkKSB7XHJcbiAgICAgICAgLy8gcGF1c2UgdGhlIG90aGVyIHBsYXllcihzKVxyXG4gICAgICAgIHZpZGVvanMocGxheWVyLmlkKCkpLnBhdXNlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX29uQ29tcGxldGUoZSkge1xyXG4gICAgJCgnLicgKyBlLnRhcmdldC5pZCkuYWRkQ2xhc3MoJ2NvbXBsZXRlJyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfdmlld1N0YXR1cygpIHtcclxuICAgICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24gKCkge1xyXG4gICAgICBwbGF5ZXJzLmZvckVhY2goZnVuY3Rpb24gKHBsYXllcikge1xyXG4gICAgICAgIGlmICghJCgnIycgKyBwbGF5ZXIuaWQoKSkudmlzaWJsZSgpKSB7XHJcbiAgICAgICAgICB2aWRlb2pzKHBsYXllci5pZCgpKS5wYXVzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0LFxyXG4gIH07XHJcbn0pKCk7IiwiaW1wb3J0ICogYXMgaWcgZnJvbSAnLi9nbG9iYWwuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKCgpID0+IHtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIF9zZWFyY2hMZWdhY3lDb2RlKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfc2VhcmNoTGVnYWN5Q29kZSgpIHtcclxuXHJcbi8vIEdMT0JBTFNcclxuICAgIHZhciBtb2RlbFVybCA9ICdodHRwczovL3NlYXJjaC5pbnZlc3RvcnNncm91cC5jb20vYXBpL2N3cHNlYXJjaD8nO1xyXG4gICAgdmFyICRmaWVsZCA9ICQoJyNGaW5kQW5PZmZpY2UnKTtcclxuICAgIHZhciBsYW5nID0gJ2VuJztcclxuICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCcvZnIvJykgPiAtMSkge1xyXG4gICAgICBsYW5nID0gJ2ZyJztcclxuICAgIH1cclxuXHJcbi8vIFByb2Nlc3MgdGhlIGxvY2FsIHByZWZldGNoZWQgZGF0YVxyXG4gICAgdmFyIHN1Z2dlc3Rpb25zID0ge307XHJcbiAgICB2YXIgY2l0aWVzID0gW1xyXG4gICAgICBcImF0aGFiYXNjYVwiLFxyXG4gICAgICBcImJsdWZmdG9uXCIsXHJcbiAgICAgIFwiYm9ubnl2aWxsZVwiLFxyXG4gICAgICBcImJyb29rc1wiLFxyXG4gICAgICBcImNhbGdhcnlcIixcclxuICAgICAgXCJjYW1yb3NlXCIsXHJcbiAgICAgIFwiY2FubW9yZVwiLFxyXG4gICAgICBcImRyYXl0b24gdmFsbGV5XCIsXHJcbiAgICAgIFwiZWRtb250b25cIixcclxuICAgICAgXCJmb3J0IG1jbXVycmF5XCIsXHJcbiAgICAgIFwiZm9ydCBzYXNrYXRjaGV3YW5cIixcclxuICAgICAgXCJncmFuZGUgcHJhaXJpZVwiLFxyXG4gICAgICBcImhhbGtpcmtcIixcclxuICAgICAgXCJoaWxsY3Jlc3QgbWluZXNcIixcclxuICAgICAgXCJoaW50b25cIixcclxuICAgICAgXCJsZWR1Y1wiLFxyXG4gICAgICBcImxldGhicmlkZ2VcIixcclxuICAgICAgXCJsbG95ZG1pbnN0ZXJcIixcclxuICAgICAgXCJtZWRpY2luZSBoYXRcIixcclxuICAgICAgXCJtb3JpbnZpbGxlXCIsXHJcbiAgICAgIFwicGVhY2Ugcml2ZXJcIixcclxuICAgICAgXCJwaW5jaGVyIGNyZWVrXCIsXHJcbiAgICAgIFwicHJvdm9zdFwiLFxyXG4gICAgICBcInJlZCBkZWVyXCIsXHJcbiAgICAgIFwic2hlcndvb2QgcGFya1wiLFxyXG4gICAgICBcInNwcnVjZSBncm92ZVwiLFxyXG4gICAgICBcInN0LiBhbGJlcnRcIixcclxuICAgICAgXCJzdGV0dGxlclwiLFxyXG4gICAgICBcInN0dXJnZW9uIGNvdW50eVwiLFxyXG4gICAgICBcInRvZmllbGRcIixcclxuICAgICAgXCJ2ZXJtaWxpb25cIixcclxuICAgICAgXCJ3YWlud3JpZ2h0XCIsXHJcbiAgICAgIFwid2VzdGxvY2tcIixcclxuICAgICAgXCJ3aGl0ZWxhd1wiLFxyXG4gICAgICBcImFiYm90c2ZvcmRcIixcclxuICAgICAgXCJicmFja2VuZGFsZVwiLFxyXG4gICAgICBcImJ1cm5hYnlcIixcclxuICAgICAgXCJidXJucyBsYWtlXCIsXHJcbiAgICAgIFwiY2FtcGJlbGwgcml2ZXJcIixcclxuICAgICAgXCJjaGFzZVwiLFxyXG4gICAgICBcImNoaWxsaXdhY2tcIixcclxuICAgICAgXCJjb21veFwiLFxyXG4gICAgICBcImNvcXVpdGxhbVwiLFxyXG4gICAgICBcImNvdXJ0ZW5heVwiLFxyXG4gICAgICBcImNyYW5icm9va1wiLFxyXG4gICAgICBcImRhd3NvbiBjcmVla1wiLFxyXG4gICAgICBcImR1bmNhblwiLFxyXG4gICAgICBcImZvcnQgbmVsc29uXCIsXHJcbiAgICAgIFwiZm9ydCBzdC4gam9oblwiLFxyXG4gICAgICBcImludmVybWVyZVwiLFxyXG4gICAgICBcImthbWxvb3BzXCIsXHJcbiAgICAgIFwia2Vsb3duYVwiLFxyXG4gICAgICBcImxhbmdsZXlcIixcclxuICAgICAgXCJtZXJyaXR0XCIsXHJcbiAgICAgIFwibmFuYWltb1wiLFxyXG4gICAgICBcIm5lbHNvblwiLFxyXG4gICAgICBcIm5vcnRoIHZhbmNvdXZlclwiLFxyXG4gICAgICBcIm9saXZlclwiLFxyXG4gICAgICBcInBlbnRpY3RvblwiLFxyXG4gICAgICBcInBvcnQgYWxiZXJuaVwiLFxyXG4gICAgICBcInBvd2VsbCByaXZlclwiLFxyXG4gICAgICBcInByaW5jZSBnZW9yZ2VcIixcclxuICAgICAgXCJxdWFsaWN1bSBiZWFjaFwiLFxyXG4gICAgICBcInF1ZXNuZWxcIixcclxuICAgICAgXCJyZXZlbHN0b2tlXCIsXHJcbiAgICAgIFwicmljaG1vbmRcIixcclxuICAgICAgXCJzYWFuaWNodG9uXCIsXHJcbiAgICAgIFwic2FsbW9uIGFybVwiLFxyXG4gICAgICBcInNhbHQgc3ByaW5nIGlzbGFuZFwiLFxyXG4gICAgICBcInNlY2hlbHRcIixcclxuICAgICAgXCJzaWRuZXlcIixcclxuICAgICAgXCJzbWl0aGVyc1wiLFxyXG4gICAgICBcInN1cnJleVwiLFxyXG4gICAgICBcInRlcnJhY2VcIixcclxuICAgICAgXCJ0cmFpbFwiLFxyXG4gICAgICBcInZhbmNvdXZlclwiLFxyXG4gICAgICBcInZlcm5vblwiLFxyXG4gICAgICBcInZpY3RvcmlhXCIsXHJcbiAgICAgIFwid2VzdGJhbmtcIixcclxuICAgICAgXCJ3aWxsaWFtcyBsYWtlXCIsXHJcbiAgICAgIFwiYnJhbmRvblwiLFxyXG4gICAgICBcImRhdXBoaW5cIixcclxuICAgICAgXCJmbGluIGZsb25cIixcclxuICAgICAgXCJnaWxsYW1cIixcclxuICAgICAgXCJraWxsYXJuZXlcIixcclxuICAgICAgXCJtYW5pdG91XCIsXHJcbiAgICAgIFwibWlhbWlcIixcclxuICAgICAgXCJtb3JkZW5cIixcclxuICAgICAgXCJuYXJvbFwiLFxyXG4gICAgICBcInBvcnRhZ2UgbGEgcHJhaXJpZVwiLFxyXG4gICAgICBcInNlbGtpcmtcIixcclxuICAgICAgXCJzd2FuIHJpdmVyXCIsXHJcbiAgICAgIFwidGhlIHBhc1wiLFxyXG4gICAgICBcInZpcmRlblwiLFxyXG4gICAgICBcIndhcnJlblwiLFxyXG4gICAgICBcIndpbm5pcGVnXCIsXHJcbiAgICAgIFwiYmF0aHVyc3RcIixcclxuICAgICAgXCJiZWRlbGxcIixcclxuICAgICAgXCJlZG11bmRzdG9uXCIsXHJcbiAgICAgIFwiZnJlZGVyaWN0b25cIixcclxuICAgICAgXCJsYW5zZG93bmVcIixcclxuICAgICAgXCJtaXJhbWljaGlcIixcclxuICAgICAgXCJtb25jdG9uXCIsXHJcbiAgICAgIFwicXVpc3BhbXNpc1wiLFxyXG4gICAgICBcInJleHRvblwiLFxyXG4gICAgICBcInJvdGhlc2F5XCIsXHJcbiAgICAgIFwic2FpbnQgam9oblwiLFxyXG4gICAgICBcInNhaW50IHBhdWxcIixcclxuICAgICAgXCJzdXNzZXhcIixcclxuICAgICAgXCJibGFrZXRvd25cIixcclxuICAgICAgXCJjbGFyZW52aWxsZVwiLFxyXG4gICAgICBcImNvcm5lciBicm9va1wiLFxyXG4gICAgICBcImdhbmRlclwiLFxyXG4gICAgICBcImdyYW5kIGZhbGxzIC0gd2luZHNvclwiLFxyXG4gICAgICBcIm1hcnlzdG93blwiLFxyXG4gICAgICBcInJvYWNoZXMgbGluZVwiLFxyXG4gICAgICBcInN0LiBqb2huJ3NcIixcclxuICAgICAgXCJ0cmluaXR5XCIsXHJcbiAgICAgIFwiYW1oZXJzdFwiLFxyXG4gICAgICBcImFudGlnb25pc2hcIixcclxuICAgICAgXCJiYXJyaW5ndG9uIHBhc3NhZ2VcIixcclxuICAgICAgXCJiZWxsaXZlYXUgY292ZVwiLFxyXG4gICAgICBcImJyaWRnZXRvd25cIixcclxuICAgICAgXCJicmlkZ2V3YXRlclwiLFxyXG4gICAgICBcImRhcnRtb3V0aFwiLFxyXG4gICAgICBcImRheXRvblwiLFxyXG4gICAgICBcImhhbGlmYXhcIixcclxuICAgICAgXCJtaWRkbGV0b25cIixcclxuICAgICAgXCJuZXcgZ2xhc2dvd1wiLFxyXG4gICAgICBcIm5ldyBtaW5hc1wiLFxyXG4gICAgICBcIm5vcnRoIHN5ZG5leVwiLFxyXG4gICAgICBcInBpY3RvdVwiLFxyXG4gICAgICBcInBvcnQgaGF3a2VzYnVyeVwiLFxyXG4gICAgICBcInN5ZG5leVwiLFxyXG4gICAgICBcInRydXJvXCIsXHJcbiAgICAgIFwieWVsbG93a25pZmVcIixcclxuICAgICAgXCJhamF4XCIsXHJcbiAgICAgIFwiYWxnb25xdWluIGhpZ2hsYW5kc1wiLFxyXG4gICAgICBcImFuY2FzdGVyXCIsXHJcbiAgICAgIFwiYXRpa29rYW5cIixcclxuICAgICAgXCJiYXJyaWVcIixcclxuICAgICAgXCJiZWxsZXZpbGxlXCIsXHJcbiAgICAgIFwiYm93bWFudmlsbGVcIixcclxuICAgICAgXCJicmFjZWJyaWRnZVwiLFxyXG4gICAgICBcImJyYW1wdG9uXCIsXHJcbiAgICAgIFwiYnJhbnRmb3JkXCIsXHJcbiAgICAgIFwiYnJvY2t2aWxsZVwiLFxyXG4gICAgICBcImJyb29rbGluXCIsXHJcbiAgICAgIFwiYnVybGluZ3RvblwiLFxyXG4gICAgICBcImNhbWJyaWRnZVwiLFxyXG4gICAgICBcImNhcmxldG9uIHBsYWNlXCIsXHJcbiAgICAgIFwiY2hhdGhhbVwiLFxyXG4gICAgICBcImNsYXl0b25cIixcclxuICAgICAgXCJjbGludG9uXCIsXHJcbiAgICAgIFwiY29ib3VyZ1wiLFxyXG4gICAgICBcImNvbGxpbmd3b29kXCIsXHJcbiAgICAgIFwiY29uY29yZFwiLFxyXG4gICAgICBcImNvcm53YWxsXCIsXHJcbiAgICAgIFwiZHJ5ZGVuXCIsXHJcbiAgICAgIFwiZHVuZGFzXCIsXHJcbiAgICAgIFwiZHVuc2ZvcmRcIixcclxuICAgICAgXCJkdXR0b25cIixcclxuICAgICAgXCJlbGxpb3QgbGFrZVwiLFxyXG4gICAgICBcImV0b2JpY29rZVwiLFxyXG4gICAgICBcImZvcnQgZnJhbmNlc1wiLFxyXG4gICAgICBcImdhbmFub3F1ZVwiLFxyXG4gICAgICBcImdhcnNvblwiLFxyXG4gICAgICBcImdyZWVseVwiLFxyXG4gICAgICBcImdyaW1zYnlcIixcclxuICAgICAgXCJndWVscGhcIixcclxuICAgICAgXCJoYWlsZXlidXJ5XCIsXHJcbiAgICAgIFwiaGFtaWx0b25cIixcclxuICAgICAgXCJoYW5vdmVyXCIsXHJcbiAgICAgIFwiaGVhcnN0XCIsXHJcbiAgICAgIFwiaHVudHN2aWxsZVwiLFxyXG4gICAgICBcImplcnNleXZpbGxlXCIsXHJcbiAgICAgIFwia2FuYXRhXCIsXHJcbiAgICAgIFwia2FwdXNrYXNpbmdcIixcclxuICAgICAgXCJrZW5vcmFcIixcclxuICAgICAgXCJraW5nc3RvblwiLFxyXG4gICAgICBcImtpcmtsYW5kIGxha2VcIixcclxuICAgICAgXCJraXRjaGVuZXJcIixcclxuICAgICAgXCJsYW5ndG9uXCIsXHJcbiAgICAgIFwibGluZHNheVwiLFxyXG4gICAgICBcImxvbmRvblwiLFxyXG4gICAgICBcIm1hcGxlXCIsXHJcbiAgICAgIFwibWFyYXRob25cIixcclxuICAgICAgXCJtYXJraGFtXCIsXHJcbiAgICAgIFwibWVycmlja3ZpbGxlXCIsXHJcbiAgICAgIFwibWlsdG9uXCIsXHJcbiAgICAgIFwibWluZGVuXCIsXHJcbiAgICAgIFwibWlzc2lzc2F1Z2FcIixcclxuICAgICAgXCJtb3VudCBmb3Jlc3RcIixcclxuICAgICAgXCJtb3VudCBob3BlXCIsXHJcbiAgICAgIFwibmVwZWFuXCIsXHJcbiAgICAgIFwibmV3IGxpc2tlYXJkXCIsXHJcbiAgICAgIFwibmV3bWFya2V0XCIsXHJcbiAgICAgIFwibmlhZ2FyYSBmYWxsc1wiLFxyXG4gICAgICBcIm5vcnRoIGJheVwiLFxyXG4gICAgICBcIm5vcnRoIHlvcmtcIixcclxuICAgICAgXCJvYWsgcmlkZ2VzXCIsXHJcbiAgICAgIFwib2FrdmlsbGVcIixcclxuICAgICAgXCJvcmFuZ2V2aWxsZVwiLFxyXG4gICAgICBcIm9yaWxsaWFcIixcclxuICAgICAgXCJvcnRvblwiLFxyXG4gICAgICBcIm9zaGF3YVwiLFxyXG4gICAgICBcIm90dGF3YVwiLFxyXG4gICAgICBcIm93ZW4gc291bmRcIixcclxuICAgICAgXCJwYXJyeSBzb3VuZFwiLFxyXG4gICAgICBcInBlbWJyb2tlXCIsXHJcbiAgICAgIFwicGVuZXRhbmd1aXNoZW5lXCIsXHJcbiAgICAgIFwicGVydGhcIixcclxuICAgICAgXCJwZXRlcmJvcm91Z2hcIixcclxuICAgICAgXCJwZXRyb2xpYVwiLFxyXG4gICAgICBcInBpY2tlcmluZ1wiLFxyXG4gICAgICBcInJlZCBsYWtlXCIsXHJcbiAgICAgIFwicmlkZ2V0b3duXCIsXHJcbiAgICAgIFwic2FybmlhXCIsXHJcbiAgICAgIFwic2F1bHQgc3RlLiBtYXJpZVwiLFxyXG4gICAgICBcInNjYXJib3JvdWdoXCIsXHJcbiAgICAgIFwic2NocmVpYmVyXCIsXHJcbiAgICAgIFwic2ltY29lXCIsXHJcbiAgICAgIFwic2lvdXggbG9va291dFwiLFxyXG4gICAgICBcInN0LiBjYXRoYXJpbmVzXCIsXHJcbiAgICAgIFwic3QuIG1hcnlzXCIsXHJcbiAgICAgIFwic3RvdWZmdmlsbGVcIixcclxuICAgICAgXCJzdHJhdGZvcmRcIixcclxuICAgICAgXCJzdHVyZ2VvbiBmYWxsc1wiLFxyXG4gICAgICBcInN1ZGJ1cnlcIixcclxuICAgICAgXCJzdW5kcmlkZ2VcIixcclxuICAgICAgXCJ0aHVuZGVyIGJheVwiLFxyXG4gICAgICBcInRpbGxzb25idXJnXCIsXHJcbiAgICAgIFwidGltbWluc1wiLFxyXG4gICAgICBcInRvcm9udG9cIixcclxuICAgICAgXCJ0cmVudG9uXCIsXHJcbiAgICAgIFwiVXhicmlkZ2VcIixcclxuICAgICAgXCJ2YWwgY2Fyb25cIixcclxuICAgICAgXCJ3YWxrZXJ0b25cIixcclxuICAgICAgXCJ3YXRlcmxvb1wiLFxyXG4gICAgICBcIndlbGxhbmRcIixcclxuICAgICAgXCJ3aGl0YnlcIixcclxuICAgICAgXCJ3aWxsb3dkYWxlXCIsXHJcbiAgICAgIFwid2luZHNvclwiLFxyXG4gICAgICBcIndpbmdoYW1cIixcclxuICAgICAgXCJ3b29kYnJpZGdlXCIsXHJcbiAgICAgIFwiY2hhcmxvdHRldG93biwgcGVcIixcclxuICAgICAgXCJzb3VyaXMsIHBlXCIsXHJcbiAgICAgIFwic3VtbWVyc2lkZSwgcGVcIixcclxuICAgICAgXCJ3ZWxsaW5ndG9uXCIsXHJcbiAgICAgIFwiYW5qb3VcIixcclxuICAgICAgXCJib2lzYnJpYW5kXCIsXHJcbiAgICAgIFwiYm91Y2hlcnZpbGxlXCIsXHJcbiAgICAgIFwiYnJvc3NhcmRcIixcclxuICAgICAgXCJjaMOidGVhdWd1YXlcIixcclxuICAgICAgXCJjaGljb3V0aW1pXCIsXHJcbiAgICAgIFwiY8O0dGUgc2FpbnQtbHVjXCIsXHJcbiAgICAgIFwiZG9sbGFyZC1kZXMtb3JtZWF1eFwiLFxyXG4gICAgICBcImdhdGluZWF1XCIsXHJcbiAgICAgIFwiZ3JhbmJ5XCIsXHJcbiAgICAgIFwibGF2YWxcIixcclxuICAgICAgXCJsw6l2aXNcIixcclxuICAgICAgXCJtaXJhYmVsXCIsXHJcbiAgICAgIFwibW9udHJlYWxcIixcclxuICAgICAgXCJuZXcgcmljaG1vbmRcIixcclxuICAgICAgXCJwb2ludGUtY2xhaXJlXCIsXHJcbiAgICAgIFwicXXDqWJlY1wiLFxyXG4gICAgICBcInNlcHQtaWxlc1wiLFxyXG4gICAgICBcInNoZXJicm9va2VcIixcclxuICAgICAgXCJ2aWxsZSBzdC1sYXVyZW50XCIsXHJcbiAgICAgIFwid2VzdG1vdW50XCIsXHJcbiAgICAgIFwiZWFzdGVuZFwiLFxyXG4gICAgICBcImVzdGV2YW5cIixcclxuICAgICAgXCJlc3RlcmhhenlcIixcclxuICAgICAgXCJmb2FtIGxha2VcIixcclxuICAgICAgXCJodW1ib2xkdFwiLFxyXG4gICAgICBcImtpbmRlcnNsZXlcIixcclxuICAgICAgXCJsZWFkZXJcIixcclxuICAgICAgXCJtYXBsZSBjcmVla1wiLFxyXG4gICAgICBcIm1lYWRvdyBsYWtlXCIsXHJcbiAgICAgIFwibWVsZm9ydFwiLFxyXG4gICAgICBcIm1lbHZpbGxlXCIsXHJcbiAgICAgIFwibW9vc2UgamF3XCIsXHJcbiAgICAgIFwibm9ydGggYmF0dGxlZm9yZFwiLFxyXG4gICAgICBcIm91dGxvb2tcIixcclxuICAgICAgXCJveGJvd1wiLFxyXG4gICAgICBcInByaW5jZSBhbGJlcnRcIixcclxuICAgICAgXCJyZWdpbmFcIixcclxuICAgICAgXCJyZWdpbmEgYmVhY2hcIixcclxuICAgICAgXCJyb3NldG93blwiLFxyXG4gICAgICBcInNhc2thdG9vblwiLFxyXG4gICAgICBcInNoZWxsYnJvb2tcIixcclxuICAgICAgXCJzd2lmdCBjdXJyZW50XCIsXHJcbiAgICAgIFwid2F0cm91c1wiLFxyXG4gICAgICBcIndhdHNvblwiLFxyXG4gICAgICBcInlvcmt0b25cIixcclxuICAgICAgXCJ3aGl0ZWhvcnNlXCJcclxuICAgIF07XHJcbiAgICBzdWdnZXN0aW9ucy5sb2NhdGlvbnMgPSBuZXcgQmxvb2Rob3VuZCh7XHJcbiAgICAgIGRhdHVtVG9rZW5pemVyOiBCbG9vZGhvdW5kLnRva2VuaXplcnMud2hpdGVzcGFjZSxcclxuICAgICAgcXVlcnlUb2tlbml6ZXI6IEJsb29kaG91bmQudG9rZW5pemVycy53aGl0ZXNwYWNlLFxyXG4gICAgICBsb2NhbDogY2l0aWVzXHJcbiAgICB9KTtcclxuXHJcbi8vIEdldCB0aGUgcmVzdWx0c1xyXG4gICAgZnVuY3Rpb24gZ2V0U2VhcmNoUmVzdWx0cyhwYXJhbXMpIHtcclxuICAgICAgcGFyYW1zLnNlYXJjaHR5cGUgPSAnb2ZmaWNlJztcclxuICAgICAgcGFyYW1zLm5hbWUgPSAnJztcclxuXHJcbiAgICAgIC8vIE1ha2Ugc3VyZSBlcnJvciBtZXNzYWdlIGlzIGhpZGRlbiBlYWNoIHRpbWVcclxuICAgICAgJCgnLnplcm8tcmVzdWx0cycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblxyXG4gICAgICAkLmdldEpTT04obW9kZWxVcmwsIHBhcmFtcylcclxuICAgICAgICAuYWx3YXlzKClcclxuICAgICAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgdmFyIHJlc3VsdCA9IEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2lzLXJldmVhbC1vcGVuJyk7XHJcbiAgICAgICAgICAgICQoJyNzZWFyY2hSZXN1bHRzTW9kYWwnKS5yZW1vdmVDbGFzcygnY2xvc2VkJykuaHRtbCgnJyk7XHJcbiAgICAgICAgICAgIGRpc3BsYXlTZWFyY2hSZXN1bHRzKCdvZmZpY2UtdGVtcGxhdGUnLCByZXN1bHQpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJCgnLnplcm8tcmVzdWx0cycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZmFpbChmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnRGF0YSBjb3VsZCBub3QgYmUgcmV0cmlldmVkLCBwbGVhc2UgdHJ5IGFnYWluJywgcmVzdWx0LnN0YXR1cyArICcgJyArIHJlc3VsdC5zdGF0dXNUZXh0KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4vLyBCZWNhdXNlIHdlIGFyZSBvbmx5IHNlYXJjaGluZyBmb3IgY2l0aWVzLCB0aGlzIGZ1bmN0aW9uIGlzIHNsaWdodGx5IHJlZHVuZGFudCAtIGxlYXZpbmcgaXQgaW4gcGxhY2UgZm9yIG5vd1xyXG4gICAgZnVuY3Rpb24gcGFyc2VTZWFyY2hTdHJpbmcoKSB7XHJcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgdmFyIHNlYXJjaCA9ICRmaWVsZC52YWwoKTtcclxuXHJcbiAgICAgIHJlc3VsdC5jaXR5ID0gJyc7XHJcblxyXG4gICAgICAvLyBTZWFyY2ggaW4gdGhlIGxhbmd1YWdlIG9mIHRoZSBwYWdlXHJcbiAgICAgIHJlc3VsdC5sYW5nID0gbGFuZztcclxuICAgICAgLy8gV2Ugb25seSBzZWFyY2ggY29uc3VsdGFudHMgZnJvbSB0aGlzIG1ldGhvZFxyXG4gICAgICByZXN1bHQuc2VhcmNodHlwZSA9ICdjb24nO1xyXG5cclxuICAgICAgLy8gQ2hlY2sgdGhlIHNlYXJjaCBzdHJpbmcgZm9yIGEgcHJldmlvdXNseSBkZWZpbmVkIGxvY2F0aW9uXHJcbiAgICAgIHZhciB3b3JkcyA9IHNlYXJjaC5zcGxpdCgnICcpO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgLy8gQ2hlY2sgZWFjaCB3b3JkIGZvciBhIGNpdHkgZnJvbSB0aGUgcHJlZGVmaW5lZCBsaXN0XHJcbiAgICAgICAgdmFyIGNpdHkgPSBzdWdnZXN0aW9ucy5sb2NhdGlvbnMuZ2V0KHdvcmRzW2ldKTtcclxuICAgICAgICBpZiAoY2l0eS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXN1bHQuY2l0eSA9IGNpdHlbMF07XHJcbiAgICAgICAgICB3b3Jkcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXJlc3VsdC5jaXR5KSB7XHJcbiAgICAgICAgcmVzdWx0LmNpdHkgPSB3b3Jkcy5qb2luKCcgJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGlzcGxheVNlYXJjaFJlc3VsdHModGVtcGxhdGVJRCwganNvbikge1xyXG4gICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZUlEKS5pbm5lckhUTUw7XHJcbiAgICAgIE11c3RhY2hlLnBhcnNlKHRlbXBsYXRlKTtcclxuICAgICAgdmFyIHJlbmRlcmVkID0gTXVzdGFjaGUucmVuZGVyKHRlbXBsYXRlLCBqc29uKTtcclxuICAgICAgJCgnI3NlYXJjaFJlc3VsdHNNb2RhbCcpLmFwcGVuZChyZW5kZXJlZCk7XHJcbiAgICAgICQoZG9jdW1lbnQpLmZvdW5kYXRpb24oKTtcclxuICAgIH1cclxuXHJcbi8vSW5pdCBldmVyeXRoaW5nXHJcbiAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gVHJ5IHRvIHByZWRldGVybWluZSB3aGF0IHJlc3VsdHMgc2hvdWxkIHNob3dcclxuICAgICAgLy8gU2V0dXAgdGhlIHR5cGVhaGVhZFxyXG4gICAgICAkKCcudHlwZWFoZWFkJykudHlwZWFoZWFkKHtcclxuICAgICAgICAgIGhpZ2hsaWdodDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge25hbWU6ICdsb2NhdGlvbnMnLCBzb3VyY2U6IHN1Z2dlc3Rpb25zLmxvY2F0aW9ucywgbGltaXQ6IDJ9XHJcbiAgICAgICk7XHJcblxyXG4gICAgICAvLyBTZXR1cCB0aGUgZm9ybSBzdWJtaXNzaW9uXHJcbiAgICAgICQoJy5pZy1zZWFyY2gnKS5zdWJtaXQoZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdmFyIHBhcmFtcyA9IHBhcnNlU2VhcmNoU3RyaW5nKCk7XHJcbiAgICAgICAgZ2V0U2VhcmNoUmVzdWx0cyhwYXJhbXMpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIEZha2UgbW9kYWwgLSBBZGRpbmcgaGFuZGxlciBvbiBkb2N1bWVudCBzbyBpdCBmaXJlcyBkZXNwaXRlIHRoZSBidXR0b24gbm90IGJlaW5nIHJlbmRlcmVkIHlldFxyXG4gICAgICAkKGRvY3VtZW50KS5vbihcImNsaWNrXCIsIFwiI3NlYXJjaFJlc3VsdHNNb2RhbCAuY2xvc2UtYnV0dG9uXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcjc2VhcmNoUmVzdWx0c01vZGFsJykuYWRkQ2xhc3MoJ2Nsb3NlZCcpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdpcy1yZXZlYWwtb3BlbicpO1xyXG4gICAgICAgIH0sIDQwMCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdFxyXG4gIH07XHJcbn0pKCkiLCIvKiBUaGlzIGZpbGUgaXMgdGhlIGVudHJ5IHBvaW50IGZvciByb2xsdXAgKGh0dHA6Ly9yb2xsdXBqcy5vcmcvKSBhbmRcclxuIGVzc2VudGlvbmFsbHkgJ2Jvb3RzdHJhcHMnIG91ciBpZy5jb20gJ2FwcGxpY2F0aW9uJy5cclxuXHJcbiBBbGwgbW9kdWxlcyBzaG91bGQgYmUgaW1wb3J0ZWQgaGVyZSBzbyB0aGF0IHRoZXkgY2FuIGJlIGluaXRpYWxpemVkIG9uXHJcbiBhIGNhc2UtYnktY2FzZSBiYXNpcyAobm90IGFsbCBwYWdlcyByZXF1aXJlIHRoZSBpbml0aWFsaXphdGlvbiBvZiBhIGNhcm91c2VsXHJcbiBmb3IgaW5zdGFuY2UpLlxyXG5cclxuIEFueSB0YXNrcyBvciBwcm9jZXNzZXMgdGhhdCBuZWVkIHRvIGJlIGluaXRpYXRlZCBvbiBwYWdlIGxvYWQgc2hvdWxkIGxpdmUgaW4gdGhpc1xyXG4gZmlsZSBhcyB3ZWxsLiBBbiBpbmNsdWRlZCBleGFtcGxlIGlzIGEgbWV0aG9kIHRoYXQgYWRkcyBhbiAnZW4nIG9yICdmcicgY2xhc3MgdG9cclxuIHRoZSBib2R5IGJhc2VkIG9uIHRoZSBnbG9iYWwgbGFuZ3VhZ2UgdmFyaWFibGUgdGhhdCB3ZSBjYW4gdGhlbiB1c2UgdG8gd3JpdGUgY3VzdG9tXHJcbiBzdHlsZXMgZm9yIGVhY2ggbGFuZ3VhZ2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGZvcm1zIGZyb20gJy4vZm9ybXMuanMnO1xyXG5pbXBvcnQgY2Fyb3VzZWwgZnJvbSAnLi9jYXJvdXNlbC5qcyc7XHJcbmltcG9ydCBjYXJlZXJzIGZyb20gJy4vY2FyZWVycy5qcyc7XHJcbmltcG9ydCB2aWRlbyBmcm9tICcuL3ZpZGVvLmpzJztcclxuaW1wb3J0IHNlYXJjaCBmcm9tICcuL3NlYXJjaC5qcyc7XHJcbmltcG9ydCAqIGFzIGlnIGZyb20gJy4vZ2xvYmFsLmpzJztcclxuXHJcbmNvbnN0IGFwcCA9ICgoKSA9PiB7XHJcbiAgICBmdW5jdGlvbiBpbml0KCkge1xyXG5cclxuICAgICAgICAvLyBJbml0aWFsaXplIEZvdW5kYXRpb25cclxuICAgICAgICAkKGRvY3VtZW50KS5mb3VuZGF0aW9uKCk7XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGZvciBjb21wb25lbnRzXHJcbiAgICAgICAgaWYgKCQoJy5pZy1mb3JtJykubGVuZ3RoKSBmb3Jtcy5pbml0KCk7XHJcbiAgICAgICAgaWYgKCQoJy5pZy1jYXJvdXNlbCcpLmxlbmd0aCkgY2Fyb3VzZWwuaW5pdCgpO1xyXG4gICAgICAgIGlmICgkKCcuaWctc2VhcmNoJykubGVuZ3RoKSBzZWFyY2guaW5pdCgpO1xyXG4gICAgICAgIGlmICgkKCcuaWctY2FyZWVycycpLmxlbmd0aCkgY2FyZWVycy5pbml0KCk7XHJcbiAgICAgICAgaWYgKCQoJy5pZy12aWRlby1ncm91cCcpLmxlbmd0aCkgdmlkZW8uaW5pdCgpO1xyXG5cclxuICAgICAgICAvLyBBZGQgbGFuZ3VhZ2UgY2xhc3MgdG8gYm9keVxyXG4gICAgICAgIC8vX2xhbmd1YWdlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0XHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG4vLyBCb290c3RyYXAgYXBwXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgIGFwcC5pbml0KCk7XHJcbn0pO1xyXG4iXSwibmFtZXMiOlsibGFuZyIsIndpbmRvdyIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJpbmRleE9mIiwib2xkSUUiLCJlbmRwb2ludFVSTCIsInN1Y2Nlc3NVUkwiLCJjYW5jZWxVUkwiLCIkZm9ybSIsIiRmb3JtV3JhcHBlciIsImluaXQiLCIkIiwiZmluZCIsImRhdGEiLCJfdmFsaWRhdGlvbiIsImpJbnB1dCIsImNoYW5nZSIsIm9iakV2ZW50IiwiYWRkQ2xhc3MiLCJ2YWxpZGF0b3IiLCJzZXREZWZhdWx0cyIsImFkZE1ldGhvZCIsInBvc3RhbCIsImVsZW1lbnQiLCJvcHRpb25hbCIsIm1hdGNoIiwidmFsaWRhdGUiLCJsYWJlbCIsImNsb3Nlc3QiLCJsZW5ndGgiLCJwYXJlbnQiLCJhcHBlbmQiLCJvbiIsInJlcGxhY2UiLCJfcHJvY2VzcyIsImZvcm0iLCJmb3JtRGF0YVJhdyIsImZvcm1EYXRhUGFyc2VkIiwidmFsaWQiLCJyZW1vdmVDbGFzcyIsInNlcmlhbGl6ZUFycmF5IiwiX3BhcnNlIiwiX3N1Ym1pdCIsImFqYXgiLCJzdWNjZXNzIiwibXNnIiwiZXJyb3IiLCJ0byIsIl90b2dnbGVyIiwiaGlkZSIsInNob3ciLCJsb2ciLCJ0b2dnbGVDbGFzcyIsIl9idWlsZENhcm91c2VsIiwicHJldkFycm93IiwibmV4dEFycm93IiwiJGNhcm91c2VsIiwiZWFjaCIsImluZGV4Iiwic2xpY2siLCJfY2FyZWVyc0xlZ2FjeUNvZGUiLCJmbiIsImluZm9Ub2dnbGUiLCIkcmV2ZWFsIiwiJHJldmVhbENvbnRlbnQiLCIkcmV2ZWFsVHJpZ2dlciIsImZpeGVkSGVpZ2h0Iiwic2V0QXJpYSIsImF0dHIiLCJpbml0VG9nZ2xlIiwiaGFuZGxlUmV2ZWFsVG9nZ2xlIiwicmVzaXplSGFuZGxlciIsInNldFRpbWVvdXQiLCJzZXRSZXZlYWxDb250ZW50SGVpZ2h0IiwiY3NzIiwiaGVpZ2h0IiwiZmluYWxIZWlnaHQiLCJoYXNDbGFzcyIsInNjcm9sbEhlaWdodCIsImpRdWVyeSIsImNpcmNsZUFuaW1hdGlvbiIsIm1heFZhbHVlIiwiY2FudmFzIiwiJGNhbnZhcyIsImNvbnRleHQiLCJkIiwid2lkdGgiLCJwZXJjZW50U3Ryb2tlIiwicmVtYWluaW5nU3Ryb2tlIiwicmFkaXVzIiwiY3VyUGVyYyIsImNpcmMiLCJNYXRoIiwiUEkiLCJxdWFydCIsImRlbGVnYXRlSUQiLCJEYXRlIiwiZ2V0VGltZSIsImlzIiwiZ2V0Q29udGV4dCIsInN0cm9rZVN0eWxlIiwiZmlsbFN0eWxlIiwiZGVsZWdhdGUiLCJjbGVhciIsImFuaW1hdGUiLCJjdXJyZW50IiwibGluZVdpZHRoIiwiYmVnaW5QYXRoIiwiYXJjIiwibWluIiwic3Ryb2tlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiZmlsbFJlY3QiLCJibG9ja0xpbmsiLCIkYmxvY2tMaW5rIiwiZGVzdGluYXRpb24iLCJpbml0QmxvY2siLCJoYW5kbGVDbGljayIsImd1aSIsInZpZGVvIiwib3ZlcmxheSIsImluaXRMZWdhY3kiLCJPdmVybGF5TW9kdWxlIiwiR3VpTW9kdWxlIiwiZSIsInRhcmdldCIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcCIsIm9mZnNldCIsInRvcCIsInNlbGVjdG9yIiwicmVzaXplIiwib3ZlcmxheVJlZmVyZW5jZSIsIm11bHRpVGFiVG9nZ2xlU2VsZWN0b3IiLCJtdWx0aVRhYkNvbnRlbnRTZWxlY3RvciIsIm11bHRpVGFiU2VsZWN0b3IiLCIkZWRnZU92ZXJsYXlMb2NhdGlvbiIsIiRvdmVybGF5U2xpZGVyIiwiJHByb2ZpbGVTbGlkZXIiLCIkcHJvZmlsZVNsaWRlclZpZGVvU2VjdGlvbkhvbGRlciIsIndpbmRvd1NpemluZ0RlbGF5Iiwid2luZG93U2Nyb2xsaW5nRGVsYXkiLCJvdmVybGF5T3BlbiIsImlzUmVzcG9uc2l2ZVN0YXRlIiwic2Nyb2xsZWRUb1ZpZXciLCJpbml0R3VpIiwiZXZlbnQiLCJiYWNrZ3JvdW5kQ29sb3IiLCIkdGhpcyIsInBhcnNlSW50IiwiaHRtbCIsImhhbmRsZU92ZXJsYXlGcm9tSGFzaCIsImRlbGF5ZWRIYW5kbGVXaW5kb3dTaXppbmciLCJkZWxheWVkSGFuZGxlV2luZG93U2Nyb2xsIiwidHJpZ2dlciIsInN0b3BQcm9wYWdhdGlvbiIsImFkZE11bHRpVGFiVG9nZ2xlSGFuZGxlcnMiLCJ0b2dnbGVCYXNlIiwiJGNvbnRhaW5lciIsInBhcmVudHMiLCJhbmltYXRlUHJvZmlsZVNsaWRlciIsIiRwcm9maWxlUGFuZWxzIiwicHJvZmlsZVBhbmVsSGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJjaGFuZ2VTbGlkZXJTdGF0ZSIsInNsaWRlciIsInN0YXRlIiwiY2xlYXJUaW1lb3V0IiwiaGFuZGxlV2luZG93U2l6aW5nIiwiaGFuZGxlV2luZG93U2Nyb2xsaW5nIiwiZnVsbEhhc2hGcmFnbWVudCIsImhhc2giLCJvcGVuT3ZlcmxheSIsImhhbmRsZU92ZXJsYXlPcGVuIiwiaGFuZGxlT3ZlcmxheUNsb3NlIiwiaW5pdGlhbEluZGV4IiwiaGFuZGxlU2xpZGVDaGFuZ2UiLCJ5UG9zIiwib3ZlcmxheUNvbnRlbnQiLCJvZmYiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiZG9jdW1lbnQiLCJ0aXRsZSIsInNlYXJjaCIsInNjcm9sbFRvcCIsImN1cnJlbnRTbGlkZSIsIm5leHRTbGlkZSIsIm5leHRUaXRsZSIsImdldCIsIm5ld0hhc2giLCJ3aW5kb3dXaWR0aCIsInJlc3BvbnNpdmVMaW1pdCIsIm5ld0lzUmVzcG9uc2l2ZVN0YXRlIiwiaW5pdFByb2ZpbGVTbGlkZXIiLCJpbml0U2xpZGVyIiwib3B0aW9ucyIsImRlZmF1bHRzIiwiZXh0ZW5kIiwiJG92ZXJsYXkiLCIkYm9keSIsIm92ZXJsYXlTaXppbmdEZWxheSIsImN1cnJlbnRJbnN0YW5jZSIsImlzT3BlbkZsYWciLCIkY2xvc2VCdXR0b24iLCJpc09wZW4iLCJpbml0T3ZlcmxheSIsImRlbGF5ZWRIYW5kbGVPdmVybGF5U2l6aW5nIiwiRm91bmRhdGlvbiIsIlJldmVhbCIsIm92ZXJsYXlTaXppbmciLCJjbG9zZSIsImZvdW5kYXRpb24iLCJvcGVuIiwiaW5pdENsb3NlQnV0dG9uIiwiJGlubmVyU3BhbiIsInVybE9yTWFya3VwIiwib3BlbkNhbGxiYWNrIiwiY2xvc2VDYWxsYmFjayIsImZ1bGxTY3JlZW4iLCJmdWxsIiwib3Blbk92ZXJsYXlXaXRoQWpheCIsInVybCIsImRvbmUiLCJvcGVuT3ZlcmxheVdpdGhNYXJrdXAiLCJtYXJrdXAiLCJvdmVybGF5U2l6ZUNsZWFudXAiLCJvdmVybGF5SGVpZ2h0Iiwid2luZG93SGVpZ2h0IiwidmlkZW9JRHMiLCJwbGF5ZXJzIiwiYnJpZ2h0Q292ZSIsIiR2aWRlbyIsImlnIiwic2V0SW50ZXJ2YWwiLCJfcGFyc2VWaWRlb3MiLCIkZ3JvdXAiLCJwcmVsb2FkT3B0aW9ucyIsInBsYXllciIsImlkIiwiZGVzY3JpcHRpb24iLCJhdXRvIiwicHJlbG9hZCIsInRyYW5zY3JpcHQiLCJjdGFUZW1wbGF0ZSIsInB1c2giLCJfaW5qZWN0VGVtcGxhdGUiLCJ0cmFuc2NyaXB0VGV4dCIsInJlcGxhY2VXaXRoIiwic2libGluZ3MiLCJfaW5qZWN0SWZyYW1lIiwiaW5qZWN0QnJpZ2h0Q292ZUpTIiwiaW5kZXhqcyIsIl9icmlnaHRDb3ZlUmVhZHkiLCJmb3JFYWNoIiwiZWwiLCJyZWFkeSIsIl9vblBsYXkiLCJfb25Db21wbGV0ZSIsInBhdXNlIiwiX3NlYXJjaExlZ2FjeUNvZGUiLCJtb2RlbFVybCIsIiRmaWVsZCIsImhyZWYiLCJzdWdnZXN0aW9ucyIsImNpdGllcyIsImxvY2F0aW9ucyIsIkJsb29kaG91bmQiLCJ0b2tlbml6ZXJzIiwid2hpdGVzcGFjZSIsImdldFNlYXJjaFJlc3VsdHMiLCJwYXJhbXMiLCJzZWFyY2h0eXBlIiwibmFtZSIsImdldEpTT04iLCJhbHdheXMiLCJyZXN1bHQiLCJKU09OIiwicGFyc2UiLCJmYWlsIiwic3RhdHVzIiwic3RhdHVzVGV4dCIsInBhcnNlU2VhcmNoU3RyaW5nIiwidmFsIiwiY2l0eSIsIndvcmRzIiwic3BsaXQiLCJpIiwic3BsaWNlIiwiam9pbiIsImRpc3BsYXlTZWFyY2hSZXN1bHRzIiwidGVtcGxhdGVJRCIsImpzb24iLCJ0ZW1wbGF0ZSIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwicmVuZGVyZWQiLCJNdXN0YWNoZSIsInJlbmRlciIsInR5cGVhaGVhZCIsInNvdXJjZSIsImxpbWl0Iiwic3VibWl0IiwiYXBwIiwiZm9ybXMiLCJjYXJvdXNlbCIsImNhcmVlcnMiXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7Ozs7Ozs7QUFTQSxBQUFPOzs7QUFLUCxBQUFPLElBQUlBLE9BQVEsWUFBTTtNQUNuQkMsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBeUJDLE9BQXpCLENBQWlDLE1BQWpDLE1BQTZDLENBQUMsQ0FBOUMsSUFBbURILE9BQU9DLFFBQVAsQ0FBZ0JDLFFBQWhCLENBQXlCQyxPQUF6QixDQUFpQyxNQUFqQyxNQUE2QyxDQUFDLENBQXJHLEVBQXdHO1dBQy9GLElBQVA7R0FERixNQUVPO1dBQ0UsSUFBUDs7Q0FKYyxFQUFYOzs7QUFTUCxBQUFPOzs7QUFLUCxBQUFPLElBQUlDLFFBQVMsWUFBTTtNQUNwQixtQkFBbUJKLE1BQXZCLEVBQStCO1dBQ3RCLElBQVA7R0FERixNQUVPO1dBQ0UsS0FBUDs7Q0FKZSxFQUFaOzs7MkNBV1AsQUFBTzs7QUNyQ1AsWUFBZSxDQUFDLFlBQU07O01BRWhCSyxXQUFKLEVBQ0VDLFVBREYsRUFFRUMsU0FGRixFQUdFQyxLQUhGLEVBSUVDLFlBSkY7O1dBTVNDLElBQVQsR0FBZ0I7O21CQUVDQyxFQUFFLFVBQUYsQ0FBZjtZQUNRRixhQUFhRyxJQUFiLENBQWtCLE1BQWxCLENBQVI7a0JBQ2NILGFBQWFHLElBQWIsQ0FBa0IsTUFBbEIsRUFBMEJDLElBQTFCLENBQStCLFVBQS9CLENBQWQ7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