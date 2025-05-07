"use client";

import { PromptTextarea } from '@/components/chat/prompt-textarea';
import { useState, useRef } from 'react';
import { Message, MessageActions, MessageContent } from '@/components/ui/message';
import { ChatContainer } from '@/components/ui/chat-container';
import { Markdown } from '@/components/ui/markdown';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
const Page = () => {
const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({});
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="w-full max-w-chat flex flex-col items-stretch h-[calc(100vh-92px)]">
      <ChatContainer
        className="flex-1 space-y-4 p-4 no-scrollbar"
        autoScroll={true}
        ref={chatContainerRef}
      >
        {messages.map((message) => {
          const isAssistant = message.role === "assistant";

          return (
              <Message
                key={message.id}
                className={cn(
                  "group",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.parts.map(part => {
                  console.log(part);
                  
                  switch (part.type) {
                    case 'reasoning':
                      return (
                        <div className="max-w-[85%] flex-1 sm:max-w-[75%] space-y-2">
                          <Markdown className="message-content">
                            {part.reasoning}
                          </Markdown>
                        </div>
                      );
                    case 'text':
                      return (
                        <div className="max-w-[85%] flex-1 sm:max-w-[75%] space-y-2">
                          {isAssistant ? (
                            <div className="bg-transparent text-foreground prose rounded-lg p-2">
                              <Markdown className="message-content">
                                {part.text}
                              </Markdown>
                            </div>
                          ) : (
                            <MessageContent className="bg-secondary text-foreground px-[14px]">
                              {part.text}
                            </MessageContent>
                          )}
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
                                
                    {/* // <div className="max-w-[85%] flex-1 sm:max-w-[75%] space-y-2">
                    //   {isAssistant ? (
                    //     <div className="bg-transparent text-foreground prose rounded-lg p-2">
                    //       <Markdown className="message-content">
                    //         {message.text}
                    //       </Markdown>
                    //     </div>
                    //   ) : (
                    //     <MessageContent className="bg-secondary text-foreground px-[14px]">
                    //       {message.text}
                    //     </MessageContent>
                    //   )}

                    //   <MessageActions className="self-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    //     <Button variant="ghost" size="icon" onClick={() => handleCopy(message.content)}>
                    //       {isCopied ? <Check /> : <Copy />} 
                    //     </Button>
                    //   </MessageActions>
                    // </div> */}
              </Message>
          );
        })}
      </ChatContainer>

      <PromptTextarea
        inputValue={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handleKeyDown={handleKeyDown}
        isLoading={isLoading}
      />
    </section>
  );
};

export default Page;