
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Meme } from "@/lib/types";
import { getUserById } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";
import { MessageSquare, Send } from "lucide-react";
import { Input } from "./ui/input";

interface MemeCardProps {
  meme: Meme;
}

export function MemeCard({ meme }: MemeCardProps) {
  const author = getUserById(meme.authorId);
  const [reactions, setReactions] = useState(meme.reactions);
  const [comments, setComments] = useState(meme.comments || []);
  const [newComment, setNewComment] = useState("");

  const handleReaction = (emoji: keyof typeof reactions) => {
    setReactions(prev => ({ ...prev, [emoji]: prev[emoji] + 1 }));
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
    setComments(prev => [...prev, { userId: 'user1', text: newComment, timestamp: new Date() }]);
    setNewComment("");
  }


  if (!author) return null;
  
  const topReactions = Object.entries(reactions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

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
               <Button variant="ghost" className="flex items-center gap-2 text-lg">
                  <MessageSquare />
                  <span className="text-sm font-bold">{comments.length}</span>
              </Button>
           </div>
           <div className="w-full space-y-2">
             {comments.slice(0,2).map((comment, index) => {
                const commentAuthor = getUserById(comment.userId);
                return (
                    <div key={index} className="text-sm">
                        <span className="font-bold">{commentAuthor?.username || 'User'}</span>: {comment.text}
                    </div>
                )
             })}
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
