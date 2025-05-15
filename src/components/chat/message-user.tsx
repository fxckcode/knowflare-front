'use client';

import { Message, MessageActions, MessageContent } from '@/components/ui/message';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Message as MessageAISDK } from 'ai';
import { useState } from 'react';

interface MessageUserProps {
  message: MessageAISDK;
}

export const MessageUser = ({ message }: MessageUserProps) => {
  const [copyMessage, setCopyMessage] = useState<string | null>(null);  

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopyMessage(content);

    setTimeout(() => {
      setCopyMessage(null);
    }, 2000);
  };

  return (
    <Message
      key={message.id}
      className={cn(
        "group",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn("max-w-full flex-1 sm:max-w-[75%] space-y-2 flex flex-col")}>
        <MessageContent className="bg-gray-100/60 text-foreground px-[14px]">
          {message.content}
        </MessageContent>

        <MessageActions className={cn("self-end md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-full", message.role === "user" ? "justify-end hidden md:flex" : "justify-start")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCopy(message.content)}
          >
            {copyMessage === message.content ? <Check className="text-green-500" /> : <Copy />}
          </Button>
        </MessageActions>
      </div>
    </Message>
  );
};
