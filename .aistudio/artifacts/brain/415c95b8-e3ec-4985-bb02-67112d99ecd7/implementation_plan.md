# RetractScan: Journal Editorial Citation & Retraction Audit Platform

A specialized editorial integrity platform for journal editors to identify review and secondary studies, audit their bibliography against Crossref, PubMed, and OpenAlex retraction registries, and generate actionable editorial risk reports with PDF and CSV export.

> [!IMPORTANT]
> **Confirmed Editorial Requirements**:
> - **Retraction Validation Engine**: Hybrid verification querying **Crossref**, **PubMed**, and **OpenAlex** to catch retractions, expressions of concern, and post-publication notices.
> - **Review & Secondary Study Detection**: Three-layer hybrid approach combining **metadata publication types**, **AI abstract classification** via Gemini 3.8 Flash, and **keyword pattern matching** (systematic reviews, meta-analyses, scoping reviews, guideline overviews).
> - **Reporting & Export**: **Interactive editorial dashboard** with comprehensive risk visualizer, flagged citation context viewer, **PDF printable report**, and **CSV audit export**.
> - **Dual Auditing Modes**: Batch journal audit (timeline + max article limit + multi-select/select all) and Individual Article Lookup (by DOI or PubMed URL/PMID).

---

## 1. Overview & Core Concept

RetractScan empowers journal editors, managing editors, and peer review coordinators to protect their journal's scientific integrity. Secondary research—systematic reviews, meta-analyses, scoping reviews, and clinical practice guidelines—synthesizes primary evidence. When a review study inadvertently cites retracted primary research as valid evidence, its synthesized conclusions and pooled effect sizes can become compromised.

RetractScan automates the discovery, extraction, verification, and editorial resolution of such compromised citations:
1. **Editor Authentication & Workspace**: Quick editor profile setup with journal affiliation, ORCID/email, and persistent audit session logs.
2. **Journal Discovery**: Live search via Crossref and OpenAlex APIs, displaying verified ISSNs, publisher details, and direct links to official journal pages.
3. **Review Identification**: Filters articles across user-specified timelines (e.g., 2026, 2025, 2024, or custom year ranges) and batch sizes. Utilizes a 3-layer detection pipeline (official metadata types, keyword heuristics, and Gemini 3.8 Flash abstract classification) to isolate secondary studies.
4. **Selective Batch Audit**: Interactive data table with individual selection checkboxes, select-all toggle, and instant filtering.
5. **AI Reference Parsing & Retraction Verification**: Extracts referenced works from Crossref and OpenAlex, checks each cited paper's retraction status, retraction date relative to review publication date, and flags whether the citation occurred *after* retraction.
6. **Interactive Editorial Dashboard & Exports**: Visual risk matrices, citation graph breakdowns, editorial assessment status markers (e.g. "Request Author Corrigendum", "Editorial Note", "In Review"), and 1-click PDF/CSV exports.
7. **Ad-Hoc DOI & PubMed Scanner**: Direct single-article validator for incoming manuscript submissions or flagged articles.

---

## 2. User Experience & Visual Design

RetractScan adheres to modern SaaS and scientific dashboard design principles: calm neutral slate aesthetics (`#0F172A` / `#F8FAFC`), crisp typography (`Plus Jakarta Sans` for headers, `DM Sans` for body, `JetBrains Mono` / tabular numbers for ISSNs, DOIs, and counts), and zero generic AI cliches.

### Key User Flows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Editor Login / Workspace (Affiliation, Journal Selection, Saved Audits)  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. Mode Selector: [Journal Batch Audit]  or  [Single DOI / PubMed Assessor] │
└──────────────────┬──────────────────────────────────────┬───────────────────┘
                   ▼                                      ▼
┌─────────────────────────────────────┐   ┌───────────────────────────────────┐
│ Journal Search & Timeline Filter    │   │ Individual DOI / PubMed Resolver  │
│ - Live Crossref/OpenAlex search     │   │ - Auto-resolves metadata & PMID   │
│ - Select ISSN & Journal details     │   │ - Pulls full reference list       │
│ - Date range & max article limit    │   │ - Direct retraction scan          │
└──────────────────┬──────────────────┘   └──────────────────┬────────────────┘
                   ▼                                         │
┌─────────────────────────────────────┐                      │
│ Review Studies Identification Table │                      │
│ - Filtered secondary studies list   │                      │
│ - Select All / Individual toggles   │                      │
│ - AI study type confidence & tags   │                      │
└──────────────────┬──────────────────┘                      │
                   ▼                                         │
┌────────────────────────────────────────────────────────────┴────────────────┐
│ 3. Citation & Retraction Verification Engine (Crossref + OpenAlex + PubMed) │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. Interactive Editorial Assessment Dashboard                               │
│ - High-level Risk Summary & Matrix (Retracted citations / Total cited)      │
│ - Per-article breakdown with collapsible flagged references                 │
│ - Retraction details: Retraction notice DOI, date, retraction reason        │
│ - Editorial action checklists (Corrigendum / Note / Valid discussion)       │
│ - Export buttons: Professional Print/PDF report & CSV audit ledger          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Visual Identity & Theme Tokens
- **Canvas**: Clean high-contrast white & slate backgrounds (`bg-slate-50 dark:bg-slate-950`).
- **Primary & Action**: Academic navy and indigo (`text-indigo-600 dark:text-indigo-400`, `bg-indigo-600 hover:bg-indigo-700`).
- **Semantic Severity**:
  - **Retracted Citation (Critical Alert)**: Deep crimson (`bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-900 dark:text-red-300`).
  - **Expression of Concern (High Warning)**: Amber (`bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-300`).
  - **Clean / Verified (Nominal)**: Emerald (`text-emerald-700 dark:text-emerald-400`).
- **Typography**: Single-line controls, zero-pill metadata with typographic `·` separators, tabular figures for DOIs and dates.

---

## 3. Key Product Decisions & Trade-Offs

1. **Three-Layer Secondary Study Classifier**:
   - *Why*: Relying solely on publisher metadata tags fails because many journals label systematic reviews generically as "journal-article" or "article". Combining (1) OpenAlex/PubMed type tags, (2) title/abstract keyword regexes, and (3) Gemini 3.8 Flash structured semantic classification guarantees maximum recall and precision for systematic reviews, meta-analyses, and scoping reviews.
2. **Server-Side Proxy Architecture for Academic APIs**:
   - *Why*: Crossref, PubMed E-utilities, and OpenAlex require custom User-Agent headers (polite pool) and avoid browser CORS restrictions. Express server routes (`/api/academic/*`) proxy and cache these requests securely, with server-side `@google/genai` calls using `process.env.GEMINI_API_KEY`.
3. **Pre- vs. Post-Retraction Citation Timing**:
   - *Why*: An article citing a paper *before* it was retracted is unfortunate, but citing a paper *years after* it was retracted is a major editorial failure. RetractScan calculates the delta between the review publication date and the cited paper's retraction date, flagging post-retraction citations with elevated critical risk.
4. **Interactive Editorial Action Tracking**:
   - *Why*: Editors need more than a list; they need an assessment workflow. Editors can mark citations as "Flagged for Corrigendum", "Author Alert Sent", "Dismissed (Discussions of retraction)", or "Under Review", and save the state locally for ongoing audits.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                Frontend (React)                             │
│                                                                             │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐  │
│  │ Editor Login / Profile│  │ Journal Search & Feed │  │ Individual DOI  │  │
│  └───────────────────────┘  └───────────────────────┘  └─────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Article Selection Table (Multi-select, Select All, Study Type Badges) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Audit Dashboard: Visual Risk Matrix, Flagged Citations, PDF/CSV Export│  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP API Calls (/api/*)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Backend Proxy Server (Express)                     │
│                                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌───────────────────┐  │
│  │ /api/academic/search │  │ /api/academic/journal│  │ /api/academic/doi │  │
│  └──────────┬───────────┘  └──────────┬───────────┘  └─────────┬─────────┘  │
│             │                         │                        │            │
│  ┌──────────▼─────────────────────────▼────────────────────────▼──────────┐  │
│  │ Citation & Retraction Verification Service                             │  │
│  │ - Crossref Works & Update-to API                                       │  │
│  │ - OpenAlex Works (is_retracted flag, referenced_works)                 │  │
│  │ - PubMed E-utilities (PMID <-> DOI conversion & pub types)             │  │
│  └────────────────────────────────────┬───────────────────────────────────┘  │
│                                       │                                      │
│  ┌────────────────────────────────────▼───────────────────────────────────┐  │
│  │ Gemini 3.8 Flash AI Engine (@google/genai)                             │  │
│  │ - Abstract Review Type Classifier                                      │  │
│  │ - Unstructured Citation String Extractor                               │  │
│  │ - Citation Context & Editorial Impact Summarizer                       │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key API Endpoints
- `GET /api/academic/journals?q={name}`: Queries Crossref and OpenAlex for journals, ISSNs, homepage links, and publishers.
- `GET /api/academic/journal-articles`: Fetches articles for an ISSN across specified years (e.g. 2024-2026), applying the 3-layer review filter.
- `POST /api/academic/audit-batch`: Takes a list of selected article DOIs/PMIDs, extracts their bibliography, verifies every cited DOI against Crossref and OpenAlex retraction registries, and returns structured citation risk reports.
- `GET /api/academic/resolve-article?identifier={doi_or_pmid}`: Resolves a single DOI or PubMed URL/ID, returns title, authors, journal, and runs the citation retraction audit.
- `POST /api/gemini/classify-reviews`: Uses `gemini-3.8-flash` to classify ambiguous papers into review taxonomy (Systematic Review, Meta-Analysis, Scoping Review, Guideline, Narrative Review, Primary Study).

---

## 5. Verification Plan

1. **Unit Tests (`node:test` via `npx --yes tsx --test`)**:
   - Test review detection heuristics and regex pattern matching.
   - Test retraction timing calculations (pre- vs. post-retraction citation delta).
   - Test CSV export formatting and DOI/PMID parsing routines.
2. **End-to-End User Journeys**:
   - **Journey 1 (Batch Audit)**: Login -> Search journal (e.g. "The Lancet" or "BMJ") -> Select timeline and article count -> Review and filter secondary studies -> Select All / Individual items -> Run retraction scan -> Inspect visual risk report -> Download CSV audit sheet.
   - **Journey 2 (Single DOI/PubMed Lookup)**: Switch to individual article view -> Input DOI or PubMed URL -> Auto-fetch metadata and bibliography -> Flag retracted citations -> Record editorial assessment note -> Print/export PDF summary.
