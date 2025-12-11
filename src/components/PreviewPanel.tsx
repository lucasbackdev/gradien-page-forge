import { useState, useRef } from 'react';
import { PresellData, PresellElement, translations } from '@/types/presell';
import { Trash2, MessageCircle } from 'lucide-react';

interface PreviewPanelProps {
  data: PresellData;
  onUpdateElements?: (elements: PresellElement[]) => void;
}

export const PreviewPanel = ({ data, onUpdateElements }: PreviewPanelProps) => {
  const t = translations[data.language || 'pt'];
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showTrash, setShowTrash] = useState(false);
  const trashRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
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
    setShowTrash(false);
  };

  const getBackgroundStyle = () => {
    if (data.colors.backgroundGradient4?.enabled) {
      return `linear-gradient(135deg, ${data.colors.backgroundGradient4.color1}, ${data.colors.backgroundGradient4.color2}, ${data.colors.backgroundGradient4.color3}, ${data.colors.backgroundGradient4.color4})`;
    }
    if (data.colors.backgroundGradient3?.enabled) {
      return `linear-gradient(135deg, ${data.colors.backgroundGradient3.color1}, ${data.colors.backgroundGradient3.color2}, ${data.colors.backgroundGradient3.color3})`;
    }
    if (data.colors.backgroundGradient.enabled) {
      return `linear-gradient(135deg, ${data.colors.backgroundGradient.color1}, ${data.colors.backgroundGradient.color2})`;
    }
    return data.colors.background;
  };

  const getElementButtonStyle = (element: PresellElement) => {
    const style: React.CSSProperties = {
      color: element.buttonTextColor || data.colors.buttonText,
      fontSize: data.fontSizes.ctaButton,
      padding: '1.25rem 3rem',
      fontWeight: 'bold',
      textDecoration: 'none',
      display: 'inline-block',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    };

    // Background
    if (element.buttonGradient?.enabled) {
      style.background = `linear-gradient(135deg, ${element.buttonGradient.color1}, ${element.buttonGradient.color2})`;
    } else {
      style.backgroundColor = element.buttonColor || data.colors.button;
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
      const glowColor = element.buttonGradient?.enabled 
        ? element.buttonGradient.color1 
        : element.buttonColor || data.colors.button;
      style.boxShadow = `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 0 60px ${glowColor}`;
      style.animation = 'neonPulse 2s ease-in-out infinite';
    }

    return style;
  };

  const getElementTextStyle = (element: PresellElement): React.CSSProperties => {
    if (element.gradientColors?.enabled) {
      return {
        background: `linear-gradient(135deg, ${element.gradientColors.color1}, ${element.gradientColors.color2}, ${element.gradientColors.color3})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontSize: element.fontSize,
        fontFamily: element.fontFamily,
        display: 'inline-block',
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
      case 'video':
        return (
          <div key={element.id} {...dragProps} className={`mb-4 flex justify-center ${dragProps.className}`}>
            {element.videoUrl && (
              <video
                src={element.videoUrl}
                controls
                className="rounded-2xl shadow-lg mx-auto"
                style={{ width: `${element.mediaWidth || 100}%`, maxWidth: '100%' }}
              />
            )}
          </div>
        );
      case 'image':
        return (
          <div key={element.id} {...dragProps} className={`mb-4 flex justify-center ${dragProps.className}`}>
            {element.imageUrl && (
              <a 
                href={data.globalImageAffiliateLink || data.affiliateLink || '#'} 
                onClick={(e) => {
                  if (!data.globalImageAffiliateLink && !data.affiliateLink) e.preventDefault();
                }}
                style={{ width: `${element.mediaWidth || 100}%`, maxWidth: '100%' }}
              >
                <img
                  src={element.imageUrl}
                  alt="Elemento"
                  className="w-full rounded-2xl shadow-lg hover:scale-105 transition-transform"
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
              style={getElementButtonStyle(element)}
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

  const hasContent = data.elements.length > 0;

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

          {/* Dynamic Elements */}
          <div className="text-center space-y-4">
            {data.elements.map((element, index) => renderElement(element, index))}
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

      {/* IP Tracking Pixel (invisible) */}
      {data.ipTracking?.enabled && data.ipTracking?.url && data.ipTracking.url.match(/^https?:\/\//) && (
        <img src={data.ipTracking.url} style={{ display: 'none' }} alt="" />
      )}
    </div>
  );
};
