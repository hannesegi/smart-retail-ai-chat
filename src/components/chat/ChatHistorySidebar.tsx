
'use client';

import { useAppContext } from "@/contexts/AppContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, MessageSquare, Store, List, Settings } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cva } from "class-variance-authority";


export function ChatHistorySidebar() {
    const { 
        isClient, 
        chatSessions, 
        activeSessionId, 
        setActiveSessionId, 
        createNewSession, 
        deleteSession 
    } = useAppContext();
    const pathname = usePathname();

    if (!isClient) {
        return (
            <aside className="w-64 flex-col border-r bg-sidebar p-4 hidden md:flex">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                         <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Store className="h-5 w-5 text-primary" />
                        </div>
                        <h1 className="text-lg font-headline font-semibold">HEART v.1</h1>
                    </div>
                </div>
                <Button className="w-full justify-start gap-2" disabled>
                    <Plus className="h-4 w-4" />
                    New Chat
                </Button>
                <p className="mt-4 mb-2 text-xs font-semibold uppercase text-muted-foreground">
                    Chat History
                </p>
                <ScrollArea className="flex-1 mt-4">
                    <p className="text-sm text-center text-muted-foreground">Loading history...</p>
                </ScrollArea>
                 <div className="mt-auto flex flex-col gap-2">
                    <Link href="/dashboard/shopping-list" className={cn(buttonVariants({ variant: 'ghost', className: 'w-full justify-start' }))}>
                        <List className="mr-2 h-4 w-4" />
                        Shopping List
                    </Link>
                </div>
            </aside>
        )
    }

    return (
        <aside className="w-64 flex-col border-r bg-sidebar p-4 hidden md:flex">
            <div className="mb-4 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Store className="h-5 w-5 text-primary" />
                    </div>
                    <h1 className="text-lg font-headline font-semibold">HEART v.1</h1>
                </div>
            </div>

            <Button className="w-full justify-start gap-2" onClick={createNewSession}>
                <Plus className="h-4 w-4" />
                New Chat
            </Button>

            <p className="mt-4 mb-2 text-xs font-semibold uppercase text-muted-foreground">
                Chat History
            </p>
            <ScrollArea className="flex-1 -mx-2">
                <div className="px-2 space-y-1">
                {chatSessions.length > 0 ? chatSessions.map(session => (
                    <div key={session.id} className="group relative">
                        <Button
                            variant={activeSessionId === session.id ? 'secondary' : 'ghost'}
                            className="w-full justify-start h-auto py-2 px-3 text-left"
                            onClick={() => setActiveSessionId(session.id)}
                        >
                            <div className="flex flex-col overflow-hidden">
                                <span className="font-medium truncate">{session.name}</span>
                                <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}</span>
                            </div>
                        </Button>
                         <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100"
                            onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                )) : (
                    <p className="p-3 text-sm text-muted-foreground text-center">No chats yet.</p>
                )}
                </div>
            </ScrollArea>
             <div className="mt-auto flex flex-col gap-2">
                <nav className="flex flex-col gap-1">
                    <Link href="/dashboard" className={cn(buttonVariants({ variant: pathname === '/dashboard' ? 'secondary' : 'ghost', className: 'w-full justify-start' }))}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat
                    </Link>
                     <Link href="/dashboard/shopping-list" className={cn(buttonVariants({ variant: pathname === '/dashboard/shopping-list' ? 'secondary' : 'ghost', className: 'w-full justify-start' }))}>
                        <List className="mr-2 h-4 w-4" />
                        Shopping List
                    </Link>
                </nav>
            </div>
        </aside>
    );
}
