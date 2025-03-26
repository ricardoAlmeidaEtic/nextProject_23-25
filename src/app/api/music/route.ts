import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tracks = await prisma.music.findMany();

    if (!tracks) {
      return NextResponse.json({ tracks: [] }, { status: 200 });
    }

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("Error fetching tracks:", error);

    return NextResponse.json(
      { error: "Failed to fetch tracks", details: error.message },
      { status: 500 }
    );
  }
}