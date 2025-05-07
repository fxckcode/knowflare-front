'use client'; 
import React, { ChangeEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Code,
  Palette,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { PromptTextarea } from '@/components/chat/prompt-textarea';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return; 
    console.log('Submitting:', inputValue);
    setInputValue(''); 
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 font-[family-name:var(--font-geist-sans)] pb-[72px] w-full h-full">
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
          handleSubmit={handleSubmit}
          handleKeyDown={handleKeyDown}
          isLoading={isLoading}
        />

        {/* Suggestion Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <Button variant="outline" size="lg" className="rounded-full text-gray-600 border-gray-200 bg-white hover:bg-gray-50 text-xs h-10 px-2 flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            Summary
          </Button>
          
          <Button variant="outline" size="lg" className="rounded-full text-gray-600 border-gray-200 bg-white hover:bg-gray-50 text-xs h-10 px-2 flex items-center gap-1.5">
            <Code className="h-4 w-4" />
            Code
          </Button>
          
          <Button variant="outline" size="lg" className="rounded-full text-gray-600 border-gray-200 bg-white hover:bg-gray-50 text-xs h-10 px-2 flex items-center gap-1.5">
            <Palette className="h-4 w-4" />
            Design
          </Button>

          <Button variant="outline" size="lg" className="rounded-full text-gray-600 border-gray-200 bg-white hover:bg-gray-50 text-xs h-10 px-2 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            Get Inspired
          </Button>

          <Button variant="outline" size="lg" className="rounded-full text-gray-600 border-gray-200 bg-white hover:bg-gray-50 text-xs h-10 px-2 flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4" />
            Learn Gently
          </Button>
        </div>
      </div>
    </div>
  );
} 