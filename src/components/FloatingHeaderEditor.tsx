import { FloatingHeader, FixedHeaderButton } from '@/types/sections';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FloatingHeaderEditorProps {
  header: FloatingHeader;
  onChange: (header: FloatingHeader) => void;
}

export const FloatingHeaderEditor = ({ header, onChange }: FloatingHeaderEditorProps) => {
  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange({ ...header, logoImage: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const headerType = header.type || 'floating';
  const fixedButton = header.fixedButton || {
    enabled: false,
    text: 'Comprar Agora',
    link: '#',
    backgroundColor: '#FF6A00',
    textColor: '#ffffff',
    borderRadius: '0.5rem',
  };

  const updateFixedButton = (updates: Partial<FixedHeaderButton>) => {
    onChange({ ...header, fixedButton: { ...fixedButton, ...updates } });
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Label className="font-semibold">Barra Superior</Label>
        <Switch
          checked={header.enabled}
          onCheckedChange={(enabled) => onChange({ ...header, enabled })}
        />
      </div>

      {header.enabled && (
        <div className="space-y-4 pt-2 border-t">
          {/* Header Type */}
          <div>
            <Label className="text-sm">Tipo de Header</Label>
            <Select value={headerType} onValueChange={(v) => onChange({ ...header, type: v as any })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="floating">Flutuante</SelectItem>
                <SelectItem value="fixed">Fixa (Topo)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Logo do Header</Label>
            <div className="flex items-center gap-3 mt-1">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                className="flex-1"
              />
              {header.logoImage && (
                <img src={header.logoImage} alt="Logo" className="h-8 object-contain" />
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm">Cor de Fundo</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={header.backgroundColor}
                onChange={(e) => onChange({ ...header, backgroundColor: e.target.value })}
                className="h-10 w-16"
              />
              <Input
                value={header.backgroundColor}
                onChange={(e) => onChange({ ...header, backgroundColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>

          {/* Nav Text Color */}
          <div>
            <Label className="text-sm">Cor dos Links de Navegação</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={header.navTextColor || '#ffffff'}
                onChange={(e) => onChange({ ...header, navTextColor: e.target.value })}
                className="h-10 w-16"
              />
              <Input
                value={header.navTextColor || '#ffffff'}
                onChange={(e) => onChange({ ...header, navTextColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>

          {/* Nav Font Weight */}
          <div className="flex items-center gap-2">
            <Switch
              checked={header.navFontWeight === 'bold'}
              onCheckedChange={(bold) => onChange({ ...header, navFontWeight: bold ? 'bold' : 'normal' })}
            />
            <Label className="text-sm">Nomes em Negrito</Label>
          </div>

          {/* Floating-specific settings */}
          {headerType === 'floating' && (
            <>
              <div>
                <Label className="text-sm">Posição do Header</Label>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => onChange({ ...header, position: 'left' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded border transition-colors ${
                      header.position === 'left'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted border-border hover:border-primary'
                    }`}
                  >
                    <AlignLeft className="w-4 h-4" />
                    Esquerda
                  </button>
                  <button
                    onClick={() => onChange({ ...header, position: 'center' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded border transition-colors ${
                      header.position === 'center'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted border-border hover:border-primary'
                    }`}
                  >
                    <AlignCenter className="w-4 h-4" />
                    Centro
                  </button>
                  <button
                    onClick={() => onChange({ ...header, position: 'right' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded border transition-colors ${
                      header.position === 'right'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted border-border hover:border-primary'
                    }`}
                  >
                    <AlignRight className="w-4 h-4" />
                    Direita
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-sm">Transparência: {header.backgroundOpacity}%</Label>
                <Slider
                  value={[header.backgroundOpacity]}
                  onValueChange={(value) => onChange({ ...header, backgroundOpacity: value[0] })}
                  min={0}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm">Largura: {header.width || 60}%</Label>
                <Slider
                  value={[header.width || 60]}
                  onValueChange={(value) => onChange({ ...header, width: value[0] })}
                  min={40}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={header.blur}
                  onCheckedChange={(blur) => onChange({ ...header, blur })}
                />
                <Label className="text-sm">Efeito Blur (Glassmorphism)</Label>
              </div>

              <div>
                <Label className="text-sm">Bordas Arredondadas</Label>
                <div className="flex gap-2 mt-1">
                  {['0px', '8px', '16px', '24px', '9999px'].map((radius) => (
                    <button
                      key={radius}
                      onClick={() => onChange({ ...header, borderRadius: radius })}
                      className={`px-3 py-1 text-sm rounded border transition-colors ${
                        header.borderRadius === radius
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted border-border hover:border-primary'
                      }`}
                    >
                      {radius === '9999px' ? 'Pill' : radius}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Fixed header - button settings */}
          {headerType === 'fixed' && (
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Botão no Header</Label>
                <Switch
                  checked={fixedButton.enabled}
                  onCheckedChange={(enabled) => updateFixedButton({ enabled })}
                />
              </div>

              {fixedButton.enabled && (
                <div className="space-y-3 pl-2 border-l-2 border-primary/30">
                  <div>
                    <Label className="text-xs">Texto do Botão</Label>
                    <Input
                      value={fixedButton.text}
                      onChange={(e) => updateFixedButton({ text: e.target.value })}
                      className="mt-1 h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Link do Botão</Label>
                    <Input
                      value={fixedButton.link}
                      onChange={(e) => updateFixedButton({ link: e.target.value })}
                      placeholder="https://..."
                      className="mt-1 h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Cor do Botão</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        value={fixedButton.backgroundColor}
                        onChange={(e) => updateFixedButton({ backgroundColor: e.target.value })}
                        className="h-8 w-12"
                      />
                      <Input
                        value={fixedButton.backgroundColor}
                        onChange={(e) => updateFixedButton({ backgroundColor: e.target.value })}
                        className="flex-1 h-8"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Cor do Texto do Botão</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        value={fixedButton.textColor}
                        onChange={(e) => updateFixedButton({ textColor: e.target.value })}
                        className="h-8 w-12"
                      />
                      <Input
                        value={fixedButton.textColor}
                        onChange={(e) => updateFixedButton({ textColor: e.target.value })}
                        className="flex-1 h-8"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Borda do Botão</Label>
                    <div className="flex gap-2 mt-1">
                      {['0', '0.5rem', '9999px'].map((radius) => (
                        <button
                          key={radius}
                          onClick={() => updateFixedButton({ borderRadius: radius })}
                          className={`px-3 py-1 text-xs rounded border transition-colors ${
                            fixedButton.borderRadius === radius
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-muted border-border hover:border-primary'
                          }`}
                        >
                          {radius === '0' ? 'Reto' : radius === '0.5rem' ? 'Arredondado' : 'Pill'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Switch
              checked={header.shadow}
              onCheckedChange={(shadow) => onChange({ ...header, shadow })}
            />
            <Label className="text-sm">Sombra</Label>
          </div>
        </div>
      )}
    </Card>
  );
};
