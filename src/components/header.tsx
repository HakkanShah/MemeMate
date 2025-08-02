
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Heart, User, PlusSquare, Grip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function Header() {
  const pathname = usePathname();
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // This code runs only on the client, after the component has mounted
    const userId = localStorage.getItem('loggedInUser');
    setLoggedInUserId(userId);
  }, []);

  const profileHref = loggedInUserId ? `/profile/${loggedInUserId}` : '#';

  const navItems = [
    { href: "/feed", label: "Feed", icon: Home },
    { href: "/swipe", label: "Swipe", icon: Heart },
    { href: "/post/create", label: "Post", icon: PlusSquare },
    { href: "/chat", label: "Chats", icon: MessageCircle },
    { href: profileHref, label: "Profile", icon: User },
  ];

  return (
    <TooltipProvider>
      <header className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <nav className="relative flex items-center justify-center">
            {/* Nav items that fan out */}
             <div
              className={cn(
                "absolute bottom-0 flex items-center justify-center transition-all duration-500",
                 isOpen ? "w-80 h-40" : "w-0 h-0"
              )}
              style={{
                clipPath: isOpen ? 'circle(100% at 50% 100%)' : 'circle(0% at 50% 100%)',
              }}
            >
              {navItems.map(({ href, label, icon: Icon }, index) => {
                const isProfileLink = label === 'Profile';
                const isActive = (isProfileLink && pathname.startsWith('/profile/')) ||
                               (href === '/chat' && pathname.startsWith('/chat')) ||
                               (!pathname.startsWith('/chat') && !isProfileLink && pathname === href);
                
                const angle = -Math.PI + (index * (Math.PI / (navItems.length - 1)));
                const radius = 110; 
                const x = 50 + (radius / 2.2) * Math.cos(angle);
                const y = 90 + (radius / 2.2) * Math.sin(angle);

                const linkContent = (
                   <Link
                      href={href}
                      className={cn(
                        "absolute flex flex-col items-center justify-center h-12 w-12 rounded-full transition-all duration-300",
                        "bg-card/90 border-4 border-foreground shadow-[4px_4px_0px_hsl(var(--accent))]",
                        isActive
                          ? "bg-primary text-primary-foreground scale-110"
                          : "text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground",
                        !loggedInUserId && isProfileLink && 'pointer-events-none opacity-50',
                        !isOpen && "opacity-0 scale-0 pointer-events-none"
                      )}
                       style={{
                         top: `${y}%`,
                         left: `${x}%`,
                         transform: `translate(-50%, -50%)`,
                         transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
                       }}
                       onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="sr-only">{label}</span>
                    </Link>
                );

                return (
                  <Tooltip key={label}>
                    <TooltipTrigger asChild>
                      {linkContent}
                    </TooltipTrigger>
                    <TooltipContent side="top" className="comic-border bg-card">
                      <p className="font-headline tracking-wide">{label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
             </div>

            {/* Central button */}
            <Button 
                size="icon" 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative h-14 w-14 rounded-full comic-border !border-4 !shadow-none z-10 transition-all duration-300",
                    isOpen ? "bg-destructive text-destructive-foreground translate-y-4" : "bg-primary text-primary-foreground"
                )}
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
                style={{ transformStyle: 'preserve-3d' }}
            >
                <div className={cn("absolute inset-0 flex items-center justify-center transition-transform duration-500", isOpen && "[transform:rotateY(180deg)]")}>
                  <Grip className={cn("h-7 w-7 transition-opacity duration-200", isOpen ? "opacity-0" : "opacity-100")} style={{backfaceVisibility: 'hidden'}} />
                </div>
                <div className={cn("absolute inset-0 flex items-center justify-center transition-transform duration-500 [transform:rotateY(180deg)]", !isOpen && "[transform:rotateY(360deg)]")}>
                   <X className={cn("h-7 w-7 transition-opacity duration-200", isOpen ? "opacity-100" : "opacity-0")} style={{backfaceVisibility: 'hidden'}} />
                </div>

            </Button>
        </nav>
      </header>
    </TooltipProvider>
  );
}
