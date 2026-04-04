import sys
from PIL import Image, ImageDraw

def mask_watermark():
    try:
        img_path = "/Users/macpro/Documents/web-me/khadijah/public/about_author.jpg"
        img = Image.open(img_path).convert('RGB')
        draw = ImageDraw.Draw(img)
        
        # The watermark is on the left wall, roughly between Y=650 and Y=780, X=0 to X=220
        # Let's sample the background color from just above the watermark
        bg_color = img.getpixel((50, 640))
        
        # Draw a solid rectangle over the watermark area to completely hide it
        # Bounding box: [x0, y0, x1, y1]
        draw.rectangle([0, 650, 220, 780], fill=bg_color)
        
        # Also, let's catch any anomalies around it by slightly expanding it
        # Another pass just below if needed:
        draw.rectangle([0, 780, 200, 800], fill=bg_color)
        
        img.save(img_path, quality=95)
        print("Watermark removed explicitly.")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    mask_watermark()
