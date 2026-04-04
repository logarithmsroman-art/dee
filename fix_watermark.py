from PIL import Image

def process_watermark():
    try:
        # Open image
        img_path = "/Users/macpro/Documents/web-me/khadijah/public/about_author.jpg"
        img = Image.open(img_path)
        pixels = img.load()
        
        # We need to find the approximate bounding box of the black text.
        # The background is a solid dusty peach color.
        # Let's get the color from (50, 450) exactly above the watermark area.
        bg_color = pixels[50, 450]
        
        # Approximate region based on standard aspect ratios
        # The image is 768 x 1024
        # The text is on the left wall.
        x_start, x_end = 30, 250
        y_start, y_end = 500, 650
        
        # Alternatively, we can do a smart fill:
        # Any pixel darker than a threshold in this region gets replaced by bg
        for x in range(10, 250):
            for y in range(480, 680):
                r, g, b = pixels[x, y][:3]
                # If dark pixel (text)
                if r < 120 and g < 120 and b < 120:
                    pixels[x, y] = bg_color
                    
        img.save(img_path)
        print("Watermark patched!")
    except Exception as e:
        print(f"Error: {e}")

process_watermark()
