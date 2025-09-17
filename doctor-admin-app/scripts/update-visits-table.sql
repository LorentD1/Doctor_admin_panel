-- Add missing columns to visits table
ALTER TABLE visits 
ADD COLUMN IF NOT EXISTS allergies TEXT,
ADD COLUMN IF NOT EXISTS examinimet TEXT;

-- Update existing records to have null values for new columns
UPDATE visits SET allergies = NULL WHERE allergies IS NULL;
UPDATE visits SET examinimet = NULL WHERE examinimet IS NULL;
