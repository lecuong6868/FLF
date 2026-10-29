#!/usr/bin/env node
/** Sinh trang danh sách / bài mẫu cho option-a và option-b. */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function shellA(opts) {
  const {
    title,
    page,
    slug = "",
    navCurrent,
    main,
    review = "Phương án A",
  } = opts;
  return `<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} — FLF mockup A</title>
    <meta name="description" content="Preview minh họa ${title}. Bản thiết kế chờ duyệt." />
    <meta name="robots" content="noindex, nofollow, noarchive" />
    <link rel="icon" href="../../public/brand/logo-color.png" type="image/png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../styles.css" />
  </head>
  <body id="top" data-asset-root="../" data-page="${page}"${slug ? ` data-slug="${slug}"` : ""} data-nav-current="${navCurrent}">
    <a class="skip" href="#main">Bỏ qua đến nội dung chính</a>
    <div class="review-bar" role="note">
      <span>Bản thiết kế chờ duyệt · ${review} · Minh họa nội dung</span>
      <a href="../../index.html">← So sánh hai hướng</a>
    </div>
    <header class="site-header">
      <div class="wrap header-inner">
        <a class="brand" href="../index.html#top" aria-label="First Legal Force — trang chủ">
          <img src="../../public/brand/logo-color.png" alt="Logo First Legal Force" width="48" height="48" />
          <span data-brand-text>First Legal Force</span>
        </a>
        <nav class="nav-desktop" aria-label="Menu chính"><ul data-nav></ul></nav>
        <a class="btn btn-sm header-cta" href="../index.html#contact" data-cta-primary>Liên hệ tư vấn</a>
        <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-nav" aria-label="Mở menu">
          <span></span><span></span>
        </button>
      </div>
      <div class="mobile-panel" id="mobile-nav" data-mobile-panel>
        <nav aria-label="Menu mobile"><ul data-nav-mobile></ul></nav>
      </div>
    </header>
    <main id="main">${main}</main>
    <footer class="site-footer">
      <div class="wrap footer-inner">
        <div class="footer-brand">
          <img src="../../public/brand/logo-color.png" alt="" width="40" height="40" />
          <div>
            <strong data-brand-text>First Legal Force</strong>
            <p data-footer-legal></p>
            <p data-footer-mst></p>
            <p class="muted" data-footer-note></p>
          </div>
        </div>
        <div class="footer-social">
          <span>Kết nối</span>
          <a data-facebook href="#" rel="noopener noreferrer" target="_blank">Facebook</a>
          <a data-linkedin href="#" rel="noopener noreferrer" target="_blank">LinkedIn</a>
        </div>
      </div>
    </footer>
    <script src="../../shared/content.js"></script>
    <script src="../../shared/render.js"></script>
  </body>
</html>
`;
}

function shellB(opts) {
  const {
    title,
    page,
    slug = "",
    navCurrent,
    main,
    review = "Phương án B",
  } = opts;
  return `<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} — FLF mockup B</title>
    <meta name="description" content="Preview minh họa ${title}. Bản thiết kế chờ duyệt." />
    <meta name="robots" content="noindex, nofollow, noarchive" />
    <link rel="icon" href="../../public/brand/logo-color.png" type="image/png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../styles.css" />
  </head>
  <body id="top" data-asset-root="../" data-page="${page}"${slug ? ` data-slug="${slug}"` : ""} data-nav-current="${navCurrent}">
    <a class="skip" href="#main">Bỏ qua đến nội dung chính</a>
    <div class="review-bar" role="note">
      <span>Bản thiết kế chờ duyệt · ${review} · Minh họa nội dung</span>
      <a href="../../index.html">← So sánh hai hướng</a>
    </div>
    <header class="site-header">
      <div class="wrap header-inner">
        <a class="brand" href="../index.html#top" aria-label="First Legal Force — trang chủ">
          <img src="../../public/brand/logo-color.png" alt="Logo First Legal Force" width="52" height="52" />
          <span class="brand-lockup">
            <strong data-brand-text>First Legal Force</strong>
            <em>Tư vấn đa lĩnh vực</em>
          </span>
        </a>
        <nav class="nav-desktop" aria-label="Menu chính"><ul data-nav></ul></nav>
        <a class="btn btn-sm header-cta" href="../index.html#contact" data-cta-primary>Liên hệ tư vấn</a>
        <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-nav" aria-label="Mở menu">Menu</button>
      </div>
      <div class="menu-backdrop" data-menu-backdrop hidden></div>
      <div class="mobile-panel" id="mobile-nav" data-mobile-panel hidden aria-hidden="true">
        <nav aria-label="Menu mobile"><ul data-nav-mobile></ul></nav>
      </div>
    </header>
    <main id="main">${main}</main>
    <footer class="site-footer">
      <div class="wrap footer-grid">
        <div>
          <img src="../../public/brand/first-legal-force.png" alt="FIRST - LEGAL FORCE" class="wordmark" width="220" height="80" />
          <p data-footer-legal></p>
          <p data-footer-mst></p>
          <p class="muted" data-footer-note></p>
        </div>
        <div class="footer-social">
          <span>Kết nối</span>
          <a data-facebook href="#" rel="noopener noreferrer" target="_blank">Facebook</a>
          <a data-linkedin href="#" rel="noopener noreferrer" target="_blank">LinkedIn</a>
        </div>
      </div>
    </footer>
    <script src="../../shared/content.js"></script>
    <script src="../../shared/render.js"></script>
  </body>
</html>
`;
}

const newsListMain = `
      <section class="page-hero">
        <div class="wrap">
          <p class="demo-banner">Minh họa UI · Tin tức = hoạt động FLF</p>
          <h1 data-section-title>Tin tức</h1>
          <p class="lead" data-section-lead></p>
        </div>
      </section>
      <section class="content-section">
        <div class="wrap">
          <div class="post-list" data-post-list></div>
        </div>
      </section>`;

const newsArticleMain = `
      <article class="article-wrap">
        <p class="back-row"><a data-back-list href="./">← Quay lại danh sách</a></p>
        <p class="demo-banner">Bài mẫu · Nội dung minh họa</p>
        <p class="kicker" data-article-kicker></p>
        <h1 data-article-title></h1>
        <p class="post-meta"><time data-article-date></time></p>
        <div class="article-body" data-article-body></div>
        <p class="illus-note" data-demo-note></p>
      </article>`;

const regListMain = `
      <section class="page-hero">
        <div class="wrap">
          <p class="demo-banner">Minh họa UI · Quy định mới = văn bản / chính sách</p>
          <h1 data-section-title>Quy định mới</h1>
          <p class="lead" data-section-lead></p>
        </div>
      </section>
      <section class="content-section">
        <div class="wrap">
          <div class="toolbar">
            <label for="reg-filter">Lọc trạng thái (minh họa)</label>
            <select id="reg-filter" data-reg-filter>
              <option value="all">Tất cả</option>
              <option value="effective">Đang có hiệu lực</option>
              <option value="pending">Chưa có hiệu lực</option>
              <option value="draft">Dự thảo</option>
            </select>
          </div>
          <div class="post-list" data-post-list></div>
        </div>
      </section>`;

const regArticleMain = `
      <article class="article-wrap">
        <p class="back-row"><a data-back-list href="./">← Quay lại danh sách</a></p>
        <p class="demo-banner">Bài mẫu · Metadata minh họa — không phải văn bản thật</p>
        <p class="kicker" data-article-kicker></p>
        <p><span data-reg-status class="pill">—</span></p>
        <h1 data-article-title></h1>
        <dl class="reg-meta" data-reg-meta></dl>
        <div class="article-body" data-article-body></div>
        <p class="illus-note" data-demo-note></p>
      </article>`;

const topicListMain = `
      <section class="page-hero">
        <div class="wrap">
          <p class="demo-banner">Minh họa UI · Chuyên mục = phân tích theo chủ đề</p>
          <h1 data-section-title>Chuyên mục</h1>
          <p class="lead" data-section-lead></p>
        </div>
      </section>
      <section class="content-section">
        <div class="wrap">
          <div class="toolbar">
            <label for="topic-search">Tìm kiếm (minh họa)</label>
            <input id="topic-search" type="search" data-topic-search placeholder="Nhập từ khóa…" autocomplete="off" />
          </div>
          <div class="chip-row" data-topic-filters aria-label="Bộ lọc chủ đề minh họa"></div>
          <div class="post-list" data-post-list></div>
        </div>
      </section>`;

const topicArticleMain = `
      <article class="article-wrap">
        <p class="back-row"><a data-back-list href="./">← Quay lại danh sách</a></p>
        <p class="demo-banner">Bài mẫu · Chuyên mục minh họa</p>
        <p class="kicker" data-article-kicker></p>
        <h1 data-article-title></h1>
        <p class="post-meta"><span class="pill pill-topic" data-topic-label></span> <time data-article-date></time></p>
        <div class="article-body" data-article-body></div>
        <p class="illus-note" data-demo-note></p>
      </article>`;

const pages = [
  { dir: "tin-tuc", file: "index.html", title: "Tin tức", page: "news-list", nav: "tin-tuc/", main: newsListMain },
  { dir: "tin-tuc", file: "bai-mau.html", title: "Bài tin mẫu", page: "news-article", slug: "bai-mau", nav: "tin-tuc/", main: newsArticleMain },
  { dir: "quy-dinh-moi", file: "index.html", title: "Quy định mới", page: "reg-list", nav: "quy-dinh-moi/", main: regListMain },
  { dir: "quy-dinh-moi", file: "bai-mau.html", title: "Quy định mẫu", page: "reg-article", slug: "bai-mau", nav: "quy-dinh-moi/", main: regArticleMain },
  { dir: "quy-dinh-moi", file: "du-thao.html", title: "Quy định dự thảo mẫu", page: "reg-article", slug: "du-thao", nav: "quy-dinh-moi/", main: regArticleMain },
  { dir: "quy-dinh-moi", file: "chua-hieu-luc.html", title: "Quy định chưa hiệu lực mẫu", page: "reg-article", slug: "chua-hieu-luc", nav: "quy-dinh-moi/", main: regArticleMain },
  { dir: "chuyen-muc", file: "index.html", title: "Chuyên mục", page: "topic-list", nav: "chuyen-muc/", main: topicListMain },
  { dir: "chuyen-muc", file: "bai-mau.html", title: "Bài chuyên mục mẫu", page: "topic-article", slug: "bai-mau", nav: "chuyen-muc/", main: topicArticleMain },
  { dir: "chuyen-muc", file: "thue-minh-hoa.html", title: "Chuyên mục thuế mẫu", page: "topic-article", slug: "thue-minh-hoa", nav: "chuyen-muc/", main: topicArticleMain },
  { dir: "chuyen-muc", file: "tuan-thu-minh-hoa.html", title: "Chuyên mục tuân thủ mẫu", page: "topic-article", slug: "tuan-thu-minh-hoa", nav: "chuyen-muc/", main: topicArticleMain },
];

for (const opt of ["option-a", "option-b"]) {
  const shell = opt === "option-a" ? shellA : shellB;
  for (const p of pages) {
    const dir = join(root, opt, p.dir);
    mkdirSync(dir, { recursive: true });
    const html = shell({
      title: p.title,
      page: p.page,
      slug: p.slug || "",
      navCurrent: p.nav,
      main: p.main,
    });
    writeFileSync(join(dir, p.file), html, "utf8");
    console.log("wrote", join(opt, p.dir, p.file));
  }
}
