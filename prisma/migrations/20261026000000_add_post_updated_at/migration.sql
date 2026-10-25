-- AlterTable
-- 기존 행은 createdAt 으로 채운 뒤 NOT NULL 로 전환한다. (@updatedAt 은 DB 기본값이 없다)
ALTER TABLE "Post" ADD COLUMN "updatedAt" TIMESTAMP(3);

UPDATE "Post" SET "updatedAt" = "createdAt";

ALTER TABLE "Post" ALTER COLUMN "updatedAt" SET NOT NULL;
