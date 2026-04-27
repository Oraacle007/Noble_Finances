/* ============================================================
   script.js — Noble Finances Shared JavaScript
   This single file handles interactivity for BOTH pages.
   It is linked at the bottom of index.html AND services.html.

   STRUCTURE:
   1. SHARED CODE    — Scroll reveal animation (used on both pages)
   2. LANDING PAGE   — Testimonial switcher (index.html only)
   3. SERVICES PAGE  — Placeholder for future JS (services.html)
   ============================================================ */


/* ============================================================
   SECTION 1 — SHARED CODE
   The scroll reveal animation runs on every page that loads
   this script. It watches for elements with class="reveal"
   and fades them in when they scroll into view.
   ============================================================ */

/* Create an IntersectionObserver to watch multiple elements at once */
var revealObserver = new IntersectionObserver(

  function(entries) {
    /* entries = array of all elements whose visibility just changed */

    entries.forEach(function(entry) {
      /* Loop through each entry to check if it's now on screen */

      if (entry.isIntersecting) {
        /* isIntersecting = true means the element is now visible in the viewport */

        entry.target.classList.add('visible');
        /* Add "visible" class — this triggers the CSS fade-in and rise animation */
        /* CSS definition in index.css / services.css: */
        /* .reveal.visible { opacity: 1; transform: translateY(0); } */

        revealObserver.unobserve(entry.target);
        /* Stop watching this element — animation should only play once */
      }
    });
  },

  { threshold: 0.08 }
  /* threshold: 0.08 means the animation fires when 8% of the element is visible */
  /* Lower threshold = animation starts earlier as you scroll down */
);

/* Find every element on the page with class="reveal" and register it */
document.querySelectorAll('.reveal').forEach(function(el) {
  revealObserver.observe(el);
  /* Registers each .reveal element with the observer */
  /* The observer will now watch all of them and fire the callback above */
});


/* ============================================================
   SECTION 2 — LANDING PAGE CODE (index.html)
   Everything below this comment is for the landing page only.
   On the services page, these elements don't exist, so the
   code does nothing and causes no errors.
   ============================================================ */

/* ---- TESTIMONIAL DATA ---- */
/* An array of objects — each object holds one client's testimonial */
var testimonials = [

  /* Index 0 — Fullstack Developer (shown by default on page load) */
  {
    quote: '"Managing my taxes as a freelancer used to be overwhelming, but Noble Finance made it effortless."',
    name: "Samuel A, Fullstack Developer",
    avatar: "007.jpg"
  },

  /* Index 1 — Data Analyst */
  {
    quote: '"Noble Finance helped me stay organized year-round. No more scrambling at tax season — everything is handled!"',
    name: "Adetola A, Data Analyst",
    avatar: "detola.jpg"
  },

  /* Index 2 — Fashion Designer */
  {
    quote: '"I finally feel in control of my finances. The team at Noble Finance is genuinely incredible."',
    name: "Daniel T, Fashion Designer",
    avatar: "boszman.jpg"
  }

];

/* ---- TESTIMONIAL SWITCHER FUNCTION ---- */
/* Called by onclick="switchTestimonial(this, index)" in index.html */
/* clickedEl = the DOM element the user clicked */
/* index = position in the testimonials array (0, 1, or 2) */
function switchTestimonial(clickedEl, index) {

  /* Step 1 — Remove the "active" highlight from ALL client items */
  document.querySelectorAll('.client-item').forEach(function(item) {
    item.classList.remove('active');
    /* This clears the dark green highlight from every item first */
  });

  /* Step 2 — Add "active" only to the item the user just clicked */
  clickedEl.classList.add('active');
  /* This applies the dark green highlight to the selected client */

  /* Step 3 — Get the matching testimonial from the array using the index */
  var selected = testimonials[index];
  /* testimonials[0] = Graphic Designer, [1] = Photographer, [2] = Stylist */

  /* Step 4 — Update the quote paragraph text */
  document.getElementById('quote-text').textContent = selected.quote;
  /* getElementById finds the <p id="quote-text"> element in index.html */
  /* textContent replaces the visible text with the new quote */

  /* Step 5 — Update the author name text */
  document.getElementById('author-name').textContent = selected.name;

  /* Step 6 — Update the avatar image */
  document.getElementById('author-avatar').src = selected.avatar;
  document.getElementById('author-avatar').alt = selected.name;
  /* getElementById finds <span id="author-name"> and replaces its text */
}


/* ============================================================
   SECTION 3 — SERVICES PAGE CODE (services.html)
   Add any future interactive features for services.html here.
   For example: contact form validation, FAQ accordion, etc.
   Currently no extra JS is needed for the services page.
   ============================================================ */

/* No services-specific JS needed at this time */
/* Future code for services.html goes below this comment */


/* ============================================================
   SECTION 3 — APPOINTMENT PAGE CODE (appointment.html)
   Modal open/close and form submission for the contact modal.
   On other pages these functions exist but never get called.
   ============================================================ */

/* ---- openModal() ---- */
/* Called by onclick="openModal()" on the "Contact Us" button */
function openModal() {

  var overlay = document.getElementById('contactModal');
  /* getElementById finds the modal overlay div by its id */

  overlay.classList.add('open');
  /* Adding "open" class triggers the CSS transition: */
  /* opacity goes from 0 to 1, visibility from hidden to visible */
  /* The modal box also slides up via transform: translateY(30px) -> translateY(0) */

  document.body.style.overflow = 'hidden';
  /* Prevents the page behind from scrolling while the modal is open */
}

/* ---- closeModal() ---- */
/* Called by onclick="closeModal()" on the × close button */
function closeModal() {

  var overlay = document.getElementById('contactModal');
  /* Gets the same overlay element */

  overlay.classList.remove('open');
  /* Removing "open" reverses the CSS transition — modal fades out and slides down */

  document.body.style.overflow = '';
  /* Restores normal page scrolling when modal closes */
}

/* ---- Close modal when clicking outside the box ---- */
/* If user clicks the dark overlay area (not the white box), modal closes */
document.addEventListener('click', function(event) {
  /* Listens for any click anywhere on the document */

  var overlay = document.getElementById('contactModal');
  /* Gets the overlay element */

  if (!overlay) return;
  /* Exits early if the overlay doesn't exist (on other pages) */

  if (event.target === overlay) {
    /* event.target = the element that was actually clicked */
    /* If user clicked the overlay itself (not the box inside it), close */
    closeModal();
  }
});

/* ---- Close modal when pressing Escape key ---- */
document.addEventListener('keydown', function(event) {
  /* Listens for any key press on the document */

  if (event.key === 'Escape') {
    /* Checks if the key pressed was Escape */
    closeModal();
    /* Closes the modal — clean UX for keyboard users */
  }
});

/* ---- submitForm() ---- */
/* Called by onclick="submitForm()" on the "Send Message" button */
function submitForm() {

  var nameInput = document.querySelector('input[type="text"]');
  /* Finds the name input field by its type attribute */

  var emailInput = document.querySelector('input[type="email"]');
  /* Finds the email input field */

  var messageInput = document.querySelector('textarea');
  /* Finds the textarea message field */

  if (!nameInput || !emailInput || !messageInput) return;
  /* Exits if any field is missing — safety check */

  if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
    /* .trim() removes whitespace — checks all three fields have content */

    alert('Please fill in all fields before sending.');
    /* Shows a simple alert if any field is empty */
    return;
    /* Stops the function from continuing */
  }

  /* All fields are filled — show a success message */
  var modalBox = document.querySelector('.modal-box');
  /* Finds the white modal box */

  modalBox.innerHTML = '\
    <div style="text-align:center; padding: 40px 20px;">\
      <div style="font-size: 3rem; margin-bottom: 20px;">✅</div>\
      <h2 style="font-family: Playfair Display, serif; font-size: 1.6rem; color: #2d4a3e; margin-bottom: 12px;">Message Sent!</h2>\
      <p style="font-size: 0.88rem; color: #4a6b5a; line-height: 1.6;">Thank you for reaching out. Our team will get back to you within 24 hours.</p>\
      <button onclick="closeModal()" style="margin-top: 28px; background: #2d4a3e; color: white; border: none; padding: 12px 28px; border-radius: 999px; font-family: DM Sans, sans-serif; font-size: 0.88rem; cursor: pointer;">Close</button>\
    </div>\
  ';
  /* Replaces the modal content with a success confirmation */
  /* Uses inline styles so it works without needing extra CSS classes */

  document.body.style.overflow = 'hidden';
  /* Keeps scroll locked while success message is shown */
}


/* ============================================================
   CONTACT MODAL FUNCTIONS (index.html — "Connect with our experts")
   ============================================================ */

/* Opens the contact details modal */
function openContactModal() {
  var overlay = document.getElementById('contactModal');
  /* Finds the contact modal overlay by its id */

  if (!overlay) return;
  /* Exits safely if the modal doesn't exist on this page */

  overlay.classList.add('open');
  /* Adding "open" triggers the CSS fade-in and slide-up transition */

  document.body.style.overflow = 'hidden';
  /* Locks page scroll while modal is open */
}

/* Closes the contact details modal */
function closeContactModal() {
  var overlay = document.getElementById('contactModal');
  /* Finds the overlay */

  if (!overlay) return;
  /* Exits safely if not found */

  overlay.classList.remove('open');
  /* Removes "open" — CSS transitions reverse, modal fades out */

  document.body.style.overflow = '';
  /* Restores page scroll */
}

/* Handles the contact form submission */
function submitContactForm() {
  var inputs = document.querySelectorAll('#contactModal input, #contactModal textarea');
  /* Gets all input and textarea elements inside the contact modal */

  var allFilled = true;
  /* Flag — will be set to false if any field is empty */

  inputs.forEach(function(input) {
    if (!input.value.trim()) {
      /* .trim() removes whitespace — checks if field is truly empty */
      allFilled = false;
      /* Sets flag to false if any field is empty */
    }
  });

  if (!allFilled) {
    alert('Please fill in all fields before sending.');
    /* Warns user if any field is empty */
    return;
    /* Stops function from continuing */
  }

  /* All fields filled — replace modal content with success message */
  var box = document.querySelector('#contactModal .modal-box');
  /* Finds the white modal box inside the contact modal */

  box.innerHTML = '\
    <div style="text-align:center; padding: 50px 20px;">\
      <div style="font-size: 3rem; margin-bottom: 18px;">✅</div>\
      <h2 style="font-family: Playfair Display, serif; font-size: 1.6rem; color: #2d4a3e; margin-bottom: 10px;">Message Sent!</h2>\
      <p style="font-size: 0.85rem; color: #777; line-height: 1.6; margin-bottom: 28px;">Thank you for reaching out. We\'ll get back to you within 24 hours.</p>\
      <button onclick="closeContactModal()" style="background:#2d4a3e;color:white;border:none;padding:12px 28px;border-radius:999px;font-family:DM Sans,sans-serif;font-size:0.85rem;cursor:pointer;">Close</button>\
    </div>\
  ';
  /* Replaces modal content with a clean success confirmation */
}


/* ============================================================
   CHATROOM MODAL FUNCTIONS (index.html — "Book an appointment")
   ============================================================ */

/* Opens the chatroom modal */
function openChatroomModal() {
  var overlay = document.getElementById('chatroomModal');
  /* Finds the chatroom overlay */

  if (!overlay) return;
  /* Exits safely if not on a page with the chatroom */

  overlay.classList.add('open');
  /* Shows the chatroom with CSS fade-in transition */

  document.body.style.overflow = 'hidden';
  /* Locks background scroll */
}

/* Closes the chatroom modal */
function closeChatroomModal() {
  var overlay = document.getElementById('chatroomModal');
  /* Finds the overlay */

  if (!overlay) return;

  overlay.classList.remove('open');
  /* Hides the chatroom */

  document.body.style.overflow = '';
  /* Restores scroll */
}

/* Sends a user message and generates an expert reply */
function sendChatMessage() {
  var input = document.getElementById('chatroomInput');
  /* Finds the chat input field */

  var message = input.value.trim();
  /* Gets the typed message and removes leading/trailing spaces */

  if (!message) return;
  /* Exits if input is empty — nothing to send */

  var messagesArea = document.getElementById('chatroomMessages');
  /* Finds the scrollable messages container */

  /* ---- Add the user's message bubble ---- */
  var userMsg = document.createElement('div');
  /* Creates a new <div> element for the user message */

  userMsg.className = 'chat-message user-message';
  /* Sets the class — user-message aligns it to the right */

  userMsg.innerHTML = '\
    <div class="chat-bubble user-bubble">' + message + '</div>\
    <span class="chat-time">Just now</span>\
  ';
  /* Adds the bubble and timestamp — message text is inserted safely */

  messagesArea.appendChild(userMsg);
  /* Adds the user message to the messages area */

  input.value = '';
  /* Clears the input field after sending */

  messagesArea.scrollTop = messagesArea.scrollHeight;
  /* Scrolls to the bottom so the new message is always visible */

  /* ---- Generate an expert auto-reply after a short delay ---- */
  setTimeout(function() {
    /* setTimeout delays the reply by 1.2 seconds — feels natural */

    var replies = [
      /* Array of possible expert replies — one is chosen at random */
      "Thanks for reaching out! I'd be happy to help you schedule an appointment. What day works best for you?",
      "Great question! Our team specializes in tax preparation and financial planning. Would you like to book a consultation?",
      "We'd love to help! Our experts are available Monday to Friday, 9am–5pm. Shall I check availability for you?",
      "Absolutely! To get started, could you let me know what service you're interested in — tax filing, bookkeeping, or audit assistance?",
      "Thank you for contacting Noble Finances! We'll make sure you're connected with the right expert. What's your main financial concern today?"
    ];

    var randomReply = replies[Math.floor(Math.random() * replies.length)];
    /* Math.random() picks a random index — Math.floor() rounds it down to a whole number */

    var expertMsg = document.createElement('div');
    /* Creates a new div for the expert's reply */

    expertMsg.className = 'chat-message expert-message';
    /* Left-aligned expert message */

    expertMsg.innerHTML = '\
      <div class="chat-bubble expert-bubble">' + randomReply + '</div>\
      <span class="chat-time">Just now</span>\
    ';
    /* Expert bubble with the random reply */

    messagesArea.appendChild(expertMsg);
    /* Adds expert reply to the messages area */

    messagesArea.scrollTop = messagesArea.scrollHeight;
    /* Scrolls to bottom again so reply is visible */

  }, 1200);
  /* 1200ms = 1.2 second delay before expert reply appears */
}

/* Allows pressing Enter key to send a chat message */
function handleChatKey(event) {
  if (event.key === 'Enter') {
    /* Checks if the pressed key is Enter */
    sendChatMessage();
    /* Sends the message — same as clicking the Send button */
  }
}

/* Close modals when clicking outside them */
document.addEventListener('click', function(event) {
  /* Listens for clicks anywhere on the document */

  var contactOverlay = document.getElementById('contactModal');
  /* Gets contact modal overlay */

  var chatroomOverlay = document.getElementById('chatroomModal');
  /* Gets chatroom overlay */

  if (contactOverlay && event.target === contactOverlay) {
    closeContactModal();
    /* Closes contact modal if user clicked the dark overlay (not the box) */
  }

  if (chatroomOverlay && event.target === chatroomOverlay) {
    closeChatroomModal();
    /* Closes chatroom if user clicked the dark overlay */
  }
});

/* Close modals on Escape key press */
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    /* If Escape is pressed */
    closeContactModal();
    /* Try closing contact modal */
    closeChatroomModal();
    /* Try closing chatroom — both are safe even if modal doesn't exist */
  }
});
