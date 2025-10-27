export interface Avatar {
  id: string;
  name: string;
  title: string;
  pricePerMinute: number;
  description: string;
}

export interface UserProfile {
  userId: string;
  name: string;
  tokenBalance: number;
}

export type SessionType = 'VIDEO' | 'VOICE';

export type SessionState = 'idle' | 'initializing' | 'active' | 'ending' | 'ended';

export interface SessionParams {
  avatarId: string;
  sessionType: SessionType;
}
