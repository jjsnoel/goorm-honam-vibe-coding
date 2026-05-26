/**
 * AI Vibe Coding Instructor Landing Page
 * 동준상 — 소개 웹페이지 인터랙션
 */

(function () {
  "use strict";

  // ===== Header scroll effect =====
  const header = document.getElementById("header");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ===== Mobile navigation =====
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen);
    navToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // ===== Typing effect (Hero slogan) =====
  const typingEl = document.querySelector(".typing-target");
  if (typingEl) {
    const text = typingEl.dataset.text || "";
    let index = 0;
    typingEl.textContent = "";

    const type = () => {
      if (index < text.length) {
        typingEl.textContent += text.charAt(index);
        index++;
        setTimeout(type, 60);
      } else {
        typingEl.classList.add("typing-done");
      }
    };

    setTimeout(type, 800);
  }

  // ===== Fade-in on scroll =====
  const fadeEls = document.querySelectorAll(".fade-in");
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  fadeEls.forEach((el) => fadeObserver.observe(el));

  // ===== Skill progress bars =====
  const skillBars = document.querySelectorAll(".skill-bar");
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const level = entry.target.dataset.level || 0;
          const fill = entry.target.querySelector(".fill");
          if (fill) fill.style.width = `${level}%`;
        }
      });
    },
    { threshold: 0.3 }
  );
  skillBars.forEach((bar) => barObserver.observe(bar));

  // ===== Project filter =====
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const category = card.dataset.category;
        const show = filter === "all" || category === filter;
        card.classList.toggle("hidden", !show);
      });
    });
  });

  // ===== Particle background =====
  const particlesContainer = document.getElementById("particles");
  if (particlesContainer) {
    const count = window.innerWidth < 768 ? 20 : 40;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 15}s`;
      p.style.animationDuration = `${12 + Math.random() * 10}s`;
      particlesContainer.appendChild(p);
    }
  }

  // ===== Smooth scroll offset for fixed header =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();
