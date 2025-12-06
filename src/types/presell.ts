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
  
  // Basic texts
  mainTitle: string;
  subtitle: string;
  description: string;
  ctaText: string;
  
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
  
  // Launch details
  launchDetails: string;
  
  // Language
  language: 'pt' | 'es' | 'en' | 'de';
}

export const defaultPresellData: PresellData = {
  logoImage: '',
  mainImage: '',
  favicon: '',
  mainTitle: '',
  subtitle: '',
  description: '',
  ctaText: '',
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
  launchDetails: '',
  language: 'pt',
};

export const translations = {
  pt: {
    mainTitle: 'Descubra o Produto Revolucionário',
    subtitle: 'A Solução que Você Estava Esperando',
    description: 'Este produto incrível vai transformar sua experiência e trazer resultados extraordinários para você.',
    ctaText: 'QUERO CONHECER AGORA',
    launchDetails: 'Lançamento exclusivo - Vagas limitadas!',
    terms: 'Termos de Uso',
    privacy: 'Política de Privacidade',
  },
  es: {
    mainTitle: 'Descubre el Producto Revolucionario',
    subtitle: 'La Solución que Estabas Esperando',
    description: 'Este producto increíble transformará tu experiencia y traerá resultados extraordinarios para ti.',
    ctaText: 'QUIERO CONOCER AHORA',
    launchDetails: '¡Lanzamiento exclusivo - Plazas limitadas!',
    terms: 'Términos de Uso',
    privacy: 'Política de Privacidad',
  },
  en: {
    mainTitle: 'Discover the Revolutionary Product',
    subtitle: 'The Solution You Were Waiting For',
    description: 'This incredible product will transform your experience and bring extraordinary results for you.',
    ctaText: 'I WANT TO KNOW NOW',
    launchDetails: 'Exclusive launch - Limited spots!',
    terms: 'Terms of Use',
    privacy: 'Privacy Policy',
  },
  de: {
    mainTitle: 'Entdecken Sie das Revolutionäre Produkt',
    subtitle: 'Die Lösung, auf die Sie Gewartet Haben',
    description: 'Dieses unglaubliche Produkt wird Ihre Erfahrung transformieren und außergewöhnliche Ergebnisse für Sie bringen.',
    ctaText: 'ICH MÖCHTE JETZT WISSEN',
    launchDetails: 'Exklusiver Start - Begrenzte Plätze!',
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
