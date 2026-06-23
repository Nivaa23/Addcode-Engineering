document.addEventListener('DOMContentLoaded', () => {
    // Luide initialization (ensure it runs after content is ready)
    if (window.lucide) {
        lucide.createIcons();
    }

    // Framer-style scroll reveals
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Header scroll background/blur effect
    const header = document.querySelector('header');
    const scrollHandler = () => {
        if (window.scrollY > 80) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.top = '1rem';
            header.style.boxShadow = '0 10px 40px rgba(15, 23, 42, 0.08)';
            header.style.borderColor = 'var(--border-dim)';
        } else {
            header.style.backgroundColor = 'var(--bg-glass)';
            header.style.top = '2rem';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.03)';
            header.style.borderColor = 'var(--border-dim)';
        }
    };

    window.addEventListener('scroll', scrollHandler);

    // Simple smooth scroll logic for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Navigation Toggle Logic
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    const headerCta = document.querySelector('header .header-cta');
    let mobileToggle = document.querySelector('.mobile-toggle');

    if (navContainer && navLinks) {
        if (!mobileToggle) {
            mobileToggle = document.createElement('button');
            mobileToggle.className = 'mobile-toggle';
            mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
            mobileToggle.setAttribute('aria-label', 'Toggle Navigation');
            navContainer.appendChild(mobileToggle);

            // Critical: Initialize icon immediately after creation
            if (window.lucide) {
                lucide.createIcons();
            }
        }

        // CTA is now provided in HTML directly inside .nav-links for single-source-of-truth

        const toggleMenu = (forceClose = false) => {
            const isOpen = forceClose ? false : !navLinks.classList.contains('mobile-active');

            navLinks.classList.toggle('mobile-active', isOpen);
            mobileToggle.classList.toggle('active', isOpen);
            mobileToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';

            document.body.style.overflow = isOpen ? 'hidden' : '';

            if (window.lucide) {
                lucide.createIcons();
            }
        };

        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(true);
            });
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('mobile-active') &&
                !navLinks.contains(e.target) &&
                !mobileToggle.contains(e.target)) {
                toggleMenu(true);
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('mobile-active')) {
                toggleMenu(true);
            }
        });
    }

    // Technical Inquiry Form Handler (Contact Page)
    const inquiryForm = document.getElementById('technical-inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = inquiryForm.querySelector('button[type="submit"]');
            const statusDiv = document.getElementById('form-status');

            // Get form data
            const formData = new FormData(inquiryForm);
            const data = Object.fromEntries(formData);

            // Store in localStorage
            localStorage.setItem('inquiry_' + Date.now(), JSON.stringify(data));

            // Show success message
            statusDiv.style.display = "block";
            statusDiv.style.backgroundColor = "var(--accent-dim)";
            statusDiv.style.color = "var(--accent)";
            statusDiv.style.border = "1px solid var(--accent)";
            statusDiv.innerHTML = "Your inquiry has been submitted successfully. Our team will contact you within 4 hours.";

            // Reset form
            inquiryForm.reset();
            submitBtn.textContent = "Sent Successfully";
            submitBtn.disabled = true;

            // Re-enable after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = "Send Technical Inquiry";
                submitBtn.disabled = false;
                statusDiv.style.display = "none";
            }, 3000);
        });
    }

    // Lightbox modal logic for Engineering Deliverables
    const deliverablesModal = document.getElementById('deliverables-modal');
    if (deliverablesModal) {
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalClose = document.getElementById('modal-close');

        const openModal = (card) => {
            const imgSrc = card.getAttribute('data-image');
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');

            if (modalImg && imgSrc) {
                modalImg.src = imgSrc;
                if (modalTitle) modalTitle.textContent = title || '';
                if (modalDesc) modalDesc.textContent = desc || '';

                deliverablesModal.classList.add('active');
                deliverablesModal.setAttribute('aria-hidden', 'false');
                document.body.classList.add('modal-open');
            }
        };

        const closeModal = () => {
            deliverablesModal.classList.remove('active');
            deliverablesModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            if (modalImg) modalImg.src = '';
        };

        // Attach event listeners to all deliverable cards
        document.querySelectorAll('.deliverable-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const btn = e.target.closest('.view-deliverable-btn');
                if (btn) {
                    e.preventDefault();
                }
                openModal(card);
            });
        });

        // Close on close button click
        if (modalClose) {
            modalClose.addEventListener('click', (e) => {
                e.stopPropagation();
                closeModal();
            });
        }

        // Close on clicking backdrop overlay
        deliverablesModal.addEventListener('click', (e) => {
            if (e.target === deliverablesModal) {
                closeModal();
            }
        });

        // Close on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && deliverablesModal.classList.contains('active')) {
                closeModal();
            }
        });
    }
});

