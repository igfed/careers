import * as ig from './global.js';

export default (() => {

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
            context.arc(d, d, radius, -(quart), ((circ) * -Math.min(current, maxValue / 100)) - quart, true);
            context.stroke();
            context.lineWidth = remainingStroke;
            context.beginPath();
            context.arc(d, d, radius, -(quart), ((circ) * -current) - quart, true);
            context.stroke();
            curPerc++;
            if (curPerc < 110) {
              window.requestAnimationFrame(function () {
                animate(curPerc / 100)
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

      var gui,
        video,
        overlay;

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
          })
        }

        function animateProfileSlider() {
          var $profilePanels,
            profilePanelHeight = 0;

          if (scrolledToView) {
            $profileSlider.find('.slick-slide').removeClass('slick-complete');
            $profileSlider.find('.slick-active').addClass('slick-complete');
            $profileSlider
              .find('.slick-slide:not(.slick-complete)')
              .find('.profile-counter canvas')
              .trigger('clearAnimate');
            $profileSlider
              .find('.slick-complete')
              .find('.profile-counter canvas')
              .trigger('startAnimate');
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
            overlay.openOverlay(
              $edgeOverlayLocation,
              handleOverlayOpen, handleOverlayClose, true);
          }
        }

        function handleOverlayOpen(event) {
          var initialIndex;

          initSlider($overlaySlider, {
            dots: false,
            slidesToShow: 1,
            slidesToScroll: 1
          });

          initialIndex = $overlaySlider
            .find('.' + location.hash.replace('#our-', '') + ':not(.slick-cloned)')
            .attr('data-slick-index');
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
          if ("pushState" in history)
            history.pushState("", document.title, location.pathname + location.search);
          else {
            yPos = $(document).scrollTop();
            location.hash = "";
            $(document).scrollTop(yPos);
          }
          overlayOpen = false;
        }

        function handleSlideChange(event, slick, currentSlide) {
          var nextSlide = (currentSlide + 1) % ($('.slick-slide:not(.slick-cloned)').length - 1),
            nextTitle = $($overlaySlider.find('[data-slick-index=' + nextSlide + '] .columns:first-child p').get(0)).html(),
            newHash = 'our-' + $overlaySlider
                .find('[data-slick-index=' + currentSlide + ']')
                .attr('class')
                .match(/(edge-\S*)/)[1];

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
            responsive: [
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  infinite: true
                }
              }
            ]
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
    init
  };
})()