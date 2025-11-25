"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

export default function Personal() {
  const { control } = useForm();

  return (
    <main className="flex flex-col gap-10">
      <div>
        <p className="text-[#455A64] font-medium text-[16px] mb-2">Personal Information</p>
        <hr className="border-[#455A6433]"/>
      </div>

      <form className="flex gap-12 w-[80%]">
        <div className="w-2/5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={"/images/profile-pic.png"}
              alt="profile-pic"
              width={150}
              height={150}
            />
            <p>Shalom Ajoge</p>
          </div>

          {/* caution to complete profile to be displayed here */}
          <div></div>

          <Link
            href={"/dashboard/profile/edit-password"}
            className="bg-primary text-white py-4 w-full text-center rounded-xl"
          >
            Change Password
          </Link>
        </div>

        <div className="w-3/5 flex flex-col gap-5">
          <div className="flex gap-5">
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full bg-white text-white min-h-12 mt-2 py-0">
                    <SelectValue placeholder="Gender" className="text-black " />
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

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full bg-white text-white min-h-12 mt-2 py-0">
                    <SelectValue placeholder="Title" className="text-black " />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectItem value="mr">Mr.</SelectItem>
                      <SelectItem value="mrs">Mrs.</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            {/* <label htmlFor="planName">Give your plan a name</label> */}
            <Controller
              name="planName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="First Name"
                  className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
                />
              )}
            />
          </div>

          <div>
            {/* <label htmlFor="amount">How much do you want to fund?</label> */}
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Last Name"
                  className="bg-white h-12 mt-2"
                />
              )}
            />
          </div>

          <div>
            {/* <label htmlFor="amount">How much do you want to fund?</label> */}
            <Controller
              name="middleName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Middle Name"
                  className="bg-white h-12 mt-2"
                />
              )}
            />
          </div>

          <div>
            {/* <label htmlFor="amount">How much do you want to fund?</label> */}
            <Controller
              name="motherMaidenName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Mother Maiden Name"
                  className="bg-white h-12 mt-2"
                />
              )}
            />
          </div>

          <div>
            {/* <label htmlFor="amount">How much do you want to fund?</label> */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="Email Address"
                  className="bg-white h-12 mt-2"
                />
              )}
            />
          </div>

          <div>
            {/* <label htmlFor="amount">How much do you want to fund?</label> */}
            <Controller
              name="residentialAddress"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Residential Address"
                  className="bg-white h-12 mt-2"
                />
              )}
            />
          </div>

          <div>
            {/* <label htmlFor="amount">How much do you want to fund?</label> */}
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Country of Residence"
                  className="bg-white h-12 mt-2"
                />
              )}
            />
          </div>

          <Input
            type="submit"
            value={"Save Changes"}
            className="bg-primary text-white mt-5"
          />
        </div>
      </form>
    </main>
  );
}
