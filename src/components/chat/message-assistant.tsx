'use client';

import { Message, MessageActions } from '@/components/ui/message';
import { Check, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Message as MessageAISDK } from 'ai';
import { Markdown } from '../ui/markdown';
import { useState } from 'react';
import { Source } from '../extras/icons';
import { base64ToImage } from '@/lib/utils';
import { TextShimmer } from '../ui/text-shimmer';

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

        {toolInvocationParts && toolInvocationParts.length > 0 && (
          <div className="flex flex-col gap-2">
            {toolInvocationParts.map((toolInvocation) => {
              const callId = toolInvocation.toolInvocation.toolCallId;

              switch (toolInvocation.toolInvocation.toolName) {
                case 'generateImageTool': {
                  switch (toolInvocation.toolInvocation.state) {
                    case 'call': 
                      return (
                        <TextShimmer key={toolInvocation.toolInvocation.toolCallId} className="font-mono text-sm" duration={3}>
                          Thinking...
                        </TextShimmer>
                      );

                    case 'result': {
                      return (
                        <>
                          {toolInvocation.toolInvocation.result?.status === 500 ? (
                            <>
                              <div key={callId} className="text-red-800 font-normal bg-red-100 rounded-md p-2 flex items-center gap-2">
                                <span>Error generating image</span>
                                <button 
                                  onClick={onReload}
                                  className="text-red-800 font-semibold bg-red-100 underline cursor-pointer"
                                >
                                  Try again
                                </button>
                              </div>
                            </>
                          ) : (
                            <div key={callId} className="aspect-square md:max-w-[50%] rounded-md overflow-hidden relative">
                              <button 
                                className="cursor-pointer absolute top-2 right-2 z-10 bg-white/20 backdrop-blur-2xl p-2 rounded-md text-white transition-all duration-200 active:scale-95"
                                onClick={() => {
                                  const imageElement = document.getElementById(`${callId}-image`) as HTMLImageElement;
                                  if (imageElement) {
                                    const a = document.createElement('a');
                                    a.href = imageElement.src;
                                    a.download = `${toolInvocation.toolInvocation.args.prompt.toLowerCase().replace(/ /g, '-')}-${new Date().toISOString()}.png`;
                                    a.click();
                                  }
                                }}
                              >
                                <Download className="size-4" />
                              </button>
                              <img
                                id={`${callId}-image`} 
                                src={base64ToImage((toolInvocation.toolInvocation.result as { base64Data: string }).base64Data)} 
                                alt="Generated Image" 
                                className="w-full h-auto object-cover"
                              />
                            </div>
                          )}
                        </>
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
