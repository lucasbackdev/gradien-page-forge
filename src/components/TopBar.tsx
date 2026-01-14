import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShinyDownloadButton } from './ShinyDownloadButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopBarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onDownload: () => void;
}

export const TopBar = ({
  darkMode,
  onToggleDarkMode,
  onDownload,
}: TopBarProps) => {
  return (
    <header className="h-16 bg-background border-b border-border shadow-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Presell Gads" className="h-10 object-contain" />
      </div>
      
      <div className="flex items-center gap-3">
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
