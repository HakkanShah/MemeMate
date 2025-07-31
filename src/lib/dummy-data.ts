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
];

export const dummyChatMessages: ChatMessage[] = [
    { id: 'msg1', matchId: 'match1', senderId: 'user1', text: 'Aree wah, tu bhi Taarak Mehta ka fan 😍', timestamp: new Date('2024-07-19T20:01:00Z') },
    { id: 'msg2', matchId: 'match1', senderId: 'user2', text: 'Obviously! Your memes are better than Sharma ji ka beta\'s marks 😂', timestamp: new Date('2024-07-19T20:02:00Z') },
    { id: 'msg3', matchId: 'match1', senderId: 'user1', text: 'Haha thanks! So, chai pe chalein?', timestamp: new Date('2024-07-19T20:03:00Z') },

    { id: 'msg4', matchId: 'match2', senderId: 'user3', text: 'Your bio is hilarious', timestamp: new Date('2024-07-18T18:01:00Z') },
    { id: 'msg5', matchId: 'match2', senderId: 'user4', text: 'Yours too! Finally, someone with good taste in memes', timestamp: new Date('2024-07-18T18:02:00Z') },
];

export const getUserById = (id: string) => dummyUsers.find(u => u.id === id);
export const getMemesByAuthor = (authorId: string) => dummyMemes.filter(m => m.authorId === authorId);
export const getMatchById = (id: string) => dummyMatches.find(m => m.id === id);
export const getMessagesByMatchId = (matchId: string) => dummyChatMessages.filter(m => m.matchId === matchId);
