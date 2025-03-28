import { SignupForm } from "~/components/sigup-form";
import AuthLayout from "~/components/auth-layout";

export default function Signup() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
