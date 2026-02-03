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
import { SiCommerzbank } from "react-icons/si";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  getKycDocumentsService,
  updateKycInfoService,
  getSecurityQuestionsService,
  setSecurityAnswerService,
  setUserPinService,
  changePinService,
  getUserBankAccountsService,
} from "@/app/api/Users";
import API from "@/lib/axiosInstance";

type BankAccount = {
  id: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  createdAt: string;
};

type SecurityQuestion = {
  id: string;
  question: string;
  isActive: boolean;
  createdAt: string;
};

type SavedSecurityQuestion = {
  id?: string;
  questionId: string;
  createdAt?: string;
  answer?: string;
  question?: {
    id: string;
    question: string;
    isActive: boolean;
    createdAt: string;
  };
};

type FormData = {
  bvn: string;
  sourceOfIncome: string;
  nin: string;
  securityQuestionId: string;
  securityAnswer: string;
  pin?: string;
  oldPin?: string;
  newPin?: string;
};

export default function Authorization() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [securityQuestions, setSecurityQuestions] = useState<
    SecurityQuestion[]
  >([]);
  const [savedSecurityQuestion, setSavedSecurityQuestion] =
    useState<SavedSecurityQuestion | null>(null);
  const [hasExistingBvn, setHasExistingBvn] = useState(false);
  const [pinMode, setPinMode] = useState<"none" | "setup" | "change">("none");
  const [hasPin, setHasPin] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      bvn: "",
      sourceOfIncome: "",
      nin: "",
      securityQuestionId: "",
      securityAnswer: "",
      pin: "",
      oldPin: "",
      newPin: "",
    },
    mode: "onChange",
  });

  // Fetch all data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setFetching(true);

        // 1. Fetch KYC data (BVN, NIN, Source of Income)
        const kycResponse = await getKycDocumentsService();
        if (kycResponse.data) {
          const hasBvn = !!kycResponse.data.bvn;
          setHasExistingBvn(hasBvn);

          reset({
            bvn: kycResponse.data.bvn || "",
            sourceOfIncome: kycResponse.data.sourceOfIncome || "",
            nin: kycResponse.data.nin || "",
            securityQuestionId: "",
            securityAnswer: "", // EMPTY as requested
            pin: "", // EMPTY as requested
            oldPin: "",
            newPin: "",
          });
        }

        // 2. Fetch supported security questions
        try {
          const questionsResponse = await API.get(
            "/security/supported-questions",
          );
          if (questionsResponse.data?.data?.results) {
            setSecurityQuestions(questionsResponse.data.data.results);
          }
        } catch (questionsError) {
          console.error("Failed to fetch security questions:", questionsError);
        }

        // 3. Fetch user's saved security question & answer
        try {
          const securityResponse = await getSecurityQuestionsService();
          if (securityResponse.data?.questionId) {
            setSavedSecurityQuestion(securityResponse.data);
            setValue("securityQuestionId", securityResponse.data.questionId);
            // Answer field remains EMPTY as requested
          }
        } catch (securityError) {
          console.log("No security question saved yet");
        }

        // 4. Fetch bank accounts
        const bankResponse = await getUserBankAccountsService();
        setBankAccount(bankResponse.data);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        setApiError("Failed to load data. Please refresh the page.");
      } finally {
        setFetching(false);
      }
    };

    fetchInitialData();
  }, [reset, setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setApiError("");
    setApiSuccess("");

    try {
      // 1. Update KYC information (BVN, NIN, Source of Income)
      if (data.bvn || data.nin || data.sourceOfIncome) {
        await updateKycInfoService({
          bvn: data.bvn.trim() || undefined,
          nin: data.nin.trim() || undefined,
          sourceOfIncome: data.sourceOfIncome.trim() || undefined,
        });

        if (data.bvn.trim() && !hasExistingBvn) {
          setHasExistingBvn(true);
        }
      }

      // 2. Update security question & answer (if both provided)
      if (data.securityQuestionId && data.securityAnswer.trim()) {
        const response = await setSecurityAnswerService({
          questionId: data.securityQuestionId,
          answer: data.securityAnswer.trim(),
        });

        if (response.data) {
          setSavedSecurityQuestion(response.data);
        }

        // Clear the answer field after successful save
        setValue("securityAnswer", "");
      }

      // 3. Handle PIN based on mode
      if (
        pinMode === "setup" &&
        data.pin &&
        data.pin.length === 4 &&
        /^\d+$/.test(data.pin)
      ) {
        try {
          await setUserPinService({
            pin: data.pin,
          });
          setHasPin(true);
          setPinMode("none");
          setValue("pin", "");
          setApiSuccess("PIN set successfully!");
        } catch (setupError: any) {
          if (
            setupError.response?.status === 400 &&
            setupError.response?.data?.message?.includes("PIN already exists")
          ) {
            // PIN already exists, inform user to use Change PIN
            setHasPin(true);
            setPinMode("none");
            setValue("pin", "");
            setApiError("PIN already exists. Please use 'Change PIN' instead.");
            setLoading(false);
            return;
          }
          throw setupError;
        }
      } else if (pinMode === "change" && data.oldPin && data.newPin) {
        if (
          data.newPin.length === 4 &&
          /^\d+$/.test(data.newPin) &&
          data.oldPin.length === 4 &&
          /^\d+$/.test(data.oldPin)
        ) {
          if (data.oldPin === data.newPin) {
            throw new Error("New PIN cannot be same as old PIN");
          }

          await changePinService({
            oldPin: data.oldPin,
            newPin: data.newPin,
          });

          setPinMode("none");
          setValue("oldPin", "");
          setValue("newPin", "");
          setApiSuccess("PIN changed successfully!");
        }
      }

      // If no PIN was processed but other changes were made
      if (
        !apiSuccess &&
        (data.bvn || data.nin || data.sourceOfIncome || data.securityAnswer)
      ) {
        setApiSuccess("Changes saved successfully!");
      }

      setTimeout(() => setApiSuccess(""), 5000);
    } catch (error: any) {
      console.error("Save failed:", error);
      setApiError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save changes. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const pinValue = watch("pin");
  const oldPinValue = watch("oldPin");
  const newPinValue = watch("newPin");
  const securityAnswerValue = watch("securityAnswer");
  const bvnValue = watch("bvn");

  return (
    <main className="pb-14">
      <div>
        <p className="text-[#455A64] font-medium text-[16px] mb-2">
          Authorization and Security
        </p>
        <hr className="border-[#455A6433]" />

        <p className="text-[#455A64] font-medium mt-8 mb-6">
          Enter the following details correctly
        </p>
      </div>

      {/* Success/Error Messages */}
      {apiSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-600 text-sm">{apiSuccess}</p>
        </div>
      )}

      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600 text-sm">{apiError}</p>
        </div>
      )}

      {fetching ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">Loading your data...</p>
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-3/5 flex flex-col items-center"
          >
            <div className="grid grid-cols-2 gap-5 w-full">
              {/* BVN - Editable if not already set */}
              <Controller
                name="bvn"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      placeholder="Bank Verification Number (BVN)"
                      className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
                      readOnly={hasExistingBvn}
                      maxLength={11}
                    />
                    {hasExistingBvn ? (
                      <p className="text-xs text-gray-500 mt-1">
                        BVN already saved
                      </p>
                    ) : !bvnValue ? (
                      <p className="text-xs text-gray-500 mt-1">
                        Enter your 11-digit BVN
                      </p>
                    ) : bvnValue.length !== 11 ? (
                      <p className="text-xs text-red-500 mt-1">
                        BVN must be 11 digits
                      </p>
                    ) : (
                      <p className="text-xs text-green-500 mt-1">
                        Valid BVN length
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Source of Income */}
              <Controller
                name="sourceOfIncome"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Source of Income"
                    className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
                  />
                )}
              />

              {/* NIN Number */}
              <Controller
                name="nin"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="NIN Number"
                    className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
                    maxLength={11}
                  />
                )}
              />

              {/* Security Question */}
              <div>
                {savedSecurityQuestion && savedSecurityQuestion.question ? (
                  <div className="mb-2">
                    <p className="text-sm font-medium">
                      Your saved security question:
                    </p>
                    <p className="text-sm text-gray-600">
                      {savedSecurityQuestion.question.question}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Select a new question below to change it
                    </p>
                  </div>
                ) : null}

                <Controller
                  name="securityQuestionId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full bg-white min-h-12 mt-2 py-0">
                        <SelectValue
                          placeholder={
                            savedSecurityQuestion
                              ? "Select new question..."
                              : "Select security question"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white max-h-60">
                        <SelectGroup>
                          {securityQuestions.map((q) => (
                            <SelectItem key={q.id} value={q.id}>
                              {q.question}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Security Answer */}
              <Controller
                name="securityAnswer"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      placeholder={
                        savedSecurityQuestion
                          ? "Enter new answer"
                          : "Security Answer"
                      }
                      className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {savedSecurityQuestion && !securityAnswerValue && (
                      <p className="text-xs text-gray-500 mt-1">
                        Enter a new answer to update your security question
                      </p>
                    )}
                  </div>
                )}
              />

              {/* PIN Section - Always show both buttons */}
              <div className="col-span-2 space-y-4">
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={pinMode === "setup" ? "default" : "outline"}
                    className={`flex-1 ${pinMode === "setup" ? "bg-primary" : "border-primary text-primary hover:bg-primary/10"}`}
                    onClick={() => {
                      setPinMode(pinMode === "setup" ? "none" : "setup");
                      if (pinMode !== "setup") {
                        setValue("pin", "");
                      }
                    }}
                  >
                    {pinMode === "setup" ? "Cancel Set PIN" : "Set PIN"}
                  </Button>

                  <Button
                    type="button"
                    variant={pinMode === "change" ? "default" : "outline"}
                    className={`flex-1 ${pinMode === "change" ? "bg-primary" : "border-primary text-primary hover:bg-primary/10"}`}
                    onClick={() => {
                      setPinMode(pinMode === "change" ? "none" : "change");
                      if (pinMode !== "change") {
                        setValue("oldPin", "");
                        setValue("newPin", "");
                      }
                    }}
                  >
                    {pinMode === "change" ? "Cancel Change PIN" : "Change PIN"}
                  </Button>
                </div>

                {/* PIN Setup Fields */}
                {pinMode === "setup" && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <p className="font-medium text-sm">
                      Set up your 4-digit PIN
                    </p>
                    <Controller
                      name="pin"
                      control={control}
                      rules={{
                        required: "PIN is required",
                        pattern: {
                          value: /^\d{4}$/,
                          message: "PIN must be exactly 4 digits",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <div>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="Enter 4-digit PIN"
                            className="bg-white h-12"
                            maxLength={4}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              field.onChange(value);
                            }}
                          />
                          <div className="flex justify-between mt-1">
                            {field.value ? (
                              <p className="text-xs text-gray-500">
                                {field.value.length}/4 digits
                              </p>
                            ) : (
                              <p className="text-xs text-gray-500">
                                Enter 4 digits (0-9)
                              </p>
                            )}
                            {error && (
                              <p className="text-xs text-red-500">
                                {error.message}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    />
                  </div>
                )}

                {/* PIN Change Fields */}
                {pinMode === "change" && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <p className="font-medium text-sm">Change your PIN</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        name="oldPin"
                        control={control}
                        rules={{
                          required: "Old PIN is required",
                          pattern: {
                            value: /^\d{4}$/,
                            message: "Old PIN must be 4 digits",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <div>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="Old PIN"
                              className="bg-white h-12"
                              maxLength={4}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                field.onChange(value);
                              }}
                            />
                            <div className="mt-1">
                              {field.value && (
                                <p className="text-xs text-gray-500">
                                  {field.value.length}/4 digits
                                </p>
                              )}
                              {error && (
                                <p className="text-xs text-red-500">
                                  {error.message}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      />

                      <Controller
                        name="newPin"
                        control={control}
                        rules={{
                          required: "New PIN is required",
                          pattern: {
                            value: /^\d{4}$/,
                            message: "New PIN must be 4 digits",
                          },
                          validate: (value) => {
                            const oldPin = watch("oldPin");
                            return (
                              value !== oldPin ||
                              "New PIN cannot be same as old PIN"
                            );
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <div>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="New PIN"
                              className="bg-white h-12"
                              maxLength={4}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                field.onChange(value);
                              }}
                            />
                            <div className="mt-1">
                              {field.value && (
                                <p className="text-xs text-gray-500">
                                  {field.value.length}/4 digits
                                </p>
                              )}
                              {error && (
                                <p className="text-xs text-red-500">
                                  {error.message}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-white mt-8 w-2/4 h-12"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>

          {/* Bank Accounts Display - Show account numbers */}
          <div className="mt-6 flex flex-col gap-4">
            <h2 className="font-medium text-[16px] text-[#455A64]">
              Saved Bank Account Details
            </h2>

            {!bankAccount ? (
              <p className="text-gray-500">No bank accounts saved yet.</p>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                <div
                  key={bankAccount.id}
                  className="flex items-center border py-2 px-3 rounded-md gap-3"
                >
                  <SiCommerzbank size={24} />
                  <div>
                    {/* Show Account Number instead of Bank Name */}
                    <h4 className="font-medium text-sm">
                      {bankAccount.accountNumber}
                    </h4>
                    {bankAccount.accountName && (
                      <p className="text-xs text-gray-500">
                        {bankAccount.accountName}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {bankAccount.bankCode === "057"
                        ? "Zenith Bank"
                        : bankAccount.bankCode === "044"
                          ? "Access Bank"
                          : `Bank Code: ${bankAccount.bankCode}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
