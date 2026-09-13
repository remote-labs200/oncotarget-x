# OncoTarget-X: AI Precision Oncology & Drug Repurposing Platform

A clinician or researcher inputs a patient's tumor gene expression profile, and the app instantly renders a 3D interactive protein-ligand binding visualization alongside ranked FDA-approved drugs for precision off-label therapy.

Traditional molecular docking pipelines take hours on HPC clusters. By leveraging lightweight pre-computed affinity models and modern JS visualization frameworks (like 3Dmol.js), it yields instant 3D docking preview results in 10 seconds.

## Project Architecture & Setup

### Frontend (The Visual Demo)
- **Core UI:** Next.js / React styled with a clean dark mode or glassmorphism aesthetic.
- **3D Viewer:** Integrate 3Dmol.js or NGL Viewer canvas to render PDB (Protein Data Bank) molecular structures and binding pockets interactively.

### Backend & Data Layer
- **Database:** A pre-indexed local SQLite database or FastAPI serving pre-computed affinity scores, FDA drug data (PubChem/DrugBank IDs), and TCGA gene expression profiles.
- **Scoring Engine:** Python script utilizing RDKit or pre-computed binding energy matrix to rapidly output top candidate drug matches without stalling during live presentations.

---

## Core Features for the Exhibition Booth

1. **Interactive Gene/Target Lookup:** 
   - A search input where judges can pick a cancer target (e.g., `EGFR`, `BRAF`, `TP53`).

2. **Instant 3D Docking Visualizer:** 
   - Displays the target protein structure and automatically zooms/highlights candidate drug molecules inside the active binding pocket.

3. **Ranked Drug Repurposing Table:** 
   - A clean table showing:
     - Drug Name & FDA Status (e.g., approved for target X, proposed off-label for target Y)
     - Affinity Score / Binding Energy
     - Mechanism of Action

4. **PDF Report Generator:** 
   - A 1-click button to export a "Precision Oncology Patient Report" with your team's branding.
