import React, { useState } from 'react';
import { Search, Loader2, Sparkles, BookOpen, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { AuditedArticleResult, EditorProfile } from '../types/academic';
import { AuditReportDashboard } from './AuditReportDashboard';

interface IndividualArticleScannerProps {
  editor: EditorProfile;
  onSaveToHistory: (article: AuditedArticleResult) => void;
}

export const IndividualArticleScanner: React.FC<IndividualArticleScannerProps> = ({
  editor,
  onSaveToHistory,
}) => {
  const [identifierInput, setIdentifierInput] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [auditedArticle, setAuditedArticle] = useState<AuditedArticleResult | null>(null);

  const handleAuditSingle = async (identifier: string) => {
    if (!identifier.trim()) return;
    setIsResolving(true);
    setErrorMsg('');
    setAuditedArticle(null);

    try {
      const res = await fetch(
        `/api/academic/resolve-article?identifier=${encodeURIComponent(identifier.trim())}`
      );
      if (!res.ok) {
        throw new Error('Could not resolve or audit this article. Please check the identifier format.');
      }
      const data = await res.json();
      if (data.article) {
        setAuditedArticle(data.article);
      } else {
        throw new Error('No article data returned');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resolve article');
    } finally {
      setIsResolving(false);
    }
  };

  const handleUpdateStatus = (
    _articleDoi: string,
    citationDoi: string,
    newStatus: string,
    notes: string
  ) => {
    if (!auditedArticle) return;
    const updatedCitations = auditedArticle.retractedCitations.map((c) =>
      c.doi === citationDoi ? { ...c, editorialStatus: newStatus, editorNotes: notes } : c
    );
    setAuditedArticle({ ...auditedArticle, retractedCitations: updatedCitations });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Search Input Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Individual Article Citation & Retraction Audit
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Audit any research article, systematic review, or submitted manuscript by entering its DOI or PubMed URL/PMID.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAuditSingle(identifierInput);
          }}
          className="space-y-3"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={identifierInput}
                onChange={(e) => setIdentifierInput(e.target.value)}
                placeholder="Enter DOI (e.g. 10.1016/s0140-6736(21)00394-1) or PubMed Link (https://pubmed.ncbi.nlm.nih.gov/33743847/)"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 focus:outline-none transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isResolving || !identifierInput.trim()}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 group"
            >
              {isResolving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Auditing Citations...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                  <span>Audit Article</span>
                </>
              )}
            </button>
          </div>

          {/* Quick preset examples */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400">Sample Test DOI / PubMed:</span>
            <button
              type="button"
              onClick={() => {
                setIdentifierInput('10.1016/s0140-6736(21)00394-1');
                handleAuditSingle('10.1016/s0140-6736(21)00394-1');
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 font-mono cursor-pointer shadow-2xs hover:shadow-xs"
            >
              The Lancet COVID-19 Review (doi:10.1016/s0140-6736...)
            </button>
            <button
              type="button"
              onClick={() => {
                setIdentifierInput('https://pubmed.ncbi.nlm.nih.gov/38291023/');
                handleAuditSingle('https://pubmed.ncbi.nlm.nih.gov/38291023/');
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 font-mono cursor-pointer shadow-2xs hover:shadow-xs"
            >
              PubMed URL (pubmed.ncbi.nlm.nih.gov/38291023)
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900/50 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Render Single Article Audit Dashboard */}
      {auditedArticle && (
        <div className="animate-in fade-in duration-300">
          <AuditReportDashboard
            auditResults={[auditedArticle]}
            journalName={auditedArticle.title}
            editor={editor}
            onUpdateCitationStatus={handleUpdateStatus}
            onSaveToHistory={() => onSaveToHistory(auditedArticle)}
          />
        </div>
      )}
    </div>
  );
};
