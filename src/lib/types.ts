export interface User {
  id: string;
  username: string;
  profilePicUrl: string;
  bannerUrl: string;
  humorTags: string[];
  memeGenres: string[];
  status: 'Single AF' | 'Meme-ing Around' | 'Taken But Still Posting';
  bio: string;
  quizResult: string;
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
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  timestamp: Date;
}
