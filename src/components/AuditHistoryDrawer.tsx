import React from 'react';
import { History, Calendar, Trash2, ArrowUpRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { SavedAuditSession } from '../types/academic';

interface AuditHistoryDrawerProps {
  sessions: SavedAuditSession[];
  onSelectSession: (session: SavedAuditSession) => void;
  onDeleteSession: (id: string) => void;
}

export const AuditHistoryDrawer: React.FC<AuditHistoryDrawerProps> = ({
  sessions,
  onSelectSession,
  onDeleteSession,
}) => {
  if (sessions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
          <History className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No Saved Audits Yet
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
          When you perform journal audits or individual article citation checks, click "Save to History" in the audit report to save editorial records for future reference.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <span>Saved Editorial Audit Sessions ({sessions.length})</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Archived citation retraction reports and editorial assessment notes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((session) => {
          const totalArticles = session.auditedArticles.length;
          const flaggedCount = session.auditedArticles.filter((a) => a.hasRetractedCitation).length;
          const totalRetractions = session.auditedArticles.reduce((acc, a) => acc + a.retractedCount, 0);

          return (
            <div
              key={session.id}
              className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                    {session.journalName}
                  </h3>
                  <button
                    type="button"
                    onClick={() => onDeleteSession(session.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                    title="Delete saved audit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Audited on {new Date(session.createdAt).toLocaleDateString()}</span>
                  <span aria-hidden="true">·</span>
                  <span>Timeline: {session.timeline}</span>
                </div>

                {/* Metrics pill strip */}
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {totalArticles} studies
                  </span>
                  {flaggedCount > 0 ? (
                    <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      <span>{totalRetractions} retracted citations</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Clean bibliography</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => onSelectSession(session)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs group"
                >
                  <span>Open Audit Dashboard</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
