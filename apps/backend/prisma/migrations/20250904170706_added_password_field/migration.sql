-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "password" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
