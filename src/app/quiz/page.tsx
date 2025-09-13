
"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { updateUser, getUserById } from '@/lib/dummy-data';
import { toast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const quizQuestions = [
    {
        question: "A friend sends a 'Good Morning' message with a flower on WhatsApp. You reply with:",
        options: ["The same picture back to them", "A sarcastic meme about boomer humor", "Silence. You archive the chat.", "A 'Seen' and nothing more."],
        results: {
            "The same picture back to them": "Wholesome Humorist",
            "A sarcastic meme about boomer humor": "Savage Sarcastic",
            "Silence. You archive the chat.": "Low-key Roaster",
            "A 'Seen' and nothing more.": "Silent Shitposter"
        }
    },
    {
        question: "Your favorite Bollywood meme template involves:",
        options: ["Hera Pheri (Raju, Shyam, Babu Bhaiya)", "3 Idiots (Rancho, Farhan, Raju)", "Gangs of Wasseypur (Sardar Khan)", "Munna Bhai M.B.B.S."],
        results: {
            "Hera Pheri (Raju, Shyam, Babu Bhaiya)": "Classic Comedy Connoisseur",
            "3 Idiots (Rancho, Farhan, Raju)": "Relatable Rant King",
            "Gangs of Wasseypur (Sardar Khan)": "Dark Humor Devotee",
            "Munna Bhai M.B.B.S.": "Wholesome Humorist"
        }
    },
    {
        question: "When a new viral trend takes over Instagram, you:",
        options: ["Are the first to make a reel on it", "Wait for it to become cringe, then make memes about it", "Silently judge everyone who participates", "Have no idea what's happening"],
        results: {
            "Are the first to make a reel on it": "Certified Trend-Setter",
            "Wait for it to become cringe, then make memes about it": "Savage Sarcastic",
            "Silently judge everyone who participates": "Low-key Roaster",
            "Have no idea what's happening": "Silent Shitposter"
        }
    },
];


export default function QuizPage() {
    const router = useRouter();
    const [answers, setAnswers] = useState<{[key: number]: string}>({});
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const handleAnswerChange = (questionIndex: number, value: string) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: value }));
        // Automatically move to the next question
        setTimeout(() => {
            if (currentQuestion < quizQuestions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            }
        }, 300);
    };

    const calculateResult = () => {
        const resultCounts: {[key: string]: number} = {};
        
        quizQuestions.forEach((q, index) => {
            const answer = answers[index];
            if (answer) {
                const result = q.results[answer as keyof typeof q.results];
                if (result) {
                    resultCounts[result] = (resultCounts[result] || 0) + 1;
                }
            }
        });
        
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
    
    const progress = (Object.keys(answers).length / quizQuestions.length) * 100;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="font-headline text-4xl sm:text-5xl text-center mb-4 tracking-wider text-primary-foreground drop-shadow-lg" style={{ WebkitTextStroke: '2px black' }}>
          Meme Compatibility Quiz
        </h1>
        <Card className="w-full max-w-lg comic-border bg-card/80 backdrop-blur-sm overflow-hidden">
            <Progress value={progress} className="h-3 rounded-none" />
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Apna Humor Pehchano!</CardTitle>
                <CardDescription>Answer these questions to find your meme-mate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {quizQuestions.map((q, index) => (
                    <div key={index} className={cn(index === currentQuestion ? 'block' : 'hidden')}>
                        <h3 className="font-bold text-lg mb-4 text-center">{index + 1}. {q.question}</h3>
                        <RadioGroup 
                            onValueChange={(value) => handleAnswerChange(index, value)} 
                            className="space-y-3"
                            value={answers[index] || ""}
                        >
                            {q.options.map((opt) => (
                                <Label 
                                    htmlFor={`q${index}-${opt}`} 
                                    key={opt} 
                                    className={cn(
                                        "flex items-center space-x-3 p-4 rounded-md transition-all cursor-pointer comic-border !border-2",
                                        answers[index] === opt 
                                            ? "bg-primary text-primary-foreground" 
                                            : "bg-background hover:bg-muted"
                                    )}
                                >
                                    <RadioGroupItem value={opt} id={`q${index}-${opt}`} />
                                    <span>{opt}</span>
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>
                ))}

                {Object.keys(answers).length === quizQuestions.length && (
                    <Button onClick={handleSubmit} className="w-full comic-border !border-2 !text-lg !py-6">Finish Quiz & Find Matches!</Button>
                )}
            </CardContent>
        </Card>
    </main>
  );
}
