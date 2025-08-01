
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useToast } from '@/hooks/use-toast';
import { getStoredData, setStoredData } from '@/lib/dummy-data';
import type { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = () => {
    // Special bypass for Hakkan's account
    if (loginUsername === 'memeking' && loginPassword === 'Hakkan@123') {
        localStorage.setItem('loggedInUser', 'user_hakkan');
        router.push("/feed");
        return;
    }

    const users = getStoredData<User[]>('dummyUsers', []);
    const user = users.find(u => u.username === loginUsername && u.password === loginPassword);

    if (user) {
      localStorage.setItem('loggedInUser', user.id);
      router.push("/feed");
    } else {
      toast({
        variant: 'destructive',
        title: "Login Failed",
        description: "User not found or password incorrect. Please try again.",
      });
    }
  };

  const handleSignUp = () => {
    if (!signupUsername || !signupEmail || !signupPassword) {
       toast({
        variant: 'destructive',
        title: "Signup Failed",
        description: "Please fill out all fields.",
      });
      return;
    }
    const users = getStoredData<User[]>('dummyUsers', []);
    if (users.find(u => u.username === signupUsername)) {
      toast({
        variant: 'destructive',
        title: "Signup Failed",
        description: "A user with this username already exists.",
      });
      return;
    }

    const newUserId = `user${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      username: signupUsername,
      email: signupEmail,
      password: signupPassword,
      profilePicUrl: 'https://placehold.co/200x200.png',
      humorTags: [],
      memeGenres: [],
      status: 'Single AF',
      bio: 'New to MemeMate! Help me setup my profile.',
      quizResult: 'Newbie Memer',
    };

    const updatedUsers = [...users, newUser];
    setStoredData('dummyUsers', updatedUsers);
    localStorage.setItem('loggedInUser', newUserId);
    
    toast({
        title: "Account Created!",
        description: "Welcome! Let's find your meme-mate.",
    });
    
    router.push("/quiz");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="text-center mb-8">
        <h1 className="font-headline text-6xl sm:text-7xl md:text-8xl tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
          MemeMate
        </h1>
        <p className="font-body text-lg sm:text-xl md:text-2xl mt-2 text-muted-foreground">
          Where memes bring hearts together!
        </p>
      </div>
      
      {!isClient ? (
        <Skeleton className="w-full max-w-sm h-[450px]" />
      ) : (
        <Tabs defaultValue="login" className="w-full max-w-sm">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className="comic-border">
              <CardHeader>
                <CardTitle className="font-headline text-3xl">Welcome Back!</CardTitle>
                <CardDescription>
                  Enter your details to enter the meme-verse.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username-login">Username</Label>
                  <Input id="username-login" type="text" placeholder="RajuMemer69" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">Password</Label>
                  <Input id="password-login" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                </div>
                <Button onClick={handleLogin} className="w-full">Login</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="comic-border">
              <CardHeader>
                <CardTitle className="font-headline text-3xl">New Player!</CardTitle>
                <CardDescription>
                  Create an account and find your meme-mate.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="username-signup">Username</Label>
                  <Input id="username-signup" type="text" placeholder="MemeKaBadshah" value={signupUsername} onChange={e => setSignupUsername(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input id="email-signup" type="email" placeholder="pappu@passhogaya.com" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input id="password-signup" type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} />
                </div>
                <Button onClick={handleSignUp} className="w-full">Create Account</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <footer className="text-center text-sm text-muted-foreground mt-8">
        Project by <a href="https://github.com/HakkanShah" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Hakkan Shah</a>
      </footer>
    </main>
  );
}
