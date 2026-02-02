document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Logic ---
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !hamburger.contains(e.target) && nav.classList.contains('active')) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }

    // --- Carousel Logic ---
    const slidesContainer = document.querySelector('.carousel-slide');
    if (slidesContainer) {
        const slides = document.querySelectorAll('.carousel-slide img');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentSlide = 0;
        const totalSlides = slides.length;

        function showSlide(index) {
            // Loop back if out of bounds
            if (index >= totalSlides) currentSlide = 0;
            else if (index < 0) currentSlide = totalSlides - 1;
            else currentSlide = index;

            slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        // Auto play (every 5 seconds)
        let autoPlayInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 5000);
        }

        // Event Listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showSlide(currentSlide + 1);
                resetAutoPlay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showSlide(currentSlide - 1);
                resetAutoPlay();
            });
        }
    }

    // --- Scroll Animations (Cool Effects) ---
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.2, // 20% of item visible
        rootMargin: "0px 0px -50px 0px"
    };

    if ('IntersectionObserver' in window) {
        const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                } else {
                    entry.target.classList.add('visible');
                    appearOnScroll.unobserve(entry.target);
                }
            });
        }, appearOptions);

        faders.forEach(fader => {
            appearOnScroll.observe(fader);
        });
    } else {
        // Fallback for older browsers
        faders.forEach(fader => {
            fader.classList.add('visible');
        });
    }
});
