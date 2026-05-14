# Sapiensu Director Change Extraction Pipeline
<img width="1732" height="626" alt="Screenshot 2026-05-14 193821" src="https://github.com/user-attachments/assets/6232a3f5-b64b-482a-8ab3-31f0014162f7" />

## How to Run

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Create `.env` and add your API key with name GEMINI_API_KEY="val"
4. Place PDFs in `pdfs/` folder
5. Run: `python -m src.pipeline`
6. Output will be saved to `data/output/extractions.json`

## Architecture

This is a file-based ETL pipeline with four stages:

1. **Extraction**: `pymupdf` extracts raw text from PDFs
2. **Classification + Entity Extraction**: Google Gemini 2.5 Flash identifies director changes and extracts structured data via JSON-mode API calls
3. **Validation**: Pydantic models enforce schema correctness; custom validators check date formats and assign confidence scores
4. **Aggregation**: Results are deduplicated, summarized, and written to final JSON

I chose an LLM-over-rules approach because 49 PDFs have highly variable layouts — writing regex parsers for each would be brittle and time-consuming. The LLM handles contextual understanding (e.g., distinguishing "Independent Director" from "Director of Operations") naturally.

## Three Key Tradeoffs

1. **LLM vs. Rule-Based Parsing**: I chose LLM for speed and adaptability. Tradeoff: less deterministic, requires retry logic for rate limits and hallucinations. With more time, I would add a hybrid layer — LLM for extraction, rule-based validators for critical fields.

2. **Cloud API vs. Local Model**: I used Gemini free tier initially but hit quota limits. I processed remaining PDFs manually via AI Studio and also set up Ollama local inference as fallback. Tradeoff: cloud is faster and more accurate; local is free but slower. For 50,000 documents, I would use batched async cloud calls with caching.

3. **No Database**: I used a file-based pipeline for simplicity with 49 documents. Tradeoff: no queryability or incremental reprocessing. At scale, I would add SQLite/PostgreSQL for intermediate storage and Redis for caching LLM responses.

## Edge Cases Handled vs. Not Handled

**Handled:**
- Multiple director changes in a single PDF (doc_017 has 5 changes)
- Distinguishing board directors from CFO/Company Secretary/senior management
- Ignoring past director changes referenced by URL or historical context
- Date normalization (converting "w.e.f. 15th March 2024" → "2024-03-15")
- Bundled disclosures (director change + unrelated announcements)

**Not Handled:**
- Image-only PDFs with no text layer (would need OCR)
- Extremely garbled text extraction where names/dates are unrecoverable
- Regional name spelling variations that don't match standard formats
- Cross-referencing ticker symbols against external databases

## AI Services Used

- **Google Gemini 2.5 Flash**: Primary extraction via API (free tier)
- **Google AI Studio**: Manual processing for quota-exceeded documents
- **Ollama + qwen2.5:7b**: Local fallback model (experimental branch)

I used AI tools for coding assistance but understand every architectural decision and can explain it in detail.

## Evaluation Note

I processed 49 PDFs and extracted 36 director changes from 22 documents. I manually spot-checked 8 records against original PDFs and estimate ~80-85% accuracy on extracted fields. The main failure modes are: (1) missing effective dates when not explicitly stated, and (2) occasional confusion between "Managing Director" (board role, valid) and "Director of X" (functional role, invalid). I did not have access to the ground-truth labels, so this is a self-assessment based on visual inspection.
