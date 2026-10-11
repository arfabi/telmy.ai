// Telmy.ai Welcome Page Controller
document.addEventListener('DOMContentLoaded', async () => {
  // Mark onboarding completed in Chrome Storage
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({
        hasSeenWelcomePage: true,
        welcomeSeenAt: new Date().toISOString()
      });
    }
  } catch (e) {}

  // Interactive Pin button click in mockup
  const pinBtn = document.querySelector('.mockup-pin-btn');
  if (pinBtn) {
    pinBtn.addEventListener('click', () => {
      pinBtn.textContent = '✓ Pinned';
      pinBtn.style.background = '#dcfce7';
      pinBtn.style.color = '#15803d';
      pinBtn.style.borderColor = '#86efac';
      pinBtn.classList.remove('pulse-pin');
    });
  }
});
