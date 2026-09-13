"use client";

import React, { useState } from "react";
import { Sparkles, Bot, Loader2, FileText, CheckCircle } from "lucide-react";
import { TargetData } from "@/app/data/cancerTargets";

interface GeminiAssistantProps {
  target: TargetData;
  currentDrug: TargetData["drugs"][0];
  patientId?: string;
  mutationType?: string;
}

export function GeminiAssistant({
  target,
  currentDrug,
  patientId = "PT-2026",
  mutationType = "L858R",
}: GeminiAssistantProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleRunGeminiAnalysis = async () => {
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetGene: target.name,
          mutation: mutationType,
          patientId: patientId,
          drugName: currentDrug.name,
          bindingEnergy: currentDrug.bindingEnergy,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setAnalysis("Error generating AI analysis.");
      }
    } catch (err) {
      console.error(err);
      setAnalysis("Failed to connect to Gemini 3.5 Flash Lite API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 backdrop-blur-xl p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 text-black font-bold">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Gemini 3.5 Flash Lite Clinical AI
              </h3>
              <p className="text-[11px] text-zinc-600">
                Google Studio Intelligence & Molecular Docking Interpreter
              </p>
            </div>
          </div>
          <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-400">
            Gemini 3.5 Flash Lite
          </span>
        </div>

        <p className="text-xs text-zinc-700 mb-4 leading-relaxed">
          Synthesize real-time AI clinical intelligence for{" "}
          <span className="text-cyan-400 font-bold">{target.name}</span> with
          compound{" "}
          <span className="text-emerald-400 font-bold">{currentDrug.name}</span>{" "}
          ({currentDrug.bindingEnergy}).
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleRunGeminiAnalysis}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-bold text-black hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-black" />
              <span>Running Gemini 3.5 Flash Lite Analysis...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Generate Gemini 3.5 Clinical Insight</span>
            </>
          )}
        </button>

        {analysis && (
          <div className="rounded-xl bg-white p-4 border border-zinc-200 text-xs text-zinc-700 font-mono whitespace-pre-line max-h-64 overflow-y-auto shadow-inner animate-fadeIn">
            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2 pb-2 border-b border-zinc-200">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>Gemini 3.5 Flash Lite Clinical Assessment</span>
            </div>
            {analysis}
          </div>
        )}
      </div>
    </div>
  );
}
