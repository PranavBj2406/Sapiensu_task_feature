import os
import json
import time
from pathlib import Path
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPT = """You are an expert at parsing SEBI/BSE corporate disclosure PDFs under LODR Regulations, 2015.

TASK:
1. Determine if this disclosure announces a NEW change in the Board of Directors (appointment, resignation, removal, re-appointment).
2. If YES, extract ALL new/current director changes announced in this document.
3. If NO, return empty list.

CRITICAL RULES:

WHO IS A DIRECTOR:
- ACCEPT: Managing Director, Whole-time Director, Executive Director, Independent Director, Non-Executive Director, Additional Director, Nominee Director, Chairman, Vice Chairman (if board roles).
- REJECT: CFO, Company Secretary, Group Director, "Director of [business unit]", "senior management", "Key Managerial Personnel" (KMP), auditor, compliance officer, unless EXPLICITLY stated as a Board Director.
- A "Director" on the Board of Directors is what matters. Functional titles like "Director of Operations" are NOT board directors.

MULTIPLE CHANGES:
- One document may announce MULTIPLE changes. Return ALL in the changes list.
- Each change gets its own record with its own date/reason.

PAST vs CURRENT:
- ONLY extract the NEW change being disclosed in THIS filing.
- If the document mentions past director changes by URL, reference, or historical context, IGNORE them completely.
- Do NOT extract changes that happened last year and are merely being referenced.

BUNDLED CONTENT:
- If the document bundles a director change with unrelated announcements (dividends, financial results, trading window), extract ONLY the director change part. Ignore the rest.

DATES:
- Convert all dates to YYYY-MM-DD format.
- Accept retroactive dates (dates in the past).
- If date is unclear, ambiguous, or not stated, use null.
- "w.e.f." means "with effect from" = effective date.
- "w.e.f. close of business hours on [date]" = use that date.

REASONS:
- Only extract explicitly stated reasons.
- If no reason is stated, use null. Do NOT infer or invent reasons.

CONFIDENCE:
- "high": All fields explicitly present and clear in text.
- "medium": Some inference required.
- "low": Ambiguous, missing key fields, or text is garbled.

OUTPUT FORMAT — Valid JSON only:
{
  "is_director_change": true,
  "changes": [
    {
      "company_name": "Full legal company name as stated in document header",
      "stock_ticker": "BSE ticker symbol or null if not visible",
      "director_name": "Full name exactly as written",
      "change_type": "appointment | resignation | removal",
      "effective_date": "YYYY-MM-DD or null",
      "reason_stated": "Exact stated reason or null",
      "extraction_confidence": "high | medium | low"
    }
  ]
}

If not a director change:
{
  "is_director_change": false,
  "changes": []
}
"""


def extract_from_text(text: str, filename: str) -> list[dict]:
    max_retries = 3
    base_delay = 5  # Start with 5 seconds between calls
    
    for attempt in range(max_retries):
        try:
            # Wait before each call to respect rate limits
            if attempt > 0:
                wait_time = base_delay * (2 ** attempt)  # 5s, 10s, 20s
                print(f"  Retrying {filename} in {wait_time}s...")
                time.sleep(wait_time)
            else:
                # Small delay even on first attempt to avoid burst
                time.sleep(2)
            
            prompt = SYSTEM_PROMPT + f"\n\nFilename: {filename}\n\nDocument text:\n{text[:15000]}"
            
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.1,
                    response_mime_type="application/json"
                )
            )
            
            raw = response.text
            parsed = json.loads(raw)
            return parsed.get("changes", []) if parsed.get("is_director_change") else []
            
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "quota" in error_str.lower() or "limit" in error_str.lower():
                if attempt < max_retries - 1:
                    continue  # Will retry with longer delay
                else:
                    print(f"  Max retries exceeded for {filename}")
            else:
                print(f"  LLM error for {filename}: {e}")
                return []
    
    return []