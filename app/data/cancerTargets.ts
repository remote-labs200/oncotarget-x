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
        affinityScore: number;
        bindingEnergy: string;
        mechanism: string;
        clinicalPhase: string;
        pubChemId: string;
        mw?: number;
        ic50?: number;
        clinicalTrials?: { nctId: string; title: string; url: string }[];
    }[];
}

export const CANCER_TARGETS: Record<string, TargetData> = {
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
                pubChemId: "4815",
                mw: 502.,
                ic50: 5.
            },
            {
                name: "Amiodarone",
                fdaStatus: "Approved Antiarrhythmic (Cardiology)",
                indication: "Repurposed off-label for suppressing BRAF mutant melanoma proliferation",
                affinityScore: 1.85,
                bindingEnergy: "-10.4 kcal/mol",
                mechanism: "Binds kinase ATP-binding pocket, inducing cell cycle arrest and apoptosis",
                clinicalPhase: "Pre-clinical / Phase II",
                pubChemId: "2157",
                mw: 634.,
                ic50: 20.
            },
            {
                name: "Verapamil",
                fdaStatus: "Approved Calcium Channel Blocker",
                indication: "Repurposed off-label to reverse multidrug resistance in BRAF melanomas",
                affinityScore: 2.00,
                bindingEnergy: "-10.0 kcal/mol",
                mechanism: "P-glycoprotein inhibition with direct occupancy of the BRAF DFG pocket",
                clinicalPhase: "Phase II Repurposing",
                pubChemId: "2520",
                mw: 454.,
                ic50: 25.
            },
            {
                name: "Mefloquine",
                fdaStatus: "Approved Antimalarial Medication",
                indication: "Repurposed off-label against BRAF V600E resistant brain metastases",
                affinityScore: 2.30,
                bindingEnergy: "-9.8 kcal/mol",
                mechanism: "Autophagy inhibitor and direct allosteric modulator of serine/threonine kinases",
                clinicalPhase: "Phase II Trial",
                pubChemId: "40478",
                mw: 378.,
                ic50: 30.
            },
            {
                name: "Haloperidol",
                fdaStatus: "Approved Antipsychotic (Butyrophenone)",
                indication: "Repurposed off-label for sigma-receptor mediated BRAF tumor suppression",
                affinityScore: 2.70,
                bindingEnergy: "-9.5 kcal/mol",
                mechanism: "Sigma-1 antagonism coupled with off-target BRAF kinase hinge binding",
                clinicalPhase: "Phase I/II Repurposing",
                pubChemId: "3559",
                mw: 375.,
                ic50: 150.
            },
            {
                name: "Sertraline",
                fdaStatus: "Approved Antidepressant (SSRI)",
                indication: "Repurposed off-label as an inducer of cancer cell apoptosis in BRAF models",
                affinityScore: 2.90,
                bindingEnergy: "-9.3 kcal/mol",
                mechanism: "Disrupts translation initiation and inhibits mutant kinase signaling cascades",
                clinicalPhase: "Phase II Repurposing",
                pubChemId: "5078",
                mw: 305.,
                ic50: 80.
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
                pubChemId: "2554",
                mw: 238.,
                ic50: 120.
            },
            {
                name: "Ciprofloxacin",
                fdaStatus: "Approved Fluoroquinolone Antibiotic",
                indication: "Repurposed off-label for topoisomerase-linked BRAF tumor growth arrest",
                affinityScore: 4.10,
                bindingEnergy: "-8.5 kcal/mol",
                mechanism: "Bacterial gyrase inhibitor showing cross-affinity for kinase phosphate loops",
                clinicalPhase: "Phase I Repurposing",
                pubChemId: "2764",
                mw: 331.,
                ic50: 90.
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
    }
};
