
"use client";

import { useState, useTransition, useEffect } from "react";
import { getStoredData, addMatch } from "@/lib/dummy-data";
import { SwipeCard } from "@/components/swipe-card";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User, Match } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function SwipePage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const allUsers = getStoredData<User[]>('dummyUsers', []);
    setUsers(allUsers.filter(u => u.id !== 'user1')); // Exclude self
  }, []);

  const handleSwipe = (direction: 'left' | 'right', swipedUserId: string) => {
    if (isPending) return;

    // Simulate a match on every right swipe for demo purposes
    if (direction === 'right') {
        const newMatch: Match = {
            id: `match-${Date.now()}`,
            userIds: ['user1', swipedUserId],
            timestamp: new Date()
        };
        addMatch(newMatch);
      
        toast({
            title: "IT'S A MATCH! 💘",
            description: "You can now chat with them.",
            className: "comic-border !border-4 !border-green-500 bg-primary"
        });
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] pt-16 pb-28 px-2 overflow-hidden">
      <h1 className="font-headline text-4xl sm:text-5xl text-center my-6 tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
        Find Your Meme-Mate
      </h1>
      <div className="relative w-full max-w-[22rem] h-[65vh] max-h-[550px]">
        {currentUser ? (
          <>
            {nextUser && (
                <div className="absolute top-0 left-0 w-full h-full transition-transform duration-300">
                    <SwipeCard user={nextUser} isNext={true} />
                </div>
            )}
            <div
              className={cn(
                "absolute inset-0 transition-transform duration-300 ease-in-out",
                swipeDirection === 'left' && "-translate-x-[150%] rotate-[-25deg] opacity-0",
                swipeDirection === 'right' && "translate-x-[150%] rotate-[25deg] opacity-0"
              )}
            >
              <SwipeCard user={currentUser} />
            </div>
          </>
        ) : users.length > 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center comic-border bg-card p-4">
            <h2 className="font-headline text-3xl">That's Everyone!</h2>
            <p>You've seen all the meme-lovers for now. Check back later!</p>
          </div>
        ) : (
            <Skeleton className="w-full h-full comic-border" />
        )}
      </div>
      {currentUser && (
        <div className="flex items-center gap-8 mt-8">
          <Button
            variant="outline"
            size="icon"
            className="w-20 h-20 rounded-full comic-border border-4 border-destructive text-destructive hover:bg-destructive/10 !shadow-none active:scale-95 active:!shadow-inner"
            onClick={() => handleSwipe('left', currentUser.id)}
            disabled={isPending}
          >
            <X className="h-10 w-10" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-20 h-20 rounded-full comic-border border-4 border-green-500 text-green-500 hover:bg-green-500/10 !shadow-none active:scale-95 active:!shadow-inner"
            onClick={() => handleSwipe('right', currentUser.id)}
            disabled={isPending}
          >
            <Heart className="h-10 w-10" />
          </Button>
        </div>
      )}
    </div>
  );
}
