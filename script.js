// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(5, 8, 19, 0.98)';
        navbar.style.boxShadow = '0 5px 30px rgba(0, 245, 255, 0.1)';
    } else {
        navbar.style.background = 'rgba(5, 8, 19, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Force-load images with data-src immediately (reliable for static hosting and local file mode)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
    });
});

// Hero role text animation
(function initHeroRoleAnimation() {
    const roleEl = document.querySelector('#hero-role');
    if (!roleEl) return;

    const roles = [
        'Full Stack Developer',
        'Creative Coder',
        'Machine Learning Engineer'
    ];

    let idx = 0;
    setInterval(() => {
        roleEl.classList.remove('enter');
        roleEl.classList.add('exit');

        setTimeout(() => {
            idx = (idx + 1) % roles.length;
            roleEl.textContent = roles[idx];
            roleEl.classList.remove('exit');
            roleEl.classList.add('enter');
        }, 220);
    }, 2400);
})();

// Achievements carousel
(function initCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prevBtn = carousel.querySelector('.carousel-button.prev');
    const nextBtn = carousel.querySelector('.carousel-button.next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    let index = 0;
    let autoplayId = null;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
            index = i;
            update();
            resetAutoplay();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function update() {
        const gap = parseFloat(getComputedStyle(track).gap || 0);
        const slideWidth = slides[0].getBoundingClientRect().width + gap;
        track.style.transform = `translateX(-${index * slideWidth}px)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    function prev() {
        index = (index - 1 + slides.length) % slides.length;
        update();
    }

    function next() {
        index = (index + 1) % slides.length;
        update();
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayId = setInterval(next, 3500);
    }

    function stopAutoplay() {
        if (autoplayId) {
            clearInterval(autoplayId);
            autoplayId = null;
        }
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    prevBtn.addEventListener('click', () => {
        prev();
        resetAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        next();
        resetAutoplay();
    });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    window.addEventListener('load', update);
    window.addEventListener('resize', () => setTimeout(update, 80));

    update();
    startAutoplay();
})();

// Certifications modal and PDF gallery
(function initCertifications() {
    const viewBtn = document.querySelector('#view-all-certs');
    const modal = document.querySelector('#cert-modal');
    const closeBtn = document.querySelector('#close-cert-modal');
    const gallery = document.querySelector('#cert-gallery');
    const viewer = document.querySelector('#cert-viewer');
    const iframe = document.querySelector('#cert-iframe');
    const backBtn = document.querySelector('#cert-back');
    const openNewBtn = document.querySelector('#cert-open-new');

    if (!viewBtn || !modal || !closeBtn || !gallery || !viewer || !iframe) return;

    const filenames = [
        '1.pdf', '2.pdf', '3.pdf', '4.pdf', '5.pdf', '6.pdf', '7.pdf',
        '8.pdf', '9.pdf', '10.pdf', '11.pdf', '12.pdf', '13.pdf', '14.pdf'
    ];

    const folder = 'Certificates/';
    let currentFile = '';

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        iframe.src = '';
        viewer.hidden = true;
        gallery.hidden = false;
    }

    function showPdf(file) {
        currentFile = file;
        iframe.src = file + '#view=FitH';
        gallery.hidden = true;
        viewer.hidden = false;
    }

    filenames.forEach(name => {
        const item = document.createElement('div');
        item.className = 'cert-modal-item cert-card';
        item.tabIndex = 0;

        const thumb = document.createElement('div');
        thumb.className = 'cert-thumb';
        thumb.textContent = 'PDF';

        const label = document.createElement('div');
        label.className = 'cert-name';
        label.textContent = `Certificate ${name.replace('.pdf', '')}`;

        item.appendChild(thumb);
        item.appendChild(label);

        item.addEventListener('click', () => showPdf(folder + name));
        item.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showPdf(folder + name);
            }
        });

        gallery.appendChild(item);
    });

    viewBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            iframe.src = '';
            viewer.hidden = true;
            gallery.hidden = false;
        });
    }

    if (openNewBtn) {
        openNewBtn.addEventListener('click', () => {
            if (currentFile) window.open(currentFile, '_blank', 'noopener');
        });
    }
})();
