import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Tablet, Smartphone, ChevronUp, ChevronDown } from 'lucide-react';
import { ResponsiveSize, ResponsiveFontSize } from '@/types/sections';

interface ResponsiveMediaSizeEditorProps {
  value: ResponsiveSize;
  onChange: (value: ResponsiveSize) => void;
  min?: number;
  max?: number;
  label?: string;
  step?: number;
}

export const ResponsiveMediaSizeEditor = ({ 
  value, 
  onChange, 
  min = 20, 
  max = 150,
  step = 5,
  label = 'Tamanho'
}: ResponsiveMediaSizeEditorProps) => {
  const handleIncrement = (device: keyof ResponsiveSize) => {
    const newValue = Math.min(max, value[device] + step);
    onChange({ ...value, [device]: newValue });
  };

  const handleDecrement = (device: keyof ResponsiveSize) => {
    const newValue = Math.max(min, value[device] - step);
    onChange({ ...value, [device]: newValue });
  };

  const renderDeviceControls = (device: keyof ResponsiveSize) => (
    <div className="flex items-center gap-2">
      <div className="flex flex-col gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => handleIncrement(device)}
        >
          <ChevronUp className="w-3 h-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => handleDecrement(device)}
        >
          <ChevronDown className="w-3 h-3" />
        </Button>
      </div>
      <Slider
        value={[value[device]]}
        onValueChange={(v) => onChange({ ...value, [device]: v[0] })}
        min={min}
        max={max}
        step={step}
        className="flex-1"
      />
      <span className="text-xs w-10 text-right">{value[device]}%</span>
    </div>
  );

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
          {renderDeviceControls('desktop')}
        </TabsContent>
        
        <TabsContent value="tablet" className="mt-2">
          {renderDeviceControls('tablet')}
        </TabsContent>
        
        <TabsContent value="mobile" className="mt-2">
          {renderDeviceControls('mobile')}
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

const parseFontSize = (size: string): number => {
  return parseInt(size.replace(/[^0-9]/g, '')) || 16;
};

export const ResponsiveFontSizeEditor = ({ 
  value, 
  onChange, 
  label = 'Tamanho da Fonte' 
}: ResponsiveFontSizeEditorProps) => {
  const handleIncrement = (device: keyof ResponsiveFontSize) => {
    const current = parseFontSize(value[device]);
    onChange({ ...value, [device]: `${current + 2}px` });
  };

  const handleDecrement = (device: keyof ResponsiveFontSize) => {
    const current = parseFontSize(value[device]);
    onChange({ ...value, [device]: `${Math.max(8, current - 2)}px` });
  };

  const renderDeviceControls = (device: keyof ResponsiveFontSize) => (
    <div className="flex items-center gap-2">
      <div className="flex flex-col gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => handleIncrement(device)}
        >
          <ChevronUp className="w-3 h-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => handleDecrement(device)}
        >
          <ChevronDown className="w-3 h-3" />
        </Button>
      </div>
      <Input
        value={value[device]}
        onChange={(e) => onChange({ ...value, [device]: e.target.value })}
        placeholder="ex: 36px"
        className="h-8 flex-1"
      />
    </div>
  );

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
          {renderDeviceControls('desktop')}
        </TabsContent>
        
        <TabsContent value="tablet" className="mt-2">
          {renderDeviceControls('tablet')}
        </TabsContent>
        
        <TabsContent value="mobile" className="mt-2">
          {renderDeviceControls('mobile')}
        </TabsContent>
      </Tabs>
    </div>
  );
};
