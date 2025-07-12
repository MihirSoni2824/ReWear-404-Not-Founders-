import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Get the current swap to check item IDs
    const currentSwap = await prisma.swap.findUnique({
      where: { id },
      include: {
        item1: true,
        item2: true
      }
    });

    if (!currentSwap) {
      return NextResponse.json({ error: 'Swap not found' }, { status: 404 });
    }

    // Update the swap status
    const updatedSwap = await prisma.swap.update({
      where: { id },
      data: { status },
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

    // Update item statuses based on swap status
    if (status === 'ACCEPTED') {
      // Items become swapped
      await prisma.item.updateMany({
        where: {
          id: {
            in: [currentSwap.itemId1, currentSwap.itemId2]
          }
        },
        data: {
          status: 'SWAPPED'
        }
      });
    } else if (status === 'COMPLETED') {
      // Items become swapped and award points to both users
      await prisma.item.updateMany({
        where: {
          id: {
            in: [currentSwap.itemId1, currentSwap.itemId2]
          }
        },
        data: {
          status: 'SWAPPED'
        }
      });

      // Award 5 points to both users for completing the transaction
      const pointsToAward = 5;
      
      // Update user1 points
      await prisma.user.update({
        where: { id: currentSwap.userId1 },
        data: {
          points: {
            increment: pointsToAward
          }
        }
      });

      // Update user2 points
      await prisma.user.update({
        where: { id: currentSwap.userId2 },
        data: {
          points: {
            increment: pointsToAward
          }
        }
      });

      // Create points transactions for both users
      await prisma.pointsTransaction.createMany({
        data: [
          {
            userId: currentSwap.userId1,
            amount: pointsToAward,
            type: 'EARN',
            reason: `Completed swap transaction - Swap ID: ${id}`
          },
          {
            userId: currentSwap.userId2,
            amount: pointsToAward,
            type: 'EARN',
            reason: `Completed swap transaction - Swap ID: ${id}`
          }
        ]
      });
    } else if (status === 'REJECTED') {
      // Items become available again
      await prisma.item.updateMany({
        where: {
          id: {
            in: [currentSwap.itemId1, currentSwap.itemId2]
          }
        },
        data: {
          status: 'AVAILABLE'
        }
      });
    }

    return NextResponse.json(updatedSwap);
  } catch (error) {
    console.error('Error updating swap:', error);
    return NextResponse.json({ error: 'Failed to update swap' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const swap = await prisma.swap.findUnique({
      where: { id },
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

    if (!swap) {
      return NextResponse.json({ error: 'Swap not found' }, { status: 404 });
    }

    return NextResponse.json(swap);
  } catch (error) {
    console.error('Error fetching swap:', error);
    return NextResponse.json({ error: 'Failed to fetch swap' }, { status: 500 });
  }
} 