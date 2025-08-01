
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import { getUserById, getMemesByAuthor } from "@/lib/dummy-data";
import type { User, Meme } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MemeCard } from "@/components/meme-card";
import { HumorTagSuggestor } from "@/components/humor-tag-suggester";
import { ProfileSettings } from "@/components/profile-settings";
import { Users, Heart, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [userMemes, setUserMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);


  const loadData = useCallback(() => {
     if (userId) {
      const foundUser = getUserById(userId);
      if(!foundUser) {
        setLoading(false); // Stop loading even if user not found
        return; // Early exit
      };
      
      setUser(foundUser);
      const memes = getMemesByAuthor(foundUser.id);
      setUserMemes(memes);
    }
    setLoading(false);
  }, [userId]);
  
  useEffect(() => {
    const id = localStorage.getItem('loggedInUser');
    setLoggedInUserId(id);
    loadData();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dummyUsers' || e.key === 'dummyMemes') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadData]);


  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    notFound();
  }
  
  const isOwnProfile = user.id === loggedInUserId;

  const topMemes = [...userMemes]
    .sort((a, b) => (b.reactions['😂'] + b.reactions['💘']) - (a.reactions['😂'] + a.reactions['💘']))
    .slice(0, 3);

  return (
    <div className="p-2 sm:p-4 relative">
      {isOwnProfile && <ProfileSettings user={user} />}
      <Card className="comic-border bg-card/80 backdrop-blur-sm overflow-hidden mb-8">
        <div className="bg-primary p-4 pt-16 sm:pt-20">
             <div className="flex flex-wrap justify-center gap-2">
                {user.humorTags.slice(0, 3).map(tag => <Badge key={tag} variant="secondary" className="text-lg comic-border !border-2">{tag}</Badge>)}
            </div>
        </div>
        <CardContent className="p-4 sm:p-6 text-center relative">
          <Avatar className="mx-auto h-32 w-32 sm:h-40 sm:w-40 border-8 border-background comic-border !border-4 absolute -top-20 sm:-top-24 left-1/2 -translate-x-1/2">
            <AvatarImage src={user.profilePicUrl} alt={user.username} data-ai-hint="meme avatar" />
            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
          </Avatar>
           <div className="flex items-center justify-center gap-2 mt-16 sm:mt-20">
            <h1 className="font-headline text-4xl sm:text-5xl">{user.username}</h1>
            {user.isVerified && <CheckCircle className="w-8 h-8 text-white fill-blue-500" />}
          </div>
          <p className="text-lg text-muted-foreground mt-1">{user.gender}</p>
          <p className="mt-4 text-base sm:text-xl italic">"{user.bio}"</p>
          <div className="mt-4">
            <Badge className="font-headline text-lg p-2 rounded-md comic-border !border-2 tracking-wider">{user.quizResult}</Badge>
          </div>
           <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground">
            {user.relationshipStatus && 
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-primary" /> {user.relationshipStatus}
              </span>
            }
            {user.lookingFor &&
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-primary" /> Looking for: {user.lookingFor}
              </span>
            }
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
          <h2 className="font-headline text-3xl sm:text-4xl text-center my-8 tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
            Top Memes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topMemes.map(meme => <MemeCard key={meme.id} meme={meme} />)}
          </div>
        </div>
      )}

      <h2 className="font-headline text-3xl sm:text-4xl text-center my-8 tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
        {isOwnProfile ? "Your Meme Gallery" : `${user.username}'s Memes`}
      </h2>
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {userMemes.map(meme => <MemeCard key={meme.id} meme={meme} />)}
      </div>
    </div>
  );
}


function ProfileSkeleton() {
  return (
    <div className="p-2 sm:p-4">
      <Card className="comic-border bg-card/80 backdrop-blur-sm overflow-hidden mb-8">
        <Skeleton className="h-24 w-full bg-primary/50" />
        <CardContent className="p-4 sm:p-6 text-center">
          <Skeleton className="mx-auto h-32 w-32 sm:h-40 sm:w-40 rounded-full border-8 border-background comic-border !border-4 -mt-20" />
          <Skeleton className="h-12 w-48 mx-auto mt-4" />
          <Skeleton className="h-6 w-24 mx-auto mt-2" />
          <Skeleton className="h-10 w-full mt-4" />
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </CardContent>
      </Card>
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
  );
}
