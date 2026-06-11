DO $$ BEGIN
  CREATE TYPE "VerificationAttribute" AS ENUM (
    'STUDENT_STATUS',
    'HOUSING_ELIGIBILITY'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "VerificationRequest"
ADD COLUMN IF NOT EXISTS "requestedAttributeNew" "VerificationAttribute";

UPDATE "VerificationRequest"
SET "requestedAttributeNew" =
  CASE
    WHEN "requestedAttribute" = 'studentStatus' THEN 'STUDENT_STATUS'::"VerificationAttribute"
    WHEN "requestedAttribute" = 'housingEligible' THEN 'HOUSING_ELIGIBILITY'::"VerificationAttribute"
    WHEN "requestedAttribute" = 'STUDENT_STATUS' THEN 'STUDENT_STATUS'::"VerificationAttribute"
    WHEN "requestedAttribute" = 'HOUSING_ELIGIBILITY' THEN 'HOUSING_ELIGIBILITY'::"VerificationAttribute"
    ELSE 'STUDENT_STATUS'::"VerificationAttribute"
  END
WHERE "requestedAttributeNew" IS NULL;

ALTER TABLE "VerificationRequest"
ALTER COLUMN "requestedAttributeNew" SET NOT NULL;

ALTER TABLE "VerificationRequest"
DROP COLUMN "requestedAttribute";

ALTER TABLE "VerificationRequest"
RENAME COLUMN "requestedAttributeNew" TO "requestedAttribute";