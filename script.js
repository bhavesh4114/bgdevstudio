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
    if (document.getElementById('bgdsChatWidget')) return;

    const WHATSAPP_NUMBER = '919978449457';
    const WHATSAPP_PREFILL = 'Hello, I want to know more about your services.';
    const DEFAULT_FALLBACK = 'Please contact us on WhatsApp for more details.';
    const WELCOME_MESSAGE = 'Hi 👋 Welcome to BG Dev Studio! Ask anything about websites or apps.';

    const qaRules = [
      { keywords: ['price', 'cost', 'budget', 'fees'], answer: 'Website starts from ₹5,000 depending on features.' },
      { keywords: ['time', 'timeline', 'how long', 'delivery'], answer: 'It usually takes 5–10 days to complete a website.' },
      { keywords: ['services', 'service', 'offer'], answer: 'We provide website, app, and custom software development.' },
      { keywords: ['contact', 'call', 'reach'], answer: 'You can connect with us on WhatsApp for quick response.' },
      { keywords: ['portfolio', 'work', 'projects'], answer: 'We have built multiple modern business websites.' },
      { keywords: ['hosting', 'domain', 'server'], answer: 'We also provide hosting and domain setup.' },
      { keywords: ['payment', 'upi', 'bank'], answer: 'We accept UPI, bank transfer, and online payments.' },
      { keywords: ['support', 'help', 'after delivery'], answer: 'We provide full support after delivery.' },
      { keywords: ['design', 'ui', 'ux'], answer: 'We create modern, responsive UI/UX designs.' },
      { keywords: ['seo', 'ranking', 'google'], answer: 'Basic SEO is included in all websites.' },
      { keywords: ['maintenance', 'maintain', 'monthly'], answer: 'We offer monthly maintenance services.' },
      { keywords: ['mobile', 'responsive', 'phone'], answer: 'All websites are mobile responsive.' },
      { keywords: ['custom', 'feature', 'integration'], answer: 'We build custom features as per your needs.' },
      { keywords: ['ecommerce', 'store', 'shop', 'payment gateway'], answer: 'We build online stores with payment integration.' },
      { keywords: ['app', 'android', 'ios'], answer: 'Yes, we also build custom mobile apps for business needs.' }
    ];

    const widget = document.createElement('div');
    widget.className = 'bgds-chat-widget';
    widget.id = 'bgdsChatWidget';
    widget.innerHTML = `
      <section class="bgds-chat-card" id="bgdsCard" aria-hidden="true">
        <header class="bgds-chat-head">
          <div>
            <h3>BG Dev Studio</h3>
            <p>Quick Help Assistant</p>
          </div>
          <button class="bgds-close" id="bgdsClose" aria-label="Close chat" type="button">×</button>
        </header>
        <div class="bgds-chat-body" id="bgdsChatBody"></div>
        <div class="bgds-chat-whatsapp-wrap" id="bgdsWhatsWrap">
          <a class="bgds-wa-btn" id="bgdsWhatsBtn" target="_blank" rel="noopener noreferrer" href="#">
            Chat on WhatsApp
          </a>
        </div>
        <div class="bgds-chat-input-wrap">
          <input class="bgds-chat-input" id="bgdsInput" type="text" placeholder="Type your message..." maxlength="300" />
          <button class="bgds-send" id="bgdsSend" type="button" aria-label="Send message">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21.4 2.6a1.3 1.3 0 0 0-1.4-.2L2.9 9.3a1.3 1.3 0 0 0 .1 2.5l5.5 1.8 1.8 5.5a1.3 1.3 0 0 0 2.5.1l6.9-17.1a1.3 1.3 0 0 0-.3-1.5Z"></path>
            </svg>
          </button>
        </div>
      </section>
      <button class="bgds-fab" id="bgdsFab" aria-label="Open chat" type="button">
        <span class="bgds-fab-ring"></span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <g fill="#ffffff">
            <rect x="5.3" y="4.6" width="13.4" height="8.9" rx="4.2"></rect>
            <rect x="7.3" y="14.3" width="9.4" height="5.6" rx="2.8"></rect>
            <rect x="9.2" y="2.5" width="1.4" height="2.2" rx="0.7"></rect>
            <rect x="13.4" y="2.5" width="1.4" height="2.2" rx="0.7"></rect>
          </g>
          <circle cx="10" cy="9.1" r="1.05" fill="#1b6dff"></circle>
          <circle cx="14" cy="9.1" r="1.05" fill="#1b6dff"></circle>
          <rect x="10.5" y="11.1" width="3" height="0.95" rx="0.45" fill="#1b6dff"></rect>
        </svg>
      </button>
    `;

    document.body.appendChild(widget);

    const fab = widget.querySelector('#bgdsFab');
    const card = widget.querySelector('#bgdsCard');
    const closeBtn = widget.querySelector('#bgdsClose');
    const input = widget.querySelector('#bgdsInput');
    const sendBtn = widget.querySelector('#bgdsSend');
    const chatBody = widget.querySelector('#bgdsChatBody');
    const whatsBtn = widget.querySelector('#bgdsWhatsBtn');
    const whatsWrap = widget.querySelector('#bgdsWhatsWrap');

    if (!fab || !card || !closeBtn || !input || !sendBtn || !chatBody || !whatsBtn || !whatsWrap) return;

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

    const appendMessage = (text, from) => {
      const msg = document.createElement('div');
      msg.className = `bgds-msg ${from === 'user' ? 'is-user' : 'is-bot'}`;
      msg.textContent = text;
      chatBody.appendChild(msg);
      chatBody.scrollTop = chatBody.scrollHeight;
    };

    const appendTypingMessage = () => {
      const typing = document.createElement('div');
      typing.className = 'bgds-msg is-bot is-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      chatBody.appendChild(typing);
      chatBody.scrollTop = chatBody.scrollHeight;
      return typing;
    };

    const findReply = (question) => {
      const lower = question.toLowerCase();
      for (const rule of qaRules) {
        if (rule.keywords.some((keyword) => lower.includes(keyword))) {
          return rule.answer;
        }
      }
      return DEFAULT_FALLBACK;
    };

    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`;
    whatsBtn.href = whatsappLink;

    const showWhatsAppCTA = () => {
      whatsWrap.classList.add('is-visible');
    };

    const handleSend = () => {
      const userText = (input.value || '').trim();
      if (!userText) return;

      appendMessage(userText, 'user');
      input.value = '';

      const answer = findReply(userText);
      const typingNode = appendTypingMessage();
      const replyDelay = 2000 + Math.floor(Math.random() * 1000);

      window.setTimeout(() => {
        typingNode.remove();
        appendMessage(answer, 'bot');
        showWhatsAppCTA();
      }, replyDelay);
    };

    appendMessage(WELCOME_MESSAGE, 'bot');
    showWhatsAppCTA();

    fab.addEventListener('click', () => toggleChat());
    closeBtn.addEventListener('click', () => toggleChat(false));
    sendBtn.addEventListener('click', handleSend);

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') handleSend();
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
      initAgencyChatWidget();
    });
  } else {
    mountSharedHeader();
    initSharedLoaderAndCursor();
    initAgencyChatWidget();
  }
})();
