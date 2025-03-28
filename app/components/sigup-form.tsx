import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Link } from "@remix-run/react";
import { useTranslation } from "~/hooks/useTranslation";
import { useFetcher } from "~/hooks/useFetcher";
import { API_ROUTES, AUTH_ROUTES } from "~/constants";

export function SignupForm({
  className,
}: React.ComponentPropsWithoutRef<"form">) {
  const { t } = useTranslation();
  const { fetcher } = useFetcher<string>({});

  return (
    <fetcher.Form
      className={cn("flex flex-col gap-6", className)}
      method="post"
      action={API_ROUTES.API_AUTH_SIGNUP}
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
        <Link to={AUTH_ROUTES.LOGIN} className="underline underline-offset-4">
          {t("signup.login")}
        </Link>
      </div>
    </fetcher.Form>
  );
}
