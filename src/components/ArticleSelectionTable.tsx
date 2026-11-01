import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Loader2,
  ArrowRight,
  Filter,
  Layers,
  Database,
  FileSearch,
  Tag,
  BookOpen,
} from 'lucide-react';
import { ReviewArticle } from '../types/academic';

interface ArticleSelectionTableProps {
  articles: ReviewArticle[];
  onToggleSelect: (doi: string) => void;
  onSelectAll: (select: boolean) => void;
  onRunAudit: () => void;
  isAuditing: boolean;
  journalName: string;
}

export const ArticleSelectionTable: React.FC<ArticleSelectionTableProps> = ({
  articles,
  onToggleSelect,
  onSelectAll,
  onRunAudit,
  isAuditing,
  journalName,
}) => {
  const [expandedDois, setExpandedDois] = useState<Record<string, boolean>>({});
  const [methodFilter, setMethodFilter] = useState<'all' | 'abstract' | 'pubmed' | 'keywords' | 'title'>('all');

  const selectedCount = articles.filter((a) => a.selected).length;
  const allSelected = articles.length > 0 && selectedCount === articles.length;

  const toggleExpand = (doi: string) => {
    setExpandedDois((prev) => ({ ...prev, [doi]: !prev[doi] }));
  };

  if (articles.length === 0) {
    return null;
  }

  // Count by detection channel
  const abstractCount = articles.filter((a) => a.detectedBy?.abstractAssessment).length;
  const pubmedCount = articles.filter((a) => a.detectedBy?.pubmedPubType || a.detectedBy?.metadataType).length;
  const keywordsCount = articles.filter((a) => a.detectedBy?.keywordMesh).length;
  const titleCount = articles.filter((a) => a.detectedBy?.titleAssessment).length;

  const filteredArticles = articles.filter((a) => {
    if (methodFilter === 'abstract') return a.detectedBy?.abstractAssessment;
    if (methodFilter === 'pubmed') return a.detectedBy?.pubmedPubType || a.detectedBy?.metadataType;
    if (methodFilter === 'keywords') return a.detectedBy?.keywordMesh;
    if (methodFilter === 'title') return a.detectedBy?.titleAssessment;
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-xs mb-8 transition-colors">
      {/* Header and Step Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-start gap-2.5">
          <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-300/80 dark:border-slate-700 mt-0.5">
            2
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Discovered Review & Secondary Studies</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
                {articles.length} studies
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comprehensive multi-channel scan: identified via PubMed publication types, abstract PRISMA assessment, keywords/MeSH, and title patterns.
            </p>
          </div>
        </div>

        {/* Global Select and Primary Action Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectAll(!allSelected)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            {allSelected ? <CheckSquare className="w-4 h-4 text-slate-900 dark:text-white" /> : <Square className="w-4 h-4 text-slate-400" />}
            <span>{allSelected ? 'Deselect All' : 'Select All Articles'}</span>
          </button>

          <button
            type="button"
            onClick={onRunAudit}
            disabled={selectedCount === 0 || isAuditing}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-all cursor-pointer"
          >
            {isAuditing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditing Citations against Crossref & OpenAlex...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Verify Citations & Retractions ({selectedCount})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Detection Channel Filter Strip */}
      <div className="py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Detection Channels:</span>
          </span>

          <button
            type="button"
            onClick={() => setMethodFilter('all')}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
              methodFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Channels ({articles.length})
          </button>

          {abstractCount > 0 && (
            <button
              type="button"
              onClick={() => setMethodFilter('abstract')}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                methodFilter === 'abstract'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <FileSearch className="w-3 h-3 text-slate-500" />
              <span>Abstract & PRISMA ({abstractCount})</span>
            </button>
          )}

          {pubmedCount > 0 && (
            <button
              type="button"
              onClick={() => setMethodFilter('pubmed')}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                methodFilter === 'pubmed'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Database className="w-3 h-3 text-slate-500" />
              <span>PubMed PubType ({pubmedCount})</span>
            </button>
          )}

          {keywordsCount > 0 && (
            <button
              type="button"
              onClick={() => setMethodFilter('keywords')}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                methodFilter === 'keywords'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Tag className="w-3 h-3 text-slate-500" />
              <span>Keywords / MeSH ({keywordsCount})</span>
            </button>
          )}

          {titleCount > 0 && (
            <button
              type="button"
              onClick={() => setMethodFilter('title')}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                methodFilter === 'title'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-3 h-3 text-slate-500" />
              <span>Title Pattern ({titleCount})</span>
            </button>
          )}
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredArticles.length} of {articles.length} studies
        </span>
      </div>

      {/* Selectable Table / Cards */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
        {filteredArticles.map((article) => {
          const isExpanded = !!expandedDois[article.doi];
          return (
            <div
              key={article.doi}
              className={`py-4 transition-colors rounded-lg px-2 ${
                article.selected ? 'bg-slate-50/80 dark:bg-slate-800/30' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Row Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleSelect(article.doi)}
                  className="mt-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  title={article.selected ? 'Deselect article' : 'Select article for audit'}
                >
                  {article.selected ? (
                    <CheckSquare className="w-5 h-5 text-slate-900 dark:text-slate-100" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {/* Study Taxonomy Tag */}
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                      {article.studyType}
                    </span>

                    {/* Metadata line with typographic separators */}
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      <span>Published {article.pubDate}</span>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{article.totalReferences} references cited</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onToggleSelect(article.doi)}
                    className="text-sm font-semibold text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer leading-snug"
                  >
                    {article.title}
                  </h3>

                  {/* Authors & Links */}
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-md">
                      {article.authors.length > 0
                        ? article.authors.slice(0, 3).join('; ') + (article.authors.length > 3 ? ' et al.' : '')
                        : 'Authors listed'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <a
                      href={`https://doi.org/${article.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-slate-600 dark:text-slate-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>doi:{article.doi}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>

                  {/* Multi-channel Detection Badges */}
                  {article.detectionLayers && article.detectionLayers.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Identified Via:
                      </span>
                      {article.detectionLayers.map((layer, idx) => {
                        return (
                          <span
                            key={idx}
                            className="text-[11px] font-medium px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {layer}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Collapsible Abstract & Methodology inspection */}
                  {article.abstract && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => toggleExpand(article.doi)}
                        className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center gap-1 cursor-pointer font-medium"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Hide Abstract & Methodology Details</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            <span>Inspect Abstract & Synthesis Methodology</span>
                          </>
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-3.5 bg-slate-50/80 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          <p>{article.abstract}</p>
                          {article.keywords && article.keywords.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500">
                              <span className="font-semibold text-slate-700 dark:text-slate-300">Indexed Keywords: </span>
                              <span>{article.keywords.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          {selectedCount} of {articles.length} studies selected
        </span>

        <button
          type="button"
          onClick={onRunAudit}
          disabled={selectedCount === 0 || isAuditing}
          className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-all cursor-pointer"
        >
          {isAuditing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking Bibliography against Crossref Retraction Registry...</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4" />
              <span>Run Retraction Audit on Selected ({selectedCount})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
