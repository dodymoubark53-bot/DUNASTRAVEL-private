import os
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
import arabic_reshaper
from bidi.algorithm import get_display

FFMPEG_PATH = r"C:\Users\eslam\AppData\Roaming\Python\Python314\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
VIDEO_INPUT = "WhatsApp Video 2026-08-22 at 11.22.52 PM.mp4"
LOGO_INPUT = "WhatsApp Image 2026-08-22 at 11.25.34 PM.jpeg"
OUTPUT_VIDEO = "output_dunas_video.mp4"

def reshape_ar(text):
    reshaped = arabic_reshaper.reshape(text)
    return get_display(reshaped)

def step1_prepare_logo():
    print("Step 1: Preparing high clarity transparent logo...")
    img = Image.open(LOGO_INPUT).convert("RGBA")
    arr = np.array(img)
    
    # Mask out dark black background
    dark_mask = (arr[:, :, 0] < 18) & (arr[:, :, 1] < 18) & (arr[:, :, 2] < 18)
    arr[:, :, 3] = np.where(dark_mask, 0, 255)
    
    logo_trans = Image.fromarray(arr)
    
    # Contrast enhancement for extra clarity
    enhancer = ImageEnhance.Contrast(logo_trans)
    logo_trans = enhancer.enhance(1.15)
    
    logo_trans.save("logo_transparent.png")
    print("Saved logo_transparent.png successfully.")

def step2_generate_end_screen():
    print("Step 2: Generating high quality end screen...")
    w, h = 576, 1080
    bg = Image.new("RGB", (w, h), color="#0b0e14")
    draw = ImageDraw.Draw(bg)
    
    # Background gradient
    for y in range(h):
        r = int(10 + (18 - 10) * (y / h))
        g = int(14 + (25 - 14) * (y / h))
        b = int(22 + (38 - 22) * (y / h))
        draw.line([(0, y), (w, y)], fill=(r, g, b))
        
    gold_color = (240, 199, 138)
    draw.rectangle([15, 15, w-15, h-15], outline=gold_color, width=2)
    draw.rectangle([22, 22, w-22, h-22], outline=(60, 80, 110), width=1)
    
    # Logo (larger on end screen: 250px)
    logo = Image.open("logo_transparent.png")
    logo_w = 250
    logo_h = int(logo.height * (logo_w / logo.width))
    logo_resized = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
    bg.paste(logo_resized, ((w - logo_w) // 2, 85), logo_resized)
    
    font_bold_lg = ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 26)
    font_bold = ImageFont.truetype("C:/Windows/Fonts/tahomabd.ttf", 22)
    font_reg = ImageFont.truetype("C:/Windows/Fonts/tahoma.ttf", 22)
    
    title_ar = reshape_ar("للتواصل والحجز")
    bbox_ar = font_bold_lg.getbbox(title_ar)
    tw_ar = bbox_ar[2] - bbox_ar[0]
    draw.text(((w - tw_ar) // 2, 365), title_ar, fill=gold_color, font=font_bold_lg)
    
    # Gold separator line
    draw.line([(w//2 - 95, 420), (w//2 + 95, 420)], fill=gold_color, width=2)
    
    # Contact Card
    card_x1, card_y1, card_x2, card_y2 = 35, 455, w - 35, 965
    draw.rounded_rectangle([card_x1, card_y1, card_x2, card_y2], radius=18, fill="#121824", outline=gold_color, width=1)
    
    items = [
        ("Email", "info@dunas-travel.com"),
        ("Phone 1", "02 33746643"),
        ("Phone 2", "02 33746654"),
        ("WhatsApp", "+20 114 940 1111")
    ]
    
    y_pos = 505
    for idx, (label, val) in enumerate(items):
        # Bullet indicator
        draw.ellipse([card_x1 + 35, y_pos + 12, card_x1 + 47, y_pos + 24], fill=gold_color)
        draw.text((card_x1 + 65, y_pos + 5), val, fill="#FFFFFF", font=font_bold if "@" in val or "+" in val else font_reg)
        if idx < len(items) - 1:
            draw.line([(card_x1 + 35, y_pos + 68), (card_x2 - 35, y_pos + 68)], fill="#232e42", width=1)
        y_pos += 92
        
    bg.save("end_screen.png")
    print("Saved end_screen.png successfully.")

def step3_render_video():
    print("Step 3: Rendering video with updated larger & lower logo overlay...")
    
    # Resize transparent logo for overlay on main video (width = 210px) with drop shadow built-in
    logo = Image.open("logo_transparent.png")
    target_w = 210
    target_h = int(logo.height * (target_w / logo.width))
    logo_resized = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    # Create canvas with padding for shadow
    pad = 12
    overlay_canvas = Image.new("RGBA", (target_w + pad*2, target_h + pad*2), (0, 0, 0, 0))
    
    # Create shadow mask
    alpha = logo_resized.split()[3]
    shadow = Image.new("RGBA", logo_resized.size, (0, 0, 0, 0))
    shadow.paste((0, 0, 0, 200), (0, 0), mask=alpha)
    shadow_blurred = shadow.filter(ImageFilter.GaussianBlur(radius=5))
    
    # Paste shadow and logo
    overlay_canvas.paste(shadow_blurred, (pad, pad + 2), shadow_blurred)
    overlay_canvas.paste(logo_resized, (pad, pad), logo_resized)
    overlay_canvas.save("logo_video_overlay_v2.png")
    
    # Overlay coordinates: logo size is (210 + 24) x (target_h + 24)
    # To place logo top-center at y = 50px:
    x_pos = (576 - (target_w + pad*2)) // 2  # centered
    y_pos = 50 - pad
    
    cmd_main = [
        FFMPEG_PATH, "-y",
        "-i", VIDEO_INPUT,
        "-i", "logo_video_overlay_v2.png",
        "-filter_complex", f"[0:v]crop=576:1080:0:0[cropped];[cropped][1:v]overlay={x_pos}:{y_pos}[v]",
        "-map", "[v]",
        "-map", "0:a",
        "-c:v", "libx264", "-preset", "fast", "-crf", "18",
        "-c:a", "aac", "-b:a", "128k",
        "temp_main_processed.mp4"
    ]
    print(f"Running command for main video processing (x={x_pos}, y={y_pos})...")
    res = subprocess.run(cmd_main, capture_output=True, text=True)
    if res.returncode != 0:
        print("Main video error:", res.stderr)
        raise RuntimeError("Failed to process main video")
    print("Main video processed successfully.")
    
    # 2. Render 4-second end screen clip
    cmd_endscreen = [
        FFMPEG_PATH, "-y",
        "-loop", "1", "-i", "end_screen.png",
        "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
        "-c:v", "libx264", "-t", "4", "-pix_fmt", "yuv420p", "-r", "35.407",
        "-c:a", "aac", "-b:a", "128k", "-shortest",
        "temp_endscreen.mp4"
    ]
    print("Running command for end screen video rendering...")
    res = subprocess.run(cmd_endscreen, capture_output=True, text=True)
    if res.returncode != 0:
        print("End screen video error:", res.stderr)
        raise RuntimeError("Failed to render end screen video")
    print("End screen video rendered successfully.")
    
    # 3. Concatenate main video and end screen video
    concat_list_file = "concat_list.txt"
    with open(concat_list_file, "w") as f:
        f.write("file 'temp_main_processed.mp4'\n")
        f.write("file 'temp_endscreen.mp4'\n")
        
    cmd_concat = [
        FFMPEG_PATH, "-y",
        "-f", "concat", "-safe", "0", "-i", concat_list_file,
        "-c", "copy",
        OUTPUT_VIDEO
    ]
    print("Running concatenation command...")
    res = subprocess.run(cmd_concat, capture_output=True, text=True)
    if res.returncode != 0:
        print("Concatenation error:", res.stderr)
        raise RuntimeError("Failed to concatenate video clips")
        
    print(f"VIDEO PROCESSING COMPLETE! Updated output saved to: {OUTPUT_VIDEO}")

if __name__ == "__main__":
    step1_prepare_logo()
    step2_generate_end_screen()
    step3_render_video()
