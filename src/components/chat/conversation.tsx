"use client";

import { TextShimmer } from "@/components/ui/text-shimmer";
import { ChatContainer } from "@/components/ui/chat-container";
import { MessageUser } from "./message-user";
import { MessageAssistant } from "./message-assistant";
import { Message } from "ai";
import { useRef } from "react";

interface ConversationProps {
  messages: Message[];
};

export const Conversation = ({ messages }: ConversationProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  return (
    <ChatContainer
      className="flex-1 space-y-4 px-2 md:p-4 no-scrollbar"
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
      {status === "submitted" &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && (
          <div className="group min-h-scroll-anchor flex w-full max-w-3xl flex-col items-start gap-2 px-6 pb-2 mx-auto">
            <TextShimmer className="font-mono text-sm" duration={1}>
              Thinking...
            </TextShimmer>
          </div>
        )}
    </ChatContainer>
  );
};