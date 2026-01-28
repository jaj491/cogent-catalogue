import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';
import { useState } from 'react';
import type { AgentFilters as FiltersType, AgentStatus, PlatformType, HostedInType, AgentType, OwnerTeamType } from '@/types/agent';

interface AgentFiltersProps {
  filters: Partial<FiltersType>;
  onFiltersChange: (filters: Partial<FiltersType>) => void;
}

const statusOptions: AgentStatus[] = [
  'Ideation', 'In Progress', 'UAT', 'Governance Review', 'Deployable', 'Deployed', 'Archived'
];

const platformOptions: PlatformType[] = [
  'Quantum Studio', 'Quantum Platform', 'Google Agentspace', 'Microsoft Co-Pilot Studio', 'Others'
];

const hostedInOptions: HostedInType[] = [
  'GEP AI Agent Library', 'Internal Domain', 'Client Domain', 'Client Environment'
];

const agentTypeOptions: AgentType[] = [
  'General', 'Sourcing', 'Contracting', 'PR2PO', 'AP', 'Compliance'
];

export function AgentFilters({ filters, onFiltersChange }: AgentFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = [
    filters.status?.length || 0,
    filters.platform?.length || 0,
    filters.hosted_in?.length || 0,
    filters.agent_type?.length || 0,
  ].reduce((a, b) => a + (b > 0 ? 1 : 0), 0);

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, status: [] });
    } else {
      const status = value as AgentStatus;
      const current = filters.status || [];
      if (current.includes(status)) {
        onFiltersChange({ ...filters, status: current.filter(s => s !== status) });
      } else {
        onFiltersChange({ ...filters, status: [...current, status] });
      }
    }
  };

  const handlePlatformChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, platform: [] });
    } else {
      const platform = value as PlatformType;
      const current = filters.platform || [];
      if (current.includes(platform)) {
        onFiltersChange({ ...filters, platform: current.filter(p => p !== platform) });
      } else {
        onFiltersChange({ ...filters, platform: [...current, platform] });
      }
    }
  };

  const handleHostedInChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, hosted_in: [] });
    } else {
      const hostedIn = value as HostedInType;
      const current = filters.hosted_in || [];
      if (current.includes(hostedIn)) {
        onFiltersChange({ ...filters, hosted_in: current.filter(h => h !== hostedIn) });
      } else {
        onFiltersChange({ ...filters, hosted_in: [...current, hostedIn] });
      }
    }
  };

  const handleAgentTypeChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, agent_type: [] });
    } else {
      const agentType = value as AgentType;
      const current = filters.agent_type || [];
      if (current.includes(agentType)) {
        onFiltersChange({ ...filters, agent_type: current.filter(t => t !== agentType) });
      } else {
        onFiltersChange({ ...filters, agent_type: [...current, agentType] });
      }
    }
  };

  const clearFilters = () => {
    onFiltersChange({
      search: filters.search,
      status: [],
      platform: [],
      hosted_in: [],
      agent_type: [],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents by name or description..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-muted/50 rounded-lg border">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>
            <Select onValueChange={handlePlatformChange}>
              <SelectTrigger>
                <SelectValue placeholder="All platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All platforms</SelectItem>
                {platformOptions.map(platform => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Hosted In</label>
            <Select onValueChange={handleHostedInChange}>
              <SelectTrigger>
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                {hostedInOptions.map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Agent Type</label>
            <Select onValueChange={handleAgentTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {agentTypeOptions.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {activeFilterCount > 0 && (
            <div className="col-span-full flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="h-4 w-4" />
                Clear filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Active filter badges */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.status?.map(status => (
            <Badge key={status} variant="secondary" className="gap-1">
              {status}
              <button
                onClick={() => handleStatusChange(status)}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.platform?.map(platform => (
            <Badge key={platform} variant="secondary" className="gap-1">
              {platform}
              <button
                onClick={() => handlePlatformChange(platform)}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.hosted_in?.map(location => (
            <Badge key={location} variant="secondary" className="gap-1">
              {location}
              <button
                onClick={() => handleHostedInChange(location)}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.agent_type?.map(type => (
            <Badge key={type} variant="secondary" className="gap-1">
              {type}
              <button
                onClick={() => handleAgentTypeChange(type)}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
