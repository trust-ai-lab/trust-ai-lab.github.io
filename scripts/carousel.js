class HeroCarousel {
    constructor(selector) {
        this.carousel = document.querySelector(selector);
        if (!this.carousel) return;
        
        this.slides = Array.from(this.carousel.querySelectorAll('.carousel-slide'));
        this.indicators = Array.from(this.carousel.querySelectorAll('.indicator'));
        this.prevBtn = this.carousel.querySelector('.carousel-prev');
        this.nextBtn = this.carousel.querySelector('.carousel-next');

        this.currentSlide = 0;
        this.isTransitioning = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 6000;

        this.touchStartX = 0;
        this.touchEndX = 0;
        this.touchThreshold = 50;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startAutoPlay();

        this.updateSlides();
        this.updateIndicators();

        this.preloadImages();
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Touch/swipe support
        this.carousel.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.carousel.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // Mouse events for auto-play control
        this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Visibility API to pause when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else {
                this.startAutoPlay();
            }
        });
        
        // Resize handler
        window.addEventListener('resize', () => this.handleResize());
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }
    
    handleSwipe() {
        const swipeDistance = this.touchStartX - this.touchEndX;
        
        if (Math.abs(swipeDistance) > this.touchThreshold) {
            if (swipeDistance > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    handleResize() {
        // Recalculate any size-dependent properties if needed
        this.updateSlides();
    }
    
    preloadImages() {
        this.slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img && !img.complete) {
                img.addEventListener('load', () => {
                    slide.classList.add('loaded');
                });
            } else if (img) {
                slide.classList.add('loaded');
            }
        });
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
    }
    
    prevSlide() {
        if (this.isTransitioning) return;
        
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        
        this.currentSlide = index;
        this.updateCarousel();
    }
    
    updateCarousel() {
        this.isTransitioning = true;
        
        this.updateSlides();
        this.updateIndicators();
        this.restartAutoPlay();
        
        // Reset transition flag after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800); // Match CSS transition duration
    }
    
    updateSlides() {
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');
            
            if (index === this.currentSlide) {
                slide.classList.add('active');
                // Trigger text animation
                this.animateSlideText(slide);
            } else if (index === this.getPrevSlideIndex()) {
                slide.classList.add('prev');
            }
        });
    }
    
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    animateSlideText(slide) {
        const slideText = slide.querySelector('.slide-text');
        if (slideText) {
            slideText.style.animation = 'none';
            slideText.offsetHeight;
            slideText.style.animation = 'slideFade 0.6s ease-out 0.1s both';
        }
    }
    
    getPrevSlideIndex() {
        return this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    }
    
    startAutoPlay() {
        this.pauseAutoPlay();

        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    restartAutoPlay() {
        this.startAutoPlay();
    }

    destroy() {
        this.pauseAutoPlay();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new HeroCarousel('.hero-carousel');
    
    // Make it globally accessible if needed
    window.heroCarousel = carousel;
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (window.heroCarousel) {
        if (document.hidden) {
            window.heroCarousel.pauseAutoPlay();
        } else {
            window.heroCarousel.startAutoPlay();
        }
    }
});

// Intersection Observer for performance optimization
if ('IntersectionObserver' in window) {
    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target.classList.contains('hero-carousel')) {
                if (entry.isIntersecting) {
                    window.heroCarousel?.startAutoPlay();
                } else {
                    window.heroCarousel?.pauseAutoPlay();
                }
            }
        });
    }, { threshold: 0.3 });
    
    document.addEventListener('DOMContentLoaded', () => {
        const carousel = document.querySelector('.hero-carousel');
        if (carousel) {
            carouselObserver.observe(carousel);
        }
    });
}
