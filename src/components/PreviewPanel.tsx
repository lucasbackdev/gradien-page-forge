import { useState, useRef } from 'react';
import { PresellData, PresellElement, translations } from '@/types/presell';
import { Trash2 } from 'lucide-react';

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
    // Check if dropped on trash
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
        // Delete the element
        const newElements = data.elements.filter((_, i) => i !== draggedIndex);
        onUpdateElements?.(newElements);
      }
    }
    
    setDraggedIndex(null);
    setIsDragging(false);
    setShowTrash(false);
  };

  const renderElement = (element: PresellElement, index: number) => {
    const style = {
      fontSize: element.fontSize,
      fontFamily: element.fontFamily,
      color: element.color,
    };

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
          <h2 key={element.id} {...dragProps} style={style} className={`font-bold mb-4 ${dragProps.className}`}>
            {element.content}
          </h2>
        );
      case 'subtitle':
        return (
          <h3 key={element.id} {...dragProps} style={style} className={`font-semibold mb-3 ${dragProps.className}`}>
            {element.content}
          </h3>
        );
      case 'paragraph':
        return (
          <p key={element.id} {...dragProps} style={style} className={`mb-4 leading-relaxed ${dragProps.className}`}>
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
              style={{
                backgroundColor: data.colors.button,
                color: data.colors.buttonText,
                fontSize: data.fontSizes.ctaButton,
              }}
              className="inline-block px-8 py-4 rounded-lg font-bold text-center hover:opacity-90 transition-opacity mb-4"
            >
              {element.content}
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="h-full overflow-y-auto relative"
      style={{
        backgroundColor: data.colors.background,
        color: data.colors.text,
        fontFamily: data.fonts.body,
      }}
    >
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
          <h1
            style={{ 
              fontFamily: data.fonts.title, 
              color: data.colors.text,
              fontSize: data.fontSizes.mainTitle 
            }}
            className="font-bold mb-4"
          >
            {data.mainTitle}
          </h1>

          {/* Subtitle */}
          <h2
            style={{ 
              color: data.colors.accent,
              fontSize: data.fontSizes.subtitle 
            }}
            className="font-semibold mb-6"
          >
            {data.subtitle}
          </h2>

          {/* Description */}
          <p 
            style={{ fontSize: data.fontSizes.description }}
            className="leading-relaxed mb-8 max-w-2xl mx-auto"
          >
            {data.description}
          </p>

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
          <a
            href={data.globalCtaAffiliateLink || data.affiliateLink || '#'}
            onClick={(e) => {
              if (!data.globalCtaAffiliateLink && !data.affiliateLink) e.preventDefault();
            }}
            style={{
              backgroundColor: data.colors.button,
              color: data.colors.buttonText,
              fontSize: data.fontSizes.ctaButton,
            }}
            className="inline-block px-12 py-5 rounded-lg font-bold hover:opacity-90 transition-opacity shadow-lg"
          >
            {data.ctaText}
          </a>

          {/* Dynamic Elements */}
          <div className="mt-12 space-y-4">
            {data.elements.map((element, index) => renderElement(element, index))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-16 pt-8 border-t border-gray-300 text-center text-sm space-x-4">
          <a
            href={data.termsLink || '#'}
            onClick={(e) => { if (!data.termsLink) e.preventDefault(); }}
            className="hover:underline opacity-70"
          >
            {t.terms}
          </a>
          <span className="opacity-50">|</span>
          <a
            href={data.privacyLink || '#'}
            onClick={(e) => { if (!data.privacyLink) e.preventDefault(); }}
            className="hover:underline opacity-70"
          >
            {t.privacy}
          </a>
        </div>
      </div>

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
