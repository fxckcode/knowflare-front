"use client";

import { TextShimmer } from "@/components/ui/text-shimmer";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useState, useEffect } from "react";

export const GenerateReportTool = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Simulate a 3-second loading time

    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    // Create a dummy file and trigger download
    const blob = new Blob(["Este es un informe de ejemplo generado por la IA."], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "informe_generado.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <TextShimmer>Generando informe...</TextShimmer>;
  }

  return (
    <button
      className="text-gray-500 bg-muted/50 rounded-md p-2 flex items-center gap-3 cursor-pointer"
      onClick={handleDownload}
    >
      <div className="w-[45px] h-[45px] rounded-md border-[1.5px] border-gray-200 flex items-center justify-center">
        <FileDown className="size-5" />
      </div>
      <div className="flex flex-col items-start">
         <span className="text-sm font-semibold">Informe listo para descargar</span>
         <span className="text-xs text-gray-400">informe_generado.txt</span>
      </div>
    </button>
  );
};
