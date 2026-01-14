import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { ResponsiveSize, ResponsiveFontSize } from '@/types/sections';

interface ResponsiveMediaSizeEditorProps {
  value: ResponsiveSize;
  onChange: (value: ResponsiveSize) => void;
  min?: number;
  max?: number;
  label?: string;
}

export const ResponsiveMediaSizeEditor = ({ 
  value, 
  onChange, 
  min = 20, 
  max = 100,
  label = 'Tamanho'
}: ResponsiveMediaSizeEditorProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">{label} Responsivo</Label>
      <Tabs defaultValue="desktop" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-8">
          <TabsTrigger value="desktop" className="text-xs px-2 h-6">
            <Monitor className="w-3 h-3 mr-1" />
            PC
          </TabsTrigger>
          <TabsTrigger value="tablet" className="text-xs px-2 h-6">
            <Tablet className="w-3 h-3 mr-1" />
            Tablet
          </TabsTrigger>
          <TabsTrigger value="mobile" className="text-xs px-2 h-6">
            <Smartphone className="w-3 h-3 mr-1" />
            Mobile
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="desktop" className="mt-2">
          <div className="flex items-center gap-2">
            <Slider
              value={[value.desktop]}
              onValueChange={(v) => onChange({ ...value, desktop: v[0] })}
              min={min}
              max={max}
              step={5}
              className="flex-1"
            />
            <span className="text-xs w-10 text-right">{value.desktop}%</span>
          </div>
        </TabsContent>
        
        <TabsContent value="tablet" className="mt-2">
          <div className="flex items-center gap-2">
            <Slider
              value={[value.tablet]}
              onValueChange={(v) => onChange({ ...value, tablet: v[0] })}
              min={min}
              max={max}
              step={5}
              className="flex-1"
            />
            <span className="text-xs w-10 text-right">{value.tablet}%</span>
          </div>
        </TabsContent>
        
        <TabsContent value="mobile" className="mt-2">
          <div className="flex items-center gap-2">
            <Slider
              value={[value.mobile]}
              onValueChange={(v) => onChange({ ...value, mobile: v[0] })}
              min={min}
              max={max}
              step={5}
              className="flex-1"
            />
            <span className="text-xs w-10 text-right">{value.mobile}%</span>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ResponsiveFontSizeEditorProps {
  value: ResponsiveFontSize;
  onChange: (value: ResponsiveFontSize) => void;
  label?: string;
}

export const ResponsiveFontSizeEditor = ({ 
  value, 
  onChange, 
  label = 'Tamanho da Fonte' 
}: ResponsiveFontSizeEditorProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">{label} Responsivo</Label>
      <Tabs defaultValue="desktop" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-8">
          <TabsTrigger value="desktop" className="text-xs px-2 h-6">
            <Monitor className="w-3 h-3 mr-1" />
            PC
          </TabsTrigger>
          <TabsTrigger value="tablet" className="text-xs px-2 h-6">
            <Tablet className="w-3 h-3 mr-1" />
            Tablet
          </TabsTrigger>
          <TabsTrigger value="mobile" className="text-xs px-2 h-6">
            <Smartphone className="w-3 h-3 mr-1" />
            Mobile
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="desktop" className="mt-2">
          <Input
            value={value.desktop}
            onChange={(e) => onChange({ ...value, desktop: e.target.value })}
            placeholder="ex: 36px"
            className="h-8"
          />
        </TabsContent>
        
        <TabsContent value="tablet" className="mt-2">
          <Input
            value={value.tablet}
            onChange={(e) => onChange({ ...value, tablet: e.target.value })}
            placeholder="ex: 28px"
            className="h-8"
          />
        </TabsContent>
        
        <TabsContent value="mobile" className="mt-2">
          <Input
            value={value.mobile}
            onChange={(e) => onChange({ ...value, mobile: e.target.value })}
            placeholder="ex: 24px"
            className="h-8"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
