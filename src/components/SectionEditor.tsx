import { useState } from 'react';
import { PresellSection, SectionElement, sectionTemplates, sectionTypesList, SectionType, GradientDirection, TextType, LayoutDirection, ResponsiveLayout, ResponsiveColumnSettings, ButtonColorConfig } from '@/types/sections';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShinyButton } from '@/components/ui/shiny-button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Trash2, AlignVerticalJustifyCenter, AlignHorizontalJustifyCenter, Image, Type, Video, ChevronLeft, Bold, Link, Columns, ArrowLeftRight, Monitor, Tablet, Smartphone, Settings, GripVertical, MousePointerClick } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveMediaSizeEditor, ResponsiveFontSizeEditor } from '@/components/ResponsiveSizeEditor';
import { ResponsiveAlignEditor } from '@/components/ResponsiveAlignEditor';

type EditorView = 'sections' | 'section-elements' | 'element-edit' | 'section-settings';

interface SectionEditorProps {
  sections: PresellSection[];
  onUpdateSections: (sections: PresellSection[]) => void;
}

export const SectionEditor = ({ sections, onUpdateSections }: SectionEditorProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<EditorView>('sections');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const selectedSection = sections.find(s => s.id === selectedSectionId);
  const selectedElement = selectedSection?.elements.find(e => e.id === selectedElementId);

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
    setSelectedSectionId(newSection.id);
    setCurrentView('section-elements');
  };

  const removeSection = (id: string) => {
    onUpdateSections(sections.filter(s => s.id !== id));
    if (selectedSectionId === id) {
      setSelectedSectionId(null);
      setCurrentView('sections');
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
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
      setCurrentView('section-elements');
    }
  };

  const handleBack = () => {
    if (currentView === 'element-edit') {
      setSelectedElementId(null);
      setCurrentView('section-elements');
    } else if (currentView === 'section-elements' || currentView === 'section-settings') {
      setSelectedSectionId(null);
      setCurrentView('sections');
    }
  };

  const handleSelectSection = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setCurrentView('section-elements');
  };

  const handleSelectElement = (elementId: string) => {
    setSelectedElementId(elementId);
    setCurrentView('element-edit');
  };

  const handleOpenSectionSettings = () => {
    setCurrentView('section-settings');
  };

  // Render the sections list view
  const renderSectionsList = () => (
    <div className="space-y-3">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <div>
            <ShinyButton onClick={() => setDialogOpen(true)} icon={<Plus className="w-4 h-4" />}>
              Adicionar Seção
            </ShinyButton>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Escolha um modelo de seção</DialogTitle>
            <DialogDescription>
              Selecione o tipo de seção que você deseja adicionar
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

      <p className="text-xs text-muted-foreground">
        Arraste as seções no preview para reordená-las.
      </p>

      <div className="space-y-2">
        {sections.map((section) => (
          <Card
            key={section.id}
            className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleSelectSection(section.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{sectionTemplates[section.type].icon}</span>
                <div>
                  <p className="font-medium">{section.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {section.elements.length} elemento(s)
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSection(section.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // Render the elements list for a section
  const renderSectionElements = () => {
    if (!selectedSection) return null;

    return (
      <div className="space-y-3">
        {/* Header with back button */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <Input
              value={selectedSection.name}
              onChange={(e) => updateSection(selectedSection.id, { name: e.target.value })}
              className="h-8 font-semibold"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleOpenSectionSettings}
            title="Configurações da seção"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Add element buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addElementToSection(selectedSection.id, 'text')}
          >
            <Type className="w-4 h-4 mr-1" /> Texto
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addElementToSection(selectedSection.id, 'image')}
          >
            <Image className="w-4 h-4 mr-1" /> Imagem
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addElementToSection(selectedSection.id, 'video')}
          >
            <Video className="w-4 h-4 mr-1" /> Vídeo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addElementToSection(selectedSection.id, 'button')}
          >
            <MousePointerClick className="w-4 h-4 mr-1" /> Botão
          </Button>
        </div>

        {/* Elements list */}
        <div className="space-y-2">
          {selectedSection.elements.length === 0 && (
            <Card className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Nenhum elemento</p>
            </Card>
          )}
          
          {selectedSection.elements.map((element) => (
            <Card
              key={element.id}
              className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => handleSelectElement(element.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="text-lg">
                    {element.type === 'text' ? '📝' : element.type === 'image' ? '🖼️' : element.type === 'video' ? '🎬' : '🔘'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {element.type === 'text' ? (element.textType === 'title' ? 'Título' : element.textType === 'subtitle' ? 'Subtítulo' : 'Texto') : 
                       element.type === 'image' ? 'Imagem' : 
                       element.type === 'video' ? 'Vídeo' : 'Botão'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {element.content?.slice(0, 30) || (element.type === 'image' ? 'Clique para editar' : 'Clique para editar')}
                      {element.content && element.content.length > 30 ? '...' : ''}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElementFromSection(selectedSection.id, element.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Render element edit view
  const renderElementEdit = () => {
    if (!selectedSection || !selectedElement) return null;

    return (
      <div className="space-y-4">
        {/* Header with back button */}
        <div className="flex items-center gap-2 pb-2 border-b">
          <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-lg">
            {selectedElement.type === 'text' ? '📝' : selectedElement.type === 'image' ? '🖼️' : selectedElement.type === 'video' ? '🎬' : '🔘'}
          </span>
          <span className="font-semibold">
            Editar {selectedElement.type === 'text' ? 'Texto' : selectedElement.type === 'image' ? 'Imagem' : selectedElement.type === 'video' ? 'Vídeo' : 'Botão'}
          </span>
        </div>

        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-4 pr-3">
            {/* Text element settings */}
            {selectedElement.type === 'text' && (
              <>
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedElement.textType || 'description'}
                    onValueChange={(value: TextType) => updateSectionElement(selectedSection.id, selectedElement.id, { textType: value })}
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
                    variant={selectedElement.bold ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updateSectionElement(selectedSection.id, selectedElement.id, { bold: !selectedElement.bold })}
                  >
                    <Bold className="w-3 h-3" />
                  </Button>
                </div>
                
                <div>
                  <Label className="text-xs">Conteúdo</Label>
                  <Textarea
                    value={selectedElement.content}
                    onChange={(e) => updateSectionElement(selectedSection.id, selectedElement.id, { content: e.target.value })}
                    rows={4}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-xs">Tamanho da Fonte</Label>
                  <ResponsiveFontSizeEditor
                    value={selectedElement.responsiveFontSize || { 
                      desktop: selectedElement.fontSize || '18px', 
                      tablet: selectedElement.fontSize || '16px', 
                      mobile: selectedElement.fontSize || '14px' 
                    }}
                    onChange={(value) => updateSectionElement(selectedSection.id, selectedElement.id, { 
                      responsiveFontSize: value,
                      fontSize: value.desktop 
                    })}
                  />
                </div>

                <div>
                  <Label className="text-xs">Cor do Texto</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={selectedElement.color || '#ffffff'}
                      onChange={(e) => updateSectionElement(selectedSection.id, selectedElement.id, { color: e.target.value })}
                      className="w-12 h-8"
                    />
                    <Input
                      value={selectedElement.color || '#ffffff'}
                      onChange={(e) => updateSectionElement(selectedSection.id, selectedElement.id, { color: e.target.value })}
                      className="flex-1 h-8"
                    />
                  </div>
                </div>

                {/* Gradient text */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={selectedElement.gradientText?.enabled || false}
                      onCheckedChange={(checked) => updateSectionElement(selectedSection.id, selectedElement.id, {
                        gradientText: { 
                          enabled: checked,
                          colors: selectedElement.gradientText?.colors || ['#FF6A00', '#FF2D55'],
                        }
                      })}
                    />
                    <Label className="text-xs">Texto Gradiente</Label>
                  </div>
                  
                  {selectedElement.gradientText?.enabled && (
                    <div className="flex gap-1">
                      {selectedElement.gradientText.colors?.map((color, idx) => (
                        <Input
                          key={idx}
                          type="color"
                          value={color}
                          onChange={(e) => {
                            const newColors = [...(selectedElement.gradientText?.colors || [])];
                            newColors[idx] = e.target.value;
                            updateSectionElement(selectedSection.id, selectedElement.id, {
                              gradientText: { ...selectedElement.gradientText!, colors: newColors }
                            });
                          }}
                          className="h-8 w-10"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Highlight words */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={selectedElement.highlightWords?.enabled || false}
                      onCheckedChange={(checked) => updateSectionElement(selectedSection.id, selectedElement.id, {
                        highlightWords: { 
                          enabled: checked,
                          words: selectedElement.highlightWords?.words || '',
                          color: selectedElement.highlightWords?.color || '#FF6A00',
                        }
                      })}
                    />
                    <Label className="text-xs">Destacar Palavras</Label>
                  </div>
                  
                  {selectedElement.highlightWords?.enabled && (
                    <div className="space-y-2">
                      <Input
                        value={selectedElement.highlightWords.words || ''}
                        onChange={(e) => updateSectionElement(selectedSection.id, selectedElement.id, {
                          highlightWords: { ...selectedElement.highlightWords!, words: e.target.value }
                        })}
                        placeholder="Palavras separadas por vírgula"
                        className="h-8"
                      />
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Cor:</Label>
                        <Input
                          type="color"
                          value={selectedElement.highlightWords.color || '#FF6A00'}
                          onChange={(e) => updateSectionElement(selectedSection.id, selectedElement.id, {
                            highlightWords: { ...selectedElement.highlightWords!, color: e.target.value }
                          })}
                          className="h-8 w-12"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Button element settings */}
            {selectedElement.type === 'button' && (
              <>
                <div>
                  <Label className="text-xs">Texto do Botão</Label>
                  <Textarea
                    value={selectedElement.content}
                    onChange={(e) => updateSectionElement(selectedSection.id, selectedElement.id, { content: e.target.value })}
                    rows={1}
                    className="mt-1"
                  />
                </div>
                
                {/* Individual Button Color Config */}
                <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={selectedElement.buttonColor?.useCustomColor || false}
                      onCheckedChange={(checked) => updateSectionElement(selectedSection.id, selectedElement.id, {
                        buttonColor: {
                          useCustomColor: checked,
                          colorType: selectedElement.buttonColor?.colorType || 'solid',
                          solidColor: selectedElement.buttonColor?.solidColor || '#000000',
                          gradientColor1: selectedElement.buttonColor?.gradientColor1 || '#FF6A00',
                          gradientColor2: selectedElement.buttonColor?.gradientColor2 || '#FF2D55',
                          gradientColor3: selectedElement.buttonColor?.gradientColor3,
                        }
                      })}
                    />
                    <Label className="text-xs font-medium">Cor Individual</Label>
                  </div>
                  
                  {selectedElement.buttonColor?.useCustomColor && (
                    <div className="space-y-2">
                      <Select
                        value={selectedElement.buttonColor.colorType || 'solid'}
                        onValueChange={(value: 'solid' | 'gradient') => updateSectionElement(selectedSection.id, selectedElement.id, {
                          buttonColor: { ...selectedElement.buttonColor!, colorType: value }
                        })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Cor Sólida</SelectItem>
                          <SelectItem value="gradient">Gradiente</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {selectedElement.buttonColor.colorType === 'solid' ? (
                        <div className="flex gap-2 items-center">
                          <Input
                            type="color"
                            value={selectedElement.buttonColor.solidColor || '#000000'}
                            onChange={(e) => updateSectionElement(selectedSection.id, selectedElement.id, {
                              buttonColor: { ...selectedElement.buttonColor!, solidColor: e.target.value }
                            })}
                            className="w-12 h-8"
                          />
                          <Input
                            value={selectedElement.buttonColor.solidColor || '#000000'}
                            onChange={(e) => updateSectionElement(selectedSection.id, selectedElement.id, {
                              buttonColor: { ...selectedElement.buttonColor!, solidColor: e.target.value }
                            })}
                            className="flex-1 h-8 text-xs"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex gap-1">
                            <div className="flex-1">
                              <Label className="text-[10px]">Cor 1</Label>
                              <Input
                                type="color"
                                value={selectedElement.buttonColor.gradientColor1 || '#FF6A00'}
                                onChange={(e) => updateSectionElement(selectedSection.id, selectedElement.id, {
                                  buttonColor: { ...selectedElement.buttonColor!, gradientColor1: e.target.value }
                                })}
                                className="w-full h-8"
                              />
                            </div>
                            <div className="flex-1">
                              <Label className="text-[10px]">Cor 2</Label>
                              <Input
                                type="color"
                                value={selectedElement.buttonColor.gradientColor2 || '#FF2D55'}
                                onChange={(e) => updateSectionElement(selectedSection.id, selectedElement.id, {
                                  buttonColor: { ...selectedElement.buttonColor!, gradientColor2: e.target.value }
                                })}
                                className="w-full h-8"
                              />
                            </div>
                            <div className="flex-1">
                              <Label className="text-[10px]">Cor 3</Label>
                              <Input
                                type="color"
                                value={selectedElement.buttonColor.gradientColor3 || '#8B5CF6'}
                                onChange={(e) => updateSectionElement(selectedSection.id, selectedElement.id, {
                                  buttonColor: { ...selectedElement.buttonColor!, gradientColor3: e.target.value }
                                })}
                                className="w-full h-8"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={!!selectedElement.buttonColor.gradientColor3}
                              onCheckedChange={(checked) => updateSectionElement(selectedSection.id, selectedElement.id, {
                                buttonColor: { 
                                  ...selectedElement.buttonColor!, 
                                  gradientColor3: checked ? '#8B5CF6' : undefined 
                                }
                              })}
                            />
                            <Label className="text-[10px]">Usar 3ª cor</Label>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Popup toggle */}
                <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
                  <Switch
                    checked={selectedElement.opensPopup || false}
                    onCheckedChange={(checked) => updateSectionElement(selectedSection.id, selectedElement.id, { 
                      opensPopup: checked,
                      link: checked ? '' : selectedElement.link 
                    })}
                  />
                  <div>
                    <Label className="text-xs font-medium">Abrir Popup de Leads</Label>
                    <p className="text-[10px] text-muted-foreground">
                      Ao clicar, abre o formulário de captação
                    </p>
                  </div>
                </div>

                {!selectedElement.opensPopup && (
                  <div>
                    <Label className="text-xs">Link do Botão</Label>
                    <Input
                      value={selectedElement.link || ''}
                      onChange={(e) => updateSectionElement(selectedSection.id, selectedElement.id, { link: e.target.value })}
                      placeholder="https://..."
                      className="mt-1 h-8"
                    />
                  </div>
                )}
              </>
            )}

            {/* Image element settings */}
            {selectedElement.type === 'image' && (
              <>
                <div>
                  <Label className="text-xs">Upload de Imagem</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          updateSectionElement(selectedSection.id, selectedElement.id, { 
                            imageUrl: event.target?.result as string 
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="mt-1"
                  />
                  {selectedElement.imageUrl && (
                    <img src={selectedElement.imageUrl} className="mt-2 h-24 object-cover rounded" alt="" />
                  )}
                </div>
                
                <ResponsiveMediaSizeEditor
                  value={selectedElement.responsiveMediaWidth || { desktop: selectedElement.mediaWidth || 100, tablet: selectedElement.mediaWidth || 100, mobile: selectedElement.mediaWidth || 100 }}
                  onChange={(value) => updateSectionElement(selectedSection.id, selectedElement.id, { 
                    responsiveMediaWidth: value,
                    mediaWidth: value.desktop 
                  })}
                  label="Tamanho da Imagem"
                />
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={selectedElement.glowingBorder || false}
                    onCheckedChange={(checked) => updateSectionElement(selectedSection.id, selectedElement.id, { 
                      glowingBorder: checked,
                      glowBorderColors: selectedElement.glowBorderColors || ['#FF6A00', '#FF2D55'],
                    })}
                  />
                  <Label className="text-xs">Borda Brilhante</Label>
                </div>
                
                {selectedElement.glowingBorder && (
                  <div className="flex gap-1">
                    {selectedElement.glowBorderColors?.map((color, idx) => (
                      <Input
                        key={idx}
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...(selectedElement.glowBorderColors || [])];
                          newColors[idx] = e.target.value;
                          updateSectionElement(selectedSection.id, selectedElement.id, { glowBorderColors: newColors });
                        }}
                        className="h-8 w-10"
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Video element settings */}
            {selectedElement.type === 'video' && (
              <>
                <div>
                  <Label className="text-xs">Upload de Vídeo</Label>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          updateSectionElement(selectedSection.id, selectedElement.id, { 
                            videoUrl: event.target?.result as string 
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="mt-1"
                  />
                  {selectedElement.videoUrl && (
                    <video src={selectedElement.videoUrl} className="mt-2 h-24 rounded" controls={false} muted />
                  )}
                </div>
                
                <ResponsiveMediaSizeEditor
                  value={selectedElement.responsiveMediaWidth || { desktop: selectedElement.mediaWidth || 100, tablet: selectedElement.mediaWidth || 100, mobile: selectedElement.mediaWidth || 100 }}
                  onChange={(value) => updateSectionElement(selectedSection.id, selectedElement.id, { 
                    responsiveMediaWidth: value,
                    mediaWidth: value.desktop 
                  })}
                  max={150}
                  label="Tamanho do Vídeo"
                />
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={selectedElement.glowingBorder || false}
                    onCheckedChange={(checked) => updateSectionElement(selectedSection.id, selectedElement.id, { 
                      glowingBorder: checked,
                      glowBorderColors: selectedElement.glowBorderColors || ['#FF6A00', '#FF2D55'],
                    })}
                  />
                  <Label className="text-xs">Borda Brilhante</Label>
                </div>
              </>
            )}

            {/* Common settings for all elements */}
            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={selectedElement.animation || false}
                  onCheckedChange={(checked) => updateSectionElement(selectedSection.id, selectedElement.id, { animation: checked })}
                />
                <Label className="text-xs">Animação (Scroll)</Label>
              </div>

              <ResponsiveAlignEditor
                value={selectedElement.responsiveAlign || { desktop: 'center', tablet: 'center', mobile: 'center' }}
                onChange={(value) => updateSectionElement(selectedSection.id, selectedElement.id, { responsiveAlign: value })}
              />

              {/* Inline Group */}
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">
                  <Link className="w-3 h-3" /> Linha (agrupar lado a lado)
                </Label>
                <Select
                  value={selectedElement.inlineGroup || 'none'}
                  onValueChange={(value) => updateSectionElement(selectedSection.id, selectedElement.id, { 
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
                  </SelectContent>
                </Select>

                {/* Quick add text beside image/video */}
                {(selectedElement.type === 'image' || selectedElement.type === 'video') && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-8 text-xs"
                    onClick={() => {
                      const currentLine = selectedElement.inlineGroup || 'linha-1';
                      
                      if (!selectedElement.inlineGroup) {
                        updateSectionElement(selectedSection.id, selectedElement.id, { inlineGroup: currentLine });
                      }
                      
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
                        if (s.id !== selectedSection.id) return s;
                        const currentIndex = s.elements.findIndex(el => el.id === selectedElement.id);
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
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  };

  // Render section settings view
  const renderSectionSettings = () => {
    if (!selectedSection) return null;

    return (
      <div className="space-y-4">
        {/* Header with back button */}
        <div className="flex items-center gap-2 pb-2 border-b">
          <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Settings className="w-4 h-4" />
          <span className="font-semibold">Configurações da Seção</span>
        </div>

        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-4 pr-3">
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
                  const currentLayout = selectedSection.responsiveLayout?.[device] || selectedSection.layout;
                  const columnSettings = selectedSection.responsiveColumnSettings?.[device] || {};
                  const isColumnsLayout = currentLayout === 'two-columns' || currentLayout === 'two-columns-reverse';
                  
                  return (
                    <TabsContent key={device} value={device} className="space-y-3 mt-3">
                      <div>
                        <Label className="text-xs">Layout</Label>
                        <Select
                          value={currentLayout}
                          onValueChange={(value: LayoutDirection) => {
                            const newResponsiveLayout: ResponsiveLayout = {
                              desktop: selectedSection.responsiveLayout?.desktop || selectedSection.layout,
                              tablet: selectedSection.responsiveLayout?.tablet || selectedSection.layout,
                              mobile: selectedSection.responsiveLayout?.mobile || selectedSection.layout,
                              [device]: value,
                            };
                            updateSection(selectedSection.id, { responsiveLayout: newResponsiveLayout });
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
                      
                      {isColumnsLayout && (
                        <>
                          <div>
                            <Label className="text-xs">Proporção</Label>
                            <Select
                              value={columnSettings.columnWidthRatio || '50-50'}
                              onValueChange={(value) => {
                                const newSettings: ResponsiveColumnSettings = {
                                  desktop: selectedSection.responsiveColumnSettings?.desktop || {},
                                  tablet: selectedSection.responsiveColumnSettings?.tablet || {},
                                  mobile: selectedSection.responsiveColumnSettings?.mobile || {},
                                  [device]: { ...columnSettings, columnWidthRatio: value },
                                };
                                updateSection(selectedSection.id, { responsiveColumnSettings: newSettings });
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

                          <div className="space-y-2">
                            <Label className="text-xs">Coluna Esquerda</Label>
                            <div className="flex flex-wrap gap-1">
                              {selectedSection.elements.map((el) => (
                                <Button
                                  key={el.id}
                                  variant={columnSettings.leftColumnElements?.includes(el.id) ? 'default' : 'outline'}
                                  size="sm"
                                  className="h-6 text-xs px-2"
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
                                      desktop: selectedSection.responsiveColumnSettings?.desktop || {},
                                      tablet: selectedSection.responsiveColumnSettings?.tablet || {},
                                      mobile: selectedSection.responsiveColumnSettings?.mobile || {},
                                      [device]: { 
                                        ...columnSettings, 
                                        leftColumnElements: newLeft,
                                        rightColumnElements: newRight 
                                      },
                                    };
                                    updateSection(selectedSection.id, { responsiveColumnSettings: newSettings });
                                  }}
                                >
                                  {el.type === 'text' ? '📝' : el.type === 'image' ? '🖼️' : el.type === 'video' ? '🎬' : '🔘'}
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">Coluna Direita</Label>
                            <div className="flex flex-wrap gap-1">
                              {selectedSection.elements.map((el) => (
                                <Button
                                  key={el.id}
                                  variant={columnSettings.rightColumnElements?.includes(el.id) ? 'default' : 'outline'}
                                  size="sm"
                                  className="h-6 text-xs px-2"
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
                                      desktop: selectedSection.responsiveColumnSettings?.desktop || {},
                                      tablet: selectedSection.responsiveColumnSettings?.tablet || {},
                                      mobile: selectedSection.responsiveColumnSettings?.mobile || {},
                                      [device]: { 
                                        ...columnSettings, 
                                        leftColumnElements: newLeft,
                                        rightColumnElements: newRight 
                                      },
                                    };
                                    updateSection(selectedSection.id, { responsiveColumnSettings: newSettings });
                                  }}
                                >
                                  {el.type === 'text' ? '📝' : el.type === 'image' ? '🖼️' : el.type === 'video' ? '🎬' : '🔘'}
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
            </div>

            {/* Background settings */}
            <div className="space-y-3">
              <Label className="font-semibold">Fundo da Seção</Label>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={selectedSection.backgroundGradient?.enabled || false}
                  onCheckedChange={(checked) => updateSection(selectedSection.id, {
                    backgroundGradient: { ...selectedSection.backgroundGradient!, enabled: checked }
                  })}
                />
                <Label className="text-sm">Usar Gradiente</Label>
              </div>

              {selectedSection.backgroundGradient?.enabled ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Direção</Label>
                    <Select
                      value={selectedSection.backgroundGradient.direction}
                      onValueChange={(value: GradientDirection) => updateSection(selectedSection.id, {
                        backgroundGradient: { ...selectedSection.backgroundGradient!, direction: value }
                      })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diagonal">Diagonal</SelectItem>
                        <SelectItem value="horizontal">Horizontal</SelectItem>
                        <SelectItem value="vertical">Vertical</SelectItem>
                        <SelectItem value="radial">Radial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Cor 1</Label>
                      <Input
                        type="color"
                        value={selectedSection.backgroundGradient.color1}
                        onChange={(e) => updateSection(selectedSection.id, {
                          backgroundGradient: { ...selectedSection.backgroundGradient!, color1: e.target.value }
                        })}
                        className="h-10 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Cor 2</Label>
                      <Input
                        type="color"
                        value={selectedSection.backgroundGradient.color2}
                        onChange={(e) => updateSection(selectedSection.id, {
                          backgroundGradient: { ...selectedSection.backgroundGradient!, color2: e.target.value }
                        })}
                        className="h-10 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Cor 3</Label>
                      <Input
                        type="color"
                        value={selectedSection.backgroundGradient.color3 || '#000000'}
                        onChange={(e) => updateSection(selectedSection.id, {
                          backgroundGradient: { ...selectedSection.backgroundGradient!, color3: e.target.value }
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
                    value={selectedSection.backgroundColor || '#1a1a2e'}
                    onChange={(e) => updateSection(selectedSection.id, { backgroundColor: e.target.value })}
                    className="h-10 w-16"
                  />
                  <Input
                    value={selectedSection.backgroundColor || '#1a1a2e'}
                    onChange={(e) => updateSection(selectedSection.id, { backgroundColor: e.target.value })}
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
                        updateSection(selectedSection.id, { backgroundImage: event.target?.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="mt-1"
                />
                {selectedSection.backgroundImage && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={selectedSection.backgroundImage} className="h-12 w-20 object-cover rounded" alt="bg" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => updateSection(selectedSection.id, { backgroundImage: undefined })}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Text color */}
              <div>
                <Label className="text-xs">Cor do Texto da Seção</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={selectedSection.textColor || '#ffffff'}
                    onChange={(e) => updateSection(selectedSection.id, { textColor: e.target.value })}
                    className="w-12 h-8"
                  />
                  <Input
                    value={selectedSection.textColor || '#ffffff'}
                    onChange={(e) => updateSection(selectedSection.id, { textColor: e.target.value })}
                    className="flex-1 h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <div className="p-4">
      {currentView === 'sections' && renderSectionsList()}
      {currentView === 'section-elements' && renderSectionElements()}
      {currentView === 'element-edit' && renderElementEdit()}
      {currentView === 'section-settings' && renderSectionSettings()}
    </div>
  );
};
