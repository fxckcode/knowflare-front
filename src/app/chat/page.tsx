"use client";

import { PromptTextarea } from '@/components/chat/prompt-textarea';
import { useState, useRef } from 'react';
import { Message, MessageActions, MessageAvatar, MessageContent } from '@/components/ui/message';
import { ChatContainer } from '@/components/ui/chat-container';
import { Markdown } from '@/components/ui/markdown';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import { streamText, UIMessage } from 'ai';
import { useTextStream } from "@/components/prompt-kit/response-stream"
import { ResponseStream } from '@/components/ui/response-stream';
import { ReasoningContent, ReasoningResponse, ReasoningTrigger } from '@/components/ui/reasoning';
import { Reasoning } from '@/components/ui/reasoning';

const Page = () => {
  const [autoScroll, setAutoScroll] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({});
  const chatContainerRef = useRef<HTMLDivElement>(null);

      // const handleInputChange = (value: string) => {
      //   setInputValue(value);
      // };

      // const handleSubmit = () => {
      //   setIsStreaming(true);
      //   setIsLoading(true);
      //   setInputValue('');
      //   addDummyMessage();
      // };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // const addDummyMessage = () => {
  //   setMessages((prevMessages) => [
  //     ...prevMessages,
  //     { id: Date.now().toString(), role: 'assistant', content: 'This is a dummy message' }
  //   ]);
  // };

  return (
    <section className="w-full max-w-chat flex flex-col items-stretch h-[calc(100vh-82px)]">
      <ChatContainer
        className="flex-1 space-y-4 p-4 no-scrollbar"
        autoScroll={autoScroll}
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
                <div className="max-w-[85%] flex-1 sm:max-w-[75%] space-y-2">
                  {isAssistant ? (
                  <div className="bg-transparent text-foreground prose rounded-lg p-2">
                      <Markdown className="message-content">
                        {message.content}
                      </Markdown>
                    </div>
                  ) : (
                    <MessageContent className="bg-secondary text-foreground px-[14px]">
                      {message.content}
                    </MessageContent>
                  )}

                  <MessageActions className="self-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button variant="ghost" size="icon">
                      <Copy /> 
                    </Button>
                  </MessageActions>
                </div>
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