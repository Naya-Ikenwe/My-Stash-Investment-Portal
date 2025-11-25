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
import { Controller, useForm } from "react-hook-form";

export default function NextofKin() {
  const { control } = useForm();
  const labelClass = 'text-primary font-medium text-lg'

  return (
    <main className="flex flex-col gap-10">
      <div>
        <p className="text-[#455A64] font-medium text-[16px] mb-2">
          Next of Kin
        </p>
        <hr className="border-[#455A6433]" />
      </div>

      <form action="" className="flex flex-col gap-7 w-[60%]">
        <div className="flex items-center gap-5">
          <label
            htmlFor="amount"
            className="text-nowrap w-3/8 text-primary font-medium text-lg "
          >
            Full Name
          </label>
          <div className="flex gap-5 w-full">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="First Name"
                  className="bg-white h-12"
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="Last Name"
                  className="bg-white h-12"
                />
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <label
            htmlFor="amount"
            className="text-nowrap w-3/8 text-primary font-medium text-lg"
          >
            Email Addess
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                placeholder="Email Address"
                className="bg-white h-12"
              />
            )}
          />
        </div>

        <div className="flex items-center gap-5">
          <label
            htmlFor="amount"
            className="text-nowrap w-3/8 text-primary font-medium text-lg"
          >
            Phone Number
          </label>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                placeholder="Phone Number"
                className="bg-white h-12"
              />
            )}
          />
        </div>

        <div className="flex items-center gap-5">
          <label
            htmlFor="amount"
            className="text-nowrap w-3/8 text-primary font-medium text-lg"
          >
            Relationship
          </label>
          <Controller
            name="relationship"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full bg-white text-white min-h-12 mt-2 py-0">
                  <SelectValue
                    placeholder="Select Relationship"
                    className="text-black "
                  />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectItem value="father">Father</SelectItem>
                    <SelectItem value="mother">Mother</SelectItem>
                    <SelectItem value="siblings">Siblings</SelectItem>
                    <SelectItem value="cousin">Cousin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />{" "}
        </div>

        <div className="flex items-end justify-center w-full">
          <Input
            type="submit"
            value={"Save Changes"}
            className="bg-primary text-white mt-7 w-5/8"
          />
        </div>
      </form>
    </main>
  );
}
