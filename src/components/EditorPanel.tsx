import { PresellData, PresellElement, availableFonts } from '@/types/presell';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Upload, Trash2 } from 'lucide-react';
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
      content: type === 'cta' ? 'Clique Aqui' : 'Novo conteúdo',
      fontSize: '16px',
      fontFamily: data.fonts.body,
      color: data.colors.text,
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
      <Tabs defaultValue="images" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="images">Imagens</TabsTrigger>
          <TabsTrigger value="texts">Textos</TabsTrigger>
          <TabsTrigger value="sizes">Tamanhos</TabsTrigger>
          <TabsTrigger value="colors">Cores</TabsTrigger>
          <TabsTrigger value="elements">Elementos</TabsTrigger>
        </TabsList>

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
            <Label>Título Principal</Label>
            <Input
              value={data.mainTitle}
              onChange={(e) => onChange({ ...data, mainTitle: e.target.value })}
              className="mt-2"
            />
          </Card>

          <Card className="p-4">
            <Label>Subtítulo</Label>
            <Input
              value={data.subtitle}
              onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
              className="mt-2"
            />
          </Card>

          <Card className="p-4">
            <Label>Descrição</Label>
            <Textarea
              value={data.description}
              onChange={(e) => onChange({ ...data, description: e.target.value })}
              className="mt-2"
              rows={4}
            />
          </Card>

          <Card className="p-4">
            <Label>Texto do Botão CTA</Label>
            <Input
              value={data.ctaText}
              onChange={(e) => onChange({ ...data, ctaText: e.target.value })}
              className="mt-2"
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
          <Card className="p-4">
            <Label>Cor de Fundo</Label>
            <Input
              type="color"
              value={data.colors.background}
              onChange={(e) => onChange({ ...data, colors: { ...data.colors, background: e.target.value } })}
              className="mt-2 h-12"
            />
          </Card>

          <Card className="p-4">
            <Label>Cor do Texto</Label>
            <Input
              type="color"
              value={data.colors.text}
              onChange={(e) => onChange({ ...data, colors: { ...data.colors, text: e.target.value } })}
              className="mt-2 h-12"
            />
          </Card>

          <Card className="p-4">
            <Label>Cor do Botão</Label>
            <Input
              type="color"
              value={data.colors.button}
              onChange={(e) => onChange({ ...data, colors: { ...data.colors, button: e.target.value } })}
              className="mt-2 h-12"
            />
          </Card>

          <Card className="p-4">
            <Label>Cor do Texto do Botão</Label>
            <Input
              type="color"
              value={data.colors.buttonText}
              onChange={(e) => onChange({ ...data, colors: { ...data.colors, buttonText: e.target.value } })}
              className="mt-2 h-12"
            />
          </Card>

          <Card className="p-4">
            <Label>Cor de Destaque</Label>
            <Input
              type="color"
              value={data.colors.accent}
              onChange={(e) => onChange({ ...data, colors: { ...data.colors, accent: e.target.value } })}
              className="mt-2 h-12"
            />
          </Card>
        </TabsContent>

        <TabsContent value="elements" className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button onClick={() => addElement('title')} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" /> Título
            </Button>
            <Button onClick={() => addElement('subtitle')} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" /> Subtítulo
            </Button>
            <Button onClick={() => addElement('paragraph')} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" /> Parágrafo
            </Button>
            <Button onClick={() => addElement('image')} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" /> Imagem
            </Button>
            <Button onClick={() => addElement('cta')} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" /> Botão CTA
            </Button>
          </div>

          {data.elements.map((element) => (
            <Card key={element.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="capitalize">{element.type}</Label>
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

              <div className="grid grid-cols-2 gap-2">
                {element.type !== 'image' && (
                  <div>
                    <Label className="text-xs">Tamanho</Label>
                    <Input
                      value={element.fontSize}
                      onChange={(e) => updateElement(element.id, { fontSize: e.target.value })}
                      placeholder="16px"
                      className="mt-1"
                    />
                  </div>
                )}
                <div>
                  <Label className="text-xs">Cor</Label>
                  <Input
                    type="color"
                    value={element.color}
                    onChange={(e) => updateElement(element.id, { color: e.target.value })}
                    className="mt-1 h-10"
                  />
                </div>
              </div>

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
      </Tabs>
    </div>
  );
};
