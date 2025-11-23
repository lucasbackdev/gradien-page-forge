import { PresellData, translations } from '@/types/presell';

interface PreviewPanelProps {
  data: PresellData;
}

export const PreviewPanel = ({ data }: PreviewPanelProps) => {
  const t = translations[data.language];
  const renderElement = (element: any) => {
    const style = {
      fontSize: element.fontSize,
      fontFamily: element.fontFamily,
      color: element.color,
    };

    switch (element.type) {
      case 'title':
        return (
          <h2 key={element.id} style={style} className="font-bold mb-4">
            {element.content}
          </h2>
        );
      case 'subtitle':
        return (
          <h3 key={element.id} style={style} className="font-semibold mb-3">
            {element.content}
          </h3>
        );
      case 'paragraph':
        return (
          <p key={element.id} style={style} className="mb-4 leading-relaxed">
            {element.content}
          </p>
        );
      case 'image':
        return (
          <div key={element.id} className="mb-4">
            {element.imageUrl && (
              <a 
                href={data.globalImageAffiliateLink || data.affiliateLink} 
                target="_blank" 
                rel="noopener noreferrer"
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
          <a
            key={element.id}
            href={element.link || data.globalCtaAffiliateLink || data.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: data.colors.button,
              color: data.colors.buttonText,
              fontSize: data.fontSizes.ctaButton,
            }}
            className="inline-block px-8 py-4 rounded-lg font-bold text-center hover:opacity-90 transition-opacity mb-4"
          >
            {element.content}
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="h-full overflow-y-auto"
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
            <a href={data.globalImageAffiliateLink || data.affiliateLink} target="_blank" rel="noopener noreferrer">
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
            href={data.globalCtaAffiliateLink || data.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
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
            {data.elements.map(renderElement)}
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-16 pt-8 border-t border-gray-300 text-center text-sm space-x-4">
          <a
            href={data.termsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline opacity-70"
          >
            {t.terms}
          </a>
          <span className="opacity-50">|</span>
          <a
            href={data.privacyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline opacity-70"
          >
            {t.privacy}
          </a>
        </div>
      </div>
    </div>
  );
};
