import Link from "next/link";
import CardWrapper from "./CardWrapper";
import { IoIosArrowBack } from "react-icons/io";
import { Controller, useForm } from "react-hook-form";
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

export default function CreatePlanForm({ onBack }: { onBack: () => void }) {
  const { control } = useForm();

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

        <form action="" className="flex flex-col gap-5">
          <div>
            <label htmlFor="planName">Give your plan a name</label>
            <Controller
              name="planName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
                />
              )}
            />
          </div>

          <div>
            <label htmlFor="amount">How much do you want to fund?</label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <Input {...field} className="bg-white h-12 mt-2" />
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
                  value={field.value}
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
                      <SelectItem value="6-months">6 Months</SelectItem>
                      <SelectItem value="12-months">12 Months</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Link href={"/create-plan/plan-breakdown"}>
            <Input
              type="submit"
              value={"Continue"}
              className="bg-[#A243DC] text-white mt-5"
            />
          </Link>
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
