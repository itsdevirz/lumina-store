import { SupportSession, SupportMessage, AgentStatusResponse } from '../types/support';

const SESSIONS_KEY = 'lumina_support_sessions_v1';
const AGENT_STATUS_KEY = 'lumina_agent_status_v1';

export function getLocalAgentStatus(): AgentStatusResponse {
  try {
    const saved = localStorage.getItem(AGENT_STATUS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return {
    isOnline: true,
    manualOnline: true,
    isWorkingHours: true,
    workStartHour: 9,
    workEndHour: 21,
    activeSessionsCount: 1,
    waitingUsersCount: 0,
    workHoursText: '۰۹:۰۰ الی ۲۱:۰۰'
  };
}

export function saveLocalAgentStatus(status: Partial<AgentStatusResponse>): AgentStatusResponse {
  const current = getLocalAgentStatus();
  const updated = { ...current, ...status };
  try {
    localStorage.setItem(AGENT_STATUS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

export function getLocalSupportSessions(): SupportSession[] {
  try {
    const saved = localStorage.getItem(SESSIONS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  // Initial seed session if empty
  const initialSessions: SupportSession[] = [
    {
      id: 'supp-demo-01',
      userName: 'کیان مهرآذر',
      userEmail: 'kian@lumina.io',
      userPhone: '۰۹۱۲۳۴۵۶۷۸۹',
      status: 'human_connected',
      createdAt: Date.now() - 3600000,
      updatedAt: Date.now() - 1200000,
      unreadByAdminCount: 0,
      unreadByUserCount: 0,
      lastMessage: 'با تشکر، هدفون به دستم رسید و کیفیت عالی دارد.',
      messages: [
        {
          id: 'm-1',
          sender: 'user',
          text: 'سلام، زمان تحویل سفارش تهران چقدر است؟',
          timestamp: Date.now() - 3600000
        },
        {
          id: 'm-2',
          sender: 'agent',
          text: 'درود بر شما کیان عزیز. سفارشات تهران کمتر از ۴ ساعت کاری با پیک اختصاصی لومینا اکسپرس تحویل می‌گردند.',
          timestamp: Date.now() - 3500000
        },
        {
          id: 'm-3',
          sender: 'user',
          text: 'با تشکر، هدفون به دستم رسید و کیفیت عالی دارد.',
          timestamp: Date.now() - 1200000
        }
      ]
    }
  ];

  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(initialSessions));
  } catch {
    // ignore
  }
  return initialSessions;
}

export function getLocalSupportSessionById(id: string): SupportSession | undefined {
  const sessions = getLocalSupportSessions();
  return sessions.find(s => s.id === id);
}

export function addLocalSupportMessage(params: {
  sessionId: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: 'image' | 'document' | 'file';
  userName?: string;
  userEmail?: string;
  userPhone?: string;
}): { session: SupportSession; message: SupportMessage; autoReply?: SupportMessage } {
  const sessions = getLocalSupportSessions();
  let session = sessions.find(s => s.id === params.sessionId);

  if (!session) {
    session = {
      id: params.sessionId,
      userName: params.userName || 'کاربر سایت لومینا',
      userEmail: params.userEmail || 'user@luminastore.ir',
      userPhone: params.userPhone || '',
      status: 'waiting_human',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      unreadByAdminCount: 1,
      unreadByUserCount: 0,
      lastMessage: params.text || (params.fileName ? `[فایل: ${params.fileName}]` : ''),
      messages: [
        {
          id: `msg-sys-${Date.now()}`,
          sender: 'system',
          text: 'درخواست ارتباط با کارشناسان پشتیبانی لومینا ثبت شد.',
          timestamp: Date.now() - 50
        }
      ]
    };
    sessions.unshift(session);
  }

  const newMessage: SupportMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sender: params.sender,
    text: params.text,
    timestamp: Date.now(),
    fileUrl: params.fileUrl,
    fileName: params.fileName,
    fileType: params.fileType
  };

  session.messages.push(newMessage);
  session.lastMessage = params.text || (params.fileName ? `[فایل: ${params.fileName}]` : '');
  session.updatedAt = Date.now();

  if (params.sender === 'user') {
    session.unreadByAdminCount += 1;
    if (session.status === 'bot' || session.status === 'closed') {
      session.status = 'waiting_human';
    }
  } else if (params.sender === 'agent') {
    session.unreadByUserCount += 1;
    session.status = 'human_connected';
  }

  let autoReply: SupportMessage | undefined = undefined;

  // If user sends message and agent simulated auto-reply
  if (params.sender === 'user') {
    // Generate helpful immediate confirmation
    autoReply = {
      id: `msg-auto-${Date.now()}`,
      sender: 'agent',
      text: 'سلام و احترام! پیام شما دریافت شد. کارشناس پشتیبانی لومینا هم‌اکنون آنلاین است و در اسرع وقت پاسخگوی شما خواهد بود.',
      timestamp: Date.now() + 100
    };
    session.messages.push(autoReply);
    session.unreadByUserCount += 1;
  }

  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // ignore
  }

  return { session, message: newMessage, autoReply };
}

export function markLocalSupportRead(sessionId: string, by: 'admin' | 'user') {
  const sessions = getLocalSupportSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (session) {
    if (by === 'admin') session.unreadByAdminCount = 0;
    else session.unreadByUserCount = 0;
    try {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    } catch {
      // ignore
    }
  }
}

export function updateLocalSupportStatus(sessionId: string, status: SupportSession['status']) {
  const sessions = getLocalSupportSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (session) {
    session.status = status;
    session.updatedAt = Date.now();
    try {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    } catch {
      // ignore
    }
  }
  return session;
}
