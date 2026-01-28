import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  Download,
  History
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ImportHistoryRecord {
  id: string;
  file_name: string;
  records_imported: number | null;
  records_failed: number | null;
  imported_by: string | null;
  import_notes: string | null;
  created_at: string;
}

export function ExcelImport() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importNotes, setImportNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: importHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['import-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('import_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as ImportHistoryRecord[];
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an Excel (.xlsx) or CSV file',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    
    setIsImporting(true);
    
    // Simulate import process - in a real app, this would parse the Excel and insert data
    try {
      // For now, just log the import to history
      const { error } = await supabase
        .from('import_history')
        .insert({
          file_name: selectedFile.name,
          records_imported: 0,
          records_failed: 0,
          imported_by: 'Admin',
          import_notes: importNotes || 'Manual import via Admin panel',
        });

      if (error) throw error;

      toast({
        title: 'Import initiated',
        description: 'File upload recorded. Full Excel parsing will require server-side processing.',
      });

      setSelectedFile(null);
      setImportNotes('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      refetchHistory();
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

  const downloadTemplate = () => {
    // Create a simple CSV template
    const headers = [
      'name',
      'description',
      'agent_type',
      'platform',
      'hosted_in',
      'status',
      'owner_primary',
      'owner_team',
      'function_domains',
      'completion_percentage',
      'notes'
    ];
    
    const exampleRow = [
      'Example Agent',
      'Description of the agent',
      'General',
      'Quantum Studio',
      'Internal Domain',
      'In Progress',
      'John Doe',
      'Digital COE',
      'S2C,P2P',
      '50',
      'Additional notes'
    ];

    const csvContent = [headers.join(','), exampleRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agent_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Agents from Excel
          </CardTitle>
          <CardDescription>
            Upload an Excel or CSV file to bulk import agents into the library
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Full Excel parsing requires server-side processing. 
              This UI demonstrates the import workflow. For bulk imports, contact the admin team.
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <Input
              ref={fileInputRef}
              id="file"
              type="file"
              accept=".xlsx,.xls,.csv"
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

          <div className="space-y-2">
            <Label htmlFor="notes">Import Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add notes about this import..."
              value={importNotes}
              onChange={(e) => setImportNotes(e.target.value)}
            />
          </div>

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
                Start Import
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Import History
          </CardTitle>
          <CardDescription>
            Recent import operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {importHistory && importHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Imported</TableHead>
                  <TableHead>Failed</TableHead>
                  <TableHead>Imported By</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                        {record.file_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(record.created_at), 'MMM d, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {record.records_imported || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(record.records_failed || 0) > 0 ? (
                        <Badge variant="destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {record.records_failed}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell>{record.imported_by || '-'}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {record.import_notes || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No import history found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
