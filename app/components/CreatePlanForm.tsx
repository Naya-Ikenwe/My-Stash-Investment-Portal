"use client";

import CardWrapper from "./CardWrapper";
import { IoIosArrowBack } from "react-icons/io";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { CreateFormPlanProps, PlanFormData } from "../types/plan";

export default function CreatePlanForm({
  onBack,
  onContinue,
  form,
}: CreateFormPlanProps) {
  const { control, handleSubmit } = form;

  const onSubmit = (data: PlanFormData) => {
    const { duration, startDate } = form.getValues();

    const endDate =
      duration === 6
        ? new Date(startDate).setMonth(new Date(startDate).getMonth() + 6)
        : new Date(startDate).setMonth(new Date(startDate).getMonth() + 12);

    form.setValue("endDate", endDate);

    console.log("form data: ", data);
    onContinue();
  };

  return (
    <main className="flex items-center -my-10">
      <CardWrapper className="flex flex-col items-center justify-center p-10 gap-8 w-[700px] min-h-[450px] relative">
        <button
          onClick={onBack}
          className="bg-[#E7E7E7] p-2 rounded-full absolute top-5 left-5 cursor-pointer"
        >
          <IoIosArrowBack />
        </button>

        <p className="text-2xl font-medium">Hi, create your portfolio</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label htmlFor="name">Give your plan a name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  required
                  className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
                />
              )}
            />
          </div>

          <div>
            <label htmlFor="principal">How much do you want to fund?</label>
            <Controller
              name="principal"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  required
                  className="bg-white h-12 mt-2"
                />
              )}
            />
          </div>

          <div>
            <label htmlFor="duration">Select duration</label>
            <Controller
              name="duration"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  // defaultValue={}
                  // value={field.value}
                  // type="number"
                  required
                >
                  <SelectTrigger className="w-full bg-white min-h-12 mt-2 py-0">
                    <SelectValue
                      // placeholder="Select duration"
                      className="text-black "
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectLabel>Select duration</SelectLabel>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">12 Months</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Input
            type="submit"
            value={"Continue"}
            className="bg-[#A243DC] text-white mt-5 cursor-pointer hover:bg-[#8a38c2] transition-colors"
          />
        </form>
      </CardWrapper>

      <div>
        <Image
          src={"/plan-form.svg"}
          alt="illustration"
          width={200}
          height={200}
          className="w-full h-auto"
        />
      </div>
    </main>
  );
}
