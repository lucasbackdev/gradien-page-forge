import { useState } from 'react';
import { PresellSection, SectionElement, sectionTemplates, sectionTypesList, SectionType, GradientDirection } from '@/types/sections';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Trash2, GripVertical, AlignVerticalJustifyCenter, AlignHorizontalJustifyCenter, Image, Type, Video } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SectionEditorProps {
  sections: PresellSection[];
  onUpdateSections: (sections: PresellSection[]) => void;
}

export const SectionEditor = ({ sections, onUpdateSections }: SectionEditorProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const addSection = (type: SectionType) => {
    const template = sectionTemplates[type];
    const newSection: PresellSection = {
      id: Date.now().toString(),
      type,
      name: template.name,
      layout: 'vertical',
      backgroundColor: '#1a1a2e',
      backgroundGradient: {
        enabled: false,
        direction: 'diagonal',
        color1: '#1a1a2e',
        color2: '#16213e',
      },
      textColor: '#ffffff',
      elements: template.defaultElements.map((el, i) => ({
        ...el,
        id: `${Date.now()}-${i}`,
      })),
      padding: '4rem',
    };
    onUpdateSections([...sections, newSection]);
    setDialogOpen(false);
  };

  const removeSection = (id: string) => {
    onUpdateSections(sections.filter(s => s.id !== id));
  };

  const updateSection = (id: string, updates: Partial<PresellSection>) => {
    onUpdateSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const updateSectionElement = (sectionId: string, elementId: string, updates: Partial<SectionElement>) => {
    onUpdateSections(sections.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        elements: s.elements.map(el => el.id === elementId ? { ...el, ...updates } : el),
      };
    }));
  };

  const addElementToSection = (sectionId: string, type: SectionElement['type']) => {
    const newElement: SectionElement = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'Novo texto' : type === 'button' ? 'Novo botão' : '',
      fontSize: type === 'text' ? '18px' : '16px',
      color: '#ffffff',
    };
    onUpdateSections(sections.map(s => {
      if (s.id !== sectionId) return s;
      return { ...s, elements: [...s.elements, newElement] };
    }));
  };

  const removeElementFromSection = (sectionId: string, elementId: string) => {
    onUpdateSections(sections.map(s => {
      if (s.id !== sectionId) return s;
      return { ...s, elements: s.elements.filter(el => el.id !== elementId) };
    }));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('sectionIndex', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('sectionIndex'));
    if (sourceIndex === targetIndex) return;
    
    const newSections = [...sections];
    const [movedSection] = newSections.splice(sourceIndex, 1);
    newSections.splice(targetIndex, 0, movedSection);
    onUpdateSections(newSections);
  };

  return (
    <div className="space-y-4">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full gradient-vibrant text-white">
            <Plus className="w-4 h-4 mr-2" /> Adicionar Seção
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Escolha um modelo de seção</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="grid grid-cols-3 gap-3">
              {sectionTypesList.map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2 hover:border-primary"
                  onClick={() => addSection(type)}
                >
                  <span className="text-2xl">{sectionTemplates[type].icon}</span>
                  <span className="text-sm">{sectionTemplates[type].name}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {sections.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhuma seção adicionada</p>
          <p className="text-sm text-muted-foreground mt-2">
            Clique em "Adicionar Seção" para começar
          </p>
        </Card>
      )}

      <div className="space-y-3">
        {sections.map((section, index) => (
          <Card
            key={section.id}
            className="p-4 cursor-move"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                <span className="text-lg">{sectionTemplates[section.type].icon}</span>
                <Input
                  value={section.name}
                  onChange={(e) => updateSection(section.id, { name: e.target.value })}
                  className="w-32 h-8 text-sm font-semibold"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateSection(section.id, { 
                    layout: section.layout === 'vertical' ? 'horizontal' : 'vertical' 
                  })}
                  title={section.layout === 'vertical' ? 'Mudar para Horizontal' : 'Mudar para Vertical'}
                >
                  {section.layout === 'vertical' ? (
                    <AlignVerticalJustifyCenter className="w-4 h-4" />
                  ) : (
                    <AlignHorizontalJustifyCenter className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                >
                  {expandedSection === section.id ? 'Fechar' : 'Editar'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => removeSection(section.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {expandedSection === section.id && (
              <div className="space-y-4 pt-4 border-t">
                {/* Background settings */}
                <div className="space-y-3">
                  <Label className="font-semibold">Fundo da Seção</Label>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={section.backgroundGradient?.enabled || false}
                      onCheckedChange={(checked) => updateSection(section.id, {
                        backgroundGradient: { ...section.backgroundGradient!, enabled: checked }
                      })}
                    />
                    <Label className="text-sm">Usar Gradiente</Label>
                  </div>

                  {section.backgroundGradient?.enabled ? (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Direção do Gradiente</Label>
                        <Select
                          value={section.backgroundGradient.direction}
                          onValueChange={(value: GradientDirection) => updateSection(section.id, {
                            backgroundGradient: { ...section.backgroundGradient!, direction: value }
                          })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="diagonal">Diagonal (↘)</SelectItem>
                            <SelectItem value="horizontal">Horizontal (→)</SelectItem>
                            <SelectItem value="vertical">Vertical (↓)</SelectItem>
                            <SelectItem value="radial">Radial (○)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs">Cor 1</Label>
                          <Input
                            type="color"
                            value={section.backgroundGradient.color1}
                            onChange={(e) => updateSection(section.id, {
                              backgroundGradient: { ...section.backgroundGradient!, color1: e.target.value }
                            })}
                            className="h-10 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Cor 2</Label>
                          <Input
                            type="color"
                            value={section.backgroundGradient.color2}
                            onChange={(e) => updateSection(section.id, {
                              backgroundGradient: { ...section.backgroundGradient!, color2: e.target.value }
                            })}
                            className="h-10 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Cor 3 (opcional)</Label>
                          <Input
                            type="color"
                            value={section.backgroundGradient.color3 || '#000000'}
                            onChange={(e) => updateSection(section.id, {
                              backgroundGradient: { ...section.backgroundGradient!, color3: e.target.value }
                            })}
                            className="h-10 mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={section.backgroundColor || '#1a1a2e'}
                        onChange={(e) => updateSection(section.id, { backgroundColor: e.target.value })}
                        className="h-10 w-16"
                      />
                      <Input
                        value={section.backgroundColor || '#1a1a2e'}
                        onChange={(e) => updateSection(section.id, { backgroundColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  )}

                  {/* Background Image */}
                  <div>
                    <Label className="text-xs">Imagem de Fundo</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            updateSection(section.id, { backgroundImage: event.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="mt-1"
                    />
                    {section.backgroundImage && (
                      <div className="mt-2 flex items-center gap-2">
                        <img src={section.backgroundImage} className="h-12 w-20 object-cover rounded" alt="bg" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => updateSection(section.id, { backgroundImage: undefined })}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <Label className="text-xs">Cor do Texto</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={section.textColor || '#ffffff'}
                      onChange={(e) => updateSection(section.id, { textColor: e.target.value })}
                      className="h-10 w-16"
                    />
                    <Input
                      value={section.textColor || '#ffffff'}
                      onChange={(e) => updateSection(section.id, { textColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Elements */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold">Elementos</Label>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addElementToSection(section.id, 'text')}
                      >
                        <Type className="w-3 h-3 mr-1" /> Texto
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addElementToSection(section.id, 'image')}
                      >
                        <Image className="w-3 h-3 mr-1" /> Imagem
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addElementToSection(section.id, 'button')}
                      >
                        Botão
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addElementToSection(section.id, 'video')}
                      >
                        <Video className="w-3 h-3 mr-1" /> Vídeo
                      </Button>
                    </div>
                  </div>

                  {section.elements.map((element) => (
                    <Card key={element.id} className="p-3 bg-muted/50">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-2">
                          {element.type === 'text' || element.type === 'button' ? (
                            <Textarea
                              value={element.content}
                              onChange={(e) => updateSectionElement(section.id, element.id, { content: e.target.value })}
                              rows={2}
                              className="text-sm"
                            />
                          ) : element.type === 'image' ? (
                            <div>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      updateSectionElement(section.id, element.id, { 
                                        imageUrl: event.target?.result as string 
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              {element.imageUrl && (
                                <img src={element.imageUrl} className="mt-2 h-16 object-cover rounded" alt="" />
                              )}
                            </div>
                          ) : element.type === 'video' ? (
                            <div>
                              <Input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      updateSectionElement(section.id, element.id, { 
                                        videoUrl: event.target?.result as string 
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              {element.videoUrl && (
                                <video src={element.videoUrl} className="mt-2 h-16 rounded" controls={false} muted />
                              )}
                            </div>
                          ) : null}

                          {(element.type === 'text' || element.type === 'button') && (
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={element.color || '#ffffff'}
                                onChange={(e) => updateSectionElement(section.id, element.id, { color: e.target.value })}
                                className="h-8 w-12"
                              />
                              <Input
                                value={element.fontSize || '16px'}
                                onChange={(e) => updateSectionElement(section.id, element.id, { fontSize: e.target.value })}
                                placeholder="16px"
                                className="w-20 h-8"
                              />
                              {element.type === 'button' && (
                                <Input
                                  value={element.link || ''}
                                  onChange={(e) => updateSectionElement(section.id, element.id, { link: e.target.value })}
                                  placeholder="Link do botão"
                                  className="flex-1 h-8"
                                />
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => removeElementFromSection(section.id, element.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
