/*
  # Create event-images storage bucket with proper policies

  1. Storage Setup
    - Create `event-images` bucket for storing event images
    - Configure bucket as public for read access
    - Set file size limit to 5MB
    - Allow only image file types

  2. Security Policies
    - Allow public read access to view event images
    - Allow anonymous users to upload images (for event creation)
    - Allow authenticated users full CRUD access
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images', 
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Policy for public read access (anyone can view event images)
CREATE POLICY "Public read access for event images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'event-images');

-- Policy for anonymous upload (allows event creation without authentication)
CREATE POLICY "Anonymous upload for event images"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'event-images');

-- Policy for authenticated users to have full access
CREATE POLICY "Authenticated users full access to event images"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'event-images')
WITH CHECK (bucket_id = 'event-images');