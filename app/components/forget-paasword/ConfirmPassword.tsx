import { Input } from "@/components/ui/input";
import CardWrapper from "../CardWrapper";
import { Button } from "@/components/ui/button";

export default function ConfirmPassword() {
  return (
    <main className="flex flex-col gap-7 text-center items-center justify-center">
      <div>
        <h2 className="font-medium text-4xl text-primary">Reset Password</h2>
        <p>Set your new password</p>
      </div>

      <CardWrapper className="px-24 py-16 flex flex-col gap-6 items-start w-[600px]">
        <Input
          type="password"
          className="bg-white min-h-12"
          placeholder="New Password"
        />
        <Input
          type="password"
          className="bg-white min-h-12"
          placeholder="Confirm Password"
        />
        <Button className="bg-primary text-white">Reset Password</Button>
      </CardWrapper>
    </main>
  );
}
