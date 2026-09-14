export interface SupportMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: number;
  fileUrl?: string;
  fileName?: string;
  fileType?: 'image' | 'document' | 'file';
}

export interface SupportSession {
  id: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  createdAt: number;
  updatedAt: number;
  status: 'bot' | 'waiting_human' | 'human_connected' | 'closed';
  unreadByAdminCount: number;
  unreadByUserCount: number;
  lastMessage?: string;
  messages: SupportMessage[];
}

export interface AgentStatusResponse {
  isOnline: boolean;
  manualOnline: boolean;
  isWorkingHours: boolean;
  workStartHour: number;
  workEndHour: number;
  workHoursText: string;
  offlineReason?: 'outside_hours' | 'manual_offline';
  activeSessionsCount: number;
  waitingUsersCount: number;
}
