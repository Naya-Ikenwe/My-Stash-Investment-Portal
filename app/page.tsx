"use client";

import Image from "next/image";
import CardWrapper from "./components/CardWrapper";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import AuthWrapper from "./components/auth/AuthWrapper";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <AuthWrapper>
      <main className="flex items-center justify-center">
        <div className="flex flex-col gap-5 items-center ">
          <span className="text-center">
            <h2 className="header-one">Back to business</h2>
            <p>Lets get you signed in</p>
          </span>

          <CardWrapper className="px-28 py-10">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full inputs"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full inputs"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Link href={"forget-password"} className="text-primary">
                Forgot Password
              </Link>

              <div className="flex items-center mt-5 justify-between">
                <p>
                  New User?{" "}
                  <Link href={"/sign-up"} className="text-primary">
                    Create Account
                  </Link>
                </p>

                <Link
                  href={"/dashboard"}
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded mt-2  transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </form>
          </CardWrapper>
        </div>
      </main>
    </AuthWrapper>
  );
}
