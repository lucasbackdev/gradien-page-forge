import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap, Palette, Smartphone, Rocket, Search, Cloud,
  MousePointer2, Sparkles, LayoutGrid, MonitorSmartphone,
  Server, Lock, Globe, BarChart3, Target, Tag,
  LineChart, MessageCircle, Check, Star, ArrowRight,
  Play, Mail, Lock as LockIcon, User, Loader2, Menu, X,
  Facebook, Instagram, Twitter, Youtube,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import presellGadsLogo from "@/assets/presell-gads-logo-v2.png.asset.json";
import editorMockupImg from "@/assets/editor-mockup.png.asset.json";

const emailSchema = z.string().email("Email inválido");
const passwordSchema = z.string().min(6, "Senha deve ter no mínimo 6 caracteres");

const GradientButton = ({ children, className = "", ...props }: any) => (
  <button
    {...props}
    className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#0b57d0] to-[#0b57d0] shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 ${className}`}
  >
    {children}
  </button>
);

const GhostButton = ({ children, className = "", ...props }: any) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-gray-800 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 ${className}`}
  >
    {children}
  </button>
);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Section = ({ children, className = "", id }: any) => (
  <section id={id} className={`w-full py-24 px-6 ${className}`}>
    <div className="max-w-7xl mx-auto">{children}</div>
  </section>
);

const SectionTitle = ({ eyebrow, title, subtitle }: any) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
    variants={fadeUp}
    transition={{ duration: 0.6 }}
    className="text-center max-w-3xl mx-auto mb-16"
  >
    {eyebrow && (
      <span className="inline-block text-sm font-semibold uppercase tracking-widest bg-gradient-to-r from-[#0b57d0] to-[#0b57d0] bg-clip-text text-transparent mb-4">
        {eyebrow}
      </span>
    )}
    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
      {title}
    </h2>
    {subtitle && <p className="mt-5 text-lg text-gray-500 leading-relaxed">{subtitle}</p>}
  </motion.div>
);

const Navbar = ({ onGoLogin }: { onGoLogin: () => void }) => {
  const [open, setOpen] = useState(false);
  const items = [
    { label: "Recursos", href: "#recursos" },
    { label: "Templates", href: "#templates" },
    { label: "Preços", href: "#precos" },
    { label: "FAQ", href: "#faq" },
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        <a href="#top" className="flex items-center gap-2">
          <img src={presellGadsLogo.url} alt="Presell Gads" className="h-9 w-auto object-contain" />
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {items.map((i) => (
            <a key={i.href} href={i.href} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              {i.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={onGoLogin} className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-4 py-2">Entrar</button>
          <GradientButton onClick={onGoLogin} className="!px-5 !py-2.5 text-sm">Criar Presell</GradientButton>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          {items.map((i) => (
            <a key={i.href} href={i.href} onClick={() => setOpen(false)} className="block text-gray-700 font-medium">{i.label}</a>
          ))}
          <button onClick={() => { setOpen(false); onGoLogin(); }} className="block w-full text-left text-gray-700 font-semibold pt-2 border-t border-gray-100">Entrar</button>
          <GradientButton onClick={() => { setOpen(false); onGoLogin(); }} className="w-full !py-2.5">Criar Presell</GradientButton>
        </div>
      )}
    </header>
  );
};

const EditorMockup = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="relative"
  >
    <div className="absolute -inset-8 bg-gradient-to-tr from-indigo-500/20 via-blue-500/20 to-blue-400/10 blur-3xl rounded-full" />
    <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="h-9 bg-gray-50 border-b border-gray-100 flex items-center gap-2 px-4">
        <span className="w-3 h-3 rounded-full bg-red-400" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-400" />
        <div className="ml-4 flex-1 h-5 bg-white rounded border border-gray-200" />
      </div>
      <div className="grid grid-cols-12 min-h-[380px]">
        <div className="col-span-3 border-r border-gray-100 p-4 bg-gray-50/50 space-y-2">
          {["Textos","Imagens","Botões","Vídeos","Seções","Formulários"].map((n) => (
            <div key={n} className="text-xs font-medium text-gray-600 px-3 py-2 rounded-lg hover:bg-white cursor-pointer">{n}</div>
          ))}
        </div>
        <div className="col-span-9 bg-white">
          <img
            src={editorMockupImg.url}
            alt="Editor Presell Gads em ação"
            className="w-full h-full object-cover object-left-top"
          />
        </div>
      </div>
    </div>
  </motion.div>
);

const benefits = [
  { icon: Zap, title: "Criação em segundos", desc: "Gere uma página completa usando Inteligência Artificial." },
  { icon: Palette, title: "Templates Premium", desc: "Modelos prontos para campanhas de Google Ads." },
  { icon: Smartphone, title: "Responsivo", desc: "Funciona perfeitamente em celulares e computadores." },
  { icon: Rocket, title: "Otimizado para Conversão", desc: "Estrutura criada pensando em CTR e conversão." },
  { icon: Search, title: "SEO Friendly", desc: "Código limpo e carregamento rápido." },
  { icon: Cloud, title: "Publicação Instantânea", desc: "Publique sua página com apenas um clique." },
];

const features = [
  { icon: MousePointer2, label: "Editor Drag and Drop" },
  { icon: Sparkles, label: "IA para geração de textos" },
  { icon: LayoutGrid, label: "Biblioteca de blocos" },
  { icon: MonitorSmartphone, label: "Editor Mobile" },
  { icon: Server, label: "Hospedagem" },
  { icon: Lock, label: "SSL" },
  { icon: Globe, label: "Domínio personalizado" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Target, label: "Pixel Meta" },
  { icon: Tag, label: "Google Tag Manager" },
  { icon: LineChart, label: "Google Analytics" },
  { icon: Target, label: "Google Ads Conversion" },
  { icon: Rocket, label: "Botões CTA" },
  { icon: LayoutGrid, label: "Formulários" },
  { icon: BarChart3, label: "Contador" },
  { icon: Star, label: "Provas sociais" },
  { icon: MessageCircle, label: "FAQ" },
  { icon: Play, label: "Vídeos" },
  { icon: BarChart3, label: "Timer" },
  { icon: LayoutGrid, label: "Popups" },
  { icon: Cloud, label: "Cookies" },
  { icon: MessageCircle, label: "Integração WhatsApp" },
];

const templates = [
  { name: "Emagrecimento", tag: "Saúde" },
  { name: "Curso Digital", tag: "Educação" },
  { name: "E-commerce", tag: "Vendas" },
  { name: "Beleza", tag: "Cosméticos" },
  { name: "Finanças", tag: "Renda Extra" },
  { name: "Suplementos", tag: "Fitness" },
];

const comparison = [
  { feature: "Feito para Google Ads", values: [false, false, false, true] },
  { feature: "Editor Drag and Drop", values: [false, true, true, true] },
  { feature: "Templates de Presell", values: [false, false, false, true] },
  { feature: "Publicação em 1 clique", values: [false, false, true, true] },
  { feature: "IA para gerar textos", values: [false, false, false, true] },
  { feature: "Otimização de Conversão", values: [false, false, false, true] },
  { feature: "Sem precisar programar", values: [false, true, true, true] },
];
const compCols = ["WordPress", "Elementor", "Canva", "Presell Gads"];

const testimonials = [
  { name: "Rafael Souza", role: "Afiliado Top 1%", text: "Minhas campanhas de Google Ads passaram a converter 3x mais depois que comecei a usar o Presell Gads." },
  { name: "Camila Duarte", role: "Media Buyer", text: "É a ferramenta mais rápida que já testei. Crio uma presell profissional em menos de 10 minutos." },
  { name: "Lucas Ferreira", role: "Empreendedor Digital", text: "Simplesmente essencial. Substituiu meu time de designers para lançamentos rápidos." },
];

const stats = [
  { value: "+12.000", label: "Presells Criadas" },
  { value: "97%", label: "Clientes Satisfeitos" },
  { value: "+350", label: "Templates" },
  { value: "+1 Milhão", label: "Visitantes Processados" },
];

const plans = [
  { name: "Mensal", price: "R$ 97", period: "/mês", features: ["Presells ilimitadas", "Todos os templates", "Suporte por email"], highlight: false },
  { name: "Anual", price: "R$ 67", period: "/mês", features: ["Tudo do mensal", "2 meses grátis", "Suporte prioritário", "Acesso antecipado a novidades"], highlight: true, badge: "Mais Popular" },
  { name: "Lifetime", price: "R$ 1.997", period: "único", features: ["Acesso vitalício", "Todas atualizações", "Suporte VIP", "Domínio personalizado"], highlight: false },
];

const faqs = [
  { q: "Posso usar no Google Ads?", a: "Sim! O Presell Gads é 100% compatível com as políticas do Google Ads e todas as páginas são otimizadas para aprovação." },
  { q: "Preciso saber programar?", a: "Não. Você monta tudo por drag and drop, sem nenhuma linha de código." },
  { q: "Funciona para qualquer nicho?", a: "Sim, temos templates para saúde, educação, e-commerce, finanças, beleza e muitos outros nichos." },
  { q: "Posso usar domínio próprio?", a: "Claro. Você pode conectar seu próprio domínio em poucos cliques." },
  { q: "Tem suporte?", a: "Sim. Nossa equipe de suporte responde em até 24h úteis, e no plano anual e lifetime o atendimento é prioritário." },
];

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
      <div className="absolute -inset-4 bg-gradient-to-br from-[#0b57d0]/20 to-[#0b57d0]/20 blur-2xl rounded-3xl" />
      <div className="relative bg-white border border-gray-100 rounded-3xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Acesse a plataforma</h3>
          <p className="text-sm text-gray-500 mt-1">Entre ou crie sua conta gratuitamente</p>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 mb-5">
            <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0b57d0] data-[state=active]:to-[#0b57d0] data-[state=active]:text-white">Entrar</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0b57d0] data-[state=active]:to-[#0b57d0] data-[state=active]:text-white">Criar Conta</TabsTrigger>
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
  const loginRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const goLogin = () => loginRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div id="top" className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      <Navbar onGoLogin={goLogin} />

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-[120px]" />
          <div className="absolute top-40 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-[#0b57d0] text-xs font-semibold mb-6 border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5" /> Novo · Editor com IA integrada
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-gray-900">
              Crie Presells de{" "}
              <span className="bg-gradient-to-r from-[#0b57d0] to-[#0b57d0] bg-clip-text text-transparent">
                Alta Conversão
              </span>{" "}
              para Google Ads em Minutos
            </h1>
            <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-xl">
              Desenvolva páginas profissionais que aumentam sua taxa de conversão e ajudam suas campanhas de afiliados a performarem melhor, sem precisar programar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GradientButton onClick={goLogin}>Criar minha Presell <ArrowRight className="w-4 h-4" /></GradientButton>
              <GhostButton><Play className="w-4 h-4" /> Ver Demonstração</GhostButton>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> Sem cartão</div>
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> 100% Google Ads friendly</div>
            </div>
          </motion.div>
          <EditorMockup />
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <Section id="beneficios" className="bg-gradient-to-b from-white to-gray-50/50">
        <SectionTitle eyebrow="Benefícios" title="Por que usar o Presell Gads?" subtitle="Ferramentas de nível enterprise, com a simplicidade que afiliados precisam." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0b57d0] to-[#0b57d0] flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                <b.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{b.title}</h3>
              <p className="text-gray-500 leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* COMO FUNCIONA */}
      <Section id="como-funciona">
        <SectionTitle eyebrow="Como funciona" title="3 passos para sua primeira presell" />
        <div className="grid md:grid-cols-3 gap-8 relative">
          {[
            { n: "1", t: "Escolha um template", d: "Selecione entre centenas de modelos otimizados." },
            { n: "2", t: "Personalize", d: "Ajuste textos, imagens e botões no editor visual." },
            { n: "3", t: "Publique", d: "Sua página no ar em 1 clique, pronta para o Google Ads." },
          ].map((s, i) => (
            <motion.div key={s.n} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-white p-8 rounded-2xl border border-gray-100 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#0b57d0] to-[#0b57d0] text-white text-xl font-bold flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/30">{s.n}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{s.t}</h3>
              <p className="text-gray-500">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* RECURSOS */}
      <Section id="recursos" className="bg-gradient-to-b from-gray-50/50 to-white">
        <SectionTitle eyebrow="Recursos" title="Tudo o que você precisa em um só lugar" subtitle="Uma suíte completa para lançar, medir e escalar suas campanhas." />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {features.map((f, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.03 }}
              className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-[#0b57d0] flex items-center justify-center shrink-0">
                <f.icon className="w-4.5 h-4.5" strokeWidth={2} />
              </div>
              <span className="text-sm font-medium text-gray-700">{f.label}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* TEMPLATES */}
      <Section id="templates">
        <SectionTitle eyebrow="Templates" title="Modelos prontos para converter" subtitle="Comece com uma base validada e personalize em minutos." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t, i) => (
            <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
              <div className="h-44 bg-gradient-to-br from-indigo-100 via-blue-100 to-blue-100 relative overflow-hidden">
                <div className="absolute inset-4 rounded-xl bg-white/70 backdrop-blur flex items-center justify-center">
                  <div className="w-2/3 space-y-2">
                    <div className="h-3 rounded bg-gradient-to-r from-[#0b57d0] to-[#0b57d0] w-3/4" />
                    <div className="h-2 rounded bg-gray-300 w-full" />
                    <div className="h-2 rounded bg-gray-300 w-5/6" />
                    <div className="h-6 mt-3 rounded-full bg-gradient-to-r from-[#0b57d0] to-[#0b57d0] w-1/2" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">{t.name}</h3>
                  <span className="text-xs font-medium text-[#0b57d0] bg-indigo-50 px-2 py-1 rounded-full">{t.tag}</span>
                </div>
                <button onClick={goLogin} className="w-full py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#0b57d0] to-[#0b57d0] hover:opacity-90 transition">Usar Template</button>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* COMPARAÇÃO */}
      <Section className="bg-gradient-to-b from-white to-gray-50/50">
        <SectionTitle eyebrow="Comparação" title="Presell Gads vs. outras ferramentas" />
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <thead>
              <tr className="text-left">
                <th className="p-5 text-sm font-semibold text-gray-500">Recurso</th>
                {compCols.map((c, i) => (
                  <th key={c} className={`p-5 text-center text-sm font-bold ${i === 3 ? "bg-gradient-to-r from-[#0b57d0] to-[#0b57d0] text-white" : "text-gray-700"}`}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-t border-gray-100">
                  <td className="p-5 text-sm font-medium text-gray-700">{row.feature}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className={`p-5 text-center ${i === 3 ? "bg-indigo-50/40" : ""}`}>
                      {v ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* DEPOIMENTOS */}
      <Section id="depoimentos">
        <SectionTitle eyebrow="Depoimentos" title="Quem usa, recomenda" />
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0b57d0] to-[#0b57d0] text-white flex items-center justify-center font-bold">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* STATS */}
      <Section className="bg-gradient-to-r from-[#0b57d0] to-[#0b57d0] text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl md:text-5xl font-extrabold tracking-tight">{s.value}</div>
              <div className="text-white/80 mt-2 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* PREÇOS */}
      <Section id="precos">
        <SectionTitle eyebrow="Preços" title="Escolha o plano ideal para você" subtitle="Cancele quando quiser. Sem taxas ocultas." />
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <motion.div key={p.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative rounded-3xl p-8 border transition-all ${p.highlight ? "bg-gradient-to-br from-[#0b57d0] to-[#0b57d0] text-white border-transparent scale-105 shadow-2xl shadow-indigo-500/30" : "bg-white border-gray-100"}`}>
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#0b57d0] text-xs font-bold px-3 py-1 rounded-full shadow-md">{p.badge}</span>
              )}
              <h3 className={`text-lg font-bold ${p.highlight ? "text-white" : "text-gray-900"}`}>{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className={`text-4xl font-extrabold ${p.highlight ? "text-white" : "text-gray-900"}`}>{p.price}</span>
                <span className={`text-sm ${p.highlight ? "text-white/80" : "text-gray-500"}`}>{p.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${p.highlight ? "text-white/90" : "text-gray-600"}`}>
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${p.highlight ? "text-white" : "text-green-500"}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={goLogin} className={`mt-8 w-full py-3 rounded-full font-semibold transition ${p.highlight ? "bg-white text-[#0b57d0] hover:bg-gray-100" : "bg-gray-900 text-white hover:bg-gray-800"}`}>
                Começar Agora
              </button>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="bg-gradient-to-b from-gray-50/50 to-white">
        <SectionTitle eyebrow="FAQ" title="Perguntas frequentes" />
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-semibold text-gray-900">{f.q}</span>
                <span className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#0b57d0] to-[#0b57d0] text-white flex items-center justify-center text-lg transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {openFaq === i && <div className="px-5 pb-5 text-gray-600 leading-relaxed">{f.a}</div>}
            </div>
          ))}
        </div>
      </Section>

      {/* CTA FINAL + LOGIN */}
      <section ref={loginRef} id="entrar" className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-blue-50" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Comece hoje a criar Presells que{" "}
              <span className="bg-gradient-to-r from-[#0b57d0] to-[#0b57d0] bg-clip-text text-transparent">realmente convertem</span>.
            </h2>
            <p className="mt-5 text-lg text-gray-500 max-w-lg">
              Junte-se a milhares de afiliados que já elevaram o nível das suas campanhas com o Presell Gads.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Setup em 2 minutos</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Suporte humano</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Cancelamento fácil</div>
            </div>
          </div>
          <LoginForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={presellGadsLogo.url} alt="Presell Gads" className="h-9 w-auto object-contain bg-white rounded-md p-1" />
            </div>
            <p className="max-w-sm text-sm leading-relaxed">A plataforma definitiva para criar presells otimizadas para campanhas de Google Ads.</p>
            <div className="flex items-center gap-3 mt-5">
              {[Facebook, Instagram, Twitter, Youtube].map((I, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-[#0b57d0] hover:to-[#0b57d0] flex items-center justify-center transition-all">
                  <I className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Produto</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#recursos" className="hover:text-white transition">Recursos</a></li>
              <li><a href="#precos" className="hover:text-white transition">Preços</a></li>
              <li><a href="#templates" className="hover:text-white transition">Templates</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Termos</a></li>
              <li><a href="#" className="hover:text-white transition">Privacidade</a></li>
              <li><a href="#" className="hover:text-white transition">Contato</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-xs text-gray-500 text-center">
          © 2026 Presell Gads. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Auth;
