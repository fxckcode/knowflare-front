'use client'; 
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Code,
  Palette,
  BookOpen,
  Sparkles,
  Brain, 
    GraduationCap
} from 'lucide-react';
import { PromptTextarea } from '@/components/chat/prompt-textarea';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return; // Prevent submitting empty input
    console.log('Submitting:', inputValue);
    // Add your submission logic here
    setInputValue(''); // Clear input after submission (optional)
  };

  // Handle Enter key press in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline on Enter
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl mb-8 text-gray-800 font-medium tracking-tight leading-[10px]">
        What&apos;s on your mind?
      </h1>

      <div className="w-full max-w-2xl flex flex-col items-center gap-4 max-w-chat">
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
            <BookOpen className="h-4 w-4" />
            Research
          </Button>

          <Button variant="outline" size="lg" className="rounded-full text-gray-600 border-gray-200 bg-white hover:bg-gray-50 text-xs h-10 px-2 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            Get Inspired
          </Button>

          <Button variant="outline" size="lg" className="rounded-full text-gray-600 border-gray-200 bg-white hover:bg-gray-50 text-xs h-10 px-2 flex items-center gap-1.5">
            <Brain className="h-4 w-4" />
            Think Deeply
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