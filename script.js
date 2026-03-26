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
// CONTACT FORM TABS (NEW FORM)
// ==============================
const interestTabs = document.querySelectorAll(".interest-tab");
const interestPanels = document.querySelectorAll(".interest-panel");
const formTypeInput = document.getElementById("formType");

const panelMap = {
  generalPanel: "general",
  investorPanel: "investor",
  businessPanel: "business",
  updatesPanel: "q4_updates",
};

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
      }

      if (formTypeInput && panelMap[target]) {
        formTypeInput.value = panelMap[target];
      }
    });
  });
}

// ==============================
// FORM HANDLING (LOCAL PREVIEW UX)
// ==============================
const interestForm = document.getElementById("interestForm");
const successMessage = document.querySelector(".interest-success");

if (interestForm && successMessage) {
  interestForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const activePanel = interestForm.querySelector(".interest-panel.active");
    const submitBtn = activePanel?.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = "Submitting...";
    }

    successMessage.textContent = "Submitting...";

    const formType = formTypeInput ? formTypeInput.value : "general";

    let formData = {
      formType,
      name: "",
      email: "",
      phone: "",
      country: "",
      message: "",
    };

    if (formType === "general") {
      formData.name =
        `${interestForm.querySelector('[name="general_first_name"]')?.value || ""} ${interestForm.querySelector('[name="general_last_name"]')?.value || ""}`.trim();
      formData.email =
        interestForm.querySelector('[name="general_email"]')?.value.trim() || "";
      formData.phone =
        interestForm.querySelector('[name="general_phone"]')?.value.trim() || "";
      formData.country =
        interestForm.querySelector('[name="general_country"]')?.value.trim() || "";
      formData.message =
        interestForm.querySelector('[name="general_message"]')?.value.trim() || "";
    }

    if (formType === "investor") {
      formData.name =
        `${interestForm.querySelector('[name="investor_first_name"]')?.value || ""} ${interestForm.querySelector('[name="investor_last_name"]')?.value || ""}`.trim();
      formData.email =
        interestForm.querySelector('[name="investor_email"]')?.value.trim() || "";
      formData.phone =
        interestForm.querySelector('[name="investor_phone"]')?.value.trim() || "";
      formData.country =
        interestForm.querySelector('[name="investor_country"]')?.value.trim() || "";
      formData.message =
        interestForm.querySelector('[name="investor_interest"]')?.value.trim() || "Investor interest form submission";
    }

    if (formType === "business") {
      formData.name =
        interestForm.querySelector('[name="business_contact_name"]')?.value.trim() || "";
      formData.email =
        interestForm.querySelector('[name="business_email"]')?.value.trim() || "";
      formData.phone =
        interestForm.querySelector('[name="business_phone"]')?.value.trim() || "";
      formData.country =
        interestForm.querySelector('[name="business_country"]')?.value.trim() || "";
      formData.message =
        interestForm.querySelector('[name="business_message"]')?.value.trim() || "Business enquiry form submission";
    }

    if (formType === "q4_updates") {
      formData.name =
        interestForm.querySelector('[name="updates_name"]')?.value.trim() || "Updates subscriber";
      formData.email =
        interestForm.querySelector('[name="updates_email"]')?.value.trim() || "";
      formData.phone =
        interestForm.querySelector('[name="updates_phone"]')?.value.trim() || "";
      formData.country =
        interestForm.querySelector('[name="updates_country"]')?.value.trim() || "";
      formData.message = "Q4 updates subscription";
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        successMessage.textContent = "Thank you. Your form has been submitted successfully.";
        interestForm.reset();

        interestPanels.forEach((panel) => {
          const steps = panel.querySelectorAll(".multi-step-form");
          steps.forEach((step, index) => {
            step.classList.toggle("active-step", index === 0);
          });
        });
      } else {
        successMessage.textContent = result.message || "Something went wrong. Please try again.";
      }
    } catch (error) {
      successMessage.textContent = "Something went wrong. Please try again.";
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText || "Submit";
      }
    }
  });
}
// MULTI STEP FORM (WORKS PER TAB)
document.querySelectorAll(".interest-panel").forEach((panel) => {
  const steps = panel.querySelectorAll(".multi-step-form");
  const nextBtn = panel.querySelector(".next-step");
  const prevBtn = panel.querySelector(".prev-step");

  if (nextBtn && steps.length > 1) {
    nextBtn.addEventListener("click", () => {
      steps.forEach((s) => s.classList.remove("active-step"));
      steps[1].classList.add("active-step");
    });
  }

  if (prevBtn && steps.length > 1) {
    prevBtn.addEventListener("click", () => {
      steps.forEach((s) => s.classList.remove("active-step"));
      steps[0].classList.add("active-step");
    });
  }
});
