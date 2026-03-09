import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/TopBar';
import { EditorPanel } from '@/components/EditorPanel';
import { PreviewPanel } from '@/components/PreviewPanel';
import { SectionPreview } from '@/components/SectionPreview';
import { ResponsivePreview, ViewportSize, getViewportWidth } from '@/components/ResponsivePreview';
import { PresellData, PresellElement, defaultPresellData, translations } from '@/types/presell';
import { PresellSection, SectionElement } from '@/types/sections';
import { TrackingPanel } from '@/components/TrackingPanel';
import { ChatBuilder } from '@/components/ChatBuilder';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSavedPages, SavedPage } from '@/hooks/useSavedPages';
import { usePublicTemplates, PublicTemplate } from '@/hooks/usePublicTemplates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, FileText, Trash2, Globe, Lock, Upload, Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutTemplate, Star, Rocket } from 'lucide-react';
import JSZip from 'jszip';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin, subscription, signOut } = useAuth();
  const { savedPages, loading: pagesLoading, savePage, updatePage, deletePage } = useSavedPages();
  const { templates: publicTemplates, loading: templatesLoading, createTemplate, updateTemplate, deleteTemplate, togglePublic } = usePublicTemplates();
  const [presellData, setPresellData] = useState<PresellData>(defaultPresellData);
  const [darkMode, setDarkMode] = useState(false);
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');
  const [currentPageId, setCurrentPageId] = useState<string | undefined>(undefined);
  const [highlightedElement, setHighlightedElement] = useState<{ sectionId: string; elementId: string } | null>(null);
  const [trackingPanelOpen, setTrackingPanelOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'editor' | 'chat'>('editor');
  
  // Undo/Redo history
  const historyRef = useRef<PresellData[]>([defaultPresellData]);
  const historyIndexRef = useRef(0);
  const isUndoRedoRef = useRef(false);

  const pushHistory = useCallback((data: PresellData) => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }
    const history = historyRef.current;
    const index = historyIndexRef.current;
    // Remove future states
    historyRef.current = history.slice(0, index + 1);
    historyRef.current.push(JSON.parse(JSON.stringify(data)));
    // Keep max 30 states
    if (historyRef.current.length > 30) {
      historyRef.current = historyRef.current.slice(-30);
    }
    historyIndexRef.current = historyRef.current.length - 1;
  }, []);

  const handleSetPresellData = useCallback((updater: PresellData | ((prev: PresellData) => PresellData)) => {
    setPresellData(prev => {
      const newData = typeof updater === 'function' ? updater(prev) : updater;
      pushHistory(newData);
      return newData;
    });
  }, [pushHistory]);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      isUndoRedoRef.current = true;
      const restored = JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current]));
      setPresellData(restored);
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      isUndoRedoRef.current = true;
      const restored = JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current]));
      setPresellData(restored);
    }
  }, []);
  
  // Dialog states
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageName, setPageName] = useState('');
  const [saving, setSaving] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<SavedPage | null>(null);
  
  // Template creation dialog states (for admin)
  const [createTemplateOpen, setCreateTemplateOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [templateLevel, setTemplateLevel] = useState<'simples' | 'intermediário' | 'avançado'>('simples');
  const [templateIcon, setTemplateIcon] = useState('📄');
  const [templateIsPublic, setTemplateIsPublic] = useState(false);
  const [creatingTemplate, setCreatingTemplate] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<PublicTemplate | null>(null);
  const [deleteTemplateDialogOpen, setDeleteTemplateDialogOpen] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auto-save every 3 minutes when enabled
  useEffect(() => {
    if (!autoSaveEnabled || !currentPageId) return;
    const interval = setInterval(async () => {
      const currentPage = savedPages.find(p => p.id === currentPageId);
      if (!currentPage) return;
      await updatePage(currentPageId, currentPage.name, presellData);
      toast({
        title: "✅ Salvo automaticamente",
        description: "Sua página foi salva com sucesso.",
        className: "bg-green-600 text-white border-green-700",
      });
    }, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [autoSaveEnabled, currentPageId, presellData, savedPages, updatePage]);

  const handleUpdateElements = (elements: PresellElement[]) => {
    handleSetPresellData(prev => ({ ...prev, elements }));
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

  const generateTrackingHeadScripts = (data: PresellData): string => {
    const scripts: string[] = [];
    const tc = data.trackingConfig;
    
    // Google Tag Manager - head snippet
    if (tc?.gtmId) {
      scripts.push(`  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${tc.gtmId}');</script>
  <!-- End Google Tag Manager -->`);
    }
    
    // Google Ads global site tag (gtag.js)
    if (tc?.googleAdsId) {
      scripts.push(`  <!-- Global site tag (gtag.js) - Google Ads -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${tc.googleAdsId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${tc.googleAdsId}');
  </script>`);
    }
    
    return scripts.join('\n');
  };

  const generateTrackingBodyScripts = (data: PresellData): string => {
    const scripts: string[] = [];
    const tc = data.trackingConfig;
    
    // GTM noscript fallback
    if (tc?.gtmId) {
      scripts.push(`<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${tc.gtmId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`);
    }
    
    // Conversion tracking script (fires on CTA clicks)
    if (tc?.conversionId && tc?.conversionLabel) {
      scripts.push(`<script>
document.addEventListener('DOMContentLoaded', function() {
  var buttons = document.querySelectorAll('.element-button, .shiny-cta');
  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          'send_to': '${tc.conversionId}/${tc.conversionLabel}'
        });
      }
    });
  });
});
</script>`);
    }
    
    return scripts.join('\n');
  };

  const handleDownload = async () => {
    try {
      const zip = new JSZip();
      const t = translations[presellData.language || 'pt'];
      
      // Generate sections HTML/CSS
      const sectionsHtml = generateSectionsHTML(presellData);
      const sectionsCss = generateSectionsCSS(presellData);
      
      // IP Tracking removed for Google Ads compliance

      const trackingHeadScripts = generateTrackingHeadScripts(presellData);
      const trackingBodyScripts = generateTrackingBodyScripts(presellData);

      const fullHtml = `<!DOCTYPE html>
<html lang="${presellData.language || 'pt'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${presellData.pageTitle || 'Presell'}</title>
  ${presellData.favicon ? `<link rel="icon" href="public/favicon.png">` : ''}
${trackingHeadScripts}
  <style>
${sectionsCss}
  </style>
</head>
<body>
${trackingBodyScripts}
${sectionsHtml}
${presellData.whatsappEnabled && presellData.whatsappLink ? `
<a href="${presellData.whatsappLink}" class="whatsapp-button" target="_blank">
  <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
</a>
` : ''}

<!-- Cookie Consent Banner (GDPR / DSGVO) -->
<div id="cookieConsent" style="position:fixed;bottom:0;left:0;right:0;background:${presellData.cookieBanner?.backgroundColor || '#1a1a2e'};color:${presellData.cookieBanner?.textColor || '#fff'};padding:1rem 2rem;z-index:10000;display:none;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;box-shadow:0 -4px 20px rgba(0,0,0,0.3);">
  <p style="margin:0;font-size:0.875rem;flex:1;min-width:200px;">${presellData.cookieBanner?.text || presellData.consentBannerText || 'Utilizamos cookies apenas após o seu consentimento, conforme nossa'} <a href="${presellData.privacyLink || '#'}" target="_blank" style="color:${presellData.cookieBanner?.linkColor || '#8B5CF6'};text-decoration:underline;">${translations[presellData.language || 'pt'].privacy}</a>.</p>
  <div style="display:flex;gap:0.5rem;">
    <button onclick="acceptCookies()" style="background:${presellData.cookieBanner?.buttonAcceptBg || '#8B5CF6'};color:${presellData.cookieBanner?.buttonAcceptText || '#fff'};border:none;padding:0.5rem 1.5rem;border-radius:0.5rem;cursor:pointer;font-weight:bold;">${presellData.cookieBanner?.acceptText || 'Aceitar'}</button>
  </div>
</div>

<script>
// Responsive sizing for media, text and spacing
function applyResponsiveSizes() {
  var width = window.innerWidth;
  var device = width <= 768 ? 'mobile' : width <= 1024 ? 'tablet' : 'desktop';
  
  document.querySelectorAll('[data-desktop-width]').forEach(function(el) {
    var size = el.getAttribute('data-' + device + '-width');
    if (size) { el.style.width = size + '%'; el.style.maxWidth = size + '%'; }
  });
  
  document.querySelectorAll('[data-desktop-size]').forEach(function(el) {
    var size = el.getAttribute('data-' + device + '-size');
    if (size) { el.style.fontSize = size; }
  });
  
  document.querySelectorAll('[data-desktop-align]').forEach(function(el) {
    var align = el.getAttribute('data-' + device + '-align');
    if (align) { el.style.textAlign = align; }
  });
  
  document.querySelectorAll('[data-desktop-spacing]').forEach(function(el) {
    var spacing = el.getAttribute('data-' + device + '-spacing');
    if (spacing) { el.style.marginBottom = spacing + 'rem'; }
  });
}

document.addEventListener('DOMContentLoaded', applyResponsiveSizes);
window.addEventListener('resize', applyResponsiveSizes);

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  var menuBtn = document.querySelector('.mobile-menu-btn');
  var mobileNav = document.querySelector('.mobile-nav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function() {
      mobileNav.classList.toggle('hidden');
    });
  }
});

// Cookie Consent (GDPR/DSGVO compliant)
document.addEventListener('DOMContentLoaded', function() {
  var consent = localStorage.getItem('cookie_consent');
  if (!consent) {
    document.getElementById('cookieConsent').style.display = 'flex';
  }
});

function acceptCookies() {
  localStorage.setItem('cookie_consent', 'accepted');
  document.getElementById('cookieConsent').style.display = 'none';
}

function declineCookies() {
  localStorage.setItem('cookie_consent', 'declined');
  document.getElementById('cookieConsent').style.display = 'none';
}
</script>
<!--PRESELL_DATA:${JSON.stringify(presellData)}-->
</body>
</html>`;

      zip.file('index.html', fullHtml);
      
      // Add Netlify _redirects file for proper routing
      zip.file('_redirects', '/* /index.html 200');
      
      const publicFolder = zip.folder('public');
      
      if (presellData.floatingHeader.logoImage && publicFolder) {
        const logoData = presellData.floatingHeader.logoImage.split(',')[1];
        if (logoData) {
          publicFolder.file('header-logo.png', logoData, { base64: true });
        }
      }

      // Top Logo
      if (presellData.topLogo?.enabled && presellData.topLogo.imageUrl && publicFolder) {
        const topLogoData = presellData.topLogo.imageUrl.split(',')[1];
        if (topLogoData) {
          publicFolder.file('top-logo.png', topLogoData, { base64: true });
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

  // Helper function to escape special regex characters
  const escapeRegExpExport = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Helper function to render a single element as HTML
  const renderElementHTML = (el: SectionElement, sectionIndex: number, elIndex: number, data: PresellData): string => {
    if (el.type === 'text') {
      const textStyle = el.gradientText?.enabled && el.gradientText.colors?.length
        ? `background: linear-gradient(135deg, ${el.gradientText.colors.join(', ')}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; display: inline-block;`
        : `color: ${el.color || '#ffffff'};`;
      
      let content = el.content || '';
      if (el.highlightWords?.enabled && el.highlightWords.words) {
        const words = el.highlightWords.words.split(',').map(w => w.trim()).filter(Boolean);
        words.forEach(word => {
          // Escape special regex characters to allow any character to be highlighted
          const escapedWord = escapeRegExpExport(word);
          const regex = new RegExp(`(${escapedWord})`, 'gi');
          content = content.replace(regex, `<span style="color: ${el.highlightWords!.color}">$1</span>`);
        });
      }
      
      // Get responsive alignment and sizes
      const alignDesktop = el.responsiveAlign?.desktop || 'center';
      const alignTablet = el.responsiveAlign?.tablet || alignDesktop;
      const alignMobile = el.responsiveAlign?.mobile || alignTablet;
      
      const sizeDesktop = el.responsiveFontSize?.desktop || el.fontSize || '18px';
      const sizeTablet = el.responsiveFontSize?.tablet || sizeDesktop;
      const sizeMobile = el.responsiveFontSize?.mobile || sizeTablet;
      
      return `<div class="element-text" data-desktop-align="${alignDesktop}" data-tablet-align="${alignTablet}" data-mobile-align="${alignMobile}" data-desktop-size="${sizeDesktop}" data-tablet-size="${sizeTablet}" data-mobile-size="${sizeMobile}" style="${textStyle} text-align: ${alignDesktop}; font-size: ${sizeDesktop}; font-weight: ${el.fontWeight || 'normal'}; line-height: 1.4; margin-bottom: 0.75rem; white-space: pre-line;">${content}</div>`;
    }
    if (el.type === 'button') {
      const isShinyButton = data.buttonStyle.template === 'shiny-green';
      const scrollTargetSection = el.scrollToSection;
      
      // Get button background style
      let buttonBgStyle = '';
      if (el.buttonColor?.useCustomColor) {
        if (el.buttonColor.colorType === 'gradient') {
          const colors = el.buttonColor.gradientColor3
            ? `${el.buttonColor.gradientColor1}, ${el.buttonColor.gradientColor2}, ${el.buttonColor.gradientColor3}`
            : `${el.buttonColor.gradientColor1}, ${el.buttonColor.gradientColor2}`;
          buttonBgStyle = `background: linear-gradient(135deg, ${colors});`;
        } else {
          buttonBgStyle = `background-color: ${el.buttonColor.solidColor};`;
        }
      }
      
      // Get responsive alignment
      const align = el.responsiveAlign?.desktop || 'center';
      const alignWrapperStyle = `text-align: ${align}; display: block; width: 100%;`;
      
      // Determine click action (no lead popup in exported HTML)
      let clickHandler = '';
      let href = data.affiliateLink || el.link || '#';
      
      if (scrollTargetSection) {
        clickHandler = `onclick="event.preventDefault(); document.getElementById('section-${scrollTargetSection}').scrollIntoView({behavior: 'smooth'});"`;
        href = '#';
      }
      
      if (isShinyButton) {
        const buttonContent = `<span>${el.content || 'Botão'}</span>`;
        return `<div style="${alignWrapperStyle}"><a href="${href}" class="shiny-cta" ${clickHandler}>${buttonContent}</a></div>`;
      }
      
      const buttonContent = el.content || 'Botão';
      const customStyle = buttonBgStyle ? ` style="${buttonBgStyle}"` : '';
      return `<div style="${alignWrapperStyle}"><a href="${href}" class="element-button"${customStyle} ${clickHandler}>${buttonContent}</a></div>`;
    }
    if (el.type === 'image' && el.imageUrl) {
      const glowClass = el.glowingBorder ? 'glow-border' : '';
      const colors = el.glowBorderColors || ['#FF6A00', '#FF2D55'];
      const glowStyle = el.glowingBorder 
        ? `box-shadow: 0 0 15px ${colors[0]}, 0 0 30px ${colors[1] || colors[0]}${colors[2] ? `, 0 0 45px ${colors[2]}` : ''}${colors[3] ? `, 0 0 60px ${colors[3]}` : ''}; border: 3px solid transparent; background-image: linear-gradient(#1a1a2e, #1a1a2e), linear-gradient(135deg, ${colors.join(', ')}); background-origin: border-box; background-clip: padding-box, border-box;`
        : '';
      
      // Get responsive media widths
      const desktopWidth = el.responsiveMediaWidth?.desktop || el.mediaWidth || 100;
      const tabletWidth = el.responsiveMediaWidth?.tablet || desktopWidth;
      const mobileWidth = el.responsiveMediaWidth?.mobile || tabletWidth;
      
      // Get responsive spacing
      const desktopSpacing = el.responsiveSpacing?.desktop ?? 1;
      const tabletSpacing = el.responsiveSpacing?.tablet ?? 0.75;
      const mobileSpacing = el.responsiveSpacing?.mobile ?? 0.5;
      
      // Shadow control
      const showShadow = el.showShadow !== false;
      const shadowClass = showShadow ? 'element-image-shadow' : '';
      
      // Get responsive alignment
      const align = el.responsiveAlign?.desktop || 'center';
      const alignWrapperStyle = `text-align: ${align}; display: block; width: 100%;`;
      
      const imgTag = `<img src="public/section-${sectionIndex}-element-${elIndex}.png" alt="${el.content || 'Imagem'}" class="element-image ${glowClass} ${shadowClass}" style="${glowStyle}" data-desktop-width="${desktopWidth}" data-tablet-width="${tabletWidth}" data-mobile-width="${mobileWidth}" data-desktop-spacing="${desktopSpacing}" data-tablet-spacing="${tabletSpacing}" data-mobile-spacing="${mobileSpacing}">`;
      const wrappedImg = data.affiliateLink 
        ? `<a href="${data.affiliateLink}" class="image-link">${imgTag}</a>`
        : imgTag;
      return `<div style="${alignWrapperStyle}">${wrappedImg}</div>`;
    }
    if (el.type === 'video' && el.videoUrl) {
      const glowClass = el.glowingBorder ? 'glow-border' : '';
      const colors = el.glowBorderColors || ['#FF6A00', '#FF2D55'];
      const glowStyle = el.glowingBorder 
        ? `box-shadow: 0 0 15px ${colors[0]}, 0 0 30px ${colors[1] || colors[0]}${colors[2] ? `, 0 0 45px ${colors[2]}` : ''}${colors[3] ? `, 0 0 60px ${colors[3]}` : ''}; border: 3px solid transparent; background-image: linear-gradient(#1a1a2e, #1a1a2e), linear-gradient(135deg, ${colors.join(', ')}); background-origin: border-box; background-clip: padding-box, border-box;`
        : '';
      
      // Get responsive media widths
      const desktopWidth = el.responsiveMediaWidth?.desktop || el.mediaWidth || 100;
      const tabletWidth = el.responsiveMediaWidth?.tablet || desktopWidth;
      const mobileWidth = el.responsiveMediaWidth?.mobile || tabletWidth;
      
      // Get responsive spacing
      const desktopSpacing = el.responsiveSpacing?.desktop ?? 1;
      const tabletSpacing = el.responsiveSpacing?.tablet ?? 0.75;
      const mobileSpacing = el.responsiveSpacing?.mobile ?? 0.5;
      
      // Shadow control
      const showShadow = el.showShadow !== false;
      const shadowClass = showShadow ? 'element-video-shadow' : '';
      
      // Get responsive alignment
      const align = el.responsiveAlign?.desktop || 'center';
      const alignWrapperStyle = `text-align: ${align}; display: block; width: 100%;`;
      
      const videoTag = `<video src="public/section-${sectionIndex}-video-${elIndex}.mp4" controls class="element-video ${glowClass} ${shadowClass}" style="${glowStyle}" data-desktop-width="${desktopWidth}" data-tablet-width="${tabletWidth}" data-mobile-width="${mobileWidth}" data-desktop-spacing="${desktopSpacing}" data-tablet-spacing="${tabletSpacing}" data-mobile-spacing="${mobileSpacing}"></video>`;
      return `<div style="${alignWrapperStyle}">${videoTag}</div>`;
    }
    if (el.type === 'card') {
      const cardConfig = el.cardConfig || {
        title: 'Título',
        subtitle: 'Subtítulo',
        description: 'Descrição',
        showButton: true,
        buttonText: 'Saiba Mais',
        buttonLink: '#',
        theme: 'dark',
      };
      
      const getCardStyles = () => {
        if (cardConfig.theme === 'light') {
          return { bg: '#ffffff', text: '#1a1a2e', accent: '#3b82f6', border: 'rgba(0,0,0,0.1)' };
        } else if (cardConfig.theme === 'custom') {
          return { 
            bg: cardConfig.customBgColor || '#1a1a2e', 
            text: cardConfig.customTextColor || '#ffffff', 
            accent: cardConfig.customAccentColor || '#3b82f6',
            border: 'rgba(255,255,255,0.1)'
          };
        }
        return { bg: '#1a1a2e', text: '#ffffff', accent: '#3b82f6', border: 'rgba(255,255,255,0.1)' };
      };
      
      const styles = getCardStyles();
      
      // Get responsive spacing for vertical gap between cards
      const desktopSpacing = el.responsiveSpacing?.desktop ?? 1;
      const tabletSpacing = el.responsiveSpacing?.tablet ?? 0.75;
      const mobileSpacing = el.responsiveSpacing?.mobile ?? 0.5;
      
      return `
<div class="element-card" style="max-width: 380px; margin: 0 auto;" data-desktop-spacing="${desktopSpacing}" data-tablet-spacing="${tabletSpacing}" data-mobile-spacing="${mobileSpacing}">
  <div class="card-inner" style="background-color: ${styles.bg}; border: 1px solid ${styles.border}; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.2); transition: transform 0.3s; color: ${styles.text};">
    <div class="card-header" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
      <div class="card-icon" style="width: 2rem; height: 2rem; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; background-color: ${styles.accent}20;">
        <svg width="16" height="16" fill="${styles.accent}" viewBox="0 0 24 24">
          <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </div>
      <span class="card-title" style="font-size: 1.125rem; font-weight: 600; color: ${styles.accent};">${cardConfig.title}</span>
    </div>
    ${cardConfig.subtitle ? `<p class="card-subtitle" style="font-size: 0.875rem; opacity: 0.6; margin-bottom: 0.5rem;">${cardConfig.subtitle}</p>` : ''}
    <p class="card-description" style="font-size: 0.875rem; opacity: 0.8; margin-bottom: 1rem;">${cardConfig.description}</p>
    ${cardConfig.showButton ? `<a href="${cardConfig.buttonLink || '#'}" class="card-button" style="display: inline-block; padding: 0.5rem 1rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500; color: white; background-color: ${styles.accent}; text-decoration: none; transition: opacity 0.2s;">${cardConfig.buttonText || 'Saiba Mais'}</a>` : ''}
  </div>
</div>`;
    }
    return '';
  };

  // Helper to group elements by inlineGroup for export
  const groupElementsForExport = (elements: SectionElement[]) => {
    const groups: { group: string | null; elements: SectionElement[] }[] = [];
    let currentGroup: { group: string | null; elements: SectionElement[] } | null = null;

    elements.forEach((element) => {
      const group = element.inlineGroup || null;
      
      if (group) {
        if (currentGroup && currentGroup.group === group) {
          currentGroup.elements.push(element);
        } else {
          if (currentGroup) groups.push(currentGroup);
          currentGroup = { group, elements: [element] };
        }
      } else {
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

  const generateSectionsHTML = (data: PresellData): string => {
    if (data.sections.length === 0) return '<div class="empty-message">Nenhuma seção adicionada</div>';

    let html = '';

    // Top Logo (when floating header is disabled)
    if (!data.floatingHeader.enabled && data.topLogo?.enabled && data.topLogo.imageUrl) {
      const justify = data.topLogo.position === 'left' ? 'flex-start' : data.topLogo.position === 'right' ? 'flex-end' : 'center';
      html += `
<div style="padding: 1.5rem 2rem; display: flex; justify-content: ${justify};">
  <img src="public/top-logo.png" alt="Logo" style="width: ${data.topLogo.size || 150}px; object-fit: contain;">
</div>`;
    }

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
    html += `\n<main class="page-main">`;

    data.sections.forEach((section, sectionIndex) => {
      const bgStyle = section.backgroundImage 
        ? `background-image: url('public/section-${sectionIndex}-bg.png'); background-size: cover; background-position: center;`
        : section.backgroundGradient?.enabled
          ? `background: ${getGradientCSS(section.backgroundGradient)};`
          : `background-color: ${section.backgroundColor || '#1a1a2e'};`;

      const minHeightStyle = section.minHeight ? `min-height: ${section.minHeight}; display: flex; flex-direction: column; justify-content: center;` : '';

      // Get the desktop layout for export
      const exportLayout = section.responsiveLayout?.desktop || section.layout;
      const columnSettings = section.responsiveColumnSettings?.desktop || {
        leftColumnElements: section.leftColumnElements,
        rightColumnElements: section.rightColumnElements,
        columnGap: section.columnGap,
        columnWidthRatio: section.columnWidthRatio,
      };
      const isColumnsLayout = exportLayout === 'two-columns' || exportLayout === 'two-columns-reverse';

      html += `
<section id="section-${section.id}" class="section section-${exportLayout}" style="${bgStyle} ${minHeightStyle} color: ${section.textColor || '#ffffff'}; padding: ${section.padding || '4rem 2rem'}; position: relative;">
  ${section.backgroundImage ? `<div class="section-overlay" style="background: ${section.backgroundOverlay?.enabled ? getOverlayCSS(section.backgroundOverlay) : 'rgba(0,0,0,0.5)'}; position: absolute; inset: 0; z-index: 0;"></div>` : ''}
  <div class="section-content" style="position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center;">`;

      if (isColumnsLayout) {
        // Render two columns layout
        const ratio = columnSettings.columnWidthRatio || '50-50';
        const leftWidth = ratio === '40-60' ? '40%' : ratio === '60-40' ? '60%' : ratio === '30-70' ? '30%' : ratio === '70-30' ? '70%' : '50%';
        const rightWidth = ratio === '40-60' ? '60%' : ratio === '60-40' ? '40%' : ratio === '30-70' ? '70%' : ratio === '70-30' ? '30%' : '50%';
        const flexDir = exportLayout === 'two-columns-reverse' ? 'flex-direction: row-reverse;' : '';
        
        const leftElements = section.elements.filter(el => 
          columnSettings.leftColumnElements?.includes(el.id) || 
          (!columnSettings.leftColumnElements?.length && !columnSettings.rightColumnElements?.length && 
            section.elements.indexOf(el) < Math.ceil(section.elements.length / 2))
        );
        const rightElements = section.elements.filter(el => 
          columnSettings.rightColumnElements?.includes(el.id) ||
          (!columnSettings.leftColumnElements?.length && !columnSettings.rightColumnElements?.length && 
            section.elements.indexOf(el) >= Math.ceil(section.elements.length / 2))
        );

        html += `
    <div class="columns-container" style="display: flex; gap: ${columnSettings.columnGap || '2rem'}; ${flexDir} flex-wrap: wrap;">
      <div class="column-left" style="width: ${leftWidth}; min-width: 280px; flex: 1;">
        ${leftElements.map((el, elIndex) => renderElementHTML(el, sectionIndex, section.elements.indexOf(el), data)).join('')}
      </div>
      <div class="column-right" style="width: ${rightWidth}; min-width: 280px; flex: 1;">
        ${rightElements.map((el, elIndex) => renderElementHTML(el, sectionIndex, section.elements.indexOf(el), data)).join('')}
      </div>
    </div>`;
      } else {
        // Regular layout - group elements by inlineGroup
        const groupedElements = groupElementsForExport(section.elements);
        html += groupedElements.map(group => {
          if (group.group && group.elements.length > 1) {
            // Render inline group with class for CSS targeting
            return `<div class="inline-group" style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center; margin-bottom: 1rem;">
              ${group.elements.map((el) => renderElementHTML(el, sectionIndex, section.elements.indexOf(el), data)).join('')}
            </div>`;
          } else {
            // Render single element
            return group.elements.map((el) => renderElementHTML(el, sectionIndex, section.elements.indexOf(el), data)).join('');
          }
        }).join('');
      }

      html += `
  </div>
</section>`;
    });

    html += `\n</main>`;

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
    ${data.footerStyle?.customText ? `<div class="footer-custom-text" style="color: ${footerText}; text-align: center; font-size: 0.875rem; margin-bottom: 1rem; white-space: pre-line;">${data.footerStyle.customText}</div>` : ''}
    <div class="footer-legal">
      ${data.termsLink ? `<a href="${data.termsLink}" target="_blank" rel="noopener noreferrer" style="color: ${data.footerStyle?.linksColor || footerText}">${data.footerStyle?.termsText || t.terms}</a>` : ''}
      ${data.termsLink && data.privacyLink ? '<span class="footer-separator">|</span>' : ''}
      ${data.privacyLink ? `<a href="${data.privacyLink}" target="_blank" rel="noopener noreferrer" style="color: ${data.footerStyle?.linksColor || footerText}">${data.footerStyle?.privacyText || t.privacy}</a>` : ''}
    </div>
    <div class="footer-copyright">${data.footerStyle?.copyrightText || `© ${new Date().getFullYear()} Todos os direitos reservados.`}</div>
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

    const footerBgColor = data.footerStyle?.backgroundColor || '#0a0a0a';

    // Make any empty "chrome" (space outside sections) match the FIRST section background
    // so you never see a black band above the first section.
    const pageChromeBg = (() => {
      const first = data.sections[0];
      if (first?.backgroundImage) {
        // In the exported ZIP we save the first section background as section-0-bg.png
        return {
          css: `url('public/section-0-bg.png')`,
          isImage: true,
        };
      }

      if (first?.backgroundGradient?.enabled) {
        return { css: getGradientCSS(first.backgroundGradient), isImage: false };
      }

      if (first?.backgroundColor) {
        return { css: first.backgroundColor, isImage: false };
      }

      const g4 = data.colors.backgroundGradient4;
      const g3 = data.colors.backgroundGradient3;
      const g2 = data.colors.backgroundGradient;

      if (g4?.enabled) return { css: `linear-gradient(135deg, ${g4.color1}, ${g4.color2}, ${g4.color3}, ${g4.color4})`, isImage: false };
      if (g3?.enabled) return { css: `linear-gradient(135deg, ${g3.color1}, ${g3.color2}, ${g3.color3})`, isImage: false };
      if (g2?.enabled) return { css: `linear-gradient(135deg, ${g2.color1}, ${g2.color2})`, isImage: false };

      return { css: data.colors.background || footerBgColor, isImage: false };
    })();

    return `
* { margin: 0; padding: 0; box-sizing: border-box; }
html { 
  font-family: ${data.fonts.body || 'system-ui'}, sans-serif;
  line-height: 1.35;
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
  ${pageChromeBg.isImage ? `background-image: ${pageChromeBg.css};` : `background: ${pageChromeBg.css};`}
  ${pageChromeBg.isImage ? 'background-size: cover; background-position: center;' : ''}
  display: flex;
  flex-direction: column;
}

.page-main {
  flex: 1;
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
  .floating-header {
    width: 95%;
    padding: 0.5rem 1rem;
  }
}

.section {
  position: relative;
}

/* Desktop styles */
@media (min-width: 1024px) {
  .section-vertical .section-content,
  .section-horizontal .section-content {
    max-width: 72rem;
    padding: 0 2rem;
  }
}

/* Tablet styles */
@media (min-width: 769px) and (max-width: 1023px) {
  .section-vertical .section-content,
  .section-horizontal .section-content {
    max-width: 100%;
    padding: 0 1.5rem;
  }
}

/* Mobile styles - expand content to fill screen */
@media (max-width: 768px) {
  .section {
    padding: 2rem 0.5rem !important;
  }
  .section-vertical .section-content,
  .section-horizontal .section-content {
    max-width: 100%;
    width: 100%;
    padding: 0 0.5rem;
  }
  .element-image, .element-video {
    max-width: 100% !important;
    width: 100% !important;
  }
  .element-text {
    line-height: 1.3;
  }
  .element-card {
    max-width: 100% !important;
  }
  .card-inner {
    padding: 1rem !important;
  }
  /* DISABLE two-columns layout on mobile - stack vertically */
  .columns-container {
    flex-direction: column !important;
  }
  .columns-container .column-left,
  .columns-container .column-right {
    width: 100% !important;
    min-width: 100% !important;
  }
  /* DISABLE inline grouping on mobile - stack vertically */
  .inline-group {
    flex-direction: column !important;
    align-items: stretch !important;
  }
  .inline-group > * {
    width: 100% !important;
    flex: none !important;
  }
}

.section-vertical .section-content {
  max-width: 100%;
  width: 100%;
  padding: 0 1rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.section-horizontal .section-content {
  max-width: 100%;
  width: 100%;
  padding: 0 1rem;
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
  max-height: 500px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
}

.element-image-shadow {
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.image-link {
  display: inline-block;
  transition: opacity 0.3s;
  max-width: 100%;
  width: 100%;
}

.image-link:hover {
  opacity: 0.9;
}

.element-video {
  max-width: 100%;
  width: 100%;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
}

.element-video-shadow {
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.element-text {
  line-height: 1.35;
  margin-bottom: 0.5rem;
  white-space: pre-line;
}

.site-footer {
  width: 100%;
  margin-top: auto;
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

/* Card styles */
.element-card {
  width: 100%;
  margin-bottom: 1rem;
}

.card-inner:hover {
  transform: translateY(-8px);
}

.card-button:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .whatsapp-button {
    bottom: 1rem;
    right: 1rem;
  }
  .columns-container {
    flex-direction: column !important;
  }
  .column-left, .column-right {
    width: 100% !important;
  }
}
`;
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  // Check if subscription is active - only block if we definitively know it's not active
  // If subscription is null (still loading or fetch failed), don't block
  const hasAccess = !subscription || subscription.status === 'active';

  if (!hasAccess) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Acesso Expirado</h1>
          <p className="text-muted-foreground mb-6">
            Sua assinatura expirou ou está pendente. Entre em contato com o administrador para liberar seu acesso.
          </p>
          <Button
            onClick={async () => {
              await signOut();
              navigate('/auth');
            }}
            variant="outline"
          >
            Voltar ao Login
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveNew = async () => {
    if (!pageName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a página.",
        variant: "destructive",
      });
      return;
    }

    // Enforce 2-page limit
    if (savedPages.length >= 2) {
      toast({
        title: "Limite atingido",
        description: "Você pode salvar no máximo 2 páginas. Exclua uma para salvar outra.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const result = await savePage(pageName.trim(), presellData);
    setSaving(false);

    if (result) {
      setCurrentPageId(result.id);
      setSaveDialogOpen(false);
      setPageName('');
    }
  };

  const handleUpdateCurrent = async () => {
    if (!currentPageId) {
      setSaveDialogOpen(true);
      return;
    }
    
    const currentPage = savedPages.find(p => p.id === currentPageId);
    if (!currentPage) {
      setSaveDialogOpen(true);
      return;
    }

    setSaving(true);
    await updatePage(currentPageId, currentPage.name, presellData);
    setSaving(false);
  };

  const handleLoadPage = (page: SavedPage) => {
    setPresellData(page.data);
    setCurrentPageId(page.id);
    setLoadDialogOpen(false);
    toast({
      title: "Página carregada",
      description: `"${page.name}" foi carregada para edição.`,
    });
  };

  const handleDeletePage = async () => {
    if (!pageToDelete) return;
    
    const success = await deletePage(pageToDelete.id);
    if (success && currentPageId === pageToDelete.id) {
      setCurrentPageId(undefined);
    }
    setPageToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleSelectTemplate = (template: PublicTemplate) => {
    const clonedData = JSON.parse(JSON.stringify(template.data));
    setPresellData(clonedData);
    setCurrentPageId(undefined);
    setTemplatesOpen(false);
    toast({
      title: "Template aplicado!",
      description: `"${template.name}" foi carregado para edição.`,
    });
  };

  const handleCreateTemplate = async () => {
    if (!templateName.trim() || !user) return;
    
    setCreatingTemplate(true);
    const result = await createTemplate(
      templateName.trim(),
      templateDesc.trim(),
      templateLevel,
      presellData,
      templateIcon,
      templateIsPublic,
      user.id
    );
    setCreatingTemplate(false);
    
    if (result) {
      setCreateTemplateOpen(false);
      setTemplateName('');
      setTemplateDesc('');
      setTemplateLevel('simples');
      setTemplateIcon('📄');
      setTemplateIsPublic(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;
    await deleteTemplate(templateToDelete.id);
    setTemplateToDelete(null);
    setDeleteTemplateDialogOpen(false);
  };

  const getLevelColor = (level: 'simples' | 'intermediário' | 'avançado') => {
    switch (level) {
      case 'simples':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediário':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'avançado':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  const getLevelIcon = (level: 'simples' | 'intermediário' | 'avançado') => {
    switch (level) {
      case 'simples':
        return <FileText className="w-4 h-4" />;
      case 'intermediário':
        return <Star className="w-4 h-4" />;
      case 'avançado':
        return <Rocket className="w-4 h-4" />;
    }
  };

  const currentPageName = currentPageId 
    ? savedPages.find(p => p.id === currentPageId)?.name 
    : null;

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onDownload={handleDownload}
        currentData={presellData}
        onLoadPage={setPresellData}
        currentPageId={currentPageId}
        onPageIdChange={setCurrentPageId}
        onOpenTracking={() => setTrackingPanelOpen(true)}
        onSave={handleUpdateCurrent}
        onOpen={() => setLoadDialogOpen(true)}
        onTemplates={() => setTemplatesOpen(true)}
        currentPageName={currentPageName}
        autoSaveEnabled={autoSaveEnabled}
        onToggleAutoSave={setAutoSaveEnabled}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel - 25% */}
        <div className="w-[25%] min-w-[320px] border-r border-border bg-card overflow-hidden flex flex-col">
          {/* Mode Toggle */}
          <div className="flex border-b border-border bg-muted/50">
            <button
              onClick={() => setEditorMode('editor')}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                editorMode === 'editor'
                  ? 'bg-background text-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🛠️ Editor
            </button>
            <button
              onClick={() => setEditorMode('chat')}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                editorMode === 'chat'
                  ? 'bg-background text-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              💬 Assistente
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            {editorMode === 'editor' ? (
              <EditorPanel 
                data={presellData} 
                onChange={setPresellData} 
                highlightedElement={highlightedElement}
                onClearHighlight={() => setHighlightedElement(null)}
              />
            ) : (
              <ChatBuilder
                data={presellData}
                onChange={setPresellData}
              />
            )}
          </div>
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
                  viewportSize={viewportSize}
                  userId={user?.id}
                  onElementClick={(sectionId, elementId) => setHighlightedElement({ sectionId, elementId })}
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

      {/* Templates Dialog - Área de Transferência */}
      <Dialog open={templatesOpen} onOpenChange={setTemplatesOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5" />
              Área de Transferência
            </DialogTitle>
            <DialogDescription>
              {isAdmin ? 'Gerencie e publique modelos para todos os usuários.' : 'Escolha um modelo para começar.'}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="public" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="public" className="gap-2">
                <Globe className="w-4 h-4" />
                Templates Públicos
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="manage" className="gap-2">
                  <Lock className="w-4 h-4" />
                  Gerenciar (Admin)
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="public" className="flex-1 overflow-auto mt-4">
              <ScrollArea className="h-[50vh]">
                {templatesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : publicTemplates.filter(t => t.is_public).length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <LayoutTemplate className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum template público disponível ainda.</p>
                    {isAdmin && <p className="text-sm mt-2">Crie templates na aba "Gerenciar" e torne-os públicos.</p>}
                  </div>
                ) : (
                  <div className="grid gap-3 pr-4">
                    {publicTemplates.filter(t => t.is_public).map((template) => (
                      <div
                        key={template.id}
                        className="group relative border border-border rounded-xl p-4 hover:border-primary/50 hover:bg-accent/30 transition-all cursor-pointer"
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl">
                            {template.preview_icon || '📄'}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">
                                {template.name}
                              </h3>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getLevelColor(template.level)}`}
                              >
                                {getLevelIcon(template.level)}
                                <span className="ml-1 capitalize">{template.level}</span>
                              </Badge>
                            </div>
                            {template.description && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {template.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>📄 {template.data.sections?.length || 0} seções</span>
                            </div>
                          </div>

                          <Button 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectTemplate(template);
                            }}
                          >
                            Usar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            {isAdmin && (
              <TabsContent value="manage" className="flex-1 overflow-auto mt-4">
                <div className="mb-4">
                  <Button onClick={() => setCreateTemplateOpen(true)} className="gap-2">
                    <Upload className="w-4 h-4" />
                    Publicar Página Atual como Template
                  </Button>
                </div>
                
                <ScrollArea className="h-[45vh]">
                  {templatesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : publicTemplates.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <LayoutTemplate className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum template criado ainda.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 pr-4">
                      {publicTemplates.map((template) => (
                        <div
                          key={template.id}
                          className="border border-border rounded-xl p-4"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl">
                              {template.preview_icon || '📄'}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-foreground">
                                  {template.name}
                                </h3>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getLevelColor(template.level)}`}
                                >
                                  {template.level}
                                </Badge>
                                <Badge variant={template.is_public ? "default" : "secondary"} className="text-xs">
                                  {template.is_public ? <><Globe className="w-3 h-3 mr-1" /> Público</> : <><Lock className="w-3 h-3 mr-1" /> Privado</>}
                                </Badge>
                              </div>
                              {template.description && (
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {template.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={template.is_public}
                                  onCheckedChange={(checked) => togglePublic(template.id, checked)}
                                />
                                <span className="text-xs text-muted-foreground">Público</span>
                              </div>
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => handleSelectTemplate(template)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  setTemplateToDelete(template);
                                  setDeleteTemplateDialogOpen(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            )}
          </Tabs>

          <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border mt-4">
            💡 Dica: Após selecionar um template, você pode editar todos os textos, cores, imagens e seções.
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Template Dialog (Admin only) */}
      <Dialog open={createTemplateOpen} onOpenChange={setCreateTemplateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publicar como Template</DialogTitle>
            <DialogDescription>
              Salve a página atual como um template que outros usuários podem usar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="template-name">Nome do Template</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Ex: Landing Page Moderna"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="template-desc">Descrição</Label>
              <Textarea
                id="template-desc"
                value={templateDesc}
                onChange={(e) => setTemplateDesc(e.target.value)}
                placeholder="Descreva o template..."
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nível</Label>
                <Select value={templateLevel} onValueChange={(v) => setTemplateLevel(v as any)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simples">Simples</SelectItem>
                    <SelectItem value="intermediário">Intermediário</SelectItem>
                    <SelectItem value="avançado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ícone</Label>
                <Input
                  value={templateIcon}
                  onChange={(e) => setTemplateIcon(e.target.value)}
                  placeholder="📄"
                  className="mt-1"
                  maxLength={2}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
              <Switch
                checked={templateIsPublic}
                onCheckedChange={setTemplateIsPublic}
              />
              <div>
                <Label className="text-sm font-medium">Tornar Público</Label>
                <p className="text-xs text-muted-foreground">
                  Todos os usuários poderão ver e usar este template
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateTemplateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTemplate} disabled={creatingTemplate || !templateName.trim()}>
              {creatingTemplate ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Publicar Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Template Confirmation */}
      <AlertDialog open={deleteTemplateDialogOpen} onOpenChange={setDeleteTemplateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir template?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O template "{templateToDelete?.name}" será permanentemente excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTemplate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salvar Página</DialogTitle>
            <DialogDescription>
              Dê um nome para salvar esta página na sua conta. ({savedPages.length}/2 páginas salvas)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="page-name">Nome da Página</Label>
            <Input
              id="page-name"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              placeholder="Ex: Landing Page Principal"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveNew} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Minhas Páginas Salvas</DialogTitle>
            <DialogDescription>
              Selecione uma página para carregar e editar.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-80 pr-4">
            {pagesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : savedPages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma página salva ainda.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedPages.map((page) => (
                  <div
                    key={page.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-accent/50 cursor-pointer ${
                      currentPageId === page.id ? 'border-primary bg-accent/30' : 'border-border'
                    }`}
                    onClick={() => handleLoadPage(page)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{page.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Atualizado {format(new Date(page.updated_at), "d 'de' MMM 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPageToDelete(page);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir página?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A página "{pageToDelete?.name}" será permanentemente excluída.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Tracking Panel */}
      <TrackingPanel
        open={trackingPanelOpen}
        onOpenChange={setTrackingPanelOpen}
        config={presellData.trackingConfig || { gtmId: '', googleAdsId: '', conversionId: '', conversionLabel: '' }}
        onChange={(trackingConfig) => setPresellData(prev => ({ ...prev, trackingConfig }))}
      />
    </div>
  );
};

export default Index;
