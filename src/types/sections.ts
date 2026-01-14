export type SectionType = 
  | 'header'
  | 'hero'
  | 'about'
  | 'services'
  | 'products'
  | 'benefits'
  | 'testimonials'
  | 'portfolio'
  | 'faq'
  | 'team'
  | 'blog'
  | 'pricing'
  | 'cta'
  | 'contact'
  | 'newsletter'
  | 'map'
  | 'footer';

export type LayoutDirection = 'vertical' | 'horizontal' | 'two-columns' | 'two-columns-reverse';
export type GradientDirection = 'diagonal' | 'horizontal' | 'vertical' | 'radial';

export type TextType = 'title' | 'subtitle' | 'description';

export interface HighlightWords {
  enabled: boolean;
  words: string;
  color: string;
}

export interface GradientText {
  enabled: boolean;
  colors: string[];
}

export interface BackgroundOverlay {
  enabled: boolean;
  direction: 'vertical' | 'horizontal' | 'diagonal';
  color1: string;
  color2: string;
  opacity1: number;
  opacity2: number;
}

export interface ResponsiveSize {
  desktop: number;
  tablet: number;
  mobile: number;
}

export interface ResponsiveFontSize {
  desktop: string;
  tablet: string;
  mobile: string;
}

// Horizontal alignment per viewport
export type HorizontalAlign = 'left' | 'center' | 'right';

export interface ResponsiveAlign {
  desktop: HorizontalAlign;
  tablet: HorizontalAlign;
  mobile: HorizontalAlign;
}

export interface SectionElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'video';
  content: string;
  textType?: TextType;
  bold?: boolean;
  imageUrl?: string;
  videoUrl?: string;
  link?: string;
  fontSize?: string;
  color?: string;
  fontWeight?: string;
  highlightWords?: HighlightWords;
  gradientText?: GradientText;
  animation?: boolean;
  glowingBorder?: boolean;
  glowBorderColors?: string[];
  mediaWidth?: number;
  // Responsive sizes
  responsiveMediaWidth?: ResponsiveSize;
  responsiveFontSize?: ResponsiveFontSize;
  // Responsive horizontal alignment
  responsiveAlign?: ResponsiveAlign;
  // Inline group - elements with same group stay on same line
  inlineGroup?: string;
  // Opens lead popup instead of navigating to link
  opensPopup?: boolean;
}

export interface ResponsiveLayout {
  desktop: LayoutDirection;
  tablet: LayoutDirection;
  mobile: LayoutDirection;
}

export interface ResponsiveColumnSettings {
  desktop: {
    leftColumnElements?: string[];
    rightColumnElements?: string[];
    columnGap?: string;
    columnWidthRatio?: string;
  };
  tablet: {
    leftColumnElements?: string[];
    rightColumnElements?: string[];
    columnGap?: string;
    columnWidthRatio?: string;
  };
  mobile: {
    leftColumnElements?: string[];
    rightColumnElements?: string[];
    columnGap?: string;
    columnWidthRatio?: string;
  };
}

export interface PresellSection {
  id: string;
  type: SectionType;
  name: string;
  layout: LayoutDirection;
  // Responsive layout settings
  responsiveLayout?: ResponsiveLayout;
  responsiveColumnSettings?: ResponsiveColumnSettings;
  backgroundColor?: string;
  backgroundGradient?: {
    enabled: boolean;
    direction: GradientDirection;
    color1: string;
    color2: string;
    color3?: string;
  };
  backgroundImage?: string;
  backgroundOverlay?: BackgroundOverlay;
  textColor?: string;
  elements: SectionElement[];
  padding?: string;
  minHeight?: string;
  // Legacy - for backwards compatibility
  leftColumnElements?: string[];
  rightColumnElements?: string[];
  columnGap?: string;
  columnWidthRatio?: string;
}

export type HeaderPosition = 'left' | 'center' | 'right';

export interface FloatingHeader {
  enabled: boolean;
  backgroundColor: string;
  backgroundOpacity: number;
  blur: boolean;
  borderRadius: string;
  logoImage?: string;
  shadow: boolean;
  position: HeaderPosition;
  width: number;
}

export const sectionTemplates: Record<SectionType, { name: string; icon: string; defaultElements: SectionElement[] }> = {
  header: {
    name: 'Header',
    icon: '🔝',
    defaultElements: [
      { id: '1', type: 'text', content: 'Logo', fontSize: '24px', fontWeight: 'bold', color: '#ffffff' },
    ],
  },
  hero: {
    name: 'Hero',
    icon: '🦸',
    defaultElements: [
      { id: '1', type: 'text', content: 'Título Principal', fontSize: '48px', fontWeight: 'bold', color: '#ffffff' },
      { id: '2', type: 'text', content: 'Subtítulo descritivo do seu produto ou serviço', fontSize: '20px', color: '#cccccc' },
      { id: '3', type: 'button', content: 'Começar Agora', link: '#', color: '#ffffff' },
    ],
  },
  about: {
    name: 'Sobre',
    icon: 'ℹ️',
    defaultElements: [
      { id: '1', type: 'text', content: 'Sobre Nós', fontSize: '36px', fontWeight: 'bold', color: '#ffffff' },
      { id: '2', type: 'text', content: 'Descrição sobre a empresa ou produto. Conte sua história e valores.', fontSize: '18px', color: '#cccccc' },
    ],
  },
  services: {
    name: 'Serviços',
    icon: '⚙️',
    defaultElements: [
      { id: '1', type: 'text', content: 'Nossos Serviços', fontSize: '36px', fontWeight: 'bold', color: '#ffffff' },
      { id: '2', type: 'text', content: 'Serviço 1 - Descrição do serviço oferecido', fontSize: '18px', color: '#cccccc' },
      { id: '3', type: 'text', content: 'Serviço 2 - Descrição do serviço oferecido', fontSize: '18px', color: '#cccccc' },
      { id: '4', type: 'text', content: 'Serviço 3 - Descrição do serviço oferecido', fontSize: '18px', color: '#cccccc' },
    ],
  },
  products: {
    name: 'Produtos',
    icon: '📦',
    defaultElements: [
      { id: '1', type: 'text', content: 'Nossos Produtos', fontSize: '36px', fontWeight: 'bold', color: '#ffffff' },
      { id: '2', type: 'image', content: 'Produto', imageUrl: '' },
      { id: '3', type: 'text', content: 'Nome do Produto - R$ 99,90', fontSize: '20px', color: '#ffffff' },
    ],
  },
  benefits: {
    name: 'Benefícios',
    icon: '✅',
    defaultElements: [
      { id: '1', type: 'text', content: 'Benefícios', fontSize: '36px', fontWeight: 'bold', color: '#ffffff' },
      { id: '2', type: 'text', content: '✓ Benefício 1', fontSize: '18px', color: '#00ff88' },
      { id: '3', type: 'text', content: '✓ Benefício 2', fontSize: '18px', color: '#00ff88' },
      { id: '4', type: 'text', content: '✓ Benefício 3', fontSize: '18px', color: '#00ff88' },
    ],
  },
  testimonials: {
    name: 'Depoimentos',
    icon: '💬',
    defaultElements: [
      { id: '1', type: 'text', content: 'O que nossos clientes dizem', fontSize: '36px', fontWeight: 'bold', color: '#ffffff' },
      { id: '2', type: 'text', content: '"Excelente produto! Recomendo a todos." - Maria Silva', fontSize: '18px', color: '#cccccc' },
      { id: '3', type: 'text', content: '"Mudou minha vida! 5 estrelas." - João Santos', fontSize: '18px', color: '#cccccc' },
    ],
  },
  portfolio: {
    name: 'Portfólio',
    icon: '🖼️',
    defaultElements: [
      { id: '1', type: 'text', content: 'Nosso Portfólio', fontSize: '36px', fontWeight: 'bold', color: '#ffffff' },
      { id: '2', type: 'image', content: 'Projeto 1', imageUrl: '' },
      { id: '3', type: 'image', content: 'Projeto 2', imageUrl: '' },
    ],
  },
  faq: {
    name: 'FAQ',
    icon: '❓',
    defaultElements: [
      { id: '1', type: 'text', content: 'Perguntas Frequentes', fontSize: '36px', fontWeight: 'bold', color: '#ffffff' },
      { id: '2', type: 'text', content: 'Pergunta 1? - Resposta da pergunta 1.', fontSize: '18px', color: '#cccccc' },
      { id: '3', type: 'text', content: 'Pergunta 2? - Resposta da pergunta 2.', fontSize: '18px', color: '#cccccc' },
    ],
  },
  team: {
    name: 'Equipe',
    icon: '👥',
    defaultElements: [
      { id: '1', type: 'text', content: 'Nossa Equipe', fontSize: '36px', fontWeight: 'bold', color: '#ffffff' },
      { id: '2', type: 'image', content: 'Membro 1', imageUrl: '' },
      { id: '3', type: 'text', content: 'Nome - Cargo', fontSize: '18px', color: '#cccccc' },
    ],
  },
  blog: {
    name: 'Blog',
    icon: '📝',
    defaultElements: [
      { id: '1', type: 'text', content: 'Blog', fontSize: '36px', fontWeight: 'bold', color: '#ffffff' },
      { id: '2', type: 'text', content: 'Título do Post 1 - Resumo do conteúdo...', fontSize: '18px', color: '#cccccc' },
      { id: '3', type: 'text', content: 'Título do Post 2 - Resumo do conteúdo...', fontSize: '18px', color: '#cccccc' },
    ],
  },
  pricing: {
    name: 'Preços',
    icon: '💰',
    defaultElements: [
      { id: '1', type: 'text', content: 'Planos e Preços', fontSize: '36px', fontWeight: 'bold', color: '#ffffff' },
      { id: '2', type: 'text', content: 'Plano Básico - R$ 49/mês', fontSize: '24px', color: '#ffffff' },
      { id: '3', type: 'text', content: 'Plano Pro - R$ 99/mês', fontSize: '24px', color: '#00ff88' },
      { id: '4', type: 'button', content: 'Escolher Plano', link: '#' },
    ],
  },
  cta: {
    name: 'CTA',
    icon: '🎯',
    defaultElements: [
      { id: '1', type: 'text', content: 'Pronto para começar?', fontSize: '36px', fontWeight: 'bold', color: '#ffffff' },
      { id: '2', type: 'text', content: 'Não perca essa oportunidade única!', fontSize: '20px', color: '#cccccc' },
      { id: '3', type: 'button', content: 'Quero Começar Agora!', link: '#' },
    ],
  },
  contact: {
    name: 'Contato',
    icon: '📧',
    defaultElements: [
      { id: '1', type: 'text', content: 'Entre em Contato', fontSize: '36px', fontWeight: 'bold', color: '#ffffff' },
      { id: '2', type: 'text', content: 'Email: contato@empresa.com', fontSize: '18px', color: '#cccccc' },
      { id: '3', type: 'text', content: 'Telefone: (11) 99999-9999', fontSize: '18px', color: '#cccccc' },
    ],
  },
  newsletter: {
    name: 'Newsletter',
    icon: '📰',
    defaultElements: [
      { id: '1', type: 'text', content: 'Inscreva-se na nossa Newsletter', fontSize: '36px', fontWeight: 'bold', color: '#ffffff' },
      { id: '2', type: 'text', content: 'Receba novidades e ofertas exclusivas!', fontSize: '18px', color: '#cccccc' },
      { id: '3', type: 'button', content: 'Inscrever-se', link: '#' },
    ],
  },
  map: {
    name: 'Mapa',
    icon: '📍',
    defaultElements: [
      { id: '1', type: 'text', content: 'Nossa Localização', fontSize: '36px', fontWeight: 'bold', color: '#ffffff' },
      { id: '2', type: 'text', content: 'Rua Exemplo, 123 - Cidade, Estado', fontSize: '18px', color: '#cccccc' },
    ],
  },
  footer: {
    name: 'Footer',
    icon: '📋',
    defaultElements: [
      { id: '1', type: 'text', content: '© 2024 Sua Empresa. Todos os direitos reservados.', fontSize: '14px', color: '#888888' },
      { id: '2', type: 'text', content: 'Termos de Uso | Política de Privacidade', fontSize: '14px', color: '#888888' },
    ],
  },
};

export const sectionTypesList: SectionType[] = [
  'header', 'hero', 'about', 'services', 'products', 'benefits', 
  'testimonials', 'portfolio', 'faq', 'team', 'blog', 'pricing', 
  'cta', 'contact', 'newsletter', 'map', 'footer'
];
