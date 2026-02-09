"""
Crop individual product images from PDF catalog pages
Images are approximately 1454x1600 pixels
"""
from PIL import Image
import os

# Create output directory
output_dir = "public/products/cropped"
os.makedirs(output_dir, exist_ok=True)

# Source directory
source_dir = "public/products/pdf_images"

def crop_and_save(source_file, crop_box, output_name, resize_to=(600, 600)):
    """Crop a region from source image and save with optional resize"""
    try:
        img_path = os.path.join(source_dir, source_file)
        img = Image.open(img_path)
        
        # Crop the image (left, upper, right, lower)
        cropped = img.crop(crop_box)
        
        # Resize to consistent size while maintaining aspect ratio
        cropped.thumbnail(resize_to, Image.Resampling.LANCZOS)
        
        # Create a square canvas and paste the image centered
        canvas = Image.new('RGB', resize_to, (255, 255, 255))
        x = (resize_to[0] - cropped.width) // 2
        y = (resize_to[1] - cropped.height) // 2
        canvas.paste(cropped, (x, y))
        
        # Save
        output_path = os.path.join(output_dir, output_name)
        canvas.save(output_path, 'JPEG', quality=90)
        print(f"[OK] Created: {output_name}")
        return True
    except Exception as e:
        print(f"[FAIL] Error creating {output_name}: {e}")
        return False

# Define crop regions for each product
# Images are approximately 1454x1600 pixels
# Format: (source_file, (left, top, right, bottom), output_name)

crops = [
    # ===== MOSAICS 4x4 & 6x6 (from product_18_1.jpeg - 1454x1600) =====
    # Shows: Pink, M-Green, Autumn, Slate Black, Rustic Black
    ("product_18_1.jpeg", (120, 50, 530, 500), "mosaic-pink.jpg"),
    ("product_18_1.jpeg", (680, 50, 1100, 500), "mosaic-m-green.jpg"),
    ("product_18_1.jpeg", (120, 530, 530, 930), "mosaic-autumn.jpg"),
    ("product_18_1.jpeg", (680, 530, 1100, 930), "mosaic-slate-black.jpg"),
    ("product_18_1.jpeg", (380, 980, 800, 1380), "mosaic-rustic-black.jpg"),
    
    # ===== TERRACOTTA JAALIS (from product_20_1.jpeg - 1454x1600) =====
    # Shows: Edan, Camp, Square, Ruby, Zebra, Petal, Pearl, Oppal
    ("product_20_1.jpeg", (80, 80, 460, 460), "terracotta-edan.jpg"),
    ("product_20_1.jpeg", (500, 80, 880, 460), "terracotta-camp.jpg"),
    ("product_20_1.jpeg", (920, 80, 1300, 460), "terracotta-square.jpg"),
    ("product_20_1.jpeg", (80, 500, 460, 880), "terracotta-ruby.jpg"),
    ("product_20_1.jpeg", (500, 500, 880, 880), "terracotta-zebra.jpg"),
    ("product_20_1.jpeg", (920, 500, 1300, 880), "terracotta-petal.jpg"),
    ("product_20_1.jpeg", (280, 920, 660, 1300), "terracotta-pearl.jpg"),
    ("product_20_1.jpeg", (700, 920, 1080, 1300), "terracotta-oppal.jpg"),
    
    # ===== PANELS 6x2 (from product_15_1.jpeg - 1454x1600) =====
    # Shows: KK White, C Gold, Restik Black, D-Green, 3D Mix, Indian Autumn, Green Restik, L Black
    ("product_15_1.jpeg", (50, 50, 650, 280), "panel-kk-white.jpg"),
    ("product_15_1.jpeg", (720, 50, 1400, 280), "panel-c-gold.jpg"),
    ("product_15_1.jpeg", (50, 310, 650, 540), "panel-restik-black.jpg"),
    ("product_15_1.jpeg", (720, 310, 1400, 540), "panel-d-green.jpg"),
    ("product_15_1.jpeg", (50, 570, 650, 800), "panel-3d-mix.jpg"),
    ("product_15_1.jpeg", (720, 570, 1400, 800), "panel-indian-autumn.jpg"),
    ("product_15_1.jpeg", (50, 830, 650, 1060), "panel-green-restik.jpg"),
    ("product_15_1.jpeg", (720, 830, 1400, 1060), "panel-l-black.jpg"),
    
    # ===== WATERFALLS (from product_16_1.jpeg - 1454x1600) =====
    ("product_16_1.jpeg", (150, 50, 1300, 450), "waterfall-c-gold.jpg"),
    ("product_16_1.jpeg", (150, 480, 1300, 880), "waterfall-black.jpg"),
    ("product_16_1.jpeg", (150, 910, 1300, 1300), "waterfall-autumn.jpg"),
    
    # ===== NATURAL TEXTURE STONES (from product_17_1.jpeg - 1454x1600) =====
    ("product_17_1.jpeg", (50, 50, 650, 350), "texture-black-restik.jpg"),
    ("product_17_1.jpeg", (750, 50, 1350, 350), "texture-s-white.jpg"),
    ("product_17_1.jpeg", (50, 380, 650, 680), "texture-cera.jpg"),
    ("product_17_1.jpeg", (750, 380, 1350, 680), "texture-slate-black.jpg"),
    ("product_17_1.jpeg", (50, 710, 650, 1010), "texture-c-gold.jpg"),
    ("product_17_1.jpeg", (750, 710, 1350, 1010), "texture-t-yellow.jpg"),
    ("product_17_1.jpeg", (50, 1040, 650, 1340), "texture-flammed-black.jpg"),
    ("product_17_1.jpeg", (750, 1040, 1350, 1340), "texture-agra-red.jpg"),
    
    # ===== EXOGEN (from product_21_1.jpeg - 1454x1600) =====
    ("product_21_1.jpeg", (80, 50, 550, 450), "exogen-autumn.jpg"),
    ("product_21_1.jpeg", (800, 50, 1350, 450), "exogen-r-black.jpg"),
    ("product_21_1.jpeg", (400, 480, 950, 850), "exogen-black.jpg"),
    ("product_21_1.jpeg", (80, 880, 650, 1350), "exogen-autumn-mosaic.jpg"),
    ("product_21_1.jpeg", (750, 880, 1350, 1350), "exogen-pink-mosaic.jpg"),
    
    # ===== VERTICAL PANELS (from product_22_1.jpeg - 1454x1600) =====
    ("product_22_1.jpeg", (30, 80, 250, 700), "panel-teak-sand-blast.jpg"),
    ("product_22_1.jpeg", (280, 80, 500, 700), "panel-star-galaxy.jpg"),
    ("product_22_1.jpeg", (530, 80, 750, 700), "panel-silver-shine.jpg"),
    ("product_22_1.jpeg", (1040, 80, 1260, 700), "panel-teak-rock.jpg"),
    ("product_22_1.jpeg", (280, 730, 500, 1350), "panel-khag-lawa.jpg"),
    ("product_22_1.jpeg", (530, 730, 750, 1350), "panel-copper.jpg"),
    ("product_22_1.jpeg", (1040, 730, 1260, 1350), "panel-silver-grey.jpg"),
    
    # ===== STACKING STONES (from product_25_1.jpeg - 1454x1600) =====
    ("product_25_1.jpeg", (50, 50, 450, 350), "stacking-copper.jpg"),
    ("product_25_1.jpeg", (500, 50, 900, 350), "stacking-d-green.jpg"),
    ("product_25_1.jpeg", (950, 50, 1350, 350), "stacking-silver-grey.jpg"),
    ("product_25_1.jpeg", (50, 380, 450, 680), "stacking-silver-shine.jpg"),
    ("product_25_1.jpeg", (500, 380, 900, 680), "stacking-star-galaxy.jpg"),
    ("product_25_1.jpeg", (950, 380, 1350, 680), "stacking-jek-black.jpg"),
    ("product_25_1.jpeg", (250, 710, 650, 1010), "stacking-teak.jpg"),
    ("product_25_1.jpeg", (700, 710, 1100, 1010), "stacking-forest-fire.jpg"),
    
    # ===== CALIBRATION STRIPS (from product_28_1.jpeg - 1454x1600) =====
    ("product_28_1.jpeg", (80, 30, 550, 220), "strip-n-green.jpg"),
    ("product_28_1.jpeg", (650, 30, 1120, 220), "strip-pink.jpg"),
    ("product_28_1.jpeg", (300, 420, 850, 650), "strip-c-gold.jpg"),
    ("product_28_1.jpeg", (80, 780, 550, 970), "strip-lime-black.jpg"),
    ("product_28_1.jpeg", (650, 780, 1120, 970), "strip-slate-black.jpg"),
    
    # ===== CLAY TILES (from product_38_1.jpeg - 1454x1600) =====
    ("product_38_1.jpeg", (50, 50, 550, 450), "clay-chocolate.jpg"),
    ("product_38_1.jpeg", (700, 50, 1200, 450), "clay-n-green.jpg"),
    ("product_38_1.jpeg", (50, 500, 550, 900), "clay-pista-green.jpg"),
    ("product_38_1.jpeg", (700, 500, 1200, 900), "clay-pink.jpg"),
    
    # ===== OTHERS (from product_40_1.jpeg - 1454x1600) =====
    ("product_40_1.jpeg", (80, 30, 600, 300), "other-rainbow.jpg"),
    ("product_40_1.jpeg", (700, 30, 1300, 300), "other-teak-sand-blast.jpg"),
    ("product_40_1.jpeg", (80, 340, 450, 700), "other-teak-champered.jpg"),
    ("product_40_1.jpeg", (500, 340, 870, 700), "other-black-rough.jpg"),
    ("product_40_1.jpeg", (920, 340, 1300, 700), "other-natural-clay.jpg"),
    ("product_40_1.jpeg", (80, 750, 450, 1100), "other-multi-gold.jpg"),
    ("product_40_1.jpeg", (500, 750, 870, 1100), "other-white-rough.jpg"),
    ("product_40_1.jpeg", (920, 750, 1300, 1100), "other-latarate-stone.jpg"),
    
    # ===== STONE JAALIS (from product_8_1.jpeg - 1454x1600) =====
    ("product_8_1.jpeg", (80, 80, 450, 450), "jaali-camp.jpg"),
    ("product_8_1.jpeg", (500, 80, 870, 450), "jaali-petal.jpg"),
    ("product_8_1.jpeg", (920, 80, 1290, 450), "jaali-opal.jpg"),
    ("product_8_1.jpeg", (80, 490, 450, 860), "jaali-pearl.jpg"),
    ("product_8_1.jpeg", (500, 490, 870, 860), "jaali-ruby.jpg"),
    ("product_8_1.jpeg", (920, 490, 1290, 860), "jaali-diamond.jpg"),
    
    # ===== PLAIN PATTIES (from product_31_1.jpeg) =====
    ("product_31_1.jpeg", (80, 100, 1350, 1450), "plain-patties.jpg"),
    
    # ===== BUTCHINGS (from product_32_1.jpeg) =====
    ("product_32_1.jpeg", (100, 80, 1350, 600), "butchings.jpg"),
    
    # ===== TERRACOTTA JAALIS DISPLAY (from product_19_1.jpeg) =====
    ("product_19_1.jpeg", (80, 100, 1350, 1450), "terracotta-jaalis-display.jpg"),
    
    # ===== CHIPOUT (from product_23_1.jpeg) =====
    ("product_23_1.jpeg", (80, 100, 1350, 1350), "chipout-display.jpg"),
    
    # ===== ADDITIONAL FROM FIRST PAGES =====
    # From product_1_1.jpeg - Stone samples
    ("product_1_1.jpeg", (100, 200, 1300, 1400), "flooring-sample.jpg"),
    
    # From product_4_1.jpeg - Multiple stone varieties
    ("product_4_1.jpeg", (100, 100, 1300, 1400), "stone-varieties.jpg"),
    
    # From product_5_1.jpeg - Tandur stones
    ("product_5_1.jpeg", (100, 100, 1300, 1400), "tandur-stones.jpg"),
    
    # From product_6_1.jpeg - More stones
    ("product_6_1.jpeg", (100, 100, 1300, 1400), "cobblestones.jpg"),
    
    # From product_7_1.jpeg - Individual jaalis
    ("product_7_1.jpeg", (80, 80, 450, 450), "stone-jaali-1.jpg"),
    ("product_7_1.jpeg", (500, 80, 870, 450), "stone-jaali-2.jpg"),
    ("product_7_1.jpeg", (920, 80, 1290, 450), "stone-jaali-3.jpg"),
    
    # From product_10_1.jpeg - More jaalis
    ("product_10_1.jpeg", (80, 80, 500, 550), "jaali-exogen.jpg"),
    
    # From product_11_1.jpeg - Panel display
    ("product_11_1.jpeg", (80, 80, 720, 600), "panel-display-1.jpg"),
    ("product_11_1.jpeg", (750, 80, 1380, 600), "panel-display-2.jpg"),
    
    # From product_14_1.jpeg - Panel closeup
    ("product_14_1.jpeg", (80, 100, 1350, 1400), "panel-multi-closeup.jpg"),
    
    # From product_26_1.jpeg - Diamond pattern
    ("product_26_1.jpeg", (100, 100, 1300, 1400), "diamond-pattern.jpg"),
    
    # From product_27_1.jpeg - Calibration display
    ("product_27_1.jpeg", (100, 100, 1300, 1400), "calibration-stones.jpg"),
    
    # From product_39_1.jpeg - Others section
    ("product_39_1.jpeg", (100, 100, 1350, 1400), "others-display.jpg"),
]

# Process all crops
print("=" * 50)
print("Cropping product images from catalog pages...")
print("=" * 50)

success_count = 0
fail_count = 0

for source, box, output in crops:
    if crop_and_save(source, box, output):
        success_count += 1
    else:
        fail_count += 1

print("=" * 50)
print(f"Complete! Success: {success_count}, Failed: {fail_count}")
print(f"Images saved to: {output_dir}")
print("=" * 50)
