import React, { useState, useMemo } from 'react';
import {
  User,
  ShieldCheck,
  AlertTriangle,
  History,
  FileText,
  Download,
  Calendar,
  ExternalLink,
  Trash2,
  ArrowUpRight,
  Edit3,
  CheckCircle2,
  LogOut,
  Search,
  BookOpen,
  Sparkles,
  FileCheck,
  Building,
  Mail,
  Award,
  Filter,
  Check,
  Copy,
  Clock,
  Layers,
} from 'lucide-react';
import { EditorProfile, SavedAuditSession } from '../types/academic';
import { NavTabType } from './Navbar';

interface UserProfilePageProps {
  editor: EditorProfile;
  savedSessions: SavedAuditSession[];
  onSelectSession: (session: SavedAuditSession) => void;
  onDeleteSession: (id: string) => void;
  onSaveProfile: (profile: EditorProfile) => void;
  onLogout?: () => void;
  onNavigateTab: (tab: NavTabType) => void;
  onOpenEditModal?: () => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  editor,
  savedSessions,
  onSelectSession,
  onDeleteSession,
  onSaveProfile,
  onLogout,
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'history' | 'exports' | 'settings'>('history');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'flagged' | 'clean'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSessionForModal, setSelectedSessionForModal] = useState<SavedAuditSession | null>(null);

  // Profile Edit form states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(editor.name || '');
  const [editJournal, setEditJournal] = useState(editor.journal || 'The Lancet');
  const [editRole, setEditRole] = useState(editor.role || 'Senior Integrity Editor');
  const [editInstitution, setEditInstitution] = useState(editor.institution || '');
  const [editOrcid, setEditOrcid] = useState(editor.orcid || '');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Compute aggregate user statistics
  const stats = useMemo(() => {
    let totalStudies = 0;
    let totalRetractedCount = 0;
    let cleanStudiesCount = 0;
    let flaggedStudiesCount = 0;

    savedSessions.forEach((session) => {
      const articles = session.auditedArticles || [];
      totalStudies += articles.length;
      articles.forEach((a) => {
        const retractions = a.retractedCount || (a.retractedCitations?.length || 0);
        totalRetractedCount += retractions;
        if (a.hasRetractedCitation || retractions > 0) {
          flaggedStudiesCount++;
        } else {
          cleanStudiesCount++;
        }
      });
    });

    const totalSessions = savedSessions.length;
    const cleanRate = totalStudies > 0 ? Math.round((cleanStudiesCount / totalStudies) * 100) : 100;

    return {
      totalSessions,
      totalStudies,
      totalRetractedCount,
      cleanStudiesCount,
      flaggedStudiesCount,
      cleanRate,
    };
  }, [savedSessions]);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    return savedSessions.filter((session) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        session.journalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.auditedArticles.some((a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.doi.toLowerCase().includes(searchQuery.toLowerCase())
        );

      if (!matchesSearch) return false;

      const hasFlagged = session.auditedArticles.some((a) => a.hasRetractedCitation || a.retractedCount > 0);
      if (filterType === 'flagged') return hasFlagged;
      if (filterType === 'clean') return !hasFlagged;
      return true;
    });
  }, [savedSessions, searchQuery, filterType]);

  const handleSaveProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: EditorProfile = {
      ...editor,
      name: editName.trim() || editor.name,
      journal: editJournal.trim() || editor.journal,
      role: editRole.trim() || editor.role,
      institution: editInstitution.trim(),
      orcid: editOrcid.trim() || undefined,
    };
    onSaveProfile(updated);
    setIsEditing(false);
    setSaveStatus('Profile updated successfully');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Export full audit ledger as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedSessions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `RetractScan_Audit_History_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CSV of all audited articles across all sessions
  const handleExportCSV = () => {
    const rows: string[] = [
      'Session ID,Audit Date,Journal Name,Article DOI,Article Title,Has Retracted Citation,Retracted Count,Total References,Citations Detail',
    ];

    savedSessions.forEach((session) => {
      session.auditedArticles.forEach((art) => {
        const citationsStr = (art.retractedCitations || [])
          .map((c) => `${c.title || c.doi} (${c.retractionReason || 'Retracted'})`)
          .join('; ')
          .replace(/"/g, '""');

        rows.push(
          `"${session.id}","${session.createdAt}","${session.journalName.replace(/"/g, '""')}","${art.doi}","${art.title.replace(/"/g, '""')}","${art.hasRetractedCitation ? 'YES' : 'NO'}","${art.retractedCount || 0}","${art.totalReferences || 0}","${citationsStr}"`
        );
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.join('\n'));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `RetractScan_All_Audits_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Personal Header & Identity Hero Card */}
      <section className="rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/5 via-stone-400/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            {/* User Avatar with Provider Badge */}
            <div className="relative shrink-0">
              {editor.authProvider === 'orcid' ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#A6CE39]/15 border-2 border-[#A6CE39] text-[#A6CE39] flex items-center justify-center font-bold text-2xl shadow-sm">
                  iD
                </div>
              ) : editor.authProvider === 'google' ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 flex items-center justify-center shadow-sm">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center font-bold text-2xl shadow-sm">
                  {editor.name ? editor.name.charAt(0).toUpperCase() : 'E'}
                </div>
              )}

              <span
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-stone-900 shadow-xs"
                title="Verified Active Editorial Account"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Name & Details */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  {editor.name || 'Editorial Member'}
                </h1>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Verified Editor
                </span>
                {editor.authProvider && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                    {editor.authProvider}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 dark:text-stone-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                  <span>{editor.journal || 'Academic Journal'}</span>
                </span>
                <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-stone-400" />
                  <span>{editor.role || 'Integrity Reviewer'}</span>
                </span>
                {editor.institution && (
                  <>
                    <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
                    <span className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-stone-400" />
                      <span>{editor.institution}</span>
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 font-mono pt-0.5">
                {editor.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-stone-400" />
                    <span>{editor.email}</span>
                  </span>
                )}

                {editor.orcid && (
                  <a
                    href={`https://orcid.org/${editor.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#789d20] dark:text-[#a6ce39] hover:underline"
                    title="View verified ORCID public record"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-[#A6CE39] text-white flex items-center justify-center font-bold text-[7px]">
                      iD
                    </span>
                    <span>{editor.orcid}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:self-center">
            <button
              type="button"
              onClick={() => {
                setIsEditing(!isEditing);
                setEditName(editor.name || '');
                setEditJournal(editor.journal || 'The Lancet');
                setEditRole(editor.role || 'Senior Integrity Editor');
                setEditInstitution(editor.institution || '');
                setEditOrcid(editor.orcid || '');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-750 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer shadow-2xs"
                title="Sign out of editorial session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* In-place Profile Editor Form (Toggleable) */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfileSubmit}
            className="mt-6 pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Update Editorial Affiliations & Credentials
              </h3>
              {saveStatus && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {saveStatus}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Full Name & Title
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Dr. Arthur Campbell, MD"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Primary Journal
                </label>
                <input
                  type="text"
                  value={editJournal}
                  onChange={(e) => setEditJournal(e.target.value)}
                  placeholder="e.g. The Lancet"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Editorial Role
                </label>
                <input
                  type="text"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  placeholder="e.g. Senior Integrity Editor"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Institution / Affiliation
                </label>
                <input
                  type="text"
                  value={editInstitution}
                  onChange={(e) => setEditInstitution(e.target.value)}
                  placeholder="e.g. Karolinska Institute / Umeå University"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Verified ORCID iD
                </label>
                <input
                  type="text"
                  value={editOrcid}
                  onChange={(e) => setEditOrcid(e.target.value)}
                  placeholder="0000-0002-1825-0097"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-white transition-colors cursor-pointer shadow-xs"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          </form>
        )}
      </section>

      {/* 2. Personal Integrity Stats Overview */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 shadow-xs space-y-1.5 hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-medium">Saved Audit Sessions</span>
            <History className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-mono">
            {stats.totalSessions}
          </div>
          <p className="text-[11px] text-stone-500">Archived in personal ledger</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 shadow-xs space-y-1.5 hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-medium">Total Studies Audited</span>
            <FileCheck className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 font-mono">
            {stats.totalStudies}
          </div>
          <p className="text-[11px] text-stone-500">Crossref & PubMed verified</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20 shadow-xs space-y-1.5 hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-400 text-xs">
            <span className="font-medium">Retractions Flagged</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
            {stats.totalRetractedCount}
          </div>
          <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80">
            Across {stats.flaggedStudiesCount} contaminated papers
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs space-y-1.5 hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 text-xs">
            <span className="font-medium">Clean Bibliography Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {stats.cleanRate}%
          </div>
          <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
            {stats.cleanStudiesCount} verified clean studies
          </p>
        </div>
      </section>

      {/* 3. Main Personal Space Tabs */}
      <section className="space-y-4">
        {/* Navigation Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('history')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'history'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit & Check History ({savedSessions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('exports')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'exports'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exports & Certificates Vault</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('settings')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'settings'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Affiliation & Preferences</span>
            </button>
          </div>

          {/* Quick launch tools */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-stone-500 font-medium hidden md:inline">Quick Jump:</span>
            <button
              type="button"
              onClick={() => onNavigateTab('journal')}
              className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 font-medium text-[11px] cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-transform"
            >
              + Journal Audit
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('single')}
              className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 font-medium text-[11px] cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-transform"
            >
              + Single DOI
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('preflight')}
              className="px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-medium text-[11px] cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-transform"
            >
              + Pre-Flight Scanner
            </button>
          </div>
        </div>

        {/* Tab 1: Audit History & Checks */}
        {activeSubTab === 'history' && (
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            {savedSessions.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-2xs">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by journal, title, or DOI in your history..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/70 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs">
                  <span className="text-stone-500 text-[11px] font-medium mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Filter:
                  </span>
                  <button
                    type="button"
                    onClick={() => setFilterType('all')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] font-medium ${
                      filterType === 'all'
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    All ({savedSessions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('flagged')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] font-medium ${
                      filterType === 'flagged'
                        ? 'bg-rose-600 text-white'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                    }`}
                  >
                    Flagged Retractions
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('clean')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-[11px] font-medium ${
                      filterType === 'clean'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    Clean Bibliographies
                  </button>
                </div>
              </div>
            )}

            {/* List of Saved Sessions */}
            {savedSessions.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                  <History className="w-7 h-7" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    No Saved Checks in Personal Ledger
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Whenever you perform a Journal Audit, inspect a Single DOI, or run a Pre-Flight scan, click <strong>"Save to History"</strong> in the audit dashboard to archive your editorial verification ledger here.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigateTab('journal')}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-semibold shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    Run First Journal Audit
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('single')}
                    className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    Verify Single DOI
                  </button>
                </div>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-stone-500 text-xs">
                No archived audit matches your search or filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSessions.map((session) => {
                  const totalArticles = session.auditedArticles.length;
                  const flaggedArticles = session.auditedArticles.filter((a) => a.hasRetractedCitation);
                  const totalRetractions = session.auditedArticles.reduce((acc, a) => acc + (a.retractedCount || 0), 0);
                  const dateStr = new Date(session.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <div
                      key={session.id}
                      className="p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 shadow-xs hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-200 flex flex-col justify-between space-y-4 hover:shadow-md"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono text-stone-400 block">
                              AUDIT #{session.id.slice(-6)}
                            </span>
                            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                              {session.journalName}
                            </h3>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedSessionForModal(session)}
                              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                              title="View details & summary certificate"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteSession(session.id)}
                              className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                              title="Delete from personal ledger"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            <span>{dateStr}</span>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>{session.timeline}</span>
                          </span>
                        </div>

                        {/* Metric Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono pt-1">
                          <span className="px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                            {totalArticles} {totalArticles === 1 ? 'study' : 'studies'}
                          </span>

                          {totalRetractions > 0 ? (
                            <span className="px-2.5 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 flex items-center gap-1 font-semibold">
                              <AlertTriangle className="w-3 h-3 text-rose-500" />
                              <span>{totalRetractions} retracted citations</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1 font-semibold">
                              <ShieldCheck className="w-3 h-3 text-emerald-500" />
                              <span>Clean bibliography</span>
                            </span>
                          )}
                        </div>

                        {/* Sample preview if flagged */}
                        {flaggedArticles.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 text-stone-600 dark:text-stone-300 text-[11px] space-y-1">
                            <span className="font-semibold text-stone-700 dark:text-stone-200 block text-[10.5px]">
                              Contaminated Paper Highlight:
                            </span>
                            <p className="line-clamp-1 italic">
                              "{flaggedArticles[0]?.title}"
                            </p>
                            <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 block">
                              doi:{flaggedArticles[0]?.doi}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Bottom actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
                        <button
                          type="button"
                          onClick={() => {
                            const markdown = `# RetractScan Editorial Audit Certificate\n**Journal:** ${session.journalName}\n**Date:** ${session.createdAt}\n**Timeline:** ${session.timeline}\n**Total Studies:** ${totalArticles}\n**Retracted Citations:** ${totalRetractions}\n\n*Verified under COPE / Crossref & PubMed Retraction Index.*`;
                            copyToClipboard(markdown, session.id);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
                        >
                          {copiedId === session.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-semibold">Copied Certificate!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Summary</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => onSelectSession(session)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-semibold shadow-2xs hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
                        >
                          <span>Open in Dashboard</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Exports & Certificates Vault */}
        {activeSubTab === 'exports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Batch Data Exports */}
              <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4">
                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    Bulk Ledger Export
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed mt-1">
                    Export your entire personal history of citation checks, audit findings, flagged DOIs, and metadata into open formats for publisher archival or research integrity reports.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    disabled={savedSessions.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-semibold shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download CSV Ledger</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    disabled={savedSessions.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>Download JSON Archive</span>
                  </button>
                </div>
              </div>

              {/* Card 2: COPE Corrigendum / Publisher Certificate Template */}
              <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    COPE Corrigendum & Publisher Notice
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed mt-1">
                    Standardized editorial notice format compliant with Committee on Publication Ethics (COPE) retraction guidelines for authors and journal production departments.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const template = `=== RETRACTSCAN EDITORIAL INTEGRITY NOTICE ===\nJournal: ${editor.journal || 'Academic Journal'}\nEditor-in-Charge: ${editor.name} (${editor.role})\nAffiliation: ${editor.institution || 'Editorial Consortium'}\nDate: ${new Date().toISOString().split('T')[0]}\n\nSUBJECT: Citation Integrity Audit & Erratum / Corrigendum Request\n\nFollowing systematic citation screening using RetractScan cross-referencing Crossref and PubMed retraction indices, the following secondary study was identified as citing post-publication retracted literature:\n\n[ARTICLE TITLE / DOI]\nCited Retracted Reference(s):\n- [RETRACTED PAPER DOI]: Retracted due to [DATA FABRICATION / UNRELIABLE FINDINGS]\n\nRECOMMENDED EDITORIAL ACTION:\n1. Publish an official Corrigendum notifying readers of retracted citations.\n2. Re-calculate meta-analytical effect sizes if primary retracted dataset was pooled.\n3. Deposit notice to Crossref DOI metadata.\n\nSign-off: ${editor.name}\nORCID: ${editor.orcid || 'N/A'}`;
                      copyToClipboard(template, 'corrigendum_template');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    {copiedId === 'corrigendum_template' ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-600">Copied Template to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Publisher Notice Template</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Affiliation & Preferences */}
        {activeSubTab === 'settings' && (
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Editorial Affiliation & Identity Settings
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage your credentials printed on exported retraction certificates and audit reports.
              </p>
            </div>

            <form onSubmit={handleSaveProfileSubmit} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Editorial Member Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Academic Journal
                  </label>
                  <input
                    type="text"
                    value={editJournal}
                    onChange={(e) => setEditJournal(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Role / Position
                  </label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Institutional Affiliation
                  </label>
                  <input
                    type="text"
                    value={editInstitution}
                    onChange={(e) => setEditInstitution(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    ORCID iD
                  </label>
                  <input
                    type="text"
                    value={editOrcid}
                    onChange={(e) => setEditOrcid(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800 text-stone-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                <span className="text-xs text-emerald-600 font-semibold">
                  {saveStatus}
                </span>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-semibold shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </section>

      {/* Session Details Modal */}
      {selectedSessionForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-[10px] font-mono text-stone-400 uppercase">
                  Archived Audit Report
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  {selectedSessionForModal.journalName}
                </h3>
                <p className="text-xs text-stone-500">
                  Created on {new Date(selectedSessionForModal.createdAt).toLocaleString()} · Timeline: {selectedSessionForModal.timeline}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSessionForModal(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs font-semibold px-2 py-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Audited Articles ({selectedSessionForModal.auditedArticles.length})
              </h4>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {selectedSessionForModal.auditedArticles.map((art, idx) => (
                  <div
                    key={art.doi || idx}
                    className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 text-xs space-y-1"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                        {art.title}
                      </span>
                      {art.hasRetractedCitation ? (
                        <span className="shrink-0 text-[10px] px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold border border-rose-200">
                          {art.retractedCount} RETRACTED
                        </span>
                      ) : (
                        <span className="shrink-0 text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200">
                          CLEAN
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 block">
                      DOI: {art.doi}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => {
                  onDeleteSession(selectedSessionForModal.id);
                  setSelectedSessionForModal(null);
                }}
                className="text-xs text-rose-600 hover:underline cursor-pointer"
              >
                Delete this audit record
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectSession(selectedSessionForModal);
                  setSelectedSessionForModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-semibold shadow-xs cursor-pointer"
              >
                Open in Full Audit Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
