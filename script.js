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

  if (window.scrollY > 20) {
    navShell.classList.add("scrolled");
  } else {
    navShell.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", handleNavShadow);
handleNavShadow();

// ==============================
// BACK TO TOP BUTTON
// ==============================
const backToTop = document.getElementById("backToTop");

function handleBackToTopVisibility() {
  if (!backToTop) return;

  if (window.scrollY > 300) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
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
// INTEREST FORM TABS
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
      steps.forEach((step) => step.classList.remove("active-step"));
      steps[1].classList.add("active-step");
      if (successMessage) successMessage.textContent = "";
    });
  }

  if (prevBtn && steps.length > 1) {
    prevBtn.addEventListener("click", () => {
      steps.forEach((step) => step.classList.remove("active-step"));
      steps[0].classList.add("active-step");
      if (successMessage) successMessage.textContent = "";
    });
  }
});

// ==============================
// INTEREST FORM SUBMISSION
// ==============================
function getValue(form, selector) {
  return form.querySelector(selector)?.value.trim() || "";
}

function getCombinedName(firstName, lastName) {
  return `${firstName} ${lastName}`.trim();
}

function buildFormPayload(form, formType) {
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

    data.name = getCombinedName(firstName, lastName);
    data.email = getValue(form, '[name="general_email"]');
    data.phone = getValue(form, '[name="general_phone"]');
    data.country = getValue(form, '[name="general_country"]');

    const interestType = getValue(form, '[name="general_interest_type"]');
    const message = getValue(form, '[name="general_message"]');

    data.message = [interestType ? `Interest Type: ${interestType}` : "", message]
      .filter(Boolean)
      .join(" | ");
  }

  if (formType === "investor") {
    const firstName = getValue(form, '[name="investor_first_name"]');
    const lastName = getValue(form, '[name="investor_last_name"]');

    data.name = getCombinedName(firstName, lastName);
    data.email = getValue(form, '[name="investor_email"]');
    data.phone = getValue(form, '[name="investor_phone"]');
    data.country = getValue(form, '[name="investor_country"]');

    const investmentRange = getValue(form, '[name="investment_range"]');
    const opportunity = getValue(form, '[name="investor_interest"]');
    const message = getValue(form, '[name="investor_message"]');
    const consentChecked = form.querySelector('[name="investor_consent"]')?.checked;

    data.message = [
      investmentRange ? `Investment Range: ${investmentRange}` : "",
      opportunity ? `Opportunity: ${opportunity}` : "",
      consentChecked ? "Consent: Yes" : "Consent: No",
      message,
    ]
      .filter(Boolean)
      .join(" | ");
  }

  if (formType === "business") {
    const firstName = getValue(form, '[name="business_first_name"]');
    const lastName = getValue(form, '[name="business_last_name"]');

    data.name = getCombinedName(firstName, lastName);
    data.email = getValue(form, '[name="business_email"]');
    data.phone = getValue(form, '[name="business_phone"]');
    data.country = getValue(form, '[name="business_country"]');

    const companyName = getValue(form, '[name="company_name"]');
    const businessType = getValue(form, '[name="business_type"]');
    const businessMessage = getValue(form, '[name="business_message"]');

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

    data.name = getCombinedName(firstName, lastName) || "Updates Subscriber";
    data.email = getValue(form, '[name="updates_email"]');
    data.phone = getValue(form, '[name="updates_phone"]');
    data.country = getValue(form, '[name="updates_country"]');

    const updatePreference = getValue(form, '[name="update_preference"]');
    data.message = updatePreference
      ? `Subscribed for updates | Preference: ${updatePreference}`
      : "Subscribed for updates";
  }

  return data;
}

function validatePayload(data) {
  if (!data.name || !data.email) {
    return "Please complete the required fields before submitting.";
  }

  if (!data.message) {
    return "Please add a short message or selection before submitting.";
  }

  return "";
}

if (interestForm && successMessage) {
  interestForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formType = formTypeInput?.value || "general";
    const activePanel = interestForm.querySelector(".interest-panel.active");
    const submitBtn = activePanel?.querySelector('button[type="submit"]');

    successMessage.textContent = "";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = "Submitting...";
    }

    const payload = buildFormPayload(interestForm, formType);
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

      const result = await response.json();

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
      } else {
        successMessage.textContent =
          result.message || "Something went wrong. Please try again.";
      }
    } catch (error) {
      successMessage.textContent = "Error submitting form. Please try again.";
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText || "Submit";
      }
    }
  });
}