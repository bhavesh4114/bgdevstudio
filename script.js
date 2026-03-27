(() => {
  const HEADER_ROOT_ID = 'site-header-root';
  const FALLBACK_HEADER_HTML = `
<header class="sh-header" id="sharedHeader">
  <div class="sh-inner">
    <a class="sh-logo" href="index.html" aria-label="BG Dev Studio home">BG Dev Studio</a>
    <nav class="sh-nav" id="sharedNavDesktop" aria-label="Primary">
      <a class="sh-link" href="index.html" data-page="index.html">Home</a>
      <a class="sh-link" href="about.html" data-page="about.html">About</a>
      <a class="sh-link" href="service.html" data-page="service.html">Services</a>
      <a class="sh-link" href="portfolio.html" data-page="portfolio.html">Portfolio</a>
      <a class="sh-link" href="contact.html" data-page="contact.html">Contact</a>
    </nav>
    <a class="sh-cta" href="contact.html">Get Free Quote</a>
    <button class="sh-toggle" id="sharedNavToggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="sharedNavMobile">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="sh-mobile-backdrop" id="sharedNavBackdrop" hidden></div>
  <nav class="sh-mobile" id="sharedNavMobile" aria-label="Mobile Navigation" hidden>
    <a class="sh-mobile-link" href="index.html" data-page="index.html">Home</a>
    <a class="sh-mobile-link" href="about.html" data-page="about.html">About</a>
    <a class="sh-mobile-link" href="service.html" data-page="service.html">Services</a>
    <a class="sh-mobile-link" href="portfolio.html" data-page="portfolio.html">Portfolio</a>
    <a class="sh-mobile-link" href="contact.html" data-page="contact.html">Contact</a>
    <a class="sh-cta sh-cta-mobile" href="contact.html">Get Free Quote</a>
  </nav>
</header>`;

  const normalizePage = (value) => {
    if (!value || value === '/') return 'index.html';
    const clean = value.split('#')[0].split('?')[0];
    const parts = clean.split('/').filter(Boolean);
    return parts.length ? parts[parts.length - 1] : 'index.html';
  };

  const setActiveLink = (scope, pageName) => {
    scope.querySelectorAll('[data-page]').forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('data-page') === pageName);
    });
  };

  const setupSmoothScroll = (scope, closeMenu) => {
    scope.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMenu();
      });
    });
  };

  const initHeader = (root) => {
    const toggle = root.querySelector('#sharedNavToggle');
    const mobileMenu = root.querySelector('#sharedNavMobile');
    const backdrop = root.querySelector('#sharedNavBackdrop');

    if (!toggle || !mobileMenu || !backdrop) return;

    const openMenu = () => {
      mobileMenu.hidden = false;
      backdrop.hidden = false;
      requestAnimationFrame(() => {
        mobileMenu.classList.add('is-open');
        backdrop.style.opacity = '1';
      });
      toggle.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('is-open');
      backdrop.style.opacity = '0';
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      window.setTimeout(() => {
        mobileMenu.hidden = true;
        backdrop.hidden = true;
      }, 260);
    };

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      if (expanded) closeMenu();
      else openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    root.querySelectorAll('#sharedNavDesktop .sh-link, #sharedNavMobile .sh-mobile-link, #sharedNavMobile .sh-cta-mobile').forEach((link) => {
      link.addEventListener('click', () => closeMenu());
    });

    const page = normalizePage(window.location.pathname);
    setActiveLink(root, page);
    setupSmoothScroll(root, closeMenu);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  };

  const mountSharedHeader = async () => {
    const root = document.getElementById(HEADER_ROOT_ID);
    if (!root) return;

    const mountAndInit = (html) => {
      root.innerHTML = html;
      document.body.classList.add('has-shared-header');
      initHeader(root);
    };

    try {
      const response = await fetch('header.html', { cache: 'no-store' });
      if (!response.ok) {
        mountAndInit(FALLBACK_HEADER_HTML);
        return;
      }
      mountAndInit(await response.text());
    } catch (error) {
      mountAndInit(FALLBACK_HEADER_HTML);
    }
  };

  const initSharedLoaderAndCursor = () => {
    if (document.getElementById('pageLoader') || document.getElementById('cursorDot') || document.getElementById('cursorRing')) {
      return;
    }

    const loader = document.createElement('div');
    loader.className = 'shared-page-loader';
    loader.innerHTML = '<div class="shared-page-loader-ring"></div>';
    document.body.appendChild(loader);

    const hideLoader = () => {
      loader.classList.add('is-hidden');
      window.setTimeout(() => loader.remove(), 560);
    };

    if (document.readyState === 'complete') {
      window.setTimeout(hideLoader, 260);
    } else {
      window.addEventListener('load', () => window.setTimeout(hideLoader, 260), { once: true });
      window.setTimeout(hideLoader, 2200);
    }

    const cursorEnabled = window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(max-width: 680px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!cursorEnabled) return;

    const dot = document.createElement('div');
    dot.className = 'shared-cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'shared-cursor-ring';
    document.body.append(dot, ring);
    document.body.classList.add('has-shared-cursor');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const moveCursor = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      window.requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', moveCursor);
    window.requestAnimationFrame(animateRing);

    const hoverSelector = 'a, button, [role="button"], input, textarea, select, label, .hover-target';

    document.addEventListener('mouseover', (event) => {
      if (event.target instanceof Element && event.target.closest(hoverSelector)) {
        ring.classList.add('is-active');
      }
    });

    document.addEventListener('mouseout', (event) => {
      if (event.target instanceof Element && event.target.closest(hoverSelector)) {
        ring.classList.remove('is-active');
      }
    });
  };

  const initAgencyChatWidget = () => {
    if (document.getElementById('bgdsChatEmbed')) return;

    const widget = document.createElement('div');
    widget.id = 'bgdsChatEmbed';
    widget.className = 'bgds-chat-embed';
    widget.innerHTML = `
      <iframe
        src="https://unchaste-indignant-conception.ngrok-free.dev/chatbot/cmn8qb8sz0001ebdozunlh1d5"
        width="100%"
        style="height: 100%; min-height: 700px"
        frameborder="0"
        title="BG Dev Studio Chatbot"
        loading="lazy"
      ></iframe>
    `;
    document.body.appendChild(widget);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      mountSharedHeader();
      initSharedLoaderAndCursor();
      initAgencyChatWidget();
    });
  } else {
    mountSharedHeader();
    initSharedLoaderAndCursor();
    initAgencyChatWidget();
  }
})();
