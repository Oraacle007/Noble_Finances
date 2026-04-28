/* ============================================================
   script.js — Noble Finances
   Handles all interactivity across index.html, services.html,
   appointment.html, and connect.html in one clean file.

   SECTIONS:
   1. Scroll Reveal Animation
   2. Testimonial Switcher (index.html)
   3. Contact Modal (index.html + appointment.html)
   4. Chatroom Modal — AI-powered (index.html + services.html)
   5. Global Keyboard & Overlay-click handlers
   ============================================================ */


/* ============================================================
   0. HAMBURGER MENU
   Handles mobile nav drawer open/close across all pages.
   ============================================================ */
(function setupHamburger() {
  /* Inject the dim overlay div once */
  var overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.id = 'navOverlay';
  overlay.addEventListener('click', closeNav);
  document.body.appendChild(overlay);
})();

function toggleNav() {
  var menu    = document.getElementById('navMenu');
  var btn     = document.getElementById('hamburgerBtn');
  var overlay = document.getElementById('navOverlay');
  if (!menu) return;

  var isOpen = menu.classList.contains('open');
  if (isOpen) {
    menu.classList.remove('open');
    btn.classList.remove('open');
    overlay.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  } else {
    menu.classList.add('open');
    btn.classList.add('open');
    overlay.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
}

function closeNav() {
  var menu    = document.getElementById('navMenu');
  var btn     = document.getElementById('hamburgerBtn');
  var overlay = document.getElementById('navOverlay');
  if (!menu) return;
  menu.classList.remove('open');
  if (btn) { btn.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}


/* ============================================================
   1. SCROLL REVEAL
   Fades in any element with class="reveal" as it enters view.
   ============================================================ */
var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(function(el) {
  revealObserver.observe(el);
});


/* ============================================================
   2. TESTIMONIAL SWITCHER (index.html)
   ============================================================ */
var testimonials = [
  {
    quote: '"Managing my taxes as a freelancer used to be overwhelming, but Noble Finance made it effortless."',
    name: 'Samuel A, Fullstack Developer',
    avatar: '007.jpg'
  },
  {
    quote: '"Noble Finance helped me stay organised year-round. No more scrambling at tax season — everything is handled!"',
    name: 'Adetola A, Data Analyst',
    avatar: 'detola.jpg'
  },
  {
    quote: '"I finally feel in control of my finances. The team at Noble Finance is genuinely incredible."',
    name: 'Daniel T, Fashion Designer',
    avatar: 'boszman.jpg'
  }
];

function switchTestimonial(clickedEl, index) {
  document.querySelectorAll('.client-item').forEach(function(item) {
    item.classList.remove('active');
  });
  clickedEl.classList.add('active');

  var selected = testimonials[index];
  var quoteEl   = document.getElementById('quote-text');
  var nameEl    = document.getElementById('author-name');
  var avatarEl  = document.getElementById('author-avatar');

  if (quoteEl)  quoteEl.textContent  = selected.quote;
  if (nameEl)   nameEl.textContent   = selected.name;
  if (avatarEl) { avatarEl.src = selected.avatar; avatarEl.alt = selected.name; }
}


/* ============================================================
   3. CONTACT MODAL
   Used by "Connect with our experts" buttons on index.html.
   The appointment.html page uses openModal() / closeModal()
   which alias these same functions below.
   ============================================================ */
function openContactModal() {
  var overlay = document.getElementById('contactModal');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeContactModal() {
  var overlay = document.getElementById('contactModal');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* Aliases — appointment.html uses openBookingModal() for the form.
   openModal / closeModal kept for any legacy calls to the contact modal. */
function openModal()  { openContactModal(); }
function closeModal() { closeContactModal(); }

function submitContactForm() {
  var inputs = document.querySelectorAll('#contactModal .modal-input, #contactModal input, #contactModal textarea');
  var allFilled = true;
  inputs.forEach(function(input) {
    if (!input.value.trim()) allFilled = false;
  });

  if (!allFilled) {
    showModalError('contactModal', 'Please fill in all fields before sending.');
    return;
  }

  var box = document.querySelector('#contactModal .modal-box');
  if (!box) return;
  box.innerHTML = successHTML(closeContactModal.name);
}

/* Alias for appointment.html's submitForm() call */
function submitForm() { submitContactForm(); }

function successHTML(closeFnName) {
  return '<div style="text-align:center;padding:50px 24px;">' +
    '<div style="font-size:3rem;margin-bottom:16px;">✅</div>' +
    '<h2 style="font-family:\'Playfair Display\',serif;font-size:1.6rem;color:#2d4a3e;margin-bottom:10px;">Message Sent!</h2>' +
    '<p style="font-size:0.88rem;color:#777;line-height:1.6;margin-bottom:28px;">Thank you for reaching out. Our team will get back to you within 24 hours.</p>' +
    '<button onclick="closeContactModal()" style="background:#2d4a3e;color:#fff;border:none;padding:12px 28px;border-radius:999px;font-family:\'DM Sans\',sans-serif;font-size:0.88rem;cursor:pointer;">Close</button>' +
    '</div>';
}

function showModalError(modalId, message) {
  var modal = document.getElementById(modalId);
  if (!modal) return;
  var existing = modal.querySelector('.modal-error-msg');
  if (existing) existing.remove();
  var err = document.createElement('p');
  err.className = 'modal-error-msg';
  err.style.cssText = 'color:#c0392b;font-size:0.82rem;margin-top:8px;text-align:center;';
  err.textContent = message;
  var submitBtn = modal.querySelector('.modal-submit');
  if (submitBtn) submitBtn.parentNode.insertBefore(err, submitBtn);
}


/* ============================================================
   4. AI-POWERED CHATROOM MODAL
   Calls the Anthropic API to give intelligent answers about
   Noble Finances services, pricing, and appointments.
   ============================================================ */

/* Conversation history — keeps context across turns */
var chatHistory = [];

/* Whether the AI is currently typing */
var chatBusy = false;

var NOBLE_SYSTEM_PROMPT = [
  'You are a friendly and knowledgeable financial advisor assistant for Noble Finances, a trusted accounting firm serving individuals and small businesses since 1987.',
  '',
  'Key facts about Noble Finances:',
  '- Services: Tax Preparation & Filing, IRS Audit Assistance, Bookkeeping & Accounting',
  '- Operating since 1987',
  '- Based in Ijebu-Imusin, Ogun State, Nigeria (Block 7, Plot 12, Odolameso Lay-Out)',
  '- Phone: +234 813 759 2363',
  '- Email: abiola.adeeko17@gmail.com',
  '- Office hours: Monday–Friday, 9 am–5 pm',
  '- Clients include freelancers, families, and small businesses',
  '',
  'When users ask to book an appointment, collect: their name, preferred date/time, and the service they need. Then confirm the details warmly.',
  'Keep responses concise (2–4 sentences max), warm, and professional.',
  'If asked something outside finance/appointments, gently redirect back to how Noble Finances can help.',
  'Do not make up fees or specific tax figures — encourage them to call or email for a personalised quote.'
].join('\n');

function openChatroomModal() {
  var overlay = document.getElementById('chatroomModal');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  /* Focus the input for immediate typing */
  setTimeout(function() {
    var input = document.getElementById('chatroomInput');
    if (input) input.focus();
  }, 350);
}

function closeChatroomModal() {
  var overlay = document.getElementById('chatroomModal');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function handleChatKey(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendChatMessage();
  }
}

function sendChatMessage() {
  if (chatBusy) return;

  var input = document.getElementById('chatroomInput');
  var message = input ? input.value.trim() : '';
  if (!message) return;

  input.value = '';

  /* Append user bubble */
  appendBubble(message, 'user');

  /* Add to history */
  chatHistory.push({ role: 'user', content: message });

  /* Show typing indicator */
  var typingId = showTypingIndicator();
  chatBusy = true;
  setSendBtnState(true);

  /* Call the Anthropic API */
  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: NOBLE_SYSTEM_PROMPT,
      messages: chatHistory
    })
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    removeTypingIndicator(typingId);
    chatBusy = false;
    setSendBtnState(false);

    var replyText = '';
    if (data && data.content && data.content.length > 0) {
      data.content.forEach(function(block) {
        if (block.type === 'text') replyText += block.text;
      });
    } else if (data && data.error) {
      replyText = 'I\'m having a little trouble connecting right now. Please call us at +234 813 759 2363 or email abiola.adeeko17@gmail.com and we\'ll get back to you quickly!';
    }

    if (replyText) {
      chatHistory.push({ role: 'assistant', content: replyText });
      appendBubble(replyText, 'expert');
    }
  })
  .catch(function() {
    removeTypingIndicator(typingId);
    chatBusy = false;
    setSendBtnState(false);
    var fallback = 'I\'m having a little trouble connecting right now. Please call us at +234 813 759 2363 or email abiola.adeeko17@gmail.com and we\'ll get back to you quickly!';
    chatHistory.push({ role: 'assistant', content: fallback });
    appendBubble(fallback, 'expert');
  });
}

function appendBubble(text, sender) {
  var area = document.getElementById('chatroomMessages');
  if (!area) return;

  var isExpert = sender === 'expert';
  var wrapper = document.createElement('div');
  wrapper.className = 'chat-message ' + (isExpert ? 'expert-message' : 'user-message');

  var now = new Date();
  var time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  wrapper.innerHTML =
    '<div class="chat-bubble ' + (isExpert ? 'expert-bubble' : 'user-bubble') + '">' +
      escapeHTML(text) +
    '</div>' +
    '<span class="chat-time">' + time + '</span>';

  area.appendChild(wrapper);
  area.scrollTop = area.scrollHeight;
}

function showTypingIndicator() {
  var area = document.getElementById('chatroomMessages');
  if (!area) return null;

  var id = 'typing-' + Date.now();
  var wrapper = document.createElement('div');
  wrapper.className = 'chat-message expert-message';
  wrapper.id = id;
  wrapper.innerHTML =
    '<div class="chat-bubble expert-bubble typing-bubble">' +
      '<span class="typing-dot"></span>' +
      '<span class="typing-dot"></span>' +
      '<span class="typing-dot"></span>' +
    '</div>';

  area.appendChild(wrapper);
  area.scrollTop = area.scrollHeight;
  return id;
}

function removeTypingIndicator(id) {
  if (!id) return;
  var el = document.getElementById(id);
  if (el) el.remove();
}

function setSendBtnState(disabled) {
  var btn = document.querySelector('.chatroom-send-btn');
  if (!btn) return;
  btn.disabled = disabled;
  btn.style.opacity = disabled ? '0.5' : '1';
  btn.style.cursor  = disabled ? 'not-allowed' : 'pointer';
}

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    /* Convert line breaks to <br> so multi-line AI responses render well */
    .replace(/\n/g, '<br>');
}


/* ============================================================
   5. GLOBAL HANDLERS
   Keyboard (Escape) and overlay-click close all modals.
   Single listeners — no duplicates.
   ============================================================ */
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  closeContactModal();
  closeChatroomModal();
  /* Close booking modal if it exists (appointment.html) */
  var bookingOverlay = document.getElementById('bookingModal');
  if (bookingOverlay && bookingOverlay.classList.contains('open')) {
    bookingOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
});

document.addEventListener('click', function(e) {
  var contactOverlay  = document.getElementById('contactModal');
  var chatroomOverlay = document.getElementById('chatroomModal');
  var bookingOverlay  = document.getElementById('bookingModal');

  if (contactOverlay  && e.target === contactOverlay)  closeContactModal();
  if (chatroomOverlay && e.target === chatroomOverlay) closeChatroomModal();
  /* bookingModal overlay-click is handled inline in appointment.html */
});


/* ============================================================
   6. TYPING INDICATOR STYLES (injected at runtime)
   Keeps the CSS file clean — these are chatroom-specific
   micro-animation styles.
   ============================================================ */
(function injectTypingStyles() {
  var style = document.createElement('style');
  style.textContent = [
    '.typing-bubble { display:flex; align-items:center; gap:5px; padding:12px 16px; min-width:56px; }',
    '.typing-dot {',
    '  width:8px; height:8px; border-radius:50%;',
    '  background:rgba(45,74,62,0.4);',
    '  animation: typingBounce 1.2s ease-in-out infinite;',
    '}',
    '.typing-dot:nth-child(2) { animation-delay:0.2s; }',
    '.typing-dot:nth-child(3) { animation-delay:0.4s; }',
    '@keyframes typingBounce {',
    '  0%,60%,100% { transform:translateY(0); opacity:0.4; }',
    '  30% { transform:translateY(-6px); opacity:1; }',
    '}'
  ].join('\n');
  document.head.appendChild(style);
})();
