
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Heart, User, PlusSquare, Bell, Grip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { getNotificationsByUserId } from "@/lib/dummy-data";

export function Header() {
  const pathname = usePathname();
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const showNotificationIcon = !pathname.startsWith('/profile/') && !pathname.startsWith('/post/create');

  useEffect(() => {
    const userId = localStorage.getItem('loggedInUser');
    setLoggedInUserId(userId);

    if (userId) {
        const checkNotifications = () => {
            const notifications = getNotificationsByUserId(userId);
            setHasUnread(notifications.some(n => !n.read));
        };
        checkNotifications();
        
        window.addEventListener('storage', checkNotifications);
        return () => window.removeEventListener('storage', checkNotifications);
    }
  }, [pathname]);

  const profileHref = loggedInUserId ? `/profile/${loggedInUserId}` : '#';

  const navItems = [
    { href: "/feed", label: "Feed", icon: Home },
    { href: "/swipe", label: "Swipe", icon: Heart },
    { href: "/post/create", label: "Post", icon: PlusSquare },
    { href: "/chat", label: "Chats", icon: MessageCircle },
    { href: profileHref, label: "Profile", icon: User },
  ];
  
  const navContainerSize = "w-80 h-40";
  const iconSize = "h-12 w-12";

  return (
    <TooltipProvider>
      {showNotificationIcon && (
        <div className="fixed top-4 right-4 z-50">
            <Tooltip>
              <TooltipTrigger asChild>
                  <Link href="/notifications">
                    <Button 
                      variant="ghost"
                      size="icon" 
                      className="relative h-14 w-14 rounded-full static-comic-border !shadow-none bg-card/80 backdrop-blur-sm"
                    >
                      <Bell className="h-8 w-8" />
                      {hasUnread && <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-background animate-pulse" />}
                    </Button>
                  </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="comic-border bg-card">
                  <p className="font-headline tracking-wide">Notifications</p>
              </TooltipContent>
            </Tooltip>
        </div>
      )}

      <header className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
        <nav className="relative flex items-center justify-center">
             <div
              className={cn(
                "absolute bottom-0 flex items-center justify-center transition-all duration-500",
                 isOpen ? navContainerSize : "w-0 h-0"
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
                
                const angle = 10 + (160 / (navItems.length - 1)) * index;
                const angleRad = (angle - 180) * (Math.PI / 180);
                const radius = 110;
                const x = 50 + (radius / 2.2) * Math.cos(angleRad);
                const y = 90 + (radius / 2.2) * Math.sin(angleRad);

                const linkContent = (
                   <Link
                      href={href}
                      className={cn(
                        "absolute flex flex-col items-center justify-center rounded-full transition-all duration-300 static-comic-border",
                        iconSize,
                        isActive
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-card/90 text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground",
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

            <Button 
                size="icon" 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative h-14 w-14 rounded-full comic-border !border-4 !shadow-none z-10 transition-transform duration-300",
                    isOpen && "rotate-45 bg-destructive text-destructive-foreground"
                )}
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
            >
                <Grip className={cn("h-7 w-7 transition-all duration-300", isOpen ? "opacity-0 scale-50" : "opacity-100 scale-100")}  />
                <X className={cn("absolute h-7 w-7 transition-all duration-300", isOpen ? "opacity-100 scale-100" : "opacity-0 scale-50")} />
            </Button>
        </nav>
      </header>
    </TooltipProvider>
  );
}
