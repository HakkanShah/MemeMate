"use client";

import { useState, useEffect } from 'react';
import { MemeCard } from "@/components/meme-card";
import { dummyMemes as getInitialMemes } from "@/lib/dummy-data";
import type { Meme } from '@/lib/types';

export default function FeedPage() {
  const [memes, setMemes] = useState<Meme[]>([]);

  useEffect(() => {
    // Data is now read from localStorage via the dummy-data module
    const allMemes = getInitialMemes; 
    setMemes(allMemes);
  }, []);

  return (
    <div className="p-4">
       <h1 className="font-headline text-5xl text-center my-8 tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
          Meme Feed
        </h1>
      <div className="max-w-md mx-auto space-y-8">
        {memes.map((meme) => (
          <MemeCard key={meme.id} meme={meme} />
        ))}
      </div>
    </div>
  );
}
