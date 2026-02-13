import { PresellSection, FloatingHeader } from './sections';

export interface PresellElement {
  id: string;
  type: 'title' | 'subtitle' | 'paragraph' | 'image' | 'cta' | 'video';
  content: string;
  fontSize?: string;
  fontFamily?: string;
  color?: string;
  gradientColors?: {
    enabled: boolean;
    color1: string;
    color2: string;
    color3: string;
  };
  imageUrl?: string;
  videoUrl?: string;
  link?: string;
  // Size control for images/videos (percentage)
  mediaWidth?: number;
  // Button specific
  buttonColor?: string;
  buttonTextColor?: string;
  buttonGradient?: {
    enabled: boolean;
    color1: string;
    color2: string;
  };
  // Popup trigger
  opensPopup?: boolean;
}

export type ButtonTemplate = 'default' | 'shiny-green';

export interface ButtonStyle {
  borderRadius: 'square' | 'rounded' | 'pill';
  shadow: boolean;
  neonGlow: boolean;
  floating: boolean;
  hoverEffect: boolean;
  template: ButtonTemplate;
}

export interface PopupConfig {
  enabled: boolean;
  title: string;
  fullNameRequired: boolean;
  emailRequired: boolean;
  phoneRequired: boolean;
  buttonStyle: 'gradient' | 'solid' | 'outline' | 'rounded';
  buttonText: string;
  redirectUrl: string;
  buttonColor: string;
  // Popup styling
  popupBackgroundColor: string;
  popupTextColor: string;
  // Privacy/Terms in footer
  privacyTextColor: string;
  privacyLink: string;
  termsLink: string;
  showPrivacyTerms: boolean;
}

export interface CookieBannerConfig {
  showInPreview: boolean;
  text: string;
  backgroundColor: string;
  textColor: string;
  buttonAcceptBg: string;
  buttonAcceptText: string;
  linkColor: string;
  acceptText: string;
}

export interface FooterStyle {
  backgroundColor: string;
  textColor: string;
  showSections: boolean;
  termsText?: string;
  privacyText?: string;
  linksColor?: string;
  customText?: string;
  copyrightText?: string;
}

export interface TopLogoConfig {
  enabled: boolean;
  imageUrl: string;
  size: number; // percentage width
  position: 'left' | 'center' | 'right';
}

export interface PresellData {
  // Images
  logoImage: string;
  favicon: string;
  
  // Top Logo (when floating header is disabled)
  topLogo: TopLogoConfig;
  
  // Page title (browser tab)
  pageTitle: string;
  
  // Links
  affiliateLink: string;
  termsLink: string;
  privacyLink: string;
  globalImageAffiliateLink: string;
  
  // IP Tracking
  ipTracking: {
    enabled: boolean;
    url: string;
  };
  globalCtaAffiliateLink: string;
  
  // WhatsApp button
  whatsappEnabled: boolean;
  whatsappLink: string;
  
  // Colors
  colors: {
    background: string;
    backgroundGradient: {
      enabled: boolean;
      color1: string;
      color2: string;
    };
    backgroundGradient3?: {
      enabled: boolean;
      color1: string;
      color2: string;
      color3: string;
    };
    backgroundGradient4?: {
      enabled: boolean;
      color1: string;
      color2: string;
      color3: string;
      color4: string;
    };
    text: string;
    textGradient: {
      enabled: boolean;
      color1: string;
      color2: string;
      color3: string;
    };
    button: string;
    buttonGradient: {
      enabled: boolean;
      color1: string;
      color2: string;
    };
    buttonText: string;
    accent: string;
  };
  
  // Button style
  buttonStyle: ButtonStyle;
  
  // Fonts
  fonts: {
    title: string;
    body: string;
  };
  
  // Font sizes
  fontSizes: {
    mainTitle: string;
    subtitle: string;
    description: string;
    ctaButton: string;
  };
  
  // Dynamic elements
  elements: PresellElement[];
  
  // Sections
  sections: PresellSection[];
  floatingHeader: FloatingHeader;
  
  // Footer
  footerStyle: FooterStyle;
  
  // Language
  language: 'pt' | 'es' | 'en' | 'de';
  
  // Consent Banner
  consentBannerText: string;
  
  // Cookie Banner Config
  cookieBanner: CookieBannerConfig;
  
  // Lead Popup
  popupConfig: PopupConfig;
}

export const defaultPresellData: PresellData = {
  logoImage: '',
  favicon: '',
  topLogo: {
    enabled: false,
    imageUrl: '',
    size: 150,
    position: 'center',
  },
  pageTitle: '',
  affiliateLink: '',
  termsLink: '',
  privacyLink: '',
  globalImageAffiliateLink: '',
  globalCtaAffiliateLink: '',
  ipTracking: {
    enabled: false,
    url: '',
  },
  whatsappEnabled: false,
  whatsappLink: '',
  colors: {
    background: '#0f0f0f',
    backgroundGradient: {
      enabled: false,
      color1: '#0f0f0f',
      color2: '#1a1a2e',
    },
    backgroundGradient3: {
      enabled: false,
      color1: '#0f0f0f',
      color2: '#1a1a2e',
      color3: '#16213e',
    },
    backgroundGradient4: {
      enabled: false,
      color1: '#0f0f0f',
      color2: '#1a1a2e',
      color3: '#16213e',
      color4: '#0f3460',
    },
    text: '#ffffff',
    textGradient: {
      enabled: false,
      color1: '#ffffff',
      color2: '#a0a0a0',
      color3: '#606060',
    },
    button: '#FF6A00',
    buttonGradient: {
      enabled: false,
      color1: '#FF6A00',
      color2: '#FF2D55',
    },
    buttonText: '#ffffff',
    accent: '#FF2D55',
  },
  buttonStyle: {
    borderRadius: 'rounded',
    shadow: true,
    neonGlow: false,
    floating: false,
    hoverEffect: true,
    template: 'default',
  },
  fonts: {
    title: 'Poppins',
    body: 'Poppins',
  },
  fontSizes: {
    mainTitle: '48px',
    subtitle: '32px',
    description: '20px',
    ctaButton: '20px',
  },
  elements: [],
  sections: [],
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
  footerStyle: {
    backgroundColor: '#0a0a0a',
    textColor: '#888888',
    showSections: true,
    termsText: '',
    privacyText: '',
    linksColor: '#888888',
    customText: '',
    copyrightText: `© ${new Date().getFullYear()} Todos os direitos reservados.`,
  },
  language: 'pt',
  consentBannerText: 'Utilizamos cookies apenas após o seu consentimento, conforme nossa',
  cookieBanner: {
    showInPreview: false,
    text: 'Utilizamos cookies apenas após o seu consentimento, conforme nossa',
    backgroundColor: '#1a1a2e',
    textColor: '#ffffff',
    buttonAcceptBg: '#8B5CF6',
    buttonAcceptText: '#ffffff',
    linkColor: '#8B5CF6',
    acceptText: 'Aceitar',
  },
  popupConfig: {
    enabled: false,
    title: 'Cadastre-se',
    fullNameRequired: true,
    emailRequired: true,
    phoneRequired: false,
    buttonStyle: 'gradient',
    buttonText: 'Enviar',
    redirectUrl: '',
    buttonColor: '#8B5CF6',
    popupBackgroundColor: '#1a1a2e',
    popupTextColor: '#ffffff',
    privacyTextColor: '#888888',
    privacyLink: '',
    termsLink: '',
    showPrivacyTerms: true,
  },
};

export const translations = {
  pt: {
    terms: 'Termos de Uso',
    privacy: 'Política de Privacidade',
  },
  es: {
    terms: 'Términos de Uso',
    privacy: 'Política de Privacidad',
  },
  en: {
    terms: 'Terms of Use',
    privacy: 'Privacy Policy',
  },
  de: {
    terms: 'Nutzungsbedingungen',
    privacy: 'Datenschutzrichtlinie',
  },
};

export const availableFonts = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Raleway', value: 'Raleway' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Merriweather', value: 'Merriweather' },
  { name: 'Nunito', value: 'Nunito' },
];

// Translation function for user content
export const translateText = async (text: string, targetLang: string): Promise<string> => {
  // Simple translation mapping for common words/phrases
  // In a real app, you'd use an API like Google Translate
  const commonTranslations: Record<string, Record<string, string>> = {
    'Novo Título': {
      pt: 'Novo Título',
      es: 'Nuevo Título',
      en: 'New Title',
      de: 'Neuer Titel',
    },
    'Novo Subtítulo': {
      pt: 'Novo Subtítulo',
      es: 'Nuevo Subtítulo',
      en: 'New Subtitle',
      de: 'Neuer Untertitel',
    },
    'Novo parágrafo': {
      pt: 'Novo parágrafo',
      es: 'Nuevo párrafo',
      en: 'New paragraph',
      de: 'Neuer Absatz',
    },
    'Clique Aqui': {
      pt: 'Clique Aqui',
      es: 'Haga Clic Aquí',
      en: 'Click Here',
      de: 'Klicken Sie Hier',
    },
  };

  if (commonTranslations[text] && commonTranslations[text][targetLang]) {
    return commonTranslations[text][targetLang];
  }

  return text;
};
