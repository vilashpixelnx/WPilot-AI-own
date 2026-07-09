/* ─────────────────────────────────────────────────────────────
   RankOnAI lead-sync (self-hosted)
   ---------------------------------------------------------------
   A trimmed RankOnAI copy of pixelnx.com/.../leadSyncScript.js.
   Behaves identically to the working ShowcaseAI form flow
   (the [data-smart-form] handler) — same endpoint, same fields —
   but redirects to OUR thank-you page instead of ShowcaseAI's.

   It serializes every named field in the form (first_name,
   last_name, email, autoresponder_id, webinar_id) and POSTs them
   to the PixelNX form handler, which routes to GetResponse +
   GoToWebinar. No access token is needed for this flow.

   To change the thank-you destination, edit THANKYOU_URL below.
   ───────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  // ⬇️ The only RankOnAI-specific change vs. the shared script:
  var THANKYOU_URL = "https://rankonai-sales.pixalab.ai/webinar-thankyou";
  var FORM_ENDPOINT = "https://pixelnx.com/form-handler";

  document.addEventListener("DOMContentLoaded", function () {
    var forms = document.querySelectorAll("[data-smart-form]");
    if (!forms.length) return;

    forms.forEach(function (form) {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();

        var submitBtn = form.querySelector('button[type="submit"]');
        var originalBtnHTML = submitBtn ? submitBtn.innerHTML : "";
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = "Submitting...";
        }

        var jsonData = JSON.stringify(Object.fromEntries(new FormData(form)));

        try {
          var response = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: jsonData,
          });
          var res = await response.json();

          // Clear any prior alerts
          form.parentNode.querySelectorAll(".alert").forEach(function (a) { a.remove(); });

          var alertBox = document.createElement("div");
          if (res.status === true) {
            alertBox.className = "alert alert-success alert-dismissible fade show";
            alertBox.innerHTML =
              '<strong>Success!</strong> ' + (res.msg || "You're registered — see you on the webinar!") +
              '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
            form.reset();
            form.parentNode.insertBefore(alertBox, form);

            // Redirect to OUR thank-you page after a brief beat
            setTimeout(function () {
              window.location.href = THANKYOU_URL;
            }, 1500);
          } else {
            alertBox.className = "alert alert-danger alert-dismissible fade show";
            alertBox.innerHTML =
              '<strong>Error!</strong> ' + (res.msg || "Submission failed.") +
              '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
            form.parentNode.insertBefore(alertBox, form);
            setTimeout(function () {
              alertBox.classList.remove("show");
              setTimeout(function () { alertBox.remove(); }, 500);
            }, 5000);
          }
        } catch (error) {
          console.error("Lead-sync error:", error);
          form.parentNode.querySelectorAll(".alert").forEach(function (a) { a.remove(); });
          var errorBox = document.createElement("div");
          errorBox.className = "alert alert-danger alert-dismissible fade show";
          errorBox.innerHTML =
            '<strong>Error!</strong> Network error. Please try again.' +
            '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
          form.parentNode.insertBefore(errorBox, form);
          setTimeout(function () {
            errorBox.classList.remove("show");
            setTimeout(function () { errorBox.remove(); }, 500);
          }, 5000);
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
          }
        }
      });
    });
  });
})();
