import { LoginForm } from "~/components/login-form";
import AuthLayout from "~/components/auth-layout";

export default function Login() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
