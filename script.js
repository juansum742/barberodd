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

const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const tiltCards = window.matchMedia("(hover: hover)").matches
  ? document.querySelectorAll("[data-tilt]")
  : [];

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
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
  if (isTicking) {
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

syncHeader();
requestParallaxUpdate();

window.addEventListener("scroll", syncHeader, { passive: true });
window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
window.addEventListener("resize", requestParallaxUpdate);
