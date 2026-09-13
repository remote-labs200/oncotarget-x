"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";
import { TargetData } from "@/app/data/cancerTargets";

interface ExpressionChartProps {
  target: TargetData;
}

export function ExpressionChart({ target }: ExpressionChartProps) {
  // Generate sample expression and affinity score distribution data for Recharts
  const chartData = target.drugs.map((drug, index) => ({
    name:
      drug.name.length > 10 ? drug.name.substring(0, 10) + "..." : drug.name,
    fullName: drug.name,
    affinity: drug.affinityScore,
    score: Math.max(10, Math.round(100 - drug.affinityScore * 4)),
  }));

  const colors = ["#06b6d4", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-zinc-200">
            Compound Efficacy & Binding Score Distribution ({target.name})
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Recharts Analytics</span>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#27272a" }}
            />
            <YAxis
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#27272a" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#090d16",
                borderColor: "#27272a",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
              }}
              formatter={(value: any, name: any) => [
                name === "affinity" ? `${value} nM (Kd)` : `${value}/100 Score`,
                name === "affinity" ? "Affinity" : "Efficacy Score",
              ]}
              labelStyle={{ color: "#06b6d4", fontWeight: "bold" }}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-200/80 text-[11px] text-zinc-600 font-mono">
        <span>Target Pathway: {target.pathway}</span>
        <span className="text-cyan-400">
          Higher score = stronger predicted clinical response
        </span>
      </div>
    </div>
  );
}
