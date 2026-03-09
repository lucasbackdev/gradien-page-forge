import { Moon, Sun, Menu, Shield, LogOut, User, Upload, Tag, Save, FolderOpen, LayoutTemplate, Timer, Undo2, Redo2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ShinyDownloadButton } from './ShinyDownloadButton';
import { LogoBrand } from './LogoBrand';
import { useAuth } from '@/hooks/useAuth';
import { PresellData, defaultPresellData } from '@/types/presell';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopBarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onDownload: () => void;
  currentData: PresellData;
  onLoadPage: (data: PresellData) => void;
  currentPageId?: string;
  onPageIdChange?: (id: string | undefined) => void;
  onOpenTracking?: () => void;
  onSave?: () => void;
  onOpen?: () => void;
  onTemplates?: () => void;
  currentPageName?: string | null;
  autoSaveEnabled?: boolean;
  onToggleAutoSave?: (enabled: boolean) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const TopBar = ({
  darkMode,
  onToggleDarkMode,
  onDownload,
  currentData,
  onLoadPage,
  currentPageId,
  onPageIdChange,
  onOpenTracking,
  onSave,
  onOpen,
  onTemplates,
  currentPageName,
  autoSaveEnabled,
  onToggleAutoSave,
}: TopBarProps) => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleImportZip = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo .zip exportado anteriormente.",
        variant: "destructive",
      });
      return;
    }

    try {
      const JSZip = (await import('jszip')).default;
      const zip = await JSZip.loadAsync(file);
      
      // Look for index.html to extract data
      const indexHtml = zip.file('index.html');
      if (indexHtml) {
        const content = await indexHtml.async('string');
        // Try to extract JSON data from HTML comment
        const jsonMatch = content.match(/<!--PRESELL_DATA:(.*?)-->/s);
        if (jsonMatch) {
          const pageData = JSON.parse(jsonMatch[1]);
          
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
          onPageIdChange?.(undefined);
          
          toast({
            title: "Arquivo importado!",
            description: "O modelo foi carregado para edição.",
          });
          return;
        }
      }

      // Try to find a JSON file
      const jsonFiles = Object.keys(zip.files).filter(name => name.endsWith('.json'));
      if (jsonFiles.length > 0) {
        const jsonContent = await zip.file(jsonFiles[0])?.async('string');
        if (jsonContent) {
          const pageData = JSON.parse(jsonContent);
          
          if (!pageData.colors || !pageData.sections) {
            throw new Error('Estrutura de dados inválida');
          }

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
          onPageIdChange?.(undefined);
          
          toast({
            title: "Arquivo importado!",
            description: "O modelo foi carregado para edição.",
          });
          return;
        }
      }

      throw new Error('Dados não encontrados no arquivo ZIP');
    } catch (error: any) {
      console.error('Error importing zip:', error);
      toast({
        title: "Erro ao importar",
        description: error.message || "O arquivo não contém dados válidos.",
        variant: "destructive",
      });
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <header className="h-16 bg-background border-b border-border shadow-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <LogoBrand size="md" />
      </div>
      
      <div className="flex items-center gap-3">
        {/* Current page indicator */}
        {currentPageName && (
          <span className="text-sm text-muted-foreground truncate max-w-40 hidden sm:inline">
            📄 {currentPageName}
          </span>
        )}

        <ShinyDownloadButton onClick={onDownload} />

        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleImportZip}
          className="hidden"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="hover:bg-muted">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {user && (
              <>
                <DropdownMenuItem onClick={onSave} className="cursor-pointer">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Página
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={onOpen} className="cursor-pointer">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Minhas Páginas
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={onTemplates} className="cursor-pointer">
                  <LayoutTemplate className="h-4 w-4 mr-2" />
                  Templates
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
              </>
            )}
            
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Importar ZIP
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={onOpenTracking} className="cursor-pointer">
              <Tag className="h-4 w-4 mr-2" />
              Tags & Rastreamento
            </DropdownMenuItem>
            
            {user && currentPageId && (
              <DropdownMenuItem 
                onClick={() => onToggleAutoSave?.(!autoSaveEnabled)} 
                className="cursor-pointer"
              >
                <Timer className="h-4 w-4 mr-2" />
                {autoSaveEnabled ? '🟢 Auto-save ligado' : 'Auto-save (3 min)'}
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={onToggleDarkMode} className="cursor-pointer">
              {darkMode ? (
                <>
                  <Sun className="h-4 w-4 mr-2" />
                  Modo Claro
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 mr-2" />
                  Modo Escuro
                </>
              )}
            </DropdownMenuItem>
            
            {user && (
              <>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/adm')} className="cursor-pointer">
                    <Shield className="h-4 w-4 mr-2" />
                    Painel Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </>
            )}
            
            {!user && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/auth')} className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Entrar
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
