import { StudyClassification } from '../utils/academicAudit';

export interface Journal {
  title: string;
  issn: string[];
  publisher: string;
  homepage?: string;
  worksCount?: number;
  subjects?: string[];
  isPubMedIndexed?: boolean;
  medlineTa?: string;
  nlmId?: string;
  country?: string;
}

export interface CitedReference {
  title: string;
  doi?: string;
  author?: string;
  year?: string;
  retractionDate?: string;
  retractionNoticeDoi?: string;
  retractionReason?: string;
  retractionType?: 'Retraction' | 'Expression of Concern';
  isPostRetraction?: boolean;
  deltaDays?: number | null;
  timingDescription?: string;
  editorialStatus?: string;
  editorNotes?: string;
}

export interface ReviewArticle {
  title: string;
  doi: string;
  pmid?: string;
  pubDate: string;
  authors: string[];
  studyType: string;
  isReview: boolean;
  confidence: number;
  detectionLayers: string[];
  detectedBy?: StudyClassification['detectedBy'];
  keywords?: string[];
  meshHeadings?: string[];
  publicationTypes?: string[];
  abstract?: string;
  totalReferences: number;
  references?: any[];
  selected?: boolean;
}

export interface AuditedArticleResult extends ReviewArticle {
  retractedCount: number;
  retractedCitations: CitedReference[];
  hasPostRetractionCitation: boolean;
  hasRetractedCitation: boolean;
  riskLevel: 'Critical' | 'High' | 'Clean';
}

export interface EditorProfile {
  name: string;
  email: string;
  journal: string;
  role: string;
  orcid?: string;
  isLoggedIn: boolean;
  authProvider?: 'orcid' | 'google' | 'email' | 'preset' | 'guest';
  avatarUrl?: string;
  institution?: string;
}

export interface SavedAuditSession {
  id: string;
  createdAt: string;
  journalName: string;
  timeline: string;
  auditedArticles: AuditedArticleResult[];
  notes?: string;
}

export interface SentenceImpact {
  id: string;
  sentence: string;
  section: string;
  retractedDoi: string;
  retractedTitle: string;
  impactLevel: 'Critical' | 'Substantial' | 'Minimal' | 'Contextual';
  analysis: string;
  effectOnSynthesis: string;
}

export interface EditorialRecommendation {
  action: string;
  priority: 'Immediate Action' | 'Recommended Review' | 'Optional Erratum';
  rationale: string;
  draftNotice?: string;
}

export interface RetractedStudyContribution {
  doi: string;
  title: string;
  isDataContributing: boolean;
  contributionType:
    | 'Quantitative Meta-Analysis'
    | 'Qualitative Evidence Synthesis'
    | 'Background / Historical Citation'
    | 'Methodological Reference';
  explanation: string;
  pooledDataImpact: string;
}

export interface FigureAuditFinding {
  figureName: string;
  figureType: 'Forest Plot' | 'Funnel Plot' | 'Summary Table' | 'Flowchart / PRISMA' | 'Visual Graphic';
  containsRetractedData: boolean;
  retractedDoi?: string;
  details: string;
}

export interface FullTextAuditAnalysis {
  articleDoi: string;
  articleTitle: string;
  analyzedAt: string;
  fileName?: string;
  fileMimeType?: string;
  overallVerdict:
    | 'Contaminated Synthesis'
    | 'Sensitized Conclusions'
    | 'Uncontaminated / Background Citation';
  contributions: RetractedStudyContribution[];
  sentenceImpacts: SentenceImpact[];
  figuresAudited?: FigureAuditFinding[];
  overallSynthesisEffect: string;
  recommendations: EditorialRecommendation[];
}


