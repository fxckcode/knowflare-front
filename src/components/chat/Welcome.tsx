'use client';

import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export const Welcome = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center"
    >
      <div className="p-4 bg-primary/10 rounded-full mb-4">
        <Bot className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">Welcome to the Business Agent</h1>
      <p className="text-muted-foreground mt-2 max-w-md">
        You can ask me anything about our internal documentation, processes, or project details.
        Start by typing a question below or try one of the suggestions.
      </p>
    </motion.div>
  );
};
