import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Calendar, Check, BookOpen, Layers, ArrowRight, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
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
  const [hasSearched, setHasSearched] = useState(false);
  const [activeJournal, setActiveJournal] = useState<Journal | null>(selectedJournal);

  // Timeline and max articles controls
  const [timelinePreset, setTimelinePreset] = useState<'2026' | '2025-2026' | '2024-2026' | '2021-2026' | 'custom'>('2021-2026');
  const [customYearFrom, setCustomYearFrom] = useState(2021);
  const [customYearTo, setCustomYearTo] = useState(2026);
  const [maxArticles, setMaxArticles] = useState(20);

  useEffect(() => {
    if (selectedJournal) {
      setActiveJournal(selectedJournal);
    }
  }, [selectedJournal]);

  const fetchJournals = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setJournals([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/academic/journals?q=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        const list: Journal[] = data.journals || [];
        setJournals(list);
        if (list.length > 0 && !activeJournal) {
          setActiveJournal(list[0]);
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
        <div className="flex items-center gap-2.5 mb-2">
          <span className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs flex items-center justify-center">
            1
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Find Journal & Set Audit Scope
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Search all PubMed/MEDLINE cataloged and peer-reviewed journals to scan their published systematic reviews and meta-analyses.
        </p>

        {/* Clean, Focused Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any journal by name or ISSN (e.g. Lancet, BMJ, Kurdistan Journal, Nature, NEJM, PLOS, Frontiers)..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-slate-400 focus:outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 disabled:opacity-40 rounded-lg shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 group"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 transition-transform group-hover:scale-110" />}
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Initial Prompt State (No Dummy Sample Cards) */}
        {!hasSearched && !activeJournal && (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 mb-6">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2.5" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Search Over 350,000 Academic Journals
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Type any journal title, NLM abbreviation, or ISSN above. RetractScan queries the NCBI NLM Catalog, OpenAlex, and Crossref in real time.
            </p>
          </div>
        )}

        {/* Search Results List */}
        {hasSearched && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Found {journals.length} {journals.length === 1 ? 'journal' : 'journals'}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                NCBI NLM Catalog & OpenAlex & Crossref
              </span>
            </div>

            {journals.length === 0 && !isSearching ? (
              <div className="p-6 text-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-500">
                No matching journals found for "{searchQuery}". Try a different spelling, an ISSN, or key title word.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
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
                          <span className="truncate max-w-[180px]">{j.publisher || 'Academic Publisher'}</span>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          {j.isPubMedIndexed && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900">
                              <ShieldCheck className="w-3 h-3" />
                              PubMed Indexed
                            </span>
                          )}
                          {j.medlineTa && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              TA: {j.medlineTa}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Select and external link */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        {j.homepage ? (
                          <a
                            href={j.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-slate-700 dark:text-slate-300 hover:underline inline-flex items-center gap-1 font-medium"
                          >
                            <span>Journal Registry</span>
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
            )}
          </div>
        )}

        {/* Selected Journal & Filter Parameters Banner */}
        {activeJournal && (
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-700/80">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                  Target Journal for Retraction Scan
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                  <span>{activeJournal.title}</span>
                  {activeJournal.isPubMedIndexed && (
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900">
                      PubMed Indexed
                    </span>
                  )}
                  {activeJournal.homepage && (
                    <a
                      href={activeJournal.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      title="Open external journal link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
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
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Publication Year Window</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['2026', '2025-2026', '2024-2026', '2021-2026', 'custom'] as const).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTimelinePreset(preset)}
                      className={`text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                        timelinePreset === preset
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold border-slate-900 dark:border-slate-100'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {preset === 'custom' ? 'Custom' : preset}
                    </button>
                  ))}
                </div>

                {timelinePreset === 'custom' && (
                  <div className="flex items-center gap-2 mt-2.5">
                    <input
                      type="number"
                      min={1990}
                      max={2026}
                      value={customYearFrom}
                      onChange={(e) => setCustomYearFrom(parseInt(e.target.value, 10))}
                      className="w-20 px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center"
                    />
                    <span className="text-xs text-slate-400">to</span>
                    <input
                      type="number"
                      min={1990}
                      max={2026}
                      value={customYearTo}
                      onChange={(e) => setCustomYearTo(parseInt(e.target.value, 10))}
                      className="w-20 px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-center"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Max Reviews to Fetch</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {maxArticles} studies
                  </span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={5}
                  value={maxArticles}
                  onChange={(e) => setMaxArticles(parseInt(e.target.value, 10))}
                  className="w-full accent-slate-900 dark:accent-slate-100 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>5 (Fast)</span>
                  <span>20 (Standard)</span>
                  <span>50 (Deep scan)</span>
                </div>
              </div>
            </div>

            {/* Action Trigger Button */}
            <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Will query PubMed & OpenAlex for reviews in this journal.
              </span>
              <button
                type="button"
                onClick={handleTriggerAudit}
                disabled={isLoadingArticles}
                className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 disabled:opacity-50 rounded-lg shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer group"
              >
                {isLoadingArticles ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Querying PubMed & OpenAlex...</span>
                  </>
                ) : (
                  <>
                    <span>Scan Journal for Review Studies</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
