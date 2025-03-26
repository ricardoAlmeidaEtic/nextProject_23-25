import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Await the params promise to get the actual parameters
  const { id } = await context.params;
  const { action } = await req.json(); // Action can be "like", "removeLike", "dislike", "removeDislike"
  const musicId = parseInt(id);

  if (!musicId || !["like", "removeLike", "dislike", "removeDislike"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    let updatedMusic;

    switch (action) {
      case "like":
        updatedMusic = await prisma.music.update({
          where: { id: musicId },
          data: { likes: { increment: 1 } },
        });
        break;

      case "removeLike":
        updatedMusic = await prisma.music.update({
          where: { id: musicId },
          data: { likes: { decrement: 1 } },
        });
        break;

      case "dislike":
        updatedMusic = await prisma.music.update({
          where: { id: musicId },
          data: { dislikes: { increment: 1 } },
        });
        break;

      case "removeDislike":
        updatedMusic = await prisma.music.update({
          where: { id: musicId },
          data: { dislikes: { decrement: 1 } },
        });
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(updatedMusic);
  } catch (error) {
    console.error("Error updating music:", error);
    return NextResponse.json({ error: "Failed to update music" }, { status: 500 });
  }
}