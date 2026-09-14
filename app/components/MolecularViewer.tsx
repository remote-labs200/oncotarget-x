"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  RefreshCw,
  ShieldCheck,
  Box,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Rotate3d,
  Grid3x3,
} from "lucide-react";
import { rcsbUrl } from "@/app/data/drugLinks";

interface MolecularViewerProps {
  currentDrug: {
    name: string;
    affinityScore: number;
    bindingEnergy: string;
    pubChemId?: number | string;
  };
  targetName: string;
  pdbId?: string;
  tall?: boolean;
  drugRank?: number;
  drugTotal?: number;
  onPrevDrug?: () => void;
  onNextDrug?: () => void;
  onOpenDossier?: () => void;
}

type BgTheme = "space" | "light" | "midnight";

const THEMES: Record<BgTheme, { label: string; bg: string; dot: string }> = {
  // Default to midnight for wow factor against judges from 10 ft away
  space: {
    label: "Space",
    bg: "#2b3442",
    dot: "bg-[#2b3442] border border-zinc-500",
  },
  light: {
    label: "Light",
    bg: "white",
    dot: "bg-white border border-zinc-300",
  },
  // Keep light as fallback but midnight is default
  midnight: {
    label: "Midnight",
    bg: "#0a1a33",
    dot: "bg-[#0a1a33] border border-blue-800",
  },
};

export function MolecularViewer({
  currentDrug,
  targetName,
  pdbId = "1M17",
  tall = false,
  drugRank,
  drugTotal,
  onPrevDrug,
  onNextDrug,
  onOpenDossier,
}: MolecularViewerProps) {
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const [viewerMode, setViewerMode] = useState<
    "cartoon" | "stick" | "sphere" | "surface"
  >("cartoon");
  const [theme, setTheme] = useState<BgTheme>("midnight");
  const [gridOn, setGridOn] = useState<boolean>(true);
  const [spinning, setSpinning] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pdbMeta, setPdbMeta] = useState<{
    title: string;
    method: string;
    resolution: number;
  } | null>(null);
  const viewerInstanceRef = useRef<any>(null);



  // Fetch real PDB metadata
  useEffect(() => {
    async function fetchPdbMeta() {
      try {
        const res = await fetch(`/api/pdb?pdbId=${pdbId}`);
        const data = await res.json();
        if (data.success) {
          setPdbMeta({
            title: data.title,
            method: data.experimentalMethod,
            resolution: data.resolution,
          });
        }
      } catch (err) {
        console.error("Failed to fetch PDB metadata:", err);
      }
    }
    fetchPdbMeta();
  }, [pdbId]);

  // Separate useEffect for style changes without re-fetching PDB/SDF
  useEffect(() => {
    if (viewerInstanceRef.current) {
      applyViewerStyle(viewerInstanceRef.current, viewerMode);
    }
  }, [viewerMode]);


  useEffect(() => {
    const v = viewerInstanceRef.current;
    if (!v) return;
    try {
      v.setBackgroundColor(THEMES[theme].bg);
      v.render();
    } catch {}
  }, [theme]);

  // Auto-rotate toggle
  useEffect(() => {
    const v = viewerInstanceRef.current;
    if (!v) return;
    try {
      if (spinning) v.spin("y", 1);
      else v.stopAnimate();
    } catch {}
  }, [spinning]);

  // Initialize 3Dmol.js viewer with Protein + PubChem Ligand Docking
  useEffect(() => {
    let isMounted = true;

    async function initViewer() {
      if (!viewerContainerRef.current) return;
      setIsLoading(true);

      try {
        const $3Dmol = await import("3dmol");

        if (!isMounted || !viewerContainerRef.current) return;

        viewerContainerRef.current.innerHTML = "";

        const viewer = $3Dmol.createViewer(viewerContainerRef.current, {
          backgroundColor: THEMES.light.bg,
        });
        viewerInstanceRef.current = viewer;

        // 1. Fetch and add Protein PDB structure
        const pdbUrl = `https://files.rcsb.org/download/${pdbId}.pdb`;
        const response = await fetch(pdbUrl);
        const pdbData = await response.text();

        if (!isMounted) return;

        viewer.addModel(pdbData, "pdb");
        applyViewerStyle(viewer, viewerMode);

        // 2. Fetch PubChem 3D Ligand SDF (record_type=3d is required)
        const pubChemId = currentDrug.pubChemId || 123631;
        const sdfUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${pubChemId}/SDF?record_type=3d`;

        try {
          const sdfRes = await fetch(sdfUrl);
          const sdfData = sdfRes.ok
            ? await sdfRes.text()
            : await (
                await fetch(
                  `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${pubChemId}/SDF`,
                )
              ).text();
          if (isMounted && sdfData) {
            const ligandModel = viewer.addModel(sdfData, "sdf");
            if (ligandModel) {
              ligandModel.setStyle(
                {},
                {
                  stick: { colorscheme: "cyanCarbon", radius: 0.35 },
                  sphere: { scale: 0.45, colorscheme: "cyanCarbon" },
                },
              );

            }
          }
        } catch (ligandErr) {
          console.warn("Could not load ligand:", ligandErr);
        }

        viewer.zoomTo();
        viewer.render();
        viewer.zoom(0.85);
        try {
          viewer.spin("y", 1);
        } catch {}
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading 3Dmol structure:", error);
        setIsLoading(false);
      }
    }

    initViewer();

    return () => {
      isMounted = false;
    };
  }, [pdbId, currentDrug.pubChemId]);

  const applyViewerStyle = (viewer: any, mode: string) => {
    try {
      viewer.removeAllSurfaces();
    } catch (e) {}

    const proteinModel = viewer.getModel(0);
    if (proteinModel) {
      if (mode === "cartoon") {
        // PyMOL-like: thick smooth tubes, spectrum colored
        proteinModel.setStyle(
          {},
          { cartoon: { color: "spectrum", thickness: 0.7, arrows: true } },
        );
      } else if (mode === "stick") {
        proteinModel.setStyle(
          {},
          { stick: { colorscheme: "greyCarbon", radius: 0.25 } },
        );
      } else if (mode === "sphere") {
        proteinModel.setStyle(
          {},
          { sphere: { scale: 0.3, colorscheme: "amino" } },
        );
      } else if (mode === "surface") {
        proteinModel.setStyle(
          {},
          { cartoon: { color: "white", opacity: 0.25 } },
        );
        viewer.addSurface("VDW", { opacity: 0.7, color: "cyan" }, { model: 0 });
      }
    }

    const ligandModel = viewer.getModel(1);
    if (ligandModel) {
      ligandModel.setStyle(
        {},
        {
          stick: { colorscheme: "cyanCarbon", radius: 0.35 },
          sphere: { scale: 0.45, colorscheme: "cyanCarbon" },
        },
      );
    }

    viewer.render();
  };

  const handleZoomIn = () => {
    if (viewerInstanceRef.current) {
      viewerInstanceRef.current.zoom(1.2);
      viewerInstanceRef.current.render();
    }
  };

  const handleZoomOut = () => {
    if (viewerInstanceRef.current) {
      viewerInstanceRef.current.zoom(0.8);
      viewerInstanceRef.current.render();
    }
  };

  const handleResetView = () => {
    if (viewerInstanceRef.current) {
      applyStandardZoom(viewerInstanceRef.current);
    }
  };

  // Standard overview zoom: fit the whole protein–ligand complex at 70%,
  // so we never land macro-zoomed inside a single atom.
  function applyStandardZoom(viewer: any) {
    try {
      viewer.zoomTo();
      viewer.zoom(0.7);
      viewer.render();
    } catch {}
  }

  const dark = theme !== "light";
  const gridColor = dark ? "rgba(120,180,255,0.10)" : "rgba(6,182,212,0.10)";

  return (
    <div
      className={`animate-slideUp lg:col-span-7 rounded-3xl bg-white/80 border border-white backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_60px_-20px_rgba(6,182,212,0.3)] relative overflow-hidden flex flex-col ${tall ? "h-[calc(100vh-120px)] min-h-[680px]" : "h-[calc(100vh-190px)] min-h-[620px]"}`}
    >
      <div className="scanline" />

      {/* BIG interactive header */}
      <div className="flex flex-wrap items-center gap-3 mb-4 z-10">
        <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-3 text-white shadow-lg shadow-cyan-500/30 relative shrink-0">
          <Box className="h-6 w-6 animate-pulse" />
          <span className="ping-dot absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-500 text-emerald-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-700">
            Stage 3 · Docking{" "}
            {drugRank && drugTotal ? `· Drug ${drugRank} of ${drugTotal}` : ""}
          </p>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            {currentDrug.name}{" "}
            <span className="font-mono text-sm font-bold text-emerald-600">
              {currentDrug.bindingEnergy}
            </span>
          </h2>
          <p className="text-xs text-zinc-500 truncate max-w-lg">
            {targetName} · PDB {pdbId}
            {pdbMeta?.title ? ` · ${pdbMeta.title}` : ""}
          </p>
        </div>
        {/* drug stepper */}
        {onPrevDrug && onNextDrug && (
          <div className="flex items-center gap-1 rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm">
            <button
              onClick={onPrevDrug}
              title="Previous drug"
              className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-1 font-mono text-xs font-bold text-zinc-700 tabular-nums">
              {drugRank}/{drugTotal}
            </span>
            <button
              onClick={onNextDrug}
              title="Next drug"
              className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            {onOpenDossier && (
              <button
                onClick={onOpenDossier}
                title="Open full dossier"
                className="flex h-8 items-center gap-1 rounded-xl bg-zinc-900 px-2.5 text-[11px] font-bold text-white hover:bg-zinc-700 transition cursor-pointer"
              >
                Dossier <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
        {/* zoom */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomIn}
            className="h-8 w-8 rounded-xl bg-zinc-900 hover:bg-zinc-700 text-sm text-white transition cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="h-8 w-8 rounded-xl bg-zinc-900 hover:bg-zinc-700 text-sm text-white transition cursor-pointer"
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={handleResetView}
            className="h-8 rounded-xl bg-zinc-900 hover:bg-zinc-700 px-2.5 text-[11px] font-bold text-white transition cursor-pointer flex items-center gap-1"
            title="Reset view"
          >
            <RefreshCw className="h-3 w-3" /> Reset
          </button>
        </div>
      </div>

      {/* canvas */}
      <div
        className={`relative flex-1 rounded-2xl border overflow-hidden shadow-inner ${dark ? "border-zinc-800" : "border-zinc-200"}`}
      >
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/85 backdrop-blur-sm gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
            <span className="text-xs font-mono text-cyan-700 animate-pulse">
              rendering PDB {pdbId}…
            </span>
          </div>
        )}{" "}

        {/* PyMOL-style animated grid overlay */}
        {gridOn && (
          <div
            className="canvas-grid-anim absolute inset-0 z-[5] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
              backgroundSize: "36px 36px",
            }}
          />
        )}
        {/* HUD corners */}
        <span className="absolute left-2 top-2 z-10 h-5 w-5 border-l-2 border-t-2 border-cyan-400/70 rounded-tl-lg pointer-events-none" />
        <span className="absolute right-2 top-2 z-10 h-5 w-5 border-r-2 border-t-2 border-cyan-400/70 rounded-tr-lg pointer-events-none" />
        <span className="absolute bottom-2 left-2 z-10 h-5 w-5 border-b-2 border-l-2 border-cyan-400/70 rounded-bl-lg pointer-events-none" />
        <span className="absolute bottom-2 right-2 z-10 h-5 w-5 border-b-2 border-r-2 border-cyan-400/70 rounded-br-lg pointer-events-none" />
        <div
          ref={viewerContainerRef}
          className="absolute inset-0 w-full h-full"
        />
        {/* ligand readout */}
        <div
          className={`absolute top-3 left-3 z-10 rounded-xl p-3 border backdrop-blur-md shadow-md pointer-events-none max-w-xs ${dark ? "bg-black/60 border-white/10" : "bg-white/90 border-zinc-200"}`}
        >
          <div className="text-[11px] font-mono text-cyan-500 font-semibold mb-1">
            LIGAND · {currentDrug.name}
          </div>
          <div
            className={`text-[10px] space-y-0.5 ${dark ? "text-zinc-300" : "text-zinc-700"}`}
          >
            <div>
              Affinity{" "}
              <span
                className={`font-mono font-bold ${dark ? "text-white" : "text-black"}`}
              >
                {currentDrug.affinityScore} nM
              </span>
            </div>
            <div>
              Energy{" "}
              <span
                className={`font-mono font-bold ${dark ? "text-white" : "text-black"}`}
              >
                {currentDrug.bindingEnergy}
              </span>
            </div>
            {pdbMeta && (
              <div>
                Res{" "}
                <span
                  className={`font-mono ${dark ? "text-white" : "text-black"}`}
                >
                  {pdbMeta.resolution} Å · {pdbMeta.method}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* theme chip */}
        <div className="absolute bottom-3 left-3 z-10 rounded-full bg-black/50 backdrop-blur px-2.5 py-1 font-mono text-[10px] text-zinc-300 pointer-events-none">
          {THEMES[theme].label} · {viewerMode}
          {spinning ? " · spinning" : ""}
        </div>
      </div>

      {/* control deck */}
      <div className="flex flex-wrap items-center gap-2 mt-4 z-10">
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-zinc-200 shadow-sm">
          {(["cartoon", "stick", "sphere", "surface"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewerMode(mode)}
              className={`px-2.5 py-1.5 rounded-lg capitalize transition-all duration-200 cursor-pointer text-xs ${
                viewerMode === mode
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/30"
                  : "text-zinc-500 hover:text-cyan-700 hover:bg-cyan-50"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* background themes */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-zinc-200 shadow-sm">
          {(Object.keys(THEMES) as BgTheme[]).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              title={`${THEMES[t].label} background`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                theme === t
                  ? "bg-zinc-900 text-white font-bold"
                  : "text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              <span className={`h-3.5 w-3.5 rounded-full ${THEMES[t].dot}`} />
              {THEMES[t].label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setGridOn((v) => !v)}
          title="Toggle measurement grid"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer shadow-sm ${gridOn ? "bg-cyan-500 text-white border-cyan-500" : "bg-white text-zinc-500 border-zinc-200 hover:border-cyan-300"}`}
        >
          <Grid3x3 className="h-3.5 w-3.5" /> Grid
        </button>
        <button
          onClick={() => setSpinning((v) => !v)}
          title="Toggle auto-rotate"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer shadow-sm ${spinning ? "bg-violet-500 text-white border-violet-500" : "bg-white text-zinc-500 border-zinc-200 hover:border-violet-300"}`}
        >
          <Rotate3d
            className={`h-3.5 w-3.5 ${spinning ? "animate-spin" : ""}`}
          />{" "}
          Spin
        </button>

        <a
          href={rcsbUrl(pdbId)}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono hover:text-cyan-700 transition"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>RCSB {pdbId} ↗</span>
        </a>
      </div>
    </div>
  );
}
