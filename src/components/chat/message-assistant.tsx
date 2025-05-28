'use client';

import { Message, MessageActions } from '@/components/ui/message';
import { Check, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Message as MessageAISDK } from 'ai';
import { Markdown } from '../ui/markdown';
import { useState } from 'react';
import { Source } from '../extras/icons';
import { TextShimmer } from '../ui/text-shimmer';

type FileUIPart = {
  type: 'file';
  mimeType: string;
  data: string;
};

interface MessageAssistantProps {
  message: MessageAISDK;
  parts: MessageAISDK["parts"];
  onReload: () => void;
}

export const MessageAssistant = ({
  message,
  parts,
  onReload
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

  const fileParts: FileUIPart | undefined = parts?.find((part) => part.type === "file");

  return (
    <Message
      key={message.id}
      className="group justify-start"
    >
      <div className="max-w-full flex-1 sm:max-w-[75%] space-y-2 flex flex-col">
        {reasoningParts && reasoningParts.reasoning && (
          <div className="bg-transparent text-foreground">
            {reasoningParts.reasoning}
          </div>
        )}

        {message.content && (
          <Markdown className="message-content">
            {message.content}
          </Markdown>
        )}

        {fileParts && (
          <div className="flex flex-col gap-2">
            <img src={`data:${fileParts.mimeType};base64,${fileParts.data}`} alt={fileParts.mimeType} />
          </div>
        )}

        {toolInvocationParts && toolInvocationParts.length > 0 && (
          <div className="flex flex-col gap-2">
            {toolInvocationParts.map((toolInvocation) => {
              const callId = toolInvocation.toolInvocation.toolCallId;
              
              switch (toolInvocation.toolInvocation.toolName) {
                case 'generateImageTool': {
                  switch (toolInvocation.toolInvocation.state) {
                    case 'call':  
                      return (
                        <p>
                          Thinking...
                        </p>
                      );

                    case 'result': {
                      return (
                        <p>asdasd</p>
                      );
                    }
                  }
                  break;
                }
              }
            })}
          </div>
        )}

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
