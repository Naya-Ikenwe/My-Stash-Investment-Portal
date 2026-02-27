"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdOutlineNotifications } from "react-icons/md";
import { useAuthStore } from "../store/authStore";
import { getNotificationSummary } from "../api/notification";

export default function DashboardTopLevel() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { logout } = useAuthStore();

  // Fetch unread notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        setIsLoading(true);
        const summary = await getNotificationSummary();
        setUnreadCount(summary.unread);
      } catch (error) {
        console.error("Failed to fetch notification count:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotificationCount();
    const intervalId = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // 🔧 ADD THIS: Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If dropdown is open AND click is outside the dropdown element
      if (
        open && 
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);
    
    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]); // Re-run effect when 'open' state changes

  return (
    <>
      <main className="flex justify-end gap-3 lg:gap-5 items-center w-full mb-4">
        {/* Notifications Icon with Badge and Link */}
        <Link href="/notifications" className="relative">
          <div className="relative">
            <MdOutlineNotifications 
              size={28} 
              className="cursor-pointer hover:text-primary transition-colors"
            />
            
            {/* Unread count badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
            
            {/* Loading indicator */}
            {isLoading && unreadCount === 0 && (
              <span className="absolute -top-2 -right-2 w-[18px] h-[18px] border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            )}
          </div>
        </Link>

        {/* Profile Dropdown */}
        <div className="relative flex items-center gap-2" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle profile menu"
            aria-expanded={open}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Image
              src="/profile.svg"
              alt="profile"
              width={28}
              height={28}
              className="w-7 h-7 rounded-full bg-[#F7F7F7]"
            />

            {/* Arrow - visible on md and up */}
            <IoMdArrowDropdown
              size={20}
              className={`cursor-pointer text-[#A243DC] transition-transform hidden md:block ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
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
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md sm:max-w-[483px] h-auto sm:h-[390px] flex flex-col items-center justify-center gap-6 relative p-6">
            <p className="text-base sm:text-lg font-semibold text-center">
              Do you want to log out?
            </p>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  logout();
                  setShowLogoutModal(false);
                }}
                className="flex-1 sm:flex-none px-6 py-2 rounded-md bg-primary text-white font-medium"
              >
                Yes
              </button>

              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 sm:flex-none px-6 py-2 rounded-md border border-primary text-primary font-medium"
              >
                No
              </button>
            </div>

            <IoClose
              className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-gray-600"
              size={24}
              onClick={() => setShowLogoutModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}