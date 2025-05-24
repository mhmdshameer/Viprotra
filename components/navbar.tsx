"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter()

  const handleClick = () => {
      router.push("/auth/sign-in")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex p-4 bg-[#1e1e2f] h-20 w-full items-center justify-between">
      <div className="pl-2 text-[#e4e4e7] text-2xl font-bold">Viprotra</div>
      <div>
        <button onClick={handleClick} className="border rounded p-2 hover:bg-[#e4e4e7] hover:text-[#1e1e2f] border-[#e4e4e7] text-[#e4e4e7]">
          Sign-in
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
