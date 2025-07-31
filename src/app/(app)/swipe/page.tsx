
"use client";

import { useState, useTransition, useEffect } from "react";
import { dummyUsers as getInitialUsers } from "@/lib/dummy-data";
import { SwipeCard } from "@/components/swipe-card";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

export default function SwipePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const allUsers = getInitialUsers;
    setUsers(allUsers.filter(u => u.id !== 'user1')); // Exclude self
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isPending) return;

    // Show "It's a Match!" on 2nd swipe for demo
    if (currentIndex === 1 && direction === 'right') {
      alert("IT'S A MATCH! 💘");
    }

    setSwipeDirection(direction);

    setTimeout(() => {
      startTransition(() => {
        setCurrentIndex(prev => prev + 1);
        setSwipeDirection(null);
      });
    }, 300); // Duration should match the CSS transition
  };

  const currentUser = users[currentIndex];
  const nextUser = users[currentIndex + 1];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">
      <h1 className="font-headline text-5xl text-center my-8 tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
        Find Your Meme-Mate
      </h1>
      <div className="relative w-full max-w-sm h-[60vh] max-h-[500px]">
        {currentUser ? (
          <>
            {nextUser && (
              <div className="absolute top-0 left-0 w-full h-full transform scale-[0.95] translate-y-4 rounded-xl bg-muted/50 comic-border"></div>
            )}
            <div
              className={cn(
                "absolute inset-0 transition-transform duration-300 ease-in-out",
                swipeDirection === 'left' && "-translate-x-full rotate-[-15deg] opacity-0",
                swipeDirection === 'right' && "translate-x-full rotate-[15deg] opacity-0"
              )}
            >
              <SwipeCard user={currentUser} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center comic-border bg-card p-4">
            <h2 className="font-headline text-3xl">That's Everyone!</h2>
            <p>You've seen all the meme-lovers for now. Check back later!</p>
          </div>
        )}
      </div>
      {currentUser && (
        <div className="flex items-center gap-8 mt-8">
          <Button
            variant="outline"
            size="icon"
            className="w-20 h-20 rounded-full comic-border border-4 border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => handleSwipe('left')}
            disabled={isPending}
          >
            <X className="h-10 w-10" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-20 h-20 rounded-full comic-border border-4 border-green-500 text-green-500 hover:bg-green-500/10"
            onClick={() => handleSwipe('right')}
            disabled={isPending}
          >
            <Heart className="h-10 w-10" />
          </Button>
        </div>
      )}
    </div>
  );
}
