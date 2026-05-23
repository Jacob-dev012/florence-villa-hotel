const siteHeader = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.nav-link');
const pageLoader = document.getElementById('page-loader');
const toast = document.getElementById('toast');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox?.querySelector('.lightbox-img');
const lightboxCaption = lightbox?.querySelector('.lightbox-caption');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
const filterButtons = document.querySelectorAll('.filter-btn');
const revealElements = document.querySelectorAll('.reveal');

const pageName = document.body.dataset.page || window.location.pathname.split('/').pop().replace('.html', '');



function handleNavScroll() {
  if (window.scrollY > 60) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
}

function closeMobileNav() {
  if (siteNav.classList.contains('open')) {
    siteNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
}

function setActiveNavLink() {
  navLinks.forEach((link) => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href.includes(pageName) || (pageName === 'index' && href.includes('index.html'))) {
      link.classList.add('active');
    }
  });
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 2500);
}

function initMobileMenu() {
  if (!navToggle || !siteNav) return;
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen.toString());
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });
}

function initScrollReveal() {
  if (!revealElements.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initFilterButtons() {
  if (!filterButtons.length) return;
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      const roomGrid = document.getElementById('room-grid');
      const galleryGrid = document.getElementById('gallery-grid');

      if (roomGrid) {
        roomGrid.querySelectorAll('.room-card').forEach((card) => {
          const shouldShow = filter === 'all' || card.classList.contains(`room-${filter}`);
          card.classList.toggle('hidden', !shouldShow);
        });
      }

      if (galleryGrid) {
        galleryGrid.querySelectorAll('.gallery-item').forEach((item) => {
          const shouldShow = filter === 'all' || item.dataset.category === filter;
          item.classList.toggle('hidden', !shouldShow);
        });
      }
    });
  });
}

function initLightbox() {
  const galleryImages = document.querySelectorAll('.gallery-item img, .image-card img, .room-card img, .amenity-card img');
  galleryImages.forEach((img) => {
    img.addEventListener('click', () => {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = img.src;
      lightboxCaption.textContent = img.alt || 'Luxury hotel preview';
      lightbox.classList.add('visible');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('visible');
      lightbox.setAttribute('aria-hidden', 'true');
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        lightbox.classList.remove('visible');
        lightbox.setAttribute('aria-hidden', 'true');
      }
    });
  }
}

function initNewsletterForms() {
  document.querySelectorAll('form[id^="newsletter-form"]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      showToast('Thank you for subscribing!');
      form.reset();
    });
  });
}

function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    showToast('Message sent successfully!');
    contactForm.reset();
  });
}



function initReviewCarousel() {
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.testimonial-card');
  const buttons = document.querySelectorAll('.carousel-btn');
  if (!track || slides.length === 0) return;

  let currentIndex = 0;

  function updateSlides() {
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentIndex);
    });
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const direction = button.dataset.direction;
      if (direction === 'prev') {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      } else {
        currentIndex = (currentIndex + 1) % slides.length;
      }
      updateSlides();
    });
  });

  updateSlides();
}

function initLazyLoad() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if (!lazyImages.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        obs.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => observer.observe(img));
}

function initImageFallbacks() {
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', function () {
      if (this.src && this.src.includes('assets/fallback.jpg')) return;
      this.onerror = null;
      this.src = 'assets/fallback.jpg';
    });
  });
}

function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initPage() {
  setActiveNavLink();
  initMobileMenu();
  handleNavScroll();
  initScrollReveal();
  initFilterButtons();
  initLightbox();
  initNewsletterForms();
  initContactForm();
  initReviewCarousel();
  initLazyLoad();
  initImageFallbacks();
  initSmoothLinks();

  window.addEventListener('scroll', handleNavScroll);

  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    pageLoader?.classList.add('hide');
  });
}

initPage();
