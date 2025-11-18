"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { HiGlobeAsiaAustralia } from "react-icons/hi2";
import { PiClipboardTextLight } from "react-icons/pi";
import { RiSettings4Line } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";

type NavLink = {
  name: string;
  url: string;
  icon: React.ReactNode;
};

export default function Navbar() {
  const pathname = usePathname(); // <-- current URL

  const navlinks: NavLink[] = [
    {
      name: "Home",
      url: "/dashboard",
      icon: <RxDashboard size={20} />,
    },
    {
      name: "Plans",
      url: "/dashboard/plans",
      icon: <PiClipboardTextLight size={20} />,
    },
    {
      name: "Profile Management",
      url: "/dashboard/profile",
      icon: <RiSettings4Line size={20} />,
    },
    {
      name: "Embassy",
      url: "/dashboard/embassy",
      icon: <HiGlobeAsiaAustralia size={20} />,
    },
  ];

  return (
    <main className="px-3 py-8 flex flex-col gap-6 h-screen min-w-[250px]">
      <Image
        src="/images/mystash-logo.svg"
        alt="mystash-logo"
        width={100}
        height={100}
        className="w-40 h-auto"
      />

      <nav className="bg-white flex flex-col gap-4 px-2.5 py-4 rounded-t-xl border border-[#37474F21] h-full">
        {navlinks.map((link) => {
          const isActive = pathname === link.url;

          return (
            <Link
              href={link.url}
              key={link.url}
              className={`flex gap-2 items-center py-3 px-2 rounded-md transition text-[#37474F] font-normal
                ${isActive ? "bg-[#F2F4F5] " : " hover:bg-gray-100"}`}
            >
              <span className={`${isActive ? "text-[#CB30E0]" : ""}`}>
                {link.icon}
              </span>
              <p className={`${isActive ? "font-medium" : ""}`}>
                {link.name}
              </p>
            </Link>
          );
        })}
      </nav>
    </main>
  );
}
