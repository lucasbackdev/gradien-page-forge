import { FloatingHeader } from '@/types/sections';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

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

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Label className="font-semibold">Header Flutuante</Label>
        <Switch
          checked={header.enabled}
          onCheckedChange={(enabled) => onChange({ ...header, enabled })}
        />
      </div>

      {header.enabled && (
        <div className="space-y-4 pt-2 border-t">
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

          <div className="flex items-center gap-2">
            <Switch
              checked={header.blur}
              onCheckedChange={(blur) => onChange({ ...header, blur })}
            />
            <Label className="text-sm">Efeito Blur (Glassmorphism)</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={header.shadow}
              onCheckedChange={(shadow) => onChange({ ...header, shadow })}
            />
            <Label className="text-sm">Sombra</Label>
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
        </div>
      )}
    </Card>
  );
};
