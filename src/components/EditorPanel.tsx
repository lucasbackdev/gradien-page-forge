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
    <div className="h-full overflow-y-auto bg-card">
      <Tabs defaultValue="sections" className="w-full h-full flex flex-col">
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm px-3 py-2 border-b">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="sections" className="text-xs py-1">Criar Site</TabsTrigger>
            <TabsTrigger value="links" className="text-xs py-1">Links</TabsTrigger>
            <TabsTrigger value="buttons" className="text-xs py-1">Botões</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <TabsContent value="sections" className="space-y-3 mt-0">
            <Card className="p-3">
              <Label className="text-xs font-medium">Título da Aba</Label>
              <Input
                value={data.pageTitle}
                onChange={(e) => onChange({ ...data, pageTitle: e.target.value })}
                className="mt-1.5 h-8 text-sm"
                placeholder="Título do navegador"
              />
            </Card>

            <Card className="p-3">
              <Label className="text-xs font-medium">Favicon</Label>
              <div className="mt-1.5 flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload('favicon', e.target.files[0])}
                  className="flex-1 h-8 text-xs"
                />
                {data.favicon && (
                  <img src={data.favicon} alt="Favicon" className="h-6 w-6 object-cover rounded" />
                )}
              </div>
            </Card>

            <Card className="p-3">
              <Label className="text-xs font-medium">Fonte dos Títulos</Label>
              <Select 
                value={data.fonts.title} 
                onValueChange={(value) => onChange({ ...data, fonts: { ...data.fonts, title: value } })}
              >
                <SelectTrigger className="mt-1.5 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableFonts.map((font) => (
                    <SelectItem key={font.value} value={font.value} className="text-sm">
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            <Card className="p-3">
              <Label className="text-xs font-medium">Fonte do Corpo</Label>
              <Select 
                value={data.fonts.body} 
                onValueChange={(value) => onChange({ ...data, fonts: { ...data.fonts, body: value } })}
              >
                <SelectTrigger className="mt-1.5 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableFonts.map((font) => (
                    <SelectItem key={font.value} value={font.value} className="text-sm">
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            <FloatingHeaderEditor
              header={data.floatingHeader}
              onChange={(floatingHeader) => onChange({ ...data, floatingHeader })}
            />
            <SectionEditor
              sections={data.sections}
              onUpdateSections={(sections) => onChange({ ...data, sections })}
            />
          </TabsContent>

          <TabsContent value="links" className="space-y-3 mt-0">
            <Card className="p-3">
              <Label className="text-xs font-medium">Link de Afiliado</Label>
              <Input
                value={data.affiliateLink}
                onChange={(e) => onChange({ ...data, affiliateLink: e.target.value })}
                className="mt-1.5 h-8 text-sm"
                placeholder="https://"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Aplicado em todos os botões e imagens
              </p>
            </Card>

            <Card className="p-3">
              <Label className="text-xs font-medium">Link de Termos</Label>
              <Input
                value={data.termsLink}
                onChange={(e) => onChange({ ...data, termsLink: e.target.value })}
                className="mt-1.5 h-8 text-sm"
                placeholder="https://"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Aparece no rodapé
              </p>
            </Card>

            <Card className="p-3">
              <Label className="text-xs font-medium">Link de Privacidade</Label>
              <Input
                value={data.privacyLink}
                onChange={(e) => onChange({ ...data, privacyLink: e.target.value })}
                className="mt-1.5 h-8 text-sm"
                placeholder="https://"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Aparece no rodapé
              </p>
            </Card>

            <Card className="p-3 space-y-3">
              <Label className="text-xs font-semibold">Personalizar Rodapé</Label>
              
              <div>
                <Label className="text-[10px]">Cor de Fundo</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={data.footerStyle?.backgroundColor || '#0a0a0a'}
                    onChange={(e) => onChange({
                      ...data,
                      footerStyle: { ...data.footerStyle, backgroundColor: e.target.value }
                    })}
                    className="h-8 w-10"
                  />
                  <Input
                    value={data.footerStyle?.backgroundColor || '#0a0a0a'}
                    onChange={(e) => onChange({
                      ...data,
                      footerStyle: { ...data.footerStyle, backgroundColor: e.target.value }
                    })}
                    className="flex-1 h-8 text-sm"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[10px]">Cor do Texto</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={data.footerStyle?.textColor || '#888888'}
                    onChange={(e) => onChange({
                      ...data,
                      footerStyle: { ...data.footerStyle, textColor: e.target.value }
                    })}
                    className="h-8 w-10"
                  />
                  <Input
                    value={data.footerStyle?.textColor || '#888888'}
                    onChange={(e) => onChange({
                      ...data,
                      footerStyle: { ...data.footerStyle, textColor: e.target.value }
                    })}
                    className="flex-1 h-8 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Mostrar Links das Seções</Label>
                <Switch
                  checked={data.footerStyle?.showSections !== false}
                  onCheckedChange={(checked) => onChange({
                    ...data,
                    footerStyle: { ...data.footerStyle, showSections: checked }
                  })}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="buttons" className="space-y-3 mt-0">
            {/* Button Colors */}
            <Card className="p-3 space-y-3">
              <Label className="text-xs font-semibold">Cores dos Botões</Label>
              
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
                <Label className="text-xs">Usar Gradiente</Label>
              </div>

              {data.colors.buttonGradient.enabled ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px]">Cor 1</Label>
                    <div className="flex gap-1 mt-1">
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
                        className="h-8 w-10"
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
                        className="flex-1 h-8 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-[10px]">Cor 2</Label>
                    <div className="flex gap-1 mt-1">
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
                        className="h-8 w-10"
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
                        className="flex-1 h-8 text-xs"
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
                    className="h-8 w-10"
                  />
                  <Input
                    value={data.colors.button}
                    onChange={(e) => onChange({
                      ...data,
                      colors: { ...data.colors, button: e.target.value }
                    })}
                    placeholder="#FF6A00"
                    className="flex-1 h-8 text-sm"
                  />
                </div>
              )}

              <div>
                <Label className="text-[10px]">Cor do Texto</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={data.colors.buttonText}
                    onChange={(e) => onChange({
                      ...data,
                      colors: { ...data.colors, buttonText: e.target.value }
                    })}
                    className="h-8 w-10"
                  />
                  <Input
                    value={data.colors.buttonText}
                    onChange={(e) => onChange({
                      ...data,
                      colors: { ...data.colors, buttonText: e.target.value }
                    })}
                    placeholder="#ffffff"
                    className="flex-1 h-8 text-sm"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-3 space-y-2">
              <Label className="text-xs font-semibold">Estilo das Bordas</Label>
              <Select 
                value={data.buttonStyle.borderRadius} 
                onValueChange={(value: 'square' | 'rounded' | 'pill') => onChange({
                  ...data,
                  buttonStyle: { ...data.buttonStyle, borderRadius: value }
                })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square" className="text-sm">Quadradas</SelectItem>
                  <SelectItem value="rounded" className="text-sm">Arredondadas</SelectItem>
                  <SelectItem value="pill" className="text-sm">Pílula</SelectItem>
                </SelectContent>
              </Select>
            </Card>

            <Card className="p-3 space-y-2">
              <Label className="text-xs font-semibold">Efeitos do Botão</Label>
              
              <div className="flex items-center justify-between">
                <Label className="text-xs">Sombra</Label>
                <Switch
                  checked={data.buttonStyle.shadow}
                  onCheckedChange={(checked) => onChange({
                    ...data,
                    buttonStyle: { ...data.buttonStyle, shadow: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Brilho Neon</Label>
                <Switch
                  checked={data.buttonStyle.neonGlow}
                  onCheckedChange={(checked) => onChange({
                    ...data,
                    buttonStyle: { ...data.buttonStyle, neonGlow: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Efeito Hover</Label>
                <Switch
                  checked={data.buttonStyle.hoverEffect}
                  onCheckedChange={(checked) => onChange({
                    ...data,
                    buttonStyle: { ...data.buttonStyle, hoverEffect: checked }
                  })}
                />
              </div>
            </Card>

            <Card className="p-3 space-y-2">
              <Label className="text-xs font-semibold">WhatsApp Flutuante</Label>
              
              <div className="flex items-center justify-between">
                <Label className="text-xs">Ativar</Label>
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
                  <Label className="text-[10px]">Link WhatsApp</Label>
                  <Input
                    value={data.whatsappLink}
                    onChange={(e) => onChange({ ...data, whatsappLink: e.target.value })}
                    placeholder="https://wa.me/5511999999999"
                    className="mt-1 h-8 text-sm"
                  />
                </div>
              )}
            </Card>

            <Card className="p-3 space-y-2">
              <Label className="text-xs font-semibold">IP Tracking</Label>
              
              <div className="flex items-center justify-between">
                <Label className="text-xs">Ativar</Label>
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
                  <Label className="text-[10px]">URL do pixel</Label>
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
                    className="mt-1 h-8 text-sm"
                  />
                  {data.ipTracking?.url && !data.ipTracking.url.match(/^https?:\/\//) && (
                    <p className="text-[10px] text-destructive mt-1">
                      URL inválida
                    </p>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
