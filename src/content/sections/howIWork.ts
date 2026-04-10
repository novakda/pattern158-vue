export interface MethodologyStep {
  heading: string
  paragraphs: string[]
}

export const methodologySteps: MethodologyStep[] = [
  {
    heading: '1. Deconstruct the Chaos',
    paragraphs: [
      'Forensic engineering before solution engineering. Understand the actual system \u2014 not the documented one, not the stated one, not the one someone remembers from three years ago. The real one, running in production, behaving the way it behaves.',
      'Never blame the human first. When a system fails, the system designed the conditions for that failure. The Swiss cheese model: disasters require contributing factors to align. The person who clicked the wrong button is almost never the root cause.',
      'This is empathy with teeth. It\u2019s not about being charitable \u2014 it\u2019s about being accurate.',
    ],
  },
  {
    heading: '2. Build the Tool',
    paragraphs: [
      'Once you understand the real problem, don\u2019t fix the instance. Fix the category.',
      'A one-time fix is technical debt in disguise. A tool is a permanent reduction in the problem surface. The SCORM Debugger didn\u2019t fix one testing cycle \u2014 it eliminated hours of manual clicking from every testing cycle, permanently, for everyone who used it. The cross-domain SCORM framework didn\u2019t solve one client\u2019s delivery problem \u2014 it solved the structural impossibility that was blocking all cross-domain delivery, five years before the vendor community caught up.',
      'The goal is always the tool, never the ticket.',
    ],
  },
  {
    heading: '3. Empower the User',
    paragraphs: [
      'A tool that requires its creator to operate it is a dependency, not a solution. Everything I build is documented, maintainable, and designed to outlast my involvement.',
      'This is the hardest part to get right, and the part most engineers skip. You haven\u2019t solved the problem until someone else can own the solution.',
    ],
  },
]
