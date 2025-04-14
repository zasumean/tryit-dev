import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  // Explicitly typing the 'command' field in the request body
  const { command }: { command: string } = await req.json();

  // Ensure the command starts with 'curl'
  if (!command.startsWith("curl")) {
    return new NextResponse("Only curl commands are allowed", { status: 400 });
  }

  try {
    // Explicitly typing 'stdout' and 'stderr'
    const { stdout, stderr }: { stdout: string; stderr: string } = await execAsync(command);

    // Returning the stdout or stderr response
    return new NextResponse(stdout || stderr);
  } catch (err: unknown) {
    // Ensuring the error is cast to an instance of Error for typing
    return new NextResponse((err as Error).message, { status: 500 });
  }
}


