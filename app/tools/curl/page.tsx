"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type HistoryItem = {
  id: string;
  method: string;
  url: string;
  body: string;
  timestamp: string;
};

export default function CurlPlayground() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [output, setOutput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Load from query string (for shareable URL)
  useEffect(() => {
    const u = searchParams.get("url");
    const m = searchParams.get("method");
    const b = searchParams.get("body");

    if (u) setUrl(decodeURIComponent(u));
    if (m) setMethod(m);
    if (b) setBody(decodeURIComponent(b));
  }, [searchParams]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("curlHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Save history to localStorage
  const saveToHistory = (item: HistoryItem) => {
    const updated = [item, ...history].slice(0, 10); // Keep only last 10
    setHistory(updated);
    localStorage.setItem("curlHistory", JSON.stringify(updated));
  };

  const handleRun = async () => {
    const curlCommand =
      method === "GET" || method === "DELETE"
        ? `curl -X ${method} "${url}"`
        : `curl -X ${method} "${url}" -d '${body}'`;

    const res = await fetch("/api/curl", {
      method: "POST",
      body: JSON.stringify({ command: curlCommand }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.text();
    setOutput(data);

    saveToHistory({
      id: Date.now().toString(),
      url,
      method,
      body,
      timestamp: new Date().toLocaleString(),
    });
  };

  const handleShare = () => {
    const params = new URLSearchParams({
      url: encodeURIComponent(url),
      method,
      body: encodeURIComponent(body),
    });

    const shareURL = `${window.location.origin}/curl?${params.toString()}`;
    navigator.clipboard.writeText(shareURL);
    alert(" Shareable link copied to clipboard!");
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">TryIt.dev – cURL Playground</h1>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter request URL..."
          className="w-full p-4 bg-zinc-800 rounded-md text-sm font-mono outline-none"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold">Method:</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="bg-zinc-800 text-sm font-mono p-2 rounded-md outline-none"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>PATCH</option>
            <option>DELETE</option>
          </select>
        </div>

        {(method !== "GET" && method !== "DELETE") && (
          <textarea
            placeholder="Enter request body..."
            className="w-full h-32 p-4 bg-zinc-800 rounded-md text-sm font-mono outline-none resize-y"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        )}

        <div className="flex gap-2">
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
            onClick={handleRun}
          >
             Run cURL
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            onClick={handleShare}
          >
             Share
          </button>
          <button
            className="bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-md"
            onClick={() => setShowHistory(!showHistory)}
          >
             History
          </button>
        </div>

        <div className="bg-zinc-900 p-4 rounded-md text-sm font-mono overflow-auto whitespace-pre-wrap min-h-[120px]">
          {output ? output : "Output will appear here..."}
        </div>

        {showHistory && (
          <div className="mt-4 bg-zinc-900 p-4 rounded-md text-sm font-mono space-y-2">
            <p className="text-zinc-400 font-semibold"> Recent History</p>
            {history.length === 0 ? (
              <p className="text-zinc-500">No history available.</p>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer hover:bg-zinc-800 p-2 rounded"
                  onClick={() => {
                    setUrl(item.url);
                    setMethod(item.method);
                    setBody(item.body);
                    setOutput("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <p className="text-zinc-300">{item.method} {item.url}</p>
                  <p className="text-zinc-500 text-xs">{item.timestamp}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
