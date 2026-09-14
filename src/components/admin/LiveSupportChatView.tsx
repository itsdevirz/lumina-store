import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Headset,
  Send,
  Paperclip,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  User,
  Search,
  Filter,
  RefreshCw,
  X,
  FileText,
  Download,
  Wifi,
  WifiOff,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { SupportSession, SupportMessage, AgentStatusResponse } from '../../types/support';
import {
  getLocalAgentStatus,
  saveLocalAgentStatus,
  getLocalSupportSessions,
  getLocalSupportSessionById,
  addLocalSupportMessage,
  markLocalSupportRead
} from '../../utils/supportStorage';

export const LiveSupportChatView: React.FC = () => {
  const [agentStatus, setAgentStatus] = useState<AgentStatusResponse>({
    isOnline: true,
    activeSessionsCount: 0,
    waitingUsersCount: 0
  });
  const [sessions, setSessions] = useState<SupportSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<SupportSession | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'waiting' | 'active'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [messageText, setMessageText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ url: string; name: string; type: 'image' | 'document' | 'file' } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch agent status & sessions list
  const fetchAgentStatus = async () => {
    try {
      const res = await fetch('/api/support/agent-status').catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setAgentStatus(data);
      } else {
        setAgentStatus(getLocalAgentStatus());
      }
    } catch (err) {
      console.warn('Error fetching agent status, using local fallback:', err);
      setAgentStatus(getLocalAgentStatus());
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/support/sessions').catch(() => null);
      if (res && res.ok) {
        const data: SupportSession[] = await res.json();
        setSessions(data);

        // Auto select first session if none selected
        if (!selectedSessionId && data.length > 0) {
          setSelectedSessionId(data[0].id);
        }
      } else {
        const localSessions = getLocalSupportSessions();
        setSessions(localSessions);
        if (!selectedSessionId && localSessions.length > 0) {
          setSelectedSessionId(localSessions[0].id);
        }
      }
    } catch (err) {
      console.warn('Error fetching support sessions, using local fallback:', err);
      const localSessions = getLocalSupportSessions();
      setSessions(localSessions);
      if (!selectedSessionId && localSessions.length > 0) {
        setSelectedSessionId(localSessions[0].id);
      }
    }
  };

  const fetchSingleSession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/support/sessions/${sessionId}?readBy=admin`).catch(() => null);
      if (res && res.ok) {
        const data: SupportSession = await res.json();
        setSelectedSession(data);
      } else {
        const localSess = getLocalSupportSessionById(sessionId);
        if (localSess) {
          markLocalSupportRead(sessionId, 'admin');
          setSelectedSession({ ...localSess });
        }
      }
    } catch (err) {
      console.warn('Error fetching single session, using local fallback:', err);
      const localSess = getLocalSupportSessionById(sessionId);
      if (localSess) {
        markLocalSupportRead(sessionId, 'admin');
        setSelectedSession({ ...localSess });
      }
    }
  };

  // Initial load and live polling every 2.5 seconds
  useEffect(() => {
    fetchAgentStatus();
    fetchSessions();

    const interval = setInterval(() => {
      fetchAgentStatus();
      fetchSessions();
      if (selectedSessionId) {
        fetchSingleSession(selectedSessionId);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [selectedSessionId]);

  useEffect(() => {
    if (selectedSessionId) {
      fetchSingleSession(selectedSessionId);
    }
  }, [selectedSessionId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedSession?.messages]);

  // Toggle online/offline status
  const handleToggleAgentStatus = async () => {
    const newStatus = !agentStatus.isOnline;
    try {
      const res = await fetch('/api/support/agent-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOnline: newStatus })
      }).catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setAgentStatus(data);
      } else {
        const saved = saveLocalAgentStatus({ isOnline: newStatus });
        setAgentStatus(saved);
      }
    } catch (err) {
      console.warn('Error toggling agent status, using local fallback:', err);
      const saved = saveLocalAgentStatus({ isOnline: newStatus });
      setAgentStatus(saved);
    }
  };

  // Send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!messageText.trim() && !attachedFile) || !selectedSessionId) return;

    const currentText = messageText.trim();
    const currentAttachment = attachedFile;

    setMessageText('');
    setAttachedFile(null);

    const payload = {
      sessionId: selectedSessionId,
      sender: 'agent' as const,
      text: currentText,
      fileUrl: currentAttachment?.url,
      fileName: currentAttachment?.name,
      fileType: currentAttachment?.type
    };

    try {
      const res = await fetch(`/api/support/sessions/${selectedSessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchSingleSession(selectedSessionId);
        fetchSessions();
        return;
      }
      throw new Error('Server agent message send failed');
    } catch (err) {
      console.warn('Error sending support message to server, using local persistent fallback:', err);
      const result = addLocalSupportMessage(payload);
      setSelectedSession({ ...result.session });
      fetchSessions();
    }
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setAttachedFile({
            url: data.url,
            name: data.fileName,
            type: data.fileType
          });
        } else {
          setAttachedFile({
            url: base64,
            name: file.name,
            type: isImage ? 'image' : 'file'
          });
        }
      } catch (err) {
        console.warn('Upload error, using direct base64 fallback:', err);
        setAttachedFile({
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

  // Filter sessions
  const filteredSessions = sessions.filter(s => {
    const matchesSearch =
      s.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.userEmail && s.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.lastMessage && s.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterTab === 'waiting') return s.status === 'waiting_human';
    if (filterTab === 'active') return s.status === 'human_connected';
    return true;
  });

  const quickReplies = [
    'سلام وقت بخیر! چطور می‌تونم راهنمایی‌تون کنم؟',
    'سفارش شما در حال پردازش است و به زودی تحویل پُست داده می‌شود.',
    'لطفاً کد پیگیری یا شماره تماس ثبت‌شده خودتون رو ارسال کنید.',
    'از شکیبایی شما سپاسگزاریم، مسئله شما پیگیری شد.'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] space-y-4 p-4 lg:p-6 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 font-sans" dir="rtl">
      {/* Top Bar: Live Support Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
            <Headset className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>چت و پشتیبانی زنده کارشناسان</span>
              {agentStatus.isOnline ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  آنلاین
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-medium border border-rose-500/20">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  آفلاین
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
              <span>پاسخگویی مستقیم به مشتریان، ارسال عکس و فایل و مدیریت درخواست‌ها</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-500/20">
                <Clock className="w-3 h-3" />
                ساعت کاری: {agentStatus.workHoursText || '۰۹:۰۰ الی ۲۱:۰۰'}
              </span>
            </p>
          </div>
        </div>

        {/* Controls & Online Switch */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs bg-slate-100 dark:bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
            <span>منتظر پاسخ: <strong className="text-amber-600 dark:text-amber-400 font-bold">{agentStatus.waitingUsersCount}</strong></span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span>کل گفت‌وگوها: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{agentStatus.activeSessionsCount}</strong></span>
          </div>

          <button
            onClick={handleToggleAgentStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
              agentStatus.isOnline
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
            }`}
          >
            {agentStatus.isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span>{agentStatus.isOnline ? 'وضعیت: آنلاین (تغییر به آفلاین)' : 'وضعیت: آفلاین (تغییر به آنلاین)'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Session List (Right) & Chat Window (Left) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        
        {/* Right Sidebar: User Conversations List */}
        <div className="lg:col-span-4 flex flex-col bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl overflow-hidden min-h-0 shadow-xs">
          {/* Search & Tabs */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-700/60 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="جستجوی کاربر یا پیام..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pr-9 pl-3 py-1.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400">
              <button
                onClick={() => setFilterTab('all')}
                className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer ${
                  filterTab === 'all' ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white font-bold shadow-xs' : 'hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                همه ({sessions.length})
              </button>
              <button
                onClick={() => setFilterTab('waiting')}
                className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer ${
                  filterTab === 'waiting' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                منتظر ({sessions.filter(s => s.status === 'waiting_human').length})
              </button>
              <button
                onClick={() => setFilterTab('active')}
                className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer ${
                  filterTab === 'active' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                فعال ({sessions.filter(s => s.status === 'human_connected').length})
              </button>
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/40 custom-scrollbar">
            {filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs">هیچ گفت‌وگویی با این مشخصات یافت نشد.</p>
              </div>
            ) : (
              filteredSessions.map(session => {
                const isSelected = session.id === selectedSessionId;
                return (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors relative ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-600/15 border-r-4 border-indigo-500'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {session.userName ? session.userName.charAt(0) : 'ک'}
                      </div>
                      {session.status === 'waiting_human' && (
                        <span className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white dark:border-slate-800 absolute -top-0.5 -right-0.5 animate-pulse" />
                      )}
                      {session.status === 'human_connected' && (
                        <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 absolute -top-0.5 -right-0.5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{session.userName}</h3>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(session.updatedAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate line-clamp-1">
                        {session.lastMessage || 'بدون پیام'}
                      </p>

                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {session.userEmail || session.userPhone || 'کاربر مهمان'}
                        </span>

                        {session.unreadByAdminCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-mono font-bold text-[10px]">
                            {session.unreadByAdminCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Left Main Area: Chat Window & Input */}
        <div className="lg:col-span-8 flex flex-col bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl overflow-hidden min-h-0 shadow-xs">
          {selectedSession ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 px-5 border-b border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800/90 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-600/30 border border-indigo-200 dark:border-indigo-500/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold">
                    {selectedSession.userName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{selectedSession.userName}</span>
                      <span className="text-xs font-mono text-slate-400">({selectedSession.id})</span>
                    </h2>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {selectedSession.userEmail && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {selectedSession.userEmail}
                        </span>
                      )}
                      {selectedSession.userPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {selectedSession.userPhone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    selectedSession.status === 'waiting_human'
                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                      : selectedSession.status === 'human_connected'
                      ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {selectedSession.status === 'waiting_human' ? 'منتظر پاسخ' : selectedSession.status === 'human_connected' ? 'متصل به پشتیبانی' : 'بسته شده'}
                  </span>
                </div>
              </div>

              {/* Messages Scroll Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar bg-slate-50/70 dark:bg-slate-900/40">
                {!agentStatus.isOnline && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2 mx-auto max-w-md text-center">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>وضعیت پشتیبانی آفلاین تنظیم شده است. پیام‌های دریافتی ذخیره شده و پس از آنلاین شدن پاسخ داده می‌شوند.</span>
                  </div>
                )}

                {selectedSession.messages.map(msg => {
                  const isAgent = msg.sender === 'agent';
                  const isSystem = msg.sender === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="flex justify-center my-2">
                        <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shadow-2xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                          <span>{msg.text}</span>
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                        <span>{isAgent ? 'پشتیبانی لومینا' : selectedSession.userName}</span>
                        <span>•</span>
                        <span className="font-mono">
                          {new Date(msg.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div
                        className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 shadow-xs ${
                          isAgent
                            ? 'bg-indigo-600 text-white rounded-tr-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-xs'
                        }`}
                      >
                        {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}

                        {/* File Attachment Render */}
                        {msg.fileUrl && (
                          <div className="pt-1">
                            {msg.fileType === 'image' || msg.fileUrl.startsWith('data:image') ? (
                              <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="block group relative overflow-hidden rounded-xl border border-black/10 dark:border-white/20">
                                <img src={msg.fileUrl} alt={msg.fileName || 'پیوست'} className="max-h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                  <Download className="w-4 h-4" />
                                  <span>مشاهده در اندازه کامل</span>
                                </div>
                              </a>
                            ) : (
                              <a
                                href={msg.fileUrl}
                                download={msg.fileName || 'attachment'}
                                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-black/20 hover:bg-slate-200 dark:hover:bg-black/30 text-slate-800 dark:text-white font-mono text-xs border border-slate-200 dark:border-white/20 transition-colors"
                              >
                                <FileText className="w-4 h-4 text-indigo-500 dark:text-indigo-300" />
                                <span className="truncate flex-1">{msg.fileName || 'دانلود فایل پیوست'}</span>
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

              {/* Quick Reply Chips */}
              <div className="p-2 border-t border-slate-100 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-800/40 overflow-x-auto flex items-center gap-2 text-xs scrollbar-none">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold shrink-0">پاسخ‌های آماده:</span>
                {quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMessageText(qr)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] shrink-0 border border-slate-200 dark:border-slate-600/50 transition-colors cursor-pointer shadow-2xs"
                  >
                    {qr.slice(0, 30)}...
                  </button>
                ))}
              </div>

              {/* Attached File Preview Bar */}
              {attachedFile && (
                <div className="p-2 px-4 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-700 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    <span>فایل انتخاب‌شده: <strong className="text-slate-900 dark:text-white">{attachedFile.name}</strong></span>
                  </div>
                  <button onClick={() => setAttachedFile(null)} className="p-1 hover:text-rose-500 text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-800/90 border-t border-slate-100 dark:border-slate-700/80 flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                  title="ارسال عکس یا فایل"
                >
                  <Paperclip className={`w-5 h-5 ${isUploading ? 'animate-spin text-indigo-500' : ''}`} />
                </button>

                <input
                  type="text"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder="پاسخ خود را به کاربر بنویسید..."
                  className="flex-1 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />

                <button
                  type="submit"
                  disabled={!messageText.trim() && !attachedFile}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm shadow-indigo-600/20"
                >
                  <span>ارسال</span>
                  <Send className="w-4 h-4 rtl:rotate-180" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
              <Headset className="w-12 h-12 text-slate-300 dark:text-slate-600" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">یک چت را از لیست انتخاب کنید</h3>
              <p className="text-xs max-w-sm text-slate-500 dark:text-slate-400">برای پاسخگویی و مشاهده پیام‌های کاربران، یکی از گفت‌وگوهای لیست سمت راست را انتخاب نمایید.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
