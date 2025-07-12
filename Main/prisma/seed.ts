import { PrismaClient, ItemCondition } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Jane Doe user
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const janeDoe = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      password: hashedPassword,
      name: 'Jane Doe',
      location: 'New York, USA',
      points: 1200,
      profilePic: '/DesignImages/UserDashBoardPage6.png',
      bio: 'Fashion enthusiast and sustainability advocate'
    }
  });

  console.log('✅ Created user:', janeDoe.name);

  // Create sample items
  const items = await Promise.all([
    prisma.item.upsert({
      where: { id: 'item-1' },
      update: {},
      create: {
        id: 'item-1',
        userId: janeDoe.id,
        title: 'Vintage Denim Jacket',
        description: 'A classic denim jacket from the 90s. This jacket is in excellent condition and has a unique vintage look.',
        images: ['/DesignImages/ProductDetailPage7.png'],
        category: 'Outerwear',
        size: 'M',
        condition: ItemCondition.EXCELLENT,
        points: 500,
        tags: ['vintage', 'denim', 'jacket']
      }
    }),
    prisma.item.upsert({
      where: { id: 'item-2' },
      update: {},
      create: {
        id: 'item-2',
        userId: janeDoe.id,
        title: 'Bohemian Maxi Dress',
        description: 'A beautiful and flowy maxi dress perfect for summer.',
        images: ['/DesignImages/ItemListingPage5.png'],
        category: 'Dresses',
        size: 'S',
        condition: ItemCondition.GOOD,
        points: 300,
        tags: ['bohemian', 'maxi', 'dress']
      }
    })
  ]);

  console.log('✅ Created items:', items.map(item => item.title));

  // Create points transactions for Jane Doe
  await prisma.pointsTransaction.createMany({
    skipDuplicates: true,
    data: [
      {
        userId: janeDoe.id,
        amount: 100,
        type: 'EARN',
        reason: 'Account creation bonus'
      },
      {
        userId: janeDoe.id,
        amount: 50,
        type: 'EARN',
        reason: 'Item upload bonus'
      },
      {
        userId: janeDoe.id,
        amount: 50,
        type: 'EARN',
        reason: 'Item upload bonus'
      },
      {
        userId: janeDoe.id,
        amount: 1000,
        type: 'EARN',
        reason: 'Community contribution bonus'
      }
    ]
  });

  console.log('✅ Created points transactions');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 