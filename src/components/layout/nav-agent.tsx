"use client";

import { useAgent } from "@/stores/use-agent";
import { usePathname } from "next/navigation";

export const NavAgent = () => {
  const { agent } = useAgent();
  const pathname = usePathname();

  if (!pathname.includes("chat")) return null;
  if (!agent) return null;

  return (
    <nav className="flex items-center gap-2 rounded-full bg-gray-100 p-2 pr-3">
      <div className="flex items-center gap-2">
        <img src={agent.image} alt={agent.name} className="w-6 h-6 rounded-full object-cover" />
      </div>
      <p className="select-none">
        <span className="hidden sm:inline">Talking with</span>
        <strong>{' ' + agent.name}</strong>
      </p>
    </nav>
  );
};