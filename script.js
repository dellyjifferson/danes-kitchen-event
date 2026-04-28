document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    function applyTheme(theme) {
        const darkMode = theme === 'dark';
        document.body.classList.toggle('dark-theme', darkMode);
        if (themeToggle) {
            if (themeIcon) {
                themeIcon.classList.toggle('bi-moon-stars-fill', !darkMode);
                themeIcon.classList.toggle('bi-brightness-high-fill', darkMode);
            }
            themeToggle.setAttribute('aria-label', darkMode ? 'Activer le mode clair' : 'Activer le mode sombre');
            themeToggle.setAttribute('title', darkMode ? 'Mode clair' : 'Mode sombre');
        }
    }

    applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-theme');
            const nextTheme = isDark ? 'light' : 'dark';
            applyTheme(nextTheme);
            localStorage.setItem('theme', nextTheme);
        });
    }
    
    // --- Mobile Menu Logic ---
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    if (hamburger && nav) {
        // Auto-open menu on catalog page
        if (window.location.pathname.includes('catalog.html')) {
            hamburger.classList.add('active');
            nav.classList.add('active');
        }

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
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        const overlayTitle = document.getElementById('carousel-title');
        const overlayDesc = document.getElementById('carousel-desc');

        let currentSlide = 0;
        const totalSlides = slides.length;

        // Slide data with titles and descriptions
        const slideData = [
            { title: 'Gâteau de mariage', desc: 'Création élégante pour votre journée spéciale' },
            { title: 'Décoration événementielle', desc: 'Transformons vos espaces en univers magiques' },
            { title: 'Buffet Gourmet', desc: 'Une expérience culinaire raffinée' },
            { title: 'Dane\'s Savor Cremas', desc: 'L\'authentique boisson haïtienne artisanale' },
            { title: 'Gâteau d\'anniversaire enfant', desc: 'Magie et douceur pour les petits' },
            { title: 'Gâteau d\'anniversaire', desc: 'Célébrez vos moments avec élégance' },
            { title: 'Pâté Maison', desc: 'Savoureux pâté aux épices locales' },
            { title: 'Arrangements Floraux', desc: 'Fleurs fraîches pour chaque occasion' },
            { title: 'Cornets Sucrés', desc: 'Délices gourmands dans chaque cornet' }
        ];

        function showSlide(index) {
            // Loop back if out of bounds
            if (index >= totalSlides) currentSlide = 0;
            else if (index < 0) currentSlide = totalSlides - 1;
            else currentSlide = index;

            slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

            // Update overlay text
            if (overlayTitle && slideData[currentSlide]) {
                overlayTitle.textContent = slideData[currentSlide].title;
                if (overlayDesc) {
                    overlayDesc.textContent = slideData[currentSlide].desc;
                }
            }

            // Update indicators
            if (indicatorsContainer) {
                const indicators = indicatorsContainer.querySelectorAll('.indicator');
                indicators.forEach((ind, i) => {
                    ind.classList.toggle('active', i === currentSlide);
                });
            }
        }

        // Create indicators
        if (indicatorsContainer) {
            for (let i = 0; i < totalSlides; i++) {
                const indicator = document.createElement('div');
                indicator.classList.add('indicator');
                if (i === 0) indicator.classList.add('active');
                indicator.addEventListener('click', () => {
                    showSlide(i);
                    resetAutoPlay();
                });
                indicatorsContainer.appendChild(indicator);
            }
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

        // Pause auto-play on hover
        const carouselWrapper = document.querySelector('.carousel-wrapper');
        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', () => {
                clearInterval(autoPlayInterval);
            });
            carouselWrapper.addEventListener('mouseleave', () => {
                autoPlayInterval = setInterval(() => {
                    showSlide(currentSlide + 1);
                }, 5000);
            });
        }

        // Touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        slidesContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slidesContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    showSlide(currentSlide + 1); // Swipe left = next
                } else {
                    showSlide(currentSlide - 1); // Swipe right = prev
                }
                resetAutoPlay();
            }
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
