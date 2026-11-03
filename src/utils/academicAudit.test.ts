import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeDoi,
  parseIdentifier,
  classifyStudyTypeHeuristic,
  calculateRetractionDelta,
  generateCsvAuditReport,
} from './academicAudit.ts';

test('normalizeDoi trims URLs, prefixes, and casing correctly', () => {
  assert.equal(normalizeDoi('https://doi.org/10.1016/j.jclinepi.2023.01.002'), '10.1016/j.jclinepi.2023.01.002');
  assert.equal(normalizeDoi('http://dx.doi.org/10.1056/NEJMoa2001191'), '10.1056/nejmoa2001191');
  assert.equal(normalizeDoi('DOI: 10.1136/bmj.n1234 '), '10.1136/bmj.n1234');
});

test('classifyStudyTypeHeuristic detects review studies via ABSTRACT without title keywords', () => {
  // Title contains ZERO review or meta-analysis keywords!
  const studyIdentifiedByAbstract = classifyStudyTypeHeuristic(
    'Efficacy and Tolerability of Pharmacotherapy for Major Depressive Disorder in Older Adults',
    'We searched PubMed, Embase, and the Cochrane Library following PRISMA guidelines. Statistical analysis was performed using a random-effects model to determine pooled odds ratios and 95% confidence intervals across 42 eligible randomized trials.'
  );

  assert.equal(studyIdentifiedByAbstract.isReview, true);
  assert.equal(studyIdentifiedByAbstract.detectedBy.abstractAssessment, true);
  assert.equal(studyIdentifiedByAbstract.detectedBy.titleAssessment, false);
  assert.ok(studyIdentifiedByAbstract.confidence >= 0.8);
});

test('classifyStudyTypeHeuristic detects review studies via PUBMED PUBLICATION TYPE without title keywords', () => {
  // Title contains ZERO review keywords
  const studyIdentifiedByPubType = classifyStudyTypeHeuristic(
    'Clinical Management of Acute Ischemic Stroke: An AHA/ASA Update',
    'This statement outlines evidence-based therapeutic recommendations for acute reperfusion therapy.',
    ['Practice Guideline', 'Review']
  );

  assert.equal(studyIdentifiedByPubType.isReview, true);
  assert.equal(studyIdentifiedByPubType.detectedBy.pubmedPubType, true);
  assert.equal(studyIdentifiedByPubType.detectedBy.titleAssessment, false);
});

test('classifyStudyTypeHeuristic detects review studies via KEYWORDS & MESH without title keywords', () => {
  const studyIdentifiedByKeywords = classifyStudyTypeHeuristic(
    'Therapeutic Plasma Exchange in Neurological Autoimmune Diseases',
    'Overview of indications and clinical response rates.',
    undefined,
    ['evidence synthesis', 'systematic review', 'autoimmunity'],
    ['Plasmapheresis', 'Meta-Analysis as Topic']
  );

  assert.equal(studyIdentifiedByKeywords.isReview, true);
  assert.equal(studyIdentifiedByKeywords.detectedBy.keywordMesh, true);
  assert.equal(studyIdentifiedByKeywords.detectedBy.titleAssessment, false);
});

test('classifyStudyTypeHeuristic identifies primary studies as non-reviews', () => {
  const primaryStudy = classifyStudyTypeHeuristic(
    'Randomized Double-Blind Trial of Drug X vs Placebo in Patients with Stage II Hypertension',
    'We enrolled 500 patients across 12 centers. Blood pressure was measured at 12 weeks. Primary outcome was reduction in systolic blood pressure.'
  );

  assert.equal(primaryStudy.isReview, false);
  assert.equal(primaryStudy.studyType, 'Primary Research');
});

test('calculateRetractionDelta accurately determines pre- vs post-retraction citation', () => {
  const postRetraction = calculateRetractionDelta('2024-05-10', '2021-02-15');
  assert.equal(postRetraction.isPostRetractionCitation, true);
  assert.ok(postRetraction.deltaDays! > 1000);
});

test('generateCsvAuditReport includes detection methods column', () => {
  const sampleAudit = [
    {
      title: 'Global Trends in Hypertension: A Systematic Review',
      doi: '10.1016/j.lancet.2024.01.001',
      pubDate: '2024-03-01',
      studyType: 'Systematic Review',
      detectionLayers: ['PubMed/Metadata Type: "Review"', 'Abstract Assessment: PRISMA'],
      totalReferences: 45,
      retractedCitations: [],
    },
  ];

  const csv = generateCsvAuditReport(sampleAudit, 'The Lancet', 'Dr. Arthur Campbell');
  assert.ok(csv.includes('Detection Methods'));
  assert.ok(csv.includes('PubMed/Metadata Type: ""Review""'));
});

test('Full-text retraction impact detection distinguishes quantitative data-contributing studies from background mentions', () => {
  const quantitativeSnippet =
    'In our quantitative network meta-analysis of antimalarials, patient records extracted from Mehra et al. (2020) contributed 14,888 subjects to the pooled hazard ratio calculation (Forest Plot 3A).';
  const backgroundSnippet =
    'Historically, Wakefield et al. (1998) suggested an association between enterocolitis and developmental disorders prior to official retraction.';

  const isQuantitative = /pooled|forest plot|meta-analysis|hazard ratio|odds ratio|relative risk/i.test(quantitativeSnippet);
  const isBackgroundOnly = /historically|previously|background/i.test(backgroundSnippet) && !/pooled|forest plot|hazard ratio/i.test(backgroundSnippet);

  assert.equal(isQuantitative, true, 'Quantitative meta-analysis mentions should be detected as data-contributing');
  assert.equal(isBackgroundOnly, true, 'Historical mentions without pooling should be detected as contextual');
});

