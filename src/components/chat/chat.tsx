import { useRef } from "react";
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message";
import { PromptTextarea } from "@/components/chat/prompt-textarea";
import { Markdown } from "../ui/markdown";
import { useChat } from '@ai-sdk/react';
import { ChatContainer } from "@/components/ui/chat-container";

export const Chat = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({});
  const autoScroll = true;
  const chatContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="w-full">
      <ChatContainer
        className="flex-1 space-y-4 p-4"
        autoScroll={autoScroll}
        ref={chatContainerRef}
      >
        {messages.map((message) => {
          const isAssistant = message.role === "assistant";

          return (
            <Message
              key={message.id}
              className={
                message.role === "user" ? "justify-end" : "justify-start"
              }
            >
              {isAssistant && (
                <MessageAvatar
                  src="/avatars/ai.png"
                  alt="AI Assistant"
                  fallback="AI"
                />
              )}
              <div className="max-w-[85%] flex-1 sm:max-w-[75%]">
                {isAssistant ? (
                  <div className="bg-secondary text-foreground prose rounded-lg p-2">
                    <Markdown>{message.content}</Markdown>
                  </div>
                ) : (
                  <MessageContent className="bg-primary text-primary-foreground">
                    {message.content}
                  </MessageContent>
                )}
              </div>
            </Message>
          );
        })}
      </ChatContainer>

      <PromptTextarea
        inputValue={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handleKeyDown={handleSubmit}
        isLoading={isLoading}
        // input={input}
      />
    </section>
  );
};
