import { useState } from 'react';
import { PresellSection, SectionElement, sectionTemplates, sectionTypesList, SectionType, GradientDirection, TextType, ResponsiveSize, ResponsiveFontSize, ResponsiveAlign, LayoutDirection, ResponsiveLayout, ResponsiveColumnSettings } from '@/types/sections';
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
import { Plus, Trash2, AlignVerticalJustifyCenter, AlignHorizontalJustifyCenter, Image, Type, Video, ChevronDown, Bold, Link, Columns, ArrowLeftRight, Monitor, Tablet, Smartphone } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveMediaSizeEditor, ResponsiveFontSizeEditor } from '@/components/ResponsiveSizeEditor';
import { ResponsiveAlignEditor } from '@/components/ResponsiveAlignEditor';


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
                  <Select
                    value={section.layout}
                    onValueChange={(value: LayoutDirection) => updateSection(section.id, { layout: value })}
                  >
                    <SelectTrigger className="w-10 h-8 p-0 justify-center" title="Layout da seção">
                      {section.layout === 'vertical' && <AlignVerticalJustifyCenter className="w-4 h-4" />}
                      {section.layout === 'horizontal' && <AlignHorizontalJustifyCenter className="w-4 h-4" />}
                      {(section.layout === 'two-columns' || section.layout === 'two-columns-reverse') && <Columns className="w-4 h-4" />}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vertical">
                        <div className="flex items-center gap-2">
                          <AlignVerticalJustifyCenter className="w-4 h-4" />
                          <span>Vertical</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="horizontal">
                        <div className="flex items-center gap-2">
                          <AlignHorizontalJustifyCenter className="w-4 h-4" />
                          <span>Horizontal</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="two-columns">
                        <div className="flex items-center gap-2">
                          <Columns className="w-4 h-4" />
                          <span>Duas Colunas</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="two-columns-reverse">
                        <div className="flex items-center gap-2">
                          <ArrowLeftRight className="w-4 h-4" />
                          <span>Duas Colunas (invertido)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                  
                  {/* Responsive Layout Settings */}
                  <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                    <Label className="font-semibold flex items-center gap-2">
                      <Columns className="w-4 h-4" />
                      Layout por Dispositivo
                    </Label>
                    
                    <Tabs defaultValue="desktop" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 h-8">
                        <TabsTrigger value="desktop" className="text-xs h-7">
                          <Monitor className="w-3 h-3 mr-1" />
                          Desktop
                        </TabsTrigger>
                        <TabsTrigger value="tablet" className="text-xs h-7">
                          <Tablet className="w-3 h-3 mr-1" />
                          Tablet
                        </TabsTrigger>
                        <TabsTrigger value="mobile" className="text-xs h-7">
                          <Smartphone className="w-3 h-3 mr-1" />
                          Mobile
                        </TabsTrigger>
                      </TabsList>
                      
                      {(['desktop', 'tablet', 'mobile'] as const).map((device) => {
                        const currentLayout = section.responsiveLayout?.[device] || section.layout;
                        const columnSettings = section.responsiveColumnSettings?.[device] || {};
                        const isColumnsLayout = currentLayout === 'two-columns' || currentLayout === 'two-columns-reverse';
                        
                        return (
                          <TabsContent key={device} value={device} className="space-y-3 mt-3">
                            {/* Layout type for this device */}
                            <div>
                              <Label className="text-xs">Layout ({device})</Label>
                              <Select
                                value={currentLayout}
                                onValueChange={(value: LayoutDirection) => {
                                  const newResponsiveLayout: ResponsiveLayout = {
                                    desktop: section.responsiveLayout?.desktop || section.layout,
                                    tablet: section.responsiveLayout?.tablet || section.layout,
                                    mobile: section.responsiveLayout?.mobile || section.layout,
                                    [device]: value,
                                  };
                                  updateSection(section.id, { responsiveLayout: newResponsiveLayout });
                                }}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="vertical">
                                    <div className="flex items-center gap-2">
                                      <AlignVerticalJustifyCenter className="w-4 h-4" />
                                      <span>Vertical</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="horizontal">
                                    <div className="flex items-center gap-2">
                                      <AlignHorizontalJustifyCenter className="w-4 h-4" />
                                      <span>Horizontal</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="two-columns">
                                    <div className="flex items-center gap-2">
                                      <Columns className="w-4 h-4" />
                                      <span>Duas Colunas</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="two-columns-reverse">
                                    <div className="flex items-center gap-2">
                                      <ArrowLeftRight className="w-4 h-4" />
                                      <span>Duas Colunas (invertido)</span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Column settings only when two-columns is selected */}
                            {isColumnsLayout && (
                              <>
                                <div>
                                  <Label className="text-xs">Proporção das Colunas</Label>
                                  <Select
                                    value={columnSettings.columnWidthRatio || '50-50'}
                                    onValueChange={(value) => {
                                      const newSettings: ResponsiveColumnSettings = {
                                        desktop: section.responsiveColumnSettings?.desktop || {},
                                        tablet: section.responsiveColumnSettings?.tablet || {},
                                        mobile: section.responsiveColumnSettings?.mobile || {},
                                        [device]: { ...columnSettings, columnWidthRatio: value },
                                      };
                                      updateSection(section.id, { responsiveColumnSettings: newSettings });
                                    }}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="50-50">50% / 50%</SelectItem>
                                      <SelectItem value="40-60">40% / 60%</SelectItem>
                                      <SelectItem value="60-40">60% / 40%</SelectItem>
                                      <SelectItem value="30-70">30% / 70%</SelectItem>
                                      <SelectItem value="70-30">70% / 30%</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label className="text-xs">Espaçamento</Label>
                                  <Select
                                    value={columnSettings.columnGap || '2rem'}
                                    onValueChange={(value) => {
                                      const newSettings: ResponsiveColumnSettings = {
                                        desktop: section.responsiveColumnSettings?.desktop || {},
                                        tablet: section.responsiveColumnSettings?.tablet || {},
                                        mobile: section.responsiveColumnSettings?.mobile || {},
                                        [device]: { ...columnSettings, columnGap: value },
                                      };
                                      updateSection(section.id, { responsiveColumnSettings: newSettings });
                                    }}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1rem">Pequeno</SelectItem>
                                      <SelectItem value="2rem">Médio</SelectItem>
                                      <SelectItem value="3rem">Grande</SelectItem>
                                      <SelectItem value="4rem">Extra Grande</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-xs">Coluna Esquerda</Label>
                                  <div className="flex flex-wrap gap-1">
                                    {section.elements.map((el) => (
                                      <Button
                                        key={el.id}
                                        variant={columnSettings.leftColumnElements?.includes(el.id) ? 'default' : 'outline'}
                                        size="sm"
                                        className="h-7 text-xs"
                                        onClick={() => {
                                          const currentLeft = columnSettings.leftColumnElements || [];
                                          const currentRight = columnSettings.rightColumnElements || [];
                                          
                                          let newLeft: string[];
                                          let newRight: string[];
                                          
                                          if (currentLeft.includes(el.id)) {
                                            newLeft = currentLeft.filter(id => id !== el.id);
                                            newRight = currentRight;
                                          } else {
                                            newLeft = [...currentLeft, el.id];
                                            newRight = currentRight.filter(id => id !== el.id);
                                          }
                                          
                                          const newSettings: ResponsiveColumnSettings = {
                                            desktop: section.responsiveColumnSettings?.desktop || {},
                                            tablet: section.responsiveColumnSettings?.tablet || {},
                                            mobile: section.responsiveColumnSettings?.mobile || {},
                                            [device]: { 
                                              ...columnSettings, 
                                              leftColumnElements: newLeft,
                                              rightColumnElements: newRight 
                                            },
                                          };
                                          updateSection(section.id, { responsiveColumnSettings: newSettings });
                                        }}
                                      >
                                        {el.type === 'text' ? '📝' : el.type === 'image' ? '🖼️' : el.type === 'video' ? '🎬' : '🔘'}
                                        {el.content?.slice(0, 8) || el.type}
                                      </Button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-xs">Coluna Direita</Label>
                                  <div className="flex flex-wrap gap-1">
                                    {section.elements.map((el) => (
                                      <Button
                                        key={el.id}
                                        variant={columnSettings.rightColumnElements?.includes(el.id) ? 'default' : 'outline'}
                                        size="sm"
                                        className="h-7 text-xs"
                                        onClick={() => {
                                          const currentLeft = columnSettings.leftColumnElements || [];
                                          const currentRight = columnSettings.rightColumnElements || [];
                                          
                                          let newLeft: string[];
                                          let newRight: string[];
                                          
                                          if (currentRight.includes(el.id)) {
                                            newRight = currentRight.filter(id => id !== el.id);
                                            newLeft = currentLeft;
                                          } else {
                                            newRight = [...currentRight, el.id];
                                            newLeft = currentLeft.filter(id => id !== el.id);
                                          }
                                          
                                          const newSettings: ResponsiveColumnSettings = {
                                            desktop: section.responsiveColumnSettings?.desktop || {},
                                            tablet: section.responsiveColumnSettings?.tablet || {},
                                            mobile: section.responsiveColumnSettings?.mobile || {},
                                            [device]: { 
                                              ...columnSettings, 
                                              leftColumnElements: newLeft,
                                              rightColumnElements: newRight 
                                            },
                                          };
                                          updateSection(section.id, { responsiveColumnSettings: newSettings });
                                        }}
                                      >
                                        {el.type === 'text' ? '📝' : el.type === 'image' ? '🖼️' : el.type === 'video' ? '🎬' : '🔘'}
                                        {el.content?.slice(0, 8) || el.type}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}
                          </TabsContent>
                        );
                      })}
                    </Tabs>
                    
                    <p className="text-xs text-muted-foreground">
                      Configure layouts diferentes para cada tamanho de tela.
                    </p>
                  </div>

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
                                    color1: section.backgroundOverlay?.color1 || '#000000',
                                    color2: section.backgroundOverlay?.color2 || '#000000',
                                    opacity1: section.backgroundOverlay?.opacity1 ?? 80,
                                    opacity2: section.backgroundOverlay?.opacity2 ?? 0,
                                    direction: section.backgroundOverlay?.direction || 'vertical',
                                  }
                                })}
                              />
                              <Label className="text-xs">Gradiente de Suavização</Label>
                            </div>
                            
                            {section.backgroundOverlay?.enabled && (
                              <div className="space-y-3 pl-4">
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
                                
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Label className="text-xs">Cor Inicial</Label>
                                    <Input
                                      type="color"
                                      value={section.backgroundOverlay.color1 || '#000000'}
                                      onChange={(e) => updateSection(section.id, {
                                        backgroundOverlay: { ...section.backgroundOverlay!, color1: e.target.value }
                                      })}
                                      className="h-8 w-12"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Intensidade Inicial: {section.backgroundOverlay.opacity1 ?? 80}%</Label>
                                    <Slider
                                      value={[section.backgroundOverlay.opacity1 ?? 80]}
                                      onValueChange={(value) => updateSection(section.id, {
                                        backgroundOverlay: { ...section.backgroundOverlay!, opacity1: value[0] }
                                      })}
                                      min={0}
                                      max={100}
                                      step={5}
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Label className="text-xs">Cor Final</Label>
                                    <Input
                                      type="color"
                                      value={section.backgroundOverlay.color2 || '#000000'}
                                      onChange={(e) => updateSection(section.id, {
                                        backgroundOverlay: { ...section.backgroundOverlay!, color2: e.target.value }
                                      })}
                                      className="h-8 w-12"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Intensidade Final: {section.backgroundOverlay.opacity2 ?? 0}%</Label>
                                    <Slider
                                      value={[section.backgroundOverlay.opacity2 ?? 0]}
                                      onValueChange={(value) => updateSection(section.id, {
                                        backgroundOverlay: { ...section.backgroundOverlay!, opacity2: value[0] }
                                      })}
                                      min={0}
                                      max={100}
                                      step={5}
                                      className="mt-1"
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

                  {/* Section Height */}
                  <div className="space-y-3">
                    <Label className="font-semibold">Altura da Seção</Label>
                    <Select
                      value={section.minHeight || 'auto'}
                      onValueChange={(value) => updateSection(section.id, { minHeight: value === 'auto' ? undefined : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Altura automática" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Automática</SelectItem>
                        <SelectItem value="50vh">Metade da tela (50vh)</SelectItem>
                        <SelectItem value="75vh">3/4 da tela (75vh)</SelectItem>
                        <SelectItem value="100vh">Tela cheia (100vh)</SelectItem>
                        <SelectItem value="400px">400px</SelectItem>
                        <SelectItem value="600px">600px</SelectItem>
                        <SelectItem value="800px">800px</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Arraste a borda inferior da seção no preview para ajustar manualmente
                    </p>
                  </div>

                  {/* Inline Group Info */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground bg-primary/10 p-2 rounded">
                      💡 Use o mesmo "Grupo" em elementos para deixá-los lado a lado.
                      Arraste os elementos no preview para reorganizar ou excluir.
                    </p>
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
                                    onValueChange={(value: TextType) => {
                                      const newFontSize = value === 'title' ? '36px' : value === 'subtitle' ? '24px' : '18px';
                                      const tabletSize = value === 'title' ? '28px' : value === 'subtitle' ? '20px' : '16px';
                                      const mobileSize = value === 'title' ? '24px' : value === 'subtitle' ? '18px' : '14px';
                                      updateSectionElement(section.id, element.id, { 
                                        textType: value,
                                        fontSize: newFontSize,
                                        fontWeight: value === 'title' ? 'bold' : value === 'subtitle' ? '600' : 'normal',
                                        responsiveFontSize: { desktop: newFontSize, tablet: tabletSize, mobile: mobileSize },
                                      });
                                    }}
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
                                <ResponsiveFontSizeEditor
                                  value={element.responsiveFontSize || { 
                                    desktop: element.fontSize || '18px', 
                                    tablet: element.fontSize || '16px', 
                                    mobile: element.fontSize || '14px' 
                                  }}
                                  onChange={(value) => updateSectionElement(section.id, element.id, { 
                                    responsiveFontSize: value,
                                    fontSize: value.desktop 
                                  })}
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
                                
                                <ResponsiveMediaSizeEditor
                                  value={element.responsiveMediaWidth || { desktop: element.mediaWidth || 100, tablet: element.mediaWidth || 100, mobile: element.mediaWidth || 100 }}
                                  onChange={(value) => updateSectionElement(section.id, element.id, { 
                                    responsiveMediaWidth: value,
                                    mediaWidth: value.desktop 
                                  })}
                                  label="Tamanho da Imagem"
                                />
                                
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={element.glowingBorder || false}
                                    onCheckedChange={(checked) => updateSectionElement(section.id, element.id, { 
                                      glowingBorder: checked,
                                      glowBorderColors: element.glowBorderColors || ['#FF6A00', '#FF2D55'],
                                    })}
                                  />
                                  <Label className="text-xs">Borda Brilhante</Label>
                                </div>
                                
                                {element.glowingBorder && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Label className="text-xs">Cores:</Label>
                                      <Select
                                        value={String(element.glowBorderColors?.length || 2)}
                                        onValueChange={(value) => {
                                          const count = parseInt(value);
                                          const currentColors = element.glowBorderColors || ['#FF6A00', '#FF2D55'];
                                          const newColors = [...currentColors];
                                          while (newColors.length < count) {
                                            newColors.push('#8A2EFF');
                                          }
                                          while (newColors.length > count) {
                                            newColors.pop();
                                          }
                                          updateSectionElement(section.id, element.id, { glowBorderColors: newColors });
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
                                      {element.glowBorderColors?.map((color, idx) => (
                                        <Input
                                          key={idx}
                                          type="color"
                                          value={color}
                                          onChange={(e) => {
                                            const newColors = [...(element.glowBorderColors || [])];
                                            newColors[idx] = e.target.value;
                                            updateSectionElement(section.id, element.id, { glowBorderColors: newColors });
                                          }}
                                          className="h-8 w-10"
                                        />
                                      ))}
                                    </div>
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
                                
                                <ResponsiveMediaSizeEditor
                                  value={element.responsiveMediaWidth || { desktop: element.mediaWidth || 100, tablet: element.mediaWidth || 100, mobile: element.mediaWidth || 100 }}
                                  onChange={(value) => updateSectionElement(section.id, element.id, { 
                                    responsiveMediaWidth: value,
                                    mediaWidth: value.desktop 
                                  })}
                                  max={150}
                                  label="Tamanho do Vídeo"
                                />
                                
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={element.glowingBorder || false}
                                    onCheckedChange={(checked) => updateSectionElement(section.id, element.id, { 
                                      glowingBorder: checked,
                                      glowBorderColors: element.glowBorderColors || ['#FF6A00', '#FF2D55'],
                                    })}
                                  />
                                  <Label className="text-xs">Borda Brilhante</Label>
                                </div>
                                
                                {element.glowingBorder && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Label className="text-xs">Cores:</Label>
                                      <Select
                                        value={String(element.glowBorderColors?.length || 2)}
                                        onValueChange={(value) => {
                                          const count = parseInt(value);
                                          const currentColors = element.glowBorderColors || ['#FF6A00', '#FF2D55'];
                                          const newColors = [...currentColors];
                                          while (newColors.length < count) {
                                            newColors.push('#8A2EFF');
                                          }
                                          while (newColors.length > count) {
                                            newColors.pop();
                                          }
                                          updateSectionElement(section.id, element.id, { glowBorderColors: newColors });
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
                                      {element.glowBorderColors?.map((color, idx) => (
                                        <Input
                                          key={idx}
                                          type="color"
                                          value={color}
                                          onChange={(e) => {
                                            const newColors = [...(element.glowBorderColors || [])];
                                            newColors[idx] = e.target.value;
                                            updateSectionElement(section.id, element.id, { glowBorderColors: newColors });
                                          }}
                                          className="h-8 w-10"
                                        />
                                      ))}
                                    </div>
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

                            {/* Responsive Align Editor */}
                            <ResponsiveAlignEditor
                              value={element.responsiveAlign || { desktop: 'center', tablet: 'center', mobile: 'center' }}
                              onChange={(value) => updateSectionElement(section.id, element.id, { responsiveAlign: value })}
                            />

                            {/* Inline Group - to place elements side by side */}
                            <div className="space-y-2">
                              <Label className="text-xs flex items-center gap-1">
                                <Link className="w-3 h-3" /> Linha (agrupar lado a lado)
                              </Label>
                              <Select
                                value={element.inlineGroup || 'none'}
                                onValueChange={(value) => updateSectionElement(section.id, element.id, { 
                                  inlineGroup: value === 'none' ? undefined : value 
                                })}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Sozinho" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Sozinho</SelectItem>
                                  <SelectItem value="linha-1">Linha 1</SelectItem>
                                  <SelectItem value="linha-2">Linha 2</SelectItem>
                                  <SelectItem value="linha-3">Linha 3</SelectItem>
                                  <SelectItem value="linha-4">Linha 4</SelectItem>
                                  <SelectItem value="linha-5">Linha 5</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              {/* Quick add text beside image/video */}
                              {(element.type === 'image' || element.type === 'video') && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full h-8 text-xs"
                                  onClick={() => {
                                    // Find a line that is not used or use the same as current element
                                    const currentLine = element.inlineGroup || 'linha-1';
                                    
                                    // Update current element to be in the line if not already
                                    if (!element.inlineGroup) {
                                      updateSectionElement(section.id, element.id, { inlineGroup: currentLine });
                                    }
                                    
                                    // Add new text element in the same line
                                    const newTextElement: SectionElement = {
                                      id: Date.now().toString(),
                                      type: 'text',
                                      content: 'Adicione seu texto aqui...',
                                      fontSize: '18px',
                                      color: '#ffffff',
                                      textType: 'description',
                                      animation: false,
                                      inlineGroup: currentLine,
                                      responsiveAlign: { desktop: 'left', tablet: 'center', mobile: 'center' },
                                    };
                                    
                                    onUpdateSections(sections.map(s => {
                                      if (s.id !== section.id) return s;
                                      // Insert the new text element right after the current element
                                      const currentIndex = s.elements.findIndex(el => el.id === element.id);
                                      const newElements = [...s.elements];
                                      newElements.splice(currentIndex + 1, 0, newTextElement);
                                      return { ...s, elements: newElements };
                                    }));
                                  }}
                                >
                                  <Type className="w-3 h-3 mr-1" />
                                  Adicionar Texto ao Lado
                                </Button>
                              )}
                              
                              <p className="text-xs text-muted-foreground">
                                Elementos na mesma linha ficam lado a lado
                              </p>
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
