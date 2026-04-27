-- CreateEnum for VerificationStatus if it doesn't exist
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');

-- AlterTable: Change verificationStatus from TEXT to VerificationStatus ENUM
ALTER TABLE "Club" ALTER COLUMN "verificationStatus" DROP DEFAULT;
ALTER TABLE "Club" ALTER COLUMN "verificationStatus" TYPE "VerificationStatus" USING "verificationStatus"::"VerificationStatus";
ALTER TABLE "Club" ALTER COLUMN "verificationStatus" SET DEFAULT 'UNVERIFIED';
