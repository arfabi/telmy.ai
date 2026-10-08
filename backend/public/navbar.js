/**
 * Telmy.ai — Unified Navigation Controller (Menu Utama)
 * Ensures 100% consistent navigation across all public pages:
 * - Home (/)
 * - Live Demo (/demo)
 * - Download (/download)
 * - Privacy Policy (/privacy)
 */

(function () {
  'use strict';

  function initPublicNavbar() {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.getElementById('nav-mobile-toggle');
    const navLinks = document.getElementById('nav-menu') || document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
        mobileToggle.classList.toggle('active');
      });

      // Close mobile menu on link click
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('mobile-open');
          mobileToggle.classList.remove('active');
        });
      });
    }

    // 2. Language Selector Sync
    const langSelect = document.getElementById('landing-lang-select');
    if (langSelect) {
      const savedLang = localStorage.getItem('telmy_landing_lang') || 'en';
      langSelect.value = savedLang;

      langSelect.addEventListener('change', (e) => {
        const newLang = e.target.value;
        localStorage.setItem('telmy_landing_lang', newLang);
        if (typeof window.setLandingLanguage === 'function') {
          window.setLandingLanguage(newLang);
        }
      });
    }

    // 3. Dynamic Authentication State Detection (Menu Utama -> Dashboard Link)
    const navCta = document.getElementById('nav-cta');
    const savedUser = localStorage.getItem('telmy_user');

    if (savedUser && navCta) {
      try {
        const user = JSON.parse(savedUser);
        const displayName = user.displayName || user.name || 'User';
        navCta.href = '/dashboard';
        navCta.innerHTML = `👤 Dashboard`;
        navCta.title = `Logged in as ${displayName} — Open Dashboard`;
        navCta.classList.add('btn-nav-dashboard');
      } catch (e) {
        // Fallback to standard guest CTA
      }
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPublicNavbar);
  } else {
    initPublicNavbar();
  }
})();
