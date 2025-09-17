-- Add gender column to visits table
ALTER TABLE public.visits 
ADD COLUMN IF NOT EXISTS patient_gender VARCHAR(10) DEFAULT 'Mashkull';

-- Update existing records with default gender values
UPDATE public.visits 
SET patient_gender = CASE 
    WHEN patient_name LIKE '%Fatmire%' OR patient_name LIKE '%Valdete%' OR patient_name LIKE '%Shpresa%' THEN 'Femër'
    ELSE 'Mashkull'
END
WHERE patient_gender IS NULL;
