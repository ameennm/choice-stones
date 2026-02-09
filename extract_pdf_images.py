import fitz  # PyMuPDF
import os
import glob

# Find PDF file
pdf_files = glob.glob("DocScanner*.pdf")
pdf_path = pdf_files[0] if pdf_files else None
if not pdf_path:
    print("PDF not found!")
    exit(1)
print(f"Found PDF: {pdf_path}")
output_dir = "public/products/pdf_images"

# Create output directory
os.makedirs(output_dir, exist_ok=True)

# Open PDF
doc = fitz.open(pdf_path)
print(f"PDF has {len(doc)} pages")

image_count = 0

for page_num in range(len(doc)):
    page = doc[page_num]
    images = page.get_images(full=True)
    print(f"Page {page_num + 1}: {len(images)} images")
    
    for img_index, img in enumerate(images):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        image_count += 1
        image_name = f"product_{page_num + 1}_{img_index + 1}.{image_ext}"
        image_path = os.path.join(output_dir, image_name)
        
        with open(image_path, "wb") as f:
            f.write(image_bytes)
        print(f"  Saved: {image_name}")

# If no images found, try to render pages as images
if image_count == 0:
    print("\nNo embedded images found. Rendering pages as images...")
    for page_num in range(len(doc)):
        page = doc[page_num]
        pix = page.get_pixmap(dpi=200)
        image_path = os.path.join(output_dir, f"page_{page_num + 1}.jpg")
        pix.save(image_path)
        print(f"  Saved: page_{page_num + 1}.jpg")
        image_count += 1

doc.close()
print(f"\nTotal images extracted: {image_count}")
