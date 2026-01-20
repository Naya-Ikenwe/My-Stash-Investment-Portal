"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { loginService } from "@/app/api/Users";
import AuthWrapper from "@/app/components/auth/AuthWrapper";
import CardWrapper from "@/app/components/CardWrapper";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const { setUser, setAccessToken, setRefreshToken } = useAuthStore();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      setLoading(true);
      setApiError("");

      const res = await loginService(data);
      console.log("login success:", res);

      const { user, access_token, refresh_token } = res.data;

      setUser(user);
      setAccessToken(access_token);
      setRefreshToken(refresh_token);

      console.log("AUTH STATE AFTER LOGIN:", useAuthStore.getState());

      router.push("/dashboard");
    } catch (err: any) {
      setApiError(err.response.data.message || "login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <main className="flex items-center justify-center">
        <div className="flex flex-col gap-5 items-center ">
          <span className="text-center">
            <h2 className="header-one font-heading">Back to business</h2>
            <p className="text-[20px] mt-2">Lets get you signed in</p>
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
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full inputs"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <GoEye /> : <GoEyeClosed />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Link href={"forget-password"} className="text-primary font-medium">
                Forgot Password
              </Link>

              <div className="flex items-center mt-5 justify-between">
                <p>
                  New User?{" "}
                  <Link href={"/sign-up"} className="text-primary">
                    Create Account
                  </Link>
                </p>

                <button
                  type="submit"
                  className="bg-primary font-medium text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </div>

              {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
            </form>
          </CardWrapper>
        </div>
      </main>
    </AuthWrapper>
  );
}
