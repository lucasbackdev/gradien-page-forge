-- Create table for saved page models
CREATE TABLE public.saved_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_pages ENABLE ROW LEVEL SECURITY;

-- Users can view their own saved pages
CREATE POLICY "Users can view own saved pages"
ON public.saved_pages
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own saved pages
CREATE POLICY "Users can create own saved pages"
ON public.saved_pages
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own saved pages
CREATE POLICY "Users can update own saved pages"
ON public.saved_pages
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own saved pages
CREATE POLICY "Users can delete own saved pages"
ON public.saved_pages
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_saved_pages_updated_at
BEFORE UPDATE ON public.saved_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_saved_pages_user_id ON public.saved_pages(user_id);