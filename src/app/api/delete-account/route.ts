import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    // Delete user from the database
    await prisma.user.delete({
      where: { email: session.user?.email || "" },
    });

    return new Response(JSON.stringify({ message: "Account deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}