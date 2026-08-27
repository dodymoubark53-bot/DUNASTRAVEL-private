import os
from PIL import Image

def optimize_image(input_path, output_path, width, height):
    try:
        if not os.path.exists(input_path):
            print(f"File not found: {input_path}")
            return
            
        with Image.open(input_path) as img:
            # Resize image using Lanczos filter for high quality
            img_resized = img.resize((width, height), Image.Resampling.LANCZOS)
            
            # Save as WebP
            img_resized.save(output_path, "WEBP", quality=85)
            print(f"Optimized: {input_path} -> {output_path} ({width}x{height})")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

if __name__ == "__main__":
    # Base path for public images
    base_dir = os.path.join(os.path.dirname(__file__), "public", "imgs")
    
    tasks = [
        # Hero LCP Image
        ("egyothero.png", "egyothero.webp", 1335, 728),
        
        # Brazil Market Images
        ("Brazil/The Great Ramses.png", "Brazil/The Great Ramses.webp", 880, 480),
        ("Brazil/cairo-with-cruise-sharm-el-sheikh-detail.jpg", "Brazil/cairo-with-cruise-sharm-el-sheikh-detail.webp", 774, 774),
        ("Brazil/egito-classico-cairo-cruzeiro-no-nilo.jpg", "Brazil/egito-classico-cairo-cruzeiro-no-nilo.webp", 774, 774),
        ("Brazil/Treasures of Egypt with Alexandria.jpg", "Brazil/Treasures of Egypt with Alexandria.webp", 774, 510),
        ("Brazil/Cairo Express with Alexandria.jpeg", "Brazil/Cairo Express with Alexandria.webp", 972, 480),
        ("Brazil/Cairo Express.jpg", "Brazil/Cairo Express.webp", 860, 480),
        ("Brazil/cairo-cruzeiro-mar-vermelho.jpg", "Brazil/cairo-cruzeiro-mar-vermelho.webp", 774, 542),
        ("Brazil/cairo-with-cruise-sharm-el-sheikh.jpg", "Brazil/cairo-with-cruise-sharm-el-sheikh.webp", 870, 480),
        
        # Mascot
        ("tito-mascot.webp", "tito-mascot.webp", 300, 300)
    ]
    
    print("Starting image optimization...")
    for input_name, output_name, w, h in tasks:
        in_path = os.path.join(base_dir, input_name.replace("/", os.sep))
        out_path = os.path.join(base_dir, output_name.replace("/", os.sep))
        optimize_image(in_path, out_path, w, h)
        
    print("Done! You can now delete the old oversized PNG/JPG files.")
