const businessConfig = {
  whatsappNumber: "59899868623",
  whatsappMessage:
    "Hola BARBERODD, quiero reservar un turno. ¿Qué horarios tienen disponibles?",
  instagramUrl: "https://www.instagram.com/barber.rodd/",
};

const whatsappUrl = `https://wa.me/${businessConfig.whatsappNumber}?text=${encodeURIComponent(
  businessConfig.whatsappMessage
)}`;

document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
  link.setAttribute("href", whatsappUrl);
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noreferrer");
});

document.querySelectorAll("[data-instagram-link]").forEach((link) => {
  link.setAttribute("href", businessConfig.instagramUrl);
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noreferrer");
});

const body = document.body;
const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".scroll-progress__bar");
const menuToggle = document.querySelector(".menu-toggle");
const navBackdrop = document.querySelector(".nav-backdrop");
const navLinks = Array.from(
  document.querySelectorAll('.site-nav a[href^="#"]')
);
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const parallaxItems = document.querySelectorAll("[data-parallax]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const tiltCards =
  !reduceMotion && window.matchMedia("(hover: hover)").matches
    ? document.querySelectorAll("[data-tilt]")
    : [];

revealItems.forEach((item, index) => {
  if (!item.classList.contains("reveal-delay")) {
    item.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
  }
});

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setMenuState = (open) => {
  body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
};

menuToggle.addEventListener("click", () => {
  setMenuState(!body.classList.contains("menu-open"));
});

navBackdrop.addEventListener("click", () => setMenuState(false));

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuState(false);
  }
});

const syncScrollUi = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);

  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressBar.style.transform = `scaleX(${progress})`;
};

if (!("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -48px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const currentId = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === currentId);
        });
      });
    },
    {
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

let isTicking = false;

const updateParallax = () => {
  const viewportHeight = window.innerHeight;

  parallaxItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const speed = Number(item.dataset.parallax || 0.1);
    const offset = (rect.top - viewportHeight * 0.5) * speed;
    item.style.setProperty("--parallax-offset", `${offset.toFixed(1)}px`);
  });

  isTicking = false;
};

const requestParallaxUpdate = () => {
  if (reduceMotion || isTicking) {
    return;
  }

  isTicking = true;
  window.requestAnimationFrame(updateParallax);
};

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 10;
    const rotateX = (0.5 - y) * 10;

    card.style.setProperty("--tilt-rotate-x", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--tilt-rotate-y", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--tilt-lift", "-4px");
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--tilt-rotate-x", "0deg");
    card.style.setProperty("--tilt-rotate-y", "0deg");
    card.style.setProperty("--tilt-lift", "0px");
  });
});

syncScrollUi();
requestParallaxUpdate();

window.addEventListener("scroll", syncScrollUi, { passive: true });
window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 780) {
    setMenuState(false);
  }

  requestParallaxUpdate();
  syncScrollUi();
});
