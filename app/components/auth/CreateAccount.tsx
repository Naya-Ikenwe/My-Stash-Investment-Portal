import { Controller, useForm } from "react-hook-form";
import CardWrapper from "../CardWrapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function CreateAccount({ onNext }: { onNext: () => void }) {
  const { control, handleSubmit } = useForm();
  const onSubmit = () => {
    // console.log("Form submitted", data);
    onNext(); // <— switch to verify step
  };

  return (
    <CardWrapper className="px-8 py-8 flex flex-col gap-4">
      <div>
        <h3 className="text-primary text-[30px] font-medium">
          Create your profile
        </h3>
        <p>
          Enter the following details and set a secure password. This helps us
          to keep your account safe and ready for future logins.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="flex gap-4">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Email Address"
                className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Phone Number"
                className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
              />
            )}
          />
        </div>

        <div className="flex gap-4">
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="First Name"
                className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Last Name"
                className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
              />
            )}
          />
        </div>

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Password"
              className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Confirm Password"
              className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
            />
          )}
        />

        <Controller
          name="referralCode"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Referral code"
              className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
            />
          )}
        />

        <Controller
          name="hearAboutUs"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full bg-white min-h-12 mt-2 py-0">
                <SelectValue
                  placeholder="How did you hear about us?"
                  className="text-black "
                />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  <SelectItem value="internet">Internet</SelectItem>
                  <SelectItem value="friend">Friends</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />

        <Input
          type="submit"
          value={"Create Account"}
          className="bg-primary text-white w-1/4 mt-4 cursor-pointer"
        />
      </form>

      <article className="flex flex-col text-center gap-2 items-center mt-3">
        <p>
          Already have an account?{" "}
          <Link href={"/"} className="text-primary font-medium">
            {" "}
            Sign in
          </Link>
        </p>
        <p>
          By tapping on “Create Account”, you agree to our{" "}
          <Link href={"#"} className="text-primary font-medium">
            Terms and Condition{" "}
          </Link>
          and{" "}
          <Link href={"#"} className="text-primary font-medium">
            Privacy Policy
          </Link>
        </p>
      </article>
    </CardWrapper>
  );
}
