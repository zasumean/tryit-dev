// app/api/curl/route.ts

import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  const { command } = await req.json();

  if (!command.startsWith("curl")) {
    return new NextResponse("Only curl commands are allowed", { status: 400 });
  }

  try {
    const { stdout, stderr } = await execAsync(command);
    return new NextResponse(stdout || stderr);
  } catch (err) {
    const error = err as Error;
    return new NextResponse(error.message, { status: 500 });
  }
}

