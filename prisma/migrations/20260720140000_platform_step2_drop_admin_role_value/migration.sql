-- Remove the now-unused ADMIN value from the Role enum.
-- Postgres has no DROP VALUE for enums, so recreate the type and swap it in.
BEGIN;

CREATE TYPE "Role_new" AS ENUM ('SUPER_ADMIN', 'PROGRAM_MANAGER', 'INSTRUCTOR', 'MENTOR', 'REVIEWER', 'STUDENT');

ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'STUDENT';

DROP TYPE "Role";
ALTER TYPE "Role_new" RENAME TO "Role";

COMMIT;
