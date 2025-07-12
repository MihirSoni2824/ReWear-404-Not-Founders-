# Database Setup Guide

## Prerequisites

- MySQL Server installed and running
- MySQL Workbench (optional, for database management)

## Step 1: Create MySQL Database

1. Open MySQL Workbench or MySQL command line
2. Connect to your MySQL server
3. Create the database:

```sql
CREATE DATABASE rewear_db;
```

## Step 2: Update Environment Variables

Make sure your `.env` file has the correct database connection string:

"mysql://root:your_password@localhost:3306/rewear_db```env
DATABASE_URL="

````

Replace `your_password` with your actual MySQL root password.

## Step 3: Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Create and apply database migrations
npx prisma migrate dev --name init

# Seed the database with initial data
npx prisma db seed
````

## Step 4: Verify Setup

You can verify the setup by running:

```bash
# Open Prisma Studio to view your database
npx prisma studio
```

This will open a web interface at `http://localhost:5555` where you can browse your database tables.

## Database Schema

The database includes the following tables:

- **users**: User accounts with authentication and profile information
- **items**: Clothing items available for swapping
- **swaps**: Swap requests and their status
- **points_transactions**: Points earning and spending history

## Default User

After seeding, you can login with:

- **Email**: `jane@example.com`
- **Password**: `password123`

## Troubleshooting

### Connection Issues

- Make sure MySQL server is running
- Verify your password in the DATABASE_URL
- Check if the database `rewear_db` exists

### Migration Issues

- If you get errors about existing tables, you may need to reset:
  ```bash
  npx prisma migrate reset
  ```

### Prisma Client Issues

- Regenerate the client after schema changes:
  ```bash
  npx prisma generate
  ```
