"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { getStoredData, getUserById } from "@/lib/dummy-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { Match } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatListPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('loggedInUser');
    setCurrentUserId(id);
  }, []);

  useEffect(() => {
    const loadMatches = () => {
      if (!currentUserId) return;
      const storedMatches = getStoredData<Match[]>('dummyMatches', []).filter(m => m.userIds.includes(currentUserId));
      // Sort matches by timestamp, most recent first
      storedMatches.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setMatches(storedMatches);
      setLoading(false);
    }

    loadMatches();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dummyMatches') {
        loadMatches();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUserId]);

  return (
    <div className="p-2 sm:p-4 lg:p-8">
      <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl text-center my-8 lg:my-12 tracking-wider bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
        Your Matches
      </h1>
      <div className="max-w-2xl lg:max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 flex items-center gap-4 comic-border">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </Card>
          ))
        ) : matches.length > 0 ? (
          matches.map((match) => {
            const otherUserId = match.userIds.find(id => id !== currentUserId);
            if (!otherUserId) return null;
            const otherUser = getUserById(otherUserId);
            if (!otherUser) return null;

            return (
              <Link href={`/chat/${match.id}`} key={match.id}>
                <Card className="p-4 flex items-center gap-4 comic-border bg-card/80 backdrop-blur-sm">
                  <Avatar className="h-16 w-16 border-4 border-primary">
                    <AvatarImage src={otherUser.profilePicUrl} alt={otherUser.username} data-ai-hint="meme avatar" />
                    <AvatarFallback>{otherUser.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-headline text-2xl">{otherUser.username}</h2>
                    <p className="text-muted-foreground text-sm">Tap to start chatting...</p>
                  </div>
                </Card>
              </Link>
            );
          })
        ) : (
          <Card className="p-8 text-center comic-border">
            <h2 className="font-headline text-2xl">No Matches Yet!</h2>
            <p className="text-muted-foreground">Go to the Swipe page and find your meme-mate!</p>
          </Card>
        )}
      </div>
    </div>
  );
}
