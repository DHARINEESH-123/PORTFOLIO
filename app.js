document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- MOBILE NAVIGATION MENU ---
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinksList = document.querySelectorAll('.nav-links a');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.setAttribute('data-lucide', 'x');
        } else {
          icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons(); // Re-render icon
      }
    });

    // Close menu when clicking a link
    navLinksList.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      }
    });
  }

  // --- NAVBAR SHRINK ON SCROLL ---
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('shrink');
    } else {
      nav.classList.remove('shrink');
    }
  });

  // --- CUSTOM CURSOR (DESKTOP ONLY) ---
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  const interactiveElements = document.querySelectorAll('a, button, .menu-toggle, .nav-logo, .social-circle, [role="button"]');

  const isTouchDevice = () => {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
  };

  if (cursor && ring && !isTouchDevice() && window.innerWidth > 1024) {
    document.body.style.cursor = 'none';

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      
      // Slight delay for the outer ring to create a smooth trailing effect
      ring.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
      }, { duration: 150, fill: 'forwards' });
    });

    // Expand cursor on hover
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('expand');
        ring.classList.add('expand');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('expand');
        ring.classList.remove('expand');
      });
    });
  } else {
    // Clean up nodes if on mobile/touch device
    if (cursor) cursor.style.display = 'none';
    if (ring) ring.style.display = 'none';
    document.body.style.cursor = 'auto';
  }

  // --- BACKGROUND PARTICLES GENERATOR ---
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    const particleCount = window.innerWidth < 768 ? 15 : 30; // Reduce particles on mobile for performance
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 2 + 1; // 1px to 3px
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${8 + Math.random() * 12}s`; // 8s to 20s
      particle.style.animationDelay = `${Math.random() * 10}s`;
      
      particlesContainer.appendChild(particle);
    }
  }

  // --- SCROLL ANIMATIONS (INTERSECTION OBSERVER) ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target); // Stop observing after anim triggers
      }
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll('.skill-card, .skill-category-card, .project-card, .about-grid, .about-list, .stat, .hero-photo-wrap, .timeline-item, .contact-wrap');
  
  elementsToAnimate.forEach(el => {
    el.classList.add('hide-reveal'); // Inject hide class
    observer.observe(el);
  });

  // --- SKILLS PROGRESS BAR ANIMATION ---
  const animateSkills = (categoryCard) => {
    const fills = categoryCard.querySelectorAll('.progress-bar-fill');
    fills.forEach(fill => {
      const targetPercent = fill.getAttribute('data-progress');
      fill.style.width = targetPercent;
    });
  };

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkills(entry.target);
        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.skill-category-card').forEach(card => {
    skillsObserver.observe(card);
  });
});

// CSS Injection for Scroll Animations (keeps CSS clean and modular)
const style = document.createElement('style');
style.textContent = `
  .hide-reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .reveal {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
