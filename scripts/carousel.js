let currentIndex = 1;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    const track = document.querySelector('.carousel-track');
    track.style.transform = `translateX(-${index * 100}%)`;

    slides.forEach((slide, i) => {
        dots[i].classList.toggle('active', i === index);
    });
    currentIndex = index;
}

function nextSlide() {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= slides.length) {
        nextIndex = 0;
    }
    showSlide(nextIndex);
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

setInterval(nextSlide, 4000);

showSlide(currentIndex);
