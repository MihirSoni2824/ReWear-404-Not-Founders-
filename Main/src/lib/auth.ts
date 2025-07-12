// Simple in-memory user storage for demo purposes
// In production, this would be replaced with a proper database

export interface User {
  id: string;
  email: string;
  password: string; // In production, this would be hashed
  name: string;
  location: string;
  points: number;
  profilePic?: string;
  createdAt: Date;
  bio?: string;
}

export interface Item {
  id: string;
  userId: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  size: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  status: 'available' | 'pending' | 'swapped';
  points: number;
  tags: string[];
  createdAt: Date;
}

export interface Swap {
  id: string;
  itemId1: string;
  itemId2: string;
  userId1: string;
  userId2: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: Date;
}

// In-memory storage
let users: User[] = [
  {
    id: '1',
    email: 'jane@example.com',
    password: 'password123',
    name: 'Jane Doe',
    location: 'New York, USA',
    points: 1200,
    profilePic: '/DesignImages/UserDashBoardPage6.png',
    createdAt: new Date('2024-01-01'),
    bio: 'Fashion enthusiast and sustainability advocate'
  }
];

let items: Item[] = [
  {
    id: '1',
    userId: '1',
    title: 'Vintage Denim Jacket',
    description: 'A classic denim jacket from the 90s. This jacket is in excellent condition and has a unique vintage look.',
    images: ['/DesignImages/ProductDetailPage7.png'],
    category: 'Outerwear',
    size: 'M',
    condition: 'excellent',
    status: 'available',
    points: 500,
    tags: ['vintage', 'denim', 'jacket'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    userId: '1',
    title: 'Bohemian Maxi Dress',
    description: 'A beautiful and flowy maxi dress perfect for summer.',
    images: ['/DesignImages/ItemListingPage5.png'],
    category: 'Dresses',
    size: 'S',
    condition: 'good',
    status: 'available',
    points: 300,
    tags: ['bohemian', 'maxi', 'dress'],
    createdAt: new Date('2024-01-10')
  }
];

let swaps: Swap[] = [];

// Authentication functions
export const registerUser = async (userData: Omit<User, 'id' | 'points' | 'createdAt'>): Promise<User> => {
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    points: 100, // Starting points
    createdAt: new Date()
  };

  users.push(newUser);
  return newUser;
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  return user;
};

export const getUserById = (id: string): User | undefined => {
  return users.find(u => u.id === id);
};

export const updateUser = (id: string, updates: Partial<User>): User | undefined => {
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) return undefined;
  
  users[userIndex] = { ...users[userIndex], ...updates };
  return users[userIndex];
};

// Item functions
export const createItem = async (itemData: Omit<Item, 'id' | 'createdAt'>): Promise<Item> => {
  const newItem: Item = {
    ...itemData,
    id: Date.now().toString(),
    createdAt: new Date()
  };

  items.push(newItem);
  
  // Award points for uploading
  const user = getUserById(itemData.userId);
  if (user) {
    updateUser(user.id, { points: user.points + 50 });
  }

  return newItem;
};

export const getItems = (): Item[] => {
  return items.filter(item => item.status === 'available');
};

export const getItemById = (id: string): Item | undefined => {
  return items.find(item => item.id === id);
};

export const getUserItems = (userId: string): Item[] => {
  return items.filter(item => item.userId === userId);
};

// Swap functions
export const createSwapRequest = async (itemId1: string, itemId2: string, userId1: string, userId2: string): Promise<Swap> => {
  const newSwap: Swap = {
    id: Date.now().toString(),
    itemId1,
    itemId2,
    userId1,
    userId2,
    status: 'pending',
    createdAt: new Date()
  };

  swaps.push(newSwap);
  
  // Update item status
  const item1 = getItemById(itemId1);
  const item2 = getItemById(itemId2);
  if (item1) {
    const itemIndex = items.findIndex(i => i.id === itemId1);
    if (itemIndex !== -1) {
      items[itemIndex].status = 'pending';
    }
  }
  if (item2) {
    const itemIndex = items.findIndex(i => i.id === itemId2);
    if (itemIndex !== -1) {
      items[itemIndex].status = 'pending';
    }
  }

  return newSwap;
};

export const getUserSwaps = (userId: string): Swap[] => {
  return swaps.filter(swap => swap.userId1 === userId || swap.userId2 === userId);
};

export const updateSwapStatus = (swapId: string, status: Swap['status']): Swap | undefined => {
  const swapIndex = swaps.findIndex(s => s.id === swapId);
  if (swapIndex === -1) return undefined;

  swaps[swapIndex].status = status;
  
  // If swap is completed, award points to both users
  if (status === 'completed') {
    const swap = swaps[swapIndex];
    const user1 = getUserById(swap.userId1);
    const user2 = getUserById(swap.userId2);
    
    if (user1) updateUser(user1.id, { points: user1.points + 100 });
    if (user2) updateUser(user2.id, { points: user2.points + 100 });
  }

  return swaps[swapIndex];
};

// Points functions
export const addPoints = (userId: string, points: number, reason: string): void => {
  const user = getUserById(userId);
  if (user) {
    updateUser(user.id, { points: user.points + points });
  }
};

export const spendPoints = (userId: string, points: number, reason: string): boolean => {
  const user = getUserById(userId);
  if (user && user.points >= points) {
    updateUser(user.id, { points: user.points - points });
    return true;
  }
  return false;
}; 