import { Input } from "@/components/ui/input";
import CardWrapper from "../CardWrapper";
import AuthWrapper from "./AuthWrapper";
import Link from "next/link";

export default function VerifyEmail() {
  return (
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

        <Input />

        <div></div>
      </CardWrapper>
    </main>
  );
}
