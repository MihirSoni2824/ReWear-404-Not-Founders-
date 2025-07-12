import { NextRequest, NextResponse } from 'next/server';
import { getItems, getUserItems, createItem } from '@/lib/database';
import { ItemCondition } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log('Fetching items from database...');
    let items;
    
    if (userId) {
      // Filter items by user ID
      items = await getUserItems(userId);
      console.log(`Found ${items.length} items for user ${userId}:`, items.map(item => ({ id: item.id, title: item.title, status: item.status })));
    } else {
      // Get all available items
      items = await getItems();
      console.log(`Found ${items.length} items:`, items.map(item => ({ id: item.id, title: item.title, status: item.status })));
    }
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const itemData = await request.json();
    console.log('Creating item with data:', itemData);

    // Validate required fields
    if (!itemData.userId || !itemData.title || !itemData.description || !itemData.category || !itemData.size || !itemData.condition || !itemData.points) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert condition to enum
    const condition = itemData.condition.toUpperCase() as ItemCondition;
    
    const newItem = await createItem({
      userId: itemData.userId,
      title: itemData.title,
      description: itemData.description,
      images: itemData.images || ['/DesignImages/ItemListingPage5.png'],
      category: itemData.category,
      size: itemData.size,
      condition: condition,
      points: parseInt(itemData.points),
      tags: itemData.tags || []
    });

    console.log('Item created successfully:', newItem);
    return NextResponse.json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
} 