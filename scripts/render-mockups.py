#!/usr/bin/env python3
"""Render 4 FLF homepage mockup PNGs (A/B × desktop/mobile) with Pillow + logo gốc."""

from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "mockups"
FONTS = ROOT / "public" / "fonts"
LOGO = ROOT / "public" / "brand" / "logo-color.png"
WORDMARK = ROOT / "public" / "brand" / "first-legal-force.png"

NAVY = (0, 48, 80)
NAVY_DEEP = (0, 21, 36)
RED = (160, 32, 32)
INK = (20, 32, 43)
MUTED = (90, 107, 120)
LINE = (215, 224, 231)
BG = (247, 250, 252)
WHITE = (255, 255, 255)
PAPER = (243, 246, 248)

NAV = [
    "Trang chủ",
    "Giới thiệu",
    "Lĩnh vực",
    "Đối tác pháp lý",
    "Tin tức",
    "Quy định mới",
    "Chuyên mục ▾",
    "Liên hệ",
]
NAV_TOPICS = ["Đầu tư", "Thuế", "Quản trị doanh nghiệp", "Quản trị rủi ro", "Giấy phép"]
TAGLINE = "FLF — Đồng hành cùng doanh nghiệp trong các vấn đề tư vấn đa lĩnh vực"
HEADLINE = "Phân định rõ phạm vi tư vấn FLF và phần do đối tác hành nghề luật sư thực hiện"
SUB = (
    "First Legal Force (FLF) hỗ trợ doanh nghiệp làm rõ nhu cầu, lập phương án tư vấn "
    "và phối hợp với đối tác hành nghề luật sư khi vấn đề thuộc lĩnh vực pháp lý đặc thù."
)
SERVICES = [
    ("Tư vấn doanh nghiệp & quản trị", "Hỗ trợ làm rõ cấu trúc vận hành và nhu cầu tư vấn."),
    ("Đầu tư & mở rộng hoạt động", "Đồng hành khi cân nhắc đầu tư hoặc mở rộng — phân định phạm vi FLF và đối tác pháp lý."),
    ("Tuân thủ & giấy phép (đề xuất)", "Nội dung đề xuất trong tài liệu duyệt — chờ khách xác nhận."),
    ("Hợp tác pháp lý chuyên sâu (đề xuất)", "Phối hợp quy trình với đối tác hành nghề luật sư khi được chỉ định."),
]
STEPS = [
    ("01", "Tiếp nhận", "Doanh nghiệp gửi thông tin qua form hoặc kênh liên hệ."),
    ("02", "Làm rõ nhu cầu", "Xác định phạm vi tư vấn và phần cần đối tác pháp lý."),
    ("03", "Đề xuất hướng xử lý", "Thống nhất phương án, đầu mối và thứ tự ưu tiên."),
    ("04", "Triển khai & phản hồi", "Thực hiện trong phạm vi đã thống nhất."),
]


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONTS / name), size)


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    cur = ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if draw.textlength(trial, font=fnt) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines or [text]


def draw_text_block(draw, xy, text, fnt, fill, max_w, line_gap=8):
    x, y = xy
    lines = wrap(draw, text, fnt, max_w)
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        bbox = fnt.getbbox(line)
        y += (bbox[3] - bbox[1]) + line_gap
    return y


def load_logo(size: int) -> Image.Image:
    img = Image.open(LOGO).convert("RGBA")
    img.thumbnail((size, size), Image.Resampling.LANCZOS)
    return img


def button(draw, xy, label, fnt, fill=RED, fg=WHITE, pad_x=22, pad_y=14):
    x, y = xy
    tw = draw.textlength(label, font=fnt)
    bbox = fnt.getbbox(label)
    th = bbox[3] - bbox[1]
    w, h = int(tw + pad_x * 2), int(th + pad_y * 2)
    draw.rectangle([x, y, x + w, y + h], fill=fill)
    draw.text((x + pad_x, y + pad_y - 2), label, font=fnt, fill=fg)
    return w, h


def render_a(width: int, mobile: bool) -> Image.Image:
    height = 2600 if mobile else 2200
    img = Image.new("RGB", (width, height), BG)
    draw = ImageDraw.Draw(img)
    pad = 20 if mobile else 120
    content_w = width - pad * 2

    # review bar
    draw.rectangle([0, 0, width, 36], fill=NAVY_DEEP)
    f_small = font("NotoSans-VI.ttf", 13)
    draw.text((pad, 10), "Phương án A · Hiện đại / nền sáng", font=f_small, fill=(220, 231, 239))

    # header (taller on desktop to fit menu gồm Tin tức / Quy định mới / Chuyên mục)
    hy = 36
    header_h = 72 if mobile else 96
    draw.rectangle([0, hy, width, hy + header_h], fill=(247, 250, 252))
    draw.line([0, hy + header_h, width, hy + header_h], fill=LINE)
    logo = load_logo(44)
    img.paste(logo, (pad, hy + 14), logo)
    f_brand = font("NotoSans-Bold-VI.ttf", 16 if mobile else 18)
    draw.text((pad + 56, hy + 26), "First Legal Force", font=f_brand, fill=NAVY)

    if not mobile:
        f_nav = font("NotoSans-VI.ttf", 12)
        nx = pad + 260
        row1 = NAV[:4]
        row2 = NAV[4:]
        for item in row1:
            draw.text((nx, hy + 18), item, font=f_nav, fill=MUTED)
            nx += int(draw.textlength(item, font=f_nav)) + 18
        nx = pad + 260
        for item in row2:
            fill = RED if item in ("Quy định mới", "Chuyên mục", "Tin tức") else MUTED
            draw.text((nx, hy + 48), item, font=f_nav, fill=fill)
            nx += int(draw.textlength(item, font=f_nav)) + 18
        button(draw, (width - pad - 150, hy + 28), "Liên hệ tư vấn", font("NotoSans-Bold-VI.ttf", 13), pad_x=14, pad_y=10)
    else:
        draw.rectangle([width - pad - 44, hy + 14, width - pad, hy + 58], outline=LINE, width=1)
        draw.line([width - pad - 30, hy + 28, width - pad - 14, hy + 28], fill=NAVY, width=2)
        draw.line([width - pad - 30, hy + 36, width - pad - 14, hy + 36], fill=NAVY, width=2)
        draw.line([width - pad - 30, hy + 44, width - pad - 14, hy + 44], fill=NAVY, width=2)

    # hero
    y = hy + header_h
    hero_h = 620 if mobile else 560
    for i in range(hero_h):
        t = i / hero_h
        r = int(247 + (217 - 247) * t)
        g = int(250 + (230 - 250) * t)
        b = int(252 + (239 - 252) * t)
        draw.line([0, y + i, width, y + i], fill=(r, g, b))

    # faint logo watermark
    mark = load_logo(280 if mobile else 420)
    mark = mark.copy()
    mark.putalpha(mark.split()[-1].point(lambda a: int(a * 0.12)))
    img.paste(mark, (width - mark.width - (10 if mobile else 80), y + 40), mark)

    x = pad
    yy = y + (48 if mobile else 90)
    f_eye = font("NotoSans-Bold-VI.ttf", 12)
    draw.text((x, yy), "TƯ VẤN ĐA LĨNH VỰC · HỢP TÁC ĐỐI TÁC HÀNH NGHỀ LUẬT SƯ", font=f_eye, fill=RED)
    yy += 36
    f_tag = font("NotoSerif-Bold.ttf", 22 if mobile else 28)
    yy = draw_text_block(draw, (x, yy), TAGLINE, f_tag, NAVY, content_w - (20 if mobile else 200), 10)
    yy += 18
    f_h = font("NotoSerif-Regular.ttf", 26 if mobile else 40)
    yy = draw_text_block(draw, (x, yy), HEADLINE, f_h, NAVY_DEEP, content_w - (20 if mobile else 260), 8)
    yy += 14
    f_sub = font("NotoSans-VI.ttf", 15 if mobile else 17)
    yy = draw_text_block(draw, (x, yy), SUB, f_sub, MUTED, min(content_w, 640), 6)
    yy += 22
    bw, bh = button(draw, (x, yy), "Liên hệ tư vấn", font("NotoSans-Bold-VI.ttf", 15))
    if not mobile:
        draw.rectangle([x + bw + 12, yy, x + bw + 12 + 210, yy + bh], outline=LINE, width=1)
        draw.text((x + bw + 28, yy + 14), "Xem lĩnh vực đề xuất", font=font("NotoSans-Bold-VI.ttf", 14), fill=NAVY)
    else:
        draw.rectangle([x, yy + bh + 12, x + content_w, yy + bh + 12 + bh], outline=LINE, width=1)
        draw.text((x + 18, yy + bh + 26), "Xem lĩnh vực đề xuất", font=font("NotoSans-Bold-VI.ttf", 14), fill=NAVY)

    # about
    y = y + hero_h
    draw.rectangle([0, y, width, y + (420 if mobile else 320)], fill=WHITE)
    yy = y + 48
    f_h2 = font("NotoSerif-Bold.ttf", 24 if mobile else 30)
    yy = draw_text_block(
        draw,
        (pad, yy),
        "FLF làm gì — và phần nào do đối tác pháp lý thực hiện",
        f_h2,
        NAVY,
        content_w,
        8,
    )
    yy += 12
    about = (
        "FLF là đơn vị tư vấn đa lĩnh vực. Khi cần hành nghề luật sư, FLF kết nối và phối hợp "
        "với đối tác — không thay thế vai trò của họ."
    )
    yy = draw_text_block(draw, (pad, yy), about, f_sub, MUTED, content_w, 6)
    yy += 24
    cols = 1 if mobile else 2
    col_w = content_w if mobile else (content_w - 40) // 2
    points = [
        ("Phạm vi FLF", "Tiếp nhận yêu cầu, làm rõ bài toán, đề xuất hướng tư vấn và điều phối quy trình."),
        ("Phạm vi đối tác pháp lý", "Thực hiện công việc thuộc hành nghề luật sư theo thỏa thuận và quy định pháp luật."),
    ]
    for i, (t, p) in enumerate(points):
        cx = pad if mobile or i == 0 else pad + col_w + 40
        cy = yy if not mobile else yy + i * 120
        draw.line([cx, cy, cx + col_w, cy], fill=LINE)
        draw.text((cx, cy + 14), t, font=font("NotoSans-Bold-VI.ttf", 16), fill=NAVY)
        draw_text_block(draw, (cx, cy + 44), p, f_sub, MUTED, col_w, 5)

    # services
    y = y + (420 if mobile else 320)
    draw.rectangle([0, y, width, y + (780 if mobile else 520)], fill=BG)
    yy = y + 48
    yy = draw_text_block(draw, (pad, yy), "Nhóm lĩnh vực đề xuất", f_h2, NAVY, content_w, 8)
    yy += 8
    note = "Nội dung đề xuất trong tài liệu duyệt — chưa xác minh đầy đủ. Khách chọn trước khi phát triển tiếp."
    draw.rectangle([pad, yy, pad + content_w, yy + 56], fill=(255, 247, 240))
    draw.rectangle([pad, yy, pad + 4, yy + 56], fill=RED)
    draw_text_block(draw, (pad + 16, yy + 10), note, font("NotoSans-VI.ttf", 13), (107, 58, 42), content_w - 30, 4)
    yy += 76
    for i, (t, p) in enumerate(SERVICES):
        if mobile:
            sx, sy = pad, yy + i * 130
            sw = content_w
        else:
            sx = pad if i % 2 == 0 else pad + content_w // 2 + 20
            sy = yy + (i // 2) * 150
            sw = content_w // 2 - 20
        draw.line([sx, sy, sx + sw, sy], fill=LINE)
        draw.text((sx, sy + 14), t, font=font("NotoSans-Bold-VI.ttf", 15), fill=NAVY)
        draw_text_block(draw, (sx, sy + 44), p, font("NotoSans-VI.ttf", 14), MUTED, sw, 4)

    # process
    y = y + (780 if mobile else 520)
    draw.rectangle([0, y, width, y + (620 if mobile else 300)], fill=(238, 243, 247))
    yy = y + 40
    draw.text((pad, yy), "Quy trình tiếp nhận yêu cầu", font=f_h2, fill=NAVY)
    yy += 56
    for i, (n, t, p) in enumerate(STEPS):
        if mobile:
            sx, sy = pad, yy + i * 120
            sw = content_w
        else:
            sx = pad + i * (content_w // 4)
            sy = yy
            sw = content_w // 4 - 20
        draw.text((sx, sy), n, font=font("NotoSerif-Bold.ttf", 26), fill=RED)
        draw.text((sx, sy + 40), t, font=font("NotoSans-Bold-VI.ttf", 15), fill=NAVY)
        draw_text_block(draw, (sx, sy + 68), p, font("NotoSans-VI.ttf", 13), MUTED, sw, 3)

    # partners + CTA + footer condensed
    y = y + (620 if mobile else 300)
    draw.rectangle([0, y, width, y + 220], fill=WHITE)
    yy = y + 40
    draw.text((pad, yy), "Cách phối hợp với đối tác pháp lý", font=f_h2, fill=NAVY)
    yy += 50
    partner_lead = (
        "FLF không liệt kê tên công ty luật trên mockup để tránh thông tin chưa được khách xác nhận."
    )
    yy = draw_text_block(draw, (pad, yy), partner_lead, f_sub, MUTED, content_w, 5)
    for item in [
        "FLF tiếp nhận và phân loại yêu cầu.",
        "Nếu thuộc lĩnh vực pháp lý đặc thù → phối hợp đối tác hành nghề luật sư.",
        "Khách hàng được thông báo rõ phạm vi từng bên trước khi triển khai.",
    ]:
        draw.ellipse([pad, yy + 8, pad + 8, yy + 16], fill=RED)
        yy = draw_text_block(draw, (pad + 18, yy), item, font("NotoSans-VI.ttf", 14), INK, content_w - 20, 4)
        yy += 8

    y = yy + 30
    draw.rectangle([0, y, width, y + 200], fill=NAVY_DEEP)
    draw.text((pad, y + 36), "Sẵn sàng trao đổi với FLF", font=f_h2, fill=WHITE)
    draw_text_block(
        draw,
        (pad, y + 84),
        "Để lại nhu cầu tư vấn. Địa chỉ hiển thị công khai sẽ cập nhật sau khi khách xác nhận.",
        font("NotoSans-VI.ttf", 14),
        (184, 199, 211),
        content_w,
        4,
    )
    button(draw, (pad, y + 140), "Gửi yêu cầu liên hệ", font("NotoSans-Bold-VI.ttf", 14), fill=WHITE, fg=NAVY)

    # crop to used height + footer strip
    footer_y = y + 200
    draw.rectangle([0, footer_y, width, footer_y + 90], fill=(0, 18, 31))
    flogo = load_logo(32)
    img.paste(flogo, (pad, footer_y + 24), flogo)
    draw.text((pad + 44, footer_y + 22), "First Legal Force", font=font("NotoSans-Bold-VI.ttf", 14), fill=WHITE)
    draw.text(
        (pad + 44, footer_y + 44),
        "MST: 0314193708 · Facebook · LinkedIn",
        font=font("NotoSans-VI.ttf", 12),
        fill=(183, 199, 211),
    )
    return img.crop((0, 0, width, footer_y + 90))


def render_b(width: int, mobile: bool) -> Image.Image:
    height = 2800 if mobile else 2400
    img = Image.new("RGB", (width, height), PAPER)
    draw = ImageDraw.Draw(img)
    pad = 20 if mobile else 120
    content_w = width - pad * 2

    draw.rectangle([0, 0, width, 36], fill=(0, 0, 0))
    draw.text((pad, 10), "Phương án B · Trang trọng / biên tập", font=font("NotoSans-VI.ttf", 13), fill=(201, 213, 222))

    hy = 36
    header_h = 78 if mobile else 100
    draw.rectangle([0, hy, width, hy + header_h], fill=NAVY_DEEP)
    logo = load_logo(48)
    img.paste(logo, (pad, hy + 15), logo)
    draw.text((pad + 60, hy + 22), "First Legal Force", font=font("NotoSans-Bold-VI.ttf", 16), fill=WHITE)
    draw.text((pad + 60, hy + 46), "TƯ VẤN ĐA LĨNH VỰC", font=font("NotoSans-VI.ttf", 10), fill=(143, 166, 184))
    if not mobile:
        f_nav = font("NotoSans-VI.ttf", 11)
        nx = pad + 300
        for item in NAV[:4]:
            draw.text((nx, hy + 22), item, font=f_nav, fill=(183, 200, 214))
            nx += int(draw.textlength(item, font=f_nav)) + 16
        nx = pad + 300
        for item in NAV[4:]:
            fill = (255, 200, 200) if item in ("Quy định mới", "Chuyên mục", "Tin tức") else (183, 200, 214)
            draw.text((nx, hy + 52), item, font=f_nav, fill=fill)
            nx += int(draw.textlength(item, font=f_nav)) + 16
        button(draw, (width - pad - 150, hy + 30), "Liên hệ tư vấn", font("NotoSans-Bold-VI.ttf", 13), pad_x=14, pad_y=10)
    else:
        draw.rectangle([width - pad - 70, hy + 20, width - pad, hy + 56], outline=(255, 255, 255, 60), width=1)
        draw.text((width - pad - 58, hy + 30), "MENU", font=font("NotoSans-Bold-VI.ttf", 11), fill=WHITE)

    y = hy + header_h
    hero_h = 680 if mobile else 600
    draw.rectangle([0, y, width, y + hero_h], fill=NAVY_DEEP)
    # red glow
    mark = load_logo(320 if mobile else 440)
    mark = mark.copy()
    mark.putalpha(mark.split()[-1].point(lambda a: int(a * 0.2)))
    img.paste(mark, (width - mark.width + (40 if mobile else -40), y + (hero_h - mark.height) // 2), mark)

    yy = y + (50 if mobile else 90)
    draw.text(
        (pad, yy),
        "TƯ VẤN ĐA LĨNH VỰC · HỢP TÁC ĐỐI TÁC HÀNH NGHỀ LUẬT SƯ",
        font=font("NotoSans-Bold-VI.ttf", 11),
        fill=(240, 180, 180),
    )
    yy += 36
    yy = draw_text_block(draw, (pad, yy), TAGLINE, font("NotoSerif-Regular.ttf", 22 if mobile else 30), WHITE, min(content_w, 520), 10)
    yy += 18
    yy = draw_text_block(draw, (pad, yy), HEADLINE, font("NotoSerif-Regular.ttf", 24 if mobile else 36), WHITE, min(content_w, 520), 8)
    yy += 14
    yy = draw_text_block(draw, (pad, yy), SUB, font("NotoSans-VI.ttf", 14 if mobile else 16), (183, 200, 214), min(content_w, 560), 5)
    yy += 24
    button(draw, (pad, yy), "Liên hệ tư vấn", font("NotoSans-Bold-VI.ttf", 15))

    # about editorial
    y = y + hero_h
    draw.rectangle([0, y, width, y + (480 if mobile else 360)], fill=WHITE)
    yy = y + 48
    draw.text((pad, yy), "01 — PHÂN ĐỊNH VAI TRÒ", font=font("NotoSans-Bold-VI.ttf", 12), fill=RED)
    yy += 28
    yy = draw_text_block(
        draw,
        (pad, yy),
        "FLF làm gì — và phần nào do đối tác pháp lý thực hiện",
        font("NotoSerif-Regular.ttf", 24 if mobile else 32),
        NAVY_DEEP,
        content_w,
        8,
    )
    yy += 12
    about = (
        "FLF là đơn vị tư vấn đa lĩnh vực. Khi cần hành nghề luật sư hoặc dịch vụ pháp lý thuộc phạm vi luật định, "
        "FLF kết nối và phối hợp với công ty luật / tổ chức hành nghề luật sư đối tác — không thay thế vai trò của họ."
    )
    yy = draw_text_block(draw, (pad, yy), about, font("NotoSans-VI.ttf", 15), MUTED, min(content_w, 760), 6)
    yy += 20
    for title, body in [
        ("Phạm vi FLF", "Tiếp nhận yêu cầu, làm rõ bài toán kinh doanh, đề xuất hướng tư vấn đa lĩnh vực."),
        ("Phạm vi đối tác pháp lý", "Thực hiện các công việc thuộc hành nghề luật sư theo thỏa thuận với khách hàng."),
    ]:
        draw.line([pad, yy, pad + content_w, yy], fill=LINE)
        if mobile:
            draw.text((pad, yy + 14), title, font=font("NotoSerif-Bold.ttf", 16), fill=NAVY)
            yy = draw_text_block(draw, (pad, yy + 44), body, font("NotoSans-VI.ttf", 14), MUTED, content_w, 4)
            yy += 18
        else:
            draw.text((pad, yy + 16), title, font=font("NotoSerif-Bold.ttf", 16), fill=NAVY)
            draw_text_block(draw, (pad + 240, yy + 16), body, font("NotoSans-VI.ttf", 14), MUTED, content_w - 240, 4)
            yy += 70

    # services rail
    y = y + (480 if mobile else 360)
    draw.rectangle([0, y, width, y + (700 if mobile else 560)], fill=PAPER)
    yy = y + 48
    draw.text((pad, yy), "02 — LĨNH VỰC", font=font("NotoSans-Bold-VI.ttf", 12), fill=RED)
    yy += 28
    draw.text((pad, yy), "Nhóm lĩnh vực đề xuất", font=font("NotoSerif-Regular.ttf", 28), fill=NAVY_DEEP)
    yy += 48
    draw.line([pad, yy, pad + content_w, yy], fill=LINE)
    yy += 12
    note = "Nội dung đề xuất trong tài liệu duyệt — chưa xác minh đầy đủ từ hiện trạng site cũ / hồ sơ khách."
    yy = draw_text_block(draw, (pad, yy), note, font("NotoSans-VI.ttf", 13), (106, 74, 58), content_w, 4)
    yy += 12
    draw.line([pad, yy, pad + content_w, yy], fill=LINE)
    yy += 8
    for t, p in SERVICES:
        draw.line([pad, yy, pad + content_w, yy], fill=LINE)
        draw.text((pad, yy + 16), t, font=font("NotoSerif-Bold.ttf", 17), fill=NAVY_DEEP)
        ny = draw_text_block(draw, (pad, yy + 48), p, font("NotoSans-VI.ttf", 14), MUTED, content_w, 4)
        yy = ny + 18

    # process navy
    y = yy + 24
    draw.rectangle([0, y, width, y + (560 if mobile else 280)], fill=NAVY)
    yy = y + 40
    draw.text((pad, yy), "03 — QUY TRÌNH", font=font("NotoSans-Bold-VI.ttf", 12), fill=(240, 180, 180))
    yy += 28
    draw.text((pad, yy), "Quy trình tiếp nhận yêu cầu", font=font("NotoSerif-Regular.ttf", 28), fill=WHITE)
    yy += 56
    for i, (n, t, p) in enumerate(STEPS):
        if mobile:
            sx, sy = pad, yy + i * 110
            sw = content_w
            draw.line([pad, sy - 8, pad + content_w, sy - 8], fill=(255, 255, 255, 40))
        else:
            sx = pad + i * (content_w // 4)
            sy = yy
            sw = content_w // 4 - 24
            if i:
                draw.line([sx - 12, sy, sx - 12, sy + 140], fill=(255, 255, 255, 40))
        draw.text((sx, sy), n, font=font("NotoSerif-Regular.ttf", 28), fill=(240, 180, 180))
        draw.text((sx, sy + 40), t, font=font("NotoSans-Bold-VI.ttf", 15), fill=WHITE)
        draw_text_block(draw, (sx, sy + 68), p, font("NotoSans-VI.ttf", 13), (169, 187, 201), sw, 3)

    y = y + (560 if mobile else 280)
    draw.rectangle([0, y, width, y + 260], fill=WHITE)
    yy = y + 40
    draw.text((pad, yy), "04 — PHỐI HỢP", font=font("NotoSans-Bold-VI.ttf", 12), fill=RED)
    yy += 28
    draw.text((pad, yy), "Cách phối hợp với đối tác pháp lý", font=font("NotoSerif-Regular.ttf", 26), fill=NAVY_DEEP)
    yy += 48
    lead = "Không liệt kê tên công ty luật trên mockup cho đến khi khách xác nhận danh sách công bố."
    yy = draw_text_block(draw, (pad, yy), lead, font("NotoSans-VI.ttf", 14), MUTED, content_w, 5)
    yy += 8
    for i, item in enumerate(
        [
            "FLF tiếp nhận và phân loại yêu cầu.",
            "Nếu thuộc lĩnh vực pháp lý đặc thù → phối hợp đối tác hành nghề luật sư.",
            "Khách hàng được thông báo rõ phạm vi từng bên trước khi triển khai.",
        ],
        start=1,
    ):
        draw.text((pad, yy), f"{i:02d}", font=font("NotoSerif-Bold.ttf", 16), fill=RED)
        yy = draw_text_block(draw, (pad + 40, yy), item, font("NotoSans-VI.ttf", 14), INK, content_w - 40, 4)
        yy += 10

    y = yy + 24
    draw.rectangle([0, y, width, y + 180], fill=NAVY_DEEP)
    draw.text((pad, y + 36), "Sẵn sàng trao đổi với FLF", font=font("NotoSerif-Regular.ttf", 28), fill=WHITE)
    draw_text_block(
        draw,
        (pad, y + 80),
        "Form liên hệ sẽ có ô đồng ý xử lý dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP.",
        font("NotoSans-VI.ttf", 14),
        (169, 187, 201),
        content_w,
        4,
    )
    button(draw, (pad, y + 125), "Gửi yêu cầu liên hệ", font("NotoSans-Bold-VI.ttf", 14))

    footer_y = y + 180
    draw.rectangle([0, footer_y, width, footer_y + 120], fill=(0, 9, 16))
    try:
        wm = Image.open(WORDMARK).convert("RGBA")
        wm.thumbnail((200, 70), Image.Resampling.LANCZOS)
        # brighten for dark footer
        img.paste(wm, (pad, footer_y + 20), wm)
        tx = pad
        ty = footer_y + 90
    except Exception:
        tx, ty = pad, footer_y + 30
    draw.text((tx, ty - 20 if mobile else footer_y + 90), "MST: 0314193708 · Facebook · LinkedIn", font=font("NotoSans-VI.ttf", 12), fill=(147, 167, 183))
    return img.crop((0, 0, width, footer_y + 120))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    jobs = [
        ("A-desktop-1440.png", lambda: render_a(1440, False)),
        ("A-mobile-390.png", lambda: render_a(390, True)),
        ("B-desktop-1440.png", lambda: render_b(1440, False)),
        ("B-mobile-390.png", lambda: render_b(390, True)),
    ]
    for name, fn in jobs:
        im = fn()
        path = OUT / name
        im.save(path, "PNG", optimize=True)
        print(f"OK {path} {im.size}")


if __name__ == "__main__":
    main()
