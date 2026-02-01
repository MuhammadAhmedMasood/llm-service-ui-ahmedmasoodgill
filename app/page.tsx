"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("probabilistic");
  const [output, setOutput] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState("generate");


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
try{
  const res = await fetch(
  `   ${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
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
      setOutput(
        data.output || data.summary || data.label
      );
      setMetadata(data.metadata);
    } catch (err) {
      setOutput("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        <div className = "text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Enterprise LLM Service
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            ⚙️ Production-ready LLM API • ⚡ Fast • 📊 Observable
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">


          <textarea
            className="w-full min-h-[120px] rounded-md border border-gray-300 p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Enter your text here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="flex gap-4">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task
                </label>
                <div className="flex gap-2">
                  {["generate", "summarise", "classify"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTask(t)}
                      className={`px-3 py-1.5 rounded-md text-sm border ${
                        task === t
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>


            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode
              </label>
              <div className="flex gap-2">
                {["deterministic", "probabilistic"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`px-3 py-1.5 rounded-md text-sm border ${
                      mode === m
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Run"}
            </button>
          </div>

          {output && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Output</h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-900">{output}</pre>
            </div>
          )}

          {metadata && (
            <div className="mt-4 text-xs text-gray-500 space-y-1">
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

