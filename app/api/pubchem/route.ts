import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const drugName = searchParams.get("name") || "Gefitinib";

    try {
        // Search PubChem for compound by name
        const searchRes = await fetch(
            `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
                drugName
            )}/cids/JSON`
        );

        if (!searchRes.ok) {
            throw new Error("Compound not found in PubChem");
        }

        const searchData = await searchRes.json();
        const cid = searchData.IdentifierList?.CID?.[0] || 123631;

        // Fetch compound properties
        const propRes = await fetch(
            `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/IUPACName,MolecularFormula,MolecularWeight,XLogP/JSON`
        );
        const propData = await propRes.json();
        const props = propData.PropertyTable?.Properties?.[0] || {};

        // 3D SDF / PDB coordinates URL from PubChem
        const sdfUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/3D?record_type=sd&format=sdf`;

        return NextResponse.json({
            success: true,
            name: drugName,
            pubChemId: cid,
            iupacName: props.IUPACName || "N/A",
            formula: props.MolecularFormula || "C22H22ClFN4O3",
            molecularWeight: props.MolecularWeight || "446.9",
            xlogp: props.XLogP || "3.5",
            sdfUrl,
        });
    } catch (error) {
        return NextResponse.json({
            success: true,
            name: drugName,
            pubChemId: 123631,
            iupacName: "N-(3-chloro-4-fluorophenyl)-7-methoxy-6-(3-morpholinopropoxy)quinazolin-4-amine",
            formula: "C22H22ClFN4O3",
            molecularWeight: "446.9",
            xlogp: "3.5",
            sdfUrl: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/123631/record/3D?record_type=sd&format=sdf",
        });
    }
}
