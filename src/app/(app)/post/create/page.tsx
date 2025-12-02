
"use client";

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, Wand2, Loader2, X, ImagePlus } from 'lucide-react';
import { addMeme } from '@/lib/dummy-data';
import type { Meme } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { suggestMemeCaption } from '@/ai/flows/suggest-meme-caption';
import { playSound, SOUNDS } from '@/lib/sounds';

export default function CreatePostPage() {
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [isSuggesting, startSuggestionTransition] = useTransition();

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClearImage = () => {
        setImagePreview(null);
    };

    const handleSuggestCaption = () => {
        if (!imagePreview) {
            toast({
                variant: "destructive",
                title: "No Image",
                description: "Please upload an image before suggesting a caption.",
            });
            return;
        }
        startSuggestionTransition(async () => {
            try {
                const result = await suggestMemeCaption({ imageDataUri: imagePreview });
                if (result.caption) {
                    setCaption(result.caption);
                } else {
                    toast({
                        variant: "destructive",
                        title: "AI Error",
                        description: "Could not suggest a caption. Please try again.",
                    });
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "AI Suggestion Failed",
                    description: "Something went wrong while talking to the AI. Please try again later.",
                });
            }
        });
    };

    const handlePost = () => {
        if (!imagePreview || !caption) {
            toast({
                variant: "destructive",
                title: "Incomplete Post",
                description: "Please upload an image and write a caption!",
            });
            return;
        }

        const loggedInUserId = localStorage.getItem('loggedInUser') || 'user1';

        const newMeme: Meme = {
            id: `meme-${Date.now()}`,
            imageUrl: imagePreview,
            caption: caption,
            authorId: loggedInUserId,
            reactions: { '😂': 0, '🙏': 0, '💀': 0, '😭': 0, '💘': 0 },
            comments: [],
            timestamp: new Date(),
            aiHint: 'custom meme'
        };

        addMeme(newMeme);
        playSound(SOUNDS.POST_SUCCESS);

        toast({
            title: "Meme Posted!",
            description: "Your masterpiece is now live in the feed.",
        });

        router.push('/feed');
    };

    return (
        <div className="p-2 sm:p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl text-center my-6 lg:my-12 tracking-wider bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                    Create Your Meme
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upload Section */}
                    <Card className="comic-border">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Upload Image</CardTitle>
                            <CardDescription>Share your meme-worthy masterpiece</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="meme-upload"
                                    className="relative flex flex-col items-center justify-center w-full aspect-square border-3 border-dashed rounded-xl cursor-pointer bg-gradient-to-br from-muted/50 to-background hover:from-muted/80 hover:to-muted/50 transition-all comic-border !border-2 overflow-hidden group"
                                >
                                    {imagePreview ? (
                                        <>
                                            <Image
                                                src={imagePreview}
                                                alt="Meme preview"
                                                fill
                                                className="object-contain p-4"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleClearImage();
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-center px-4 py-8">
                                            <div className="relative mb-4">
                                                <ImagePlus className="w-16 h-16 text-muted-foreground" />
                                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                                    <Upload className="w-4 h-4 text-primary-foreground" />
                                                </div>
                                            </div>
                                            <p className="mb-2 text-lg font-semibold">
                                                Click to upload
                                            </p>
                                            <p className="text-sm text-muted-foreground">or drag and drop</p>
                                            <p className="text-xs text-muted-foreground mt-2">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    )}
                                </label>
                                <Input
                                    id="meme-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Caption Section */}
                    <Card className="comic-border">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Add Caption</CardTitle>
                            <CardDescription>Make it funny, make it memorable</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Write your hilarious caption here..."
                                    className="comic-border !border-2 min-h-[200px] text-base resize-none"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                />
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{caption.length} characters</span>
                                    <span>{caption.split(' ').filter(w => w).length} words</span>
                                </div>
                            </div>

                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={handleSuggestCaption}
                                disabled={isSuggesting || !imagePreview}
                            >
                                {isSuggesting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        AI is thinking...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="mr-2 h-4 w-4" />
                                        Suggest Caption with AI
                                    </>
                                )}
                            </Button>

                            <div className="pt-6">
                                <Button
                                    onClick={handlePost}
                                    className="w-full h-14 text-lg"
                                    disabled={!imagePreview || !caption}
                                >
                                    🚀 Post Your Meme!
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
