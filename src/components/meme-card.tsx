
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Meme, MemeComment } from "@/lib/types";
import { getUserById } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";
import { MessageSquare, Send, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "./ui/input";

interface MemeCardProps {
  meme: Meme;
}

export function MemeCard({ meme }: MemeCardProps) {
  const author = getUserById(meme.authorId);
  const [reactions, setReactions] = useState(meme.reactions);
  const [comments, setComments] = useState(meme.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  const handleReaction = (emoji: keyof typeof reactions) => {
    setReactions(prev => ({ ...prev, [emoji]: prev[emoji] + 1 }));
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
    setComments(prev => [...prev, { userId: 'user1', text: newComment, timestamp: new Date(), votes: 0 }]);
    setNewComment("");
  }

  const handleVote = (commentIndex: number, voteType: 'up' | 'down') => {
    setComments(prev => 
      prev.map((comment, index) => {
        if (index === commentIndex) {
          return { ...comment, votes: comment.votes + (voteType === 'up' ? 1 : -1) };
        }
        return comment;
      })
    );
  };

  if (!author) return null;
  
  const topReactions = Object.entries(reactions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const sortedComments = [...comments].sort((a, b) => b.votes - a.votes);
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
          <Link href={`/profile/${author.id}`}>
            <CardTitle className="text-lg font-bold hover:underline">{author.username}</CardTitle>
          </Link>
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
                <ReactionButton key={emoji} emoji={emoji} count={count} onClick={() => handleReaction(emoji as keyof typeof reactions)} />
              ))}
               <Button variant="ghost" className="flex items-center gap-2 text-lg" onClick={() => setShowAllComments(!showAllComments)}>
                  <MessageSquare />
                  <span className="text-sm font-bold">{comments.length}</span>
              </Button>
           </div>
           <div className="w-full space-y-2">
             {commentsToShow.map((comment, index) => {
                const commentAuthor = getUserById(comment.userId);
                const originalIndex = comments.findIndex(c => c === comment);
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
             {!showAllComments && comments.length > 2 && (
                <Button variant="link" size="sm" onClick={() => setShowAllComments(true)}>View all {comments.length} comments</Button>
             )}
             <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 w-full">
                <Input 
                    placeholder="Add a comment..." 
                    className="h-9 comic-border !border-2"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <Button type="submit" size="icon" className="h-9 w-9 flex-shrink-0 comic-border !border-2 rounded-full">
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
