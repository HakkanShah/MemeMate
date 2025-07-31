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

interface MemeCardProps {
  meme: Meme;
}

export function MemeCard({ meme }: MemeCardProps) {
  const author = getUserById(meme.authorId);
  const [reactions, setReactions] = useState(meme.reactions);

  const handleReaction = (emoji: keyof typeof reactions) => {
    setReactions(prev => ({ ...prev, [emoji]: prev[emoji] + 1 }));
  };

  if (!author) return null;

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
        <CardFooter className="p-3 flex justify-around">
          {Object.entries(reactions).map(([emoji, count]) => (
            <ReactionButton key={emoji} emoji={emoji} count={count} onClick={() => handleReaction(emoji as keyof typeof reactions)} />
          ))}
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
