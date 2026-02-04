import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PresellData } from '@/types/presell';

export interface SavedPage {
  id: string;
  user_id: string;
  name: string;
  data: PresellData;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useSavedPages() {
  const [savedPages, setSavedPages] = useState<SavedPage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSavedPages = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setSavedPages([]);
        return;
      }

      const { data, error } = await supabase
        .from('saved_pages')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Cast the data properly since JSONB comes as unknown
      const typedData = (data || []).map(page => ({
        ...page,
        data: page.data as unknown as PresellData
      }));
      
      setSavedPages(typedData);
    } catch (error: any) {
      console.error('Error fetching saved pages:', error);
      toast({
        title: "Erro ao carregar páginas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const savePage = async (name: string, data: PresellData): Promise<SavedPage | null> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Usuário não autenticado');

      const { data: savedPage, error } = await supabase
        .from('saved_pages')
        .insert({
          user_id: user.id,
          name,
          data: JSON.parse(JSON.stringify(data)),
        })
        .select()
        .single();

      if (error) throw error;

      const typedPage = {
        ...savedPage,
        data: savedPage.data as unknown as PresellData
      };
      setSavedPages(prev => [typedPage, ...prev]);
      
      toast({
        title: "Página salva!",
        description: `"${name}" foi salva com sucesso.`,
      });

      return typedPage;
    } catch (error: any) {
      console.error('Error saving page:', error);
      toast({
        title: "Erro ao salvar página",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updatePage = async (id: string, name: string, data: PresellData): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('saved_pages')
        .update({
          name,
          data: JSON.parse(JSON.stringify(data)),
        })
        .eq('id', id);

      if (error) throw error;

      setSavedPages(prev => prev.map(page => 
        page.id === id 
          ? { ...page, name, data, updated_at: new Date().toISOString() }
          : page
      ));

      toast({
        title: "Página atualizada!",
        description: `"${name}" foi atualizada com sucesso.`,
      });

      return true;
    } catch (error: any) {
      console.error('Error updating page:', error);
      toast({
        title: "Erro ao atualizar página",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const deletePage = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('saved_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSavedPages(prev => prev.filter(page => page.id !== id));

      toast({
        title: "Página excluída",
        description: "A página foi removida com sucesso.",
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting page:', error);
      toast({
        title: "Erro ao excluir página",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    // Listen for auth state changes to refetch pages
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchSavedPages();
      } else if (event === 'SIGNED_OUT') {
        setSavedPages([]);
        setLoading(false);
      }
    });

    // Initial fetch
    fetchSavedPages();

    return () => subscription.unsubscribe();
  }, [fetchSavedPages]);

  return {
    savedPages,
    loading,
    savePage,
    updatePage,
    deletePage,
    refreshPages: fetchSavedPages,
  };
}
