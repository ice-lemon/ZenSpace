export enum Sender {
  USER = 'user',
  BOT = 'model'
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
}

export interface Suggestion {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  impact: 'High' | 'Medium' | 'Low';
}

export interface RoomAnalysis {
  roomType: string;
  clutterLevel: string;
  vibe: string;
  observations: string[];
  quickWins: Suggestion[];
  longTermSolutions: Suggestion[];
}

export type ViewState = 'home' | 'analyze' | 'chat';

export type Language = 'en' | 'zh';