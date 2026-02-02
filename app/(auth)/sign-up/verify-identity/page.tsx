"use client";

import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { RxDividerVertical } from "react-icons/rx";
import AuthWrapper from "@/app/components/auth/AuthWrapper";
import CardWrapper from "@/app/components/CardWrapper";
import {
  updateProfileDobGender,
  getBanksService,
  verifyBankAccount,
  updateKycService,
} from "@/app/api/Users";
import { useRouter } from "next/navigation"; // REMOVED useSearchParams
import { useAuthStore } from "@/app/store/authStore";

type Bank = {
  name: string;
  slug: string;
  code: string;
  longcode: string;
};

type VerifyIdentityForm = {
  dob: Date | null;
  gender: string;
  bankSlug: string;
  accountNumber: string;
  bvn: string;
};

export default function VerifyIdentityPage() {
  const [openDate, setOpenDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [banks, setBanks] = useState<Bank[]>([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  // Client-side state for URL params
  const [phoneFromSignup, setPhoneFromSignup] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Get URL params on client side only
  useEffect(() => {
    setIsClient(true);
    const params = new URLSearchParams(window.location.search);
    const phone = params.get("phone");
    console.log("🔍 URL DEBUG: Phone from URL params:", phone);
    console.log("🔍 URL DEBUG: Current URL:", window.location.href);
    setPhoneFromSignup(phone);
  }, []);

  // FIXED: Added check to prevent infinite redirects
  useEffect(() => {
    if (!isClient) return; // Wait for client-side hydration
    
    if (!user?.isEmailVerified) {
      const currentPath = window.location.pathname;
      const isOnVerifyEmailPage = currentPath.includes("verify-email");

      if (!isOnVerifyEmailPage) {
        if (phoneFromSignup) {
          router.push(
            `/sign-up/verify-email?phone=${encodeURIComponent(phoneFromSignup)}`,
          );
        } else {
          router.push("/sign-up/verify-email");
        }
      }
    }
  }, [user, router, phoneFromSignup, isClient]);

  // Fetch banks from backend API
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setBanksLoading(true);
        const banksData = await getBanksService();

        if (Array.isArray(banksData)) {
          setBanks(banksData);
        } else if (banksData.data && Array.isArray(banksData.data)) {
          setBanks(banksData.data);
        }
      } catch (error) {
        console.error("Failed to fetch banks", error);
        setBanks([]);
      } finally {
        setBanksLoading(false);
      }
    };

    fetchBanks();
  }, []);

  const { control, handleSubmit } = useForm<VerifyIdentityForm>({
    defaultValues: {
      dob: null,
      gender: "",
      bankSlug: "",
      accountNumber: "",
      bvn: "",
    },
  });

  // Helper to get bank code from slug - ENHANCED
  const getBankCodeFromSlug = (bankSlug: string): string => {
    console.log("🔍 getBankCodeFromSlug called with slug:", bankSlug);

    if (!bankSlug) {
      console.error("❌ bankSlug is empty!");
      return "";
    }

    const bank = banks.find((b) => b.slug === bankSlug);

    if (bank) {
      console.log("✅ Found bank:", bank.name);
      console.log("✅ Bank code:", bank.code);
      return bank.code;
    } else {
      console.error("❌ Bank not found for slug:", bankSlug);
      console.error(
        "Available slugs:",
        banks.map((b) => b.slug),
      );
      return "";
    }
  };

  const formatDate = (date?: Date | null) =>
    date ? new Intl.DateTimeFormat("en-GB").format(date) : "";

  // Function 1: Update DOB & Gender
  const updateDobAndGender = async (dob: Date, gender: string) => {
    const genderForBackend = gender.toUpperCase();
    const dateOfBirth = dob.toISOString();

    const payload = {
      dateOfBirth,
      gender: genderForBackend,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: phoneFromSignup || "",
    };

    console.log("Updating profile with phone:", phoneFromSignup);

    try {
      const response = await updateProfileDobGender(payload);
      console.log("DOB & Gender updated:", response);
      return response;
    } catch (error) {
      console.error("Failed to update DOB & Gender:", error);
      throw error;
    }
  };

  // Function 2: Add Bank Account - SINGLE VERSION WITH DEBUG
  const addBankAccount = async (accountNumber: string, bankSlug: string) => {
    console.log("🔍 addBankAccount DEBUG START =======================");
    console.log("📥 Inputs:");
    console.log(
      "  - accountNumber:",
      accountNumber,
      "(length:",
      accountNumber?.length,
      ")",
    );
    console.log("  - bankSlug:", bankSlug);

    // Get bank code
    const bankCode = getBankCodeFromSlug(bankSlug);
    console.log("  - bankCode from getBankCodeFromSlug:", bankCode);

    // Check if banks are loaded
    console.log("  - Banks loaded:", banks.length > 0 ? "Yes" : "No");
    if (banks.length > 0) {
      const foundBank = banks.find((b) => b.slug === bankSlug);
      console.log("  - Found bank:", foundBank);
      console.log(
        "  - All bank slugs:",
        banks.map((b) => b.slug),
      );
    }

    if (!bankCode) {
      console.error("❌ ERROR: No bankCode found for slug:", bankSlug);
      throw new Error("Invalid bank selected");
    }

    // Validate account number
    if (!accountNumber || !/^\d{10}$/.test(accountNumber)) {
      console.error("❌ ERROR: Invalid account number format");
      throw new Error("Account number must be exactly 10 digits");
    }

    console.log("📤 Preparing to call /bank endpoint with:");
    console.log("  - accountNumber:", accountNumber);
    console.log("  - bankCode:", bankCode);
    console.log("  - Full payload:", { accountNumber, bankCode });

    try {
      console.log("🚀 Calling verifyBankAccount API...");
      const response = await verifyBankAccount({
        accountNumber,
        bankCode,
      });
      console.log("✅ SUCCESS: Bank account added:", response);
      return response;
    } catch (error: any) {
      console.error("❌ FAILED: Bank account error details:");
      console.error("  - Error message:", error.message);
      console.error("  - Response status:", error.response?.status);
      console.error("  - Response data:", error.response?.data);
      console.error("  - Full error:", error);
      throw new Error(
        `Bank verification failed: ${error.response?.data?.message || error.message}`,
      );
    }
  };

  // Function 3: Update KYC (BVN) - SIMPLIFIED
  const updateKycInfo = async (bvn: string) => {
    const payload = { bvn };
    console.log("Sending partial KYC payload:", payload);

    try {
      const response = await updateKycService(payload);
      console.log("KYC information updated:", response);
      return response;
    } catch (error) {
      console.error("Failed to update KYC:", error);
      throw error;
    }
  };

  const onSubmit = async (data: VerifyIdentityForm) => {
    console.log("DEBUG: phoneFromSignup from URL:", phoneFromSignup);
    console.log("🔍 DEBUG 2. Current user in store:", user);
    console.log("🔍 DEBUG 3. Form data:", data);

    if (!phoneFromSignup) {
      console.log("ERROR: phoneFromSignup is null/empty");
      setApiError(
        "Phone number is missing. Please start the signup process again.",
      );
      return;
    }

    if (!data.dob) {
      console.log("❌ ERROR: dob is null");
      setApiError("Date of birth is required");
      return;
    }

    if (!data.gender) {
      setApiError("Gender is required");
      return;
    }
    if (!data.bankSlug) {
      setApiError("Bank is required");
      return;
    }
    if (!data.accountNumber || data.accountNumber.length < 10) {
      setApiError("Account number must be at least 10 digits");
      return;
    }
    if (!data.bvn || data.bvn.length !== 11) {
      setApiError("BVN must be 11 digits");
      return;
    }

    // ADD: Check if banks are loaded
    if (banksLoading) {
      setApiError("Banks are still loading. Please wait...");
      return;
    }

    if (banks.length === 0) {
      setApiError("No banks available. Please try again.");
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      // STEP 1: Update DOB & Gender
      console.log(
        "STEP 1: Calling updateDobAndGender with phone:",
        phoneFromSignup,
      );
      const profileResponse = await updateDobAndGender(data.dob, data.gender);

      if (profileResponse?.data) {
        // ✅ CRITICAL: Create user with phone
        const updatedUser = {
          ...user,
          ...profileResponse.data,
          dateOfBirth: data.dob.toISOString(),
          gender: data.gender.toUpperCase(),
          phone: phoneFromSignup, // ✅ PHONE SAVED TO AUTH STORE
        };

        console.log("Updated user with phone:", updatedUser.phone);
        setUser(updatedUser);
      }

      // STEP 2: Add Bank Account
      console.log("STEP 2: Adding bank account");
      const bankResponse = await addBankAccount(
        data.accountNumber,
        data.bankSlug,
      );

      // STEP 3: Update KYC
      console.log("STEP 3: Updating KYC");
      const kycResponse = await updateKycInfo(data.bvn);

      if (kycResponse?.data) {
        // ✅ FINAL: Ensure phone stays in user object
        const finalUser = {
          ...user,
          isIdentityVerified: true,
          ...kycResponse.data,
          phone: phoneFromSignup, // ✅ PHONE PERSISTS IN AUTH STORE
        };

        setUser(finalUser);
      }

      console.log("All steps succeeded - redirecting to dashboard");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("ERROR: Identity verification failed", error);

      if (error.message?.includes("Bank verification failed")) {
        setApiError(
          "Bank account verification failed. Please check your account number and try again.",
        );
      } else {
        setApiError(
          error.response?.data?.message ||
            "Verification failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Prevent rendering until client-side
  if (!isClient) {
    return (
      <AuthWrapper className="flex gap-10 -mt-10">
        <main className="flex gap-20">
          <CardWrapper className="px-8 py-5 flex flex-col gap-4 w-[628px]">
            <div>
              <h3 className="text-primary text-[30px] font-heading">
                Personal Information
              </h3>
              <p>
                Please provide your basic details to help us verify and set up
                your investment profile securely.
              </p>
            </div>
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading...</p>
            </div>
          </CardWrapper>
        </main>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper className="flex gap-10 -mt-10">
      <main className="flex gap-20">
        <CardWrapper className="px-8 py-5 flex flex-col gap-4 w-[628px]">
          <div>
            <h3 className="text-primary text-[30px] font-heading">
              Personal Information
            </h3>
            <p>
              Please provide your basic details to help us verify and set up
              your investment profile securely.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <div className="flex gap-4">
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <div className="relative flex gap-2 w-full">
                    <Input
                      placeholder="D.O.B"
                      value={formatDate(field.value)}
                      readOnly
                      className="bg-white h-12 mt-2 w-full"
                    />
                    <Popover open={openDate} onOpenChange={setOpenDate}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                          <CalendarIcon className="size-3.5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpenDate(false);
                          }}
                          captionLayout="dropdown"
                          fromYear={1900}
                          toYear={new Date().getFullYear() - 18}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              />

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full bg-white min-h-12 mt-2">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Controller
                name="bankSlug"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={banksLoading}
                  >
                    <SelectTrigger className="bg-white min-h-12 mt-2 w-full">
                      <SelectValue
                        placeholder={
                          banksLoading ? "Loading banks..." : "Select Bank"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        {banks.map((bank) => (
                          <SelectItem key={bank.slug} value={bank.slug}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <Controller
                name="accountNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Account Number"
                    className="bg-white h-12 mt-2 w-full"
                    maxLength={10}
                  />
                )}
              />
            </div>

            <Controller
              name="bvn"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter BVN (11 digits)"
                  className="bg-white h-12 mt-2 w-full"
                  maxLength={11}
                />
              )}
            />

            {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

            <Button
              type="submit"
              className="bg-primary text-white w-1/4 mt-4"
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed"}
            </Button>
          </form>
        </CardWrapper>

        <aside className="flex flex-col gap-9 w-[453px]">
          <h2 className="text-primary text-[34px] font-heading">
            Lets get you set up in just 2 steps
          </h2>

          <div>
            <div className="flex gap-1 items-center">
              <p className="w-8 h-8 flex items-center justify-center rounded-full border">
                1
              </p>
              <p>Create Your Account</p>
            </div>

            <RxDividerVertical size={24} className="mx-1 text-gray-400" />

            <div className="flex gap-1 items-center">
              <p className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white">
                2
              </p>
              <p>Enter Your Information</p>
            </div>
          </div>
        </aside>
      </main>
    </AuthWrapper>
  );
}