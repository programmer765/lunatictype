-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "github_id" DROP NOT NULL,
ALTER COLUMN "google_id" DROP NOT NULL;
