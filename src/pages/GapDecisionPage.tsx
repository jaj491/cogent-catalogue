import { useParams, Navigate } from 'react-router-dom';
import { useGap } from '@/hooks/useGaps';
import { GapDecision } from '@/components/gaps/GapDecision';

export default function GapDecisionPage() {
  const { id } = useParams<{ id: string }>();
  const { data: gap, isLoading, error } = useGap(id || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading decision page...</div>
      </div>
    );
  }

  if (error || !gap) {
    return <Navigate to="/ideas" replace />;
  }

  return <GapDecision gap={gap} />;
}
