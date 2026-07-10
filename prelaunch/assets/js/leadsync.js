// ── REGISTRATION FORM (pixelnx.com lead-sync → GetResponse + GoToWebinar) ──
// POSTs first_name/last_name/email + autoresponder_id/webinar_id to the PixelNX
// form handler, then redirects to the thank-you page. No access token needed.
(function () {
  const FORM_ENDPOINT = 'https://pixelnx.com/form-handler';
  const THANKYOU_URL = 'https://wpilot-sales.pixalab.ai/webinar-thankyou/';

  const form = document.getElementById('registerForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  const firstInput = document.getElementById('regFirstName');
  const lastInput = document.getElementById('regLastName');
  const emailInput = document.getElementById('regEmail');
  const firstError = document.getElementById('firstNameError');
  const lastError = document.getElementById('lastNameError');
  const emailError = document.getElementById('emailError');
  const submitError = document.getElementById('submitError');
  const submitBtn = form.querySelector('.form-submit');
  const submitBtnHTML = submitBtn ? submitBtn.innerHTML : '';

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(input, errorEl, message) {
    if (message) {
      input.classList.add('invalid');
      errorEl.textContent = message;
    } else {
      input.classList.remove('invalid');
      errorEl.textContent = '';
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const first = firstInput.value.trim();
    const last = lastInput.value.trim();
    const email = emailInput.value.trim();
    let valid = true;

    if (first.length < 2) {
      setError(firstInput, firstError, 'Please enter your first name.');
      valid = false;
    } else {
      setError(firstInput, firstError, '');
    }

    if (last.length < 2) {
      setError(lastInput, lastError, 'Please enter your last name.');
      valid = false;
    } else {
      setError(lastInput, lastError, '');
    }

    if (!EMAIL_RE.test(email)) {
      setError(emailInput, emailError, 'Please enter a valid email address.');
      valid = false;
    } else {
      setError(emailInput, emailError, '');
    }

    if (!valid) return;

    submitError.textContent = '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting…';
    }

    try {
      const jsonData = JSON.stringify(Object.fromEntries(new FormData(form)));
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonData,
      });
      const res = await response.json();

      if (res.status === true) {
        form.style.display = 'none';
        success.classList.add('show');
        setTimeout(() => { window.location.href = THANKYOU_URL; }, 1500);
      } else {
        submitError.textContent = res.msg || 'Submission failed. Please try again.';
      }
    } catch (error) {
      console.error('Lead-sync error:', error);
      submitError.textContent = 'Network error. Please try again.';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtnHTML;
      }
    }
  });

  [firstInput, lastInput, emailInput].forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
      const errorEl = input === firstInput ? firstError : input === lastInput ? lastError : emailError;
      errorEl.textContent = '';
    });
  });
})();
