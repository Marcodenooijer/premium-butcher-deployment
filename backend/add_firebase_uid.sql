-- Add firebase_uid column to customers table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(255) UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_customers_firebase_uid 
ON customers(firebase_uid);

-- Add comment
COMMENT ON COLUMN customers.firebase_uid IS 'Firebase Authentication UID';

-- Show success message
DO $$
BEGIN
  RAISE NOTICE '✅ firebase_uid column added successfully!';
END $$;
