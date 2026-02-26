
-- Create storage bucket for demo videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('demo-videos', 'demo-videos', true);

-- Allow authenticated users to upload demo videos
CREATE POLICY "Authenticated users can upload demo videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'demo-videos' AND auth.role() = 'authenticated');

-- Allow public read access to demo videos
CREATE POLICY "Demo videos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'demo-videos');

-- Allow admins and agent owners to delete demo videos
CREATE POLICY "Admins and owners can delete demo videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'demo-videos' AND public.has_any_role(auth.uid(), ARRAY['admin'::app_role, 'agent_owner'::app_role]));
