/*
  # Add UPDATE permissions for events table

  1. Security
    - Add policy to allow all users to update events
    - This enables the edit functionality in the frontend
*/

-- Add policy to allow all users to update events
CREATE POLICY "Enable update for all users"
  ON events
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);