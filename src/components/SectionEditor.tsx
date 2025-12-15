import { useState } from 'react';
import { PresellSection, SectionElement, sectionTemplates, sectionTypesList, SectionType, GradientDirection, TextType } from '@/types/sections';
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
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Plus, Trash2, AlignVerticalJustifyCenter, AlignHorizontalJustifyCenter, Image, Type, Video, ChevronDown, Bold } from 'lucide-react';
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
    setExpandedSection(newSection.id);
  };

  const removeSection = (id: string) => {
    onUpdateSections(sections.filter(s => s.id !== id));
    if (expandedSection === id) {
      setExpandedSection(null);
    }
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
      textType: type === 'text' ? 'description' : undefined,
      animation: false,
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

  const handleToggleSection = (sectionId: string) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
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
            <DialogDescription>
              Selecione o tipo de seção que você deseja adicionar à sua página
            </DialogDescription>
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

      <p className="text-sm text-muted-foreground">
        Arraste as seções no preview para reordená-las. Arraste elementos até a lixeira para excluir.
      </p>

      <div className="space-y-3">
        {sections.map((section) => (
          <Collapsible
            key={section.id}
            open={expandedSection === section.id}
            onOpenChange={() => handleToggleSection(section.id)}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{sectionTemplates[section.type].icon}</span>
                  <Input
                    value={section.name}
                    onChange={(e) => updateSection(section.id, { name: e.target.value })}
                    className="w-32 h-8 text-sm font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateSection(section.id, { 
                        layout: section.layout === 'vertical' ? 'horizontal' : 'vertical' 
                      });
                    }}
                    title={section.layout === 'vertical' ? 'Mudar para Horizontal' : 'Mudar para Vertical'}
                  >
                    {section.layout === 'vertical' ? (
                      <AlignVerticalJustifyCenter className="w-4 h-4" />
                    ) : (
                      <AlignHorizontalJustifyCenter className="w-4 h-4" />
                    )}
                  </Button>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSection(section.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <CollapsibleContent className="animate-accordion-down">
                <div className="space-y-4 pt-4 border-t mt-3">
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
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
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
                          
                          {/* Background overlay gradient */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={section.backgroundOverlay?.enabled || false}
                                onCheckedChange={(checked) => updateSection(section.id, {
                                  backgroundOverlay: { 
                                    enabled: checked,
                                    color1: section.backgroundOverlay?.color1 || 'rgba(0,0,0,0.7)',
                                    color2: section.backgroundOverlay?.color2 || 'rgba(0,0,0,0)',
                                    direction: section.backgroundOverlay?.direction || 'vertical',
                                  }
                                })}
                              />
                              <Label className="text-xs">Gradiente de Suavização</Label>
                            </div>
                            
                            {section.backgroundOverlay?.enabled && (
                              <div className="space-y-2 pl-4">
                                <div>
                                  <Label className="text-xs">Direção</Label>
                                  <Select
                                    value={section.backgroundOverlay.direction || 'vertical'}
                                    onValueChange={(value: 'vertical' | 'horizontal' | 'diagonal') => updateSection(section.id, {
                                      backgroundOverlay: { ...section.backgroundOverlay!, direction: value }
                                    })}
                                  >
                                    <SelectTrigger className="mt-1 h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="vertical">Vertical</SelectItem>
                                      <SelectItem value="horizontal">Horizontal</SelectItem>
                                      <SelectItem value="diagonal">Diagonal</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label className="text-xs">Cor Inicial</Label>
                                    <Input
                                      type="color"
                                      value={section.backgroundOverlay.color1?.replace(/rgba?\([^)]+\)/, '#000000') || '#000000'}
                                      onChange={(e) => updateSection(section.id, {
                                        backgroundOverlay: { ...section.backgroundOverlay!, color1: e.target.value + 'cc' }
                                      })}
                                      className="h-8 mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Cor Final</Label>
                                    <Input
                                      type="color"
                                      value={section.backgroundOverlay.color2?.replace(/rgba?\([^)]+\)/, '#000000') || '#000000'}
                                      onChange={(e) => updateSection(section.id, {
                                        backgroundOverlay: { ...section.backgroundOverlay!, color2: e.target.value + '00' }
                                      })}
                                      className="h-8 mt-1"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
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
                            {element.type === 'text' && (
                              <>
                                <div className="flex gap-2 items-center">
                                  <Select
                                    value={element.textType || 'description'}
                                    onValueChange={(value: TextType) => updateSectionElement(section.id, element.id, { 
                                      textType: value,
                                      fontSize: value === 'title' ? '36px' : value === 'subtitle' ? '24px' : '18px',
                                      fontWeight: value === 'title' ? 'bold' : value === 'subtitle' ? '600' : 'normal',
                                    })}
                                  >
                                    <SelectTrigger className="w-32 h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="title">Título</SelectItem>
                                      <SelectItem value="subtitle">Subtítulo</SelectItem>
                                      <SelectItem value="description">Descrição</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    variant={element.bold ? 'default' : 'outline'}
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => updateSectionElement(section.id, element.id, { bold: !element.bold })}
                                  >
                                    <Bold className="w-3 h-3" />
                                  </Button>
                                </div>
                                <Textarea
                                  value={element.content}
                                  onChange={(e) => updateSectionElement(section.id, element.id, { content: e.target.value })}
                                  rows={2}
                                  className="text-sm"
                                />
                              </>
                            )}

                            {element.type === 'button' && (
                              <>
                                <Textarea
                                  value={element.content}
                                  onChange={(e) => updateSectionElement(section.id, element.id, { content: e.target.value })}
                                  rows={1}
                                  className="text-sm"
                                  placeholder="Texto do botão"
                                />
                                <Input
                                  value={element.link || ''}
                                  onChange={(e) => updateSectionElement(section.id, element.id, { link: e.target.value })}
                                  placeholder="Link do botão"
                                  className="h-8"
                                />
                              </>
                            )}

                            {element.type === 'image' && (
                              <div className="space-y-3">
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
                                
                                <div>
                                  <Label className="text-xs">Tamanho: {element.mediaWidth || 100}%</Label>
                                  <Slider
                                    value={[element.mediaWidth || 100]}
                                    onValueChange={(value) => updateSectionElement(section.id, element.id, { mediaWidth: value[0] })}
                                    min={20}
                                    max={100}
                                    step={5}
                                    className="mt-1"
                                  />
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={element.glowingBorder || false}
                                    onCheckedChange={(checked) => updateSectionElement(section.id, element.id, { 
                                      glowingBorder: checked,
                                      glowBorderColor: element.glowBorderColor || '#FF6A00',
                                    })}
                                  />
                                  <Label className="text-xs">Borda Brilhante Pulsante</Label>
                                </div>
                                
                                {element.glowingBorder && (
                                  <div className="flex items-center gap-2">
                                    <Label className="text-xs">Cor:</Label>
                                    <Input
                                      type="color"
                                      value={element.glowBorderColor || '#FF6A00'}
                                      onChange={(e) => updateSectionElement(section.id, element.id, { glowBorderColor: e.target.value })}
                                      className="h-8 w-12"
                                    />
                                  </div>
                                )}
                              </div>
                            )}

                            {element.type === 'video' && (
                              <div className="space-y-3">
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
                                
                                <div>
                                  <Label className="text-xs">Tamanho: {element.mediaWidth || 100}%</Label>
                                  <Slider
                                    value={[element.mediaWidth || 100]}
                                    onValueChange={(value) => updateSectionElement(section.id, element.id, { mediaWidth: value[0] })}
                                    min={20}
                                    max={100}
                                    step={5}
                                    className="mt-1"
                                  />
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={element.glowingBorder || false}
                                    onCheckedChange={(checked) => updateSectionElement(section.id, element.id, { 
                                      glowingBorder: checked,
                                      glowBorderColor: element.glowBorderColor || '#FF6A00',
                                    })}
                                  />
                                  <Label className="text-xs">Borda Brilhante Pulsante</Label>
                                </div>
                                
                                {element.glowingBorder && (
                                  <div className="flex items-center gap-2">
                                    <Label className="text-xs">Cor:</Label>
                                    <Input
                                      type="color"
                                      value={element.glowBorderColor || '#FF6A00'}
                                      onChange={(e) => updateSectionElement(section.id, element.id, { glowBorderColor: e.target.value })}
                                      className="h-8 w-12"
                                    />
                                  </div>
                                )}
                              </div>
                            )}

                            {element.type === 'text' && (
                              <div className="space-y-2">
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
                                </div>
                                
                                {/* Text gradient option */}
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={element.gradientText?.enabled || false}
                                    onCheckedChange={(checked) => updateSectionElement(section.id, element.id, {
                                      gradientText: { 
                                        enabled: checked,
                                        colors: element.gradientText?.colors || ['#ffffff', '#a0a0a0'],
                                      }
                                    })}
                                  />
                                  <Label className="text-xs">Gradiente no Texto</Label>
                                </div>
                                
                                {element.gradientText?.enabled && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Label className="text-xs">Tons:</Label>
                                      <Select
                                        value={String(element.gradientText.colors?.length || 2)}
                                        onValueChange={(value) => {
                                          const count = parseInt(value);
                                          const currentColors = element.gradientText?.colors || ['#ffffff', '#a0a0a0'];
                                          const newColors = [...currentColors];
                                          while (newColors.length < count) {
                                            newColors.push('#808080');
                                          }
                                          while (newColors.length > count) {
                                            newColors.pop();
                                          }
                                          updateSectionElement(section.id, element.id, {
                                            gradientText: { ...element.gradientText!, colors: newColors }
                                          });
                                        }}
                                      >
                                        <SelectTrigger className="h-8 w-16">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="2">2</SelectItem>
                                          <SelectItem value="3">3</SelectItem>
                                          <SelectItem value="4">4</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex gap-1">
                                      {element.gradientText.colors?.map((color, idx) => (
                                        <Input
                                          key={idx}
                                          type="color"
                                          value={color}
                                          onChange={(e) => {
                                            const newColors = [...(element.gradientText?.colors || [])];
                                            newColors[idx] = e.target.value;
                                            updateSectionElement(section.id, element.id, {
                                              gradientText: { ...element.gradientText!, colors: newColors }
                                            });
                                          }}
                                          className="h-8 w-10"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Highlight words */}
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={element.highlightWords?.enabled || false}
                                    onCheckedChange={(checked) => updateSectionElement(section.id, element.id, {
                                      highlightWords: { 
                                        enabled: checked,
                                        words: element.highlightWords?.words || '',
                                        color: element.highlightWords?.color || '#FF6A00',
                                      }
                                    })}
                                  />
                                  <Label className="text-xs">Destacar Palavras</Label>
                                </div>
                                
                                {element.highlightWords?.enabled && (
                                  <div className="space-y-2">
                                    <Input
                                      value={element.highlightWords.words || ''}
                                      onChange={(e) => updateSectionElement(section.id, element.id, {
                                        highlightWords: { ...element.highlightWords!, words: e.target.value }
                                      })}
                                      placeholder="Palavras separadas por vírgula"
                                      className="h-8 text-xs"
                                    />
                                    <div className="flex items-center gap-2">
                                      <Label className="text-xs">Cor:</Label>
                                      <Input
                                        type="color"
                                        value={element.highlightWords.color || '#FF6A00'}
                                        onChange={(e) => updateSectionElement(section.id, element.id, {
                                          highlightWords: { ...element.highlightWords!, color: e.target.value }
                                        })}
                                        className="h-8 w-12"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Animation toggle for all elements */}
                            <div className="flex items-center gap-2 pt-2 border-t">
                              <Switch
                                checked={element.animation || false}
                                onCheckedChange={(checked) => updateSectionElement(section.id, element.id, { animation: checked })}
                              />
                              <Label className="text-xs">Ativar Animação (Scroll)</Label>
                            </div>
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
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};
