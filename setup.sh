#!/bin/bash

# Validates that the necessary environment configuration is present

# 1. Install Dependencies
echo -e "\033[0;36mStep 1: Installing dependencies...\033[0m"
npm install
if [ $? -ne 0 ]; then
    echo -e "\033[0;31mInstallation failed\033[0m"
    exit 1
fi

# 2. Generate Prisma Client
echo -e "\033[0;36mStep 2: Generating Prisma Client...\033[0m"
npx prisma generate
if [ $? -ne 0 ]; then
    echo -e "\033[0;31mPrisma generation failed\033[0m"
    exit 1
fi

# 3. Run Migrations
echo -e "\033[0;36mStep 3: Running Database Migrations...\033[0m"
npx prisma migrate dev
if [ $? -ne 0 ]; then
    echo -e "\033[0;31mMigration failed\033[0m"
    exit 1
fi

echo -e "\033[0;32mSetup successfully completed! You are ready to code.\033[0m"
echo -e "\033[0;32mRun 'npm run dev' to start the server.\033[0m"
