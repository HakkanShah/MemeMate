import Link from "next/link";
import { dummyMatches, getUserById } from "@/lib/dummy-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export default function ChatListPage() {
  const currentUserId = "user1";

  return (
    <div className="p-4">
      <h1 className="font-headline text-5xl text-center my-8 tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
        Your Matches
      </h1>
      <div className="max-w-md mx-auto space-y-4">
        {dummyMatches.map((match) => {
          const otherUserId = match.userIds.find(id => id !== currentUserId);
          if (!otherUserId) return null;
          const otherUser = getUserById(otherUserId);
          if (!otherUser) return null;

          return (
            <Link href={`/chat/${match.id}`} key={match.id}>
              <Card className="p-4 flex items-center gap-4 comic-border bg-card/80 backdrop-blur-sm">
                <Avatar className="h-16 w-16 border-4 border-primary">
                  <AvatarImage src={otherUser.profilePicUrl} alt={otherUser.username} data-ai-hint="meme avatar" />
                  <AvatarFallback>{otherUser.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-headline text-2xl">{otherUser.username}</h2>
                  <p className="text-muted-foreground">Tap to start chatting...</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
