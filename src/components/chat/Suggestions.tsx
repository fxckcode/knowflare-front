'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Suggestion {
  suggestion: string;
  prompt: string;
}

interface SuggestionsProps {
  suggestions: Suggestion[];
  onSuggestionClick: (prompt: string) => void;
}

export const Suggestions = ({ suggestions, onSuggestionClick }: SuggestionsProps) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap items-center justify-center gap-2 px-4 pb-4"
    >
      {suggestions.map((suggestion, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Button
            variant="outline"
            className="rounded-full cursor-pointer bg-background/50 backdrop-blur-sm"
            onClick={() => onSuggestionClick(suggestion.prompt)}
          >
            {suggestion.suggestion}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};
