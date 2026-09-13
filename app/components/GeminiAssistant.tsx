"use client";

import React, { useState, useEffect } from "react";
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
  const [displayed, setDisplayed] = useState<string>("");
  const [thinkStep, setThinkStep] = useState<number>(0);

  // typewriter stream for agentic feel
  useEffect(() => {
    if (!analysis) {
      setDisplayed("");
      return;
    }
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i += 6;
      setDisplayed(analysis.slice(0, i));
      if (i >= analysis.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [analysis]);

  // fake thinking trace while loading
  useEffect(() => {
    if (!loading) return;
    setThinkStep(0);
    const id = setInterval(() => setThinkStep((s) => (s + 1) % 4), 700);
    return () => clearInterval(id);
  }, [loading]);

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
    <div className="animate-slideUp rounded-3xl border border-white bg-white/80 backdrop-blur-xl p-6 shadow-[0_20px_60px_-20px_rgba(6,182,212,0.3)] flex flex-col justify-between relative overflow-hidden">
      <div className="scanline" />
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 text-white shadow-lg shadow-cyan-500/30 relative">
              <Bot className="h-4 w-4" />
              {loading && <span className="ping-dot absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-500 text-emerald-500" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                Clinical AI Agent
                {loading ? (
                  <span className="flex gap-1">
                    <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-50 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">idle • ready</span>
                )}
              </h3>
              <p className="text-[11px] text-zinc-500 font-mono">
                {loading
                  ? ["reading PDB pocket…", "cross-checking ChEMBL…", "scoring ΔG matrix…", "drafting report…"][thinkStep]
                  : "Gemini 3.5 Flash Lite • molecular interpreter"}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-cyan-50 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-700">
            autonomous
          </span>
        </div>

        <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
          Synthesize real-time AI clinical intelligence for{" "}
          <span className="text-cyan-700 font-bold">{target.name}</span> with
          compound{" "}
          <span className="text-emerald-700 font-bold">{currentDrug.name}</span>{" "}
          ({currentDrug.bindingEnergy}).
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleRunGeminiAnalysis}
          disabled={loading}
          className="shimmer-bar w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-bold text-white hover:from-cyan-600 hover:to-blue-700 hover:shadow-[0_12px_32px_-8px_rgba(6,182,212,0.6)] transition shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Agent reasoning…</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Generate Clinical Insight</span>
            </>
          )}
        </button>

        {analysis && (
          <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-800 text-xs text-zinc-200 font-mono whitespace-pre-line max-h-64 overflow-y-auto shadow-inner animate-fadeIn">
            <div className="flex items-center gap-2 text-emerald-300 font-bold mb-2 pb-2 border-b border-zinc-800">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>Agent assessment — streaming</span>
              <span className="animate-blink ml-auto inline-block h-3.5 w-1.5 bg-emerald-300" />
            </div>
            {displayed}
          </div>
        )}
      </div>
    </div>
  );
}
