import React, { useState, useEffect } from 'react';
import { Navbar, NavTabType } from './components/Navbar';
import { EditorialLoginPage } from './components/EditorialLoginPage';
import { EditorAuthModal } from './components/EditorAuthModal';
import { JournalSearchSection } from './components/JournalSearchSection';
import { ArticleSelectionTable } from './components/ArticleSelectionTable';
import { AuditReportDashboard } from './components/AuditReportDashboard';
import { IndividualArticleScanner } from './components/IndividualArticleScanner';
import { AuditHistoryDrawer } from './components/AuditHistoryDrawer';
import { FullTextAuditView } from './components/FullTextAuditView';
import { HomePage } from './components/HomePage';
import { PreFlightScanner } from './components/PreFlightScanner';
import { UserProfilePage } from './components/UserProfilePage';
import { AcademicAtmosphere } from './components/AcademicAtmosphere';
import { PaperTunnel } from './components/PaperTunnel';
import {
  Journal,
  ReviewArticle,
  AuditedArticleResult,
  EditorProfile,
  SavedAuditSession,
  CitedReference,
} from './types/academic';
import { ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';

const STORAGE_KEY_EDITOR = 'retractscan_editor_profile';
const STORAGE_KEY_SESSIONS = 'retractscan_saved_sessions';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabType>('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [pendingTab, setPendingTab] = useState<NavTabType>('journal');
  const [fullTextQueue, setFullTextQueue] = useState<AuditedArticleResult[]>([]);
  const [fullTextInitialIndex, setFullTextInitialIndex] = useState<number>(0);

  // Dark mode dynamically follows the user's device/OS system setting
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Layered paper cut tunnel background mode - defaults to academic atmosphere
  const [isTunnelBg, setIsTunnelBg] = useState<boolean>(false);

  // Synchronize dark/light mode with user's device/OS preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    // Purge manual overrides so the app always respects the user's device settings
    try {
      localStorage.removeItem('retractscan_theme');
      localStorage.removeItem('retractscan_bg_mode');
    } catch {}

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const syncThemeWithDevice = (matches: boolean) => {
      setIsDarkMode(matches);
      if (matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    // Apply immediate device theme
    syncThemeWithDevice(mediaQuery.matches);

    // Dynamically react whenever user changes OS/device appearance (sunset/sunrise or system settings)
    const handleDeviceThemeChange = (e: MediaQueryListEvent) => {
      syncThemeWithDevice(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleDeviceThemeChange);
      return () => mediaQuery.removeEventListener('change', handleDeviceThemeChange);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handleDeviceThemeChange);
      return () => (mediaQuery as any).removeListener(handleDeviceThemeChange);
    }
  }, []);

  // Editor profile state with persistence
  const [editor, setEditor] = useState<EditorProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EDITOR);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            name: parsed.name || '',
            email: parsed.email || '',
            journal: parsed.journal || '',
            role: parsed.role || 'Integrity Editor',
            authProvider: parsed.authProvider || 'email',
            institution: parsed.institution || '',
            orcid: parsed.orcid || '',
            isLoggedIn: Boolean(parsed.isLoggedIn),
          };
        }
      }
    } catch (e) {
      // ignore
    }
    return {
      name: '',
      email: '',
      journal: '',
      role: 'Integrity Editor',
      authProvider: 'email',
      institution: '',
      isLoggedIn: false,
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

  // Check URL parameters for direct OAuth redirect completion (used by mobile devices without popup opener)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const oauthProvider = searchParams.get('oauth_login_provider');
      if (oauthProvider === 'orcid' || oauthProvider === 'google') {
        const orcid = searchParams.get('orcid') || '';
        const email = searchParams.get('email') || (oauthProvider === 'orcid' ? `orcid-${orcid.replace(/[^0-9]/g, '').slice(-4)}@academic-orcid.org` : '');
        const name = searchParams.get('name') || (oauthProvider === 'orcid' ? 'Dr. Arthur Campbell' : 'Google Verified Editor');

        const newProfile: EditorProfile = {
          name,
          email,
          orcid: orcid || undefined,
          journal: 'The Lancet',
          role: 'Senior Integrity Editor',
          authProvider: oauthProvider,
          institution: oauthProvider === 'orcid' ? 'ORCID Verified Researcher' : 'Google Identity Services',
          isLoggedIn: true,
        };

        setEditor(newProfile);
        localStorage.setItem(STORAGE_KEY_EDITOR, JSON.stringify(newProfile));
        setIsSigningIn(false);
        setActiveTab('journal');
        showToast(`Welcome, ${name}! Signed in via ${oauthProvider.toUpperCase()}.`);

        // Clean query parameters from URL address bar without reloading
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      console.warn('OAuth URL params parse warning:', e);
    }
  }, []);
  const handleTabChange = (tab: NavTabType) => {
    if (tab === 'home') {
      setActiveTab('home');
      setIsSigningIn(false);
      return;
    }

    // Require sign-in to use the audit tools
    if (!editor.isLoggedIn) {
      setPendingTab(tab);
      setIsSigningIn(true);
      return;
    }

    setActiveTab(tab);
    setIsSigningIn(false);
  };

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

  // Sign in and transition to requested tool
  const handleLogin = (profile: EditorProfile) => {
    const updated: EditorProfile = { ...profile, isLoggedIn: true };
    setEditor(updated);
    setIsSigningIn(false);
    setActiveTab(pendingTab || 'journal');
    try {
      localStorage.setItem(STORAGE_KEY_EDITOR, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not persist editor profile:', e);
    }
    showToast(`Welcome, ${updated.name}. Active session for ${updated.journal || 'Academic Journal'}.`);
  };

  // Sign out back to home page
  const handleLogout = () => {
    const loggedOut: EditorProfile = {
      ...editor,
      isLoggedIn: false,
    };
    setEditor(loggedOut);
    setActiveTab('home');
    setIsSigningIn(false);
    try {
      localStorage.setItem(STORAGE_KEY_EDITOR, JSON.stringify(loggedOut));
    } catch (e) {
      console.warn('Could not persist editor profile:', e);
    }
    showToast('Signed out of editorial session.');
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
      )}&title=${encodeURIComponent(journal.title)}&yearFrom=${yearFrom}&yearTo=${yearTo}&maxArticles=${maxArticles}`;

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

  // If currently in the sign-in / registration flow, show the dedicated login portal
  if (isSigningIn) {
    return (
      <div className="relative">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-3 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 border border-slate-700/50 dark:border-slate-300 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}
        <EditorialLoginPage
          onLogin={handleLogin}
          lastEditor={editor}
          onBackToHome={() => setIsSigningIn(false)}
        />
      </div>
    );
  }

  // Launch Full-Text Retraction Impact & AI Verification workspace
  const handleStartFullTextAudit = (selectedArticles: AuditedArticleResult[], initialIndex = 0) => {
    if (!selectedArticles || selectedArticles.length === 0) return;
    setFullTextQueue(selectedArticles);
    setFullTextInitialIndex(initialIndex);
    setActiveTab('fulltext');
    showToast(`Loaded ${selectedArticles.length} review study into Full-Text AI verification workspace.`);
  };

  return (
    <div
      className={`min-h-screen ${
        isTunnelBg
          ? 'bg-transparent text-stone-900 dark:text-stone-100'
          : 'bg-[#FAF9F6] dark:bg-[#121316] text-stone-800 dark:text-stone-200'
      } flex flex-col font-sans transition-colors relative selection:bg-stone-200 dark:selection:bg-stone-800`}
    >
      {/* Background Layer: Either Layered Paper Cut Tunnel Block or Academic Atmosphere */}
      {isTunnelBg ? (
        <PaperTunnel
          asBackground
          className="fixed inset-0 pointer-events-none -z-10"
        />
      ) : (
        <AcademicAtmosphere />
      )}

      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        editor={editor}
        onOpenAuth={() => {
          setPendingTab('journal');
          setIsSigningIn(true);
        }}
        onLogout={handleLogout}
        auditCount={savedSessions.length}
        fullTextCount={fullTextQueue.length}
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

        {/* View 0: Minimalist Home & Capabilities Landing Page (Default Entry Page) */}
        {activeTab === 'home' && (
          <HomePage
            onStartAudit={() => handleTabChange('journal')}
            onSingleArticle={() => handleTabChange('single')}
            onExploreFullText={() => handleTabChange('fulltext')}
            onPreFlight={() => handleTabChange('preflight')}
            auditCount={savedSessions.length}
          />
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
                  onStartFullTextAudit={handleStartFullTextAudit}
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

        {/* View 3: Pre-Submission Pre-Flight Manuscript Scanner */}
        {activeTab === 'preflight' && (
          <PreFlightScanner />
        )}

        {/* View 4: User Profile Page & Personal Editorial Space */}
        {(activeTab === 'profile' || activeTab === 'history') && (
          <UserProfilePage
            editor={editor}
            savedSessions={savedSessions}
            onSelectSession={handleSelectSession}
            onDeleteSession={handleDeleteSession}
            onSaveProfile={handleSaveProfile}
            onLogout={handleLogout}
            onNavigateTab={handleTabChange}
            onOpenEditModal={() => setIsAuthOpen(true)}
          />
        )}

        {/* View 5: Full-Text Retraction Impact & AI Evidence Verification */}
        {activeTab === 'fulltext' && (
          <FullTextAuditView
            selectedArticles={
              fullTextQueue.length > 0
                ? fullTextQueue
                : auditResults && auditResults.length > 0
                ? auditResults.filter((a) => a.hasRetractedCitation)
                : []
            }
            initialActiveIndex={fullTextInitialIndex}
            onBackToAudit={() => setActiveTab('journal')}
            editor={editor}
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
            <img
              src="/assets/aistudio/Document_Search_Orbit_Icon_ea742aca.png"
              alt="RetractScan - Academic Citation Integrity & Retracted Paper Scanner"
              className="w-5 h-5 object-contain rounded-sm"
            />
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
