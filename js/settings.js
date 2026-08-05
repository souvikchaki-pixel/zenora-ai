(function () {
  const storageKey = 'zenora_preferences';
  const defaults = { theme: 'cosmic', ambientMotion: true, reduceMotion: false, density: 'comfortable', dailyCheckIn: true, focusMode: false, coachTone: 'compassionate', responseLength: 'balanced', proactiveInsights: true, morningReminder: true, eveningReminder: false, milestones: true, privateInsights: true };
  let preferences = { ...defaults };
  try { preferences = { ...defaults, ...JSON.parse(localStorage.getItem(storageKey) || '{}') }; } catch (_) { /* use defaults */ }
  const save = () => localStorage.setItem(storageKey, JSON.stringify(preferences));
  const apply = () => {
    document.body.dataset.theme = preferences.theme;
    document.documentElement.style.setProperty('--motion-preference', preferences.reduceMotion ? 'reduce' : 'normal');
    document.getElementById('aurora-canvas')?.toggleAttribute('hidden', preferences.reduceMotion || !preferences.ambientMotion);
  };
  document.querySelectorAll('[data-panel]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-panel]').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
    document.querySelectorAll('.settings-panel').forEach((panel) => panel.classList.toggle('active', panel.id === button.dataset.panel));
    document.getElementById(button.dataset.panel)?.focus({ preventScroll: true });
  }));
  document.querySelectorAll('[data-setting]').forEach((control) => {
    const key = control.dataset.setting;
    if (control.type === 'checkbox') control.checked = Boolean(preferences[key]); else control.value = preferences[key];
    control.addEventListener('change', () => { preferences[key] = control.type === 'checkbox' ? control.checked : control.value; save(); apply(); });
  });
  document.querySelectorAll('[data-theme]').forEach((button) => {
    const update = () => { document.querySelectorAll('[data-theme]').forEach((item) => { const selected = item.dataset.theme === preferences.theme; item.classList.toggle('selected', selected); item.setAttribute('aria-checked', String(selected)); }); };
    button.addEventListener('click', () => { preferences.theme = button.dataset.theme; save(); update(); apply(); }); update();
  });
  document.getElementById('logout')?.addEventListener('click', handleLogout);
  document.getElementById('edit-profile')?.addEventListener('click', () => alert('Profile editing will be connected to your secure account profile in the next milestone.'));
  (async () => {
    const session = await checkAuthSession(false);
    const user = session?.user;
    if (!user) { document.getElementById('session-status').textContent = 'Not signed in on this device.'; return; }
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Zenora member';
    document.getElementById('profile-name').textContent = name;
    document.getElementById('profile-email').textContent = user.email || 'Private Zenora account';
    document.getElementById('profile-initials').textContent = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    document.getElementById('session-status').textContent = `Signed in as ${user.email}.`;
  })();
  apply();
})();
