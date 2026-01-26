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
import Link from "next/link";
import { RxDividerVertical } from "react-icons/rx";
import AuthWrapper from "@/app/components/auth/AuthWrapper";
import CardWrapper from "@/app/components/CardWrapper";
import { verifyIdentity } from "@/app/api/Users";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";

const banks = [
  { label: "Access Bank", value: "access" },
  { label: "Source Bank", value: "source" },
  { label: "GTBank", value: "gtbank" },
  { label: "First Bank", value: "firstbank" },
  { label: "UBA", value: "uba" },
];

type VerifyIdentityForm = {
  dob: Date | null;
  gender: string;
  bank: string;
  accountNumber: string;
  accountName: string;
  bvn: string;
  bvnName: string;
};

export default function VerifyIdentityPage() {
  const [openDate, setOpenDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.isEmailVerified) {
      router.push("/sign-up/verify-email");
    }
  }, [user, router]);

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
    const payload = {
      dateOfBirth: data.dob?.toISOString().split("T")[0],
      gender: data.gender.toUpperCase(),
      bank: data.bank,
      accountNumber: data.accountNumber,
      accountName: data.accountName,
      bvn: data.bvn,
      bvnName: data.bvnName,
    };

    setLoading(true);

    try {
      await verifyIdentity(payload);
      router.push("/dashboard");
    } catch (err) {
      console.error("Identity verification failed", err);
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

            <div className="flex gap-4">
              <Controller
                name="bank"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-white min-h-12 mt-2 w-full">
                      <SelectValue placeholder="Select Bank" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        {banks.map((bank) => (
                          <SelectItem key={bank.value} value={bank.value}>
                            {bank.label}
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
                  <Input {...field} placeholder="Account Number" className="bg-white h-12 mt-2" />
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
                <Input {...field} placeholder="Enter BVN" className="bg-white h-12 mt-2" />
              )}
            />

            <Controller
              name="bvnName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="BVN Name" className="bg-white h-12 mt-2" />
              )}
            />

            <Button type="submit" className="bg-primary text-white w-1/4 mt-4" disabled={loading}>
              {loading ? "Processing..." : "Proceed"}
            </Button>
          </form>

          <article className="text-center mt-3">
            <p>
              Already have an account?{" "}
              <Link href="/" className="text-primary font-medium">
                Sign in
              </Link>
            </p>
          </article>
        </CardWrapper>

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
