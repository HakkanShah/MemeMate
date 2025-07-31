"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const quizQuestions = [
    {
        question: "Pick your fav meme:",
        options: ["Shaktimaan flying", "JCB ki khudai", "Angry Hanuman", "Anbe Sivam"],
    },
    {
        question: "Preferred roast style:",
        options: ["Kapil Sharma", "CarryMinati", "Aunty ji's taunts", "News debate"],
    },
    {
        question: "Which meme gets you?",
        options: ["Pappu pass ho gaya", "Gormint aunty", "Kokilaben's rasoda", "Paragliding guy"],
    }
]

export default function QuizPage() {
    const router = useRouter();

    const handleSubmit = () => {
        // In a real app, this would save the quiz results
        alert("Quiz complete! Welcome to the meme-verse!");
        router.push('/feed');
    }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="font-headline text-5xl text-center mb-8 tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
          Meme Compatibility Quiz
        </h1>
        <Card className="w-full max-w-lg comic-border bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Apna Humor Pehchano!</CardTitle>
                <CardDescription>Answer these top-secret questions to find your meme-mate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {quizQuestions.map((q, index) => (
                    <div key={index}>
                        <h3 className="font-bold text-lg mb-2">{index+1}. {q.question}</h3>
                        <RadioGroup>
                            {q.options.map((opt) => (
                                <div key={opt} className="flex items-center space-x-2">
                                    <RadioGroupItem value={opt} id={`q${index}-${opt}`} />
                                    <Label htmlFor={`q${index}-${opt}`}>{opt}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                ))}

                <Button onClick={handleSubmit} className="w-full comic-border !border-2 !text-lg !py-6">Finish Quiz &amp; Find Matches!</Button>
            </CardContent>
        </Card>
    </main>
  );
}
