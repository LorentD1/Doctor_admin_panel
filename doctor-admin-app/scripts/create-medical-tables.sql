-- Create visits table for medical admin app
CREATE TABLE IF NOT EXISTS public.visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    patient_age INTEGER,
    patient_phone VARCHAR(50),
    patient_address TEXT,
    visit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    diagnosis TEXT,
    symptoms TEXT,
    treatment TEXT,
    medications TEXT,
    notes TEXT,
    follow_up_date DATE,
    visit_type VARCHAR(100) DEFAULT 'Konsultë e rregullt',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table for clinic configuration
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clinic_name VARCHAR(255) DEFAULT 'Klinika Mjekësore',
    doctor_name VARCHAR(255),
    clinic_address TEXT,
    clinic_phone VARCHAR(50),
    clinic_email VARCHAR(255),
    working_hours TEXT DEFAULT '08:00 - 18:00',
    timezone VARCHAR(100) DEFAULT 'Europe/Belgrade',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.settings (clinic_name, doctor_name, clinic_address, clinic_phone, working_hours)
VALUES ('Klinika Mjekësore Dr. Smith', 'Dr. John Smith', 'Prishtinë, Kosovë', '+383 44 123 456', '08:00 - 18:00')
ON CONFLICT DO NOTHING;

-- Insert sample visit data
INSERT INTO public.visits (patient_name, patient_age, patient_phone, diagnosis, symptoms, treatment, visit_type)
VALUES 
    ('Agim Krasniqi', 45, '+383 44 111 222', 'Hipertensioni', 'Dhimbje koke, lodhje', 'Medikamente për presion', 'Konsultë e rregullt'),
    ('Fatmire Hoxha', 32, '+383 44 333 444', 'Gripi sezonal', 'Ethe, kollë, dhimbje fyti', 'Pushim dhe antibiotikë', 'Vizitë urgjente'),
    ('Besnik Berisha', 28, '+383 44 555 666', 'Kontrolli vjetor', 'Asnjë simptomë', 'Kontrolli i përgjithshëm', 'Kontrolli preventiv')
ON CONFLICT DO NOTHING;
