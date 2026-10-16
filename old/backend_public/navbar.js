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
    const navSignin = document.getElementById('nav-signin');
    const savedUser = localStorage.getItem('telmy_user');

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user && (user.uid || user.email)) {
          // Hide redundant sign-in / name text to keep navbar clean & elegant
          if (navSignin) {
            navSignin.style.display = 'none';
          }

          // Single, prominent Dashboard action button
          if (navCta) {
            navCta.href = '/dashboard';
            navCta.innerHTML = `👤 Dashboard`;
            navCta.title = `Open Member Dashboard`;
            navCta.classList.add('btn-nav-dashboard');
          }
        }
      } catch (e) {
        // Fallback to guest
      }
    } else {
      if (navSignin) {
        navSignin.style.display = '';
        navSignin.href = '/connect';
        navSignin.textContent = 'Sign In';
      }
      if (navCta) {
        navCta.href = '/download';
        navCta.textContent = 'Add to Chrome (Free)';
        navCta.classList.remove('btn-nav-dashboard');
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
