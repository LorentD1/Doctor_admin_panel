-- Insert default settings
INSERT INTO settings (category, data) VALUES 
('clinic', '{
  "name": "Klinika Mjekësore Dr. Agron Krasniqi",
  "address": "Rruga Nëna Terezë, Nr. 15",
  "city": "Prishtinë",
  "postalCode": "10000",
  "phone": "+383 38 123 456",
  "email": "info@klinika-krasniqi.com",
  "website": "www.klinika-krasniqi.com"
}'::jsonb),
('doctor', '{
  "name": "Dr. Agron Krasniqi",
  "specialization": "Mjek i Përgjithshëm",
  "license": "MK-2024-001",
  "phone": "+383 44 123 456",
  "email": "dr.krasniqi@gmail.com"
}'::jsonb),
('system', '{
  "timezone": "Europe/Belgrade",
  "language": "sq",
  "dateFormat": "dd/mm/yyyy",
  "timeFormat": "24h",
  "autoBackup": true,
  "emailNotifications": true,
  "smsNotifications": false,
  "darkMode": false
}'::jsonb)
ON CONFLICT (category) DO NOTHING;

-- Insert sample visits data
INSERT INTO visits (patient_name, patient_age, patient_phone, patient_address, visit_date, visit_type, symptoms, diagnosis, treatment, status, total_visits_for_patient) VALUES 
('Agron Krasniqi', 45, '+383 44 123 456', 'Prishtinë', '2024-01-15', 'checkup', 'Dhimbje koke, lodhje', 'Hipertension', 'Ilaçe për tension, dietë e kufizuar me kripë', 'active', 8),
('Fatmire Hoxha', 32, '+383 45 789 012', 'Prizren', '2024-01-14', 'consultation', 'Kontroll rutinor', 'Kontroll rutinor', 'Vazhdoni me jetesën e shëndetshme', 'active', 3),
('Besnik Gashi', 58, '+383 49 345 678', 'Pejë', '2024-01-12', 'followup', 'Kontroll i sheqerit në gjak', 'Diabetes tip 2', 'Insulinë, dietë e rreptë, ushtrime', 'follow-up', 12),
('Valdete Berisha', 28, '+383 44 567 890', 'Gjakovë', '2024-01-10', 'consultation', 'Konsultim për planifikim familjar', 'Konsultim', 'Këshilla për planifikim familjar', 'new', 2),
('Driton Mustafa', 41, '+383 45 234 567', 'Ferizaj', '2024-01-08', 'consultation', 'Reaksione alergjike', 'Alergji sezonale', 'Antihistaminikë, shmangni alergjenet', 'active', 6);
