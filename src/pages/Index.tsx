import { useState, useEffect } from 'react';
import { TopBar } from '@/components/TopBar';
import { EditorPanel } from '@/components/EditorPanel';
import { PreviewPanel } from '@/components/PreviewPanel';
import { PresellData, PresellElement, defaultPresellData, translations } from '@/types/presell';
import { toast } from '@/hooks/use-toast';
import JSZip from 'jszip';

const Index = () => {
  const [presellData, setPresellData] = useState<PresellData>(defaultPresellData);
  const [darkMode, setDarkMode] = useState(true); // Dark mode by default

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Update texts when language changes
  useEffect(() => {
    const t = translations[presellData.language];
    setPresellData(prev => ({
      ...prev,
      mainTitle: prev.mainTitle || t.mainTitle,
      subtitle: prev.subtitle || t.subtitle,
      description: prev.description || t.description,
      ctaText: prev.ctaText || t.ctaText,
      launchDetails: prev.launchDetails || t.launchDetails,
    }));
  }, [presellData.language]);

  const handleUpdateElements = (elements: PresellElement[]) => {
    setPresellData(prev => ({ ...prev, elements }));
  };

  const handleDownload = async () => {
    try {
      const zip = new JSZip();
      const t = translations[presellData.language];
      
      const html = generateHTML(presellData, t);
      const css = generateCSS(presellData);
      
      const fullHtml = `<!DOCTYPE html>
<html lang="${presellData.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${presellData.pageTitle || presellData.mainTitle || 'Presell'}</title>
  ${presellData.favicon ? `<link rel="icon" href="public/favicon.png">` : ''}
  <style>${css}</style>
</head>
<body>
${html}
</body>
</html>`;

      zip.file('index.html', fullHtml);
      zip.file('style.css', css);
      
      const publicFolder = zip.folder('public');
      
      if (presellData.logoImage && publicFolder) {
        const logoData = presellData.logoImage.split(',')[1];
        publicFolder.file('logo.png', logoData, { base64: true });
      }
      
      if (presellData.mainImage && publicFolder) {
        const mainImageData = presellData.mainImage.split(',')[1];
        publicFolder.file('main-image.png', mainImageData, { base64: true });
      }
      
      if (presellData.favicon && publicFolder) {
        const faviconData = presellData.favicon.split(',')[1];
        publicFolder.file('favicon.png', faviconData, { base64: true });
      }
      
      presellData.elements.forEach((el, index) => {
        if (el.type === 'image' && el.imageUrl && publicFolder) {
          const imageData = el.imageUrl.split(',')[1];
          publicFolder.file(`element-${index}.png`, imageData, { base64: true });
        }
      });
      
      const content = await zip.generateAsync({ type: 'blob' });
      
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'presell.zip';
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Download iniciado!',
        description: 'Sua presell está sendo baixada em formato ZIP.',
      });
    } catch (error) {
      toast({
        title: 'Erro no download',
        description: 'Ocorreu um erro ao gerar o arquivo ZIP.',
        variant: 'destructive',
      });
    }
  };

  const generateHTML = (data: PresellData, t: typeof translations.pt): string => {
    const getButtonClasses = () => {
      let classes = 'cta-button';
      if (data.buttonStyle.neonGlow) classes += ' neon-glow';
      if (data.buttonStyle.hoverEffect) classes += ' hover-effect';
      return classes;
    };

    return `
  <div class="container">
    ${data.logoImage ? `<div class="logo"><img src="public/logo.png" alt="Logo"></div>` : ''}
    
    <div class="content">
      ${data.mainImage ? `<a href="${data.globalImageAffiliateLink || data.affiliateLink}"><img src="public/main-image.png" alt="Produto" class="main-image"></a>` : ''}
      
      ${data.mainTitle ? `<h1 class="main-title">${data.mainTitle}</h1>` : ''}
      ${data.subtitle ? `<h2 class="subtitle">${data.subtitle}</h2>` : ''}
      ${data.description ? `<p class="description">${data.description}</p>` : ''}
      
      ${data.launchDetails ? `<div class="launch-badge">${data.launchDetails}</div>` : ''}
      
      ${data.ctaText ? `<a href="${data.globalCtaAffiliateLink || data.affiliateLink}" class="${getButtonClasses()}">${data.ctaText}</a>` : ''}
      
      ${data.elements.map((el, index) => {
        const getElementStyle = () => {
          if (el.gradientColors?.enabled) {
            return `background: linear-gradient(135deg, ${el.gradientColors.color1}, ${el.gradientColors.color2}, ${el.gradientColors.color3}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size:${el.fontSize}`;
          }
          return `font-size:${el.fontSize};color:${el.color}`;
        };

        if (el.type === 'title') return `<h2 style="${getElementStyle()}">${el.content}</h2>`;
        if (el.type === 'subtitle') return `<h3 style="${getElementStyle()}">${el.content}</h3>`;
        if (el.type === 'paragraph') return `<p style="${getElementStyle()}">${el.content}</p>`;
        if (el.type === 'image' && el.imageUrl) return `<a href="${data.globalImageAffiliateLink || data.affiliateLink}"><img src="public/element-${index}.png" alt="Elemento" class="element-image"></a>`;
        if (el.type === 'cta') return `<a href="${el.link || data.globalCtaAffiliateLink || data.affiliateLink}" class="${getButtonClasses()}">${el.content}</a>`;
        return '';
      }).join('')}
    </div>
    
    ${(data.termsLink || data.privacyLink) ? `
    <footer>
      ${data.termsLink ? `<a href="${data.termsLink}">${t.terms}</a>` : ''}
      ${data.termsLink && data.privacyLink ? `<span>|</span>` : ''}
      ${data.privacyLink ? `<a href="${data.privacyLink}">${t.privacy}</a>` : ''}
    </footer>
    ` : ''}
    
    ${data.whatsappEnabled && data.whatsappLink ? `
    <a href="${data.whatsappLink}" class="whatsapp-button">
      <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
    ` : ''}
  </div>
    `;
  };

  const generateCSS = (data: PresellData): string => {
    const getBackground = () => {
      if (data.colors.backgroundGradient.enabled) {
        return `linear-gradient(135deg, ${data.colors.backgroundGradient.color1}, ${data.colors.backgroundGradient.color2})`;
      }
      return data.colors.background;
    };

    const getTextColor = () => {
      if (data.colors.textGradient.enabled) {
        return `
          background: linear-gradient(135deg, ${data.colors.textGradient.color1}, ${data.colors.textGradient.color2}, ${data.colors.textGradient.color3});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        `;
      }
      return `color: ${data.colors.text};`;
    };

    const getButtonBackground = () => {
      if (data.colors.buttonGradient.enabled) {
        return `linear-gradient(135deg, ${data.colors.buttonGradient.color1}, ${data.colors.buttonGradient.color2})`;
      }
      return data.colors.button;
    };

    const getBorderRadius = () => {
      switch (data.buttonStyle.borderRadius) {
        case 'square': return '0';
        case 'rounded': return '0.5rem';
        case 'pill': return '9999px';
        default: return '0.5rem';
      }
    };

    const getButtonShadow = () => {
      if (data.buttonStyle.neonGlow) {
        const glowColor = data.colors.buttonGradient.enabled 
          ? data.colors.buttonGradient.color1 
          : data.colors.button;
        return `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 0 60px ${glowColor}`;
      }
      if (data.buttonStyle.shadow) {
        return '0 4px 15px rgba(0,0,0,0.3)';
      }
      return 'none';
    };

    return `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  font-family: ${data.fonts.body}, sans-serif; 
  background: ${getBackground()}; 
  ${getTextColor()}
  line-height: 1.6;
  min-height: 100vh;
}
.container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
.logo { margin-bottom: 2rem; }
.logo img { height: 4rem; }
.content { text-align: center; }
.main-image { 
  width: 100%; 
  max-width: 700px; 
  border-radius: 1rem; 
  margin-bottom: 2rem; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  transition: transform 0.3s;
}
.main-image:hover { transform: scale(1.05); }
.element-image { 
  width: 100%; 
  max-width: 700px; 
  border-radius: 1rem; 
  margin: 2rem auto; 
  display: block;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  transition: transform 0.3s;
}
.element-image:hover { transform: scale(1.05); }
.main-title { 
  font-family: ${data.fonts.title}, sans-serif;
  font-size: ${data.fontSizes.mainTitle}; 
  font-weight: bold; 
  margin-bottom: 1rem; 
  ${getTextColor()}
}
.subtitle { 
  font-size: ${data.fontSizes.subtitle}; 
  color: ${data.colors.accent}; 
  margin-bottom: 1.5rem; 
  font-weight: 600;
}
.description { 
  font-size: ${data.fontSizes.description}; 
  margin-bottom: 2rem; 
  max-width: 800px; 
  margin-left: auto; 
  margin-right: auto;
}
.launch-badge { 
  display: inline-block; 
  background: ${data.colors.accent}; 
  color: white; 
  padding: 0.75rem 1.5rem; 
  border-radius: 2rem; 
  font-weight: 600; 
  margin-bottom: 2rem;
}
.cta-button { 
  display: inline-block; 
  background: ${getButtonBackground()}; 
  color: ${data.colors.buttonText}; 
  padding: 1.25rem 3rem; 
  border-radius: ${getBorderRadius()}; 
  font-size: ${data.fontSizes.ctaButton}; 
  font-weight: bold; 
  text-decoration: none; 
  margin: 1rem 0;
  transition: all 0.3s ease;
  box-shadow: ${getButtonShadow()};
}
.cta-button.hover-effect:hover { 
  opacity: 0.9; 
  transform: scale(1.05);
}
.cta-button.neon-glow {
  animation: neonPulse 2s ease-in-out infinite;
}
@keyframes neonPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
.whatsapp-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #25D366;
  padding: 1rem;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(37, 211, 102, 0.8), 0 0 40px rgba(37, 211, 102, 0.5);
  animation: neonPulse 2s ease-in-out infinite;
  transition: transform 0.3s;
  z-index: 1000;
}
.whatsapp-button:hover {
  transform: scale(1.1);
}
footer { 
  margin-top: 4rem; 
  padding-top: 2rem; 
  border-top: 1px solid rgba(255,255,255,0.2); 
  text-align: center; 
  font-size: 0.875rem;
  opacity: 0.7;
}
footer a { color: inherit; text-decoration: none; }
footer a:hover { text-decoration: underline; }
@media (max-width: 768px) {
  .main-title { font-size: calc(${data.fontSizes.mainTitle} * 0.6); }
  .subtitle { font-size: calc(${data.fontSizes.subtitle} * 0.7); }
  .description { font-size: calc(${data.fontSizes.description} * 0.8); }
  .whatsapp-button { bottom: 1rem; right: 1rem; }
}
    `;
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        language={presellData.language}
        onLanguageChange={(lang) =>
          setPresellData({ ...presellData, language: lang as any })
        }
        onDownload={handleDownload}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className="w-1/2 border-r border-border bg-card">
          <EditorPanel data={presellData} onChange={setPresellData} />
        </div>

        {/* Preview Panel */}
        <div className="w-1/2">
          <PreviewPanel 
            data={presellData} 
            onUpdateElements={handleUpdateElements}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
