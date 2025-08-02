
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Meme, MemeComment } from "@/lib/types";
import { getUserById, updateMeme, addNotification } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";
import { MessageSquare, Send, ArrowUp, ArrowDown, CheckCircle } from "lucide-react";
import { Input } from "./ui/input";
import { playSound, SOUNDS } from "@/lib/sounds";

interface MemeCardProps {
  meme: Meme;
}

export function MemeCard({ meme: initialMeme }: MemeCardProps) {
  const [meme, setMeme] = useState(initialMeme);
  const author = getUserById(meme.authorId);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  
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
    <div className="break-inside-avoid">
      <Card className="comic-border bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center gap-2 p-3">
          <Link href={`/profile/${author.id}`}>
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarImage src={author.profilePicUrl} alt={author.username} data-ai-hint="meme avatar" />
              <AvatarFallback>{author.username.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex items-center gap-1">
            <Link href={`/profile/${author.id}`}>
              <CardTitle className="text-lg font-bold hover:underline">{author.username}</CardTitle>
            </Link>
            {author.isVerified && <CheckCircle className="w-4 h-4 text-white fill-blue-500" />}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={meme.imageUrl}
              alt={meme.caption}
              fill
              className="object-cover"
              data-ai-hint={meme.aiHint}
            />
          </div>
          <p className="p-3 text-base">{meme.caption}</p>
        </CardContent>
        <CardFooter className="p-3 flex flex-col items-start gap-2">
           <div className="flex justify-around w-full">
              {topReactions.map(([emoji, count]) => (
                <ReactionButton key={emoji} emoji={emoji} count={count} onClick={() => handleReaction(emoji as keyof Meme['reactions'])} />
              ))}
               <Button variant="ghost" className="flex items-center gap-2 text-lg" onClick={() => document.getElementById(`comment-input-${meme.id}`)?.focus()}>
                  <MessageSquare />
                  <span className="text-sm font-bold">{meme.comments.length}</span>
              </Button>
           </div>
           <div className="w-full space-y-2">
             {commentsToShow.map((comment, index) => {
                const commentAuthor = getUserById(comment.userId);
                const originalIndex = meme.comments.findIndex(c => c === comment);
                return (
                    <div key={index} className="text-sm flex justify-between items-center w-full">
                       <div>
                         <span className="font-bold">{commentAuthor?.username || 'User'}</span>: {comment.text}
                       </div>
                       <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleVote(originalIndex, 'up')}>
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <span className="text-xs font-bold w-4 text-center">{comment.votes}</span>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleVote(originalIndex, 'down')}>
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                       </div>
                    </div>
                )
             })}
             {!showAllComments && meme.comments.length > 2 && (
                <Button variant="link" size="sm" onClick={() => setShowAllComments(true)}>View all {meme.comments.length} comments</Button>
             )}
             <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 w-full">
                <Input 
                    id={`comment-input-${meme.id}`}
                    placeholder="Add a comment..." 
                    className="h-9 comic-border !border-2"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={!loggedInUserId}
                />
                <Button type="submit" size="icon" className="h-9 w-9 flex-shrink-0 comic-border !border-2 rounded-full" disabled={!loggedInUserId}>
                    <Send className="h-4 w-4"/>
                </Button>
             </form>
           </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function ReactionButton({ emoji, count, onClick }: { emoji: string; count: number, onClick: () => void }) {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        onClick();
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 500);
    }
    return (
        <Button variant="ghost" className="flex items-center gap-2 text-lg" onClick={handleClick}>
            <span className={cn("transition-transform duration-500", isClicked && "animate-bounce")}>{emoji}</span>
            <span className="text-sm font-bold">{count}</span>
        </Button>
    )
}
