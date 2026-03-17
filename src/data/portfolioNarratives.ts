export interface Narrative {
  title: string
  description: string
  clients: string
}

export const narratives: Narrative[] = [
  {
    title: 'Enterprise Integration Architect',
    description: 'Complex multi-system integrations where nothing was designed to work together. Cross-domain SCORM dispatch, federated platform facades, protocol translation layers.',
    clients: 'GDEB \u00b7 HSBC \u00b7 GM \u00b7 Wells Fargo \u00b7 BP \u00b7 SunTrust',
  },
  {
    title: 'AI-Driven Legacy Modernization',
    description: 'Forensic engineering amplified by AI tooling. Using LLMs to pressure-test analysis, generate baselines, and surface gaps that manual review misses.',
    clients: 'Microsoft MCAPS \u00b7 Power Platform \u00b7 GitHub Spec Kit \u00b7 Copilot Studio',
  },
  {
    title: 'Learning Systems Expert',
    description: 'Deep eLearning standards knowledge \u2014 SCORM, xAPI, AICC at the protocol level. LMS architecture, accessibility methodology, cross-platform content delivery.',
    clients: 'Rustici integration \u00b7 SCORM Debugger \u00b7 CSBB Dispatch \u00b7 TD Bank a11y',
  },
]
