import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tags, 
  Bot, 
  Server, 
  Cloud, 
  Activity,
  Users,
  Layers,
  Wrench,
  AlertCircle,
  MessageSquare,
  Target,
  Gauge,
  Zap
} from 'lucide-react';
import { Constants } from '@/integrations/supabase/types';

interface TaxonomyItem {
  name: string;
  icon: React.ReactNode;
  values: readonly string[];
  description: string;
}

const taxonomies: TaxonomyItem[] = [
  {
    name: 'Agent Status',
    icon: <Activity className="h-4 w-4" />,
    values: Constants.public.Enums.agent_status,
    description: 'Lifecycle stages for agents from ideation to deployment',
  },
  {
    name: 'Agent Type',
    icon: <Bot className="h-4 w-4" />,
    values: Constants.public.Enums.agent_type,
    description: 'Functional categorization of agents by procurement domain',
  },
  {
    name: 'Platform Type',
    icon: <Server className="h-4 w-4" />,
    values: Constants.public.Enums.platform_type,
    description: 'Technology platforms where agents are built and deployed',
  },
  {
    name: 'Hosted In',
    icon: <Cloud className="h-4 w-4" />,
    values: Constants.public.Enums.hosted_in_type,
    description: 'Hosting environment for agent deployment',
  },
  {
    name: 'Owner Team',
    icon: <Users className="h-4 w-4" />,
    values: Constants.public.Enums.owner_team_type,
    description: 'Teams responsible for agent development and maintenance',
  },
  {
    name: 'Function Domain',
    icon: <Layers className="h-4 w-4" />,
    values: Constants.public.Enums.function_domain_type,
    description: 'Business function domains the agent serves',
  },
  {
    name: 'Tool Type',
    icon: <Wrench className="h-4 w-4" />,
    values: Constants.public.Enums.tool_type,
    description: 'Types of connectors and tools used by agents',
  },
  {
    name: 'Defect Severity',
    icon: <AlertCircle className="h-4 w-4" />,
    values: Constants.public.Enums.defect_severity,
    description: 'Severity levels for defect tracking',
  },
  {
    name: 'Root Cause Category',
    icon: <Target className="h-4 w-4" />,
    values: Constants.public.Enums.root_cause_category,
    description: 'Categories for root cause analysis of defects',
  },
  {
    name: 'Feedback Category',
    icon: <MessageSquare className="h-4 w-4" />,
    values: Constants.public.Enums.feedback_category,
    description: 'Categories for user feedback classification',
  },
  {
    name: 'Feedback Status',
    icon: <Activity className="h-4 w-4" />,
    values: Constants.public.Enums.feedback_status,
    description: 'Status tracking for feedback items',
  },
  {
    name: 'Rollout Status',
    icon: <Zap className="h-4 w-4" />,
    values: Constants.public.Enums.rollout_status_type,
    description: 'Deployment rollout status options',
  },
  {
    name: 'Integration Depth',
    icon: <Gauge className="h-4 w-4" />,
    values: Constants.public.Enums.integration_depth_type,
    description: 'Level of integration with external systems',
  },
  {
    name: 'Maturity Level',
    icon: <Target className="h-4 w-4" />,
    values: Constants.public.Enums.maturity_type,
    description: 'Maturity level for workflow packs',
  },
  {
    name: 'User Role',
    icon: <Users className="h-4 w-4" />,
    values: Constants.public.Enums.app_role,
    description: 'Application user roles for access control',
  },
];

const getStatusColor = (value: string): string => {
  const colorMap: Record<string, string> = {
    // Agent Status
    'Ideation': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'UAT': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Governance Review': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Deployable': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    'Deployed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Archived': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    // Severity
    'Critical': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'High': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Low': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    // Rollout
    'Live': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Paused': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Decommissioned': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    // Roles
    'admin': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'agent_owner': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'account_lead': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'viewer': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };
  return colorMap[value] || 'bg-secondary text-secondary-foreground';
};

export function TaxonomyManager() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5" />
            Taxonomy Reference
          </CardTitle>
          <CardDescription>
            View all taxonomy values used in the Agent Hub. These are defined as database enums and
            ensure data consistency across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            <strong>Note:</strong> Taxonomy values are managed at the database level. 
            To add or modify values, contact the database administrator.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {taxonomies.map((taxonomy) => (
          <Card key={taxonomy.name}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {taxonomy.icon}
                {taxonomy.name}
              </CardTitle>
              <CardDescription className="text-xs">
                {taxonomy.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {taxonomy.values.map((value) => (
                  <Badge 
                    key={value} 
                    variant="secondary"
                    className={getStatusColor(value)}
                  >
                    {value}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Taxonomy Summary</CardTitle>
          <CardDescription>
            Quick reference for all taxonomy types and value counts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Taxonomy</TableHead>
                <TableHead>Value Count</TableHead>
                <TableHead>Values</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxonomies.map((taxonomy) => (
                <TableRow key={taxonomy.name}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {taxonomy.icon}
                      {taxonomy.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{taxonomy.values.length}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[400px]">
                    {taxonomy.values.join(', ')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
