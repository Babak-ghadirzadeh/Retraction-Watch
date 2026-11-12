import React from 'react';
import { ShieldCheck, UserCheck, LogIn, History, LogOut, Home, FileText, Sparkles } from 'lucide-react';
import { EditorProfile } from '../types/academic';

export type NavTabType = 'home' | 'journal' | 'single' | 'history' | 'fulltext' | 'preflight' | 'profile';

interface NavbarProps {
  activeTab: NavTabType;
  onTabChange: (tab: NavTabType) => void;
  editor: EditorProfile;
  onOpenAuth: () => void;
  onLogout?: () => void;
  auditCount: number;
  fullTextCount?: number;
  isTunnelBg?: boolean;
  onToggleTunnelBg?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  editor,
  onOpenAuth,
  auditCount,
  fullTextCount = 0,
  onLogout,
  isTunnelBg = false,
  onToggleTunnelBg,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 dark:bg-[#121316]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Navigation links */}
        <nav className="flex items-center gap-2 sm:gap-4 text-xs font-medium text-stone-600 dark:text-stone-400 overflow-x-auto py-1">
          <button
            onClick={() => onTabChange('home')}
            className={`whitespace-nowrap transition-all duration-200 py-1 cursor-pointer border-b-2 flex items-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'home'
                ? 'text-stone-900 dark:text-white border-stone-900 dark:border-stone-100 font-semibold'
                : 'border-transparent hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onTabChange('journal')}
            className={`whitespace-nowrap transition-all duration-200 py-1 cursor-pointer border-b-2 hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'journal'
                ? 'text-stone-900 dark:text-white border-stone-900 dark:border-stone-100 font-semibold'
                : 'border-transparent hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Journal Audit
          </button>

          <button
            onClick={() => onTabChange('single')}
            className={`whitespace-nowrap transition-all duration-200 py-1 cursor-pointer border-b-2 hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'single'
                ? 'text-stone-900 dark:text-white border-stone-900 dark:border-stone-100 font-semibold'
                : 'border-transparent hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Single DOI
          </button>

          <button
            onClick={() => onTabChange('preflight')}
            className={`whitespace-nowrap transition-all duration-200 py-1 cursor-pointer border-b-2 flex items-center gap-1 hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'preflight'
                ? 'text-emerald-800 dark:text-emerald-300 border-emerald-600 dark:border-emerald-400 font-semibold'
                : 'border-transparent hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <span>Pre-Flight</span>
          </button>

          {(fullTextCount > 0 || activeTab === 'fulltext') && (
            <button
              onClick={() => onTabChange('fulltext')}
              className={`whitespace-nowrap transition-all duration-200 py-1 cursor-pointer border-b-2 flex items-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0 ${
                activeTab === 'fulltext'
                  ? 'text-amber-800 dark:text-amber-300 border-amber-600 dark:border-amber-400 font-semibold'
                  : 'text-amber-700 dark:text-amber-400 border-transparent hover:text-amber-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Text AI</span>
              {fullTextCount > 0 && (
                <span className="text-[10px] font-mono bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.2 rounded-full border border-amber-300 dark:border-amber-800">
                  {fullTextCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => onTabChange('history')}
            className={`whitespace-nowrap transition-all duration-200 py-1 cursor-pointer border-b-2 flex items-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0 ${
              activeTab === 'history'
                ? 'text-stone-900 dark:text-white border-stone-900 dark:border-stone-100 font-semibold'
                : 'border-transparent hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Saved</span>
            {auditCount > 0 && (
              <span className="text-[10px] font-mono bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-1.5 py-0.2 rounded-full">
                {auditCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Actions (Editor Profile / Login) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {editor.isLoggedIn ? (
            <>
              <button
                onClick={() => onTabChange('profile')}
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 whitespace-nowrap cursor-pointer shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 ${
                  activeTab === 'profile'
                    ? 'border-stone-900 bg-stone-100 dark:border-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                }`}
                title="View your personal editorial profile, history of checks & reports"
              >
                {editor.authProvider === 'orcid' ? (
                  <span className="w-5 h-5 rounded-full bg-[#A6CE39] text-white flex items-center justify-center font-bold text-[9px] shrink-0">
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
                  <div className="w-5 h-5 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    {editor.name?.charAt(0) || 'E'}
                  </div>
                )}
                <div className="text-left hidden sm:block leading-tight">
                  <span className="font-semibold block truncate max-w-[130px]">{editor.name}</span>
                  <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">
                    {editor.role || editor.journal || 'Editor'}
                  </span>
                </div>
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                  title="Sign out & return to login landing page"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              )}
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer group"
            >
              <LogIn className="w-4 h-4 group-hover:rotate-6 transition-transform" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
