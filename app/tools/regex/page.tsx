'use client';

import { useState } from 'react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleTest = () => {
    try {
      const regex = new RegExp(pattern, 'g');
      const found = [...text.matchAll(regex)].map((m) => m[0]);
      setMatches(found);
      setError('');
    } catch (err: any) {
      setMatches([]);
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">TryIt.dev – Regex Tester</h1>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter regex pattern..."
          className="w-full p-4 bg-zinc-800 rounded-md text-sm font-mono outline-none"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
        />

        <textarea
          placeholder="Enter your test string..."
          className="w-full h-48 p-4 bg-zinc-800 rounded-md text-sm font-mono outline-none resize-y"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md w-fit"
          onClick={handleTest}
        >
          Test Regex
        </button>

        {error && (
          <p className="text-red-400 text-sm font-mono">❌ {error}</p>
        )}

        <div className="bg-zinc-900 p-4 rounded-md text-sm font-mono overflow-auto whitespace-pre-wrap">
          {matches.length > 0 ? (
            <>
              <p className="mb-2 text-green-400">✅ Matches Found:</p>
              <ul className="list-disc ml-6 space-y-1">
                {matches.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-zinc-400">No matches</p>
          )}
        </div>
      </div>
    </main>
  );
}
