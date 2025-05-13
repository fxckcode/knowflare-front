'use client';

import { Message, MessageActions } from '@/components/ui/message';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Message as MessageAISDK, ToolInvocation } from 'ai';
import { Markdown } from '../ui/markdown';
import { useState } from 'react';

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
            const prompt = toolInvocation.args.prompt;
            console.log(prompt);

            return (
              <div key={toolCallId} className="text-gray-500 mx-[14px] bg-muted rounded-md p-2">
                Calling {toolInvocation.toolName === 'showPromptInCanvas' && 'Show Prompt in Canvas'}...
              </div>
            );
          }
        })}

        {reasoningParts && reasoningParts.reasoning && (
          <div className="bg-transparent text-foreground px-[14px]">
            {reasoningParts.reasoning}
          </div>
        )}

        {toolInvocationParts && toolInvocationParts.length > 0 && (
          <div className="flex flex-col gap-2">
          </div>
        )}


        <Markdown className="bg-transparent text-foreground px-[14px] space-y-2.5 leading-[1lh]">
          {message.content}
        </Markdown>

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
