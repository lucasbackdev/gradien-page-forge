import { HorizontalAlign, ResponsiveAlign } from '@/types/sections';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface ResponsiveAlignEditorProps {
  value: ResponsiveAlign;
  onChange: (value: ResponsiveAlign) => void;
}

export const ResponsiveAlignEditor = ({ value, onChange }: ResponsiveAlignEditorProps) => {
  const handleChange = (device: keyof ResponsiveAlign, align: HorizontalAlign) => {
    onChange({ ...value, [device]: align });
  };

  const AlignButton = ({ 
    device, 
    align, 
    icon: Icon, 
    label 
  }: { 
    device: keyof ResponsiveAlign; 
    align: HorizontalAlign; 
    icon: React.ComponentType<{ className?: string }>; 
    label: string;
  }) => (
    <Button
      variant={value[device] === align ? 'default' : 'outline'}
      size="sm"
      className="h-8 px-2"
      onClick={() => handleChange(device, align)}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Posição Horizontal</p>
      <Tabs defaultValue="desktop" className="w-full">
        <TabsList className="grid grid-cols-3 h-8">
          <TabsTrigger value="desktop" className="text-xs h-7">
            <Monitor className="w-3 h-3 mr-1" /> PC
          </TabsTrigger>
          <TabsTrigger value="tablet" className="text-xs h-7">
            <Tablet className="w-3 h-3 mr-1" /> Tablet
          </TabsTrigger>
          <TabsTrigger value="mobile" className="text-xs h-7">
            <Smartphone className="w-3 h-3 mr-1" /> Mobile
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="desktop" className="mt-2">
          <div className="flex gap-1">
            <AlignButton device="desktop" align="left" icon={AlignLeft} label="Esquerda" />
            <AlignButton device="desktop" align="center" icon={AlignCenter} label="Centro" />
            <AlignButton device="desktop" align="right" icon={AlignRight} label="Direita" />
          </div>
        </TabsContent>
        
        <TabsContent value="tablet" className="mt-2">
          <div className="flex gap-1">
            <AlignButton device="tablet" align="left" icon={AlignLeft} label="Esquerda" />
            <AlignButton device="tablet" align="center" icon={AlignCenter} label="Centro" />
            <AlignButton device="tablet" align="right" icon={AlignRight} label="Direita" />
          </div>
        </TabsContent>
        
        <TabsContent value="mobile" className="mt-2">
          <div className="flex gap-1">
            <AlignButton device="mobile" align="left" icon={AlignLeft} label="Esquerda" />
            <AlignButton device="mobile" align="center" icon={AlignCenter} label="Centro" />
            <AlignButton device="mobile" align="right" icon={AlignRight} label="Direita" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
