/* ==========================================================================
   OLIVE BRANCH — TEMPORARY LANDING PAGE, FORM
   Posts to Formspree over fetch rather than letting the browser navigate,
   so the visitor stays on the page and sees the result inline.

   TO CONNECT IT
   Create a form at formspree.io, copy the endpoint it gives you, and paste
   it into the form's action in index.html:

     <form ... action="https://formspree.io/f/xxxxxxxx" method="POST">

   Until that action is set, the form refuses to submit and says so. It must
   never show a success message for a message that went nowhere — during a
   client review that reads as working software.
   ========================================================================== */

(function () {
  "use strict";

  function init() {
    if (window.OB_renderIcons) window.OB_renderIcons(document);

    var form = document.getElementById("contact-form");
    if (!form) return;

    var status = form.querySelector(".form__status");
    var submit = form.querySelector('button[type="submit"]');

    function say(message, state) {
      if (!status) return;
      status.textContent = message;
      status.setAttribute("data-state", state);
    }

    /* Clear a field's error as soon as the person starts fixing it */
    form.querySelectorAll("input, select").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field) field.classList.remove("has-error");
      });
      input.addEventListener("change", function () {
        var field = input.closest(".field");
        if (field) field.classList.remove("has-error");
      });
    });

    function validate() {
      var ok = true;
      var firstBad = null;

      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var good = input.checkValidity() && input.value.trim() !== "";
        if (field) field.classList.toggle("has-error", !good);
        if (!good) {
          ok = false;
          if (!firstBad) firstBad = input;
        }
      });

      if (firstBad) firstBad.focus({ preventScroll: false });
      return ok;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validate()) {
        say("Please fill in the highlighted fields.", "error");
        return;
      }

      var endpoint = form.getAttribute("action");
      if (!endpoint) {
        // Deliberately honest — see the note at the top of this file.
        say("This form isn't connected yet. Please email us in the meantime.", "error");
        return;
      }

      var original = submit ? submit.querySelector(".btn__label").textContent : "";
      if (submit) {
        submit.disabled = true;
        submit.querySelector(".btn__label").textContent = "Sending…";
      }
      say("", "");

      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            say("Thank you — your message has been sent. We'll be in touch shortly.", "success");
          } else {
            return res.json().then(function (data) {
              var detail = data && data.errors && data.errors.length
                ? data.errors.map(function (x) { return x.message; }).join(", ")
                : "Something went wrong sending your message.";
              say(detail + " Please try again, or email us directly.", "error");
            });
          }
        })
        .catch(function () {
          say("Couldn't reach the server. Please check your connection and try again.", "error");
        })
        .then(function () {
          if (submit) {
            submit.disabled = false;
            submit.querySelector(".btn__label").textContent = original;
          }
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
