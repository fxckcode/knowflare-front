import { NavAgent } from "./nav-agent";
import { NavLogo } from "./nav-logo";
import { UploadDialog } from "../upload/upload-dialog";

export const Navbar = () => {
  return (
    <header className="max-h-[72px]">
      <div className="px-7 py-4 flex justify-between items-center">
        <NavLogo />
        <NavAgent />

        <nav className="w-[200px] flex justify-end">
          <UploadDialog />
        </nav>
      </div>
    </header>
  );
};