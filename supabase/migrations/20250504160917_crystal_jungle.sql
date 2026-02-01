DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
    AND table_name = 'timetable_entries' 
    AND column_name = 'repeat'
  ) THEN
    ALTER TABLE timetable_entries ADD COLUMN repeat text;
    COMMENT ON COLUMN timetable_entries.repeat IS 'Repeat pattern for recurring entries (e.g., daily, weekly, monthly)';
  END IF;
END $$;