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
import Link from "next/link";
import { RxDividerVertical } from "react-icons/rx";
import { useState } from "react";
import { signupService, verifyEmail } from "@/app/api/Users";
import { GoEye, GoEyeClosed } from "react-icons/go";
import AuthWrapper from "@/app/components/auth/AuthWrapper";
import CardWrapper from "@/app/components/CardWrapper";

type SignupFormInputs = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
  hearAboutUs?: string;
};

export default function SignUpPage() {
  const { control, handleSubmit, watch } = useForm();
  const password = watch("password");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setApiError(" ");

      console.log("submitting form: ", data);

      const res = await signupService(data);
      // const vEmail = await verifyEmail()
      console.log("signup success:", res);
    } catch (err: any) {
      console.error(err);
      setApiError(err.response.data.message || "signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper className="flex gap-10 -mt-10">
      <main className="flex gap-20">
        <CardWrapper className="px-8 py-8 flex flex-col gap-4 w-[628px]">
          <div>
            <h3 className="text-primary text-[30px] font-medium">
              Create your profile
            </h3>
            <p>
              Enter the following details and set a secure password. This helps
              us to keep your account safe and ready for future logins.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <div className="flex gap-4">
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
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
                rules={{ required: true }}
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
                rules={{ required: true }}
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
                rules={{ required: true }}
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
              rules={{ required: true }}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <GoEye /> : <GoEyeClosed />}
                  </button>
                </div>
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: true,
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
              render={({ field, fieldState }) => (
                <>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Confirm Password"
                      type={showPassword ? "text" : "password"}
                      className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <GoEye /> : <GoEyeClosed />}
                    </button>
                  </div>
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
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

            {/* API Error */}
            {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

            <Input
              type="submit"
              value={loading ? "Creating...." : "Create Account"}
              disabled={loading}
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
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white bg-primary`}
              >
                1
              </p>
              <p>Create Your Account</p>
            </div>

            <div className="w-8 h-8 flex items-center justify-center">
              <RxDividerVertical size={24} className="text-[#455A64A3]" />
            </div>

            <div className="flex gap-1 items-center">
              <p className="w-8 h-8 flex items-center justify-center rounded-full border text-[#455A64A3]">
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
