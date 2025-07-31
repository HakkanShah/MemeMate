import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/lib/types";
import { getMemesByAuthor } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

interface SwipeCardProps {
  user: User;
  isNext?: boolean;
}

export function SwipeCard({ user, isNext = false }: SwipeCardProps) {
  const userMemes = getMemesByAuthor(user.id).slice(0, 2);

  return (
    <Card 
      className={cn(
        "absolute top-0 left-0 w-full h-full comic-border bg-card overflow-hidden flex flex-col transition-transform duration-300",
        isNext && "transform scale-[0.95] translate-y-4"
      )}
    >
      <div className="relative w-full h-3/5">
        <Image src={user.profilePicUrl} alt={user.username} fill className="object-cover" data-ai-hint="meme avatar"/>
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
          <h2 className="font-headline text-4xl">{user.username}</h2>
          <p className="font-semibold">{user.quizResult}</p>
        </div>
      </div>
      <CardContent className="p-4 flex-grow overflow-y-auto">
        <p className="italic text-sm sm:text-base">"{user.bio}"</p>
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
            {user.humorTags.map(tag => (
                <Badge key={tag} variant="secondary" className="comic-border !border-2 !rounded-md text-xs sm:text-sm">{tag}</Badge>
            ))}
        </div>
      </CardContent>
       <CardFooter className="p-2 sm:p-4 bg-muted/50 flex-col items-start">
           <h3 className="font-headline text-base sm:text-lg px-2">Top Memes</h3>
           <div className="flex gap-2 mt-1">
               {userMemes.map(meme => (
                   <Image key={meme.id} src={meme.imageUrl} alt="user meme" width={70} height={90} className="rounded-md object-cover comic-border !border-2" data-ai-hint={meme.aiHint}/>
               ))}
               {userMemes.length === 0 && <p className="text-xs text-muted-foreground px-2">No memes posted yet!</p>}
           </div>
       </CardFooter>
    </Card>
  );
}
