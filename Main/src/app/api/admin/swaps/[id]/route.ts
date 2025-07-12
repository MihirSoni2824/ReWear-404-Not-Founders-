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
    const { action } = body;

    if (!action || !['approve', 'reject', 'complete', 'delete'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
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

    switch (action) {
      case 'approve':
        // Update swap status to accepted
        await prisma.swap.update({
          where: { id },
          data: { status: 'ACCEPTED' }
        });
        
        // Update item statuses to pending
        await prisma.item.updateMany({
          where: {
            id: {
              in: [currentSwap.itemId1, currentSwap.itemId2]
            }
          },
          data: {
            status: 'PENDING'
          }
        });
        
        return NextResponse.json({ message: 'Swap approved successfully' });
      
      case 'reject':
        // Update swap status to rejected
        await prisma.swap.update({
          where: { id },
          data: { status: 'REJECTED' }
        });
        
        // Update item statuses back to available
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
        
        return NextResponse.json({ message: 'Swap rejected successfully' });
      
      case 'complete':
        // Update swap status to completed
        await prisma.swap.update({
          where: { id },
          data: { status: 'COMPLETED' }
        });
        
        // Update item statuses to swapped
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
              reason: `Admin completed swap transaction - Swap ID: ${id}`
            },
            {
              userId: currentSwap.userId2,
              amount: pointsToAward,
              type: 'EARN',
              reason: `Admin completed swap transaction - Swap ID: ${id}`
            }
          ]
        });
        
        return NextResponse.json({ message: 'Swap completed successfully and points awarded to both users' });
      
      case 'delete':
        try {
          // Delete the swap
          await prisma.swap.delete({
            where: { id }
          });
          
          // Update item statuses back to available if they were pending
          await prisma.item.updateMany({
            where: {
              id: {
                in: [currentSwap.itemId1, currentSwap.itemId2]
              },
              status: 'PENDING'
            },
            data: {
              status: 'AVAILABLE'
            }
          });
          
          return NextResponse.json({ message: 'Swap deleted successfully' });
        } catch (deleteError) {
          console.error('Error deleting swap:', deleteError);
          return NextResponse.json({ 
            error: 'Failed to delete swap. It may be referenced by other records.' 
          }, { status: 500 });
        }
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating swap:', error);
    return NextResponse.json({ error: 'Failed to update swap' }, { status: 500 });
  }
} 