"use client";

import { Controller, useForm } from "react-hook-form";
// import { Input } from "@/components/ui/input";
import FileDropzone from "./FileInput";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Kyc() {
  const { control } = useForm();

  return (
    <main className="pb-14">
      <div>
        <p className="text-[#455A64] font-medium text-[16px] mb-2">
          Upload KYC Document
        </p>
        <hr className="border-[#455A6433]"/>
      </div>

      <div className="mt-6 ">
        <p>You are required to upload your Kyc Documents</p>

        <div className="max-w-4xl mx-auto mt-4">
          <form action="" className="flex flex-col gap-6">
            {/* controller for the means of identification */}
            <Controller
              name="identification"
              control={control}
              render={({ field }) => (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label
                      htmlFor="means-of-identification"
                      className="font-medium"
                    >
                      Document 1: Means of Identification
                    </label>

                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white min-h-12 mt-2 py-0 w-72">
                        <SelectValue
                          placeholder="Select a document type"
                          className="text-black "
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          <SelectItem value="nationalId">
                            National ID
                          </SelectItem>
                          <SelectItem value="driverLicense">
                            Driver&apos;s License
                          </SelectItem>
                          <SelectItem value="internationalPasport">
                            International Passport
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <FileDropzone />
                </div>
              )}
            />

            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label htmlFor="proof-of-address" className="font-medium">
                      Document 2: Proof of address
                    </label>

                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white min-h-12 mt-2 py-0 w-72">
                        <SelectValue
                          placeholder="Select a document type"
                          className="text-black "
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          <SelectItem value="electricity">
                            Electricity Bill
                          </SelectItem>
                          <SelectItem value="lawma">Lawma Bill</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <FileDropzone />
                </div>
              )}
            />

            <Controller
              name="passport"
              control={control}
              render={({ field }) => (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label htmlFor="passport" className="font-medium">
                      Document 3: Passport photography
                    </label>

                    {/* <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white min-h-12 mt-2 py-0 w-72">
                        <SelectValue
                          placeholder="Select a document type"
                          className="text-black "
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          <SelectItem value="access">Access Bank</SelectItem>
                          <SelectItem value="source">Source Bank</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select> */}
                  </div>

                  <FileDropzone />
                </div>
              )}
            />

            <Controller
              name="signature"
              control={control}
              render={({ field }) => (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label htmlFor="signature" className="font-medium">
                      Document 4: Digital signature
                    </label>

                    {/* <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white min-h-12 mt-2 py-0 w-72">
                        <SelectValue
                          placeholder="Select a document type"
                          className="text-black "
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          <SelectItem value="access">Access Bank</SelectItem>
                          <SelectItem value="source">Source Bank</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select> */}
                  </div>

                  <FileDropzone />
                </div>
              )}
            />

            <div className="flex items-center justify-center mt-4">
              <Button className="w-1/3">Save Changes</Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
