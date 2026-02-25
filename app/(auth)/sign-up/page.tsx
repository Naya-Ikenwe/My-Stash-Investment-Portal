"use client";

import { Controller, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoEye, GoEyeClosed } from "react-icons/go";
import Link from "next/link";

import AuthWrapper from "@/app/components/auth/AuthWrapper";
import CardWrapper from "@/app/components/CardWrapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { signupService } from "@/app/api/Users";
import { useAuthStore } from "@/app/store/authStore";
import { detectDeviceInfo, getOrCreateDeviceId } from "@/lib/deviceUtils";
import { RxDividerVertical } from "react-icons/rx";

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
  const { control, handleSubmit, watch, formState: { errors } } = useForm<SignupFormInputs>({
    defaultValues: {
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
      hearAboutUs: "",
    },
  });
  const password = watch("password");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const router = useRouter();
  const { setUser, setAccessToken, setRefreshToken, deviceId, deviceName, setDeviceId, setDeviceName } = useAuthStore();

  // Initialize device info on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get or create persistent device ID
      const existingDeviceId = getOrCreateDeviceId();
      if (!deviceId && existingDeviceId) {
        setDeviceId(existingDeviceId);
      }
      
      // Detect device name if not already set
      if (!deviceName) {
        const { deviceName: detectedName } = detectDeviceInfo();
        setDeviceName(detectedName);
      }
    }
  }, [deviceId, deviceName, setDeviceId, setDeviceName]);

  // Remove localStorage reference from onSubmit

const onSubmit = async (data: SignupFormInputs) => {
  try {
    setLoading(true);
    setApiError("");

    // Get device info from store or initialize
    let currentDeviceId = deviceId;
    let currentDeviceName = deviceName;
    
    if (!currentDeviceId && typeof window !== 'undefined') {
      currentDeviceId = getOrCreateDeviceId();
      setDeviceId(currentDeviceId);
    }
    
    if (!currentDeviceName && typeof window !== 'undefined') {
      const { deviceName: detectedName } = detectDeviceInfo();
      currentDeviceName = detectedName;
      setDeviceName(currentDeviceName);
    }

    // Create payload with device info
    const payload = {
      ...data,
      deviceId: currentDeviceId || 'unknown-device',
      deviceName: currentDeviceName || 'Web Browser'
    };

    const res = await signupService(payload);
    const { user, access_token, refresh_token } = res.data;

    // ✅ Auth store already gets updated by backend response
    setUser(user);
    setAccessToken(access_token);
    setRefreshToken(refresh_token);

    // Pass phone number to verify-email page via URL query
    const params = new URLSearchParams({
      phone: data.phone,
      email: data.email
    });
    router.push(`/sign-up/verify-email?${params.toString()}`);
  } catch (err: any) {
    console.error(err);
    setApiError(err?.response?.data?.message || "Signup failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthWrapper className="flex flex-col lg:flex-row gap-6 lg:gap-10 mt-0 lg:-mt-10">
      <main className="flex flex-col lg:flex-row gap-6 lg:gap-20 w-full">
        <CardWrapper className="px-6 lg:px-8 py-8 lg:py-8 flex flex-col gap-4 w-full lg:w-[628px]">
          <div>
            <h3 className="text-primary font-heading text-[30px] font-medium">
              Create your profile
            </h3>
            <p>
              Enter the following details and set a secure password. This helps
              us keep your account safe and ready for future logins.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <div className="flex gap-4">
              <Controller
                name="email"
                control={control}
                rules={{ 
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address"
                  }
                }}
                render={({ field, fieldState }) => (
                  <div className="flex-1">
                    <Input {...field} placeholder="Email Address" className="bg-white h-12 mt-2" />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="phone"
                control={control}
                rules={{ 
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9+\-\s]+$/,
                    message: "Invalid phone number"
                  }
                }}
                render={({ field, fieldState }) => (
                  <div className="flex-1">
                    <Input {...field} placeholder="Phone Number" className="bg-white h-12 mt-2" />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Controller
                name="firstName"
                control={control}
                rules={{ required: "First name is required" }}
                render={({ field, fieldState }) => (
                  <div className="flex-1">
                    <Input {...field} placeholder="First Name" className="bg-white h-12 mt-2" />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="lastName"
                control={control}
                rules={{ required: "Last name is required" }}
                render={({ field, fieldState }) => (
                  <div className="flex-1">
                    <Input {...field} placeholder="Last Name" className="bg-white h-12 mt-2" />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <Controller
              name="password"
              control={control}
              rules={{ 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              }}
              render={({ field, fieldState }) => (
                <div>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      className="bg-white h-12 mt-2"
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
                    <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Confirm password is required",
                validate: (value) => value === password || "Passwords do not match",
              }}
              render={({ field, fieldState }) => (
                <div>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Confirm Password"
                      type={showPassword ? "text" : "password"}
                      className="bg-white h-12 mt-2"
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
                    <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="referralCode"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Referral code (optional)" className="bg-white h-12 mt-2" />
              )}
            />

            <Controller
              name="hearAboutUs"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full bg-white h-12 mt-2">
                    <SelectValue placeholder="How did you hear about us?" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectItem value="internet">Internet Search</SelectItem>
                      <SelectItem value="friend">Friend/Family</SelectItem>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="advertisement">Advertisement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            {apiError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-red-600 text-sm">{apiError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white h-12 w-full sm:w-1/4 mt-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <article className="flex flex-col text-center gap-2 items-center mt-3">
            <p>
              Already have an account?{" "}
              <Link href={"/"} className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </article>
        </CardWrapper>

        <aside className="flex flex-col gap-9 w-full lg:w-[453px]">
          <h2 className="text-primary text-[34px] font-heading">
            Lets get you set up in just 2 steps
          </h2>

          <div>
            <div className="flex gap-1 items-center">
              <p className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white">
                1
              </p>
              <p>Create Your Account</p>
            </div>

            <RxDividerVertical size={24} className="mx-1 text-gray-400" />

            <div className="flex gap-1 items-center">
              <p className="w-8 h-8 flex items-center justify-center rounded-full border">
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