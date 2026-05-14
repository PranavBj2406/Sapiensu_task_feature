import pytest
import sys
from pathlib import Path

# Add both project root and src/ to path
sys.path.insert(0, str(Path(__file__).parent.parent))        # for src.validator, src.models
sys.path.insert(0, str(Path(__file__).parent.parent / "src")) # for validator.py's internal imports

from src.validator import validate_record


def test_valid_record_passes():
    """A complete, valid record should pass validation."""
    raw = {
        "source_filename": "doc_001.pdf",
        "company_name": "ABC Ltd",
        "stock_ticker": "500001",
        "director_name": "Mr. Rakesh Sharma",
        "change_type": "appointment",
        "effective_date": "2024-03-15",
        "reason_stated": "Appointed as Additional Director",
        "extraction_confidence": "high"
    }
    result = validate_record(raw, "doc_001.pdf")
    assert result is not None
    assert result.company_name == "ABC Ltd"
    assert result.change_type == "appointment"
    assert result.extraction_confidence == "high"


def test_invalid_date_gets_corrected():
    """Invalid date format should be set to null."""
    raw = {
        "source_filename": "doc_002.pdf",
        "company_name": "XYZ Corp",
        "director_name": "Ms. Priya Patel",
        "change_type": "resignation",
        "effective_date": "15-03-2024",
        "reason_stated": "Personal reasons",
        "extraction_confidence": "high"
    }
    result = validate_record(raw, "doc_002.pdf")
    assert result is not None
    assert result.effective_date is None
    assert result.extraction_confidence in ["medium", "low"]


def test_missing_company_name_returns_none():
    """Record with empty company name should be rejected."""
    raw = {
        "source_filename": "doc_003.pdf",
        "company_name": "",
        "director_name": "Mr. Test",
        "change_type": "removal",
        "effective_date": None,
        "reason_stated": None,
        "extraction_confidence": "high"
    }
    result = validate_record(raw, "doc_003.pdf")
    assert result is None


def test_short_names_get_low_confidence():
    """Suspiciously short names should trigger low confidence."""
    raw = {
        "source_filename": "doc_005.pdf",
        "company_name": "A",
        "director_name": "B",
        "change_type": "appointment",
        "effective_date": None,
        "reason_stated": None,
        "extraction_confidence": "high"
    }
    result = validate_record(raw, "doc_005.pdf")
    assert result is not None
    assert result.extraction_confidence == "low"


def test_invalid_change_type_returns_none():
    """Invalid change_type should be rejected."""
    raw = {
        "source_filename": "doc_006.pdf",
        "company_name": "Test Ltd",
        "director_name": "Mr. X",
        "change_type": "retirement",
        "effective_date": "2024-01-01",
        "reason_stated": None,
        "extraction_confidence": "high"
    }
    result = validate_record(raw, "doc_006.pdf")
    assert result is None