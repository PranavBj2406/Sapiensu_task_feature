# save as extract_all_texts.py in root
from pathlib import Path
from src.pdf_extractor import extract_text_from_pdf

RAW_DIR = Path("pdfs")
OUT_DIR = Path("data/extracted_texts")
OUT_DIR.mkdir(parents=True, exist_ok=True)

for pdf in sorted(RAW_DIR.glob("*.pdf")):
    text = extract_text_from_pdf(pdf)
    (OUT_DIR / f"{pdf.stem}.txt").write_text(text, encoding="utf-8")
    print(f"Done: {pdf.name}")

print(f"\nExtracted {len(list(OUT_DIR.glob('*.txt')))} texts to {OUT_DIR}")