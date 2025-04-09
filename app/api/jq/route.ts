import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function POST(req: NextRequest) {
  try {
    const { json, query } = await req.json();

    const jqCommand = `jq '${query}'`;
    const child = exec(jqCommand, (error, stdout, stderr) => {
      // no-op: we handle through stream below
    });

    let result = '';
    let errorMsg = '';

    child.stdin?.write(Buffer.from(JSON.stringify(json)));
    child.stdin?.end();

    child.stdout?.on('data', (data) => {
      result += data;
    });

    child.stderr?.on('data', (data) => {
      errorMsg += data;
    });

    return await new Promise((resolve) => {
      child.on('close', (code) => {
        if (code === 0) {
          resolve(NextResponse.json({ result }));
        } else {
          resolve(NextResponse.json({ error: errorMsg || 'Unknown error' }, { status: 400 }));
        }
      });
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
