import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExcelImport } from '@/components/admin/ExcelImport';
import { TaxonomyManager } from '@/components/admin/TaxonomyManager';
import { UsageMetricsImport } from '@/components/admin/UsageMetricsImport';
import { 
  Settings, 
  Upload, 
  Tags, 
  Shield,
  Database,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Admin() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
        <p className="text-muted-foreground">
          Manage imports, taxonomies, and system settings
        </p>
      </div>

      <Tabs defaultValue="import" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Agent Import</span>
            <span className="sm:hidden">Agents</span>
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Usage Metrics</span>
            <span className="sm:hidden">Usage</span>
          </TabsTrigger>
          <TabsTrigger value="taxonomy" className="flex items-center gap-2">
            <Tags className="h-4 w-4" />
            <span className="hidden sm:inline">Taxonomies</span>
            <span className="sm:hidden">Taxonomy</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">User Roles</span>
            <span className="sm:hidden">Roles</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
            <span className="sm:hidden">System</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="import">
          <ExcelImport />
        </TabsContent>

        <TabsContent value="usage">
          <UsageMetricsImport />
        </TabsContent>

        <TabsContent value="taxonomy">
          <TaxonomyManager />
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                User Role Management
              </CardTitle>
              <CardDescription>
                Manage user roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">Authentication Required</p>
                <p className="text-muted-foreground max-w-md mx-auto">
                  User role management requires authentication to be set up. 
                  Once authentication is enabled, you'll be able to assign roles to users.
                </p>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-medium">Available Roles</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="destructive">admin</Badge>
                  <Badge className="bg-blue-100 text-blue-800">agent_owner</Badge>
                  <Badge className="bg-purple-100 text-purple-800">account_lead</Badge>
                  <Badge variant="secondary">viewer</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1 mt-4">
                  <p><strong>admin:</strong> Full access to all features including user management</p>
                  <p><strong>agent_owner:</strong> Can create, edit, and manage agents and workflows</p>
                  <p><strong>account_lead:</strong> Can propose deployments and view all data</p>
                  <p><strong>viewer:</strong> Read-only access to agents and workflows</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Information
              </CardTitle>
              <CardDescription>
                Database and system configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Database</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span>PostgreSQL (Supabase)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tables:</span>
                        <span>20 tables</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">RLS:</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Enabled</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Application</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Framework:</span>
                        <span>React + Vite</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">UI:</span>
                        <span>shadcn/ui + Tailwind</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">State:</span>
                        <span>TanStack Query</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Data Tables</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'agents', 'workflow_packs', 'deployments', 'feedback',
                      'defects', 'gaps', 'connectors_tools', 'governance_gates',
                      'usage_metrics', 'usage_metrics_snapshot', 'unmatched_usage_rows',
                      'agent_aliases', 'import_history', 'audit_log', 'user_roles',
                      'agent_tools', 'workflow_agents', 'workflow_tools', 'skills', 'endpoints'
                    ].map((table) => (
                      <Badge key={table} variant="outline">{table}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
