"use client";

import { PromptTextarea } from '@/components/chat/prompt-textarea';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ChatContainer } from '@/components/ui/chat-container';
import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { Models } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageAssistant } from './message-assistant';
import { MessageUser } from './message-user';
import { systemPrompts } from '@/ai/prompts';
import { useAgent } from '@/stores/use-agent';
import { agents } from '@/lib/agents';

export const Chat = () => {

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [isArtifactPanelOpen, setIsArtifactPanelOpen] = useState(false);
  const { setAgent } = useAgent();
  const [agentPrompt, setAgentPrompt] = useState<string | null>(null);

  const handleSelectAgent = (agentName: string) => {
    if (!agentName) return;

    const selectedAgent = agents.filter(agent => agent.agentName === agentName);
    setAgent(selectedAgent[0] || null);
    setAgentPrompt(systemPrompts[agentName as keyof typeof systemPrompts]);
  };

  const { messages, input, handleInputChange, handleSubmit, status, append } = useChat({
    body: {
      model: globalThis?.localStorage?.getItem("model") || Models.GEMINI_2_5_FLASH_PREVIEW_04_17,
      agent: agentPrompt
    }
  });

  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (!prompt) return;

    const isMessageExists = messages.some(message => message.content === prompt);

    if (!isMessageExists) {
      append({ role: "user", content: prompt });
    }
  }, [searchParams]);

  useEffect(() => {
    const agentName = searchParams.get("agent");
    if (agentName) {
      handleSelectAgent(agentName);
    }
  }, [searchParams]);

  const handleCopy = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 1300);
  };

  const toggleArtifactPanel = () => {
    setIsArtifactPanelOpen(prev => !prev);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const chatVariants = {
    open: { width: "40%", padding: "0 16px" },
    closed: { width: "100%" }
  };

  const panelVariants = {
    hidden: { opacity: 0, width: "0%" },
    visible: { opacity: 1, width: "60%" }
  };

  const panelTransition = {
    type: "spring",
    stiffness: 120,
    damping: 20,
    duration: 0.5
  };

  return (
    <div className="flex w-full h-[calc(100vh-72px)] overflow-hidden">
      <motion.section
        className="flex flex-col items-stretch h-full relative"
        variants={chatVariants}
        initial="closed"
        animate={isArtifactPanelOpen ? "open" : "closed"}
        transition={panelTransition}
      >
        <div className="w-full max-w-chat mx-auto flex flex-col flex-1 h-full pb-[16px]">
          <ChatContainer
            className="flex-1 space-y-4 px-2 md:p-4 no-scrollbar"
            autoScroll={true}
            ref={chatContainerRef}
          >
            {messages.map((message) => {
              const isAssistant = message.role === "assistant";
              console.log('MESSAGE', message);

              if (isAssistant) {
                return (
                  <MessageAssistant
                    key={message.id}
                    message={message}
                    handleCopy={handleCopy}
                    copiedMessageId={copiedMessageId}
                    parts={message.parts}
                  />
                );
              }

              return (
                <MessageUser
                  key={message.id}
                  message={message}
                  handleCopy={handleCopy}
                  copiedMessageId={copiedMessageId}
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

          <PromptTextarea
            inputValue={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleKeyDown={handleKeyDown}
            isLoading={status === 'submitted' || status === 'streaming'}
          />
        </div>
        <Button
          onClick={toggleArtifactPanel}
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 z-20 bg-background/80 hover:bg-background/100 backdrop-blur-sm"
        >
          {isArtifactPanelOpen ? "Hide Artifacts" : "Show Artifacts"}
        </Button>
      </motion.section>

      <AnimatePresence>
        {isArtifactPanelOpen && (
          <motion.aside
            className="h-full bg-muted/30 dark:bg-muted/50 backdrop-blur-md border-l border-border/80 shadow-xl"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={panelTransition}
          >
            <div className="p-4 h-full flex flex-col">
              <span dangerouslySetInnerHTML={{
                __html: `
                # Artifacts

                This panel can display code snippets, visualizations, documents, and other interactive elements related to the chat conversation.

                ## Code Snippets

                ## Visualizations
              `}} />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};
