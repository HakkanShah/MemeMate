"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Heart, User, PlusSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useEffect, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [loggedInUserId, setLoggedInUserId] = useState('user1');

  useEffect(() => {
    const userId = localStorage.getItem('loggedInUser');
    if (userId) {
      setLoggedInUserId(userId);
    }
  }, []);

  const navItems = [
    { href: "/feed", label: "Feed", icon: Home },
    { href: "/swipe", label: "Swipe", icon: Heart },
    { href: "/post/create", label: "Post", icon: PlusSquare },
    { href: "/chat", label: "Chats", icon: MessageCircle },
    { href: `/profile/${loggedInUserId}`, label: "Profile", icon: User },
  ];

  return (
    <TooltipProvider>
      <header className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md sm:max-w-sm z-50">
        <div className="bg-card/80 backdrop-blur-sm p-2 rounded-full comic-border border-2">
          <nav className="flex items-center justify-around">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = (href === '/chat' && pathname.startsWith('/chat')) || 
                             (href.startsWith('/profile/') && pathname.startsWith('/profile/')) ||
                             (href !== '/chat' && !href.startsWith('/profile/') && pathname === href);
              return (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={href}
                      className={cn(
                        "flex flex-col items-center justify-center h-14 w-14 rounded-full transition-all duration-300",
                        isActive
                          ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-7 w-7" />
                      <span className="sr-only">{label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="comic-border bg-card">
                    <p className="font-headline tracking-wide">{label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </div>
      </header>
    </TooltipProvider>
  );
}
