"use client";

import { useState } from "react";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
      setError("");
    } catch {
      setError("Invalid input for encoding.");
      setOutput("");
    }
  };

  const handleDecode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);
      setError("");
    } catch {
      setError("Invalid Base64 string.");
      setOutput("");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">TryIt.dev – Base64 Encoder/Decoder</h1>

      <div className="flex flex-col gap-4">
        <textarea
          placeholder="Enter text to encode or Base64 to decode"
          className="w-full h-32 p-4 bg-zinc-800 rounded-md text-sm font-mono outline-none resize-y"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex gap-4">
          <button
            onClick={handleEncode}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-semibold"
          >
            Encode
          </button>
          <button
            onClick={handleDecode}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-semibold"
          >
            Decode
          </button>
        </div>

        {error && <p className="text-red-400 text-sm font-mono">{error}</p>}

        <div className="bg-zinc-900 p-4 rounded-md text-sm font-mono overflow-auto whitespace-pre-wrap min-h-[100px]">
          {output || "Output will appear here..."}
        </div>

        <button
          onClick={handleCopy}
          disabled={!output}
          className={`w-fit text-sm font-semibold px-4 py-2 rounded-md ${
            output
              ? "bg-zinc-800 hover:bg-zinc-700 text-white"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          }`}
        >
          {copied ? " Copied!" : " Copy Output"}
        </button>
      </div>
    </main>
  );
}

