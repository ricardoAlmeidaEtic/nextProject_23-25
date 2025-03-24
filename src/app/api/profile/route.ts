import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ message: 'Unauthorized' }),
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
      include: {
        playlists: true, // Include playlists associated with the user
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404 }
      );
    }

    const profile = {
      name: user.name,
      followers: 1234, // Replace with actual followers count if available
      following: 567, // Replace with actual following count if available
      playlists: user.playlists.map((playlist) => ({
        id: playlist.id,
        title: playlist.name,
        artist: 'Various Artists', // Replace with actual artist if available
        tracks: 20, // Replace with actual track count if available
        duration: '1h 30m', // Replace with actual duration if available
        image: '/playlist-pic.jpg', // Replace with actual image if available
        year: 2021, // Replace with actual year if available
      })),
    };

    return new Response(
      JSON.stringify({ profile }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to fetch profile' }),
      { status: 500 }
    );
  }
}