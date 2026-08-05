(async function () {
  const modal = document.getElementById('onboarding-modal'); if (!modal) return;
  const session = await checkAuthSession(false); const group = session?.user?.user_metadata?.age_group || localStorage.getItem('zenora_age_group');
  if (!group) { window.location.replace('age-selection.html'); return; }
  window.userProfile = window.userProfile || {}; window.userProfile.ageTier = group;
  const badge = document.getElementById('user-tier-badge'); if (badge) badge.textContent = `Age Group: ${group}`;
  const settings = document.getElementById('settings-age-tier'); if (settings) settings.value = group;
  modal.style.display = 'none';
})();
