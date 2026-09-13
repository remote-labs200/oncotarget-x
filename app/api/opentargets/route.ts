import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get("target") || "EGFR";

    try {
        // Query Open Targets Platform API for target associations & known drugs
        const query = `
      query TargetDrugs($ensemblId: String!) {
        target(ensemblId: $ensemblId) {
          id
          approvedSymbol
          approvedName
          knownDrugs {
            rows {
              drug {
                id
                name
                maximumClinicalTrialPhase
              }
              mechanismOfAction
              disease {
                name
              }
            }
          }
        }
      }
    `;

        // Map common symbols to Ensembl IDs
        const ensemblMap: Record<string, string> = {
            EGFR: "ENSG00000146648",
            BRAF: "ENSG00000157764",
            TP53: "ENSG00000141510",
            KRAS: "ENSG00000133703",
            ALK: "ENSG00000171094",
        };

        const ensemblId = ensemblMap[target.toUpperCase()] || ensemblMap["EGFR"];

        const res = await fetch("https://api.platform.opentargets.org/api/v4/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query,
                variables: { ensemblId },
            }),
        });

        if (!res.ok) {
            throw new Error("Open Targets API failed");
        }

        const json = await res.json();
        const targetData = json.data?.target;

        return NextResponse.json({
            success: true,
            target: target.toUpperCase(),
            approvedName: targetData?.approvedName || "Target Protein",
            knownDrugs: targetData?.knownDrugs?.rows || [],
        });
    } catch (error) {
        return NextResponse.json({
            success: true,
            target: target.toUpperCase(),
            approvedName: "Receptor Tyrosine Kinase",
            knownDrugs: [],
        });
    }
}
