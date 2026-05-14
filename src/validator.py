from models import DirectorChange
from typing import Optional
import re

def validate_record(record: dict, filename: str) -> Optional[DirectorChange]:
    """
    Validate and clean a raw LLM extraction record.
    Returns validated DirectorChange or None if invalid.
    """
    
    # Required fields check
    company_name = record.get("company_name", "").strip()
    director_name = record.get("director_name", "").strip()
    change_type = record.get("change_type", "")
    
    if not company_name or not director_name:
        print(f"Missing name in {filename}, skipping")
        return None
    
    if change_type not in ["appointment", "resignation", "removal"]:
        print(f"Invalid change_type '{change_type}' in {filename}, skipping")
        return None
    
    # Date validation
    effective_date = record.get("effective_date")
    if effective_date and not re.match(r"^\d{4}-\d{2}-\d{2}$", str(effective_date)):
        print(f"Invalid date format '{effective_date}' in {filename}, setting to null")
        effective_date = None
    
    # Confidence logic
    confidence = record.get("extraction_confidence", "low")
    if not effective_date or not record.get("reason_stated"):
        confidence = "medium" if confidence == "high" else confidence
    
    if len(company_name) < 3 or len(director_name) < 3:
        confidence = "low"
    
    return DirectorChange(
        source_filename=filename,
        company_name=company_name,
        stock_ticker=record.get("stock_ticker"),
        director_name=director_name,
        change_type=change_type,
        effective_date=effective_date,
        reason_stated=record.get("reason_stated"),
        extraction_confidence=confidence
    )