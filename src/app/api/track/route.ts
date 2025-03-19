import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all Music objects from the database
    const musicTracks = await prisma.music.findMany(); // Ensure 'Music' model exists in schema.prisma

    return NextResponse.json({
      status: "success",
      data: musicTracks,
    });
  } catch (error) {
    console.error("Error fetching music tracks:", error);
    return new NextResponse(
      JSON.stringify({ status: "error", message: "Failed to fetch tracks" }),
      { status: 500 }
    );
  }
}