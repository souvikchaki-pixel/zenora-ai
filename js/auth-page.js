(function () {
  const form = document.getElementById('auth-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const rememberEmail = document.getElementById('remember-email');
  const submit = document.getElementById('auth-submit');
  const alertBox = document.getElementById('auth-alert');
  const toggle = document.getElementById('toggle-auth');
  const switchCopy = document.getElementById('switch-copy');
  const title = document.getElementById('auth-title');
  const description = document.getElementById('auth-description');
  let signingUp = false;
  const redirectUrl = (path) => new URL(path, window.location.href).href;
  const showMessage = (message, success = false) => { alertBox.textContent = message; alertBox.classList.toggle('success', success); alertBox.style.display = 'block'; };
  const clearMessage = () => { alertBox.style.display = 'none'; alertBox.classList.remove('success'); };
  const setMode = (nextMode) => {
    signingUp = nextMode; clearMessage(); passwordInput.autocomplete = signingUp ? 'new-password' : 'current-password';
    title.textContent = signingUp ? 'Begin your next chapter.' : 'A calmer way to grow.';
    description.textContent = signingUp ? 'Create your private Zenora space in a few seconds.' : 'Sign in to continue your personal transformation.';
    submit.textContent = signingUp ? 'Create private account' : 'Sign in securely';
    switchCopy.textContent = signingUp ? 'Already have an account?' : 'New to Zenora?';
    toggle.textContent = signingUp ? 'Sign in' : 'Create an account';
  };
  const remembered = localStorage.getItem('zenora_remembered_email');
  if (remembered) { emailInput.value = remembered; rememberEmail.checked = true; }
  toggle.addEventListener('click', (event) => { event.preventDefault(); setMode(!signingUp); });
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); clearMessage();
    if (!window.supabaseClient) return showMessage('Secure sign-in is not configured yet. Please contact the Zenora team.');
    const email = emailInput.value.trim(); const password = passwordInput.value;
    if (rememberEmail.checked) localStorage.setItem('zenora_remembered_email', email); else localStorage.removeItem('zenora_remembered_email');
    submit.disabled = true; submit.textContent = signingUp ? 'Creating your account…' : 'Signing you in…';
    try {
      const result = signingUp
        ? await window.supabaseClient.auth.signUp({ email, password, options: { emailRedirectTo: redirectUrl('age-selection.html') } })
        : await window.supabaseClient.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (signingUp && !result.data.session) { showMessage('Check your inbox to confirm your email, then return here to sign in.', true); return; }
      const user = result.data.user;
      if (!user) throw new Error('We could not start your session. Please try again.');
      const profileResult = await window.supabaseClient.from('users').upsert({ id: user.id, email: user.email, updated_at: new Date().toISOString() }, { onConflict: 'id' });
      if (profileResult.error) console.warn('Profile initialization skipped:', profileResult.error.message);
      const { data: profile } = await window.supabaseClient.from('users').select('age').eq('id', user.id).maybeSingle();
      window.location.assign(profile?.age ? 'dashboard.html' : 'age-selection.html');
    } catch (error) { showMessage(error.message || 'We could not complete that request. Please try again.'); }
    finally { submit.disabled = false; submit.textContent = signingUp ? 'Create private account' : 'Sign in securely'; }
  });
  document.getElementById('google-auth').addEventListener('click', async () => {
    clearMessage();
    if (!window.supabaseClient) return showMessage('Secure sign-in is not configured yet.');
    try { const { error } = await window.supabaseClient.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectUrl('age-selection.html') } }); if (error) throw error; }
    catch (error) { showMessage(error.message || 'Google sign-in could not be started.'); }
  });
  document.getElementById('forgot-password').addEventListener('click', async (event) => {
    event.preventDefault(); clearMessage(); const email = emailInput.value.trim();
    if (!email) { showMessage('Enter your email address first, then select “Forgot password?”.'); emailInput.focus(); return; }
    if (!window.supabaseClient) return showMessage('Secure password reset is not configured yet.');
    try { const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl('index.html') }); if (error) throw error; showMessage('If this email belongs to a Zenora account, a password-reset link is on its way.', true); }
    catch (error) { showMessage(error.message || 'Password reset could not be started.'); }
  });
})();
