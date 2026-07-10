import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { LogoBrand } from "@/components/LogoBrand";

import { z } from "zod";

const emailSchema = z.string().email("Email inválido");
const passwordSchema = z.string().min(6, "Senha deve ter no mínimo 6 caracteres");

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/", { replace: true });
      }
    });

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          navigate("/", { replace: true });
        }
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.error('Session check error:', err);
        }
      }
    };

    checkSession();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: error.message === "Invalid login credentials" 
            ? "Email ou senha incorretos" 
            : error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta!",
        });
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      console.error("Login error:", err);
      toast({
        title: "Erro ao fazer login",
        description: "Erro de conexão. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        let errorMessage = error.message;
        if (error.message.includes("already registered")) {
          errorMessage = "Este email já está cadastrado. Tente fazer login.";
        }
        toast({
          title: "Erro ao criar conta",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Conta criada com sucesso!",
          description: "Você já pode usar o sistema.",
        });
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      toast({
        title: "Erro ao criar conta",
        description: "Erro de conexão. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Light Top Bar with Logo */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 relative z-20 shadow-sm">
        <LogoBrand size="md" />
      </header>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        {/* Soft colored background blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-400/20 rounded-full blur-[120px]" 
               style={{ animation: 'float1 8s ease-in-out infinite' }} />
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" 
               style={{ animation: 'float2 10s ease-in-out infinite' }} />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-400/20 rounded-full blur-[90px]" 
               style={{ animation: 'float3 12s ease-in-out infinite' }} />
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-300/20 rounded-full blur-[80px]" 
               style={{ animation: 'float4 9s ease-in-out infinite' }} />
        </div>
        
        {/* Card with animated border */}
        <div className="relative z-10 w-full max-w-sm">
          {/* Animated border container */}
          <div className="absolute inset-[-2px] rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />
            <div className="absolute inset-0 animate-spin-slow"
                 style={{ 
                   background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.7), transparent, transparent)',
                   animation: 'spin 4s linear infinite'
                 }} />
          </div>
          
          {/* Card content */}
          <Card className="relative bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
            <CardHeader className="text-center flex flex-col items-center pt-6 pb-4">
              <CardTitle className="text-xl font-bold text-gray-900">Bem-vindo</CardTitle>
              <CardDescription className="mt-1 text-gray-500 text-sm">Acesse sua conta ou crie uma nova</CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 mb-4">
                  <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-600">Entrar</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-gray-600">Criar Conta</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="login-email" className="text-gray-700 text-xs">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 h-10 focus-visible:ring-pink-500"
                          required
                        />
                      </div>
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="login-password" className="text-gray-700 text-xs">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 h-10 focus-visible:ring-pink-500"
                          required
                        />
                      </div>
                      {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>
                    
                    <div className="flex justify-center pt-2 w-full">
                      <ShinyButton type="submit" className="w-full mx-auto" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
                      </ShinyButton>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-name" className="text-gray-700 text-xs">Nome Completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Seu nome"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 h-10 focus-visible:ring-pink-500"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-email" className="text-gray-700 text-xs">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 h-10 focus-visible:ring-pink-500"
                          required
                        />
                      </div>
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-password" className="text-gray-700 text-xs">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 h-10 focus-visible:ring-pink-500"
                          required
                        />
                      </div>
                      {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>
                    
                    <div className="flex justify-center pt-2 w-full">
                      <ShinyButton type="submit" className="w-full mx-auto" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Conta"}
                      </ShinyButton>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
