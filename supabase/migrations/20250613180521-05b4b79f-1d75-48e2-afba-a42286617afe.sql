
-- Create drug_interactions table (medicines table already exists)
CREATE TABLE IF NOT EXISTS public.drug_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medicine_a TEXT NOT NULL,
  medicine_b TEXT NOT NULL,
  interaction_type TEXT NOT NULL, -- 'minor', 'moderate', 'major'
  description TEXT NOT NULL,
  severity_level INTEGER DEFAULT 1, -- 1-5 scale
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on drug_interactions table
ALTER TABLE public.drug_interactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for drug_interactions table (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view drug interactions" 
  ON public.drug_interactions 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Insert sample drug interactions data
INSERT INTO public.drug_interactions (medicine_a, medicine_b, interaction_type, description, severity_level) VALUES
('aspirin', 'warfarin', 'major', 'Increased risk of bleeding. Monitor INR closely and adjust warfarin dose as needed.', 4),
('aspirin', 'ibuprofen', 'moderate', 'Increased risk of gastrointestinal bleeding and reduced cardioprotective effects of aspirin.', 3),
('warfarin', 'ibuprofen', 'major', 'Significantly increased bleeding risk. Consider alternative pain management.', 4),
('lisinopril', 'ibuprofen', 'moderate', 'NSAIDs may reduce the antihypertensive effect of ACE inhibitors and increase kidney toxicity risk.', 3),
('metformin', 'alcohol', 'moderate', 'Increased risk of lactic acidosis, especially with heavy alcohol use.', 3),
('simvastatin', 'grapefruit', 'major', 'Grapefruit juice can increase simvastatin levels, raising the risk of muscle toxicity.', 4),
('digoxin', 'furosemide', 'moderate', 'Furosemide-induced potassium loss can increase digoxin toxicity.', 3),
('phenytoin', 'warfarin', 'major', 'Complex interaction affecting both drug levels. Requires careful monitoring.', 4),
('acetaminophen', 'warfarin', 'moderate', 'May enhance anticoagulant effect with prolonged high-dose use.', 2),
('omeprazole', 'clopidogrel', 'major', 'Omeprazole may reduce the effectiveness of clopidogrel.', 4);
