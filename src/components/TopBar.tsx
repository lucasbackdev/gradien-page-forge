import { Moon, Sun, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleDarkMode}
          className="hover:bg-muted"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button
          onClick={onDownload}
          className="gradient-vibrant text-white font-semibold"
        >
          <Download className="w-4 h-4 mr-2" />
          Download ZIP
        </Button>
      </div>
    </header>
  );
};
