import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==============================
// FIREBASE SETUP
// ==============================
const firebaseConfig = {
  apiKey: "AIzaSyCnO3fJXfGF9qODEixY-oVvJ3-0TIsb45M",
  authDomain: "nani-fintech-admin.firebaseapp.com",
  projectId: "nani-fintech-admin",
  storageBucket: "nani-fintech-admin.firebasestorage.app",
  messagingSenderId: "910565960491",
  appId: "1:910565960491:web:135aa60b4f3ac623f0336e",
  measurementId: "G-M9L17B9GEW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
const interestPopupModal = document.getElementById("interestPopupModal");
const interestPopupClose = document.getElementById("interestPopupClose");

const panelMap = {
  generalPanel: "general",
  investorPanel: "investor",
  businessPanel: "business",
  updatesPanel: "q4_updates",
};

const panelByFormType = {
  general: "generalPanel",
  investor: "investorPanel",
  business: "businessPanel",
  q4_updates: "updatesPanel",
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

function activateInterestPanel(target) {
  if (!target) return;

  interestTabs.forEach((item) => {
    const isActive = item.getAttribute("data-panel") === target;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  interestPanels.forEach((panel) => {
    const isActive = panel.id === target;
    panel.classList.toggle("active", isActive);
    if (isActive) {
      resetPanelSteps(panel);
    }
  });

  if (formTypeInput && panelMap[target]) {
    formTypeInput.value = panelMap[target];
  }

  if (successMessage) {
    successMessage.textContent = "";
  }

  syncRequiredFields();
}

function setPrefilledInterest(prefillInterest, formType = "general") {
  if (!interestForm) return;

  const generalInterestSelect = interestForm.querySelector('[name="general_interest_type"]');
  const generalMessage = interestForm.querySelector('[name="general_message"]');
  const investorInterestSelect = interestForm.querySelector('[name="investor_interest"]');
  const investorMessage = interestForm.querySelector('[name="investor_message"]');
  const businessMessage = interestForm.querySelector('[name="business_message"]');

  if (generalInterestSelect) {
    const hasMatch = Array.from(generalInterestSelect.options).some(
      (option) => option.value === prefillInterest
    );
    generalInterestSelect.value = hasMatch ? prefillInterest : "";
  }

  if (investorInterestSelect) {
    const hasMatch = Array.from(investorInterestSelect.options).some(
      (option) => option.value === prefillInterest
    );
    investorInterestSelect.value = hasMatch ? prefillInterest : "";
  }

  if (generalMessage) {
    generalMessage.value = prefillInterest ? `I'm interested in: ${prefillInterest}` : "";
  }

  if (investorMessage) {
    investorMessage.value = prefillInterest ? `I'm interested in: ${prefillInterest}` : "";
  }

  if (businessMessage) {
    businessMessage.value = prefillInterest ? `I'm interested in: ${prefillInterest}` : "";
  }

  if (formTypeInput) {
    formTypeInput.value = formType;
  }
}

// ==============================
// INTEREST FORM TABS
// ==============================
if (interestTabs.length && interestPanels.length) {
  interestTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-panel");
      activateInterestPanel(target);
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
// INTEREST FORM SUBMISSION HELPERS
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
    source: "website_popup",
    createdFromDomain: window.location.hostname,
    status: "new",
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

function resetInterestFormToDefault() {
  if (!interestForm) return;

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

  if (successMessage) {
    successMessage.textContent = "";
  }

  syncRequiredFields();
}

// ==============================
// INTEREST POPUP MODAL
// ==============================
function openInterestPopup(prefillInterest = "", formType = "general") {
  if (!interestPopupModal || !interestForm) return;

  interestPopupModal.classList.add("show");
  interestPopupModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const targetPanelId = panelByFormType[formType] || "generalPanel";
  activateInterestPanel(targetPanelId);
  setPrefilledInterest(prefillInterest, formType);

  const firstInput = interestPopupModal.querySelector("input, select, textarea");
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }
}

function closeInterestPopup() {
  if (!interestPopupModal) return;
  interestPopupModal.classList.remove("show");
  interestPopupModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

document.addEventListener("click", (e) => {
  const button = e.target.closest(".open-interest-popup");
  if (!button) return;

  e.preventDefault();

  const interest = button.getAttribute("data-interest") || "";
  const formType = button.getAttribute("data-form-type") || "general";

  const naniPopup = document.getElementById("naniPopup");
  if (naniPopup) {
    naniPopup.classList.remove("show");
    naniPopup.setAttribute("aria-hidden", "true");
  }

  openInterestPopup(interest, formType);
});

if (interestPopupClose) {
  interestPopupClose.addEventListener("click", closeInterestPopup);
}

if (interestPopupModal) {
  interestPopupModal.addEventListener("click", (e) => {
    if (e.target === interestPopupModal) {
      closeInterestPopup();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeInterestPopup();
  }
});

// ==============================
// INTEREST FORM SUBMISSION
// ==============================
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
    const submitBtn =
      activePanel?.querySelector('button[type="submit"]') ||
      interestForm.querySelector('button[type="submit"]');

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
      await addDoc(collection(db, "contact_submissions"), {
        ...payload,
        createdAt: serverTimestamp(),
      });

      successMessage.textContent = "Thank you. Your submission has been received.";
      resetInterestFormToDefault();

      setTimeout(() => {
        closeInterestPopup();
      }, 1200);
    } catch (error) {
      console.error("Interest form submit error:", error);
      successMessage.textContent =
        "Submission failed. Please try again.";
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

  setTimeout(() => {
    popup.classList.add("show");
    popup.setAttribute("aria-hidden", "false");
  }, 1400);

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      popup.classList.remove("show");
      popup.setAttribute("aria-hidden", "true");
    });
  }

  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.classList.remove("show");
      popup.setAttribute("aria-hidden", "true");
    }
  });
});