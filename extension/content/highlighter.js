// GMT Highlighter: Injects help badges and manages field focus/highlighting
window.GMTHighlighter = (function () {
  const HIGHLIGHT_CLASS = 'gmt-highlighted-field';
  const BADGE_CLASS = 'gmt-field-badge';

  function attachBadges(scannedFields, onFieldSelect) {
    // Clear any previous badges
    clearBadges();

    scannedFields.forEach((item, index) => {
      const el = item.metadata.element;

      // Add relative positioning to parent if needed or inject inline badge
      const badge = document.createElement('span');
      badge.className = BADGE_CLASS;
      badge.setAttribute('data-gmt-index', index);
      badge.title = 'Buka panduan GMT untuk isian ini';
      badge.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      `;

      // Try placing badge next to label or directly next to input
      let placed = false;
      if (el.id) {
        const label = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
        if (label && !label.querySelector(`.${BADGE_CLASS}`)) {
          label.appendChild(badge);
          placed = true;
        }
      }

      if (!placed) {
        const parent = el.parentNode;
        if (parent) {
          // If input has label sibling inside same container
          const siblingLabel = parent.querySelector('label');
          if (siblingLabel && !siblingLabel.querySelector(`.${BADGE_CLASS}`)) {
            siblingLabel.appendChild(badge);
            placed = true;
          } else {
            // Insert adjacent to input
            el.insertAdjacentElement('afterend', badge);
            placed = true;
          }
        }
      }

      // Event listener on badge click
      badge.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveField(index, scannedFields, onFieldSelect);
      });

      // Event listener on input focus/click
      el.addEventListener('focus', () => {
        setActiveField(index, scannedFields, onFieldSelect, false);
      });
    });
  }

  function setActiveField(index, scannedFields, callback, shouldFocusInput = true) {
    // Remove previous active classes
    document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(el => el.classList.remove(HIGHLIGHT_CLASS));
    document.querySelectorAll(`.${BADGE_CLASS}.gmt-badge-active`).forEach(b => b.classList.remove('gmt-badge-active'));

    const targetItem = scannedFields[index];
    if (!targetItem) return;

    const el = targetItem.metadata.element;
    el.classList.add(HIGHLIGHT_CLASS);

    const badge = document.querySelector(`.${BADGE_CLASS}[data-gmt-index="${index}"]`);
    if (badge) {
      badge.classList.add('gmt-badge-active');
    }

    if (shouldFocusInput && document.activeElement !== el) {
      el.focus();
    }

    if (callback) {
      callback(targetItem, index);
    }
  }

  function clearBadges() {
    document.querySelectorAll(`.${BADGE_CLASS}`).forEach(b => b.remove());
    document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(el => el.classList.remove(HIGHLIGHT_CLASS));
  }

  return {
    attachBadges,
    setActiveField,
    clearBadges
  };
})();
