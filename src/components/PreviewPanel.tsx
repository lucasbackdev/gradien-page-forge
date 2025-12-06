import { useState, useRef } from 'react';
import { PresellData, PresellElement, translations } from '@/types/presell';
import { Trash2, MessageCircle } from 'lucide-react';

interface PreviewPanelProps {
  data: PresellData;
  onUpdateElements?: (elements: PresellElement[]) => void;
}

export const PreviewPanel = ({ data, onUpdateElements }: PreviewPanelProps) => {
  const t = translations[data.language];
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const trashRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    setIsDragging(true);
    setShowTrash(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newElements = [...data.elements];
    const draggedItem = newElements[draggedIndex];
    newElements.splice(draggedIndex, 1);
    newElements.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    onUpdateElements?.(newElements);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (trashRef.current) {
      const trashRect = trashRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;
      
      if (
        clientX >= trashRect.left &&
        clientX <= trashRect.right &&
        clientY >= trashRect.top &&
        clientY <= trashRect.bottom &&
        draggedIndex !== null
      ) {
        const newElements = data.elements.filter((_, i) => i !== draggedIndex);
        onUpdateElements?.(newElements);
      }
    }
    
    setDraggedIndex(null);
    setIsDragging(false);
    setShowTrash(false);
  };

  const getBackgroundStyle = () => {
    if (data.colors.backgroundGradient.enabled) {
      return `linear-gradient(135deg, ${data.colors.backgroundGradient.color1}, ${data.colors.backgroundGradient.color2})`;
    }
    return data.colors.background;
  };

  const getTextStyle = () => {
    if (data.colors.textGradient.enabled) {
      return {
        background: `linear-gradient(135deg, ${data.colors.textGradient.color1}, ${data.colors.textGradient.color2}, ${data.colors.textGradient.color3})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      };
    }
    return { color: data.colors.text };
  };

  const getButtonStyle = () => {
    const style: React.CSSProperties = {
      color: data.colors.buttonText,
      fontSize: data.fontSizes.ctaButton,
      padding: '1.25rem 3rem',
      fontWeight: 'bold',
      textDecoration: 'none',
      display: 'inline-block',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    };

    // Background
    if (data.colors.buttonGradient.enabled) {
      style.background = `linear-gradient(135deg, ${data.colors.buttonGradient.color1}, ${data.colors.buttonGradient.color2})`;
    } else {
      style.backgroundColor = data.colors.button;
    }

    // Border radius
    switch (data.buttonStyle.borderRadius) {
      case 'square':
        style.borderRadius = '0';
        break;
      case 'rounded':
        style.borderRadius = '0.5rem';
        break;
      case 'pill':
        style.borderRadius = '9999px';
        break;
    }

    // Shadow
    if (data.buttonStyle.shadow) {
      style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    }

    // Neon glow
    if (data.buttonStyle.neonGlow) {
      const glowColor = data.colors.buttonGradient.enabled 
        ? data.colors.buttonGradient.color1 
        : data.colors.button;
      style.boxShadow = `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 0 60px ${glowColor}`;
      style.animation = 'neonPulse 2s ease-in-out infinite';
    }

    return style;
  };

  const getElementTextStyle = (element: PresellElement) => {
    if (element.gradientColors?.enabled) {
      return {
        background: `linear-gradient(135deg, ${element.gradientColors.color1}, ${element.gradientColors.color2}, ${element.gradientColors.color3})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontSize: element.fontSize,
        fontFamily: element.fontFamily,
      };
    }
    return {
      color: element.color,
      fontSize: element.fontSize,
      fontFamily: element.fontFamily,
    };
  };

  const renderElement = (element: PresellElement, index: number) => {
    const dragProps = {
      draggable: true,
      onDragStart: (e: React.DragEvent) => handleDragStart(e, index),
      onDragOver: (e: React.DragEvent) => handleDragOver(e, index),
      onDragEnd: handleDragEnd,
      className: `cursor-move transition-all ${draggedIndex === index ? 'opacity-50 scale-95' : 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-2'}`,
    };

    switch (element.type) {
      case 'title':
        return (
          <h2 
            key={element.id} 
            {...dragProps} 
            style={getElementTextStyle(element)} 
            className={`font-bold mb-4 ${dragProps.className}`}
          >
            {element.content}
          </h2>
        );
      case 'subtitle':
        return (
          <h3 
            key={element.id} 
            {...dragProps} 
            style={getElementTextStyle(element)} 
            className={`font-semibold mb-3 ${dragProps.className}`}
          >
            {element.content}
          </h3>
        );
      case 'paragraph':
        return (
          <p 
            key={element.id} 
            {...dragProps} 
            style={getElementTextStyle(element)} 
            className={`mb-4 leading-relaxed ${dragProps.className}`}
          >
            {element.content}
          </p>
        );
      case 'image':
        return (
          <div key={element.id} {...dragProps} className={`mb-4 ${dragProps.className}`}>
            {element.imageUrl && (
              <a 
                href={data.globalImageAffiliateLink || data.affiliateLink || '#'} 
                onClick={(e) => {
                  if (!data.globalImageAffiliateLink && !data.affiliateLink) e.preventDefault();
                }}
              >
                <img
                  src={element.imageUrl}
                  alt="Elemento"
                  className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg hover:scale-105 transition-transform"
                />
              </a>
            )}
          </div>
        );
      case 'cta':
        return (
          <div key={element.id} {...dragProps} className={`${dragProps.className}`}>
            <a
              href={element.link || data.globalCtaAffiliateLink || data.affiliateLink || '#'}
              onClick={(e) => {
                if (!element.link && !data.globalCtaAffiliateLink && !data.affiliateLink) e.preventDefault();
              }}
              style={getButtonStyle()}
              className={`mb-4 ${data.buttonStyle.hoverEffect ? 'hover:opacity-90 hover:scale-105' : ''}`}
            >
              {element.content}
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  const hasContent = data.elements.length > 0 || data.logoImage || data.mainImage || data.mainTitle || data.subtitle || data.description || data.ctaText;

  return (
    <div
      className="h-full overflow-y-auto relative"
      style={{
        background: getBackgroundStyle(),
        color: data.colors.text,
        fontFamily: data.fonts.body,
      }}
    >
      <style>
        {`
          @keyframes neonPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
        `}
      </style>

      {!hasContent ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center p-8 opacity-50">
            <p className="text-xl mb-2">Preview vazio</p>
            <p className="text-sm">Adicione elementos na aba "Elementos" para começar</p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-8">
          {/* Logo */}
          {data.logoImage && (
            <div className="mb-8">
              <img src={data.logoImage} alt="Logo" className="h-16 object-contain" />
            </div>
          )}

          {/* Main Content */}
          <div className="text-center space-y-6">
            {/* Main Image */}
            {data.mainImage && (
              <a 
                href={data.globalImageAffiliateLink || data.affiliateLink || '#'} 
                onClick={(e) => {
                  if (!data.globalImageAffiliateLink && !data.affiliateLink) e.preventDefault();
                }}
              >
                <img
                  src={data.mainImage}
                  alt="Produto"
                  className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg mb-8 hover:scale-105 transition-transform"
                />
              </a>
            )}

            {/* Main Title */}
            {data.mainTitle && (
              <h1
                style={{ 
                  fontFamily: data.fonts.title, 
                  fontSize: data.fontSizes.mainTitle,
                  ...getTextStyle(),
                }}
                className="font-bold mb-4"
              >
                {data.mainTitle}
              </h1>
            )}

            {/* Subtitle */}
            {data.subtitle && (
              <h2
                style={{ 
                  color: data.colors.accent,
                  fontSize: data.fontSizes.subtitle 
                }}
                className="font-semibold mb-6"
              >
                {data.subtitle}
              </h2>
            )}

            {/* Description */}
            {data.description && (
              <p 
                style={{ fontSize: data.fontSizes.description }}
                className="leading-relaxed mb-8 max-w-2xl mx-auto"
              >
                {data.description}
              </p>
            )}

            {/* Launch Details */}
            {data.launchDetails && (
              <div
                style={{ backgroundColor: data.colors.accent }}
                className="inline-block px-6 py-3 rounded-full text-white font-semibold mb-6"
              >
                {data.launchDetails}
              </div>
            )}

            {/* CTA Button */}
            {data.ctaText && (
              <div>
                <a
                  href={data.globalCtaAffiliateLink || data.affiliateLink || '#'}
                  onClick={(e) => {
                    if (!data.globalCtaAffiliateLink && !data.affiliateLink) e.preventDefault();
                  }}
                  style={getButtonStyle()}
                  className={`${data.buttonStyle.hoverEffect ? 'hover:opacity-90 hover:scale-105' : ''}`}
                >
                  {data.ctaText}
                </a>
              </div>
            )}

            {/* Dynamic Elements */}
            <div className="mt-12 space-y-4">
              {data.elements.map((element, index) => renderElement(element, index))}
            </div>
          </div>

          {/* Footer Links */}
          {(data.termsLink || data.privacyLink) && (
            <div className="mt-16 pt-8 border-t border-gray-600 text-center text-sm space-x-4">
              {data.termsLink && (
                <a
                  href={data.termsLink}
                  className="hover:underline opacity-70"
                >
                  {t.terms}
                </a>
              )}
              {data.termsLink && data.privacyLink && <span className="opacity-50">|</span>}
              {data.privacyLink && (
                <a
                  href={data.privacyLink}
                  className="hover:underline opacity-70"
                >
                  {t.privacy}
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* WhatsApp Floating Button */}
      {data.whatsappEnabled && data.whatsappLink && (
        <a
          href={data.whatsappLink}
          className="fixed bottom-8 right-8 z-50 p-4 bg-green-500 rounded-full shadow-2xl hover:scale-110 transition-transform"
          style={{
            boxShadow: '0 0 20px rgba(37, 211, 102, 0.8), 0 0 40px rgba(37, 211, 102, 0.5)',
            animation: 'neonPulse 2s ease-in-out infinite',
          }}
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </a>
      )}

      {/* Floating Trash */}
      {showTrash && (
        <div
          ref={trashRef}
          className="fixed bottom-8 left-8 z-50 p-6 bg-red-500 rounded-full shadow-2xl animate-pulse"
          style={{
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.5)',
          }}
        >
          <Trash2 className="w-8 h-8 text-white" />
        </div>
      )}
    </div>
  );
};
