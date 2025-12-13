import { PresellData, PresellElement, availableFonts } from '@/types/presell';
import { PresellSection } from '@/types/sections';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ChevronUp, ChevronDown } from 'lucide-react';
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

  return (
    <div className="h-full overflow-y-auto">
      <Tabs defaultValue="sections" className="w-full h-full flex flex-col">
        <div className="sticky top-0 z-10 bg-background p-4 pb-2 border-b">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sections">Criar Site</TabsTrigger>
            <TabsTrigger value="images">Imagens</TabsTrigger>
            <TabsTrigger value="texts">Textos</TabsTrigger>
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

          <TabsContent value="buttons" className="space-y-4 mt-0">
            {/* Button Colors */}
            <Card className="p-4 space-y-4">
              <Label className="font-semibold">Cores dos Botões</Label>
              
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
                    onChange={(e) => onChange({
                      ...data,
                      colors: { ...data.colors, button: e.target.value }
                    })}
                    className="h-10 w-16"
                  />
                  <Input
                    value={data.colors.button}
                    onChange={(e) => onChange({
                      ...data,
                      colors: { ...data.colors, button: e.target.value }
                    })}
                    placeholder="#FF6A00"
                    className="flex-1"
                  />
                </div>
              )}

              <div>
                <Label className="text-xs">Cor do Texto dos Botões</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={data.colors.buttonText}
                    onChange={(e) => onChange({
                      ...data,
                      colors: { ...data.colors, buttonText: e.target.value }
                    })}
                    className="h-10 w-16"
                  />
                  <Input
                    value={data.colors.buttonText}
                    onChange={(e) => onChange({
                      ...data,
                      colors: { ...data.colors, buttonText: e.target.value }
                    })}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </Card>

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
