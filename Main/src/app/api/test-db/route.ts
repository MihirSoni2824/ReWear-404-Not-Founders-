import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Test the connection
    await prisma.$connect();
    
    // Try to get a user
    const user = await prisma.user.findFirst();
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount: user ? 1 : 0,
      connectionString: process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***:***@') // Hide credentials
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      connectionString: process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***:***@') // Hide credentials
    }, { status: 500 });
  }
} 