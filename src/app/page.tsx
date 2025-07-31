"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const handleAuthAction = () => {
    // In a real app, this would handle login/signup
    // For the demo, we'll just navigate to the quiz for new users
    router.push("/quiz");
  };
  
  const handleGoogleSignIn = () => {
    // In a real app, this would handle Google Sign-In
    // For the demo, we'll navigate to the feed for existing users
    router.push("/feed");
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="text-center mb-8">
        <h1 className="font-headline text-5xl sm:text-6xl md:text-8xl tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
          Desi MemeMatch
        </h1>
        <p className="font-body text-lg sm:text-xl md:text-2xl mt-2 text-muted-foreground">
          Jahan Memes Milte Hain, Aur Dil Bhi!
        </p>
      </div>

      <Tabs defaultValue="login" className="w-full max-w-sm sm:max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="comic-border">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Wapis Aaye, MemeLover!</CardTitle>
              <CardDescription>
                Apna password daalo aur meme-verse mein enter karo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login">Email</Label>
                <Input id="email-login" type="email" placeholder="sharmaji@beta.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login">Password</Label>
                <Input id="password-login" type="password" />
              </div>
              <Button onClick={handleGoogleSignIn} className="w-full">Login</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card className="comic-border">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Naya Khiladi!</CardTitle>
              <CardDescription>
                Account banao aur dekho kaun hai tumhara meme-mate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input id="email-signup" type="email" placeholder="pappu@passhogaya.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input id="password-signup" type="password" />
              </div>
              <Button onClick={handleAuthAction} className="w-full">Create Account</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-4 w-full max-w-sm sm:max-w-md">
        <Button variant="outline" className="w-full comic-border" onClick={handleGoogleSignIn}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
          Google Se Sign In Karo
        </Button>
      </div>
    </main>
  );
}
