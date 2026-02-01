/*
  # Add color column to timetable_entries table

  1. Changes
    - Add a new 'color' column to timetable_entries table for customizing entry appearance
    
  2. Details:
    - The color can be used to customize the appearance of timetable entries
    - Optional field that defaults to NULL
    - Entries will use type-based colors when this field is NULL
*/

-- Add color column to timetable_entries
ALTER TABLE timetable_entries 
ADD COLUMN IF NOT EXISTS color text;

-- Add comment to explain the column's purpose
COMMENT ON COLUMN timetable_entries.color IS 'Custom color for the timetable entry (hexadecimal color code)';