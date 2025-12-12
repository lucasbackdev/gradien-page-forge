import { PresellSection, GradientDirection } from '@/types/sections';
import { PresellData } from '@/types/presell';
import { FloatingHeader } from '@/types/sections';

interface SectionPreviewProps {
  sections: PresellSection[];
  presellData: PresellData;
  floatingHeader: FloatingHeader;
  onReorderSections: (sections: PresellSection[]) => void;
}

export const SectionPreview = ({ sections, presellData, floatingHeader, onReorderSections }: SectionPreviewProps) => {
  const getGradientStyle = (gradient: PresellSection['backgroundGradient']) => {
    if (!gradient?.enabled) return undefined;
    
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

  const getSectionStyle = (section: PresellSection): React.CSSProperties => {
    const style: React.CSSProperties = {
      padding: section.padding || '4rem 2rem',
      color: section.textColor || '#ffffff',
      position: 'relative',
    };

    if (section.backgroundImage) {
      style.backgroundImage = `url(${section.backgroundImage})`;
      style.backgroundSize = 'cover';
      style.backgroundPosition = 'center';
    } else if (section.backgroundGradient?.enabled) {
      style.background = getGradientStyle(section.backgroundGradient);
    } else {
      style.backgroundColor = section.backgroundColor || '#1a1a2e';
    }

    return style;
  };

  const renderElement = (element: PresellSection['elements'][0], sectionLayout: 'vertical' | 'horizontal') => {
    const baseStyle: React.CSSProperties = {
      color: element.color,
      fontSize: element.fontSize,
      fontWeight: element.fontWeight as any,
    };

    switch (element.type) {
      case 'text':
        return (
          <div key={element.id} style={baseStyle} className="mb-4">
            {element.content}
          </div>
        );
      case 'button':
        return (
          <a
            key={element.id}
            href={element.link || presellData.affiliateLink || '#'}
            className="inline-block px-8 py-4 rounded-lg font-bold transition-all hover:scale-105 hover:opacity-90 mb-4"
            style={{
              background: presellData.colors.buttonGradient.enabled
                ? `linear-gradient(135deg, ${presellData.colors.buttonGradient.color1}, ${presellData.colors.buttonGradient.color2})`
                : presellData.colors.button,
              color: presellData.colors.buttonText,
              fontSize: element.fontSize,
              boxShadow: presellData.buttonStyle.neonGlow
                ? `0 0 20px ${presellData.colors.button}, 0 0 40px ${presellData.colors.button}`
                : presellData.buttonStyle.shadow
                  ? '0 4px 15px rgba(0,0,0,0.3)'
                  : 'none',
            }}
          >
            {element.content}
          </a>
        );
      case 'image':
        return element.imageUrl ? (
          <img
            key={element.id}
            src={element.imageUrl}
            alt={element.content || 'Imagem'}
            className="max-w-full rounded-lg shadow-lg mb-4"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        ) : null;
      case 'video':
        return element.videoUrl ? (
          <video
            key={element.id}
            src={element.videoUrl}
            controls
            className="max-w-full rounded-lg shadow-lg mb-4"
            style={{ maxHeight: '400px' }}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Floating Header */}
      {floatingHeader.enabled && sections.length > 0 && (
        <header
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 flex items-center justify-between gap-8"
          style={{
            backgroundColor: `${floatingHeader.backgroundColor}${Math.round(floatingHeader.backgroundOpacity * 2.55).toString(16).padStart(2, '0')}`,
            backdropFilter: floatingHeader.blur ? 'blur(12px)' : 'none',
            borderRadius: floatingHeader.borderRadius,
            minWidth: '60%',
            maxWidth: '90%',
          }}
        >
          {presellData.logoImage && (
            <img src={presellData.logoImage} alt="Logo" className="h-8 object-contain" />
          )}
          <nav className="hidden md:flex items-center gap-4">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#section-${section.id}`}
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                {section.name}
              </a>
            ))}
          </nav>
          {/* Mobile menu button - would need JS for toggle in exported HTML */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>
      )}

      {/* Sections */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          id={`section-${section.id}`}
          style={getSectionStyle(section)}
          className={floatingHeader.enabled && index === 0 ? 'pt-24' : ''}
        >
          {section.backgroundImage && (
            <div 
              className="absolute inset-0 bg-black/50" 
              style={{ zIndex: 0 }}
            />
          )}
          <div 
            className={`max-w-6xl mx-auto relative z-10 ${
              section.layout === 'horizontal' 
                ? 'flex flex-wrap items-center justify-center gap-8' 
                : 'flex flex-col items-center text-center'
            }`}
          >
            {section.elements.map((element) => renderElement(element, section.layout))}
          </div>
        </section>
      ))}

      {sections.length === 0 && (
        <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="text-xl mb-2">Nenhuma seção adicionada</p>
            <p className="text-sm">Adicione seções na aba "Seções" para começar</p>
          </div>
        </div>
      )}
    </div>
  );
};
