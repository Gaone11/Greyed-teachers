/*
  # Add repeat column to timetable_entries table

  1. Changes
    - Add a new 'repeat' column to timetable_entries table that supports weekly and monthly repeats
    
  2. Details:
    - The repeat field allows entries to be marked as recurring weekly or monthly
    - Optional field that defaults to NULL
    - Entries with repeat=NULL will not recur
*/

-- Add repeat column to timetable_entries with type checking
ALTER TABLE timetable_entries 
ADD COLUMN IF NOT EXISTS repeat text CHECK (repeat IN ('weekly', 'monthly'));

-- Add comment to explain the column's purpose
COMMENT ON COLUMN timetable_entries.repeat IS 'Indicates if the entry repeats weekly or monthly';