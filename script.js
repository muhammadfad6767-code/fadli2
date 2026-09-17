/**
 * SCRIPT.JS - Portfolio Muhammad Fadli (11 RPL B SMK N Tembarak)
 * Logika Interaktif:
 * 1. Dark Mode & Light Mode Engine + LocalStorage Persistence
 * 2. Dynamic Typing Effect (Hero Subtitle)
 * 3. Sticky Navbar & Scrollspy Active Navigation
 * 4. Mobile Hamburger Navigation Drawer
 * 5. Scroll Reveal & Skill Progress Bar Trigger
 * 6. Modal Detail Proyek Showcase
 * 7. Form Kontak Mailto Otomatis & Toast Notification
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =========================================================================
    // 1. PENGELOLAAN DARK MODE & LIGHT MODE DENGAN LOCALSTORAGE
    // =========================================================================
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeText = document.getElementById('themeText');
    const htmlElement = document.documentElement;

    // Ambil preferensi tema tersimpan atau default ke 'dark'
    const savedTheme = localStorage.getItem('fadli_portfolio_theme') || 'dark';
    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
            localStorage.setItem('fadli_portfolio_theme', nextTheme);
        });
    }

    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        if (themeText) {
            themeText.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
        }
        if (themeToggleBtn) {
            themeToggleBtn.setAttribute(
                'title', 
                theme === 'dark' ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'
            );
        }
    }

    // =========================================================================
    // 2. HERO DYNAMIC TYPING EFFECT
    // =========================================================================
    const typingElement = document.getElementById('typingText');
    if (typingElement) {
        const phrases = [
            'Calon Developer',
            'Web Developer Enthusiast',
            'Frontend & UI Explorer',
            'Siswa SMK N Tembarak'
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeLoop() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                // Hapus karakter
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                // Ketik karakter
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                // Jeda saat selesai mengetik
                typingSpeed = 1800;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // Pindah ke kalimat berikutnya
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 400;
            }

            setTimeout(typeLoop, typingSpeed);
        }

        // Mulai animasi pengetikan setelah delay awal
        setTimeout(typeLoop, 800);
    }

    // =========================================================================
    // 3. STICKY NAVBAR & SCROLLSPY
    // =========================================================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // Sticky background blur styling
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scrollspy highlight link menu yang aktif
        updateActiveNav();
    }, { passive: true });

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 160;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // =========================================================================
    // 4. HAMBURGER MENU DRAWER UNTUK HP
    // =========================================================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            const isActive = hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburgerBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Tutup menu saat link diklik
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Tutup menu jika pengguna mengklik area luar
        document.addEventListener('click', (e) => {
            if (
                !navMenu.contains(e.target) && 
                !hamburgerBtn.contains(e.target) && 
                navMenu.classList.contains('active')
            ) {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // =========================================================================
    // 5. SCROLL REVEAL & SKILLS PROGRESS ANIMATION
    // =========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const skillCards = document.querySelectorAll('.skill-card');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));

        // Observer khusus skill cards untuk trigger progress bar animasi
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.25 });

        skillCards.forEach(card => skillObserver.observe(card));
    } else {
        // Fallback untuk browser lama
        revealElements.forEach(el => el.classList.add('in-view'));
        skillCards.forEach(card => card.classList.add('in-view'));
    }

    // =========================================================================
    // 6. MODAL DETAIL PROYEK SHOWCASE
    // =========================================================================
    const projectModal = document.getElementById('projectModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCloseFooter = document.getElementById('modalCloseFooter');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalDesc = document.getElementById('modalDesc');
    const modalTechStack = document.getElementById('modalTechStack');
    const modalFeaturesList = document.getElementById('modalFeaturesList');
    const modalStatus = document.getElementById('modalStatus');
    const viewButtons = document.querySelectorAll('.btn-view-project');

    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.getAttribute('data-title') || 'Proyek';
            const category = btn.getAttribute('data-category') || 'Kategori';
            const desc = btn.getAttribute('data-desc') || '';
            const tech = btn.getAttribute('data-tech') || '';
            const features = btn.getAttribute('data-features') || '';
            const status = btn.getAttribute('data-status') || 'Aktif';

            modalTitle.textContent = title;
            modalCategory.textContent = category;
            modalDesc.textContent = desc;
            modalStatus.textContent = status;

            // Render Tech Stack Pills
            modalTechStack.innerHTML = '';
            if (tech) {
                tech.split(',').forEach(item => {
                    const pill = document.createElement('span');
                    pill.className = 'tech-pill';
                    pill.textContent = item.trim();
                    modalTechStack.appendChild(pill);
                });
            }

            // Render Fitur List
            modalFeaturesList.innerHTML = '';
            if (features) {
                features.split(',').forEach(feat => {
                    const li = document.createElement('li');
                    li.textContent = feat.trim();
                    modalFeaturesList.appendChild(li);
                });
            }

            // Buka Modal
            projectModal.classList.add('active');
            projectModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeProjectModal() {
        if (projectModal) {
            projectModal.classList.remove('active');
            projectModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
    if (modalCloseFooter) modalCloseFooter.addEventListener('click', closeProjectModal);

    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeProjectModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
            closeProjectModal();
        }
    });

    // =========================================================================
    // 7. FORM KONTAK DENGAN MAILTO OTOMATIS KE muhammadfad6767@gmail.com
    // =========================================================================
    const contactForm = document.getElementById('contactForm');
    const toastNotification = document.getElementById('toastNotification');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const TARGET_EMAIL = 'muhammadfad6767@gmail.com';

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('formName');
            const emailInput = document.getElementById('formEmail');
            const messageInput = document.getElementById('formMessage');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !message) {
                showToast('Perhatian', 'Harap isi semua bidang formulir sebelum mengirim!');
                return;
            }

            // Susun subjek dan isi pesan terstruktur
            const emailSubject = `Pesan Portfolio dari ${name}`;
            const emailBody = 
                `Halo Muhammad Fadli,\n\n` +
                `Ada pesan baru yang dikirimkan melalui form portfolio Anda:\n\n` +
                `Nama Pengirim  : ${name}\n` +
                `Email Pengirim : ${email}\n\n` +
                `Isi Pesan:\n` +
                `${message}\n\n` +
                `---\n` +
                `Pesan dibuat melalui formulir portfolio resmi Muhammad Fadli (11 RPL B SMK N Tembarak).`;

            // Bentuk tautan mailto fallback resmi
            const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

            // Berikan feedback visual ramah pengguna
            showToast(
                'Membuka Aplikasi Email...', 
                `Draf pesan telah disiapkan untuk ${TARGET_EMAIL}. Silakan kirim melalui aplikasi email Anda.`
            );

            // Buka aplikasi email default perangkat
            setTimeout(() => {
                window.location.href = mailtoUrl;
            }, 650);

            // Reset formulir setelah pengiriman
            contactForm.reset();
        });
    }

    let toastTimeout;
    function showToast(title, message) {
        if (!toastNotification) return;

        toastTitle.textContent = title;
        toastMessage.textContent = message;

        toastNotification.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastNotification.classList.remove('show');
        }, 5500);
    }
});
