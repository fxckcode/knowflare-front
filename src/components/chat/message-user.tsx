'use client';

import { Message, MessageActions, MessageContent } from '@/components/ui/message';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Message as MessageAISDK } from 'ai';

interface MessageUserProps {
  message: MessageAISDK;
  handleCopy: (content: string, messageId: string) => void;
  copiedMessageId: string | null;
}

export const MessageUser = ({ message, handleCopy, copiedMessageId }: MessageUserProps) => {
  return (
    <Message
      key={message.id}
      className={cn(
        "group",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn("max-w-full flex-1 sm:max-w-[75%] space-y-2 flex flex-col")}>
        <MessageContent className="bg-secondary text-foreground px-[14px]">
          {message.content}
        </MessageContent>

        <MessageActions className={cn("self-end md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-full", message.role === "user" ? "justify-end hidden md:flex" : "justify-start")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCopy(message.content, message.id)}
          >
            {copiedMessageId === message.id ? <Check className="text-green-500" /> : <Copy />}
          </Button>
        </MessageActions>
      </div>
    </Message>
  );
};
