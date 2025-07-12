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

    if (!action || !['approve', 'suspend', 'delete'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    switch (action) {
      case 'approve':
        // For now, just return success (could add approval logic later)
        return NextResponse.json({ message: 'User approved successfully' });
      
      case 'suspend':
        // For now, just return success (could add suspension logic later)
        return NextResponse.json({ message: 'User suspended successfully' });
      
      case 'delete':
        try {
          // Delete user and all associated data (cascade will handle related records)
          await prisma.user.delete({
            where: { id }
          });
          return NextResponse.json({ message: 'User deleted successfully' });
        } catch (deleteError) {
          console.error('Error deleting user:', deleteError);
          return NextResponse.json({ 
            error: 'Failed to delete user. They may have active swaps or items.' 
          }, { status: 500 });
        }
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
} 