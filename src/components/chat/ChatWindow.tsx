"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { Send, Loader, Mic, Info, ChefHat, ListTodo, Copy, Menu, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ChatMessage as ChatMessageType, ShoppingListItem, GenerateRecipeOutput } from "@/lib/types";
import { ChatMessage } from "./ChatMessage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ShoppingListCard } from "./ShoppingListCard";
import { RecipeCard } from "./RecipeCard";
import { useAppContext } from "@/contexts/AppContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChatHistorySidebar } from "./ChatHistorySidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ChatMode = "inquiry" | "recipe" | "list";

const welcomeMessage: ChatMessageType = {
    id: 'welcome',
    role: 'assistant',
    content: "Assalamualaikum.\nWhat can I do for you?\nPlease type: shopping list, print, online store, history, or search."
};

function tryParseJSON<T>(jsonString: string): T | null {
  try {
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return null;
    }
    const obj = JSON.parse(jsonMatch[0]);
    return obj;
  } catch (e) {
    return null;
  }
}

export function ChatWindow() {
  const [mode, setMode] = useState<ChatMode>("inquiry");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const {
    isClient,
    activeSessionId,
    createNewSession,
    addMessageToSession,
    getActiveSession,
    updateSessionName,
    clearSessionMessages,
  } = useAppContext();

  const activeSession = getActiveSession();

  const { messages, setMessages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { mode },
    initialMessages: activeSession?.messages.length > 0 ? activeSession.messages : [welcomeMessage],
    id: activeSessionId ?? undefined,
    onFinish: (message) => {
      if (activeSessionId) {
        addMessageToSession(activeSessionId, { id: message.id, role: message.role, content: message.content });
        if (activeSession && activeSession.messages.length === 1 && activeSession.name === "New Chat") {
           const firstUserMessage = activeSession.messages.find(m => m.role === 'user');
           if (firstUserMessage && typeof firstUserMessage.content === 'string') {
             const newName = firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
             updateSessionName(activeSessionId, newName);
           }
        }
      }
      scrollToBottom();
    },
    onResponse: (response) => {
        if (!response.ok) {
            toast({
                variant: "destructive",
                title: "An error occurred",
                description: "Failed to get a response from the server. Please check your API key and try again."
            });
        }
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: err.message || "Failed to get a response. Please try again."
      });
    },
  });

  useEffect(() => {
    const activeSession = getActiveSession();
    setMessages(activeSession?.messages.length > 0 ? activeSession.messages : [welcomeMessage]);
  }, [activeSessionId, setMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!activeSessionId && isClient) {
      const sessions = JSON.parse(localStorage.getItem("chatSessions") || "[]");
      if (sessions.length === 0) {
        createNewSession();
      }
    }
  }, [isClient, activeSessionId, createNewSession]);
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !activeSessionId) return;

    const userMessage: ChatMessageType = { id: `user-${Date.now()}`, role: 'user', content: input };
    addMessageToSession(activeSessionId, userMessage);
    
    setMessages(prev => [...prev, userMessage]);
    
    handleSubmit(e);
  }

  const handleClearChat = () => {
    if (activeSessionId) {
      clearSessionMessages(activeSessionId);
      setMessages([welcomeMessage]);
      toast({
        description: "Chat history for this session has been cleared.",
      });
    }
  };


  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  const handleCopyMessage = (content: string | React.ReactNode) => {
    let contentToCopy = "";
    if (typeof content === 'string') {
      contentToCopy = content.replace(/<br\s*\/?>/gi, '\n');
    } else {
       toast({
          variant: "destructive",
          description: "Complex content cannot be copied.",
       });
       return;
    }
    navigator.clipboard.writeText(contentToCopy);
    toast({
      description: "Message copied to clipboard.",
    });
  };
  
  const displayedMessages = messages.map(msg => {
    let content: React.ReactNode = msg.content;
    let originalStringContent: string | null = null;
    
    if (typeof msg.content === 'string') {
      originalStringContent = msg.content;
    }

    if (msg.role === 'assistant' && typeof msg.content === 'string') {
      const recipeData = tryParseJSON<{ recipeName: string, instructions: string, ingredients: string[], ingredientLocations:string[] }>(msg.content);
      if (recipeData && recipeData.recipeName) {
        content = <RecipeCard recipe={recipeData as GenerateRecipeOutput} />;
      }
      
      const listData = tryParseJSON<{ shoppingListItems: Omit<ShoppingListItem, 'id' | 'checked'>[] }>(msg.content);
      if (listData && listData.shoppingListItems) {
        content = <ShoppingListCard listItems={listData.shoppingListItems} query={input} />;
      }
    }

    return { ...msg, content, originalStringContent };
  });

  return (
    <div className="flex h-screen flex-col">
       <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle History</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <ChatHistorySidebar />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold font-headline">
              {getActiveSession()?.name || 'Chat'}
            </h1>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" disabled={messages.length <= 1}>
                <Trash2 className="h-5 w-5" />
                <span className="sr-only">Clear Chat</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all messages in this conversation. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearChat}>Clear</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
       </header>
       <div className="flex-1 relative">
         <ScrollArea className="absolute inset-0" ref={scrollAreaRef}>
            <div className="p-4 md:p-6 max-w-3xl mx-auto">
                {displayedMessages.map((msg) => (
                  <div key={msg.id}>
                    <ChatMessage message={{id: msg.id, role: msg.role, content: msg.content}} />
                     {msg.role === 'assistant' && (
                        <div className="pl-12 -mt-2 mb-2">
                             <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleCopyMessage(msg.originalStringContent ?? '')}
                            >
                                <Copy className="h-4 w-4" />
                                <span className="sr-only">Copy message</span>
                            </Button>
                        </div>
                     )}
                  </div>
                ))}
                {isLoading && (
                    <ChatMessage key="loading" message={{ id: 'loading', role: 'assistant', content: <Loader className="animate-spin" /> }} />
                )}
            </div>
          </ScrollArea>
       </div>
      

      <div className="bg-background p-4 border-t">
        <div className="max-w-3xl mx-auto">
            <form onSubmit={handleFormSubmit} className="relative">
            <div className="relative">
                <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder={`Send a message...`}
                className="resize-none pr-24 pl-36 min-h-[48px]"
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleFormSubmit(e as any);
                    }
                }}
                disabled={isLoading || !isClient}
                rows={1}
                />
                <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <Select value={mode} onValueChange={(v) => setMode(v as ChatMode)} disabled={isLoading}>
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="inquiry"><Info className="inline-block mr-2 h-4 w-4"/>Inquiry</SelectItem>
                    <SelectItem value="recipe"><ChefHat className="inline-block mr-2 h-4 w-4"/>Recipe</SelectItem>
                    <SelectItem value="list"><ListTodo className="inline-block mr-2 h-4 w-4"/>List</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center">
                <Button type="button" size="icon" variant="ghost" disabled={isLoading}>
                    <Mic className="h-5 w-5" />
                </Button>
                <Button type="submit" size="icon" variant="ghost" disabled={!input.trim() || isLoading}>
                    <Send className="h-5 w-5" />
                </Button>
                </div>
            </div>
            </form>
        </div>
      </div>
    </div>
  );
}
