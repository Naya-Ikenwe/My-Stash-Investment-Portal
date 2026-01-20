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
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type PersonalForm = {
  gender: string;
  title: string;
  firstName: string;
  lastName: string;
  middleName: string;
  motherMaidenName: string;
  email: string;
  residentialAddress: string;
  country: string;
};

type PersonalProps = {
  user: PersonalForm | null;
};

export default function Personal({ user }: PersonalProps) {
  const { control, handleSubmit, reset } = useForm<PersonalForm>({
    defaultValues: {
      gender: "",
      title: "",
      firstName: "",
      lastName: "",
      middleName: "",
      motherMaidenName: "",
      email: "",
      residentialAddress: "",
      country: "",
    },
  });

  useEffect(() => {
    if (!user) return;
    console.log("USER GENDER:", user?.gender);
    console.log("RAW:", JSON.stringify(user.gender));

    reset({
      gender: user?.gender?.trim().toLowerCase() || undefined,
      title: user.title ?? "",
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      middleName: user.middleName ?? "",
      motherMaidenName: user.motherMaidenName ?? "",
      email: user.email ?? "",
      residentialAddress: user.residentialAddress ?? "",
      country: user.country ?? "",
    });
  }, [user, reset]);

  const onSubmit = (data: PersonalForm) => {
    console.log("UPDATE PAYLOAD:", data);
    // call update API here
  };

  return (
    <main className="flex flex-col gap-10">
      <div>
        <p className="text-[#455A64] font-medium text-[16px] mb-2">
          Personal Information
        </p>
        <hr className="border-[#455A6433]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-12 w-[80%]">
        <div className="w-2/5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={"/images/profile-pic.png"}
              alt="profile-pic"
              width={150}
              height={150}
            />
            <p>
              {user?.firstName} {user?.lastName}
            </p>
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full bg-white text-black min-h-12 mt-2">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
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
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="First Name"
                  className="bg-white h-12 mt-2"
                />
              )}
            />
          </div>

          <div>
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
