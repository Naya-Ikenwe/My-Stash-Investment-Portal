"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { HiGlobeAsiaAustralia } from "react-icons/hi2";
import { PiClipboardTextLight } from "react-icons/pi";
import { RiSettings4Line } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";

type NavLink = {
  name: string;
  url: string;
  icon: React.ReactNode;
};

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop Navbar */}
      <main className="hidden lg:flex px-3 py-8 flex-col gap-6 h-screen min-w-[250px]">
        <Link href={"/dashboard"}>
          <Image
            src="/images/mystash-logo.svg"
            alt="mystash-logo"
            width={100}
            height={100}
            className="w-40 h-auto"
          />
        </Link>

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
                <p className={`${isActive ? "font-medium" : ""}`}>{link.name}</p>
              </Link>
            );
          })}
        </nav>
      </main>

      {/* Mobile Navbar */}
      <div className="lg:hidden w-full bg-white border-b border-[#37474F21] sticky top-0 z-40">
        <div className="px-4 py-3 flex justify-between items-center">
          <Link href={"/dashboard"}>
            <Image
              src="/images/mystash-logo.svg"
              alt="mystash-logo"
              width={80}
              height={80}
              className="w-32 h-auto"
            />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl text-[#37474F] p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <IoClose size={24} /> : <GiHamburgerMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <nav className="bg-white flex flex-col gap-2 px-4 py-4 border-t border-[#37474F21]">
            {navlinks.map((link) => {
              const isActive = pathname === link.url;

              return (
                <Link
                  href={link.url}
                  key={link.url}
                  className={`flex gap-2 items-center py-3 px-3 rounded-md transition text-[#37474F] font-normal
                    ${isActive ? "bg-[#F2F4F5] text-[#CB30E0]" : " hover:bg-gray-100"}`}
                >
                  <span className={`${isActive ? "text-[#CB30E0]" : ""}`}>
                    {link.icon}
                  </span>
                  <p className={`${isActive ? "font-medium" : ""}`}>{link.name}</p>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </>
  );
}
