import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PresellData } from '@/types/presell';
import { toast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export interface PublicTemplate {
  id: string;
  name: string;
  description: string | null;
  preview_icon: string | null;
  level: 'simples' | 'intermediário' | 'avançado';
  data: PresellData;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const usePublicTemplates = () => {
  const [templates, setTemplates] = useState<PublicTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      
      // Wait for session to be ready
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase
        .from('public_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map(t => ({
        ...t,
        level: t.level as 'simples' | 'intermediário' | 'avançado',
        data: t.data as unknown as PresellData,
      }));

      setTemplates(mapped);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchTemplates();
      } else if (event === 'SIGNED_OUT') {
        // Keep public templates visible even when logged out
        fetchTemplates();
      }
    });

    // Initial fetch
    fetchTemplates();

    return () => subscription.unsubscribe();
  }, [fetchTemplates]);

  const createTemplate = async (
    name: string,
    description: string,
    level: 'simples' | 'intermediário' | 'avançado',
    data: PresellData,
    previewIcon: string,
    isPublic: boolean,
    userId: string
  ): Promise<PublicTemplate | null> => {
    try {
      const { data: created, error } = await supabase
        .from('public_templates')
        .insert({
          name,
          description,
          level,
          data: data as unknown as Json,
          preview_icon: previewIcon,
          is_public: isPublic,
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;

      const mapped: PublicTemplate = {
        ...created,
        level: created.level as 'simples' | 'intermediário' | 'avançado',
        data: created.data as unknown as PresellData,
      };

      setTemplates(prev => [mapped, ...prev]);
      
      toast({
        title: 'Template criado!',
        description: `"${name}" foi salvo com sucesso.`,
      });

      return mapped;
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: 'Erro ao criar template',
        description: 'Ocorreu um erro ao salvar o template.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateTemplate = async (
    id: string,
    updates: Partial<{
      name: string;
      description: string;
      level: string;
      data: PresellData;
      preview_icon: string;
      is_public: boolean;
    }>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('public_templates')
        .update({
          ...updates,
          data: updates.data ? (updates.data as unknown as Json) : undefined,
        })
        .eq('id', id);

      if (error) throw error;

      setTemplates(prev => prev.map(t => 
        t.id === id ? { 
          ...t, 
          ...updates,
          level: (updates.level || t.level) as 'simples' | 'intermediário' | 'avançado',
        } : t
      ));
      
      toast({
        title: 'Template atualizado!',
        description: 'As alterações foram salvas.',
      });

      return true;
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: 'Erro ao atualizar',
        description: 'Ocorreu um erro ao atualizar o template.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteTemplate = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('public_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTemplates(prev => prev.filter(t => t.id !== id));
      
      toast({
        title: 'Template excluído!',
        description: 'O template foi removido.',
      });

      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: 'Erro ao excluir',
        description: 'Ocorreu um erro ao excluir o template.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const togglePublic = async (id: string, isPublic: boolean): Promise<boolean> => {
    return updateTemplate(id, { is_public: isPublic });
  };

  return {
    templates,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    togglePublic,
    refetch: fetchTemplates,
  };
};
