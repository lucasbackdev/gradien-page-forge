import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { pageTemplates, PageTemplate } from '@/templates/pageTemplates';
import { PresellData } from '@/types/presell';
import { LayoutTemplate, FileText, Star, Rocket } from 'lucide-react';

interface TemplateSelectorProps {
  onSelectTemplate: (data: PresellData) => void;
}

export const TemplateSelector = ({ onSelectTemplate }: TemplateSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (template: PageTemplate) => {
    // Deep clone to avoid reference issues
    const clonedData = JSON.parse(JSON.stringify(template.data));
    onSelectTemplate(clonedData);
    setOpen(false);
  };

  const getLevelColor = (level: PageTemplate['level']) => {
    switch (level) {
      case 'simples':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediário':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'avançado':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  const getLevelIcon = (level: PageTemplate['level']) => {
    switch (level) {
      case 'simples':
        return <FileText className="w-4 h-4" />;
      case 'intermediário':
        return <Star className="w-4 h-4" />;
      case 'avançado':
        return <Rocket className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <LayoutTemplate className="w-4 h-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5" />
            Modelos de Página Prontos
          </DialogTitle>
          <DialogDescription>
            Escolha um modelo para começar. Você pode editar tudo depois.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {pageTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative border border-border rounded-xl p-5 hover:border-primary/50 hover:bg-accent/30 transition-all cursor-pointer"
              onClick={() => handleSelect(template)}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl">
                  {template.preview}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg text-foreground">
                      {template.name}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getLevelColor(template.level)}`}
                    >
                      {getLevelIcon(template.level)}
                      <span className="ml-1 capitalize">{template.level}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>📄 {template.data.sections.length} seções</span>
                    <span>
                      {template.data.floatingHeader.enabled ? '🔝 Com header fixo' : '📜 Sem header fixo'}
                    </span>
                  </div>
                </div>

                {/* Use Button */}
                <Button 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(template);
                  }}
                >
                  Usar
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
          💡 Dica: Após selecionar um template, você pode editar todos os textos, cores, imagens e seções.
        </div>
      </DialogContent>
    </Dialog>
  );
};
