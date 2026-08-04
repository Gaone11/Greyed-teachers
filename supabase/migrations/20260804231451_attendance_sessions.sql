/*
  # Attendance completion sessions

  Stores a durable daily completion record for each class attendance date.
  Individual student attendance rows remain in `class_attendance`; this table
  records that the teacher finished the register for the day plus summary totals.
*/

CREATE TABLE IF NOT EXISTS class_attendance_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  attendance_date date NOT NULL DEFAULT CURRENT_DATE,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  completed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  total_students integer NOT NULL DEFAULT 0,
  present_count integer NOT NULL DEFAULT 0,
  late_count integer NOT NULL DEFAULT 0,
  absent_count integer NOT NULL DEFAULT 0,
  excused_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (class_id, attendance_date)
);

ALTER TABLE class_attendance_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage attendance sessions"
  ON class_attendance_sessions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM classes
      WHERE classes.id = class_attendance_sessions.class_id
        AND classes.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM classes
      WHERE classes.id = class_attendance_sessions.class_id
        AND classes.teacher_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS class_attendance_sessions_class_date_idx
  ON class_attendance_sessions(class_id, attendance_date);

CREATE OR REPLACE FUNCTION set_class_attendance_session_teacher_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.teacher_id IS NULL THEN
    SELECT teacher_id INTO NEW.teacher_id
    FROM classes
    WHERE id = NEW.class_id;
  END IF;

  IF NEW.completed = true AND NEW.completed_at IS NULL THEN
    NEW.completed_at := now();
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_class_attendance_session_teacher_id_trigger') THEN
    CREATE TRIGGER set_class_attendance_session_teacher_id_trigger
      BEFORE INSERT OR UPDATE ON class_attendance_sessions
      FOR EACH ROW
      EXECUTE FUNCTION set_class_attendance_session_teacher_id();
  END IF;
END $$;
