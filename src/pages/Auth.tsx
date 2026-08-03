import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock as LockIcon, User, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import presellGadsLogo from "@/assets/presellgads-logo-v3.png.asset.json";
import planos from "@/assets/planos.png.asset.json";
import { PresellCarousel } from "@/components/PresellCarousel";

const emailSchema = z.string().email("Email inválido");
const passwordSchema = z.string().min(6, "Senha deve ter no mínimo 6 caracteres");

const GradientButton = ({ children, className = "", ...props }: any) => (
  <button
    {...props}
    className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-[#0b57d0] shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 ${className}`}
  >
    {children}
  </button>
);

const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    const e = emailSchema.safeParse(email);
    if (!e.success) newErrors.email = e.error.errors[0].message;
    const p = passwordSchema.safeParse(password);
    if (!p.success) newErrors.password = p.error.errors[0].message;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        toast({ title: "Erro ao fazer login", description: error.message === "Invalid login credentials" ? "Email ou senha incorretos" : error.message, variant: "destructive" });
      } else {
        toast({ title: "Login realizado com sucesso!" });
        navigate("/", { replace: true });
      }
    } catch {
      toast({ title: "Erro de conexão", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(), password,
        options: { emailRedirectTo: `${window.location.origin}/`, data: { full_name: fullName.trim() } },
      });
      if (error) {
        toast({ title: "Erro ao criar conta", description: error.message.includes("already registered") ? "Email já cadastrado." : error.message, variant: "destructive" });
      } else {
        toast({ title: "Conta criada!", description: "Você já pode usar o sistema." });
      }
    } catch {
      toast({ title: "Erro de conexão", variant: "destructive" });
    } finally { setLoading(false); }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute -inset-4 bg-[#0b57d0]/10 blur-2xl rounded-3xl" />
      <div className="relative bg-white border border-gray-100 rounded-3xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Acesse a plataforma</h1>
          <p className="text-sm text-gray-500 mt-1">Entre ou crie sua conta gratuitamente</p>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 mb-5">
            <TabsTrigger value="login" className="data-[state=active]:bg-[#0b57d0] data-[state=active]:text-white">Entrar</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-[#0b57d0] data-[state=active]:text-white">Criar Conta</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11" required />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-700">Senha</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-11" required />
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              <GradientButton type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Entrar <ArrowRight className="w-4 h-4" /></>}
              </GradientButton>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-700">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input type="text" placeholder="Seu nome" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10 h-11" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-700">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11" required />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-700">Senha</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-11" required />
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              <GradientButton type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Criar Conta <ArrowRight className="w-4 h-4" /></>}
              </GradientButton>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) navigate("/", { replace: true });
    });
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) navigate("/", { replace: true });
      } catch {}
    })();
    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans antialiased flex flex-col items-center px-6 py-12">
      <img src={presellGadsLogo.url} alt="Presell Gads" className="h-12 w-auto object-contain mb-10" />
      <PresellCarousel />
      <div className="w-full max-w-5xl grid gap-8 lg:grid-cols-2 items-center">
        <LoginForm />
        <a href="https://presellgads.io" target="_blank" rel="noopener noreferrer" className="block">
          <img src={planos.url} alt="Planos e preços Presell Gads" className="w-full rounded-2xl shadow-xl border border-gray-100" />
        </a>
      </div>
    </main>
  );
};

export default Auth;
