// Telmy Highlighter: Injects help badges and manages field focus/highlighting
window.GMTHighlighter = (function () {
  const HIGHLIGHT_CLASS = 'gmt-highlighted-field';
  const BADGE_CLASS = 'gmt-field-badge';

  function attachBadges(scannedFields, onFieldSelect) {
    // Clear any previous badges
    clearBadges();

    scannedFields.forEach((item, index) => {
      const el = item.metadata.element;

      const badge = document.createElement('span');
      badge.className = BADGE_CLASS;
      badge.setAttribute('data-gmt-index', index);
      badge.title = `Kolom #${index + 1}: ${item.metadata.label || 'Buka panduan Telmy.ai'}`;
      badge.textContent = `${index + 1}`;

      // 1. Try placing badge next to question heading in card (Google Forms, Material UI, standard forms)
      let placed = false;
      const card = el.closest ? el.closest('[role="listitem"], .Qr7Oae, .geS5n, .m7zDu, .o3Dpx, .form-group, .form-row, .form-item, fieldset') : null;
      if (card) {
        const heading = card.querySelector('[role="heading"], .M7eMe, .c2nTpf, .HoFDJf, legend, label, .form-label');
        if (heading && !card.querySelector(`.${BADGE_CLASS}`)) {
          heading.appendChild(badge);
          placed = true;
        }
      }

      // 2. Standard label[for="id"]
      if (!placed && el.id) {
        const label = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
        if (label && !label.querySelector(`.${BADGE_CLASS}`)) {
          label.appendChild(badge);
          placed = true;
        }
      }

      // 3. Fallback: parent or adjacent to el
      if (!placed) {
        const parent = el.parentNode;
        if (parent) {
          const siblingLabel = parent.querySelector('label');
          if (siblingLabel && !siblingLabel.querySelector(`.${BADGE_CLASS}`)) {
            siblingLabel.appendChild(badge);
            placed = true;
          } else if (el.insertAdjacentElement) {
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

      // Event listener on element focus and click
      el.addEventListener('focus', () => {
        setActiveField(index, scannedFields, onFieldSelect, false);
      });
      el.addEventListener('click', () => {
        setActiveField(index, scannedFields, onFieldSelect, false);
      });

      // Event listener on card click (e.g. clicking anywhere in question card or radio group in Google Forms)
      if (card) {
        card.addEventListener('click', () => {
          setActiveField(index, scannedFields, onFieldSelect, false);
        });
      }

      // Listen to input changes to update progress bar in real-time
      el.addEventListener('input', () => {
        if (window.GMTPanel && window.GMTPanel.setPageSummary) {
          window.GMTPanel.setPageSummary(null, scannedFields);
        }
      });
      el.addEventListener('change', () => {
        if (window.GMTPanel && window.GMTPanel.setPageSummary) {
          window.GMTPanel.setPageSummary(null, scannedFields);
        }
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
