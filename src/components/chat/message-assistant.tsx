'use client';

import { Message, MessageActions } from '@/components/ui/message';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Message as MessageAISDK } from 'ai';
import { Markdown } from '../ui/markdown';

interface MessageAssistantProps {
  message: MessageAISDK;
  handleCopy: (content: string, messageId: string) => void;
  copiedMessageId: string | null;
  parts: MessageAISDK["parts"];
}

export const MessageAssistant = ({
  message,
  handleCopy,
  copiedMessageId,
  parts
}: MessageAssistantProps) => {
  const toolInvocationParts = parts?.filter(
    (part) => part.type === "tool-invocation"
  );

  const reasoningParts = parts?.find((part) => part.type === "reasoning");

  return (
    <Message
      key={message.id}
      className="group justify-start"
    >
      <div className="max-w-full flex-1 sm:max-w-[75%] space-y-2 flex flex-col">
        {reasoningParts && reasoningParts.reasoning && (
          <div className="bg-transparent text-foreground px-[14px]">
            {reasoningParts.reasoning}
          </div>
        )}

        {toolInvocationParts && toolInvocationParts.length > 0 && (
          <div className="flex flex-col gap-2">
          </div>
        )}

        <Markdown className="bg-transparent text-foreground px-[14px]">
          {message.content}
        </Markdown>

        <MessageActions className="self-end md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-full justify-start">
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
