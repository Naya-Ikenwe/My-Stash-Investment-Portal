"use client";

import { useState, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
import { LiaDownloadSolid } from "react-icons/lia";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { getAllPlans, PlanResponse } from "@/app/api/Plan";


export default function PlansPage() {
  const [statusFilter, setStatusFilter] = useState<
    "All" | "ACTIVE" | "MATURED" | "PENDING" | "CLOSED"
  >("All");
  const [tenorFilter, setTenorFilter] = useState<
    "All" | "6 months" | "12 months"
  >("All");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isTenorDropdownOpen, setIsTenorDropdownOpen] = useState(false);
  const cardPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [plans, setPlans] = useState<PlanResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const results = await getAllPlans(); // results is already PlanResponse[]
        setPlans(results); // ✅ correct
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        setPlans([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Days until maturity
  const getDaysUntilMaturity = (dateStr: string) => {
    if (!dateStr) return 0;
    const maturityDate = new Date(dateStr);
    const today = new Date();
    return Math.ceil(
      (maturityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
  };

  // Filter plans - Show ONLY active rolled-over plans, completely hide old matured parents
  const filteredPlans = plans.filter((plan) => {
    // HIDE any MATURED plan that has been rolled over (it should not appear at all)
    if (plan.status === "MATURED" && plan.rolloverType) {
      return false; // Hide the old rolled-over plan completely
    }

    // HIDE any MATURED plan that has an ACTIVE child (the parent is redundant)
    if (plan.status === "MATURED") {
      const hasActiveChild = plans.some(
        (p) => p.parentPlanId === plan.id && p.status === "ACTIVE"
      );
      if (hasActiveChild) {
        return false; // Hide parent, show only the child
      }
    }

    const statusMatch = statusFilter === "All" || plan.status === statusFilter;
    const searchMatch = plan.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    let tenorMatch = true;
    if (tenorFilter !== "All") {
      const days = getDaysUntilMaturity(plan.maturityDate);
      if (tenorFilter === "6 months") tenorMatch = days >= 140 && days <= 210;
      if (tenorFilter === "12 months") tenorMatch = days > 210;
    }
    return statusMatch && searchMatch && tenorMatch;
  });

  // Sort: ACTIVE first, then PENDING, then MATURED, then CLOSED
  const sortedPlans = [...filteredPlans].sort((a, b) => {
    const order = ["ACTIVE", "PENDING", "MATURED", "CLOSED"];
    return order.indexOf(a.status || "PENDING") - order.indexOf(b.status || "PENDING");
  });

  // Pagination
  const totalPages = Math.ceil(sortedPlans.length / cardPerPage);
  const paginatedPlans = sortedPlans.slice(
    (currentPage - 1) * cardPerPage,
    currentPage * cardPerPage,
  );

  return (
    <main className="w-full h-full rounded-[14px]">
      <h1 className="text-[32px] font-medium text-[#A243DC]">My Plans</h1>
      <hr className="border border-[#455A6433] rounded-md mt-5" />

      {/* Filters */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex h-8 mt-5 gap-4">
          {/* Status */}
          <div className="relative">
            <button
              onClick={() => {
                setIsStatusDropdownOpen(!isStatusDropdownOpen);
                setIsTenorDropdownOpen(false);
              }}
            >
              <div className="h-8 cursor-pointer w-[91px] py-1 px-2 bg-[#F7F7F7] rounded-lg flex items-center justify-between">
                <p>Status</p>
                <RiArrowDropDownLine
                  size={16}
                  className={isStatusDropdownOpen ? "rotate-180" : ""}
                />
              </div>
            </button>
            {isStatusDropdownOpen && (
              <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {["All", "ACTIVE", "MATURED", "PENDING", "CLOSED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status as any);
                      setIsStatusDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${statusFilter === status ? "bg-[#A243DC] text-white" : ""}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tenor */}
          <div className="relative">
            <button
              onClick={() => {
                setIsTenorDropdownOpen(!isTenorDropdownOpen);
                setIsStatusDropdownOpen(false);
              }}
            >
              <div className="h-8 cursor-pointer w-[91px] py-1 px-2 bg-[#F7F7F7] rounded-lg flex items-center justify-between">
                <p>Tenor</p>
                <RiArrowDropDownLine
                  size={16}
                  className={isTenorDropdownOpen ? "rotate-180" : ""}
                />
              </div>
            </button>
            {isTenorDropdownOpen && (
              <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {["All", "6 months", "12 months"].map((tenor) => (
                  <button
                    key={tenor}
                    onClick={() => {
                      setTenorFilter(tenor as any);
                      setIsTenorDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${tenorFilter === tenor ? "bg-[#A243DC] text-white" : ""}`}
                  >
                    {tenor}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search + Download */}
        <div className="flex items-center gap-4">
          <div className="relative w-[180px]">
            <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              placeholder="Search plans..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[180px] h-[42px] pl-9 pr-3 rounded-md border bg-[#F7F7F7] border-gray-300 text-sm"
            />
          </div>
          <button className="bg-[#A243DC] text-white rounded-md w-[134px] flex items-center gap-2 justify-center h-[42px]">
            <p>Download</p>
            <LiaDownloadSolid size={20} />
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="mt-5 py-2">
        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A243DC]"></div>
              <p className="text-gray-500">Loading plans...</p>
            </div>
          </div>
        ) : paginatedPlans.length === 0 ? (
          <div className="h-20 w-full flex flex-col items-center justify-center mt-10">
            <p className="text-center text-gray-500">
              {searchQuery
                ? "No plans match your search."
                : "No investment plans found."}
            </p>
            <Link
              href="/dashboard/create-plan"
              className="mt-4 text-[#A243DC] hover:underline"
            >
              Create your first plan →
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {paginatedPlans.map((plan) => (
                <Link href={`/dashboard/plans/${plan.id}`} key={plan.id}>
                  <div className={`w-full h-full px-5 py-10 border rounded-xl shadow-sm relative cursor-pointer hover:shadow-md transition ${
                    plan.status === "CLOSED"
                      ? "bg-gray-200 opacity-50 pointer-events-none"
                      : "bg-[#F7F7F7]"
                  }`}>
                    <span
                      className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full ${
                        plan.status === "ACTIVE"
                          ? "bg-blue-100 text-blue-600"
                          : plan.status === "MATURED"
                            ? "bg-green-100 text-green-800"
                            : plan.status === "CLOSED"
                              ? "bg-gray-300 text-gray-700"
                              : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {plan.status}
                    </span>
                    <h2 className="text-lg font-medium">{plan.name}</h2>
                    <p className="text-xl text-[#455A64] font-semibold mt-2">
                      ₦{plan.currentPrincipal?.toLocaleString() || 0}
                    </p>

                    <div className="flex justify-between mt-9">
                      <div>
                        <p className="text-[#263238] font-semibold text-[12px] leading-[125%]">
                          {plan.name}
                        </p>
                        {plan.rolloverType && (
                          <p className="text-xs text-gray-500 mt-1">
                            Rollover: {plan.rolloverType.replace("_", " ")}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-[#37474F] text-sm">Mtr.Date</p>
                        <p className="text-[#37474F] text-sm">
                          {plan.maturityDate ? (
                            new Date(plan.maturityDate).toLocaleDateString(
                              "en-GB",
                            )
                          ) : (
                            <span className="text-gray-400">Not set</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-10 flex items-end w-full justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((p) => Math.max(p - 1, 1));
                      }}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === page}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((p) => Math.min(p + 1, totalPages));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </main>
  );
}
