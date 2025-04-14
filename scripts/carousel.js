document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const dots = document.querySelectorAll('.dot');
    if (!track || slides.length === 0) return;

    // Clone first and last slides for circular effect
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');
    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    const allSlides = Array.from(track.children);
    let currentIndex = 1;
    let isTransitioning = false;

    // Ensure all slides are 100% width
    allSlides.forEach(slide => {
        slide.style.minWidth = '100%';
        slide.style.width = '100%';
        slide.style.flex = '0 0 100%';
    });

    function updateTrack(animate = true) {
        track.style.transition = animate ? 'transform 0.6s cubic-bezier(.4,1.6,.6,1)' : 'none';
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function updateDots() {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === getRealIndex());
        });
    }

    function getRealIndex() {
        if (currentIndex === 0) return slides.length - 1;
        if (currentIndex === allSlides.length - 1) return 0;
        return currentIndex - 1;
    }

    function goToSlide(index) {
        if (isTransitioning) return;
        currentIndex = index + 1;
        updateTrack(true);
        updateDots();
    }

    function nextSlide() {
        if (isTransitioning) return;
        currentIndex++;
        updateTrack(true);
        updateDots();
    }

    function prevSlide() {
        if (isTransitioning) return;
        currentIndex--;
        updateTrack(true);
        updateDots();
    }

    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        if (currentIndex === allSlides.length - 1) {
            // At clone of first, jump to real first (seamlessly)
            track.style.transition = 'none';
            currentIndex = 1;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            // Force reflow to apply transform instantly
            void track.offsetHeight;
            track.style.transition = 'transform 0.6s cubic-bezier(.4,1.6,.6,1)';
        } else if (currentIndex === 0) {
            // At clone of last, jump to real last (seamlessly)
            track.style.transition = 'none';
            currentIndex = allSlides.length - 2;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            void track.offsetHeight;
            track.style.transition = 'transform 0.6s cubic-bezier(.4,1.6,.6,1)';
        }
    });

    track.addEventListener('transitionstart', () => {
        isTransitioning = true;
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
    });

    let intervalId = setInterval(nextSlide, 5000);
    track.addEventListener('mouseenter', () => clearInterval(intervalId));
    track.addEventListener('mouseleave', () => intervalId = setInterval(nextSlide, 5000));

    updateTrack(false);
    updateDots();
});
