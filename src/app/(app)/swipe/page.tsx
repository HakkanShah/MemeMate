
"use client";

import { useState, useEffect, useRef, useTransition, useCallback } from "react";
import { getStoredData, addMatch, getUserById } from "@/lib/dummy-data";
import { SwipeCard } from "@/components/swipe-card";
import { Button } from "@/components/ui/button";
import { Heart, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User, Match } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { playSound, SOUNDS } from "@/lib/sounds";

const SWIPE_THRESHOLD = 100; // pixels

export default function SwipePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  // State for gesture handling
  const [position, setPosition] = useState({ x: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const dragStartRef = useRef<{ x: number } | null>(null);

  const currentUser = users[currentIndex];
  const nextUser = users[currentIndex + 1];

  useEffect(() => {
    const id = localStorage.getItem('loggedInUser');
    setLoggedInUserId(id);
    const allUsers = getStoredData<User[]>('dummyUsers', []);
    setUsers(allUsers.filter(u => u.id !== id)); // Exclude self
  }, []);

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragStartRef.current) {
        const deltaX = e.clientX - dragStartRef.current.x;
        setPosition({ x: deltaX });
      }
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove as any);
    }

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove as any);
    };
  }, [isDragging]);

  const finishSwipe = useCallback((direction: 'left' | 'right', swipedUserId: string) => {
    if (isPending || !loggedInUserId) return;

    setSwipeDirection(direction);

    if (direction === 'right') {
      playSound(SOUNDS.SWIPE_RIGHT);
      const newMatch: Match = {
        id: `match-${Date.now()}`,
        userIds: [loggedInUserId, swipedUserId],
        timestamp: new Date()
      };
      addMatch(newMatch);
      const swipedUser = getUserById(swipedUserId);
      toast({
        title: "IT'S A MATCH! 💘",
        description: `You can now chat with ${swipedUser?.username || 'them'}.`,
        className: "comic-border !border-4 !border-green-500 bg-primary"
      });
    } else {
      playSound(SOUNDS.SWIPE_LEFT);
    }

    // Wait for animation to finish before loading next card
    setTimeout(() => {
      startTransition(() => {
        setCurrentIndex(prev => prev + 1);
        setPosition({ x: 0 }); // Reset position for the new card
        setSwipeDirection(null);
      });
    }, 300);
  }, [isPending, loggedInUserId]);


  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPending) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartRef.current = { x: clientX };
    setIsDragging(true);
  };

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartRef.current.x;
    setPosition({ x: deltaX });
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging || !currentUser) return;
    setIsDragging(false);

    if (position.x > SWIPE_THRESHOLD) {
      finishSwipe('right', currentUser.id);
    } else if (position.x < -SWIPE_THRESHOLD) {
      finishSwipe('left', currentUser.id);
    } else {
      // Snap back to center with spring animation
      setPosition({ x: 0 });
    }
    dragStartRef.current = null;
  }, [isDragging, position.x, currentUser, finishSwipe]);

  const rotation = position.x / 20;
  const opacity = Math.max(0.3, 1 - Math.abs(position.x) / 300);

  const cardStyle = {
    transform: `translateX(${position.x}px) rotate(${rotation}deg)`,
    opacity: isDragging ? opacity : 1,
    transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  };

  // Show indicator overlay during drag
  const showLikeOverlay = position.x > 50;
  const showNopeOverlay = position.x < -50;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] pt-16 pb-28 px-2 overflow-hidden">
      <h1 className="font-headline text-4xl sm:text-5xl text-center my-6 tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
        Find Your Meme-Mate
      </h1>
      <div className="relative w-full max-w-[22rem] h-[65vh] max-h-[550px]">
        {users.length > 0 && currentIndex < users.length ? (
          <>
            {nextUser && (
              <div className="absolute top-0 left-0 w-full h-full">
                <SwipeCard user={nextUser} isNext={true} />
              </div>
            )}
            {currentUser && (
              <div
                className={cn(
                  "absolute inset-0 cursor-grab active:cursor-grabbing",
                  "transition-all duration-300 ease-in-out",
                  swipeDirection === 'left' && "-translate-x-[150%] rotate-[-25deg] opacity-0",
                  swipeDirection === 'right' && "translate-x-[150%] rotate-[25deg] opacity-0"
                )}
                style={cardStyle}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
              >
                <SwipeCard user={currentUser} />

                {/* Swipe direction overlays */}
                {showLikeOverlay && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center rounded-lg pointer-events-none">
                    <div className="text-6xl font-bold text-green-500 rotate-[-15deg] comic-border !border-8 border-green-500 px-8 py-4 bg-background">
                      LIKE
                    </div>
                  </div>
                )}
                {showNopeOverlay && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center rounded-lg pointer-events-none">
                    <div className="text-6xl font-bold text-destructive rotate-[15deg] comic-border !border-8 border-destructive px-8 py-4 bg-background">
                      NOPE
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : users.length > 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center comic-border bg-card p-6 space-y-4">
            <h2 className="font-headline text-3xl">That's Everyone! 🎉</h2>
            <p className="text-muted-foreground">You've seen all the meme-lovers for now.</p>
            <p className="text-sm">Check back later or explore your matches!</p>
            <Button onClick={() => window.location.href = '/chat'} className="comic-border !border-2">
              View Your Matches
            </Button>
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
            className="w-20 h-20 rounded-full comic-border border-4 border-destructive text-destructive hover:bg-destructive/10 !shadow-none active:scale-95 active:!shadow-inner transition-all"
            onClick={() => finishSwipe('left', currentUser.id)}
            disabled={isPending}
            aria-label="Reject"
          >
            <X className="h-10 w-10" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-20 h-20 rounded-full comic-border border-4 border-green-500 text-green-500 hover:bg-green-500/10 !shadow-none active:scale-95 active:!shadow-inner transition-all"
            onClick={() => finishSwipe('right', currentUser.id)}
            disabled={isPending}
            aria-label="Like"
          >
            <Heart className="h-10 w-10" />
          </Button>
        </div>
      )}
    </div>
  );
}
