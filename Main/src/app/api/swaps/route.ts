import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const swaps = await prisma.swap.findMany({
      where: {
        OR: [
          { userId1: userId },
          { userId2: userId }
        ]
      },
      include: {
        item1: true,
        item2: true,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId1, itemId2, userId1, userId2 } = body;

    if (!itemId1 || !itemId2 || !userId1 || !userId2) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if items exist and are available
    const item1 = await prisma.item.findUnique({
      where: { id: itemId1 }
    });

    const item2 = await prisma.item.findUnique({
      where: { id: itemId2 }
    });

    if (!item1 || !item2) {
      return NextResponse.json({ error: 'One or both items not found' }, { status: 404 });
    }

    if (item1.status !== 'AVAILABLE' || item2.status !== 'AVAILABLE') {
      return NextResponse.json({ error: 'One or both items are not available for swap' }, { status: 400 });
    }

    // Create the swap
    const swap = await prisma.swap.create({
      data: {
        itemId1,
        itemId2,
        userId1,
        userId2,
        status: 'PENDING'
      },
      include: {
        item1: true,
        item2: true,
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
      }
    });

    // Update item statuses to pending
    await prisma.item.updateMany({
      where: {
        id: {
          in: [itemId1, itemId2]
        }
      },
      data: {
        status: 'PENDING'
      }
    });

    return NextResponse.json(swap, { status: 201 });
  } catch (error) {
    console.error('Error creating swap:', error);
    return NextResponse.json({ error: 'Failed to create swap' }, { status: 500 });
  }
} 