import { PresellData, PresellElement, availableFonts } from '@/types/presell';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EditorPanelProps {
  data: PresellData;
  onChange: (data: PresellData) => void;
}

export const EditorPanel = ({ data, onChange }: EditorPanelProps) => {
  const handleImageUpload = (field: 'logoImage' | 'mainImage' | 'favicon', file: File) => {
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
      content: type === 'cta' ? 'Clique Aqui' : type === 'title' ? 'Novo Título' : type === 'subtitle' ? 'Novo Subtítulo' : 'Novo parágrafo',
      fontSize: type === 'title' ? data.fontSizes.mainTitle : type === 'subtitle' ? data.fontSizes.subtitle : data.fontSizes.description,
      fontFamily: data.fonts.body,
      color: data.colors.text,
      gradientColors: {
        enabled: false,
        color1: '#ffffff',
        color2: '#a0a0a0',
        color3: '#606060',
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

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <Tabs defaultValue="elements" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="elements">Elementos</TabsTrigger>
          <TabsTrigger value="images">Imagens</TabsTrigger>
          <TabsTrigger value="texts">Textos</TabsTrigger>
          <TabsTrigger value="sizes">Tamanhos</TabsTrigger>
          <TabsTrigger value="colors">Cores</TabsTrigger>
          <TabsTrigger value="buttons">Botões</TabsTrigger>
        </TabsList>

        <TabsContent value="elements" className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
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
                <Label className="capitalize font-semibold">{element.type}</Label>
                <Button
                  onClick={() => removeElement(element.id)}
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {element.type === 'image' ? (
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
              ) : (
                <Textarea
                  value={element.content}
                  onChange={(e) => updateElement(element.id, { content: e.target.value })}
                  rows={2}
                />
              )}

              {element.type !== 'image' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Tamanho</Label>
                      <Input
                        value={element.fontSize}
                        onChange={(e) => updateElement(element.id, { fontSize: e.target.value })}
                        placeholder="16px"
                        className="mt-1"
                      />
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

              {element.type === 'cta' && (
                <div>
                  <Label className="text-xs">Link (opcional)</Label>
                  <Input
                    value={element.link || ''}
                    onChange={(e) => updateElement(element.id, { link: e.target.value })}
                    placeholder="https:// (usa link global se vazio)"
                    className="mt-1"
                  />
                </div>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
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
            <Label>Imagem Principal</Label>
            <div className="mt-2 flex items-center gap-3">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload('mainImage', e.target.files[0])}
                className="flex-1"
              />
              {data.mainImage && (
                <img src={data.mainImage} alt="Principal" className="h-12 w-12 object-cover rounded" />
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

        <TabsContent value="texts" className="space-y-4">
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
            <Label>Título Principal</Label>
            <Input
              value={data.mainTitle}
              onChange={(e) => onChange({ ...data, mainTitle: e.target.value })}
              className="mt-2"
              placeholder="Digite o título principal"
            />
          </Card>

          <Card className="p-4">
            <Label>Subtítulo</Label>
            <Input
              value={data.subtitle}
              onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
              className="mt-2"
              placeholder="Digite o subtítulo"
            />
          </Card>

          <Card className="p-4">
            <Label>Descrição</Label>
            <Textarea
              value={data.description}
              onChange={(e) => onChange({ ...data, description: e.target.value })}
              className="mt-2"
              rows={4}
              placeholder="Digite a descrição"
            />
          </Card>

          <Card className="p-4">
            <Label>Texto do Botão CTA</Label>
            <Input
              value={data.ctaText}
              onChange={(e) => onChange({ ...data, ctaText: e.target.value })}
              className="mt-2"
              placeholder="Digite o texto do botão"
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
            <Label>Detalhes do Lançamento</Label>
            <Input
              value={data.launchDetails}
              onChange={(e) => onChange({ ...data, launchDetails: e.target.value })}
              className="mt-2"
              placeholder="Ex: Lançamento exclusivo - Vagas limitadas!"
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

        <TabsContent value="sizes" className="space-y-4">
          <Card className="p-4">
            <Label>Tamanho do Título Principal</Label>
            <Input
              value={data.fontSizes.mainTitle}
              onChange={(e) => onChange({ ...data, fontSizes: { ...data.fontSizes, mainTitle: e.target.value } })}
              className="mt-2"
              placeholder="48px"
            />
          </Card>

          <Card className="p-4">
            <Label>Tamanho do Subtítulo</Label>
            <Input
              value={data.fontSizes.subtitle}
              onChange={(e) => onChange({ ...data, fontSizes: { ...data.fontSizes, subtitle: e.target.value } })}
              className="mt-2"
              placeholder="32px"
            />
          </Card>

          <Card className="p-4">
            <Label>Tamanho da Descrição</Label>
            <Input
              value={data.fontSizes.description}
              onChange={(e) => onChange({ ...data, fontSizes: { ...data.fontSizes, description: e.target.value } })}
              className="mt-2"
              placeholder="20px"
            />
          </Card>

          <Card className="p-4">
            <Label>Tamanho do Botão CTA</Label>
            <Input
              value={data.fontSizes.ctaButton}
              onChange={(e) => onChange({ ...data, fontSizes: { ...data.fontSizes, ctaButton: e.target.value } })}
              className="mt-2"
              placeholder="20px"
            />
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          {/* Background */}
          <Card className="p-4 space-y-3">
            <Label className="font-semibold">Cor de Fundo</Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={data.colors.backgroundGradient.enabled}
                onCheckedChange={(checked) => onChange({
                  ...data,
                  colors: {
                    ...data.colors,
                    backgroundGradient: { ...data.colors.backgroundGradient, enabled: checked }
                  }
                })}
              />
              <Label className="text-sm">Usar Gradiente</Label>
            </div>
            {data.colors.backgroundGradient.enabled ? (
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
                          backgroundGradient: { ...data.colors.backgroundGradient, color1: e.target.value }
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
                          backgroundGradient: { ...data.colors.backgroundGradient, color1: e.target.value }
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
                          backgroundGradient: { ...data.colors.backgroundGradient, color2: e.target.value }
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
                          backgroundGradient: { ...data.colors.backgroundGradient, color2: e.target.value }
                        }
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={data.colors.background}
                  onChange={(e) => onChange({ ...data, colors: { ...data.colors, background: e.target.value } })}
                  className="h-12 w-16"
                />
                <Input
                  value={data.colors.background}
                  onChange={(e) => onChange({ ...data, colors: { ...data.colors, background: e.target.value } })}
                  placeholder="#0f0f0f"
                  className="flex-1"
                />
              </div>
            )}
          </Card>

          {/* Text Color */}
          <Card className="p-4 space-y-3">
            <Label className="font-semibold">Cor do Texto</Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={data.colors.textGradient.enabled}
                onCheckedChange={(checked) => onChange({
                  ...data,
                  colors: {
                    ...data.colors,
                    textGradient: { ...data.colors.textGradient, enabled: checked }
                  }
                })}
              />
              <Label className="text-sm">Usar Gradiente (3 tons)</Label>
            </div>
            {data.colors.textGradient.enabled ? (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">Cor 1</Label>
                  <Input
                    type="color"
                    value={data.colors.textGradient.color1}
                    onChange={(e) => onChange({
                      ...data,
                      colors: {
                        ...data.colors,
                        textGradient: { ...data.colors.textGradient, color1: e.target.value }
                      }
                    })}
                    className="h-10"
                  />
                </div>
                <div>
                  <Label className="text-xs">Cor 2</Label>
                  <Input
                    type="color"
                    value={data.colors.textGradient.color2}
                    onChange={(e) => onChange({
                      ...data,
                      colors: {
                        ...data.colors,
                        textGradient: { ...data.colors.textGradient, color2: e.target.value }
                      }
                    })}
                    className="h-10"
                  />
                </div>
                <div>
                  <Label className="text-xs">Cor 3</Label>
                  <Input
                    type="color"
                    value={data.colors.textGradient.color3}
                    onChange={(e) => onChange({
                      ...data,
                      colors: {
                        ...data.colors,
                        textGradient: { ...data.colors.textGradient, color3: e.target.value }
                      }
                    })}
                    className="h-10"
                  />
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={data.colors.text}
                  onChange={(e) => onChange({ ...data, colors: { ...data.colors, text: e.target.value } })}
                  className="h-12 w-16"
                />
                <Input
                  value={data.colors.text}
                  onChange={(e) => onChange({ ...data, colors: { ...data.colors, text: e.target.value } })}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            )}
          </Card>

          {/* Button Color */}
          <Card className="p-4 space-y-3">
            <Label className="font-semibold">Cor do Botão</Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={data.colors.buttonGradient.enabled}
                onCheckedChange={(checked) => onChange({
                  ...data,
                  colors: {
                    ...data.colors,
                    buttonGradient: { ...data.colors.buttonGradient, enabled: checked }
                  }
                })}
              />
              <Label className="text-sm">Usar Gradiente</Label>
            </div>
            {data.colors.buttonGradient.enabled ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Cor 1</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={data.colors.buttonGradient.color1}
                      onChange={(e) => onChange({
                        ...data,
                        colors: {
                          ...data.colors,
                          buttonGradient: { ...data.colors.buttonGradient, color1: e.target.value }
                        }
                      })}
                      className="h-10 w-14"
                    />
                    <Input
                      value={data.colors.buttonGradient.color1}
                      onChange={(e) => onChange({
                        ...data,
                        colors: {
                          ...data.colors,
                          buttonGradient: { ...data.colors.buttonGradient, color1: e.target.value }
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
                      value={data.colors.buttonGradient.color2}
                      onChange={(e) => onChange({
                        ...data,
                        colors: {
                          ...data.colors,
                          buttonGradient: { ...data.colors.buttonGradient, color2: e.target.value }
                        }
                      })}
                      className="h-10 w-14"
                    />
                    <Input
                      value={data.colors.buttonGradient.color2}
                      onChange={(e) => onChange({
                        ...data,
                        colors: {
                          ...data.colors,
                          buttonGradient: { ...data.colors.buttonGradient, color2: e.target.value }
                        }
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={data.colors.button}
                  onChange={(e) => onChange({ ...data, colors: { ...data.colors, button: e.target.value } })}
                  className="h-12 w-16"
                />
                <Input
                  value={data.colors.button}
                  onChange={(e) => onChange({ ...data, colors: { ...data.colors, button: e.target.value } })}
                  placeholder="#FF6A00"
                  className="flex-1"
                />
              </div>
            )}
          </Card>

          <Card className="p-4">
            <Label>Cor do Texto do Botão</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="color"
                value={data.colors.buttonText}
                onChange={(e) => onChange({ ...data, colors: { ...data.colors, buttonText: e.target.value } })}
                className="h-12 w-16"
              />
              <Input
                value={data.colors.buttonText}
                onChange={(e) => onChange({ ...data, colors: { ...data.colors, buttonText: e.target.value } })}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </Card>

          <Card className="p-4">
            <Label>Cor de Destaque</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="color"
                value={data.colors.accent}
                onChange={(e) => onChange({ ...data, colors: { ...data.colors, accent: e.target.value } })}
                className="h-12 w-16"
              />
              <Input
                value={data.colors.accent}
                onChange={(e) => onChange({ ...data, colors: { ...data.colors, accent: e.target.value } })}
                placeholder="#FF2D55"
                className="flex-1"
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="buttons" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
