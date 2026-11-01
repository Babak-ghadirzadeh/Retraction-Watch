import { StudyClassification } from '../utils/academicAudit';

export interface Journal {
  title: string;
  issn: string[];
  publisher: string;
  homepage?: string;
  worksCount?: number;
  subjects?: string[];
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
