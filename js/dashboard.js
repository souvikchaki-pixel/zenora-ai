(async function () {
  const $ = (id) => document.getElementById(id);
  const setText = (id, value) => { const node = $(id); if (node) node.textContent = value; };
  const date = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()); setText('today-date', date);
  $('menu-toggle')?.addEventListener('click', () => { const sidebar = $('app-sidebar'); const open = sidebar.classList.toggle('open'); $('menu-toggle').setAttribute('aria-expanded', String(open)); });
  $('sign-out')?.addEventListener('click', handleLogout); $('avatar-button')?.addEventListener('click', () => window.location.assign('settings.html'));
  const scoreLabel = (value) => value >= 75 ? 'steady' : value >= 50 ? 'growing' : 'starting';
  const metric = (key, value, invert = false) => { if (value === undefined || value === null) return; const display = invert ? Math.max(0, 11 - Number(value)) : Number(value); setText(`${key}-value`, `${display}/10`); setText(`${key}-note`, display >= 7 ? 'A strong foundation' : display >= 4 ? 'Room to support yourself' : 'Worth a gentle reset'); };
  const session = await checkAuthSession(); if (!session) return;
  const user = session.user; const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'there'; const firstName = name.split(/\s+/)[0]; setText('welcome-title', `Welcome back, ${firstName}.`); setText('avatar-button', firstName[0].toUpperCase());
  const group = user.user_metadata?.age_group || localStorage.getItem('zenora_age_group'); if (group) setText('age-group-label', `${group} wellbeing path`);
  try {
    const { data: entries, error } = await window.supabaseClient.from('wellness_survey').select('scores, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1); if (error) throw error;
    const assessment = entries?.[0]?.scores; if (!assessment) return;
    const sleep = Number(assessment.sleep_quality); const stress = Number(assessment.stress_level); const energy = Number(assessment.energy_levels); const readiness = Number(assessment.change_readiness); const values = [sleep, 11 - stress, energy, readiness].filter(Number.isFinite); const score = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length * 10);
    setText('wellness-score', score); setText('score-ring-value', score); setText('score-description', `Your private baseline is in place. Today is a good day to make one ${scoreLabel(score)} choice.`); $('score-ring').style.setProperty('--score-deg', `${score * 3.6}deg`); metric('sleep', sleep); metric('stress', stress, true); metric('energy', energy); metric('readiness', readiness); setText('assessment-status', 'Baseline complete'); setText('assessment-link', 'Refresh baseline →'); $('assessment-link').href = 'monitoring.html';
    const habits = Array.isArray(assessment.priority_habits) ? assessment.priority_habits : []; if (habits.length) { setText('insight-title', 'Start with what matters most.'); setText('insight-copy', `You chose ${habits.slice(0, 2).join(' and ').toLowerCase()} as a focus. Your routine is a place to take one small, repeatable step.`); }
  } catch (error) { console.warn('Dashboard data could not be loaded:', error.message); }
})();
