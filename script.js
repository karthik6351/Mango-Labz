/* ============================================================
   MANGO LABZ — Interactive Script
   Video intro, navbar, scroll animations, testimonials,
   stat counters, mobile menu, contact form, smooth scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ─── VIDEO INTRO ────────────────────────────────────────────
  const videoIntro = document.getElementById('video-intro');
  const introVideo = document.getElementById('intro-video');
  const skipBtn    = document.getElementById('skip-btn');

  function dismissIntro() {
    videoIntro.classList.add('hidden');
    document.body.style.overflow = '';
    introVideo.pause();
    // After transition, remove from DOM to free memory
    setTimeout(() => {
      videoIntro.style.display = 'none';
    }, 900);
  }

  // Prevent scrolling while intro is visible
  document.body.style.overflow = 'hidden';

  // Attempt to play automatically with sound
  introVideo.muted = false;
  const playPromise = introVideo.play();

  if (playPromise !== undefined) {
    playPromise.then(() => {
      // Autoplay started with sound!
    }).catch(error => {
      // Autoplay with sound was prevented.
      // Fallback: try autoplaying muted so the video still shows.
      introVideo.muted = true;
      introVideo.play().catch(e => {
        console.warn('Autoplay failed entirely:', e);
      });
    });
  }

  // Skip button
  if (skipBtn) {
    skipBtn.addEventListener('click', dismissIntro);
  }

  // When video ends, dismiss
  introVideo.addEventListener('ended', dismissIntro);

  // Allow clicking anywhere on video area to toggle play/pause or unmute
  introVideo.addEventListener('click', () => {
    if (introVideo.muted) {
      // If playing muted, unmute on user interaction
      introVideo.muted = false;
      // Also ensure it is playing
      if (introVideo.paused) introVideo.play();
    } else if (introVideo.paused) {
      introVideo.play();
    } else {
      introVideo.pause();
    }
  });


  // ─── NAVBAR SCROLL EFFECT ──────────────────────────────────
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  function handleNavbarScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Initial check


  // ─── ACTIVE NAV LINK HIGHLIGHTING ─────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  function highlightNavLink() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });


  // ─── MOBILE MENU ───────────────────────────────────────────
  const menuToggle   = document.getElementById('menu-toggle');
  const mobileNav    = document.getElementById('mobile-nav');
  const mobileClose  = document.getElementById('mobile-nav-close');
  const mobileLinks  = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta .btn');

  function openMobileMenu() {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileNav.classList.remove('open');
    // Only restore overflow if intro is also hidden
    if (videoIntro.classList.contains('hidden') || videoIntro.style.display === 'none') {
      document.body.style.overflow = '';
    }
  }

  menuToggle.addEventListener('click', openMobileMenu);
  mobileClose.addEventListener('click', closeMobileMenu);

  // Close on backdrop click
  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) closeMobileMenu();
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });


  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top,
          behavior: 'smooth'
        });
      }
    });
  });


  // ─── SCROLL REVEAL ANIMATIONS ─────────────────────────────
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Only animate once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ─── STAT COUNTER ANIMATION ───────────────────────────────
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;

    statNumbers.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 2000; // ms
      const start = performance.now();

      function updateCounter(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        el.textContent = current + (target >= 50 ? '+' : '+');

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });

    statsAnimated = true;
  }

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.unobserve(statsSection);
      }
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }


  // ─── TESTIMONIAL CAROUSEL ─────────────────────────────────
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots  = document.querySelectorAll('.testimonial-dot');
  const prevBtn          = document.getElementById('testimonial-prev');
  const nextBtn          = document.getElementById('testimonial-next');
  let currentTestimonial = 0;
  let autoRotateTimer    = null;

  function showTestimonial(index) {
    // Wrap around
    if (index < 0) index = testimonialCards.length - 1;
    if (index >= testimonialCards.length) index = 0;

    testimonialCards.forEach(card => card.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));

    testimonialCards[index].classList.add('active');
    testimonialDots[index].classList.add('active');

    currentTestimonial = index;
  }

  function nextTestimonial() {
    showTestimonial(currentTestimonial + 1);
  }

  function prevTestimonialFn() {
    showTestimonial(currentTestimonial - 1);
  }

  // Auto-rotate every 5s
  function startAutoRotate() {
    stopAutoRotate();
    autoRotateTimer = setInterval(nextTestimonial, 5000);
  }

  function stopAutoRotate() {
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      prevTestimonialFn();
      startAutoRotate(); // Reset timer on manual interaction
    });

    nextBtn.addEventListener('click', () => {
      nextTestimonial();
      startAutoRotate();
    });
  }

  testimonialDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'), 10);
      showTestimonial(index);
      startAutoRotate();
    });
  });

  // Touch/swipe support for testimonials
  let touchStartX = 0;
  let touchEndX = 0;
  const testimonialWrapper = document.querySelector('.testimonial-wrapper');

  if (testimonialWrapper) {
    testimonialWrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialWrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextTestimonial();
        } else {
          prevTestimonialFn();
        }
        startAutoRotate();
      }
    }, { passive: true });
  }

  startAutoRotate();


  // ─── CONTACT FORM ─────────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  const formStatus  = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = document.getElementById('form-name').value.trim();
      const email   = document.getElementById('form-email').value.trim();
      const service = document.getElementById('form-service').value;
      const message = document.getElementById('form-message').value.trim();

      // Basic validation
      if (!name || !email || !service || !message) {
        formStatus.textContent = 'Please fill in all fields.';
        formStatus.className = 'form-status error';
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formStatus.textContent = 'Please enter a valid email address.';
        formStatus.className = 'form-status error';
        return;
      }

      // Construct mailto link with form data
      const subject = encodeURIComponent(`[Mango Labz Inquiry] ${service} — from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nMessage:\n${message}`
      );

      window.location.href = `mailto:mangolabsyk@gmail.com?subject=${subject}&body=${body}`;

      // Show success message
      formStatus.textContent = '✓ Opening your email client... Thank you for reaching out!';
      formStatus.className = 'form-status success';

      // Reset form after a delay
      setTimeout(() => {
        contactForm.reset();
        formStatus.className = 'form-status';
        formStatus.textContent = '';
      }, 5000);
    });
  }


  // ─── CAREERS FORM ─────────────────────────────────────────
  const careersForm   = document.getElementById('careers-form');
  const careersStatus = document.getElementById('careers-form-status');

  if (careersForm) {
    careersForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name     = document.getElementById('career-name').value.trim();
      const email    = document.getElementById('career-email').value.trim();
      const position = document.getElementById('career-position').value;
      const message  = document.getElementById('career-message').value.trim();

      // Basic validation
      if (!name || !email || !position) {
        careersStatus.textContent = 'Please fill in all required fields.';
        careersStatus.className = 'form-status error';
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        careersStatus.textContent = 'Please enter a valid email address.';
        careersStatus.className = 'form-status error';
        return;
      }

      // Construct mailto link
      const subject = encodeURIComponent(`[Mango Labz Career Application] ${position} — ${name}`);
      const body = encodeURIComponent(
        `Career Application\n\nName: ${name}\nEmail: ${email}\nPosition: ${position}\n\nCover Letter:\n${message || 'N/A'}`
      );

      window.location.href = `mailto:mangolabsyk@gmail.com?subject=${subject}&body=${body}`;

      // Show success message
      careersStatus.textContent = '✓ Opening your email client... Thank you for applying!';
      careersStatus.className = 'form-status success';

      // Reset form
      setTimeout(() => {
        careersForm.reset();
        careersStatus.className = 'form-status';
        careersStatus.textContent = '';
      }, 5000);
    });
  }


  // ─── SERVICE CARDS — SCROLL TO CONTACT ────────────────────
  // Make service cards clickable (scroll to contact)
  document.querySelectorAll('.service-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const offset = navbar.offsetHeight;
        const top = contactSection.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ─── KEYBOARD NAVIGATION ──────────────────────────────────
  // Allow Escape to dismiss video intro
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !videoIntro.classList.contains('hidden')) {
      dismissIntro();
    }
  });

  // Allow Space/Enter to play video when play button is focused
  playBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playBtn.click();
    }
  });

});
