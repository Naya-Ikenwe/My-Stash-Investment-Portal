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
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { RxDividerVertical } from "react-icons/rx";
import AuthWrapper from "@/app/components/auth/AuthWrapper";
import CardWrapper from "@/app/components/CardWrapper";

export default function VerifyIdentityPage() {
  const { control } = useForm();
  const [openDate, setOpenDate] = useState(false);

  return (
    <AuthWrapper className="flex gap-10 -mt-10">
      <main className="flex gap-20">
        <CardWrapper className="px-8 py-5 flex flex-col gap-4 w-[628px]">
          <div>
            <h3 className="text-primary text-[30px] font-medium">
              Personal Information
            </h3>
            <p>
              Please provide your basic details to help us verify and set up
              your investment profile securely.
            </p>
          </div>

          <form action="" className="flex flex-col gap-3">
            <div className="flex gap-4">
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <div className="relative flex gap-2 w-full">
                    <Input
                      id="dob"
                      // value={field.value}
                      placeholder="D.O.B"
                      className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2 min-w-full"
                      {...field}
                    />
                    <Popover open={openDate} onOpenChange={setOpenDate}>
                      <PopoverTrigger asChild>
                        <Button
                          id="date-picker"
                          variant="ghost"
                          className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                          <CalendarIcon className="size-3.5" />
                          {/* <span className="sr-only">Select date</span> */}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-auto overflow-hidden p-0 bg-white"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                      >
                        <Calendar
                          mode="single"
                          // selected={}
                          captionLayout="dropdown"
                          // month={month}
                          // onMonthChange={setMonth}
                          // onSelect={(date) => {
                          //   setDate(date);
                          //   setValue(formatDate(date));
                          //   setOpen(false);
                          // }}
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
                    <SelectTrigger className="w-full bg-white min-h-12 mt-2 py-0">
                      <SelectValue
                        placeholder="Gender"
                        className="text-black "
                      />
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

            <div className="flex gap-4 w-full">
              <Controller
                name="bank"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-white min-h-12 mt-2 py-0 w-full">
                      <SelectValue
                        placeholder="Select Bank"
                        className="text-black "
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        <SelectItem value="access">Access Bank</SelectItem>
                        <SelectItem value="source">Source Bank</SelectItem>
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
                    className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2 w-full"
                  />
                )}
              />
            </div>

            <Controller
              name="accountName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Account Name"
                  className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
                />
              )}
            />

            <Controller
              name="bvn"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter BVN"
                  className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
                />
              )}
            />

            <Controller
              name="bvnName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="BVN Name"
                  className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
                />
              )}
            />

            <Link
              href={"/dashboard"}
              className="bg-primary text-white w-1/4 mt-4 rounded-xl text-center py-2 "
            >
              Proceed
            </Link>

            {/* <Input
          type="submit"
          value={"Proceed"}
          className="bg-primary text-white w-1/4 mt-4 cursor-pointer"
        /> */}
          </form>

          <article className="flex flex-col text-center gap-2 items-center mt-3">
            <p>
              Already have an account?{" "}
              <Link href={"/"} className="text-primary font-medium">
                {" "}
                Sign in
              </Link>
            </p>
          </article>
        </CardWrapper>

        <aside className="flex flex-col gap-9 w-[453px]">
          <div>
            <h2 className="text-primary text-[34px] font-medium">
              Lets get you set up in just 2 steps{" "}
            </h2>
            <p>
              We&apos;ll keep it short and simple, just what we need to
              personalize your experience
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <p
                className={`w-8 h-8 flex items-center justify-center rounded-full border text-[#455A64A3] `}
              >
                1
              </p>
              <p>Create Your Account</p>
            </div>

            <div className="w-8 h-8 flex items-center justify-center">
              <RxDividerVertical size={24} className="text-[#455A64A3]" />
            </div>

            <div className="flex gap-1 items-center">
              <p className="w-8 h-8 flex items-center justify-center rounded-full text-white bg-primary">
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
