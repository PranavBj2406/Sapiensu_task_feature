import json
from pathlib import Path
from pdf_extractor import extract_text_from_pdf
from classifier import extract_from_text
from validator import validate_record

RAW_DIR = Path("pdfs")
OUTPUT_FILE = Path("data/output/extractions.json")

def run_pipeline():
    pdf_files = sorted(RAW_DIR.glob("*.pdf"))
    
    # Load existing progress if any
    existing_extractions = []
    processed_files = set()
    failed_files = []
    
    if OUTPUT_FILE.exists():
        with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
            existing = json.load(f)
            existing_extractions = existing.get("extractions", [])
            processed_files = set(e["source_filename"] for e in existing_extractions)
            failed_files = existing.get("summary", {}).get("documents_that_failed_processing", [])
        print(f"Resuming: {len(processed_files)} already done, {len(failed_files)} failed")
    
    extractions = existing_extractions.copy()
    failed = failed_files.copy()
    
    for pdf_path in pdf_files:
        if pdf_path.name in processed_files:
            print(f"Skipping (already done): {pdf_path.name}")
            continue
        
        print(f"Processing: {pdf_path.name}")
        try:
            text = extract_text_from_pdf(pdf_path)
            if not text:
                print(f"  No text extracted")
                failed.append(pdf_path.name)
                continue
            
            changes = extract_from_text(text, pdf_path.name)
            
            for change in changes:
                validated = validate_record(change, pdf_path.name)
                if validated:
                    extractions.append(validated.model_dump())
            
            # Save progress after each successful file
            save_output(extractions, failed, pdf_files)
                
        except Exception as e:
            print(f"  Failed processing {pdf_path.name}: {e}")
            failed.append(pdf_path.name)
            save_output(extractions, failed, pdf_files)
    
    print(f"\nDone. Total extracted: {len(extractions)} changes from {len(pdf_files)} docs")
    print(f"Failed: {failed}")

def save_output(extractions, failed, pdf_files):
    output = {
        "extractions": extractions,
        "summary": {
            "total_documents_processed": len(pdf_files),
            "director_change_documents_identified": len(set(e["source_filename"] for e in extractions)),
            "total_director_changes_extracted": len(extractions),
            "documents_that_failed_processing": failed
        }
    }
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    run_pipeline()