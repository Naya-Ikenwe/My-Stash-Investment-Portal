"use client";

import Authorization from "@/app/components/profile/Authorization";
import Kyc from "@/app/components/profile/Kyc";
import NextofKin from "@/app/components/profile/NextOfKin";
import Personal from "@/app/components/profile/Personal";
import { useAuthStore } from "@/app/store/authStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function ProfilePage() {
  const triggers = [
    {
      value: "personal",
      label: "Personal",
    },
    {
      value: "next-of-kin",
      label: "Next of Kin",
    },
    {
      value: "kyc",
      label: "KYC",
    },
    {
      value: "authorization",
      label: "Authorization",
    },
  ];

  const { user } = useAuthStore();

  return (
    <main className="flex flex-col gap-6">
      <h2 className="text-primary text-2xl font-medium">Profile Management</h2>

      {/* Desktop tabs (lg and above) */}
      <div className="hidden lg:block">
        <Tabs defaultValue="personal">
          <TabsList className="bg-[#F7F7F7] px-6 py-10 rounded-full lex gap-4 mb-8">
            {triggers.map((trigger) => (
              <TabsTrigger
                key={trigger.value}
                value={trigger.value}
                className="data-[state=active]:bg-white data-[state=active]:py-6 data-[state=active]:rounded-full data-[state=active]:px-6 data-[state=active]:text-primary data-[state=active]:shadow data-[state=active]:font-medium data-[state=inactive]:text-black data-[state=inactive]:bg-transparent px-4 py-2 rounded-md transition text-[#455A64] font-normal cursor-pointer"
              >
                {trigger.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="personal">
            <Personal />
          </TabsContent>

          <TabsContent value="next-of-kin">
            <NextofKin />
          </TabsContent>

          <TabsContent value="kyc">
            <Kyc />
          </TabsContent>

          <TabsContent value="authorization">
            <Authorization />
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile dropdown (visible < lg): lazy-load selected section */}
      <div className="lg:hidden">
        <MobileProfile />
      </div>
    </main>
  );
}

function MobileProfile() {
  const [active, setActive] = useState<string>("personal");

  return (
    <div className="flex flex-col gap-6">
      <Select value={active} onValueChange={setActive}>
        <SelectTrigger className="w-full bg-[#F7F7F7] border border-gray-300">
          <SelectValue placeholder="Select a section" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectGroup>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="next-of-kin">Next of Kin</SelectItem>
            <SelectItem value="kyc">KYC</SelectItem>
            <SelectItem value="authorization">Authorization</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="w-full">
        {active === "personal" && <Personal isMobile />}
        {active === "next-of-kin" && <NextofKin isMobile />}
        {active === "kyc" && <Kyc isMobile />}
        {active === "authorization" && <Authorization isMobile />}
      </div>
    </div>
  );
}