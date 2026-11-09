import React, { useState, useRef } from 'react';
import {
  FileCheck2,
  Upload,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Download,
  Copy,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Search,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import { PreFlightReport, PreFlightReferenceItem, CitedReference } from '../types/academic';
import * as mammoth from 'mammoth';

interface PreFlightScannerProps {}

export const PreFlightScanner: React.FC<PreFlightScannerProps> = () => {
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<{ step: string; percent: number }>({ step: '', percent: 0 });
  const [manuscriptTitle, setManuscriptTitle] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [report, setReport] = useState<PreFlightReport | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'flagged' | 'clean'>('all');
  const [copiedStatement, setCopiedStatement] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample Presets for instantaneous verification testing
  const loadPreset = (type: 'clean' | 'contaminated') => {
    if (type === 'clean') {
      setManuscriptTitle('Efficacy of Sodium-Glucose Cotransporter-2 Inhibitors in Heart Failure: A Systematic Review');
      setPastedText(
        `References:
1. McMurray JJ, Solomon SD, Inzucchi SE, et al. Dapagliflozin in patients with heart failure and reduced ejection fraction. N Engl J Med. 2019;381(21):1995-2008. doi:10.1056/NEJMoa1911303
2. Packer M, Anker SD, Butler J, et al. Cardiovascular and Renal Outcomes with Empagliflozin in Heart Failure. N Engl J Med. 2020;383(15):1413-1424. doi:10.1056/NEJMoa2022190
3. Armstrong PW, Pieske B, Anstrom KJ, et al. Vericiguat in Patients with Heart Failure and Reduced Ejection Fraction. N Engl J Med. 2020;382(20):1883-1893. doi:10.1056/NEJMoa2001282
4. Solomon SD, McMurray JJ, Claggett B, et al. Dapagliflozin in Heart Failure with Mildly Reduced or Preserved Ejection Fraction. N Engl J Med. 2022;387(12):1089-1098. doi:10.1056/NEJMoa2206286`
      );
      setInputMode('paste');
    } else {
      setManuscriptTitle('COVID-19 Hospital Pharmacotherapy Outcomes: An Evidence Synthesis & Systematic Evaluation');
      setPastedText(
        `References:
1. Mehra MR, Desai SS, Ruschitzka F, Patel AN. Hydroxychloroquine or chloroquine with or without a macrolide for treatment of COVID-19: a multinational registry analysis. Lancet. 2020. doi:10.1016/s0140-6736(20)31180-6 [RETRACTED]
2. Mehra MR, Patel AN, Desai SS, Yuan K, Bloomman C. Cardiovascular Disease, Drug Therapy, and Mortality in Covid-19. N Engl J Med. 2020. doi:10.1056/nejmoa2007621 [RETRACTED]
3. Cao B, Wang Y, Wen D, et al. A Trial of Lopinavir-Ritonavir in Adults Hospitalized with Severe Covid-19. N Engl J Med. 2020;382(19):1787-1799. doi:10.1056/nejmoa2001191
4. Horby P, Lim WS, Emberson JR, et al. Dexamethasone in Hospitalized Patients with Covid-19. N Engl J Med. 2021;384(8):693-704. doi:10.1056/NEJMoa2021436`
      );
      setInputMode('paste');
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    let extractedText = '';

    try {
      if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      } else if (ext === 'txt') {
        extractedText = await file.text();
      } else {
        // PDF or generic text read fallback
        extractedText = await file.text();
      }
    } catch (err) {
      console.warn('Direct file read warning, attempting standard text read:', err);
      extractedText = await file.text().catch(() => '');
    }

    if (!manuscriptTitle) {
      setManuscriptTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    runPreFlightAudit(extractedText || file.name, file.name, file.type || ext || 'document');
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;
    runPreFlightAudit(pastedText, 'pasted_references.txt', 'text/plain');
  };

  // Execution engine: Extracts DOIs and titles, runs multi-source audit
  const runPreFlightAudit = async (content: string, fileName: string, fileType: string) => {
    setIsScanning(true);
    setScanProgress({ step: 'Parsing manuscript bibliography and embedded DOIs...', percent: 15 });

    try {
      // 1. Extract DOIs using standard academic regex
      const doiRegex = /(?:10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)/gi;
      const matchedDois = Array.from(new Set(content.match(doiRegex) || [])).map((d) =>
        d.toLowerCase().replace(/[.,;)]+$/, '')
      );

      setScanProgress({ step: 'Validating references against Crossref & OpenAlex...', percent: 45 });

      // 2. Extract lines that look like citations
      const lines = content
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 25);

      const candidateRefs: Array<{ doi?: string; title: string; raw: string }> = [];

      for (const d of matchedDois) {
        candidateRefs.push({
          doi: d,
          title: `Cited Record (${d})`,
          raw: d,
        });
      }

      for (const line of lines) {
        if (/doi:|http|\b10\.\d{4}|\b(19\d\d|20\d\d)\b/i.test(line)) {
          const embeddedDoi = line.match(doiRegex)?.[0]?.toLowerCase().replace(/[.,;)]+$/, '');
          if (!embeddedDoi || !candidateRefs.some((c) => c.doi === embeddedDoi)) {
            candidateRefs.push({
              doi: embeddedDoi,
              title: line.slice(0, 140),
              raw: line,
            });
          }
        }
      }

      setScanProgress({ step: 'Checking Europe PMC & PubMed Retraction Registries...', percent: 75 });

      // Build payload for batch audit endpoint
      const mockArticle = {
        title: manuscriptTitle || fileName,
        doi: '10.preflight/submission',
        pubDate: new Date().toISOString().split('T')[0],
        references: candidateRefs.map((r) => ({
          doi: r.doi,
          title: r.title,
        })),
      };

      const res = await fetch('/api/academic/audit-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles: [mockArticle] }),
      });

      setScanProgress({ step: 'Generating COPE Pre-Flight Integrity Certificate...', percent: 95 });

      const data = await res.json();
      const auditResult = data.auditResults?.[0];

      const retractedList: CitedReference[] = auditResult?.retractedCitations || [];
      const totalCount = Math.max(candidateRefs.length, 1);
      const retractedCount = retractedList.length;
      const postRetractionCount = retractedList.filter((r) => r.isPostRetraction).length;
      const cleanCount = Math.max(0, totalCount - retractedCount);

      // Score: 100 for zero retractions, penalized for post-retraction or pre-retraction citations
      const penalty = postRetractionCount * 35 + (retractedCount - postRetractionCount) * 20;
      const integrityScore = Math.max(0, Math.min(100, 100 - penalty));

      let badge: PreFlightReport['badge'] = 'VERIFIED_CLEAN';
      if (postRetractionCount > 0) {
        badge = 'CRITICAL_CONTAMINATION';
      } else if (retractedCount > 0) {
        badge = 'CAUTION_ALERT';
      }

      // Build full items list
      const allReferences: PreFlightReferenceItem[] = candidateRefs.map((c) => {
        const foundRetracted = retractedList.find(
          (r) => (r.doi && c.doi && r.doi.toLowerCase() === c.doi.toLowerCase()) || r.title === c.title
        );
        return {
          doi: c.doi,
          title: foundRetracted?.title || c.title,
          status: foundRetracted ? 'retracted' : 'clean',
          retractionDetails: foundRetracted,
        };
      });

      const newReport: PreFlightReport = {
        id: `preflight-${Date.now()}`,
        manuscriptTitle: manuscriptTitle || fileName.replace(/\.[^/.]+$/, ''),
        fileName,
        fileType,
        scannedAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        totalReferencesFound: totalCount,
        cleanCount,
        retractedCount,
        postRetractionCount,
        integrityScore,
        badge,
        retractedCitations: retractedList,
        allReferences,
      };

      setReport(newReport);
    } catch (err: any) {
      console.error('Pre-flight scan failure:', err);
    } finally {
      setIsScanning(false);
      setScanProgress({ step: '', percent: 0 });
    }
  };

  const copyCoverLetterStatement = () => {
    if (!report) return;
    const text = `CITATION INTEGRITY STATEMENT:
This manuscript ("${report.manuscriptTitle}") was pre-screened with RetractScan on ${report.scannedAt}.
Total References Audited: ${report.totalReferencesFound}
Integrity Score: ${report.integrityScore}/100 (${report.badge.replace(/_/g, ' ')})
Retracted Citations Identified: ${report.retractedCount}
Cross-verified against Crossref Works API, Europe PMC, and PubMed NLM registries.`;

    navigator.clipboard.writeText(text);
    setCopiedStatement(true);
    setTimeout(() => setCopiedStatement(false), 2500);
  };

  const filteredRefs = report
    ? report.allReferences.filter((r) => {
        if (filterStatus === 'flagged') return r.status === 'retracted';
        if (filterStatus === 'clean') return r.status === 'clean';
        return true;
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs tracking-wider uppercase mb-1">
              <span>Author & Reviewer Pre-Submission Portal</span>
              <span aria-hidden="true">·</span>
              <span>COPE Pre-Flight Protocol</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              Pre-Flight Citation Integrity Scanner
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
              Verify manuscripts prior to journal submission or acceptance. Detects contaminated literature in
              Word documents, PDFs, and bibliographies across Crossref, PubMed, and Europe PMC.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <span className="text-xs text-stone-500 dark:text-stone-400 hidden sm:inline">Try preset:</span>
            <button
              onClick={() => loadPreset('clean')}
              className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs"
            >
              Clean Review
            </button>
            <button
              onClick={() => loadPreset('contaminated')}
              className="text-xs px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100/60 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs"
            >
              Flagged Trial Citations
            </button>
          </div>
        </div>
      </div>

      {/* Main Input Form (Upload or Paste) */}
      {!report && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm">
          {/* Tab Selector */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl max-w-xs mb-5">
            <button
              type="button"
              onClick={() => setInputMode('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                inputMode === 'upload'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-white/50'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
            <button
              type="button"
              onClick={() => setInputMode('paste')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                inputMode === 'paste'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-white/50'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Paste References</span>
            </button>
          </div>

          {/* Manuscript Title Optional Field */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              Manuscript Title or Working ID (Optional)
            </label>
            <input
              type="text"
              value={manuscriptTitle}
              onChange={(e) => setManuscriptTitle(e.target.value)}
              placeholder="e.g. Assessment of Pharmacological Interventions in Adult Inpatients..."
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          {inputMode === 'upload' ? (
            <div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-600 bg-stone-50/30 dark:bg-stone-800/20'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".docx,.pdf,.txt"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto mb-3 text-stone-600 dark:text-stone-300">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  Drop Word manuscript (.docx), PDF, or text file here
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Supports DOCX with embedded bibliography, PDF articles, and plain text reference lists
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-stone-400">
                  <span>Client-side extraction</span>
                  <span aria-hidden="true">·</span>
                  <span>Instant Crossref verification</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                  Paste Bibliography, Cited DOIs, or Reference List
                </label>
                <textarea
                  rows={8}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste references here (e.g. 1. Author et al. Title. Journal. 2020. doi:10.1016/...)"
                  className="w-full text-xs font-mono p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-stone-500">
                  {pastedText.split('\n').filter((l) => l.trim()).length} reference line(s) detected
                </span>
                <button
                  type="submit"
                  disabled={!pastedText.trim() || isScanning}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-medium shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>Audit Bibliography</span>
                </button>
              </div>
            </form>
          )}

          {/* Active scanning state */}
          {isScanning && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-center space-y-2.5">
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-ping mr-1" />
                <span>{scanProgress.step}</span>
              </div>
              <div className="w-full bg-emerald-200/60 dark:bg-emerald-900/40 rounded-full h-1.5 max-w-md mx-auto overflow-hidden">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${scanProgress.percent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pre-Flight Results Report */}
      {report && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Certificate Header Card */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-200/70 dark:border-stone-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <span>Pre-Flight Certificate #{report.id.slice(-6).toUpperCase()}</span>
                  <span aria-hidden="true">·</span>
                  <span>Scanned {report.scannedAt}</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  {report.manuscriptTitle}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 dark:text-stone-400">
                  <span>File: {report.fileName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{report.totalReferencesFound} References Audited</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                    {report.cleanCount} Verified Clean
                  </span>
                </div>
              </div>

              {/* Integrity Score Badge */}
              <div className="flex items-center gap-4 bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 self-start lg:self-auto shrink-0">
                <div className="text-center">
                  <div className="text-3xl font-extrabold tracking-tight font-mono text-stone-900 dark:text-stone-100">
                    {report.integrityScore}
                    <span className="text-xs font-normal text-stone-400">/100</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">
                    Integrity Score
                  </span>
                </div>

                <div className="h-10 w-px bg-stone-200 dark:bg-stone-700" />

                <div>
                  {report.badge === 'VERIFIED_CLEAN' && (
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="w-5 h-5 shrink-0" />
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider">Clean Citations</div>
                        <div className="text-[10px] text-stone-500">Zero retractions detected</div>
                      </div>
                    </div>
                  )}

                  {report.badge === 'CAUTION_ALERT' && (
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider">Pre-Retraction Caution</div>
                        <div className="text-[10px] text-stone-500">
                          {report.retractedCount} flagged reference(s)
                        </div>
                      </div>
                    </div>
                  )}

                  {report.badge === 'CRITICAL_CONTAMINATION' && (
                    <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
                      <ShieldAlert className="w-5 h-5 shrink-0" />
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider">Critical Contamination</div>
                        <div className="text-[10px] text-stone-500">
                          {report.postRetractionCount} post-retraction citation(s)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReport(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 transition-transform group-hover:-rotate-45" />
                  <span>Scan Another Manuscript</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyCoverLetterStatement}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-medium hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedStatement ? 'Copied to Clipboard!' : 'Copy Cover Letter Statement'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-medium hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Certificate (PDF)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Reference Audit Detail Table */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  Reference-by-Reference Verification Roster
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Full registry breakdown showing verified active literature vs. flagged records
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-2.5 py-1 rounded-md transition-all duration-200 cursor-pointer ${
                    filterStatus === 'all'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm font-medium scale-[1.02]'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  All ({report.allReferences.length})
                </button>
                <button
                  onClick={() => setFilterStatus('flagged')}
                  className={`px-2.5 py-1 rounded-md transition-all duration-200 cursor-pointer ${
                    filterStatus === 'flagged'
                      ? 'bg-white dark:bg-stone-900 text-rose-700 dark:text-rose-300 shadow-sm font-medium scale-[1.02]'
                      : 'text-stone-600 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400'
                  }`}
                >
                  Flagged ({report.retractedCount})
                </button>
                <button
                  onClick={() => setFilterStatus('clean')}
                  className={`px-2.5 py-1 rounded-md transition-all duration-200 cursor-pointer ${
                    filterStatus === 'clean'
                      ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-300 shadow-sm font-medium scale-[1.02]'
                      : 'text-stone-600 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                >
                  Clean ({report.cleanCount})
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3 font-medium">Status</th>
                    <th className="py-2.5 px-3 font-medium">Cited Reference / Study</th>
                    <th className="py-2.5 px-3 font-medium">Identifier</th>
                    <th className="py-2.5 px-3 font-medium text-right">Integrity Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-sans">
                  {filteredRefs.map((ref, idx) => (
                    <tr
                      key={idx}
                      className={
                        ref.status === 'retracted'
                          ? 'bg-rose-50/30 dark:bg-rose-950/20'
                          : 'hover:bg-stone-50/50 dark:hover:bg-stone-800/30'
                      }
                    >
                      <td className="py-3 px-3 align-top whitespace-nowrap">
                        {ref.status === 'retracted' ? (
                          <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300 font-medium">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>Retracted</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>Verified</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 align-top max-w-md">
                        <div className="font-medium text-stone-900 dark:text-stone-100 leading-snug">
                          {ref.title}
                        </div>
                        {ref.retractionDetails && (
                          <div className="mt-1.5 p-2 rounded-lg bg-rose-100/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-stone-800 dark:text-stone-200 text-[11px] space-y-1">
                            <div className="font-semibold text-rose-800 dark:text-rose-300 flex items-center justify-between">
                              <span>Notice Date: {ref.retractionDetails.retractionDate}</span>
                              {ref.retractionDetails.isPostRetraction && (
                                <span className="text-[10px] bg-rose-200 dark:bg-rose-900 px-1.5 py-0.5 rounded text-rose-900 dark:text-rose-100">
                                  Cited Post-Retraction ({ref.retractionDetails.deltaDays}d lag)
                                </span>
                              )}
                            </div>
                            <div className="text-stone-600 dark:text-stone-400">
                              {ref.retractionDetails.retractionReason}
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 align-top font-mono text-[11px] text-stone-500 whitespace-nowrap">
                        {ref.doi ? (
                          <a
                            href={`https://doi.org/${ref.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-600 dark:text-stone-300 hover:text-emerald-600 underline inline-flex items-center gap-1"
                          >
                            <span>{ref.doi}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-stone-400">Unindexed in Crossref</span>
                        )}
                      </td>

                      <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                        {ref.status === 'retracted' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 font-semibold text-[11px] border border-rose-200 dark:border-rose-900">
                            <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                            <span>Exclude / Disclose</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Approved</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
