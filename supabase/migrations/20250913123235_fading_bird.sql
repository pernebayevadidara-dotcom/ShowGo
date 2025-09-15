/*
  # Create event_attendees table

  1. New Tables
    - `event_attendees`
      - `id` (uuid, primary key)
      - `event_id` (bigint, foreign key to events table)
      - `user_id` (uuid, foreign key to auth.users)
      - `user_email` (text, for easier querying)
      - `attended_at` (timestamp, when user registered to attend)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `event_attendees` table
    - Add policy for authenticated users to read attendee data
    - Add policy for authenticated users to add themselves as attendees
    - Add policy for authenticated users to remove themselves from events

  3. Constraints
    - Unique constraint to prevent duplicate attendees for same event
    - Foreign key constraints for data integrity
*/

-- Create event_attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id bigint NOT NULL,
  user_id uuid NOT NULL,
  user_email text NOT NULL,
  attended_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  
  -- Foreign key constraints
  CONSTRAINT fk_event_attendees_event_id 
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_event_attendees_user_id 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    
  -- Unique constraint to prevent duplicate attendees
  CONSTRAINT unique_event_attendee 
    UNIQUE (event_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all attendee data for events
CREATE POLICY "Users can view event attendees"
  ON event_attendees
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Users can add themselves as attendees
CREATE POLICY "Users can add themselves as attendees"
  ON event_attendees
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can remove themselves from events
CREATE POLICY "Users can remove themselves from events"
  ON event_attendees
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON event_attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_email ON event_attendees(user_email);