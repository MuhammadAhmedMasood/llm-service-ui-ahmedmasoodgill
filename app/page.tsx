"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("probabilistic");
  const [task, setTask] = useState("generate");
  const [output, setOutput] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setOutput(null);
    setMetadata(null);

    const endpoint =
      task === "generate"
        ? "/v1/generate"
        : task === "summarise"
        ? "/v1/summarise"
        : "/v1/classify";

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body:
            task === "classify"
              ? JSON.stringify({
                  input: prompt,
                  labels: ["billing", "technical", "general"],
                })
              : JSON.stringify({
                  task,
                  input: prompt,
                  mode,
                  prompt_version: "v1",
                  constraints: { max_tokens: 300 },
                }),
        }
      );

      const data = await res.json();
      setOutput(data.output || data.summary || data.label);
      setMetadata(data.metadata);
    } catch {
      setOutput("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0b1020] via-[#111a33] to-[#2a1347] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-white">
            Enterprise LLM Service
          </h1>
          <p className="mt-1 text-xs text-gray-300">
            ⚙️ Production-ready LLM API • ⚡ Fast • 📊 Observable
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur rounded-xl border border-white/15 shadow-lg p-5 sm:p-8">
          {/* Input */}
          <textarea
            className="w-full min-h-[110px] rounded-md border border-white/20 bg-white/10 p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none placeholder:text-gray-400"
            placeholder="Enter your text here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* Controls */}
          <div className="mt-4 space-y-4">
            {/* TASK */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Task
              </label>

              {/* Mobile ONLY */}
              <div className="block sm:hidden">
                <select
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="w-full rounded-md border border-white/20 bg-white/10 text-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                  <option value="generate" className="text-black">
                    Generate
                  </option>
                  <option value="summarise" className="text-black">
                    Summarise
                  </option>
                  <option value="classify" className="text-black">
                    Classify
                  </option>
                </select>
              </div>

              {/* Desktop ONLY */}
              <div className="hidden sm:flex gap-2">
                {["generate", "summarise", "classify"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTask(t)}
                    className={`px-3 py-1.5 rounded-md text-sm border transition ${
                      task === t
                        ? "bg-white text-gray-900 border-white"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/15"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* MODE */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Mode
              </label>

              {/* Mobile ONLY */}
              <div className="block sm:hidden">
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full rounded-md border border-white/20 bg-white/10 text-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                  <option value="deterministic" className="text-black">
                    Deterministic
                  </option>
                  <option value="probabilistic" className="text-black">
                    Probabilistic
                  </option>
                </select>
              </div>

              {/* Desktop ONLY */}
              <div className="hidden sm:flex gap-2">
                {["deterministic", "probabilistic"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`px-3 py-1.5 rounded-md text-sm border transition ${
                      mode === m
                        ? "bg-violet-400 text-gray-900 border-violet-300"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/15"
                    }`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>

              <p className="mt-2 text-xs text-gray-300">
                Deterministic = consistent outputs. Probabilistic = more variety.
              </p>
            </div>

            {/* RUN BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? "Processing…" : "Run ✨"}
            </button>
          </div>

          {/* Output */}
          {output && (
            <div className="mt-6 rounded-lg border border-white/20 bg-white/10 p-4">
              <h3 className="text-sm font-medium text-gray-200 mb-2">
                Output
              </h3>
              <pre className="whitespace-pre-wrap text-sm text-white">
                {output}
              </pre>
            </div>
          )}

          {/* Metadata */}
          {metadata && (
            <div className="mt-4 text-xs text-gray-300 space-y-1">
              <div>Model: {metadata.model}</div>
              <div>Tokens used: {metadata.tokens_used}</div>
              <div>Latency: {metadata.latency_ms} ms</div>
              <div>Estimated cost: ${metadata.estimated_cost_usd}</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
