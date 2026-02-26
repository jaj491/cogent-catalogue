import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DemoVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoUrl: string;
  agentName: string;
}

export function DemoVideoModal({ open, onOpenChange, videoUrl, agentName }: DemoVideoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>{agentName} – Demo</DialogTitle>
        </DialogHeader>
        <div className="p-4 pt-2">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full rounded-lg max-h-[70vh]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
