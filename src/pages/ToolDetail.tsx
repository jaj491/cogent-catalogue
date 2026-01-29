import { useParams, Link } from 'react-router-dom';
import { useTool, useSkillsByTool } from '@/hooks/useToolsRegistry';
import { useSkillAgents, useSkillWorkflows } from '@/hooks/useToolsRegistry';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Wrench, 
  Zap, 
  Server,
  Bot,
  GitBranch,
  Shield,
  Key,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const systemTypeColors: Record<string, string> = {
  'ERP': 'bg-blue-100 text-blue-800',
  'CLM': 'bg-purple-100 text-purple-800',
  'P2P': 'bg-green-100 text-green-800',
  'Intake': 'bg-amber-100 text-amber-800',
  'Collaboration': 'bg-cyan-100 text-cyan-800',
  'Data': 'bg-indigo-100 text-indigo-800',
  'AI': 'bg-pink-100 text-pink-800',
  'RPA': 'bg-orange-100 text-orange-800',
};

const sensitivityColors: Record<string, string> = {
  'Low': 'bg-green-100 text-green-800',
  'Medium': 'bg-amber-100 text-amber-800',
  'High': 'bg-red-100 text-red-800',
};

const statusColors: Record<string, string> = {
  'Draft': 'bg-slate-100 text-slate-700',
  'Approved': 'bg-green-100 text-green-800',
  'Deprecated': 'bg-red-100 text-red-800',
};

export default function ToolDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: tool, isLoading } = useTool(id!);
  const { data: skills } = useSkillsByTool(id!);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold">Tool not found</h2>
        <Link to="/tools">
          <Button variant="link">Back to Tools Registry</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link to="/tools" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Tools Registry
        </Link>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{tool.name}</h1>
                {tool.vendor && (
                  <p className="text-muted-foreground">{tool.vendor}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={cn("text-sm", systemTypeColors[tool.system_type])}>
                {tool.system_type}
              </Badge>
              {tool.data_sensitivity && (
                <Badge className={cn("text-sm", sensitivityColors[tool.data_sensitivity])}>
                  {tool.data_sensitivity} Sensitivity
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Key className="h-4 w-4" />
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{tool.auth_method || 'Not specified'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Server className="h-4 w-4" />
              Supported Lanes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {tool.supported_lanes?.length > 0 ? (
                tool.supported_lanes.map((lane) => (
                  <Badge key={lane} variant="outline">{lane}</Badge>
                ))
              ) : (
                <span className="text-muted-foreground">None specified</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Owner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{tool.owner_team || 'Unassigned'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {tool.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{tool.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Skills ({skills?.length || 0})
          </CardTitle>
          <CardDescription>
            Reusable capabilities provided by this tool
          </CardDescription>
        </CardHeader>
        <CardContent>
          {skills && skills.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {skills.map((skill) => (
                <Link key={skill.id} to={`/tools/skill/${skill.id}`}>
                  <div className="p-4 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium">{skill.name}</h4>
                      <Badge className={cn("text-xs shrink-0", statusColors[skill.status])}>
                        {skill.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {skill.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {skill.capability_category}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No skills defined for this tool
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
