"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Lectures", href: "/lectures" },
  { label: "Progress", href: "/progress" },
];

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/sign-in");
  };

  return (
    <nav className="flex p-4 bg-[#1e1e2f] h-20 w-full items-center justify-between">
      <div className="pl-2 text-[#e4e4e7] text-2xl font-bold">Viprotra</div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e4e4e7] text-[#1e1e2f] flex items-center justify-center font-semibold">
            {session?.user?.username?.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-[#e4e4e7] text-sm">{session?.user?.username}</div>
        </div>
        <button 
          onClick={handleLogout} 
          className="border rounded p-2 hover:bg-[#e4e4e7] hover:text-[#1e1e2f] border-[#e4e4e7] text-[#e4e4e7]"
        >
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
