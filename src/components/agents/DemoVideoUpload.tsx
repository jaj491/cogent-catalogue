import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, Trash2, Video } from 'lucide-react';
import { useUpdateAgent } from '@/hooks/useAgents';
import { toast } from 'sonner';
import type { Agent } from '@/types/agent';

interface DemoVideoUploadProps {
  agent: Agent;
}

export function DemoVideoUpload({ agent }: DemoVideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateAgent = useUpdateAgent();

  const currentVideoUrl = agent.demo_assets?.[0] || null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('File size must be under 100MB');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const filePath = `${agent.id}/demo.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('demo-videos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('demo-videos')
        .getPublicUrl(filePath);

      await updateAgent.mutateAsync({
        id: agent.id,
        demo_assets: [publicUrl],
      });

      toast.success('Demo video uploaded successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload video');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    try {
      const filesToDelete = [`${agent.id}/demo.mp4`, `${agent.id}/demo.webm`, `${agent.id}/demo.mov`];
      await supabase.storage.from('demo-videos').remove(filesToDelete);

      await updateAgent.mutateAsync({
        id: agent.id,
        demo_assets: [],
      });

      toast.success('Demo video removed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove video');
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold flex items-center gap-2">
        <Video className="h-4 w-4" />
        Demo Video
      </Label>

      {currentVideoUrl ? (
        <div className="space-y-3">
          <video
            src={currentVideoUrl}
            controls
            className="w-full rounded-lg border border-border max-h-[400px]"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Upload className="h-4 w-4 mr-1" />}
              Replace
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemove}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full h-24 border-dashed"
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Uploading...
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Upload className="h-5 w-5" />
              <span className="text-sm">Upload demo video (MP4, WebM, MOV)</span>
            </div>
          )}
        </Button>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
