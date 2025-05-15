"use client";

import { PromptTextarea } from '@/components/chat/prompt-textarea';
import { useState, useEffect, KeyboardEvent } from 'react';
import { useChat } from '@ai-sdk/react';
import { useSearchParams } from 'next/navigation';
import { Agent, Models } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgent } from '@/stores/use-agent';
import { agents } from '@/ai/agents';
import { Conversation } from './conversation';
import { X } from 'lucide-react';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatches = () => setMatches(media.matches);

    updateMatches();
    media.addEventListener('change', updateMatches);
    return () => media.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
}

export const Chat = () => {
  const searchParams = useSearchParams();
  const [isArtifactPanelOpen, setIsArtifactPanelOpen] = useState(false);
  const [artifactValue, setArtifactValue] = useState<string | null>(null);
  const { setAgent } = useAgent();
  const [agentPrompt, setAgentPrompt] = useState<Agent | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isSearchGrounding, setIsSearchGrounding] = useState(false);

  const handleSelectAgent = (agentName: string) => {
    if (!agentName) return;

    const selectedAgent = agents.filter(agent => agent.agentName === agentName);
    setAgent(selectedAgent[0] || null);
    setAgentPrompt(selectedAgent[0] || null);
  };

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    append,
    stop
  } = useChat({
    body: {
      model: globalThis?.localStorage?.getItem("model") || Models.GEMINI_2_5_FLASH_PREVIEW_04_17,
      agentName: agentPrompt?.agentName || null,
      isSearchGrounding
    },
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === 'showPromptInCanvas') {
        setIsArtifactPanelOpen(true);
        setArtifactValue((toolCall.args as unknown as { prompt: string }).prompt);
      }
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
    const useSearch = searchParams.get("useSearch");

    if (agentName) {
      handleSelectAgent(agentName);
    }

    if (useSearch) {
      setIsSearchGrounding(true);
    }
  }, [searchParams]);

  useEffect(() => {
    console.log("messages", messages);
  }, [messages]);

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
    open: {
      width: isMobile ? "0%" : "40%",
      padding: isMobile ? "0px" : "0 16px",
      opacity: isMobile ? 0 : 1,
      transition: { duration: isMobile ? 0.3 : 0.5, delay: isMobile && isArtifactPanelOpen ? 0 : 0.2 }
    },
    closed: {
      width: "100%",
      padding: "0 16px", // Assuming original padding when closed
      opacity: 1,
      transition: { duration: 0.5, delay: isMobile && !isArtifactPanelOpen ? 0.2 : 0 }
    }
  };

  const panelVariants = {
    hidden: {
      opacity: 0,
      width: "0%",
      padding: "0px",
      transition: { duration: 0.3 }
    },
    visible: {
      opacity: 1,
      width: isMobile ? "100%" : "60%",
      padding: "16px", // Default padding, adjust as needed. Was px-4 pt-9 pb-4
      transition: { duration: 0.5, delay: 0.2 }
    }
  };

  const panelTransition = {
    type: "spring",
    stiffness: 120,
    damping: 20,
    duration: 0.5
  };

  return (
    <div className="flex w-full h-[calc(100dvh-72px)] overflow-hidden">
      <motion.section
        className="flex flex-col items-stretch h-full relative"
        variants={chatVariants}
        initial="closed"
        animate={isArtifactPanelOpen ? "open" : "closed"}
        transition={panelTransition}
      >
        <div className="w-full max-w-chat mx-auto flex flex-col flex-1 h-full pb-[16px] overflow-hidden">
          <Conversation
            messages={messages}
            status={status}
          />

          <PromptTextarea
            inputValue={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleKeyDown={handleKeyDown}
            isLoading={status === 'submitted' || status === 'streaming'}
            stop={stop}
            setIsSearchGrounding={setIsSearchGrounding}
            isSearchGrounding={isSearchGrounding}
          />
        </div>
      </motion.section>

      <AnimatePresence>
        {isArtifactPanelOpen && (
          <motion.aside
            className="h-full bg-white backdrop-blur-md border-l border-border/80 shadow-xl"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={panelTransition}
          >
            <button onClick={toggleArtifactPanel} className="absolute top-3 left-4 md:left-7 z-20 cursor-pointer p-1 rounded-full hover:bg-muted">
              <X />
            </button>
            <div className="p-4 h-full flex flex-col overflow-y-scroll">
              <p>{artifactValue || ''}</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};
