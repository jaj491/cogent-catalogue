import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  Download,
  Users,
  Link2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAgents } from '@/hooks/useAgents';
import { 
  useUnmatchedUsageRows, 
  useImportUsageMetrics, 
  useResolveUnmatchedRow,
  useAgentAliases
} from '@/hooks/useUsageMetrics';
import { format } from 'date-fns';

export function UsageMetricsImport() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [createAlias, setCreateAlias] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: agents } = useAgents();
  const { data: unmatchedRows, isLoading: loadingUnmatched } = useUnmatchedUsageRows();
  const { data: aliases } = useAgentAliases();
  const importMutation = useImportUsageMetrics();
  const resolveMutation = useResolveUnmatchedRow();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a CSV file',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });
      rows.push(row);
    }
    return rows;
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    
    setIsImporting(true);
    
    try {
      const text = await selectedFile.text();
      const rows = parseCSV(text);
      
      // Map CSV columns to our schema
      const mappedRows = rows.map(row => ({
        account: row.account || 'Unknown',
        agent_name: row.agent_name || row.agent || '',
        metric: row.metric || 'unique_users',
        value: parseFloat(row.value) || 0,
        time_window_start: row.time_window_start || row.start_date || new Date().toISOString().split('T')[0],
        time_window_end: row.time_window_end || row.end_date || new Date().toISOString().split('T')[0],
        data_source: row.data_source || 'Adoption PPTX',
        raw_agent_slug: row.agent_slug || row.raw_agent_slug || undefined,
        match_confidence: row.match_confidence || undefined,
      }));

      const result = await importMutation.mutateAsync(mappedRows);

      // Log to import history
      await supabase.from('import_history').insert({
        file_name: selectedFile.name,
        records_imported: result.matched,
        records_failed: result.unmatched,
        imported_by: 'Admin',
        import_notes: `Usage metrics import: ${result.matched} matched, ${result.unmatched} unmatched`,
      });

      toast({
        title: 'Import complete',
        description: `${result.matched} rows imported, ${result.unmatched} need resolution`,
      });

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Import failed',
        description: 'Failed to process the import. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleResolve = (row: any) => {
    setSelectedRow(row);
    setSelectedAgentId('');
    setCreateAlias(true);
    setResolveDialogOpen(true);
  };

  const confirmResolve = async () => {
    if (!selectedRow || !selectedAgentId) return;

    const agent = agents?.find(a => a.id === selectedAgentId);
    if (!agent) return;

    try {
      await resolveMutation.mutateAsync({
        rowId: selectedRow.id,
        agentId: selectedAgentId,
        agentName: agent.name,
        createAlias,
      });

      toast({
        title: 'Row resolved',
        description: createAlias 
          ? `Mapped to "${agent.name}" and saved alias for future imports` 
          : `Mapped to "${agent.name}"`,
      });

      setResolveDialogOpen(false);
      setSelectedRow(null);
    } catch (error) {
      console.error('Resolve error:', error);
      toast({
        title: 'Resolution failed',
        description: 'Failed to resolve the row. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'account',
      'agent_name',
      'metric',
      'value',
      'time_window_start',
      'time_window_end',
      'agent_slug',
      'match_confidence'
    ];
    
    const exampleRow = [
      'Unilever',
      'MI Master',
      'unique_users',
      '43',
      '2025-10-15',
      '2026-01-22',
      'mi-master',
      'High'
    ];

    const csvContent = [headers.join(','), exampleRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usage_metrics_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Import Usage Metrics (CSV)
          </CardTitle>
          <CardDescription>
            Upload a CSV file with agent utilization data (unique users, sessions, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Expected columns:</strong> account, agent_name, metric, value, time_window_start, time_window_end, agent_slug (optional), match_confidence (optional)
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="usage-file">Select CSV File</Label>
            <Input
              ref={fileInputRef}
              id="usage-file"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
            />
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              <span className="font-medium">{selectedFile.name}</span>
              <Badge variant="secondary">{(selectedFile.size / 1024).toFixed(1)} KB</Badge>
            </div>
          )}

          <Button 
            onClick={handleImport} 
            disabled={!selectedFile || isImporting}
            className="w-full"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Import Usage Metrics
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Unmatched Rows Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Unmatched Rows
            {unmatchedRows && unmatchedRows.length > 0 && (
              <Badge variant="destructive">{unmatchedRows.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Rows that couldn't be automatically matched to an agent. Resolve them by selecting the correct agent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingUnmatched ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : unmatchedRows && unmatchedRows.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Agent Name (from CSV)</TableHead>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Window</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unmatchedRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.account}</TableCell>
                    <TableCell className="font-medium">{row.agent_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{row.metric}</Badge>
                    </TableCell>
                    <TableCell>{row.value}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.time_window_start} → {row.time_window_end}
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleResolve(row)}
                      >
                        <Link2 className="h-3 w-3 mr-1" />
                        Resolve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
          <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
              <p>No unmatched rows</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agent Aliases Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Agent Aliases
          </CardTitle>
          <CardDescription>
            Saved mappings between CSV names and canonical agent names for future imports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {aliases && aliases.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alias (from CSV)</TableHead>
                  <TableHead>Maps To</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aliases.map((alias) => {
                  const agent = agents?.find(a => a.id === alias.agent_id);
                  return (
                    <TableRow key={alias.id}>
                      <TableCell className="font-medium">{alias.alias_name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{agent?.name || 'Unknown Agent'}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(alias.created_at), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No aliases saved yet. Aliases are created when you resolve unmatched rows.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Unmatched Row</DialogTitle>
            <DialogDescription>
              Select the correct agent for "{selectedRow?.agent_name}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Agent</Label>
              <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an agent..." />
                </SelectTrigger>
                <SelectContent>
                  {agents?.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="create-alias" 
                checked={createAlias}
                onCheckedChange={(checked) => setCreateAlias(checked as boolean)}
              />
              <Label htmlFor="create-alias" className="text-sm">
                Save as alias for future imports
              </Label>
            </div>

            {selectedRow && (
              <div className="p-3 bg-muted rounded-lg text-sm space-y-1">
                <p><strong>Account:</strong> {selectedRow.account}</p>
                <p><strong>Metric:</strong> {selectedRow.metric}</p>
                <p><strong>Value:</strong> {selectedRow.value}</p>
                <p><strong>Window:</strong> {selectedRow.time_window_start} → {selectedRow.time_window_end}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmResolve} 
              disabled={!selectedAgentId || resolveMutation.isPending}
            >
              {resolveMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
