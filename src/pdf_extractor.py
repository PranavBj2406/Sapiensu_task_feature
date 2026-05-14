import fitz  # pymupdf
from pathlib import Path

def extract_text_from_pdf(pdf_path: Path) -> str:
    """Extract text from a PDF file. Returns raw text string."""
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text.strip()