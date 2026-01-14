import { PresellData, defaultPresellData } from '@/types/presell';
import { PresellSection, SectionElement } from '@/types/sections';

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  level: 'simples' | 'intermediário' | 'avançado';
  preview: string;
  data: PresellData;
}

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// ===============================
// TEMPLATE 1: Blog Simples
// ===============================
const blogSections: PresellSection[] = [
  {
    id: generateId(),
    type: 'header',
    name: 'Header',
    layout: 'horizontal',
    backgroundColor: '#1a1a2e',
    padding: '1rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: '📝 MeuBlog', 
        fontSize: '24px', 
        fontWeight: 'bold', 
        color: '#ffffff',
        inlineGroup: 'linha-1',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Início', 
        fontSize: '14px', 
        color: '#cccccc',
        inlineGroup: 'linha-1',
        responsiveAlign: { desktop: 'right', tablet: 'right', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Artigos', 
        fontSize: '14px', 
        color: '#cccccc',
        inlineGroup: 'linha-1',
        responsiveAlign: { desktop: 'right', tablet: 'right', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Sobre', 
        fontSize: '14px', 
        color: '#cccccc',
        inlineGroup: 'linha-1',
        responsiveAlign: { desktop: 'right', tablet: 'right', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Contato', 
        fontSize: '14px', 
        color: '#cccccc',
        inlineGroup: 'linha-1',
        responsiveAlign: { desktop: 'right', tablet: 'right', mobile: 'center' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'hero',
    name: 'Hero',
    layout: 'vertical',
    backgroundColor: '#16213e',
    padding: '6rem 2rem',
    minHeight: '60vh',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Bem-vindo ao Blog', 
        fontSize: '48px', 
        fontWeight: 'bold', 
        color: '#ffffff',
        responsiveFontSize: { desktop: '48px', tablet: '36px', mobile: '28px' },
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Descubra artigos incríveis sobre tecnologia, lifestyle e muito mais.', 
        fontSize: '18px', 
        color: '#a0a0a0',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'button', 
        content: 'Ver Artigos', 
        link: '#',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'blog',
    name: 'Artigos Recentes',
    layout: 'vertical',
    backgroundColor: '#0f0f23',
    padding: '4rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Artigos Recentes', 
        fontSize: '36px', 
        fontWeight: 'bold', 
        color: '#ffffff',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '📌 Como criar um blog de sucesso em 2024', 
        fontSize: '20px', 
        color: '#00d4ff',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Aprenda as melhores práticas para criar e monetizar seu blog...', 
        fontSize: '16px', 
        color: '#888888',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '📌 Tendências de tecnologia para ficar de olho', 
        fontSize: '20px', 
        color: '#00d4ff',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Descubra as inovações que vão mudar o mundo nos próximos anos...', 
        fontSize: '16px', 
        color: '#888888',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '📌 Guia completo de produtividade', 
        fontSize: '20px', 
        color: '#00d4ff',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Técnicas comprovadas para aumentar sua produtividade diária...', 
        fontSize: '16px', 
        color: '#888888',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'footer',
    name: 'Footer',
    layout: 'vertical',
    backgroundColor: '#0a0a16',
    padding: '2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: '© 2024 MeuBlog. Todos os direitos reservados.', 
        fontSize: '14px', 
        color: '#666666',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
    ],
  },
];

const blogTemplate: PresellData = {
  ...defaultPresellData,
  pageTitle: 'MeuBlog - Artigos e Conteúdo',
  sections: blogSections,
  floatingHeader: {
    enabled: true,
    backgroundColor: '#1a1a2e',
    backgroundOpacity: 95,
    blur: true,
    borderRadius: '0px',
    shadow: true,
    position: 'center',
    width: 100,
  },
  colors: {
    ...defaultPresellData.colors,
    background: '#0f0f23',
    button: '#00d4ff',
    buttonText: '#000000',
  },
};

// ===============================
// TEMPLATE 2: Presell Review (Nutra)
// ===============================
const presellReviewSections: PresellSection[] = [
  {
    id: generateId(),
    type: 'hero',
    name: 'Chamada Principal',
    layout: 'vertical',
    backgroundGradient: {
      enabled: true,
      direction: 'vertical',
      color1: '#1a0a0a',
      color2: '#2d1515',
    },
    padding: '4rem 2rem',
    minHeight: '80vh',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: '⚠️ ATENÇÃO: Descoberta Científica', 
        fontSize: '16px', 
        color: '#ff4444',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'O Método Que Está Transformando a Vida de Milhares de Pessoas', 
        fontSize: '42px', 
        fontWeight: 'bold', 
        color: '#ffffff',
        highlightWords: { enabled: true, words: 'Transformando, Milhares', color: '#ff6b6b' },
        responsiveFontSize: { desktop: '42px', tablet: '32px', mobile: '24px' },
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Descubra o segredo que médicos e especialistas não querem que você saiba...', 
        fontSize: '20px', 
        color: '#cccccc',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'image', 
        content: 'Produto', 
        imageUrl: '',
        mediaWidth: 60,
        responsiveMediaWidth: { desktop: 60, tablet: 80, mobile: 100 },
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'button', 
        content: '👉 QUERO SABER MAIS', 
        link: '#',
        glowingBorder: true,
        glowBorderColors: ['#ff4444', '#ff6b6b'],
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'about',
    name: 'A História',
    layout: 'vertical',
    backgroundColor: '#1a1a1a',
    padding: '4rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Eu também sofri por anos...', 
        fontSize: '32px', 
        fontWeight: 'bold', 
        color: '#ffffff',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Durante muito tempo, eu tentei de tudo. Gastei fortunas em produtos que prometiam resultados milagrosos, mas nada funcionava. Até que um dia, um amigo médico me revelou um segredo que mudou completamente minha vida.', 
        fontSize: '18px', 
        color: '#cccccc',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Depois de 30 dias usando esse método, os resultados eram ABSURDOS. Pessoas começaram a perguntar o que eu estava fazendo diferente...', 
        fontSize: '18px', 
        color: '#cccccc',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'benefits',
    name: 'Benefícios',
    layout: 'vertical',
    backgroundColor: '#0f0f0f',
    padding: '4rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: 'O Que Você Vai Conquistar:', 
        fontSize: '32px', 
        fontWeight: 'bold', 
        color: '#ffffff',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '✅ Resultados visíveis em apenas 7 dias', 
        fontSize: '20px', 
        color: '#00ff88',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '✅ 100% natural e sem efeitos colaterais', 
        fontSize: '20px', 
        color: '#00ff88',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '✅ Aprovado por especialistas renomados', 
        fontSize: '20px', 
        color: '#00ff88',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '✅ Garantia de 90 dias ou seu dinheiro de volta', 
        fontSize: '20px', 
        color: '#00ff88',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'testimonials',
    name: 'Depoimentos',
    layout: 'vertical',
    backgroundColor: '#1a1a2e',
    padding: '4rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Veja o Que Estão Falando:', 
        fontSize: '32px', 
        fontWeight: 'bold', 
        color: '#ffffff',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '⭐⭐⭐⭐⭐ "Incrível! Em 2 semanas já vi diferença. Minha vida mudou completamente!" - Maria S.', 
        fontSize: '18px', 
        color: '#ffcc00',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '⭐⭐⭐⭐⭐ "Eu era cético, mas os resultados são reais. Recomendo demais!" - João P.', 
        fontSize: '18px', 
        color: '#ffcc00',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '⭐⭐⭐⭐⭐ "Finalmente encontrei algo que funciona de verdade!" - Ana C.', 
        fontSize: '18px', 
        color: '#ffcc00',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'cta',
    name: 'CTA Final',
    layout: 'vertical',
    backgroundGradient: {
      enabled: true,
      direction: 'radial',
      color1: '#2d1515',
      color2: '#1a0a0a',
    },
    padding: '4rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: '🔥 OFERTA ESPECIAL POR TEMPO LIMITADO', 
        fontSize: '24px', 
        fontWeight: 'bold', 
        color: '#ff4444',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'De R$ 297 por apenas R$ 97', 
        fontSize: '36px', 
        fontWeight: 'bold', 
        color: '#ffffff',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'button', 
        content: '👉 SIM! QUERO GARANTIR O MEU AGORA', 
        link: '#',
        glowingBorder: true,
        glowBorderColors: ['#ff4444', '#ff6b6b', '#ff8888'],
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '🔒 Compra 100% segura | Entrega imediata', 
        fontSize: '14px', 
        color: '#888888',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'footer',
    name: 'Footer',
    layout: 'vertical',
    backgroundColor: '#0a0a0a',
    padding: '2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: '© 2024 Todos os direitos reservados.', 
        fontSize: '14px', 
        color: '#666666',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
    ],
  },
];

const presellReviewTemplate: PresellData = {
  ...defaultPresellData,
  pageTitle: 'Descubra o Método Revolucionário',
  sections: presellReviewSections,
  floatingHeader: {
    enabled: false,
    backgroundColor: '#1a1a2e',
    backgroundOpacity: 80,
    blur: true,
    borderRadius: '16px',
    shadow: true,
    position: 'center',
    width: 60,
  },
  colors: {
    ...defaultPresellData.colors,
    background: '#0f0f0f',
    button: '#ff4444',
    buttonGradient: {
      enabled: true,
      color1: '#ff4444',
      color2: '#ff6b6b',
    },
    buttonText: '#ffffff',
  },
  buttonStyle: {
    ...defaultPresellData.buttonStyle,
    neonGlow: true,
  },
};

// ===============================
// TEMPLATE 3: Presell Robusta (Avançado)
// ===============================
const presellRobustaSections: PresellSection[] = [
  {
    id: generateId(),
    type: 'hero',
    name: 'Hero Premium',
    layout: 'vertical',
    backgroundGradient: {
      enabled: true,
      direction: 'diagonal',
      color1: '#0a192f',
      color2: '#112240',
      color3: '#1d3557',
    },
    padding: '5rem 2rem',
    minHeight: '100vh',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: '🏆 A SOLUÇÃO #1 DO MERCADO', 
        fontSize: '14px', 
        color: '#64ffda',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Transforme Sua Vida Com o Sistema Mais Completo Já Criado', 
        fontSize: '52px', 
        fontWeight: 'bold', 
        color: '#ffffff',
        gradientText: { enabled: true, colors: ['#ffffff', '#64ffda', '#00d4ff'] },
        responsiveFontSize: { desktop: '52px', tablet: '38px', mobile: '28px' },
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '+50.000 pessoas já transformaram suas vidas. Você será o próximo?', 
        fontSize: '22px', 
        color: '#a0aec0',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'video', 
        content: 'VSL Principal', 
        videoUrl: '',
        mediaWidth: 70,
        glowingBorder: true,
        glowBorderColors: ['#64ffda', '#00d4ff', '#7928ca'],
        responsiveMediaWidth: { desktop: 70, tablet: 90, mobile: 100 },
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'button', 
        content: '🚀 QUERO COMEÇAR AGORA', 
        link: '#',
        glowingBorder: true,
        glowBorderColors: ['#64ffda', '#00d4ff'],
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '✓ Acesso Imediato  •  ✓ Garantia de 30 dias  •  ✓ Suporte VIP', 
        fontSize: '14px', 
        color: '#64ffda',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'about',
    name: 'Problema',
    layout: 'vertical',
    backgroundColor: '#0a192f',
    padding: '5rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Você Está Cansado de...', 
        fontSize: '38px', 
        fontWeight: 'bold', 
        color: '#ffffff',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '❌ Tentar métodos que nunca funcionam', 
        fontSize: '22px', 
        color: '#ff6b6b',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '❌ Gastar dinheiro em soluções falsas', 
        fontSize: '22px', 
        color: '#ff6b6b',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '❌ Perder tempo com promessas vazias', 
        fontSize: '22px', 
        color: '#ff6b6b',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '❌ Se frustrar sem ver resultados', 
        fontSize: '22px', 
        color: '#ff6b6b',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Existe uma solução definitiva.', 
        fontSize: '28px', 
        fontWeight: 'bold', 
        color: '#64ffda',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'benefits',
    name: 'Solução',
    layout: 'vertical',
    backgroundGradient: {
      enabled: true,
      direction: 'vertical',
      color1: '#112240',
      color2: '#0a192f',
    },
    padding: '5rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: 'O Que Você Vai Receber:', 
        fontSize: '38px', 
        fontWeight: 'bold', 
        color: '#ffffff',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '📦 Módulo 1: Fundamentos Essenciais (Valor: R$ 297)', 
        fontSize: '20px', 
        color: '#64ffda',
        inlineGroup: 'linha-1',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '📦 Módulo 2: Estratégias Avançadas (Valor: R$ 497)', 
        fontSize: '20px', 
        color: '#64ffda',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '📦 Módulo 3: Implementação Prática (Valor: R$ 397)', 
        fontSize: '20px', 
        color: '#64ffda',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '🎁 BÔNUS: Comunidade VIP (Valor: R$ 997)', 
        fontSize: '20px', 
        color: '#ffd700',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '🎁 BÔNUS: Mentoria Individual (Valor: R$ 1.997)', 
        fontSize: '20px', 
        color: '#ffd700',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '🎁 BÔNUS: Templates Exclusivos (Valor: R$ 497)', 
        fontSize: '20px', 
        color: '#ffd700',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'testimonials',
    name: 'Prova Social',
    layout: 'vertical',
    backgroundColor: '#0a192f',
    padding: '5rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Resultados Reais de Pessoas Reais', 
        fontSize: '38px', 
        fontWeight: 'bold', 
        color: '#ffffff',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'image', 
        content: 'Depoimento 1', 
        imageUrl: '',
        mediaWidth: 80,
        responsiveMediaWidth: { desktop: 80, tablet: 90, mobile: 100 },
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '"Em apenas 60 dias, consegui resultados que não tive em 5 anos tentando sozinho. O investimento se pagou em 2 semanas!" - Carlos, 34 anos', 
        fontSize: '18px', 
        color: '#a0aec0',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'image', 
        content: 'Depoimento 2', 
        imageUrl: '',
        mediaWidth: 80,
        responsiveMediaWidth: { desktop: 80, tablet: 90, mobile: 100 },
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '"Eu era muito cética, mas decidi tentar. Hoje agradeço todos os dias por essa decisão. Mudou completamente minha vida!" - Fernanda, 28 anos', 
        fontSize: '18px', 
        color: '#a0aec0',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'faq',
    name: 'FAQ',
    layout: 'vertical',
    backgroundColor: '#112240',
    padding: '5rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Perguntas Frequentes', 
        fontSize: '38px', 
        fontWeight: 'bold', 
        color: '#ffffff',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '❓ Funciona para iniciantes?', 
        fontSize: '20px', 
        fontWeight: 'bold', 
        color: '#64ffda',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Sim! O método foi desenvolvido para funcionar tanto para iniciantes quanto para avançados.', 
        fontSize: '16px', 
        color: '#a0aec0',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '❓ Quanto tempo para ver resultados?', 
        fontSize: '20px', 
        fontWeight: 'bold', 
        color: '#64ffda',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'A maioria dos alunos vê resultados nas primeiras 2 semanas seguindo o método.', 
        fontSize: '16px', 
        color: '#a0aec0',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '❓ E se não funcionar para mim?', 
        fontSize: '20px', 
        fontWeight: 'bold', 
        color: '#64ffda',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Oferecemos garantia incondicional de 30 dias. Se não ficar satisfeito, devolvemos 100% do seu investimento.', 
        fontSize: '16px', 
        color: '#a0aec0',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'pricing',
    name: 'Oferta',
    layout: 'vertical',
    backgroundGradient: {
      enabled: true,
      direction: 'radial',
      color1: '#1d3557',
      color2: '#0a192f',
    },
    padding: '5rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: '🔥 OFERTA ESPECIAL - APENAS HOJE 🔥', 
        fontSize: '24px', 
        fontWeight: 'bold', 
        color: '#ff6b6b',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Valor Total: R$ 4.682', 
        fontSize: '22px', 
        color: '#666666',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Por apenas:', 
        fontSize: '20px', 
        color: '#a0aec0',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '12x R$ 29,70', 
        fontSize: '52px', 
        fontWeight: 'bold', 
        color: '#64ffda',
        gradientText: { enabled: true, colors: ['#64ffda', '#00d4ff'] },
        responsiveFontSize: { desktop: '52px', tablet: '42px', mobile: '36px' },
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'ou R$ 297 à vista', 
        fontSize: '18px', 
        color: '#a0aec0',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'button', 
        content: '👉 GARANTIR MINHA VAGA AGORA', 
        link: '#',
        glowingBorder: true,
        glowBorderColors: ['#64ffda', '#00d4ff', '#7928ca'],
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '🔒 Pagamento 100% seguro | 🏆 Satisfação garantida | 📱 Acesso imediato', 
        fontSize: '14px', 
        color: '#64ffda',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'cta',
    name: 'Urgência',
    layout: 'vertical',
    backgroundColor: '#0a192f',
    padding: '4rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: '⏰ ATENÇÃO: Esta oferta expira em breve!', 
        fontSize: '28px', 
        fontWeight: 'bold', 
        color: '#ff6b6b',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Restam apenas 23 vagas com este preço promocional. Depois disso, o valor volta ao normal.', 
        fontSize: '18px', 
        color: '#a0aec0',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'button', 
        content: '🚀 QUERO GARANTIR MINHA VAGA', 
        link: '#',
        glowingBorder: true,
        glowBorderColors: ['#ff6b6b', '#ff4444'],
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'footer',
    name: 'Footer',
    layout: 'vertical',
    backgroundColor: '#050a14',
    padding: '3rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: '© 2024 Sistema Premium. Todos os direitos reservados.', 
        fontSize: '14px', 
        color: '#4a5568',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Este site não faz parte do Facebook ou Google. Resultados podem variar.', 
        fontSize: '12px', 
        color: '#2d3748',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
    ],
  },
];

const presellRobustaTemplate: PresellData = {
  ...defaultPresellData,
  pageTitle: 'Sistema Premium - Transforme Sua Vida',
  sections: presellRobustaSections,
  floatingHeader: {
    enabled: true,
    backgroundColor: '#0a192f',
    backgroundOpacity: 95,
    blur: true,
    borderRadius: '0px',
    shadow: true,
    position: 'center',
    width: 100,
  },
  colors: {
    ...defaultPresellData.colors,
    background: '#0a192f',
    button: '#64ffda',
    buttonGradient: {
      enabled: true,
      color1: '#64ffda',
      color2: '#00d4ff',
    },
    buttonText: '#0a192f',
    accent: '#64ffda',
  },
  buttonStyle: {
    ...defaultPresellData.buttonStyle,
    borderRadius: 'rounded',
    neonGlow: true,
    hoverEffect: true,
  },
};

// ===============================
// TEMPLATE 4: Review Produto (Estilo ProDentim)
// ===============================
const reviewProdutoSections: PresellSection[] = [
  {
    id: generateId(),
    type: 'hero',
    name: 'Hero Produto',
    layout: 'vertical',
    backgroundColor: '#ffffff',
    padding: '3rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: '⭐⭐⭐⭐⭐ A partir de R$79 por unidade', 
        fontSize: '14px', 
        color: '#374151',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '(77.856 Avaliações)', 
        fontSize: '12px', 
        color: '#6b7280',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'NomeProduto', 
        fontSize: '48px', 
        fontWeight: 'bold', 
        color: '#111827',
        responsiveFontSize: { desktop: '48px', tablet: '36px', mobile: '28px' },
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Este produto é a revolução que você precisa. Com sua fórmula inovadora, é uma solução testada e comprovada para restaurar sua saúde e bem-estar!', 
        fontSize: '20px', 
        color: '#374151',
        inlineGroup: 'linha-1',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'image', 
        content: 'Imagem do Produto', 
        imageUrl: '',
        mediaWidth: 45,
        inlineGroup: 'linha-1',
        responsiveMediaWidth: { desktop: 45, tablet: 60, mobile: 100 },
        responsiveAlign: { desktop: 'right', tablet: 'center', mobile: 'center' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'benefits',
    name: 'Lista de Benefícios',
    layout: 'vertical',
    backgroundColor: '#ffffff',
    padding: '2rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: '✅ Benefício principal do produto aqui', 
        fontSize: '18px', 
        color: '#111827',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '✅ Segundo benefício importante', 
        fontSize: '18px', 
        color: '#111827',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '✅ Terceiro benefício comprovado', 
        fontSize: '18px', 
        color: '#111827',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '✅ Quarto benefício exclusivo', 
        fontSize: '18px', 
        color: '#111827',
        responsiveAlign: { desktop: 'left', tablet: 'left', mobile: 'left' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'about',
    name: 'Selos de Confiança',
    layout: 'horizontal',
    backgroundColor: '#ffffff',
    padding: '2rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: '🏆 GMP Certified', 
        fontSize: '14px', 
        color: '#6b7280',
        inlineGroup: 'linha-1',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '🛡️ ANVISA Approved', 
        fontSize: '14px', 
        color: '#6b7280',
        inlineGroup: 'linha-1',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '🌿 100% Natural', 
        fontSize: '14px', 
        color: '#6b7280',
        inlineGroup: 'linha-1',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '🇧🇷 Made in Brazil', 
        fontSize: '14px', 
        color: '#6b7280',
        inlineGroup: 'linha-1',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'pricing',
    name: 'Caixas de Preço',
    layout: 'vertical',
    backgroundColor: '#f9fafb',
    padding: '4rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Escolha Sua Oferta', 
        fontSize: '32px', 
        fontWeight: 'bold', 
        color: '#111827',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'image', 
        content: 'Imagem Oferta 1', 
        imageUrl: '',
        mediaWidth: 25,
        inlineGroup: 'linha-2',
        responsiveMediaWidth: { desktop: 25, tablet: 45, mobile: 100 },
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'image', 
        content: 'Imagem Oferta 2 (Destaque)', 
        imageUrl: '',
        mediaWidth: 30,
        inlineGroup: 'linha-2',
        responsiveMediaWidth: { desktop: 30, tablet: 50, mobile: 100 },
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'image', 
        content: 'Imagem Oferta 3', 
        imageUrl: '',
        mediaWidth: 25,
        inlineGroup: 'linha-2',
        responsiveMediaWidth: { desktop: 25, tablet: 45, mobile: 100 },
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '📦 3 UNIDADES\n90 dias de uso\nR$58/unidade\nECONOMIZE R$390\n👥 5.920 pessoas compraram', 
        fontSize: '16px', 
        color: '#374151',
        inlineGroup: 'linha-3',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '🏆 6 UNIDADES - MAIS VENDIDO\n180 dias de uso\nR$49/unidade\nECONOMIZE R$620\n👥 8.374 pessoas compraram', 
        fontSize: '18px', 
        fontWeight: 'bold',
        color: '#16a34a',
        inlineGroup: 'linha-3',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: '📦 2 UNIDADES\n60 dias de uso\nR$59/unidade\nECONOMIZE R$200\n👥 3.248 pessoas compraram', 
        fontSize: '16px', 
        color: '#374151',
        inlineGroup: 'linha-3',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'button', 
        content: 'COMPRAR AGORA ➡️', 
        link: '#',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'cta',
    name: 'Garantia',
    layout: 'vertical',
    backgroundColor: '#ffffff',
    padding: '3rem 2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: '🛡️ GARANTIA DE 60 DIAS', 
        fontSize: '28px', 
        fontWeight: 'bold', 
        color: '#16a34a',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Se você não ficar 100% satisfeito, devolvemos seu dinheiro. Sem perguntas!', 
        fontSize: '18px', 
        color: '#374151',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
    ],
  },
  {
    id: generateId(),
    type: 'footer',
    name: 'Footer',
    layout: 'vertical',
    backgroundColor: '#f3f4f6',
    padding: '2rem',
    elements: [
      { 
        id: generateId(), 
        type: 'text', 
        content: '© 2024 NomeProduto. Todos os direitos reservados.', 
        fontSize: '14px', 
        color: '#6b7280',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
      { 
        id: generateId(), 
        type: 'text', 
        content: 'Este site não faz parte do Facebook, Google ou qualquer outra plataforma. Resultados podem variar de pessoa para pessoa.', 
        fontSize: '12px', 
        color: '#9ca3af',
        responsiveAlign: { desktop: 'center', tablet: 'center', mobile: 'center' }
      },
    ],
  },
];

const reviewProdutoTemplate: PresellData = {
  ...defaultPresellData,
  pageTitle: 'NomeProduto - Solução Natural',
  sections: reviewProdutoSections,
  floatingHeader: {
    enabled: true,
    backgroundColor: '#16a34a',
    backgroundOpacity: 100,
    blur: false,
    borderRadius: '0px',
    shadow: true,
    position: 'center',
    width: 100,
  },
  colors: {
    ...defaultPresellData.colors,
    background: '#ffffff',
    button: '#16a34a',
    buttonText: '#ffffff',
  },
  buttonStyle: {
    ...defaultPresellData.buttonStyle,
    borderRadius: 'rounded',
    neonGlow: false,
    hoverEffect: true,
  },
};

// ===============================
// EXPORTAÇÃO DOS TEMPLATES
// ===============================
export const pageTemplates: PageTemplate[] = [
  {
    id: 'review-produto',
    name: 'Review Produto (Estilo ProDentim)',
    description: 'Página de review com header verde, texto+imagem lado a lado, lista de benefícios, selos de confiança e caixas de preço.',
    level: 'intermediário',
    preview: '💊',
    data: reviewProdutoTemplate,
  },
  {
    id: 'blog-simples',
    name: 'Blog Simples',
    description: 'Layout limpo com barra de navegação, seções de artigos e footer. Perfeito para blogs e sites de conteúdo.',
    level: 'simples',
    preview: '📝',
    data: blogTemplate,
  },
  {
    id: 'presell-review',
    name: 'Presell Review (Nutra)',
    description: 'Página de vendas estilo nutra com storytelling, benefícios, depoimentos e CTA urgente.',
    level: 'intermediário',
    preview: '⭐',
    data: presellReviewTemplate,
  },
  {
    id: 'presell-robusta',
    name: 'Presell Robusta Premium',
    description: 'Página completa com VSL, problemas/soluções, prova social, FAQ, oferta detalhada e urgência.',
    level: 'avançado',
    preview: '🚀',
    data: presellRobustaTemplate,
  },
];
