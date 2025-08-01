"use client";

import { useState, useEffect, useRef } from "react";
import { notFound, useParams } from "next/navigation";
import { getMatchById, getMessagesByMatchId, getUserById, addMessage } from "@/lib/dummy-data";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatBubble } from "@/components/chat-bubble";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { playSound, SOUNDS } from "@/lib/sounds";

export default function ChatPage() {
  const params = useParams();
  const matchId = params.id as string;
  const match = getMatchById(matchId);
  
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setCurrentUserId] = useState('user1');

  useEffect(() => {
    const loggedInId = localStorage.getItem('loggedInUser');
    if (loggedInId) {
        setCurrentUserId(loggedInId);
    }

    const loadMessages = () => {
    if (matchId) {
        const initialMessages = getMessagesByMatchId(matchId);
        setMessages(initialMessages);
    }
    };
    loadMessages();
    
    window.addEventListener('storage', loadMessages);
    return () => window.removeEventListener('storage', loadMessages);

  }, [matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  if (!match) {
    notFound();
  }
  
  const otherUserId = match.userIds.find(id => id !== currentUserId)!;
  const otherUser = getUserById(otherUserId)!;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const message: ChatMessageType = {
      id: `msg${Date.now()}`,
      matchId,
      senderId: currentUserId,
      text: newMessage,
      timestamp: new Date(),
    };

    addMessage(message);
    setMessages(prev => [...prev, message]);
    setNewMessage("");
    playSound(SOUNDS.MESSAGE_SENT);
  };

  return (
    <div className="flex flex-col h-screen p-2 sm:p-4 pt-0">
      <header className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-3 text-center flex items-center justify-center gap-3">
        <Link href={`/profile/${otherUser.id}`}>
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarImage src={otherUser.profilePicUrl} alt={otherUser.username} data-ai-hint="meme avatar" />
            <AvatarFallback>{otherUser.username.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <h1 className="font-headline text-3xl">{otherUser.username}</h1>
      </header>

      <div className="flex-grow overflow-y-auto space-y-4 p-2">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} isOwnMessage={msg.senderId === currentUserId} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex items-center gap-2 mt-4">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Apna meme-worthy reply likho..."
          className="comic-border !border-2"
        />
        <Button type="submit" size="icon" className="rounded-full comic-border !border-2 h-10 w-10 flex-shrink-0">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
