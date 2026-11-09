import React from 'react';
import { BookOpen, FileText, Bookmark, Sparkles, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';

/**
 * AcademicAtmosphere
 * Renders visible, calming, academic-themed floating background animations:
 * - Subtle scholarly dot-grid / graph-paper texture
 * - Layered manuscript papers with citation badges and fluttering drift
 * - An open academic volume with turning page lines
 * - Drifting research sheets with DOI stamps
 * - Soft ambient light glows in warm stone, sage, and pale indigo
 */
export const AcademicAtmosphere: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* 1. Subtle Academic Graph Paper / Dot-Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.45] dark:opacity-[0.25]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          color: '#cbd5e1',
        }}
      />

      {/* 2. Soft Serene Ambient Lighting Orbs */}
      <div className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-emerald-500/10 dark:bg-emerald-400/8 blur-3xl animate-pulse-soft" />
      <div
        className="absolute top-1/4 -right-28 w-[520px] h-[520px] rounded-full bg-amber-500/8 dark:bg-amber-400/6 blur-3xl animate-pulse-soft"
        style={{ animationDelay: '3.5s' }}
      />
      <div
        className="absolute bottom-12 left-1/3 w-[450px] h-[450px] rounded-full bg-indigo-500/8 dark:bg-indigo-400/6 blur-3xl animate-pulse-soft"
        style={{ animationDelay: '7s' }}
      />

      {/* 3. Floating Element: Layered Manuscript Papers (Top Right Hero Area) */}
      <div
        className="absolute top-20 right-[3%] xl:right-[6%] animate-float-gentle opacity-85 hover:opacity-100 transition-opacity"
        style={{ animationDuration: '11s' }}
      >
        <div className="relative">
          {/* Back Paper Sheet (Tilted) */}
          <div className="absolute -inset-1 rounded-xl bg-stone-200/70 dark:bg-stone-800/60 border border-stone-300/80 dark:border-stone-700/80 rotate-6 shadow-xs w-44 h-56" />

          {/* Front Main Manuscript Sheet */}
          <div className="relative w-44 h-56 rounded-xl bg-white/95 dark:bg-stone-900/90 backdrop-blur-sm p-3.5 border border-stone-300/90 dark:border-stone-700 shadow-md -rotate-2 space-y-2">
            {/* Paper Header / Journal Stamp */}
            <div className="flex items-center justify-between pb-1.5 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Manuscript
                </span>
              </div>
              <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 font-semibold">
                AUDITED
              </span>
            </div>

            {/* Title Line */}
            <div className="w-4/5 h-2 rounded bg-stone-800/40 dark:bg-stone-200/40" />

            {/* Paragraph lines simulating academic abstract */}
            <div className="space-y-1.5 pt-0.5">
              <div className="w-full h-1 rounded bg-stone-300 dark:bg-stone-700" />
              <div className="w-11/12 h-1 rounded bg-stone-300 dark:bg-stone-700" />
              <div className="w-4/5 h-1 rounded bg-stone-300 dark:bg-stone-700" />
              <div className="w-full h-1 rounded bg-stone-300 dark:bg-stone-700" />
              <div className="w-3/4 h-1 rounded bg-stone-300 dark:bg-stone-700" />
            </div>

            {/* Reference Citation Box with Green Check */}
            <div className="mt-2.5 p-1.5 rounded-md bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="w-16 h-1 rounded bg-stone-400 dark:bg-stone-500" />
                <div className="w-10 h-0.5 rounded bg-stone-300 dark:bg-stone-600" />
              </div>
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Floating Element: Open Academic Book (Left Upper Side) */}
      <div
        className="absolute top-72 left-[2%] xl:left-[4%] hidden md:block animate-float-reverse opacity-80"
        style={{ animationDuration: '14s' }}
      >
        <div className="relative">
          {/* Subtle Shadow Aura */}
          <div className="absolute inset-0 bg-stone-400/20 blur-md rounded-xl" />

          {/* Book Spine and Dual Pages */}
          <div className="relative flex items-center rotate-3">
            {/* Left Page */}
            <div className="w-36 h-48 rounded-l-xl bg-white/95 dark:bg-stone-900/90 backdrop-blur-sm p-3 border-y border-l border-stone-300 dark:border-stone-700 shadow-sm space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-stone-200 dark:border-stone-800">
                <span className="text-[8.5px] font-bold font-serif text-stone-700 dark:text-stone-300">
                  Vol. 396
                </span>
                <span className="text-[7.5px] text-stone-400">p. 1024</span>
              </div>
              <div className="space-y-1">
                <div className="w-full h-1 rounded bg-stone-300 dark:bg-stone-700" />
                <div className="w-5/6 h-1 rounded bg-stone-300 dark:bg-stone-700" />
                <div className="w-full h-1 rounded bg-stone-300 dark:bg-stone-700" />
                <div className="w-4/5 h-1 rounded bg-stone-300 dark:bg-stone-700" />
                <div className="w-11/12 h-1 rounded bg-stone-300 dark:bg-stone-700" />
              </div>
              {/* Forest plot thumbnail bar */}
              <div className="mt-3 p-1 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60 flex items-center justify-center gap-1">
                <div className="w-1 h-3 bg-stone-400" />
                <div className="w-8 h-0.5 bg-emerald-600" />
                <div className="w-1.5 h-1.5 bg-emerald-700 rounded-xs" />
              </div>
            </div>

            {/* Book Spine Center Line with Bookmark Ribbon */}
            <div className="w-2 h-48 bg-stone-300 dark:bg-stone-700 relative shadow-inner">
              <div className="absolute -bottom-3 left-0.5 w-1 h-5 bg-rose-600 rounded-b-xs shadow-xs" />
            </div>

            {/* Right Page */}
            <div className="w-36 h-48 rounded-r-xl bg-white/95 dark:bg-stone-900/90 backdrop-blur-sm p-3 border-y border-r border-stone-300 dark:border-stone-700 shadow-sm space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-stone-200 dark:border-stone-800">
                <span className="text-[8.5px] font-serif text-stone-600 dark:text-stone-400">
                  Systematic Review
                </span>
                <span className="text-[7.5px] text-stone-400">p. 1025</span>
              </div>
              <div className="space-y-1">
                <div className="w-full h-1 rounded bg-stone-300 dark:bg-stone-700" />
                <div className="w-4/5 h-1 rounded bg-stone-300 dark:bg-stone-700" />
                <div className="w-11/12 h-1 rounded bg-stone-300 dark:bg-stone-700" />
                <div className="w-3/4 h-1 rounded bg-stone-300 dark:bg-stone-700" />
              </div>
              {/* Footnote / References list */}
              <div className="mt-3 pt-1 border-t border-stone-200/80 dark:border-stone-800 space-y-1">
                <div className="w-full h-0.5 rounded bg-emerald-600/40" />
                <div className="w-4/5 h-0.5 rounded bg-stone-300 dark:bg-stone-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Floating Element: Drifting Research Article Sheet (Lower Right) */}
      <div
        className="absolute bottom-28 right-[4%] xl:right-[7%] animate-float-drift opacity-80 hidden lg:block"
        style={{ animationDuration: '16s' }}
      >
        <div className="w-40 h-52 rounded-xl bg-white/95 dark:bg-stone-900/90 backdrop-blur-sm p-3 border border-stone-300/90 dark:border-stone-700 shadow-md rotate-3 space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-stone-200 dark:border-stone-800">
            <span className="text-[8px] font-mono text-stone-500">doi:10.1016/j...</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="w-3/4 h-2 rounded bg-stone-800/40 dark:bg-stone-200/40" />
          <div className="space-y-1">
            <div className="w-full h-1 rounded bg-stone-300 dark:bg-stone-700" />
            <div className="w-5/6 h-1 rounded bg-stone-300 dark:bg-stone-700" />
            <div className="w-4/5 h-1 rounded bg-stone-300 dark:bg-stone-700" />
            <div className="w-full h-1 rounded bg-stone-300 dark:bg-stone-700" />
          </div>
          {/* Citation badge */}
          <div className="mt-3 p-1 rounded bg-stone-100 dark:bg-stone-800 text-[8.5px] font-mono text-stone-600 dark:text-stone-300 flex items-center gap-1">
            <Bookmark className="w-2.5 h-2.5 text-stone-400" />
            <span>Crossref 2024</span>
          </div>
        </div>
      </div>

      {/* 6. Subtle Floating Academic Book Icon Accent (Mid Right) */}
      <div
        className="absolute top-[55%] right-[2%] animate-float-gentle opacity-40 hidden xl:block"
        style={{ animationDuration: '9s' }}
      >
        <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-stone-300/70 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 shadow-xs">
          <BookOpen className="w-6 h-6 text-stone-500 dark:text-stone-400" />
        </div>
      </div>
    </div>
  );
};
