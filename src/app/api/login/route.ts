import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password' }),
        { status: 401 }
      );
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password' }),
        { status: 401 }
      );
    }

    // Generate a JWT token (replace 'your-secret-key' with a secure key)
    const token = sign({ userId: user.id }, 'your-secret-key', {
      expiresIn: '1h',
    });

    return new Response(
      JSON.stringify({ message: 'Login successful', token }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during login:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to login' }),
      { status: 500 }
    );
  }
}