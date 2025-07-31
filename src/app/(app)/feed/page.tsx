import { MemeCard } from "@/components/meme-card";
import { dummyMemes } from "@/lib/dummy-data";

export default function FeedPage() {
  return (
    <div className="p-4">
       <h1 className="font-headline text-5xl text-center my-8 tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
          Meme Feed
        </h1>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {dummyMemes.map((meme) => (
          <MemeCard key={meme.id} meme={meme} />
        ))}
      </div>
    </div>
  );
}
