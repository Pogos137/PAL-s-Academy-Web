/* ==========================================================================
   library.js — content registry: realms, sources, paths, and the add() helper
   Data files call PAL.add(sourceId, [...]) to register ideas.
   ========================================================================== */
(function () {
  'use strict';

  const PAL = (window.PAL = window.PAL || {});

  /* ---------------------------------------------------------------- realms */
  PAL.topics = [
    { id: 'medicine',    name: 'Clinical Medicine',      emoji: '🩺', blurb: 'Disease mechanisms, pharmacology, diagnosis, acute care.' },
    { id: 'anatomy',     name: 'Anatomy',                emoji: '🦴', blurb: 'Structure — musculoskeletal, neural, visceral, palpable.' },
    { id: 'physiology',  name: 'Physiology',             emoji: '🫀', blurb: 'How the living system actually runs, organ by organ.' },
    { id: 'kinesiology', name: 'Kinesiology',            emoji: '🏃', blurb: 'Biomechanics, motor control, training science, rehab.' },
    { id: 'nutrition',   name: 'Nutrition & Metabolism', emoji: '🥗', blurb: 'Fuel, energy systems, body composition, evidence on supplements.' },
    { id: 'recovery',    name: 'Sleep & Longevity',      emoji: '😴', blurb: 'Sleep architecture, stress physiology, healthspan.' },
    { id: 'neuro',       name: 'Neuroscience & Mind',    emoji: '🧠', blurb: 'Brain, behaviour, emotion, motivation, trauma.' },
    { id: 'learning',    name: 'Learning & Memory',      emoji: '📚', blurb: 'How to acquire hard knowledge and keep it.' },
    { id: 'habits',      name: 'Habits & Discipline',    emoji: '⚙️', blurb: 'Behaviour design, focus, follow-through, work ethic.' },
    { id: 'influence',   name: 'Influence & Social Power', emoji: '🎭', blurb: 'Persuasion, seduction, negotiation, charisma, human nature.' },
    { id: 'philosophy',  name: 'Philosophy & Meaning',   emoji: '🏛️', blurb: 'Stoicism, ethics, mortality, purpose, ego.' },
    { id: 'money',       name: 'Money & Business',       emoji: '💰', blurb: 'Wealth mechanics, leverage, offers, personal finance.' },
    { id: 'thinking',    name: 'Decision Making',        emoji: '♟️', blurb: 'Mental models, bias, probability, forecasting, risk.' },
    { id: 'craft',       name: 'Creativity & Craft',     emoji: '✍️', blurb: 'Making things, writing, resistance, taste.' },
    { id: 'history',     name: 'History & Civilization', emoji: '🌍', blurb: 'How humans got here — and how medicine got here.' },
    { id: 'science',     name: 'Science & Systems',      emoji: '🔬', blurb: 'Physics, chemistry, genetics, complexity, statistics.' }
  ];

  /* --------------------------------------------------------------- sources */
  // kind: 'book' | 'guide'
  const S = (id, title, author, topic, kind, blurb) => ({ id, title, author, topic, kind, blurb });

  PAL.sources = [
    /* medicine */
    S('pathophys',     'Pathophysiology Core',            'PAL Academy',        'medicine', 'guide', 'Mechanisms of disease from cell injury to organ failure.'),
    S('pharm',         'Pharmacology Core',               'PAL Academy',        'medicine', 'guide', 'How drugs move, act, interact, and go wrong.'),
    S('clin-reasoning','Clinical Reasoning',              'PAL Academy',        'medicine', 'guide', 'Thinking like a diagnostician instead of a search engine.'),
    S('diagnostics',   'Diagnostics & Lab Interpretation','PAL Academy',        'medicine', 'guide', 'Tests, thresholds, and what a number actually means.'),
    S('emergency',     'Acute & Emergency Medicine',      'PAL Academy',        'medicine', 'guide', 'Time-critical patterns and the first ten minutes.'),
    S('micro-immuno',  'Microbiology & Immunology',       'PAL Academy',        'medicine', 'guide', 'Pathogens, defence, inflammation, vaccines.'),

    /* anatomy */
    S('anat-msk',      'Musculoskeletal Anatomy',         'PAL Academy',        'anatomy', 'guide', 'Bones, joints, muscles and the nerves that drive them.'),
    S('anat-neuro',    'Neuroanatomy',                    'PAL Academy',        'anatomy', 'guide', 'Cortex to spinal cord, tracts, and blood supply.'),
    S('anat-viscera',  'Thorax, Abdomen & Pelvis',        'PAL Academy',        'anatomy', 'guide', 'Visceral anatomy with the clinical landmarks that matter.'),
    S('anat-surface',  'Surface & Palpation Anatomy',     'PAL Academy',        'anatomy', 'guide', 'Finding structures with your hands, not a screen.'),

    /* physiology */
    S('phys-cardio',   'Cardiovascular Physiology',       'PAL Academy',        'physiology', 'guide', 'Pump, pipes, pressure and the loops that regulate them.'),
    S('phys-resp',     'Respiratory Physiology',          'PAL Academy',        'physiology', 'guide', 'Ventilation, diffusion, perfusion and gas transport.'),
    S('phys-renal',    'Renal Physiology & Acid–Base',    'PAL Academy',        'physiology', 'guide', 'Filtration, sodium, potassium, and pH defence.'),
    S('phys-endo',     'Endocrine Physiology',            'PAL Academy',        'physiology', 'guide', 'Hormone axes, feedback, and metabolic control.'),
    S('phys-gi',       'Gastrointestinal Physiology',     'PAL Academy',        'physiology', 'guide', 'Digestion, absorption, motility, liver, microbiome.'),
    S('phys-exercise', 'Exercise Physiology',             'PAL Academy',        'physiology', 'guide', 'What changes acutely and chronically when you train.'),

    /* kinesiology */
    S('kin-biomech',   'Biomechanics',                    'PAL Academy',        'kinesiology', 'guide', 'Levers, torque, tissue mechanics, loading.'),
    S('kin-motor',     'Motor Control & Learning',        'PAL Academy',        'kinesiology', 'guide', 'How movement is planned, corrected and made permanent.'),
    S('kin-strength',  'Strength & Conditioning Science', 'PAL Academy',        'kinesiology', 'guide', 'Programming that follows physiology instead of folklore.'),
    S('kin-rehab',     'Rehabilitation & Injury',         'PAL Academy',        'kinesiology', 'guide', 'Tissue healing timelines and return-to-play logic.'),
    S('kin-gait',      'Gait & Posture',                  'PAL Academy',        'kinesiology', 'guide', 'The walking cycle, balance, and postural control.'),

    /* nutrition */
    S('nut-core',      'Nutrition Science Core',          'PAL Academy',        'nutrition', 'guide', 'Macronutrients, energy balance, and food quality.'),
    S('nut-metab',     'Metabolism & Energy Systems',     'PAL Academy',        'nutrition', 'guide', 'ATP, substrate use, and metabolic flexibility.'),
    S('nut-supp',      'Supplements, Evidence-Weighted',  'PAL Academy',        'nutrition', 'guide', 'What has real data behind it and what does not.'),

    /* recovery */
    S('bk-why-we-sleep','Why We Sleep',                   'Matthew Walker',     'recovery', 'book', 'The case that sleep is the foundational health behaviour.'),
    S('bk-outlive',    'Outlive',                         'Peter Attia',        'recovery', 'book', 'Medicine 3.0 and playing the long game on healthspan.'),
    S('bk-breath',     'Breath',                          'James Nestor',       'recovery', 'book', 'How we breathe and why it goes wrong.'),
    S('stress-core',   'Stress Physiology & Recovery',    'PAL Academy',        'recovery', 'guide', 'HPA axis, allostatic load, and real recovery levers.'),

    /* neuro */
    S('neuro-core',    'Neuroscience Core',               'PAL Academy',        'neuro', 'guide', 'Neurons, transmitters, plasticity, networks.'),
    S('bk-behave',     'Behave',                          'Robert Sapolsky',    'neuro', 'book', 'Human behaviour explained across every timescale.'),
    S('bk-body-score', 'The Body Keeps the Score',        'Bessel van der Kolk','neuro', 'book', 'Trauma as a physiological, not just psychological, event.'),
    S('bk-molecule',   'The Molecule of More',            'Lieberman & Long',   'neuro', 'book', 'Dopamine as the chemistry of anticipation.'),

    /* learning */
    S('bk-make-stick', 'Make It Stick',                   'Brown, Roediger & McDaniel', 'learning', 'book', 'The evidence base for how learning actually sticks.'),
    S('bk-ultralearning','Ultralearning',                 'Scott H. Young',     'learning', 'book', 'Aggressive self-directed skill acquisition.'),
    S('bk-mind-numbers','A Mind for Numbers',             'Barbara Oakley',     'learning', 'book', 'Focused and diffuse modes for technical material.'),
    S('learn-core',    'Study Systems for Medicine',      'PAL Academy',        'learning', 'guide', 'Applying learning science to enormous curricula.'),

    /* habits */
    S('bk-atomic',     'Atomic Habits',                   'James Clear',        'habits', 'book', 'Small behavioural changes compounded through systems.'),
    S('bk-power-habit','The Power of Habit',              'Charles Duhigg',     'habits', 'book', 'Cue, routine, reward — and how habits reshape lives.'),
    S('bk-deep-work',  'Deep Work',                       'Cal Newport',        'habits', 'book', 'Concentration as an increasingly rare, valuable skill.'),
    S('bk-tiny-habits','Tiny Habits',                     'BJ Fogg',            'habits', 'book', 'Behaviour = motivation, ability and prompt.'),
    S('bk-cant-hurt',  "Can't Hurt Me",                   'David Goggins',      'habits', 'book', 'Voluntary hardship as a training method for the mind.'),
    S('bk-so-good',    "So Good They Can't Ignore You",   'Cal Newport',        'habits', 'book', 'Skill first, passion second — the craftsman mindset.'),

    /* influence */
    S('bk-seduction',  'The Art of Seduction',            'Robert Greene',      'influence', 'book', 'Attraction as a psychological process you can understand.'),
    S('bk-48-laws',    'The 48 Laws of Power',            'Robert Greene',      'influence', 'book', 'How power has historically been won, held and lost.'),
    S('bk-influence',  'Influence',                       'Robert Cialdini',    'influence', 'book', 'The six-plus levers behind automatic compliance.'),
    S('bk-never-split','Never Split the Difference',      'Chris Voss',         'influence', 'book', 'Hostage-negotiation tactics for ordinary conversations.'),
    S('bk-win-friends','How to Win Friends and Influence People', 'Dale Carnegie', 'influence', 'book', 'The durable basics of dealing with people.'),
    S('bk-charisma',   'The Charisma Myth',               'Olivia Fox Cabane',  'influence', 'book', 'Presence, power and warmth as trainable behaviours.'),
    S('bk-human-nature','The Laws of Human Nature',       'Robert Greene',      'influence', 'book', 'Reading character, envy, narcissism and self-deception.'),

    /* philosophy */
    S('bk-meditations','Meditations',                     'Marcus Aurelius',    'philosophy', 'book', 'A Roman emperor arguing himself into virtue, nightly.'),
    S('bk-mans-search','Man’s Search for Meaning',   'Viktor Frankl',      'philosophy', 'book', 'Meaning as survival equipment.'),
    S('bk-seneca',     'Letters from a Stoic',            'Seneca',             'philosophy', 'book', 'Practical Stoicism in letters to a friend.'),
    S('bk-ego',        'Ego Is the Enemy',                'Ryan Holiday',       'philosophy', 'book', 'Ego at aspiration, success and failure.'),

    /* money */
    S('bk-psych-money','The Psychology of Money',         'Morgan Housel',      'money', 'book', 'Behaviour beats spreadsheets in financial outcomes.'),
    S('bk-naval',      'The Almanack of Naval Ravikant',  'Eric Jorgenson',     'money', 'book', 'Leverage, specific knowledge and wealth without luck.'),
    S('bk-zero-one',   'Zero to One',                     'Peter Thiel',        'money', 'book', 'Building things that have never existed.'),
    S('bk-100m',       '$100M Offers',                    'Alex Hormozi',       'money', 'book', 'Constructing offers people feel stupid saying no to.'),
    S('money-core',    'Personal Finance Core',           'PAL Academy',        'money', 'guide', 'The unglamorous mechanics that decide outcomes.'),

    /* thinking */
    S('bk-fast-slow',  'Thinking, Fast and Slow',         'Daniel Kahneman',    'thinking', 'book', 'Two systems, and the systematic errors of the fast one.'),
    S('bk-antifragile','Antifragile',                     'Nassim Taleb',       'thinking', 'book', 'Things that gain from disorder.'),
    S('bk-munger',     'Poor Charlie’s Almanack',    'Charlie Munger',     'thinking', 'book', 'Worldly wisdom through a latticework of models.'),
    S('bk-superforecast','Superforecasting',              'Philip Tetlock',     'thinking', 'book', 'Forecasting as a measurable, improvable skill.'),
    S('models-core',   'Mental Models Toolkit',           'PAL Academy',        'thinking', 'guide', 'Portable reasoning tools from many disciplines.'),

    /* craft */
    S('bk-war-art',    'The War of Art',                  'Steven Pressfield',  'craft', 'book', 'Resistance as the universal enemy of creative work.'),
    S('bk-steal',      'Steal Like an Artist',            'Austin Kleon',       'craft', 'book', 'Influence, imitation and finding a voice.'),
    S('bk-writing-well','On Writing Well',                'William Zinsser',    'craft', 'book', 'Clarity, simplicity, humanity in nonfiction.'),
    S('bk-made-stick', 'Made to Stick',                   'Chip & Dan Heath',   'craft', 'book', 'Why some ideas survive and others die.'),

    /* history */
    S('bk-sapiens',    'Sapiens',                         'Yuval Noah Harari',  'history', 'book', 'A brief history of how one ape took over.'),
    S('bk-guns-germs', 'Guns, Germs, and Steel',          'Jared Diamond',      'history', 'book', 'Geography as the deep cause of unequal outcomes.'),
    S('bk-nations-fail','Why Nations Fail',               'Acemoglu & Robinson','history', 'book', 'Institutions, not culture or climate, decide prosperity.'),
    S('hist-medicine', 'A History of Medicine',           'PAL Academy',        'history', 'guide', 'From humours to randomised trials.'),

    /* science */
    S('sci-core',      'Physics & Chemistry Essentials',  'PAL Academy',        'science', 'guide', 'The physical rules everything else obeys.'),
    S('sci-systems',   'Systems, Complexity & Statistics','PAL Academy',        'science', 'guide', 'Feedback, emergence, and reading evidence honestly.'),
    S('sci-genetics',  'Genetics & Molecular Biology',    'PAL Academy',        'science', 'guide', 'DNA to phenotype, and what heritability really means.'),

    /* ---- second wave ---------------------------------------------------- */
    /* medicine */
    S('clin-cardio',   'Clinical Cardiology',             'PAL Academy',        'medicine', 'guide', 'Ischaemia, failure, arrhythmia and valves at the bedside.'),
    S('clin-neuro',    'Clinical Neurology',              'PAL Academy',        'medicine', 'guide', 'Localise the lesion, then name it.'),
    S('clin-resp',     'Clinical Respiratory Medicine',   'PAL Academy',        'medicine', 'guide', 'Airways, parenchyma, vasculature and the pleural space.'),
    S('clin-endo',     'Clinical Endocrinology & Diabetes','PAL Academy',       'medicine', 'guide', 'Axes that fail, and the metabolic disease that dominates practice.'),
    S('clin-msk',      'Rheumatology & MSK Medicine',     'PAL Academy',        'medicine', 'guide', 'Inflammatory versus mechanical, and how to tell fast.'),
    S('clin-psych',    'Psychiatry Essentials',           'PAL Academy',        'medicine', 'guide', 'Mental illness as medicine, with mechanisms and evidence.'),
    S('bk-being-mortal','Being Mortal',                   'Atul Gawande',       'medicine', 'book', 'What medicine owes people it cannot cure.'),
    S('bk-checklist',  'The Checklist Manifesto',         'Atul Gawande',       'medicine', 'book', 'Why competent experts still need a list.'),

    /* anatomy */
    S('anat-head-neck','Head & Neck Anatomy',             'PAL Academy',        'anatomy', 'guide', 'Triangles, fascial planes, and the paths infection takes.'),
    S('anat-embryo',   'Embryology',                      'PAL Academy',        'anatomy', 'guide', 'Where adult anatomy comes from — and why it goes wrong.'),
    S('anat-histo',    'Histology',                       'PAL Academy',        'anatomy', 'guide', 'The four basic tissues and how to read a slide.'),

    /* physiology */
    S('phys-neuro',    'Neurophysiology',                 'PAL Academy',        'physiology', 'guide', 'Membranes, synapses, reflexes and sensory coding.'),
    S('phys-blood',    'Blood & Immunophysiology',        'PAL Academy',        'physiology', 'guide', 'Haemostasis, oxygen carriage, and the defence system at work.'),

    /* kinesiology */
    S('kin-testing',   'Assessment & Testing',            'PAL Academy',        'kinesiology', 'guide', 'Measuring capacity honestly enough to program from it.'),
    S('kin-endurance', 'Endurance Training Science',      'PAL Academy',        'kinesiology', 'guide', 'Zones, polarisation, and what actually drives aerobic gains.'),

    /* nutrition */
    S('nut-clinical',  'Clinical Nutrition',              'PAL Academy',        'nutrition', 'guide', 'Malnutrition, refeeding, and nutrition in disease.'),

    /* recovery */
    S('sleep-clinical','Sleep Disorders',                 'PAL Academy',        'recovery', 'guide', 'Apnoea, insomnia, circadian disorders and what to do about them.'),

    /* learning */
    S('bk-peak',       'Peak',                            'Ericsson & Pool',    'learning', 'book', 'Deliberate practice, and what expertise actually requires.'),

    /* habits */
    S('bk-grit',       'Grit',                            'Angela Duckworth',   'habits', 'book', 'Passion and perseverance for long-term goals.'),
    S('bk-mindset',    'Mindset',                         'Carol Dweck',        'habits', 'book', 'Fixed versus growth beliefs about ability.'),
    S('bk-4000-weeks', 'Four Thousand Weeks',             'Oliver Burkeman',    'habits', 'book', 'Time management for mortals who cannot do everything.'),

    /* influence */
    S('bk-pre-suasion','Pre-Suasion',                     'Robert Cialdini',    'influence', 'book', 'The moment before the message does most of the work.'),
    S('bk-attached',   'Attached',                        'Levine & Heller',    'influence', 'book', 'Attachment styles and why relationships repeat.'),

    /* philosophy */
    S('bk-obstacle',   'The Obstacle Is the Way',         'Ryan Holiday',       'philosophy', 'book', 'Perception, action and will applied to adversity.'),

    /* thinking */
    S('bk-black-swan', 'The Black Swan',                  'Nassim Taleb',       'thinking', 'book', 'The outsized role of rare, unpredictable events.'),
    S('bk-scout',      'The Scout Mindset',               'Julia Galef',        'thinking', 'book', 'Seeing clearly instead of defending a position.'),
    S('bk-range',      'Range',                           'David Epstein',      'thinking', 'book', 'Why generalists triumph in a specialised world.'),

    /* craft */
    S('bk-bird',       'Bird by Bird',                    'Anne Lamott',        'craft', 'book', 'Writing, and the permission to be bad first.'),

    /* history */
    S('bk-emperor',    'The Emperor of All Maladies',     'Siddhartha Mukherjee','history', 'book', 'A biography of cancer and the people who fought it.'),
    S('bk-henrietta',  'The Immortal Life of Henrietta Lacks', 'Rebecca Skloot','history', 'book', 'HeLa cells, consent, and who medicine is built on.'),

    /* science */
    S('sci-evolution', 'Evolution & Evolutionary Medicine','PAL Academy',       'science', 'guide', 'Selection, drift, and why bodies are imperfectly designed.'),
    S('bk-gene',       'The Gene',                        'Siddhartha Mukherjee','science', 'book', 'Heredity from Mendel to CRISPR.'),
    S('bk-selfish-gene','The Selfish Gene',               'Richard Dawkins',    'science', 'book', 'The gene-centred view of evolution.')
  ];

  PAL.sourceMap = {};
  PAL.sources.forEach(s => { PAL.sourceMap[s.id] = s; });
  PAL.topicMap = {};
  PAL.topics.forEach(t => { PAL.topicMap[t.id] = t; });

  /* ----------------------------------------------------------------- paths */
  // Ordered curricula. Completing one = genuine coverage of a realm.
  PAL.paths = [
    { id: 'p-msk',      name: 'Musculoskeletal Mastery', emoji: '🦴',
      blurb: 'Structure → mechanics → training → injury. The full movement stack.',
      sources: ['anat-msk', 'kin-biomech', 'kin-gait', 'kin-strength', 'kin-rehab'] },
    { id: 'p-physio',   name: 'The Physiology Spine', emoji: '🫀',
      blurb: 'Every major organ system, in the order that makes them click.',
      sources: ['phys-cardio', 'phys-resp', 'phys-renal', 'phys-endo', 'phys-gi', 'phys-exercise'] },
    { id: 'p-clinical', name: 'Clinical Foundations', emoji: '🩺',
      blurb: 'From mechanism to bedside decision under time pressure.',
      sources: ['pathophys', 'micro-immuno', 'pharm', 'diagnostics', 'clin-reasoning', 'emergency'] },
    { id: 'p-operator', name: 'The Disciplined Operator', emoji: '⚙️',
      blurb: 'Build the behavioural machinery that makes everything else possible.',
      sources: ['bk-atomic', 'bk-tiny-habits', 'bk-deep-work', 'bk-power-habit', 'bk-cant-hurt', 'bk-so-good'] },
    { id: 'p-social',   name: 'Social Power', emoji: '🎭',
      blurb: 'Read people, move people, and stay hard to move yourself.',
      sources: ['bk-influence', 'bk-win-friends', 'bk-charisma', 'bk-never-split', 'bk-seduction', 'bk-48-laws', 'bk-human-nature'] },
    { id: 'p-mind',     name: 'Mind & Memory', emoji: '🧠',
      blurb: 'The learning engine you will run every other path on.',
      sources: ['learn-core', 'bk-make-stick', 'bk-mind-numbers', 'bk-ultralearning', 'neuro-core'] },
    { id: 'p-longevity',name: 'The Longevity Stack', emoji: '😴',
      blurb: 'Sleep, food, stress and training as one integrated system.',
      sources: ['bk-why-we-sleep', 'nut-core', 'nut-metab', 'stress-core', 'bk-breath', 'bk-outlive'] },
    { id: 'p-thinking', name: 'Clear Thinking', emoji: '♟️',
      blurb: 'Debug your own reasoning before it costs you something.',
      sources: ['bk-fast-slow', 'models-core', 'bk-munger', 'bk-superforecast', 'bk-antifragile'] },
    { id: 'p-renaissance', name: 'The Renaissance Mind', emoji: '🌍',
      blurb: 'One serious source from every realm. The generalist’s tour.',
      sources: ['bk-sapiens', 'sci-core', 'sci-genetics', 'bk-meditations', 'bk-psych-money', 'bk-war-art', 'bk-writing-well', 'hist-medicine'] }
  ];

  /* ------------------------------------------------------------------ add() */
  PAL.ideas = [];

  const seq = {};   // per-source counter, so a source can be extended across files

  /**
   * Register ideas against a source.
   * Compact authoring shape:
   *   t = title, b = body, k = kind, g = tags[], c = clinical correlate,
   *   q = recall question, a = answer, m = mnemonic,
   *   r = key into PAL.refs for a specific primary citation
   */
  PAL.add = function (sourceId, items) {
    const src = PAL.sourceMap[sourceId];
    if (!src) { console.warn('[PAL] unknown source:', sourceId); return; }
    items.forEach(it => {
      seq[sourceId] = (seq[sourceId] || 0) + 1;
      PAL.ideas.push({
        id: sourceId + '-' + seq[sourceId],
        sourceId: sourceId,
        topic: src.topic,
        title: it.t,
        body: it.b,
        kind: it.k || (src.kind === 'book' ? 'insight' : 'concept'),
        tags: it.g || [],
        clinical: it.c || null,
        q: it.q || null,
        a: it.a || null,
        mnemonic: it.m || null,
        ref: it.r || null
      });
    });
  };

  /* --------------------------------------------------------- lookups/index */
  PAL.build = function () {
    PAL.ideaMap = {};
    PAL.bySource = {};
    PAL.byTopic = {};
    // attach the reference basis declared in data/references.js
    PAL.sourceRefs = PAL.sourceRefs || {};
    PAL.refs = PAL.refs || {};
    PAL.sources.forEach(s => { s.ref = PAL.sourceRefs[s.id] || null; });
    PAL.ideas.forEach(idea => {
      PAL.ideaMap[idea.id] = idea;
      (PAL.bySource[idea.sourceId] = PAL.bySource[idea.sourceId] || []).push(idea);
      (PAL.byTopic[idea.topic] = PAL.byTopic[idea.topic] || []).push(idea);
    });
    PAL.sources.forEach(s => { s.count = (PAL.bySource[s.id] || []).length; });
    PAL.topics.forEach(t => {
      t.count = (PAL.byTopic[t.id] || []).length;
      t.sources = PAL.sources.filter(s => s.topic === t.id);
    });
    // lower-cased blob for search
    PAL.ideas.forEach(i => {
      const s = PAL.sourceMap[i.sourceId];
      i._blob = (i.title + ' ' + i.body + ' ' + i.tags.join(' ') + ' ' +
                 (i.clinical || '') + ' ' + s.title + ' ' + s.author).toLowerCase();
    });
  };

  /* Deterministic shuffle so the "For You" feed is stable within a day. */
  PAL.seededShuffle = function (arr, seed) {
    const a = arr.slice();
    let s = seed >>> 0 || 1;
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) >>> 0;
      const j = s % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
})();
