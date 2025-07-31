"use client";

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { suggestHumorTags } from '@/ai/flows/suggest-humor-tags';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const initialState = {
  tags: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full comic-border !border-2">
      {pending ? 'Soch Raha Hu...' : <>
        <Sparkles className="mr-2 h-4 w-4" />
        Suggest Tags
      </>}
    </Button>
  );
}

export function HumorTagSuggestor({ currentBio }: { currentBio: string }) {
  const [state, formAction] = useFormState(async (prevState: any, formData: FormData) => {
    const content = formData.get('content') as string;
    if (!content) return { tags: [] };
    const result = await suggestHumorTags({ content });
    return result;
  }, initialState);

  const [bio, setBio] = useState(currentBio);

  return (
    <Card className="comic-border bg-card/80 backdrop-blur-sm mb-8">
      <CardHeader>
        <CardTitle className="font-headline text-3xl flex items-center gap-2"><Sparkles/> AI Humor Inspector</CardTitle>
        <CardDescription>Apna bio daalo aur dekho AI tumhare baare mein kya sochta hai. Hum tags suggest karenge!</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <Textarea
            name="content"
            placeholder="Type your bio or some of your favorite jokes here..."
            rows={4}
            className="comic-border !border-2"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <SubmitButton />
        </form>
        {state.tags && state.tags.length > 0 && (
          <div className="mt-4">
            <h4 className="font-headline text-xl">Suggested Tags:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {state.tags.map((tag: string) => (
                <Badge key={tag} variant="default" className="text-base p-2">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
