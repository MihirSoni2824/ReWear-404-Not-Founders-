#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Setting up ReWear Database...\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('❌ .env file not found!');
  console.log('Please create a .env file with your database connection string:');
  console.log('DATABASE_URL="mysql://root:your_password@localhost:3306/rewear_db"');
  process.exit(1);
}

try {
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('\n🗄️  Creating database migrations...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });

  console.log('\n🌱 Seeding database with initial data...');
  execSync('npx prisma db seed', { stdio: 'inherit' });

  console.log('\n✅ Database setup complete!');
  console.log('\nYou can now:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Login with: jane@example.com / password123');
  console.log('3. View your database with: npx prisma studio');

} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  console.log('\nTroubleshooting:');
  console.log('1. Make sure MySQL is running');
  console.log('2. Check your DATABASE_URL in .env');
  console.log('3. Ensure the database "rewear_db" exists');
  process.exit(1);
} 