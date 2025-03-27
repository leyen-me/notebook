import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Link, useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { useTranslation } from "~/hooks/useTranslation";
import { Result } from "~/utils/result.server";

export function SignupForm({
  className,
}: React.ComponentPropsWithoutRef<"form">) {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data) {
      const data = fetcher.data as Result;
      if (data.code === 200) {
        alert("注册成功");
      } else {
        alert(t(data.message));
      }
    }
  }, [fetcher.data]);

  return (
    <fetcher.Form
      className={cn("flex flex-col gap-6", className)}
      method="post"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t("signup.title")}</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {t("signup.description")}
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">{t("signup.email")}</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">{t("signup.password")}</Label>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          {t("signup.signup")}
        </Button>
      </div>
      <div className="text-center text-sm">
        {t("signup.login_prefix")}{" "}
        <Link to="/login" className="underline underline-offset-4">
          {t("signup.login")}
        </Link>
      </div>
    </fetcher.Form>
  );
}
