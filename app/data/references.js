/* ==========================================================================
   references.js — provenance layer
   -------------------------------------------------------------------------
   PAL.sourceRefs : the standard reference work each source is written from.
   PAL.refs       : specific citations for individual empirical claims.
                    Every entry here was checked against PubMed; the PMID and
                    DOI are recorded so any claim can be traced to the paper.
   ========================================================================== */

/* ------------------------------------------------------- reference basis */
PAL.sourceRefs = {
  /* medicine */
  'pathophys':      'Kumar, Abbas & Aster — Robbins & Cotran Pathologic Basis of Disease, 10th ed.',
  'pharm':          'Katzung — Basic & Clinical Pharmacology, 15th ed.; British National Formulary',
  'clin-reasoning': 'Stern, Cifu & Altkorn — Symptom to Diagnosis, 4th ed.; Croskerry on diagnostic error',
  'diagnostics':    'Loscalzo et al. — Harrison’s Principles of Internal Medicine, 21st ed.; NICE diagnostics guidance',
  'emergency':      'Tintinalli’s Emergency Medicine, 9th ed.; Resuscitation Council UK and AHA ACLS guidelines',
  'micro-immuno':   'Murray — Medical Microbiology, 9th ed.; Abbas — Cellular and Molecular Immunology, 10th ed.',
  'clin-cardio':    'Libby et al. — Braunwald’s Heart Disease, 12th ed.; ESC and AHA/ACC guidelines',
  'clin-neuro':     'Ropper & Samuels — Adams and Victor’s Principles of Neurology, 12th ed.',
  'clin-resp':      'Broaddus et al. — Murray & Nadel’s Textbook of Respiratory Medicine, 7th ed.; GOLD and GINA reports',
  'clin-endo':      'Melmed et al. — Williams Textbook of Endocrinology, 15th ed.; ADA Standards of Care',
  'clin-msk':       'Firestein et al. — Kelley & Firestein’s Textbook of Rheumatology, 11th ed.; EULAR/ACR criteria',
  'clin-psych':     'Sadock — Kaplan & Sadock’s Synopsis of Psychiatry, 12th ed.; DSM-5-TR; NICE mental health guidance',
  'bk-being-mortal':'Gawande — Being Mortal (2014)',
  'bk-checklist':   'Gawande — The Checklist Manifesto (2009); WHO Surgical Safety Checklist',

  /* anatomy */
  'anat-msk':       'Moore — Clinically Oriented Anatomy, 9th ed.; Standring — Gray’s Anatomy, 42nd ed.',
  'anat-neuro':     'Blumenfeld — Neuroanatomy through Clinical Cases, 3rd ed.; Standring — Gray’s Anatomy, 42nd ed.',
  'anat-viscera':   'Moore — Clinically Oriented Anatomy, 9th ed.; Standring — Gray’s Anatomy, 42nd ed.',
  'anat-surface':   'Lumley — Surface Anatomy, 4th ed.; Moore — Clinically Oriented Anatomy, 9th ed.',
  'anat-head-neck': 'Standring — Gray’s Anatomy, 42nd ed.; Moore — Clinically Oriented Anatomy, 9th ed.',
  'anat-embryo':    'Moore, Persaud & Torchia — The Developing Human, 11th ed.; Sadler — Langman’s Medical Embryology, 14th ed.',
  'anat-histo':     'Mescher — Junqueira’s Basic Histology, 16th ed.; Ross & Pawlina — Histology: A Text and Atlas, 8th ed.',

  /* physiology */
  'phys-cardio':    'Hall & Hall — Guyton and Hall Textbook of Medical Physiology, 14th ed.; Klabunde — Cardiovascular Physiology Concepts, 3rd ed.',
  'phys-resp':      'West & Luks — West’s Respiratory Physiology: The Essentials, 11th ed.',
  'phys-renal':     'Eaton & Pooler — Vander’s Renal Physiology, 9th ed.',
  'phys-endo':      'Melmed et al. — Williams Textbook of Endocrinology, 15th ed.; Guyton and Hall, 14th ed.',
  'phys-gi':        'Barrett et al. — Ganong’s Review of Medical Physiology, 27th ed.; Johnson — Gastrointestinal Physiology, 9th ed.',
  'phys-exercise':  'Kenney, Wilmore & Costill — Physiology of Sport and Exercise, 8th ed.; ACSM’s Guidelines, 11th ed.',
  'phys-neuro':     'Kandel et al. — Principles of Neural Science, 6th ed.; Guyton and Hall, 14th ed.',
  'phys-blood':     'Hoffbrand — Essential Haematology, 8th ed.; Abbas — Cellular and Molecular Immunology, 10th ed.',

  /* kinesiology */
  'kin-biomech':    'Neumann — Kinesiology of the Musculoskeletal System, 3rd ed.; Hall — Basic Biomechanics, 9th ed.',
  'kin-motor':      'Schmidt & Lee — Motor Control and Learning, 6th ed.; Shumway-Cook & Woollacott — Motor Control, 6th ed.',
  'kin-strength':   'NSCA — Essentials of Strength Training and Conditioning, 4th ed.; ACSM’s Guidelines, 11th ed.',
  'kin-rehab':      'Brukner & Khan — Clinical Sports Medicine, 5th ed.; British Journal of Sports Medicine consensus statements',
  'kin-gait':       'Perry & Burnfield — Gait Analysis: Normal and Pathological Function, 2nd ed.',
  'kin-testing':    'NSCA — Essentials of Strength Training and Conditioning, 4th ed.; ACSM’s Guidelines for Exercise Testing and Prescription, 11th ed.',
  'kin-endurance':  'Seiler on intensity distribution; Jamnick et al. 2020 on training zones; Kenney, Wilmore & Costill, 8th ed.',

  /* nutrition */
  'nut-core':       'Gropper & Smith — Advanced Nutrition and Human Metabolism, 8th ed.; NIH Office of Dietary Supplements',
  'nut-metab':      'Frayn — Metabolic Regulation: A Human Perspective, 4th ed.',
  'nut-supp':       'ISSN position stands; Australian Institute of Sport Supplement Framework; Cochrane reviews',
  'nut-clinical':   'Mahan & Raymond — Krause’s Food & the Nutrition Care Process, 16th ed.; ESPEN guidelines',

  /* recovery */
  'bk-why-we-sleep':'Walker — Why We Sleep (2017), read against the primary sleep literature',
  'bk-outlive':     'Attia & Gifford — Outlive (2023)',
  'bk-breath':      'Nestor — Breath (2020)',
  'stress-core':    'Sapolsky — Why Zebras Don’t Get Ulcers, 3rd ed.; McEwen on allostatic load',
  'sleep-clinical': 'Kryger, Roth & Dement — Principles and Practice of Sleep Medicine, 7th ed.; AASM guidelines',

  /* neuro */
  'neuro-core':     'Kandel et al. — Principles of Neural Science, 6th ed.; Purves — Neuroscience, 6th ed.',
  'bk-behave':      'Sapolsky — Behave (2017)',
  'bk-body-score':  'van der Kolk — The Body Keeps the Score (2014)',
  'bk-molecule':    'Lieberman & Long — The Molecule of More (2018)',

  /* learning */
  'bk-make-stick':  'Brown, Roediger & McDaniel — Make It Stick (2014)',
  'bk-ultralearning':'Young — Ultralearning (2019)',
  'bk-mind-numbers':'Oakley — A Mind for Numbers (2014)',
  'learn-core':     'Dunlosky et al. 2013, Psychological Science in the Public Interest; Roediger & Karpicke on retrieval practice',
  'bk-peak':        'Ericsson & Pool — Peak (2016)',

  /* habits */
  'bk-atomic':      'Clear — Atomic Habits (2018)',
  'bk-power-habit': 'Duhigg — The Power of Habit (2012)',
  'bk-deep-work':   'Newport — Deep Work (2016)',
  'bk-tiny-habits': 'Fogg — Tiny Habits (2019)',
  'bk-cant-hurt':   'Goggins — Can’t Hurt Me (2018) — memoir, not a controlled study',
  'bk-so-good':     'Newport — So Good They Can’t Ignore You (2012)',
  'bk-grit':        'Duckworth — Grit (2016); note the construct is contested in later meta-analyses',
  'bk-mindset':     'Dweck — Mindset (2006); note replication debate over intervention effect sizes',
  'bk-4000-weeks':  'Burkeman — Four Thousand Weeks (2021)',

  /* influence */
  'bk-seduction':   'Greene — The Art of Seduction (2001) — historical and literary analysis, not empirical research',
  'bk-48-laws':     'Greene — The 48 Laws of Power (1998) — historical case analysis, not empirical research',
  'bk-influence':   'Cialdini — Influence: The Psychology of Persuasion, new and expanded ed. (2021)',
  'bk-never-split': 'Voss & Raz — Never Split the Difference (2016)',
  'bk-win-friends': 'Carnegie — How to Win Friends and Influence People (1936)',
  'bk-charisma':    'Cabane — The Charisma Myth (2012)',
  'bk-human-nature':'Greene — The Laws of Human Nature (2018)',
  'bk-pre-suasion': 'Cialdini — Pre-Suasion (2016)',
  'bk-attached':    'Levine & Heller — Attached (2010); Bowlby and Ainsworth attachment literature',

  /* philosophy */
  'bk-meditations': 'Marcus Aurelius — Meditations (Hays translation, 2002)',
  'bk-mans-search': 'Frankl — Man’s Search for Meaning (1946)',
  'bk-seneca':      'Seneca — Letters from a Stoic (Campbell translation)',
  'bk-ego':         'Holiday — Ego Is the Enemy (2016)',
  'bk-obstacle':    'Holiday — The Obstacle Is the Way (2014)',

  /* money */
  'bk-psych-money': 'Housel — The Psychology of Money (2020)',
  'bk-naval':       'Jorgenson — The Almanack of Naval Ravikant (2020)',
  'bk-zero-one':    'Thiel & Masters — Zero to One (2014)',
  'bk-100m':        'Hormozi — $100M Offers (2021)',
  'money-core':     'Bogle — The Little Book of Common Sense Investing; Collins — The Simple Path to Wealth',

  /* thinking */
  'bk-fast-slow':   'Kahneman — Thinking, Fast and Slow (2011); several priming studies cited in it have failed to replicate',
  'bk-antifragile': 'Taleb — Antifragile (2012)',
  'bk-munger':      'Kaufman (ed.) — Poor Charlie’s Almanack (2005)',
  'bk-superforecast':'Tetlock & Gardner — Superforecasting (2015); IARPA Good Judgment Project',
  'models-core':    'Meadows — Thinking in Systems; Parrish — The Great Mental Models; Munger’s Harvard Law School address',
  'bk-black-swan':  'Taleb — The Black Swan (2007)',
  'bk-scout':       'Galef — The Scout Mindset (2021)',
  'bk-range':       'Epstein — Range (2019)',

  /* craft */
  'bk-war-art':     'Pressfield — The War of Art (2002)',
  'bk-steal':       'Kleon — Steal Like an Artist (2012)',
  'bk-writing-well':'Zinsser — On Writing Well, 30th anniversary ed.',
  'bk-made-stick':  'Heath & Heath — Made to Stick (2007)',
  'bk-bird':        'Lamott — Bird by Bird (1994)',

  /* history */
  'bk-sapiens':     'Harari — Sapiens (2011); a popular synthesis — several claims are contested by specialists',
  'bk-guns-germs':  'Diamond — Guns, Germs, and Steel (1997); environmental determinism is debated by historians',
  'bk-nations-fail':'Acemoglu & Robinson — Why Nations Fail (2012)',
  'hist-medicine':  'Porter — The Greatest Benefit to Mankind (1997); Bynum — The History of Medicine (2008)',
  'bk-emperor':     'Mukherjee — The Emperor of All Maladies (2010)',
  'bk-henrietta':   'Skloot — The Immortal Life of Henrietta Lacks (2010)',

  /* science */
  'sci-core':       'Halliday, Resnick & Walker — Fundamentals of Physics, 11th ed.; Atkins — Physical Chemistry, 12th ed.',
  'sci-systems':    'Meadows — Thinking in Systems; Altman — Practical Statistics for Medical Research; Ioannidis 2005',
  'sci-genetics':   'Alberts et al. — Molecular Biology of the Cell, 7th ed.; Strachan & Read — Human Molecular Genetics, 5th ed.',
  'sci-evolution':  'Futuyma & Kirkpatrick — Evolution, 5th ed.; Nesse & Williams — Why We Get Sick',
  'bk-gene':        'Mukherjee — The Gene: An Intimate History (2016)',
  'bk-selfish-gene':'Dawkins — The Selfish Gene, 40th anniversary ed.'
};

/* --------------------------------------------- verified primary citations */
/* Each checked against PubMed — PMID and DOI recorded so the claim is traceable. */
PAL.refs = {
  morton2018: {
    text: 'Morton RW et al. Br J Sports Med. 2018;52(6):376–384.',
    note: 'Meta-analysis of 49 RCTs, 1863 participants. No further gains in fat-free mass above ~1.62 g/kg/day.',
    pmid: '28698222', doi: '10.1136/bjsports-2017-097608'
  },
  grindem2016: {
    text: 'Grindem H et al. Br J Sports Med. 2016;50(13):804–808.',
    note: 'Delaware-Oslo ACL cohort. Reinjury rate fell 51% for each month return was delayed, up to 9 months.',
    pmid: '27162233', doi: '10.1136/bjsports-2016-096031'
  },
  mandsager2018: {
    text: 'Mandsager K et al. JAMA Netw Open. 2018;1(6):e183605.',
    note: '122,007 patients. Reduced cardiorespiratory fitness carried risk comparable to or greater than smoking, CAD or diabetes.',
    pmid: '30646252', doi: '10.1001/jamanetworkopen.2018.3605'
  },
  hall2019: {
    text: 'Hall KD et al. Cell Metab. 2019;30(1):67–77.',
    note: 'Inpatient randomised crossover. Ultra-processed diet led to 508 ± 106 kcal/day more intake despite matched macronutrients.',
    pmid: '31105044', doi: '10.1016/j.cmet.2019.05.008'
  },
  saver2006: {
    text: 'Saver JL. Stroke. 2006;37(1):263–266.',
    note: 'Estimated 1.9 million neurons lost per minute of untreated large-vessel ischaemic stroke.',
    pmid: '16339467', doi: '10.1161/01.STR.0000196957.55928.ab'
  },
  studenski2011: {
    text: 'Studenski S et al. JAMA. 2011;305(1):50–58.',
    note: 'Pooled analysis, 34,485 adults aged 65+. Hazard ratio 0.88 per 0.1 m/s of gait speed.',
    pmid: '21205966', doi: '10.1001/jama.2010.1923'
  },
  kreider2017: {
    text: 'Kreider RB et al. J Int Soc Sports Nutr. 2017;14:18.',
    note: 'ISSN position stand. Up to 30 g/day for 5 years was safe and well tolerated in the populations studied.',
    pmid: '28615996', doi: '10.1186/s12970-017-0173-z'
  },
  spiegel1999: {
    text: 'Spiegel K, Leproult R, Van Cauter E. Lancet. 1999;354(9188):1435–1439.',
    note: 'Sleep restricted to 4 h for six nights impaired glucose tolerance and altered endocrine function in healthy young men.',
    pmid: '10543671', doi: '10.1016/S0140-6736(99)01376-8'
  },
  vandyk2019: {
    text: 'van Dyk N et al. Br J Sports Med. 2019;53(21):1362–1370.',
    note: 'Meta-analysis: Nordic hamstring programmes roughly halved hamstring injury rates across team sports.',
    pmid: '30808663', doi: '10.1136/bjsports-2018-100045'
  },
  heiderscheit2011: {
    text: 'Heiderscheit BC et al. Med Sci Sports Exerc. 2011;43(2):296–302.',
    note: 'Increasing step rate ~5–10% reduced energy absorbed at the knee and hip and shortened stride.',
    pmid: '20581720', doi: '10.1249/MSS.0b013e3181ebedf4'
  },
  sackett1996: {
    text: 'Sackett DL et al. BMJ. 1996;312(7023):71–72.',
    note: 'The founding statement of evidence-based medicine — evidence integrated with clinical expertise and patient values.',
    pmid: '8555924', doi: '10.1136/bmj.312.7023.71'
  }
};
