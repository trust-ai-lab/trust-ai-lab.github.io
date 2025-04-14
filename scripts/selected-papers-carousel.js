document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.sp-carousel-track');
    const container = document.querySelector('.sp-carousel-container'); // Get container for hover detection

    if (!track || !container) {
        console.error("Selected papers carousel track or container not found.");
        return; // Exit if elements aren't found
    }

    const slides = Array.from(track.children);
    // Early exit if there are no slides to prevent errors
    if (slides.length === 0) {
        console.error("No slides found in the selected papers carousel track.");
        return;
    }

    const slideStyle = getComputedStyle(slides[0]);
    const slideMargin = parseInt(slideStyle.marginLeft) + parseInt(slideStyle.marginRight);
    const slideWidth = slides[0].offsetWidth + slideMargin; // Include margin

    const originalSlideCount = slides.length;
    let currentIndex = 0;
    let intervalId = null;
    let isPaused = false;

    // Clone slides for infinite effect
    slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        track.appendChild(clone);
    });

    // Set track width explicitly to accommodate original + clones
    track.style.width = `${slideWidth * originalSlideCount * 2}px`;


    function moveToNextSlide() {
        if (isPaused) return; // Don't move if paused

        currentIndex++;
        track.style.transition = 'transform 0.5s ease-in-out'; // Re-enable transition
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        // Check if we've reached the end of the original slides (start of clones)
        if (currentIndex >= originalSlideCount) {
            // After transition ends, jump back to the start without animation
            // Use 'transitionend' event for more robust timing
            track.addEventListener('transitionend', jumpToStart, { once: true });
        }
    }

    function jumpToStart() {
        track.style.transition = 'none'; // Disable transition for the jump
        track.style.transform = 'translateX(0px)';
        currentIndex = 0;
        // Force reflow/repaint might be needed in some browsers
        // void track.offsetWidth;
    }

    function startCarousel() {
       if (intervalId) clearInterval(intervalId); // Clear existing interval if any
       intervalId = setInterval(moveToNextSlide, 3000); // Change slide every 3 seconds
    }

    function pauseCarousel() {
        isPaused = true;
    }

    function resumeCarousel() {
        isPaused = false;
    }

    // Pause on hover
    container.addEventListener('mouseenter', pauseCarousel);
    container.addEventListener('mouseleave', resumeCarousel);

    // Start the carousel initially
    startCarousel();

});