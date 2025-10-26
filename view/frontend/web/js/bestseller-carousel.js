define([
    'jquery',
    'jquery-ui-modules/widget'
], function ($) {
    'use strict';

    $.widget('emizentech.bestsellerCarousel', {
        options: {
            enabled: true,
            productsPerSlide: 4,
            autoplaySpeed: 3000,
            transitionSpeed: 500
        },

        _create: function () {
            if (!this.options.enabled) {
                return;
            }

            this.currentIndex = 0;
            this.isTransitioning = false;
            this.autoplayInterval = null;
            this.touchStartX = 0;
            this.touchEndX = 0;

            this._initElements();
            this._calculateSlides();
            this._createDots();
            this._bindEvents();
            this._updateCarousel();
            this._startAutoplay();
            this._handleResize();
        },

        _initElements: function () {
            this.wrapper = this.element.find('.bestseller-carousel-wrapper');
            this.container = this.element.find('.bestseller-carousel-container');
            this.track = this.element.find('.bestseller-carousel-track');
            this.slides = this.element.find('.carousel-slide');
            this.prevBtn = this.element.find('.carousel-prev');
            this.nextBtn = this.element.find('.carousel-next');
            this.dotsContainer = this.element.find('.carousel-dots');
        },

        _calculateSlides: function () {
            this.totalProducts = this.slides.length;
            this.productsPerSlide = this._getResponsiveProductsPerSlide();
            this.totalSlides = Math.ceil(this.totalProducts / this.productsPerSlide);
        },

        _getResponsiveProductsPerSlide: function () {
            var windowWidth = $(window).width();
            var productsPerSlide = parseInt(this.options.productsPerSlide, 10);

            if (windowWidth < 480) {
                return 1;
            } else if (windowWidth < 768) {
                return Math.min(2, productsPerSlide);
            } else if (windowWidth < 1024) {
                return Math.min(3, productsPerSlide);
            }

            return productsPerSlide;
        },

        _createDots: function () {
            this.dotsContainer.empty();

            for (var i = 0; i < this.totalSlides; i++) {
                var dot = $('<button>')
                    .addClass('carousel-dot')
                    .attr('aria-label', 'Go to slide ' + (i + 1))
                    .attr('data-slide', i);

                if (i === 0) {
                    dot.addClass('active');
                }

                this.dotsContainer.append(dot);
            }

            this.dots = this.dotsContainer.find('.carousel-dot');
        },

        _bindEvents: function () {
            var self = this;

            this.prevBtn.on('click', function (e) {
                e.preventDefault();
                self._stopAutoplay();
                self._goToPrev();
                self._startAutoplay();
            });

            this.nextBtn.on('click', function (e) {
                e.preventDefault();
                self._stopAutoplay();
                self._goToNext();
                self._startAutoplay();
            });

            this.dots.on('click', function (e) {
                e.preventDefault();
                var slideIndex = parseInt($(this).attr('data-slide'), 10);
                self._stopAutoplay();
                self._goToSlide(slideIndex);
                self._startAutoplay();
            });

            this.wrapper.on('mouseenter', function () {
                self._stopAutoplay();
            });

            this.wrapper.on('mouseleave', function () {
                self._startAutoplay();
            });

            this.track.on('touchstart', function (e) {
                self.touchStartX = e.changedTouches[0].screenX;
            });

            this.track.on('touchend', function (e) {
                self.touchEndX = e.changedTouches[0].screenX;
                self._handleSwipe();
            });
        },

        _handleResize: function () {
            var self = this;
            var resizeTimer;

            $(window).on('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    var oldProductsPerSlide = self.productsPerSlide;
                    self._calculateSlides();

                    if (oldProductsPerSlide !== self.productsPerSlide) {
                        self.currentIndex = 0;
                        self._createDots();
                        self._bindEvents();
                    }

                    self._updateCarousel();
                }, 250);
            });
        },

        _handleSwipe: function () {
            var swipeThreshold = 50;
            var diff = this.touchStartX - this.touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                this._stopAutoplay();

                if (diff > 0) {
                    this._goToNext();
                } else {
                    this._goToPrev();
                }

                this._startAutoplay();
            }
        },

        _goToPrev: function () {
            if (this.isTransitioning) {
                return;
            }

            this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
            this._updateCarousel();
        },

        _goToNext: function () {
            if (this.isTransitioning) {
                return;
            }

            this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
            this._updateCarousel();
        },

        _goToSlide: function (index) {
            if (this.isTransitioning || index === this.currentIndex) {
                return;
            }

            this.currentIndex = index;
            this._updateCarousel();
        },

        _updateCarousel: function () {
            var self = this;
            this.isTransitioning = true;

            var slideWidth = 100 / this.productsPerSlide;
            var offset = -(this.currentIndex * this.productsPerSlide * slideWidth);

            this.slides.each(function (index) {
                $(this).css({
                    'flex': '0 0 ' + slideWidth + '%',
                    'max-width': slideWidth + '%'
                });
            });

            this.track.css({
                'transform': 'translateX(' + offset + '%)',
                'transition': 'transform ' + this.options.transitionSpeed + 'ms ease-in-out'
            });

            this.dots.removeClass('active');
            this.dots.eq(this.currentIndex).addClass('active');

            this._updateControlsVisibility();

            setTimeout(function () {
                self.isTransitioning = false;
            }, this.options.transitionSpeed);
        },

        _updateControlsVisibility: function () {
            if (this.totalSlides <= 1) {
                this.prevBtn.hide();
                this.nextBtn.hide();
                this.dotsContainer.hide();
            } else {
                this.prevBtn.show();
                this.nextBtn.show();
                this.dotsContainer.show();
            }
        },

        _startAutoplay: function () {
            var self = this;

            if (this.totalSlides <= 1) {
                return;
            }

            this._stopAutoplay();

            this.autoplayInterval = setInterval(function () {
                self._goToNext();
            }, this.options.autoplaySpeed);
        },

        _stopAutoplay: function () {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
                this.autoplayInterval = null;
            }
        },

        destroy: function () {
            this._stopAutoplay();
            this.prevBtn.off('click');
            this.nextBtn.off('click');
            this.dots.off('click');
            this.wrapper.off('mouseenter mouseleave');
            this.track.off('touchstart touchend');
            $(window).off('resize');

            this._super();
        }
    });

    return $.emizentech.bestsellerCarousel;
});
