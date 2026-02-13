import { TrackingConfig } from '@/types/presell';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Tag, BarChart3, Target } from 'lucide-react';

interface TrackingPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: TrackingConfig;
  onChange: (config: TrackingConfig) => void;
}

export const TrackingPanel = ({ open, onOpenChange, config, onChange }: TrackingPanelProps) => {
  const update = (field: keyof TrackingConfig, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[440px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Tags & Rastreamento
          </SheetTitle>
          <SheetDescription>
            Configure suas tags do Google para rastreamento e conversão. Os scripts serão injetados no HTML exportado.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* GTM */}
          <div className="space-y-4 p-4 rounded-lg border border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-500" />
              <h3 className="font-semibold text-sm">Google Tag Manager</h3>
              {config.gtmId && <Badge variant="secondary" className="text-xs">Ativo</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">
              Gerencie todas as suas tags em um só lugar. Cole apenas o ID do contêiner.
            </p>
            <div className="space-y-2">
              <Label htmlFor="gtmId" className="text-xs">ID do Contêiner</Label>
              <Input
                id="gtmId"
                placeholder="GTM-XXXXXXX"
                value={config.gtmId}
                onChange={(e) => update('gtmId', e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          </div>

          {/* Google Ads Tag */}
          <div className="space-y-4 p-4 rounded-lg border border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-500" />
              <h3 className="font-semibold text-sm">Tag do Google Ads</h3>
              {config.googleAdsId && <Badge variant="secondary" className="text-xs">Ativo</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">
              Tag global do Google Ads para remarketing e acompanhamento.
            </p>
            <div className="space-y-2">
              <Label htmlFor="googleAdsId" className="text-xs">ID do Google Ads</Label>
              <Input
                id="googleAdsId"
                placeholder="AW-XXXXXXXXXX"
                value={config.googleAdsId}
                onChange={(e) => update('googleAdsId', e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          </div>

          {/* Conversion */}
          <div className="space-y-4 p-4 rounded-lg border border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-500" />
              <h3 className="font-semibold text-sm">Conversão Google Ads</h3>
              {config.conversionId && config.conversionLabel && (
                <Badge variant="secondary" className="text-xs">Ativo</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Rastreie conversões quando o usuário clica em botões de CTA. O evento é disparado ao clicar em qualquer botão da página.
            </p>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="conversionId" className="text-xs">ID de Conversão</Label>
                <Input
                  id="conversionId"
                  placeholder="AW-XXXXXXXXXX"
                  value={config.conversionId}
                  onChange={(e) => update('conversionId', e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conversionLabel" className="text-xs">Label de Conversão</Label>
                <Input
                  id="conversionLabel"
                  placeholder="XXXXXXXXXXXXXXXXXXX"
                  value={config.conversionLabel}
                  onChange={(e) => update('conversionLabel', e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-blue-400">
              <strong>Importante:</strong> Os scripts de rastreamento são injetados apenas no HTML exportado, respeitando o consentimento de cookies do usuário. Eles só são ativados após o aceite do banner de cookies.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
