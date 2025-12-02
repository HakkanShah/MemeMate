"use client";

import { useState, useEffect, useRef } from "react";
import { notFound, useParams } from "next/navigation";
import { getMatchById, getMessagesByMatchId, getUserById, addMessage } from "@/lib/dummy-data";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatBubble } from "@/components/chat-bubble";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
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
      id: `msg${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
    <div className="flex flex-col h-screen lg:h-[calc(100vh-2rem)] lg:max-w-4xl lg:mx-auto">
      {/* Enhanced Header */}
      <header className="sticky top-0 bg-gradient-to-r from-card/95 to-background/95 backdrop-blur-xl z-10 border-b-3 border-foreground shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link href="/chat" className="lg:hidden">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link href={`/profile/${otherUser.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Avatar className="h-12 w-12 border-3 border-primary ring-2 ring-accent/50">
                <AvatarImage src={otherUser.profilePicUrl} alt={otherUser.username} data-ai-hint="meme avatar" />
                <AvatarFallback>{otherUser.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-headline text-2xl">{otherUser.username}</h1>
                <p className="text-xs text-muted-foreground">Online • Active now</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background/50 to-muted/30">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="font-headline text-2xl mb-2">Start the conversation!</h3>
            <p className="text-muted-foreground">Send your first meme-worthy message</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} isOwnMessage={msg.senderId === currentUserId} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Enhanced Input Area */}
      <div className="sticky bottom-0 bg-gradient-to-r from-card/95 to-background/95 backdrop-blur-xl border-t-3 border-foreground p-4 shadow-2xl">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3 max-w-4xl mx-auto">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 comic-border !border-2 h-12 text-base"
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full h-12 w-12 flex-shrink-0 shadow-lg hover:shadow-xl"
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
