/*
  # Add DELETE permissions for events table

  1. Security
    - Add policy to allow all users to delete events
    - Enable DELETE operations on events table

  This migration adds the necessary permissions for users to delete events from the application.
*/

-- Add policy to allow all users to delete events
CREATE POLICY "Enable delete for all users"
  ON events
  FOR DELETE
  TO public
  USING (true);