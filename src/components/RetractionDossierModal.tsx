import React from 'react';
import {
  X,
  Printer,
  Download,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Building,
  User,
} from 'lucide-react';
import { AuditedArticleResult, FullTextAuditAnalysis, EditorProfile } from '../types/academic';

interface RetractionDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: AuditedArticleResult;
  analysis?: FullTextAuditAnalysis;
  editorialNotes: string;
  actionPlan: string;
  editor: EditorProfile;
}

export const RetractionDossierModal: React.FC<RetractionDossierModalProps> = ({
  isOpen,
  onClose,
  article,
  analysis,
  editorialNotes,
  actionPlan,
  editor,
}) => {
  if (!isOpen) return null;

  const isDataContributing =
    analysis?.contributions?.some((c) => c.isDataContributing) ??
    (analysis?.overallVerdict !== 'Uncontaminated / Background Citation');

  const primaryContribution = analysis?.contributions?.[0];
  const contributionType = primaryContribution?.contributionType || 'Synthesis Reference';
  const synthesisImpact = analysis?.overallSynthesisEffect || primaryContribution?.pooledDataImpact || 'No AI synthesis evaluation recorded.';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textContent = `================================================================================
RETRACTSCAN: OFFICIAL EDITORIAL RETRACTION IMPACT DOSSIER
================================================================================
Generated: ${new Date().toISOString()}
Integrity Auditor: ${editor.name} (${editor.email})
Affiliated Journal / Organization: ${editor.journal || 'Academic Publishing Group'}

--------------------------------------------------------------------------------
1. AUDITED REVIEW / SECONDARY ARTICLE
--------------------------------------------------------------------------------
Title: ${article.title}
DOI: https://doi.org/${article.doi}
Authors: ${article.authors.join(', ')}
Study Type: ${article.studyType || 'Systematic Review / Meta-Analysis'}
Publication Date: ${article.pubDate || 'N/A'}
Total References Scanned: ${article.totalReferences || 0}
Flagged Retracted Citations: ${article.retractedCitations?.length || 0}

--------------------------------------------------------------------------------
2. AI DATA-CONTRIBUTION VERDICT
--------------------------------------------------------------------------------
Classification: ${
      isDataContributing
        ? 'CRITICAL DATA-CONTRIBUTING STUDY (QUANTITATIVE SYNTHESIS)'
        : 'CONTEXTUAL / NON-DATA-CONTRIBUTING CITATION'
    }
Contribution Type: ${contributionType}
Synthesis Impact:
${synthesisImpact}

--------------------------------------------------------------------------------
3. IN-TEXT RETRACTED CITATIONS & SENTENCE IMPACT
--------------------------------------------------------------------------------
${
  (analysis?.sentenceImpacts || []).map((s, idx) => `
[${idx + 1}] Section: ${s.section} | Impact: ${s.impactLevel}
Cited Work: ${s.retractedTitle || s.retractedDoi}
Quote: "${s.sentence}"
Analysis: ${s.analysis}
Effect on Synthesis: ${s.effectOnSynthesis}
`).join('\n') || 'None recorded'
}

--------------------------------------------------------------------------------
4. AUDITED FIGURES & FOREST PLOTS
--------------------------------------------------------------------------------
${
  (analysis?.figuresAudited || []).map((fig, idx) => `
[${idx + 1}] ${fig.figureId} (${fig.type})
Includes Retracted Study Data: ${fig.includesRetractedData ? 'YES (DATA-CONTRIBUTING)' : 'NO (CLEAN / UNRELATED)'}
Forest Plot Analyzed: ${fig.isForestPlot ? 'YES' : 'NO'}
Visual Evidence & Analysis: ${fig.evidence}
`).join('\n') || 'No figures or forest plots analyzed'
}

--------------------------------------------------------------------------------
5. COPE EDITORIAL RECOMMENDATIONS
--------------------------------------------------------------------------------
${
  (analysis?.recommendations || []).map((c, idx) => `
Action: ${c.action} (Priority: ${c.priority})
Rationale: ${c.rationale}
Draft Editorial Notice:
${c.draftNotice || 'N/A'}
`).join('\n---\n') || 'None recorded'
}

--------------------------------------------------------------------------------
6. USER EDITORIAL NOTES & INTERNAL ACTION PLAN
--------------------------------------------------------------------------------
Assigned Action Plan: ${actionPlan || 'Pending Editorial Decision'}
Editor Internal Notes:
${editorialNotes || '[No custom notes recorded by the editor]'}

================================================================================
Confidential Journal Editorial Dossier · RetractScan Academic Integrity Suite
================================================================================
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Retraction_Dossier_${article.doi.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col print:border-none print:shadow-none print:max-w-none print:max-h-none print:w-full">
        {/* Modal Header (Hidden on print) */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0 bg-slate-50/70 dark:bg-slate-800/40 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Editorial Retraction Dossier (Print / PDF)
              </h3>
              <p className="text-[11px] text-slate-500">
                Official institutional summary including verified in-text impacts and custom editor notes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Text File</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 hover:rotate-90 transition-all duration-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Dossier Sheet */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 print:overflow-visible print:p-0">
          {/* Dossier Header */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 block">
                  Confidential Editorial Dossier · RetractScan Suite
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                  Retraction Impact & Evidence Verification Report
                </h1>
              </div>
              <div className="text-right text-xs text-slate-500 font-mono">
                <div>Date: {new Date().toLocaleDateString()}</div>
                <div>Status: Audited</div>
              </div>
            </div>

            {/* Auditor Details */}
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Auditor</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{editor.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Journal / Entity</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{editor.journal || 'Editorial Board'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contact Email</span>
                <span className="font-mono text-slate-600 dark:text-slate-400">{editor.email}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Review Study Identification */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-1">
              1. Audited Secondary Article
            </h2>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {article.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">DOI:</span>{' '}
                  <span className="font-mono">{article.doi}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Study Type:</span>{' '}
                  <span>{article.studyType || 'Systematic Review / Meta-Analysis'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Authors:</span>{' '}
                  <span>{article.authors.join(', ') || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Publication Date:</span>{' '}
                  <span>{article.pubDate || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: AI Verdict & Synthesis Risk */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-1">
              2. Data-Contribution Determination
            </h2>

            {analysis ? (
              <div
                className={`p-4 rounded-xl border ${
                  isDataContributing
                    ? 'bg-rose-50/70 border-rose-300 text-rose-950 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-200'
                    : 'bg-slate-50 border-slate-300 text-slate-900 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {isDataContributing ? (
                    <ShieldAlert className="w-5 h-5 text-rose-700 dark:text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  <span className="text-sm font-extrabold uppercase tracking-wide">
                    {isDataContributing
                      ? 'CRITICAL DATA-CONTRIBUTING STUDY'
                      : 'CONTEXTUAL / NON-DATA-CONTRIBUTING STUDY'}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/80 dark:bg-slate-800 border border-current">
                    {contributionType}
                  </span>
                </div>

                <div className="text-xs leading-relaxed space-y-1.5 mt-2">
                  <p>
                    <strong>Synthesis Risk Analysis:</strong> {synthesisImpact}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                No automated AI analysis executed yet for this document.
              </div>
            )}
          </div>

          {/* Section 3: In-Text Citation Sentence Impacts */}
          {analysis?.sentenceImpacts && analysis.sentenceImpacts.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-1">
                3. Extracted Citation Sentences ({analysis.sentenceImpacts.length} Flagged)
              </h2>

              <div className="space-y-3">
                {analysis.sentenceImpacts.map((sent, idx) => (
                  <div
                    key={sent.id || idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {sent.section}
                      </span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded ${
                          sent.impactLevel === 'Critical'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {sent.impactLevel} Impact
                      </span>
                    </div>

                    <blockquote className="italic font-serif text-slate-800 dark:text-slate-200 pl-3 border-l-2 border-slate-300 dark:border-slate-700 my-1.5">
                      "{sent.sentence}"
                    </blockquote>

                    <p className="text-slate-600 dark:text-slate-400">
                      <strong>AI Assessment:</strong> {sent.analysis}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Figures & Forest Plots Audited */}
          {analysis?.figuresAudited && analysis.figuresAudited.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-1">
                4. Audited Figures & Forest Plots ({analysis.figuresAudited.length} Examined)
              </h2>

              <div className="space-y-2.5">
                {analysis.figuresAudited.map((fig, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {fig.figureId}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {fig.type}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          fig.includesRetractedData
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {fig.includesRetractedData ? 'Includes Retracted Study Data' : 'Clean / Non-Contributing'}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {fig.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: COPE Recommendations */}
          {analysis?.recommendations && analysis.recommendations.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-1">
                5. COPE-Aligned Editorial Action Plan
              </h2>

              <div className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {rec.action}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        Priority: {rec.priority}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{rec.rationale}</p>
                    {rec.draftNotice && (
                      <div className="mt-2 p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                        {rec.draftNotice}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Custom User Editorial Notes & Assessment */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-1">
              6. Journal Editorial Notes & Decision Record
            </h2>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                  Editorial Committee Action Plan
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {actionPlan || 'Pending Editorial Decision'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                  Internal Editorial Notes & Observations
                </span>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans text-xs leading-relaxed">
                  {editorialNotes.trim() ? (
                    editorialNotes
                  ) : (
                    <span className="text-slate-400 italic">No custom notes recorded for this article.</span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500">
                <span>Signed: {editor.name}</span>
                <span>Affiliation: {editor.journal || 'Editorial Office'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
