export interface PresellElement {
  id: string;
  type: 'title' | 'subtitle' | 'paragraph' | 'image' | 'cta';
  content: string;
  fontSize?: string;
  fontFamily?: string;
  color?: string;
  imageUrl?: string;
  link?: string;
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
  
  // Links
  affiliateLink: string;
  termsLink: string;
  privacyLink: string;
  
  // Colors
  colors: {
    background: string;
    text: string;
    button: string;
    buttonText: string;
    accent: string;
  };
  
  // Fonts
  fonts: {
    title: string;
    body: string;
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
  mainTitle: 'Descubra o Produto Revolucionário',
  subtitle: 'A Solução que Você Estava Esperando',
  description: 'Este produto incrível vai transformar sua experiência e trazer resultados extraordinários para você.',
  ctaText: 'QUERO CONHECER AGORA',
  affiliateLink: 'https://exemplo.com/produto',
  termsLink: 'https://exemplo.com/termos',
  privacyLink: 'https://exemplo.com/privacidade',
  colors: {
    background: '#ffffff',
    text: '#1a1a1a',
    button: '#FF6A00',
    buttonText: '#ffffff',
    accent: '#FF2D55',
  },
  fonts: {
    title: 'Inter',
    body: 'Inter',
  },
  elements: [],
  launchDetails: 'Lançamento exclusivo - Vagas limitadas!',
  language: 'pt',
};
