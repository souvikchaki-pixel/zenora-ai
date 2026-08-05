(function () {
  const options = [...document.querySelectorAll('.age-option')]; const continueButton = document.getElementById('continue'); let selected;
  options.forEach((option) => option.addEventListener('click', () => { selected = option.dataset; options.forEach((item) => { const active = item === option; item.classList.toggle('selected', active); item.setAttribute('aria-checked', String(active)); }); continueButton.disabled = false; }));
  continueButton.addEventListener('click', async () => {
    const session = await checkAuthSession(); if (!session || !selected) return;
    continueButton.disabled = true; continueButton.textContent = 'Saving your path…';
    try {
      const age = Number(selected.age); const group = selected.group;
      const { error: authError } = await window.supabaseClient.auth.updateUser({ data: { age_group: group } }); if (authError) throw authError;
      const { error: profileError } = await window.supabaseClient.from('users').upsert({ id: session.user.id, email: session.user.email, age, updated_at: new Date().toISOString() }, { onConflict: 'id' }); if (profileError) console.warn('Profile age sync skipped:', profileError.message);
      localStorage.setItem('zenora_age_group', group); window.location.assign('survey.html');
    } catch (error) { alert(error.message || 'We could not save your selection. Please try again.'); continueButton.disabled = false; continueButton.textContent = 'Continue to check-in →'; }
  });
})();
