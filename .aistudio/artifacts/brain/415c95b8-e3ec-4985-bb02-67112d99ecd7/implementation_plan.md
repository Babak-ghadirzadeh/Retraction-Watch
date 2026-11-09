# RetractScan SEO & Crawler Architecture Implementation Plan

Comprehensive technical SEO, search engine crawler optimization, and on-page architectural plan for `retractscan.studio.ai`.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following technical and editorial choices were confirmed during Phase 1 clarification:
> - **Primary `<h1>` Tag**: Confirmed as `"Academic Paper Integrity Tool and Retraction Audit Platform"`.
> - **Rich On-Page Landing Sections**: Confirmed additions of the **Four-Layer Verification Methodology Section** and the **Audience Breakdown for Researchers, Editors, and Institutions**.
> - **Structured Data Suite**: Confirmed implementation of the full JSON-LD schema suite including `WebApplication`, `Organization`, `ScholarlyArticle`, and `FAQPage` for rich search snippet qualification.
> - **Canonical Domain**: Locked to `https://retractscan.studio.ai/`.

---

### 1. Overview & Core Concept

- **What It Does**: Establishes enterprise-grade technical and on-page SEO for `retractscan.studio.ai`, ensuring search engine bots (Googlebot, Bingbot) render complete semantic content without blank containers, crawl freely via validated `robots.txt` and `sitemap.xml`, and index high-intent keywords across research integrity, retraction scanning, and pre-flight manuscript checks.
- **Target Audience / Personas**:
  1. *Academic Researchers & Systematic Review Authors*: Scanning citations before submission to ensure their secondary studies do not rely on retracted trials.
  2. *Journal Editors & Editorial Boards*: Screening incoming submissions and batch-auditing journal archives for contaminated literature.
  3. *Universities, Medical Schools & Research Integrity Officers*: Auditing institutional publication outputs and compliance under COPE guidelines.
- **Key Value**: Guarantees full discoverability in search engines for high-intent search queries (e.g., *"check retracted scientific papers"*, *"academic paper integrity tool"*, *"retraction scanner"*), rich search snippet visibility (FAQ & SoftwareApplication), fast mobile load speeds, and clean OpenGraph/Twitter social cards.

---

### 2. User Experience & Visual Design

- **Landing Page Hierarchy & Typography**:
  - **Single Descriptive `<h1>` (Main Focus)**:
    `Academic Paper Integrity Tool and Retraction Audit Platform`
    Styled in clean display type (`Plus Jakarta Sans`, 600 weight, balanced text wrap).
  - **Supporting Subtitle**: Concise, high-intent value proposition detailing real-time Crossref, PubMed, and OpenAlex retraction tracking.
  - **Four-Layer Verification Methodology Section (`<h2>` / `<h3>`)**:
    Visual technical breakdown illustrating Layer 1 (Crossref REST API live retraction metadata), Layer 2 (PubMed E-Utilities & MeSH retraction status), Layer 3 (OpenAlex & Europe PMC cross-referencing), and Layer 4 (COPE Corrigenda & Quantitative Meta-Analysis Contamination check).
  - **Audience & Use Case Breakdown Section (`<h2>` / `<h3>`)**:
    Three clean, elevated cards highlighting workflows for:
    - *Researchers & Authors* (Preventing retraction citations in bibliographies, Pre-Flight certification).
    - *Journal Editors & Reviewers* (Batch journal auditing, Crossref metadata verification, COPE errata drafting).
    - *Universities & Research Offices* (Portfolio integrity health, clinical evidence protection).
  - **Interactive Scholarly FAQ Section (`<h2>` / `<h3>`)**:
    Accordion of high-intent questions (What is post-retraction citation contamination? How does RetractScan detect retractions? What is the COPE workflow for corrigenda?) directly mirroring the `FAQPage` JSON-LD schema.
- **Visual Identity & Anti-Slop Discipline**:
  - Clean academic aesthetic, adhering to the 60-30-10 palette budget (60% stone-50/obsidian canvas, 30% structural surfaces with 1px hairline dividers, 10% emerald/amber precision accents).
  - Unboxed metadata with typographic separators (`·`), zero decorative pill badges, zero fake compiler tags, and descriptive `alt` tags on all image elements.

---

### 3. Key Technical Decisions & Trade-Offs

- **Decision 1: Client-Side Rendering vs. Bot Rendering Fallback**
  - *Chosen Approach*: Embed semantic static fallback content within `#root` and `<noscript>` inside `index.html`. When a search bot inspects the page or experiences slow JS execution, it immediately parses the primary `<h1>`, key methodology paragraphs, audience breakdowns, and FAQ structure without encountering an empty container. When the React SPA hydrates, it seamlessly mounts over `#root`.
  - *Why*: Eliminates the risk of Google Search Console URL Inspection reporting a blank container or soft 404 during initial crawl evaluation.
- **Decision 2: Schema.org Structured Data Strategy**
  - *Chosen Approach*: Multi-entity JSON-LD graph combining `@type: WebApplication`, `@type: Organization`, `@type: ScholarlyArticle`, and `@type: FAQPage`.
  - *Why*: Qualifies for rich Google snippet cards, knowledge panel association, and Google Search FAQ drop-downs.
- **Decision 3: Robots & Sitemap Specification**
  - *Chosen Approach*: Clean `robots.txt` with `User-agent: *`, `Allow: /`, pointing directly to `https://retractscan.studio.ai/sitemap.xml`, without any `Disallow: /` directives that would block crawler discovery.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Search Engine Crawlers                          │
│               (Googlebot, Bingbot, Social Preview Bots)                │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
              Crawls /robots.txt & /sitemap.xml
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Technical SEO Entry Points                       │
│  ├── /public/robots.txt (Allow: /, Sitemap: https://retractscan...xml) │
│  └── /public/sitemap.xml (https://retractscan.studio.ai/, priority 1.0)│
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                       Fetches HTML Document
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                              index.html                                │
│  ├── Meta Title (<60 chars): "RetractScan | AI Retraction Checker..."  │
│  ├── Meta Description (<155 chars): "Scan academic papers for..."      │
│  ├── Robots Tag: "index, follow, max-snippet:-1, max-image-preview..." │
│  ├── Canonical: "https://retractscan.studio.ai/"                       │
│  ├── OpenGraph & Twitter Card Tags (summary_large_image)               │
│  ├── JSON-LD Schema Suite (WebApplication, Organization, FAQPage, etc.)│
│  └── Pre-Rendered Semantic SEO Fallback inside #root & <noscript>      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                          React SPA Mounts
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  On-Page Content & Semantics (HomePage)                │
│  ├── Single Descriptive <h1>: "Academic Paper Integrity Tool..."       │
│  ├── <h2>: Four-Layer Retraction Detection Methodology                 │
│  │    ├── <h3>: Layer 1 - Crossref REST API Retraction Index           │
│  │    ├── <h3>: Layer 2 - PubMed & MeSH Notice Parsing                 │
│  │    ├── <h3>: Layer 3 - OpenAlex Multidisciplinary Graph             │
│  │    └── <h3>: Layer 4 - COPE Corrigenda & Meta-Analysis Audit        │
│  ├── <h2>: Purpose-Built for Scholarly Integrity                       │
│  │    ├── <h3>: For Researchers & Systematic Review Authors            │
│  │    ├── <h3>: For Journal Editors & Peer Reviewers                   │
│  │    └── <h3>: For Universities & Research Integrity Offices          │
│  ├── <h2>: Frequently Asked Questions & Academic Integrity Guidelines  │
│  │    └── Interactive Accordion mirroring FAQPage JSON-LD schema       │
│  └── Image Assets: Descriptive alt text & priority loading attributes  │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 5. Verification & Testing Strategy

1. **Crawler Access Verification**:
   - Verify `/robots.txt` returns HTTP 200 with `Allow: /` and no `Disallow: /` directives.
   - Verify `/sitemap.xml` returns valid XML referencing `https://retractscan.studio.ai/`.
2. **Metadata & Character Counts**:
   - Meta title strictly $\le 60$ characters.
   - Meta description strictly $\le 155$ characters.
3. **Structured Data Validation**:
   - Validate JSON-LD syntax for `WebApplication`, `Organization`, and `FAQPage`.
4. **DOM & Semantic Heading Check**:
   - Verify exactly one `<h1>` tag in the rendered page.
   - Verify hierarchical order of `<h2>` and `<h3>` tags.
   - Confirm all images contain meaningful `alt` attributes.
5. **Compilation & Linter**:
   - Run `compile_applet` and `lint_applet` together to verify error-free execution.
