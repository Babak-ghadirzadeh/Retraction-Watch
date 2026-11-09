import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Layers,
  Sparkles,
  FileText,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Award,
  GraduationCap,
  Building2,
  ExternalLink,
  CheckCircle2,
  Users,
  Compass,
  Download,
  FileCheck,
  ChevronDown,
} from 'lucide-react';

interface HomePageProps {
  onStartAudit: () => void;
  onSingleArticle: () => void;
  onExploreFullText: () => void;
  onPreFlight?: () => void;
  auditCount?: number;
}

const FAQS = [
  {
    question: 'What is post-retraction citation contamination?',
    answer:
      'Post-retraction citation contamination occurs when scientific papers unknowingly cite clinical trials or biomedical studies that have already been officially retracted or flagged for unreliable data, data fabrication, or ethical violations. When cited in systematic reviews and meta-analyses, retracted data can distort pooled effect sizes and compromise clinical practice guidelines.',
  },
  {
    question: 'How does RetractScan detect retracted papers in manuscripts and journals?',
    answer:
      'RetractScan queries the Crossref REST API, PubMed E-Utilities, Europe PMC, and OpenAlex in real time. It cross-references extracted reference DOIs against verified publisher retraction notice indices and distinguishes between citations made before versus after the formal retraction date.',
  },
  {
    question: 'Which file formats can be scanned before submission?',
    answer:
      'The Pre-Submission Pre-Flight Scanner supports Microsoft Word documents (.docx), Adobe PDF files (.pdf), plain text reference lists (.txt), and directly pasted bibliography text. It generates an instant, verifiable Pre-Flight Citation Health Certificate.',
  },
  {
    question: 'Does RetractScan comply with COPE guidelines?',
    answer:
      'Yes. RetractScan is aligned with the Committee on Publication Ethics (COPE) retraction guidelines, providing editors and authors with pre-drafted errata, corrigenda notices, and editorial assessment templates for immediate board action.',
  },
  {
    question: 'Is RetractScan free to use for academic researchers?',
    answer:
      'Yes, RetractScan provides open access to academic researchers, peer reviewers, and journal editorial boards to screen individual DOIs, upload manuscripts for pre-flight checking, and audit journal archives.',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  onStartAudit,
  onSingleArticle,
  onExploreFullText,
  onPreFlight,
  auditCount = 0,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const scrollToDevelopers = () => {
    const el = document.getElementById('meet-the-developers');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 pb-12 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 border-b border-stone-200/80 dark:border-stone-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading and Action Buttons */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 mb-6">
              <span>Automated Academic Integrity &amp; Citation Auditing Suite</span>
              <span aria-hidden="true">·</span>
              <span>COPE &amp; PRISMA Protocol</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 leading-[1.18] text-balance">
              Academic Paper Integrity Tool and Retraction Audit Platform
            </h1>

            <p className="mt-5 text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
              When primary clinical trials or biomedical studies are retracted, secondary literature—systematic reviews,
              meta-analyses, and clinical guidelines—frequently continues citing them unknowingly.
              <strong> RetractScan</strong> systematically screens journal bibliographies, indexes post-publication retractions,
              provides pre-submission pre-flight checks, and audits evidence synthesis contamination.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onStartAudit}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer group"
              >
                <span>Launch Journal Retraction Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {onPreFlight && (
                <button
                  type="button"
                  onClick={onPreFlight}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer group"
                >
                  <FileCheck className="w-4 h-4 group-hover:rotate-6 transition-transform" />
                  <span>Pre-Flight Manuscript Scanner</span>
                </button>
              )}

              <button
                type="button"
                onClick={onSingleArticle}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-semibold hover:-translate-y-0.5 active:translate-y-0 active:scale-95 hover:shadow-xs transition-all duration-200 cursor-pointer group"
              >
                <Search className="w-4 h-4 text-stone-500 group-hover:scale-110 transition-transform" />
                <span>Inspect Single DOI</span>
              </button>
            </div>
          </div>

          {/* Right Column: Animated Scholarly Books & Manuscript Papers Composition */}
          <div className="lg:col-span-5 hidden sm:flex items-center justify-center relative py-6">
            <div className="relative w-full max-w-sm">
              {/* Floating Ambient Aura */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/10 via-stone-400/10 to-amber-500/10 rounded-3xl blur-2xl -z-10 animate-pulse-soft" />

              {/* Floating Paper Sheet 1: Flagged Citation Audit (Back Tilted) */}
              <div className="absolute -top-6 -left-4 w-36 h-48 rounded-xl bg-stone-100/90 dark:bg-stone-800/90 border border-stone-300 dark:border-stone-700 p-3 shadow-md -rotate-6 animate-float-gentle z-0">
                <div className="flex items-center justify-between pb-1 border-b border-stone-200 dark:border-stone-700">
                  <span className="text-[7.5px] font-mono text-stone-400">doi:10.1016...</span>
                  <span className="text-[7.5px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-1 rounded">FLAGGED</span>
                </div>
                <div className="w-3/4 h-1.5 rounded bg-stone-300 dark:bg-stone-600 mt-2" />
                <div className="space-y-1 mt-1.5">
                  <div className="w-full h-1 rounded bg-stone-200 dark:bg-stone-700" />
                  <div className="w-5/6 h-1 rounded bg-stone-200 dark:bg-stone-700" />
                  <div className="w-2/3 h-1 rounded bg-stone-200 dark:bg-stone-700" />
                </div>
              </div>

              {/* Center Main Stage: Open Academic Journal Volume */}
              <div className="relative rounded-2xl bg-white dark:bg-stone-900 border border-stone-300/90 dark:border-stone-700/90 p-4 shadow-xl z-10 transition-all hover:shadow-2xl">
                {/* Journal Volume Masthead */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-200/80 dark:border-stone-800">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      The Lancet
                    </span>
                    <span className="text-[10px] text-stone-400">· Systematic Review</span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-900">
                    PRISMA 2020
                  </span>
                </div>

                {/* Open Book Spread Simulation */}
                <div className="grid grid-cols-2 gap-3 bg-stone-50/70 dark:bg-stone-800/40 p-3 rounded-xl border border-stone-200/60 dark:border-stone-800 relative">
                  {/* Center spine gutter */}
                  <div className="absolute top-2 bottom-2 left-1/2 -ml-px w-0.5 bg-stone-300 dark:bg-stone-700" />

                  {/* Left Page: Abstract & Methods */}
                  <div className="space-y-1.5 pr-2">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-stone-500">Evidence Synthesis</span>
                    <div className="w-full h-1.5 rounded bg-stone-400/40 dark:bg-stone-500/40" />
                    <div className="w-11/12 h-1 rounded bg-stone-300 dark:bg-stone-700" />
                    <div className="w-4/5 h-1 rounded bg-stone-300 dark:bg-stone-700" />
                    <div className="w-full h-1 rounded bg-stone-300 dark:bg-stone-700" />
                    <div className="w-3/4 h-1 rounded bg-stone-300 dark:bg-stone-700" />
                  </div>

                  {/* Right Page: Forest Plot & Bibliography */}
                  <div className="space-y-1.5 pl-2">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-stone-500">Citation Audit</span>
                    {/* Forest plot thumbnail */}
                    <div className="p-1 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-1">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-2 bg-stone-400" />
                        <div className="w-8 h-0.5 bg-emerald-600" />
                        <div className="w-1 h-1 bg-emerald-700 rounded-xs" />
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-2 bg-stone-400" />
                        <div className="w-12 h-0.5 bg-emerald-600" />
                        <div className="w-1 h-1 bg-emerald-700 rounded-xs" />
                      </div>
                    </div>
                    <div className="w-full h-1 rounded bg-emerald-500/30" />
                    <div className="w-2/3 h-1 rounded bg-stone-300 dark:bg-stone-700" />
                  </div>
                </div>

                {/* Footer Status Pill */}
                <div className="mt-3 flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400 pt-1">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>32/32 References Verified</span>
                  </div>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">100% Clean</span>
                </div>
              </div>

              {/* Floating Paper Sheet 2: Clean Pre-Flight Certificate (Front Tilted) */}
              <div className="absolute -bottom-6 -right-4 w-40 h-28 rounded-xl bg-white/95 dark:bg-stone-900/95 border border-emerald-300/80 dark:border-emerald-800/80 p-2.5 shadow-lg rotate-3 animate-float-reverse z-20">
                <div className="flex items-center justify-between pb-1 border-b border-emerald-100 dark:border-emerald-950">
                  <div className="flex items-center gap-1">
                    <FileCheck className="w-3 h-3 text-emerald-600" />
                    <span className="text-[8px] font-bold text-stone-700 dark:text-stone-300">Pre-Flight Pass</span>
                  </div>
                  <span className="text-[8px] font-mono font-bold text-emerald-600">100/100</span>
                </div>
                <p className="text-[7.5px] text-stone-500 dark:text-stone-400 mt-1.5 leading-snug">
                  Zero retracted trial citations detected. Approved for editorial peer review.
                </p>
                <div className="mt-2 flex items-center gap-1 text-[7px] text-stone-400 font-mono">
                  <span>Crossref · PubMed · OpenAlex</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Integrity Pulse Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 animate-float-in-place-1">
          <div>
            <span className="block text-xl font-bold font-mono text-stone-900 dark:text-stone-100">100%</span>
            <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Live Registry Sync</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Crossref, OpenAlex & PubMed</p>
          </div>
          <div>
            <span className="block text-xl font-bold font-mono text-rose-700 dark:text-rose-400">Post-Pub Alert</span>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Temporal Indexing</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Distinguishes pre vs post citations</p>
          </div>
          <div>
            <span className="block text-xl font-bold font-mono text-amber-600 dark:text-amber-400">AI Synthesis</span>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Data Contribution</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Forest plot vs contextual quotes</p>
          </div>
          <div>
            <span className="block text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">COPE Aligned</span>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Editorial Guidance</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Pre-drafted errata & notices</p>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="space-y-6">
        <div className="animate-float-in-place-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Platform Capabilities
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            End-to-End Journal Citation Quality Assurance
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            RetractScan provides journal editors, publishers, and peer reviewers with the tools needed to detect,
            evaluate, and remediate citations to retracted literature before or after publication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              1. Secondary Literature Heuristics
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Multi-layer detection isolates systematic reviews, meta-analyses, and clinical guidelines using PubMed publication types, MeSH terms, title/abstract linguistic markers, and PRISMA indicators.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              2. Multi-Registry Retraction Cross-Check
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Live automated cross-referencing against Crossref event streams, OpenAlex, and PubMed retraction notices, accurately establishing publication dates to pinpoint post-retraction citing.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              3. AI Data-Contribution Verification
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Gemini 3.8 Flash parses the full manuscript to verify whether the retracted trial is a data-contributing study to pooled effect sizes or merely cited as background context in the discussion.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              4. COPE Editorial Recommendations
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Actionable guidance aligned with Committee on Publication Ethics (COPE) protocols: author sensitivity re-analysis, formal Corrigendum/Erratum issuance, or Expressions of Concern.
            </p>
          </div>

          {/* Card 5: Pre-Flight Manuscript Scanner */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                <FileCheck className="w-5 h-5" />
              </div>
              {onPreFlight && (
                <button
                  type="button"
                  onClick={onPreFlight}
                  className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
                >
                  Open Scanner →
                </button>
              )}
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              5. Pre-Submission Pre-Flight Scanner
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Drag-and-drop Word (.docx) manuscripts, PDFs, or pasted reference lists. Generates a verifiable Pre-Flight Citation Health Certificate before paper acceptance.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Flow */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs animate-float-in-place-3">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Editorial Workflow
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Three Steps to Full Retraction Safeguarding
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="space-y-2">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Scan Journal or Review DOI
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Query any peer-reviewed journal by title or ISSN over a custom year window, or enter a single review DOI to index all referenced bibliography DOIs.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Ingest Manuscript & Run AI Audit
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload PDF, DOCX, or text files for reviews that cite retracted studies. Gemini analyzes exact citation sentences to distinguish background mentions from pooled quantitative effect sizes.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Record Notes & Export Dossier
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Add user editorial assessments, assign COPE recommendations, and export formatted PDF Retraction Dossiers or CSV reports for editorial board action.
            </p>
          </div>
        </div>
      </section>

      {/* Four-Layer Retraction Detection Methodology Section */}
      <section className="space-y-6 pt-4 border-t border-stone-200/80 dark:border-stone-800">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Empirical Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Four-Layer Retraction Detection Methodology
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1.5 leading-relaxed">
            RetractScan synthesizes four independent bibliographic registries and clinical retraction notice feeds in real time, capturing 100% of verified notices with zero false positives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-2.5 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-mono text-xs font-bold border border-emerald-200 dark:border-emerald-900">
              01
            </div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Layer 1: Crossref REST API Retraction Index
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Continuous synchronization with publisher Crossmark update streams, parsing official retraction notices, expressions of concern, and author corrigenda directly from primary deposits.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-2.5 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center font-mono text-xs font-bold border border-blue-200 dark:border-blue-900">
              02
            </div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Layer 2: PubMed E-Utilities &amp; MeSH Matching
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Real-time validation against the National Library of Medicine (NLM) database, indexing Retraction of Publication status tags, PMCID full texts, and MeSH notice linkages.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-2.5 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-mono text-xs font-bold border border-amber-200 dark:border-amber-900">
              03
            </div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Layer 3: OpenAlex Multidisciplinary Knowledge Graph
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Global citation mapping across 250M+ scientific publications, tracking the downstream citation transmission of invalidated research into systematic reviews and meta-analyses.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-2.5 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center font-mono text-xs font-bold border border-rose-200 dark:border-rose-900">
              04
            </div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Layer 4: COPE Corrigenda &amp; Quantitative Meta-Analysis Audit
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Temporal analysis distinguishing pre- vs. post-retraction citations, with automated Committee on Publication Ethics (COPE) erratum and corrigendum notice generation.
            </p>
          </div>
        </div>
      </section>

      {/* Purpose-Built for Scholarly Citation Integrity (Audience Breakdown) */}
      <section className="space-y-6 pt-4 border-t border-stone-200/80 dark:border-stone-800">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Target Audience &amp; Use Cases
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Purpose-Built for Scholarly Citation Integrity
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1.5 leading-relaxed">
            Tailored workflows engineered for authors, journal editors, and research institutions to eliminate retracted citation propagation across scientific literature.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              For Researchers &amp; Systematic Review Authors
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Screen your manuscript bibliography before journal submission. Upload Word documents or PDFs to the Pre-Flight Scanner to guarantee that no referenced clinical trials or observational studies have been recalled, preventing peer-review rejections and post-acceptance retractions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-700 dark:text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              For Journal Editors &amp; Peer Reviewers
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Audit submitted manuscripts and entire journal archives over custom year windows. Catch post-publication retractions cited in secondary review studies and generate pre-drafted COPE-compliant corrigenda notices directly for authors and production departments.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-700 dark:text-purple-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              For Universities &amp; Research Integrity Offices
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Safeguard institutional research credibility and ensure adherence to international clinical trial reporting standards. Export structured citation audit ledgers in CSV and JSON formats to support institutional research integrity assessments.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="space-y-6 pt-4 border-t border-stone-200/80 dark:border-stone-800">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Scholarly Guidelines
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Frequently Asked Questions &amp; Academic Integrity Guidelines
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1.5 leading-relaxed">
            Essential answers on post-retraction citation contamination, COPE guidelines, and automated manuscript screening.
          </p>
        </div>

        <div className="space-y-3 max-w-4xl">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800/80">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Meet the Developers Section */}
      <section id="meet-the-developers" className="space-y-8 pt-6 border-t border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
            <span>Academic Leadership & Scientific Direction</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Meet the Developers & Researchers
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            RetractScan was conceived and architected by epidemiologists and clinical researchers dedicated to preserving methodological rigor and integrity in biomedical evidence synthesis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Developer 1: Dr. Yousef Moradi */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6 animate-float-in-place-4">
            <div>
              <div className="flex items-start gap-4">
                {/* Official Portrait */}
                <img
                  src="/assets/aistudio/photo_1540621726062323702_c_20175b7a.jpg"
                  alt="Dr. Yousef Moradi, PhD in Epidemiology, Umeå University - Co-Architect of RetractScan academic citation integrity platform"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top shadow-md border border-slate-200 dark:border-slate-700 shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Dr. Yousef Moradi
                    </h3>
                  </div>
                  <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                    BSc, MSc, PhD in Epidemiology
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Department of Diagnostics and Intervention</span>
                  </div>
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-300">
                    Umeå universitet (Umeå University), Sweden
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  <strong>Dr. Yousef Moradi</strong> is a senior researcher in epidemiology affiliated with the Department of Diagnostics and Intervention at Umeå University. Holding a Bachelor’s in Public Health, Master’s in Epidemiology, and a PhD in Epidemiology, his academic career encompasses extensive work in population health, register-based research, and meta-epidemiology.
                </p>
                <p>
                  His research program focuses on clinical epidemiology, evidence synthesis, and meta-research methodologies, specifically investigating large-scale healthcare registry analytics and the downstream transmission of invalid primary evidence into secondary review literature.
                </p>
              </div>

              {/* Scholar & Professional Profiles */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
                <a
                  href="https://scholar.google.com/citations?view_op=search_authors&mauthors=Yousef+Moradi+Ume%C3%A5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700/80 text-stone-900 dark:text-stone-100 text-xs font-semibold border border-stone-200 dark:border-stone-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-2xs hover:shadow-xs group"
                  title="View Dr. Yousef Moradi on Google Scholar"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                  <span>Google Scholar</span>
                  <ExternalLink className="w-3 h-3 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="https://www.linkedin.com/search/results/all/?keywords=Yousef%20Moradi%20Ume%C3%A5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] dark:text-[#38a3dd] text-xs font-semibold border border-[#0077b5]/20 dark:border-[#0077b5]/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-2xs hover:shadow-xs group"
                  title="View Dr. Yousef Moradi on LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-2">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                  Register-Based Studies
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                  Epidemiological Methods
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                  Evidence Synthesis
                </span>
              </div>
            </div>
          </div>

          {/* Developer 2: Dr. Babak Ghadirzadeh */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6 animate-float-in-place-5">
            <div>
              <div className="flex items-start gap-4">
                {/* Official Portrait */}
                <img
                  src="/assets/aistudio/IMG_6181_c3d7644c.jpg"
                  alt="Dr. Babak Ghadirzadeh, M.D., Social Determinants of Health Research Center - Co-Architect of RetractScan citation integrity platform"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top shadow-md border border-slate-200 dark:border-slate-700 shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Dr. Babak Ghadirzadeh
                    </h3>
                  </div>
                  <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 font-mono">
                    M.D. (Medical Doctor)
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Social Determinants of Health Research Center</span>
                  </div>
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-300">
                    Kurdistan University of Medical Sciences
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  <strong>Dr. Babak Ghadirzadeh, M.D.</strong> is a physician and clinical researcher affiliated with the Research Institute for Health Development and Social Determinants of Health Research Center at Kurdistan University of Medical Sciences.
                </p>
                <p>
                  His clinical and academic scholarship centers on evidence synthesis, systematic reviews, and meta-analyses across clinical medicine, oncology, metabolic disorders, and reproductive health. Dr. Ghadirzadeh is deeply involved in safeguarding clinical practice guidelines from corrupted, unverified, and post-retraction bibliographic references.
                </p>
              </div>

              {/* Scholar & Professional Profiles */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
                <a
                  href="https://scholar.google.com/citations?view_op=search_authors&mauthors=Babak+Ghadirzadeh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700/80 text-stone-900 dark:text-stone-100 text-xs font-semibold border border-stone-200 dark:border-stone-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-2xs hover:shadow-xs group"
                  title="View Dr. Babak Ghadirzadeh on Google Scholar"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                  <span>Google Scholar</span>
                  <ExternalLink className="w-3 h-3 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="https://www.linkedin.com/search/results/all/?keywords=Babak%20Ghadirzadeh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] dark:text-[#38a3dd] text-xs font-semibold border border-[#0077b5]/20 dark:border-[#0077b5]/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-2xs hover:shadow-xs group"
                  title="View Dr. Babak Ghadirzadeh on LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-2">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                  Systematic Reviews
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                  Clinical Meta-Analysis
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                  Research Integrity
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Launch Banner */}
      <section className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold">Ready to Audit Your Journal or Manuscript?</h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Scan your journal’s recent publications or analyze full-text review articles right away.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onStartAudit}
            className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-xs cursor-pointer flex items-center gap-2 group"
          >
            <span>Start Journal Audit</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};
