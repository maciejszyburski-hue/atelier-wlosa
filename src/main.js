// =====================================================
//  ASHINA STUDIO — Main JavaScript
//  1. Matrix Rain (canvas background on hero)
//  2. Typing Text Animation (hero headline)
//  3. Navbar scroll effect
//  4. Scroll-reveal animations
//  5. Mobile menu toggle
//  6. Contact form handler
// =====================================================

import './style.css'

// ── 1. MATRIX RAIN CANVAS ─────────────────────────────────────
// This draws the falling green characters in the hero background.
// Think of it as a digital waterfall of letters and numbers.

const canvas = document.getElementById('matrixCanvas')
const ctx = canvas.getContext('2d')

// Characters to use — mix of numbers and letters like the logo
const matrixChars = '01アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

let columns = []
const FONT_SIZE = 16
const FALL_SPEED = 0.55     // lower = slower / more subtle
const OPACITY   = 1.0       // character brightness

function initMatrix() {
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight  // fixed canvas always matches screen size

  const numColumns = Math.floor(canvas.width / FONT_SIZE)

  // Each column tracks how far down it has fallen
  columns = Array.from({ length: numColumns }, () =>
    Math.random() * -(canvas.height / FONT_SIZE)
  )
}

function drawMatrix() {
  // Fade the canvas slightly — this creates the trailing effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.035)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.font = `${FONT_SIZE}px "Courier New", monospace`

  columns.forEach((y, i) => {
    // Pick a random character
    const char = matrixChars[Math.floor(Math.random() * matrixChars.length)]
    const x = i * FONT_SIZE

    // Top character is brighter (white-gold), the rest are green
    const isHead = y > 0 && Math.random() > 0.95
    if (isHead) {
      ctx.fillStyle = `rgba(255, 220, 100, ${OPACITY})`  // gold flash
    } else {
      ctx.fillStyle = `rgba(0, 255, 65, ${OPACITY * 0.9})`  // matrix green
    }

    ctx.fillText(char, x, y * FONT_SIZE)

    // Reset column to top (with randomness so it looks natural)
    if (y * FONT_SIZE > canvas.height && Math.random() > 0.975) {
      columns[i] = 0
    }
    columns[i] += FALL_SPEED
  })
}

initMatrix()
window.addEventListener('resize', initMatrix)
// Run the animation loop — requestAnimationFrame means it runs ~60 times/sec
setInterval(drawMatrix, 40)


// ── 2. TYPING TEXT ANIMATION ──────────────────────────────────
// Cycles through phrases in the hero headline, typing them out one letter at a time.

const typedEl = document.getElementById('typedText')
const phrases  = [
  'Które Przynoszą Wyniki.',
  'Które Zdobywają Klientów.',
  'Które Robią Wrażenie.',
  'Które Działają 24/7.',
  'Które Wyróżniają Się.',
]

let phraseIndex = 0
let charIndex   = 0
let isDeleting  = false

function typeLoop() {
  const currentPhrase = phrases[phraseIndex]

  if (!isDeleting) {
    // Add one character
    typedEl.textContent = currentPhrase.slice(0, charIndex + 1)
    charIndex++

    if (charIndex === currentPhrase.length) {
      // Finished typing — wait 2 seconds then start deleting
      isDeleting = true
      setTimeout(typeLoop, 2000)
      return
    }
    setTimeout(typeLoop, 60)  // typing speed

  } else {
    // Remove one character
    typedEl.textContent = currentPhrase.slice(0, charIndex - 1)
    charIndex--

    if (charIndex === 0) {
      // Finished deleting — move to next phrase
      isDeleting = false
      phraseIndex = (phraseIndex + 1) % phrases.length
    }
    setTimeout(typeLoop, 30)  // deleting speed (faster)
  }
}

// Start typing after a short delay so the page loads first
setTimeout(typeLoop, 800)


// ── 3. NAVBAR SCROLL EFFECT ───────────────────────────────────
// Adds a dark blurred background to the navbar when you scroll down.

const navbar = document.getElementById('navbar')

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled')
  } else {
    navbar.classList.remove('scrolled')
  }
}, { passive: true })


// ── 4. SCROLL REVEAL ANIMATIONS ──────────────────────────────
// As you scroll down, elements fade in smoothly.
// IntersectionObserver watches when an element enters the screen.

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Small stagger delay so cards appear one after another
        const delay = entry.target.dataset.delay || 0
        setTimeout(() => {
          entry.target.classList.add('visible')
        }, delay * 100)
        revealObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.12 }
)

// Add stagger delays to grid items
document.querySelectorAll('.service-card').forEach((el, i) => {
  el.dataset.delay = i
})
document.querySelectorAll('.work-card').forEach((el, i) => {
  el.dataset.delay = i
})
document.querySelectorAll('.stat-item').forEach((el, i) => {
  el.dataset.delay = i
})

// Observe all elements with the .reveal class
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el))


// ── 5. MOBILE MENU TOGGLE ─────────────────────────────────────
// Opens and closes the menu on mobile when the ☰ button is tapped.

const navToggle = document.getElementById('navToggle')
const navMobile = document.getElementById('navMobile')

navToggle.addEventListener('click', () => {
  navMobile.classList.toggle('open')
})

// Close the mobile menu when any link inside it is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open')
  })
})


// ── 6. FLATPICKR CALENDAR ─────────────────────────────────────
// Replaces the plain date input with a beautiful clickable calendar.

flatpickr('#date', {
  minDate: 'today',          // can't book dates in the past
  dateFormat: 'd M Y',       // shows like: 25 Mar 2026
  disableMobile: true,       // use our custom calendar on phones too
  theme: 'dark',
})


// ── 7. CONTACT FORM + EMAILJS ─────────────────────────────────
// Sends a real email when the form is submitted.

// Initialise EmailJS — this must run before any send call
window.emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY)

const form        = document.getElementById('appointmentForm')
const btnText     = document.getElementById('btnText')
const formSuccess = document.getElementById('formSuccess')

form.addEventListener('submit', async (e) => {
  e.preventDefault()  // stop the page from refreshing

  // Check hCaptcha is completed — blocks bots from submitting
  const captchaResponse = window.hcaptcha.getResponse()
  if (!captchaResponse) {
    alert('Najpierw potwierdź, że nie jesteś robotem.')
    return
  }

  // Show loading state on the button
  btnText.textContent = 'Wysyłanie...'
  form.querySelector('button[type="submit"]').disabled = true

  try {
    // Collect all form field values manually for reliability
    const templateParams = {
      name:     document.getElementById('name').value,
      email:    document.getElementById('email').value,
      phone:    document.getElementById('phone').value,
      business: document.getElementById('business').value,
      date:     document.getElementById('date').value,
      message:  document.getElementById('message').value,
      reply_to: document.getElementById('email').value,
    }

    // Send the email via EmailJS
    await window.emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    )

    // Success — show the confirmation message
    btnText.textContent = 'Wyślij wiadomość'
    form.querySelector('button[type="submit"]').disabled = false
    formSuccess.classList.remove('hidden')
    form.reset()
    window.hcaptcha.reset()  // reset the captcha so it can be used again

    // Hide the success message after 6 seconds
    setTimeout(() => formSuccess.classList.add('hidden'), 6000)

  } catch (error) {
    // Something went wrong — log the exact error so we can debug it
    btnText.textContent = 'Wyślij wiadomość'
    form.querySelector('button[type="submit"]').disabled = false
    alert('Coś poszło nie tak. Spróbuj ponownie.')
    console.error('EmailJS error:', error)
  }
})

// ── 7. FAQ ACCORDION ──────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true'
    // close all
    document.querySelectorAll('.faq-question').forEach(b => {
      b.setAttribute('aria-expanded', 'false')
      b.nextElementSibling.classList.remove('open')
    })
    // open clicked unless it was already open
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true')
      btn.nextElementSibling.classList.add('open')
    }
  })
})
