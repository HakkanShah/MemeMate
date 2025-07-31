"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { getMatchById, getMessagesByMatchId, getUserById, addMessage } from "@/lib/dummy-data";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatBubble } from "@/components/chat-bubble";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function ChatPage() {
  const params = useParams();
  const matchId = params.id as string;
  const match = getMatchById(matchId);
  
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
      if (matchId) {
          const initialMessages = getMessagesByMatchId(matchId);
          setMessages(initialMessages);
      }
  }, [matchId]);


  if (!match) {
    notFound();
  }

  const currentUserId = 'user1'; 
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
  };

  return (
    <div className="flex flex-col h-screen p-4 pt-0">
      <header className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-4 text-center">
        <h1 className="font-headline text-3xl">Chat with {otherUser.username}</h1>
      </header>

      <div className="flex-grow overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} isOwnMessage={msg.senderId === currentUserId} />
        ))}
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
