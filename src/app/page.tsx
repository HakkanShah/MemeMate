
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { toast } from '@/hooks/use-toast';
import { getStoredData, setStoredData } from '@/lib/dummy-data';
import type { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Validation errors
  const [loginErrors, setLoginErrors] = useState({ username: '', password: '' });
  const [signupErrors, setSignupErrors] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    setIsClient(true);
    // If user is already logged in, redirect to feed
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      router.push("/feed");
    }
  }, [router]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    // Reset errors
    setLoginErrors({ username: '', password: '' });

    // Validation
    let hasErrors = false;
    const errors = { username: '', password: '' };

    if (!loginUsername.trim()) {
      errors.username = 'Username is required';
      hasErrors = true;
    }

    if (!loginPassword) {
      errors.password = 'Password is required';
      hasErrors = true;
    }

    if (hasErrors) {
      setLoginErrors(errors);
      return;
    }

    setIsLoading(true);

    // Simulate async operation
    setTimeout(() => {
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
        setIsLoading(false);
        toast({
          variant: 'destructive',
          title: "Login Failed",
          description: "User not found or password incorrect. Please try again.",
        });
      }
    }, 300);
  };

  const handleSignUp = () => {
    // Reset errors
    setSignupErrors({ username: '', email: '', password: '' });

    // Validation
    let hasErrors = false;
    const errors = { username: '', email: '', password: '' };

    if (!signupUsername.trim()) {
      errors.username = 'Username is required';
      hasErrors = true;
    } else if (signupUsername.length < 3) {
      errors.username = 'Username must be at least 3 characters';
      hasErrors = true;
    }

    if (!signupEmail.trim()) {
      errors.email = 'Email is required';
      hasErrors = true;
    } else if (!validateEmail(signupEmail)) {
      errors.email = 'Please enter a valid email address';
      hasErrors = true;
    }

    if (!signupPassword) {
      errors.password = 'Password is required';
      hasErrors = true;
    } else if (signupPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      hasErrors = true;
    }

    if (hasErrors) {
      setSignupErrors(errors);
      return;
    }

    setIsLoading(true);

    // Simulate async operation
    setTimeout(() => {
      const users = getStoredData<User[]>('dummyUsers', []);
      if (users.find(u => u.username === signupUsername)) {
        setIsLoading(false);
        setSignupErrors({ ...errors, username: 'Username already exists' });
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
        hasSeenTutorial: false,
      };

      const updatedUsers = [...users, newUser];
      setStoredData('dummyUsers', updatedUsers);

      if (rememberMe) {
        localStorage.setItem('loggedInUser', newUserId);
      }

      toast({
        title: "Account Created!",
        description: "Welcome! Let's find your meme-mate.",
      });

      router.push("/quiz");
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  if (!isClient) {
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
        <Skeleton className="w-full max-w-sm h-[450px]" />
        <footer className="text-center text-sm text-muted-foreground mt-8">
          Project by <a href="https://github.com/HakkanShah" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Hakkan Shah</a>
        </footer>
      </main>
    );
  }

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
                <Input
                  id="username-login"
                  type="text"
                  placeholder="RajuMemer69"
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  onKeyDown={e => handleKeyPress(e, handleLogin)}
                  className={loginErrors.username ? 'border-destructive' : ''}
                  aria-invalid={!!loginErrors.username}
                  aria-describedby={loginErrors.username ? 'username-login-error' : undefined}
                />
                {loginErrors.username && (
                  <p id="username-login-error" className="text-sm text-destructive">{loginErrors.username}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login">Password</Label>
                <div className="relative">
                  <Input
                    id="password-login"
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    onKeyDown={e => handleKeyPress(e, handleLogin)}
                    className={loginErrors.password ? 'border-destructive pr-10' : 'pr-10'}
                    aria-invalid={!!loginErrors.password}
                    aria-describedby={loginErrors.password ? 'password-login-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p id="password-login-error" className="text-sm text-destructive">{loginErrors.password}</p>
                )}
              </div>
              <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
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
                <Input
                  id="username-signup"
                  type="text"
                  placeholder="MemeKaBadshah"
                  value={signupUsername}
                  onChange={e => setSignupUsername(e.target.value)}
                  onKeyDown={e => handleKeyPress(e, handleSignUp)}
                  className={signupErrors.username ? 'border-destructive' : ''}
                  aria-invalid={!!signupErrors.username}
                  aria-describedby={signupErrors.username ? 'username-signup-error' : undefined}
                />
                {signupErrors.username && (
                  <p id="username-signup-error" className="text-sm text-destructive">{signupErrors.username}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="pappu@passhogaya.com"
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  onKeyDown={e => handleKeyPress(e, handleSignUp)}
                  className={signupErrors.email ? 'border-destructive' : ''}
                  aria-invalid={!!signupErrors.email}
                  aria-describedby={signupErrors.email ? 'email-signup-error' : undefined}
                />
                {signupErrors.email && (
                  <p id="email-signup-error" className="text-sm text-destructive">{signupErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <div className="relative">
                  <Input
                    id="password-signup"
                    type={showSignupPassword ? "text" : "password"}
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    onKeyDown={e => handleKeyPress(e, handleSignUp)}
                    className={signupErrors.password ? 'border-destructive pr-10' : 'pr-10'}
                    aria-invalid={!!signupErrors.password}
                    aria-describedby={signupErrors.password ? 'password-signup-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showSignupPassword ? "Hide password" : "Show password"}
                  >
                    {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {signupErrors.password && (
                  <p id="password-signup-error" className="text-sm text-destructive">{signupErrors.password}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
                <Label htmlFor="remember-me" className="cursor-pointer">Remember me</Label>
              </div>
              <Button onClick={handleSignUp} className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>


      <footer className="text-center text-sm text-muted-foreground mt-8">
        Project by <a href="https://github.com/HakkanShah" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Hakkan Shah</a>
      </footer>
    </main>
  );
}
