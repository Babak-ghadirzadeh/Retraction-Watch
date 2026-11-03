import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  FileDown,
  Printer,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Save,
  Clock,
  Info,
  ShieldCheck,
  AlertOctagon,
  Filter,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { AuditedArticleResult, CitedReference, EditorProfile } from '../types/academic';
import { generateCsvAuditReport } from '../utils/academicAudit';

interface AuditReportDashboardProps {
  auditResults: AuditedArticleResult[];
  journalName: string;
  editor: EditorProfile;
  onUpdateCitationStatus: (
    articleDoi: string,
    citationDoi: string,
    newStatus: string,
    notes: string
  ) => void;
  onSaveToHistory: () => void;
  onStartFullTextAudit?: (articles: AuditedArticleResult[], initialIndex?: number) => void;
}

export const AuditReportDashboard: React.FC<AuditReportDashboardProps> = ({
  auditResults,
  journalName,
  editor,
  onUpdateCitationStatus,
  onSaveToHistory,
  onStartFullTextAudit,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'flagged' | 'clean'>('all');
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({});

  // Selection map for full-text deep audit
  const [selectedForDeepAudit, setSelectedForDeepAudit] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    auditResults.forEach((a) => {
      if (a.hasRetractedCitation) map[a.doi] = true;
    });
    return map;
  });

  const toggleSelectForDeepAudit = (doi: string) => {
    setSelectedForDeepAudit((prev) => ({ ...prev, [doi]: !prev[doi] }));
  };

  const selectedArticlesForAudit = auditResults.filter((a) => selectedForDeepAudit[a.doi]);

  // Summary Metrics
  const totalArticles = auditResults.length;
  const totalCitations = auditResults.reduce((acc, a) => acc + (a.totalReferences || 0), 0);
  const flaggedArticles = auditResults.filter((a) => a.hasRetractedCitation);
  const totalRetractedCitations = auditResults.reduce((acc, a) => acc + a.retractedCount, 0);
  const criticalPostRetractions = auditResults.reduce(
    (acc, a) => acc + a.retractedCitations.filter((c) => c.isPostRetraction).length,
    0
  );

  const toggleExpand = (doi: string) => {
    setExpandedArticles((prev) => ({ ...prev, [doi]: !prev[doi] }));
  };

  const handleDownloadCsv = () => {
    const csvContent = generateCsvAuditReport(auditResults, journalName, editor.name);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeJournal = journalName.replace(/[^a-zA-Z0-9_-]/g, '_');
    link.setAttribute(
      'download',
      `RetractScan_Audit_${safeJournal}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const displayedArticles = auditResults.filter((a) => {
    if (filterMode === 'flagged') return a.hasRetractedCitation;
    if (filterMode === 'clean') return !a.hasRetractedCitation;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Printable Header (Visible only in print) */}
      <div className="hidden print-only p-6 border-b border-slate-300">
        <h1 className="text-2xl font-bold">RetractScan: Journal Citation Retraction Audit Report</h1>
        <p className="text-sm mt-1">
          Journal: <strong>{journalName}</strong> · Auditor: <strong>{editor.name} ({editor.role})</strong> · Date: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Audited Reviews
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono tabular-nums">
            {totalArticles}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {totalCitations} references analyzed
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Reviews with Retracted Citations
          </span>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1 font-mono tabular-nums">
            {flaggedArticles.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {totalArticles > 0 ? ((flaggedArticles.length / totalArticles) * 100).toFixed(0) : 0}% of scanned studies
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Flagged Citations
          </span>
          <div className="text-2xl font-bold text-rose-700 dark:text-rose-400 mt-1 font-mono tabular-nums">
            {totalRetractedCitations}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Crossref & OpenAlex verified
          </span>
        </div>

        <div className="p-4 rounded-xl border border-rose-200/80 dark:border-rose-950 bg-rose-50/40 dark:bg-rose-950/20 shadow-xs">
          <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">
            Post-Retraction Citations
          </span>
          <div className="text-2xl font-bold text-rose-800 dark:text-rose-400 mt-1 font-mono tabular-nums">
            {criticalPostRetractions}
          </div>
          <span className="text-[11px] text-rose-700/80 dark:text-rose-300/80 mt-1 block">
            Cited after official retraction
          </span>
        </div>
      </div>

      {/* Toolbar: Filters and Export Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs no-print">
        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filterMode === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            All Studies ({totalArticles})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('flagged')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              filterMode === 'flagged'
                ? 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-rose-700'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Flagged ({flaggedArticles.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('clean')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              filterMode === 'clean'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Clean ({totalArticles - flaggedArticles.length})</span>
          </button>
        </div>

        {/* Export and Save actions */}
        <div className="flex flex-wrap items-center gap-2">
          {onStartFullTextAudit && (
            <button
              type="button"
              onClick={() => {
                const targetArticles =
                  selectedArticlesForAudit.length > 0
                    ? selectedArticlesForAudit
                    : auditResults.filter((a) => a.hasRetractedCitation);
                onStartFullTextAudit(targetArticles.length > 0 ? targetArticles : auditResults);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
              title="Launch full-text AI evaluation to check data-contribution status and sentence-level effects"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Analyze Full-Text Impact (AI) ({selectedArticlesForAudit.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={onSaveToHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Save this audit to your persistent editor records"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>Save to History</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Download complete CSV spreadsheet for editorial assessment"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 shadow-xs transition-colors cursor-pointer"
            title="Open printable editorial assessment sheet (PDF export)"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Article Audit Cards */}
      <div className="space-y-4">
        {displayedArticles.map((article) => {
          const isExpanded = expandedArticles[article.doi] ?? true; // expanded by default
          const hasRetractions = article.retractedCount > 0;
          const isCritical = article.hasPostRetractionCitation;

          return (
            <div
              key={article.doi}
              className={`rounded-xl border p-5 shadow-xs transition-colors ${
                isCritical
                  ? 'border-rose-300 dark:border-rose-900 bg-rose-50/20 dark:bg-rose-950/15'
                  : hasRetractions
                  ? 'border-amber-300 dark:border-amber-900 bg-amber-50/20 dark:bg-amber-950/15'
                  : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              {/* Header: Status Tag & Title */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800">
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={!!selectedForDeepAudit[article.doi]}
                    onChange={() => toggleSelectForDeepAudit(article.doi)}
                    className="w-4 h-4 rounded text-amber-600 border-slate-300 dark:border-slate-700 cursor-pointer mt-1 shrink-0"
                    title="Select this article for full-text AI impact evaluation"
                  />

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {/* Status badge */}
                      {isCritical ? (
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-800 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded flex items-center gap-1">
                          <AlertOctagon className="w-3.5 h-3.5" />
                          <span>Critical: Post-Retraction Citation</span>
                        </span>
                      ) : hasRetractions ? (
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Warning: Retracted Work Cited</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Verified Clean Bibliography</span>
                        </span>
                      )}

                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        <span>{article.studyType}</span>
                        <span className="mx-1.5" aria-hidden="true">·</span>
                        <span>Published {article.pubDate}</span>
                        <span className="mx-1.5" aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{article.totalReferences} references</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {article.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="truncate max-w-sm">
                        {article.authors.join('; ')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <a
                        href={`https://doi.org/${article.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:underline inline-flex items-center gap-1"
                      >
                        <span>doi:{article.doi}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right summary counter, Full-text AI action & collapse toggle */}
                <div className="flex items-center gap-3 shrink-0 self-start">
                  {onStartFullTextAudit && article.retractedCount > 0 && (
                    <button
                      type="button"
                      onClick={() => onStartFullTextAudit([article])}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                      title="Analyze this review article's full-text with AI against cited retracted studies"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Verify Full-Text (AI)</span>
                    </button>
                  )}

                  <div className="text-right">
                    <span className="text-xs font-medium block text-slate-500">
                      Flagged Citations
                    </span>
                    <span
                      className={`text-lg font-bold font-mono tabular-nums ${
                        hasRetractions ? 'text-rose-700 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {article.retractedCount}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(article.doi)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Flagged Citations List & Editorial Assessment Panel */}
              {isExpanded && (
                <div className="mt-4 pt-2">
                  {article.retractedCitations.length === 0 ? (
                    <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        All {article.totalReferences} extracted citations were checked against Crossref and OpenAlex. No retractions or expressions of concern detected.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-rose-800 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>Identified Retracted Citations ({article.retractedCitations.length})</span>
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Crossref event relations & notice verification
                        </span>
                      </div>

                      {article.retractedCitations.map((cited, idx) => (
                        <div
                          key={`${cited.doi}-${idx}`}
                          className="p-4 rounded-lg border border-rose-200/90 dark:border-rose-900/80 bg-white dark:bg-slate-900/90 shadow-xs"
                        >
                          {/* Cited Paper Title & Direct Link */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                                  #{idx + 1} RETRACTED CITED STUDY
                                </span>

                                {cited.isPostRetraction ? (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-700 text-white flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>POST-RETRACTION CITATION</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                                    PRE-RETRACTION CITATION
                                  </span>
                                )}
                              </div>

                              <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                                {cited.title}
                              </h4>

                              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                                <span>{cited.author || 'Author not indexed'}</span>
                                <span aria-hidden="true">·</span>
                                <span>Published {cited.year || 'N/A'}</span>
                                <span aria-hidden="true">·</span>
                                <a
                                  href={`https://doi.org/${cited.doi}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:underline inline-flex items-center gap-1"
                                >
                                  <span>doi:{cited.doi}</span>
                                  <ExternalLink className="w-3 h-3 text-slate-400" />
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Retraction Details Box */}
                          <div className="mt-3 p-3 bg-rose-50/60 dark:bg-rose-950/30 rounded-md border border-rose-100 dark:border-rose-900/40 text-xs space-y-1.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-semibold text-rose-900 dark:text-rose-200">
                                Retraction Notice Date: <span className="font-mono">{cited.retractionDate}</span>
                              </span>
                              <span className="text-rose-800 dark:text-rose-300 font-medium">
                                {cited.timingDescription}
                              </span>
                            </div>

                            <p className="text-slate-700 dark:text-slate-300">
                              <strong className="text-slate-900 dark:text-white">Reason / Grounds: </strong>
                              {cited.retractionReason}
                            </p>

                            {cited.retractionNoticeDoi && (
                              <div className="pt-1">
                                <a
                                  href={`https://doi.org/${cited.retractionNoticeDoi}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-700 dark:text-slate-300 hover:underline font-mono inline-flex items-center gap-1 font-semibold"
                                >
                                  <span>Official Retraction Notice (doi:{cited.retractionNoticeDoi})</span>
                                  <ExternalLink className="w-3 h-3 text-slate-400" />
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Editorial Assessment & Action Box */}
                          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Editorial Assessment Action
                              </label>
                              <select
                                value={cited.editorialStatus || 'Needs Editorial Review'}
                                onChange={(e) =>
                                  onUpdateCitationStatus(
                                    article.doi,
                                    cited.doi || '',
                                    e.target.value,
                                    cited.editorNotes || ''
                                  )
                                }
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer font-medium"
                              >
                                <option value="Needs Editorial Review">Needs Editorial Review</option>
                                <option value="Request Author Corrigendum">Request Author Corrigendum</option>
                                <option value="Issue Editorial Expression of Concern">Issue Editorial Expression of Concern</option>
                                <option value="Retraction Assessment of Review">Retraction Assessment of Review</option>
                                <option value="Dismiss - Discussion of Retraction">Dismiss - Valid Discussion of Retraction</option>
                                <option value="Verified - Minimal Synthesis Impact">Verified - Minimal Synthesis Impact</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Editor Private Notes
                              </label>
                              <input
                                type="text"
                                defaultValue={cited.editorNotes || ''}
                                placeholder="e.g. Cited in Meta-Analysis Fig 2 pooled forest plot..."
                                onBlur={(e) =>
                                  onUpdateCitationStatus(
                                    article.doi,
                                    cited.doi || '',
                                    cited.editorialStatus || 'Needs Editorial Review',
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
