# OncoTarget-X Technology Stack

## 3D Molecular Visualization Engine (Frontend)

The visual centerpiece of your project must look sleek, smooth, and highly interactive.

- **3Dmol.js**: The gold standard for object-oriented, WebGL-based molecular visualization in the browser. It is lightweight and handles rendering .pdb or .sdf molecular files beautifully without lagging.
- **NGL Viewer**: An exceptional alternative to 3Dmol.js. It handles larger molecular complexes (like entire protein-ligand systems) with highly polished aesthetic modes (e.g., ribbon structures, molecular surfaces).
- **Biopython / RDKit**: Use these utilities on your backend to handle molecular file conversions, sanitizing chemical structures, and generating 2D/3D coordinates for the frontend viewer.

## The Data Core: Databases & Free APIs

Instead of querying raw, multi-gigabyte genomics files during a live demo, leverage established biomedical APIs to pull data on demand.

- **PubChem REST API**: Essential for pulling 3D chemical structures (.sdf or .pdb files) of FDA-approved drugs using their chemical names or CIDs.
- **RCSB Protein Data Bank (PDB) API**: Used to instantly fetch the 3D crystal structures of the target proteins associated with the mutated genes.
- **Open Targets Platform API**: A massive, comprehensive ecosystem that maps evidence-based drug-target interactions, disease associations, and pathways. Perfect for validating your off-label drug ranking mechanism.
- **ChEMBL API**: Great for pulling bioactivity data (like IC₅₀ or Kᵢ values) to show evaluators that your binding affinity claims are backed by real lab data.

## The 10-Second "AI Precision" Engine (Backend & ML)

To deliver on the promise of skipping hours of HPC cluster rendering, you have two choices for your backend ML architecture:

### Option A: The Pre-Computed Hybrid (Fastest & Safest)

- Pre-calculate binding affinity matrices for a curated subset of high-impact cancer proteins (e.g., EGFR, BRAF, KRAS) and a library of FDA-approved oncology drugs.
- Store this in **SQLite** or **PostgreSQL (with pgvector)**. When a user uploads a gene profile, run a fast matrix-multiplication or vector-similarity search to rank the drugs instantly.

### Option B: Lightweight Embedding Inference

- Use pre-trained Transformer embeddings like **ESM-2 (by Meta AI)** for protein sequences and **ChemBERTa** for drug SMILES strings.
- Run a lightweight, pre-trained neural network (deployed on **Hugging Face Inference Endpoints** or **FastAPI**) that takes these two embeddings and outputs a predicted binding score (pK𝑑) in milliseconds.

## Next-Gen UI Frameworks & Analytics

- **Next.js + Tailwind CSS + Shadcn/ui**: Build a dark-themed, "clinical dashboard" aesthetic. Evaluators love professional, responsive command centers over basic text readouts.
- **Recharts**: Use this to build interactive gene expression bar graphs or drug safety/efficacy distribution charts next to your 3D molecular viewer.

## Architecture Data Flow for the Demo

```
[User Inputs Tumor Profile]          │
         ▼                          │
[Next.js API Routes / FastAPI] ──► Query pre-computed SQLite Matrix for top Drug Candidates         │
         ├─► Fetch Target Protein 3D File from RCSB PDB API         └─► Fetch Candidate Drug 3D File from PubChem API         │
         ▼                          │
[3Dmol.js Canvas] Renders the interactive complex in under 10 seconds!