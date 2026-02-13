import { useState, useEffect } from 'react';
import { PresellData, PresellElement, availableFonts, ButtonTemplate, translations, CookieBannerConfig, TopLogoConfig } from '@/types/presell';
import { PresellSection } from '@/types/sections';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
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
  LayoutTemplate,
  Globe,
  Shield,
  Cookie,
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

import shinyButtonPreview from '@/assets/shiny-button-preview.gif';


interface EditorPanelProps {
  data: PresellData;
  onChange: (data: PresellData) => void;
  highlightedElement?: { sectionId: string; elementId: string } | null;
  onClearHighlight?: () => void;
}

export const EditorPanel = ({ data, onChange, highlightedElement, onClearHighlight }: EditorPanelProps) => {
  const handleImageUpload = (field: 'logoImage' | 'favicon', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange({ ...data, [field]: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleTopLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange({ ...data, topLogo: { ...data.topLogo, imageUrl: e.target?.result as string, enabled: true } });
    };
    reader.readAsDataURL(file);
  };

  const [activeTab, setActiveTab] = useState('elements');

  // When an element is highlighted from the preview, switch to elements tab
  useEffect(() => {
    if (highlightedElement) {
      setActiveTab('elements');
    }
  }, [highlightedElement]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Elementor-style Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted">
        <Menu className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
        <span className="text-sm font-semibold text-foreground tracking-wide">editor</span>
        <Grid3X3 className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        {/* Elementor-style Tabs */}
        <div className="border-b border-border bg-background">
          <TabsList className="w-full h-10 bg-transparent rounded-none p-0 grid grid-cols-5">
            <TabsTrigger 
              value="elements" 
              className="h-full rounded-none border-b-2 border-transparent text-xs text-muted-foreground data-[state=active]:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent"
            >
              <Layers className="w-3.5 h-3.5 mr-1" />
              Elementos
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="h-full rounded-none border-b-2 border-transparent text-xs text-muted-foreground data-[state=active]:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent"
            >
              <LayoutTemplate className="w-3.5 h-3.5 mr-1" />
              Modelos
            </TabsTrigger>
            <TabsTrigger 
              value="links" 
              className="h-full rounded-none border-b-2 border-transparent text-xs text-muted-foreground data-[state=active]:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent"
            >
              <Link2 className="w-3.5 h-3.5 mr-1" />
              Links
            </TabsTrigger>
            <TabsTrigger 
              value="cookies" 
              className="h-full rounded-none border-b-2 border-transparent text-xs text-muted-foreground data-[state=active]:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent"
            >
              <Cookie className="w-3.5 h-3.5 mr-1" />
              Cookies
            </TabsTrigger>
            <TabsTrigger 
              value="style" 
              className="h-full rounded-none border-b-2 border-transparent text-xs text-muted-foreground data-[state=active]:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent"
            >
              <Palette className="w-3.5 h-3.5 mr-1" />
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
                <div className="flex items-center gap-2 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                  <Settings className="w-3.5 h-3.5" />
                  Configurações Básicas
                </div>

                {/* Page Title */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Título da Aba</Label>
                  <Input
                    value={data.pageTitle}
                    onChange={(e) => onChange({ ...data, pageTitle: e.target.value })}
                    className="h-8 text-xs bg-muted border-border text-foreground placeholder:text-muted-foreground"
                    placeholder="Título do navegador"
                  />
                </div>

                {/* Favicon */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Favicon</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload('favicon', e.target.files[0])}
                      className="flex-1 h-8 text-xs bg-muted border-border text-foreground file:text-muted-foreground file:text-xs"
                    />
                    {data.favicon && (
                      <img src={data.favicon} alt="Favicon" className="h-6 w-6 object-cover rounded" />
                    )}
                  </div>
                </div>

                {/* Language */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Idioma da Página</Label>
                  <Select 
                    value={data.language || 'pt'} 
                    onValueChange={(value: 'pt' | 'es' | 'en' | 'de') => onChange({ ...data, language: value })}
                  >
                    <SelectTrigger className="h-8 text-xs bg-muted border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="pt" className="text-xs text-popover-foreground">🇧🇷 Português</SelectItem>
                      <SelectItem value="en" className="text-xs text-popover-foreground">🇺🇸 English</SelectItem>
                      <SelectItem value="es" className="text-xs text-popover-foreground">🇪🇸 Español</SelectItem>
                      <SelectItem value="de" className="text-xs text-popover-foreground">🇩🇪 Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[9px] text-muted-foreground">
                    Define o atributo &lt;html lang=""&gt; do HTML exportado
                  </p>
                </div>

                {/* Fonts */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Fonte Títulos</Label>
                    <Select 
                      value={data.fonts.title} 
                      onValueChange={(value) => onChange({ ...data, fonts: { ...data.fonts, title: value } })}
                    >
                      <SelectTrigger className="h-8 text-xs bg-muted border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {availableFonts.map((font) => (
                          <SelectItem key={font.value} value={font.value} className="text-xs text-popover-foreground">
                            {font.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Fonte Corpo</Label>
                    <Select 
                      value={data.fonts.body} 
                      onValueChange={(value) => onChange({ ...data, fonts: { ...data.fonts, body: value } })}
                    >
                      <SelectTrigger className="h-8 text-xs bg-muted border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {availableFonts.map((font) => (
                          <SelectItem key={font.value} value={font.value} className="text-xs text-popover-foreground">
                            {font.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Top Logo (when floating header is off) */}
              {!data.floatingHeader.enabled && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                    <Image className="w-3.5 h-3.5" />
                    Logo do Topo
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Ativar Logo</Label>
                    <Switch
                      checked={data.topLogo?.enabled || false}
                      onCheckedChange={(checked) => onChange({ ...data, topLogo: { ...(data.topLogo || { imageUrl: '', size: 150, position: 'center' }), enabled: checked } })}
                    />
                  </div>

                  {data.topLogo?.enabled && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Imagem da Logo</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleTopLogoUpload(e.target.files[0])}
                            className="flex-1 h-8 text-xs bg-muted border-border text-foreground file:text-muted-foreground file:text-xs"
                          />
                          {data.topLogo.imageUrl && (
                            <img src={data.topLogo.imageUrl} alt="Logo" className="h-8 object-contain" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Tamanho: {data.topLogo.size || 150}px</Label>
                        <Slider
                          value={[data.topLogo.size || 150]}
                          onValueChange={(value) => onChange({ ...data, topLogo: { ...data.topLogo, size: value[0] } })}
                          min={40}
                          max={400}
                          step={10}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Posição</Label>
                        <div className="flex gap-2">
                          {(['left', 'center', 'right'] as const).map((pos) => (
                            <button
                              key={pos}
                              onClick={() => onChange({ ...data, topLogo: { ...data.topLogo, position: pos } })}
                              className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs rounded border transition-colors ${
                                data.topLogo.position === pos
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-muted border-border hover:border-primary'
                              }`}
                            >
                              {pos === 'left' && <><AlignLeft className="w-3 h-3" /> Esquerda</>}
                              {pos === 'center' && <><AlignCenter className="w-3 h-3" /> Centro</>}
                              {pos === 'right' && <><AlignRight className="w-3 h-3" /> Direita</>}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Header Editor */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 py-2 text-xs font-medium text-muted-foreground border-b border-border">
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
                <div className="flex items-center gap-2 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                  <Layers className="w-3.5 h-3.5" />
                  Seções
                </div>
                <SectionEditor
                  sections={data.sections}
                  onUpdateSections={(sections) => onChange({ ...data, sections })}
                  highlightedElement={highlightedElement}
                  onClearHighlight={onClearHighlight}
                />
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="mt-0 h-full">
            <div className="p-3 space-y-4">
              <div className="flex items-center gap-2 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                <MousePointer2 className="w-3.5 h-3.5" />
                Modelos de Botões
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Default Button */}
                <div 
                  className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                    data.buttonStyle.template === 'default' 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border bg-muted hover:border-muted-foreground/50'
                  }`}
                  onClick={() => onChange({
                    ...data,
                    buttonStyle: { ...data.buttonStyle, template: 'default' }
                  })}
                >
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Padrão</div>
                  <div className="flex justify-center py-2">
                    <div 
                      className="px-4 py-2 text-sm font-medium rounded-lg text-white"
                      style={{
                        background: data.colors.buttonGradient.enabled 
                          ? `linear-gradient(135deg, ${data.colors.buttonGradient.color1}, ${data.colors.buttonGradient.color2})`
                          : data.colors.button
                      }}
                    >
                      Botão Padrão
                    </div>
                  </div>
                </div>

                {/* Shiny Green Button */}
                <div 
                  className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                    data.buttonStyle.template === 'shiny-green' 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border bg-muted hover:border-muted-foreground/50'
                  }`}
                  onClick={() => onChange({
                    ...data,
                    buttonStyle: { ...data.buttonStyle, template: 'shiny-green' }
                  })}
                >
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Shiny Verde</div>
                  <div className="flex justify-center py-2">
                    <img 
                      src={shinyButtonPreview} 
                      alt="Shiny Button Preview" 
                      className="h-12 object-contain rounded"
                    />
                  </div>
                </div>
              </div>

              <p className="text-[9px] text-muted-foreground mt-2">
                Selecione um modelo de botão. O estilo será aplicado em todos os botões da página.
              </p>

            </div>
          </TabsContent>


          {/* Links Tab */}
          <TabsContent value="links" className="mt-0 h-full">
            <div className="p-3 space-y-4">
              <div className="flex items-center gap-2 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                <Link2 className="w-3.5 h-3.5" />
                Links Principais
              </div>

              {/* Affiliate Link */}
              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Link de Afiliado</Label>
                <Input
                  value={data.affiliateLink}
                  onChange={(e) => onChange({ ...data, affiliateLink: e.target.value })}
                  className="h-8 text-xs bg-muted border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="https://"
                />
                <p className="text-[9px] text-muted-foreground">
                  Aplicado em todos os botões e imagens
                </p>
              </div>

              {/* Terms Link */}
              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Link de Termos</Label>
                <Input
                  value={data.termsLink}
                  onChange={(e) => onChange({ ...data, termsLink: e.target.value })}
                  className="h-8 text-xs bg-muted border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="https://"
                />
                <p className="text-[9px] text-muted-foreground">Aparece no rodapé</p>
              </div>

              {/* Privacy Link */}
              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Link de Privacidade</Label>
                <Input
                  value={data.privacyLink}
                  onChange={(e) => onChange({ ...data, privacyLink: e.target.value })}
                  className="h-8 text-xs bg-muted border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="https://"
                />
                <p className="text-[9px] text-muted-foreground">Aparece no rodapé</p>
              </div>

              {/* Footer Customization */}
              <div className="flex items-center gap-2 py-2 text-xs font-medium text-muted-foreground border-b border-border mt-6">
                <Palette className="w-3.5 h-3.5" />
                Personalizar Rodapé
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Cor de Fundo</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={data.footerStyle?.backgroundColor || '#0a0a0a'}
                      onChange={(e) => onChange({
                        ...data,
                        footerStyle: { ...data.footerStyle, backgroundColor: e.target.value }
                      })}
                      className="h-8 w-10 p-1 bg-muted border-border"
                    />
                    <Input
                      value={data.footerStyle?.backgroundColor || '#0a0a0a'}
                      onChange={(e) => onChange({
                        ...data,
                        footerStyle: { ...data.footerStyle, backgroundColor: e.target.value }
                      })}
                      className="flex-1 h-8 text-xs bg-muted border-border text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Cor do Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={data.footerStyle?.textColor || '#888888'}
                      onChange={(e) => onChange({
                        ...data,
                        footerStyle: { ...data.footerStyle, textColor: e.target.value }
                      })}
                      className="h-8 w-10 p-1 bg-muted border-border"
                    />
                    <Input
                      value={data.footerStyle?.textColor || '#888888'}
                      onChange={(e) => onChange({
                        ...data,
                        footerStyle: { ...data.footerStyle, textColor: e.target.value }
                      })}
                      className="flex-1 h-8 text-xs bg-muted border-border text-foreground"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Mostrar Links das Seções</Label>
                  <Switch
                    checked={data.footerStyle?.showSections !== false}
                    onCheckedChange={(checked) => onChange({
                      ...data,
                      footerStyle: { ...data.footerStyle, showSections: checked }
                    })}
                  />
                </div>

                {/* Customização dos links de Termos e Privacidade */}
                <div className="flex items-center gap-2 py-2 text-xs font-medium text-muted-foreground border-b border-border mt-4">
                  <Link2 className="w-3.5 h-3.5" />
                  Links de Termos e Privacidade
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Texto do Link de Termos</Label>
                  <Input
                    value={data.footerStyle?.termsText || ''}
                    onChange={(e) => onChange({
                      ...data,
                      footerStyle: { ...data.footerStyle, termsText: e.target.value }
                    })}
                    className="h-8 text-xs bg-muted border-border text-foreground"
                    placeholder="Termos de Uso"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Texto do Link de Privacidade</Label>
                  <Input
                    value={data.footerStyle?.privacyText || ''}
                    onChange={(e) => onChange({
                      ...data,
                      footerStyle: { ...data.footerStyle, privacyText: e.target.value }
                    })}
                    className="h-8 text-xs bg-muted border-border text-foreground"
                    placeholder="Política de Privacidade"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Cor dos Links</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={data.footerStyle?.linksColor || '#888888'}
                      onChange={(e) => onChange({
                        ...data,
                        footerStyle: { ...data.footerStyle, linksColor: e.target.value }
                      })}
                      className="h-8 w-10 p-1 bg-muted border-border"
                    />
                    <Input
                      value={data.footerStyle?.linksColor || '#888888'}
                      onChange={(e) => onChange({
                        ...data,
                        footerStyle: { ...data.footerStyle, linksColor: e.target.value }
                      })}
                      className="flex-1 h-8 text-xs bg-muted border-border text-foreground"
                    />
                  </div>
                </div>

                {/* Footer Custom Text */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Texto Personalizado do Rodapé</Label>
                  <Textarea
                    value={data.footerStyle?.customText || ''}
                    onChange={(e) => onChange({
                      ...data,
                      footerStyle: { ...data.footerStyle, customText: e.target.value }
                    })}
                    className="text-xs bg-muted border-border text-foreground placeholder:text-muted-foreground min-h-[60px]"
                    placeholder="Adicione um texto personalizado ao rodapé (suporta quebra de linha)"
                    rows={3}
                  />
                  <p className="text-[9px] text-muted-foreground">
                    Use Enter para quebrar linhas
                  </p>
                </div>

                {/* Copyright Text */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Texto de Copyright</Label>
                  <Input
                    value={data.footerStyle?.copyrightText ?? `© ${new Date().getFullYear()} Todos os direitos reservados.`}
                    onChange={(e) => onChange({
                      ...data,
                      footerStyle: { ...data.footerStyle, copyrightText: e.target.value }
                    })}
                    className="h-8 text-xs bg-muted border-border text-foreground"
                    placeholder="© 2026 Todos os direitos reservados."
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Cookies Tab */}
          <TabsContent value="cookies" className="mt-0 h-full">
            <div className="p-3 space-y-4">
              <div className="flex items-center gap-2 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                <Cookie className="w-3.5 h-3.5" />
                Banner de Cookies (DSGVO)
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-1.5">
                  <Label className="text-[10px] text-muted-foreground">Mostrar no Preview</Label>
                  <Switch
                    checked={data.cookieBanner?.showInPreview || false}
                    onCheckedChange={(checked) => onChange({
                      ...data,
                      cookieBanner: { ...data.cookieBanner, showInPreview: checked }
                    })}
                  />
                </div>
                <p className="text-[9px] text-muted-foreground">
                  O banner é sempre incluído no HTML exportado. Use esta opção apenas para pré-visualizar.
                </p>

                {/* Banner Text */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Texto do Banner</Label>
                  <Textarea
                    value={data.cookieBanner?.text || data.consentBannerText || 'Utilizamos cookies apenas após o seu consentimento, conforme nossa'}
                    onChange={(e) => onChange({ 
                      ...data, 
                      cookieBanner: { ...data.cookieBanner, text: e.target.value },
                      consentBannerText: e.target.value 
                    })}
                    className="text-xs bg-muted border-border text-foreground placeholder:text-muted-foreground min-h-[60px]"
                    placeholder="Utilizamos cookies apenas após o seu consentimento, conforme nossa"
                    rows={2}
                  />
                  <p className="text-[9px] text-muted-foreground">
                    O link de Política de Privacidade é adicionado automaticamente após este texto
                  </p>
                </div>

                {/* Button Texts */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Texto Aceitar</Label>
                    <Input
                      value={data.cookieBanner?.acceptText || 'Aceitar'}
                      onChange={(e) => onChange({
                        ...data,
                        cookieBanner: { ...data.cookieBanner, acceptText: e.target.value }
                      })}
                      className="h-8 text-xs bg-muted border-border text-foreground"
                    />
                  </div>
                </div>

                {/* Colors Section */}
                <div className="flex items-center gap-2 py-2 text-xs font-medium text-muted-foreground border-b border-border mt-2">
                  <Palette className="w-3.5 h-3.5" />
                  Cores do Banner
                </div>

                {/* Background Color */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Cor de Fundo</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={data.cookieBanner?.backgroundColor || '#1a1a2e'}
                      onChange={(e) => onChange({
                        ...data,
                        cookieBanner: { ...data.cookieBanner, backgroundColor: e.target.value }
                      })}
                      className="h-8 w-10 p-1 bg-muted border-border"
                    />
                    <Input
                      value={data.cookieBanner?.backgroundColor || '#1a1a2e'}
                      onChange={(e) => onChange({
                        ...data,
                        cookieBanner: { ...data.cookieBanner, backgroundColor: e.target.value }
                      })}
                      className="flex-1 h-8 text-xs bg-muted border-border text-foreground"
                    />
                  </div>
                </div>

                {/* Text Color */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Cor do Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={data.cookieBanner?.textColor || '#ffffff'}
                      onChange={(e) => onChange({
                        ...data,
                        cookieBanner: { ...data.cookieBanner, textColor: e.target.value }
                      })}
                      className="h-8 w-10 p-1 bg-muted border-border"
                    />
                    <Input
                      value={data.cookieBanner?.textColor || '#ffffff'}
                      onChange={(e) => onChange({
                        ...data,
                        cookieBanner: { ...data.cookieBanner, textColor: e.target.value }
                      })}
                      className="flex-1 h-8 text-xs bg-muted border-border text-foreground"
                    />
                  </div>
                </div>

                {/* Link Color */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Cor do Link</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={data.cookieBanner?.linkColor || '#8B5CF6'}
                      onChange={(e) => onChange({
                        ...data,
                        cookieBanner: { ...data.cookieBanner, linkColor: e.target.value }
                      })}
                      className="h-8 w-10 p-1 bg-muted border-border"
                    />
                    <Input
                      value={data.cookieBanner?.linkColor || '#8B5CF6'}
                      onChange={(e) => onChange({
                        ...data,
                        cookieBanner: { ...data.cookieBanner, linkColor: e.target.value }
                      })}
                      className="flex-1 h-8 text-xs bg-muted border-border text-foreground"
                    />
                  </div>
                </div>

                {/* Accept Button Colors */}
                <div className="flex items-center gap-2 py-2 text-xs font-medium text-muted-foreground border-b border-border mt-2">
                  <MousePointer2 className="w-3.5 h-3.5" />
                  Botão Aceitar
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] text-muted-foreground">Fundo</Label>
                    <div className="flex gap-1">
                      <Input
                        type="color"
                        value={data.cookieBanner?.buttonAcceptBg || '#8B5CF6'}
                        onChange={(e) => onChange({
                          ...data,
                          cookieBanner: { ...data.cookieBanner, buttonAcceptBg: e.target.value }
                        })}
                        className="h-7 w-8 p-0.5 bg-muted border-border"
                      />
                      <Input
                        value={data.cookieBanner?.buttonAcceptBg || '#8B5CF6'}
                        onChange={(e) => onChange({
                          ...data,
                          cookieBanner: { ...data.cookieBanner, buttonAcceptBg: e.target.value }
                        })}
                        className="flex-1 h-7 text-[10px] bg-muted border-border text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] text-muted-foreground">Texto</Label>
                    <div className="flex gap-1">
                      <Input
                        type="color"
                        value={data.cookieBanner?.buttonAcceptText || '#ffffff'}
                        onChange={(e) => onChange({
                          ...data,
                          cookieBanner: { ...data.cookieBanner, buttonAcceptText: e.target.value }
                        })}
                        className="h-7 w-8 p-0.5 bg-muted border-border"
                      />
                      <Input
                        value={data.cookieBanner?.buttonAcceptText || '#ffffff'}
                        onChange={(e) => onChange({
                          ...data,
                          cookieBanner: { ...data.cookieBanner, buttonAcceptText: e.target.value }
                        })}
                        className="flex-1 h-7 text-[10px] bg-muted border-border text-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="style" className="mt-0 h-full">
            <div className="p-3 space-y-4">
              {/* Button Colors */}
              <div className="flex items-center gap-2 py-2 text-xs font-medium text-muted-foreground border-b border-border">
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
                  <Label className="text-[10px] text-muted-foreground">Usar Gradiente</Label>
                </div>

                {data.colors.buttonGradient.enabled ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-[9px] text-muted-foreground">Cor 1</Label>
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
                          className="h-7 w-8 p-0.5 bg-muted border-border"
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
                          className="flex-1 h-7 text-[10px] bg-muted border-border text-foreground"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] text-muted-foreground">Cor 2</Label>
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
                          className="h-7 w-8 p-0.5 bg-muted border-border"
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
                          className="flex-1 h-7 text-[10px] bg-muted border-border text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label className="text-[9px] text-muted-foreground">Cor do Botão</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={data.colors.button}
                        onChange={(e) => onChange({
                          ...data,
                          colors: { ...data.colors, button: e.target.value }
                        })}
                        className="h-8 w-10 p-1 bg-muted border-border"
                      />
                      <Input
                        value={data.colors.button}
                        onChange={(e) => onChange({
                          ...data,
                          colors: { ...data.colors, button: e.target.value }
                        })}
                        placeholder="#FF6A00"
                        className="flex-1 h-8 text-xs bg-muted border-border text-foreground"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-[9px] text-muted-foreground">Cor do Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={data.colors.buttonText}
                      onChange={(e) => onChange({
                        ...data,
                        colors: { ...data.colors, buttonText: e.target.value }
                      })}
                      className="h-8 w-10 p-1 bg-muted border-border"
                    />
                    <Input
                      value={data.colors.buttonText}
                      onChange={(e) => onChange({
                        ...data,
                        colors: { ...data.colors, buttonText: e.target.value }
                      })}
                      placeholder="#ffffff"
                      className="flex-1 h-8 text-xs bg-muted border-border text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Border Style */}
              <div className="flex items-center gap-2 py-2 text-xs font-medium text-muted-foreground border-b border-border mt-4">
                <Settings className="w-3.5 h-3.5" />
                Estilo das Bordas
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">Formato</Label>
                <Select 
                  value={data.buttonStyle.borderRadius} 
                  onValueChange={(value: 'square' | 'rounded' | 'pill') => onChange({
                    ...data,
                    buttonStyle: { ...data.buttonStyle, borderRadius: value }
                  })}
                >
                  <SelectTrigger className="h-8 text-xs bg-muted border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="square" className="text-xs text-popover-foreground">Quadradas</SelectItem>
                    <SelectItem value="rounded" className="text-xs text-popover-foreground">Arredondadas</SelectItem>
                    <SelectItem value="pill" className="text-xs text-popover-foreground">Pílula</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Button Effects */}
              <div className="flex items-center gap-2 py-2 text-xs font-medium text-muted-foreground border-b border-border mt-4">
                <Palette className="w-3.5 h-3.5" />
                Efeitos do Botão
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between py-1.5">
                  <Label className="text-[10px] text-muted-foreground">Sombra</Label>
                  <Switch
                    checked={data.buttonStyle.shadow}
                    onCheckedChange={(checked) => onChange({
                      ...data,
                      buttonStyle: { ...data.buttonStyle, shadow: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <Label className="text-[10px] text-muted-foreground">Brilho Neon</Label>
                  <Switch
                    checked={data.buttonStyle.neonGlow}
                    onCheckedChange={(checked) => onChange({
                      ...data,
                      buttonStyle: { ...data.buttonStyle, neonGlow: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <Label className="text-[10px] text-muted-foreground">Efeito Hover</Label>
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
              <div className="flex items-center gap-2 py-2 text-xs font-medium text-muted-foreground border-b border-border mt-4">
                <MousePointer2 className="w-3.5 h-3.5" />
                WhatsApp Flutuante
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between py-1.5">
                  <Label className="text-[10px] text-muted-foreground">Ativar</Label>
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
                    <Label className="text-[9px] text-muted-foreground">Link WhatsApp</Label>
                    <Input
                      value={data.whatsappLink}
                      onChange={(e) => onChange({ ...data, whatsappLink: e.target.value })}
                      placeholder="https://wa.me/5511999999999"
                      className="h-8 text-xs bg-muted border-border text-foreground placeholder:text-muted-foreground"
                    />
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
