"use client";

import { useState, useEffect, useCallback } from 'react';
import { MemeCard } from "@/components/meme-card";
import { getStoredData } from "@/lib/dummy-data";
import type { Meme } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const sortMemes = (memes: Meme[]) => {
    // Sort memes to show verified user's posts first, then by timestamp
    return memes.sort((a, b) => {
        if (a.authorId === 'user_hakkan' && b.authorId !== 'user_hakkan') {
            return -1; // a comes first
        }
        if (a.authorId !== 'user_hakkan' && b.authorId === 'user_hakkan') {
            return 1; // b comes first
        }
        // If both are/aren't Hakkan, sort by time
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
};

export default function FeedPage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMemes = useCallback(() => {
    const allMemes = getStoredData<Meme[]>('dummyMemes', []);
    setMemes(sortMemes(allMemes));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMemes();

    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'dummyMemes') {
            loadMemes();
        }
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadMemes]);

  return (
    <div className="p-2 sm:p-4">
       <h1 className="font-headline text-5xl text-center my-6 sm:my-8 tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
          Meme Feed
        </h1>
      <div className="max-w-md mx-auto space-y-8">
        {loading ? (
           [...Array(5)].map((_, i) => <Skeleton key={i} className="h-96 w-full comic-border" />)
        ) : memes.length > 0 ? (
          memes.map((meme) => (
            <MemeCard key={meme.id} meme={meme} />
          ))
        ) : (
          <p className="text-center text-muted-foreground">No memes yet! Be the first to post.</p>
        )}
      </div>
    </div>
  );
}
