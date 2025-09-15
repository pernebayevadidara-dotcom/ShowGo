/*
  # Add columns to events table

  1. New Columns
    - `title` (text) - Event title/name
    - `date` (text) - Event date
    - `venue` (text) - Event venue name
    - `time` (text) - Event time
    - `description` (text) - Event description
    - `organizer` (text) - Event organizer
    - `category` (text) - Event category/genre
    - `phone` (text) - Contact phone number
    - `email` (text) - Contact email address
    - `image` (text) - Image URL or Supabase Storage path
    - `created_at` (timestamptz) - Record creation timestamp
    - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on events table
    - Add policies for public read access
    - Add policies for authenticated user management

  3. Performance
    - Add indexes on frequently queried columns
*/

-- Create events table if it doesn't exist
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
);

-- Add new columns to events table
DO $$
BEGIN
  -- Add title column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'title'
  ) THEN
    ALTER TABLE events ADD COLUMN title text;
  END IF;

  -- Add date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'date'
  ) THEN
    ALTER TABLE events ADD COLUMN date text;
  END IF;

  -- Add venue column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'venue'
  ) THEN
    ALTER TABLE events ADD COLUMN venue text;
  END IF;

  -- Add time column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'time'
  ) THEN
    ALTER TABLE events ADD COLUMN time text;
  END IF;

  -- Add description column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'description'
  ) THEN
    ALTER TABLE events ADD COLUMN description text;
  END IF;

  -- Add organizer column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'organizer'
  ) THEN
    ALTER TABLE events ADD COLUMN organizer text DEFAULT 'ShowGo Events';
  END IF;

  -- Add category column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'category'
  ) THEN
    ALTER TABLE events ADD COLUMN category text;
  END IF;

  -- Add phone column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'phone'
  ) THEN
    ALTER TABLE events ADD COLUMN phone text DEFAULT '(123) 456-7890';
  END IF;

  -- Add email column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'email'
  ) THEN
    ALTER TABLE events ADD COLUMN email text DEFAULT 'info@showgo.com';
  END IF;

  -- Add image column (prepared for Supabase Storage)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'image'
  ) THEN
    ALTER TABLE events ADD COLUMN image text;
  END IF;

  -- Add created_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE events ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE events ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on row updates
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Events are viewable by everyone"
  ON events
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to manage events
CREATE POLICY "Authenticated users can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete events"
  ON events
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_venue ON events(venue);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);