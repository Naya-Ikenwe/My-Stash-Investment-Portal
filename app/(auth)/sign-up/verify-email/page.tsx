import AuthWrapper from "@/app/components/auth/AuthWrapper";
import CardWrapper from "@/app/components/CardWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <AuthWrapper>
      <main className="w-full flex items-center justify-center ">
        <CardWrapper className="px-20 py-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-primary">
              Enter the 6-digit code that we sent to
            </h2>

            <span className="flex flex-col gap-0.5">
              <p>shalom.ajoge@princepsfinance</p>
              <Link href="#" className="text-primary">
                Wrong Email?
              </Link>
            </span>
          </div>

          <Input placeholder="Code" className="mt-9 mb-7 bg-white w-[500px] h-12"/>

          <div className="flex flex-col gap-5">
            <Link href={"#"} className="text-primary">Check your email</Link>

            <div className="flex flex-col gap-2 items-start">
              <Button className="">Continue</Button>

              <p className="text-xs">
                Didn&apos;t get OTP?{" "}
                <span className="text-primary font-medium text-sm">Resend</span>{" "}
              </p>
            </div>
          </div>
        </CardWrapper>
      </main>
    </AuthWrapper>
  );
}
