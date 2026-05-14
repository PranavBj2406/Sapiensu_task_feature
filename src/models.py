from pydantic import BaseModel
from typing import Literal, Optional
from datetime import date

class DirectorChange(BaseModel):
    source_filename: str
    company_name: str
    stock_ticker: Optional[str]
    director_name: str
    change_type: Literal["appointment", "resignation", "removal"]
    effective_date: Optional[str]  # YYYY-MM-DD or null
    reason_stated: Optional[str]
    extraction_confidence: Literal["high", "medium", "low"]

class ExtractionOutput(BaseModel):
    extractions: list[DirectorChange]
    summary: dict