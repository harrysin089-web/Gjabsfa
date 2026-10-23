"use strict";

/* =========================================================
   PERFECT FITNESS GYM
   Main JavaScript
========================================================= */

/* =========================================================
   ELEMENTS
========================================================= */

const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

const mobileLinks = mobileMenu
  ? mobileMenu.querySelectorAll("a")
  : [];

const navAnchors = document.querySelectorAll(
  ".nav-links a"
);

const sections = document.querySelectorAll(
  "main section[id]"
);

const revealElements =
  document.querySelectorAll(".reveal");

const hero = document.querySelector(".hero");
const heroMedia = document.querySelector(
  ".hero-media img"
);
const heroContent = document.querySelector(
  ".hero-content"
);

const prefersReducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

/* =========================================================
   HEADER
========================================================= */

function updateHeader() {
  if (!header) {
    return;
  }

  if (window.scrollY > 30) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

window.addEventListener(
  "scroll",
  updateHeader,
  { passive: true }
);

updateHeader();

/* =========================================================
   MOBILE MENU
========================================================= */

function closeMenu() {
  if (!mobileMenu || !menuToggle) {
    return;
  }

  mobileMenu.classList.remove("open");

  document.body.classList.remove(
    "menu-open"
  );

  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );
}

function openMenu() {
  if (!mobileMenu || !menuToggle) {
    return;
  }

  mobileMenu.classList.add("open");

  document.body.classList.add(
    "menu-open"
  );

  menuToggle.setAttribute(
    "aria-expanded",
    "true"
  );
}

function toggleMenu() {
  if (!mobileMenu) {
    return;
  }

  if (mobileMenu.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
}

if (menuToggle) {
  menuToggle.addEventListener(
    "click",
    toggleMenu
  );
}

mobileLinks.forEach((link) => {
  link.addEventListener(
    "click",
    closeMenu
  );
});

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  }
);

/* =========================================================
   SCROLL REVEAL
========================================================= */

if ("IntersectionObserver" in window) {

  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "visible"
          );

          observer.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.12,
        rootMargin:
          "0px 0px -60px 0px"
      }
    );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

} else {

  revealElements.forEach((element) => {
    element.classList.add("visible");
  });

}

/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

if ("IntersectionObserver" in window) {

  const sectionObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          const currentId =
            entry.target.id;

          navAnchors.forEach((anchor) => {

            const href =
              anchor.getAttribute("href");

            anchor.classList.toggle(
              "active",
              href === `#${currentId}`
            );

          });

        });

      },
      {
        threshold: 0.3
      }
    );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

}

/* =========================================================
   SMOOTH ANCHOR SCROLLING
========================================================= */

document
  .querySelectorAll(
    'a[href^="#"]'
  )
  .forEach((anchor) => {

    anchor.addEventListener(
      "click",
      (event) => {

        const targetId =
          anchor.getAttribute("href");

        if (
          !targetId ||
          targetId === "#" ||
          targetId.length < 2
        ) {
          return;
        }

        const target =
          document.querySelector(
            targetId
          );

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior:
            prefersReducedMotion
              ? "auto"
              : "smooth",
          block: "start"
        });

      }
    );

  });

/* =========================================================
   HERO MOUSE PARALLAX
========================================================= */

if (
  hero &&
  heroContent &&
  !prefersReducedMotion &&
  window.innerWidth > 1100
) {

  hero.addEventListener(
    "mousemove",
    (event) => {

      const rect =
        hero.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
          rect.width -
        0.5;

      const y =
        (event.clientY - rect.top) /
          rect.height -
        0.5;

      heroContent.style.transform =
        `translate3d(${x * 4}px, ${y * 3}px, 0)`;

    }
  );

  hero.addEventListener(
    "mouseleave",
    () => {

      heroContent.style.transform =
        "translate3d(0, 0, 0)";

    }
  );
}

/* =========================================================
   HERO SCROLL PARALLAX
========================================================= */

if (
  heroMedia &&
  !prefersReducedMotion &&
  window.innerWidth > 900
) {

  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {

      if (ticking) {
        return;
      }

      window.requestAnimationFrame(
        () => {

          const offset =
            Math.min(
              window.scrollY * 0.08,
              80
            );

          heroMedia.style.transform =
            `scale(1.06) translate3d(0, ${offset}px, 0)`;

          ticking = false;

        }
      );

      ticking = true;

    },
    { passive: true }
  );
}

/* =========================================================
   CONTACT FORM
========================================================= */

if (contactForm) {

  contactForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      const formData =
        new FormData(contactForm);

      const name =
        String(
          formData.get("name") || ""
        ).trim();

      const phone =
        String(
          formData.get("phone") || ""
        ).trim();

      const email =
        String(
          formData.get("email") || ""
        ).trim();

      const plan =
        String(
          formData.get("plan") || ""
        ).trim();

      if (
        !name ||
        !phone ||
        !email ||
        !plan
      ) {

        formMessage.textContent =
          "Please complete all required fields.";

        return;
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {

        formMessage.textContent =
          "Please enter a valid email address.";

        return;
      }

      const submitButton =
        contactForm.querySelector(
          'button[type="submit"]'
        );

      if (!submitButton) {
        return;
      }

      const originalHTML =
        submitButton.innerHTML;

      submitButton.disabled = true;

      submitButton.innerHTML =
        "<span>Sending...</span>";

      /*
        DEMO SUBMISSION

        This simulates a successful enquiry.

        To make it actually send data, connect this
        section to your preferred backend/API.
      */

      window.setTimeout(
        () => {

          formMessage.textContent =
            `Thanks ${name}. Your ${plan} enquiry has been received. Our team will contact you shortly.`;

          contactForm.reset();

          submitButton.disabled = false;

          submitButton.innerHTML =
            originalHTML;

        },
        900
      );

    }
  );

}

/* =========================================================
   IMAGE FALLBACK
========================================================= */

document
  .querySelectorAll("img")
  .forEach((image) => {

    image.addEventListener(
      "error",
      () => {

        image.style.background =
          "#151515";

        image.style.objectFit =
          "cover";

      }
    );

  });

/* =========================================================
   RESIZE HANDLER
========================================================= */

let resizeTimer = null;

window.addEventListener(
  "resize",
  () => {

    window.clearTimeout(
      resizeTimer
    );

    resizeTimer =
      window.setTimeout(
        () => {

          if (
            window.innerWidth > 900
          ) {
            closeMenu();
          }

        },
        150
      );

  },
  { passive: true }
);
