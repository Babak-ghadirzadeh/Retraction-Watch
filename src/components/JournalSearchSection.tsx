import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Calendar, Check, BookOpen, Layers, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { Journal } from '../types/academic';

interface JournalSearchSectionProps {
  onJournalSelect: (journal: Journal, yearFrom: number, yearTo: number, maxArticles: number) => void;
  isLoadingArticles: boolean;
  selectedJournal: Journal | null;
}

export const JournalSearchSection: React.FC<JournalSearchSectionProps> = ({
  onJournalSelect,
  isLoadingArticles,
  selectedJournal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [journals, setJournals] = useState<Journal[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeJournal, setActiveJournal] = useState<Journal | null>(selectedJournal);

  // Timeline and max articles controls
  const [timelinePreset, setTimelinePreset] = useState<'2026' | '2025-2026' | '2024-2026' | '2021-2026' | 'custom'>('2021-2026');
  const [customYearFrom, setCustomYearFrom] = useState(2021);
  const [customYearTo, setCustomYearTo] = useState(2026);
  const [maxArticles, setMaxArticles] = useState(20);

  // Fetch initial curated journals
  useEffect(() => {
    fetchJournals('');
  }, []);

  useEffect(() => {
    if (selectedJournal) {
      setActiveJournal(selectedJournal);
    }
  }, [selectedJournal]);

  const fetchJournals = async (q: string) => {
    setIsSearching(true);
    try {
      const res = await fetch(`/api/academic/journals?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setJournals(data.journals || []);
        if (!activeJournal && data.journals?.length > 0) {
          setActiveJournal(data.journals[0]);
        }
      }
    } catch (err) {
      console.error('Failed to search journals:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJournals(searchQuery);
  };

  const getYearRange = () => {
    switch (timelinePreset) {
      case '2026':
        return { from: 2026, to: 2026 };
      case '2025-2026':
        return { from: 2025, to: 2026 };
      case '2024-2026':
        return { from: 2024, to: 2026 };
      case '2021-2026':
        return { from: 2021, to: 2026 };
      case 'custom':
        return { from: customYearFrom, to: customYearTo };
    }
  };

  const handleTriggerAudit = () => {
    if (!activeJournal) return;
    const { from, to } = getYearRange();
    onJournalSelect(activeJournal, from, to, maxArticles);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs mb-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-300/80 dark:border-slate-700">
            1
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Select Journal & Audit Parameters
          </h2>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search journal name (e.g. The Lancet, BMJ, JAMA, Cochrane) or ISSN..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 focus:outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 disabled:opacity-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Search Results / Curated Journal List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Discovered Journals ({journals.length})
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Verified via Crossref & OpenAlex
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
            {journals.map((j, idx) => {
              const isSelected = activeJournal?.title === j.title;
              const issnArr = Array.isArray(j.issn) ? j.issn : [];
              return (
                <div
                  key={`${j.title || 'j'}-${issnArr.join('-')}-${idx}`}
                  onClick={() => setActiveJournal(j)}
                  className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-900 dark:border-slate-300 bg-slate-50 dark:bg-slate-800/80 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {j.title}
                      </h3>
                      {isSelected ? (
                        <span className="shrink-0 w-4 h-4 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : null}
                    </div>

                    {/* Metadata line with ISSNs & Publisher */}
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-1.5 mb-2">
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        ISSN: {issnArr.length > 0 ? issnArr.join(', ') : 'Online'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{j.publisher || 'Academic Publisher'}</span>
                    </div>
                  </div>

                  {/* Direct link to official journal page */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    {j.homepage ? (
                      <a
                        href={j.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-slate-700 dark:text-slate-300 hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        <span>Official Journal Page</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400">Indexed Publication</span>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveJournal(j)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded transition-colors ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Journal & Filter Parameters Banner */}
        {activeJournal && (
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-700/80">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                  Target Journal for Audit
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{activeJournal.title}</span>
                  {activeJournal.homepage && (
                    <a
                      href={activeJournal.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                      title="Open external journal link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  ISSN: {Array.isArray(activeJournal.issn) && activeJournal.issn.length > 0 ? activeJournal.issn.join(' / ') : 'Online'} · {activeJournal.publisher || 'Academic Publisher'}
                </p>
              </div>
            </div>

            {/* Timeline & Max Count Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Timeline selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Publication Timeline</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(['2026', '2025-2026', '2024-2026', '2021-2026', 'custom'] as const).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTimelinePreset(preset)}
                      className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                        timelinePreset === preset
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {preset === '2026' ? '2026 (Current)' : preset === 'custom' ? 'Custom Range' : preset}
                    </button>
                  ))}
                </div>

                {timelinePreset === 'custom' && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="number"
                      min={1990}
                      max={2026}
                      value={customYearFrom}
                      onChange={(e) => setCustomYearFrom(parseInt(e.target.value, 10))}
                      className="w-24 px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                    />
                    <span className="text-xs text-slate-400">to</span>
                    <input
                      type="number"
                      min={1990}
                      max={2026}
                      value={customYearTo}
                      onChange={(e) => setCustomYearTo(parseInt(e.target.value, 10))}
                      className="w-24 px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                    />
                  </div>
                )}
              </div>

              {/* Max articles to retrieve */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  <span>Maximum Articles to Scan</span>
                </label>
                <div className="flex items-center gap-2">
                  {[10, 20, 30, 50].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setMaxArticles(count)}
                      className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                        maxArticles === count
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {count} articles
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  System filters specifically for review and secondary studies using metadata, abstracts, and keywords.
                </p>
              </div>
            </div>

            {/* Launch Action Button */}
            <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-700/80 flex justify-end">
              <button
                type="button"
                onClick={handleTriggerAudit}
                disabled={isLoadingArticles}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 disabled:opacity-50 rounded-lg shadow-xs transition-all cursor-pointer"
              >
                {isLoadingArticles ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Querying Crossref & OpenAlex for Review Studies...</span>
                  </>
                ) : (
                  <>
                    <span>Scan Journal for Review & Secondary Studies</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
