/**
 * Article — AI detectors don't work.
 *
 * The highest-stakes article on the site: it is read by school leaders who
 * can check every figure, and it sits next to a page selling them training.
 * Every number here was verified against the primary source in a dedicated
 * research pass. Two things were CUT during that pass and must not come back:
 *
 *   1. A "15–26% false-positive rate, International Journal for Educational
 *      Integrity" figure. No such study exists. It appears to be OpenAI's
 *      retired classifier stats (caught 26% of AI text, false-flagged 9% of
 *      human text) mangled into a range. The real IJEI study — Weber-Wulff
 *      et al. — reports something different and stronger, used below.
 *   2. "98% accuracy" attributed to Turnitin. That figure is not in
 *      Turnitin's current published material; it circulates in press and old
 *      marketing. Turnitin's own published claims are quoted instead.
 *
 * The neurodivergent-bias claim is deliberately hedged: the supporting work
 * is a book chapter plus Bloomberg reporting, not a large empirical study.
 * Do not upgrade the phrasing to "studies show".
 */
export default {
  hero: {
    label: 'Insights',
    title: ['AI detectors', 'don’t work'],
    intro: [
      'It is the first question in every staffroom, and the honest answer is not the one the software gives you. This is what independent testing found, and what a growing list of universities decided to do about it.',
    ],
  },

  sections: [
    {
      kind: 'answer',
      body: [
        'No independent test has found an AI writing detector accurate enough to accuse a student on. The largest published evaluation found every tool it tested scored below 80% accuracy. A Stanford study found detectors wrongly flagged 61.3% of essays by students writing in a second language. Curtin, UQ and the ANU have all now switched detection off.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What the testing found',
      body: [
        'The most cited evaluation is Weber-Wulff et al., published in the International Journal for Educational Integrity in 2023. It put fourteen detection tools, Turnitin among them, through a controlled test. Not one reached 80% accuracy. Only five got past 70%. Six of the fourteen produced false positives — human writing labelled as machine-written.',
        'The authors’ own summary is that the tools are “neither accurate nor reliable”. That is a direct quote from a peer-reviewed paper about the entire product category, not a vendor comparison or a blog post.',
        'Worth knowing about their bias direction, because it is the opposite of what most people assume: the tools leaned toward calling text human. They miss AI writing more often than they invent it. The false positives are the rarer error, which is exactly why they are so damaging when they land — nobody is expecting one.',
      ],
    },

    {
      kind: 'prose',
      heading: 'Who gets wrongly flagged',
      body: [
        'In 2023 a Stanford team ran seven widely used GPT detectors over 91 TOEFL essays, all written by humans, all by students whose first language is not English. The detectors wrongly flagged 61.3% of them on average. Nearly one in five was flagged by every detector in the test. Over 97% were flagged by at least one.',
        'The same detectors were close to perfect on essays written by native-speaking American eighth-graders. The difference is not that one group cheated. It is that detectors work by measuring how predictable the writing is, and someone writing carefully in a second language produces exactly the flat, regular prose the tools associate with a machine.',
        'That mechanism catches other students too. Anyone who writes in short, plain sentences produces low-variability text. Researchers have warned that neurodivergent students are more likely to be hit by false positives, and Bloomberg documented the case of an autistic student flagged and given a zero. Neither of those is a large empirical study, so treat it as a warning rather than a measurement — but it is a warning from people who have looked closely.',
      ],
    },

    {
      kind: 'quote',
      quote: 'At the false-positive rate Turnitin publishes for itself, a university submitting 75,000 papers a year is wrongly accusing about 750 students.',
      attribution: 'The arithmetic Vanderbilt published when it turned the tool off.',
    },

    {
      kind: 'prose',
      heading: 'What Turnitin says about Turnitin',
      body: [
        'This is the part worth reading twice, because it comes from the vendor rather than a critic. Turnitin publishes a false-positive rate of “under 1%” for documents containing more than 20% AI writing. At the level of individual sentences, the figure it gives is around 4% — roughly one highlighted sentence in twenty-five may be human-written.',
        'And in its own FAQ: the percentage on the AI writing indicator “should not be used as the sole basis for action”. The company selling the detector is telling schools not to act on the number alone. That instruction is frequently the first casualty once the score is in front of somebody.',
        'One more piece of context. OpenAI built a classifier to detect its own model’s output and withdrew it in July 2023, citing low accuracy. It caught about a quarter of AI-written text and falsely flagged nearly one in ten human samples. The company with the most training data and the strongest commercial reason to solve this could not.',
      ],
    },

    {
      kind: 'table',
      heading: 'Institutions that have switched detection off',
      head: ['Institution', 'Decision', 'Effective'],
      rows: [
        ['Vanderbilt University (US)', 'Disabled Turnitin’s AI detector', 'August 2023'],
        ['Australian National University', 'Not used for academic integrity matters', 'January 2024'],
        ['Australian Catholic University', 'Stopped using the AI indicator (per ABC News)', 'March 2025'],
        ['University of Queensland', 'AI Writing Indicator withdrawn', 'Semester 2, 2025'],
        ['University of Waterloo (Canada)', 'Detection tool withdrawn', 'September 2025'],
        ['Curtin University', 'AI writing detection disabled', '1 January 2026'],
      ],
    },

    {
      kind: 'prose',
      body: [
        'Curtin is the one that matters most to a WA school, because it is the university a good share of your Year 12s will walk into. From the start of this year they are marking without it. Waterloo went further and said why: their own IT testing found the product flagging human-written text as “100% generated by AI”, more than once.',
        'None of these institutions decided that AI use stopped being a problem. They decided the detector was not evidence.',
      ],
    },

    {
      kind: 'process',
      heading: 'What works instead',
      steps: [
        {
          title: 'Treat a score as a reason to look, never as a finding',
          text: 'A flag is a prompt to open a conversation. It is not a result, it cannot be shown to a parent as proof, and on the vendor’s own instruction it cannot be the sole basis for action.',
        },
        {
          title: 'Design the task so the process is visible',
          text: 'Drafts, planning notes, an in-class writing stage, a short verbal follow-up on the argument. Work that shows its own development is far harder to outsource and far easier to defend if it is ever questioned.',
        },
        {
          title: 'Say what is allowed, in writing, per task',
          text: 'Most students who use AI on work where it was not wanted were never told clearly. A one-line statement on the assessment sheet — what is permitted, what must be declared — removes most of the ambiguity before it becomes a case.',
        },
        {
          title: 'Ask students to declare use rather than hide it',
          text: 'A disclosure line turns AI use into something discussable. Detection turns it into something to conceal, which makes the concealment better rather than the use rarer.',
        },
        {
          title: 'Never open a misconduct process on a percentage alone',
          text: 'The Australian Catholic University processed thousands of flags in a year and later dismissed many of them, according to ABC reporting. The cost of that lands on students, on staff time, and on how much your families trust the school.',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'Why we publish this',
      body: [
        'We run [AI training for schools](/ai-training-for-schools), and we could sell more of it by leaving this vague. We have told this to every staffroom we have stood in, so it may as well be written down where a Head of Learning Area can check it before booking anything.',
        'Every figure above is linked to its source below. If any of it changes, the page changes.',
      ],
    },

    {
      kind: 'sources',
      heading: 'Sources',
      items: [
        {
          title: 'Testing of detection tools for AI-generated text (Weber-Wulff et al.)',
          publisher: 'International Journal for Educational Integrity, vol. 19, art. 26',
          year: '2023',
          url: 'https://edintegrity.biomedcentral.com/articles/10.1007/s40979-023-00146-z',
        },
        {
          title: 'GPT detectors are biased against non-native English writers (Liang, Yuksekgonul, Mao, Wu, Zou)',
          publisher: 'Patterns (Cell Press), vol. 4, art. 100779',
          year: '2023',
          url: 'https://www.cell.com/patterns/fulltext/S2666-3899(23)00130-7',
        },
        {
          title: 'Guidance on AI detection and why we’re disabling Turnitin’s AI detector',
          publisher: 'Vanderbilt University',
          year: '2023',
          url: 'https://www.vanderbilt.edu/brightspace/2023/08/16/guidance-on-ai-detection-and-why-were-disabling-turnitins-ai-detector/',
        },
        {
          title: 'Update on the Turnitin AI detection tool',
          publisher: 'Curtin University',
          year: '2025',
          url: 'https://www.curtin.edu.au/news/oasis-news/update-on-turnitin-ai-detection-tool/',
        },
        {
          title: 'Turnitin Similarity Report and AI Writing Indicator update',
          publisher: 'The University of Queensland',
          year: '2025',
          url: 'https://elearning.uq.edu.au/project/turnitin-similarity-report-and-ai-writing-indicator-update',
        },
        {
          title: 'Discontinuing use of AI detection functionality in Turnitin',
          publisher: 'University of Waterloo',
          year: '2025',
          url: 'https://uwaterloo.ca/associate-vice-president-academic/discontinuing-use-ai-detection-functionality-turnitin',
        },
        {
          title: 'Turnitin’s AI writing detection capabilities — FAQs',
          publisher: 'Turnitin',
          year: '2026',
          url: 'https://guides.turnitin.com/hc/en-us/articles/28477544839821-Turnitin-s-AI-writing-detection-capabilities-FAQs',
        },
        {
          title: 'Understanding the false positive rate for sentences of our AI writing detection capability',
          publisher: 'Turnitin',
          year: '2023',
          url: 'https://www.turnitin.com/blog/understanding-the-false-positive-rate-for-sentences-of-our-ai-writing-detection-capability',
        },
        {
          title: 'AI detection tools falsely accuse international students of cheating',
          publisher: 'The Markup',
          year: '2023',
          url: 'https://themarkup.org/machine-learning/2023/08/14/ai-detection-tools-falsely-accuse-international-students-of-cheating',
        },
      ],
    },
  ],

  faqs: [
    {
      q: 'Can Turnitin detect ChatGPT?',
      a: 'Sometimes, and not reliably enough to accuse anyone on. Turnitin publishes a document-level false-positive rate under 1% and a sentence-level rate around 4%, and states the score should not be the sole basis for action. Independent testing put every tool it evaluated below 80% accuracy.',
    },
    {
      q: 'A student has been flagged. What should we do?',
      a: 'Treat it as a prompt to talk, not a finding. Ask to see drafts and planning, and ask the student to talk through their argument. If there is no evidence beyond the percentage, there is no case — that is the vendor’s own position as much as ours.',
    },
    {
      q: 'Are detectors unfair to some students more than others?',
      a: 'Yes, and this is the best-evidenced problem with them. A Stanford study found seven detectors wrongly flagged 61.3% of human-written essays by students writing in a second language, while being near-perfect on native-speaker work. Anyone who writes in short, plain sentences is at raised risk for the same reason.',
    },
    {
      q: 'If we cannot detect it, how do we assess fairly?',
      a: 'By making the process visible rather than policing the output — drafts, in-class stages, a short verbal follow-up. It is more work to set up once and considerably less work than running misconduct cases you cannot substantiate.',
    },
    {
      q: 'Does this mean students should be allowed to use AI freely?',
      a: 'No. It means the rule has to be stated per task and the assessment designed around it. The schools handling this best are specific about what is permitted and ask for it to be declared, rather than relying on software to catch what was never clearly forbidden.',
    },
  ],

  cta: {
    heading: 'We run this session in schools',
    text: 'A half day with your staff on what actually works, using your own assessments. No student devices, no student data.',
  },
};
