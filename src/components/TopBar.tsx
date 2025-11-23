import { Moon, Sun, Download, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TopBarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  onDownload: () => void;
}

export const TopBar = ({
  darkMode,
  onToggleDarkMode,
  language,
  onLanguageChange,
  onDownload,
}: TopBarProps) => {
  return (
    <header className="h-16 bg-background border-b border-border shadow-sm flex items-center justify-between px-6">
      <h1 className="text-2xl font-bold text-gradient">Presell GAds</h1>
      
      <div className="flex items-center gap-3">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[140px]">
            <Languages className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt">Português</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
          </SelectContent>
        </Select>

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
