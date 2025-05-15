"use client";

import { TextShimmer } from "@/components/ui/text-shimmer";
import { ChatContainer } from "@/components/ui/chat-container";
import { MessageUser } from "./message-user";
import { MessageAssistant } from "./message-assistant";
import { Message } from "ai";
import { useRef } from "react";

interface ConversationProps {
  messages: Message[];
  status: 'submitted' | 'streaming' | 'ready' | 'error';
};

export const Conversation = ({ messages, status }: ConversationProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  return (
    <ChatContainer
      className="flex-1 space-y-4 sm:px-2 md:p-4 no-scrollbar"
      autoScroll={true}
      ref={chatContainerRef}
    >
      {messages.map((message) => {
        const isAssistant = message.role === "assistant";

        if (isAssistant) {
          return (
            <MessageAssistant
              key={message.id}
              message={message}
              parts={message.parts}
            />
          );
        }

        return (
          <MessageUser
            key={message.id}
            message={message}
          />
        );
      })}

      {status === "submitted" && messages.length > 0 && (
        <div className="group min-h-scroll-anchor flex w-full max-w-3xl flex-col items-start gap-2 px-2 pb-2 mx-auto">
          <TextShimmer className="font-mono text-sm" duration={3}>
            Thinking...
          </TextShimmer>
        </div>
      )}
    </ChatContainer>
  );
};