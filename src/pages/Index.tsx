import { useState, useEffect } from 'react';
import { TopBar } from '@/components/TopBar';
import { EditorPanel } from '@/components/EditorPanel';
import { PreviewPanel } from '@/components/PreviewPanel';
import { PresellData, defaultPresellData, translations } from '@/types/presell';
import { toast } from '@/hooks/use-toast';
import JSZip from 'jszip';

const Index = () => {
  const [presellData, setPresellData] = useState<PresellData>(defaultPresellData);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleDownload = async () => {
    try {
      const zip = new JSZip();
      const t = translations[presellData.language];
      
      // Generate HTML
      const html = generateHTML(presellData, t);
      const css = generateCSS(presellData);
      
      // Create full HTML file
      const fullHtml = `<!DOCTYPE html>
<html lang="${presellData.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${presellData.mainTitle}</title>
  ${presellData.favicon ? `<link rel="icon" href="public/favicon.png">` : ''}
  <style>${css}</style>
</head>
<body>
${html}
</body>
</html>`;

      // Add files to ZIP
      zip.file('index.html', fullHtml);
      zip.file('style.css', css);
      
      // Create public folder
      const publicFolder = zip.folder('public');
      
      // Add images to public folder
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
      
      // Add element images
      presellData.elements.forEach((el, index) => {
        if (el.type === 'image' && el.imageUrl && publicFolder) {
          const imageData = el.imageUrl.split(',')[1];
          publicFolder.file(`element-${index}.png`, imageData, { base64: true });
        }
      });
      
      // Generate ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Download ZIP
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
    return `
  <div class="container">
    ${data.logoImage ? `<div class="logo"><img src="public/logo.png" alt="Logo"></div>` : ''}
    
    <div class="content">
      ${data.mainImage ? `<a href="${data.globalImageAffiliateLink || data.affiliateLink}" target="_blank"><img src="public/main-image.png" alt="Produto" class="main-image"></a>` : ''}
      
      <h1 class="main-title">${data.mainTitle}</h1>
      <h2 class="subtitle">${data.subtitle}</h2>
      <p class="description">${data.description}</p>
      
      ${data.launchDetails ? `<div class="launch-badge">${data.launchDetails}</div>` : ''}
      
      <a href="${data.globalCtaAffiliateLink || data.affiliateLink}" class="cta-button" target="_blank">${data.ctaText}</a>
      
      ${data.elements.map((el, index) => {
        if (el.type === 'title') return `<h2 style="font-size:${el.fontSize};color:${el.color}">${el.content}</h2>`;
        if (el.type === 'subtitle') return `<h3 style="font-size:${el.fontSize};color:${el.color}">${el.content}</h3>`;
        if (el.type === 'paragraph') return `<p style="font-size:${el.fontSize};color:${el.color}">${el.content}</p>`;
        if (el.type === 'image' && el.imageUrl) return `<a href="${data.globalImageAffiliateLink || data.affiliateLink}" target="_blank"><img src="public/element-${index}.png" alt="Elemento" class="element-image"></a>`;
        if (el.type === 'cta') return `<a href="${el.link || data.globalCtaAffiliateLink || data.affiliateLink}" class="cta-button" target="_blank" style="font-size:${data.fontSizes.ctaButton}">${el.content}</a>`;
        return '';
      }).join('')}
    </div>
    
    <footer>
      <a href="${data.termsLink}" target="_blank">${t.terms}</a>
      <span>|</span>
      <a href="${data.privacyLink}" target="_blank">${t.privacy}</a>
    </footer>
  </div>
    `;
  };

  const generateCSS = (data: PresellData): string => {
    return `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  font-family: ${data.fonts.body}, sans-serif; 
  background: ${data.colors.background}; 
  color: ${data.colors.text}; 
  line-height: 1.6;
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
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}
.main-image:hover { transform: scale(1.05); }
.element-image { 
  width: 100%; 
  max-width: 700px; 
  border-radius: 1rem; 
  margin: 2rem auto; 
  display: block;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}
.element-image:hover { transform: scale(1.05); }
.main-title { 
  font-family: ${data.fonts.title}, sans-serif;
  font-size: ${data.fontSizes.mainTitle}; 
  font-weight: bold; 
  margin-bottom: 1rem; 
  color: ${data.colors.text};
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
  background: ${data.colors.button}; 
  color: ${data.colors.buttonText}; 
  padding: 1.25rem 3rem; 
  border-radius: 0.5rem; 
  font-size: ${data.fontSizes.ctaButton}; 
  font-weight: bold; 
  text-decoration: none; 
  margin: 1rem 0;
  transition: opacity 0.3s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
.cta-button:hover { opacity: 0.9; }
footer { 
  margin-top: 4rem; 
  padding-top: 2rem; 
  border-top: 1px solid #ddd; 
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
        <div className="w-1/2 bg-muted">
          <PreviewPanel data={presellData} />
        </div>
      </div>
    </div>
  );
};

export default Index;
