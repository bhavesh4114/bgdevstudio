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

  const initTelegramWidget = () => {
    if (document.getElementById('bgdsChatWidget')) return;

    const USERNAME = 'bgdevstudio_bot';
    const DEFAULT_MSG = 'Hello, I want to build a website.';

    const widget = document.createElement('div');
    widget.className = 'bgds-chat-widget';
    widget.id = 'bgdsChatWidget';
    widget.innerHTML = `
      <section class="bgds-chat-card" id="bgdsCard" aria-hidden="true">
        <header class="bgds-chat-head">
          <div>
            <h3>BG Dev Studio</h3>
            <p>We typically reply instantly 🚀</p>
          </div>
          <button class="bgds-close" id="bgdsClose" aria-label="Close chat" type="button">×</button>
        </header>
        <div class="bgds-chat-body">
          <p>Hi 👋 Welcome to BG Dev Studio!<br>How can we help you today?</p>
        </div>
        <div class="bgds-chat-input-wrap">
          <input class="bgds-chat-input" id="bgdsInput" type="text" placeholder="Type your message..." maxlength="300" />
          <button class="bgds-send" id="bgdsSend" type="button" aria-label="Send to Telegram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21.4 2.6a1.3 1.3 0 0 0-1.4-.2L2.9 9.3a1.3 1.3 0 0 0 .1 2.5l5.5 1.8 1.8 5.5a1.3 1.3 0 0 0 2.5.1l6.9-17.1a1.3 1.3 0 0 0-.3-1.5Z"></path>
            </svg>
          </button>
        </div>
      </section>
      <button class="bgds-fab" id="bgdsFab" aria-label="Open chat" type="button">
        <span class="bgds-fab-ring"></span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.6 3.4a2 2 0 0 0-2.1-.3L3.7 9a2 2 0 0 0 .1 3.8l3.6 1.2 1.2 3.6a2 2 0 0 0 3.8.1l5.9-14.8a2 2 0 0 0-.3-2.1ZM9.3 16.4l-.7-2.1 5.5-5.5-4.8 7.6Z"></path>
        </svg>
      </button>
    `;

    document.body.appendChild(widget);

    const fab = widget.querySelector('#bgdsFab');
    const card = widget.querySelector('#bgdsCard');
    const closeBtn = widget.querySelector('#bgdsClose');
    const input = widget.querySelector('#bgdsInput');
    const sendBtn = widget.querySelector('#bgdsSend');

    if (!fab || !card || !closeBtn || !input || !sendBtn) return;

    const toggleChat = (forceOpen) => {
      const shouldOpen = typeof forceOpen === 'boolean'
        ? forceOpen
        : !card.classList.contains('is-open');

      card.classList.toggle('is-open', shouldOpen);
      card.setAttribute('aria-hidden', String(!shouldOpen));

      if (shouldOpen) {
        window.setTimeout(() => input.focus(), 120);
      }
    };

    const toStartPayload = (message) => {
      const utf8 = unescape(encodeURIComponent(message));
      const b64url = btoa(utf8).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
      return b64url.slice(0, 64);
    };

    const sendToTelegram = () => {
      const raw = (input.value || '').trim();
      const message = raw || DEFAULT_MSG;
      const startPayload = toStartPayload(message);
      const url = `https://t.me/${USERNAME}?start=${encodeURIComponent(startPayload)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    };

    fab.addEventListener('click', () => toggleChat());
    closeBtn.addEventListener('click', () => toggleChat(false));
    sendBtn.addEventListener('click', sendToTelegram);

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') sendToTelegram();
    });

    document.addEventListener('click', (event) => {
      if (!card.classList.contains('is-open')) return;
      if (!widget.contains(event.target)) toggleChat(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && card.classList.contains('is-open')) {
        toggleChat(false);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      mountSharedHeader();
      initSharedLoaderAndCursor();
      initTelegramWidget();
    });
  } else {
    mountSharedHeader();
    initSharedLoaderAndCursor();
    initTelegramWidget();
  }
})();
