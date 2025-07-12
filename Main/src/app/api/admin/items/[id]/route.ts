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

    if (!action || !['approve', 'reject', 'delete'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    switch (action) {
      case 'approve':
        // Update item status to available
        await prisma.item.update({
          where: { id },
          data: { status: 'AVAILABLE' }
        });
        return NextResponse.json({ message: 'Item approved successfully' });
      
      case 'reject':
        // Update item status to unavailable (could be a new status)
        await prisma.item.update({
          where: { id },
          data: { status: 'PENDING' }
        });
        return NextResponse.json({ message: 'Item rejected successfully' });
      
      case 'delete':
        // Delete the item
        await prisma.item.delete({
          where: { id }
        });
        return NextResponse.json({ message: 'Item deleted successfully' });
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
} 