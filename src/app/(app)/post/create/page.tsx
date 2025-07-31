"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, Wand2 } from 'lucide-react';

export default function CreatePostPage() {
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [caption, setCaption] = useState('');

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

    const handlePost = () => {
        if (!imagePreview || !caption) {
            alert('Please upload an image and write a caption!');
            return;
        }
        // In a real app, you would handle the form submission here
        alert('Meme posted successfully! (Just kidding, this is a demo)');
        router.push('/feed');
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="font-headline text-5xl text-center my-8 tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
                Create a New Meme
            </h1>
            <Card className="comic-border">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Upload Your Masterpiece</CardTitle>
                    <CardDescription>Let the world see your sense of humor!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="meme-upload"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors comic-border !border-2"
                        >
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Meme preview" width={200} height={200} className="object-contain max-h-full rounded-md" />
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            )}
                        </label>
                        <Input id="meme-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>

                    <div className="space-y-2">
                        <Textarea
                            placeholder="Write a hilarious caption..."
                            className="comic-border !border-2"
                            rows={3}
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                         <Button variant="outline" className="w-full justify-start comic-border !border-2">
                            <Wand2 className="mr-2 h-4 w-4" />
                            Suggest a caption with AI
                        </Button>
                    </div>

                    <Button onClick={handlePost} className="w-full comic-border !border-2 !text-lg !py-6">
                        Post Meme!
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
