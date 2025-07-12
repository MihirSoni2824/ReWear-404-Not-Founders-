import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const swaps = await prisma.swap.findMany({
      include: {
        item1: {
          select: {
            id: true,
            title: true
          }
        },
        item2: {
          select: {
            id: true,
            title: true
          }
        },
        user1: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        user2: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(swaps);
  } catch (error) {
    console.error('Error fetching swaps:', error);
    return NextResponse.json({ error: 'Failed to fetch swaps' }, { status: 500 });
  }
} 