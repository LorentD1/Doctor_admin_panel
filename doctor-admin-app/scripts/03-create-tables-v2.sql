-- Create the visits table for the medical admin app
CREATE TABLE IF NOT EXISTS visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name VARCHAR(255) NOT NULL,
  patient_surname VARCHAR(255) NOT NULL,
  patient_phone VARCHAR(20),
  patient_email VARCHAR(255),
  patient_address TEXT,
  patient_birth_date DATE,
  patient_gender VARCHAR(10),
  visit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  visit_type VARCHAR(100),
  chief_complaint TEXT,
  diagnosis TEXT,
  treatment TEXT,
  medications TEXT,
  notes TEXT,
  follow_up_date DATE,
  visit_cost DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the settings table for clinic configuration
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_name VARCHAR(255) DEFAULT 'Klinika Mjekësore',
  clinic_address TEXT,
  clinic_phone VARCHAR(20),
  clinic_email VARCHAR(255),
  doctor_name VARCHAR(255),
  doctor_specialization VARCHAR(255),
  doctor_license VARCHAR(100),
  timezone VARCHAR(50) DEFAULT 'Europe/Belgrade',
  currency VARCHAR(10) DEFAULT 'EUR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (
  clinic_name,
  clinic_address,
  clinic_phone,
  clinic_email,
  doctor_name,
  doctor_specialization,
  doctor_license,
  timezone,
  currency
) VALUES (
  'Klinika Mjekësore Dr. Smith',
  'Rruga Nënë Tereza 123, Prishtinë, Kosovë',
  '+383 44 123 456',
  'info@klinika.com',
  'Dr. Agim Krasniqi',
  'Mjek i Përgjithshëm',
  'MED-2024-001',
  'Europe/Belgrade',
  'EUR'
) ON CONFLICT DO NOTHING;
