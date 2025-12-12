"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { FaUserAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineNotifications } from "react-icons/md";

export default function DashboardTopLevel() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click

  return (
    <>
      <main className="flex justify-end gap-5 items-center w-full mb-4">
        <MdOutlineNotifications size={28} />

        <div>
          <p className="text-primary">50% complete</p>
          <div className="w-32 h-2 bg-[#F7F7F7] rounded-full">
            <div className="h-2 bg-[#A243DC] rounded-full w-1/2"></div>
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative flex items-center gap-2" ref={dropdownRef}>
          <Image
            src="/profile.svg"
            alt="profile"
            width={28}
            height={28}
            className="w-7 h-7 rounded-full bg-[#F7F7F7]"
          />

          {/* Toggle only arrow */}
          <button onClick={() => setOpen((prev) => !prev)}>
            <IoMdArrowDropdown
              size={20}
              className={`cursor-pointer text-[#A243DC] transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-10 bg-white rounded-xl shadow-md p-3 flex flex-col gap-2 border border-[#455A6426] w-40 z-50">
              {/* PROFILE */}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  router.push("/dashboard/profile");
                }}
                className="flex items-center gap-2 text-[#455A64] hover:bg-gray-100 rounded-md px-2 py-1 w-full text-left cursor-pointer"
              >
                <FaUserAlt />
                <p>Profile</p>
              </button>

              {/* LOGOUT */}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setShowLogoutModal(true);
                }}
                className="flex items-center gap-2 text-[#455A64] hover:bg-gray-100 rounded-md px-2 py-1 w-full text-left cursor-pointer"
              >
                <FiLogOut />
                <p>Logout</p>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* LOGOUT CONFIRM MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <p className="text-lg font-semibold mb-4">
              Do you want to log out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-md bg-primary"
              >
                Yes
              </button>
              
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  // ADD YOUR LOGOUT LOGIC HERE
                }}
                className="px-4 py-2 rounded-md bordeer border-primary text-primary"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
