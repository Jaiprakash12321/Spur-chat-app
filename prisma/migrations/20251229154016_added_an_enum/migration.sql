/*
  Warnings:

  - The `oauthProvider` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OauthProvider" AS ENUM ('GOOGLE', 'GITHUB');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "oauthProvider",
ADD COLUMN     "oauthProvider" "OauthProvider";
