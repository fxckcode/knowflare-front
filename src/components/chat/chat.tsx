"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { useSearchParams } from 'next/navigation';
import { Agent, Models } from '@/lib/types';
import { useAgent } from '@/stores/use-agent';
import { agents } from '@/ai/agents';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from './canvas';
import { useFileStore } from '@/stores/use-file';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Suggestions } from './Suggestions';
import { Welcome } from './Welcome';
import { ChatContainer } from '../ui/chat-container';

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
  const { files: filesFromHome } = useFileStore();
  const [files, setFiles] = useState<FileList | undefined>(filesFromHome || undefined);
  const [suggestions, setSuggestions] = useState<Agent['suggestions']>([]);

  const handleSelectAgent = (agentName: string) => {
    if (!agentName) return;

    const selectedAgent = agents.filter(agent => agent.agentName === agentName);
    const agent = selectedAgent[0];

    if (agent.userSearch) setIsSearchGrounding(true);

    setSuggestions(agent.suggestions);
    setAgent(agent || null);
    setAgentPrompt(agent || null);
  };

  const {
    messages,
    setMessages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    status,
    isLoading,
    append,
    stop,
    error,
    reload
  } = useChat({
    maxSteps: 1,
    body: {
      model: globalThis?.localStorage?.getItem("model") || Models.GEMINI_2_5_FLASH_PREVIEW_04_17,
      agentName: agentPrompt?.agentName || null,
      isSearchGrounding
    },
    onError: (error) => {
      console.error('Error in chat:', error);
    },
    onToolCall({ toolCall }) {
      if (toolCall.toolName === 'showPromptInCanvas') {
        setIsArtifactPanelOpen(true);
        setArtifactValue((toolCall.args as { prompt: string }).prompt);
      }
    }
  });

  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (!prompt) return;
    const isMessageExists = messages.some(message => message.content === prompt);

    if (!isMessageExists) {
      append({
        role: "user",
        content: prompt
      });
    }
  }, [searchParams]);

  useEffect(() => {
    const agentName = searchParams.get("agent");
    document.title = agentName ? `KnowFlare - Talking with ${agentName}` : 'KnowFlare - Chat';

  }, [document.title, searchParams]);

  useEffect(() => {
    const agentName = searchParams.get("agent");
    const useSearch = searchParams.get("search");

    if (agentName) {
      handleSelectAgent(agentName);
    }

    if (useSearch) {
      setIsSearchGrounding(true);
    }
  }, [searchParams]);

  const toggleArtifactPanel = () => {
    setIsArtifactPanelOpen(prev => !prev);
  };

  const handleEdit = useCallback((id: string, newText: string) => {
    setMessages(
      messages.map((message) =>
        message.id === id ? { ...message, content: newText } : message
      )
    );
  },
    [messages, setMessages]);

  const handleDelete = useCallback(
    (id: string) => {
      setMessages(messages.filter((message) => message.id !== id));
    },
    [messages, setMessages]
  );

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom, scrollToBottom]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const atBottom = scrollHeight - scrollTop <= clientHeight + 10;
      setIsAtBottom(atBottom);
    }
  };

  const chatVariants = {
    open: { width: isMobile ? "0%" : "40%", opacity: isMobile ? 0 : 1 },
    closed: { width: "100%", opacity: 1 }
  };

  const panelTransition = { type: "spring", stiffness: 120, damping: 20, duration: 0.5 };

  return (
    <div className="flex w-full h-[calc(100dvh-72px)] overflow-hidden bg-background">
      <motion.section
        className="flex flex-col h-full relative"
        variants={chatVariants}
        initial="closed"
        animate={isArtifactPanelOpen ? "open" : "closed"}
        transition={panelTransition}
      >
        <div className="flex-1 flex flex-col overflow-hidden">
            <ChatContainer
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 space-y-4 p-4 scroll-smooth"
            >
                {messages.length === 0 ? (
                    <Welcome />
                ) : (
                    messages.map(m => (
                        <MessageBubble
                            key={m.id}
                            message={m}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onReload={reload}
                            onShowCanvas={setIsArtifactPanelOpen}
                        />
                    ))
                )}
                 {isLoading && (
                    <MessageBubble
                        message={{ id: 'thinking', role: 'assistant', content: 'Thinking...' }}
                    />
                )}
            </ChatContainer>

            <div className="w-full max-w-2xl mx-auto px-4 pb-4">
                 {messages.length === 0 && (
                    <Suggestions suggestions={suggestions} onSuggestionClick={setInput} />
                 )}
                <ChatInput
                    inputValue={input}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    stop={stop}
                    files={files}
                    setFiles={setFiles}
                />
            </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {isArtifactPanelOpen && (
          <Canvas
            artifactValue={artifactValue || ''}
            toggleArtifactPanel={toggleArtifactPanel}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
