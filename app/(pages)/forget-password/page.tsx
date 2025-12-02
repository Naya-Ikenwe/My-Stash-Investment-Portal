import AuthWrapper from "@/app/components/auth/AuthWrapper";
import ConfirmPassword from "@/app/components/forget-paasword/ConfirmPassword";
import EmailInput from "@/app/components/forget-paasword/EmailInput";
import OtpInput from "@/app/components/forget-paasword/OtpInput";

export default function ForgetPasswordPage() {
  return (
    <AuthWrapper>
      <EmailInput />

      <OtpInput />

      <ConfirmPassword />
    </AuthWrapper>
  );
}
