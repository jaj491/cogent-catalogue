import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGaps } from '@/hooks/useGaps';
import { GapIntakeWizard } from '@/components/gaps/GapIntakeWizard';
import { GapDashboard } from '@/components/gaps/GapDashboard';
import { Plus, Lightbulb, Search, BarChart3 } from 'lucide-react';

export default function GapFinder() {
  const [showIntake, setShowIntake] = useState(false);
  const navigate = useNavigate();
  const { data: gaps, isLoading } = useGaps();

  const activeGaps = gaps?.filter(g => g.status !== 'Closed') || [];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'New': return 'default';
      case 'In Review': return 'secondary';
      case 'Decision Made': return 'outline';
      case 'In Build': return 'default';
      case 'Closed': return 'secondary';
      default: return 'outline';
    }
  };

  const getUrgencyVariant = (urgency: string | null) => {
    switch (urgency) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      default: return 'outline';
    }
  };

  if (showIntake) {
    return (
      <div className="space-y-6">
        <GapIntakeWizard onClose={() => setShowIntake(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gap Finder</h1>
          <p className="text-muted-foreground">
            Identify where we should reuse, extend, or build new AI agents and workflows — before we start coding.
          </p>
        </div>
        <Button onClick={() => setShowIntake(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Submit New Gap
        </Button>
      </div>

      {/* Description Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm">
                Use the Gap Finder to submit a business need or opportunity and see how it maps to our existing agents, workflow packs, and skills.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                This helps us scale intelligently and avoid re-engineering across accounts and platforms.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            <Search className="h-4 w-4" />
            Active Opportunities
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Opportunities</CardTitle>
              <CardDescription>
                Business needs currently under review or in progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading gaps...</div>
              ) : activeGaps.length === 0 ? (
                <div className="text-center py-12">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No gaps submitted yet.</p>
                  <p className="text-muted-foreground">
                    Click "Submit New Gap" to capture a new opportunity.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Process Area</TableHead>
                      <TableHead>Target Client(s)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Owner</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeGaps.map((gap) => (
                      <TableRow 
                        key={gap.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => {
                          if (gap.status === 'Decision Made' || gap.decision) {
                            navigate(`/ideas/${gap.id}/decision`);
                          } else {
                            navigate(`/ideas/${gap.id}/analysis`);
                          }
                        }}
                      >
                        <TableCell className="font-medium">{gap.title}</TableCell>
                        <TableCell>
                          {gap.process_area && <Badge variant="outline">{gap.process_area}</Badge>}
                        </TableCell>
                        <TableCell>
                          {(gap.target_clients || []).length > 0 
                            ? gap.target_clients?.slice(0, 2).join(', ') 
                            : <span className="text-muted-foreground">Cross-client</span>
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(gap.status)}>{gap.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {gap.urgency && (
                            <Badge variant={getUrgencyVariant(gap.urgency)}>{gap.urgency}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {gap.decision_owner || gap.created_by || '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <GapDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
