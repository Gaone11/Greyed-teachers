/*
  # Class rosters and attendance

  1. New Tables
    - `class_students`: teacher-managed roster entries for each class
    - `class_attendance`: daily attendance marks for rostered students

  2. Security
    - Teachers can manage roster and attendance rows for their own classes
*/

CREATE TABLE IF NOT EXISTS class_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  full_name text,
  student_name text,
  student_id text,
  parent_guardian_name text,
  parent_guardian_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage class rosters"
  ON class_students
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM classes
      WHERE classes.id = class_students.class_id
        AND classes.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM classes
      WHERE classes.id = class_students.class_id
        AND classes.teacher_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS class_students_class_id_idx ON class_students(class_id);
CREATE INDEX IF NOT EXISTS class_students_teacher_id_idx ON class_students(teacher_id);
CREATE UNIQUE INDEX IF NOT EXISTS class_students_class_name_unique_idx
  ON class_students(class_id, lower(name));

CREATE TABLE IF NOT EXISTS class_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES class_students(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  attendance_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'late', 'absent', 'excused')),
  note text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (student_id, attendance_date)
);

ALTER TABLE class_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage class attendance"
  ON class_attendance
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM classes
      WHERE classes.id = class_attendance.class_id
        AND classes.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM classes
      WHERE classes.id = class_attendance.class_id
        AND classes.teacher_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS class_attendance_class_date_idx ON class_attendance(class_id, attendance_date);
CREATE INDEX IF NOT EXISTS class_attendance_student_date_idx ON class_attendance(student_id, attendance_date);

CREATE OR REPLACE FUNCTION set_class_student_teacher_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.teacher_id IS NULL THEN
    SELECT teacher_id INTO NEW.teacher_id
    FROM classes
    WHERE id = NEW.class_id;
  END IF;

  IF NEW.full_name IS NULL THEN
    NEW.full_name := NEW.name;
  END IF;

  IF NEW.student_name IS NULL THEN
    NEW.student_name := NEW.name;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_class_attendance_teacher_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.teacher_id IS NULL THEN
    SELECT teacher_id INTO NEW.teacher_id
    FROM classes
    WHERE id = NEW.class_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_class_student_teacher_id_trigger') THEN
    CREATE TRIGGER set_class_student_teacher_id_trigger
      BEFORE INSERT OR UPDATE ON class_students
      FOR EACH ROW
      EXECUTE FUNCTION set_class_student_teacher_id();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_class_attendance_teacher_id_trigger') THEN
    CREATE TRIGGER set_class_attendance_teacher_id_trigger
      BEFORE INSERT OR UPDATE ON class_attendance
      FOR EACH ROW
      EXECUTE FUNCTION set_class_attendance_teacher_id();
  END IF;
END $$;
