"use client";

import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { useMediaQuery } from 'usehooks-ts';
import { CanvasTools } from './canvas-tools';
import { Markdown } from '../ui/markdown';
import { useState } from 'react';

interface CanvasProps {
  artifactValue: string;
  toggleArtifactPanel: () => void;
}

export const Canvas = ({ artifactValue, toggleArtifactPanel }: CanvasProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(artifactValue);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([artifactValue], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-${new Date().toISOString()}.md`;
    a.click();
    URL.revokeObjectURL(url);
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
      padding: "16px",
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
    <motion.aside
      className="h-full bg-white backdrop-blur-md border-l border-border/80 shadow-xl"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={panelTransition}
    >
      <button
        type="button"
        onClick={toggleArtifactPanel}
        className="absolute top-3 left-4 md:left-7 z-20 cursor-pointer p-1 rounded-full bg-white hover:bg-muted text-muted-foreground [&>svg]:size-5 transition-all duration-200 ease-in-out"
      >
        <X />
      </button>
      <div className="px-4 pt-9 pb-16 h-full flex flex-col overflow-y-scroll">
        <Markdown className="canvas-content">{artifactValue}</Markdown>
      </div>

      <CanvasTools
        onCopy={handleCopy}
        copied={copied}
        onDownload={handleDownload}
      />
    </motion.aside>
  );
};
