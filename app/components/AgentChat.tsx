"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bot, X, Send, Loader2, ChevronDown, ListTodo } from "lucide-react";

interface AgentChatProps {
  context: string;
}

interface Msg {
  role: "user" | "agent";
  text: string;
}

const QUICK = ["Why this top drug?", "Explain the ΔG score", "What are next steps?"];

type TaskStatus = "completed" | "in_progress" | "pending";
interface AgentTask {
  label: string;
  detail: string;
  status: TaskStatus;
}

const PIPELINE_TASKS: AgentTask[] = [
  { label: "Fetch PubChem ligands", detail: "3D SDF structures pulled for every candidate compound.", status: "completed" },
  { label: "Cross-check ChEMBL assays", detail: "IC50 / Ki records fetched and normalized per drug.", status: "completed" },
  { label: "Load PDB pocket", detail: "Crystal structure loaded, binding pocket detected.", status: "completed" },
  { label: "Score & rank ΔG", detail: "RDKit matrix complete — compounds ordered by binding energy.", status: "completed" },
  { label: "Live Q&A session", detail: "This chat — ask anything about the run.", status: "in_progress" },
];

function TaskDot({ status }: { status: TaskStatus }) {
  if (status === "completed") return <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">✓</span>;
  if (status === "in_progress") return <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />;
  return <span className="h-4 w-4 shrink-0 rounded-full bg-zinc-200" />;
}

export function AgentChat({ context }: AgentChatProps) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "agent", text: "Hey — I'm following this run. Ask me anything about the target, scores, or drugs." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(true);
  const [expandedTask, setExpandedTask] = useState<number | null>(4);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, open, busy]);

  const send = async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput("");
    const next = [...msgs, { role: "user" as const, text: q }];
    setMsgs(next);
    setBusy(true);
    try {
      const res = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          context,
          history: next.map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();
      setMsgs((p) => [...p, { role: "agent", text: data.reply || "Hmm, that didn't come back — try again." }]);
    } catch {
      setMsgs((p) => [...p, { role: "agent", text: "Couldn't reach the agent just now — try again." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* launcher — small */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Chat with the docking agent"
        className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_12px_32px_-8px_rgba(6,182,212,0.7)] hover:scale-105 transition-all cursor-pointer"
      >
        {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        {!open && (
          <span className="ping-dot absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 text-emerald-500" />
        )}
      </button>

      {/* panel — compact */}
      {open && (
        <div className="animate-slideUp fixed bottom-[72px] right-5 z-50 flex h-[440px] w-[min(320px,calc(100vw-40px))] flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl">
          <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2.5 text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/20">
              <Bot className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[13px] font-bold leading-tight">Docking Agent</p>
              <p className="flex items-center gap-1 text-[10px] text-cyan-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" /> online · knows this run
              </p>
            </div>
          </div>

          {/* expandable task list — todo style */}
          <div className="border-b border-zinc-100 bg-zinc-50/70">
            <button
              onClick={() => setTasksOpen((v) => !v)}
              className="flex w-full items-center gap-1.5 px-3.5 py-2 text-left cursor-pointer"
            >
              <ListTodo className="h-3.5 w-3.5 text-cyan-600" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Agent tasks · 4/5 done
              </span>
              <ChevronDown className={`ml-auto h-3.5 w-3.5 text-zinc-400 transition-transform ${tasksOpen ? "" : "-rotate-90"}`} />
            </button>
            {tasksOpen && (
              <div className="space-y-0.5 px-2.5 pb-2">
                {PIPELINE_TASKS.map((t, i) => {
                  const expanded = expandedTask === i;
                  return (
                    <div key={t.label} className={`rounded-xl ${expanded ? "bg-white border border-zinc-200 shadow-sm" : ""}`}>
                      <button
                        onClick={() => setExpandedTask(expanded ? null : i)}
                        className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left hover:bg-white transition cursor-pointer"
                      >
                        <TaskDot status={t.status} />
                        <span className={`text-xs ${t.status === "pending" ? "text-zinc-400" : "text-zinc-700 font-medium"}`}>{t.label}</span>
                        <ChevronDown className={`ml-auto h-3 w-3 shrink-0 text-zinc-300 transition-transform ${expanded ? "" : "-rotate-90"}`} />
                      </button>
                      {expanded && (
                        <p className="animate-fadeIn px-2 pb-2 pl-8 text-[11px] leading-relaxed text-zinc-500">{t.detail}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div ref={boxRef} className="flex-1 space-y-2.5 overflow-y-auto bg-[#f7fafc] p-3.5">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-zinc-900 text-white"
                      : "rounded-bl-md border border-zinc-200 bg-white text-zinc-700 shadow-sm"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <p className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-400 shadow-sm">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-600" /> thinking…
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-zinc-100 bg-white p-2.5">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700 hover:bg-cyan-100 transition cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about this run…"
                className="min-w-0 flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-[13px] text-zinc-900 focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow disabled:opacity-40 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
