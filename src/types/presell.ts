export interface PresellElement {
  id: string;
  type: 'title' | 'subtitle' | 'paragraph' | 'image' | 'cta';
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
  link?: string;
  // Button specific
  buttonColor?: string;
  buttonTextColor?: string;
  buttonGradient?: {
    enabled: boolean;
    color1: string;
    color2: string;
  };
}

export interface ButtonStyle {
  borderRadius: 'square' | 'rounded' | 'pill';
  shadow: boolean;
  neonGlow: boolean;
  floating: boolean;
  hoverEffect: boolean;
}

export interface PresellData {
  // Images
  logoImage: string;
  mainImage: string;
  favicon: string;
  
  // Page title (browser tab)
  pageTitle: string;
  
  // Links
  affiliateLink: string;
  termsLink: string;
  privacyLink: string;
  globalImageAffiliateLink: string;
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
  
  // Language
  language: 'pt' | 'es' | 'en' | 'de';
}

export const defaultPresellData: PresellData = {
  logoImage: '',
  mainImage: '',
  favicon: '',
  pageTitle: '',
  affiliateLink: '',
  termsLink: '',
  privacyLink: '',
  globalImageAffiliateLink: '',
  globalCtaAffiliateLink: '',
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
  language: 'pt',
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
