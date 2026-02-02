"use client";

import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { changePasswordService } from "@/app/api/Users"; // You'll need to create this

type ChangePasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function EditPassword() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  
  const { 
    control, 
    handleSubmit, 
    watch, 
    formState: { errors }, 
    reset 
  } = useForm<ChangePasswordForm>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const newPassword = watch("newPassword");

  // Add this service function to your app/api/Users.ts file:
  /*
  export const changePasswordService = async (payload: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const res = await API.post("/user/change-password", payload);
    return res.data;
  };
  */

  const onSubmit = async (data: ChangePasswordForm) => {
    setLoading(true);
    setApiError("");
    setApiSuccess("");

    try {
      // Validate passwords match
      if (data.newPassword !== data.confirmPassword) {
        setApiError("New password and confirmation do not match");
        setLoading(false);
        return;
      }

      // Call the API
      const response = await changePasswordService({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.status === "success") {
        setApiSuccess("Password changed successfully!");
        reset(); // Clear the form
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setApiSuccess("");
        }, 3000);
      } else {
        setApiError(response.message || "Failed to change password");
      }
      
    } catch (error: any) {
      console.error("Password change failed:", error);
      setApiError(error.response?.data?.message || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h2 className="text-primary text-2xl font-medium">Change Password</h2>
      <hr className="border-[#455A6433] my-6" />

      <div className="mt-10">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 w-[60%]">
          
          {/* Success Message */}
          {apiSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-600 text-sm">{apiSuccess}</p>
            </div>
          )}
          
          {/* Error Message */}
          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600 text-sm">{apiError}</p>
            </div>
          )}

          {/* Current Password */}
          <div className="flex items-center gap-5">
            <label htmlFor="currentPassword" className="text-nowrap w-3/8">
              Current Password:
            </label>
            <div className="flex-1">
              <Controller
                name="currentPassword"
                control={control}
                rules={{ 
                  required: "Current password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                }}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter current password"
                      className="bg-white h-12"
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* New Password */}
          <div className="flex items-center gap-5">
            <label htmlFor="newPassword" className="text-nowrap w-3/8">
              New Password:
            </label>
            <div className="flex-1">
              <Controller
                name="newPassword"
                control={control}
                rules={{ 
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  },
                  validate: (value) => {
                    if (value === watch("currentPassword")) {
                      return "New password must be different from current password";
                    }
                    return true;
                  }
                }}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter new password"
                      className="bg-white h-12"
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex items-center gap-5">
            <label htmlFor="confirmPassword" className="text-nowrap w-3/8">
              Confirm Password:
            </label>
            <div className="flex-1">
              <Controller
                name="confirmPassword"
                control={control}
                rules={{ 
                  required: "Please confirm your new password",
                  validate: (value) => 
                    value === newPassword || "Passwords do not match"
                }}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirm new password"
                      className="bg-white h-12"
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-end justify-center w-full">
            <Input
              type="submit"
              value={loading ? "Changing Password..." : "Save Changes"}
              className={`bg-primary text-white mt-7 w-5/8 cursor-pointer ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </main>
  );
}