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
    return root + href;
  }

  function fillNav(ul) {
    if (!ul) return;
    const current = document.body.dataset.navCurrent || "";
    ul.innerHTML = C.nav
      .map((item) => {
        const href = resolveHref(item.href);
        const active =
          current &&
          (item.href === current ||
            item.href.replace(/\/$/, "") === current.replace(/\/$/, ""));
        return `<li><a href="${href}"${active ? ' aria-current="page"' : ""}>${item.label}</a></li>`;
      })
      .join("");
  }

  fillNav(el("[data-nav]"));
  fillNav(el("[data-nav-mobile]"));

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

  // Fix homepage CTAs that use #contact / #services when on nested pages
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

  const toggle = el("[data-menu-toggle]");
  const mobile = el("[data-mobile-panel]");
  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      const open = mobile.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
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
    let activeTopic = "all";
    let query = "";

    if (chips) {
      chips.innerHTML = C.topicFilters
        .map(
          (t) =>
            `<button type="button" class="chip${t.id === "all" ? " is-active" : ""}" data-topic="${t.id}">${t.label}</button>`
        )
        .join("");
      chips.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-topic]");
        if (!btn) return;
        activeTopic = btn.getAttribute("data-topic");
        chips.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-active", c === btn));
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
      // Special empty demo: topic "rui-ro" has no articles
      if (!items.length) {
        container.innerHTML = `<div class="empty-state" role="status">
          <p>${meta.empty}</p>
          <p class="demo-label">Tìm kiếm &amp; bộ lọc chủ đề chỉ minh họa giao diện.</p>
          <a class="text-link" href="?">Xóa bộ lọc (tải lại)</a>
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
