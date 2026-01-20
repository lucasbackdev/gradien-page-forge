-- Create a table for public templates that admin can share with all users
CREATE TABLE public.public_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  preview_icon TEXT DEFAULT '📄',
  level TEXT NOT NULL DEFAULT 'simples',
  data JSONB NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.public_templates ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view public templates
CREATE POLICY "Public templates are viewable by everyone" 
ON public.public_templates 
FOR SELECT 
USING (is_public = true);

-- Policy: Admin can view all templates (including non-public)
CREATE POLICY "Admin can view all templates"
ON public.public_templates
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Policy: Admin can create templates
CREATE POLICY "Admin can create templates" 
ON public.public_templates 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Policy: Admin can update templates
CREATE POLICY "Admin can update templates" 
ON public.public_templates 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Policy: Admin can delete templates
CREATE POLICY "Admin can delete templates" 
ON public.public_templates 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_public_templates_updated_at
BEFORE UPDATE ON public.public_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert admin role for lucascombatplr@gmail.com if not exists
-- First we need to get the user ID from auth.users via profiles
INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'admin'::app_role
FROM public.profiles p
WHERE p.email = 'lucascombatplr@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_roles ur 
  WHERE ur.user_id = p.id AND ur.role = 'admin'
);