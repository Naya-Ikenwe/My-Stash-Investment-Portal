"use client";

import { Controller, useForm } from "react-hook-form";
// import { Input } from "@/components/ui/input";
import FileDropzone from "./FileInput";

export default function Kyc() {
  const { control } = useForm();

  return (
    <main>
      <p>Upload KYC Document</p>
      <hr />

      <div className="mt-3">
        <p>You are required to upload your Kyc Documents</p>

        <div className="max-w-4xl mx-auto">
          <form action="">
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                // <div>

                <FileDropzone />
                // </div>
              )}
            />
          </form>
        </div>
      </div>
    </main>
  );
}
