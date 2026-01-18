import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PopupConfig } from "@/types/presell";

interface PopupConfigEditorProps {
  config: PopupConfig;
  onChange: (config: PopupConfig) => void;
}

export function PopupConfigEditor({ config, onChange }: PopupConfigEditorProps) {
  const updateConfig = (updates: Partial<PopupConfig>) => {
    onChange({ ...config, ...updates });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Título do Popup</Label>
        <Input
          value={config.title}
          onChange={(e) => updateConfig({ title: e.target.value })}
          placeholder="Cadastre-se"
        />
      </div>

      <div className="space-y-3 border rounded-lg p-3 bg-muted/30">
        <Label className="text-sm font-medium">Campos Obrigatórios</Label>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Nome Completo</span>
          <Switch
            checked={config.fullNameRequired}
            onCheckedChange={(checked) => updateConfig({ fullNameRequired: checked })}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Email</span>
          <Switch
            checked={config.emailRequired}
            onCheckedChange={(checked) => updateConfig({ emailRequired: checked })}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Telefone</span>
          <Switch
            checked={config.phoneRequired}
            onCheckedChange={(checked) => updateConfig({ phoneRequired: checked })}
          />
        </div>
      </div>

      {/* Popup Style */}
      <div className="space-y-3 border rounded-lg p-3 bg-muted/30">
        <Label className="text-sm font-medium">Estilo do Popup</Label>
        
        <div className="space-y-2">
          <Label className="text-xs">Cor de Fundo do Popup</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={config.popupBackgroundColor || '#1a1a2e'}
              onChange={(e) => updateConfig({ popupBackgroundColor: e.target.value })}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              value={config.popupBackgroundColor || '#1a1a2e'}
              onChange={(e) => updateConfig({ popupBackgroundColor: e.target.value })}
              placeholder="#1a1a2e"
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Cor do Texto do Popup</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={config.popupTextColor || '#ffffff'}
              onChange={(e) => updateConfig({ popupTextColor: e.target.value })}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Input
              value={config.popupTextColor || '#ffffff'}
              onChange={(e) => updateConfig({ popupTextColor: e.target.value })}
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Estilo do Botão</Label>
        <Select
          value={config.buttonStyle}
          onValueChange={(value: PopupConfig['buttonStyle']) => updateConfig({ buttonStyle: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gradient">Gradiente</SelectItem>
            <SelectItem value="solid">Sólido</SelectItem>
            <SelectItem value="outline">Contorno</SelectItem>
            <SelectItem value="rounded">Arredondado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Cor do Botão</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={config.buttonColor}
            onChange={(e) => updateConfig({ buttonColor: e.target.value })}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={config.buttonColor}
            onChange={(e) => updateConfig({ buttonColor: e.target.value })}
            placeholder="#8B5CF6"
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Texto do Botão</Label>
        <Input
          value={config.buttonText}
          onChange={(e) => updateConfig({ buttonText: e.target.value })}
          placeholder="Enviar"
        />
      </div>

      <div className="space-y-2">
        <Label>URL de Redirecionamento (após envio)</Label>
        <Input
          value={config.redirectUrl}
          onChange={(e) => updateConfig({ redirectUrl: e.target.value })}
          placeholder="https://exemplo.com/obrigado"
        />
      </div>

      {/* Privacy & Terms */}
      <div className="space-y-3 border rounded-lg p-3 bg-muted/30">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Políticas e Termos no Rodapé</Label>
          <Switch
            checked={config.showPrivacyTerms !== false}
            onCheckedChange={(checked) => updateConfig({ showPrivacyTerms: checked })}
          />
        </div>

        {config.showPrivacyTerms !== false && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Cor do Texto de Políticas</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={config.privacyTextColor || '#888888'}
                  onChange={(e) => updateConfig({ privacyTextColor: e.target.value })}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={config.privacyTextColor || '#888888'}
                  onChange={(e) => updateConfig({ privacyTextColor: e.target.value })}
                  placeholder="#888888"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Link de Política de Privacidade</Label>
              <Input
                value={config.privacyLink || ''}
                onChange={(e) => updateConfig({ privacyLink: e.target.value })}
                placeholder="https://seusite.com/privacidade"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Link de Termos de Uso</Label>
              <Input
                value={config.termsLink || ''}
                onChange={(e) => updateConfig({ termsLink: e.target.value })}
                placeholder="https://seusite.com/termos"
              />
            </div>
          </>
        )}
      </div>

      {/* Preview do botão */}
      <div className="border rounded-lg p-4 bg-background">
        <Label className="text-sm text-muted-foreground mb-2 block">Preview do Botão</Label>
        <ButtonPreview config={config} />
      </div>
    </div>
  );
}

function ButtonPreview({ config }: { config: PopupConfig }) {
  const getButtonClasses = () => {
    const baseClasses = "w-full py-3 px-6 font-semibold transition-all duration-300";
    
    switch (config.buttonStyle) {
      case 'gradient':
        return `${baseClasses} bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg`;
      case 'solid':
        return `${baseClasses} text-white rounded-lg`;
      case 'outline':
        return `${baseClasses} bg-transparent border-2 rounded-lg`;
      case 'rounded':
        return `${baseClasses} text-white rounded-full`;
      default:
        return `${baseClasses} bg-primary text-white rounded-lg`;
    }
  };

  const getButtonStyle = () => {
    if (config.buttonStyle === 'outline') {
      return { borderColor: config.buttonColor, color: config.buttonColor };
    }
    if (config.buttonStyle === 'gradient') {
      return {};
    }
    return { backgroundColor: config.buttonColor };
  };

  return (
    <button
      className={getButtonClasses()}
      style={getButtonStyle()}
      disabled
    >
      {config.buttonText || "Enviar"}
    </button>
  );
}
