import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'User already exists' }),
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return new Response(
      JSON.stringify({ message: 'User registered successfully', user }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during registration:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to register user' }),
      { status: 500 }
    );
  }
}