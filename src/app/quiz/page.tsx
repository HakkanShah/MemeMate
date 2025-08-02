
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

const quizQuestions = [
    {
        question: "Your go-to reaction meme?",
        options: ["'Main kya karu? Job chhod doon?'", "'Mera to sab kuch lut gaya'", "'Oo bhai, maro mujhe maro'", "'Ye kya ho raha hai?'"],
        results: {
 "Main kya karu? Job chhod doon?": "Relatable Rant King",
 "Mera to sab kuch lut gaya": "Drama Queen/King",
 "Oo bhai, maro mujhe maro": "Self-Deprecating Humorist",
 "Ye kya ho raha hai?": "Confused Soul",
        }
    },
    {
        question: "When someone shares a cringe meme, you are:",
        options: ["'Mummy, chappal kahan hai?'", "'Bas karo bhai, rulayega kya?'", "'Delete karde bhai, izzat ki maa behen ho rahi hai'", "'Aap chronology samajhiye'"],
        results: {
 "Mummy, chappal kahan hai?": "Aggressive Roaster",
 "Bas karo bhai, rulayega kya?": "Sympathetic Critic",
 "Delete karde bhai, izzat ki maa behen ho rahi hai": "Embarrassed Spectator",
 "Aap chronology samajhiye": "Analytical Critic",
        }
    },
    {
        question: "Your spirit animal meme?",
        options: ["Sacred Games' Gaitonde", "Mirzapur's Munna Bhaiya", "Panchayat's Abhishek Tripathi", "Scam 1992's Harshad Mehta"],
        results: {
 "Sacred Games' Gaitonde": "Philosophical Memer",
 "Mirzapur's Munna Bhaiya": "Aggressive & Bold Memer",
 "Panchayat's Abhishek Tripathi": "Relatable Everyday Memer",
 "Scam 1992's Harshad Mehta": "Master Strategist Memer",
        }
    },
];

export default function QuizPage() {
    const router = useRouter();
    const [answers, setAnswers] = useState<{[key: number]: string}>({});

    const handleAnswerChange = (questionIndex: number, value: string) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: value }));
    };

    const calculateResult = () => {
        const resultCounts: {[key: string]: number} = {
 "Relatable Rant King": 0,
 "Drama Queen/King": 0,
 "Self-Deprecating Humorist": 0,
 "Confused Soul": 0,
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
 <h1 className="font-headline text-4xl sm:text-5xl text-center mb-8 tracking-wider text-primary-foreground drop-shadow-lg" style={{ WebkitTextStroke: '2px black' }}>
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
 <h3 className="font-bold text-lg mb-3 text-gray-800 drop-shadow-sm">{index+1}. {q.question}</h3>
 <RadioGroup onValueChange={(value) => handleAnswerChange(index, value)} className="space-y-3">
                            {q.options.map((opt) => (
 <div key={opt} className="flex items-center space-x-3 p-3 border rounded-md bg-white shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
 <RadioGroupItem value={opt} id={`q${index}-${opt}`} className="text-primary-foreground focus:ring-2 focus:ring-primary-foreground" />
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
