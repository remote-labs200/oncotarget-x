"use client";

import React, { useEffect, useRef, useState } from "react";

/** 3D snapshot: ligand stick model with slow spin + image fallbacks. */
export function LigandSnap({
  sdfUrl,
  cid,
  name,
}: {
  sdfUrl: string;
  cid: string | number;
  name: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<"building" | "ready" | "img" | "dead">("building");
  const [imgSrc, setImgSrc] = useState(
    `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=400x400`
  );

  useEffect(() => {
    let alive = true;
    setStage("building");
    setImgSrc(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=400x400`);
    async function init() {
      if (!ref.current) return;
      try {
        const $3Dmol = await import("3dmol");
        if (!alive || !ref.current) return;
        ref.current.innerHTML = "";
        const viewer = $3Dmol.createViewer(ref.current, { backgroundColor: "white" });

        // 3D SDF first, 2D SDF as backup
        let sdf = "";
        for (const url of [
          sdfUrl,
          `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF`,
        ]) {
          try {
            const res = await fetch(url);
            if (res.ok) {
              const text = await res.text();
              if (text.includes("V2000") || text.includes("V3000")) {
                sdf = text;
                break;
              }
            }
          } catch {}
        }
        if (!alive) return;
        if (!sdf) {
          setStage("img");
          return;
        }
        const model = viewer.addModel(sdf, "sdf");
        model.setStyle(
          {},
          {
            stick: { colorscheme: "Jmol", radius: 0.3 },
            sphere: { scale: 0.42, colorscheme: "Jmol" },
          }
        );
        viewer.zoomTo();
        viewer.zoom(0.8);
        viewer.render();
        try {
          viewer.spin("y", 0.8);
        } catch {}
        (ref.current as any).__viewer = viewer;
        setStage("ready");
      } catch (e) {
        console.warn("LigandSnap failed:", name, e);
        if (alive) setStage("img");
      }
    }
    init();
    return () => {
      alive = false;
      try {
        (ref.current as any)?.__viewer?.stopAnimate?.();
      } catch {}
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [sdfUrl, cid, name]);

  if (stage === "dead") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-zinc-50">
        <span className="text-3xl font-extrabold text-zinc-300">{name.charAt(0)}</span>
        <span className="font-mono text-[11px] text-zinc-400">structure unavailable offline</span>
      </div>
    );
  }

  if (stage === "img") {
    return (
      <img
        src={imgSrc}
        alt={`2D structure of ${name}`}
        className="h-full w-full object-contain bg-white p-4"
        loading="lazy"
        onError={() => {
          // CID image failed → try name-based image → else placeholder
          if (imgSrc.includes("/cid/")) {
            setImgSrc(
              `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/PNG?image_size=400x400`
            );
          } else {
            setStage("dead");
          }
        }}
      />
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={ref} className="h-full w-full" />
      {stage === "building" && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white font-mono text-[11px] text-zinc-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          building sticks…
        </div>
      )}
    </div>
  );
}
