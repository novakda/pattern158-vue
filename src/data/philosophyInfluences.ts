export interface InfluenceLink {
  to: string
  text: string
}

export interface PhilosophyInfluence {
  title: string
  sources: string
  lesson: string
  applicationParts: (string | InfluenceLink)[]
}

export const philosophyInfluences: PhilosophyInfluence[] = [
  {
    title: '1. Air Crash Investigation Methodology',
    sources: 'Mayday (Air Crash Investigation TV), Mentour Pilot (YouTube), 74 Gear (YouTube)',
    lesson: 'Never blame the human first \u2014 look at system design. The Swiss cheese model: disasters require contributing factors aligning. Root cause vs. proximate cause. How bad design sets people up to fail.',
    applicationParts: [
      'The ',
      { to: '/exhibits/exhibit-j', text: 'GM course completion investigation' },
      ' is the textbook example. GM reported a 4x spike in incomplete courses and assumed a tracking bug. I ran an NTSB-style investigation \u2014 technical forensics (Fiddler, browser debugging), UX analysis, user interviews. The root cause wasn\u2019t a single bug; fragile architecture, confusing navigation, and sales reps taking training on poor WiFi between customer meetings aligned to create the failure pattern.',
    ],
  },
  {
    title: '2. Speedrunning / TASBot Culture',
    sources: 'TASBot demonstrations, tool-assisted speedruns, emulator save states',
    lesson: 'Save states for instant replay. Frame-perfect optimization. Tool-assisted mastery \u2014 using tools to understand and optimize a system beyond what manual work can achieve.',
    applicationParts: [
      'The ',
      { to: '/exhibits/exhibit-m', text: 'SCORM Debugger' },
      ' is the direct embodiment \u2014 \u201cTASBot for eLearning.\u201d Testing gated courses meant manually clicking through every section to reach the part you needed to test. Hours per cycle. I built a Vue.js wrapper with a fake SCORM API: save course state at any point, restore it instantly, edit SCORM values directly, jump to any section. Testing cycles dropped from hours to seconds. Pure speedrunning methodology applied to professional work.',
    ],
  },
  {
    title: '3. \u201cYou want to cheat, cheat fair \u2014 anything I hate is a crookin\u2019 crook.\u201d',
    sources: 'Moe Howard \u2014 \u201cHealthy, Wealthy and Dumb,\u201d The Three Stooges (1938)',
    lesson: 'The distinction between clever shortcuts and corner-cutting. Working smarter through knowledge, not by bypassing rules.',
    applicationParts: [
      'Every tool I build \u201ccheats\u201d by automating tedium, but within engineering standards because the output is proper, documented, and maintainable. The ',
      { to: '/exhibits/exhibit-e', text: 'cross-domain SCORM framework' },
      ' cheated by eliminating manual zip-file email chains, with proper CORS engineering, version control, and production-grade quality. The SCORM Debugger cheated by bypassing hours of manual clicking, generating legitimate SCORM API responses. This philosophy is the brand tagline for Pattern 158.',
    ],
  },
  {
    title: '4. Mentour Pilot\u2019s AI App',
    sources: '~2022-2023 (2-3 years before my own AI work)',
    lesson: 'A domain expert (commercial airline pilot) building an AI assistant that made his expertise accessible and practically useful \u2014 not AI hype, but actual utility.',
    applicationParts: [
      'This planted the seed for AI as a practical work tool. When the ',
      { to: '/exhibits/exhibit-l', text: 'Power Platform project' },
      ' landed with departed vendors and undefined requirements, the Mentour Pilot model was already in my head: domain expert + AI assistant = force multiplier. GitHub Spec Kit became my version \u2014 using AI to pressure-test intuition and confirm foundational gaps. It\u2019s not about replacing human judgment; it\u2019s about augmenting it with systematic analysis.',
    ],
  },
  {
    title: '5. Harry Potter Fanfic Quote',
    sources: '\u201cI seek knowledge not for gain, but to better understand myself\u201d \u2014 password to the Department of Mysteries in a Harry Potter fanfic',
    lesson: 'The purest motivation for learning. Knowledge pursued for understanding, not advantage.',
    applicationParts: [
      'I don\u2019t learn Power Platform to pad my resume; I learn it to understand where its boundaries are. I don\u2019t reverse-engineer a legacy CMS to fix bugs; I do it to understand the mind of the engineer who built it. I don\u2019t study SCORM specifications to bill more hours; I study them to understand why LMS vendors interpret the spec differently. The knowledge isn\u2019t the goal \u2014 the understanding is. This quote (and the accompanying concept of \u201cThe Machine to Undo Time After Disaster\u201d) became two of the six brand elements.',
    ],
  },
]
