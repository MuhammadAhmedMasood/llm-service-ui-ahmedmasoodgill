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
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold">
          Enterprise LLM Service
        </h1>
        <p className="text-gray-600">
          Production-grade LLM API playground
        </p>

        <textarea
          className="w-full h-40 p-3 border rounded-md"
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="flex gap-4">
          <select
            className="border p-2 rounded-md"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          >    
            <option value="generate">Generate</option>
            <option value="summarise">Summarise</option>
            <option value="classify">Classify</option>
          </select>

          <select
            className="border p-2 rounded-md"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="probabilistic">Probabilistic</option>
            <option value="deterministic">Deterministic</option>
          </select>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {output && (
          <div className="border rounded-md p-4 bg-gray-50">
            <h2 className="font-semibold mb-2">Output</h2>
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        )}

        {metadata && (
          <div className="border rounded-md p-4 text-sm bg-gray-50">
            <h2 className="font-semibold mb-2">Metadata</h2>
            <pre>{JSON.stringify(metadata, null, 2)}</pre>
          </div>
        )}
      </div>
    </main>
  );
}

