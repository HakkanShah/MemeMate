"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Heart, User, PlusSquare, Bell, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { getNotificationsByUserId } from "@/lib/dummy-data";
import { useRouter } from "next/navigation";

export function DesktopSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
    const [hasUnread, setHasUnread] = useState(false);

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
        { href: "/notifications", label: "Notifications", icon: Bell, badge: hasUnread },
        { href: profileHref, label: "Profile", icon: User },
    ];

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        router.push('/');
    };

    return (
        <TooltipProvider>
            <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col border-r-4 border-foreground bg-gradient-to-b from-card/95 to-background/95 backdrop-blur-xl z-40 shadow-2xl">
                {/* Logo */}
                <div className="p-6 border-b-4 border-foreground">
                    <h1 className="font-headline text-4xl tracking-wider text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        MemeMate
                    </h1>
                    <p className="text-xs text-center text-muted-foreground mt-1">Find your meme soulmate</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map(({ href, label, icon: Icon, badge }) => {
                        const isProfileLink = label === 'Profile';
                        const isActive = (isProfileLink && pathname.startsWith('/profile/')) ||
                            (href === '/chat' && pathname.startsWith('/chat')) ||
                            (href === '/notifications' && pathname.startsWith('/notifications')) ||
                            (!pathname.startsWith('/chat') && !pathname.startsWith('/notifications') && !isProfileLink && pathname === href);

                        return (
                            <Tooltip key={label}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                                            isActive
                                                ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-105"
                                                : "hover:bg-accent/10 text-foreground hover:scale-105",
                                            !loggedInUserId && isProfileLink && 'pointer-events-none opacity-50'
                                        )}
                                    >
                                        <Icon className={cn(
                                            "h-5 w-5 transition-transform",
                                            isActive && "animate-pulse"
                                        )} />
                                        <span className="font-semibold">{label}</span>
                                        {badge && (
                                            <div className="absolute right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        )}
                                        {isActive && (
                                            <div className="absolute left-0 w-1 h-full bg-white rounded-r-full" />
                                        )}
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="comic-border bg-card">
                                    <p className="font-headline tracking-wide">{label}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t-4 border-foreground">
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full justify-start gap-3"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </Button>
                </div>
            </aside>
        </TooltipProvider>
    );
}
