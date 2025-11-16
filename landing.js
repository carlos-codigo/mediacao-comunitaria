/* ===========================================================
   LANDING PAGE — JS MASTER PACK
   Efeitos Avançados + Animações + Parallax + Scroll
   =========================================================== */

/* -----------------------------------------------------------
   UTIL — Seletores rápidos
----------------------------------------------------------- */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* ===========================================================
   MOBILE MENU
=========================================================== */
const menuBtn = $(".menu-btn");
const mobileMenu = $(".mobile-menu");
const closeMenu = $(".close-menu");

menuBtn?.addEventListener("click", () => {
  mobileMenu.classList.add("open");
});

closeMenu?.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
});

mobileMenu?.addEventListener("click", (e) => {
  if (e.target.tagName === "A") mobileMenu.classList.remove("open");
});

/* ===========================================================
   NAVBAR DINÂMICA (muda estilo no scroll)
=========================================================== */
/*const navbar = $(".navbar");

let lastScroll = 0;
window.addEventListener("scroll", () => {
  const current = window.scrollY;

  if (current > 80) {
    navbar.style.background = "rgba(10,15,30,0.85)";
    navbar.style.backdropFilter = "blur(14px)";
  } else {
    navbar.style.background = "rgba(10,15,30,0.55)";
  }

  lastScroll = current;
});

/* ===========================================================
   SCROLL SUAVE
=========================================================== */
$$("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = $(link.getAttribute("href"));
    if (!target) return;

    e.preventDefault();
    window.scrollTo({
      top: target.offsetTop - 60,
      behavior: "smooth",
    });
  });
});

/* ===========================================================
   ANIMAÇÕES DE ENTRADA (reveal)
=========================================================== */
const revealElements = [
  ".hero h1",
  ".hero-sub",
  ".hero-buttons",
  ".section-title",
  ".sobre-text",
  ".sobre-card",
  ".step",
  ".recurso-card",
  ".contato h2",
  ".contato-btn",
];

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("reveal-show");
      }
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach((sel) => {
  $$(sel).forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
});

/* ===========================================================
   PARALLAX LEVE NO HERO
=========================================================== */
const heroBg = $(".hero-bg");

window.addEventListener("scroll", () => {
  const y = window.scrollY * 0.35;
  if (heroBg) heroBg.style.transform = `translateY(${y}px)`;
});

/* ===========================================================
   PARALLAX NO MOUSE (mobile-friendly)
=========================================================== */
const icons = $$(".floating-icons .icon");

document.addEventListener("pointermove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 10;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;

  icons.forEach((icon, i) => {
    const speed = (i + 1) * 1.5;
    icon.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
});

/* ===========================================================
   TILT 3D NOS CARDS
=========================================================== */
const tiltCards = [
  ...$$(".sobre-card"),
  ...$$(".step"),
  ...$$(".recurso-card"),
];

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 14;
    const rotateX = ((y / rect.height) - 0.5) * -14;

    card.style.transform =
      `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform =
      `perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)`;
  });
});

/* ===========================================================
   EFEITO DE DIGITAÇÃO (Typing Animation)
=========================================================== */
function typeText(element, text, speed = 50) {
  let i = 0;
  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}

const typingTarget = $(".typing-effect");
if (typingTarget) {
  const text = typingTarget.dataset.text;
  typingTarget.innerHTML = "";
  typeText(typingTarget, text, 55);
}

/* ===========================================================
   BOTÃO DE VOLTAR AO TOPO
=========================================================== */
const backTop = document.createElement("div");
backTop.className = "back-top-btn";
backTop.innerHTML = "↑";
document.body.appendChild(backTop);

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  backTop.style.opacity = window.scrollY > 300 ? "1" : "0";
});

/* ===========================================================
   FINAL
=========================================================== */
console.log("%cLanding carregada com sucesso.", "color:#22c55e;font-size:14px");
