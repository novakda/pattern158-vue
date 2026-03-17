<script setup lang="ts">
import TestimonialQuote from '@/components/TestimonialQuote.vue'
import HeroMinimal from '@/components/HeroMinimal.vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'

useBodyClass('page-philosophy')
useSeo({
  title: 'Philosophy | Pattern 158 - Dan Novak',
  description: 'The philosophy behind Pattern 158 Solutions. How Dan Novak approaches complex system challenges with investigation-driven methodology and five core influences.',
  path: '/philosophy',
})
</script>

<template>
  <HeroMinimal title="Philosophy" subtitle="How I think about engineering problems" />

  <section id="brand-elements" class="content-section">
    <h2>The Brand Elements</h2>
    <p class="section-intro">Six patterns extracted from 28+ years of actual work — not marketing slogans, but recurring themes from real projects.</p>

    <dl class="brand-elements-list">
      <dt>1. Provider of Clarity</dt>
      <dd>
        <p><strong>The outcome.</strong> Enter chaos, deliver understanding. Legacy systems, undefined requirements, failing courses — hand Dan a mess, get back clarity.</p>
      </dd>

      <dt>2. I Cheat, But I Cheat Fair</dt>
      <dd>
        <p><strong>The method.</strong> Build tools that skip tedium through proper engineering — documented, maintainable, ethical optimization.</p>
        <p class="source-note">The Three Stooges, "Healthy, Wealthy and Dumb," 1938</p>
      </dd>

      <dt>3. Don't Fix the Bug, Build the Tool</dt>
      <dd>
        <p><strong>The approach.</strong> Don't solve individual problems; prevent entire categories of problems.</p>
      </dd>

      <dt>4. I Seek Knowledge Not for Gain, But to Better Understand Myself</dt>
      <dd>
        <p><strong>The motivation.</strong> Learn to understand systems and your own thinking, not to pad a resume.</p>
        <p class="source-note">Harry Potter fanfic — password to the Department of Mysteries</p>
      </dd>

      <dt>5. The Machine to Undo Time After Disaster</dt>
      <dd>
        <p><strong>The role.</strong> Tier 3 escalation — forensic engineering to understand what went wrong, then build the tool that prevents it again.</p>
        <p class="source-note">Same fanfic — the artifact guarded behind the password</p>
      </dd>

      <dt>6. TASBot for [Domain]</dt>
      <dd>
        <p><strong>The creative application.</strong> Tool-assisted optimization applied to professional work — understand the rules deeply, then build tools that operate beyond manual precision.</p>
        <p class="source-note">Tool-Assisted Speedrunning culture</p>
      </dd>
    </dl>
  </section>

  <section id="how-i-work" class="content-section">
    <h2>How I Work</h2>
    <p class="section-intro">The three-step pattern that repeats across every project:</p>

    <ol class="methodology-steps">
      <li>
        <h3>Deconstruct the Chaos</h3>
        <p>I use forensic engineering to understand "black box" legacy systems. Never blame the human first — investigate the design. Systems thinking over code debugging.</p>
      </li>
      <li>
        <h3>Build the Tool</h3>
        <p>I create reusable frameworks (middleware, CMS templates, AI agents) to solve the root cause. Don't fix individual bugs — prevent entire categories of problems.</p>
      </li>
      <li>
        <h3>Empower the User</h3>
        <p>I hand off robust tools that make complex processes feel simple. Documented, maintainable, and built to outlast my involvement.</p>
      </li>
    </ol>

    <p class="methodology-note">This isn't marketing copy — it's the actual pattern from
      <router-link to="/exhibits/exhibit-j" class="link-primary">GM course completion investigation</router-link>,
      <router-link to="/exhibits/exhibit-e" class="link-primary">cross-domain SCORM framework</router-link>,
      <router-link to="/exhibits/exhibit-m" class="link-primary">SCORM Debugger</router-link>,
      legacy CMS rescue, and
      <router-link to="/exhibits/exhibit-l" class="link-primary">Power Platform analysis</router-link>.
    </p>
  </section>

  <section id="ai-and-clarity" class="content-section">
    <h2>On AI and Clarity</h2>
    <p class="section-intro">The same philosophy applies to how this site was written.</p>

    <div class="origin-story">
      <p>After 28 years of professional technical communication, my position is this: <strong>clarity is the product.</strong> The prose is just the delivery mechanism.</p>
      <p>I write in streams of consciousness. Always have. What comes out is tangled, recursive, full of half-finished thoughts that loop back on themselves. It's accurate. It's complete. It's also exhausting to read.</p>
      <p>For years, the solution was to agonize. Wordsmith the sentence. Spend twenty minutes sounding "professional" — which usually meant sounding like everyone else: fine, forgettable, friction-filled to produce.</p>
      <p>I'm not doing that anymore.</p>
      <p>Now I brain-dump, hand it to an AI, and review what comes back. The ideas are mine. The AI's job is to make it readable — to do what a good editor does, which is get out of the way of the meaning.</p>
      <p>This isn't laziness. It's the same philosophy I apply to code.</p>
      <p>Good code is self-documenting. When I inherit a codebase that needs a novel of inline comments to be navigable, that's a smell — the code is failing to communicate. Professional writing has the same failure mode.</p>
      <p>"AI wrote it" is a mischaracterization. AI <em>clarified</em> it. The thinking, the investigation, the conclusions — those are mine. What I'm outsourcing is the friction of translating thought into readable prose. That friction was never adding value.</p>
      <p>My prime directive is clarity. I'm not writing wedding vows. If an AI can take my tangled first draft and make it immediately readable — and I can review it, own it, and stand behind every word — the communication succeeded.</p>
      <p>The question isn't "did AI touch this."</p>
      <p><strong>The question is: does the reader understand what I meant to say?</strong></p>
      <p class="methodology-note">Much of this site was built with AI assistance — content, code, and design. The thinking behind it is mine. The clarity is the point. That's <em>Provider of Clarity</em> applied to its own medium.</p>
    </div>
  </section>

  <section id="pattern158-origin" class="content-section">
    <h2>Pattern 158 Origin</h2>
    <div class="origin-story">
      <p>The name comes from a puzzle in <em>Myst</em> — the 1993 point-and-click adventure game that defined a generation of puzzle enthusiasts.</p>
      <p>Near the end of the game, the brothers Sirrus and Achenar whisper a clue: <em>"The final page is in the fireplace... Pattern 158."</em> You find the pattern book in the library, turn to page 158, and enter the pattern on the fireplace grid. The wall rotates to reveal a hidden chamber.</p>
      <p>But here's the twist: the brothers are <em>manipulating</em> you. They're trapped in prison books, and they want you to retrieve their final pages so they can escape. They warn you not to touch the green book — because inside is their father Atrus, and he knows the truth about their treachery.</p>
      <p><strong>Pattern 158 = the code that reveals both the trap AND the true solution.</strong></p>
      <p>That's how I approach engineering problems. The obvious answer (the red and blue pages) is often a trap. The real solution (the green book) is sitting right next to it — you have to see through the manipulation to find it. The Myst reference signals pattern-recognition thinking to fellow geeks, while "solutions" keeps it professional for business contexts.</p>
      <p class="domain-note">The domain strategy: <strong>pattern158.solutions</strong> (primary), pattern158.dev (catches developers), pattern158.com (catches default searches). All point to the same portfolio.</p>
    </div>
  </section>

  <section id="influences" class="content-section">
    <h2>Five Core Influences</h2>
    <p class="section-intro">These aren't abstract inspirations — they're specific sources that shaped how I think about engineering problems.</p>

    <article class="influence">
      <h3>1. Air Crash Investigation Methodology</h3>
      <p><strong>Sources:</strong> Mayday (Air Crash Investigation TV), Mentour Pilot (YouTube), 74 Gear (YouTube)</p>
      <p><strong>What it taught:</strong> Never blame the human first — look at system design. The Swiss cheese model: disasters require contributing factors aligning. Root cause vs. proximate cause. How bad design sets people up to fail.</p>
      <p><strong>Career application:</strong> The <router-link to="/exhibits/exhibit-j" class="link-primary">GM course completion investigation</router-link> is the textbook example. GM reported a 4x spike in incomplete courses and assumed a tracking bug. I ran an NTSB-style investigation — technical forensics (Fiddler, browser debugging), UX analysis, user interviews. The root cause wasn't a single bug; fragile architecture, confusing navigation, and sales reps taking training on poor WiFi between customer meetings aligned to create the failure pattern.</p>
    </article>

    <article class="influence">
      <h3>2. Speedrunning / TASBot Culture</h3>
      <p><strong>Sources:</strong> TASBot demonstrations, tool-assisted speedruns, emulator save states</p>
      <p><strong>What it taught:</strong> Save states for instant replay. Frame-perfect optimization. Tool-assisted mastery — using tools to understand and optimize a system beyond what manual work can achieve.</p>
      <p><strong>Career application:</strong> The <router-link to="/exhibits/exhibit-m" class="link-primary">SCORM Debugger</router-link> is the direct embodiment — "TASBot for eLearning." Testing gated courses meant manually clicking through every section to reach the part you needed to test. Hours per cycle. I built a Vue.js wrapper with a fake SCORM API: save course state at any point, restore it instantly, edit SCORM values directly, jump to any section. Testing cycles dropped from hours to seconds. Pure speedrunning methodology applied to professional work.</p>
    </article>

    <article class="influence">
      <h3>3. &ldquo;You want to cheat, cheat fair &mdash; anything I hate is a crookin&rsquo; crook.&rdquo;</h3>
      <p><strong>Source:</strong> Moe Howard &mdash; &ldquo;Healthy, Wealthy and Dumb,&rdquo; The Three Stooges (1938)</p>
      <p><strong>What it taught:</strong> The distinction between clever shortcuts and corner-cutting. Working smarter through knowledge, not by bypassing rules.</p>
      <p><strong>Career application:</strong> Every tool I build "cheats" by automating tedium, but within engineering standards because the output is proper, documented, and maintainable. The <router-link to="/exhibits/exhibit-e" class="link-primary">cross-domain SCORM framework</router-link> cheated by eliminating manual zip-file email chains, with proper CORS engineering, version control, and production-grade quality. The SCORM Debugger cheated by bypassing hours of manual clicking, generating legitimate SCORM API responses. This philosophy is the brand tagline for Pattern 158.</p>
    </article>

    <article class="influence">
      <h3>4. Mentour Pilot's AI App</h3>
      <p><strong>Timeline:</strong> ~2022-2023 (2-3 years before my own AI work)</p>
      <p><strong>What it showed:</strong> A domain expert (commercial airline pilot) building an AI assistant that made his expertise accessible and practically useful — not AI hype, but actual utility.</p>
      <p><strong>Career application:</strong> This planted the seed for AI as a practical work tool. When the <router-link to="/exhibits/exhibit-l" class="link-primary">Power Platform project</router-link> landed with departed vendors and undefined requirements, the Mentour Pilot model was already in my head: domain expert + AI assistant = force multiplier. GitHub Spec Kit became my version — using AI to pressure-test intuition and confirm foundational gaps. It's not about replacing human judgment; it's about augmenting it with systematic analysis.</p>
    </article>

    <article class="influence">
      <h3>5. Harry Potter Fanfic Quote</h3>
      <p><strong>Source:</strong> "I seek knowledge not for gain, but to better understand myself" — password to the Department of Mysteries in a Harry Potter fanfic</p>
      <p><strong>What it taught:</strong> The purest motivation for learning. Knowledge pursued for understanding, not advantage.</p>
      <p><strong>Career application:</strong> I don't learn Power Platform to pad my resume; I learn it to understand where its boundaries are. I don't reverse-engineer a legacy CMS to fix bugs; I do it to understand the mind of the engineer who built it. I don't study SCORM specifications to bill more hours; I study them to understand why LMS vendors interpret the spec differently. The knowledge isn't the goal — the understanding is. This quote (and the accompanying concept of "The Machine to Undo Time After Disaster") became two of the six brand elements.</p>
    </article>
  </section>

  <section class="testimonial testimonial-divider">
    <div class="container">
      <h2 class="section-heading-styled">What Colleagues Say</h2>
      <TestimonialQuote
        quote="Thank you so much for Dan for putting time into thinking this through and writing it up."
        cite="Program Manager, Microsoft Account"
        context="GP Strategies — on a SCORM architecture analysis document"
      />
      <TestimonialQuote
        quote="Dan, thank you for being such a team player with the GP team and the client, and thank you for your incredible knowledge and expertise."
        cite="Account Manager, GP Strategies"
        context="Entergy engagement — on cross-team collaboration"
        variant="secondary"
      />
    </div>
  </section>
</template>
