"use client";

import { TextShimmer } from "@/components/ui/text-shimmer";
import { BarChart } from "lucide-react";
import { useState, useEffect } from "react";

interface VisualizeDataToolProps {
  onShowCanvas: (isShowing: boolean) => void;
}

export const VisualizeDataTool = ({ onShowCanvas }: VisualizeDataToolProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Simulate a 3-second loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <TextShimmer>Generando visualización...</TextShimmer>;
  }

  return (
    <button
      className="text-gray-500 bg-muted/50 rounded-md p-2 flex items-center gap-3 cursor-pointer"
      onClick={() => onShowCanvas(true)}
    >
      <div className="w-[45px] h-[45px] rounded-md border-[1.5px] border-gray-200 flex items-center justify-center">
        <BarChart className="size-5" />
      </div>
      <span className="text-sm">Visualización de datos lista. Haz clic para ver.</span>
    </button>
  );
};
