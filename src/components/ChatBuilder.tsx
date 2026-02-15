import { useState, useRef, useEffect, useCallback } from 'react';
import { PresellData } from '@/types/presell';
import { PresellSection, SectionElement, SectionType, sectionTemplates, sectionTypesList } from '@/types/sections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Send,
  ImagePlus,
  Bot,
  User,
  Palette,
  Type,
  Layers,
  MousePointer2,
  ArrowLeft,
  Plus,
  Trash2,
  Settings,
  Link2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  content: string;
  imageUrl?: string;
  actions?: ChatAction[];
  timestamp: Date;
}

interface ChatAction {
  label: string;
  icon?: string;
  action: string;
  payload?: any;
}

type ChatStep =
  | 'welcome'
  | 'menu'
  | 'add_section_type'
  | 'add_section_name'
  | 'section_bg_color'
  | 'section_add_element'
  | 'element_text_content'
  | 'element_text_size'
  | 'element_text_color'
  | 'element_image_upload'
  | 'element_button_text'
  | 'element_button_link'
  | 'change_page_bg'
  | 'change_page_title'
  | 'edit_section_select'
  | 'edit_section_menu'
  | 'edit_element_select'
  | 'edit_element_content'
  | 'edit_element_new_text'
  | 'delete_section_select'
  | 'add_affiliate_link';

interface ChatBuilderProps {
  data: PresellData;
  onChange: (data: PresellData) => void;
}

export const ChatBuilder = ({ data, onChange }: ChatBuilderProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState<ChatStep>('welcome');
  const [tempData, setTempData] = useState<Record<string, any>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  const addMessage = useCallback((role: 'bot' | 'user', content: string, actions?: ChatAction[], imageUrl?: string) => {
    const msg: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      role,
      content,
      imageUrl,
      actions,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, msg]);
    return msg;
  }, []);

  // Initialize with welcome
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    setTimeout(() => {
      addMessage('bot', '👋 Olá! Eu sou o assistente de criação de páginas. Vou te ajudar a montar sua página passo a passo!\n\nO que você gostaria de fazer?', [
        { label: '🚀 Criar página do zero', action: 'start_wizard', icon: '🚀' },
        { label: '📋 Ver comandos disponíveis', action: 'show_menu', icon: '📋' },
      ]);
      setCurrentStep('menu');
    }, 300);
  }, [addMessage]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const showMenu = () => {
    addMessage('bot', '📋 **Comandos disponíveis:**\n\nEscolha o que deseja fazer:', [
      { label: '➕ Adicionar seção', action: 'add_section' },
      { label: '🎨 Mudar fundo da página', action: 'change_bg' },
      { label: '📝 Alterar título da aba', action: 'change_title' },
      { label: '✏️ Editar seção existente', action: 'edit_section' },
      { label: '🗑️ Remover seção', action: 'delete_section' },
      { label: '🔗 Definir link de afiliado', action: 'set_affiliate' },
    ]);
    setCurrentStep('menu');
  };

  const showSectionTypes = () => {
    const sectionActions: ChatAction[] = sectionTypesList.map(type => {
      const template = sectionTemplates[type];
      return {
        label: `${template.icon} ${template.name}`,
        action: 'select_section_type',
        payload: type,
      };
    });
    addMessage('bot', '🧱 Qual tipo de seção você quer adicionar?', sectionActions);
    setCurrentStep('add_section_type');
  };

  const addSection = (type: SectionType, name?: string) => {
    const template = sectionTemplates[type];
    const newSection: PresellSection = {
      id: Date.now().toString(),
      type,
      name: name || template.name,
      layout: 'vertical',
      backgroundColor: '#0f0f0f',
      elements: template.defaultElements.map((el, i) => ({
        ...el,
        id: `${Date.now()}-${i}`,
      })),
    };

    onChange({
      ...data,
      sections: [...data.sections, newSection],
    });

    return newSection;
  };

  const handleAction = (action: string, payload?: any) => {
    switch (action) {
      case 'start_wizard':
        addMessage('user', '🚀 Criar página do zero');
        addMessage('bot', 'Ótimo! Vamos começar.\n\n📝 Primeiro, qual será o **título da aba** do navegador? (Digite o título)');
        setCurrentStep('change_page_title');
        break;

      case 'show_menu':
        addMessage('user', '📋 Ver comandos');
        showMenu();
        break;

      case 'add_section':
        addMessage('user', '➕ Adicionar seção');
        showSectionTypes();
        break;

      case 'select_section_type': {
        const template = sectionTemplates[payload as SectionType];
        addMessage('user', `${template.icon} ${template.name}`);
        setTempData({ sectionType: payload });
        addMessage('bot', `Perfeito! Seção **${template.name}** selecionada.\n\nQuer dar um nome personalizado? (Digite o nome ou clique em "Usar padrão")`, [
          { label: `✅ Usar "${template.name}"`, action: 'use_default_name' },
        ]);
        setCurrentStep('add_section_name');
        break;
      }

      case 'use_default_name': {
        const type = tempData.sectionType as SectionType;
        const section = addSection(type);
        addMessage('user', `✅ Usar nome padrão`);
        addMessage('bot', `✅ Seção **"${section.name}"** adicionada com sucesso!\n\n🎨 Quer mudar a cor de fundo desta seção? (Digite a cor em hex, ex: #1a1a2e, ou clique em "Pular")`, [
          { label: '⏭️ Pular', action: 'skip_section_bg' },
        ]);
        setTempData({ ...tempData, currentSectionId: section.id });
        setCurrentStep('section_bg_color');
        break;
      }

      case 'skip_section_bg':
        addMessage('user', '⏭️ Pular');
        askAddElement();
        break;

      case 'add_element_text':
        addMessage('user', '📝 Texto');
        setTempData({ ...tempData, elementType: 'text' });
        addMessage('bot', 'Digite o texto que deseja adicionar:');
        setCurrentStep('element_text_content');
        break;

      case 'add_element_image':
        addMessage('user', '🖼️ Imagem');
        setTempData({ ...tempData, elementType: 'image' });
        addMessage('bot', '📸 Envie a imagem clicando no botão abaixo:');
        setCurrentStep('element_image_upload');
        setTimeout(() => fileInputRef.current?.click(), 300);
        break;

      case 'add_element_button':
        addMessage('user', '🔘 Botão');
        setTempData({ ...tempData, elementType: 'button' });
        addMessage('bot', 'Digite o texto do botão (ex: "Comprar Agora"):');
        setCurrentStep('element_button_text');
        break;

      case 'add_element_video':
        addMessage('user', '🎬 Vídeo');
        setTempData({ ...tempData, elementType: 'video' });
        addMessage('bot', 'Cole a URL do vídeo (YouTube embed ou link direto):');
        setCurrentStep('element_text_content');
        break;

      case 'done_adding_elements':
        addMessage('user', '✅ Finalizar seção');
        addMessage('bot', '🎉 Seção finalizada! O que mais deseja fazer?', [
          { label: '➕ Adicionar outra seção', action: 'add_section' },
          { label: '📋 Ver menu completo', action: 'show_menu' },
        ]);
        setCurrentStep('menu');
        break;

      case 'change_bg':
        addMessage('user', '🎨 Mudar fundo');
        addMessage('bot', 'Digite a cor de fundo em **hex** (ex: #0f0f0f, #1a1a2e):');
        setCurrentStep('change_page_bg');
        break;

      case 'change_title':
        addMessage('user', '📝 Alterar título da aba');
        addMessage('bot', 'Digite o novo título da aba do navegador:');
        setCurrentStep('change_page_title');
        break;

      case 'edit_section':
        addMessage('user', '✏️ Editar seção');
        if (data.sections.length === 0) {
          addMessage('bot', '⚠️ Você ainda não tem seções. Adicione uma primeiro!', [
            { label: '➕ Adicionar seção', action: 'add_section' },
          ]);
        } else {
          const sectionActions = data.sections.map((s, i) => ({
            label: `${sectionTemplates[s.type]?.icon || '📄'} ${s.name} (#${i + 1})`,
            action: 'select_edit_section',
            payload: s.id,
          }));
          addMessage('bot', 'Qual seção você quer editar?', sectionActions);
          setCurrentStep('edit_section_select');
        }
        break;

      case 'select_edit_section': {
        const section = data.sections.find(s => s.id === payload);
        if (section) {
          addMessage('user', `Editar "${section.name}"`);
          setTempData({ ...tempData, currentSectionId: section.id });
          showEditSectionMenu(section);
        }
        break;
      }

      case 'edit_existing_elements': {
        const editSection = data.sections.find(s => s.id === tempData.currentSectionId);
        if (editSection) {
          const textElements = editSection.elements.filter(el => el.type === 'text' || el.type === 'button');
          if (textElements.length === 0) {
            addMessage('bot', '⚠️ Esta seção não tem textos ou botões para editar. Deseja adicionar elementos?', [
              { label: '➕ Adicionar elemento', action: 'add_elements_to_section' },
              { label: '↩️ Voltar ao menu', action: 'back_to_menu' },
            ]);
          } else {
            const elementActions = textElements.map((el, i) => {
              const icon = el.type === 'text' ? '📝' : '🔘';
              const preview = (el.content || '').slice(0, 25) + ((el.content || '').length > 25 ? '...' : '');
              return {
                label: `${icon} ${preview}`,
                action: 'select_element_to_edit',
                payload: el.id,
              };
            });
            addMessage('bot', '📝 Qual elemento deseja editar?', elementActions);
            setCurrentStep('edit_element_select');
          }
        }
        break;
      }

      case 'select_element_to_edit': {
        const editSection2 = data.sections.find(s => s.id === tempData.currentSectionId);
        const elementToEdit = editSection2?.elements.find(el => el.id === payload);
        if (elementToEdit) {
          const preview = (elementToEdit.content || '').slice(0, 40);
          addMessage('user', `Editar: "${preview}"`);
          setTempData({ ...tempData, editElementId: payload });
          addMessage('bot', `Texto atual: **"${elementToEdit.content}"**\n\nDigite o novo texto:`);
          setCurrentStep('edit_element_new_text');
        }
        break;
      }

      case 'add_elements_to_section':
        addMessage('user', '➕ Adicionar elemento');
        askAddElement();
        break;

      case 'delete_section':
        addMessage('user', '🗑️ Remover seção');
        if (data.sections.length === 0) {
          addMessage('bot', '⚠️ Não há seções para remover.');
          showMenu();
        } else {
          const deleteActions = data.sections.map((s, i) => ({
            label: `🗑️ ${s.name} (#${i + 1})`,
            action: 'confirm_delete_section',
            payload: s.id,
          }));
          addMessage('bot', 'Qual seção deseja remover?', deleteActions);
          setCurrentStep('delete_section_select');
        }
        break;

      case 'confirm_delete_section': {
        const sectionToDelete = data.sections.find(s => s.id === payload);
        if (sectionToDelete) {
          addMessage('user', `Remover "${sectionToDelete.name}"`);
          onChange({
            ...data,
            sections: data.sections.filter(s => s.id !== payload),
          });
          addMessage('bot', `✅ Seção **"${sectionToDelete.name}"** removida!`);
          showMenu();
        }
        break;
      }

      case 'set_affiliate':
        addMessage('user', '🔗 Definir link de afiliado');
        addMessage('bot', 'Cole o link de afiliado global (será usado em todos os botões CTA):');
        setCurrentStep('add_affiliate_link');
        break;

      case 'back_to_menu':
        addMessage('user', '↩️ Voltar ao menu');
        showMenu();
        break;
    }
  };

  const showEditSectionMenu = (section: PresellSection) => {
    addMessage('bot', `✏️ Seção **"${section.name}"** selecionada. O que deseja fazer?`, [
      { label: '📝 Editar textos existentes', action: 'edit_existing_elements' },
      { label: '➕ Adicionar novo elemento', action: 'add_elements_to_section' },
      { label: '↩️ Voltar ao menu', action: 'back_to_menu' },
    ]);
    setCurrentStep('edit_section_menu');
  };

  const askAddElement = () => {
    addMessage('bot', '✨ Quer adicionar um elemento a esta seção?', [
      { label: '📝 Texto', action: 'add_element_text' },
      { label: '🖼️ Imagem', action: 'add_element_image' },
      { label: '🔘 Botão', action: 'add_element_button' },
      { label: '🎬 Vídeo', action: 'add_element_video' },
      { label: '✅ Finalizar seção', action: 'done_adding_elements' },
    ]);
    setCurrentStep('section_add_element');
  };

  const addElementToSection = (sectionId: string, element: SectionElement) => {
    onChange({
      ...data,
      sections: data.sections.map(s =>
        s.id === sectionId
          ? { ...s, elements: [...s.elements, element] }
          : s
      ),
    });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue('');
    addMessage('user', text);

    switch (currentStep) {
      case 'change_page_title':
        onChange({ ...data, pageTitle: text });
        addMessage('bot', `✅ Título da aba alterado para: **"${text}"**\n\nO que mais deseja fazer?`, [
          { label: '➕ Adicionar seção', action: 'add_section' },
          { label: '🎨 Mudar fundo', action: 'change_bg' },
          { label: '📋 Menu completo', action: 'show_menu' },
        ]);
        setCurrentStep('menu');
        break;

      case 'change_page_bg':
        if (/^#[0-9a-fA-F]{3,8}$/.test(text)) {
          onChange({
            ...data,
            colors: { ...data.colors, background: text },
          });
          addMessage('bot', `✅ Cor de fundo alterada para **${text}**!`);
          showMenu();
        } else {
          addMessage('bot', '⚠️ Formato inválido. Use hex, ex: #0f0f0f');
        }
        break;

      case 'add_section_name': {
        const type = tempData.sectionType as SectionType;
        const section = addSection(type, text);
        addMessage('bot', `✅ Seção **"${text}"** adicionada!\n\n🎨 Cor de fundo? (hex ou "Pular")`, [
          { label: '⏭️ Pular', action: 'skip_section_bg' },
        ]);
        setTempData({ ...tempData, currentSectionId: section.id });
        setCurrentStep('section_bg_color');
        break;
      }

      case 'section_bg_color':
        if (/^#[0-9a-fA-F]{3,8}$/.test(text)) {
          const sectionId = tempData.currentSectionId;
          onChange({
            ...data,
            sections: data.sections.map(s =>
              s.id === sectionId ? { ...s, backgroundColor: text } : s
            ),
          });
          addMessage('bot', `✅ Cor de fundo da seção: **${text}**`);
          askAddElement();
        } else {
          addMessage('bot', '⚠️ Formato inválido. Use hex, ex: #1a1a2e');
        }
        break;

      case 'element_text_content': {
        const elementType = tempData.elementType;
        const sectionId = tempData.currentSectionId;
        
        if (elementType === 'video') {
          const el: SectionElement = {
            id: Date.now().toString(),
            type: 'video',
            content: 'Vídeo',
            videoUrl: text,
          };
          addElementToSection(sectionId, el);
          addMessage('bot', '✅ Vídeo adicionado!');
          askAddElement();
        } else {
          setTempData({ ...tempData, textContent: text });
          addMessage('bot', `Qual o tamanho da fonte? (ex: 18px, 24px, 36px, 48px)`, [
            { label: '18px', action: 'set_text_size', payload: '18px' },
            { label: '24px', action: 'set_text_size', payload: '24px' },
            { label: '36px', action: 'set_text_size', payload: '36px' },
            { label: '48px', action: 'set_text_size', payload: '48px' },
          ]);
          setCurrentStep('element_text_size');
        }
        break;
      }

      case 'element_text_size':
        setTempData({ ...tempData, textSize: text });
        addMessage('bot', 'Cor do texto? (hex, ex: #ffffff)', [
          { label: '⬜ Branco', action: 'set_text_color', payload: '#ffffff' },
          { label: '⬛ Cinza', action: 'set_text_color', payload: '#cccccc' },
          { label: '🟢 Verde', action: 'set_text_color', payload: '#00ff88' },
        ]);
        setCurrentStep('element_text_color');
        break;

      case 'element_text_color':
        finishTextElement(text);
        break;

      case 'element_button_text':
        setTempData({ ...tempData, buttonText: text });
        addMessage('bot', 'Qual o link do botão? (URL completa ou # para link de afiliado global)');
        setCurrentStep('element_button_link');
        break;

      case 'element_button_link': {
        const sectionId = tempData.currentSectionId;
        const el: SectionElement = {
          id: Date.now().toString(),
          type: 'button',
          content: tempData.buttonText,
          link: text,
          color: '#ffffff',
        };
        addElementToSection(sectionId, el);
        addMessage('bot', `✅ Botão **"${tempData.buttonText}"** adicionado!`);
        askAddElement();
        break;
      }

      case 'edit_element_new_text': {
        const editSectionId = tempData.currentSectionId;
        const editElId = tempData.editElementId;
        onChange({
          ...data,
          sections: data.sections.map(s =>
            s.id === editSectionId
              ? {
                  ...s,
                  elements: s.elements.map(el =>
                    el.id === editElId ? { ...el, content: text } : el
                  ),
                }
              : s
          ),
        });
        addMessage('bot', `✅ Texto atualizado para: **"${text}"**`);
        const editSection3 = data.sections.find(s => s.id === editSectionId);
        if (editSection3) {
          showEditSectionMenu(editSection3);
        } else {
          showMenu();
        }
        break;
      }

      case 'add_affiliate_link':
        onChange({ ...data, globalCtaAffiliateLink: text });
        addMessage('bot', `✅ Link de afiliado definido!`);
        showMenu();
        break;

      default:
        // Free text - try to understand command
        const lower = text.toLowerCase();
        if (lower.includes('seção') || lower.includes('adicionar')) {
          handleAction('add_section');
        } else if (lower.includes('fundo') || lower.includes('cor')) {
          handleAction('change_bg');
        } else if (lower.includes('título') || lower.includes('titulo')) {
          handleAction('change_title');
        } else if (lower.includes('menu') || lower.includes('ajuda')) {
          showMenu();
        } else if (lower.includes('editar')) {
          handleAction('edit_section');
        } else if (lower.includes('remover') || lower.includes('excluir') || lower.includes('deletar')) {
          handleAction('delete_section');
        } else if (lower.includes('link') || lower.includes('afiliado')) {
          handleAction('set_affiliate');
        } else {
          addMessage('bot', '🤔 Não entendi. Tente novamente ou use o menu:', [
            { label: '📋 Ver menu', action: 'show_menu' },
          ]);
        }
        break;
    }
  };

  // Handle action buttons for text size/color
  useEffect(() => {
    // This is handled via handleAction
  }, []);

  const handleActionClick = (action: string, payload?: any) => {
    if (action === 'set_text_size') {
      addMessage('user', payload);
      setTempData(prev => ({ ...prev, textSize: payload }));
      addMessage('bot', 'Cor do texto? (hex, ex: #ffffff)', [
        { label: '⬜ Branco', action: 'set_text_color', payload: '#ffffff' },
        { label: '⬛ Cinza', action: 'set_text_color', payload: '#cccccc' },
        { label: '🟢 Verde', action: 'set_text_color', payload: '#00ff88' },
      ]);
      setCurrentStep('element_text_color');
    } else if (action === 'set_text_color') {
      addMessage('user', payload);
      finishTextElement(payload);
    } else {
      handleAction(action, payload);
    }
  };

  const finishTextElement = (color: string) => {
    const sectionId = tempData.currentSectionId;
    const el: SectionElement = {
      id: Date.now().toString(),
      type: 'text',
      content: tempData.textContent,
      fontSize: tempData.textSize || '18px',
      color: color || '#ffffff',
    };
    addElementToSection(sectionId, el);
    addMessage('bot', `✅ Texto adicionado!`);
    askAddElement();
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      addMessage('user', '📸 Imagem enviada', undefined, imageUrl);
      
      const sectionId = tempData.currentSectionId;
      const el: SectionElement = {
        id: Date.now().toString(),
        type: 'image',
        content: file.name,
        imageUrl,
        mediaWidth: 80,
      };
      addElementToSection(sectionId, el);
      addMessage('bot', '✅ Imagem adicionada à seção!');
      askAddElement();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted">
        <Bot className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground tracking-wide">assistente</span>
        <button onClick={showMenu} className="text-muted-foreground hover:text-foreground">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
            <div className={`max-w-[85%] space-y-2`}>
              <div
                className={`px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`}
              >
                {msg.content.split('\n').map((line, i) => (
                  <span key={i}>
                    {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j}>{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    })}
                    {i < msg.content.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
              {msg.imageUrl && (
                <img src={msg.imageUrl} alt="Upload" className="max-w-full rounded-lg border border-border" />
              )}
              {msg.actions && msg.actions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.actions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleActionClick(action.action, action.payload)}
                      className="px-3 py-1.5 text-xs font-medium bg-card border border-border rounded-full hover:bg-accent hover:border-primary/50 transition-colors text-foreground"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-muted/50">
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
              e.target.value = '';
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <ImagePlus className="w-4 h-4" />
          </button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 h-9 text-sm bg-card border-border"
          />
          <Button
            size="icon"
            className="h-9 w-9 flex-shrink-0"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
