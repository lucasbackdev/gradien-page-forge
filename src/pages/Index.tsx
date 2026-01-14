import { useState, useEffect } from 'react';
import { TopBar } from '@/components/TopBar';
import { EditorPanel } from '@/components/EditorPanel';
import { PreviewPanel } from '@/components/PreviewPanel';
import { SectionPreview } from '@/components/SectionPreview';
import { ResponsivePreview, ViewportSize, getViewportWidth } from '@/components/ResponsivePreview';
import { PresellData, PresellElement, defaultPresellData, translations } from '@/types/presell';
import { PresellSection, SectionElement } from '@/types/sections';
import { toast } from '@/hooks/use-toast';
import JSZip from 'jszip';

const Index = () => {
  const [presellData, setPresellData] = useState<PresellData>(defaultPresellData);
  const [darkMode, setDarkMode] = useState(true);
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleUpdateElements = (elements: PresellElement[]) => {
    setPresellData(prev => ({ ...prev, elements }));
  };

  const handleUpdateSectionElements = (sectionId: string, elements: SectionElement[]) => {
    setPresellData(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, elements } : s
      ),
    }));
  };

  const handleUpdateSectionHeight = (sectionId: string, minHeight: string) => {
    setPresellData(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, minHeight } : s
      ),
    }));
  };

  const handleDownload = async () => {
    try {
      const zip = new JSZip();
      const t = translations[presellData.language || 'pt'];
      
      // Generate sections HTML/CSS
      const sectionsHtml = generateSectionsHTML(presellData);
      const sectionsCss = generateSectionsCSS(presellData);
      
      // IP Tracking Pixel
      const ipTrackingUrl = presellData.ipTracking?.enabled && 
        presellData.ipTracking?.url && 
        presellData.ipTracking.url.match(/^https?:\/\//)
          ? presellData.ipTracking.url
          : 'SUA_URL_DO_PIXEL_AQUI';
      const ipTrackingPixel = `\n<!-- IP Tracking Pixel -->\n<img src="${ipTrackingUrl}" style="display:none;">\n`;

      const fullHtml = `<!DOCTYPE html>
<html lang="${presellData.language || 'pt'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${presellData.pageTitle || 'Presell'}</title>
  ${presellData.favicon ? `<link rel="icon" href="public/favicon.png">` : ''}
  <style>
${sectionsCss}
  </style>
</head>
<body>
${sectionsHtml}
${presellData.whatsappEnabled && presellData.whatsappLink ? `
<a href="${presellData.whatsappLink}" class="whatsapp-button" target="_blank">
  <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
</a>
` : ''}
${ipTrackingPixel}
<script>
// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function() {
      mobileNav.classList.toggle('hidden');
    });
  }
});
</script>
</body>
</html>`;

      zip.file('index.html', fullHtml);
      
      const publicFolder = zip.folder('public');
      
      if (presellData.floatingHeader.logoImage && publicFolder) {
        const logoData = presellData.floatingHeader.logoImage.split(',')[1];
        if (logoData) {
          publicFolder.file('header-logo.png', logoData, { base64: true });
        }
      }
      
      if (presellData.favicon && publicFolder) {
        const faviconData = presellData.favicon.split(',')[1];
        if (faviconData) {
          publicFolder.file('favicon.png', faviconData, { base64: true });
        }
      }

      // Save section images
      let imageIndex = 0;
      presellData.sections.forEach((section, sectionIndex) => {
        if (section.backgroundImage && publicFolder) {
          const bgData = section.backgroundImage.split(',')[1];
          if (bgData) {
            publicFolder.file(`section-${sectionIndex}-bg.png`, bgData, { base64: true });
          }
        }
        section.elements.forEach((el, elIndex) => {
          if (el.type === 'image' && el.imageUrl && publicFolder) {
            const imageData = el.imageUrl.split(',')[1];
            if (imageData) {
              publicFolder.file(`section-${sectionIndex}-element-${elIndex}.png`, imageData, { base64: true });
            }
          }
          if (el.type === 'video' && el.videoUrl && publicFolder) {
            const videoData = el.videoUrl.split(',')[1];
            if (videoData) {
              publicFolder.file(`section-${sectionIndex}-video-${elIndex}.mp4`, videoData, { base64: true });
            }
          }
        });
      });
      
      const content = await zip.generateAsync({ type: 'blob' });
      
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'boas-vendas.zip';
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Download iniciado!',
        description: 'Sua página está sendo baixada como boas-vendas.zip',
      });
    } catch (error) {
      toast({
        title: 'Erro no download',
        description: 'Ocorreu um erro ao gerar o arquivo ZIP.',
        variant: 'destructive',
      });
    }
  };

  const generateSectionsHTML = (data: PresellData): string => {
    if (data.sections.length === 0) return '<div class="empty-message">Nenhuma seção adicionada</div>';

    let html = '';

    // Floating Header
    if (data.floatingHeader.enabled && data.sections.length > 0) {
      const headerPosition = data.floatingHeader.position || 'center';
      const positionStyle = headerPosition === 'left' ? 'margin-left: 1rem; margin-right: auto;' 
        : headerPosition === 'right' ? 'margin-left: auto; margin-right: 1rem;' 
        : 'margin-left: auto; margin-right: auto;';
      
      html += `
<header class="floating-header" style="${positionStyle}">
  <div class="header-content">
    ${data.floatingHeader.logoImage ? '<img src="public/header-logo.png" alt="Logo" class="header-logo">' : ''}
    <nav class="desktop-nav">
      ${data.sections.map(s => `<a href="#section-${s.id}" onclick="event.preventDefault(); document.getElementById('section-${s.id}').scrollIntoView({behavior: 'smooth'})">${s.name}</a>`).join('')}
    </nav>
    <button class="mobile-menu-btn">
      <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  </div>
  <nav class="mobile-nav hidden">
    ${data.sections.map(s => `<a href="#section-${s.id}" onclick="event.preventDefault(); document.getElementById('section-${s.id}').scrollIntoView({behavior: 'smooth'}); this.closest('.mobile-nav').classList.add('hidden')">${s.name}</a>`).join('')}
  </nav>
</header>`;
    }

    // Sections
    data.sections.forEach((section, sectionIndex) => {
      const bgStyle = section.backgroundImage 
        ? `background-image: url('public/section-${sectionIndex}-bg.png'); background-size: cover; background-position: center;`
        : section.backgroundGradient?.enabled
          ? `background: ${getGradientCSS(section.backgroundGradient)};`
          : `background-color: ${section.backgroundColor || '#1a1a2e'};`;

      const minHeightStyle = section.minHeight ? `min-height: ${section.minHeight}; display: flex; flex-direction: column; justify-content: center;` : '';

      html += `
<section id="section-${section.id}" class="section section-${section.layout}" style="${bgStyle} ${minHeightStyle} color: ${section.textColor || '#ffffff'}; padding: ${section.padding || '4rem 2rem'}; position: relative;">
  ${section.backgroundImage ? `<div class="section-overlay" style="background: ${section.backgroundOverlay?.enabled ? getOverlayCSS(section.backgroundOverlay) : 'rgba(0,0,0,0.5)'}; position: absolute; inset: 0; z-index: 0;"></div>` : ''}
  <div class="section-content" style="position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center;">
    ${section.elements.map((el, elIndex) => {
      if (el.type === 'text') {
        const textStyle = el.gradientText?.enabled && el.gradientText.colors?.length
          ? `background: linear-gradient(135deg, ${el.gradientText.colors.join(', ')}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; display: inline-block;`
          : `color: ${el.color || '#ffffff'};`;
        
        let content = el.content || '';
        if (el.highlightWords?.enabled && el.highlightWords.words) {
          const words = el.highlightWords.words.split(',').map(w => w.trim()).filter(Boolean);
          words.forEach(word => {
            const regex = new RegExp(`(${word})`, 'gi');
            content = content.replace(regex, `<span style="color: ${el.highlightWords!.color}">\$1</span>`);
          });
        }
        
        return `<div class="element-text" style="${textStyle} font-size: ${el.fontSize || '18px'}; font-weight: ${el.fontWeight || 'normal'}; margin-bottom: 1rem;">${content}</div>`;
      }
      if (el.type === 'button') {
        const isShinyButton = data.buttonStyle.template === 'shiny-green';
        const buttonClass = isShinyButton ? 'shiny-cta' : 'element-button';
        const buttonContent = isShinyButton 
          ? `<span>${el.content || 'Botão'}</span>` 
          : (el.content || 'Botão');
        return `<a href="${data.affiliateLink || el.link || '#'}" class="${buttonClass}">${buttonContent}</a>`;
      }
      if (el.type === 'image' && el.imageUrl) {
        const glowClass = el.glowingBorder ? 'glow-border' : '';
        const colors = el.glowBorderColors || ['#FF6A00', '#FF2D55'];
        const glowStyle = el.glowingBorder 
          ? `box-shadow: 0 0 15px ${colors[0]}, 0 0 30px ${colors[1] || colors[0]}${colors[2] ? `, 0 0 45px ${colors[2]}` : ''}${colors[3] ? `, 0 0 60px ${colors[3]}` : ''}; border: 3px solid transparent; background-image: linear-gradient(#1a1a2e, #1a1a2e), linear-gradient(135deg, ${colors.join(', ')}); background-origin: border-box; background-clip: padding-box, border-box;`
          : '';
        const widthStyle = el.mediaWidth ? `width: ${el.mediaWidth}%;` : '';
        const imgTag = `<img src="public/section-${sectionIndex}-element-${elIndex}.png" alt="${el.content || 'Imagem'}" class="element-image ${glowClass}" style="${glowStyle} ${widthStyle}">`;
        return data.affiliateLink 
          ? `<a href="${data.affiliateLink}" class="image-link">${imgTag}</a>`
          : imgTag;
      }
      if (el.type === 'video' && el.videoUrl) {
        const glowClass = el.glowingBorder ? 'glow-border' : '';
        const colors = el.glowBorderColors || ['#FF6A00', '#FF2D55'];
        const glowStyle = el.glowingBorder 
          ? `box-shadow: 0 0 15px ${colors[0]}, 0 0 30px ${colors[1] || colors[0]}${colors[2] ? `, 0 0 45px ${colors[2]}` : ''}${colors[3] ? `, 0 0 60px ${colors[3]}` : ''}; border: 3px solid transparent; background-image: linear-gradient(#1a1a2e, #1a1a2e), linear-gradient(135deg, ${colors.join(', ')}); background-origin: border-box; background-clip: padding-box, border-box;`
          : '';
        const widthStyle = el.mediaWidth ? `width: ${el.mediaWidth}%;` : '';
        return `<video src="public/section-${sectionIndex}-video-${elIndex}.mp4" controls class="element-video ${glowClass}" style="${glowStyle} ${widthStyle}"></video>`;
      }
      return '';
    }).join('')}
  </div>
</section>`;
    });

    // Footer
    const t = translations[data.language || 'pt'];
    const footerBg = data.footerStyle?.backgroundColor || '#0a0a0a';
    const footerText = data.footerStyle?.textColor || '#888888';
    
    html += `
<footer class="site-footer" style="background-color: ${footerBg}; color: ${footerText}; padding: 3rem 2rem 2rem;">
  <div class="footer-content">
    ${data.floatingHeader.logoImage ? '<img src="public/header-logo.png" alt="Logo" class="footer-logo">' : ''}
    ${data.footerStyle?.showSections !== false && data.sections.length > 0 ? `
    <nav class="footer-nav">
      ${data.sections.map(s => `<a href="#section-${s.id}" onclick="event.preventDefault(); document.getElementById('section-${s.id}').scrollIntoView({behavior: 'smooth'})" style="color: ${footerText}">${s.name}</a>`).join('')}
    </nav>
    ` : ''}
    <div class="footer-divider" style="border-color: ${footerText}"></div>
    <div class="footer-legal">
      ${data.termsLink ? `<a href="${data.termsLink}" target="_blank" rel="noopener noreferrer" style="color: ${footerText}">${t.terms}</a>` : ''}
      ${data.termsLink && data.privacyLink ? '<span class="footer-separator">|</span>' : ''}
      ${data.privacyLink ? `<a href="${data.privacyLink}" target="_blank" rel="noopener noreferrer" style="color: ${footerText}">${t.privacy}</a>` : ''}
    </div>
    <div class="footer-copyright">© ${new Date().getFullYear()} Todos os direitos reservados.</div>
  </div>
</footer>`;

    return html;
  };

  const getGradientCSS = (gradient: NonNullable<PresellSection['backgroundGradient']>): string => {
    const colors = gradient.color3 
      ? `${gradient.color1}, ${gradient.color2}, ${gradient.color3}`
      : `${gradient.color1}, ${gradient.color2}`;
    
    switch (gradient.direction) {
      case 'horizontal':
        return `linear-gradient(90deg, ${colors})`;
      case 'vertical':
        return `linear-gradient(180deg, ${colors})`;
      case 'radial':
        return `radial-gradient(circle, ${colors})`;
      default:
        return `linear-gradient(135deg, ${colors})`;
    }
  };

  const getOverlayCSS = (overlay: NonNullable<PresellSection['backgroundOverlay']>): string => {
    const direction = overlay.direction === 'horizontal' ? '90deg' 
      : overlay.direction === 'diagonal' ? '135deg' 
      : '180deg';
    
    const opacity1 = (overlay.opacity1 ?? 80) / 100;
    const opacity2 = (overlay.opacity2 ?? 0) / 100;
    
    // Convert hex to rgba
    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    const color1Rgba = hexToRgba(overlay.color1 || '#000000', opacity1);
    const color2Rgba = hexToRgba(overlay.color2 || '#000000', opacity2);
    
    return `linear-gradient(${direction}, ${color1Rgba}, ${color2Rgba})`;
  };

  const generateSectionsCSS = (data: PresellData): string => {
    const getBorderRadius = () => {
      switch (data.buttonStyle.borderRadius) {
        case 'square': return '0';
        case 'rounded': return '0.5rem';
        case 'pill': return '9999px';
        default: return '0.5rem';
      }
    };

    const getButtonBackground = () => {
      if (data.colors.buttonGradient.enabled) {
        return `linear-gradient(135deg, ${data.colors.buttonGradient.color1}, ${data.colors.buttonGradient.color2})`;
      }
      return data.colors.button;
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

    // Get background from first section for body - use same as first section to avoid color mismatch
    const firstSectionBg = data.sections.length > 0 
      ? (data.sections[0].backgroundColor || '#1a1a2e')
      : '#1a1a2e';

    return `
* { margin: 0; padding: 0; box-sizing: border-box; }
html { 
  font-family: ${data.fonts.body || 'system-ui'}, sans-serif;
  line-height: 1.6;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
body {
  font-family: inherit;
  line-height: inherit;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background-color: ${firstSectionBg};
}

.floating-header {
  position: sticky;
  top: 1rem;
  z-index: 1000;
  padding: 0.75rem 1.5rem;
  background-color: ${data.floatingHeader.backgroundColor}${Math.round(data.floatingHeader.backgroundOpacity * 2.55).toString(16).padStart(2, '0')};
  ${data.floatingHeader.blur ? 'backdrop-filter: blur(12px);' : ''}
  border-radius: ${data.floatingHeader.borderRadius};
  width: ${data.floatingHeader.width || 60}%;
  max-width: 95%;
  ${data.floatingHeader.shadow ? 'box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2);' : ''}
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.header-logo {
  height: 2rem;
  object-fit: contain;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.desktop-nav a, .mobile-nav a {
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.desktop-nav a:hover, .mobile-nav a:hover {
  color: white;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-nav {
  display: none;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.2);
}

.mobile-nav.hidden {
  display: none !important;
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
  .mobile-menu-btn {
    display: block;
  }
  .mobile-nav {
    display: flex;
  }
  .mobile-nav.hidden {
    display: none !important;
  }
}

.section {
  position: relative;
}

.section-vertical .section-content {
  max-width: 72rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.section-horizontal .section-content {
  max-width: 72rem;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.element-button {
  display: inline-block;
  padding: 1rem 2rem;
  background: ${getButtonBackground()};
  color: ${data.colors.buttonText};
  text-decoration: none;
  font-weight: bold;
  border-radius: ${getBorderRadius()};
  box-shadow: ${getButtonShadow()};
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.element-button:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

${data.buttonStyle.neonGlow ? `
@keyframes neonPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
.element-button {
  animation: neonPulse 2s ease-in-out infinite;
}
` : ''}

${data.buttonStyle.template === 'shiny-green' ? `
/* Shiny CTA Button Styles */
@property --gradient-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

@property --gradient-angle-offset {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

@property --gradient-percent {
  syntax: "<percentage>";
  initial-value: 20%;
  inherits: false;
}

@property --gradient-shine {
  syntax: "<color>";
  initial-value: #10b981;
  inherits: false;
}

.shiny-cta {
  --gradient-angle: 0deg;
  --gradient-angle-offset: 0deg;
  --gradient-percent: 20%;
  --gradient-shine: #10b981;
  --shadow-size: 2px;
  position: relative;
  overflow: hidden;
  border-radius: 9999px;
  padding: 1.25rem 2.5rem;
  font-size: 1.125rem;
  line-height: 1.2;
  font-weight: 500;
  color: #ffffff;
  background: linear-gradient(#000000, #000000) padding-box, 
              conic-gradient(from calc(var(--gradient-angle) - var(--gradient-angle-offset)), 
              transparent 0%, #064e3b 5%, var(--gradient-shine) 15%, #064e3b 30%, 
              transparent 40%, transparent 100%) border-box;
  border: 2px solid transparent;
  box-shadow: inset 0 0 0 1px #1a1818;
  outline: none;
  transition: --gradient-angle-offset 800ms cubic-bezier(0.25, 1, 0.5, 1), 
              --gradient-percent 800ms cubic-bezier(0.25, 1, 0.5, 1), 
              --gradient-shine 800ms cubic-bezier(0.25, 1, 0.5, 1), 
              box-shadow 0.3s;
  cursor: pointer;
  isolation: isolate;
  outline-offset: 4px;
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  z-index: 0;
  animation: border-spin 2.5s linear infinite;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 1rem;
}

@keyframes border-spin {
  to {
    --gradient-angle: 360deg;
  }
}

.shiny-cta:active {
  transform: translateY(1px);
}

.shiny-cta::before {
  content: '';
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  --size: calc(100% - 6px);
  --position: 2px;
  --space: 4px;
  width: var(--size);
  height: var(--size);
  background: radial-gradient(circle at var(--position) var(--position), white 0.5px, transparent 0) padding-box;
  background-size: var(--space) var(--space);
  background-repeat: space;
  mask-image: conic-gradient(from calc(var(--gradient-angle) + 45deg), black, transparent 10% 90%, black);
  border-radius: inherit;
  opacity: 0.4;
  pointer-events: none;
}

.shiny-cta::after {
  content: '';
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(-50deg, transparent, #064e3b, transparent);
  mask-image: radial-gradient(circle at bottom, transparent 40%, black);
  opacity: 0.6;
  animation: shimmer 4s linear infinite;
  animation-play-state: running;
}

.shiny-cta span {
  position: relative;
  z-index: 2;
  display: inline-block;
}

.shiny-cta span::before {
  content: '';
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  --size: calc(100% + 1rem);
  width: var(--size);
  height: var(--size);
  box-shadow: inset 0 -1ex 2rem 4px #064e3b;
  opacity: 0;
  border-radius: inherit;
  transition: opacity 800ms cubic-bezier(0.25, 1, 0.5, 1);
  animation: breathe 4.5s linear infinite;
}

@keyframes shimmer {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes breathe {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.20);
  }
}
` : ''}

.element-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  margin-bottom: 1rem;
}

.image-link {
  display: block;
  transition: opacity 0.3s;
}

.image-link:hover {
  opacity: 0.9;
}

.element-video {
  max-width: 150%;
  border-radius: 0.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  margin-bottom: 1rem;
}

.site-footer {
  width: 100%;
}

.footer-content {
  max-width: 72rem;
  margin: 0 auto;
  text-align: center;
}

.footer-logo {
  height: 2.5rem;
  object-fit: contain;
  opacity: 0.7;
  margin-bottom: 1.5rem;
}

.footer-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.footer-nav a {
  text-decoration: none;
  font-size: 0.875rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.footer-nav a:hover {
  opacity: 1;
}

.footer-divider {
  border-top: 1px solid;
  opacity: 0.2;
  margin: 1.5rem 0;
}

.footer-legal {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.footer-legal a {
  text-decoration: none;
  font-size: 0.875rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.footer-legal a:hover {
  opacity: 1;
}

.footer-separator {
  opacity: 0.3;
}

.footer-copyright {
  font-size: 0.75rem;
  opacity: 0.5;
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

.empty-message {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .whatsapp-button {
    bottom: 1rem;
    right: 1rem;
  }
}
`;
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onDownload={handleDownload}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel - 25% */}
        <div className="w-[25%] min-w-[320px] border-r border-border bg-card overflow-hidden">
          <EditorPanel data={presellData} onChange={setPresellData} />
        </div>

        {/* Preview Panel - 80% */}
        <div className="flex-1 flex flex-col">
          <div className="p-2 border-b border-border flex justify-center bg-muted/50">
            <ResponsivePreview currentSize={viewportSize} onSizeChange={setViewportSize} />
          </div>
          <div className="flex-1 overflow-auto flex justify-center bg-muted/30 p-4">
            <div 
              className="bg-transparent overflow-auto transition-all duration-300"
              style={{ 
                width: getViewportWidth(viewportSize),
                maxWidth: '100%',
                boxShadow: viewportSize !== 'desktop' ? '0 0 20px rgba(0,0,0,0.3)' : 'none',
                borderRadius: viewportSize !== 'desktop' ? '8px' : '0',
              }}
            >
              {presellData.sections.length > 0 ? (
                <SectionPreview
                  sections={presellData.sections}
                  presellData={presellData}
                  floatingHeader={presellData.floatingHeader}
                  onReorderSections={(sections) => setPresellData(prev => ({ ...prev, sections }))}
                  onUpdateSectionElements={handleUpdateSectionElements}
                  onUpdateSectionHeight={handleUpdateSectionHeight}
                />
              ) : (
                <PreviewPanel 
                  data={presellData} 
                  onUpdateElements={handleUpdateElements}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
