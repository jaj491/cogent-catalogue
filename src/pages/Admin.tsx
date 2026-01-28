import { Card, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function Admin() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
        <p className="text-muted-foreground">
          Manage taxonomies, imports, and settings
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Admin Panel Coming Soon</p>
          <p className="text-muted-foreground text-center max-w-md">
            The Admin panel will include Excel import, taxonomy management, 
            user role management, and governance gate configuration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
