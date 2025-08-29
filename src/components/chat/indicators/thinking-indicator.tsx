"use client";

import { TextShimmer } from "@/components/ui/text-shimmer";
import { useState, useEffect } from "react";

const thinkingMessages = [
  "Analizando la pregunta...",
  "Buscando en la base de conocimiento...",
  "Consultando a expertos...",
  "Compilando la respuesta...",
  "Generando insights...",
];

export const ThinkingIndicator = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(
        (prevIndex) => (prevIndex + 1) % thinkingMessages.length
      );
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="group min-h-scroll-anchor flex w-full max-w-3xl flex-col items-start gap-2 px-2 pb-2 mx-auto">
      <TextShimmer className="font-mono text-sm" duration={1.5}>
        {thinkingMessages[currentMessageIndex]}
      </TextShimmer>
    </div>
  );
};
