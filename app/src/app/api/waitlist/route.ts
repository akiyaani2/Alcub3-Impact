import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const WAITLIST_FILE = path.join(process.cwd(), "data", "waitlist.json");

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = body?.email?.trim()?.toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const type = body?.type ?? "newsletter"; // newsletter | enterprise | updates

  // Append to local JSON file (replace with Supabase later)
  try {
    await fs.mkdir(path.dirname(WAITLIST_FILE), { recursive: true });
    let entries: { email: string; type: string; timestamp: string }[] = [];
    try {
      const existing = await fs.readFile(WAITLIST_FILE, "utf-8");
      entries = JSON.parse(existing);
    } catch {
      // File doesn't exist yet
    }

    if (entries.some((e) => e.email === email)) {
      return NextResponse.json({ message: "Already signed up", status: "existing" });
    }

    entries.push({
      email,
      type,
      timestamp: new Date().toISOString(),
    });

    await fs.writeFile(WAITLIST_FILE, JSON.stringify(entries, null, 2));
    return NextResponse.json({ message: "Signed up successfully", status: "new" });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
