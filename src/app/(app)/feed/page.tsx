import { MemeCard } from "@/components/meme-card";
import { dummyMemes } from "@/lib/dummy-data";

export default function FeedPage() {
  return (
    <div className="p-4">
       <h1 className="font-headline text-5xl text-center my-8 tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
          Meme Feed
        </h1>
      <div className="max-w-md mx-auto space-y-8">
        {dummyMemes.map((meme) => (
          <MemeCard key={meme.id} meme={meme} />
        ))}
      </div>
    </div>
  );
}
