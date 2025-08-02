
export interface User {
  id: string;
  username: string;
  email?: string; // Optional for existing users, required for new ones
  password?: string; // Optional for existing users, required for new ones
  profilePicUrl: string;
  humorTags: string[];
  memeGenres: string[];
  gender?: string;
  relationshipStatus?: 'Single AF' | 'Meme-ing Around' | 'Taken But Still Posting' | "It's Complicated";
  lookingFor?: string;
  status: 'Single AF' | 'Meme-ing Around' | 'Taken But Still Posting';
  bio: string;
  quizResult: string;
  isVerified?: boolean;
  githubUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  hasSeenTutorial?: boolean;
  following?: string[];
  followers?: string[];
}

export interface MemeComment {
    userId: string;
    text: string;
    timestamp: Date;
    votes: number;
}

export interface Meme {
  id: string;
  imageUrl: string;
  caption: string;
  authorId: string;
  reactions: {
    '😂': number;
    '🙏': number;
    '💀': number;
    '😭': number;
    '💘': number;
  };
  comments: MemeComment[];
  timestamp: Date;
  aiHint?: string;
}

export interface Match {
  id: string;
  userIds: [string, string];
  timestamp: Date;
}

export interface ChatMessage {
  id:string;
  matchId: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  recipientId: string;
  actorId: string;
  type: 'follow' | 'reaction' | 'comment';
  memeId?: string; // only for reaction/comment
  read: boolean;
  timestamp: Date;
}
