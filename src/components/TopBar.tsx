import { Moon, Sun, Menu, Shield, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShinyDownloadButton } from './ShinyDownloadButton';
import { SavedPagesManager } from './SavedPagesManager';
import { useAuth } from '@/hooks/useAuth';
import { PresellData } from '@/types/presell';
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
}

export const TopBar = ({
  darkMode,
  onToggleDarkMode,
  onDownload,
  currentData,
  onLoadPage,
  currentPageId,
  onPageIdChange,
}: TopBarProps) => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="h-16 bg-background border-b border-border shadow-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Presell Gads" className="h-10 object-contain" />
      </div>
      
      <div className="flex items-center gap-3">
        {user && (
          <SavedPagesManager
            currentData={currentData}
            onLoadPage={onLoadPage}
            currentPageId={currentPageId}
            onPageIdChange={onPageIdChange}
          />
        )}
        
        <ShinyDownloadButton onClick={onDownload} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="hover:bg-muted">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
