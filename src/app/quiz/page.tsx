"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { updateUser, getUserById } from '@/lib/dummy-data';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';

const quizQuestions = [
    {
        question: "Pick your fav meme:",
        options: ["Shaktimaan flying", "JCB ki khudai", "Angry Hanuman", "Anbe Sivam"],
        results: {
            "Shaktimaan flying": "Wholesome King",
            "JCB ki khudai": "Certified Troll",
            "Angry Hanuman": "Roast Master",
            "Anbe Sivam": "Meme God"
        }
    },
    {
        question: "Preferred roast style:",
        options: ["Kapil Sharma", "CarryMinati", "Aunty ji's taunts", "News debate"],
        results: {
            "Kapil Sharma": "Wholesome King",
            "CarryMinati": "Roast Master",
            "Aunty ji's taunts": "Certified Troll",
            "News debate": "Meme God"
        }
    },
    {
        question: "Which meme gets you?",
        options: ["Pappu pass ho gaya", "Gormint aunty", "Kokilaben's rasoda", "Paragliding guy"],
        results: {
            "Pappu pass ho gaya": "Wholesome King",
            "Gormint aunty": "Roast Master",
            "Kokilaben's rasoda": "Certified Troll",
            "Paragliding guy": "Meme God"
        }
    }
];

export default function QuizPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [answers, setAnswers] = useState<{[key: number]: string}>({});

    const handleAnswerChange = (questionIndex: number, value: string) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: value }));
    };

    const calculateResult = () => {
        const resultCounts: {[key: string]: number} = {
            "Wholesome King": 0,
            "Certified Troll": 0,
            "Roast Master": 0,
            "Meme God": 0,
        };

        quizQuestions.forEach((q, index) => {
            const answer = answers[index];
            if (answer) {
                const result = q.results[answer as keyof typeof q.results];
                if (result) {
                    resultCounts[result]++;
                }
            }
        });

        // Find the result with the highest count
        let finalResult = "Newbie Memer";
        let maxCount = 0;
        for (const [result, count] of Object.entries(resultCounts)) {
            if (count > maxCount) {
                maxCount = count;
                finalResult = result;
            }
        }
        return finalResult;
    };

    const handleSubmit = () => {
        if (Object.keys(answers).length < quizQuestions.length) {
            toast({
                variant: 'destructive',
                title: "Incomplete Quiz",
                description: "Please answer all questions to find your destiny.",
            });
            return;
        }

        const quizResult = calculateResult();
        const loggedInUserId = localStorage.getItem('loggedInUser');

        if (loggedInUserId) {
            const user = getUserById(loggedInUserId);
            if (user) {
                const updatedUser: User = { ...user, quizResult };
                updateUser(updatedUser);
            }
        }
        
        toast({
            title: "Quiz Complete!",
            description: `Your humor profile is: ${quizResult}`,
        });
        
        router.push('/feed');
    };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="font-headline text-4xl sm:text-5xl text-center mb-8 tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
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
                        <RadioGroup onValueChange={(value) => handleAnswerChange(index, value)}>
                            {q.options.map((opt) => (
                                <div key={opt} className="flex items-center space-x-2">
                                    <RadioGroupItem value={opt} id={`q${index}-${opt}`} />
                                    <Label htmlFor={`q${index}-${opt}`}>{opt}</Label>

                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                ))}

                <Button onClick={handleSubmit} className="w-full comic-border !border-2 !text-lg !py-6">Finish Quiz & Find Matches!</Button>
            </CardContent>
        </Card>
    </main>
  );
}
