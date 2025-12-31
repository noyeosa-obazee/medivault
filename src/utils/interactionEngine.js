const DRUG_ALIASES = {
  // Painkillers
  tylenol: "acetaminophen",
  panadol: "acetaminophen",
  paracetamol: "acetaminophen",
  advil: "ibuprofen",
  motrin: "ibuprofen",
  aleve: "naproxen",
  bayer: "aspirin",
  ecotrin: "aspirin",

  // Antibiotics
  cipro: "ciprofloxacin",
  zithromax: "azithromycin",
  "z-pak": "azithromycin",
  augmentin: "amoxicillin",
  flagyl: "metronidazole",

  // Heart/BP
  lipitor: "atorvastatin",
  zocor: "simvastatin",
  prinivil: "lisinopril",
  zestril: "lisinopril",
  norvasc: "amlodipine",
  coumadin: "warfarin",
  plavix: "clopidogrel",
  lanoxin: "digoxin",
  viagra: "sildenafil",
  nitrostat: "nitroglycerin",

  // Mood/Sleep
  prozac: "fluoxetine",
  zoloft: "sertraline",
  xanax: "alprazolam",
  valium: "diazepam",
  ambien: "zolpidem",
  ultram: "tramadol",

  // Other
  glucophage: "metformin",
  lasix: "furosemide",
  prilosec: "omeprazole",
  beer: "alcohol",
  wine: "alcohol",
  liquor: "alcohol",
};

const INTERACTION_DB = {
  // --- WARFARIN (The most dangerous drug for interactions) ---
  "aspirin+warfarin":
    "⚠️ HIGH RISK: Major bleeding risk. Aspirin intensifies the blood-thinning effect of Warfarin.",
  "ibuprofen+warfarin":
    "⚠️ HIGH RISK: Stomach bleeding. NSAIDs damage the stomach lining while Warfarin thins the blood.",
  "acetaminophen+warfarin":
    "Moderate risk. High doses of Tylenol/Panadol can increase INR (blood thinning levels).",
  "ciprofloxacin+warfarin":
    "⚠️ HIGH RISK: Antibiotic interferes with Warfarin metabolism, causing dangerous bleeding.",
  "fluconazole+warfarin":
    "⚠️ HIGH RISK: Dramatically increases Warfarin levels.",
  "metronidazole+warfarin": "⚠️ HIGH RISK: Prevents Warfarin breakdown.",

  // --- NSAIDs (Ibuprofen, Aspirin, Naproxen) ---
  "aspirin+ibuprofen":
    "Ibuprofen may block the heart-protecting effects of low-dose Aspirin.",
  "ibuprofen+lisinopril":
    "Reduces the effectiveness of the blood pressure medication and risks kidney strain.",
  "ibuprofen+naproxen":
    "Duplicate therapy. Taking two NSAIDs increases risk of stomach ulcers and bleeding.",
  "furosemide+ibuprofen":
    "Ibuprofen reduces the diuretic effect of Lasix and can harm kidneys.",

  // --- ANTIBIOTICS ---
  "alcohol+metronidazole":
    "⚠️ DANGER: Disulfiram-like reaction. Causes severe vomiting, rapid heart rate, and flushing.",
  "ciprofloxacin+theophylline":
    "Increases Theophylline toxicity (nausea, tremors, palpitations).",
  "azithromycin+ondansetron":
    "Heart rhythm warning. Both drugs can prolong QT interval (irregular heartbeat).",
  "ciprofloxacin+dairy":
    "Calcium binds to the antibiotic, preventing it from working. (Separate by 2 hours).",

  // --- HEART / BLOOD PRESSURE ---
  "nitroglycerin+sildenafil":
    "☠️ FATAL RISK: Combining Viagra with Nitrates causes sudden, catastrophic drop in blood pressure.",
  "lisinopril+potassium":
    "Risk of Hyperkalemia (High Potassium). Can cause dangerous heart rhythms.",
  "digoxin+verapamil":
    "Increases Digoxin levels, leading to toxicity (nausea, vision changes).",
  "amlodipine+simvastatin":
    "Limit Simvastatin to 20mg. Risk of muscle damage (Rhabdomyolysis) increases.",

  // --- ANTIDEPRESSANTS (Serotonin Syndrome) ---
  "fluoxetine+tramadol":
    "⚠️ SEROTONIN SYNDROME: Risk of seizures and confusion.",
  "sertraline+tramadol":
    "⚠️ SEROTONIN SYNDROME: Agitation, fever, rapid heart rate.",
  "fluoxetine+st. john's wort": "Duplicate therapy. Too much serotonin.",
  "linezolid+sertraline":
    "⚠️ DANGER: MAOI interaction. Severe hypertension and serotonin syndrome.",

  // --- OPIOIDS & SEDATIVES ---
  "alcohol+alprazolam":
    "⚠️ DANGER: Respiratory depression. Stops breathing when sleeping.",
  "alcohol+diazepam": "⚠️ DANGER: Extreme sedation and risk of overdose.",
  "alcohol+tramadol": "Increases risk of respiratory depression and seizure.",
  "alprazolam+oxycodone":
    "⚠️ DANGER: Combining Benzos and Opioids is a leading cause of overdose death.",

  // --- OTHER COMMON ONES ---
  "alcohol+acetaminophen":
    "Liver damage risk. Alcohol depletes glutathione needed to process Tylenol.",
  "clopidogrel+omeprazole":
    "Omeprazole may make Plavix less effective at preventing blood clots.",
  "birth control+antibiotics":
    "Some antibiotics (like Rifampin) make birth control pills less effective.",
};

const normalize = (name) => {
  const lower = name.toLowerCase().trim();

  return DRUG_ALIASES[lower] || lower;
};

export const checkSafety = async (newDrugName, currentDrugList) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newGeneric = normalize(newDrugName);

  for (const existingDrug of currentDrugList) {
    const existingGeneric = normalize(existingDrug.name);

    const pairKey = [newGeneric, existingGeneric].sort().join("+");

    if (INTERACTION_DB[pairKey]) {
      return {
        safe: false,
        warning: INTERACTION_DB[pairKey],
        conflictingDrug: existingDrug.name,
      };
    }
  }

  return { safe: true };
};
