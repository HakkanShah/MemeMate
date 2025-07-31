import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/lib/types";
import { getMemesByAuthor } from "@/lib/dummy-data";

interface SwipeCardProps {
  user: User;
}

export function SwipeCard({ user }: SwipeCardProps) {
  const userMemes = getMemesByAuthor(user.id).slice(0, 2);

  return (
    <Card className="absolute top-0 left-0 w-full h-full comic-border bg-card overflow-hidden flex flex-col">
      <div className="relative w-full h-3/5">
        <Image src={user.profilePicUrl} alt={user.username} fill className="object-cover" data-ai-hint="meme avatar"/>
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
          <h2 className="font-headline text-4xl">{user.username}</h2>
          <p className="font-semibold">{user.quizResult}</p>
        </div>
      </div>
      <CardContent className="p-4 flex-grow">
        <p className="italic">"{user.bio}"</p>
        <div className="flex flex-wrap gap-2 mt-2">
            {user.humorTags.map(tag => (
                <Badge key={tag} variant="secondary" className="comic-border !border-2 !rounded-md">{tag}</Badge>
            ))}
        </div>
      </CardContent>
       <CardFooter className="p-4 bg-muted/50">
           <h3 className="font-headline text-lg">Top Memes</h3>
           <div className="flex gap-2 mt-2">
               {userMemes.map(meme => (
                   <Image key={meme.id} src={meme.imageUrl} alt="user meme" width={60} height={80} className="rounded-md object-cover comic-border !border-2" data-ai-hint={meme.aiHint}/>
               ))}
           </div>
       </CardFooter>
    </Card>
  );
}
