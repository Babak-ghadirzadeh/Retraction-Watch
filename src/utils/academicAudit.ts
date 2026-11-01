/**
 * Core Academic Audit & Citation Retraction Utility Functions
 * Pure decoupled business logic for classification, DOI normalization,
 * retraction delta timing calculation, and CSV reporting.
 */

export interface StudyClassification {
  isReview: boolean;
  studyType: string;
  confidence: number; // 0.0 to 1.0
  detectionLayers: string[];
  detectedBy: {
    pubmedPubType: boolean;
    metadataType: boolean;
    abstractAssessment: boolean;
    keywordMesh: boolean;
    titleAssessment: boolean;
    aiClassified: boolean;
  };
}

export interface RetractionTiming {
  isPostRetractionCitation: boolean;
  deltaDays: number | null;
  timingDescription: string;
}

/**
 * Normalizes DOI strings into standard format '10.xxxx/yyyy'
 */
export function normalizeDoi(raw: any): string {
  if (!raw || typeof raw !== 'string') return '';
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '');
  cleaned = cleaned.replace(/^doi:\s*/i, '');
  return cleaned.trim().toLowerCase();
}

/**
 * Extracts clean DOI or PMID from user input (URL, DOI string, or PMID)
 */
export function parseIdentifier(input: any): { type: 'doi' | 'pmid' | 'url' | 'unknown'; value: string } {
  if (!input || typeof input !== 'string') return { type: 'unknown', value: '' };
  const trimmed = input.trim();

  // Match PubMed URL: pubmed.ncbi.nlm.nih.gov/38291023
  const pubmedUrlMatch = trimmed.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/i);
  if (pubmedUrlMatch) {
    return { type: 'pmid', value: pubmedUrlMatch[1] };
  }

  // Match DOI URL or bare DOI: 10.xxxx/yyyy
  const doiMatch = trimmed.match(/(?:doi\.org\/)?(10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)/i);
  if (doiMatch) {
    return { type: 'doi', value: normalizeDoi(doiMatch[1]) };
  }

  // Digits only -> PMID
  if (/^\d{5,9}$/.test(trimmed)) {
    return { type: 'pmid', value: trimmed };
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return { type: 'url', value: trimmed };
  }

  return { type: 'unknown', value: trimmed };
}

/**
 * Comprehensive Multi-Layer Detection Engine for Review & Secondary Studies
 */
export function classifyStudyTypeHeuristic(
  title?: any,
  abstract?: any,
  publicationTypes?: any[],
  keywords?: any[],
  meshHeadings?: any[]
): StudyClassification {
  const t = String(title || '').toLowerCase();
  const a = String(abstract || '').toLowerCase();
  const types = (publicationTypes || []).filter(Boolean).map((pt) => String(pt).toLowerCase());
  const kw = (keywords || []).filter(Boolean).map((k) => String(k).toLowerCase());
  const mesh = (meshHeadings || []).filter(Boolean).map((m) => String(m).toLowerCase());
  const layers: string[] = [];

  const detectedBy = {
    pubmedPubType: false,
    metadataType: false,
    abstractAssessment: false,
    keywordMesh: false,
    titleAssessment: false,
    aiClassified: false,
  };

  let isReview = false;
  let studyType = 'Primary Research';
  let confidence = 0.15;

  // Layer 1: PubMed Publication Type & Metadata Tags (Gold Standard)
  const pubMedReviewTypes = [
    { tag: 'systematic review', label: 'Systematic Review', score: 0.95 },
    { tag: 'meta-analysis', label: 'Meta-Analysis', score: 0.96 },
    { tag: 'review', label: 'Review Article', score: 0.88 },
    { tag: 'practice guideline', label: 'Clinical Practice Guideline', score: 0.92 },
    { tag: 'guideline', label: 'Clinical Practice Guideline', score: 0.90 },
    { tag: 'consensus development conference', label: 'Consensus Statement', score: 0.90 },
    { tag: 'scoping review', label: 'Scoping Review', score: 0.95 },
    { tag: 'cochrane review', label: 'Cochrane Systematic Review', score: 0.98 },
    { tag: 'health technology assessment', label: 'Health Technology Assessment', score: 0.92 },
    { tag: 'scientific integrity review', label: 'Integrity Review', score: 0.90 },
    { tag: 'review literature as topic', label: 'Review Article', score: 0.88 },
  ];

  for (const pmt of pubMedReviewTypes) {
    const matched = types.find((typeStr) => typeStr && typeStr.includes(pmt.tag));
    if (matched) {
      layers.push(`PubMed/Metadata Type: "${matched}"`);
      isReview = true;
      detectedBy.pubmedPubType = true;
      detectedBy.metadataType = true;
      confidence = Math.max(confidence, pmt.score);
      studyType = pmt.label;
      break;
    }
  }

  // Layer 2: Author Keywords & Medical Subject Headings (MeSH)
  const reviewKeywords = [
    { term: 'systematic review', label: 'Systematic Review', score: 0.92 },
    { term: 'meta-analysis', label: 'Meta-Analysis', score: 0.95 },
    { term: 'scoping review', label: 'Scoping Review', score: 0.92 },
    { term: 'evidence synthesis', label: 'Evidence Synthesis', score: 0.90 },
    { term: 'network meta-analysis', label: 'Network Meta-Analysis', score: 0.95 },
    { term: 'umbrella review', label: 'Umbrella Review', score: 0.92 },
    { term: 'prisma', label: 'Systematic Review / PRISMA', score: 0.88 },
    { term: 'literature search', label: 'Review Article', score: 0.82 },
    { term: 'practice guideline', label: 'Clinical Practice Guideline', score: 0.90 },
    { term: 'consensus statement', label: 'Consensus Guideline', score: 0.88 },
    { term: 'meta-regression', label: 'Meta-Analysis', score: 0.92 },
    { term: 'individual participant data meta-analysis', label: 'IPD Meta-Analysis', score: 0.96 },
    { term: 'health technology assessment', label: 'Health Technology Assessment', score: 0.90 },
    { term: 'hta', label: 'Health Technology Assessment', score: 0.85 },
  ];

  const allKeywords = [...kw, ...mesh];
  for (const rk of reviewKeywords) {
    const foundKw = allKeywords.find((k) => k && k.includes(rk.term));
    if (foundKw) {
      layers.push(`Keywords/MeSH: "${foundKw}"`);
      isReview = true;
      detectedBy.keywordMesh = true;
      confidence = Math.max(confidence, rk.score);
      if (studyType === 'Primary Research') {
        studyType = rk.label;
      }
      break;
    }
  }

  // Layer 3: Abstract Assessment (Deep methodology, synthesis protocol, search strategy)
  if (a) {
    const abstractMethodologySignals: Array<{ regex: RegExp; signal: string; weight: number }> = [
      { regex: /\bprisma\b/i, signal: 'PRISMA guideline compliance', weight: 0.35 },
      { regex: /\b(systematic review|systematic literature search|systematically searched)\b/i, signal: 'Systematic search protocol', weight: 0.40 },
      { regex: /\bsearched (?:pubmed|medline|embase|cochrane|web of science|scopus|cinahl)\b/i, signal: 'Multi-database bibliographic search', weight: 0.45 },
      { regex: /\b(random-effects model|fixed-effect model|random-effects meta-analysis)\b/i, signal: 'Statistical meta-analytic modeling', weight: 0.45 },
      { regex: /\b(pooled (?:odds ratio|risk ratio|relative risk|hazard ratio|effect size|mean difference))\b/i, signal: 'Pooled quantitative effect estimate', weight: 0.45 },
      { regex: /\b(heterogeneity.*(?:i2|i\^2|tau2|tau\^2|cochran))\b/i, signal: 'Between-study heterogeneity analysis', weight: 0.35 },
      { regex: /\b(risk of bias|cochrane risk of bias|rob2|robins-i|newcastle-ottawa|grade approach)\b/i, signal: 'Formal risk-of-bias / GRADE synthesis', weight: 0.40 },
      { regex: /\b(inclusion criteria.*studies were included|studies meeting inclusion criteria)\b/i, signal: 'Study inclusion and screening criteria', weight: 0.30 },
      { regex: /\b(funnel plot|egger's test|begg's test|publication bias)\b/i, signal: 'Publication bias assessment', weight: 0.30 },
      { regex: /\b(we synthesized evidence|evidence synthesis|overview of published literature)\b/i, signal: 'Narrative / qualitative evidence synthesis', weight: 0.35 },
      { regex: /\b(clinical practice recommendations|panel of experts formulated recommendations|consensus recommendations)\b/i, signal: 'Clinical guideline panel recommendations', weight: 0.40 },
    ];

    const matchedSignals = abstractMethodologySignals.filter((item) => item.regex.test(a));
    if (matchedSignals.length >= 2 || (matchedSignals.length >= 1 && matchedSignals[0].weight >= 0.4)) {
      layers.push(`Abstract Assessment: ${matchedSignals.length} methodology signals (${matchedSignals.map((s) => s.signal).slice(0, 2).join('; ')})`);
      isReview = true;
      detectedBy.abstractAssessment = true;
      const combinedWeight = matchedSignals.reduce((acc, s) => acc + s.weight, 0);
      confidence = Math.min(0.96, Math.max(confidence, 0.75 + combinedWeight * 0.1));

      if (studyType === 'Primary Research') {
        const hasMetaModeling = matchedSignals.some((s) => s.signal.includes('meta-analytic') || s.signal.includes('Pooled'));
        const hasGuideline = matchedSignals.some((s) => s.signal.includes('guideline'));
        if (hasMetaModeling) {
          studyType = 'Meta-Analysis (Identified via Abstract)';
        } else if (hasGuideline) {
          studyType = 'Practice Guideline (Identified via Abstract)';
        } else {
          studyType = 'Evidence Synthesis / Review';
        }
      }
    }
  }

  // Layer 4: Title Pattern Assessment
  const titlePatterns: Array<{ regex: RegExp; label: string; score: number }> = [
    { regex: /\b(systematic review and meta-analysis|systematic review & meta-analysis)\b/i, label: 'Systematic Review & Meta-Analysis', score: 0.98 },
    { regex: /\bnetwork meta-analysis\b/i, label: 'Network Meta-Analysis', score: 0.98 },
    { regex: /\bmeta-analysis\b/i, label: 'Meta-Analysis', score: 0.95 },
    { regex: /\bsystematic review\b/i, label: 'Systematic Review', score: 0.95 },
    { regex: /\bscoping review\b/i, label: 'Scoping Review', score: 0.95 },
    { regex: /\bumbrella review\b/i, label: 'Umbrella Review', score: 0.95 },
    { regex: /\bclinical practice guideline[s]?\b/i, label: 'Clinical Practice Guideline', score: 0.92 },
    { regex: /\bevidence synthesis\b/i, label: 'Evidence Synthesis', score: 0.90 },
    { regex: /\boverview of reviews\b/i, label: 'Overview of Reviews', score: 0.92 },
    { regex: /\bcritical review\b/i, label: 'Critical Review', score: 0.85 },
    { regex: /\bliterature review\b/i, label: 'Literature Review', score: 0.85 },
    { regex: /:\s*a review\b/i, label: 'Narrative Review', score: 0.82 },
    { regex: /\ba comprehensive review\b/i, label: 'Comprehensive Review', score: 0.85 },
    { regex: /\bconsensus statement\b/i, label: 'Consensus Statement', score: 0.88 },
    { regex: /\bcomparative effectiveness review\b/i, label: 'Comparative Effectiveness Review', score: 0.92 },
  ];

  for (const pattern of titlePatterns) {
    if (pattern.regex.test(t)) {
      layers.push(`Title Assessment: "${pattern.label}"`);
      isReview = true;
      detectedBy.titleAssessment = true;
      confidence = Math.max(confidence, pattern.score);
      studyType = pattern.label;
      break;
    }
  }

  return {
    isReview,
    studyType,
    confidence: Number(confidence.toFixed(2)),
    detectionLayers: layers,
    detectedBy,
  };
}

/**
 * Calculates whether an article cited a retracted paper AFTER it was already retracted
 */
export function calculateRetractionDelta(
  reviewPublicationDate?: any,
  retractionDate?: any
): RetractionTiming {
  if (!reviewPublicationDate || !retractionDate) {
    return {
      isPostRetractionCitation: false,
      deltaDays: null,
      timingDescription: 'Retraction timing unknown (missing dates)',
    };
  }

  const parseDateSafe = (val: any): number => {
    if (!val) return NaN;
    const str = String(val).trim();
    // Try standard ISO or replace spaces
    let d = new Date(str).getTime();
    if (!isNaN(d)) return d;
    // Try YYYY-MM-DD extracted
    const match = str.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (match) {
      return new Date(`${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`).getTime();
    }
    const yearMatch = str.match(/(\d{4})/);
    if (yearMatch) {
      return new Date(`${yearMatch[1]}-01-01`).getTime();
    }
    return NaN;
  };

  const reviewDate = parseDateSafe(reviewPublicationDate);
  const retractDate = parseDateSafe(retractionDate);

  if (isNaN(reviewDate) || isNaN(retractDate)) {
    return {
      isPostRetractionCitation: false,
      deltaDays: null,
      timingDescription: 'Retraction timing unparsed date',
    };
  }

  const diffMs = reviewDate - retractDate;
  const deltaDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (deltaDays > 30) {
    const years = (deltaDays / 365.25).toFixed(1);
    const timeSpan = deltaDays > 365 ? `${years} years` : `${deltaDays} days`;
    return {
      isPostRetractionCitation: true,
      deltaDays,
      timingDescription: `Cited ${timeSpan} AFTER retraction (Critical)`,
    };
  } else if (deltaDays >= 0) {
    return {
      isPostRetractionCitation: true,
      deltaDays,
      timingDescription: `Cited within 30 days of retraction (${deltaDays} days after)`,
    };
  } else {
    const preDays = Math.abs(deltaDays);
    const years = (preDays / 365.25).toFixed(1);
    const timeSpan = preDays > 365 ? `${years} years` : `${preDays} days`;
    return {
      isPostRetractionCitation: false,
      deltaDays,
      timingDescription: `Cited ${timeSpan} BEFORE retraction`,
    };
  }
}

/**
 * Generates RFC4180 standard CSV audit report for editorial board
 */
export function generateCsvAuditReport(
  auditedArticles: Array<{
    title?: string;
    doi?: string;
    pubDate?: string;
    studyType?: string;
    detectionLayers?: string[];
    totalReferences?: number;
    retractedCitations?: Array<{
      title?: string;
      doi?: string;
      retractionDate?: string;
      retractionNoticeDoi?: string;
      retractionReason?: string;
      isPostRetraction?: boolean;
      timingDescription?: string;
      editorialStatus?: string;
      editorNotes?: string;
    }>;
  }>,
  journalName: string,
  editorName: string
): string {
  const escapeCsv = (val: string | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows: string[] = [];

  // Header metadata
  rows.push(`# RetractScan Editorial Citation Audit Report`);
  rows.push(`# Journal: ${escapeCsv(journalName)}`);
  rows.push(`# Audited by: ${escapeCsv(editorName)}`);
  rows.push(`# Generated: ${escapeCsv(new Date().toISOString())}`);
  rows.push('');

  // Column Headers
  const headers = [
    'Review Title',
    'Review DOI',
    'Publication Date',
    'Study Type',
    'Detection Methods',
    'Total References',
    'Retracted Citations Count',
    'Cited Paper Title',
    'Cited Paper DOI',
    'Retraction Date',
    'Post-Retraction Citation',
    'Timing Analysis',
    'Retraction Reason / Nature',
    'Retraction Notice DOI',
    'Editorial Assessment Status',
    'Editor Notes',
  ];
  rows.push(headers.map((h) => `"${h}"`).join(','));

  for (const article of (auditedArticles || [])) {
    const detectionMethodsStr = (article.detectionLayers || []).join(' | ');
    const retractedList = article.retractedCitations || [];

    if (retractedList.length === 0) {
      rows.push([
        escapeCsv(article.title),
        escapeCsv(article.doi),
        escapeCsv(article.pubDate || 'N/A'),
        escapeCsv(article.studyType || 'Review'),
        escapeCsv(detectionMethodsStr),
        article.totalReferences || 0,
        0,
        escapeCsv('None detected (Clean bibliography)'),
        '""',
        '""',
        escapeCsv('No'),
        '""',
        '""',
        '""',
        escapeCsv('Verified Clean'),
        '""',
      ].join(','));
    } else {
      for (const cited of retractedList) {
        rows.push([
          escapeCsv(article.title),
          escapeCsv(article.doi),
          escapeCsv(article.pubDate || 'N/A'),
          escapeCsv(article.studyType || 'Review'),
          escapeCsv(detectionMethodsStr),
          article.totalReferences || 0,
          retractedList.length,
          escapeCsv(cited.title),
          escapeCsv(cited.doi),
          escapeCsv(cited.retractionDate || 'Date Unspecified'),
          escapeCsv(cited.isPostRetraction ? 'YES (CRITICAL)' : 'No (Pre-retraction)'),
          escapeCsv(cited.timingDescription || 'N/A'),
          escapeCsv(cited.retractionReason || 'Post-publication Retraction Notice'),
          escapeCsv(cited.retractionNoticeDoi || 'N/A'),
          escapeCsv(cited.editorialStatus || 'Needs Editorial Review'),
          escapeCsv(cited.editorNotes || ''),
        ].join(','));
      }
    }
  }

  return rows.join('\r\n');
}
