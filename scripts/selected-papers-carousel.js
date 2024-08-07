document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.sp-carousel-track');
    const papers = document.querySelectorAll('.selected-paper');
    let currentIndex = 0;
    let startX;
    let scrollLeft;
    let isDown = false;
    
    // Clone papers for infinite scroll
    papers.forEach(paper => {
        const clone = paper.cloneNode(true);
        track.appendChild(clone);
    });

    function setPositionByIndex() {
        track.style.transform = `translateX(-${currentIndex * (100 / papers.length)}%)`;
    }

    function moveToNextSlide() {
        currentIndex++;
        if (currentIndex >= papers.length) {
            currentIndex = 0;
            track.style.transition = 'none';
            setPositionByIndex();
            setTimeout(() => {
                track.style.transition = 'transform 0.5s ease';
            }, 10);
        } else {
            setPositionByIndex();
        }
    }

    let autoRotate = setInterval(moveToNextSlide, 3000);

    track.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => {
        isDown = false;
    });

    track.addEventListener('mouseup', () => {
        isDown = false;
    });

    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 2;
        track.scrollLeft = scrollLeft - walk;
        currentIndex = Math.round(scrollPosition / (track.scrollWidth / (papers.length * 2)));
        currentIndex = Math.max(0, Math.min(currentIndex, papers.length - 1));
        setPositionByIndex(currentIndex);
    });

    track.addEventListener('mouseenter', () => clearInterval(autoRotate));
    track.addEventListener('mouseleave', () => {
        autoRotate = setInterval(moveToNextSlide, 3000);
    });

    // track.addEventListener('wheel', (e) => {
    //     e.preventDefault();
    //     clearInterval(autoRotate);
    //     currentIndex += Math.sign(e.deltaY);
    //     if (currentIndex < 0) currentIndex = papers.length - 1;
    //     if (currentIndex >= papers.length) currentIndex = 0;
    //     setPositionByIndex(currentIndex);
    //     autoRotate = setInterval(moveToNextSlide, 3000);
    // }, { passive: false });
});