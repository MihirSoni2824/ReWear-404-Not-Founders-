import { prisma } from './db';
import { User, Item, Swap, PointsTransaction, ItemCondition, ItemStatus, SwapStatus, TransactionType } from '@prisma/client';
import bcrypt from 'bcryptjs';

// User functions
export const registerUser = async (userData: {
  email: string;
  password: string;
  name: string;
  location: string;
  profilePic?: string;
  bio?: string;
}): Promise<User> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email }
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 12);

  const newUser = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
      points: 100 // Starting points
    }
  });

  // Create initial points transaction
  await prisma.pointsTransaction.create({
    data: {
      userId: newUser.id,
      amount: 100,
      type: TransactionType.EARN,
      reason: 'Account creation bonus'
    }
  });

  return newUser;
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  return user;
};

export const getUserById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id }
  });
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  return await prisma.user.update({
    where: { id },
    data: updates
  });
};

// Item functions
export const createItem = async (itemData: {
  userId: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  size: string;
  condition: ItemCondition;
  points: number;
  tags: string[];
}): Promise<Item> => {
  const newItem = await prisma.item.create({
    data: {
      ...itemData,
      images: itemData.images,
      tags: itemData.tags,
      status: ItemStatus.AVAILABLE
    }
  });

  // Award points for uploading
  await addPoints(itemData.userId, 50, 'Item upload bonus');

  return newItem;
};

export const getItems = async (): Promise<Item[]> => {
  return await prisma.item.findMany({
    where: { status: ItemStatus.AVAILABLE },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          location: true,
          profilePic: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getItemById = async (id: string): Promise<Item | null> => {
  return await prisma.item.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          location: true,
          profilePic: true,
          bio: true
        }
      }
    }
  });
};

export const getUserItems = async (userId: string): Promise<Item[]> => {
  return await prisma.item.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
};

export const updateItem = async (id: string, updates: Partial<Item>): Promise<Item | null> => {
  return await prisma.item.update({
    where: { id },
    data: updates
  });
};

export const deleteItem = async (id: string): Promise<Item | null> => {
  return await prisma.item.delete({
    where: { id }
  });
};

// Swap functions
export const createSwapRequest = async (
  itemId1: string,
  itemId2: string,
  userId1: string,
  userId2: string
): Promise<Swap> => {
  const newSwap = await prisma.swap.create({
    data: {
      itemId1,
      itemId2,
      userId1,
      userId2,
      status: SwapStatus.PENDING
    }
  });

  // Update item statuses to pending
  await prisma.item.updateMany({
    where: { id: { in: [itemId1, itemId2] } },
    data: { status: ItemStatus.PENDING }
  });

  return newSwap;
};

export const getUserSwaps = async (userId: string): Promise<Swap[]> => {
  return await prisma.swap.findMany({
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
          location: true
        }
      },
      user2: {
        select: {
          id: true,
          name: true,
          location: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const updateSwapStatus = async (swapId: string, status: SwapStatus): Promise<Swap | null> => {
  const swap = await prisma.swap.update({
    where: { id: swapId },
    data: { status },
    include: {
      item1: true,
      item2: true,
      user1: true,
      user2: true
    }
  });

  // Handle item status updates based on swap status
  if (status === SwapStatus.ACCEPTED) {
    // Keep items as pending until swap is completed
  } else if (status === SwapStatus.REJECTED) {
    // Return items to available status
    await prisma.item.updateMany({
      where: { id: { in: [swap.itemId1, swap.itemId2] } },
      data: { status: ItemStatus.AVAILABLE }
    });
  } else if (status === SwapStatus.COMPLETED) {
    // Mark items as swapped and award points
    await prisma.item.updateMany({
      where: { id: { in: [swap.itemId1, swap.itemId2] } },
      data: { status: ItemStatus.SWAPPED }
    });

    // Award points to both users
    await addPoints(swap.userId1, 100, 'Successful swap');
    await addPoints(swap.userId2, 100, 'Successful swap');
  }

  return swap;
};

// Points functions
export const addPoints = async (userId: string, points: number, reason: string): Promise<void> => {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { points: { increment: points } }
    }),
    prisma.pointsTransaction.create({
      data: {
        userId,
        amount: points,
        type: TransactionType.EARN,
        reason
      }
    })
  ]);
};

export const spendPoints = async (userId: string, points: number, reason: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user || user.points < points) {
    return false;
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { points: { decrement: points } }
    }),
    prisma.pointsTransaction.create({
      data: {
        userId,
        amount: points,
        type: TransactionType.SPEND,
        reason
      }
    })
  ]);

  return true;
};

export const getPointsTransactions = async (userId: string): Promise<PointsTransaction[]> => {
  return await prisma.pointsTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}; 