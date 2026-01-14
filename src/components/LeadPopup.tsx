import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PopupConfig } from "@/types/presell";

interface LeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  config: PopupConfig;
  userId: string;
  sourcePage?: string;
}

export function LeadPopup({ isOpen, onClose, config, userId, sourcePage }: LeadPopupProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const getButtonClasses = () => {
    const baseClasses = "w-full py-3 px-6 font-semibold transition-all duration-300";
    
    switch (config.buttonStyle) {
      case 'gradient':
        return `${baseClasses} bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg hover:opacity-90`;
      case 'solid':
        return `${baseClasses} text-white rounded-lg hover:opacity-90`;
      case 'outline':
        return `${baseClasses} bg-transparent border-2 rounded-lg hover:bg-opacity-10`;
      case 'rounded':
        return `${baseClasses} text-white rounded-full hover:opacity-90`;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (config.fullNameRequired && !fullName.trim()) {
      toast.error("Nome completo é obrigatório");
      return;
    }
    if (config.emailRequired && !email.trim()) {
      toast.error("Email é obrigatório");
      return;
    }
    if (config.phoneRequired && !phone.trim()) {
      toast.error("Telefone é obrigatório");
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.from("leads").insert({
        user_id: userId,
        full_name: fullName || null,
        email: email || null,
        phone: phone || null,
        source_page: sourcePage || null,
      });

      if (error) throw error;

      toast.success("Cadastro realizado com sucesso!");
      
      setFullName("");
      setEmail("");
      setPhone("");
      onClose();

      if (config.redirectUrl) {
        window.open(config.redirectUrl, '_blank');
      }
    } catch (error) {
      console.error("Error saving lead:", error);
      toast.error("Erro ao salvar cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {config.title || "Cadastre-se"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Nome Completo {config.fullNameRequired && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Digite seu nome completo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">
              Email {config.emailRequired && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">
              Telefone {config.phoneRequired && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Digite seu telefone"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={getButtonClasses()}
            style={getButtonStyle()}
          >
            {loading ? "Enviando..." : config.buttonText || "Enviar"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
