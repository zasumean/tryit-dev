'use client';

import { useEffect, useState } from 'react';

export default function Page() {
  const [jsonInput, setJsonInput] = useState('');
  const [jqQuery, setJqQuery] = useState('');
  const [output, setOutput] = useState('Output will appear here...');
  const [isRunning, setIsRunning] = useState(false);
  const [savedQueries, setSavedQueries] = useState<{ name: string; query: string }[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('savedQueries');
    if (saved) setSavedQueries(JSON.parse(saved));

    const lastJson = localStorage.getItem('jsonInput');
    const lastQuery = localStorage.getItem('jqQuery');
    if (lastJson) setJsonInput(lastJson);
    if (lastQuery) setJqQuery(lastQuery);
  }, []);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/jq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          json: JSON.parse(jsonInput),
          query: jqQuery,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOutput(data.result);
      } else {
        setOutput(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setOutput(`❌ Error: ${err.message}`);
    }
    setIsRunning(false);
  };

  const handleSaveQuery = () => {
    const name = prompt('Name this query:');
    if (!name) return;

    const newQueries = [...savedQueries, { name, query: jqQuery }];
    setSavedQueries(newQueries);
    localStorage.setItem('savedQueries', JSON.stringify(newQueries));
  };

  const handleDeleteQuery = (index: number) => {
    const confirmed = confirm('Are you sure you want to delete this query?');
    if (!confirmed) return;

    const updated = [...savedQueries];
    updated.splice(index, 1);
    setSavedQueries(updated);
    localStorage.setItem('savedQueries', JSON.stringify(updated));
  };

  const handleEditQuery = (index: number) => {
    const newName = prompt('Edit query name:', savedQueries[index].name);
    if (!newName) return;

    const updated = [...savedQueries];
    updated[index].name = newName;
    setSavedQueries(updated);
    localStorage.setItem('savedQueries', JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">TryIt.dev – jq Playground</h1>

      <div className="flex flex-col gap-4">
        <textarea
          placeholder="Paste your JSON here..."
          className="w-full h-48 p-4 bg-zinc-800 rounded-md text-sm font-mono outline-none resize-y"
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value);
            localStorage.setItem('jsonInput', e.target.value);
          }}
        />

        <input
          placeholder="Enter your jq query..."
          className="w-full p-4 bg-zinc-800 rounded-md text-sm font-mono outline-none"
          value={jqQuery}
          onChange={(e) => {
            setJqQuery(e.target.value);
            localStorage.setItem('jqQuery', e.target.value);
          }}
        />

        <div className="flex gap-2">
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md disabled:opacity-60"
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? 'Running...' : 'Run'}
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            onClick={handleSaveQuery}
          >
            Save Query
          </button>
        </div>

        <pre className="bg-zinc-900 p-4 rounded-md text-sm font-mono overflow-auto whitespace-pre-wrap">
          {output}
        </pre>

        <div className="bg-zinc-800 p-4 rounded-md mt-4">
          <h2 className="text-lg font-semibold mb-2">Saved Queries</h2>
          {savedQueries.length === 0 ? (
            <p className="text-sm text-zinc-400">No saved queries yet.</p>
          ) : (
            <ul className="text-sm space-y-1">
              {savedQueries.map((q, i) => (
                <li key={i} className="flex items-center justify-between">
                  <button
                    className="hover:underline text-green-400 text-left"
                    onClick={() => setJqQuery(q.query)}
                  >
                    {q.name}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditQuery(i)}
                      className="text-yellow-400 hover:underline text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteQuery(i)}
                      className="text-red-400 hover:underline text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
