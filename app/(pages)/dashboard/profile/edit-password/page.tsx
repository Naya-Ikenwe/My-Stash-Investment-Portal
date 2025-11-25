"use client";

import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";

export default function EditPassword() {
  const { control } = useForm();
  return (
    <main>
      <h2 className="text-primary text-2xl font-medium">Change Password</h2>
      <hr className="border-[#455A6433] my-6" />

      <div className="mt-10">
        <form action="" className="flex flex-col gap-7 w-[60%]">
          <div className="flex items-center gap-5">
            <label htmlFor="amount" className="text-nowrap w-3/8">
              Current Password:
            </label>
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <Input
                  {...field} type="password"
                  // placeholder="Middle Name"
                  className="bg-white h-12"
                />
              )}
            />
          </div>

          <div className="flex items-center gap-5">
            <label htmlFor="amount" className="text-nowrap w-3/8">
              New Password:
            </label>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  // placeholder="Middle Name"
                  className="bg-white h-12"
                />
              )}
            />
          </div>

          <div className="flex items-center gap-5">
            <label htmlFor="amount" className="text-nowrap w-3/8">
              Confirm Password:
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  // placeholder="Middle Name"
                  className="bg-white h-12"
                />
              )}
            />
          </div>

          <div className="flex items-end justify-center w-full">
            <Input
              type="submit"
              value={"Save Changes"}
              className="bg-primary text-white mt-7 w-5/8"
            />
          </div>
        </form>

        <div></div>
      </div>
    </main>
  );
}
