import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShoppingBag,
  Tag,
  Truck,
  RotateCcw,
  ChevronDown,
  ExternalLink,
  Check,
  Headphones,
  HelpCircle,
  PhoneCall,
  Loader2,
  Zap,
  CreditCard,
  ShieldCheck,
  Copy,
  Headset,
  Paperclip,
  FileText,
  Download,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SupportSession, SupportMessage, AgentStatusResponse } from '../types/support';
import { generateClientSmartReply } from '../utils/localAiSupport';
import {
  getLocalAgentStatus,
  getLocalSupportSessionById,
  addLocalSupportMessage,
  markLocalSupportRead
} from '../utils/supportStorage';

interface ActionItem {
  type: string;
  payload: string;
  label: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actions?: ActionItem[];
  isStreaming?: boolean;
}

export const SupportChatWidget: React.FC = () => {
  const {
    products,
    appliedCoupon,
    applyCoupon,
    openProductDetails,
    setQuickViewProduct,
    activeTab,
    setActiveTab,
    setIsCartDrawerOpen,
    currentUser,
    userProfile,
    cart,
    lang,
    formatPrice
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [supportMode, setSupportMode] = useState<'ai' | 'human'>('ai');
  
  // AI Bot State
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Human Agent Live Support State
  const [sessionId, setSessionId] = useState<string>(() => {
    let saved = localStorage.getItem('lumina_support_session_id');
    if (!saved) {
      saved = `supp-user-${Date.now()}`;
      localStorage.setItem('lumina_support_session_id', saved);
    }
    return saved;
  });

  const [agentStatus, setAgentStatus] = useState<AgentStatusResponse>({
    isOnline: true,
    activeSessionsCount: 0,
    waitingUsersCount: 0
  });
  const [humanSession, setHumanSession] = useState<SupportSession | null>(null);
  const [humanInputText, setHumanInputText] = useState('');
  const [humanAttachedFile, setHumanAttachedFile] = useState<{ url: string; name: string; type: 'image' | 'document' | 'file' } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const initialWelcomeMessage: ChatMessage = {
    id: 'welcome-1',
    role: 'assistant',
    content: lang === 'fa'
      ? 'سلام و درود! 👋 من **دستیار هوشمند و فوق‌سریع لومینا** هستم.\n\nمی‌توانید درباره **مشخصات فنی و قیمت کالاها، کدهای تخفیف، پیگیری سفارش، شرایط ارسال رایگان و ضمانت اصالت** هر سوالی دارید بپرسید.'
      : 'Hello! 👋 I am the **Lumina High-Speed AI Support Assistant**.\n\nFeel free to ask about product specs, prices, discount coupons, order tracking, free express shipping, or 18-month warranty.',
    timestamp: new Date().toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
    actions: [
      { type: 'APPLY_COUPON', payload: 'LUMINA2025', label: lang === 'fa' ? '🏷️ کدهای تخفیف فعال' : '🏷️ Active Coupons' },
      { type: 'VIEW_PRODUCT', payload: 'lum-01', label: lang === 'fa' ? '🎧 هدفون Horizon ANC Pro' : '🎧 Horizon ANC Headphones' },
      { type: 'NAVIGATE', payload: 'shop', label: lang === 'fa' ? '🛍️ کاتالوگ فروشگاه' : '🛍️ Shop Catalog' },
      { type: 'NAVIGATE', payload: 'dashboard', label: lang === 'fa' ? '📦 پیگیری سفارشات' : '📦 Track Orders' }
    ]
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialWelcomeMessage]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const humanFileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, humanSession?.messages, isOpen, isLoading, supportMode]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen]);

  // Live polling for agent status & human chat session when open
  useEffect(() => {
    const fetchHumanChatData = async () => {
      try {
        const [agentRes, sessionRes] = await Promise.all([
          fetch('/api/support/agent-status').catch(() => null),
          fetch(`/api/support/sessions/${sessionId}?readBy=user`).catch(() => null)
        ]);

        if (agentRes && agentRes.ok) {
          const statusData = await agentRes.json();
          setAgentStatus(statusData);
        } else {
          setAgentStatus(getLocalAgentStatus());
        }

        if (sessionRes && sessionRes.ok) {
          const sessData = await sessionRes.json();
          setHumanSession(sessData);
        } else {
          const localSess = getLocalSupportSessionById(sessionId);
          if (localSess) {
            markLocalSupportRead(sessionId, 'user');
            setHumanSession({ ...localSess });
          }
        }
      } catch (err) {
        console.warn('Network support fetch error, using local fallback:', err);
        setAgentStatus(getLocalAgentStatus());
        const localSess = getLocalSupportSessionById(sessionId);
        if (localSess) {
          setHumanSession({ ...localSess });
        }
      }
    };

    if (isOpen && supportMode === 'human') {
      fetchHumanChatData();
      const interval = setInterval(fetchHumanChatData, 2500);
      return () => clearInterval(interval);
    }
  }, [isOpen, supportMode, sessionId]);

  const quickPrompts = [
    { text: lang === 'fa' ? 'چندتا محصول دارای تخفیف تو سایت هست؟' : 'How many discounted products?', icon: Tag },
    { text: lang === 'fa' ? 'پیگیری کد رهگیری LMN-77492019' : 'Track code LMN-77492019', icon: Truck },
    { text: lang === 'fa' ? 'آمار کامل تمام سایت و محصولات' : 'Complete site & product stats', icon: Sparkles },
    { text: lang === 'fa' ? 'کدهای تخفیف فعال چیه؟' : 'What are active coupons?', icon: Tag },
    { text: lang === 'fa' ? 'شرایط ارسال رایگان و تحویل اکسپرس' : 'Free shipping conditions?', icon: Truck },
    { text: lang === 'fa' ? 'مشخصات هدفون Horizon ANC Pro' : 'Horizon ANC Headphone specs', icon: Headphones },
    { text: lang === 'fa' ? 'روش‌های پرداخت و کارت به کارت' : 'Payment methods & COD', icon: CreditCard },
    { text: lang === 'fa' ? 'ضمانت اصالت و ۷ روز مرجوعی' : '18-month warranty & 7-day return', icon: ShieldCheck },
  ];

  // AI Chat Handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    const assistantMsgId = `ast-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true
    };

    setMessages(prev => [...prev, initialAssistantMsg]);

    try {
      const response = await fetch('/api/support/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          userContext: {
            name: userProfile?.name || currentUser?.name,
            email: userProfile?.email || currentUser?.email,
            cartCount: cart.reduce((acc, i) => acc + i.quantity, 0)
          }
        })
      });

      if (!response.ok) throw new Error('Stream failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let streamedContent = '';
      let finalActions: ActionItem[] = [];

      if (reader) {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') break;

              try {
                const parsed = JSON.parse(dataStr);
                const chunkPiece = parsed.chunk || parsed.text || '';
                if (chunkPiece) {
                  streamedContent += chunkPiece;
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === assistantMsgId ? { ...m, content: streamedContent } : m
                    )
                  );
                }
                if (parsed.reply && !streamedContent) {
                  streamedContent = parsed.reply;
                }
                if (parsed.actions) {
                  finalActions = parsed.actions;
                }
              } catch {
                // Ignore chunk parse errors
              }
            }
          }
        }
      }

      // If stream ended without text, trigger fallback
      if (!streamedContent.trim()) {
        throw new Error('Empty stream response');
      }

      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: streamedContent || (lang === 'fa' ? 'پاسخ دریافت شد.' : 'Response received.'),
                actions: finalActions,
                isStreaming: false
              }
            : m
        )
      );
    } catch {
      try {
        const res = await fetch('/api/support/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
            userContext: {
              name: userProfile?.name || currentUser?.name,
              email: userProfile?.email || currentUser?.email,
              cartCount: cart.reduce((acc, i) => acc + i.quantity, 0)
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.reply) {
            setMessages(prev =>
              prev.map(m =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      content: data.reply || (lang === 'fa' ? 'در خدمت شما هستم.' : 'Here to help.'),
                      actions: data.actions || [],
                      isStreaming: false
                    }
                  : m
              )
            );
            return;
          }
        }
        throw new Error('Chat API fallback required');
      } catch {
        // High-intelligence client-side smart fallback (bulletproof offline & host-independent)
        const localSmart = generateClientSmartReply(
          textToSend,
          products,
          [
            { code: 'LUMINA2025', percent: 20 },
            { code: 'VIP50', percent: 50 },
            { code: 'FREESHIP', percent: 10 }
          ]
        );

        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: localSmart.reply,
                  actions: localSmart.actions,
                  isStreaming: false
                }
              : m
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Human Live Support Handler
  const handleSendHumanMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!humanInputText.trim() && !humanAttachedFile) return;

    const currentInput = humanInputText.trim();
    const currentAttachment = humanAttachedFile;

    // Reset input right away for responsive feel
    setHumanInputText('');
    setHumanAttachedFile(null);

    const payload = {
      sessionId,
      sender: 'user' as const,
      text: currentInput,
      fileUrl: currentAttachment?.url,
      fileName: currentAttachment?.name,
      fileType: currentAttachment?.type,
      userName: userProfile?.name || currentUser?.name || 'کاربر سایت لومینا',
      userEmail: userProfile?.email || currentUser?.email || 'user@luminastore.ir',
      userPhone: userProfile?.phone || currentUser?.phone
    };

    try {
      const res = await fetch(`/api/support/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updatedRes = await fetch(`/api/support/sessions/${sessionId}?readBy=user`);
        if (updatedRes.ok) {
          const sessData = await updatedRes.json();
          setHumanSession(sessData);
          return;
        }
      }
      throw new Error('Server support message failed');
    } catch (err) {
      console.warn('Live chat server unavailable, using persistent client storage:', err);
      // Client-side fallback storage: save message and generate instant response
      const result = addLocalSupportMessage(payload);
      setHumanSession({ ...result.session });
    }
  };

  // File upload for human support
  const handleHumanFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const isImage = file.type.startsWith('image/');

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileData: base64,
            fileName: file.name,
            fileType: isImage ? 'image' : 'document'
          })
        });

        if (res.ok) {
          const data = await res.json();
          setHumanAttachedFile({
            url: data.url,
            name: data.fileName,
            type: data.fileType
          });
        } else {
          // Direct fallback to dataURL
          setHumanAttachedFile({
            url: base64,
            name: file.name,
            type: isImage ? 'image' : 'file'
          });
        }
      } catch (err) {
        console.warn('Server upload failed, using local base64 fallback:', err);
        setHumanAttachedFile({
          url: base64,
          name: file.name,
          type: isImage ? 'image' : 'file'
        });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleActionClick = async (action: ActionItem) => {
    if (action.type === 'APPLY_COUPON') {
      const ok = await applyCoupon(action.payload);
      if (ok) {
        setActionSuccessMsg(
          lang === 'fa'
            ? `کد تخفیف «${action.payload}» با موفقیت روی سبد اعمال شد! 🎉`
            : `Coupon "${action.payload}" successfully applied! 🎉`
        );
        setTimeout(() => setActionSuccessMsg(null), 3500);
      }
    } else if (action.type === 'VIEW_PRODUCT') {
      const product = products.find(p => p.id === action.payload || p.sku === action.payload);
      if (product) {
        openProductDetails(product);
        setIsOpen(false);
      } else {
        setActiveTab('shop');
      }
    } else if (action.type === 'NAVIGATE') {
      if (action.payload === 'cart') {
        setIsCartDrawerOpen(true);
      } else if (action.payload === 'shop' || action.payload === 'dashboard' || action.payload === 'checkout') {
        setActiveTab(action.payload as any);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-xs sm:text-[13px] tracking-wide">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          const parts = line.split(/(\*\*[^*]+\*\*)/g);
          const formattedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-indigo-950 dark:text-indigo-200">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pr-1 my-0.5">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                <span>{formattedLine}</span>
              </div>
            );
          }

          return <p key={idx}>{formattedLine}</p>;
        })}
      </div>
    );
  };

  const isProductDetail = activeTab === 'product-detail';

  return (
    <>
      <AnimatePresence>
        {actionSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-6 z-60 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-emerald-400"
          >
            <Check className="w-4 h-4" />
            <span>{actionSuccessMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <div className={`fixed ${activeTab === 'product-detail' ? 'bottom-[88px] sm:bottom-6' : 'bottom-20 sm:bottom-6'} left-3 sm:left-6 z-30`}>
        <motion.button
          id="lumina-support-chat-button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsOpen(prev => !prev)}
          className={`relative flex items-center gap-2.5 p-2.5 sm:px-4 sm:py-2.5 rounded-full shadow-xl transition-all cursor-pointer ${
            isOpen
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 ring-2 ring-indigo-500/30'
              : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-slate-900/20 hover:shadow-indigo-500/20'
          }`}
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <>
              <div className="relative">
                <Headset className="w-5 h-5 text-indigo-400 dark:text-indigo-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="hidden sm:inline text-xs font-semibold tracking-tight">
                {lang === 'fa' ? 'پشتیبانی آنلاین' : 'Live Support'}
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md bg-white/10 dark:bg-slate-900/10 text-[10px] font-mono">
                <Zap className="w-2.5 h-2.5 mr-0.5 text-amber-300 dark:text-amber-500" />
                {lang === 'fa' ? 'آنلاین' : 'Online'}
              </span>
            </>
          )}

          {!isOpen && hasUnread && (
            <span className="absolute -top-1 -left-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 text-[9px] text-white font-black items-center justify-center">
                1
              </span>
            </span>
          )}
        </motion.button>
      </div>

      {/* Main Support Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 sm:bottom-20 left-3 sm:left-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[410px] max-w-lg h-[580px] max-h-[78vh] sm:max-h-[84vh] bg-white dark:bg-[#151821] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-3.5 bg-slate-900 dark:bg-[#0E1117] text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
                  {supportMode === 'ai' ? <Bot className="w-4 h-4 text-indigo-300" /> : <Headset className="w-4 h-4 text-emerald-400" />}
                  <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${agentStatus.isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                    <span>{supportMode === 'ai' ? (lang === 'fa' ? 'دستیار هوشمند لومینا' : 'AI Assistant') : (lang === 'fa' ? 'ارتباط با کارشناسان لومینا' : 'Live Agent Support')}</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 font-normal">
                    <span className={`w-1.5 h-1.5 rounded-full ${agentStatus.isOnline ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span>{agentStatus.isOnline ? (lang === 'fa' ? 'کارشناسان آنلاین هستند' : 'Agents Online') : (lang === 'fa' ? 'پشتیبانی آفلاین (ثبت پیام)' : 'Agents Offline')}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {supportMode === 'ai' && (
                  <button
                    onClick={() => setMessages([initialWelcomeMessage])}
                    title={lang === 'fa' ? 'پاک‌کردن گفتگو' : 'Clear Chat'}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="p-1.5 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setSupportMode('ai')}
                className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  supportMode === 'ai'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>دستیار هوشمند AI</span>
              </button>
              <button
                onClick={() => setSupportMode('human')}
                className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                  supportMode === 'human'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Headset className="w-4 h-4" />
                <span>ارتباط با کارشناسان</span>
                {agentStatus.isOnline && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-1 left-2" />
                )}
              </button>
            </div>

            {/* MODE 1: AI ASSISTANT CHAT */}
            {supportMode === 'ai' && (
              <>
                {/* Quick Prompts Bar */}
                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                    {lang === 'fa' ? 'پیشنهادها:' : 'Quick:'}
                  </span>
                  {quickPrompts.map((q, i) => {
                    const Icon = q.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(q.text)}
                        className="text-[10.5px] px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-400 dark:hover:border-slate-500 whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Icon className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{q.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Messages Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50/40 dark:bg-slate-950/20">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl p-3.5 shadow-xs ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-bl-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-br-sm'
                        }`}
                      >
                        {msg.content ? (
                          renderFormattedText(msg.content)
                        ) : msg.isStreaming ? (
                          <div className="flex items-center gap-1.5 py-1 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        ) : null}
                      </div>

                      {msg.actions && msg.actions.length > 0 && !msg.isStreaming && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[92%]">
                          {msg.actions.map((act, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => handleActionClick(act)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${
                                act.type === 'APPLY_COUPON'
                                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                  : act.type === 'VIEW_PRODUCT'
                                  ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {act.type === 'APPLY_COUPON' && <Tag className="w-3.5 h-3.5" />}
                              {act.type === 'VIEW_PRODUCT' && <ShoppingBag className="w-3.5 h-3.5" />}
                              {act.type === 'NAVIGATE' && <ExternalLink className="w-3.5 h-3.5" />}
                              <span>{act.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                    </div>
                  ))}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Form Footer */}
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder={
                      lang === 'fa'
                        ? 'سوال خود درباره محصولات، تخفیف یا پیگیری سفارش را بپرسید...'
                        : 'Ask any question about products, coupons, shipping...'
                    }
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rtl:rotate-180" />}
                  </button>
                </form>
              </>
            )}

            {/* MODE 2: HUMAN AGENT LIVE CHAT */}
            {supportMode === 'human' && (
              <>
                {/* Working Hours & Agent Presence Banner */}
                <div className={`p-2.5 px-3 border-b text-xs flex items-center justify-between gap-2 ${
                  agentStatus.isOnline
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-900 dark:text-emerald-300'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-900 dark:text-amber-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>
                      {agentStatus.isOnline ? (
                        <>🟢 <strong>آنلاین:</strong> کارشناسان پاسخگو هستند (ساعت کاری {agentStatus.workHoursText || '۰۹:۰۰ الی ۲۱:۰۰'})</>
                      ) : agentStatus.offlineReason === 'outside_hours' ? (
                        <>🌙 <strong>خارج از ساعت کاری:</strong> (ساعت کاری {agentStatus.workHoursText || '۰۹:۰۰ الی ۲۱:۰۰'}) - پیام شما ذخیره و در ساعت کاری پاسخ داده می‌شود</>
                      ) : (
                        <>🔴 <strong>پشتیبانی آفلاین:</strong> پیام شما ثبت گردید و پس از آنلاین شدن پاسخ داده می‌شود</>
                      )}
                    </span>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-50/40 dark:bg-slate-950/20">
                  {humanSession?.messages.map(msg => {
                    const isUser = msg.sender === 'user';
                    const isSystem = msg.sender === 'system';

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="flex justify-center my-2">
                          <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10.5px] border border-slate-300 dark:border-slate-700">
                            {msg.text}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-1 text-[9.5px] text-slate-400 mb-1 px-1">
                          <span>{isUser ? 'شما' : 'کارشناس پشتیبانی لومینا'}</span>
                          <span>•</span>
                          <span className="font-mono">
                            {new Date(msg.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div
                          className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs space-y-2 ${
                            isUser
                              ? 'bg-emerald-600 text-white rounded-bl-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-br-sm'
                          }`}
                        >
                          {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}

                          {/* Render File Attachment */}
                          {msg.fileUrl && (
                            <div className="pt-1">
                              {msg.fileType === 'image' || msg.fileUrl.startsWith('data:image') ? (
                                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden border border-white/20">
                                  <img src={msg.fileUrl} alt={msg.fileName || 'پیوست'} className="max-h-48 w-full object-cover" />
                                </a>
                              ) : (
                                <a href={msg.fileUrl} download={msg.fileName || 'attachment'} className="flex items-center gap-2 p-2 rounded-xl bg-black/20 text-white font-mono text-xs">
                                  <FileText className="w-4 h-4" />
                                  <span className="truncate flex-1">{msg.fileName}</span>
                                  <Download className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* File Attachment Preview Bar */}
                {humanAttachedFile && (
                  <div className="p-2 px-3 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-700 dark:text-slate-200">
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="truncate">پیوست: <strong>{humanAttachedFile.name}</strong></span>
                    </div>
                    <button onClick={() => setHumanAttachedFile(null)} className="p-1 text-slate-400 hover:text-rose-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Input Form Footer */}
                <form onSubmit={handleSendHumanMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <input
                    type="file"
                    ref={humanFileInputRef}
                    onChange={handleHumanFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />

                  <button
                    type="button"
                    onClick={() => humanFileInputRef.current?.click()}
                    disabled={isUploading}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
                    title="ارسال عکس یا فایل"
                  >
                    <Paperclip className={`w-4 h-4 ${isUploading ? 'animate-spin text-emerald-500' : ''}`} />
                  </button>

                  <input
                    type="text"
                    value={humanInputText}
                    onChange={e => setHumanInputText(e.target.value)}
                    placeholder="پیام خود را برای کارشناسان بنویسید..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />

                  <button
                    type="submit"
                    disabled={!humanInputText.trim() && !humanAttachedFile}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
