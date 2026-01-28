-- Drop and recreate the SELECT policy to allow public read access
DROP POLICY IF EXISTS "Agents are viewable by all authenticated users" ON public.agents;

CREATE POLICY "Agents are viewable by everyone" 
ON public.agents 
FOR SELECT 
USING (true);

-- Also update other tables that the dashboard might need
DROP POLICY IF EXISTS "Workflow packs are viewable by all authenticated users" ON public.workflow_packs;

CREATE POLICY "Workflow packs are viewable by everyone" 
ON public.workflow_packs 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Deployments are viewable by all authenticated users" ON public.deployments;

CREATE POLICY "Deployments are viewable by everyone" 
ON public.deployments 
FOR SELECT 
USING (true);