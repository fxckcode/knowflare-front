'use client';

import { ChangeEvent, ElementType, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Code,
  Palette,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { PromptTextarea } from '@/components/chat/prompt-textarea';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';

interface SuggestionButton {
  id: string;
  text: string;
  icon: ElementType;
  prompt: string;
}

const suggestionButtonsData: SuggestionButton[] = [
  { id: 'summary', text: 'Summary', prompt: 'Help me with this message. Summarize it.', icon: FileText },
  { id: 'code', text: 'Code', prompt: 'Code a custom hook for React.', icon: Code },
  { id: 'design', text: 'Design', prompt: 'Design a custom UI for a web app.', icon: Palette },
  { id: 'inspire', text: 'Get Inspired', prompt: 'Get inspired by the latest trends in AI.', icon: Sparkles },
  { id: 'learn', text: 'Learn Gently ', prompt: 'Learn how to', icon: GraduationCap }
];

export default function Home() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmitChat = () => {
    if (!inputValue.trim()) return;
    console.log('Submitting:', inputValue);
    router.push(`/chat?prompt=${inputValue}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitChat();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const buttonVariants = {
    hidden: { scale: 0, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100dvh-72px)] px-4 pb-[72px] w-full ">
      <div className="flex flex-col items-center gap-5 mb-10">
        <div className="rounded-xl bg-neutral-900 h-[45px] w-[45px]"></div>
        <h1 className="text-3xl text-gray-800 font-medium tracking-tight leading-[40px]">
          What&apos;s on your mind?
        </h1>
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center gap-4 max-w-chat !px-0 sm:px-4">
        <PromptTextarea
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmitChat}
          handleKeyDown={handleKeyDown}
          isLoading={false}
        />

        {/* Suggestion Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mt-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {suggestionButtonsData.map((buttonInfo) => {
            const IconComponent = buttonInfo.icon;
            return (
              <motion.div key={buttonInfo.id} variants={buttonVariants}>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full text-gray-600 border-gray-200 bg-white hover:bg-gray-50 text-xs h-10 px-3 flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
                  onClick={() => setInputValue(buttonInfo.prompt)}
                >
                  <IconComponent className="h-4 w-4" />
                  {buttonInfo.text}
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
} 