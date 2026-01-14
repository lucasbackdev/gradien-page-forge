import { useState } from 'react';
import { Monitor, Tablet, Smartphone, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ViewportSize = 'desktop' | 'tablet' | 'mobile';

interface ResponsivePreviewProps {
  currentSize: ViewportSize;
  onSizeChange: (size: ViewportSize) => void;
}

export const ResponsivePreview = ({ currentSize, onSizeChange }: ResponsivePreviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const sizes: { key: ViewportSize; icon: React.ReactNode; label: string }[] = [
    { key: 'desktop', icon: <Monitor className="w-4 h-4" />, label: 'Desktop' },
    { key: 'tablet', icon: <Tablet className="w-4 h-4" />, label: 'Tablet' },
    { key: 'mobile', icon: <Smartphone className="w-4 h-4" />, label: 'Mobile' },
  ];

  const currentLabel = sizes.find(s => s.key === currentSize)?.label || 'Desktop';

  return (
    <div className="relative">
      {/* Toggle Button - Always visible */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        {sizes.find(s => s.key === currentSize)?.icon}
        <span className="text-xs">{currentLabel}</span>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </Button>

      {/* Expandable Panel */}
      <div 
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 transition-all duration-300 ease-out ${
          isExpanded 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-1 p-1 bg-background border border-border rounded-lg shadow-lg">
          {sizes.map(({ key, icon, label }) => (
            <Button
              key={key}
              variant={currentSize === key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                onSizeChange(key);
                setIsExpanded(false);
              }}
              title={label}
              className="px-3"
            >
              {icon}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Backdrop to close when clicking outside */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export const getViewportWidth = (size: ViewportSize): string => {
  switch (size) {
    case 'mobile':
      return '375px';
    case 'tablet':
      return '768px';
    case 'desktop':
    default:
      return '100%';
  }
};
