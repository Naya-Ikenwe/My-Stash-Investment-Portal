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
import { useState, useEffect } from "react";
import { getNextOfKin, saveNextOfKin } from "@/app/api/Users";

// Define the form data type
type NextOfKinFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
};

export default function NextofKin({ isMobile = false }: { isMobile?: boolean }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  const { 
    control, 
    handleSubmit, 
    reset, 
    formState: { isDirty, errors }
  } = useForm<NextOfKinFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      relationship: ""
    }
  });

  // Fetch saved next of kin data on component mount
  useEffect(() => {
    const fetchNextOfKinData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        

        const savedData = await getNextOfKin();
        
        if (savedData) {

          setHasSavedData(true);
          
          // Pre-fill form with saved data
          reset({
            firstName: savedData.firstName || "",
            lastName: savedData.lastName || "",
            email: savedData.email || "",
            phone: savedData.phone || "",
            relationship: savedData.relationship || ""
          });
        } else {

          setHasSavedData(false);
        }
      } catch (error: any) {
        console.error("❌ Error fetching next of kin:", error);
        setErrorMessage(error.message || "Failed to load next of kin details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNextOfKinData();
  }, [reset]);

  // Handle form submission
  const onSubmit = async (data: NextOfKinFormData) => {
    try {
      setSaveStatus("saving");
      setErrorMessage("");
      

      
      const savedData = await saveNextOfKin(data);
      

      setHasSavedData(true);
      setSaveStatus("success");
      
      // Reset form dirty state since we just saved
      reset(data, { keepValues: true });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus("idle"), 3000);
      
    } catch (error: any) {
      console.error("❌ Error saving next of kin:", error);
      setSaveStatus("error");
      setErrorMessage(error.message || "Failed to save next of kin details");
    }
  };

  const labelClass = 'text-primary font-medium text-lg';

  if (isLoading) {
    return (
      <main className="flex flex-col gap-10">
        <div>
          <p className="text-[#455A64] font-medium text-[16px] mb-2">Next of Kin</p>
          <hr className="border-[#455A6433]" />
        </div>
        
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading next of kin details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-10">
      <div>
        <p className="text-[#455A64] font-medium text-[16px] mb-2">
          Next of Kin {hasSavedData && <span className="text-sm text-green-600">(Saved)</span>}
        </p>
        <hr className="border-[#455A6433]" />
      </div>

      {/* Status Messages */}
      {saveStatus === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">✓ Next of kin details saved successfully!</p>
        </div>
      )}
      
      {saveStatus === "error" && errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">❌ {errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={isMobile ? "flex flex-col gap-7 w-full" : "flex flex-col gap-7 w-[60%]"}>
        {/* Full Name - FIXED ALIGNMENT */}
        <div className={isMobile ? "flex flex-col gap-3" : "flex items-center gap-5"}>
          <label className={isMobile ? "w-full text-primary font-medium text-lg" : "text-nowrap w-3/8 text-primary font-medium text-lg"}>
            Full Name
          </label>
          <div className="flex gap-5 w-full">
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "First name is required" }}
              render={({ field }) => (
                <div className="flex-1">
                  <Input
                    {...field}
                    placeholder="First Name"
                    className="bg-white h-12"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>
              )}
            />
            <Controller
              name="lastName"
              control={control}
              rules={{ required: "Last name is required" }}
              render={({ field }) => (
                <div className="flex-1">
                  <Input
                    {...field}
                    placeholder="Last Name"
                    className="bg-white h-12"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {/* Email Address - FIXED ALIGNMENT */}
        <div className={isMobile ? "flex flex-col gap-3" : "flex items-center gap-5"}>
          <label className={isMobile ? "w-full text-primary font-medium text-lg" : "text-nowrap w-3/8 text-primary font-medium text-lg"}>
            Email Address
          </label>
          <div className="w-full">
            <Controller
              name="email"
              control={control}
              rules={{ 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              }}
              render={({ field }) => (
                <div className="w-full">
                  <Input
                    {...field}
                    type="email"
                    placeholder="Email Address"
                    className="bg-white h-12 w-full"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {/* Phone Number - FIXED ALIGNMENT */}
        <div className={isMobile ? "flex flex-col gap-3" : "flex items-center gap-5"}>
          <label className={isMobile ? "w-full text-primary font-medium text-lg" : "text-nowrap w-3/8 text-primary font-medium text-lg"}>
            Phone Number
          </label>
          <div className="w-full">
            <Controller
              name="phone"
              control={control}
              rules={{ 
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9+-\s]+$/,
                  message: "Invalid phone number"
                }
              }}
              render={({ field }) => (
                <div className="w-full">
                  <Input
                    {...field}
                    placeholder="Phone Number"
                    className="bg-white h-12 w-full"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {/* Relationship - FIXED ALIGNMENT */}
        <div className={isMobile ? "flex flex-col gap-3" : "flex items-center gap-5"}>
          <label className={isMobile ? "w-full text-primary font-medium text-lg" : "text-nowrap w-3/8 text-primary font-medium text-lg"}>
            Relationship
          </label>
          <div className="w-full">
            <Controller
              name="relationship"
              control={control}
              rules={{ required: "Relationship is required" }}
              render={({ field }) => (
                <div className="w-full">
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <SelectTrigger className="w-full bg-white min-h-12 py-0">
                      <SelectValue
                        placeholder="Select Relationship"
                        className="text-black"
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        <SelectItem value="father">Father</SelectItem>
                        <SelectItem value="mother">Mother</SelectItem>
                        <SelectItem value="siblings">Siblings</SelectItem>
                        <SelectItem value="cousin">Cousin</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.relationship && (
                    <p className="text-red-500 text-sm mt-1">{errors.relationship.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-center w-full mt-4">
          <Input
            type="submit"
            value={saveStatus === "saving" ? "Saving..." : "Save Changes"}
            disabled={saveStatus === "saving" || !isDirty}
            className={`bg-primary text-white mt-4 ${isMobile ? "w-full" : "w-5/8"} cursor-pointer transition-opacity ${
              saveStatus === "saving" || !isDirty ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-dark"
            }`}
          />
        </div>
        
        {/* Form Status */}
        <div className="text-center text-sm text-gray-500">
          {!isDirty && hasSavedData && (
            <p>✓ Your next of kin details are saved. Edit above to make changes.</p>
          )}
          {!isDirty && !hasSavedData && (
            <p>Fill in the details above to save your next of kin information.</p>
          )}
          {isDirty && (
            <p className="text-blue-600">You have unsaved changes</p>
          )}
        </div>
      </form>
    </main>
  );
}