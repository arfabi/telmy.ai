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

      // Listen to input changes
      el.addEventListener('input', () => {});
      el.addEventListener('change', () => {});
    });
  }

  let lastActiveIndex = -1;
  let lastActiveTimestamp = 0;

  function setActiveField(index, scannedFields, callback, shouldFocusInput = true) {
    const targetItem = scannedFields[index];
    if (!targetItem) return;

    const el = targetItem.metadata.element;

    // Remove previous active classes
    document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(e => {
      if (e !== el) e.classList.remove(HIGHLIGHT_CLASS);
    });
    document.querySelectorAll(`.${BADGE_CLASS}.gmt-badge-active`).forEach(b => b.classList.remove('gmt-badge-active'));

    el.classList.add(HIGHLIGHT_CLASS);

    // Plan V7: Move Form Spotlight if enabled
    if (window.TelmyA11y && typeof window.TelmyA11y.onFieldActive === 'function') {
      window.TelmyA11y.onFieldActive(el);
    }

    const badge = document.querySelector(`.${BADGE_CLASS}[data-gmt-index="${index}"]`);
    if (badge) {
      badge.classList.add('gmt-badge-active');
    }

    if (shouldFocusInput && document.activeElement !== el) {
      el.focus();
    }

    // Deduplicate rapid focus/click events within 350ms for the same field
    const now = Date.now();
    if (callback) {
      if (index === lastActiveIndex && (now - lastActiveTimestamp < 350)) {
        return; // Skip duplicate trigger
      }
      lastActiveIndex = index;
      lastActiveTimestamp = now;
      callback(targetItem, index);
    }
  }

  let currentActionBeacon = null;
  let currentActionTarget = null;
  let currentVirtualPointer = null;
  let actionHighlightTimeout = null;
  let actionRepositionCleanup = null;

  // Helper: Find closest scrollable parent (for modal, dashboard containers with overflow-y)
  function findScrollableParent(el) {
    if (!el || !el.parentElement) return window;
    let parent = el.parentElement;
    while (parent && parent !== document.body && parent !== document.documentElement) {
      const style = window.getComputedStyle(parent);
      const overflowY = style.overflowY || '';
      const overflowX = style.overflowX || '';
      const isScrollable = /(auto|scroll)/.test(overflowY) || /(auto|scroll)/.test(overflowX);
      if (isScrollable && (parent.scrollHeight > parent.clientHeight || parent.scrollWidth > parent.clientWidth)) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return window;
  }

  function scrollElementIntoViewSafe(el) {
    if (!el) return;
    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    } catch (e) {
      try { el.scrollIntoView(true); } catch (_) {}
    }
  }

  function updateActionVisualsPosition() {
    if (!currentActionTarget || !currentActionTarget.isConnected) {
      clearActionButtonHighlight();
      return;
    }

    const rect = currentActionTarget.getBoundingClientRect();
    
    // Check if element is completely off-screen or hidden
    if (rect.width === 0 && rect.height === 0) return;

    // Viewport-based coordinates (FIXED positioning)
    const viewportTop = Math.max(12, rect.top);
    const viewportLeft = Math.max(12, rect.left);

    // 1. Position Beacon Tooltip (Floating above the element, or below if near top of window)
    if (currentActionBeacon) {
      if (viewportTop < 60) {
        // Not enough space above, position below
        currentActionBeacon.style.top = `${rect.bottom + 10}px`;
        currentActionBeacon.style.left = `${viewportLeft}px`;
      } else {
        currentActionBeacon.style.top = `${viewportTop - 42}px`;
        currentActionBeacon.style.left = `${viewportLeft}px`;
      }
    }

    // 2. Position Flying Virtual Pointer Hand
    if (currentVirtualPointer) {
      if (rect.height > 70) {
        currentVirtualPointer.style.top = `${viewportTop + 14}px`;
        currentVirtualPointer.style.left = `${viewportLeft + Math.min(rect.width - 24, 40)}px`;
      } else {
        currentVirtualPointer.style.top = `${rect.bottom + 4}px`;
        currentVirtualPointer.style.left = `${viewportLeft + Math.min(rect.width / 2, 50)}px`;
      }
    }
  }

  function highlightActionButton(targetElement, labelText = 'Klik tombol ini untuk memulai!') {
    clearActionButtonHighlight();

    if (!targetElement) return;
    currentActionTarget = targetElement;

    targetElement.classList.add('telmy-action-spotlight');

    // Smoothly scroll both window and any inner scrollable container (modal/dashboard)
    scrollElementIntoViewSafe(targetElement);

    // 1. Create Beacon Tooltip with FIXED positioning
    const beacon = document.createElement('div');
    beacon.className = 'telmy-action-beacon';
    const cleanLabel = (labelText || 'Ditemukan di sini').replace(/^👉\s*/, '');
    beacon.innerHTML = `<span>👉</span> <span>${cleanLabel}</span>`;
    // Initial off-screen placement before first position calculation
    beacon.style.top = '-999px';
    beacon.style.left = '-999px';
    document.body.appendChild(beacon);
    currentActionBeacon = beacon;

    // 2. Create Flying Virtual Pointer with FIXED positioning
    const pointer = document.createElement('div');
    pointer.className = 'telmy-virtual-pointer';
    // Initial start position near top-right of the current viewport
    pointer.style.top = '60px';
    pointer.style.left = `${window.innerWidth - 80}px`;
    pointer.innerHTML = `
      <div class="telmy-pointer-ripple"></div>
      <div class="telmy-pointer-hand">👆</div>
    `;
    document.body.appendChild(pointer);
    currentVirtualPointer = pointer;

    // Update positions immediately and continuously during smooth scroll
    updateActionVisualsPosition();

    // Loop position updates during smooth scroll animation (0ms -> 600ms)
    let animFrames = 0;
    const trackAnimation = () => {
      updateActionVisualsPosition();
      animFrames++;
      if (animFrames < 40 && currentActionTarget) {
        requestAnimationFrame(trackAnimation);
      }
    };
    requestAnimationFrame(trackAnimation);

    // Dynamic sticky tracking: listen to window & container scrolls/resizes
    const scrollParent = findScrollableParent(targetElement);
    const onScrollOrResize = () => {
      updateActionVisualsPosition();
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true, capture: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    if (scrollParent && scrollParent !== window) {
      scrollParent.addEventListener('scroll', onScrollOrResize, { passive: true });
    }

    actionRepositionCleanup = () => {
      window.removeEventListener('scroll', onScrollOrResize, { capture: true });
      window.removeEventListener('resize', onScrollOrResize);
      if (scrollParent && scrollParent !== window) {
        scrollParent.removeEventListener('scroll', onScrollOrResize);
      }
    };

    // Auto-clear after 9 seconds or when element is clicked/interacted with
    if (actionHighlightTimeout) clearTimeout(actionHighlightTimeout);
    actionHighlightTimeout = setTimeout(() => {
      clearActionButtonHighlight();
    }, 9000);

    const onUserInteract = () => {
      clearActionButtonHighlight();
      targetElement.removeEventListener('click', onUserInteract);
    };
    targetElement.addEventListener('click', onUserInteract, { once: true });
  }

  function clearActionButtonHighlight() {
    if (actionHighlightTimeout) {
      clearTimeout(actionHighlightTimeout);
      actionHighlightTimeout = null;
    }
    if (actionRepositionCleanup) {
      actionRepositionCleanup();
      actionRepositionCleanup = null;
    }
    document.querySelectorAll('.telmy-action-spotlight').forEach(el => el.classList.remove('telmy-action-spotlight'));
    if (currentActionBeacon) {
      currentActionBeacon.remove();
      currentActionBeacon = null;
    }
    if (currentVirtualPointer) {
      currentVirtualPointer.style.opacity = '0';
      const ptr = currentVirtualPointer;
      currentVirtualPointer = null;
      setTimeout(() => ptr.remove(), 350);
    }
    currentActionTarget = null;
  }

  function clickHighlightedActionButton() {
    if (currentActionTarget) {
      currentActionTarget.click();
      clearActionButtonHighlight();
      return true;
    }
    return false;
  }

  function clearBadges() {
    lastActiveIndex = -1;
    document.querySelectorAll(`.${BADGE_CLASS}`).forEach(b => b.remove());
    document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(el => el.classList.remove(HIGHLIGHT_CLASS));
    clearActionButtonHighlight();
  }

  return {
    attachBadges,
    setActiveField,
    clearBadges,
    highlightActionButton,
    clearActionButtonHighlight,
    clickHighlightedActionButton
  };
})();
