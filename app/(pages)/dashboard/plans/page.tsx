"use client";

import { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
import { LiaDownloadSolid } from "react-icons/lia";
import { savings } from "@/data/PlansData";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";

export default function PlansPage() {
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Matured"
  >("All");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const cardPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSavings = savings.filter((item) => {
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const sortedSavings = [...filteredSavings].sort((a, b) => {
    // Active plans come first, then Matured
    if (a.status === "Active" && b.status === "Matured") return -1;
    if (a.status === "Matured" && b.status === "Active") return 1;
    return 0;
  });

  const totalPages = Math.ceil(sortedSavings.length / cardPerPage);

  const paginatedSavings = sortedSavings.slice(
    (currentPage - 1) * cardPerPage,
    currentPage * cardPerPage
  );

  const handleStatusChange = (status: "All" | "Active" | "Matured") => {
    setStatusFilter(status);
    setIsStatusDropdownOpen(false);
    setCurrentPage(1);
  };

  return (
    <main className="w-full h-full rounded-[14px]">
      <h1 className="text-[32px] font-medium text-[#A243DC]">My Plans</h1>
      <hr className="border border-[#455A6433] rounded-md mt-5" />

      {/* Filters */}
      <div className="flex justify-between items-center mt-3">
        <div className="w-[326px] flex h-8 mt-5 gap-4 relative">
          <button
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
          >
            <div className="h-8 cursor-pointer mx-auto w-[91px] py-1 px-2 bg-[#F7F7F7] rounded-lg text-center flex items-center justify-between">
              <p>Status</p>
              <RiArrowDropDownLine
                size={16}
                className={`transition-transform ${
                  isStatusDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Status Dropdown Menu */}
          {isStatusDropdownOpen && (
            <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 overflow-clip">
              {["All", "Active", "Matured"].map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    handleStatusChange(status as "All" | "Active" | "Matured")
                  }
                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                    statusFilter === status ? "bg-[#A243DC] text-white" : ""
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}

          {/* <button>
            <div className="h-8 cursor-pointer w-[118px] rounded-lg py-1 px-2 bg-[#F7F7F7] text-center">
              <p>Date Range</p>
            </div>
          </button> */}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-[180px]">
            <IoIosSearch className="absolute text-[16px] left-3 top-1/2 -translate-y-1/2 text-gray-500" />

            <input
              type="search"
              name="search"
              placeholder="Search plans..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // reset pagination on search
              }}
              className="w-[180px] h-[42px] pl-9 pr-3 rounded-md border bg-[#F7F7F7] border-gray-300 text-sm"
            />
          </div>

          <div className="">
            <button className="bg-[#A243DC] text-white rounded-md w-[134px] flex items-center gap-2 cursor-pointer justify-center h-[42px]">
              <p>Download</p>
              <LiaDownloadSolid size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 🔵 Savings List goes here */}
      <div className="mt-5 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {paginatedSavings.map((item) => (
            <Link href={`/dashboard/plans/${item.id}`} key={item.id}>
              <div className="w-full h-full px-5 py-10 border rounded-xl shadow-sm bg-[#F7F7F7] relative cursor-pointer hover:shadow-md transition">
                <span
                  className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full ${
                    item.status === "Active"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {item.status}
                </span>

                <h2 className="text-lg font-semibold">{item.title}</h2>

                <p className="text-xl text-[#455A64] font-bold mt-2">
                  ₦{item.amount.toLocaleString()}
                </p>

                <div className="flex justify-between mt-9">
                  <p className="text-[#263238] font-semibold text-[12px] leading-[125%] mt-1">
                    {item.plan}
                  </p>

                  <div className="">
                    <p className="text-[#37474F] flex flex-col text-sm">
                      Mtr.Date
                    </p>
                    <p className="text-[#37474F] flex flex-col text-sm">
                      {item.maturityDate}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {paginatedSavings.length === 0 && (
          <div className="h-20 w-full">
            <p className="text-center text-gray-500 mt-10">No plans found.</p>
          </div>
        )}

        <Pagination className="mt-10 flex items-end w-full justify-end">
          <PaginationContent>
            {/* Previous */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.max(p - 1, 1));
                }}
                className="hover:bg-transparent hover:underline"
              />
            </PaginationItem>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                  className="hover:bg-primary/40"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Next */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.min(p + 1, totalPages));
                }}
                className="hover:bg-transparent hover:underline"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </main>
  );
}
