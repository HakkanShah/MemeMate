"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { dummyUsers, getMemesByAuthor } from "@/lib/dummy-data";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MemeCard } from "@/components/meme-card";
import { HumorTagSuggestor } from "@/components/humor-tag-suggester";
import { ProfileSettings } from "@/components/profile-settings";


export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const user = dummyUsers.find(u => u.id === userId);

  if (!user) {
    notFound();
  }

  const userMemes = getMemesByAuthor(user.id);
  const isOwnProfile = user.id === 'user1'; // Demo: assume user1 is the logged-in user

  const topMemes = [...userMemes]
    .sort((a, b) => (b.reactions['😂'] + b.reactions['💘']) - (a.reactions['😂'] + a.reactions['💘']))
    .slice(0, 3);

  return (
    <div className="p-4 relative">
      {isOwnProfile && <ProfileSettings />}
      <Card className="comic-border bg-card/80 backdrop-blur-sm overflow-hidden mb-8">
        <div className="h-32 sm:h-48 bg-primary relative">
           <Image src="https://placehold.co/800x200" layout="fill" objectFit="cover" alt="Banner" data-ai-hint="comic background"/>
        </div>
        <CardContent className="p-4 sm:p-6 text-center -mt-16 sm:-mt-24">
          <Avatar className="mx-auto h-32 w-32 sm:h-48 sm:w-48 border-8 border-background comic-border !border-4">
            <AvatarImage src={user.profilePicUrl} alt={user.username} data-ai-hint="meme avatar" />
            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <h1 className="font-headline text-4xl sm:text-5xl mt-4">{user.username}</h1>
          <p className="text-lg text-muted-foreground mt-1">{user.status}</p>
          <p className="mt-4 text-xl italic">"{user.bio}"</p>
          <div className="mt-4">
            <Badge className="font-headline text-lg p-2 rounded-md comic-border !border-2 tracking-wider">{user.quizResult}</Badge>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {user.humorTags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            {user.memeGenres.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
          </div>
        </CardContent>
      </Card>
      
      {isOwnProfile && <HumorTagSuggestor currentBio={user.bio} />}

      {topMemes.length > 0 && (
        <div className="mb-8">
          <h2 className="font-headline text-4xl text-center my-8 tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
            Top Memes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topMemes.map(meme => <MemeCard key={meme.id} meme={meme} />)}
          </div>
        </div>
      )}

      <h2 className="font-headline text-4xl text-center my-8 tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
        {isOwnProfile ? "Your Meme Gallery" : `${user.username}'s Memes`}
      </h2>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {userMemes.map(meme => <MemeCard key={meme.id} meme={meme} />)}
      </div>
    </div>
  );
}
