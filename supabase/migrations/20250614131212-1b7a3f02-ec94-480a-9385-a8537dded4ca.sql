
-- Enable Row Level Security on medicines and reminders
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Medicines: Allow users to manage only their own records
CREATE POLICY "Authenticated users can insert their own medicines"
  ON medicines
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Authenticated users can select their own medicines"
  ON medicines
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can update their own medicines"
  ON medicines
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can delete their own medicines"
  ON medicines
  FOR DELETE
  USING (user_id = auth.uid());

-- Reminders: Allow users to manage only their own records
CREATE POLICY "Authenticated users can insert their own reminders"
  ON reminders
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Authenticated users can select their own reminders"
  ON reminders
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can update their own reminders"
  ON reminders
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can delete their own reminders"
  ON reminders
  FOR DELETE
  USING (user_id = auth.uid());
