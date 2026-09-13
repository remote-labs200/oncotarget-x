import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { message, context, history } = body as {
            message: string;
            context?: string;
            history?: { role: string; text: string }[];
        };

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            // Context-aware fallback so the chat works without a key
            return NextResponse.json({
                success: true,
                source: "fallback-ai",
                reply: `Here's what I can tell you from this run:\n\n${context || "No run context yet."}\n\nYour question: "${message}"\n\nBased on the docking scores above, the top-ranked compound is the strongest candidate for tumor-board review. Compounds clearing −9.0 kcal/mol are generally considered therapeutically interesting. (Set GEMINI_API_KEY for live Gemini answers.)`,
            });
        }

        const ai = new GoogleGenAI({ apiKey });
        const transcript = (history || [])
            .slice(-8)
            .map((h) => `${h.role === "user" ? "User" : "Assistant"}: ${h.text}`)
            .join("\n");

        const prompt = `You are the OncoTarget-X docking assistant, an expert in precision oncology and drug repurposing. Answer the user's question using ONLY the run context below plus general oncology knowledge. Keep answers short (under 120 words), plain-spoken, no jargon without explanation.

RUN CONTEXT:
${context || "No run context."}

CONVERSATION SO FAR:
${transcript}

USER QUESTION: ${message}`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
        });

        return NextResponse.json({
            success: true,
            source: "gemini-3.5-flash-lite",
            reply: response.text || "I couldn't generate an answer just now.",
        });
    } catch (error: any) {
        console.error("Agent chat error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Chat failed" },
            { status: 500 }
        );
    }
}
