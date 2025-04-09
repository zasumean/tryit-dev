'use client';

import Link from 'next/link';

export default function Home() {
  const tools = [
    {
      name: 'jq Playground',
      href: '/tools/jq',
      description: 'Run and test jq queries on JSON',
      available: true,
    },
    {
      name: 'Regex Tester',
      href: '/tools/regex',
      description: 'Test regular expressions quickly',
      available: true,
    },
    {
      name: 'cURL Playground',
      href: '#',
      description: 'Craft and test cURL commands',
      available: false,
    },
    {
      name: 'Base64 Encoder/Decoder',
      href: '#',
      description: 'Encode or decode Base64 strings',
      available: false,
    },
    {
      name: 'JWT Decoder',
      href: '#',
      description: 'Decode and inspect JSON Web Tokens',
      available: false,
    },
    {
      name: 'UUID Generator',
      href: '#',
      description: 'Generate UUIDs for testing or dev use',
      available: false,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">TryIt.dev</h1>
      <p className="text-center text-zinc-400 mb-10">
      Developer tools to try things quickly, right in your browser.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {tools.map((tool, index) =>
          tool.available ? (
            <Link
              key={index}
              href={tool.href}
              className="bg-zinc-900 hover:bg-zinc-800 p-6 rounded-2xl border border-zinc-800 transition-transform duration-200 hover:scale-[1.02] cursor-pointer shadow-md hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold">{tool.name}</h2>
              <p className="text-zinc-400 text-sm mt-1">{tool.description}</p>
            </Link>
          ) : (
            <div
              key={index}
              className="bg-zinc-900 opacity-50 p-6 rounded-xl shadow-md border border-zinc-700 relative cursor-not-allowed"
            >
              <h2 className="text-xl font-semibold">{tool.name}</h2>
              <p className="text-zinc-500 text-sm mt-1">{tool.description}</p>
              <span className="absolute top-2 right-2 text-xs text-yellow-400 bg-yellow-800 px-2 py-0.5 rounded">
                Coming Soon
              </span>
            </div>
          )
        )}
      </div>
    </main>
  );
}
