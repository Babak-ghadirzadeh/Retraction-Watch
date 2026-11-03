# RetractScan: Home Landing Page, Clean Full-Text Audit, & Editorial Notes Export

A comprehensive implementation plan to refine RetractScan's editorial integrity platform: introducing a minimalist Home landing page with a "Meet the Developers" profile section, decluttering the Full-Text AI Impact workspace into a clean, card-based interface, and adding dual-format report exporting (PDF Dossier and CSV) with customizable editorial notes.

---

### User Decisions Confirmed

> [!NOTE]
> Based on your responses:
> 1. **Meet the Developers**: Featured profiles for:
>    - **Dr. Yousef Moradi, BSc, MSc, PhD**: Researcher in epidemiology at the Department of Diagnostics and Intervention, Umeå University (Umeå universitet), Sweden. Specializes in register-based health research, clinical epidemiology, meta-research, and evidence synthesis across large population cohorts.
>    - **Dr. Babak Ghadirzadeh, M.D.**: Physician and clinical researcher affiliated with Kurdistan University of Medical Sciences (Social Determinants of Health Research Center, Research Institute for Health Development). Dedicated to evidence synthesis, systematic reviews, clinical meta-analyses, and safeguarding the validity of secondary biomedical literature.
>    - *Photos*: User will supply high-resolution photos later; elegant clinical academic avatar badges will be utilized in the meantime.
> 2. **Navigation & Home**: A minimalist, high-impact landing page introducing RetractScan's purpose and capabilities, with quick links to start an audit, explore saved audits, and meet the founding researchers.
> 3. **Clean Full-Text Audit Layout**: The raw manuscript text reader is removed to eliminate visual clutter, focusing immediately on the **Data-Contribution Status Badge**, cited sentence locations, impact assessments, and actionable recommendations.
> 4. **Export with Editorial Notes**: Formatted PDF printable dossier and CSV exports, both incorporating optional user-authored editorial assessments and recommendations.

---

### 1. Proposed Architectural Changes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Minimalist Home Page (src/components/HomePage.tsx)                       │
│ ├── Hero: Platform purpose (Safeguarding Evidence Synthesis)                │
│ ├── Capabilities Grid: Journal Screening, Retraction Detection, AI Impact   │
│ ├── Workflow Infographic: From Ingestion to COPE Decision                   │
│ ├── Meet the Developers: Dr. Yousef Moradi & Dr. Babak Ghadirzadeh          │
│ └── CTA: "Launch Journal Audit" / "Run Single DOI Check"                    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. Streamlined FullTextAuditView (src/components/FullTextAuditView.tsx)     │
│ ├── Tabbed Queue (for multi-selected review articles)                       │
│ ├── Clean Document Upload & Parsing Banner                                  │
│ ├── Data-Contribution Determination Banner (Quantitative vs Contextual)     │
│ ├── In-Text Retracted Citation Sentences (Section location, Quote, Effect)  │
│ ├── Synthesis Impact & Risk Analysis                                        │
│ ├── Interactive Editorial Notes & Action Plan (Custom user input field)     │
│ └── Dual Export Actions:                                                    │
│      ├── Export Print/PDF Dossier (styled printable document with notes)    │
│      └── Export CSV Report (includes all fields + editorial remarks)        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Detailed Component Plan

#### A. Minimalist Home Page (`src/components/HomePage.tsx`)
- **Aesthetic**: Cream/slate palette (`bg-[#fafaf8]`, crisp dark borders, zero-pill styling, scientific typography).
- **Sections**:
  1. **Hero**: Clear statement of purpose—identifying post-publication retractions propagated into systematic reviews, meta-analyses, and clinical guidelines.
  2. **Core Capabilities**:
     - *Automated Secondary Literature Detection*: Heuristic identification of reviews vs primary studies.
     - *Multi-Registry Retraction Cross-Referencing*: Crossref, OpenAlex, and PubMed retraction indexing.
     - *Full-Text AI Evidence Synthesis Audit*: Differentiating between studies that contribute quantitative effect sizes and those cited merely in background context.
     - *COPE-Aligned Decision Support*: Actionable recommendations for corrections, sensitivity re-analyses, or expressions of concern.
  3. **Interactive Demo / Quick Stats**: Direct metrics on retraction persistence in biomedicine.
  4. **Meet the Developers**:
     - Clean academic profile cards for **Dr. Yousef Moradi, BSc, MSc, PhD** (Umeå University) and **Dr. Babak Ghadirzadeh, M.D.** (Kurdistan University of Medical Sciences).
     - Institutional affiliations, research tracks (epidemiology, register-based studies, systematic reviews), and placeholder avatar slots ready for user-supplied headshots.
  5. **Quick Launch Actions**: Buttons to immediately start a Journal Audit or jump into the Full-Text workspace.

#### B. Streamlined Full-Text Audit View (`src/components/FullTextAuditView.tsx`)
- Remove the left two-column manuscript text reader block.
- Convert to a single cohesive, high-density evaluation dashboard:
  - **Header & Tab Queue**: Fast navigation between selected review articles.
  - **Upload / Sample Ingestion Header**: Drag-and-drop zone or sample loader that immediately parses and triggers the audit.
  - **Prominent Verdict Banner**:
    - **CRITICAL DATA-CONTRIBUTING STUDY** (Rose/Crimson badge): The retracted study contributed to pooled effect sizes or qualitative synthesis.
    - **BACKGROUND / CONTEXTUAL CITATION** (Slate badge): The retracted study is cited only in introduction/discussion.
  - **Sentence Impact Cards / Table**: Displays each extracted citation sentence, its section (e.g. *Results / Meta-analysis*, *Methods*, *Introduction*), and its effect level with explanation.
  - **Editorial Notes Input Area**: An interactive, persistent textarea allowing the editor to record custom observations, journal internal review notes, or committee decisions.
  - **Export Toolbar**:
    - `Export PDF Dossier`: Generates an official, print-ready retraction dossier modal or formatted print preview with all metadata, AI findings, and custom notes.
    - `Export CSV`: Downloads an enriched spreadsheet with a dedicated `Editorial Notes` column.

#### C. Navigation & Integration (`src/App.tsx` & `src/components/Navbar.tsx`)
- Add `'home'` to the active view states (`'home' | 'dashboard' | 'audit' | 'single' | 'fulltext' | 'history'`).
- Set `'home'` as the primary initial view for new visitors, with clear navbar access to all audit tools.
- Ensure state persistence: Switching between Home and Full-Text Audit retains uploaded files, AI results, and editor notes.

---

### 3. Verification & Testing Steps

1. **Home Page Validation**: Check responsiveness, typography, developer profile descriptions, and quick action navigation.
2. **Layout Cleanliness**: Verify the full-text reader is removed and the full-text AI impact view renders cleanly as a focused assessment suite.
3. **Editorial Notes Integration**: Enter custom notes for an article and verify they persist during active session switching.
4. **PDF & CSV Export Verification**:
   - Trigger the CSV export and check that custom editorial notes are properly formatted and escaped in the file.
   - Trigger the PDF/Print Dossier and verify clean page layout, headers, data-contribution verdict, sentence table, and editor notes.
5. **Code Quality**: Run `compile_applet` and `lint_applet` to ensure zero compilation or type errors.
