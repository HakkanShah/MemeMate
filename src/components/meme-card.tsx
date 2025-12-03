"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, memo } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Meme, MemeComment } from "@/lib/types";
import { getUserById, updateMeme, addNotification } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";
import { MessageSquare, Send, ArrowUp, ArrowDown, CheckCircle } from "lucide-react";
import { Input } from "./ui/input";
import { playSound, SOUNDS } from "@/lib/sounds";
import { formatDistanceToNow } from "date-fns";

interface MemeCardProps {
  meme: Meme;
}

export const MemeCard = memo(function MemeCard({ meme: initialMeme }: MemeCardProps) {
  const [meme, setMeme] = useState(initialMeme);
  const author = getUserById(meme.authorId);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('loggedInUser');
    setLoggedInUserId(id);
  }, []);

  const handleReaction = (emoji: keyof Meme['reactions']) => {
    playSound(SOUNDS.REACTION);
    const isOwnPost = loggedInUserId === meme.authorId;
    const isAdmin = loggedInUserId === 'user_hakkan';

    // Admin can boost their own posts
    const increment = (isOwnPost && isAdmin) ? 10 : 1;

    const updatedMeme = {
      ...meme,
      reactions: {
        ...meme.reactions,
        [emoji]: meme.reactions[emoji] + increment
      }
    };
    setMeme(updatedMeme);
    updateMeme(updatedMeme);

    // Send notification
    if (loggedInUserId && loggedInUserId !== meme.authorId) {
      addNotification({
        recipientId: meme.authorId,
        actorId: loggedInUserId,
        type: 'reaction',
        memeId: meme.id,
        read: false
      });
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "" || !loggedInUserId) return;
    playSound(SOUNDS.MESSAGE_SENT);

    const newCommentObj: MemeComment = {
      userId: loggedInUserId,
      text: newComment,
      timestamp: new Date(),
      votes: 0
    };

    const updatedMeme = {
      ...meme,
      comments: [...meme.comments, newCommentObj]
    };

    setMeme(updatedMeme);
    updateMeme(updatedMeme);
    setNewComment("");

    // Send notification
    if (loggedInUserId !== meme.authorId) {
      addNotification({
        recipientId: meme.authorId,
        actorId: loggedInUserId,
        type: 'comment',
        memeId: meme.id,
        read: false
      });
    }
  }

  const handleVote = (commentIndex: number, voteType: 'up' | 'down') => {
    playSound(SOUNDS.REACTION, 0.2);
    const updatedComments = [...meme.comments];
    updatedComments[commentIndex].votes += (voteType === 'up' ? 1 : -1);

    const updatedMeme = {
      ...meme,
      comments: updatedComments
    };

    setMeme(updatedMeme);
    updateMeme(updatedMeme);
  };

  if (!author) return null;

  const topReactions = Object.entries(meme.reactions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const sortedComments = [...meme.comments].sort((a, b) => b.votes - a.votes);
  const commentsToShow = showAllComments ? sortedComments : sortedComments.slice(0, 2);

  return (
    <div className="break-inside-avoid w-full">
      <Card className="comic-border bg-card/80 backdrop-blur-sm h-full flex flex-col">
        <CardHeader className="flex flex-row items-center gap-2 p-2.5 sm:p-3">
          <Link href={`/profile/${author.id}`}>
            <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-primary flex-shrink-0">
              <AvatarImage src={author.profilePicUrl} alt={author.username} data-ai-hint="meme avatar" />
              <AvatarFallback>{author.username.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex items-center gap-1 min-w-0">
            <Link href={`/profile/${author.id}`} className="min-w-0">
              <CardTitle className="text-base sm:text-lg font-bold hover:underline truncate">{author.username}</CardTitle>
            </Link>
            {author.isVerified && <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-blue-500 flex-shrink-0" />}
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-grow">
          <div className="relative aspect-[4/5] w-full bg-muted">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground text-sm">Loading...</div>
              </div>
            )}
            <Image
              src={meme.imageUrl}
              alt={meme.caption}
              fill
              className={cn(
                "object-cover transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              data-ai-hint={meme.aiHint}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </div>
          <p className="p-2.5 sm:p-3 text-sm sm:text-base leading-relaxed">{meme.caption}</p>
        </CardContent>
        <CardFooter className="p-2.5 sm:p-3 flex flex-col items-start gap-2">
          <div className="flex justify-around w-full">
            {topReactions.map(([emoji, count]) => (
              <ReactionButton key={emoji} emoji={emoji} count={count} onClick={() => handleReaction(emoji as keyof Meme['reactions'])} />
            ))}
            <Button variant="ghost" className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg px-2 sm:px-3" onClick={() => document.getElementById(`comment-input-${meme.id}`)?.focus()}>
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm font-bold">{meme.comments.length}</span>
            </Button>
          </div>
          <div className="w-full space-y-1.5 sm:space-y-2">
            {commentsToShow.map((comment, index) => {
              const commentAuthor = getUserById(comment.userId);
              const originalIndex = meme.comments.findIndex(c => c === comment);
              return (
                <div key={index} className="text-xs sm:text-sm flex justify-between items-start gap-2 w-full">
                  <div className="min-w-0 flex-1">
                    <span className="font-bold">{commentAuthor?.username || 'User'}</span>: <span className="break-words">{comment.text}</span>
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                    <Button size="icon" variant="ghost" className="h-5 w-5 sm:h-6 sm:w-6" onClick={() => handleVote(originalIndex, 'up')}>
                      <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <span className="text-xs font-bold w-3 sm:w-4 text-center">{comment.votes}</span>
                    <Button size="icon" variant="ghost" className="h-5 w-5 sm:h-6 sm:w-6" onClick={() => handleVote(originalIndex, 'down')}>
                      <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
            {!showAllComments && meme.comments.length > 2 && (
              <Button variant="link" size="sm" className="text-xs sm:text-sm h-auto py-1" onClick={() => setShowAllComments(true)}>View all {meme.comments.length} comments</Button>
            )}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-1.5 sm:gap-2 w-full pt-1">
              <Input
                id={`comment-input-${meme.id}`}
                placeholder="Add a comment..."
                className="h-8 sm:h-9 comic-border !border-2 text-xs sm:text-sm"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={!loggedInUserId}
              />
              <Button type="submit" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 comic-border !border-2 rounded-full" disabled={!loggedInUserId}>
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </form>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
});

const ReactionButton = memo(function ReactionButton({ emoji, count, onClick }: { emoji: string; count: number, onClick: () => void }) {
  const [isClicked, setIsClicked] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);

  const handleClick = () => {
    onClick();
    setIsClicked(true);
    // Create particle effect
    setParticles([1, 2, 3]);
    setTimeout(() => setIsClicked(false), 600);
    setTimeout(() => setParticles([]), 800);
  }

  return (
    <Button
      variant="ghost"
      className="relative flex items-center gap-2 text-lg hover:scale-110 transition-transform"
      onClick={handleClick}
    >
      <span className={cn(
        "transition-all duration-300",
        isClicked && "scale-125 rotate-12"
      )}>
        {emoji}
      </span>
      {particles.map((p, i) => (
        <span
          key={p}
          className="absolute text-xs animate-ping opacity-0"
          style={{
            top: `-${i * 8}px`,
            left: `${i * 8 - 8}px`,
            animationDelay: `${i * 100}ms`
          }}
        >
          {emoji}
        </span>
      ))}
      <span className={cn(
        "text-sm font-bold transition-all",
        isClicked && "scale-125 text-primary"
      )}>
        {count}
      </span>
    </Button>
  )
});
