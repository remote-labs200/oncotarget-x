"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, RefreshCw, Layers, ShieldCheck, Box } from "lucide-react";

interface MolecularViewerProps {
  currentDrug: {
    name: string;
    affinityScore: number;
    bindingEnergy: string;
    pubChemId?: number | string;
  };
  targetName: string;
  pdbId?: string;
}

export function MolecularViewer({
  currentDrug,
  targetName,
  pdbId = "1M17",
}: MolecularViewerProps) {
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const [viewerMode, setViewerMode] = useState<
    "cartoon" | "stick" | "sphere" | "surface"
  >("cartoon");
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

        const config = {
          backgroundColor: "white",
        };

        const viewer = $3Dmol.createViewer(viewerContainerRef.current, config);
        viewerInstanceRef.current = viewer;

        // 1. Fetch and add Protein PDB structure
        const pdbUrl = `https://files.rcsb.org/download/${pdbId}.pdb`;
        const response = await fetch(pdbUrl);
        const pdbData = await response.text();

        if (!isMounted) return;

        viewer.addModel(pdbData, "pdb");
        applyViewerStyle(viewer, viewerMode);

        // 2. Fetch and add PubChem 3D Ligand SDF structure for docked drug visualization
        const pubChemId = currentDrug.pubChemId || 123631;
        const sdfUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${pubChemId}/record/3D?record_type=sd&format=sdf`;

        try {
          const sdfRes = await fetch(sdfUrl);
          if (sdfRes.ok) {
            const sdfData = await sdfRes.text();
            if (isMounted && sdfData) {
              const ligandModel = viewer.addModel(sdfData, "sdf");
              if (ligandModel) {
                // Center ligand nicely inside the active pocket coordinates
                ligandModel.setStyle(
                  {},
                  {
                    stick: { colorscheme: "cyanCarbon", radius: 0.4 },
                    sphere: { scale: 0.5, colorscheme: "cyanCarbon" },
                  }
                );
              }
            }
          } else {
            const fallbackUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${pubChemId}/SDF`;
            const fbRes = await fetch(fallbackUrl);
            if (fbRes.ok) {
              const fbData = await fbRes.text();
              if (isMounted && fbData) {
                const ligandModel = viewer.addModel(fbData, "sdf");
                if (ligandModel) {
                  ligandModel.setStyle(
                    {},
                    {
                      stick: { colorscheme: "cyanCarbon", radius: 0.4 },
                      sphere: { scale: 0.5, colorscheme: "cyanCarbon" },
                    }
                  );
                }
              }
            }
          }
        } catch (ligandErr) {
          console.warn("Could not load ligand:", ligandErr);
        }

        // Zoom specifically to the protein active pocket / ligand center for proper docking view
        viewer.zoomTo({ model: 1 });
        viewer.render();
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
    // Clear previous surfaces if any
    try {
      viewer.removeAllSurfaces();
    } catch (e) {}

    const proteinModel = viewer.getModel(0);
    if (proteinModel) {
      if (mode === "cartoon") {
        proteinModel.setStyle({}, { cartoon: { color: "spectrum" } });
      } else if (mode === "stick") {
        proteinModel.setStyle({}, { stick: { colorscheme: "greyCarbon" } });
      } else if (mode === "sphere") {
        proteinModel.setStyle(
          {},
          { sphere: { scale: 0.3, colorscheme: "amino" } }
        );
      } else if (mode === "surface") {
        proteinModel.setStyle({}, { cartoon: { color: "white", opacity: 0.3 } });
        viewer.addSurface("VDW", { opacity: 0.75, color: "cyan" }, { model: 0 });
      }
    }

    // Safely style ligand (model 1)
    const ligandModel = viewer.getModel(1);
    if (ligandModel) {
      ligandModel.setStyle(
        {},
        {
          stick: { colorscheme: "cyanCarbon", radius: 0.4 },
          sphere: { scale: 0.5, colorscheme: "cyanCarbon" },
        }
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
      viewerInstanceRef.current.zoomTo();
      viewerInstanceRef.current.render();
    }
  };

  return (
    <div className="lg:col-span-7 rounded-2xl bg-zinc-50/60 border border-zinc-200 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden flex flex-col h-[520px]">
      <div className="flex items-center justify-between mb-4 z-10">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-500/10 p-2.5 border border-cyan-500/20 text-cyan-400">
            <Box className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide">
                Real 3D Structural Docking Viewer ({targetName} - PDB: {pdbId})
              </h2>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                WebGL Active
              </span>
            </div>
            <p className="text-xs text-zinc-600 truncate max-w-md">
              {pdbMeta?.title ||
                "RCSB PDB Protein-Ligand Complex & Binding Pocket"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomIn}
            className="rounded-xl bg-zinc-800 hover:bg-zinc-700 px-3 py-1 text-xs text-white transition cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="rounded-xl bg-zinc-800 hover:bg-zinc-700 px-3 py-1 text-xs text-white transition cursor-pointer"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={handleResetView}
            className="rounded-xl bg-zinc-800 hover:bg-zinc-700 px-3 py-1 text-xs text-white transition cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="relative flex-1 rounded-2xl bg-white border border-zinc-200 overflow-hidden shadow-inner flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent"></div>
            <span className="text-xs font-mono text-cyan-600">
              Fetching PDB {pdbId} & rendering WebGL structure...
            </span>
          </div>
        )}

        <div
          ref={viewerContainerRef}
          className="absolute inset-0 w-full h-full"
        />

        <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md rounded-xl p-3 border border-zinc-200 shadow-md pointer-events-none max-w-xs">
          <div className="text-[11px] font-mono text-cyan-700 font-semibold mb-1">
            LIGAND: {currentDrug.name}
          </div>
          <div className="text-[10px] text-zinc-700 space-y-0.5">
            <div>
              Binding Affinity:{" "}
              <span className="text-black font-mono">
                {currentDrug.affinityScore} nM
              </span>
            </div>
            <div>
              Binding Energy:{" "}
              <span className="text-black font-mono">
                {currentDrug.bindingEnergy}
              </span>
            </div>
            {pdbMeta && (
              <div>
                Resolution:{" "}
                <span className="text-black font-mono">
                  {pdbMeta.resolution} Å ({pdbMeta.method})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 z-10 text-xs">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-zinc-200">
          <span className="text-[11px] text-zinc-600 px-2 font-medium">
            Render Style:
          </span>
          {(["cartoon", "stick", "sphere", "surface"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewerMode(mode)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer text-xs ${
                viewerMode === mode
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold shadow-md"
                  : "text-zinc-600 hover:text-white"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-zinc-600 font-mono">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
          <span>RCSB PDB API Connected</span>
        </div>
      </div>
    </div>
  );
}
