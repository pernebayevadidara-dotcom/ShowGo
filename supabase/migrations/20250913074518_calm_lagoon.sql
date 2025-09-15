/*
  # Create Storage Bucket for Event Images

  1. Storage Setup
    - Create 'event-images' bucket for storing event photos
    - Set up public access policies for image viewing
    - Configure upload policies for authenticated users

  2. Security
    - Allow public read access to event images
    - Restrict uploads to authenticated users only
    - Set file size and type restrictions
*/

-- Create the storage bucket for event images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Allow public access to view images
CREATE POLICY "Public Access to Event Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload event images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Authenticated users can update event images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'event-images');

-- Allow authenticated users to delete event images
CREATE POLICY "Authenticated users can delete event images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event-images');