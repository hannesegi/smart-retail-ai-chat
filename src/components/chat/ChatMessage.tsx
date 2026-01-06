import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { UserCircle, Bot, Copy } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../ui/button";

type ChatMessageProps = {
  message: ChatMessageType;
  children?: ReactNode;
};

export function ChatMessage({ message, children }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "group/message flex items-start gap-4 py-4",
      )}
    >
      {isUser ? (
         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <UserCircle className="h-5 w-5" />
        </div>
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="h-5 w-5" />
        </div>
      )}
      
      <div className="flex-1 max-w-full">
        <div className="font-semibold pb-1">{isUser ? "You" : "HEART v.1"}</div>
        <div
          className={cn(
            "max-w-xl prose prose-sm prose-invert dark:prose-invert",
          )}
        >
          {typeof message.content === "string" ? (
            <div
              dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }}
            />
          ) : (
            message.content
          )}
        </div>
        {children}
      </div>

    </div>
  );
}
