import type { User, Meme, Match, ChatMessage } from '@/lib/types';

export const dummyUsers: User[] = [
  {
    id: 'user1',
    username: 'RajuMemer69',
    profilePicUrl: 'https://placehold.co/200x200',
    humorTags: ['Desi', 'Troll', 'Dark'],
    memeGenres: ['Political', 'Roast'],
    status: 'Single AF',
    bio: 'My life is a meme. You are welcome.',
    quizResult: 'Certified Troll',
  },
  {
    id: 'user2',
    username: 'SharmaJiKiBeti',
    profilePicUrl: 'https://placehold.co/200x200',
    humorTags: ['Bollywood', 'Wholesome', 'Sanskari'],
    memeGenres: ['Cringe', 'Wholesome'],
    status: 'Meme-ing Around',
    bio: 'My memes are more sanskari than your thoughts.',
    quizResult: 'Wholesome Queen',
  },
  {
    id: 'user3',
    username: 'JethalalOP',
    profilePicUrl: 'https://placehold.co/200x200',
    humorTags: ['Desi', 'WhatsApp Aunty'],
    memeGenres: ['Cringe', 'Sanskari'],
    status: 'Single AF',
    bio: 'Problem? Mere paas meme hai!',
    quizResult: 'Silent Shitposter',
  },
  {
    id: 'user4',
    username: 'BhaiKaMeme',
    profilePicUrl: 'https://placehold.co/200x200',
    humorTags: ['Troll', 'Roast'],
    memeGenres: ['Political', 'Roast'],
    status: 'Taken But Still Posting',
    bio: 'Dil mein aata hoon, samajh mein nahi. Same with my memes.',
    quizResult: 'Roast Master',
  },
  {
    id: 'user5',
    username: 'SarcasmKiRani',
    profilePicUrl: 'https://placehold.co/200x200',
    humorTags: ['Dark', 'Roast'],
    memeGenres: ['Political'],
    status: 'Single AF',
    bio: 'I am not insulting you. I am describing you.',
    quizResult: 'Roast Master',
  },
  {
    id: 'user6',
    username: 'EngineerMemes',
    profilePicUrl: 'https://placehold.co/200x200',
    humorTags: ['Engineer AF', 'Troll'],
    memeGenres: ['Engineering', 'Roast'],
    status: 'Meme-ing Around',
    bio: 'I have a degree in mechanical engineering. Do you know what that means? It means I am an expert in memes.',
    quizResult: 'Certified Troll',
  },
  {
    id: 'user7',
    username: 'BollywoodKaBadshah',
    profilePicUrl: 'https://placehold.co/200x200',
    humorTags: ['Bollywood', 'Wholesome'],
    memeGenres: ['Cringe'],
    status: 'Taken But Still Posting',
    bio: 'My life is a Karan Johar movie, but with more memes.',
    quizResult: 'Wholesome King',
  }
];

export const dummyMemes: Meme[] = [
  {
    id: 'meme1',
    imageUrl: 'https://placehold.co/600x750',
    aiHint: 'CID investigation',
    caption: 'Daya, pata lagao isne swipe right kyun nahi kiya!',
    authorId: 'user1',
    reactions: { '😂': 102, '🙏': 12, '💀': 45, '😭': 5, '💘': 20 },
    timestamp: new Date('2024-07-20T10:00:00Z'),
  },
  {
    id: 'meme2',
    imageUrl: 'https://placehold.co/600x600',
    aiHint: 'family drama',
    caption: 'When you want to post a dark meme but your parents follow you.',
    authorId: 'user2',
    reactions: { '😂': 250, '🙏': 80, '💀': 10, '😭': 55, '💘': 90 },
    timestamp: new Date('2024-07-20T11:30:00Z'),
  },
  {
    id: 'meme3',
    imageUrl: 'https://placehold.co/600x800',
    aiHint: 'jethalal babita',
    caption: 'Me looking at my crush talking to someone else',
    authorId: 'user3',
    reactions: { '😂': 500, '🙏': 25, '💀': 80, '😭': 150, '💘': 30 },
    timestamp: new Date('2024-07-20T12:00:00Z'),
  },
    {
    id: 'meme4',
    imageUrl: 'https://placehold.co/500x700',
    aiHint: 'govinda dancing',
    caption: 'My mood after getting a match',
    authorId: 'user4',
    reactions: { '😂': 300, '🙏': 50, '💀': 20, '😭': 10, '💘': 180 },
    timestamp: new Date('2024-07-20T14:00:00Z'),
  },
  {
    id: 'meme5',
    imageUrl: 'https://placehold.co/600x700',
    aiHint: 'man yelling at cat',
    caption: 'My brain cells arguing whether to study or scroll memes.',
    authorId: 'user5',
    reactions: { '😂': 450, '🙏': 5, '💀': 120, '😭': 30, '💘': 50 },
    timestamp: new Date('2024-07-21T09:00:00Z'),
  },
  {
    id: 'meme6',
    imageUrl: 'https://placehold.co/600x600',
    aiHint: 'engineer problems',
    caption: 'Final year project: Works on my machine. Viva: Machine not found.',
    authorId: 'user6',
    reactions: { '😂': 600, '🙏': 15, '💀': 50, '😭': 200, '💘': 25 },
    timestamp: new Date('2024-07-21T10:30:00Z'),
  },
  {
    id: 'meme7',
    imageUrl: 'https://placehold.co/700x500',
    aiHint: 'shah rukh khan pose',
    caption: 'Me waiting for my crush to notice my new DP.',
    authorId: 'user7',
    reactions: { '😂': 350, '🙏': 100, '💀': 15, '😭': 25, '💘': 300 },
    timestamp: new Date('2024-07-21T11:00:00Z'),
  },
  {
    id: 'meme8',
    imageUrl: 'https://placehold.co/600x750',
    aiHint: 'herapheri baburao',
    caption: 'When the OTP arrives after you have already closed the tab.',
    authorId: 'user1',
    reactions: { '😂': 700, '🙏': 40, '💀': 90, '😭': 100, '💘': 60 },
    timestamp: new Date('2024-07-21T12:00:00Z'),
  },
];

export const dummyMatches: Match[] = [
  {
    id: 'match1',
    userIds: ['user1', 'user2'],
    timestamp: new Date('2024-07-19T20:00:00Z'),
  },
  {
    id: 'match2',
    userIds: ['user3', 'user4'],
    timestamp: new Date('2024-07-18T18:00:00Z'),
  },
  {
    id: 'match3',
    userIds: ['user1', 'user5'],
    timestamp: new Date('2024-07-20T21:00:00Z'),
  },
];

export const dummyChatMessages: ChatMessage[] = [
    { id: 'msg1', matchId: 'match1', senderId: 'user1', text: 'Aree wah, tu bhi Taarak Mehta ka fan 😍', timestamp: new Date('2024-07-19T20:01:00Z') },
    { id: 'msg2', matchId: 'match1', senderId: 'user2', text: 'Obviously! Your memes are better than Sharma ji ka beta\'s marks 😂', timestamp: new Date('2024-07-19T20:02:00Z') },
    { id: 'msg3', matchId: 'match1', senderId: 'user1', text: 'Haha thanks! So, chai pe chalein?', timestamp: new Date('2024-07-19T20:03:00Z') },

    { id: 'msg4', matchId: 'match2', senderId: 'user3', text: 'Your bio is hilarious', timestamp: new Date('2024-07-18T18:01:00Z') },
    { id: 'msg5', matchId: 'match2', senderId: 'user4', text: 'Yours too! Finally, someone with good taste in memes', timestamp: new Date('2024-07-18T18:02:00Z') },
    
    { id: 'msg6', matchId: 'match3', senderId: 'user1', text: 'Your sarcasm is on point!', timestamp: new Date('2024-07-20T21:01:00Z') },
    { id: 'msg7', matchId: 'match3', senderId: 'user5', text: 'I could say the same about your troll memes.', timestamp: new Date('2024-07-20T21:02:00Z') },
];

export const getUserById = (id: string) => dummyUsers.find(u => u.id === id);
export const getMemesByAuthor = (authorId: string) => dummyMemes.filter(m => m.authorId === authorId);
export const getMatchById = (id: string) => dummyMatches.find(m => m.id === id);
export const getMessagesByMatchId = (matchId: string) => dummyChatMessages.filter(m => m.matchId === matchId);