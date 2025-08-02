
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getNotificationsByUserId, getUserById, markNotificationsAsRead } from "@/lib/dummy-data";
import type { Notification } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Heart, MessageSquare, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';


const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
    switch (type) {
        case 'follow':
            return <UserPlus className="h-6 w-6 text-blue-500" />;
        case 'reaction':
            return <Heart className="h-6 w-6 text-red-500" />;
        case 'comment':
            return <MessageSquare className="h-6 w-6 text-green-500" />;
        default:
            return <Bell className="h-6 w-6 text-gray-500" />;
    }
}


const NotificationItem = ({ notification }: { notification: Notification }) => {
    const actor = getUserById(notification.actorId);

    if (!actor) return null;

    let text = "";
    let link = `/profile/${actor.id}`;

    switch (notification.type) {
        case 'follow':
            text = "started following you.";
            break;
        case 'reaction':
            text = "reacted to your meme.";
            link = `/feed#${notification.memeId}`; // This linking would need meme cards to have an ID
            break;
        case 'comment':
            text = "commented on your meme.";
            link = `/feed#${notification.memeId}`;
            break;
    }

    return (
        <Link href={link}>
            <Card className={cn("p-4 flex items-center gap-4 comic-border transition-all", !notification.read && "bg-primary/10 border-primary")}>
                <NotificationIcon type={notification.type} />
                 <Avatar className="h-12 w-12 border-2 border-primary">
                    <AvatarImage src={actor.profilePicUrl} alt={actor.username} data-ai-hint="meme avatar" />
                    <AvatarFallback>{actor.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <p>
                        <span className="font-bold">{actor.username}</span> {text}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </p>
                </div>
            </Card>
        </Link>
    );
};


export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

    useEffect(() => {
        const id = localStorage.getItem('loggedInUser');
        if (id) {
            setLoggedInUserId(id);
            const userNotifications = getNotificationsByUserId(id);
            setNotifications(userNotifications);
            markNotificationsAsRead(id);
        }
        setLoading(false);
    }, []);

    return (
        <div className="p-2 sm:p-4">
            <h1 className="font-headline text-4xl sm:text-5xl text-center my-8 tracking-wider text-primary-foreground" style={{ WebkitTextStroke: '2px black' }}>
                Notifications
            </h1>
            <div className="max-w-xl mx-auto space-y-4">
                {loading ? (
                    [...Array(5)].map((_, i) => (
                        <Card key={i} className="p-4 flex items-center gap-4 comic-border">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2 flex-grow">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/4" />
                            </div>
                        </Card>
                    ))
                ) : notifications.length > 0 ? (
                    notifications.map(notif => <NotificationItem key={notif.id} notification={notif} />)
                ) : (
                    <Card className="p-8 text-center comic-border">
                        <h2 className="font-headline text-2xl">All caught up!</h2>
                        <p className="text-muted-foreground">You have no new notifications.</p>
                    </Card>
                )}
            </div>
        </div>
    );
}
