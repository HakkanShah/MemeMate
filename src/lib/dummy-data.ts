
import type { User, Meme, Match, ChatMessage, MemeComment } from '@/lib/types';

// --- Local Storage Wrapper ---

const isBrowser = typeof window !== 'undefined';

export function getStoredData<T>(key: string, defaultValue: T): T {
  if (!isBrowser) return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    const oldValue = window.localStorage.getItem(key);
    const newValue = JSON.stringify(value);
    
    window.localStorage.setItem(key, newValue);

    // Dispatch a storage event so other tabs can sync
    window.dispatchEvent(new StorageEvent('storage', {
        key: key,
        oldValue: oldValue,
        newValue: newValue,
        storageArea: window.localStorage
    }));

  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
}


// --- Initial Default Data ---

const defaultUsers: User[] = [
  {
    id: 'user_hakkan',
    username: 'Hakkan',
    profilePicUrl: 'https://images.app.goo.gl/xjvMKzSNuuircDdR6',
    humorTags: ['Engineer AF', 'Roast', 'Troll', 'Dark'],
    memeGenres: ['Political', 'Engineering'],
    status: 'Meme-ing Around',
    bio: 'The developer of this platform. Bow down to your Meme King. I build, I break, I meme.',
    quizResult: 'Meme God',
    gender: 'Male',
    relationshipStatus: 'Married to my keyboard',
    lookingFor: 'A bug-free life',
    isVerified: true,
  },
  {
    id: 'user1',
    username: 'RajuMemer69',
    profilePicUrl: 'https://placehold.co/200x200.png',
    humorTags: ['Desi', 'Troll', 'Dark'],
    memeGenres: ['Political', 'Roast'],
    status: 'Single AF',
    bio: 'My life is a meme. You are welcome.',
    quizResult: 'Certified Troll',
    gender: 'Male',
    relationshipStatus: 'Single AF',
    lookingFor: 'My meme-mate'
  },
  {
    id: 'user2',
    username: 'SharmaJiKiBeti',
    profilePicUrl: 'https://placehold.co/200x200.png',
    humorTags: ['Bollywood', 'Wholesome', 'Sanskari'],
    memeGenres: ['Cringe', 'Wholesome'],
    status: 'Meme-ing Around',
    bio: 'My memes are more sanskari than your thoughts.',
    quizResult: 'Wholesome Queen',
    gender: 'Female',
    relationshipStatus: 'Meme-ing Around',
    lookingFor: 'Someone who gets my jokes'
  },
  {
    id: 'user3',
    username: 'JethalalOP',
    profilePicUrl: 'https://placehold.co/200x200.png',
    humorTags: ['Desi', 'WhatsApp Aunty'],
    memeGenres: ['Cringe', 'Sanskari'],
    status: 'Single AF',
    bio: 'Problem? Mere paas meme hai!',
    quizResult: 'Silent Shitposter',
    gender: 'Male',
    relationshipStatus: 'Single AF',
    lookingFor: 'A partner in cringe'
  },
  {
    id: 'user4',
    username: 'BhaiKaMeme',
    profilePicUrl: 'https://placehold.co/200x200.png',
    humorTags: ['Troll', 'Roast'],
    memeGenres: ['Political', 'Roast'],
    status: 'Taken But Still Posting',
    bio: 'Dil mein aata hoon, samajh mein nahi. Same with my memes.',
    quizResult: 'Roast Master',
    gender: 'Male',
    relationshipStatus: 'Taken But Still Posting',
    lookingFor: 'Friends'
  },
  {
    id: 'user5',
    username: 'SarcasmKiRani',
    profilePicUrl: 'https://placehold.co/200x200.png',
    humorTags: ['Dark', 'Roast'],
    memeGenres: ['Political'],
    status: 'Single AF',
    bio: 'I am not insulting you. I am describing you.',
    quizResult: 'Roast Master',
    gender: 'Female',
    relationshipStatus: "It's Complicated",
    lookingFor: 'A worthy opponent'
  },
  {
    id: 'user6',
    username: 'EngineerMemes',
    profilePicUrl: 'https://placehold.co/200x200.png',
    humorTags: ['Engineer AF', 'Troll'],
    memeGenres: ['Engineering', 'Roast'],
    status: 'Meme-ing Around',
    bio: 'I have a degree in mechanical engineering. Do you know what that means? It means I am an expert in memes.',
    quizResult: 'Certified Troll',
    gender: 'Male',
    relationshipStatus: 'Single AF',
    lookingFor: 'A stable connection (and Wi-Fi)'
  },
  {
    id: 'user7',
    username: 'BollywoodKaBadshah',
    profilePicUrl: 'https://placehold.co/200x200.png',
    humorTags: ['Bollywood', 'Wholesome'],
    memeGenres: ['Cringe'],
    status: 'Taken But Still Posting',
    bio: 'My life is a Karan Johar movie, but with more memes.',
    quizResult: 'Wholesome King',
    gender: 'Male',
    relationshipStatus: 'Taken But Still Posting',
    lookingFor: 'My Simran'
  },
  {
    id: 'user8',
    username: 'CringeContentCreator',
    profilePicUrl: 'https://placehold.co/200x200.png',
    humorTags: ['Cringe', 'Bollywood'],
    memeGenres: ['Cringe'],
    status: 'Meme-ing Around',
    bio: 'Making you cringe is my passion.',
    quizResult: 'Cringe King',
    gender: 'Non-binary',
    relationshipStatus: 'Meme-ing Around',
    lookingFor: 'Collaborators'
  },
  {
    id: 'user9',
    username: 'TheWholesomeMemer',
    profilePicUrl: 'https://placehold.co/200x200.png',
    humorTags: ['Wholesome', 'Sanskari'],
    memeGenres: ['Wholesome'],
    status: 'Single AF',
    bio: 'Spreading positivity, one meme at a time.',
    quizResult: 'Wholesome Queen',
    gender: 'Female',
    relationshipStatus: 'Single AF',
    lookingFor: 'A kind soul'
  },
  {
    id: 'user10',
    username: 'PoliticalKida',
    profilePicUrl: 'https://placehold.co/200x200.png',
    humorTags: ['Political', 'Roast'],
    memeGenres: ['Political'],
    status: 'Taken But Still Posting',
    bio: 'If you are not outraged, you are not paying attention. Or looking at my memes.',
    quizResult: 'Roast Master',
    gender: 'Male',
    relationshipStatus: 'Taken But Still Posting',
    lookingFor: 'A debate partner'
  },
  {
    id: 'user11',
    username: 'MemeWaliAunty',
    profilePicUrl: 'https://placehold.co/200x200.png',
    humorTags: ['WhatsApp Aunty', 'Sanskari'],
    memeGenres: ['Cringe'],
    status: 'Meme-ing Around',
    bio: 'Good morning messages and memes are my specialty.',
    quizResult: 'Wholesome Queen',
    gender: 'Female',
    relationshipStatus: 'Meme-ing Around',
    lookingFor: 'Good vibes'
  },
  {
    id: 'user12',
    username: 'ThePunMaster',
    profilePicUrl: 'https://placehold.co/200x200.png',
    humorTags: ['Troll', 'Roast'],
    memeGenres: ['Roast'],
    status: 'Single AF',
    bio: 'I don\'t make jokes. I make puns. There\'s a difference.',
    quizResult: 'Roast Master',
    gender: 'Male',
    relationshipStatus: 'Single AF',
    lookingFor: 'Pun-intended relationships'
  },
];

const defaultMemes: Meme[] = [
  {
    id: 'meme_hakkan_1',
    imageUrl: 'https://i.imgflip.com/1h7in.jpg',
    aiHint: 'roll safe',
    caption: 'You can\'t have bugs in your code if you don\'t write any code.',
    authorId: 'user_hakkan',
    reactions: { '😂': 999, '🙏': 500, '💀': 250, '😭': 10, '💘': 300 },
    comments: [],
    timestamp: new Date('2024-07-31T10:00:00Z'),
  },
  {
    id: 'meme_hakkan_2',
    imageUrl: 'https://i.imgflip.com/2/30b1gx.jpg',
    aiHint: 'change my mind',
    caption: 'Semicolons are optional. Change my mind.',
    authorId: 'user_hakkan',
    reactions: { '😂': 850, '🙏': 100, '💀': 500, '😭': 50, '💘': 100 },
    comments: [],
    timestamp: new Date('2024-07-30T10:00:00Z'),
  },
  {
    id: 'meme1',
    imageUrl: 'https://i.imgflip.com/1g8my4.jpg',
    aiHint: 'distracted boyfriend',
    caption: 'Daya, pata lagao isne swipe right kyun nahi kiya!',
    authorId: 'user1',
    reactions: { '😂': 102, '🙏': 12, '💀': 45, '😭': 5, '💘': 20 },
    comments: [
        { userId: 'user2', text: 'So true!', timestamp: new Date(), votes: 5 },
        { userId: 'user3', text: 'Hahaha!', timestamp: new Date(), votes: 2 }
    ],
    timestamp: new Date('2024-07-20T10:00:00Z'),
  },
  {
    id: 'meme2',
    imageUrl: 'https://i.imgflip.com/26am.jpg',
    aiHint: 'disaster girl',
    caption: 'When you want to post a dark meme but your parents follow you.',
    authorId: 'user2',
    reactions: { '😂': 250, '🙏': 80, '💀': 10, '😭': 55, '💘': 90 },
    comments: [],
    timestamp: new Date('2024-07-20T11:30:00Z'),
  },
  {
    id: 'meme3',
    imageUrl: 'https://i.imgflip.com/1bij.jpg',
    aiHint: 'drake hotline bling',
    caption: 'Me looking at my crush talking to someone else',
    authorId: 'user3',
    reactions: { '😂': 500, '🙏': 25, '💀': 80, '😭': 150, '💘': 30 },
    comments: [],
    timestamp: new Date('2024-07-20T12:00:00Z'),
  },
    {
    id: 'meme4',
    imageUrl: 'https://i.imgflip.com/1bh9.jpg',
    aiHint: 'mocking spongebob',
    caption: 'My mood after getting a match',
    authorId: 'user4',
    reactions: { '😂': 300, '🙏': 50, '💀': 20, '😭': 10, '💘': 180 },
    comments: [],
    timestamp: new Date('2024-07-20T14:00:00Z'),
  },
  {
    id: 'meme5',
    imageUrl: 'https://i.imgflip.com/2/1ur9b0.jpg',
    aiHint: 'woman yelling at cat',
    caption: 'My brain cells arguing whether to study or scroll memes.',
    authorId: 'user5',
    reactions: { '😂': 450, '🙏': 5, '💀': 120, '😭': 30, '💘': 50 },
    comments: [],
    timestamp: new Date('2024-07-21T09:00:00Z'),
  },
  {
    id: 'meme6',
    imageUrl: 'https://i.imgflip.com/2/30b1gx.jpg',
    aiHint: 'change my mind',
    caption: 'Final year project: Works on my machine. Viva: Machine not found.',
    authorId: 'user6',
    reactions: { '😂': 600, '🙏': 15, '💀': 50, '😭': 200, '💘': 25 },
    comments: [],
    timestamp: new Date('2024-07-21T10:30:00Z'),
  },
  {
    id: 'meme7',
    imageUrl: 'https://i.imgflip.com/4/3oevk2.jpg',
    aiHint: 'bernie sanders asking',
    caption: 'Me waiting for my crush to notice my new DP.',
    authorId: 'user7',
    reactions: { '😂': 350, '🙏': 100, '💀': 15, '😭': 25, '💘': 300 },
    comments: [],
    timestamp: new Date('2024-07-21T11:00:00Z'),
  },
  {
    id: 'meme8',
    imageUrl: 'https://i.imgflip.com/4/1g8my4.jpg',
    aiHint: 'distracted boyfriend',
    caption: 'When the OTP arrives after you have already closed the tab.',
    authorId: 'user1',
    reactions: { '😂': 700, '🙏': 40, '💀': 90, '😭': 100, '💘': 60 },
    comments: [],
    timestamp: new Date('2024-07-21T12:00:00Z'),
  },
  {
    id: 'meme9',
    imageUrl: 'https://i.imgflip.com/1h7in.jpg',
    aiHint: 'roll safe',
    caption: 'Me after my code runs on the first try.',
    authorId: 'user8',
    reactions: { '😂': 800, '🙏': 20, '💀': 10, '😭': 5, '💘': 100 },
    comments: [],
    timestamp: new Date('2024-07-22T09:00:00Z'),
  },
  {
    id: 'meme10',
    imageUrl: 'https://i.imgflip.com/1otk96.jpg',
    aiHint: 'expanding brain',
    caption: 'This is a wholesome meme. No dark humor here.',
    authorId: 'user9',
    reactions: { '😂': 100, '🙏': 500, '💀': 0, '😭': 5, '💘': 400 },
    comments: [],
    timestamp: new Date('2024-07-22T10:00:00Z'),
  },
  {
    id: 'meme11',
    imageUrl: 'https://i.imgflip.com/3/2v1ifk.jpg',
    aiHint: 'joker',
    caption: 'Me explaining to my parents why I need more pocket money.',
    authorId: 'user10',
    reactions: { '😂': 900, '🙏': 10, '💀': 50, '😭': 100, '💘': 20 },
    comments: [],
    timestamp: new Date('2024-07-22T11:00:00Z'),
  },
  {
    id: 'meme12',
    imageUrl: 'https://i.imgflip.com/4/3i7p.jpg',
    aiHint: 'sad pablo escobar',
    caption: '1 like = 1 prayer for my grades.',
    authorId: 'user6',
    reactions: { '😂': 200, '🙏': 800, '💀': 20, '😭': 500, '💘': 10 },
    comments: [],
    timestamp: new Date('2024-07-22T12:00:00Z'),
  },
];

const defaultMatches: Match[] = [
  {
    id: 'match1',
    userIds: ['user1', 'user2'],
    timestamp: new Date('2024-07-19T20:00:00Z'),
  },
  {
    id: 'match2',
    userIds: ['user1', 'user3'],
    timestamp: new Date('2024-07-18T18:00:00Z'),
  },
  {
    id: 'match3',
    userIds: ['user1', 'user5'],
    timestamp: new Date('2024-07-20T21:00:00Z'),
  },
  {
    id: 'match4',
    userIds: ['user2', 'user7'],
    timestamp: new Date('2024-07-21T21:00:00Z'),
  },
  {
    id: 'match5',
    userIds: ['user4', 'user10'],
    timestamp: new Date('2024-07-22T21:00:00Z'),
  },
];

const defaultChatMessages: ChatMessage[] = [
    { id: 'msg1', matchId: 'match1', senderId: 'user1', text: 'Aree wah, tu bhi Taarak Mehta ka fan 😍', timestamp: new Date('2024-07-19T20:01:00Z') },
    { id: 'msg2', matchId: 'match1', senderId: 'user2', text: 'Obviously! Your memes are better than Sharma ji ka beta\'s marks 😂', timestamp: new Date('2024-07-19T20:02:00Z') },
    { id: 'msg3', matchId: 'match1', senderId: 'user1', text: 'Haha thanks! So, chai pe chalein?', timestamp: new Date('2024-07-19T20:03:00Z') },

    { id: 'msg4', matchId: 'match2', senderId: 'user3', text: 'Your bio is hilarious', timestamp: new Date('2024-07-18T18:01:00Z') },
    { id: 'msg5', matchId: 'match2', senderId: 'user1', text: 'Yours too! Finally, someone with good taste in memes', timestamp: new Date('2024-07-18T18:02:00Z') },
    
    { id: 'msg6', matchId: 'match3', senderId: 'user1', text: 'Your sarcasm is on point!', timestamp: new Date('2024-07-20T21:01:00Z') },
    { id: 'msg7', matchId: 'match3', senderId: 'user5', text: 'I could say the same about your troll memes.', timestamp: new Date('2024-07-20T21:02:00Z') },

    { id: 'msg8', matchId: 'match4', senderId: 'user2', text: 'Your SRK pose is better than the original!', timestamp: new Date('2024-07-21T21:01:00Z') },
    { id: 'msg9', matchId: 'match4', senderId: 'user7', text: 'Haha, years of practice in front of the mirror.', timestamp: new Date('2024-07-21T21:02:00Z') },

    { id: 'msg10', matchId: 'match5', senderId: 'user4', text: 'Did you see the latest news? Perfect meme material.', timestamp: new Date('2024-07-22T21:01:00Z') },
    { id: 'msg11', matchId: 'match5', senderId: 'user10', text: 'Already on it. A new meme is cooking.', timestamp: new Date('2024-07-22T21:02:00Z') },
];


// --- Data Access and Mutation Functions ---

// Initialize data if it doesn't exist in local storage
if (isBrowser) {
    if (!localStorage.getItem('dummyUsers')) {
        setStoredData('dummyUsers', defaultUsers);
    }
    if (!localStorage.getItem('dummyMemes')) {
        setStoredData('dummyMemes', defaultMemes);
    }
    if (!localStorage.getItem('dummyMatches')) {
        setStoredData('dummyMatches', defaultMatches);
    }
    if (!localStorage.getItem('dummyChatMessages')) {
        setStoredData('dummyChatMessages', defaultChatMessages);
    }
}

// Export getters that read from local storage
export const dummyUsers: User[] = getStoredData('dummyUsers', defaultUsers);
export const dummyMemes: Meme[] = getStoredData('dummyMemes', defaultMemes);
export const dummyMatches: Match[] = getStoredData('dummyMatches', defaultMatches);
export const dummyChatMessages: ChatMessage[] = getStoredData('dummyChatMessages', defaultChatMessages);

export const getUserById = (id: string) => getStoredData<User[]>('dummyUsers', []).find(u => u.id === id);
export const getMemesByAuthor = (authorId: string) => getStoredData<Meme[]>('dummyMemes', []).filter(m => m.authorId === authorId);
export const getMatchById = (id: string) => getStoredData<Match[]>('dummyMatches', []).find(m => m.id === id);
export const getMessagesByMatchId = (matchId: string) => getStoredData<ChatMessage[]>('dummyChatMessages', []).filter(m => m.matchId === matchId);

// --- Functions to update data and persist to localStorage ---

export const addMeme = (meme: Meme) => {
    const memes = getStoredData<Meme[]>('dummyMemes', []);
    setStoredData('dummyMemes', [meme, ...memes]);
};

export const updateMeme = (updatedMeme: Meme) => {
    const memes = getStoredData<Meme[]>('dummyMemes', []);
    const newMemes = memes.map(meme => meme.id === updatedMeme.id ? updatedMeme : meme);
    setStoredData('dummyMemes', newMemes);
};

export const updateUser = (updatedUser: User) => {
    const users = getStoredData<User[]>('dummyUsers', []);
    const newUsers = users.map(user => user.id === updatedUser.id ? updatedUser : user);
    setStoredData('dummyUsers', newUsers);
};

export const addMessage = (message: ChatMessage) => {
    const messages = getStoredData<ChatMessage[]>('dummyChatMessages', []);
    setStoredData('dummyChatMessages', [...messages, message]);
};

export const addMatch = (match: Match) => {
    const matches = getStoredData<Match[]>('dummyMatches', []);
    setStoredData('dummyMatches', [...matches, match]);
};
