-- Add missing columns to visits table
ALTER TABLE visits 
ADD COLUMN IF NOT EXISTS allergies TEXT,
ADD COLUMN IF NOT EXISTS examinimet TEXT;

-- Update existing records to have empty values for new columns
UPDATE visits 
SET allergies = '', examinimet = '' 
WHERE allergies IS NULL OR examinimet IS NULL;
