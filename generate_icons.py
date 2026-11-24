from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import math

def create_mt_icon(size=512, is_circle=False, is_foreground_only=False):
    # Create base canvas with transparency
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    scale = size / 512.0

    if not is_foreground_only:
        # Background: sleek dark obsidian + deep emerald radial/linear glow
        margin = int(20 * scale)
        radius = int(115 * scale)

        # Draw deep luxury dark gradient
        for y in range(size):
            factor = y / size
            # Dark obsidian to rich deep emerald slate
            r = int(9 + factor * 8)
            g = int(9 + factor * 26)
            b = int(11 + factor * 20)
            draw.line([(0, y), (size, y)], fill=(r, g, b, 255))

        # Add a subtle radial emerald glow in the top-center
        glow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        glow_draw = ImageDraw.Draw(glow)
        center_x = size // 2
        center_y = int(size * 0.42)
        glow_radius = int(size * 0.48)

        for i in range(glow_radius, 0, -4):
            alpha = int(45 * (1 - i / glow_radius) ** 1.5)
            glow_draw.ellipse(
                [center_x - i, center_y - i, center_x + i, center_y + i],
                fill=(16, 185, 129, alpha)
            )
        img = Image.alpha_composite(img, glow)
        draw = ImageDraw.Draw(img)

        # Masking for app icon shape
        mask = Image.new('L', (size, size), 0)
        mask_draw = ImageDraw.Draw(mask)
        if is_circle:
            mask_draw.ellipse([margin, margin, size - margin, size - margin], fill=255)
        else:
            mask_draw.rounded_rectangle([margin, margin, size - margin, size - margin], radius=radius, fill=255)

        masked_bg = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        masked_bg.paste(img, (0, 0), mask)
        img = masked_bg
        draw = ImageDraw.Draw(img)

        # Border outline: subtle neon emerald border
        if is_circle:
            draw.ellipse([margin, margin, size - margin, size - margin], outline=(16, 185, 129, 100), width=max(2, int(4 * scale)))
        else:
            draw.rounded_rectangle([margin, margin, size - margin, size - margin], radius=radius, outline=(16, 185, 129, 100), width=max(2, int(4 * scale)))

    # Draw Monogram: MT
    # Load Font
    font_path = "C:\\Windows\\Fonts\\segoeuib.ttf"
    if not os.path.exists(font_path):
        font_path = "C:\\Windows\\Fonts\\arialbd.ttf"

    font_size = int(190 * scale)
    font = ImageFont.truetype(font_path, font_size)

    # We draw 'M' in bold crisp white, and 'T' in vibrant emerald with a dot accent
    # Get bounding boxes to center them perfectly
    text_m = "M"
    text_t = "T"

    bbox_m = font.getbbox(text_m)
    w_m = bbox_m[2] - bbox_m[0]
    h_m = bbox_m[3] - bbox_m[1]

    bbox_t = font.getbbox(text_t)
    w_t = bbox_t[2] - bbox_t[0]
    h_t = bbox_t[3] - bbox_t[1]

    spacing = int(-6 * scale) # Tight elegant kerning
    total_w = w_m + spacing + w_t
    max_h = max(h_m, h_t)

    start_x = (size - total_w) // 2
    start_y = (size - max_h) // 2 - int(10 * scale)

    pos_m = (start_x - bbox_m[0], start_y - bbox_m[1])
    pos_t = (start_x + w_m + spacing - bbox_t[0], start_y - bbox_t[1])

    # Text shadow/glow
    shadow_offset = max(2, int(6 * scale))
    draw.text((pos_m[0], pos_m[1] + shadow_offset), text_m, font=font, fill=(0, 0, 0, 160))
    draw.text((pos_t[0], pos_t[1] + shadow_offset), text_t, font=font, fill=(0, 0, 0, 160))

    # Draw 'M' - Pure crisp snow white
    draw.text(pos_m, text_m, font=font, fill=(255, 255, 255, 255))

    # Draw 'T' - Vibrant Emerald (#10B981)
    draw.text(pos_t, text_t, font=font, fill=(16, 185, 129, 255))

    # Add stylish financial accent dot above T or bottom-right
    dot_radius = int(13 * scale)
    dot_x = int(start_x + total_w + 14 * scale)
    dot_y = int(start_y + max_h - 10 * scale)
    draw.ellipse([dot_x - dot_radius, dot_y - dot_radius, dot_x + dot_radius, dot_y + dot_radius], fill=(52, 211, 153, 255))

    return img

# Generate 512x512 master logo
os.makedirs("MobileApp", exist_ok=True)
master_logo = create_mt_icon(512, is_circle=False)
master_logo.save("MobileApp/MoneyTracker-Logo-512x512.png")
print("Saved 512x512 master logo to MobileApp/MoneyTracker-Logo-512x512.png")

# Also save master round logo
master_round = create_mt_icon(512, is_circle=True)
master_round.save("MobileApp/MoneyTracker-Logo-Round-512x512.png")

# Android mipmap densities:
densities = {
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192
}

for name, s in densities.items():
    res_dir = f"android/app/src/main/res/mipmap-{name}"
    if os.path.exists(res_dir):
        # Square / rounded icon
        sq_icon = create_mt_icon(s, is_circle=False)
        sq_icon.save(f"{res_dir}/ic_launcher.png")
        
        # Round icon
        round_icon = create_mt_icon(s, is_circle=True)
        round_icon.save(f"{res_dir}/ic_launcher_round.png")

        # Foreground icon for adaptive icons (padded)
        fg_icon = create_mt_icon(int(s * 1.5), is_foreground_only=True)
        fg_icon = fg_icon.resize((s, s), Image.Resampling.LANCZOS)
        fg_icon.save(f"{res_dir}/ic_launcher_foreground.png")
        print(f"Updated Android {name} icons ({s}x{s})")

# Also save public/favicon.png and apple-touch-icon.png
master_logo.resize((192, 192), Image.Resampling.LANCZOS).save("public/icon-192.png")
master_logo.resize((512, 512), Image.Resampling.LANCZOS).save("public/icon-512.png")
master_logo.resize((180, 180), Image.Resampling.LANCZOS).save("public/apple-touch-icon.png")
master_logo.resize((64, 64), Image.Resampling.LANCZOS).save("public/favicon-64.png")
master_logo.resize((32, 32), Image.Resampling.LANCZOS).save("public/favicon-32.png")
print("All icons successfully generated!")
