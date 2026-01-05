document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // MOBILE NAVIGATION
    // ========================================
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ========================================
    // HERO SLIDESHOW
    // Auto-scroll every 4 seconds + Drag to move
    // ========================================
    const slideshowWrapper = document.querySelector('.slideshow-wrapper');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const slideCount = slides.length;
    let currentIndex = 0;
    let autoSlideInterval;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Initialize slideshow
    function goToSlide(index) {
        if (index < 0) index = slideCount - 1;
        if (index >= slideCount) index = 0;

        currentIndex = index;
        slideshowWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // Auto-scroll every 4 seconds
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 4000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            goToSlide(parseInt(dot.dataset.index));
            startAutoSlide();
        });
    });

    // ========================================
    // DRAG FUNCTIONALITY FOR SLIDESHOW
    // ========================================
    const slideshowContainer = document.querySelector('.slideshow-container');

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function touchStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        stopAutoSlide();
        slideshowWrapper.style.transition = 'none';
    }

    function touchMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
    }

    function touchEnd() {
        isDragging = false;
        slideshowWrapper.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

        const movedBy = currentTranslate - prevTranslate;

        // If moved enough, change slide
        if (movedBy < -80) {
            goToSlide(currentIndex + 1);
        } else if (movedBy > 80) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(currentIndex);
        }

        prevTranslate = -currentIndex * slideshowContainer.offsetWidth;
        currentTranslate = prevTranslate;
        startAutoSlide();
    }

    // Mouse events
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mousedown', touchStart);
        slideshowContainer.addEventListener('mousemove', touchMove);
        slideshowContainer.addEventListener('mouseup', touchEnd);
        slideshowContainer.addEventListener('mouseleave', () => {
            if (isDragging) touchEnd();
        });

        // Touch events
        slideshowContainer.addEventListener('touchstart', touchStart, { passive: true });
        slideshowContainer.addEventListener('touchmove', touchMove, { passive: true });
        slideshowContainer.addEventListener('touchend', touchEnd);

        // Prevent context menu on long press
        slideshowContainer.addEventListener('contextmenu', e => e.preventDefault());
    }

    // Start auto-slide
    startAutoSlide();

    // ========================================
    // BANNER SLIDER (Horizontal Scroll with Drag)
    // ========================================
    const bannerWrapper = document.querySelector('.banner-wrapper');
    let bannerDragging = false;
    let bannerStartX = 0;
    let bannerScrollLeft = 0;

    if (bannerWrapper) {
        bannerWrapper.addEventListener('mousedown', (e) => {
            bannerDragging = true;
            bannerStartX = e.pageX - bannerWrapper.offsetLeft;
            bannerScrollLeft = bannerWrapper.scrollLeft;
            bannerWrapper.style.cursor = 'grabbing';
        });

        bannerWrapper.addEventListener('mouseleave', () => {
            bannerDragging = false;
            bannerWrapper.style.cursor = 'grab';
        });

        bannerWrapper.addEventListener('mouseup', () => {
            bannerDragging = false;
            bannerWrapper.style.cursor = 'grab';
        });

        bannerWrapper.addEventListener('mousemove', (e) => {
            if (!bannerDragging) return;
            e.preventDefault();
            const x = e.pageX - bannerWrapper.offsetLeft;
            const walk = (x - bannerStartX) * 1.5;
            bannerWrapper.scrollLeft = bannerScrollLeft - walk;
        });

        // Auto-scroll banner every 4 seconds
        let bannerAutoScroll;
        let bannerDirection = 1;

        function startBannerAutoScroll() {
            bannerAutoScroll = setInterval(() => {
                const maxScroll = bannerWrapper.scrollWidth - bannerWrapper.clientWidth;

                if (bannerWrapper.scrollLeft >= maxScroll) {
                    bannerDirection = -1;
                } else if (bannerWrapper.scrollLeft <= 0) {
                    bannerDirection = 1;
                }

                bannerWrapper.scrollBy({
                    left: bannerDirection * bannerWrapper.clientWidth / 3,
                    behavior: 'smooth'
                });
            }, 4000);
        }

        startBannerAutoScroll();

        bannerWrapper.addEventListener('mouseenter', () => {
            clearInterval(bannerAutoScroll);
        });

        bannerWrapper.addEventListener('mouseleave', () => {
            startBannerAutoScroll();
        });
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // SCROLL REVEAL ANIMATION
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Add reveal animation to items
    const revealElements = document.querySelectorAll('.topic-item, .ranking-item, .column-item, .shop-item, .about-text-box');
    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`;
        observer.observe(el);
    });

    // CSS class for revealed state
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // HEADER SCROLL EFFECT
    // Transparent initially, white bg + black text on scroll
    // ========================================
    const header = document.querySelector('.main-header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ========================================
    // CAMPAIGN SLIDER
    // Auto-scroll every 4 seconds + Drag to move
    // ========================================
    const bannerGrid = document.querySelector('.banner-grid');
    const bannerItems = document.querySelectorAll('.banner-item');
    const prevBtn = document.querySelector('.campaign-prev');
    const nextBtn = document.querySelector('.campaign-next');

    if (bannerGrid && bannerItems.length > 0) {
        let campaignIndex = 0;
        let campaignAutoScroll;
        let isDraggingCampaign = false;
        let campaignStartX = 0;
        let campaignScrollLeft = 0;

        // Make banner grid scrollable
        bannerGrid.style.display = 'flex';
        bannerGrid.style.overflowX = 'auto';
        bannerGrid.style.scrollBehavior = 'smooth';
        bannerGrid.style.scrollSnapType = 'x mandatory';
        bannerGrid.style.scrollbarWidth = 'none';
        bannerGrid.style.msOverflowStyle = 'none';

        // Hide scrollbar
        const campaignStyle = document.createElement('style');
        campaignStyle.textContent = `.banner-grid::-webkit-scrollbar { display: none; }`;
        document.head.appendChild(campaignStyle);

        // Set banner item width
        bannerItems.forEach(item => {
            item.style.minWidth = 'calc(33.333% - 10px)';
            item.style.scrollSnapAlign = 'start';
        });

        // Auto-scroll every 4 seconds
        function startCampaignAutoScroll() {
            campaignAutoScroll = setInterval(() => {
                bannerGrid.scrollBy({ left: bannerGrid.clientWidth / 3, behavior: 'smooth' });
            }, 4000);
        }

        function stopCampaignAutoScroll() {
            clearInterval(campaignAutoScroll);
        }

        startCampaignAutoScroll();

        // Prev/Next buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopCampaignAutoScroll();
                bannerGrid.scrollBy({ left: -bannerGrid.clientWidth / 3, behavior: 'smooth' });
                startCampaignAutoScroll();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopCampaignAutoScroll();
                bannerGrid.scrollBy({ left: bannerGrid.clientWidth / 3, behavior: 'smooth' });
                startCampaignAutoScroll();
            });
        }

        // Drag to scroll
        bannerGrid.addEventListener('mousedown', (e) => {
            isDraggingCampaign = true;
            campaignStartX = e.pageX - bannerGrid.offsetLeft;
            campaignScrollLeft = bannerGrid.scrollLeft;
            bannerGrid.style.cursor = 'grabbing';
            stopCampaignAutoScroll();
        });

        bannerGrid.addEventListener('mouseleave', () => {
            if (isDraggingCampaign) {
                isDraggingCampaign = false;
                bannerGrid.style.cursor = 'grab';
                startCampaignAutoScroll();
            }
        });

        bannerGrid.addEventListener('mouseup', () => {
            isDraggingCampaign = false;
            bannerGrid.style.cursor = 'grab';
            startCampaignAutoScroll();
        });

        bannerGrid.addEventListener('mousemove', (e) => {
            if (!isDraggingCampaign) return;
            e.preventDefault();
            const x = e.pageX - bannerGrid.offsetLeft;
            const walk = (x - campaignStartX) * 1.5;
            bannerGrid.scrollLeft = campaignScrollLeft - walk;
        });

        // Touch events for mobile
        bannerGrid.addEventListener('touchstart', (e) => {
            isDraggingCampaign = true;
            campaignStartX = e.touches[0].pageX - bannerGrid.offsetLeft;
            campaignScrollLeft = bannerGrid.scrollLeft;
            stopCampaignAutoScroll();
        }, { passive: true });

        bannerGrid.addEventListener('touchend', () => {
            isDraggingCampaign = false;
            startCampaignAutoScroll();
        });

        bannerGrid.addEventListener('touchmove', (e) => {
            if (!isDraggingCampaign) return;
            const x = e.touches[0].pageX - bannerGrid.offsetLeft;
            const walk = (x - campaignStartX) * 1.5;
            bannerGrid.scrollLeft = campaignScrollLeft - walk;
        }, { passive: true });

        bannerGrid.style.cursor = 'grab';
    }
});
