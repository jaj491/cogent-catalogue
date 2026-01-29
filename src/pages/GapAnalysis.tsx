import { useParams, Navigate } from 'react-router-dom';
import { useGap } from '@/hooks/useGaps';
import { GapAnalysisResults } from '@/components/gaps/GapAnalysisResults';

export default function GapAnalysis() {
  const { id } = useParams<{ id: string }>();
  const { data: gap, isLoading, error } = useGap(id || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading gap analysis...</div>
      </div>
    );
  }

  if (error || !gap) {
    return <Navigate to="/ideas" replace />;
  }

  return <GapAnalysisResults gap={gap} />;
}
