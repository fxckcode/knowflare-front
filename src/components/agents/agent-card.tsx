"use client";

import { useRouter } from "next/navigation";

interface AgentCardProps {
  title: string;
  description: string;
  image: string;
}

export const AgentCard = ({ title, description, image }: AgentCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/chat?prompt=${description}`);
  };

  return (
    <button onClick={handleClick} className="bg-secondary hover:bg-accent cursor-pointer rounded-xl p-4 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
          <img src={image} alt={title} className="w-[60px] h-[60px] rounded-full object-cover" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <h3 className="text-foreground truncate text-base font-medium">
            {title}
          </h3>
          <p className="text-foreground mt-1 line-clamp-3 text-sm md:line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};
