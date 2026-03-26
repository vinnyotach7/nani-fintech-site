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
  interestForm.addEventListener("submit", (e) => {
    const submitBtn = interestForm.querySelector(
      '.interest-panel.active button[type="submit"]'
    );

    successMessage.textContent = "Submitting...";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = "Submitting...";
    }

    // Local preview only.
    // When using file:// it won't submit anywhere, so we fake success.
    if (window.location.protocol === "file:") {
      e.preventDefault();

      setTimeout(() => {
        successMessage.textContent = "Thank you. We will contact you soon.";

        const activeType = formTypeInput ? formTypeInput.value : "general";
        interestForm.reset();

        // Restore selected tab after reset
        interestTabs.forEach((tab) => {
          const panelId = tab.getAttribute("data-panel");
          const type = panelMap[panelId];

          if (type === activeType) {
            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");
          } else {
            tab.classList.remove("active");
            tab.setAttribute("aria-selected", "false");
          }
        });

        interestPanels.forEach((panel) => {
          panel.classList.remove("active");
        });

        const panelIdToShow =
          activeType === "general"
            ? "generalPanel"
            : activeType === "investor"
            ? "investorPanel"
            : activeType === "business"
            ? "businessPanel"
            : "updatesPanel";

        const panelToShow = document.getElementById(panelIdToShow);
        if (panelToShow) {
          panelToShow.classList.add("active");
        }

        if (formTypeInput) {
          formTypeInput.value = activeType;
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent =
            submitBtn.dataset.originalText || "Submit";
        }
      }, 1200);
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