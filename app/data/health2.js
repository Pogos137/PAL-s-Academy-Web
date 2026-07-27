/* Nutrition, Sleep & Longevity — second wave ------------------------------ */

PAL.add('nut-clinical', [
{ t: "Malnutrition is common in hospital and routinely missed",
  b: "Depending on setting, 20–50% of hospital inpatients are malnourished or at risk on admission, and many deteriorate further during the stay. Malnutrition independently predicts infection, poor wound healing, longer stay and mortality.",
  g: ["malnutrition", "screening"],
  c: "Validated screening tools such as MUST exist because clinical impression consistently underestimates it." },
{ t: "Refeeding syndrome is a phosphate emergency",
  b: "Reintroducing carbohydrate after starvation triggers insulin release, driving phosphate, potassium and magnesium into cells. Serum levels crash, and cardiac and respiratory failure can follow. High-risk patients need slow calorie reintroduction, thiamine before feeding, and daily electrolytes.",
  g: ["refeeding syndrome", "phosphate"],
  q: "The defining electrolyte disturbance of refeeding syndrome is {{hypophosphataemia}}.",
  a: "Hypophosphataemia, usually with hypokalaemia and hypomagnesaemia." },
{ t: "Feed the gut if the gut works",
  b: "Enteral nutrition maintains mucosal integrity, reduces bacterial translocation, and carries fewer infectious complications and lower cost than parenteral nutrition. Parenteral feeding is reserved for a non-functioning or inaccessible gut.",
  g: ["enteral", "parenteral"] },
{ t: "Sarcopenia is a diagnosable condition, not just ageing",
  b: "Loss of muscle mass with reduced strength or physical performance, defined by measurable thresholds. It predicts falls, disability and mortality, and it responds to resistance training combined with adequate protein — making it one of the more reversible geriatric syndromes.",
  g: ["sarcopenia", "ageing"] },
{ t: "Older adults need more protein, not less",
  b: "Anabolic resistance means the same protein dose produces less muscle protein synthesis with age. Recommendations for older adults sit around 1.0–1.2 g/kg/day, higher during illness — well above the general adult reference intake.",
  g: ["protein", "anabolic resistance", "ageing"] },
{ t: "Alcohol displaces nutrition as well as damaging the liver",
  b: "Heavy use causes thiamine deficiency (Wernicke's encephalopathy), folate deficiency, magnesium depletion and impaired protein synthesis. Thiamine must be given before glucose in a suspected case, because glucose loading can precipitate Wernicke's.",
  g: ["alcohol", "thiamine", "Wernicke"],
  m: "Wernicke's triad: confusion, ataxia, ophthalmoplegia — and only about a third have all three." },
{ t: "Bariatric surgery creates lifelong nutritional obligations",
  b: "Malabsorptive and restrictive procedures produce predictable deficiencies — iron, B12, folate, calcium, vitamin D, thiamine. Supplementation and monitoring are permanent, and patients lost to follow-up present years later with neurological or bone disease.",
  g: ["bariatric surgery", "deficiency"] },
{ t: "Vitamin D deficiency has an easy target and an oversold reputation",
  b: "It clearly matters for bone and muscle, and correcting deficiency in the deficient is worthwhile. Large randomised trials have not supported the wider claims about cancer, cardiovascular disease and mortality in replete populations.",
  g: ["vitamin D", "evidence"] }
]);

PAL.add('sleep-clinical', [
{ t: "Obstructive sleep apnoea is common, treatable and under-diagnosed",
  b: "Repeated upper airway collapse causes intermittent hypoxia, arousals and fragmented sleep, driving daytime sleepiness, hypertension, arrhythmia and stroke risk. A large proportion of moderate-to-severe cases in the community remain undiagnosed.",
  g: ["OSA", "apnoea"],
  c: "STOP-BANG is the standard screening tool: Snoring, Tiredness, Observed apnoea, Pressure, BMI, Age, Neck, Gender." },
{ t: "CPAP works when it is worn",
  b: "Continuous positive airway pressure reliably abolishes apnoeas and improves daytime sleepiness and quality of life. Its effect on hard cardiovascular endpoints has been less clear in trials, largely because average nightly adherence in those trials was low.",
  g: ["CPAP", "adherence"] },
{ t: "CBT for insomnia outperforms hypnotics long term",
  b: "Cognitive behavioural therapy for insomnia is first-line in every major guideline. It produces durable improvement after treatment ends, whereas hypnotics work while taken, carry dependence and falls risk, and rebound on withdrawal.",
  g: ["CBT-I", "insomnia"] },
{ t: "Sleep restriction therapy is counterintuitive and effective",
  b: "The core component of CBT-I deliberately compresses time in bed to match actual sleep time, building sleep pressure and re-associating bed with sleeping. It temporarily worsens sleepiness before it works, which is why it needs proper explanation.",
  g: ["sleep restriction", "CBT-I"] },
{ t: "Circadian rhythm disorders are timing problems, not quantity problems",
  b: "Delayed sleep phase, advanced phase and non-24-hour disorders involve normal sleep occurring at socially wrong times. Treatment is timed light exposure and melatonin, which shift the clock — not sedatives, which do not.",
  g: ["circadian", "light therapy", "melatonin"] },
{ t: "Restless legs is often iron deficiency",
  b: "An urge to move the legs, worse at rest and in the evening, relieved by movement. Serum ferritin below roughly 75 µg/L warrants iron replacement even without anaemia, and correcting it resolves symptoms in a meaningful proportion.",
  g: ["restless legs", "ferritin"] },
{ t: "Shift work is a recognised occupational health hazard",
  b: "Chronic circadian misalignment is associated with metabolic syndrome, cardiovascular disease and gastrointestinal disorders, and night shift work is classified as a probable human carcinogen by IARC. Mitigation is scheduling design, not individual willpower.",
  g: ["shift work", "circadian misalignment"] },
{ t: "Sleep restriction impairs glucose handling within a week",
  b: "In a controlled study, restricting healthy young men to four hours in bed for six nights produced measurably impaired glucose tolerance and altered endocrine function — changes described at the time as resembling early diabetes and ageing.",
  g: ["sleep debt", "insulin", "metabolism"],
  r: "spiegel1999" }
]);

/* ---- appended ---------------------------------------------------------- */
PAL.add('nut-core', [
{ t: "Sodium guidance is about the population, not the individual",
  b: "Population-level sodium reduction lowers average blood pressure and cardiovascular events. Individual response varies widely — salt-sensitive individuals respond substantially, others barely at all — which is why public health advice and personal advice can reasonably differ.",
  g: ["sodium", "blood pressure"] },
{ t: "Alcohol has no established safe cardiovascular threshold",
  b: "The old J-shaped curve suggesting light drinking protects the heart has largely dissolved under Mendelian randomisation and better control for sick quitters. Current large analyses find risk rising from low levels of intake for most outcomes.",
  g: ["alcohol", "evidence revision"] },
{ t: "Energy availability, not just calories, drives dysfunction in athletes",
  b: "Relative energy deficiency in sport describes what happens when intake fails to cover training expenditure plus basic physiology: menstrual dysfunction, bone loss, impaired immunity, mood change and reduced performance. It occurs at body weights that look normal.",
  g: ["RED-S", "energy availability"],
  c: "Stress fractures in a lean athlete should prompt a question about energy availability, not just about training load." },
{ t: "Fruit and vegetable benefit plateaus around five portions",
  b: "Large pooled analyses find mortality benefit rising with intake and flattening at roughly five portions a day, with vegetables contributing at least as much as fruit. Beyond that, additional portions add little measurable benefit.",
  g: ["fruit and vegetables", "dose response"] }
]);

PAL.add('nut-supp', [
{ t: "Creatine is being studied well beyond sport",
  b: "The same position stand reviews clinical applications across neurodegenerative disease, diabetes, osteoarthritis, ageing and brain and cardiac ischaemia. The evidence quality varies considerably by indication, but the safety profile is what makes the breadth of study possible.",
  g: ["creatine", "clinical applications"],
  r: "kreider2017" },
{ t: "Melatonin is a chronobiotic more than a hypnotic",
  b: "Low doses taken several hours before habitual sleep shift circadian timing effectively; high doses taken at bedtime have only a modest sedative effect. Most people use it in the way that works least well.",
  g: ["melatonin", "circadian"] }
]);

PAL.add('bk-outlive', [
{ t: "The five tactical domains",
  b: "Exercise, nutrition, sleep, emotional health and — carefully — pharmacology and supplements. Attia's ordering is deliberate: the first four are where nearly all the available benefit sits, and the last is where most attention goes.",
  g: ["framework", "priorities"] },
{ t: "Risk is cumulative exposure, not a snapshot",
  b: "For atherosclerosis, what matters is the integral of apoB particle exposure over decades, not the value on today's lipid panel. That reframing is what justifies intervening early in a 40-year-old with no symptoms.",
  g: ["cumulative exposure", "apoB"] },
]);

PAL.add('stress-core', [
{ t: "Loneliness is a physiological stressor with mortality effects",
  b: "Social isolation and loneliness are associated with increased all-cause mortality in meta-analyses, with effect sizes broadly comparable to well-established risk factors. Mechanisms include altered inflammatory signalling, sleep disruption and reduced health behaviour.",
  g: ["loneliness", "social connection", "mortality"] },
{ t: "Perceived stress predicts outcomes better than objective stressors",
  b: "How threatening a situation is judged to be, and how much control is felt over it, predicts physiological and health outcomes more strongly than the objective severity of the event. This is why appraisal is a legitimate intervention target.",
  g: ["appraisal", "perceived stress"] },
{ t: "Exercise is among the best-evidenced stress interventions",
  b: "Regular aerobic exercise reduces resting sympathetic tone, improves HRV, and produces antidepressant and anxiolytic effects with effect sizes comparable to first-line treatments in mild to moderate presentations.",
  g: ["exercise", "mental health"] },
{ t: "Nature exposure has small but consistent effects",
  b: "Time in green space is associated with lower cortisol, blood pressure and self-reported stress across a large observational literature and a growing number of trials. Effects are modest, cheap to obtain, and unusually free of downside.",
  g: ["nature", "green space"] }
]);

PAL.add('bk-why-we-sleep', [
{ t: "Read the book alongside its critics",
  b: "Why We Sleep is an excellent argument for taking sleep seriously, and a detailed critique by Alexey Guzey identified overstatements and misreported figures in parts of it. The underlying science on sleep's importance stands; several specific claims in the book are stronger than the evidence supports.",
  g: ["evidence appraisal", "criticism"],
  c: "This is a useful general lesson: a popular science book can be directionally right and unreliable on specifics. Check the numbers you plan to repeat." },
{ t: "Sleep need is individual but the distribution is narrow",
  b: "Most adults need seven to nine hours. Genuine short sleepers carrying rare variants such as DEC2 exist but are a very small fraction of the population — far smaller than the fraction of people who believe they belong to it.",
  g: ["sleep need", "short sleepers"] },
{ t: "Sleep inertia is real and affects decisions",
  b: "Cognitive performance immediately after waking is measurably impaired for anywhere from fifteen minutes to over an hour, and is worse after waking from deep sleep. This matters for anyone on call making decisions minutes after being woken.",
  g: ["sleep inertia", "on call"] }
]);
