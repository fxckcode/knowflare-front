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
  { id: 'learn', text: 'Learn Gently ', prompt: 'Learn how to cook a delicious meal.', icon: GraduationCap }
];

export default function Home() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [isSearchGrounding, setIsSearchGrounding] = useState(false);
  const [files, setFiles] = useState<FileList | undefined>(undefined);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmitChat = () => {
    if (!inputValue.trim()) return;
    router.push(`/chat?prompt=${inputValue}${isSearchGrounding ? '&search=true' : ''}`);
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
        <div className="rounded-xl h-[45px] w-[45px] animated-green-orb"></div>
        <h1 className="text-3xl text-gray-800 font-medium tracking-tight leading-[40px]">
          ¿Qué vamos a aprender hoy?
        </h1>
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center gap-4 max-w-chat !px-0 sm:px-4">
        <PromptTextarea
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmitChat}
          isLoading={false}
          setIsSearchGrounding={setIsSearchGrounding}
          isSearchGrounding={isSearchGrounding}
          files={files}
          setFiles={setFiles}
        />
      </div>
    </div>
  );
} 