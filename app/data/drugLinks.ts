// Verified DrugBank accession IDs (checked against go.drugbank.com, Sep 2026)
// + exact outbound URL builders for PubChem / ChEMBL / RCSB.

export const DRUGBANK_IDS: Record<string, string> = {
  // EGFR
  Itraconazole: "DB01167",
  Cimetidine: "DB00501",
  Metformin: "DB00331",
  Niclosamide: "DB06803",
  // BRAF
  Amiodarone: "DB01118",
  Mefloquine: "DB00358",
  Sertraline: "DB01104",
  Pimozide: "DB01100",
  // TP53
  Sulfasalazine: "DB00795",
  Disulfiram: "DB00822",
  Digoxin: "DB00390",
  Atorvastatin: "DB01076",
  // KRAS
  Captopril: "DB01197",
  Auranofin: "DB00995",
  Pentamidine: "DB00738",
  Loperamide: "DB00836",
  // ALK
  Aripiprazole: "DB01238",
  Diltiazem: "DB00343",
  Ebselen: "DB12610",
  Chloroquine: "DB00608",
  // Expansion — repurposing candidates (all IDs verified vs go.drugbank.com)
  Losartan: "DB00678",
  Simvastatin: "DB00641",
  Fluoxetine: "DB00472",
  Propranolol: "DB00571",
  Diclofenac: "DB00586",
  Omeprazole: "DB00328",
  Verapamil: "DB00661",
  Haloperidol: "DB00502",
  Risperidone: "DB00734",
  Carbamazepine: "DB00564",
  Ciprofloxacin: "DB00537",
  Azithromycin: "DB00207",
  Dexamethasone: "DB01234",
  Methotrexate: "DB00563",
  Allopurinol: "DB00437",
  Loratadine: "DB00455",
  Cetirizine: "DB00341",
  "Valproic Acid": "DB00313",
  Aspirin: "DB00945",
  Ibuprofen: "DB01050",
  Acetaminophen: "DB00316",
  Furosemide: "DB00695",
  Spironolactone: "DB00421",
  Clonidine: "DB00575",
  Diphenhydramine: "DB01075",
  Ondansetron: "DB00904",
  Zolpidem: "DB00425",
  Diazepam: "DB00829",
  Amlodipine: "DB00053",
  Nifedipine: "DB01115",
};

export const drugbankUrl = (name: string): string | null => {
  const id = DRUGBANK_IDS[name];
  return id ? `https://go.drugbank.com/drugs/${id}` : null;
};

export const pubchemUrl = (cid: string | number): string =>
  `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`;

export const chemblActivitiesUrl = (chemblId: string): string =>
  `https://www.ebi.ac.uk/chembl/g/#browse/activities/${chemblId}`;

export const rcsbUrl = (pdbId: string): string =>
  `https://www.rcsb.org/structure/${pdbId}`;
