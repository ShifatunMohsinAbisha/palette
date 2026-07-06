import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("term");
  if (!term) {
    return NextResponse.json({ error: "Term query parameter is required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=1`
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("iTunes proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch from iTunes" }, { status: 500 });
  }
}
