import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { targetGene, mutation, patientId, drugName, bindingEnergy } = body;

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            // Return intelligent mock analysis if API key is not yet configured
            return NextResponse.json({
                success: true,
                source: "fallback-ai",
                analysis: `[Gemini 3.5 Flash Lite Mock Analysis for ${targetGene} (${mutation})]\n\nPatient ID: ${patientId}\nSelected Compound: ${drugName} (${bindingEnergy})\n\n1. Structural Impact: The ${mutation} mutation introduces steric alterations in the catalytic pocket of ${targetGene}, modulating inhibitor binding affinity.\n2. Drug Repurposing Rationale: ${drugName} demonstrates stable hydrogen bonding and hydrophobic interactions within the active conformation.\n3. Clinical Recommendation: Recommended for off-label evaluation under institutional tumor board review. (Note: Set GEMINI_API_KEY in environment variables for live Google Studio inference).`,
            });
        }

        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are an expert AI Precision Oncology and Drug Repurposing Clinical Assistant powered by Gemini 3.5 Flash Lite.
Analyze the following patient case and molecular docking result:
- Patient ID: ${patientId || "PT-2026"}
- Target Gene: ${targetGene || "EGFR"}
- Mutation Variant: ${mutation || "L858R"}
- Proposed Compound: ${drugName || "Gefitinib"}
- Docking Binding Energy: ${bindingEnergy || "-9.4 kcal/mol"}

Provide a concise, highly professional clinical precision oncology report detailing:
1. Molecular mechanism and structural consequence of this mutation on the target.
2. Rationale for repurposing the proposed compound.
3. Potential resistance pathways or combination therapies.
4. Clinical recommendation for the molecular tumor board.
Keep the response structured, clear, and focused on precision oncology.`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
        });

        return NextResponse.json({
            success: true,
            source: "gemini-3.5-flash-lite",
            analysis: response.text || "No response generated.",
        });
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to generate AI analysis",
            },
            { status: 500 }
        );
    }
}
