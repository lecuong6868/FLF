(function () {
  const C = window.FLF_CONTENT;
  if (!C) return;

  function el(sel) {
    return document.querySelector(sel);
  }

  function fillAll(sel, text) {
    document.querySelectorAll(sel).forEach((node) => {
      node.textContent = text;
    });
  }

  function fillNav(ul) {
    if (!ul) return;
    ul.innerHTML = C.nav
      .map((item) => `<li><a href="${item.href}">${item.label}</a></li>`)
      .join("");
  }

  fillNav(el("[data-nav]"));
  fillNav(el("[data-nav-mobile]"));

  fillAll("[data-brand-text]", C.brand);
  fillAll("[data-tagline]", C.tagline);

  const map = {
    "[data-hero-eyebrow]": C.hero.eyebrow,
    "[data-hero-headline]": C.hero.headline,
    "[data-hero-sub]": C.hero.sub,
    "[data-cta-primary]": C.hero.ctaPrimary,
    "[data-cta-secondary]": C.hero.ctaSecondary,
    "[data-about-title]": C.about.title,
    "[data-about-lead]": C.about.lead,
    "[data-services-title]": C.services.title,
    "[data-services-note]": C.services.note,
    "[data-process-title]": C.process.title,
    "[data-partners-title]": C.partners.title,
    "[data-partners-lead]": C.partners.lead,
    "[data-contact-title]": C.contact.title,
    "[data-contact-lead]": C.contact.lead,
    "[data-contact-cta]": C.contact.cta,
    "[data-contact-privacy]": C.contact.privacy,
    "[data-footer-legal]": C.footer.legalName,
    "[data-footer-mst]": C.footer.mst,
    "[data-footer-note]": C.footer.note,
  };

  Object.entries(map).forEach(([sel, text]) => fillAll(sel, text));

  const aboutGrid = el("[data-about-points]");
  if (aboutGrid) {
    aboutGrid.innerHTML = C.about.points
      .map(
        (p) =>
          `<article class="point"><h3>${p.title}</h3><p>${p.text}</p></article>`
      )
      .join("");
  }

  const services = el("[data-services]");
  if (services) {
    services.innerHTML = C.services.items
      .map(
        (s) =>
          `<article class="service-item"><h3>${s.title}</h3><p>${s.text}</p></article>`
      )
      .join("");
  }

  const steps = el("[data-steps]");
  if (steps) {
    steps.innerHTML = C.process.steps
      .map(
        (s) =>
          `<li class="step"><span class="step-n">${s.n}</span><div><h3>${s.title}</h3><p>${s.text}</p></div></li>`
      )
      .join("");
  }

  const partnerItems = el("[data-partner-items]");
  if (partnerItems) {
    partnerItems.innerHTML = C.partners.items
      .map((t) => `<li>${t}</li>`)
      .join("");
  }

  const fb = el("[data-facebook]");
  if (fb) {
    fb.href = C.footer.facebook;
    fb.textContent = "Facebook";
  }
  const li = el("[data-linkedin]");
  if (li) {
    li.href = C.footer.linkedin;
    li.textContent = "LinkedIn";
  }

  const toggle = el("[data-menu-toggle]");
  const mobile = el("[data-mobile-panel]");
  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      const open = mobile.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Motion: reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((r) => io.observe(r));
  } else {
    reveals.forEach((r) => r.classList.add("is-visible"));
  }
})();
