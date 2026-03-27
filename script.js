// ==============================
// MOBILE MENU
// ==============================
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-nav");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ==============================
// SMOOTH SCROLL
// ==============================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ==============================
// SCROLL REVEAL ANIMATION
// ==============================
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

// ==============================
// STICKY NAV SHADOW ON SCROLL
// ==============================
const navShell = document.querySelector(".nav-shell");

function handleNavShadow() {
  if (!navShell) return;
  navShell.classList.toggle("scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", handleNavShadow);
handleNavShadow();

// ==============================
// BACK TO TOP BUTTON
// ==============================
const backToTop = document.getElementById("backToTop");

function handleBackToTopVisibility() {
  if (!backToTop) return;
  backToTop.classList.toggle("show", window.scrollY > 300);
}

if (backToTop) {
  window.addEventListener("scroll", handleBackToTopVisibility);
  handleBackToTopVisibility();

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ==============================
// INTEREST FORM SETUP
// ==============================
const interestTabs = document.querySelectorAll(".interest-tab");
const interestPanels = document.querySelectorAll(".interest-panel");
const interestForm = document.getElementById("interestForm");
const successMessage = document.querySelector(".interest-success");
const formTypeInput = document.getElementById("formType");

const panelMap = {
  generalPanel: "general",
  investorPanel: "investor",
  businessPanel: "business",
  updatesPanel: "q4_updates",
};

function resetPanelSteps(panel) {
  const steps = panel.querySelectorAll(".multi-step-form");
  if (!steps.length) return;

  steps.forEach((step, index) => {
    step.classList.toggle("active-step", index === 0);
  });
}

function markOriginalRequiredFields() {
  if (!interestForm) return;

  const fields = interestForm.querySelectorAll("input, select, textarea");
  fields.forEach((field) => {
    if (field.required) {
      field.dataset.wasRequired = "true";
    }
  });
}

function syncRequiredFields() {
  if (!interestForm) return;

  interestPanels.forEach((panel) => {
    const panelIsActive = panel.classList.contains("active");
    const steps = panel.querySelectorAll(".multi-step-form");

    if (steps.length) {
      steps.forEach((step) => {
        const stepIsActive = step.classList.contains("active-step");
        const fields = step.querySelectorAll("input, select, textarea");

        fields.forEach((field) => {
          if (field.dataset.wasRequired === "true") {
            field.required = panelIsActive && stepIsActive;
          }
        });
      });
    } else {
      const fields = panel.querySelectorAll("input, select, textarea");

      fields.forEach((field) => {
        if (field.dataset.wasRequired === "true") {
          field.required = panelIsActive;
        }
      });
    }
  });
}

// ==============================
// INTEREST FORM TABS
// ==============================
if (interestTabs.length && interestPanels.length) {
  interestTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-panel");
      if (!target) return;

      interestTabs.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-selected", "false");
      });

      interestPanels.forEach((panel) => {
        panel.classList.remove("active");
      });

      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const activePanel = document.getElementById(target);
      if (activePanel) {
        activePanel.classList.add("active");
        resetPanelSteps(activePanel);
      }

      if (formTypeInput && panelMap[target]) {
        formTypeInput.value = panelMap[target];
      }

      if (successMessage) {
        successMessage.textContent = "";
      }

      syncRequiredFields();
    });
  });
}

// ==============================
// MULTI-STEP FORM NAVIGATION
// ==============================
document.querySelectorAll(".interest-panel").forEach((panel) => {
  const steps = panel.querySelectorAll(".multi-step-form");
  const nextBtn = panel.querySelector(".next-step");
  const prevBtn = panel.querySelector(".prev-step");

  if (nextBtn && steps.length > 1) {
    nextBtn.addEventListener("click", () => {
      const currentStep = panel.querySelector(".multi-step-form.active-step");
      if (!currentStep) return;

      const visibleRequiredFields = currentStep.querySelectorAll("[required]");
      for (const field of visibleRequiredFields) {
        if (!field.checkValidity()) {
          field.reportValidity();
          return;
        }
      }

      steps.forEach((step) => step.classList.remove("active-step"));
      steps[1].classList.add("active-step");

      if (successMessage) successMessage.textContent = "";
      syncRequiredFields();
    });
  }

  if (prevBtn && steps.length > 1) {
    prevBtn.addEventListener("click", () => {
      steps.forEach((step) => step.classList.remove("active-step"));
      steps[0].classList.add("active-step");

      if (successMessage) successMessage.textContent = "";
      syncRequiredFields();
    });
  }
});

// ==============================
// INTEREST FORM SUBMISSION
// ==============================
function getValue(form, selector) {
  return form.querySelector(selector)?.value.trim() || "";
}

function combineName(firstName, lastName) {
  return `${firstName} ${lastName}`.trim();
}

function buildPayload(form, formType) {
  const data = {
    name: "",
    email: "",
    phone: "",
    country: "",
    message: "",
    formType,
  };

  if (formType === "general") {
    const firstName = getValue(form, '[name="general_first_name"]');
    const lastName = getValue(form, '[name="general_last_name"]');
    const interestType = getValue(form, '[name="general_interest_type"]');
    const message = getValue(form, '[name="general_message"]');

    data.name = combineName(firstName, lastName);
    data.email = getValue(form, '[name="general_email"]');
    data.phone = getValue(form, '[name="general_phone"]');
    data.country = getValue(form, '[name="general_country"]');
    data.message = [interestType ? `Interest Type: ${interestType}` : "", message]
      .filter(Boolean)
      .join(" | ");
  }

  if (formType === "investor") {
    const firstName = getValue(form, '[name="investor_first_name"]');
    const lastName = getValue(form, '[name="investor_last_name"]');
    const investmentRange = getValue(form, '[name="investment_range"]');
    const opportunity = getValue(form, '[name="investor_interest"]');
    const message = getValue(form, '[name="investor_message"]');
    const consent = form.querySelector('[name="investor_consent"]')?.checked;

    data.name = combineName(firstName, lastName);
    data.email = getValue(form, '[name="investor_email"]');
    data.phone = getValue(form, '[name="investor_phone"]');
    data.country = getValue(form, '[name="investor_country"]');
    data.message = [
      investmentRange ? `Investment Range: ${investmentRange}` : "",
      opportunity ? `Opportunity: ${opportunity}` : "",
      consent ? "Consent: Yes" : "Consent: No",
      message,
    ]
      .filter(Boolean)
      .join(" | ");
  }

  if (formType === "business") {
    const firstName = getValue(form, '[name="business_first_name"]');
    const lastName = getValue(form, '[name="business_last_name"]');
    const companyName = getValue(form, '[name="company_name"]');
    const businessType = getValue(form, '[name="business_type"]');
    const businessMessage = getValue(form, '[name="business_message"]');

    data.name = combineName(firstName, lastName);
    data.email = getValue(form, '[name="business_email"]');
    data.phone = getValue(form, '[name="business_phone"]');
    data.country = getValue(form, '[name="business_country"]');
    data.message = [
      companyName ? `Company Name: ${companyName}` : "",
      businessType ? `Business Type: ${businessType}` : "",
      businessMessage,
    ]
      .filter(Boolean)
      .join(" | ");
  }

  if (formType === "q4_updates") {
    const firstName = getValue(form, '[name="updates_first_name"]');
    const lastName = getValue(form, '[name="updates_last_name"]');
    const updatePreference = getValue(form, '[name="update_preference"]');

    data.name = combineName(firstName, lastName) || "Updates Subscriber";
    data.email = getValue(form, '[name="updates_email"]');
    data.phone = getValue(form, '[name="updates_phone"]');
    data.country = getValue(form, '[name="updates_country"]');
    data.message = updatePreference
      ? `Subscribed for updates | Preference: ${updatePreference}`
      : "Subscribed for updates";
  }

  return data;
}

function validatePayload(data) {
  if (!data.name || !data.email) {
    return "Please complete the required fields.";
  }

  if (!data.message) {
    return "Please add a short message or selection before submitting.";
  }

  return "";
}

if (interestForm && successMessage) {
  markOriginalRequiredFields();
  syncRequiredFields();

  interestForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    syncRequiredFields();

    const activePanel = interestForm.querySelector(".interest-panel.active");
    const activeStep = activePanel?.querySelector(".multi-step-form.active-step");

    if (activeStep) {
      const visibleRequiredFields = activeStep.querySelectorAll("[required]");
      for (const field of visibleRequiredFields) {
        if (!field.checkValidity()) {
          field.reportValidity();
          return;
        }
      }
    } else if (activePanel) {
      const visibleRequiredFields = activePanel.querySelectorAll("[required]");
      for (const field of visibleRequiredFields) {
        if (!field.checkValidity()) {
          field.reportValidity();
          return;
        }
      }
    }

    const formType = formTypeInput?.value || "general";
    const submitBtn = activePanel?.querySelector('button[type="submit"]');

    successMessage.textContent = "";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = "Submitting...";
    }

    const payload = buildPayload(interestForm, formType);
    const validationError = validatePayload(payload);

    if (validationError) {
      successMessage.textContent = validationError;

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText || "Submit";
      }
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let result = {};
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (response.ok) {
        successMessage.textContent = "Thank you. Your submission has been received.";
        interestForm.reset();

        interestPanels.forEach((panel, index) => {
          panel.classList.toggle("active", index === 0);
          resetPanelSteps(panel);
        });

        interestTabs.forEach((tab, index) => {
          tab.classList.toggle("active", index === 0);
          tab.setAttribute("aria-selected", index === 0 ? "true" : "false");
        });

        if (formTypeInput) {
          formTypeInput.value = "general";
        }

        syncRequiredFields();
      } else {
        successMessage.textContent =
          result.message || "Submission failed. Please try again.";
      }
    } catch (error) {
      successMessage.textContent =
        "Could not connect to the form service. Please try again.";
      console.error("Interest form submit error:", error);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText || "Submit";
      }
    }
  });
}
// ==============================
// NANI POPUP CONTROL
// ==============================
window.addEventListener("load", () => {
  const popup = document.getElementById("naniPopup");
  const closeBtn = document.getElementById("naniPopupClose");

  if (!popup) return;

  // show after 3 seconds
  setTimeout(() => {
    popup.classList.add("show");
    popup.setAttribute("aria-hidden", "false");
  }, 3000);

  // close button
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      popup.classList.remove("show");
      popup.setAttribute("aria-hidden", "true");
    });
  }

  // click outside to close
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.classList.remove("show");
      popup.setAttribute("aria-hidden", "true");
    }
  });
});