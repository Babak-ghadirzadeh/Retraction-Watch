import React from 'react';
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
} from 'lucide-react';

interface HomePageProps {
  onStartAudit: () => void;
  onSingleArticle: () => void;
  onExploreFullText: () => void;
  auditCount?: number;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartAudit,
  onSingleArticle,
  onExploreFullText,
  auditCount = 0,
}) => {
  const scrollToDevelopers = () => {
    const el = document.getElementById('meet-the-developers');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 pb-12 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Automated Academic Integrity & Post-Publication Citation Auditing</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Safeguarding Evidence Synthesis from{' '}
            <span className="text-rose-700 dark:text-rose-400 underline decoration-rose-300 dark:decoration-rose-900 underline-offset-4">
              Retracted Citations
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-3xl">
            When primary clinical trials or biomedical studies are retracted, secondary literature—systematic reviews,
            meta-analyses, and clinical practice guidelines—frequently continues citing them unknowingly.
            <strong> RetractScan</strong> systematically screens journal bibliographies, indexes post-publication retractions,
            and deploys deep AI reasoning to determine whether retracted papers contributed quantitative data to pooled effect sizes.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onStartAudit}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Launch Journal Retraction Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onSingleArticle}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Inspect Single DOI / Review</span>
            </button>

            <button
              type="button"
              onClick={scrollToDevelopers}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>Meet the Developers</span>
            </button>
          </div>
        </div>

        {/* Quick Integrity Pulse Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
          <div>
            <span className="block text-xl font-bold font-mono text-slate-900 dark:text-white">100%</span>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Live Registry Sync</span>
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
        <div>
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
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
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
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
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
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
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
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
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

          {/* Card 5 */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-700 dark:text-indigo-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              5. Editorial Notes & Assessment
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Editors can record custom case notes, internal observations, and decision rationale directly within each article's audit profile to maintain an indelible institutional record.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-700 dark:text-cyan-400">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              6. Dual Export: Dossiers & CSV Reports
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Download clean structured CSV spreadsheets for statistical tracking or generate print-ready, formatted PDF Retraction Dossiers complete with editor assessments and in-text quotes.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Flow */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
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
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-start gap-4">
                {/* Official Portrait */}
                <img
                  src="/assets/aistudio/photo_1540621726062323702_c_20175b7a.jpg"
                  alt="Dr. Yousef Moradi"
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

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-2">
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
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-start gap-4">
                {/* Official Portrait */}
                <img
                  src="/assets/aistudio/IMG_6181_c3d7644c.jpg"
                  alt="Dr. Babak Ghadirzadeh"
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
            className="px-5 py-2.5 rounded-lg bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-xs cursor-pointer flex items-center gap-2"
          >
            <span>Start Journal Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
