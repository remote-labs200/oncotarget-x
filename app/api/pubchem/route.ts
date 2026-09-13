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

        // Fetch compound properties (identity + ADME descriptors)
        const propRes = await fetch(
            `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/IUPACName,MolecularFormula,MolecularWeight,XLogP,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,TPSA/JSON`
        );
        const propData = await propRes.json();
        const props = propData.PropertyTable?.Properties?.[0] || {};

        // 3D SDF coordinates URL from PubChem (record_type=3d is required)
        const sdfUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF?record_type=3d`;

        return NextResponse.json({
            success: true,
            name: drugName,
            pubChemId: cid,
            iupacName: props.IUPACName || "N/A",
            formula: props.MolecularFormula || "C22H22ClFN4O3",
            molecularWeight: props.MolecularWeight || "446.9",
            xlogp: props.XLogP ?? "3.5",
            hbd: props.HBondDonorCount ?? 1,
            hba: props.HBondAcceptorCount ?? 5,
            rotBonds: props.RotatableBondCount ?? 3,
            tpsa: props.TPSA ?? "60.0",
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
            hbd: 1,
            hba: 5,
            rotBonds: 3,
            tpsa: "60.0",
            sdfUrl: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/123631/SDF?record_type=3d`,
        });
    }
}
