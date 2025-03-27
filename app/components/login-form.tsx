import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Link } from "@remix-run/react";
import { useTranslation } from "~/hooks/useTranslation";
import { useFetcher } from "~/hooks/useFetcher";
import { REDIRECT_TO_KEY } from "~/constants";
import { useRedirectTo } from "~/hooks/useRedirectTo";

export function LoginForm({
  className,
}: React.ComponentPropsWithoutRef<"form">) {
  const { t } = useTranslation();
  const { fetcher } = useFetcher<string>({});
  const redirectTo = useRedirectTo();

  return (
    <fetcher.Form
      method="post"
      className={cn("flex flex-col gap-6", className)}
    >
      <input type="hidden" name={REDIRECT_TO_KEY} value={redirectTo} />
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t("login.title")}</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {t("login.description")}
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">{t("login.email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t("login.email_placeholder")}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">{t("login.password")}</Label>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          {t("login.login")}
        </Button>
      </div>
      <div className="text-center text-sm">
        {t("login.signup_prefix")}{" "}
        <Link to="/signup" className="underline underline-offset-4">
          {t("login.signup")}
        </Link>
      </div>
    </fetcher.Form>
  );
}
