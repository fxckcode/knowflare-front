'use client';

import { Message, MessageActions } from '@/components/ui/message';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Message as MessageAISDK, ToolInvocation } from 'ai';
import { Markdown } from '../ui/markdown';
import { useState } from 'react';
import { Source } from '../extras/icons';

interface MessageAssistantProps {
  message: MessageAISDK;
  parts: MessageAISDK["parts"];
}

export const MessageAssistant = ({
  message,
  parts
}: MessageAssistantProps) => {
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopyMessage(content);

    setTimeout(() => {
      setCopyMessage(null);
    }, 2000);
  };

  const toolInvocationParts = parts?.filter(
    (part) => part.type === "tool-invocation"
  );

  const sourceParts = parts?.filter(
    (part) => part.type === "source"
  );

  const reasoningParts = parts?.find((part) => part.type === "reasoning");  

  return (
    <Message
      key={message.id}
      className="group justify-start"
    >
      <div className="max-w-full flex-1 sm:max-w-[75%] space-y-2 flex flex-col">
        {message.toolInvocations?.map((toolInvocation: ToolInvocation) => {
          const toolCallId = toolInvocation.toolCallId;
          if (toolInvocation.toolName === 'showPromptInCanvas') {
            return (
              <div key={toolCallId} className="text-gray-500 bg-muted rounded-md p-2">
                Calling {toolInvocation.toolName === 'showPromptInCanvas' && 'Show Prompt in Canvas'}...
              </div>
            );
          }
        })}

        {reasoningParts && reasoningParts.reasoning && (
          <div className="bg-transparent text-foreground">
            {reasoningParts.reasoning}
          </div>
        )}

        {toolInvocationParts && toolInvocationParts.length > 0 && (
          <div className="flex flex-col gap-2">
          </div>
        )}

        <Markdown className="message-content">
          {message.content}
        </Markdown>

        {sourceParts && sourceParts.length > 0 && (
          <div className="flex flex-wrap gap-1 w-full mt-2">
            {sourceParts.map((source) => (
              <div key={source.source.id} className="text-brand-green font-semibold bg-brand-green/10 rounded-full py-2 px-4 text-sm flex items-center gap-2">
                <a href={source.source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Source className="size-4" />
                  <p className="text-sm">{source.source.title}</p>
                </a>
              </div>
            ))}
          </div>
        )}

        <MessageActions className="self-end md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-full justify-start">
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
