import React from 'react';
import { ShieldCheck, UserCheck, LogIn, History } from 'lucide-react';
import { EditorProfile } from '../types/academic';

interface NavbarProps {
  activeTab: 'journal' | 'single' | 'history';
  onTabChange: (tab: 'journal' | 'single' | 'history') => void;
  editor: EditorProfile;
  onOpenAuth: () => void;
  auditCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  editor,
  onOpenAuth,
  auditCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#fafaf8]/95 dark:bg-[#0f1115]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single line) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-4.5 h-4.5 text-slate-100" />
          </div>
          <button
            onClick={() => onTabChange('journal')}
            className="text-left cursor-pointer focus:outline-none"
          >
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block">
              RetractScan
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block whitespace-nowrap font-medium -mt-0.5">
              Journal Editorial Citation Audit
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation links (single line, 1-2 words) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          <button
            onClick={() => onTabChange('journal')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer border-b-2 ${
              activeTab === 'journal'
                ? 'text-slate-900 dark:text-white border-slate-900 dark:border-slate-100'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Journal Audit
          </button>
          <button
            onClick={() => onTabChange('single')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer border-b-2 ${
              activeTab === 'single'
                ? 'text-slate-900 dark:text-white border-slate-900 dark:border-slate-100'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Single Article
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'text-slate-900 dark:text-white border-slate-900 dark:border-slate-100'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Saved Audits</span>
            {auditCount > 0 && (
              <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded-full">
                {auditCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Editor Account / Profile) */}
        <div className="flex items-center gap-3 shrink-0">
          {editor.isLoggedIn ? (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
              title="Manage editorial profile & credentials"
            >
              {editor.authProvider === 'orcid' ? (
                <span className="w-5 h-5 rounded-full bg-[#A6CE39] text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-xs">
                  iD
                </span>
              ) : editor.authProvider === 'google' ? (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              ) : (
                <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
              <div className="text-left hidden sm:block leading-tight">
                <span className="font-semibold block truncate max-w-[140px]">{editor.name}</span>
                <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">
                  {editor.orcid ? `ORCID: ${editor.orcid.slice(0, 9)}...` : editor.role}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In (ORCID / Google / Email)</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
