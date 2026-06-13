/**
 * =====================================================
 *  WALKWORD — Login Page (login.js)
 * =====================================================
 *  Validação de formulário, toggle login/registro,
 *  feedback visual, redirecionamento após login,
 *  e integração Google Identity Services + Apple JS.
 * =====================================================
 */
(function () {
  'use strict';

  /* ---------- DOM Elements ---------- */
  var emailInput     = document.getElementById('login-email');
  var passwordInput  = document.getElementById('login-password');
  var loginBtn       = document.getElementById('login-btn');
  var nameInput      = document.getElementById('register-name');
  var registerFields = document.getElementById('register-fields');
  var toggleLink     = document.getElementById('toggle-auth-link');
  var toggleText     = document.getElementById('toggle-auth-text');
  var cardTitle      = document.querySelector('.card1 .text h1');
  var cardSubtitle   = document.querySelector('.card1 .text p');
  var socialGoogle   = document.getElementById('social-google');
  var socialApple    = document.getElementById('social-apple');

  var isRegisterMode = false;

  /* ---------- Redirect if already logged in ---------- */
  if (WalkWord.auth.isLoggedIn()) {
    window.location.href = '../navegacao/navegacao.html';
    return;
  }

  /* ---------- Toggle Login / Register ---------- */
  function toggleMode() {
    isRegisterMode = !isRegisterMode;
    if (isRegisterMode) {
      registerFields.style.display = 'flex';
      loginBtn.textContent         = 'Create Account';
      toggleText.textContent       = 'Already have an account? ';
      toggleLink.textContent       = 'Sign In';
      cardTitle.textContent        = 'Create Account';
      cardSubtitle.textContent     = 'Join the conscious fashion movement';
    } else {
      registerFields.style.display = 'none';
      loginBtn.textContent         = 'Login To Account';
      toggleText.textContent       = 'New To WALKWORD? ';
      toggleLink.textContent       = 'Create Account';
      cardTitle.textContent        = 'Welcome Back';
      cardSubtitle.textContent     = 'Enter your details to access your atelier';
    }
    clearErrors();
  }

  toggleLink && toggleLink.addEventListener('click', function (e) {
    e.preventDefault();
    toggleMode();
  });

  /* ---------- Validation Helpers ---------- */
  function showError(input, message) {
    clearError(input);
    var errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText =
      'color:#c1121f;font-size:11px;margin-top:4px;font-weight:500;' +
      'animation:shakeError .4s ease-out;';
    input.parentElement.appendChild(errorDiv);
    input.style.borderColor = '#c1121f';
  }

  function clearError(input) {
    var existing = input.parentElement.querySelector('.field-error');
    if (existing) existing.remove();
    input.style.borderColor = '';
  }

  function clearErrors() {
    document.querySelectorAll('.field-error').forEach(function (el) { el.remove(); });
    [emailInput, passwordInput, nameInput].forEach(function (inp) {
      if (inp) inp.style.borderColor = '';
    });
  }

  /* ---------- Submit ---------- */
  function handleSubmit(e) {
    if (e) e.preventDefault();
    clearErrors();
    var valid = true;

    if (isRegisterMode && nameInput) {
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        showError(nameInput, 'Insira seu nome completo.');
        valid = false;
      }
    }
    if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
      showError(emailInput, 'Insira um e-mail válido.');
      valid = false;
    }
    if (!passwordInput.value || passwordInput.value.length < 6) {
      showError(passwordInput, 'A senha deve ter ao menos 6 caracteres.');
      valid = false;
    }
    if (!valid) return;

    var result = isRegisterMode
      ? WalkWord.auth.register(nameInput.value.trim(), emailInput.value.trim(), passwordInput.value)
      : WalkWord.auth.login(emailInput.value.trim(), passwordInput.value);

    if (result.success) {
      loginBtn.textContent         = '✓ ' + result.message;
      loginBtn.style.backgroundColor = '#2d6a4f';
      loginBtn.disabled = true;
      setTimeout(function () {
        window.location.href = '../navegacao/navegacao.html';
      }, 800);
    } else {
      WalkWord.showToast(result.message, 'error');
    }
  }

  loginBtn && loginBtn.addEventListener('click', handleSubmit);

  [emailInput, passwordInput].forEach(function (inp) {
    if (inp) inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleSubmit(e);
    });
  });

  /* ==========================================================
   *  GOOGLE IDENTITY SERVICES — One Tap + popup fallback
   * ==========================================================
   *  Requires the Google Identity Services library loaded
   *  in the <head>. We inject it dynamically so it only
   *  loads when the login page is visited.
   * ========================================================== */

  // ── Inject GSI script ──
  var gsiScript = document.createElement('script');
  gsiScript.src = 'https://accounts.google.com/gsi/client';
  gsiScript.async = true;
  gsiScript.defer = true;
  gsiScript.onload = initGoogleSignIn;
  document.head.appendChild(gsiScript);

  /**
   * Called after the GSI library is ready.
   * Uses a CLIENT_ID placeholder — swap for a real one from
   * https://console.cloud.google.com/  (OAuth 2.0 Client ID).
   * For a purely local/demo project the popup will show the
   * "App not verified" screen but the flow still works.
   */
  var GOOGLE_CLIENT_ID = '438605996541-ni1r4cvsrq7psjos4mmt6e53ornv697f.apps.googleusercontent.com';

  function initGoogleSignIn() {
    if (typeof google === 'undefined' || !google.accounts) return;

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Render the hidden One Tap prompt (fires automatically on page load)
    google.accounts.id.prompt();
  }

  /**
   * Receives the JWT credential returned by Google.
   * We decode the payload (base64) to extract name + email,
   * then log the user in via the WalkWord auth module.
   */
  function handleGoogleCredential(response) {
    try {
      var parts   = response.credential.split('.');
      var payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      var name  = payload.name  || payload.given_name || 'Usuário Google';
      var email = payload.email || '';

      // Register / login using the social profile data
      var result = WalkWord.auth.register(name, email, 'google-oauth-' + Date.now());
      if (result.success) {
        WalkWord.showToast('Bem-vindo(a), ' + name + '!', 'success');
        setTimeout(function () {
          window.location.href = '../navegacao/navegacao.html';
        }, 900);
      }
    } catch (err) {
      WalkWord.showToast('Erro ao autenticar com Google.', 'error');
      console.error('[WALKWORD] Google credential error:', err);
    }
  }

  /* ── Google button click — triggers popup if One Tap already dismissed ── */
  socialGoogle && socialGoogle.addEventListener('click', function () {
    if (typeof google !== 'undefined' && google.accounts) {
      // Use the OAuth2 popup flow as a fallback
      var tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'openid email profile',
        callback: function (tokenResponse) {
          if (tokenResponse.error) {
            WalkWord.showToast('Login com Google cancelado.', 'warning');
            return;
          }
          // Fetch profile from Google People API
          fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: 'Bearer ' + tokenResponse.access_token }
          })
          .then(function (r) { return r.json(); })
          .then(function (profile) {
            var name  = profile.name  || profile.given_name || 'Usuário Google';
            var email = profile.email || '';
            var result = WalkWord.auth.register(name, email, 'google-oauth-' + Date.now());
            if (result.success) {
              WalkWord.showToast('Bem-vindo(a), ' + name + '!', 'success');
              setTimeout(function () {
                window.location.href = '../navegacao/navegacao.html';
              }, 900);
            }
          })
          .catch(function () {
            WalkWord.showToast('Erro ao obter dados do Google.', 'error');
          });
        }
      });
      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } else {
      // GSI not yet loaded — show informative toast
      WalkWord.showToast('Carregando Google Sign-In…', 'warning');
    }
  });

  /* ==========================================================
   *  APPLE SIGN IN  (Sign In with Apple JS)
   * ==========================================================
   *  Requires an Apple Developer account with a Service ID
   *  configured at https://developer.apple.com/account/
   *  Swap SERVICE_ID and REDIRECT_URI for real values.
   * ========================================================== */

  var appleScript = document.createElement('script');
  appleScript.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
  appleScript.async = true;
  appleScript.defer = true;
  appleScript.onload = initAppleSignIn;
  document.head.appendChild(appleScript);

  var APPLE_SERVICE_ID  = 'com.walkword.signin';              // Replace with your Service ID
  var APPLE_REDIRECT_URI = window.location.origin + '/login'; // Replace with your redirect URI

  function initAppleSignIn() {
    if (typeof AppleID === 'undefined') return;
    AppleID.auth.init({
      clientId:    APPLE_SERVICE_ID,
      scope:       'name email',
      redirectURI: APPLE_REDIRECT_URI,
      usePopup:    true,
    });
  }

  socialApple && socialApple.addEventListener('click', function () {
    if (typeof AppleID !== 'undefined') {
      AppleID.auth.signIn()
        .then(function (data) {
          // data.authorization contains id_token + code
          // data.user is only sent on FIRST login
          var user  = data.user  || {};
          var name  = (user.name && (user.name.firstName + ' ' + (user.name.lastName || '')).trim())
                      || 'Usuário Apple';
          // Decode the id_token to retrieve email
          var idToken = (data.authorization || {}).id_token || '';
          var email   = '';
          try {
            var pl = JSON.parse(atob(idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
            email  = pl.email || '';
          } catch (_) {}

          var result = WalkWord.auth.register(name, email || (name.replace(/\s+/g, '.').toLowerCase() + '@privaterelay.appleid.com'), 'apple-oauth-' + Date.now());
          if (result.success) {
            WalkWord.showToast('Bem-vindo(a), ' + name + '!', 'success');
            setTimeout(function () {
              window.location.href = '../navegacao/navegacao.html';
            }, 900);
          }
        })
        .catch(function (err) {
          if (err && err.error === 'popup_closed_by_user') {
            WalkWord.showToast('Login com Apple cancelado.', 'warning');
          } else {
            WalkWord.showToast('Erro ao autenticar com Apple. Verifique as configurações.', 'error');
            console.error('[WALKWORD] Apple Sign In error:', err);
          }
        });
    } else {
      WalkWord.showToast('Carregando Apple Sign In…', 'warning');
    }
  });

  /* ---------- Inject shake animation ---------- */
  var style = document.createElement('style');
  style.textContent =
    '@keyframes shakeError{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}';
  document.head.appendChild(style);
})();
