import { useState, useRef } from 'react';
import { PresellSection, GradientDirection, SectionElement, BackgroundOverlay, ResponsiveSize, ResponsiveFontSize, ResponsiveAlign, HorizontalAlign, LayoutDirection, ResponsiveColumnSettings, ResponsiveSpacing } from '@/types/sections';
import { PresellData, translations } from '@/types/presell';
import { FloatingHeader } from '@/types/sections';
import { Trash2, ChevronUp, ChevronDown, Menu, X, GripHorizontal } from 'lucide-react';
import { ViewportSize } from '@/components/ResponsivePreview';


interface SectionPreviewProps {
  sections: PresellSection[];
  presellData: PresellData;
  floatingHeader: FloatingHeader;
  onReorderSections: (sections: PresellSection[]) => void;
  onUpdateSectionElements: (sectionId: string, elements: SectionElement[]) => void;
  onUpdateSectionHeight?: (sectionId: string, minHeight: string) => void;
  viewportSize?: ViewportSize;
  userId?: string;
  onElementClick?: (sectionId: string, elementId: string) => void;
}

export const SectionPreview = ({ 
  sections, 
  presellData, 
  floatingHeader, 
  onReorderSections,
  onUpdateSectionElements,
  onUpdateSectionHeight,
  viewportSize = 'desktop',
  userId,
  onElementClick
}: SectionPreviewProps) => {
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [draggedElementInfo, setDraggedElementInfo] = useState<{ sectionId: string; elementIndex: number } | null>(null);
  const [showTrash, setShowTrash] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resizingSection, setResizingSection] = useState<string | null>(null);
  const [resizeStartY, setResizeStartY] = useState(0);
  const [resizeStartHeight, setResizeStartHeight] = useState(0);
  const trashRef = useRef<HTMLDivElement>(null);
  

  // No longer need the manual script loading - using unicornstudio-react package

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

  const getSectionStyle = (section: PresellSection): React.CSSProperties => {
    // Reduce padding on mobile for fuller content display
    const defaultPadding = viewportSize === 'mobile' ? '2rem 0.5rem' : (section.padding || '4rem 2rem');
    const style: React.CSSProperties = {
      padding: defaultPadding,
      color: section.textColor || '#ffffff',
      position: 'relative',
      minHeight: section.minHeight || 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
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

  const getButtonStyle = (element?: SectionElement): React.CSSProperties => {
    // If using shiny template, return minimal style as CSS classes will handle it
    if (presellData.buttonStyle.template === 'shiny-green') {
      return {};
    }

    const style: React.CSSProperties = {
      color: presellData.colors.buttonText,
      padding: '1rem 2rem',
      fontWeight: 'bold',
      textDecoration: 'none',
      display: 'inline-block',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    };

    // Check if element has custom button color
    if (element?.buttonColor?.useCustomColor) {
      if (element.buttonColor.colorType === 'gradient') {
        const colors = element.buttonColor.gradientColor3
          ? `${element.buttonColor.gradientColor1}, ${element.buttonColor.gradientColor2}, ${element.buttonColor.gradientColor3}`
          : `${element.buttonColor.gradientColor1}, ${element.buttonColor.gradientColor2}`;
        style.background = `linear-gradient(135deg, ${colors})`;
      } else {
        style.backgroundColor = element.buttonColor.solidColor;
      }
    } else if (presellData.colors.buttonGradient.enabled) {
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

  const getButtonClass = (): string => {
    if (presellData.buttonStyle.template === 'shiny-green') {
      return 'shiny-cta';
    }
    return '';
  };

  // Helper function to escape special regex characters
  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const renderTextWithHighlight = (content: string, element: SectionElement) => {
    if (!element.highlightWords?.enabled || !element.highlightWords.words) {
      return content;
    }

    const words = element.highlightWords.words.split(',').map(w => w.trim()).filter(Boolean);
    if (words.length === 0) return content;

    let result = content;
    words.forEach(word => {
      // Escape special regex characters to allow any character to be highlighted
      const escapedWord = escapeRegExp(word);
      const regex = new RegExp(`(${escapedWord})`, 'gi');
      result = result.replace(regex, `<span style="color: ${element.highlightWords!.color}">$1</span>`);
    });

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  // Helper to get responsive media width
  const getResponsiveMediaWidth = (element: SectionElement): number => {
    if (element.responsiveMediaWidth) {
      return element.responsiveMediaWidth[viewportSize];
    }
    return element.mediaWidth || 100;
  };

  // Helper to get responsive font size
  const getResponsiveFontSize = (element: SectionElement): string => {
    if (element.responsiveFontSize) {
      return element.responsiveFontSize[viewportSize] || element.fontSize || '18px';
    }
    return element.fontSize || '18px';
  };

  // Helper to get responsive horizontal alignment
  const getResponsiveAlign = (element: SectionElement): HorizontalAlign => {
    if (element.responsiveAlign) {
      return element.responsiveAlign[viewportSize] || 'center';
    }
    return 'center';
  };

  // Helper to get responsive vertical spacing
  const getResponsiveSpacing = (element: SectionElement): number => {
    if (element.responsiveSpacing) {
      return element.responsiveSpacing[viewportSize];
    }
    // Default values based on viewport - more spacing on mobile for cleaner look
    if (viewportSize === 'mobile') return 1;
    if (viewportSize === 'tablet') return 0.75;
    return 1;
  };

  const getAlignmentClass = (align: HorizontalAlign): string => {
    switch (align) {
      case 'left': return 'text-left self-start';
      case 'right': return 'text-right self-end';
      default: return 'text-center self-center';
    }
  };

  const getTextStyle = (element: SectionElement): React.CSSProperties => {
    const fontSize = getResponsiveFontSize(element);
    const baseStyle: React.CSSProperties = {
      fontSize,
      fontWeight: element.bold ? 'bold' : element.fontWeight,
      lineHeight: viewportSize === 'mobile' ? 1.3 : 1.4,
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

  // Resize handlers
  const handleResizeStart = (e: React.MouseEvent, sectionId: string, sectionElement: HTMLElement) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingSection(sectionId);
    setResizeStartY(e.clientY);
    setResizeStartHeight(sectionElement.offsetHeight);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - e.clientY;
      const newHeight = Math.max(100, sectionElement.offsetHeight + deltaY);
      sectionElement.style.minHeight = `${newHeight}px`;
      setResizeStartY(moveEvent.clientY);
    };

    const handleMouseUp = () => {
      if (onUpdateSectionHeight) {
        const finalHeight = sectionElement.offsetHeight;
        onUpdateSectionHeight(sectionId, `${finalHeight}px`);
      }
      setResizingSection(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const renderElement = (element: SectionElement, sectionId: string, elementIndex: number, sectionLayout: LayoutDirection, isInGroup: boolean = false) => {
    const isDragging = draggedElementInfo?.sectionId === sectionId && draggedElementInfo?.elementIndex === elementIndex;
    
    const dragProps = {
      draggable: true,
      onDragStart: (e: React.DragEvent) => handleElementDragStart(e, sectionId, elementIndex),
      onDragOver: (e: React.DragEvent) => handleElementDragOver(e, sectionId, elementIndex),
      onDragEnd: handleElementDragEnd,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onElementClick?.(sectionId, element.id);
      },
    };

    const baseClass = `cursor-move transition-all ${isDragging ? 'opacity-50 scale-95' : 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-2'}`;
    const animationClass = element.animation ? 'animate-fade-in' : '';
    const alignClass = getAlignmentClass(getResponsiveAlign(element));
    
    // When in a group, use flex-1 to share space equally
    const widthClass = isInGroup ? 'flex-1 min-w-0' : 'w-full';

    switch (element.type) {
      case 'text':
        const textSpacing = getResponsiveSpacing(element);
        return (
          <div 
            key={element.id} 
            {...dragProps}
            style={{ ...getTextStyle(element), whiteSpace: 'pre-line', marginBottom: isInGroup ? 0 : `${textSpacing}rem` }} 
            className={`${widthClass} ${baseClass} ${animationClass} ${alignClass}`}
          >
            {renderTextWithHighlight(element.content || '', element)}
          </div>
        );
      case 'button':
        const buttonClass = getButtonClass();
        const isShinyButton = presellData.buttonStyle.template === 'shiny-green';
        const scrollTargetSection = element.scrollToSection;
        
        const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          e.stopPropagation();
          onElementClick?.(sectionId, element.id);
          if (scrollTargetSection) {
            const targetElement = document.getElementById(`section-${scrollTargetSection}`);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }
          }
        };
        
        return (
          <div key={element.id} className={`${widthClass} ${isInGroup ? '' : 'mb-4'} flex ${getResponsiveAlign(element) === 'left' ? 'justify-start' : getResponsiveAlign(element) === 'right' ? 'justify-end' : 'justify-center'}`}>
            <a
              {...dragProps}
              href="#"
              className={`${baseClass} ${animationClass} ${buttonClass} ${!isShinyButton && presellData.buttonStyle.hoverEffect ? 'hover:opacity-90 hover:scale-105' : ''}`}
              style={getButtonStyle(element)}
              onClick={handleButtonClick}
            >
              {isShinyButton ? <span>{element.content}</span> : element.content}
            </a>
          </div>
        );
      case 'image':
        const imageColors = element.glowBorderColors || ['#FF6A00', '#FF2D55'];
        const imageGradientGlow = imageColors.length > 2 
          ? `linear-gradient(135deg, ${imageColors.join(', ')})`
          : `linear-gradient(135deg, ${imageColors[0]}, ${imageColors[1] || imageColors[0]})`;
        const imageGlowStyle = element.glowingBorder ? {
          boxShadow: `0 0 15px ${imageColors[0]}, 0 0 30px ${imageColors[1] || imageColors[0]}${imageColors[2] ? `, 0 0 45px ${imageColors[2]}` : ''}${imageColors[3] ? `, 0 0 60px ${imageColors[3]}` : ''}`,
          border: `3px solid transparent`,
          backgroundImage: `linear-gradient(#000, #000), ${imageGradientGlow}`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        } : {};
        const imageMediaWidth = getResponsiveMediaWidth(element);
        // Respect user's mobile size setting
        const effectiveImageWidth = imageMediaWidth;
        const imageSpacing = getResponsiveSpacing(element);
        const showImageShadow = element.showShadow !== false;
        return element.imageUrl ? (
          <div 
            key={element.id} 
            className={`${widthClass} flex ${getResponsiveAlign(element) === 'left' ? 'justify-start' : getResponsiveAlign(element) === 'right' ? 'justify-end' : 'justify-center'}`}
            style={{ marginBottom: isInGroup ? 0 : `${imageSpacing}rem` }}
          >
            <a
              {...dragProps}
              href="#"
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation();
                onElementClick?.(sectionId, element.id); 
              }}
              className={`block ${baseClass} ${animationClass}`}
              style={{ width: isInGroup ? '100%' : `${effectiveImageWidth}%`, maxWidth: viewportSize === 'mobile' ? '100%' : '150%' }}
            >
              <img
                src={element.imageUrl}
                alt={element.content || 'Imagem'}
                className={`rounded-lg cursor-pointer hover:opacity-90 transition-opacity w-full ${showImageShadow ? 'shadow-lg' : ''}`}
                style={{ 
                  maxHeight: '500px', 
                  objectFit: 'cover',
                  ...imageGlowStyle,
                }}
              />
            </a>
          </div>
        ) : null;
      case 'video':
        const videoColors = element.glowBorderColors || ['#FF6A00', '#FF2D55'];
        const videoGradientGlow = videoColors.length > 2 
          ? `linear-gradient(135deg, ${videoColors.join(', ')})`
          : `linear-gradient(135deg, ${videoColors[0]}, ${videoColors[1] || videoColors[0]})`;
        const videoGlowStyle = element.glowingBorder ? {
          boxShadow: `0 0 15px ${videoColors[0]}, 0 0 30px ${videoColors[1] || videoColors[0]}${videoColors[2] ? `, 0 0 45px ${videoColors[2]}` : ''}${videoColors[3] ? `, 0 0 60px ${videoColors[3]}` : ''}`,
          border: `3px solid transparent`,
          backgroundImage: `linear-gradient(#000, #000), ${videoGradientGlow}`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        } : {};
        const videoMediaWidth = getResponsiveMediaWidth(element);
        // Respect user's mobile size setting
        const effectiveVideoWidth = videoMediaWidth;
        const videoSpacing = getResponsiveSpacing(element);
        const showVideoShadow = element.showShadow !== false;
        return element.videoUrl ? (
          <div 
            key={element.id} 
            className={`${widthClass} flex ${getResponsiveAlign(element) === 'left' ? 'justify-start' : getResponsiveAlign(element) === 'right' ? 'justify-end' : 'justify-center'}`}
            style={{ marginBottom: isInGroup ? 0 : `${videoSpacing}rem` }}
          >
            <video
              {...dragProps}
              src={element.videoUrl}
              controls
              className={`rounded-lg ${showVideoShadow ? 'shadow-lg' : ''} ${baseClass} ${animationClass}`}
              style={{ 
                width: isInGroup ? '100%' : `${effectiveVideoWidth}%`,
                maxWidth: viewportSize === 'mobile' ? '100%' : '150%',
                ...videoGlowStyle,
              }}
            />
          </div>
        ) : null;
      case 'card':
        const cardConfig = element.cardConfig || {
          title: 'Título',
          subtitle: 'Subtítulo',
          description: 'Descrição',
          showButton: true,
          buttonText: 'Saiba Mais',
          buttonLink: '#',
          theme: 'dark' as const,
        };
        
        const getCardStyles = () => {
          if (cardConfig.theme === 'light') {
            return {
              bg: '#ffffff',
              text: '#1a1a2e',
              accent: '#3b82f6',
              border: 'rgba(0,0,0,0.1)',
            };
          } else if (cardConfig.theme === 'custom') {
            return {
              bg: cardConfig.customBgColor || '#1a1a2e',
              text: cardConfig.customTextColor || '#ffffff',
              accent: cardConfig.customAccentColor || '#3b82f6',
              border: 'rgba(255,255,255,0.1)',
            };
          }
          return {
            bg: '#1a1a2e',
            text: '#ffffff',
            accent: '#3b82f6',
            border: 'rgba(255,255,255,0.1)',
          };
        };
        
        const cardStyles = getCardStyles();
        
        // Add margin-bottom for vertical spacing between cards
        const cardSpacing = getResponsiveSpacing(element);
        return (
          <div
            key={element.id}
            {...dragProps}
            className={`${widthClass} ${baseClass} ${animationClass}`}
            style={{ maxWidth: '380px', margin: '0 auto', marginBottom: `${cardSpacing}rem` }}
          >
            <div
              className="rounded-xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-2"
              style={{
                backgroundColor: cardStyles.bg,
                border: `1px solid ${cardStyles.border}`,
                color: cardStyles.text,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${cardStyles.accent}20` }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ color: cardStyles.accent }}>
                    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <span 
                  className="text-lg font-semibold"
                  style={{ color: cardStyles.accent }}
                >
                  {cardConfig.title}
                </span>
              </div>
              
              {cardConfig.subtitle && (
                <p className="text-sm opacity-60 mb-2">{cardConfig.subtitle}</p>
              )}
              
              <p className="text-sm opacity-80 mb-4">{cardConfig.description}</p>
              
              {cardConfig.showButton && (
                <a
                  href={cardConfig.buttonLink || '#'}
                  className="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: cardStyles.accent }}
                  onClick={(e) => { if (!cardConfig.buttonLink || cardConfig.buttonLink === '#') e.preventDefault(); }}
                >
                  {cardConfig.buttonText || 'Saiba Mais'}
                </a>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Group elements by inlineGroup for side-by-side rendering
  const groupElements = (elements: SectionElement[]) => {
    const groups: { group: string | null; elements: SectionElement[] }[] = [];
    let currentGroup: { group: string | null; elements: SectionElement[] } | null = null;

    elements.forEach((element) => {
      const group = element.inlineGroup || null;
      
      if (group) {
        // If same group as current, add to it
        if (currentGroup && currentGroup.group === group) {
          currentGroup.elements.push(element);
        } else {
          // Start new group
          if (currentGroup) groups.push(currentGroup);
          currentGroup = { group, elements: [element] };
        }
      } else {
        // No group - push current group if exists, then add as single
        if (currentGroup) {
          groups.push(currentGroup);
          currentGroup = null;
        }
        groups.push({ group: null, elements: [element] });
      }
    });

    if (currentGroup) groups.push(currentGroup);
    return groups;
  };

  const t = translations[presellData.language || 'pt'];

  const footerBgColor = presellData.footerStyle?.backgroundColor || '#0a0a0a';

  // Make the "page chrome" (space above the first section) match the first section background
  const firstSectionBackgroundStyle: React.CSSProperties = (() => {
    const first = sections[0];

    // If there is no section yet, fall back to the page background settings (not the footer)
    if (!first) {
      const g4 = presellData.colors.backgroundGradient4;
      const g3 = presellData.colors.backgroundGradient3;
      const g2 = presellData.colors.backgroundGradient;

      if (g4?.enabled) {
        return { background: `linear-gradient(135deg, ${g4.color1}, ${g4.color2}, ${g4.color3}, ${g4.color4})` };
      }
      if (g3?.enabled) {
        return { background: `linear-gradient(135deg, ${g3.color1}, ${g3.color2}, ${g3.color3})` };
      }
      if (g2?.enabled) {
        return { background: `linear-gradient(135deg, ${g2.color1}, ${g2.color2})` };
      }

      return { backgroundColor: presellData.colors.background || footerBgColor };
    }

    // Don't duplicate the background image on the wrapper - section handles it
    if (first.backgroundImage) {
      return { backgroundColor: 'transparent' };
    }

    if (first.backgroundGradient?.enabled) {
      return { background: getGradientStyle(first.backgroundGradient) };
    }

    return { backgroundColor: first.backgroundColor || '#1a1a2e' };
  })();

  return (
    <div className="relative min-h-screen flex flex-col" style={firstSectionBackgroundStyle}>
      <div className="flex-1 flex flex-col">
      <style>
        {`
          @keyframes neonPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          html {
            scroll-behavior: smooth;
          }
          
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
        `}
      </style>

      {/* Top Logo (when floating header is disabled) */}
      {!floatingHeader.enabled && presellData.topLogo?.enabled && presellData.topLogo.imageUrl && (
        <div
          style={{
            padding: '1.5rem 2rem',
            display: 'flex',
            justifyContent: presellData.topLogo.position === 'left' ? 'flex-start' : presellData.topLogo.position === 'right' ? 'flex-end' : 'center',
          }}
        >
          <img
            src={presellData.topLogo.imageUrl}
            alt="Logo"
            style={{
              width: `${presellData.topLogo.size || 150}px`,
              objectFit: 'contain',
            }}
          />
        </div>
      )}

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
      <main className="flex-1">
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

            {(() => {
              // Get the current layout based on viewport
              const deviceKey = viewportSize === 'mobile' ? 'mobile' : viewportSize === 'tablet' ? 'tablet' : 'desktop';
              const currentLayout = section.responsiveLayout?.[deviceKey] || section.layout;
              const columnSettings = section.responsiveColumnSettings?.[deviceKey] || {
                leftColumnElements: section.leftColumnElements,
                rightColumnElements: section.rightColumnElements,
                columnGap: section.columnGap,
                columnWidthRatio: section.columnWidthRatio,
              };
              
              // DISABLE two-columns layout on mobile - force vertical
              const isMobileViewport = viewportSize === 'mobile';
              const isColumnsLayout = !isMobileViewport && (currentLayout === 'two-columns' || currentLayout === 'two-columns-reverse');
              
              const getWidthClass = (ratio: string | undefined, isLeft: boolean) => {
                if (!ratio || ratio === '50-50') return 'w-1/2';
                if (ratio === '40-60') return isLeft ? 'w-[40%]' : 'w-[60%]';
                if (ratio === '60-40') return isLeft ? 'w-[60%]' : 'w-[40%]';
                if (ratio === '30-70') return isLeft ? 'w-[30%]' : 'w-[70%]';
                if (ratio === '70-30') return isLeft ? 'w-[70%]' : 'w-[30%]';
                return 'w-1/2';
              };

              return (
                <div 
                  className={`max-w-6xl mx-auto relative z-10 flex-1 ${
                    currentLayout === 'horizontal' 
                      ? 'flex flex-wrap items-center justify-center gap-8' 
                      : isColumnsLayout
                        ? 'flex flex-col'
                        : 'flex flex-col items-stretch'
                  }`}
                >
                  {/* Two columns layout - only for desktop/tablet */}
                  {isColumnsLayout ? (
                    <div 
                      className={`flex flex-row gap-6 w-full items-start ${currentLayout === 'two-columns-reverse' ? 'flex-row-reverse' : ''}`}
                      style={{ gap: columnSettings.columnGap || '2rem' }}
                    >
                      {/* Left Column */}
                      <div className={`${getWidthClass(columnSettings.columnWidthRatio, true)} flex flex-col items-start`}>
                        {section.elements
                          .filter(el => columnSettings.leftColumnElements?.includes(el.id) || 
                            (!columnSettings.leftColumnElements?.length && !columnSettings.rightColumnElements?.length && 
                              section.elements.indexOf(el) < Math.ceil(section.elements.length / 2)))
                          .map((element) => {
                            const elIndex = section.elements.findIndex(e => e.id === element.id);
                            return renderElement(element, section.id, elIndex, currentLayout, false);
                          })}
                      </div>
                      
                      {/* Right Column */}
                      <div className={`${getWidthClass(columnSettings.columnWidthRatio, false)} flex flex-col items-start`}>
                        {section.elements
                          .filter(el => columnSettings.rightColumnElements?.includes(el.id) ||
                            (!columnSettings.leftColumnElements?.length && !columnSettings.rightColumnElements?.length && 
                              section.elements.indexOf(el) >= Math.ceil(section.elements.length / 2)))
                          .map((element) => {
                            const elIndex = section.elements.findIndex(e => e.id === element.id);
                            return renderElement(element, section.id, elIndex, currentLayout, false);
                          })}
                      </div>
                    </div>
                  ) : (
                    /* Regular layout - Render grouped elements */
                    groupElements(section.elements).map((group, groupIndex) => {
                      // DISABLE inline grouping on mobile - render as individual elements
                      if (!isMobileViewport && group.group && group.elements.length > 1) {
                        // Render inline group - elements side by side (desktop/tablet only)
                        return (
                          <div key={`group-${groupIndex}`} className="flex flex-row flex-wrap items-center gap-6 w-full mb-4 md:flex-nowrap">
                            {group.elements.map((element) => {
                              const elIndex = section.elements.findIndex(e => e.id === element.id);
                              return renderElement(element, section.id, elIndex, currentLayout, true);
                            })}
                          </div>
                        );
                      } else {
                        // Render elements individually (mobile or ungrouped elements)
                        return group.elements.map((element) => {
                          const elIndex = section.elements.findIndex(e => e.id === element.id);
                          return renderElement(element, section.id, elIndex, currentLayout, false);
                        });
                      }
                    })
                  )}
                </div>
              );
            })()}

            {/* Resize handle */}
            {onUpdateSectionHeight && (
              <div
                className="absolute bottom-0 left-0 right-0 h-4 cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-30"
                onMouseDown={(e) => {
                  const sectionElement = e.currentTarget.parentElement;
                  if (sectionElement) {
                    handleResizeStart(e, section.id, sectionElement);
                  }
                }}
              >
                <div className="w-16 h-1.5 bg-white/50 rounded-full hover:bg-white/80 transition-colors" />
                <GripHorizontal className="w-4 h-4 text-white/50 absolute" />
              </div>
            )}
          </section>
        ))}
      </main>
      </div>

      {sections.length === 0 && (
        <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="text-xl mb-2">Nenhuma seção adicionada</p>
            <p className="text-sm">Adicione seções na aba "Criar Site" para começar</p>
          </div>
        </div>
      )}

      {/* Professional Footer */}
      {sections.length > 0 && (
        <footer
          style={{
            backgroundColor: presellData.footerStyle?.backgroundColor || '#0a0a0a',
            color: presellData.footerStyle?.textColor || '#888888',
            padding: '3rem 2rem 2rem',
          }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Logo */}
            {floatingHeader.logoImage && (
              <div className="flex justify-center mb-6">
                <img src={floatingHeader.logoImage} alt="Logo" className="h-10 object-contain opacity-70" />
              </div>
            )}

            {/* Sections Navigation */}
            {presellData.footerStyle?.showSections !== false && sections.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#section-${section.id}`}
                    onClick={(e) => handleSmoothScroll(e, section.id)}
                    className="text-sm hover:text-white transition-colors opacity-70 hover:opacity-100"
                    style={{ color: presellData.footerStyle?.textColor || '#888888' }}
                  >
                    {section.name}
                  </a>
                ))}
              </div>
            )}

            {/* Divider */}
            <div 
              className="border-t my-6 opacity-20"
              style={{ borderColor: presellData.footerStyle?.textColor || '#888888' }}
            />

            {/* Custom Footer Text */}
            {presellData.footerStyle?.customText && (
              <div 
                className="text-center text-sm mb-4 whitespace-pre-line"
                style={{ color: presellData.footerStyle?.textColor || '#888888' }}
              >
                {presellData.footerStyle.customText}
              </div>
            )}

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {presellData.termsLink && (
                <a
                  href={presellData.termsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:opacity-100 transition-colors opacity-70"
                  style={{ color: presellData.footerStyle?.linksColor || presellData.footerStyle?.textColor || '#888888' }}
                >
                  {presellData.footerStyle?.termsText || t.terms}
                </a>
              )}
              {presellData.termsLink && presellData.privacyLink && (
                <span className="opacity-30">|</span>
              )}
              {presellData.privacyLink && (
                <a
                  href={presellData.privacyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:opacity-100 transition-colors opacity-70"
                  style={{ color: presellData.footerStyle?.linksColor || presellData.footerStyle?.textColor || '#888888' }}
                >
                  {presellData.footerStyle?.privacyText || t.privacy}
                </a>
              )}
            </div>

            {/* Copyright */}
            <div className="text-center text-xs opacity-50">
              {presellData.footerStyle?.copyrightText || `© ${new Date().getFullYear()} Todos os direitos reservados.`}
            </div>
          </div>
        </footer>
      )}

      {/* Cookie Consent Banner Preview */}
      {presellData.cookieBanner?.showInPreview && (
        <div
          style={{
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: presellData.cookieBanner?.backgroundColor || '#1a1a2e',
            color: presellData.cookieBanner?.textColor || '#ffffff',
            padding: '1rem 2rem',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap' as const,
            gap: '1rem',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.875rem', flex: 1, minWidth: '200px' }}>
            {presellData.cookieBanner?.text || presellData.consentBannerText || 'Utilizamos cookies apenas após o seu consentimento, conforme nossa'}{' '}
            <a 
              href={presellData.privacyLink || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: presellData.cookieBanner?.linkColor || '#8B5CF6', textDecoration: 'underline' }}
            >
              {t.privacy}
            </a>.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              style={{
                background: presellData.cookieBanner?.buttonAcceptBg || '#8B5CF6',
                color: presellData.cookieBanner?.buttonAcceptText || '#ffffff',
                border: 'none',
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              {presellData.cookieBanner?.acceptText || 'Aceitar'}
            </button>
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
