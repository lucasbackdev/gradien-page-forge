import { PresellData, PresellElement, availableFonts } from '@/types/presell';
import { PresellSection } from '@/types/sections';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, ChevronUp, ChevronDown, Video } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionEditor } from './SectionEditor';
import { FloatingHeaderEditor } from './FloatingHeaderEditor';

interface EditorPanelProps {
  data: PresellData;
  onChange: (data: PresellData) => void;
}

export const EditorPanel = ({ data, onChange }: EditorPanelProps) => {
  const handleImageUpload = (field: 'logoImage' | 'favicon', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange({ ...data, [field]: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const addElement = (type: PresellElement['type']) => {
    const newElement: PresellElement = {
      id: Date.now().toString(),
      type,
      content: type === 'cta' ? 'Clique Aqui' : type === 'title' ? 'Novo Título' : type === 'subtitle' ? 'Novo Subtítulo' : type === 'video' ? '' : 'Novo parágrafo',
      fontSize: type === 'title' ? data.fontSizes.mainTitle : type === 'subtitle' ? data.fontSizes.subtitle : data.fontSizes.description,
      fontFamily: data.fonts.body,
      color: data.colors.text,
      gradientColors: {
        enabled: false,
        color1: '#ffffff',
        color2: '#a0a0a0',
        color3: '#606060',
      },
      mediaWidth: 100,
      // Button specific properties
      buttonColor: data.colors.button,
      buttonTextColor: data.colors.buttonText,
      buttonGradient: {
        enabled: false,
        color1: '#FF6A00',
        color2: '#FF2D55',
      },
    };
    onChange({ ...data, elements: [...data.elements, newElement] });
  };

  const updateElement = (id: string, updates: Partial<PresellElement>) => {
    onChange({
      ...data,
      elements: data.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    });
  };

  const removeElement = (id: string) => {
    onChange({ ...data, elements: data.elements.filter((el) => el.id !== id) });
  };

  const parseFontSize = (size: string): number => {
    const num = parseInt(size.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 16 : num;
  };

  const adjustFontSize = (currentSize: string, delta: number): string => {
    const num = parseFontSize(currentSize);
    const newNum = Math.max(8, num + delta);
    return `${newNum}px`;
  };

  const FontSizeControl = ({ 
    label, 
    value, 
    onChange: onChangeSize 
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void;
  }) => (
    <Card className="p-4">
      <Label>{label}</Label>
      <div className="flex items-center gap-2 mt-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onChangeSize(adjustFontSize(value, -2))}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Input
          value={value}
          onChange={(e) => onChangeSize(e.target.value)}
          className="text-center"
          placeholder="16px"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => onChangeSize(adjustFontSize(value, 2))}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="h-full overflow-y-auto">
      <Tabs defaultValue="sections" className="w-full h-full flex flex-col">
        <div className="sticky top-0 z-10 bg-background p-4 pb-2 border-b">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="sections">Seções</TabsTrigger>
            <TabsTrigger value="elements">Elementos</TabsTrigger>
            <TabsTrigger value="images">Imagens</TabsTrigger>
            <TabsTrigger value="texts">Textos</TabsTrigger>
            <TabsTrigger value="sizes">Tamanhos</TabsTrigger>
            <TabsTrigger value="colors">Cores</TabsTrigger>
            <TabsTrigger value="buttons">Botões</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pt-2">
          <TabsContent value="sections" className="space-y-4 mt-0">
            <FloatingHeaderEditor
              header={data.floatingHeader}
              onChange={(floatingHeader) => onChange({ ...data, floatingHeader })}
            />
            <SectionEditor
              sections={data.sections}
              onUpdateSections={(sections) => onChange({ ...data, sections })}
            />
          </TabsContent>

          <TabsContent value="elements" className="space-y-4 mt-0">
            <div className="sticky top-0 z-10 bg-background py-3 -mx-4 px-4 border-b">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => addElement('title')} size="sm" className="gradient-vibrant text-white">
                  <Plus className="w-4 h-4 mr-1" /> Título
                </Button>
                <Button onClick={() => addElement('subtitle')} size="sm" className="gradient-vibrant text-white">
                  <Plus className="w-4 h-4 mr-1" /> Subtítulo
                </Button>
                <Button onClick={() => addElement('paragraph')} size="sm" className="gradient-vibrant text-white">
                  <Plus className="w-4 h-4 mr-1" /> Parágrafo
                </Button>
                <Button onClick={() => addElement('image')} size="sm" className="gradient-vibrant text-white">
                  <Plus className="w-4 h-4 mr-1" /> Imagem
                </Button>
                <Button onClick={() => addElement('cta')} size="sm" className="gradient-vibrant text-white">
                  <Plus className="w-4 h-4 mr-1" /> Botão CTA
                </Button>
                <Button onClick={() => addElement('video')} size="sm" className="gradient-vibrant text-white">
                  <Video className="w-4 h-4 mr-1" /> Vídeo
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Arraste os elementos no preview para reordená-los. Arraste até a lixeira para excluir.
            </p>

            {data.elements.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Nenhum elemento adicionado</p>
                <p className="text-sm text-muted-foreground mt-2">Clique nos botões acima para adicionar elementos</p>
              </Card>
            )}

            {data.elements.map((element) => (
              <Card key={element.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="capitalize font-semibold">{element.type === 'cta' ? 'Botão CTA' : element.type}</Label>
                  <Button
                    onClick={() => removeElement(element.id)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {element.type === 'video' ? (
                  <div className="space-y-3">
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
                              updateElement(element.id, { videoUrl: event.target?.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="mt-1"
                      />
                      {element.videoUrl && (
                        <video src={element.videoUrl} className="mt-2 h-20 w-32 object-cover rounded" controls={false} muted />
                      )}
                    </div>
                    <div>
                      <Label className="text-xs">Tamanho do Vídeo: {element.mediaWidth || 100}%</Label>
                      <Slider
                        value={[element.mediaWidth || 100]}
                        onValueChange={(value) => updateElement(element.id, { mediaWidth: value[0] })}
                        min={20}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                  </div>
                ) : element.type === 'image' ? (
                  <div className="space-y-3">
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
                              updateElement(element.id, { imageUrl: event.target?.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="mt-1"
                      />
                      {element.imageUrl && (
                        <img src={element.imageUrl} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
                      )}
                    </div>
                    <div>
                      <Label className="text-xs">Tamanho da Imagem: {element.mediaWidth || 100}%</Label>
                      <Slider
                        value={[element.mediaWidth || 100]}
                        onValueChange={(value) => updateElement(element.id, { mediaWidth: value[0] })}
                        min={20}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                  </div>
                ) : element.type === 'cta' ? (
                  <>
                    <Textarea
                      value={element.content}
                      onChange={(e) => updateElement(element.id, { content: e.target.value })}
                      rows={2}
                    />
                    <div>
                      <Label className="text-xs">Link (opcional)</Label>
                      <Input
                        value={element.link || ''}
                        onChange={(e) => updateElement(element.id, { link: e.target.value })}
                        placeholder="https:// (usa link global se vazio)"
                        className="mt-1"
                      />
                    </div>
                    
                    {/* Button color settings */}
                    <div className="space-y-3 pt-2 border-t">
                      <Label className="text-xs font-semibold">Cor do Botão</Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={element.buttonGradient?.enabled || false}
                          onCheckedChange={(checked) => updateElement(element.id, {
                            buttonGradient: { ...element.buttonGradient!, enabled: checked }
                          })}
                        />
                        <Label className="text-xs">Usar Gradiente</Label>
                      </div>
                      {element.buttonGradient?.enabled ? (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Cor 1</Label>
                            <div className="flex gap-1 mt-1">
                              <Input
                                type="color"
                                value={element.buttonGradient.color1}
                                onChange={(e) => updateElement(element.id, {
                                  buttonGradient: { ...element.buttonGradient!, color1: e.target.value }
                                })}
                                className="h-8 w-10"
                              />
                              <Input
                                value={element.buttonGradient.color1}
                                onChange={(e) => updateElement(element.id, {
                                  buttonGradient: { ...element.buttonGradient!, color1: e.target.value }
                                })}
                                className="flex-1 text-xs"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Cor 2</Label>
                            <div className="flex gap-1 mt-1">
                              <Input
                                type="color"
                                value={element.buttonGradient.color2}
                                onChange={(e) => updateElement(element.id, {
                                  buttonGradient: { ...element.buttonGradient!, color2: e.target.value }
                                })}
                                className="h-8 w-10"
                              />
                              <Input
                                value={element.buttonGradient.color2}
                                onChange={(e) => updateElement(element.id, {
                                  buttonGradient: { ...element.buttonGradient!, color2: e.target.value }
                                })}
                                className="flex-1 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={element.buttonColor || '#FF6A00'}
                            onChange={(e) => updateElement(element.id, { buttonColor: e.target.value })}
                            className="h-8 w-12"
                          />
                          <Input
                            value={element.buttonColor || '#FF6A00'}
                            onChange={(e) => updateElement(element.id, { buttonColor: e.target.value })}
                            placeholder="#FF6A00"
                            className="flex-1"
                          />
                        </div>
                      )}
                      
                      <div>
                        <Label className="text-xs">Cor do Texto do Botão</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={element.buttonTextColor || '#ffffff'}
                            onChange={(e) => updateElement(element.id, { buttonTextColor: e.target.value })}
                            className="h-8 w-12"
                          />
                          <Input
                            value={element.buttonTextColor || '#ffffff'}
                            onChange={(e) => updateElement(element.id, { buttonTextColor: e.target.value })}
                            placeholder="#ffffff"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Textarea
                    value={element.content}
                    onChange={(e) => updateElement(element.id, { content: e.target.value })}
                    rows={2}
                  />
                )}

                {element.type !== 'image' && element.type !== 'cta' && element.type !== 'video' && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Tamanho</Label>
                        <div className="flex items-center gap-1 mt-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateElement(element.id, { fontSize: adjustFontSize(element.fontSize || '16px', -2) })}
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                          <Input
                            value={element.fontSize}
                            onChange={(e) => updateElement(element.id, { fontSize: e.target.value })}
                            placeholder="16px"
                            className="text-center"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateElement(element.id, { fontSize: adjustFontSize(element.fontSize || '16px', 2) })}
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Cor (sólida)</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={element.color}
                            onChange={(e) => updateElement(element.id, { color: e.target.value })}
                            className="h-10 w-14"
                          />
                          <Input
                            value={element.color}
                            onChange={(e) => updateElement(element.id, { color: e.target.value })}
                            placeholder="#ffffff"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Gradient colors for element */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={element.gradientColors?.enabled || false}
                          onCheckedChange={(checked) => updateElement(element.id, {
                            gradientColors: { ...element.gradientColors!, enabled: checked }
                          })}
                        />
                        <Label className="text-xs">Usar Gradiente (3 tons)</Label>
                      </div>
                      {element.gradientColors?.enabled && (
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs">Cor 1</Label>
                            <Input
                              type="color"
                              value={element.gradientColors.color1}
                              onChange={(e) => updateElement(element.id, {
                                gradientColors: { ...element.gradientColors!, color1: e.target.value }
                              })}
                              className="h-10"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Cor 2</Label>
                            <Input
                              type="color"
                              value={element.gradientColors.color2}
                              onChange={(e) => updateElement(element.id, {
                                gradientColors: { ...element.gradientColors!, color2: e.target.value }
                              })}
                              className="h-10"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Cor 3</Label>
                            <Input
                              type="color"
                              value={element.gradientColors.color3}
                              onChange={(e) => updateElement(element.id, {
                                gradientColors: { ...element.gradientColors!, color3: e.target.value }
                              })}
                              className="h-10"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="images" className="space-y-4 mt-0">
            <Card className="p-4">
              <Label>Logo do Produto</Label>
              <div className="mt-2 flex items-center gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload('logoImage', e.target.files[0])}
                  className="flex-1"
                />
                {data.logoImage && (
                  <img src={data.logoImage} alt="Logo" className="h-12 w-12 object-cover rounded" />
                )}
              </div>
            </Card>

            <Card className="p-4">
              <Label>Favicon</Label>
              <div className="mt-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload('favicon', e.target.files[0])}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="texts" className="space-y-4 mt-0">
            <Card className="p-4">
              <Label>Título da Aba (Browser)</Label>
              <Input
                value={data.pageTitle}
                onChange={(e) => onChange({ ...data, pageTitle: e.target.value })}
                className="mt-2"
                placeholder="Título que aparece na aba do navegador"
              />
            </Card>

            <Card className="p-4">
              <Label>Link de Afiliado</Label>
              <Input
                value={data.affiliateLink}
                onChange={(e) => onChange({ ...data, affiliateLink: e.target.value })}
                className="mt-2"
                placeholder="https://"
              />
            </Card>

            <Card className="p-4">
              <Label>Link de Termos</Label>
              <Input
                value={data.termsLink}
                onChange={(e) => onChange({ ...data, termsLink: e.target.value })}
                className="mt-2"
                placeholder="https://"
              />
            </Card>

            <Card className="p-4">
              <Label>Link de Privacidade</Label>
              <Input
                value={data.privacyLink}
                onChange={(e) => onChange({ ...data, privacyLink: e.target.value })}
                className="mt-2"
                placeholder="https://"
              />
            </Card>

            <Card className="p-4">
              <Label>Link Global de Afiliado para Imagens</Label>
              <Input
                value={data.globalImageAffiliateLink}
                onChange={(e) => onChange({ ...data, globalImageAffiliateLink: e.target.value })}
                className="mt-2"
                placeholder="https://"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Aplicado a todas as imagens
              </p>
            </Card>

            <Card className="p-4">
              <Label>Link Global de Afiliado para CTAs</Label>
              <Input
                value={data.globalCtaAffiliateLink}
                onChange={(e) => onChange({ ...data, globalCtaAffiliateLink: e.target.value })}
                className="mt-2"
                placeholder="https://"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Aplicado a todos os botões CTA
              </p>
            </Card>

            <Card className="p-4">
              <Label>Fonte dos Títulos</Label>
              <Select 
                value={data.fonts.title} 
                onValueChange={(value) => onChange({ ...data, fonts: { ...data.fonts, title: value } })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableFonts.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            <Card className="p-4">
              <Label>Fonte do Corpo</Label>
              <Select 
                value={data.fonts.body} 
                onValueChange={(value) => onChange({ ...data, fonts: { ...data.fonts, body: value } })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableFonts.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>
          </TabsContent>

          <TabsContent value="sizes" className="space-y-4 mt-0">
            <FontSizeControl
              label="Tamanho do Título Principal"
              value={data.fontSizes.mainTitle}
              onChange={(value) => onChange({ ...data, fontSizes: { ...data.fontSizes, mainTitle: value } })}
            />

            <FontSizeControl
              label="Tamanho do Subtítulo"
              value={data.fontSizes.subtitle}
              onChange={(value) => onChange({ ...data, fontSizes: { ...data.fontSizes, subtitle: value } })}
            />

            <FontSizeControl
              label="Tamanho da Descrição"
              value={data.fontSizes.description}
              onChange={(value) => onChange({ ...data, fontSizes: { ...data.fontSizes, description: value } })}
            />

            <FontSizeControl
              label="Tamanho do Botão CTA"
              value={data.fontSizes.ctaButton}
              onChange={(value) => onChange({ ...data, fontSizes: { ...data.fontSizes, ctaButton: value } })}
            />
          </TabsContent>

          <TabsContent value="colors" className="space-y-4 mt-0">
            {/* Background - Option 1: Solid Color */}
            <Card className="p-4 space-y-3">
              <Label className="font-semibold">Cor de Fundo 1 (Cor Única)</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={data.colors.background}
                  onChange={(e) => onChange({ 
                    ...data, 
                    colors: { 
                      ...data.colors, 
                      background: e.target.value,
                      backgroundGradient: { ...data.colors.backgroundGradient, enabled: false },
                      backgroundGradient3: { ...data.colors.backgroundGradient3, enabled: false },
                      backgroundGradient4: { ...data.colors.backgroundGradient4, enabled: false },
                    } 
                  })}
                  className="h-12 w-16"
                />
                <Input
                  value={data.colors.background}
                  onChange={(e) => onChange({ 
                    ...data, 
                    colors: { 
                      ...data.colors, 
                      background: e.target.value,
                      backgroundGradient: { ...data.colors.backgroundGradient, enabled: false },
                      backgroundGradient3: { ...data.colors.backgroundGradient3, enabled: false },
                      backgroundGradient4: { ...data.colors.backgroundGradient4, enabled: false },
                    } 
                  })}
                  placeholder="#0f0f0f"
                  className="flex-1"
                />
              </div>
            </Card>

            {/* Background - Option 2: 2-tone Gradient */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Cor de Fundo 2 (Gradiente 2 Tons)</Label>
                <Switch
                  checked={data.colors.backgroundGradient.enabled && !data.colors.backgroundGradient3?.enabled && !data.colors.backgroundGradient4?.enabled}
                  onCheckedChange={(checked) => onChange({
                    ...data,
                    colors: {
                      ...data.colors,
                      backgroundGradient: { ...data.colors.backgroundGradient, enabled: checked },
                      backgroundGradient3: { ...data.colors.backgroundGradient3, enabled: false },
                      backgroundGradient4: { ...data.colors.backgroundGradient4, enabled: false },
                    }
                  })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Cor 1</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={data.colors.backgroundGradient.color1}
                      onChange={(e) => onChange({
                        ...data,
                        colors: {
                          ...data.colors,
                          backgroundGradient: { ...data.colors.backgroundGradient, color1: e.target.value, enabled: true },
                          backgroundGradient3: { ...data.colors.backgroundGradient3, enabled: false },
                          backgroundGradient4: { ...data.colors.backgroundGradient4, enabled: false },
                        }
                      })}
                      className="h-10 w-14"
                    />
                    <Input
                      value={data.colors.backgroundGradient.color1}
                      onChange={(e) => onChange({
                        ...data,
                        colors: {
                          ...data.colors,
                          backgroundGradient: { ...data.colors.backgroundGradient, color1: e.target.value, enabled: true },
                          backgroundGradient3: { ...data.colors.backgroundGradient3, enabled: false },
                          backgroundGradient4: { ...data.colors.backgroundGradient4, enabled: false },
                        }
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Cor 2</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={data.colors.backgroundGradient.color2}
                      onChange={(e) => onChange({
                        ...data,
                        colors: {
                          ...data.colors,
                          backgroundGradient: { ...data.colors.backgroundGradient, color2: e.target.value, enabled: true },
                          backgroundGradient3: { ...data.colors.backgroundGradient3, enabled: false },
                          backgroundGradient4: { ...data.colors.backgroundGradient4, enabled: false },
                        }
                      })}
                      className="h-10 w-14"
                    />
                    <Input
                      value={data.colors.backgroundGradient.color2}
                      onChange={(e) => onChange({
                        ...data,
                        colors: {
                          ...data.colors,
                          backgroundGradient: { ...data.colors.backgroundGradient, color2: e.target.value, enabled: true },
                          backgroundGradient3: { ...data.colors.backgroundGradient3, enabled: false },
                          backgroundGradient4: { ...data.colors.backgroundGradient4, enabled: false },
                        }
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Background - Option 3: 3-tone Gradient */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Cor de Fundo 3 (Gradiente 3 Tons)</Label>
                <Switch
                  checked={data.colors.backgroundGradient3?.enabled || false}
                  onCheckedChange={(checked) => onChange({
                    ...data,
                    colors: {
                      ...data.colors,
                      backgroundGradient: { ...data.colors.backgroundGradient, enabled: false },
                      backgroundGradient3: { ...data.colors.backgroundGradient3, enabled: checked },
                      backgroundGradient4: { ...data.colors.backgroundGradient4, enabled: false },
                    }
                  })}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">Cor 1</Label>
                  <Input
                    type="color"
                    value={data.colors.backgroundGradient3?.color1 || '#0f0f0f'}
                    onChange={(e) => onChange({
                      ...data,
                      colors: {
                        ...data.colors,
                        backgroundGradient: { ...data.colors.backgroundGradient, enabled: false },
                        backgroundGradient3: { ...data.colors.backgroundGradient3, color1: e.target.value, enabled: true },
                        backgroundGradient4: { ...data.colors.backgroundGradient4, enabled: false },
                      }
                    })}
                    className="h-10 w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs">Cor 2</Label>
                  <Input
                    type="color"
                    value={data.colors.backgroundGradient3?.color2 || '#1a1a2e'}
                    onChange={(e) => onChange({
                      ...data,
                      colors: {
                        ...data.colors,
                        backgroundGradient: { ...data.colors.backgroundGradient, enabled: false },
                        backgroundGradient3: { ...data.colors.backgroundGradient3, color2: e.target.value, enabled: true },
                        backgroundGradient4: { ...data.colors.backgroundGradient4, enabled: false },
                      }
                    })}
                    className="h-10 w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs">Cor 3</Label>
                  <Input
                    type="color"
                    value={data.colors.backgroundGradient3?.color3 || '#16213e'}
                    onChange={(e) => onChange({
                      ...data,
                      colors: {
                        ...data.colors,
                        backgroundGradient: { ...data.colors.backgroundGradient, enabled: false },
                        backgroundGradient3: { ...data.colors.backgroundGradient3, color3: e.target.value, enabled: true },
                        backgroundGradient4: { ...data.colors.backgroundGradient4, enabled: false },
                      }
                    })}
                    className="h-10 w-full"
                  />
                </div>
              </div>
            </Card>

            {/* Background - Option 4: 4-tone Gradient */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Cor de Fundo 4 (Gradiente 4 Tons)</Label>
                <Switch
                  checked={data.colors.backgroundGradient4?.enabled || false}
                  onCheckedChange={(checked) => onChange({
                    ...data,
                    colors: {
                      ...data.colors,
                      backgroundGradient: { ...data.colors.backgroundGradient, enabled: false },
                      backgroundGradient3: { ...data.colors.backgroundGradient3, enabled: false },
                      backgroundGradient4: { ...data.colors.backgroundGradient4, enabled: checked },
                    }
                  })}
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <Label className="text-xs">Cor 1</Label>
                  <Input
                    type="color"
                    value={data.colors.backgroundGradient4?.color1 || '#0f0f0f'}
                    onChange={(e) => onChange({
                      ...data,
                      colors: {
                        ...data.colors,
                        backgroundGradient: { ...data.colors.backgroundGradient, enabled: false },
                        backgroundGradient3: { ...data.colors.backgroundGradient3, enabled: false },
                        backgroundGradient4: { ...data.colors.backgroundGradient4, color1: e.target.value, enabled: true },
                      }
                    })}
                    className="h-10 w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs">Cor 2</Label>
                  <Input
                    type="color"
                    value={data.colors.backgroundGradient4?.color2 || '#1a1a2e'}
                    onChange={(e) => onChange({
                      ...data,
                      colors: {
                        ...data.colors,
                        backgroundGradient: { ...data.colors.backgroundGradient, enabled: false },
                        backgroundGradient3: { ...data.colors.backgroundGradient3, enabled: false },
                        backgroundGradient4: { ...data.colors.backgroundGradient4, color2: e.target.value, enabled: true },
                      }
                    })}
                    className="h-10 w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs">Cor 3</Label>
                  <Input
                    type="color"
                    value={data.colors.backgroundGradient4?.color3 || '#16213e'}
                    onChange={(e) => onChange({
                      ...data,
                      colors: {
                        ...data.colors,
                        backgroundGradient: { ...data.colors.backgroundGradient, enabled: false },
                        backgroundGradient3: { ...data.colors.backgroundGradient3, enabled: false },
                        backgroundGradient4: { ...data.colors.backgroundGradient4, color3: e.target.value, enabled: true },
                      }
                    })}
                    className="h-10 w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs">Cor 4</Label>
                  <Input
                    type="color"
                    value={data.colors.backgroundGradient4?.color4 || '#0f3460'}
                    onChange={(e) => onChange({
                      ...data,
                      colors: {
                        ...data.colors,
                        backgroundGradient: { ...data.colors.backgroundGradient, enabled: false },
                        backgroundGradient3: { ...data.colors.backgroundGradient3, enabled: false },
                        backgroundGradient4: { ...data.colors.backgroundGradient4, color4: e.target.value, enabled: true },
                      }
                    })}
                    className="h-10 w-full"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="buttons" className="space-y-4 mt-0">
            <Card className="p-4 space-y-4">
              <Label className="font-semibold">Estilo das Bordas</Label>
              <Select 
                value={data.buttonStyle.borderRadius} 
                onValueChange={(value: 'square' | 'rounded' | 'pill') => onChange({
                  ...data,
                  buttonStyle: { ...data.buttonStyle, borderRadius: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Quadradas</SelectItem>
                  <SelectItem value="rounded">Arredondadas</SelectItem>
                  <SelectItem value="pill">Pílula (Muito Arredondado)</SelectItem>
                </SelectContent>
              </Select>
            </Card>

            <Card className="p-4 space-y-4">
              <Label className="font-semibold">Efeitos do Botão</Label>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">Sombra</Label>
                <Switch
                  checked={data.buttonStyle.shadow}
                  onCheckedChange={(checked) => onChange({
                    ...data,
                    buttonStyle: { ...data.buttonStyle, shadow: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">Brilho Neon</Label>
                <Switch
                  checked={data.buttonStyle.neonGlow}
                  onCheckedChange={(checked) => onChange({
                    ...data,
                    buttonStyle: { ...data.buttonStyle, neonGlow: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">Efeito ao Passar o Mouse</Label>
                <Switch
                  checked={data.buttonStyle.hoverEffect}
                  onCheckedChange={(checked) => onChange({
                    ...data,
                    buttonStyle: { ...data.buttonStyle, hoverEffect: checked }
                  })}
                />
              </div>
            </Card>

            <Card className="p-4 space-y-4">
              <Label className="font-semibold">Botão WhatsApp Flutuante</Label>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">Ativar Botão WhatsApp</Label>
                <Switch
                  checked={data.whatsappEnabled}
                  onCheckedChange={(checked) => onChange({
                    ...data,
                    whatsappEnabled: checked
                  })}
                />
              </div>

              {data.whatsappEnabled && (
                <div>
                  <Label className="text-xs">Link do WhatsApp (wa.me)</Label>
                  <Input
                    value={data.whatsappLink}
                    onChange={(e) => onChange({ ...data, whatsappLink: e.target.value })}
                    placeholder="https://wa.me/5511999999999"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Ex: https://wa.me/5511999999999?text=Olá
                  </p>
                </div>
              )}
            </Card>

            <Card className="p-4 space-y-4">
              <Label className="font-semibold">IP Tracking</Label>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">Ativar IP Tracking</Label>
                <Switch
                  checked={data.ipTracking?.enabled || false}
                  onCheckedChange={(checked) => onChange({
                    ...data,
                    ipTracking: { ...data.ipTracking, enabled: checked }
                  })}
                />
              </div>

              {data.ipTracking?.enabled && (
                <div>
                  <Label className="text-xs">URL do pixel IPLogger.org</Label>
                  <Input
                    value={data.ipTracking?.url || ''}
                    onChange={(e) => {
                      const url = e.target.value;
                      // Validate URL starts with http or https
                      onChange({ 
                        ...data, 
                        ipTracking: { ...data.ipTracking, url } 
                      });
                    }}
                    placeholder="https://iplogger.org/xxxxxx"
                    className="mt-1"
                  />
                  {data.ipTracking?.url && !data.ipTracking.url.match(/^https?:\/\//) && (
                    <p className="text-xs text-destructive mt-1">
                      A URL deve começar com http:// ou https://
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Cole a URL de rastreamento gerada pelo IPLogger.org
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
