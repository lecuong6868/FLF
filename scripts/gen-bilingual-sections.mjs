#!/usr/bin/env node
/**
 * Sinh trang Quy định mới / Chuyên mục VI–EN trong FLF-preview,
 * đồng bộ header/footer/menu với trang chủ & Giới thiệu.
 * Không bịa văn bản pháp lý — danh sách quy định đã xác minh để trống.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const preview = path.join(root, "FLF-preview");

function write(rel, html) {
  const full = path.join(preview, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, "utf8");
  console.log("wrote", rel);
}

/** Nav items relative to a page under vi/ or en/ at depth 2 (e.g. vi/quy-dinh-moi/). */
function navVi(active) {
  const items = [
    { href: "../index.html", label: "Trang chủ", key: "home" },
    { href: "../gioi-thieu/index.html", label: "Giới thiệu", key: "about" },
    { href: "../index.html#services", label: "Lĩnh vực", key: "services" },
    { href: "../index.html#process", label: "Quy trình", key: "process" },
    { href: "./index.html", label: "Quy định mới", key: "regs", abs: "quy-dinh-moi" },
    { href: "../chuyen-muc/index.html", label: "Chuyên mục", key: "topics", abs: "chuyen-muc" },
    { href: "../index.html#contact", label: "Liên hệ", key: "contact" },
  ];
  return items
    .map((it) => {
      let href = it.href;
      if (it.abs === "quy-dinh-moi" && active !== "regs" && active !== "reg-article") {
        href = "../quy-dinh-moi/index.html";
      }
      if (it.abs === "chuyen-muc" && active !== "topics" && active !== "topic-article") {
        href = "../chuyen-muc/index.html";
      }
      if (active === "regs" || active === "reg-article") {
        if (it.key === "regs") href = "./index.html";
        if (it.key === "topics") href = "../chuyen-muc/index.html";
      }
      if (active === "topics" || active === "topic-article") {
        if (it.key === "topics") href = "./index.html";
        if (it.key === "regs") href = "../quy-dinh-moi/index.html";
      }
      const cur =
        (active === "regs" || active === "reg-article") && it.key === "regs"
          ? ' aria-current="page"'
          : (active === "topics" || active === "topic-article") && it.key === "topics"
            ? ' aria-current="page"'
            : "";
      return `<li><a href="${href}"${cur}>${it.label}</a></li>`;
    })
    .join("\n            ");
}

function navEn(active) {
  const items = [
    { href: "../index.html", label: "Home", key: "home" },
    { href: "../about/index.html", label: "About", key: "about" },
    { href: "../index.html#services", label: "Practice areas", key: "services" },
    { href: "../index.html#process", label: "Process", key: "process" },
    { href: "./index.html", label: "New regulations", key: "regs", abs: "regulations" },
    { href: "../topics/index.html", label: "Topics", key: "topics", abs: "topics" },
    { href: "../index.html#contact", label: "Contact", key: "contact" },
  ];
  return items
    .map((it) => {
      let href = it.href;
      if (active === "regs" || active === "reg-article") {
        if (it.key === "regs") href = "./index.html";
        if (it.key === "topics") href = "../topics/index.html";
      }
      if (active === "topics" || active === "topic-article") {
        if (it.key === "topics") href = "./index.html";
        if (it.key === "regs") href = "../regulations/index.html";
      }
      const cur =
        (active === "regs" || active === "reg-article") && it.key === "regs"
          ? ' aria-current="page"'
          : (active === "topics" || active === "topic-article") && it.key === "topics"
            ? ' aria-current="page"'
            : "";
      return `<li><a href="${href}"${cur}>${it.label}</a></li>`;
    })
    .join("\n            ");
}

function shell({
  lang,
  title,
  description,
  hreflangVi,
  hreflangEn,
  reviewNote,
  reviewLinkHref,
  reviewLinkLabel,
  active,
  langSwitchCurrent,
  langSwitchOtherHref,
  langSwitchOtherLabel,
  ctaHref,
  ctaLabel,
  main,
  footerLangLabel,
}) {
  const isVi = lang === "vi";
  const desktopNav = isVi ? navVi(active) : navEn(active);
  const mobileExtra = isVi
    ? `<li><a href="${langSwitchOtherHref}" lang="en" hreflang="en">English (EN)</a></li>`
    : `<li><a href="${langSwitchOtherHref}" lang="vi" hreflang="vi">Tiếng Việt (VI)</a></li>`;
  const viCur = langSwitchCurrent === "VI";
  const enCur = langSwitchCurrent === "EN";

  return `<!DOCTYPE html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="noindex, nofollow, noarchive" />
    <link rel="icon" href="../../public/brand/logo-color.png" type="image/png" />
    <link rel="alternate" hreflang="vi" href="${hreflangVi}" />
    <link rel="alternate" hreflang="en" href="${hreflangEn}" />
    <link rel="stylesheet" href="../../assets/styles.css" />
  </head>
  <body id="top">
    <a class="skip" href="#main">${isVi ? "Bỏ qua đến nội dung chính" : "Skip to main content"}</a>

    <div class="review-bar" role="note">
      <span>${reviewNote}</span>
      <a href="${reviewLinkHref}" hreflang="${isVi ? "en" : "vi"}" lang="${isVi ? "en" : "vi"}">${reviewLinkLabel}</a>
    </div>

    <header class="site-header">
      <div class="wrap header-inner">
        <a class="brand" href="../index.html" aria-label="First Legal Force — ${isVi ? "trang chủ" : "home"}">
          <img
            src="../../public/brand/logo-color.png"
            alt="Logo First Legal Force"
            width="52"
            height="52"
          />
          <span class="brand-lockup">
            <strong>First Legal Force</strong>
            <em>${isVi ? "Tư vấn đa lĩnh vực" : "Multi-practice advisory"}</em>
          </span>
        </a>
        <nav class="nav-desktop" aria-label="${isVi ? "Menu chính" : "Primary"}">
          <ul>
            ${desktopNav}
          </ul>
        </nav>
        <div class="header-tools">
          <nav class="lang-switch" aria-label="${isVi ? "Chọn ngôn ngữ" : "Language"}">
            ${
              viCur
                ? `<span aria-current="true">VI</span>
            <a href="${langSwitchOtherHref}" lang="en" hreflang="en">EN</a>`
                : `<a href="${langSwitchOtherHref}" lang="vi" hreflang="vi">VI</a>
            <span aria-current="true">EN</span>`
            }
          </nav>
          <a class="btn btn-sm header-cta" href="${ctaHref}">${ctaLabel}</a>
          <button
            class="menu-toggle"
            type="button"
            data-menu-toggle
            data-label-open="${isVi ? "Mở menu" : "Open menu"}"
            data-label-close="${isVi ? "Đóng menu" : "Close menu"}"
            aria-expanded="false"
            aria-controls="mobile-nav"
            aria-label="${isVi ? "Mở menu" : "Open menu"}"
          >
            Menu
          </button>
        </div>
      </div>
      <div class="menu-backdrop" data-menu-backdrop hidden></div>
      <div
        class="mobile-panel"
        id="mobile-nav"
        data-mobile-panel
        hidden
        aria-hidden="true"
      >
        <nav aria-label="${isVi ? "Menu mobile" : "Mobile"}">
          <ul>
            ${desktopNav}
            ${mobileExtra}
          </ul>
        </nav>
      </div>
    </header>

    <main id="main">
${main}
    </main>

    <footer class="site-footer">
      <div class="wrap footer-grid">
        <div>
          <img
            src="../../public/brand/first-legal-force.png"
            alt="FIRST - LEGAL FORCE"
            class="wordmark"
            width="220"
            height="80"
          />
          <p>CÔNG TY CỔ PHẦN GIẢI PHÁP LIÊN MINH LUẬT VIỆT NAM</p>
          <p>MST: 0314193708</p>
          <p class="muted">
            ${
              isVi
                ? "Địa chỉ hiển thị công khai: chờ xác nhận (không tự thay bằng thông tin suy đoán)."
                : "Public display address: pending client confirmation (not guessed)."
            }
          </p>
        </div>
        <div class="footer-social">
          <span>${isVi ? "Kết nối" : "Connect"}</span>
          <a
            href="https://www.facebook.com/firstlegalforce"
            rel="noopener noreferrer"
            target="_blank"
            >Facebook</a
          >
          <a
            href="https://www.linkedin.com/company/firstlegalforce/home/"
            rel="noopener noreferrer"
            target="_blank"
            >LinkedIn</a
          >
          <nav class="lang-switch" aria-label="${footerLangLabel}">
            ${
              viCur
                ? `<span aria-current="true">VI</span>
            <a href="${langSwitchOtherHref}" lang="en" hreflang="en">EN</a>`
                : `<a href="${langSwitchOtherHref}" lang="vi" hreflang="vi">VI</a>
            <span aria-current="true">EN</span>`
            }
          </nav>
        </div>
      </div>
    </footer>

    <script src="../../assets/home.js"></script>
  </body>
</html>
`;
}

/* —— Quy định mới VI —— */
const regListViMain = `      <section class="page-hero">
        <div class="wrap">
          <p class="demo-banner">Preview · Không bịa văn bản pháp lý</p>
          <h1>Quy định mới</h1>
          <p class="lead">
            Cập nhật văn bản / chính sách liên quan doanh nghiệp — có metadata số hiệu,
            cơ quan ban hành, ngày ban hành, ngày hiệu lực, tình trạng hiệu lực, tóm tắt
            tác động và liên kết nguồn chính thức. Chỉ đăng sau khi biên tập đối chiếu nguồn.
          </p>
        </div>
      </section>
      <section class="content-section">
        <div class="wrap">
          <div class="empty-state" role="status">
            <p><strong>Chưa có quy định đã xác minh.</strong></p>
            <p>
              Danh sách công khai đang trống có chủ đích — không tự bịa số hiệu, ngày hiệu lực
              hay khẳng định tình trạng chưa đối chiếu với nguồn chính thức (cổng công báo /
              cơ quan ban hành).
            </p>
            <p class="demo-label">Trạng thái trống · Chờ biên tập &amp; duyệt</p>
            <a class="text-link" href="./cau-truc-mau.html">Xem bố cục trang chi tiết (mẫu trống)</a>
          </div>
        </div>
      </section>`;

const regDetailViMain = `      <article class="article-wrap">
        <p class="back-row"><a href="./index.html">← Quay lại danh sách Quy định mới</a></p>
        <p class="demo-banner">Bố cục mẫu · Không phải văn bản đã ban hành</p>
        <p class="kicker">Quy định mới</p>
        <p><span class="pill status-draft">Chưa xác minh</span></p>
        <h1>Bố cục trang chi tiết quy định (chưa có nội dung xác minh)</h1>
        <dl class="reg-meta">
          <div class="reg-meta-row"><dt>Tiêu đề</dt><dd>Chưa có — chờ biên tập từ nguồn chính thức</dd></div>
          <div class="reg-meta-row"><dt>Số văn bản</dt><dd>—</dd></div>
          <div class="reg-meta-row"><dt>Cơ quan ban hành</dt><dd>—</dd></div>
          <div class="reg-meta-row"><dt>Ngày ban hành</dt><dd>—</dd></div>
          <div class="reg-meta-row"><dt>Ngày hiệu lực</dt><dd>—</dd></div>
          <div class="reg-meta-row"><dt>Tình trạng hiệu lực</dt><dd>Chưa xác minh</dd></div>
          <div class="reg-meta-row"><dt>Tóm tắt tác động với doanh nghiệp</dt><dd>Chưa có — không suy diễn</dd></div>
          <div class="reg-meta-row"><dt>Liên kết nguồn chính thức</dt><dd>Chưa gắn (sẽ là URL cổng công báo / cơ quan ban hành sau khi đối chiếu)</dd></div>
        </dl>
        <div class="article-body">
          <p>
            Trang này chỉ thể hiện <strong>cấu trúc trường dữ liệu</strong> sẽ dùng khi có nội dung
            đã xác minh. Không dùng làm căn cứ pháp lý hay quyết định kinh doanh.
          </p>
          <p>
            Khi Dashboard (Next.js + Payload CMS + PostgreSQL) sẵn sàng: nhân viên soạn →
            admin / đối tác pháp lý duyệt → mới xuất bản vào danh sách công khai.
          </p>
        </div>
        <p class="illus-note">
          Nội dung minh họa trên preview — không phải văn bản pháp lý đã ban hành, không thay thế tư vấn chuyên môn.
        </p>
      </article>`;

/* —— Regulations EN —— */
const regListEnMain = `      <section class="page-hero">
        <div class="wrap">
          <p class="demo-banner">Preview · No invented legal texts</p>
          <h1>New regulations</h1>
          <p class="lead">
            Business-relevant rules and policies with metadata: title, document number,
            issuing authority, issue date, effective date, status, business-impact summary,
            and official source link. Published only after source verification.
          </p>
        </div>
      </section>
      <section class="content-section">
        <div class="wrap">
          <div class="empty-state" role="status">
            <p><strong>No verified regulations yet.</strong></p>
            <p>
              The public list is intentionally empty — we do not invent document numbers,
              effective dates, or status claims that have not been checked against official sources.
            </p>
            <p class="demo-label">Empty state · Awaiting editorial review</p>
            <a class="text-link" href="./layout-sample.html">View detail page layout (empty sample)</a>
          </div>
        </div>
      </section>`;

const regDetailEnMain = `      <article class="article-wrap">
        <p class="back-row"><a href="./index.html">← Back to New regulations</a></p>
        <p class="demo-banner">Layout sample · Not an enacted instrument</p>
        <p class="kicker">New regulations</p>
        <p><span class="pill status-draft">Unverified</span></p>
        <h1>Regulation detail layout (no verified content yet)</h1>
        <dl class="reg-meta">
          <div class="reg-meta-row"><dt>Title</dt><dd>None yet — awaiting editorial intake from official sources</dd></div>
          <div class="reg-meta-row"><dt>Document number</dt><dd>—</dd></div>
          <div class="reg-meta-row"><dt>Issuing authority</dt><dd>—</dd></div>
          <div class="reg-meta-row"><dt>Issue date</dt><dd>—</dd></div>
          <div class="reg-meta-row"><dt>Effective date</dt><dd>—</dd></div>
          <div class="reg-meta-row"><dt>Effectiveness status</dt><dd>Unverified</dd></div>
          <div class="reg-meta-row"><dt>Business impact summary</dt><dd>None yet — no speculation</dd></div>
          <div class="reg-meta-row"><dt>Official source link</dt><dd>Not attached (will be an official gazette / authority URL after verification)</dd></div>
        </dl>
        <div class="article-body">
          <p>
            This page only shows the <strong>field structure</strong> used once verified content exists.
            Do not treat it as legal advice or a business decision basis.
          </p>
          <p>
            With the real Dashboard (Next.js + Payload CMS + PostgreSQL): staff draft →
            admin / partner counsel approve → then publish to the public list.
          </p>
        </div>
        <p class="illus-note">
          Preview illustration only — not an enacted legal text and not a substitute for professional advice.
        </p>
      </article>`;

/* —— Chuyên mục VI —— */
const topicListViMain = `      <section class="page-hero">
        <div class="wrap">
          <p class="demo-banner">Preview · Phân tích theo nhu cầu doanh nghiệp</p>
          <h1>Chuyên mục</h1>
          <p class="lead">
            Nhóm nội dung phục vụ nhu cầu doanh nghiệp (đầu tư, thuế, tuân thủ…). Không phải
            tin hoạt động FLF và không thay thế cập nhật quy định đã xác minh.
          </p>
        </div>
      </section>
      <section class="content-section">
        <div class="wrap">
          <div class="toolbar">
            <label for="topic-search">Tìm trong danh sách (lọc cục bộ)</label>
            <input id="topic-search" type="search" data-topic-search placeholder="Nhập từ khóa…" autocomplete="off" />
          </div>
          <div class="chip-row" data-topic-filters aria-label="Bộ lọc chủ đề">
            <button type="button" class="chip is-active" data-topic="all">Tất cả</button>
            <button type="button" class="chip" data-topic="dau-tu">Đầu tư</button>
            <button type="button" class="chip" data-topic="thue">Thuế</button>
            <button type="button" class="chip" data-topic="tuan-thu">Tuân thủ &amp; bảo vệ dữ liệu</button>
            <button type="button" class="chip" data-topic="quan-tri-dn">Quản trị doanh nghiệp</button>
            <button type="button" class="chip" data-topic="rui-ro">Quản trị rủi ro</button>
            <button type="button" class="chip" data-topic="giay-phep">Giấy phép</button>
          </div>
          <div class="post-list" data-post-list>
            <article class="post-card" data-topic="dau-tu" data-search="đầu tư nhu cầu mở rộng">
              <p class="post-meta">
                <span class="pill pill-topic">Đầu tư</span>
                <time datetime="2026-10-18">2026-10-18</time>
                <span class="demo-label">Minh họa</span>
              </p>
              <h3><a href="./bai-mau.html">Góc nhìn minh họa: làm rõ nhu cầu trước khi mở rộng đầu tư</a></h3>
              <p>Bài chuyên mục mẫu theo chủ đề Đầu tư — không khẳng định thành tích hay năng lực FLF.</p>
              <a class="text-link" href="./bai-mau.html">Đọc bài</a>
            </article>
            <article class="post-card" data-topic="thue" data-search="thuế hồ sơ định kỳ checklist">
              <p class="post-meta">
                <span class="pill pill-topic">Thuế</span>
                <time datetime="2026-10-12">2026-10-12</time>
                <span class="demo-label">Minh họa</span>
              </p>
              <h3><a href="./thue-minh-hoa.html">Góc nhìn minh họa: checklist chuẩn bị hồ sơ thuế định kỳ</a></h3>
              <p>Bài mẫu chủ đề Thuế để kiểm tra bộ lọc — không phải hướng dẫn thuế có hiệu lực pháp lý.</p>
              <a class="text-link" href="./thue-minh-hoa.html">Đọc bài</a>
            </article>
            <article class="post-card" data-topic="tuan-thu" data-search="tuân thủ bảo vệ dữ liệu nghị định 13 form">
              <p class="post-meta">
                <span class="pill pill-topic">Tuân thủ &amp; bảo vệ dữ liệu</span>
                <time datetime="2026-10-08">2026-10-08</time>
                <span class="demo-label">Minh họa</span>
              </p>
              <h3><a href="./tuan-thu-minh-hoa.html">Góc nhìn minh họa: bảo vệ dữ liệu cá nhân trong form liên hệ</a></h3>
              <p>Nhắc quy trình NĐ 13/2023 ở mức minh họa giao diện — không phải tư vấn cá thể.</p>
              <a class="text-link" href="./tuan-thu-minh-hoa.html">Đọc bài</a>
            </article>
          </div>
          <div class="empty-state" data-topic-empty hidden role="status">
            <p>Không có bài trong nhóm đã chọn.</p>
            <p class="demo-label">Trạng thái trống rõ ràng</p>
            <a class="text-link" href="./index.html">Xem tất cả nhóm</a>
          </div>
        </div>
      </section>`;

function topicArticleVi({ title, topicLabel, date, paragraphs, fileNote }) {
  return `      <article class="article-wrap">
        <p class="back-row"><a href="./index.html">← Quay lại danh sách Chuyên mục</a></p>
        <p class="demo-banner">${fileNote}</p>
        <p class="kicker">Chuyên mục · ${topicLabel}</p>
        <h1>${title}</h1>
        <p class="post-meta"><span class="pill pill-topic">${topicLabel}</span> <time datetime="${date}">${date}</time></p>
        <div class="article-body">
${paragraphs.map((p) => `          <p>${p}</p>`).join("\n")}
        </div>
        <p class="illus-note">
          Nội dung minh họa trên preview — không thay thế tư vấn chuyên môn; không khẳng định thành tích FLF.
        </p>
      </article>`;
}

const topicsViArticles = [
  {
    file: "bai-mau.html",
    title: "Góc nhìn minh họa: làm rõ nhu cầu trước khi mở rộng đầu tư — FLF Chuyên mục",
    description:
      "Bài chuyên mục mẫu chủ đề Đầu tư trên Preview FLF. Nội dung minh họa — không phải cam kết dịch vụ.",
    hreflangEn: "../../en/topics/sample-post.html",
    main: topicArticleVi({
      title: "Góc nhìn minh họa: làm rõ nhu cầu trước khi mở rộng đầu tư",
      topicLabel: "Đầu tư",
      date: "2026-10-18",
      fileNote: "Bài mẫu · Chuyên mục minh họa",
      paragraphs: [
        "Chuyên mục tập trung phân tích / góc nhìn theo nhóm nhu cầu doanh nghiệp — khác Tin tức hoạt động và khác mục Quy định mới (văn bản đã xác minh).",
        "Trước khi mở rộng đầu tư, doanh nghiệp thường cần làm rõ bài toán vận hành, phạm vi tư vấn và phần việc nào cần đối tác hành nghề luật sư.",
        "Khi nối CMS thật, mỗi bài gắn chủ đề; nội dung pháp lý (nếu có) phải qua biên tập và duyệt trước khi công khai.",
      ],
    }),
  },
  {
    file: "thue-minh-hoa.html",
    title: "Checklist hồ sơ thuế định kỳ (minh họa) — FLF Chuyên mục",
    description: "Bài chuyên mục mẫu chủ đề Thuế trên Preview FLF.",
    hreflangEn: "../../en/topics/tax-illustration.html",
    main: topicArticleVi({
      title: "Góc nhìn minh họa: checklist chuẩn bị hồ sơ thuế định kỳ",
      topicLabel: "Thuế",
      date: "2026-10-12",
      fileNote: "Bài mẫu · Không phải hướng dẫn thuế có hiệu lực",
      paragraphs: [
        "Đây là nội dung minh họa giọng văn chuyên mục — không phải hướng dẫn thuế có hiệu lực pháp lý.",
        "Checklist thật sẽ chỉ đăng khi biên tập đối chiếu quy trình nội bộ và (nếu cần) đối tác chuyên môn xác nhận.",
      ],
    }),
  },
  {
    file: "tuan-thu-minh-hoa.html",
    title: "Bảo vệ dữ liệu cá nhân trong form liên hệ (minh họa) — FLF Chuyên mục",
    description: "Bài chuyên mục mẫu chủ đề Tuân thủ & bảo vệ dữ liệu trên Preview FLF.",
    hreflangEn: "../../en/topics/compliance-illustration.html",
    main: topicArticleVi({
      title: "Góc nhìn minh họa: bảo vệ dữ liệu cá nhân trong form liên hệ",
      topicLabel: "Tuân thủ &amp; bảo vệ dữ liệu",
      date: "2026-10-08",
      fileNote: "Bài mẫu · NĐ 13/2023 — nhắc quy trình, không tư vấn cá thể",
      paragraphs: [
        "Form liên hệ production sẽ có ô đồng ý xử lý dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP.",
        "Bài này chỉ minh họa chuyên mục và liên kết quay lại danh sách có bộ lọc nhóm.",
      ],
    }),
  },
];

/* —— Topics EN —— */
const topicListEnMain = `      <section class="page-hero">
        <div class="wrap">
          <p class="demo-banner">Preview · Business-need topic groups</p>
          <h1>Topics</h1>
          <p class="lead">
            Content groups for business needs (investment, tax, compliance…). Not FLF activity
            news and not a substitute for verified regulation updates.
          </p>
        </div>
      </section>
      <section class="content-section">
        <div class="wrap">
          <div class="toolbar">
            <label for="topic-search">Search list (local filter)</label>
            <input id="topic-search" type="search" data-topic-search placeholder="Type a keyword…" autocomplete="off" />
          </div>
          <div class="chip-row" data-topic-filters aria-label="Topic filters">
            <button type="button" class="chip is-active" data-topic="all">All</button>
            <button type="button" class="chip" data-topic="dau-tu">Investment</button>
            <button type="button" class="chip" data-topic="thue">Tax</button>
            <button type="button" class="chip" data-topic="tuan-thu">Compliance &amp; data protection</button>
            <button type="button" class="chip" data-topic="quan-tri-dn">Corporate governance</button>
            <button type="button" class="chip" data-topic="rui-ro">Risk management</button>
            <button type="button" class="chip" data-topic="giay-phep">Licensing</button>
          </div>
          <div class="post-list" data-post-list>
            <article class="post-card" data-topic="dau-tu" data-search="investment expansion needs scoping">
              <p class="post-meta">
                <span class="pill pill-topic">Investment</span>
                <time datetime="2026-10-18">2026-10-18</time>
                <span class="demo-label">Illustration</span>
              </p>
              <h3><a href="./sample-post.html">Illustration: clarify needs before expanding investment</a></h3>
              <p>Sample topic article — does not claim FLF track record or capabilities.</p>
              <a class="text-link" href="./sample-post.html">Read</a>
            </article>
            <article class="post-card" data-topic="thue" data-search="tax periodic filing checklist">
              <p class="post-meta">
                <span class="pill pill-topic">Tax</span>
                <time datetime="2026-10-12">2026-10-12</time>
                <span class="demo-label">Illustration</span>
              </p>
              <h3><a href="./tax-illustration.html">Illustration: checklist for periodic tax filings</a></h3>
              <p>Sample Tax topic for filter testing — not binding tax guidance.</p>
              <a class="text-link" href="./tax-illustration.html">Read</a>
            </article>
            <article class="post-card" data-topic="tuan-thu" data-search="compliance personal data decree 13 contact form">
              <p class="post-meta">
                <span class="pill pill-topic">Compliance &amp; data protection</span>
                <time datetime="2026-10-08">2026-10-08</time>
                <span class="demo-label">Illustration</span>
              </p>
              <h3><a href="./compliance-illustration.html">Illustration: personal data in the contact form</a></h3>
              <p>Decree 13/2023 process reminder at UI level — not individual advice.</p>
              <a class="text-link" href="./compliance-illustration.html">Read</a>
            </article>
          </div>
          <div class="empty-state" data-topic-empty hidden role="status">
            <p>No articles in the selected group.</p>
            <p class="demo-label">Clear empty state</p>
            <a class="text-link" href="./index.html">View all groups</a>
          </div>
        </div>
      </section>`;

function topicArticleEn({ title, topicLabel, date, paragraphs, fileNote }) {
  return `      <article class="article-wrap">
        <p class="back-row"><a href="./index.html">← Back to Topics</a></p>
        <p class="demo-banner">${fileNote}</p>
        <p class="kicker">Topics · ${topicLabel}</p>
        <h1>${title}</h1>
        <p class="post-meta"><span class="pill pill-topic">${topicLabel}</span> <time datetime="${date}">${date}</time></p>
        <div class="article-body">
${paragraphs.map((p) => `          <p>${p}</p>`).join("\n")}
        </div>
        <p class="illus-note">
          Preview illustration only — not professional advice; does not claim FLF achievements.
        </p>
      </article>`;
}

const topicsEnArticles = [
  {
    file: "sample-post.html",
    title: "Illustration: clarify needs before expanding investment — FLF Topics",
    description: "Sample Investment topic article on the FLF Preview.",
    hreflangVi: "../../vi/chuyen-muc/bai-mau.html",
    main: topicArticleEn({
      title: "Illustration: clarify needs before expanding investment",
      topicLabel: "Investment",
      date: "2026-10-18",
      fileNote: "Sample · Topic illustration",
      paragraphs: [
        "Topics focus on business-need analysis — distinct from activity news and from verified New regulations.",
        "Before expanding investment, businesses often need to clarify the operating problem, advisory scope, and which work requires a licensed law partner.",
        "When the real CMS is connected, each article is tagged; any legal content must be reviewed before publish.",
      ],
    }),
  },
  {
    file: "tax-illustration.html",
    title: "Illustration: checklist for periodic tax filings — FLF Topics",
    description: "Sample Tax topic article on the FLF Preview.",
    hreflangVi: "../../vi/chuyen-muc/thue-minh-hoa.html",
    main: topicArticleEn({
      title: "Illustration: checklist for periodic tax filings",
      topicLabel: "Tax",
      date: "2026-10-12",
      fileNote: "Sample · Not binding tax guidance",
      paragraphs: [
        "Illustrative topic copy only — not binding tax guidance.",
        "A real checklist will publish only after editorial checks and, where needed, specialist confirmation.",
      ],
    }),
  },
  {
    file: "compliance-illustration.html",
    title: "Illustration: personal data in the contact form — FLF Topics",
    description: "Sample Compliance & data protection topic on the FLF Preview.",
    hreflangVi: "../../vi/chuyen-muc/tuan-thu-minh-hoa.html",
    main: topicArticleEn({
      title: "Illustration: personal data in the contact form",
      topicLabel: "Compliance &amp; data protection",
      date: "2026-10-08",
      fileNote: "Sample · Decree 13/2023 process reminder",
      paragraphs: [
        "Production contact forms will include consent for personal data processing under Decree 13/2023/NĐ-CP.",
        "This page only illustrates the Topics section and links back to the filtered list.",
      ],
    }),
  },
];

/* Write regulation pages */
write(
  "vi/quy-dinh-moi/index.html",
  shell({
    lang: "vi",
    title: "Quy định mới — First Legal Force (FLF)",
    description:
      "Danh sách quy định / chính sách liên quan doanh nghiệp. Hiện chưa có mục đã xác minh từ nguồn chính thức.",
    hreflangVi: "./index.html",
    hreflangEn: "../../en/regulations/index.html",
    reviewNote: "Bản Preview chờ duyệt · Quy định mới VI · file:// OK",
    reviewLinkHref: "../../en/regulations/index.html",
    reviewLinkLabel: "English version →",
    active: "regs",
    langSwitchCurrent: "VI",
    langSwitchOtherHref: "../../en/regulations/index.html",
    langSwitchOtherLabel: "EN",
    ctaHref: "../index.html#contact",
    ctaLabel: "Trao đổi nhu cầu",
    main: regListViMain,
    footerLangLabel: "Chọn ngôn ngữ (footer)",
  })
);

write(
  "vi/quy-dinh-moi/cau-truc-mau.html",
  shell({
    lang: "vi",
    title: "Bố cục quy định (mẫu trống) — FLF",
    description: "Trang chi tiết quy định với các trường metadata trống — chưa có văn bản xác minh.",
    hreflangVi: "./cau-truc-mau.html",
    hreflangEn: "../../en/regulations/layout-sample.html",
    reviewNote: "Bản Preview · Bố cục Quy định mới · Không phải văn bản thật",
    reviewLinkHref: "../../en/regulations/layout-sample.html",
    reviewLinkLabel: "English version →",
    active: "reg-article",
    langSwitchCurrent: "VI",
    langSwitchOtherHref: "../../en/regulations/layout-sample.html",
    langSwitchOtherLabel: "EN",
    ctaHref: "../index.html#contact",
    ctaLabel: "Trao đổi nhu cầu",
    main: regDetailViMain,
    footerLangLabel: "Chọn ngôn ngữ (footer)",
  })
);

write(
  "en/regulations/index.html",
  shell({
    lang: "en",
    title: "New regulations — First Legal Force (FLF)",
    description:
      "Business-relevant regulations and policies. No verified items published yet.",
    hreflangVi: "../../vi/quy-dinh-moi/index.html",
    hreflangEn: "./index.html",
    reviewNote: "Preview for review · New regulations EN · file:// OK",
    reviewLinkHref: "../../vi/quy-dinh-moi/index.html",
    reviewLinkLabel: "← Bản tiếng Việt",
    active: "regs",
    langSwitchCurrent: "EN",
    langSwitchOtherHref: "../../vi/quy-dinh-moi/index.html",
    langSwitchOtherLabel: "VI",
    ctaHref: "../index.html#contact",
    ctaLabel: "Discuss your needs",
    main: regListEnMain,
    footerLangLabel: "Language (footer)",
  })
);

write(
  "en/regulations/layout-sample.html",
  shell({
    lang: "en",
    title: "Regulation layout (empty sample) — FLF",
    description: "Regulation detail template with empty metadata — no verified instrument.",
    hreflangVi: "../../vi/quy-dinh-moi/cau-truc-mau.html",
    hreflangEn: "./layout-sample.html",
    reviewNote: "Preview · Regulation layout · Not an enacted text",
    reviewLinkHref: "../../vi/quy-dinh-moi/cau-truc-mau.html",
    reviewLinkLabel: "← Bản tiếng Việt",
    active: "reg-article",
    langSwitchCurrent: "EN",
    langSwitchOtherHref: "../../vi/quy-dinh-moi/cau-truc-mau.html",
    langSwitchOtherLabel: "VI",
    ctaHref: "../index.html#contact",
    ctaLabel: "Discuss your needs",
    main: regDetailEnMain,
    footerLangLabel: "Language (footer)",
  })
);

/* Write topic list + articles */
write(
  "vi/chuyen-muc/index.html",
  shell({
    lang: "vi",
    title: "Chuyên mục — First Legal Force (FLF)",
    description:
      "Nhóm bài theo nhu cầu doanh nghiệp: đầu tư, thuế, tuân thủ… Bản Preview minh họa.",
    hreflangVi: "./index.html",
    hreflangEn: "../../en/topics/index.html",
    reviewNote: "Bản Preview chờ duyệt · Chuyên mục VI · file:// OK",
    reviewLinkHref: "../../en/topics/index.html",
    reviewLinkLabel: "English version →",
    active: "topics",
    langSwitchCurrent: "VI",
    langSwitchOtherHref: "../../en/topics/index.html",
    langSwitchOtherLabel: "EN",
    ctaHref: "../index.html#contact",
    ctaLabel: "Trao đổi nhu cầu",
    main: topicListViMain,
    footerLangLabel: "Chọn ngôn ngữ (footer)",
  })
);

for (const a of topicsViArticles) {
  write(
    `vi/chuyen-muc/${a.file}`,
    shell({
      lang: "vi",
      title: a.title,
      description: a.description,
      hreflangVi: `./${a.file}`,
      hreflangEn: a.hreflangEn,
      reviewNote: "Bản Preview · Bài Chuyên mục minh họa",
      reviewLinkHref: a.hreflangEn,
      reviewLinkLabel: "English version →",
      active: "topic-article",
      langSwitchCurrent: "VI",
      langSwitchOtherHref: a.hreflangEn,
      langSwitchOtherLabel: "EN",
      ctaHref: "../index.html#contact",
      ctaLabel: "Trao đổi nhu cầu",
      main: a.main,
      footerLangLabel: "Chọn ngôn ngữ (footer)",
    })
  );
}

write(
  "en/topics/index.html",
  shell({
    lang: "en",
    title: "Topics — First Legal Force (FLF)",
    description:
      "Topic groups for business needs: investment, tax, compliance… Preview illustration.",
    hreflangVi: "../../vi/chuyen-muc/index.html",
    hreflangEn: "./index.html",
    reviewNote: "Preview for review · Topics EN · file:// OK",
    reviewLinkHref: "../../vi/chuyen-muc/index.html",
    reviewLinkLabel: "← Bản tiếng Việt",
    active: "topics",
    langSwitchCurrent: "EN",
    langSwitchOtherHref: "../../vi/chuyen-muc/index.html",
    langSwitchOtherLabel: "VI",
    ctaHref: "../index.html#contact",
    ctaLabel: "Discuss your needs",
    main: topicListEnMain,
    footerLangLabel: "Language (footer)",
  })
);

for (const a of topicsEnArticles) {
  write(
    `en/topics/${a.file}`,
    shell({
      lang: "en",
      title: a.title,
      description: a.description,
      hreflangVi: a.hreflangVi,
      hreflangEn: `./${a.file}`,
      reviewNote: "Preview · Topics illustration article",
      reviewLinkHref: a.hreflangVi,
      reviewLinkLabel: "← Bản tiếng Việt",
      active: "topic-article",
      langSwitchCurrent: "EN",
      langSwitchOtherHref: a.hreflangVi,
      langSwitchOtherLabel: "VI",
      ctaHref: "../index.html#contact",
      ctaLabel: "Discuss your needs",
      main: a.main,
      footerLangLabel: "Language (footer)",
    })
  );
}

console.log("Done generating bilingual section pages.");
