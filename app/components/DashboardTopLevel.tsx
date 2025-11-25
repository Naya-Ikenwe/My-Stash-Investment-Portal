"use client";

import Image from "next/image";
import { useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineNotifications } from "react-icons/md";

export default function DashboardTopLevel() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdown = [
    {
      icon: <FaUserAlt />,
      label: "Profile",
    },
    {
      icon: <FiLogOut />,
      label: "Logoout",
    },
  ];

  return (
    <main className="flex justify-between items-center mb-4">
      <input type="text" placeholder="search...." />

      <div className="flex gap-4 items-center ">
        <MdOutlineNotifications size={24} />

        <div className="flex gap-2 items-center relative">
          <Image
            src={"/profile.svg"}
            alt="profile-placholder"
            width={20}
            height={20}
            className="w-10 h-10 rounded-full bg-[#F7F7F7]"
          />
          <button onClick={() => setShowDropdown(true)}>
            <IoMdArrowDropdown className="text-[#A243DC]" size={20} />
          </button>

          {showDropdown && (
            <div onClick={() => setShowDropdown(false)} className="fixed inset-0 bg-black/60">
              <div className="bg-white rounded-xl p-4 flex flex-col gap-3 border border-[#455A6426] absolute top-12 right-4">
                {dropdown.map((item) => (
                  <div
                    key={item.label}
                    className="flex gap-2 items-center text-[#455A64]"
                  >
                    <span>{item.icon}</span>
                    <p>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
