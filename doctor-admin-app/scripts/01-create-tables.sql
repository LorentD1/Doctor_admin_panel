-- Create visits table (main table with patient info embedded)
CREATE TABLE IF NOT EXISTS visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Patient information (embedded in visit)
  patient_name VARCHAR(255) NOT NULL,
  patient_age INTEGER,
  patient_phone VARCHAR(50),
  patient_address VARCHAR(255),
  
  -- Visit information
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  visit_type VARCHAR(50) NOT NULL, -- consultation, checkup, followup, emergency
  symptoms TEXT,
  diagnosis TEXT,
  treatment TEXT,
  notes TEXT,
  
  -- Status and metadata
  status VARCHAR(20) DEFAULT 'active', -- new, active, follow-up, completed
  total_visits_for_patient INTEGER DEFAULT 1
);

-- Create settings table for clinic configuration
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Settings category
  category VARCHAR(50) NOT NULL, -- clinic, doctor, system
  
  -- Settings data (JSON format for flexibility)
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  UNIQUE(category)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_visits_patient_name ON visits(patient_name);
CREATE INDEX IF NOT EXISTS idx_visits_visit_date ON visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_visits_status ON visits(status);
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON visits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
