"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";

export const NavLogo = () => {
  const searchParams = useSearchParams();
  const isAgentPage = searchParams.get("agent") !== null;
  const isMobile = useMediaQuery("(max-width: 640px)");

  return isAgentPage && isMobile ? null : (
    <nav className="w-[200px]">
      <Link href="/">
        <span className="text-xl font-medium select-none text-gray-500 flex items-center gap-2">
          KnowFlare
          <span className="text-gray-500 border border-gray-500 rounded-full px-2 py-1 text-xs">Beta</span>
        </span>
      </Link>
    </nav>
  );
};
