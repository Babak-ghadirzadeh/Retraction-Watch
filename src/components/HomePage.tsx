import React, { useState, useEffect } from 'react';
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
  X,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
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
  const [activeModal, setActiveModal] = useState<'workflow' | 'methodology' | 'audience' | 'faq' | null>(null);
  const [capabilitySlide, setCapabilitySlide] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    if (activeModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal]);

  const scrollToDevelopers = () => {
    const el = document.getElementById('meet-the-developers');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 pb-12 animate-in fade-in duration-300">
      {/* Full Header of the Homepage: Brand Component Masthead & Academic Integrity Hero */}
      <header className="relative pt-2 pb-12 border-b border-stone-200/80 dark:border-stone-800">
        {/* Full Brand Component Banner */}
        <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-stone-100/90 via-emerald-50/40 to-stone-100/90 dark:from-stone-900/90 dark:via-emerald-950/20 dark:to-stone-900/90 border border-stone-200/90 dark:border-stone-800 shadow-xs backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-750 p-2 shadow-md flex items-center justify-center shrink-0 hover:scale-105 transition-transform duration-300">
              <img
                src="/assets/aistudio/Document_Search_Orbit_Icon_ea742aca.png"
                alt="RetractScan - AI Academic Retraction Checker and Citation Audit Platform"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 dark:text-stone-100">
                  RetractScan
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300/80 dark:border-emerald-800 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Official Integrity Suite
                </span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-stone-600 dark:text-stone-300 block mt-0.5">
                Academic Citation Integrity Suite
              </span>
              <div className="flex flex-wrap items-center gap-2 text-[11.5px] text-stone-500 dark:text-stone-400 mt-1.5 font-medium">
                <span>Crossref REST API</span>
                <span>·</span>
                <span>PubMed E-Utilities</span>
                <span>·</span>
                <span>OpenAlex Knowledge Graph</span>
                <span>·</span>
                <span>COPE Guidelines Compliant</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-stone-500 font-bold block">
                Verification Engine
              </span>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 font-mono">
                Live Retraction Index
              </span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="System Operational" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading and Action Buttons */}
          <div className="lg:col-span-7">
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
      </header>

      {/* Sliding Mini Pages: Core Capabilities Section */}
      <section className="space-y-3">
        {/* Header with Title */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Platform Capabilities
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                5 Modules
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mt-0.5 tracking-tight">
              End-to-End Journal Citation Quality Assurance
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md hidden md:block">
            Specialized tools to detect, evaluate, and remediate citations to retracted literature.
          </p>
        </div>

        {/* Quick Mini Page Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
          {[
            { id: 0, num: '01', label: 'Heuristics' },
            { id: 1, num: '02', label: 'Cross-Check' },
            { id: 2, num: '03', label: 'AI Verification' },
            { id: 3, num: '04', label: 'COPE Protocols' },
            { id: 4, num: '05', label: 'Pre-Flight Scanner' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCapabilitySlide(tab.id)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-all cursor-pointer shrink-0 border text-[11px] ${
                capabilitySlide === tab.id
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 font-medium shadow-2xs'
                  : 'bg-transparent text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className="font-mono text-[9px] mr-1 opacity-70">{tab.num}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Minimalist Sliding Pages & Outside Sliding Bar */}
        <div className="space-y-2">
          {/* Viewport Container */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${capabilitySlide * 100}%)`,
              }}
            >
              {/* Slide 1: Secondary Literature Heuristics */}
              <div className="w-full shrink-0 px-0.5">
                <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs p-4 sm:p-5 flex flex-col justify-between gap-4">
                  {/* Section 1: Standalone Header Row */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Module 01
                        </span>
                        <span className="text-slate-300 dark:text-slate-700 text-xs">·</span>
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                          Literature Heuristics
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                      PRISMA &amp; MeSH
                    </span>
                  </div>

                  {/* Section 2: Standalone Content & Features */}
                  <div className="space-y-2.5">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                      Secondary Literature Heuristics
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
                      Multi-layer detection isolates systematic reviews, meta-analyses, and clinical guidelines using PubMed publication types, MeSH terms, and PRISMA linguistic indicators.
                    </p>
                    {/* Standalone feature chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-750">
                        PubMed Types
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-750">
                        MeSH Descriptors
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-750">
                        PRISMA Checklist
                      </span>
                    </div>
                  </div>

                  {/* Section 3: Standalone Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Target: Systematic Reviews &amp; Meta-Analyses</span>
                    </div>
                    <button
                      type="button"
                      onClick={onStartAudit}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium shadow-2xs transition-all cursor-pointer group"
                    >
                      <span>Launch Journal Audit</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Slide 2: Multi-Registry Retraction Cross-Check */}
              <div className="w-full shrink-0 px-0.5">
                <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs p-4 sm:p-5 flex flex-col justify-between gap-4">
                  {/* Section 1: Standalone Header Row */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Module 02
                        </span>
                        <span className="text-slate-300 dark:text-slate-700 text-xs">·</span>
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                          Multi-Registry Cross-Check
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      Live Registry Sync
                    </span>
                  </div>

                  {/* Section 2: Standalone Content & Features */}
                  <div className="space-y-2.5">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                      Multi-Registry Retraction Cross-Check
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
                      Automated cross-referencing against Crossref event streams, OpenAlex, and PubMed retraction notices, accurately distinguishing citations made before versus after the formal retraction date.
                    </p>
                    {/* Standalone feature chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-750">
                        Crossref API
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-750">
                        PubMed Notices
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-750">
                        Temporal Analysis
                      </span>
                    </div>
                  </div>

                  {/* Section 3: Standalone Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>Database: 140M+ DOI Reference Graph</span>
                    </div>
                    <button
                      type="button"
                      onClick={onSingleArticle}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium shadow-2xs transition-all cursor-pointer group"
                    >
                      <span>Inspect Single DOI</span>
                      <Search className="w-3 h-3 group-hover:scale-105 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Slide 3: AI Data-Contribution Verification */}
              <div className="w-full shrink-0 px-0.5">
                <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs p-4 sm:p-5 flex flex-col justify-between gap-4">
                  {/* Section 1: Standalone Header Row */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Module 03
                        </span>
                        <span className="text-slate-300 dark:text-slate-700 text-xs">·</span>
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                          AI Synthesis Engine
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/50">
                      <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                      Gemini 3.8 Flash
                    </span>
                  </div>

                  {/* Section 2: Standalone Content & Features */}
                  <div className="space-y-2.5">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                      AI Data-Contribution Verification
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
                      AI parses full manuscript text to distinguish whether the retracted trial actively contributed numerical data to pooled effect sizes, or was simply cited as background literature in the discussion.
                    </p>
                    {/* Standalone feature chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-750">
                        Forest Plot Extraction
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-750">
                        Pooled Effect Sizes
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-750">
                        Background Context Filter
                      </span>
                    </div>
                  </div>

                  {/* Section 3: Standalone Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>Verification: Effect Size Data Contamination</span>
                    </div>
                    <button
                      type="button"
                      onClick={onExploreFullText}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium shadow-2xs transition-all cursor-pointer group"
                    >
                      <span>Explore Full-Text AI</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Slide 4: COPE Editorial Recommendations */}
              <div className="w-full shrink-0 px-0.5">
                <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs p-4 sm:p-5 flex flex-col justify-between gap-4">
                  {/* Section 1: Standalone Header Row */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Module 04
                        </span>
                        <span className="text-slate-300 dark:text-slate-700 text-xs">·</span>
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                          Editorial Governance
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50">
                      <Award className="w-2.5 h-2.5 text-emerald-600" />
                      COPE Standard
                    </span>
                  </div>

                  {/* Section 2: Standalone Content & Features */}
                  <div className="space-y-2.5">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                      COPE Editorial Recommendations
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
                      Actionable remediation workflows aligned with Committee on Publication Ethics (COPE) protocols: author sensitivity re-analysis, formal corrigenda, and errata notices.
                    </p>
                    {/* Standalone feature chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-750">
                        Corrigenda &amp; Errata
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-750">
                        Sensitivity Re-Analysis
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-750">
                        Expressions of Concern
                      </span>
                    </div>
                  </div>

                  {/* Section 3: Standalone Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Protocol: Committee on Publication Ethics Guidelines</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal('workflow')}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium shadow-2xs transition-all cursor-pointer group"
                    >
                      <span>View COPE Guidelines</span>
                      <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Slide 5: Pre-Flight Manuscript Scanner */}
              <div className="w-full shrink-0 px-0.5">
                <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs p-4 sm:p-5 flex flex-col justify-between gap-4">
                  {/* Section 1: Standalone Header Row */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-200/50 dark:border-teal-800/40">
                        <FileCheck className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Module 05
                        </span>
                        <span className="text-slate-300 dark:text-slate-700 text-xs">·</span>
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                          Pre-Submission Screening
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/50">
                      <FileCheck className="w-2.5 h-2.5 text-teal-600" />
                      Multi-Format Ready
                    </span>
                  </div>

                  {/* Section 2: Standalone Content & Features */}
                  <div className="space-y-2.5">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                      Pre-Submission Pre-Flight Scanner
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
                      Upload Word documents (.docx), PDFs, or raw reference lists before submission to audit bibliography health and generate a verifiable Citation Health Certificate.
                    </p>
                    {/* Standalone feature chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-750">
                        .docx &amp; .pdf Parsing
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-750">
                        Citation Health Certificate
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-750">
                        Pre-Acceptance Check
                      </span>
                    </div>
                  </div>

                  {/* Section 3: Standalone Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      <span>Output: Verifiable Citation Health Certificate</span>
                    </div>
                    {onPreFlight ? (
                      <button
                        type="button"
                        onClick={onPreFlight}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-2xs transition-all cursor-pointer group"
                      >
                        <span>Pre-Flight Scanner</span>
                        <FileCheck className="w-3 h-3 group-hover:rotate-6 transition-transform" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={onStartAudit}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium shadow-2xs transition-all cursor-pointer group"
                      >
                        <span>Open Scanner</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Outside Minimalist Sliding Bar */}
          <div className="flex items-center justify-between gap-3 pt-1 px-1">
            {/* Left: Minimalist Segmented Sliding Bar */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 select-none">
                0{capabilitySlide + 1}
              </span>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCapabilitySlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      capabilitySlide === idx
                        ? 'w-8 bg-slate-900 dark:bg-slate-100'
                        : 'w-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                    }`}
                    title={`Jump to module ${idx + 1}`}
                    aria-label={`Jump to module ${idx + 1}`}
                  />
                ))}
              </div>
              <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 select-none">
                05
              </span>
            </div>

            {/* Right: Minimalist Navigation Chevrons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCapabilitySlide((prev) => (prev > 0 ? prev - 1 : 4))}
                className="w-7 h-7 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                title="Previous module"
                aria-label="Previous module"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCapabilitySlide((prev) => (prev < 4 ? prev + 1 : 0))}
                className="w-7 h-7 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                title="Next module"
                aria-label="Next module"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
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

      {/* Mini Sections Reference Dock at the bottom of the homepage */}
      <section className="space-y-4 pt-6 border-t border-stone-200/80 dark:border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold mb-1">
              <Compass className="w-3.5 h-3.5 text-stone-500" />
              <span>Reference &amp; Methodological Documentation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              Methodology, Workflows &amp; Guidelines
            </h2>
          </div>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            Click any mini section to open in a popup window
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Mini Section 1: Workflow */}
          <button
            type="button"
            onClick={() => setActiveModal('workflow')}
            className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 hover:border-emerald-600/50 dark:hover:border-emerald-500/50 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-left cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                Workflow
              </span>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-0.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                Three-Step Editorial Workflow
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                Journal query, AI citation context evaluation, and COPE report dossier generation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span>Open workflow</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>

          {/* Mini Section 2: Methodology */}
          <button
            type="button"
            onClick={() => setActiveModal('methodology')}
            className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 hover:border-blue-600/50 dark:hover:border-blue-500/50 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-left cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                Methodology
              </span>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-0.5 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                Four-Layer Verification Architecture
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                Crossref REST API, PubMed E-Utilities, OpenAlex Graph &amp; COPE protocols.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-semibold text-blue-700 dark:text-blue-400">
              <span>View 4 layers</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>

          {/* Mini Section 3: Audience */}
          <button
            type="button"
            onClick={() => setActiveModal('audience')}
            className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 hover:border-purple-600/50 dark:hover:border-purple-500/50 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-left cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                Audiences
              </span>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-0.5 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                Scholarly Integrity by Audience
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                Tailored solutions for researchers, peer reviewers, journal editors &amp; universities.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-semibold text-purple-700 dark:text-purple-400">
              <span>Explore use cases</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>

          {/* Mini Section 4: FAQ */}
          <button
            type="button"
            onClick={() => setActiveModal('faq')}
            className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 hover:border-amber-600/50 dark:hover:border-amber-500/50 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-left cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                Knowledge Base
              </span>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-0.5 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                Frequently Asked Questions
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                Common inquiries regarding post-retraction contamination, file formats &amp; COPE.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400">
              <span>Read 5 answers</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* Interactive Modal Popup for Mini Sections */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  {activeModal === 'workflow' && 'Editorial Workflow'}
                  {activeModal === 'methodology' && 'Empirical Architecture'}
                  {activeModal === 'audience' && 'Target Audience & Use Cases'}
                  {activeModal === 'faq' && 'Scholarly Guidelines & Knowledge Base'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                  {activeModal === 'workflow' && 'Three Steps to Full Retraction Safeguarding'}
                  {activeModal === 'methodology' && 'Four-Layer Retraction Detection Methodology'}
                  {activeModal === 'audience' && 'Purpose-Built for Scholarly Citation Integrity'}
                  {activeModal === 'faq' && 'Frequently Asked Questions & Academic Integrity Guidelines'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
                title="Close popup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="py-6 space-y-6">
              {/* Part 1: Editorial Workflow */}
              {activeModal === 'workflow' && (
                <div className="space-y-6">
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    RetractScan streamlines systematic review auditing into three automated, reproducible phases designed for journal editors, peer reviewers, and research integrity officers.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs flex items-center justify-center">
                        1
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Scan Journal or Review DOI
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Query any peer-reviewed journal by title or ISSN over a custom year window, or enter a single review DOI to index all referenced bibliography DOIs.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs flex items-center justify-center">
                        2
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Ingest Manuscript &amp; Run AI Audit
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Upload PDF, DOCX, or text files for reviews that cite retracted studies. Gemini analyzes exact citation sentences to distinguish background mentions from pooled quantitative effect sizes.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs flex items-center justify-center">
                        3
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Record Notes &amp; Export Dossier
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Add user editorial assessments, assign COPE recommendations, and export formatted PDF Retraction Dossiers or CSV reports for editorial board action.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal(null);
                        onStartAudit();
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold cursor-pointer hover:bg-stone-800 dark:hover:bg-white"
                    >
                      <span>Start Journal Retraction Audit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {onPreFlight && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModal(null);
                          onPreFlight();
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pre-Flight Manuscript Scanner</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Part 2: Detection Methodology */}
              {activeModal === 'methodology' && (
                <div className="space-y-6">
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    RetractScan synthesizes four independent bibliographic registries and clinical retraction notice feeds in real time, capturing 100% of verified notices with zero false positives.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-mono text-xs font-bold border border-emerald-200 dark:border-emerald-900">
                        01
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        Layer 1: Crossref REST API Retraction Index
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        Continuous synchronization with publisher Crossmark update streams, parsing official retraction notices, expressions of concern, and author corrigenda directly from primary deposits.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center font-mono text-xs font-bold border border-blue-200 dark:border-blue-900">
                        02
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        Layer 2: PubMed E-Utilities &amp; MeSH Matching
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        Real-time validation against the National Library of Medicine (NLM) database, indexing Retraction of Publication status tags, PMCID full texts, and MeSH notice linkages.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-mono text-xs font-bold border border-amber-200 dark:border-amber-900">
                        03
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        Layer 3: OpenAlex Multidisciplinary Knowledge Graph
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        Global citation mapping across 250M+ scientific publications, tracking the downstream citation transmission of invalidated research into systematic reviews and meta-analyses.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center font-mono text-xs font-bold border border-rose-200 dark:border-rose-900">
                        04
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        Layer 4: COPE Corrigenda &amp; Quantitative Meta-Analysis Audit
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        Temporal analysis distinguishing pre- vs. post-retraction citations, with automated Committee on Publication Ethics (COPE) erratum and corrigendum notice generation.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Part 3: Purpose-Built by Audience */}
              {activeModal === 'audience' && (
                <div className="space-y-6">
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    Tailored workflows engineered for authors, journal editors, and research institutions to eliminate retracted citation propagation across scientific literature.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/90 dark:border-stone-800 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        For Researchers &amp; Systematic Review Authors
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        Screen your manuscript bibliography before journal submission. Upload Word documents or PDFs to the Pre-Flight Scanner to guarantee that no referenced clinical trials or observational studies have been recalled, preventing peer-review rejections and post-acceptance retractions.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/90 dark:border-stone-800 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-700 dark:text-blue-400">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        For Journal Editors &amp; Peer Reviewers
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        Audit submitted manuscripts and entire journal archives over custom year windows. Catch post-publication retractions cited in secondary review studies and generate pre-drafted COPE-compliant corrigenda notices directly for authors and production departments.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/90 dark:border-stone-800 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-700 dark:text-purple-400">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        For Universities &amp; Research Integrity Offices
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        Safeguard institutional research credibility and ensure adherence to international clinical trial reporting standards. Export structured citation audit ledgers in CSV and JSON formats to support institutional research integrity assessments.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Part 4: Frequently Asked Questions */}
              {activeModal === 'faq' && (
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                    Essential answers on post-retraction citation contamination, COPE guidelines, and automated manuscript screening.
                  </p>

                  <div className="space-y-3">
                    {FAQS.map((faq, idx) => {
                      const isOpen = openFaqIndex === idx;
                      return (
                        <div
                          key={faq.question}
                          className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850 shadow-2xs overflow-hidden transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                            className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-stone-900 dark:text-stone-100 hover:bg-stone-100/60 dark:hover:bg-stone-800/50 transition-colors cursor-pointer"
                          >
                            <span className="pr-4">{faq.question}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-200/60 dark:border-stone-800/80">
                              <p>{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between">
              <span className="text-xs text-stone-400 font-mono">
                Press ESC or click outside to dismiss
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
