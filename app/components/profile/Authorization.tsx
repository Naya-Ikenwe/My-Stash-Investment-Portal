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
  getUserBankAccountsService,
} from "@/app/api/Users";
import API from "@/lib/axiosInstance";
import SetPinModal from "@/app/components/SetPinModal";
import ChangePinModal from "@/app/components/ChangePinModal";

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

export default function Authorization({ isMobile = false }: { isMobile?: boolean }) {
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
  const [showSetPinModal, setShowSetPinModal] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);

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

      // If changes were made
      if (data.bvn || data.nin || data.sourceOfIncome || data.securityAnswer) {
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
            className={isMobile ? "w-full flex flex-col items-start" : "w-3/5 flex flex-col items-center"}
          >
            <div className={isMobile ? "grid grid-cols-1 gap-4 w-full" : "grid grid-cols-2 gap-5 w-full"}>
              {/* BVN - Editable if not already set */}
              <div className="w-full">
                <Controller
                  name="bvn"
                  control={control}
                  render={({ field }) => (
                    <div className="w-full">
                      <Input
                        {...field}
                        placeholder="Bank Verification Number (BVN)"
                        className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2 w-full"
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
              </div>

              {/* Source of Income */}
              <div className="w-full">
                <Controller
                  name="sourceOfIncome"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Source of Income"
                      className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2 w-full"
                    />
                  )}
                />
              </div>

              {/* NIN Number */}
              <div className="w-full">
                <Controller
                  name="nin"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="NIN Number"
                      className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2 w-full"
                      maxLength={11}
                    />
                  )}
                />
              </div>

              {/* Security Question */}
              <div className="w-full">
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
              <div className="w-full">
                <Controller
                  name="securityAnswer"
                  control={control}
                  render={({ field }) => (
                    <div className="w-full">
                      <Input
                        {...field}
                        placeholder={
                          savedSecurityQuestion
                            ? "Enter new answer"
                            : "Security Answer"
                        }
                        className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2 w-full"
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
              </div>

              {/* PIN Section - Using Modals */}
              <div className={isMobile ? "w-full space-y-4" : "col-span-2 space-y-4"}>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowSetPinModal(true)}
                    className="flex-1 border border-primary text-primary py-3 rounded-xl hover:bg-primary/10 transition-colors"
                  >
                    Set PIN
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowChangePinModal(true)}
                    className="flex-1 border border-primary text-primary py-3 rounded-xl hover:bg-primary/10 transition-colors"
                  >
                    Change PIN
                  </button>
                </div>

                {/* Info Text */}
                <p className="text-sm text-gray-500 text-center">
                  Set a 4-digit PIN to authorize transactions like liquidations
                </p>
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

          {/* PIN Modals */}
          <SetPinModal
            isOpen={showSetPinModal}
            onClose={() => setShowSetPinModal(false)}
            onSuccess={() => {
              setApiSuccess("PIN set successfully!");
              setTimeout(() => setApiSuccess(""), 3000);
            }}
          />

          <ChangePinModal
            isOpen={showChangePinModal}
            onClose={() => setShowChangePinModal(false)}
            onSuccess={() => {
              setApiSuccess("PIN changed successfully!");
              setTimeout(() => setApiSuccess(""), 3000);
            }}
          />
        </>
      )}
    </main>
  );
}