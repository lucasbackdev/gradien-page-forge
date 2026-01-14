import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { ManualPosition } from '@/types/sections';

interface ManualPositionEditorProps {
  value: ManualPosition;
  onChange: (value: ManualPosition) => void;
}

export const ManualPositionEditor = ({ value, onChange }: ManualPositionEditorProps) => {
  const step = 2;

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    switch (direction) {
      case 'up':
        onChange({ ...value, y: Math.max(0, value.y - step) });
        break;
      case 'down':
        onChange({ ...value, y: Math.min(100, value.y + step) });
        break;
      case 'left':
        onChange({ ...value, x: Math.max(0, value.x - step) });
        break;
      case 'right':
        onChange({ ...value, x: Math.min(100, value.x + step) });
        break;
    }
  };

  const handleResize = (dimension: 'width' | 'height', increase: boolean) => {
    const stepSize = 5;
    if (dimension === 'width') {
      const newWidth = increase ? Math.min(200, value.width + stepSize) : Math.max(10, value.width - stepSize);
      onChange({ ...value, width: newWidth });
    } else {
      const newHeight = increase ? Math.min(200, value.height + stepSize) : Math.max(10, value.height - stepSize);
      onChange({ ...value, height: newHeight });
    }
  };

  return (
    <div className="space-y-3 p-3 bg-muted/30 rounded-lg border">
      <Label className="text-xs font-semibold text-primary">Posição Manual</Label>
      
      {/* Position controls */}
      <div className="space-y-2">
        <Label className="text-xs">Posição</Label>
        <div className="flex items-center justify-center gap-1">
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => handleMove('up')}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => handleMove('left')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="h-7 w-14 bg-muted rounded flex items-center justify-center text-xs">
                {value.x}%, {value.y}%
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => handleMove('right')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => handleMove('down')}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Size controls */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Largura: {value.width}%</Label>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 flex-1 p-0"
              onClick={() => handleResize('width', false)}
            >
              <Minimize2 className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 flex-1 p-0"
              onClick={() => handleResize('width', true)}
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Altura: {value.height}%</Label>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 flex-1 p-0"
              onClick={() => handleResize('height', false)}
            >
              <Minimize2 className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 flex-1 p-0"
              onClick={() => handleResize('height', true)}
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Reset button */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full h-7 text-xs"
        onClick={() => onChange({ x: 50, y: 50, width: 50, height: 50 })}
      >
        Centralizar
      </Button>
    </div>
  );
};