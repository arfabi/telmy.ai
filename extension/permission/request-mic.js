document.addEventListener('DOMContentLoaded', () => {
  const btnRequest = document.getElementById('btn-request');
  const statusBox = document.getElementById('status-box');
  const iconWrap = document.getElementById('icon-wrap');
  const pulseRing = document.getElementById('pulse-ring');
  const titleText = document.getElementById('title-text');
  const descText = document.getElementById('desc-text');

  async function askPermission() {
    try {
      btnRequest.disabled = true;
      btnRequest.textContent = 'Requesting Permission...';

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());

      // Success
      if (pulseRing) pulseRing.style.display = 'none';
      if (iconWrap) iconWrap.classList.add('success');
      iconWrap.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;

      titleText.textContent = 'Microphone Access Granted!';
      descText.textContent = 'Your microphone is now ready. Returning to Telmy Side Panel...';
      btnRequest.style.display = 'none';

      statusBox.className = 'alert-box success';
      statusBox.textContent = '✓ Permission active for Telmy extension. Closing tab in 1 second...';

      setTimeout(() => {
        window.close();
      }, 1200);
    } catch (err) {
      console.warn('[Request Mic Error]', err);
      btnRequest.disabled = false;
      btnRequest.textContent = 'Try Again';

      statusBox.className = 'alert-box error';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        statusBox.innerHTML = `
          <strong>Permission Denied or Blocked</strong><br>
          Please click the 🔒 <strong>Lock icon</strong> or <strong>Tune icon</strong> in the Chrome address bar above, set <strong>Microphone</strong> to <em>Allow</em>, and click "Try Again".
        `;
      } else {
        statusBox.textContent = `Error accessing microphone: ${err.message || err.name}`;
      }
    }
  }

  btnRequest.addEventListener('click', askPermission);

  // Auto-prompt on page launch
  setTimeout(askPermission, 300);
});
