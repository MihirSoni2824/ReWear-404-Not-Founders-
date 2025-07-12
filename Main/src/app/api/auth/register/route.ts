import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();

    if (!userData.email || !userData.password || !userData.name || !userData.location) {
      return NextResponse.json(
        { error: 'Email, password, name, and location are required' },
        { status: 400 }
      );
    }

    const user = await registerUser(userData);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Registration failed' },
      { status: 400 }
    );
  }
} 