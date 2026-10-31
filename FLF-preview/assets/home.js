/**
 * FLF Preview — tương tác cục bộ (menu, form minh họa, reveal).
 * Không dùng API, fetch, localStorage hay mạng để hiển thị nội dung / đổi ngôn ngữ.
 */
(function () {
  "use strict";

  function el(sel, root) {
    return (root || document).querySelector(sel);
  }

  /* —— Mobile menu —— */
  const toggle = el("[data-menu-toggle]");
  const mobile = el("[data-mobile-panel]");
  const mobileBackdrop = el("[data-menu-backdrop]");
  let lastFocus = null;

  function getFocusable(container) {
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((node) => !node.hasAttribute("hidden") && node.offsetParent !== null);
  }

  function setMobileOpen(open) {
    if (!toggle || !mobile) return;
    mobile.classList.toggle("is-open", open);
    mobile.hidden = !open;
    mobile.setAttribute("aria-hidden", open ? "false" : "true");
    if ("inert" in mobile) mobile.inert = !open;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    const openLabel = toggle.getAttribute("data-label-open") || "Mở menu";
    const closeLabel = toggle.getAttribute("data-label-close") || "Đóng menu";
    toggle.setAttribute("aria-label", open ? closeLabel : openLabel);
    document.body.classList.toggle("nav-open", open);
    if (mobileBackdrop) {
      mobileBackdrop.hidden = !open;
      mobileBackdrop.classList.toggle("is-open", open);
    }
    if (open) {
      lastFocus = document.activeElement;
      const focusables = getFocusable(mobile);
      (focusables[0] || mobile).focus({ preventScroll: true });
    } else if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus({ preventScroll: true });
    }
  }

  if (mobile) {
    mobile.hidden = true;
    mobile.setAttribute("aria-hidden", "true");
    if ("inert" in mobile) mobile.inert = true;
  }

  if (toggle && mobile) {
    toggle.addEventListener("click", function () {
      setMobileOpen(!mobile.classList.contains("is-open"));
    });
    mobile.addEventListener("click", function (e) {
      const link = e.target.closest("a[href]");
      if (link) setMobileOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (!mobile.classList.contains("is-open")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = getFocusable(mobile);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener("click", function () {
      setMobileOpen(false);
    });
  }

  /* —— Contact form: Preview only — never fake success —— */
  const form = el("[data-preview-form]");
  const formNote = el("[data-form-note]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (formNote) {
        formNote.hidden = false;
        formNote.focus?.();
        formNote.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  document.querySelectorAll("[data-demo-contact]").forEach(function (cta) {
    cta.addEventListener("click", function (e) {
      if (cta.getAttribute("href") === "#contact" || cta.tagName === "BUTTON") {
        /* allow hash navigation; if button outside form, show note near contact */
        return;
      }
    });
  });

  /* —— Reveal on scroll —— */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (node) {
      io.observe(node);
    });
  } else {
    reveals.forEach(function (node) {
      node.classList.add("is-visible");
    });
  }
})();
