import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { EditorAuthModal } from './components/EditorAuthModal';
import { JournalSearchSection } from './components/JournalSearchSection';
import { ArticleSelectionTable } from './components/ArticleSelectionTable';
import { AuditReportDashboard } from './components/AuditReportDashboard';
import { IndividualArticleScanner } from './components/IndividualArticleScanner';
import { AuditHistoryDrawer } from './components/AuditHistoryDrawer';
import {
  Journal,
  ReviewArticle,
  AuditedArticleResult,
  EditorProfile,
  SavedAuditSession,
} from './types/academic';
import { ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';

const STORAGE_KEY_EDITOR = 'retractscan_editor_profile';
const STORAGE_KEY_SESSIONS = 'retractscan_saved_sessions';

export default function App() {
  const [activeTab, setActiveTab] = useState<'journal' | 'single' | 'history'>('journal');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Editor profile state with persistence
  const [editor, setEditor] = useState<EditorProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EDITOR);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      name: 'Dr. Arthur Campbell',
      email: 'a.campbell@lancet-editorial.org',
      journal: 'The Lancet',
      role: 'Senior Integrity Editor',
      orcid: '0000-0002-1825-0097',
      authProvider: 'orcid',
      institution: 'Lancet Editorial Board',
      isLoggedIn: true,
    };
  });

  // Saved audit history sessions
  const [savedSessions, setSavedSessions] = useState<SavedAuditSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [];
  });

  // Journal flow state
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [auditTimeline, setAuditTimeline] = useState<string>('2021-2026');
  const [articles, setArticles] = useState<ReviewArticle[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState<AuditedArticleResult[] | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save profile changes
  const handleSaveProfile = (profile: EditorProfile) => {
    setEditor(profile);
    try {
      localStorage.setItem(STORAGE_KEY_EDITOR, JSON.stringify(profile));
    } catch (e) {
      console.warn('Could not persist editor profile:', e);
    }
    showToast('Editor credentials updated successfully');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Fetch review articles for selected journal
  const handleSelectJournalAndFetch = async (
    journal: Journal,
    yearFrom: number,
    yearTo: number,
    maxArticles: number
  ) => {
    setSelectedJournal(journal);
    setAuditTimeline(`${yearFrom}-${yearTo}`);
    setIsLoadingArticles(true);
    setAuditResults(null);

    try {
      const primaryIssn = journal?.issn?.[0] || '';
      const url = `/api/academic/journal-articles?issn=${encodeURIComponent(
        primaryIssn
      )}&yearFrom=${yearFrom}&yearTo=${yearTo}&maxArticles=${maxArticles}`;

      const res = await fetch(url);
      const data = await res.json().catch(() => ({ articles: [] }));

      const fetchedArticles: ReviewArticle[] = (data?.articles || []).map((a: any, idx: number) => ({
        ...a,
        doi: a?.doi || `article_${idx}_${Date.now()}`,
        title: a?.title || 'Review Article',
        authors: Array.isArray(a?.authors) ? a.authors : [],
        pubDate: a?.pubDate || `${yearFrom}-01-01`,
        studyType: a?.studyType || 'Review Study',
        detectionLayers: Array.isArray(a?.detectionLayers) ? a.detectionLayers : [],
        totalReferences: Number(a?.totalReferences) || 30,
        references: Array.isArray(a?.references) ? a.references : [],
        selected: true,
      }));

      setArticles(fetchedArticles);
      showToast(
        `Discovered ${fetchedArticles.length} review & secondary studies in ${journal.title}`
      );
    } catch (err: any) {
      console.error('Fetch error:', err);
      showToast(err.message || 'Error querying journal articles. Please retry.');
    } finally {
      setIsLoadingArticles(false);
    }
  };

  // Toggle selection of individual article
  const handleToggleSelect = (doi: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.doi === doi ? { ...a, selected: !a.selected } : a))
    );
  };

  // Select all or deselect all
  const handleSelectAll = (select: boolean) => {
    setArticles((prev) => prev.map((a) => ({ ...a, selected: select })));
  };

  // 2. Run citation & retraction audit on selected articles
  const handleRunAudit = async () => {
    const selectedArticles = articles.filter((a) => a.selected);
    if (selectedArticles.length === 0) return;

    setIsAuditing(true);
    try {
      const res = await fetch('/api/academic/audit-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles: selectedArticles }),
      });

      const data = await res.json().catch(() => ({ auditResults: [] }));
      const results: AuditedArticleResult[] = (data?.auditResults || []).map((r: any) => ({
        ...r,
        authors: Array.isArray(r.authors) ? r.authors : [],
        retractedCitations: Array.isArray(r.retractedCitations) ? r.retractedCitations : [],
        detectionLayers: Array.isArray(r.detectionLayers) ? r.detectionLayers : [],
      }));

      setAuditResults(results);

      const flaggedCount = results.reduce(
        (acc: number, item: any) => acc + (item.retractedCount || 0),
        0
      );

      if (flaggedCount > 0) {
        showToast(
          `Audit complete: Flagged ${flaggedCount} retracted citations across ${selectedArticles.length} reviews.`
        );
      } else {
        showToast(`Audit complete: All ${selectedArticles.length} reviews have clean bibliographies.`);
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error executing retraction audit.');
    } finally {
      setIsAuditing(false);
    }
  };

  // Update editorial assessment status or private notes for a cited reference
  const handleUpdateCitationStatus = (
    articleDoi: string,
    citationDoi: string,
    newStatus: string,
    notes: string
  ) => {
    if (!auditResults) return;
    const updated = auditResults.map((article) => {
      if (article.doi !== articleDoi) return article;
      const updatedCitations = (article.retractedCitations || []).map((c) =>
        c.doi === citationDoi ? { ...c, editorialStatus: newStatus, editorNotes: notes } : c
      );
      return { ...article, retractedCitations: updatedCitations };
    });
    setAuditResults(updated);
  };

  // Save current audit results to persistent history
  const handleSaveToHistory = (singleArticle?: AuditedArticleResult) => {
    const resultsToSave = singleArticle ? [singleArticle] : auditResults;
    if (!resultsToSave || resultsToSave.length === 0) return;

    const newSession: SavedAuditSession = {
      id: `audit_${Date.now()}`,
      createdAt: new Date().toISOString(),
      journalName: singleArticle ? singleArticle.title : selectedJournal?.title || 'Academic Journal',
      timeline: auditTimeline,
      auditedArticles: resultsToSave,
    };

    const updatedSessions = [newSession, ...savedSessions];
    setSavedSessions(updatedSessions);
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updatedSessions));
    } catch (e) {
      console.warn('Could not persist sessions:', e);
    }
    showToast('Audit report saved to your history ledger.');
  };

  // Delete saved session
  const handleDeleteSession = (id: string) => {
    const filtered = savedSessions.filter((s) => s.id !== id);
    setSavedSessions(filtered);
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(filtered));
    } catch (e) {
      console.warn('Could not persist sessions:', e);
    }
    showToast('Saved audit removed from history.');
  };

  // Reload saved session into dashboard
  const handleSelectSession = (session: SavedAuditSession) => {
    setSelectedJournal({
      title: session.journalName,
      issn: [],
      publisher: 'Archived Audit',
    });
    setAuditTimeline(session.timeline);
    setAuditResults(session.auditedArticles);
    setActiveTab('journal');
    showToast(`Loaded archived audit for ${session.journalName}`);
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] dark:bg-[#0f1115] text-slate-800 dark:text-slate-200 flex flex-col font-sans transition-colors">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        editor={editor}
        onOpenAuth={() => setIsAuthOpen(true)}
        auditCount={savedSessions.length}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-3 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 border border-slate-700/50 dark:border-slate-300 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* View 1: Journal Batch Audit */}
        {activeTab === 'journal' && (
          <div className="space-y-6">
            {/* Step 1: Journal Search & Filter Section */}
            <JournalSearchSection
              onJournalSelect={handleSelectJournalAndFetch}
              isLoadingArticles={isLoadingArticles}
              selectedJournal={selectedJournal}
            />

            {/* Step 2: Review & Secondary Studies Selection Table */}
            {articles.length > 0 && !auditResults && (
              <ArticleSelectionTable
                articles={articles}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onRunAudit={handleRunAudit}
                isAuditing={isAuditing}
                journalName={selectedJournal?.title || 'Selected Journal'}
              />
            )}

            {/* Step 3: Interactive Visual Retraction Audit Dashboard */}
            {auditResults && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-300/80 dark:border-slate-700">
                      3
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Citation & Retraction Audit Report
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAuditResults(null);
                    }}
                    className="text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer font-medium px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Change Article Selection</span>
                  </button>
                </div>

                <AuditReportDashboard
                  auditResults={auditResults}
                  journalName={selectedJournal?.title || 'Academic Journal'}
                  editor={editor}
                  onUpdateCitationStatus={handleUpdateCitationStatus}
                  onSaveToHistory={() => handleSaveToHistory()}
                />
              </div>
            )}
          </div>
        )}

        {/* View 2: Single Article Resolver (DOI / PubMed) */}
        {activeTab === 'single' && (
          <IndividualArticleScanner
            editor={editor}
            onSaveToHistory={(article) => handleSaveToHistory(article)}
          />
        )}

        {/* View 3: Saved Audit History */}
        {activeTab === 'history' && (
          <AuditHistoryDrawer
            sessions={savedSessions}
            onSelectSession={handleSelectSession}
            onDeleteSession={handleDeleteSession}
          />
        )}
      </main>

      {/* Editor Profile / Sign-in Modal */}
      <EditorAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        editor={editor}
        onSaveProfile={handleSaveProfile}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/70 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">RetractScan</span>
            <span>· Academic Integrity & Retracted Citation Audit</span>
          </div>
          <div>
            <span>Connected to Crossref REST API · OpenAlex · PubMed E-Utilities</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
