(function () {
  const C = window.FLF_CONTENT;
  if (!C) return;

  const root = document.body.dataset.assetRoot || "";

  function el(sel) {
    return document.querySelector(sel);
  }

  function fillAll(sel, text) {
    document.querySelectorAll(sel).forEach((node) => {
      node.textContent = text;
    });
  }

  function resolveHref(href) {
    if (!href) return "#";
    if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) {
      return href;
    }
    if (href.startsWith("#")) {
      return root ? root + "index.html" + href : href;
    }
    /* file://: thư mục không tự mở index — chuẩn hoá .../ → .../index.html */
    let path = href;
    let suffix = "";
    const q = path.indexOf("?");
    const h = path.indexOf("#");
    const cut = q >= 0 ? q : h >= 0 ? h : -1;
    if (cut >= 0) {
      suffix = path.slice(cut);
      path = path.slice(0, cut);
    }
    if (path.endsWith("/")) path += "index.html";
    return root + path + suffix;
  }

  function isActive(itemHref, current) {
    if (!current) return false;
    const norm = (s) =>
      s
        .replace(/index\.html$/i, "")
        .replace(/\/$/, "")
        .replace(/\?.*$/, "");
    return norm(itemHref) === norm(current) || itemHref === current;
  }

  function navItemHtml(item, opts) {
    const { current, mobile } = opts;
    const href = resolveHref(item.href);
    const active = isActive(item.href, current);
    const children = Array.isArray(item.children) ? item.children : null;
    const idBase = "nav-" + item.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/gi, "");

    if (!children || !children.length) {
      return `<li><a href="${href}"${active ? ' aria-current="page"' : ""}>${item.label}</a></li>`;
    }

    const subId = `${idBase}-submenu${mobile ? "-mobile" : ""}`;
    const childLis = children
      .map((child) => {
        const childHref = resolveHref(child.href);
        return `<li><a href="${childHref}">${child.label}</a></li>`;
      })
      .join("");

    if (mobile) {
      return `<li class="nav-item has-children">
        <div class="nav-parent-row">
          <a href="${href}"${active ? ' aria-current="page"' : ""}>${item.label}</a>
          <button type="button" class="nav-sub-toggle" aria-expanded="false" aria-controls="${subId}" aria-label="Mở mục ${item.label}">
            <span aria-hidden="true">▾</span>
          </button>
        </div>
        <ul class="submenu" id="${subId}" hidden>${childLis}</ul>
      </li>`;
    }

    return `<li class="nav-item has-children">
      <a href="${href}" class="nav-parent"${active ? ' aria-current="page"' : ""} aria-haspopup="true" aria-expanded="false" aria-controls="${subId}" data-submenu-trigger>${item.label}<span class="nav-caret" aria-hidden="true">▾</span></a>
      <ul class="submenu" id="${subId}" role="list">${childLis}</ul>
    </li>`;
  }

  function fillNav(ul, mobile) {
    if (!ul) return;
    const current = document.body.dataset.navCurrent || "";
    ul.innerHTML = C.nav.map((item) => navItemHtml(item, { current, mobile })).join("");
  }

  fillNav(el("[data-nav]"), false);
  fillNav(el("[data-nav-mobile]"), true);

  fillAll("[data-brand-text]", C.brand);
  fillAll("[data-tagline]", C.tagline);
  fillAll("[data-demo-note]", C.demoNote);

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

  document.querySelectorAll('a[href="#contact"], a[href="#services"], a[href="#top"]').forEach((a) => {
    a.setAttribute("href", resolveHref(a.getAttribute("href")));
  });

  const aboutGrid = el("[data-about-points]");
  if (aboutGrid) {
    aboutGrid.innerHTML = C.about.points
      .map((p) => `<article class="point"><h3>${p.title}</h3><p>${p.text}</p></article>`)
      .join("");
  }

  const services = el("[data-services]");
  if (services) {
    services.innerHTML = C.services.items
      .map((s) => `<article class="service-item"><h3>${s.title}</h3><p>${s.text}</p></article>`)
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
    partnerItems.innerHTML = C.partners.items.map((t) => `<li>${t}</li>`).join("");
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

  // —— Desktop submenu (hover + keyboard) ——
  document.querySelectorAll(".nav-desktop .has-children").forEach((item) => {
    const trigger = item.querySelector("[data-submenu-trigger]");
    const submenu = item.querySelector(".submenu");
    if (!trigger || !submenu) return;

    function setOpen(open) {
      item.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    }

    item.addEventListener("mouseenter", () => setOpen(true));
    item.addEventListener("mouseleave", () => setOpen(false));

    trigger.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
        const first = submenu.querySelector("a");
        if (first) first.focus();
      }
      if (e.key === "Escape") {
        setOpen(false);
        trigger.focus();
      }
    });

    submenu.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        trigger.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (!item.contains(e.target)) setOpen(false);
    });
  });

  // —— Mobile menu: open/close, Escape, aria, focus ——
  const toggle = el("[data-menu-toggle]");
  const mobile = el("[data-mobile-panel]");
  const mobileBackdrop = el("[data-menu-backdrop]");
  let lastFocus = null;

  function getFocusable(container) {
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((node) => !node.hasAttribute("hidden") && node.offsetParent !== null);
  }

  function setMobileOpen(open) {
    if (!toggle || !mobile) return;
    mobile.classList.toggle("is-open", open);
    mobile.hidden = !open;
    mobile.setAttribute("aria-hidden", open ? "false" : "true");
    if ("inert" in mobile) {
      mobile.inert = !open;
    }
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
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
    toggle.addEventListener("click", () => {
      setMobileOpen(!mobile.classList.contains("is-open"));
    });

    mobile.addEventListener("click", (e) => {
      const subBtn = e.target.closest(".nav-sub-toggle");
      if (subBtn) {
        const subId = subBtn.getAttribute("aria-controls");
        const submenu = subId ? document.getElementById(subId) : null;
        if (!submenu) return;
        const open = submenu.hasAttribute("hidden");
        if (open) submenu.removeAttribute("hidden");
        else submenu.setAttribute("hidden", "");
        subBtn.setAttribute("aria-expanded", open ? "true" : "false");
        return;
      }
      const link = e.target.closest("a[href]");
      if (link) setMobileOpen(false);
    });

    document.addEventListener("keydown", (e) => {
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
    mobileBackdrop.addEventListener("click", () => setMobileOpen(false));
  }

  // —— Section list / article pages ——
  const pageKind = document.body.dataset.page;
  const articleSlug = document.body.dataset.slug;

  function statusClass(status) {
    if (status === "effective") return "status-effective";
    if (status === "pending") return "status-pending";
    return "status-draft";
  }

  function renderNewsList(container) {
    const meta = C.sectionMeta.news;
    fillAll("[data-section-title]", meta.title);
    fillAll("[data-section-lead]", meta.lead);
    container.innerHTML = C.news
      .map(
        (n) => `<article class="post-card">
          <p class="post-meta"><span class="pill pill-news">Tin tức FLF</span> <time>${n.date}</time> <span class="demo-label">Minh họa</span></p>
          <h3><a href="bai-mau.html">${n.title}</a></h3>
          <p>${n.excerpt}</p>
          <a class="text-link" href="bai-mau.html">Đọc bài mẫu (cùng layout)</a>
        </article>`
      )
      .join("");
  }

  function renderRegList(container) {
    const meta = C.sectionMeta.regulations;
    fillAll("[data-section-title]", meta.title);
    fillAll("[data-section-lead]", meta.lead);
    const filter = el("[data-reg-filter]");
    function paint(status) {
      const items = C.regulations.filter((r) => !status || status === "all" || r.status === status);
      if (!items.length) {
        container.innerHTML = `<div class="empty-state" role="status">
          <p>${meta.empty}</p>
          <p class="demo-label">Bộ lọc trạng thái chỉ minh họa — chưa nối CMS.</p>
        </div>`;
        return;
      }
      container.innerHTML = items
        .map(
          (r) => `<article class="post-card">
            <p class="post-meta">
              <span class="pill ${statusClass(r.status)}">${r.statusLabel}</span>
              <span class="demo-label">Minh họa</span>
            </p>
            <h3><a href="${r.slug}.html">${r.title}</a></h3>
            <p class="meta-line">${r.docNumber}</p>
            <p>${r.excerpt}</p>
            <a class="text-link" href="${r.slug}.html">Xem bố cục bài</a>
          </article>`
        )
        .join("");
    }
    paint("all");
    if (filter) {
      filter.addEventListener("change", () => paint(filter.value));
    }
  }

  function renderTopicList(container) {
    const meta = C.sectionMeta.topics;
    fillAll("[data-section-title]", meta.title);
    fillAll("[data-section-lead]", meta.lead);

    const chips = el("[data-topic-filters]");
    const search = el("[data-topic-search]");
    const params = new URLSearchParams(window.location.search);
    let activeTopic = params.get("chu-de") || "all";
    let query = "";

    if (chips) {
      chips.innerHTML = C.topicFilters
        .map(
          (t) =>
            `<button type="button" class="chip${t.id === activeTopic ? " is-active" : ""}" data-topic="${t.id}">${t.label}</button>`
        )
        .join("");
      chips.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-topic]");
        if (!btn) return;
        activeTopic = btn.getAttribute("data-topic");
        chips.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-active", c === btn));
        try {
          const url = new URL(window.location.href);
          if (activeTopic === "all") url.searchParams.delete("chu-de");
          else url.searchParams.set("chu-de", activeTopic);
          window.history.replaceState({}, "", url);
        } catch (_) {
          /* một số trình duyệt hạn chế history trên file:// — bỏ qua */
        }
        paint();
      });
    }

    if (search) {
      search.addEventListener("input", () => {
        query = search.value.trim().toLowerCase();
        paint();
      });
    }

    function paint() {
      let items = C.topics.slice();
      if (activeTopic && activeTopic !== "all") {
        items = items.filter((t) => t.topic === activeTopic);
      }
      if (query) {
        items = items.filter(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            t.excerpt.toLowerCase().includes(query) ||
            t.topicLabel.toLowerCase().includes(query)
        );
      }
      if (!items.length) {
        container.innerHTML = `<div class="empty-state" role="status">
          <p>${meta.empty}</p>
          <p class="demo-label">Tìm kiếm &amp; bộ lọc chủ đề chỉ minh họa giao diện.</p>
          <a class="text-link" href="./index.html">Xóa bộ lọc (tải lại)</a>
        </div>`;
        return;
      }
      container.innerHTML = items
        .map((t) => {
          const href = `${t.slug}.html`;
          return `<article class="post-card">
            <p class="post-meta">
              <span class="pill pill-topic">${t.topicLabel}</span>
              <time>${t.date}</time>
              <span class="demo-label">Minh họa</span>
            </p>
            <h3><a href="${href}">${t.title}</a></h3>
            <p>${t.excerpt}</p>
            <a class="text-link" href="${href}">Đọc bài mẫu</a>
          </article>`;
        })
        .join("");
    }
    paint();
  }

  function fillArticleCommon(article, backHref, backLabel) {
    fillAll("[data-article-title]", article.title);
    fillAll("[data-article-date]", article.date || "");
    const body = el("[data-article-body]");
    if (body) {
      body.innerHTML = article.body.map((p) => `<p>${p}</p>`).join("");
    }
    const back = el("[data-back-list]");
    if (back) {
      back.href = backHref;
      back.textContent = backLabel;
    }
  }

  if (pageKind === "news-list") {
    const list = el("[data-post-list]");
    if (list) renderNewsList(list);
  }

  if (pageKind === "reg-list") {
    const list = el("[data-post-list]");
    if (list) renderRegList(list);
  }

  if (pageKind === "topic-list") {
    const list = el("[data-post-list]");
    if (list) renderTopicList(list);
  }

  if (pageKind === "news-article") {
    const article = C.news.find((n) => n.slug === (articleSlug || "bai-mau")) || C.news[0];
    fillArticleCommon(article, "./", "← Quay lại danh sách Tin tức");
    fillAll("[data-article-kicker]", "Tin tức · Hoạt động FLF");
  }

  if (pageKind === "reg-article") {
    const article =
      C.regulations.find((r) => r.slug === (articleSlug || "bai-mau")) || C.regulations[0];
    fillArticleCommon(article, "./", "← Quay lại danh sách Quy định mới");
    fillAll("[data-article-kicker]", "Quy định mới");
    fillAll("[data-reg-status]", article.statusLabel);
    const statusEl = el("[data-reg-status]");
    if (statusEl) {
      statusEl.className = "pill " + statusClass(article.status);
    }
    const metaBox = el("[data-reg-meta]");
    if (metaBox) {
      metaBox.innerHTML = [
        ["Số hiệu văn bản", article.docNumber],
        ["Cơ quan ban hành", article.issuer],
        ["Ngày ban hành", article.issuedDate],
        ["Ngày hiệu lực", article.effectiveDate],
        ["Nguồn chính thức", article.officialSource],
        ["Ngày cập nhật trên web", article.updatedAt],
        ["Người duyệt", article.approvedBy],
      ]
        .map(
          ([k, v]) =>
            `<div class="reg-meta-row"><dt>${k}</dt><dd>${v}</dd></div>`
        )
        .join("");
    }
  }

  if (pageKind === "topic-article") {
    const article = C.topics.find((t) => t.slug === (articleSlug || "bai-mau")) || C.topics[0];
    fillArticleCommon(article, "./", "← Quay lại danh sách Chuyên mục");
    fillAll("[data-article-kicker]", "Chuyên mục · " + article.topicLabel);
    fillAll("[data-topic-label]", article.topicLabel);
  }

  /* Form / CTA liên hệ: chỉ minh họa — không gửi, không báo thành công giả */
  document.querySelectorAll("[data-contact-cta]").forEach((cta) => {
    cta.setAttribute("href", "#contact");
    cta.addEventListener("click", (e) => {
      e.preventDefault();
      let note = document.getElementById("flf-demo-contact-note");
      if (!note) {
        note = document.createElement("p");
        note.id = "flf-demo-contact-note";
        note.className = "demo-banner";
        note.setAttribute("role", "status");
        note.textContent =
          "Minh họa giao diện — chưa có backend. Yêu cầu liên hệ chưa được gửi. Không có thông báo gửi thành công giả.";
        cta.insertAdjacentElement("afterend", note);
      }
      note.focus?.();
    });
  });

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
