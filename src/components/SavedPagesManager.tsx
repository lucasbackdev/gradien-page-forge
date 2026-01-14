import { useState, useRef } from 'react';
import { useSavedPages, SavedPage } from '@/hooks/useSavedPages';
import { PresellData, defaultPresellData } from '@/types/presell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Save, 
  FolderOpen, 
  Upload, 
  Trash2, 
  FileText, 
  Loader2,
  Plus,
  Edit3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SavedPagesManagerProps {
  currentData: PresellData;
  onLoadPage: (data: PresellData) => void;
  currentPageId?: string;
  onPageIdChange?: (id: string | undefined) => void;
}

export function SavedPagesManager({ 
  currentData, 
  onLoadPage, 
  currentPageId,
  onPageIdChange 
}: SavedPagesManagerProps) {
  const { savedPages, loading, savePage, updatePage, deletePage } = useSavedPages();
  const { toast } = useToast();
  
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageName, setPageName] = useState('');
  const [saving, setSaving] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<SavedPage | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveNew = async () => {
    if (!pageName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a página.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const result = await savePage(pageName.trim(), currentData);
    setSaving(false);

    if (result) {
      onPageIdChange?.(result.id);
      setSaveDialogOpen(false);
      setPageName('');
    }
  };

  const handleUpdateCurrent = async () => {
    if (!currentPageId) return;
    
    const currentPage = savedPages.find(p => p.id === currentPageId);
    if (!currentPage) return;

    setSaving(true);
    await updatePage(currentPageId, currentPage.name, currentData);
    setSaving(false);
  };

  const handleLoadPage = (page: SavedPage) => {
    onLoadPage(page.data);
    onPageIdChange?.(page.id);
    setLoadDialogOpen(false);
    toast({
      title: "Página carregada",
      description: `"${page.name}" foi carregada para edição.`,
    });
  };

  const handleDeletePage = async () => {
    if (!pageToDelete) return;
    
    const success = await deletePage(pageToDelete.id);
    if (success && currentPageId === pageToDelete.id) {
      onPageIdChange?.(undefined);
    }
    setPageToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Accept both .json and .html files
    const isJson = file.name.endsWith('.json');
    const isHtml = file.name.endsWith('.html');

    if (!isJson && !isHtml) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo .json ou .html exportado anteriormente.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        let pageData: PresellData;
        
        if (isJson) {
          pageData = JSON.parse(content);
        } else {
          // Try to extract JSON data from HTML comment
          const jsonMatch = content.match(/<!--PRESELL_DATA:(.*?)-->/s);
          if (jsonMatch) {
            pageData = JSON.parse(jsonMatch[1]);
          } else {
            throw new Error('Dados não encontrados no arquivo HTML');
          }
        }

        // Validate the data has expected structure
        if (!pageData.colors || !pageData.sections) {
          throw new Error('Estrutura de dados inválida');
        }

        // Merge with defaults to ensure all properties exist
        const mergedData: PresellData = {
          ...defaultPresellData,
          ...pageData,
          colors: { ...defaultPresellData.colors, ...pageData.colors },
          buttonStyle: { ...defaultPresellData.buttonStyle, ...pageData.buttonStyle },
          fonts: { ...defaultPresellData.fonts, ...pageData.fonts },
          fontSizes: { ...defaultPresellData.fontSizes, ...pageData.fontSizes },
          floatingHeader: { ...defaultPresellData.floatingHeader, ...pageData.floatingHeader },
          footerStyle: { ...defaultPresellData.footerStyle, ...pageData.footerStyle },
        };

        onLoadPage(mergedData);
        onPageIdChange?.(undefined); // It's a new unsaved page
        
        toast({
          title: "Arquivo importado!",
          description: "O modelo foi carregado para edição.",
        });
      } catch (error: any) {
        console.error('Error parsing file:', error);
        toast({
          title: "Erro ao importar",
          description: error.message || "O arquivo não contém dados válidos.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentPageName = currentPageId 
    ? savedPages.find(p => p.id === currentPageId)?.name 
    : null;

  return (
    <div className="flex items-center gap-2">
      {/* Current page indicator */}
      {currentPageName && (
        <span className="text-sm text-muted-foreground truncate max-w-32">
          {currentPageName}
        </span>
      )}

      {/* Save button with dropdown behavior */}
      {currentPageId ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleUpdateCurrent}
          disabled={saving}
          className="gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar
        </Button>
      ) : (
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Salvar Página</DialogTitle>
              <DialogDescription>
                Dê um nome para salvar esta página na sua conta.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="page-name">Nome da Página</Label>
              <Input
                id="page-name"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                placeholder="Ex: Landing Page Principal"
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveNew} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Save as new */}
      {currentPageId && (
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Salvar como
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Salvar como Nova Página</DialogTitle>
              <DialogDescription>
                Dê um nome para salvar uma cópia desta página.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="page-name-new">Nome da Página</Label>
              <Input
                id="page-name-new"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                placeholder="Ex: Landing Page v2"
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveNew} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Load from saved */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            Abrir
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Minhas Páginas Salvas</DialogTitle>
            <DialogDescription>
              Selecione uma página para carregar e editar.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-80 pr-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : savedPages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma página salva ainda.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedPages.map((page) => (
                  <div
                    key={page.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-accent/50 cursor-pointer ${
                      currentPageId === page.id ? 'border-primary bg-accent/30' : 'border-border'
                    }`}
                    onClick={() => handleLoadPage(page)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{page.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Atualizado {format(new Date(page.updated_at), "d 'de' MMM 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPageToDelete(page);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Upload file */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.html"
        onChange={handleFileUpload}
        className="hidden"
      />
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        Importar
      </Button>

      {/* Delete confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir página?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A página "{pageToDelete?.name}" será permanentemente excluída.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
