import { PresellData, PresellElement, availableFonts } from '@/types/presell';
import { PresellSection } from '@/types/sections';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Type,
  Image,
  PlayCircle,
  MousePointer2,
  Link2,
  Palette,
  Settings,
  Grid3X3,
  Layers,
  Menu,
} from 'lucide-react';
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
    <div className="h-full flex flex-col" style={{ backgroundColor: 'hsl(0 0% 12%)' }}>
      {/* Elementor-style Header */}
      <div 
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ 
          backgroundColor: 'hsl(0 0% 10%)',
          borderColor: 'hsl(0 0% 20%)'
        }}
      >
        <Menu className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
        <span className="text-sm font-semibold text-white tracking-wide">editor</span>
        <Grid3X3 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
      </div>

      <Tabs defaultValue="elements" className="flex-1 flex flex-col overflow-hidden">
        {/* Elementor-style Tabs */}
        <div 
          className="border-b"
          style={{ 
            backgroundColor: 'hsl(0 0% 12%)',
            borderColor: 'hsl(0 0% 20%)'
          }}
        >
          <TabsList className="w-full h-10 bg-transparent rounded-none p-0 grid grid-cols-3">
            <TabsTrigger 
              value="elements" 
              className="h-full rounded-none border-b-2 border-transparent text-xs text-gray-400 data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent"
            >
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              Elementos
            </TabsTrigger>
            <TabsTrigger 
              value="links" 
              className="h-full rounded-none border-b-2 border-transparent text-xs text-gray-400 data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent"
            >
              <Link2 className="w-3.5 h-3.5 mr-1.5" />
              Links
            </TabsTrigger>
            <TabsTrigger 
              value="style" 
              className="h-full rounded-none border-b-2 border-transparent text-xs text-gray-400 data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent"
            >
              <Palette className="w-3.5 h-3.5 mr-1.5" />
              Estilo
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Elements Tab - Widget Grid Style */}
          <TabsContent value="elements" className="mt-0 h-full">
            <div className="p-3 space-y-4">
              {/* Basic Settings Accordion */}
              <div className="space-y-3">
                <div 
                  className="flex items-center gap-2 py-2 text-xs font-medium text-gray-300 border-b"
                  style={{ borderColor: 'hsl(0 0% 20%)' }}
                >
                  <Settings className="w-3.5 h-3.5" />
                  Configurações Básicas
                </div>

                {/* Page Title */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-gray-400 uppercase tracking-wide">Título da Aba</Label>
                  <Input
                    value={data.pageTitle}
                    onChange={(e) => onChange({ ...data, pageTitle: e.target.value })}
                    className="h-8 text-xs bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)] text-white placeholder:text-gray-500"
                    placeholder="Título do navegador"
                  />
                </div>

                {/* Favicon */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-gray-400 uppercase tracking-wide">Favicon</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload('favicon', e.target.files[0])}
                      className="flex-1 h-8 text-xs bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)] text-white file:text-gray-400 file:text-xs"
                    />
                    {data.favicon && (
                      <img src={data.favicon} alt="Favicon" className="h-6 w-6 object-cover rounded" />
                    )}
                  </div>
                </div>

                {/* Fonts */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-gray-400 uppercase tracking-wide">Fonte Títulos</Label>
                    <Select 
                      value={data.fonts.title} 
                      onValueChange={(value) => onChange({ ...data, fonts: { ...data.fonts, title: value } })}
                    >
                      <SelectTrigger className="h-8 text-xs bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(0_0%_15%)] border-[hsl(0_0%_25%)]">
                        {availableFonts.map((font) => (
                          <SelectItem key={font.value} value={font.value} className="text-xs text-white">
                            {font.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-gray-400 uppercase tracking-wide">Fonte Corpo</Label>
                    <Select 
                      value={data.fonts.body} 
                      onValueChange={(value) => onChange({ ...data, fonts: { ...data.fonts, body: value } })}
                    >
                      <SelectTrigger className="h-8 text-xs bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(0_0%_15%)] border-[hsl(0_0%_25%)]">
                        {availableFonts.map((font) => (
                          <SelectItem key={font.value} value={font.value} className="text-xs text-white">
                            {font.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Header Editor */}
              <div className="space-y-3">
                <div 
                  className="flex items-center gap-2 py-2 text-xs font-medium text-gray-300 border-b"
                  style={{ borderColor: 'hsl(0 0% 20%)' }}
                >
                  <Menu className="w-3.5 h-3.5" />
                  Cabeçalho Flutuante
                </div>
                <FloatingHeaderEditor
                  header={data.floatingHeader}
                  onChange={(floatingHeader) => onChange({ ...data, floatingHeader })}
                />
              </div>

              {/* Sections Editor */}
              <div className="space-y-3">
                <div 
                  className="flex items-center gap-2 py-2 text-xs font-medium text-gray-300 border-b"
                  style={{ borderColor: 'hsl(0 0% 20%)' }}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Seções
                </div>
                <SectionEditor
                  sections={data.sections}
                  onUpdateSections={(sections) => onChange({ ...data, sections })}
                />
              </div>
            </div>
          </TabsContent>

          {/* Links Tab */}
          <TabsContent value="links" className="mt-0 h-full">
            <div className="p-3 space-y-4">
              <div 
                className="flex items-center gap-2 py-2 text-xs font-medium text-gray-300 border-b"
                style={{ borderColor: 'hsl(0 0% 20%)' }}
              >
                <Link2 className="w-3.5 h-3.5" />
                Links Principais
              </div>

              {/* Affiliate Link */}
              <div className="space-y-1.5">
                <Label className="text-[10px] text-gray-400 uppercase tracking-wide">Link de Afiliado</Label>
                <Input
                  value={data.affiliateLink}
                  onChange={(e) => onChange({ ...data, affiliateLink: e.target.value })}
                  className="h-8 text-xs bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)] text-white placeholder:text-gray-500"
                  placeholder="https://"
                />
                <p className="text-[9px] text-gray-500">
                  Aplicado em todos os botões e imagens
                </p>
              </div>

              {/* Terms Link */}
              <div className="space-y-1.5">
                <Label className="text-[10px] text-gray-400 uppercase tracking-wide">Link de Termos</Label>
                <Input
                  value={data.termsLink}
                  onChange={(e) => onChange({ ...data, termsLink: e.target.value })}
                  className="h-8 text-xs bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)] text-white placeholder:text-gray-500"
                  placeholder="https://"
                />
                <p className="text-[9px] text-gray-500">Aparece no rodapé</p>
              </div>

              {/* Privacy Link */}
              <div className="space-y-1.5">
                <Label className="text-[10px] text-gray-400 uppercase tracking-wide">Link de Privacidade</Label>
                <Input
                  value={data.privacyLink}
                  onChange={(e) => onChange({ ...data, privacyLink: e.target.value })}
                  className="h-8 text-xs bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)] text-white placeholder:text-gray-500"
                  placeholder="https://"
                />
                <p className="text-[9px] text-gray-500">Aparece no rodapé</p>
              </div>

              {/* Footer Customization */}
              <div 
                className="flex items-center gap-2 py-2 text-xs font-medium text-gray-300 border-b mt-6"
                style={{ borderColor: 'hsl(0 0% 20%)' }}
              >
                <Palette className="w-3.5 h-3.5" />
                Personalizar Rodapé
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-gray-400 uppercase tracking-wide">Cor de Fundo</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={data.footerStyle?.backgroundColor || '#0a0a0a'}
                      onChange={(e) => onChange({
                        ...data,
                        footerStyle: { ...data.footerStyle, backgroundColor: e.target.value }
                      })}
                      className="h-8 w-10 p-1 bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)]"
                    />
                    <Input
                      value={data.footerStyle?.backgroundColor || '#0a0a0a'}
                      onChange={(e) => onChange({
                        ...data,
                        footerStyle: { ...data.footerStyle, backgroundColor: e.target.value }
                      })}
                      className="flex-1 h-8 text-xs bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)] text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] text-gray-400 uppercase tracking-wide">Cor do Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={data.footerStyle?.textColor || '#888888'}
                      onChange={(e) => onChange({
                        ...data,
                        footerStyle: { ...data.footerStyle, textColor: e.target.value }
                      })}
                      className="h-8 w-10 p-1 bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)]"
                    />
                    <Input
                      value={data.footerStyle?.textColor || '#888888'}
                      onChange={(e) => onChange({
                        ...data,
                        footerStyle: { ...data.footerStyle, textColor: e.target.value }
                      })}
                      className="flex-1 h-8 text-xs bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)] text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label className="text-[10px] text-gray-400 uppercase tracking-wide">Mostrar Links das Seções</Label>
                  <Switch
                    checked={data.footerStyle?.showSections !== false}
                    onCheckedChange={(checked) => onChange({
                      ...data,
                      footerStyle: { ...data.footerStyle, showSections: checked }
                    })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="mt-0 h-full">
            <div className="p-3 space-y-4">
              {/* Button Colors */}
              <div 
                className="flex items-center gap-2 py-2 text-xs font-medium text-gray-300 border-b"
                style={{ borderColor: 'hsl(0 0% 20%)' }}
              >
                <MousePointer2 className="w-3.5 h-3.5" />
                Cores dos Botões
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 py-1">
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
                  <Label className="text-[10px] text-gray-400">Usar Gradiente</Label>
                </div>

                {data.colors.buttonGradient.enabled ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-[9px] text-gray-500">Cor 1</Label>
                      <div className="flex gap-1">
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
                          className="h-7 w-8 p-0.5 bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)]"
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
                          className="flex-1 h-7 text-[10px] bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)] text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] text-gray-500">Cor 2</Label>
                      <div className="flex gap-1">
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
                          className="h-7 w-8 p-0.5 bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)]"
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
                          className="flex-1 h-7 text-[10px] bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)] text-white"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label className="text-[9px] text-gray-500">Cor do Botão</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={data.colors.button}
                        onChange={(e) => onChange({
                          ...data,
                          colors: { ...data.colors, button: e.target.value }
                        })}
                        className="h-8 w-10 p-1 bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)]"
                      />
                      <Input
                        value={data.colors.button}
                        onChange={(e) => onChange({
                          ...data,
                          colors: { ...data.colors, button: e.target.value }
                        })}
                        placeholder="#FF6A00"
                        className="flex-1 h-8 text-xs bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)] text-white"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-[9px] text-gray-500">Cor do Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={data.colors.buttonText}
                      onChange={(e) => onChange({
                        ...data,
                        colors: { ...data.colors, buttonText: e.target.value }
                      })}
                      className="h-8 w-10 p-1 bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)]"
                    />
                    <Input
                      value={data.colors.buttonText}
                      onChange={(e) => onChange({
                        ...data,
                        colors: { ...data.colors, buttonText: e.target.value }
                      })}
                      placeholder="#ffffff"
                      className="flex-1 h-8 text-xs bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)] text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Border Style */}
              <div 
                className="flex items-center gap-2 py-2 text-xs font-medium text-gray-300 border-b mt-4"
                style={{ borderColor: 'hsl(0 0% 20%)' }}
              >
                <Settings className="w-3.5 h-3.5" />
                Estilo das Bordas
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] text-gray-400 uppercase tracking-wide">Formato</Label>
                <Select 
                  value={data.buttonStyle.borderRadius} 
                  onValueChange={(value: 'square' | 'rounded' | 'pill') => onChange({
                    ...data,
                    buttonStyle: { ...data.buttonStyle, borderRadius: value }
                  })}
                >
                  <SelectTrigger className="h-8 text-xs bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(0_0%_15%)] border-[hsl(0_0%_25%)]">
                    <SelectItem value="square" className="text-xs text-white">Quadradas</SelectItem>
                    <SelectItem value="rounded" className="text-xs text-white">Arredondadas</SelectItem>
                    <SelectItem value="pill" className="text-xs text-white">Pílula</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Button Effects */}
              <div 
                className="flex items-center gap-2 py-2 text-xs font-medium text-gray-300 border-b mt-4"
                style={{ borderColor: 'hsl(0 0% 20%)' }}
              >
                <Palette className="w-3.5 h-3.5" />
                Efeitos do Botão
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between py-1.5">
                  <Label className="text-[10px] text-gray-400">Sombra</Label>
                  <Switch
                    checked={data.buttonStyle.shadow}
                    onCheckedChange={(checked) => onChange({
                      ...data,
                      buttonStyle: { ...data.buttonStyle, shadow: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <Label className="text-[10px] text-gray-400">Brilho Neon</Label>
                  <Switch
                    checked={data.buttonStyle.neonGlow}
                    onCheckedChange={(checked) => onChange({
                      ...data,
                      buttonStyle: { ...data.buttonStyle, neonGlow: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <Label className="text-[10px] text-gray-400">Efeito Hover</Label>
                  <Switch
                    checked={data.buttonStyle.hoverEffect}
                    onCheckedChange={(checked) => onChange({
                      ...data,
                      buttonStyle: { ...data.buttonStyle, hoverEffect: checked }
                    })}
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div 
                className="flex items-center gap-2 py-2 text-xs font-medium text-gray-300 border-b mt-4"
                style={{ borderColor: 'hsl(0 0% 20%)' }}
              >
                <MousePointer2 className="w-3.5 h-3.5" />
                WhatsApp Flutuante
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between py-1.5">
                  <Label className="text-[10px] text-gray-400">Ativar</Label>
                  <Switch
                    checked={data.whatsappEnabled}
                    onCheckedChange={(checked) => onChange({
                      ...data,
                      whatsappEnabled: checked
                    })}
                  />
                </div>

                {data.whatsappEnabled && (
                  <div className="space-y-1.5">
                    <Label className="text-[9px] text-gray-500">Link WhatsApp</Label>
                    <Input
                      value={data.whatsappLink}
                      onChange={(e) => onChange({ ...data, whatsappLink: e.target.value })}
                      placeholder="https://wa.me/5511999999999"
                      className="h-8 text-xs bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)] text-white placeholder:text-gray-500"
                    />
                  </div>
                )}
              </div>

              {/* IP Tracking */}
              <div 
                className="flex items-center gap-2 py-2 text-xs font-medium text-gray-300 border-b mt-4"
                style={{ borderColor: 'hsl(0 0% 20%)' }}
              >
                <Settings className="w-3.5 h-3.5" />
                IP Tracking
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between py-1.5">
                  <Label className="text-[10px] text-gray-400">Ativar</Label>
                  <Switch
                    checked={data.ipTracking?.enabled || false}
                    onCheckedChange={(checked) => onChange({
                      ...data,
                      ipTracking: { ...data.ipTracking, enabled: checked }
                    })}
                  />
                </div>

                {data.ipTracking?.enabled && (
                  <div className="space-y-1.5">
                    <Label className="text-[9px] text-gray-500">URL do pixel</Label>
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
                      className="h-8 text-xs bg-[hsl(0_0%_18%)] border-[hsl(0_0%_25%)] text-white placeholder:text-gray-500"
                    />
                    {data.ipTracking?.url && !data.ipTracking.url.match(/^https?:\/\//) && (
                      <p className="text-[9px] text-red-400">URL inválida</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
