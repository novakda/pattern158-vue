// src/content/caseFiles.ts
//
// Content module for CaseFilesPage. Contains hero copy, classification line,
// stats bar, section heading objects, and the full Project Directory as typed
// structured literals (ProjectDirectoryGroup[]).
//
// Per Phase 37 RESEARCH.md §C6 and §Pitfall 4: the Project Directory stays in
// src/content/ as typed TS, NOT promoted to src/data/projectDirectory.json.
// Rationale: single-purpose phase (prose extraction), avoid scope creep into
// the data loader layer.

export interface ProjectDirectoryEntry {
  client: string
  project: string
  dates: string
  role: string
}

export interface ProjectDirectoryGroup {
  industry: string
  entries: ProjectDirectoryEntry[]
}

export interface StatEntry {
  number: string
  label: string
}

export const hero = {
  title: 'Case Files',
  subtitle: 'Documented evidence from 28+ years of engineering work',
  classification: 'Corroborated \u00B7 Primary Sources \u00B7 2005\u20132022',
}

export const stats: StatEntry[] = [
  { number: '38', label: 'Projects Documented' },
  { number: '6,000+', label: 'Emails Archived' },
  { number: '15+', label: 'Industries' },
]

export const investigationReportsHeading = {
  id: 'ir-heading',
  title: 'Investigation Reports',
  subtitle: 'Methodology-driven case studies',
}

export const engineeringBriefsHeading = {
  id: 'eb-heading',
  title: 'Engineering Briefs',
  subtitle: 'Constraints navigated, results delivered',
}

export const projectDirectoryHeading = {
  id: 'directory-heading',
  title: 'Complete Project Directory',
  subtitle: 'All documented client engagements organized by industry',
}

export const projectDirectory: ProjectDirectoryGroup[] = [
  {
    industry: 'Financial Services',
    entries: [
      { client: 'Bank of America', project: 'Lectora Course LMS Troubleshooting', dates: '2018', role: 'LMS Troubleshooting Lead' },
      { client: 'SunTrust Bank', project: 'AWARE Onboarding & eLearning Platform', dates: '2015\u20132018', role: 'Lead Technical Engineer' },
      { client: 'Horizon BCBS NJ', project: 'FWA and Compliance Training', dates: '2018', role: 'Technical Engineer' },
      { client: 'MetLife', project: 'Home Hail Damage VR', dates: '2018\u20132020', role: 'SCORM Expert / Technical Team Member' },
      { client: 'SAP SuccessFactors', project: 'LMS Client Engagements', dates: '2015\u20132018', role: 'eLearning Content Integration Specialist' },
    ],
  },
  {
    industry: 'Pharmaceutical & Healthcare',
    entries: [
      { client: 'Eli Lilly', project: 'eLearning Platform Integration & AICC Wrapper', dates: '2015\u20132020', role: 'AICC/LMS Integration Specialist' },
      { client: 'Bayer AG', project: 'eLearning Course Development & LMS Integration', dates: '2012', role: 'LMS Integration Specialist' },
      { client: 'Weill Cornell Medicine', project: 'LMS Readiness & Course Troubleshooting', dates: '2017\u20132018', role: 'Lead Technical Investigator' },
    ],
  },
  {
    industry: 'Aerospace & Defense',
    entries: [
      { client: 'General Dynamics', project: 'eLearning Development & Technical Validation', dates: '2011\u20132020', role: 'Technical Validation Lead' },
      { client: 'Gulfstream Aerospace', project: 'Leading Edge eLearning Program', dates: '2017\u20132020', role: 'Technical Troubleshooting Lead' },
      { client: 'United Technologies', project: 'Legacy Branding & eLearning Content Audit', dates: '2018\u20132020', role: 'Technical Lead (Content Audit Tooling)' },
    ],
  },
  {
    industry: 'Energy & Utilities',
    entries: [
      { client: 'Exelon Corporation', project: 'eLearning & LMS Support', dates: '2015\u20132017', role: 'AICC/SCORM Troubleshooter' },
      { client: 'National Grid', project: 'LMS & eLearning Support', dates: '2019\u20132020', role: 'Technical Consultant' },
      { client: 'Portland General Electric', project: 'Energy Education Center LMS', dates: '2013\u20132016', role: 'Learning Systems Engineer' },
    ],
  },
  {
    industry: 'Technology',
    entries: [
      { client: 'Microsoft', project: 'eLearning Windows 10 Training', dates: '2015\u20132019', role: 'Learning Systems Engineer' },
      { client: 'CSC', project: 'University Online Learning Modules', dates: '2014', role: 'Web Developer / SCORM Integration' },
      { client: 'CDK Global', project: 'LMS Health Check & LinkedIn Learning Integration', dates: '2019', role: 'LMS/AICC Integration Troubleshooter' },
    ],
  },
  {
    industry: 'Consumer & Manufacturing',
    entries: [
      { client: 'Nike', project: 'eLearning Accessibility Evaluation & Remediation', dates: '2018', role: 'Accessibility Technical Advisor' },
      { client: 'Luxottica', project: 'LMS Optimization Assessment', dates: '2015', role: 'Technical Expert / Content Analyst' },
      { client: 'Mondelez International', project: 'eLearning Support', dates: '2015\u20132018', role: 'SCORM Technical Expert' },
      { client: 'Corning Incorporated', project: 'eLearning Support', dates: '2018\u20132020', role: 'SCORM/LMS Technical Specialist' },
      { client: 'Pella Corporation', project: 'eLearning Platform & Course Development', dates: '2014\u20132016', role: 'LMS/SCORM Integration Engineer' },
      { client: 'Keurig Dr Pepper', project: 'SuccessFactors SCORM Integration', dates: '2018', role: 'Lead SCORM Troubleshooting Expert' },
    ],
  },
  {
    industry: 'Government, Professional Services & Other',
    entries: [
      { client: 'U.S. Dept. of Justice', project: 'Civil Division Flash Content Conversion', dates: '2019', role: 'Technical Lead (Assessment)' },
      { client: 'Hilton Hotels', project: 'Legacy LMS Content Conversion', dates: '2013', role: 'Technical Lead (SCORM Packaging)' },
      { client: 'Boston Consulting Group', project: 'Content Support & Flash Readiness', dates: '2018\u20132019', role: 'Technical Lead (Content Analysis)' },
      { client: 'GP Strategies (Internal)', project: 'Technical Consulting', dates: '2021', role: 'Internal SME / Technical Consultant' },
      { client: 'GP Strategies (GPU)', project: 'GP University LMS', dates: '2018\u20132020', role: 'SCORM/LMS Troubleshooting Specialist' },
    ],
  },
]
