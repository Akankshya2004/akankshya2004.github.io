const MODES = {
  professional: 'professional',
  fun: 'fun',
  neutral: 'neutral'
};

const MODE_LABELS = {
  neutral: 'Neutral',
  professional: 'Professional',
  fun: 'Fun'
};

const URL_MODE_MAP = {
  pro: MODES.professional,
  professional: MODES.professional,
  fun: MODES.fun
};

function setMode(mode, options = {}) {
  const opts = {
    updateUrl: true,
    animate: true,
    ...options
  };

  if (!Object.values(MODES).includes(mode)) {
    return;
  }

  const body = document.body;
  const hero = document.querySelector('.hero-split');
  const modeValue = document.querySelector('.mode-toggle-value');
  const modeTabs = document.querySelectorAll('[data-mode-tab]');
  const modeLinks = document.querySelectorAll('[data-mode-link]');

  if (opts.animate && hero) {
    hero.classList.add('is-animating');
    setTimeout(() => hero.classList.remove('is-animating'), 720);
  }

  body.dataset.mode = mode;

  if (modeValue) {
    modeValue.textContent = MODE_LABELS[mode] || 'Neutral';
  }

  modeTabs.forEach(tab => {
    const tabMode = tab.getAttribute('data-mode-tab');
    tab.classList.toggle('is-active', tabMode === mode);
  });

  modeLinks.forEach(link => {
    const linkMode = link.getAttribute('data-mode-link');
    link.classList.toggle('is-active', linkMode === mode);
  });

  if (opts.updateUrl) {
    const url = new URL(window.location.href);
    if (mode === MODES.neutral) {
      url.searchParams.delete('mode');
    } else {
      url.searchParams.set('mode', mode === MODES.professional ? 'pro' : 'fun');
    }
    window.history.replaceState({}, '', url.toString());
  }
}

function getInitialMode() {
  const url = new URL(window.location.href);
  const modeParam = url.searchParams.get('mode');
  if (!modeParam) {
    return MODES.neutral;
  }
  return URL_MODE_MAP[modeParam] || MODES.neutral;
}

function setupHeroInteractions() {
  const heroPanes = document.querySelectorAll('[data-mode-target]');
  heroPanes.forEach(pane => {
    pane.addEventListener('click', () => {
      const targetMode = pane.getAttribute('data-mode-target');
      setMode(targetMode, { animate: true });
    });
  });
}

function setupModeToggle() {
  const toggle = document.querySelector('[data-mode-toggle]');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const current = document.body.dataset.mode || MODES.neutral;
    if (current === MODES.neutral) {
      setMode(MODES.professional);
      return;
    }
    setMode(current === MODES.professional ? MODES.fun : MODES.professional);
  });
}

function setupModeTabs() {
  const tabs = document.querySelectorAll('[data-mode-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetMode = tab.getAttribute('data-mode-tab');
      setMode(targetMode);
    });
  });
}

function setupHistoryModal() {
  const modal = document.getElementById('history-modal');
  const openers = document.querySelectorAll('[data-history-open]');
  const closer = document.querySelector('[data-history-close]');

  if (!modal) return;

  const openModal = () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  };

  openers.forEach(btn => btn.addEventListener('click', openModal));
  if (closer) {
    closer.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
}

function setupModeLinkOverrides() {
  const modeLinks = document.querySelectorAll('[data-mode-link]');
  modeLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetMode = link.getAttribute('data-mode-link');
      if (targetMode) {
        setMode(targetMode);
      }
    });
  });
}

function setupEducationTabs() {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.education-content');

  if (!tabs.length || !contents.length) {
    return;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-edu');

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      contents.forEach(content => {
        content.classList.toggle('active', content.id === `${target}-content`);
      });
    });
  });
}

function setupTypingAnimation() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) {
    return;
  }

  const texts = [
    'Showcasing my creative journey',
    'Exploring technology and innovation',
    'Building solutions that matter'
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typingSpeed = 1500;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 1000);
}

function setupContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) {
    return;
  }

  contactForm.addEventListener('submit', function (event) {
    let valid = true;
    const inputs = contactForm.querySelectorAll('input, textarea');

    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = 'red';
      } else {
        input.style.borderColor = '';
      }
    });

    if (!valid) {
      event.preventDefault();
    }
  });
}

function setupNavScrollBehavior() {
  const nav = document.getElementById('floating-nav');
  if (!nav) return;

  nav.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const updateScrolled = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', updateScrolled, { passive: true });
  updateScrolled();

  const sections = document.querySelectorAll('section[id], .container[id]');
  const navLinks = nav.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const matches = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', matches);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));
}

function setupGSAPAnimations() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance — staggered sequence
  const heroTl = gsap.timeline({ delay: 0.25 });
  heroTl
    .from('.image-container',  { opacity: 0, scale: 0.88, duration: 1.0,  ease: 'power3.out' }, 0)
    .from('.name-badge',       { opacity: 0, y: 18,       duration: 0.55, ease: 'power3.out' }, 0.28)
    .from('.hero-name',        { opacity: 0, y: 28,       duration: 0.65, ease: 'power3.out' }, 0.42)
    .from('.hero-subtitle',    { opacity: 0, y: 18,       duration: 0.55, ease: 'power3.out' }, 0.56)
    .from('.hero-cta',         { opacity: 0, y: 16,       duration: 0.5,  ease: 'power3.out' }, 0.68);

  // Section headers scroll reveal
  gsap.utils.toArray('.section-header, .projects-header').forEach(header => {
    gsap.from(header, {
      opacity: 0,
      y: 36,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 86%',
        once: true
      }
    });
  });

  // Education container
  gsap.from('.education-container', {
    opacity: 0,
    y: 32,
    duration: 0.75,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.education-container', start: 'top 82%', once: true }
  });

  // Staggered card batch reveals
  ['.experience-card', '.cert-card', '.achievement-card', '.hobby-card', '.project-card'].forEach(selector => {
    if (!document.querySelector(selector)) return;
    ScrollTrigger.batch(selector, {
      onEnter: (elements) => {
        gsap.from(elements, {
          opacity: 0,
          y: 36,
          duration: 0.65,
          stagger: 0.10,
          ease: 'power3.out',
          clearProps: 'opacity,transform'
        });
      },
      start: 'top 88%',
      once: true
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setMode(getInitialMode(), { updateUrl: false, animate: false });
  setupHeroInteractions();
  setupModeToggle();
  setupModeTabs();
  setupHistoryModal();
  setupModeLinkOverrides();
  setupEducationTabs();
  setupTypingAnimation();
  setupContactForm();
  setupNavScrollBehavior();
  setupGSAPAnimations();
});
