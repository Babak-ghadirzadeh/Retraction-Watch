import React, { useState } from 'react';
import {
  ArrowLeft,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  ShieldAlert,
  Printer,
  ChevronRight,
  MessageSquare,
  FileSpreadsheet,
  RotateCcw,
  BookOpen,
  Image as ImageIcon,
  BarChart3,
  Layers,
  FileCheck,
} from 'lucide-react';
import {
  AuditedArticleResult,
  FullTextAuditAnalysis,
  EditorProfile,
} from '../types/academic';
import { RetractionDossierModal } from './RetractionDossierModal';

interface FullTextAuditViewProps {
  selectedArticles: AuditedArticleResult[];
  initialActiveIndex?: number;
  onBackToAudit: () => void;
  editor: EditorProfile;
}

interface UploadedDocument {
  text: string;
  fileName: string;
  fileBase64?: string;
  mimeType?: string;
  fileSize?: string;
  isMultimodal?: boolean;
}

const STORAGE_KEY_EDITORIAL_NOTES = 'retractscan_fulltext_notes';
const STORAGE_KEY_ACTION_PLANS = 'retractscan_fulltext_actions';

export const FullTextAuditView: React.FC<FullTextAuditViewProps> = ({
  selectedArticles,
  initialActiveIndex = 0,
  onBackToAudit,
  editor,
}) => {
  const [activeQueueIndex, setActiveQueueIndex] = useState(initialActiveIndex);

  // Per-article storage for manuscript document, file info, and AI analysis
  const [manuscripts, setManuscripts] = useState<Record<string, UploadedDocument>>({});
  const [analyses, setAnalyses] = useState<Record<string, FullTextAuditAnalysis>>({});
  const [loadingState, setLoadingState] = useState<Record<string, boolean>>({});
  const [errorState, setErrorState] = useState<Record<string, string | null>>({});

  // Editorial notes and actions (persisted in localStorage)
  const [editorialNotes, setEditorialNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EDITORIAL_NOTES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {};
  });

  const [actionPlans, setActionPlans] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTION_PLANS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {};
  });

  // Modal for formatted printable PDF dossier
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [copiedNoticeId, setCopiedNoticeId] = useState<string | null>(null);
  const [articleOverrides, setArticleOverrides] = useState<Record<string, Partial<AuditedArticleResult>>>({});

  const baseArticle = selectedArticles[activeQueueIndex] || selectedArticles[0];
  const currentArticle: AuditedArticleResult = baseArticle
    ? { ...baseArticle, ...(articleOverrides[baseArticle.doi] || {}) }
    : baseArticle;
  const currentDoi = currentArticle?.doi || '';
  const currentManuscript = manuscripts[currentDoi];
  const currentAnalysis = analyses[currentDoi];
  const isCurrentLoading = loadingState[currentDoi] || false;
  const currentError = errorState[currentDoi];
  const currentNotes = editorialNotes[currentDoi] || '';
  const currentActionPlan = actionPlans[currentDoi] || 'Request Author Sensitivity Re-analysis';

  const isCurrentDataContributing = currentAnalysis
    ? currentAnalysis.contributions?.some((c) => c.isDataContributing) ??
      (currentAnalysis.overallVerdict !== 'Uncontaminated / Background Citation')
    : false;

  const primaryContribution = currentAnalysis?.contributions?.[0];
  const currentContributionType = primaryContribution?.contributionType || 'Quantitative Meta-Analysis';
  const currentSynthesisImpact = currentAnalysis?.overallSynthesisEffect || primaryContribution?.pooledDataImpact || '';

  // Save notes to localStorage
  const handleUpdateNotes = (notes: string) => {
    setEditorialNotes((prev) => {
      const updated = { ...prev, [currentDoi]: notes };
      try {
        localStorage.setItem(STORAGE_KEY_EDITORIAL_NOTES, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist notes:', e);
      }
      return updated;
    });
  };

  // Save action plan to localStorage
  const handleUpdateActionPlan = (plan: string) => {
    setActionPlans((prev) => {
      const updated = { ...prev, [currentDoi]: plan };
      try {
        localStorage.setItem(STORAGE_KEY_ACTION_PLANS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist action plan:', e);
      }
      return updated;
    });
  };

  // Handle file upload (.pdf, .docx, .png, .jpg, .txt, .md)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentArticle) return;

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let extractedText = '';
      let fileBase64 = '';
      const mimeType =
        file.type ||
        (ext === 'pdf'
          ? 'application/pdf'
          : ext === 'docx'
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : ext === 'png'
          ? 'image/png'
          : ext === 'jpg' || ext === 'jpeg'
          ? 'image/jpeg'
          : 'text/plain');

      // Convert file to Base64 for multimodal Gemini vision & document parsing
      const base64Promise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      fileBase64 = await base64Promise;

      if (ext === 'txt' || ext === 'md') {
        extractedText = await file.text();
      } else {
        extractedText = `Manuscript File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)\nMIME Type: ${mimeType}\nMultimodal visual analysis ready.`;
      }

      const isMultimodal = mimeType === 'application/pdf' || mimeType.startsWith('image/');
      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      setManuscripts((prev) => ({
        ...prev,
        [currentDoi]: {
          text: extractedText,
          fileName: file.name,
          fileBase64,
          mimeType,
          fileSize: formattedSize,
          isMultimodal,
        },
      }));
      setErrorState((prev) => ({ ...prev, [currentDoi]: null }));
    } catch (err: any) {
      console.error('File parsing error:', err);
      setErrorState((prev) => ({
        ...prev,
        [currentDoi]: `Failed to read file: ${err.message || 'Format unsupported'}`,
      }));
    }
  };

  // Run AI Full-Text & Multimodal Figure Retraction Impact Analysis
  const handleRunAiAnalysis = async () => {
    if (!currentArticle || !currentManuscript) return;

    setLoadingState((prev) => ({ ...prev, [currentDoi]: true }));
    setErrorState((prev) => ({ ...prev, [currentDoi]: null }));

    try {
      const res = await fetch('/api/academic/ai-fulltext-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewArticle: {
            title: currentArticle.title,
            doi: currentArticle.doi,
            authors: currentArticle.authors,
            studyType: currentArticle.studyType,
          },
          fullText: currentManuscript.text,
          fileBase64: currentManuscript.fileBase64,
          mimeType: currentManuscript.mimeType,
          fileName: currentManuscript.fileName,
          retractedCitations: currentArticle.retractedCitations,
        }),
      });

      if (!res.ok) {
        throw new Error(`Analysis service responded with code ${res.status}`);
      }

      const data = await res.json();
      if (data.analysis) {
        setAnalyses((prev) => ({ ...prev, [currentDoi]: data.analysis }));

        if (Array.isArray(data.retractedCitations) && data.retractedCitations.length > 0) {
          setArticleOverrides((prev) => ({
            ...prev,
            [currentDoi]: {
              retractedCitations: data.retractedCitations,
              retractedCount: data.retractedCitations.length,
              hasRetractedCitation: true,
              hasPostRetractionCitation: data.retractedCitations.some((c: any) => c.isPostRetraction),
              riskLevel: data.retractedCitations.some((c: any) => c.isPostRetraction) ? 'Critical' : 'High',
            },
          }));
        }
      } else {
        throw new Error('Analysis payload missing from response');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorState((prev) => ({
        ...prev,
        [currentDoi]: err.message || 'Error executing AI full-text retraction audit.',
      }));
    } finally {
      setLoadingState((prev) => ({ ...prev, [currentDoi]: false }));
    }
  };

  // Copy notice text to clipboard
  const copyNotice = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNoticeId(id);
    setTimeout(() => setCopiedNoticeId(null), 2500);
  };

  // Export CSV Report with Editorial Notes
  const handleExportCsv = () => {
    if (!currentArticle) return;

    const escapeCsv = (str: any) => `"${String(str || '').replace(/"/g, '""')}"`;

    const headers = [
      'Audited Article Title',
      'Article DOI',
      'Study Type',
      'Publication Date',
      'Retracted Citation Title',
      'Retracted Citation DOI',
      'AI Data-Contributing Status',
      'Contribution Type',
      'Synthesis Impact Summary',
      'Figures & Forest Plots Audited',
      'Cited Sentence Quote',
      'Manuscript Section',
      'Impact Level',
      'Assigned Action Plan',
      'Editorial Notes & Assessment',
      'Auditor Name',
      'Auditor Journal',
      'Audit Timestamp',
    ];

    const rows: string[] = [headers.map((h) => `"${h}"`).join(',')];

    const isDataContribStr = currentAnalysis
      ? isCurrentDataContributing
        ? 'DATA-CONTRIBUTING STUDY (CRITICAL)'
        : 'CONTEXTUAL / NON-DATA-CONTRIBUTING'
      : 'Pending Analysis';

    const sentences = currentAnalysis?.sentenceImpacts || [];
    const figuresSummary = (currentAnalysis?.figuresAudited || [])
      .map((f) => `${f.figureName} (${f.figureType}): ${f.containsRetractedData ? 'CONTAINS RETRACTED DATA' : 'Clean'} - ${f.details}`)
      .join(' | ') || 'None audited';

    if (sentences.length === 0) {
      rows.push([
        escapeCsv(currentArticle.title),
        escapeCsv(currentArticle.doi),
        escapeCsv(currentArticle.studyType || 'Review'),
        escapeCsv(currentArticle.pubDate || 'N/A'),
        escapeCsv(currentArticle.retractedCitations[0]?.title || 'Retracted Study'),
        escapeCsv(currentArticle.retractedCitations[0]?.doi || 'N/A'),
        escapeCsv(isDataContribStr),
        escapeCsv(currentContributionType),
        escapeCsv(currentSynthesisImpact),
        escapeCsv(figuresSummary),
        escapeCsv('None extracted'),
        escapeCsv('N/A'),
        escapeCsv('N/A'),
        escapeCsv(currentActionPlan),
        escapeCsv(currentNotes),
        escapeCsv(editor.name),
        escapeCsv(editor.journal || 'Editorial Office'),
        escapeCsv(new Date().toISOString()),
      ].join(','));
    } else {
      for (const sent of sentences) {
        rows.push([
          escapeCsv(currentArticle.title),
          escapeCsv(currentArticle.doi),
          escapeCsv(currentArticle.studyType || 'Review'),
          escapeCsv(currentArticle.pubDate || 'N/A'),
          escapeCsv(sent.retractedTitle || currentArticle.retractedCitations[0]?.title || 'Retracted Study'),
          escapeCsv(sent.retractedDoi || currentArticle.retractedCitations[0]?.doi || 'N/A'),
          escapeCsv(isDataContribStr),
          escapeCsv(currentContributionType),
          escapeCsv(currentSynthesisImpact),
          escapeCsv(figuresSummary),
          escapeCsv(sent.sentence),
          escapeCsv(sent.section),
          escapeCsv(sent.impactLevel),
          escapeCsv(currentActionPlan),
          escapeCsv(currentNotes),
          escapeCsv(editor.name),
          escapeCsv(editor.journal || 'Editorial Office'),
          escapeCsv(new Date().toISOString()),
        ].join(','));
      }
    }

    const csvContent = '\uFEFF' + rows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Retraction_Report_${currentArticle.doi.replace(/[^a-zA-Z0-9]/g, '_')}_with_notes.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!currentArticle) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500">No review articles selected for full-text impact analysis.</p>
        <button
          onClick={onBackToAudit}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
        >
          Return to Audit Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header & Tab Queue */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToAudit}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs group"
              title="Return to Audit Overview"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Full-Text & Multimodal Figure Verification
                </span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="text-xs text-slate-500">
                  Queue: {activeQueueIndex + 1} of {selectedArticles.length} selected review studies
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                Full-Text Retraction Impact & Evidence Synthesis Audit
              </h1>
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs"
              title="Download structured CSV dossier including your editorial notes"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Export CSV Dossier</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDossierModalOpen(true)}
              className="text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
              title="Generate formal PDF report ready for journal editorial board"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export Dossier (Printable PDF)</span>
            </button>
          </div>
        </div>

        {/* Tabbed Queue of Multiple Selected Review Articles */}
        {selectedArticles.length > 1 && (
          <div className="flex items-center gap-2 pt-4 overflow-x-auto pb-1 scrollbar-thin">
            {selectedArticles.map((art, idx) => {
              const hasAnalysis = Boolean(analyses[art.doi]);
              const isContributing = analyses[art.doi]?.contributions?.some((c) => c.isDataContributing);
              return (
                <button
                  key={art.doi}
                  type="button"
                  onClick={() => setActiveQueueIndex(idx)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    activeQueueIndex === idx
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 font-bold shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate max-w-[170px]">{art.title}</span>
                  {hasAnalysis && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isContributing ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      title={isContributing ? 'Data-Contributing' : 'Contextual'}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Current Review Study Profile Banner */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {currentArticle.studyType || 'Review Study'}
              </span>
              <span className="text-xs font-mono text-slate-500">DOI: {currentArticle.doi}</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
              {currentArticle.title}
            </h2>
            <p className="text-xs text-slate-500">
              Authors: {currentArticle.authors.join(', ') || 'N/A'} · Published: {currentArticle.pubDate || 'N/A'}
            </p>
          </div>

          {/* Trigger AI Button (Active when file uploaded) */}
          {currentManuscript && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleRunAiAnalysis}
                disabled={isCurrentLoading}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer ${
                  isCurrentLoading
                    ? 'bg-slate-300 text-slate-500 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
                    : currentAnalysis
                    ? 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900'
                    : 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                }`}
              >
                {isCurrentLoading ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Auditing Full Text & Figures...</span>
                  </>
                ) : currentAnalysis ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-amber-600" />
                    <span>Re-Run AI Verification</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>Run AI Verification</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Uploaded Manuscript Ribbon / Status */}
        {currentManuscript && (
          <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                Active Document: <strong className="text-slate-900 dark:text-white">{currentManuscript.fileName}</strong>
              </span>
              {currentManuscript.fileSize && (
                <span className="font-mono text-slate-400">({currentManuscript.fileSize})</span>
              )}
              {currentManuscript.isMultimodal && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-900">
                  Multimodal PDF & Figures Ingested
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-slate-900 dark:text-white hover:underline flex items-center gap-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Replace / Upload New File</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md,.png,.jpg,.jpeg,.webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {currentError && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{currentError}</span>
          </div>
        )}
      </div>

      {/* When No Manuscript File is Uploaded: Clean Dedicated Dropzone */}
      {!currentManuscript && (
        <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mx-auto flex items-center justify-center">
            <Upload className="w-7 h-7 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Upload Manuscript PDF, DOCX, or Figures / Forest Plots
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1">
              Provide the full-text PDF of <strong>"{currentArticle.title}"</strong>. The multimodal AI will read the text, assess every forest plot and table, and verify whether cited studies contributed quantitative patient data.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold hover:bg-slate-800 cursor-pointer shadow-sm transition-all">
            <Upload className="w-4 h-4" />
            <span>Choose PDF / Document / Figure Image</span>
            <input
              type="file"
              accept=".pdf,.docx,.doc,.txt,.md,.png,.jpg,.jpeg,.webp"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <p className="text-[11px] text-slate-400">
            Supported formats: PDF (native inspection), Word DOCX, High-Res Forest Plot PNG/JPG, TXT, Markdown
          </p>
        </div>
      )}

      {/* Main AI Impact & Editorial Evaluation Cards */}
      {currentManuscript && !currentAnalysis && (
        <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <Sparkles className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Ready to Verify Retraction Impact & Figures
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Document <strong>{currentManuscript.fileName}</strong> is loaded. Click below to inspect forest plots, tables, and in-text citations.
          </p>
          <button
            type="button"
            onClick={handleRunAiAnalysis}
            disabled={isCurrentLoading}
            className="mt-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold hover:bg-slate-800 cursor-pointer inline-flex items-center gap-2 shadow-xs"
          >
            {isCurrentLoading ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing Full Text & Figures...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Run AI Verification</span>
              </>
            )}
          </button>
        </div>
      )}

      {currentAnalysis && (
        <div className="space-y-6">
          {/* Card 1: Prominent Data-Contribution Determination Badge */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              isCurrentDataContributing
                ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300/80 dark:border-rose-900/80 text-rose-950 dark:text-rose-100'
                : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isCurrentDataContributing
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  {isCurrentDataContributing ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                      Determination Verdict:
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900 border border-current">
                      {currentContributionType}
                    </span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight mt-0.5">
                    {isCurrentDataContributing
                      ? 'CRITICAL DATA-CONTRIBUTING STUDY (QUANTITATIVE SYNTHESIS)'
                      : 'CONTEXTUAL / NON-DATA-CONTRIBUTING CITATION'}
                  </h3>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-current/15 text-xs sm:text-sm leading-relaxed">
              <span className="font-bold block mb-1">Synthesis Impact Analysis:</span>
              <p className="text-slate-700 dark:text-slate-300">{currentSynthesisImpact}</p>
            </div>
          </div>

          {/* Card 2: Figures & Forest Plots Audited */}
          {currentAnalysis.figuresAudited && currentAnalysis.figuresAudited.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-slate-500" />
                    <span>Figures, Forest Plots & Evidence Tables Audited</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Multimodal inspection results across all figures, forest plots, and summary synthesis tables.
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {currentAnalysis.figuresAudited.length} figures inspected
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {currentAnalysis.figuresAudited.map((fig, idx) => (
                  <div
                    key={`${fig.figureName}-${idx}`}
                    className={`p-4 rounded-xl border transition-all ${
                      fig.containsRetractedData
                        ? 'border-rose-200 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                        {fig.figureName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          fig.containsRetractedData
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {fig.containsRetractedData ? 'Retracted Data Contributed' : 'Clean / Non-Contributing'}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 mb-1">
                      Type: {fig.figureType} {fig.retractedDoi && `· DOI: ${fig.retractedDoi}`}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {fig.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card 3: Extracted In-Text Citation Sentences */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span>In-Text Citation Sentence Extracts</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Exact passages where retracted literature is cited, categorized by manuscript section and effect level.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {currentAnalysis.sentenceImpacts?.length || 0} citations flagged
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {(currentAnalysis.sentenceImpacts || []).map((sent, idx) => (
                <div
                  key={sent.id || idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        {sent.section}
                      </span>
                      <span className="text-slate-500 text-[11px] font-mono truncate max-w-[280px]">
                        Ref: {sent.retractedTitle || sent.retractedDoi}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        sent.impactLevel === 'Critical'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : sent.impactLevel === 'Substantial'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {sent.impactLevel} Impact
                    </span>
                  </div>

                  <blockquote className="text-xs sm:text-sm font-serif italic text-slate-800 dark:text-slate-200 border-l-2 border-slate-300 dark:border-slate-700 pl-3 py-1 my-1">
                    "{sent.sentence}"
                  </blockquote>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/50 dark:border-slate-800">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Context: </span>
                      <span className="text-slate-600 dark:text-slate-400">{sent.analysis}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Effect: </span>
                      <span className="text-slate-600 dark:text-slate-400">{sent.effectOnSynthesis}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: COPE Action Recommendations */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>COPE-Compliant Action Recommendations</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard editorial next steps and drafted formal notices ready for publication.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {(currentAnalysis.recommendations || []).map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {rec.action}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        rec.priority === 'Immediate Action'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {rec.priority}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">{rec.rationale}</p>

                  {rec.draftNotice && (
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Draft Formal Notice Text
                        </span>
                        <button
                          type="button"
                          onClick={() => copyNotice(rec.draftNotice!, `rec-${idx}`)}
                          className="text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedNoticeId === `rec-${idx}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Text</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-200/50 dark:border-slate-700/50">
                        {rec.draftNotice}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card 5: Editorial Notes & Action Plan (Custom Notes Section) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <span>Editorial Assessment & Custom Notes (Optional)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record private notes, author correspondence decisions, and final action plans. These notes are included in exported dossiers and CSV reports.
                </p>
              </div>
              <span className="text-xs text-slate-400">Auto-saved to session</span>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Assigned Editorial Action Plan:
                </label>
                <select
                  value={currentActionPlan}
                  onChange={(e) => handleUpdateActionPlan(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="Request Author Sensitivity Re-analysis">Request Author Sensitivity Re-analysis</option>
                  <option value="Publish Editorial Expression of Concern">Publish Editorial Expression of Concern</option>
                  <option value="Issue Formal COPE Corrigendum / Erratum">Issue Formal COPE Corrigendum / Erratum</option>
                  <option value="Initiate Editorial Board Retraction Review">Initiate Editorial Board Retraction Review</option>
                  <option value="No Action Required (Contextual Background Citation)">No Action Required (Contextual Background Citation)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Editorial Notes & Comments:
                </label>
                <textarea
                  rows={4}
                  value={currentNotes}
                  onChange={(e) => handleUpdateNotes(e.target.value)}
                  placeholder="e.g. Lead author Dr. Smith contacted on Nov 3 regarding cited Mehra 2020 dataset. Authors agreed to re-run random effects model without retracted cohorts and submit corrigendum within 3 weeks."
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all font-sans"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formatted Printable PDF Dossier Modal */}
      <RetractionDossierModal
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
        article={currentArticle}
        analysis={currentAnalysis}
        editorialNotes={currentNotes}
        actionPlan={currentActionPlan}
        editor={editor}
      />
    </div>
  );
};
