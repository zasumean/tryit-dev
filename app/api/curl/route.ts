// app/api/curl/route.ts (for app directory routing)

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
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}
