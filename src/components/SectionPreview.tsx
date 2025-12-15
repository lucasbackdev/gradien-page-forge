import { useState, useRef } from 'react';
import { PresellSection, GradientDirection, SectionElement, BackgroundOverlay } from '@/types/sections';
import { PresellData } from '@/types/presell';
import { FloatingHeader } from '@/types/sections';
import { Trash2, ChevronUp, ChevronDown, Menu, X } from 'lucide-react';

interface SectionPreviewProps {
  sections: PresellSection[];
  presellData: PresellData;
  floatingHeader: FloatingHeader;
  onReorderSections: (sections: PresellSection[]) => void;
  onUpdateSectionElements: (sectionId: string, elements: SectionElement[]) => void;
}

export const SectionPreview = ({ 
  sections, 
  presellData, 
  floatingHeader, 
  onReorderSections,
  onUpdateSectionElements 
}: SectionPreviewProps) => {
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [draggedElementInfo, setDraggedElementInfo] = useState<{ sectionId: string; elementIndex: number } | null>(null);
  const [showTrash, setShowTrash] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const trashRef = useRef<HTMLDivElement>(null);

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

  const getOverlayStyle = (overlay?: BackgroundOverlay) => {
    if (!overlay?.enabled) return undefined;
    
    const direction = overlay.direction === 'horizontal' ? '90deg' 
      : overlay.direction === 'diagonal' ? '135deg' 
      : '180deg';
    
    return `linear-gradient(${direction}, ${overlay.color1}, ${overlay.color2})`;
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

  const getButtonStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {
      color: presellData.colors.buttonText,
      padding: '1rem 2rem',
      fontWeight: 'bold',
      textDecoration: 'none',
      display: 'inline-block',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    };

    if (presellData.colors.buttonGradient.enabled) {
      style.background = `linear-gradient(135deg, ${presellData.colors.buttonGradient.color1}, ${presellData.colors.buttonGradient.color2})`;
    } else {
      style.backgroundColor = presellData.colors.button;
    }

    switch (presellData.buttonStyle.borderRadius) {
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

    if (presellData.buttonStyle.shadow) {
      style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    }

    if (presellData.buttonStyle.neonGlow) {
      const glowColor = presellData.colors.buttonGradient.enabled 
        ? presellData.colors.buttonGradient.color1 
        : presellData.colors.button;
      style.boxShadow = `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 0 60px ${glowColor}`;
    }

    return style;
  };

  const renderTextWithHighlight = (content: string, element: SectionElement) => {
    if (!element.highlightWords?.enabled || !element.highlightWords.words) {
      return content;
    }

    const words = element.highlightWords.words.split(',').map(w => w.trim()).filter(Boolean);
    if (words.length === 0) return content;

    let result = content;
    words.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      result = result.replace(regex, `<span style="color: ${element.highlightWords!.color}">\$1</span>`);
    });

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  const getTextStyle = (element: SectionElement): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      fontSize: element.fontSize,
      fontWeight: element.bold ? 'bold' : element.fontWeight,
    };

    if (element.gradientText?.enabled && element.gradientText.colors?.length) {
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, ${element.gradientText.colors.join(', ')})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'inline-block',
      };
    }
    return {
      ...baseStyle,
      color: element.color,
    };
  };

  const handleSectionDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSectionIndex(index);
    setShowTrash(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSectionDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedSectionIndex === null || draggedSectionIndex === index) return;
    
    const newSections = [...sections];
    const [movedSection] = newSections.splice(draggedSectionIndex, 1);
    newSections.splice(index, 0, movedSection);
    
    setDraggedSectionIndex(index);
    onReorderSections(newSections);
  };

  const handleSectionDragEnd = (e: React.DragEvent) => {
    if (trashRef.current && draggedSectionIndex !== null) {
      const trashRect = trashRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;
      
      if (
        clientX >= trashRect.left &&
        clientX <= trashRect.right &&
        clientY >= trashRect.top &&
        clientY <= trashRect.bottom
      ) {
        const newSections = sections.filter((_, i) => i !== draggedSectionIndex);
        onReorderSections(newSections);
      }
    }
    
    setDraggedSectionIndex(null);
    setShowTrash(false);
  };

  const handleElementDragStart = (e: React.DragEvent, sectionId: string, elementIndex: number) => {
    e.stopPropagation();
    setDraggedElementInfo({ sectionId, elementIndex });
    setShowTrash(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleElementDragOver = (e: React.DragEvent, sectionId: string, elementIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedElementInfo || draggedElementInfo.sectionId !== sectionId || draggedElementInfo.elementIndex === elementIndex) return;
    
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const newElements = [...section.elements];
    const [movedElement] = newElements.splice(draggedElementInfo.elementIndex, 1);
    newElements.splice(elementIndex, 0, movedElement);
    
    setDraggedElementInfo({ sectionId, elementIndex });
    onUpdateSectionElements(sectionId, newElements);
  };

  const handleElementDragEnd = (e: React.DragEvent) => {
    if (trashRef.current && draggedElementInfo) {
      const trashRect = trashRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;
      
      if (
        clientX >= trashRect.left &&
        clientX <= trashRect.right &&
        clientY >= trashRect.top &&
        clientY <= trashRect.bottom
      ) {
        const section = sections.find(s => s.id === draggedElementInfo.sectionId);
        if (section) {
          const newElements = section.elements.filter((_, i) => i !== draggedElementInfo.elementIndex);
          onUpdateSectionElements(draggedElementInfo.sectionId, newElements);
        }
      }
    }
    
    setDraggedElementInfo(null);
    setShowTrash(false);
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    onReorderSections(newSections);
  };

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    onReorderSections(newSections);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const renderElement = (element: SectionElement, sectionId: string, elementIndex: number, sectionLayout: 'vertical' | 'horizontal') => {
    const isDragging = draggedElementInfo?.sectionId === sectionId && draggedElementInfo?.elementIndex === elementIndex;
    
    const dragProps = {
      draggable: true,
      onDragStart: (e: React.DragEvent) => handleElementDragStart(e, sectionId, elementIndex),
      onDragOver: (e: React.DragEvent) => handleElementDragOver(e, sectionId, elementIndex),
      onDragEnd: handleElementDragEnd,
    };

    const baseClass = `cursor-move transition-all ${isDragging ? 'opacity-50 scale-95' : 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-2'}`;
    const animationClass = element.animation ? 'animate-fade-in' : '';

    switch (element.type) {
      case 'text':
        return (
          <div 
            key={element.id} 
            {...dragProps}
            style={getTextStyle(element)} 
            className={`mb-4 ${baseClass} ${animationClass}`}
          >
            {renderTextWithHighlight(element.content || '', element)}
          </div>
        );
      case 'button':
        return (
          <a
            key={element.id}
            {...dragProps}
            href={element.link || presellData.affiliateLink || '#'}
            className={`mb-4 ${baseClass} ${animationClass} ${presellData.buttonStyle.hoverEffect ? 'hover:opacity-90 hover:scale-105' : ''}`}
            style={getButtonStyle()}
            onClick={(e) => {
              if (!element.link && !presellData.affiliateLink) e.preventDefault();
            }}
          >
            {element.content}
          </a>
        );
      case 'image':
        return element.imageUrl ? (
          <img
            key={element.id}
            {...dragProps}
            src={element.imageUrl}
            alt={element.content || 'Imagem'}
            className={`max-w-full rounded-lg shadow-lg mb-4 ${baseClass} ${animationClass}`}
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        ) : null;
      case 'video':
        return element.videoUrl ? (
          <video
            key={element.id}
            {...dragProps}
            src={element.videoUrl}
            controls
            className={`max-w-full rounded-lg shadow-lg mb-4 ${baseClass} ${animationClass}`}
            style={{ maxHeight: '400px' }}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-full">
      <style>
        {`
          @keyframes neonPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          html {
            scroll-behavior: smooth;
          }
        `}
      </style>

      {/* Floating Header */}
      {floatingHeader.enabled && sections.length > 0 && (
        <header
          className="sticky top-4 z-50 px-6 py-3"
          style={{
            backgroundColor: `${floatingHeader.backgroundColor}${Math.round(floatingHeader.backgroundOpacity * 2.55).toString(16).padStart(2, '0')}`,
            backdropFilter: floatingHeader.blur ? 'blur(12px)' : 'none',
            borderRadius: floatingHeader.borderRadius,
            width: `${floatingHeader.width || 60}%`,
            maxWidth: '95%',
            marginTop: '1rem',
            marginBottom: '-4rem',
            marginLeft: floatingHeader.position === 'left' ? '1rem' : floatingHeader.position === 'right' ? 'auto' : 'auto',
            marginRight: floatingHeader.position === 'right' ? '1rem' : floatingHeader.position === 'left' ? 'auto' : 'auto',
            ...(floatingHeader.position === 'center' && { marginLeft: 'auto', marginRight: 'auto' }),
            boxShadow: floatingHeader.shadow ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)' : 'none',
          }}
        >
          <div className="flex items-center justify-between gap-8">
            {floatingHeader.logoImage && (
              <img src={floatingHeader.logoImage} alt="Logo" className="h-8 object-contain flex-shrink-0" />
            )}
            <nav className="hidden md:flex items-center justify-center gap-4 flex-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#section-${section.id}`}
                  onClick={(e) => handleSmoothScroll(e, section.id)}
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  {section.name}
                </a>
              ))}
            </nav>
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 flex flex-col gap-2 border-t border-white/20 pt-4">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#section-${section.id}`}
                  onClick={(e) => handleSmoothScroll(e, section.id)}
                  className="text-sm text-white/80 hover:text-white transition-colors py-2"
                >
                  {section.name}
                </a>
              ))}
            </nav>
          )}
        </header>
      )}

      {/* Sections */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          id={`section-${section.id}`}
          style={getSectionStyle(section)}
          className={`relative group ${floatingHeader.enabled && index === 0 ? 'pt-24' : ''} ${draggedSectionIndex === index ? 'opacity-50' : ''}`}
          draggable
          onDragStart={(e) => handleSectionDragStart(e, index)}
          onDragOver={(e) => handleSectionDragOver(e, index)}
          onDragEnd={handleSectionDragEnd}
        >
          {/* Background overlay for images */}
          {section.backgroundImage && section.backgroundOverlay?.enabled && (
            <div 
              className="absolute inset-0" 
              style={{ 
                background: getOverlayStyle(section.backgroundOverlay),
                zIndex: 0 
              }}
            />
          )}
          {section.backgroundImage && !section.backgroundOverlay?.enabled && (
            <div 
              className="absolute inset-0 bg-black/50" 
              style={{ zIndex: 0 }}
            />
          )}

          {/* Section reorder controls */}
          <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => moveSectionUp(index)}
              disabled={index === 0}
              className="p-2 bg-black/50 rounded hover:bg-black/70 disabled:opacity-30 text-white"
              title="Mover para cima"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => moveSectionDown(index)}
              disabled={index === sections.length - 1}
              className="p-2 bg-black/50 rounded hover:bg-black/70 disabled:opacity-30 text-white"
              title="Mover para baixo"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div 
            className={`max-w-6xl mx-auto relative z-10 ${
              section.layout === 'horizontal' 
                ? 'flex flex-wrap items-center justify-center gap-8' 
                : 'flex flex-col items-center text-center'
            }`}
          >
            {section.elements.map((element, elementIndex) => renderElement(element, section.id, elementIndex, section.layout))}
          </div>
        </section>
      ))}

      {sections.length === 0 && (
        <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="text-xl mb-2">Nenhuma seção adicionada</p>
            <p className="text-sm">Adicione seções na aba "Criar Site" para começar</p>
          </div>
        </div>
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
