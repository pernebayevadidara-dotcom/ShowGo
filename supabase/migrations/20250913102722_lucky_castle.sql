/*
  # Fix RLS policies for events table

  1. Security Changes
    - Add policy to allow all users to read events (SELECT)
    - Add policy to allow all users to create events (INSERT)
    - These policies enable public access for the ShowGo events platform

  2. Changes Made
    - Enable read access for all users on events table
    - Enable insert access for all users on events table
    - Policies use `true` condition to allow unrestricted access for public platform
*/

-- Enable read access for all users
CREATE POLICY "Enable read access for all users" 
ON "public"."events" 
FOR SELECT 
USING (true);

-- Enable insert access for all users  
CREATE POLICY "Enable insert for all users" 
ON "public"."events" 
FOR INSERT 
WITH CHECK (true);