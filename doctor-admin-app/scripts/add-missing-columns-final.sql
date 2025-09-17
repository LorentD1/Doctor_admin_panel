-- Add missing columns to visits table for enhanced medical records

-- Add gender column if it doesn't exist
ALTER TABLE public.visits 
ADD COLUMN IF NOT EXISTS gender VARCHAR(20);

-- Add allergies column if it doesn't exist  
ALTER TABLE public.visits 
ADD COLUMN IF NOT EXISTS allergies TEXT;

-- Add examinimet (examination findings) column if it doesn't exist
ALTER TABLE public.visits 
ADD COLUMN IF NOT EXISTS examinimet TEXT;

-- Update existing records to have default values for new columns
UPDATE public.visits 
SET 
    gender = 'Mashkull',
    allergies = 'Asnjë alergjie e njohur',
    examinimet = 'Ekzaminimi normal'
WHERE gender IS NULL OR allergies IS NULL OR examinimet IS NULL;
