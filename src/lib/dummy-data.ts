import type { User, Meme, Match, ChatMessage, MemeComment, Notification } from '@/lib/types';

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
    profilePicUrl: '/images/Hakkan MemeMate Dp.png',
    password: 'Hakkan@123',
    humorTags: ['Engineer AF', 'Roast', 'Troll', 'Dark'],
    memeGenres: ['Political', 'Engineering'],
    status: 'Meme-ing Around',
    bio: 'The developer of this platform. Bow down to your Meme King. I build, I break, I meme. Follow my coding adventures!',
    quizResult: 'Meme King',
    gender: 'Male',
    relationshipStatus: "It's Complicated",
    lookingFor: 'A bug-free life',
    isVerified: true,
    githubUrl: 'https://github.com/HakkanShah',
    facebookUrl: 'https://www.facebook.com/i.hakkan',
    linkedinUrl: 'https://www.linkedin.com/in/hakkan',
    instagramUrl: 'https://www.instagram.com/hakkanshah',
    hasSeenTutorial: true,
    following: ['user1', 'user2', 'user5'],
    followers: ['user1', 'user2', 'user3', 'user4', 'user6'],
  },
  {
    id: 'user1',
    username: 'JJ Jhatu',
    profilePicUrl: 'https://github.com/janmenj0y.png',
    humorTags: ['Desi', 'Troll', 'Dark'],
    memeGenres: ['Political', 'Roast'],
    status: 'Single AF',
    bio: 'My life is a meme. You are welcome.',
    quizResult: 'Certified Troll',
    gender: 'Male',
    relationshipStatus: 'Single AF',
    lookingFor: 'My meme-mate',
    hasSeenTutorial: true,
    following: ['user_hakkan', 'user2'],
    followers: ['user_hakkan'],
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
    lookingFor: 'Someone who gets my jokes',
    hasSeenTutorial: true,
    following: ['user_hakkan'],
    followers: ['user_hakkan', 'user1'],
  },
  {
    id: 'user3',
    username: 'Jethalal',
    profilePicUrl: 'https://placehold.co/200x200.png',
    humorTags: ['Desi', 'WhatsApp Aunty'],
    memeGenres: ['Cringe', 'Sanskari'],
    status: 'Single AF',
    bio: 'Problem? Mere paas meme hai!',
    quizResult: 'Silent Shitposter',
    gender: 'Male',
    relationshipStatus: 'Single AF',
    lookingFor: 'A partner in cringe',
    hasSeenTutorial: true,
    following: [],
    followers: ['user_hakkan'],
  },
  {
    id: 'user4',
    username: 'DhottarChor',
    profilePicUrl: 'https://placehold.co/200x200.png',
    humorTags: ['Troll', 'Roast'],
    memeGenres: ['Political', 'Roast'],
    status: 'Taken But Still Posting',
    bio: 'Dil mein aata hoon, samajh mein nahi. Same with my memes.',
    quizResult: 'Roast Master',
    gender: 'Male',
    relationshipStatus: 'Taken But Still Posting',
    lookingFor: 'Friends',
    hasSeenTutorial: true,
    following: ['user_hakkan'],
    followers: [],
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
    lookingFor: 'A worthy opponent',
    hasSeenTutorial: true,
    following: [],
    followers: ['user_hakkan'],
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
    lookingFor: 'A stable connection (and Wi-Fi)',
    hasSeenTutorial: true,
    following: ['user_hakkan'],
    followers: [],
  },
];

const defaultMemes: Meme[] = [
  {
    id: 'meme_hakkan_1',
    imageUrl: '/images/blank_coding.png',
    caption: 'You can\'t have bugs in your code if you don\'t write any code.',
    authorId: 'user_hakkan',
    reactions: { '😂': 999, '🙏': 500, '💀': 250, '😭': 10, '💘': 300 },
    comments: [
      { userId: 'user1', text: 'The ultimate truth!', timestamp: new Date(), votes: 25 },
      { userId: 'user6', text: 'I felt this in my soul.', timestamp: new Date(), votes: 18 }
    ],
    timestamp: new Date('2024-07-31T10:00:00Z'),
  },
  {
    id: 'meme_hakkan_2',
    imageUrl: 'https://pbs.twimg.com/media/D5qFyfxWwAAsPPE.jpg',
    aiHint: 'change my mind',
    caption: 'Semicolons are optional. Change my mind.',
    authorId: 'user_hakkan',
    reactions: { '😂': 850, '🙏': 100, '💀': 500, '😭': 50, '💘': 100 },
    comments: [
      { userId: 'user4', text: 'The JS community is coming for you.', timestamp: new Date(), votes: 12 },
    ],
    timestamp: new Date('2024-07-30T10:00:00Z'),
  },
  {
    id: 'meme1',
    imageUrl: 'https://i.imgflip.com/1g8my4.jpg',
    aiHint: 'distracted boyfriend',
    caption: 'Daya, pata lagao isne swipe right kyun nahi kiya!',
    authorId: 'user1',
    reactions: { '😂': 97, '🙏': 12, '💀': 45, '😭': 5, '💘': 20 },
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
];

const defaultChatMessages: ChatMessage[] = [
  { id: 'msg1', matchId: 'match1', senderId: 'user1', text: 'Aree wah, tu bhi Taarak Mehta ka fan 😍', timestamp: new Date('2024-07-19T20:01:00Z') },
  { id: 'msg2', matchId: 'match1', senderId: 'user2', text: 'Obviously! Your memes are better than Sharma ji ka beta\'s marks 😂', timestamp: new Date('2024-07-19T20:02:00Z') },
  { id: 'msg3', matchId: 'match1', senderId: 'user1', text: 'Haha thanks! So, chai pe chalein?', timestamp: new Date('2024-07-19T20:03:00Z') },

  { id: 'msg4', matchId: 'match2', senderId: 'user3', text: 'Your bio is hilarious', timestamp: new Date('2024-07-18T18:01:00Z') },
  { id: 'msg5', matchId: 'match2', senderId: 'user1', text: 'Yours too! Finally, someone with good taste in memes', timestamp: new Date('2024-07-18T18:02:00Z') },
];

const defaultNotifications: Notification[] = [
  { id: 'notif1', recipientId: 'user1', actorId: 'user_hakkan', type: 'follow', read: false, timestamp: new Date('2024-07-31T11:00:00Z') },
  { id: 'notif2', recipientId: 'user_hakkan', actorId: 'user1', type: 'reaction', memeId: 'meme_hakkan_1', read: false, timestamp: new Date('2024-07-31T10:05:00Z') },
  { id: 'notif3', recipientId: 'user_hakkan', actorId: 'user1', type: 'comment', memeId: 'meme_hakkan_1', read: true, timestamp: new Date('2024-07-31T10:06:00Z') },
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
  if (!localStorage.getItem('dummyNotifications')) {
    setStoredData('dummyNotifications', defaultNotifications);
  }
}

export const getUserById = (id: string) => getStoredData<User[]>('dummyUsers', []).find(u => u.id === id);
export const getMemesByAuthor = (authorId: string) => getStoredData<Meme[]>('dummyMemes', []).filter(m => m.authorId === authorId);
export const getMatchById = (id: string) => getStoredData<Match[]>('dummyMatches', []).find(m => m.id === id);
export const getMessagesByMatchId = (matchId: string) => getStoredData<ChatMessage[]>('dummyChatMessages', []).filter(m => m.matchId === matchId);
export const getNotificationsByUserId = (userId: string) => {
  const notifications = getStoredData<Notification[]>('dummyNotifications', []);
  return notifications
    .filter(n => n.recipientId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};


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

export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
  const notifications = getStoredData<Notification[]>('dummyNotifications', []);
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}`,
    timestamp: new Date(),
  };
  setStoredData('dummyNotifications', [newNotification, ...notifications]);
};

export const markNotificationsAsRead = (userId: string) => {
  const notifications = getStoredData<Notification[]>('dummyNotifications', []);
  const updatedNotifications = notifications.map(n =>
    n.recipientId === userId ? { ...n, read: true } : n
  );
  setStoredData('dummyNotifications', updatedNotifications);
};

export const toggleFollow = (loggedInUserId: string, targetUserId: string) => {
  const users = getStoredData<User[]>('dummyUsers', []);
  const loggedInUser = users.find(u => u.id === loggedInUserId);
  const targetUser = users.find(u => u.id === targetUserId);

  if (!loggedInUser || !targetUser) return;

  const isFollowing = loggedInUser.following?.includes(targetUserId);

  if (isFollowing) {
    // Unfollow
    loggedInUser.following = loggedInUser.following?.filter(id => id !== targetUserId);
    targetUser.followers = targetUser.followers?.filter(id => id !== loggedInUserId);
  } else {
    // Follow
    loggedInUser.following = [...(loggedInUser.following || []), targetUserId];
    targetUser.followers = [...(targetUser.followers || []), loggedInUserId];
    // Add notification for the follow action
    addNotification({
      recipientId: targetUserId,
      actorId: loggedInUserId,
      type: 'follow',
      read: false,
    });
  }

  const updatedUsers = users.map(u => {
    if (u.id === loggedInUserId) return loggedInUser;
    if (u.id === targetUserId) return targetUser;
    return u;
  });

  setStoredData('dummyUsers', updatedUsers);
};
