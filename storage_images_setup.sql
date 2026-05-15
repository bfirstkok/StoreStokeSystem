-- Run this in Supabase SQL Editor to enable product image uploads.
-- It creates/updates a public Storage bucket named "images" and the needed policies.

INSERT INTO storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
VALUES (
    'images',
    'images',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

DROP POLICY IF EXISTS "Public can read images"
    ON storage.objects;

CREATE POLICY "Public can read images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Authenticated users can upload images"
    ON storage.objects;

CREATE POLICY "Authenticated users can upload images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Authenticated users can update images"
    ON storage.objects;

CREATE POLICY "Authenticated users can update images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'images')
    WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Authenticated users can delete images"
    ON storage.objects;

CREATE POLICY "Authenticated users can delete images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'images');
