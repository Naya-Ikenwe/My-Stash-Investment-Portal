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
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  getUserProfileService,
  updateUserProfileService,
  updateProfileService,
} from "@/app/api/Users";
import FileDropzone from "./FileInput";
import toast from "react-hot-toast";
import { useAuthStore } from "@/app/store/authStore";
import { countries, type TCountryCode } from "countries-list";

// Get formatted country options from the library
const getCountryOptions = () => {
  return Object.entries(countries).map(([code, data]) => ({
    value: code as TCountryCode,
    label: data.name,
  }));
};

// Sort countries alphabetically for the dropdown
const countryOptions = getCountryOptions().sort((a, b) =>
  a.label.localeCompare(b.label),
);

type PersonalForm = {
  gender: string;
  title: string;
  firstName: string;
  lastName: string;
  middleName: string;
  motherMaidenName: string;
  email: string;
  residentialAddress: string;
  country: TCountryCode | "";
  phone: string;
  maritalStatus: string;
};

export default function Personal({ isMobile = false }: { isMobile?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const { user: authUser, setUser } = useAuthStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<PersonalForm>({
    defaultValues: {
      gender: "",
      title: "",
      firstName: "",
      lastName: "",
      middleName: "",
      motherMaidenName: "",
      email: "",
      residentialAddress: "",
      country: "",
      phone: "",
      maritalStatus: "",
    },
    mode: "onChange",
  });

  // Fetch profile data ONCE on component mount
  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        setFetching(true);


        // Get current user from store
        const { user: currentAuthUser, setUser: setAuthUser } =
          useAuthStore.getState();

        const response = await getUserProfileService();
        const latestUser = response.data;



        const userPhone = currentAuthUser?.phone || "";

        // Prepare form data
        const userCountry = latestUser.country as TCountryCode;
        const isValidCountry = userCountry && countries[userCountry];

        const formData: PersonalForm = {
          gender: latestUser?.gender?.toLowerCase() || "",
          title: latestUser.title || "",
          firstName: latestUser.firstName || "",
          lastName: latestUser.lastName || "",
          middleName: latestUser.middleName || "",
          motherMaidenName: latestUser.motherMaidenName || "",
          email: latestUser.email || "",
          residentialAddress: latestUser.address || "",
          country: isValidCountry ? userCountry : "",
          phone: userPhone,
          maritalStatus: latestUser.maritalStatus || "",
        };


        reset(formData);

        // Update auth store with phone preserved
        setAuthUser({
          ...currentAuthUser,
          ...latestUser,
          phone: userPhone,
        });

        // If user has a display photo URL, set preview
        if (latestUser.displayPhotoUrl) {
          setPreviewUrl(latestUser.displayPhotoUrl);
        }


      } catch (error) {
        console.error("❌ Failed to fetch profile:", error);
      } finally {

        setFetching(false);
      }
    };

    fetchLatestProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // EMPTY array - runs once

  // Create a preview URL for selected file and revoke when changed
  useEffect(() => {
    let url: string | null = null;
    if (selectedFile) {
      url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const onSubmit = async (data: PersonalForm) => {
    setLoading(true);
    setApiError("");
    setApiSuccess("");

      try {
      // Build payload. Use FormData if there's a file selected.
      let response: any;

      if (selectedFile) {
        const payload = {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone, // Phone from form
          title: data.title,
          middleName: data.middleName,
          gender: data.gender.toUpperCase(),
          maritalStatus: data.maritalStatus,
          address: data.residentialAddress,
          country: data.country,
          dateOfBirth: undefined,
          displayPhoto: selectedFile,
        } as any;

        response = await updateProfileService(payload);
      } else {
        const payload = {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone, // Phone from form
          title: data.title,
          middleName: data.middleName,
          gender: data.gender.toUpperCase(),
          maritalStatus: data.maritalStatus,
          address: data.residentialAddress,
          country: data.country,
        };

        response = await updateUserProfileService(payload);
      }

      setApiSuccess("Profile updated successfully!");

      // Update auth store with new data INCLUDING PHONE
      if (response?.data) {
        setUser(response.data);
      }

      // If response contains displayPhotoUrl, update preview
      if (response?.data?.displayPhotoUrl) {
        setPreviewUrl(response.data.displayPhotoUrl);
      }
      toast.success("Profile updated successfully");
    } catch (error: any) {
      setApiError(error.response?.data?.message || "Failed to update profile");
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col gap-10">
      <div>
        <p className="text-[#455A64] font-medium text-[16px] mb-2">
          Personal Information
        </p>
        <hr className="border-[#455A6433]" />
      </div>

      {fetching && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-600">Loading profile data...</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={isMobile ? "flex flex-col gap-6 w-full" : "flex gap-12 w-[80%]"}>
        {/* Left Column */}
        <div className={isMobile ? "w-full flex flex-col gap-4" : "w-2/5 flex flex-col gap-4"}>
          <div className="flex items-center gap-3">
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              className="w-28 h-28 relative rounded-full overflow-hidden bg-[#F7F7F7] cursor-pointer"
              aria-label="Change profile photo"
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <Image
                  src={'/images/profile-pic.png'}
                  alt="profile-pic"
                  width={isMobile ? 120 : 150}
                  height={isMobile ? 120 : 150}
                />
              )}

              <div className="absolute right-0 bottom-0 bg-white/80 rounded-full p-1 m-2">
                <p className="text-xs text-[#455A64]">Edit</p>
              </div>
            </div>

            {/* Hidden file input triggered when clicking the image */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.jpeg,.jpg,.png"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                // basic validation: size <= 5MB and image mime type
                const maxSize = 5 * 1024 * 1024;
                if (file.size > maxSize) {
                  toast.error("File is too large. Max size 5MB.");
                  return;
                }
                if (!file.type.startsWith("image/")) {
                  toast.error("Invalid file type. Please select an image.");
                  return;
                }
                setSelectedFile(file);
              }}
            />

            <p>
              {authUser?.firstName} {authUser?.lastName}
            </p>
          </div>

          {apiSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-600 text-sm">{apiSuccess}</p>
            </div>
          )}

          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600 text-sm">{apiError}</p>
            </div>
          )}

          <Link
            href={"/dashboard/profile/edit-password"}
            className="bg-primary text-white py-4 w-full text-center rounded-xl"
          >
            Change Password
          </Link>
        </div>

        {/* Right Column - Form Fields */}
        <div className={isMobile ? "w-full flex flex-col gap-5" : "w-3/5 flex flex-col gap-5"}>
          {isDirty && (
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
              ⚠️ You have unsaved changes
            </div>
          )}

          {/* Gender & Title */}
          <div className={isMobile ? "flex flex-col gap-4" : "flex gap-5"}>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={fetching}
                >
                  <SelectTrigger className="w-full bg-white text-black min-h-12 mt-2">
                    <SelectValue
                      placeholder={fetching ? "Loading..." : "Gender"}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={fetching}
                >
                  <SelectTrigger className="w-full bg-white text-black min-h-12 mt-2">
                    <SelectValue
                      placeholder={fetching ? "Loading..." : "Title"}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectItem value="mr">Mr.</SelectItem>
                      <SelectItem value="mrs">Mrs.</SelectItem>
                      <SelectItem value="miss">Miss</SelectItem>
                      <SelectItem value="dr">Dr.</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Phone */}
          <div>
            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <Input
                    {...field}
                    placeholder="Phone Number"
                    className="bg-white h-12 mt-2"
                    disabled={fetching}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* First Name */}
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="First Name"
                className="bg-white h-12 mt-2"
                disabled={fetching}
              />
            )}
          />

          {/* Last Name */}
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Last Name"
                className="bg-white h-12 mt-2"
                disabled={fetching}
              />
            )}
          />

          {/* Middle Name */}
          <Controller
            name="middleName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Middle Name"
                className="bg-white h-12 mt-2"
                disabled={fetching}
              />
            )}
          />

          {/* Email (Read-only) */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                placeholder="Email Address"
                className="bg-white h-12 mt-2"
                readOnly
                disabled={fetching}
              />
            )}
          />

          {/* Residential Address */}
          <Controller
            name="residentialAddress"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Residential Address"
                className="bg-white h-12 mt-2"
                disabled={fetching}
              />
            )}
          />

          {/* Country */}
          <div>
            <Controller
              name="country"
              control={control}
              rules={{
                required: "Country is required",
                validate: (value) => {
                  if (!value) return "Country is required";
                  const isValid = value && countries[value as TCountryCode];
                  return isValid ? true : "Please select a valid country";
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={fetching}
                  >
                    <SelectTrigger className="w-full bg-white text-black min-h-12 mt-2">
                      <SelectValue placeholder="Select Country">
                        {field.value && countries[field.value as TCountryCode]
                          ? countries[field.value as TCountryCode].name
                          : "Select Country"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white max-h-60 overflow-y-auto">
                      <SelectGroup>
                        {countryOptions.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* Marital Status */}
          <Controller
            name="maritalStatus"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={fetching}
              >
                <SelectTrigger className="w-full bg-white text-black min-h-12 mt-2">
                  <SelectValue
                    placeholder={fetching ? "Loading..." : "Marital Status"}
                  />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          {/* Submit Button */}
          <Input
            type="submit"
            value={loading ? "Saving..." : "Save Changes"}
            className={`bg-primary text-white mt-5 cursor-pointer ${isMobile ? "w-full" : ""} ${loading || fetching ? "opacity-70" : ""}`}
            disabled={loading || fetching || (!isDirty && !selectedFile)}
          />
        </div>
      </form>
    </main>
  );
}
