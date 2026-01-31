"use client";

import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { RxDividerVertical } from "react-icons/rx";
import AuthWrapper from "@/app/components/auth/AuthWrapper";
import CardWrapper from "@/app/components/CardWrapper";
import { verifyIdentity, getBanksService } from "@/app/api/Users";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { v4 as uuidv4 } from "uuid";

type Bank = {
  name: string;
  slug: string;       // Using slug as unique identifier
  code: string;
  longcode: string;
};

type VerifyIdentityForm = {
  dob: Date | null;
  gender: string;
  bank: string;       // This will now store the bank slug
  accountNumber: string;
  accountName: string;
  bvn: string;
  bvnName: string;
};

export default function VerifyIdentityPage() {
  const [openDate, setOpenDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [banks, setBanks] = useState<Bank[]>([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (!user?.isEmailVerified) {
      router.push("/sign-up/verify-email");
    }
  }, [user, router]);

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
      bank: "",
      accountNumber: "",
      accountName: "",
      bvn: "",
      bvnName: "",
    },
  });

  const formatDate = (date?: Date | null) =>
    date ? new Intl.DateTimeFormat("en-GB").format(date) : "";

  const onSubmit = async (data: VerifyIdentityForm) => {
    // Add validation before submitting
    if (!data.dob) {
      setApiError("Date of birth is required");
      return;
    }
    if (!data.gender) {
      setApiError("Gender is required");
      return;
    }
    if (!data.bank) {
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

    setLoading(true);
    setApiError("");

    // Fix: Check if dob exists before calling toISOString
    const dateOfBirth = data.dob ? data.dob.toISOString().split("T")[0] : "";

    const payload = {
      deviceId: uuidv4(),
      dateOfBirth: dateOfBirth,
      gender: data.gender.toUpperCase(),
      bank: data.bank,  // Now sending the slug instead of code
      accountNumber: data.accountNumber,
      accountName: data.accountName,
      bvn: data.bvn,
      bvnName: data.bvnName,
    };

    try {
      const res = await verifyIdentity(payload);

      // Update user in store with verified identity
      setUser({
        ...user,
        ...res.profile,
        isIdentityVerified: true
      });

      // Auto-login by redirecting to dashboard
      router.push("/dashboard");
      
    } catch (err: any) {
      console.error("Identity verification failed", err);
      setApiError(err.response?.data?.message || "Verification failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

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

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            {/* DOB & Gender */}
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
                      className="bg-white h-12 mt-2"
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

            {/* Bank & Account */}
            <div className="flex gap-4">
              <Controller
                name="bank"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={banksLoading}
                  >
                    <SelectTrigger className="bg-white min-h-12 mt-2 w-full">
                      <SelectValue placeholder={
                        banksLoading ? "Loading banks..." : "Select Bank"
                      } />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        {banks.map((bank) => (
                          // CHANGE: Use bank.slug as the key AND value
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
                    className="bg-white h-12 mt-2"
                    maxLength={10}
                  />
                )}
              />
            </div>

            <Controller
              name="accountName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Account Name" className="bg-white h-12 mt-2" />
              )}
            />

            <Controller
              name="bvn"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  placeholder="Enter BVN" 
                  className="bg-white h-12 mt-2"
                  maxLength={11}
                />
              )}
            />

            <Controller
              name="bvnName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="BVN Name" className="bg-white h-12 mt-2" />
              )}
            />

            {/* API Error */}
            {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

            <Button type="submit" className="bg-primary text-white w-1/4 mt-4" disabled={loading}>
              {loading ? "Processing..." : "Proceed"}
            </Button>
          </form>
        </CardWrapper>

        {/* Side Steps */}
        <aside className="flex flex-col gap-9 w-[453px]">
          <h2 className="text-primary text-[34px] font-heading">
            Lets get you set up in just 2 steps
          </h2>

          <div>
            <div className="flex gap-1 items-center">
              <p className="w-8 h-8 flex items-center justify-center rounded-full border">1</p>
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