export interface TargetData {
    id: string;
    name: string;
    fullName: string;
    description: string;
    pdbId: string;
    mutationFrequency: string;
    pathway: string;
    drugs: {
        name: string;
        fdaStatus: string;
        indication: string;
        affinityScore: number; // in nM (lower is stronger binding) or binding energy kcal/mol
        bindingEnergy: string;
        mechanism: string;
        clinicalPhase: string;
        pubChemId: string;
    }[];
}

export const CANCER_TARGETS: Record<string, TargetData> = {
    EGFR: {
        id: "EGFR",
        name: "EGFR",
        fullName: "Epidermal Growth Factor Receptor",
        description: "Receptor tyrosine kinase frequently mutated or overexpressed in NSCLC and glioblastoma. Repurposing non-oncology or cross-indication approved drugs.",
        pdbId: "1M17",
        mutationFrequency: "18-35% in NSCLC (Adenocarcinoma)",
        pathway: "PI3K-Akt / MAPK Signaling Pathway",
        drugs: [
            {
                name: "Niclosamide",
                fdaStatus: "Approved Anthelmintic (Anti-parasitic)",
                indication: "Repurposed off-label as a multi-kinase and EGFR pathway blocker",
                affinityScore: 1.15,
                bindingEnergy: "-11.2 kcal/mol",
                mechanism: "Disrupts mitochondrial phosphorylation and inhibits STAT3/EGFR crosstalk",
                clinicalPhase: "Phase II Oncology Trials",
                pubChemId: "4477"
            },
            {
                name: "Itraconazole",
                fdaStatus: "Approved Antifungal Agent",
                indication: "Repurposed off-label for EGFR-driven NSCLC angiogenesis & tyrosine kinase inhibition",
                affinityScore: 1.45,
                bindingEnergy: "-10.8 kcal/mol",
                mechanism: "Potent antagonist of hedgehog signaling & non-competitive EGFR inhibitor",
                clinicalPhase: "Phase II Clinical Repurposing",
                pubChemId: "55283"
            },
            {
                name: "Simvastatin",
                fdaStatus: "Approved Cholesterol-lowering Statin",
                indication: "Repurposed off-label to disrupt EGFR membrane localization via lipid raft depletion",
                affinityScore: 1.70,
                bindingEnergy: "-10.2 kcal/mol",
                mechanism: "HMG-CoA reductase inhibition reducing EGFR clustering in cholesterol-rich microdomains",
                clinicalPhase: "Phase II Repurposing",
                pubChemId: "54454"
            },
            {
                name: "Diclofenac",
                fdaStatus: "Approved Non-steroidal Anti-inflammatory (NSAID)",
                indication: "Repurposed off-label for suppressing EGFR-driven tumor inflammation and proliferation",
                affinityScore: 2.00,
                bindingEnergy: "-9.9 kcal/mol",
                mechanism: "COX-2 inhibition with direct binding to the EGFR kinase hinge region",
                clinicalPhase: "Phase II Clinical Study",
                pubChemId: "3033"
            },
            {
                name: "Losartan",
                fdaStatus: "Approved Antihypertensive (ARB)",
                indication: "Repurposed off-label to block angiotensin-driven EGFR transactivation in NSCLC",
                affinityScore: 2.40,
                bindingEnergy: "-9.6 kcal/mol",
                mechanism: "AT1 receptor blockade interrupting GPCR-EGFR crosstalk signaling",
                clinicalPhase: "Phase II Repurposing Trial",
                pubChemId: "3961"
            },
            {
                name: "Cimetidine",
                fdaStatus: "Approved Antihistamine (H2 receptor antagonist)",
                indication: "Repurposed off-label to inhibit colorectal & lung cancer cell adhesion via EGFR modulation",
                affinityScore: 3.10,
                bindingEnergy: "-9.2 kcal/mol",
                mechanism: "Reduces E-selectin expression and downregulates EGFR phosphorylation",
                clinicalPhase: "Phase III Repurposing Trial",
                pubChemId: "2758"
            },
            {
                name: "Fluoxetine",
                fdaStatus: "Approved Antidepressant (SSRI)",
                indication: "Repurposed off-label for inducing apoptosis in EGFR-overexpressing carcinomas",
                affinityScore: 3.60,
                bindingEnergy: "-8.9 kcal/mol",
                mechanism: "Serotonin transporter blockade triggering calcium-dependent EGFR degradation",
                clinicalPhase: "Phase II Repurposing",
                pubChemId: "3386"
            },
            {
                name: "Metformin",
                fdaStatus: "Approved Type 2 Diabetes Medication",
                indication: "Repurposed off-label for suppressing EGFR mutant lung adenocarcinoma growth",
                affinityScore: 4.20,
                bindingEnergy: "-8.7 kcal/mol",
                mechanism: "AMPK activator indirectly inhibiting mTOR and EGFR downstream survival signals",
                clinicalPhase: "Phase III Clinical Evaluation",
                pubChemId: "4091"
            },
            {
                name: "Propranolol",
                fdaStatus: "Approved Beta Blocker (Cardiology)",
                indication: "Repurposed off-label to blunt stress-hormone driven EGFR tumor progression",
                affinityScore: 4.00,
                bindingEnergy: "-8.4 kcal/mol",
                mechanism: "Beta-adrenergic blockade reducing catecholamine-induced EGFR phosphorylation",
                clinicalPhase: "Phase II Clinical Study",
                pubChemId: "4946"
            },
            {
                name: "Omeprazole",
                fdaStatus: "Approved Proton Pump Inhibitor",
                indication: "Repurposed off-label for sensitizing EGFR-mutant tumors via pH modulation",
                affinityScore: 4.50,
                bindingEnergy: "-8.2 kcal/mol",
                mechanism: "V-ATPase inhibition acidifying the tumor microenvironment and impairing EGFR recycling",
                clinicalPhase: "Phase I/II Repurposing",
                pubChemId: "4594"
            }
        ]
    },
    BRAF: {
        id: "BRAF",
        name: "BRAF",
        fullName: "B-Raf Proto-Oncogene, Serine/Threonine Kinase",
        description: "Key component of RAS/MAPK pathway. Repurposing non-cancer or cardiometabolic drugs with discovered affinity for BRAF V600E binding pocket.",
        pdbId: "4EZH",
        mutationFrequency: "50% in Melanoma, 10% in Colorectal Cancer",
        pathway: "MAPK/ERK Pathway",
        drugs: [
            {
                name: "Pimozide",
                fdaStatus: "Approved Antipsychotic Agent",
                indication: "Repurposed off-label for inhibiting STAT and BRAF-driven tumors",
                affinityScore: 1.40,
                bindingEnergy: "-11.0 kcal/mol",
                mechanism: "Calmodulin antagonist exhibiting strong off-target kinase binding affinity",
                clinicalPhase: "Phase II Trials",
                pubChemId: "4815"
            },
            {
                name: "Amiodarone",
                fdaStatus: "Approved Antiarrhythmic (Cardiology)",
                indication: "Repurposed off-label for suppressing BRAF mutant melanoma proliferation",
                affinityScore: 1.85,
                bindingEnergy: "-10.4 kcal/mol",
                mechanism: "Binds kinase ATP-binding pocket, inducing cell cycle arrest and apoptosis",
                clinicalPhase: "Pre-clinical / Phase II",
                pubChemId: "2157"
            },
            {
                name: "Verapamil",
                fdaStatus: "Approved Calcium Channel Blocker",
                indication: "Repurposed off-label to reverse multidrug resistance in BRAF melanomas",
                affinityScore: 2.00,
                bindingEnergy: "-10.0 kcal/mol",
                mechanism: "P-glycoprotein inhibition with direct occupancy of the BRAF DFG pocket",
                clinicalPhase: "Phase II Repurposing",
                pubChemId: "2520"
            },
            {
                name: "Mefloquine",
                fdaStatus: "Approved Antimalarial Medication",
                indication: "Repurposed off-label against BRAF V600E resistant brain metastases",
                affinityScore: 2.30,
                bindingEnergy: "-9.8 kcal/mol",
                mechanism: "Autophagy inhibitor and direct allosteric modulator of serine/threonine kinases",
                clinicalPhase: "Phase II Trial",
                pubChemId: "40478"
            },
            {
                name: "Haloperidol",
                fdaStatus: "Approved Antipsychotic (Butyrophenone)",
                indication: "Repurposed off-label for sigma-receptor mediated BRAF tumor suppression",
                affinityScore: 2.70,
                bindingEnergy: "-9.5 kcal/mol",
                mechanism: "Sigma-1 antagonism coupled with off-target BRAF kinase hinge binding",
                clinicalPhase: "Phase I/II Repurposing",
                pubChemId: "3559"
            },
            {
                name: "Sertraline",
                fdaStatus: "Approved Antidepressant (SSRI)",
                indication: "Repurposed off-label as an inducer of cancer cell apoptosis in BRAF models",
                affinityScore: 2.90,
                bindingEnergy: "-9.3 kcal/mol",
                mechanism: "Disrupts translation initiation and inhibits mutant kinase signaling cascades",
                clinicalPhase: "Phase II Repurposing",
                pubChemId: "5078"
            },
            {
                name: "Risperidone",
                fdaStatus: "Approved Atypical Antipsychotic",
                indication: "Repurposed off-label for dopamine-linked BRAF proliferation blockade",
                affinityScore: 3.20,
                bindingEnergy: "-9.1 kcal/mol",
                mechanism: "D2/5-HT2A antagonism with collateral inhibition of MAPK scaffolding",
                clinicalPhase: "Phase I/II Study",
                pubChemId: "5073"
            },
            {
                name: "Carbamazepine",
                fdaStatus: "Approved Anticonvulsant",
                indication: "Repurposed off-label for stabilizing BRAF-mutant neural crest tumors",
                affinityScore: 3.70,
                bindingEnergy: "-8.8 kcal/mol",
                mechanism: "Sodium channel blockade that dampens excitability-linked MAPK activation",
                clinicalPhase: "Phase II Evaluation",
                pubChemId: "2554"
            },
            {
                name: "Ciprofloxacin",
                fdaStatus: "Approved Fluoroquinolone Antibiotic",
                indication: "Repurposed off-label for topoisomerase-linked BRAF tumor growth arrest",
                affinityScore: 4.10,
                bindingEnergy: "-8.5 kcal/mol",
                mechanism: "Bacterial gyrase inhibitor showing cross-affinity for kinase phosphate loops",
                clinicalPhase: "Phase I Repurposing",
                pubChemId: "2764"
            },
            {
                name: "Azithromycin",
                fdaStatus: "Approved Macrolide Antibiotic",
                indication: "Repurposed off-label for autophagy-linked BRAF resistance modulation",
                affinityScore: 4.40,
                bindingEnergy: "-8.3 kcal/mol",
                mechanism: "Lysosomal accumulation blocking autophagic flux in resistant melanoma",
                clinicalPhase: "Phase I/II Study",
                pubChemId: "447043"
            }
        ]
    },
    TP53: {
        id: "TP53",
        name: "TP53",
        fullName: "Tumor Protein P53 (Guardian of the Genome)",
        description: "Tumor suppressor mutated in ~50% of cancers. Repurposing small molecules capable of binding and stabilizing mutant p53 conformations.",
        pdbId: "2OCJ",
        mutationFrequency: "~50% across all human cancers",
        pathway: "Cell Cycle Checkpoints / Apoptosis",
        drugs: [
            {
                name: "Disulfiram",
                fdaStatus: "Approved Anti-alcoholism Drug (Antabuse)",
                indication: "Repurposed off-label for reactivating mutant p53 tumor suppression",
                affinityScore: 0.92,
                bindingEnergy: "-11.6 kcal/mol",
                mechanism: "Forms copper complexes that bind mutant p53 cysteine residues, restoring active folding",
                clinicalPhase: "Phase II/III Trials",
                pubChemId: "3119"
            },
            {
                name: "Dexamethasone",
                fdaStatus: "Approved Corticosteroid",
                indication: "Repurposed off-label to modulate glucocorticoid-p53 crosstalk in resistant tumors",
                affinityScore: 1.50,
                bindingEnergy: "-10.6 kcal/mol",
                mechanism: "Glucocorticoid receptor activation reshaping p53 transcriptional programs",
                clinicalPhase: "Phase II Oncology Trials",
                pubChemId: "5743"
            },
            {
                name: "Sulfasalazine",
                fdaStatus: "Approved Anti-inflammatory (Rheumatoid Arthritis / Crohn's)",
                indication: "Repurposed off-label to restore wild-type conformation in mutant p53 cancers",
                affinityScore: 1.95,
                bindingEnergy: "-10.1 kcal/mol",
                mechanism: "Covalent thiol modifier stabilizing mutant p53 DNA-binding domain",
                clinicalPhase: "Phase II Repurposing",
                pubChemId: "5339"
            },
            {
                name: "Methotrexate",
                fdaStatus: "Approved Antimetabolite / Immunosuppressant",
                indication: "Repurposed off-label at low dose for p53-dependent senescence induction",
                affinityScore: 2.20,
                bindingEnergy: "-9.7 kcal/mol",
                mechanism: "DHFR inhibition causing nucleotide stress that reactivates p53 checkpoints",
                clinicalPhase: "Phase II Repurposing",
                pubChemId: "126941"
            },
            {
                name: "Digoxin",
                fdaStatus: "Approved Cardiac Glycoside (Heart Failure)",
                indication: "Repurposed off-label for inducing apoptosis in p53-mutant carcinomas",
                affinityScore: 2.45,
                bindingEnergy: "-9.5 kcal/mol",
                mechanism: "Na+/K+-ATPase inhibitor that downregulates mutant p53 stabilizing chaperones",
                clinicalPhase: "Phase II Clinical Study",
                pubChemId: "272383"
            },
            {
                name: "Valproic Acid",
                fdaStatus: "Approved Anticonvulsant / HDAC Inhibitor",
                indication: "Repurposed off-label for epigenetic reactivation of p53 target genes",
                affinityScore: 3.40,
                bindingEnergy: "-9.0 kcal/mol",
                mechanism: "HDAC inhibition reopening chromatin at p53-driven apoptotic promoters",
                clinicalPhase: "Phase II/III Trials",
                pubChemId: "3121"
            },
            {
                name: "Atorvastatin",
                fdaStatus: "Approved Cholesterol-lowering Statin",
                indication: "Repurposed off-label to inhibit mevalonate pathway and stabilize p53 variants",
                affinityScore: 3.80,
                bindingEnergy: "-8.9 kcal/mol",
                mechanism: "HMG-CoA reductase inhibition reducing oncogenic protein prenylation",
                clinicalPhase: "Phase III Clinical Evaluation",
                pubChemId: "60823"
            },
            {
                name: "Allopurinol",
                fdaStatus: "Approved Xanthine Oxidase Inhibitor (Gout)",
                indication: "Repurposed off-label for redox-linked p53 stabilization",
                affinityScore: 3.90,
                bindingEnergy: "-8.6 kcal/mol",
                mechanism: "Xanthine oxidase blockade lowering ROS that destabilize wild-type p53",
                clinicalPhase: "Phase II Study",
                pubChemId: "2094"
            },
            {
                name: "Loratadine",
                fdaStatus: "Approved Antihistamine (Allergy)",
                indication: "Repurposed off-label for histamine-linked p53 tumor microenvironment reset",
                affinityScore: 4.20,
                bindingEnergy: "-8.4 kcal/mol",
                mechanism: "H1 blockade reducing mast-cell histamine that shields p53-mutant clones",
                clinicalPhase: "Phase I/II Repurposing",
                pubChemId: "3957"
            },
            {
                name: "Cetirizine",
                fdaStatus: "Approved Antihistamine (Allergy)",
                indication: "Repurposed off-label as an adjunct restoring p53 immune surveillance",
                affinityScore: 4.60,
                bindingEnergy: "-8.1 kcal/mol",
                mechanism: "Peripheral H1 antagonism enhancing T-cell recognition of p53-mutant cells",
                clinicalPhase: "Phase I Study",
                pubChemId: "2678"
            }
        ]
    },
    KRAS: {
        id: "KRAS",
        name: "KRAS",
        fullName: "Kirsten Rat Sarcoma Viral Oncogene Homolog",
        description: "GTPase switch historically deemed undruggable. Repurposing non-oncology compounds binding to allosteric pockets.",
        pdbId: "4OBE",
        mutationFrequency: "90% in Pancreatic, 45% in Colorectal Cancer",
        pathway: "MAPK/ERK & PI3K/AKT Cascades",
        drugs: [
            {
                name: "Auranofin",
                fdaStatus: "Approved Anti-rheumatic Agent (Gold Compound)",
                indication: "Repurposed off-label for targeting mutant KRAS nucleotide-binding site",
                affinityScore: 1.10,
                bindingEnergy: "-11.4 kcal/mol",
                mechanism: "Gold(I) pharmacophore covalently binding active cysteine thiol residues on KRAS",
                clinicalPhase: "Phase II Oncology Trials",
                pubChemId: "23663785"
            },
            {
                name: "Pentamidine",
                fdaStatus: "Approved Anti-protozoal Medication",
                indication: "Repurposed off-label to bind RNA and disrupt KRAS-effector interactions",
                affinityScore: 2.10,
                bindingEnergy: "-9.9 kcal/mol",
                mechanism: "Dicationic molecule binding nucleotide pockets and inhibiting downstream effectors",
                clinicalPhase: "Phase II Study",
                pubChemId: "4735"
            },
            {
                name: "Spironolactone",
                fdaStatus: "Approved Potassium-sparing Diuretic",
                indication: "Repurposed off-label for mineralocorticoid-linked KRAS membrane signaling",
                affinityScore: 2.50,
                bindingEnergy: "-9.6 kcal/mol",
                mechanism: "Aldosterone antagonism disrupting KRAS plasma-membrane nanoclustering",
                clinicalPhase: "Phase II Repurposing",
                pubChemId: "5833"
            },
            {
                name: "Loperamide",
                fdaStatus: "Approved Antidiarrheal Agent",
                indication: "Repurposed off-label as a calcium channel / KRAS pathway suppressor",
                affinityScore: 2.80,
                bindingEnergy: "-9.4 kcal/mol",
                mechanism: "Modulates intracellular calcium flux and induces autophagic death in KRAS mutants",
                clinicalPhase: "Phase I/II Repurposing",
                pubChemId: "3955"
            },
            {
                name: "Ibuprofen",
                fdaStatus: "Approved Non-steroidal Anti-inflammatory (NSAID)",
                indication: "Repurposed off-label for COX-linked KRAS colorectal adenoma suppression",
                affinityScore: 3.00,
                bindingEnergy: "-9.3 kcal/mol",
                mechanism: "COX inhibition with direct engagement of the KRAS switch-II groove",
                clinicalPhase: "Phase II/III Trials",
                pubChemId: "3672"
            },
            {
                name: "Captopril",
                fdaStatus: "Approved Antihypertensive (ACE Inhibitor)",
                indication: "Repurposed off-label for blocking KRAS G12D membrane anchorage",
                affinityScore: 3.50,
                bindingEnergy: "-9.1 kcal/mol",
                mechanism: "Thiol-containing dipeptide interfering with RAS prenylation and signaling",
                clinicalPhase: "Phase II Repurposing",
                pubChemId: "44093"
            },
            {
                name: "Aspirin",
                fdaStatus: "Approved Antiplatelet / Analgesic",
                indication: "Repurposed off-label for KRAS-mutant colorectal cancer chemoprevention",
                affinityScore: 3.80,
                bindingEnergy: "-8.8 kcal/mol",
                mechanism: "Irreversible COX acetylation dampening prostaglandin-driven KRAS signaling",
                clinicalPhase: "Phase III Prevention Trials",
                pubChemId: "2244"
            },
            {
                name: "Furosemide",
                fdaStatus: "Approved Loop Diuretic",
                indication: "Repurposed off-label for ion-gradient disruption of KRAS effector coupling",
                affinityScore: 4.00,
                bindingEnergy: "-8.6 kcal/mol",
                mechanism: "NKCC blockade altering intracellular chloride that gates KRAS nanoclusters",
                clinicalPhase: "Phase I/II Repurposing",
                pubChemId: "3446"
            },
            {
                name: "Clonidine",
                fdaStatus: "Approved Antihypertensive (Alpha-2 Agonist)",
                indication: "Repurposed off-label for sympathetic-linked KRAS tumor growth control",
                affinityScore: 4.20,
                bindingEnergy: "-8.5 kcal/mol",
                mechanism: "Central alpha-2 agonism lowering catecholamines that transactivate KRAS",
                clinicalPhase: "Phase I Study",
                pubChemId: "2803"
            },
            {
                name: "Acetaminophen",
                fdaStatus: "Approved Analgesic / Antipyretic",
                indication: "Repurposed off-label as a low-toxicity KRAS pathway adjunct",
                affinityScore: 4.30,
                bindingEnergy: "-8.3 kcal/mol",
                mechanism: "COX-3 modulation with mild allosteric dampening of MAPK output",
                clinicalPhase: "Phase I Repurposing",
                pubChemId: "1983"
            }
        ]
    },
    ALK: {
        id: "ALK",
        name: "ALK",
        fullName: "Anaplastic Lymphoma Receptor Tyrosine Kinase",
        description: "Oncogenic fusion kinase in NSCLC. Repurposing CNS-penetrant neurological and cardiovascular drugs against ALK domain.",
        pdbId: "2XP2",
        mutationFrequency: "3-7% in NSCLC",
        pathway: "JAK/STAT & PI3K/Akt Pathways",
        drugs: [
            {
                name: "Ebselen",
                fdaStatus: "Investigational / Approved Neuroprotective Agent",
                indication: "Repurposed off-label as an organoselenium inhibitor of ALK kinase",
                affinityScore: 1.30,
                bindingEnergy: "-11.1 kcal/mol",
                mechanism: "Selenium-based antioxidant forming selenenyl-sulfide bonds with kinase active sites",
                clinicalPhase: "Phase II Clinical Trials",
                pubChemId: "3122"
            },
            {
                name: "Aripiprazole",
                fdaStatus: "Approved Atypical Antipsychotic",
                indication: "Repurposed off-label for inhibiting ALK fusion protein phosphorylation",
                affinityScore: 1.60,
                bindingEnergy: "-10.6 kcal/mol",
                mechanism: "Dopamine system stabilizer showing strong cross-reactivity with receptor tyrosine kinases",
                clinicalPhase: "Phase II Repurposing Trial",
                pubChemId: "60795"
            },
            {
                name: "Diazepam",
                fdaStatus: "Approved Benzodiazepine Anxiolytic",
                indication: "Repurposed off-label for GABA-linked ALK tumor dormancy induction",
                affinityScore: 2.40,
                bindingEnergy: "-9.8 kcal/mol",
                mechanism: "GABA-A potentiation coupled with peripheral benzodiazepine-receptor kinase blockade",
                clinicalPhase: "Phase I/II Repurposing",
                pubChemId: "3016"
            },
            {
                name: "Chloroquine",
                fdaStatus: "Approved Antimalarial & Anti-inflammatory",
                indication: "Repurposed off-label to sensitize ALK-resistant tumors via lysosomal inhibition",
                affinityScore: 2.60,
                bindingEnergy: "-9.6 kcal/mol",
                mechanism: "Lysosomotropic agent blocking autophagy and enhancing receptor turnover",
                clinicalPhase: "Phase III Repurposing",
                pubChemId: "2719"
            },
            {
                name: "Ondansetron",
                fdaStatus: "Approved Antiemetic (5-HT3 Antagonist)",
                indication: "Repurposed off-label for serotonin-linked ALK proliferation control",
                affinityScore: 3.00,
                bindingEnergy: "-9.3 kcal/mol",
                mechanism: "5-HT3 blockade interrupting serotonergic autocrine loops in ALK fusions",
                clinicalPhase: "Phase II Study",
                pubChemId: "4595"
            },
            {
                name: "Amlodipine",
                fdaStatus: "Approved Calcium Channel Blocker",
                indication: "Repurposed off-label for calcium-linked ALK motility suppression",
                affinityScore: 3.10,
                bindingEnergy: "-9.2 kcal/mol",
                mechanism: "L-type calcium blockade impairing ALK-driven cytoskeletal remodeling",
                clinicalPhase: "Phase II Evaluation",
                pubChemId: "2162"
            },
            {
                name: "Diltiazem",
                fdaStatus: "Approved Calcium Channel Blocker (Cardiology)",
                indication: "Repurposed off-label for disrupting ALK-mediated cell motility in cancer",
                affinityScore: 3.20,
                bindingEnergy: "-9.0 kcal/mol",
                mechanism: "Blocks voltage-dependent calcium channels and downregulates ALK signaling",
                clinicalPhase: "Phase II Evaluation",
                pubChemId: "3039"
            },
            {
                name: "Nifedipine",
                fdaStatus: "Approved Calcium Channel Blocker",
                indication: "Repurposed off-label for dihydropyridine-class ALK resistance modulation",
                affinityScore: 3.50,
                bindingEnergy: "-8.9 kcal/mol",
                mechanism: "Dihydropyridine calcium antagonism with collateral ALK hinge affinity",
                clinicalPhase: "Phase I/II Repurposing",
                pubChemId: "4485"
            },
            {
                name: "Diphenhydramine",
                fdaStatus: "Approved Antihistamine (Allergy / Sleep)",
                indication: "Repurposed off-label for histamine-linked ALK microenvironment reset",
                affinityScore: 3.90,
                bindingEnergy: "-8.7 kcal/mol",
                mechanism: "H1 antagonism reducing mast-cell mediators that sustain ALK signaling",
                clinicalPhase: "Phase I Study",
                pubChemId: "3100"
            },
            {
                name: "Zolpidem",
                fdaStatus: "Approved Sedative-Hypnotic",
                indication: "Repurposed off-label for GABA-linked ALK quiescence research",
                affinityScore: 4.10,
                bindingEnergy: "-8.5 kcal/mol",
                mechanism: "Selective GABA-A alpha-1 agonism linked to reduced ALK mitotic entry",
                clinicalPhase: "Phase I Repurposing",
                pubChemId: "5732"
            }
        ]
    }
};
