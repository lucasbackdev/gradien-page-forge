import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ViewportSize = 'desktop' | 'tablet' | 'mobile';

interface ResponsivePreviewProps {
  currentSize: ViewportSize;
  onSizeChange: (size: ViewportSize) => void;
}

export const ResponsivePreview = ({ currentSize, onSizeChange }: ResponsivePreviewProps) => {
  const sizes: { key: ViewportSize; icon: React.ReactNode; label: string }[] = [
    { key: 'desktop', icon: <Monitor className="w-4 h-4" />, label: 'Desktop' },
    { key: 'tablet', icon: <Tablet className="w-4 h-4" />, label: 'Tablet' },
    { key: 'mobile', icon: <Smartphone className="w-4 h-4" />, label: 'Mobile' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {sizes.map(({ key, icon, label }) => (
        <Button
          key={key}
          variant={currentSize === key ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onSizeChange(key)}
          title={label}
          className="px-3"
        >
          {icon}
        </Button>
      ))}
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
