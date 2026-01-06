"use client";

import type { ShoppingListItem, ChatSession, ChatMessage } from "@/lib/types";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AppContextType {
  shoppingList: ShoppingListItem[];
  addToShoppingList: (items: Omit<ShoppingListItem, "id" | "checked">[]) => void;
  toggleShoppingListItem: (id: string) => void;
  clearShoppingList: () => void;
  isClient: boolean;
  
  // Chat History Management
  chatSessions: ChatSession[];
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  createNewSession: () => void;
  deleteSession: (id: string) => void;
  addMessageToSession: (sessionId: string, message: ChatMessage) => void;
  getActiveSession: () => ChatSession | undefined;
  updateSessionName: (sessionId: string, name: string) => void;
  clearSessionMessages: (sessionId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Hydrate state from localStorage
  useEffect(() => {
    setIsClient(true);
    try {
      const storedList = localStorage.getItem("shoppingList");
      if (storedList) {
        setShoppingList(JSON.parse(storedList));
      }
      const storedSessions = localStorage.getItem("chatSessions");
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions) as ChatSession[];
        setChatSessions(parsedSessions);
        if (parsedSessions.length > 0 && !activeSessionId) {
          // Set the most recent session as active on initial load
          setActiveSessionId(parsedSessions[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, [activeSessionId]);

  // Persist state to localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
      localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
    }
  }, [shoppingList, chatSessions, isClient]);

  const addToShoppingList = (items: Omit<ShoppingListItem, "id" | "checked">[]) => {
    const newItems: ShoppingListItem[] = items.map((item) => ({
      ...item,
      id: `${item.productName}-${Date.now()}`,
      checked: false,
    }));
    setShoppingList((prevList) => [...prevList, ...newItems]);
  };

  const toggleShoppingListItem = (id: string) => {
    setShoppingList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const clearShoppingList = () => {
    setShoppingList([]);
  };

  // --- Chat Session Management ---

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      name: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setChatSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };
  
  const deleteSession = (id: string) => {
    const remainingSessions = chatSessions.filter(s => s.id !== id);
    setChatSessions(remainingSessions);

    if (activeSessionId === id) {
      setActiveSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
    }
  };

  const addMessageToSession = (sessionId: string, message: ChatMessage) => {
    setChatSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, messages: [...session.messages, message] }
          : session
      )
    );
  };
  
  const clearSessionMessages = (sessionId: string) => {
    setChatSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, messages: [] }
          : session
      )
    );
  };

  const getActiveSession = () => {
    return chatSessions.find(session => session.id === activeSessionId);
  };

  const updateSessionName = (sessionId: string, name: string) => {
    setChatSessions(prev =>
      prev.map(session =>
        session.id === sessionId ? { ...session, name } : session
      )
    );
  }

  const value = {
    shoppingList,
    addToShoppingList,
    toggleShoppingListItem,
    clearShoppingList,
    isClient,
    chatSessions,
    activeSessionId,
    setActiveSessionId,
    createNewSession,
    deleteSession,
    addMessageToSession,
    getActiveSession,
    updateSessionName,
    clearSessionMessages,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
