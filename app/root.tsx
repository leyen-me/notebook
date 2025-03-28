import "~/tailwind.css";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { I18nContext } from "~/hooks/useTranslation";
import { getLang } from "~/utils/env.server";
import { requireUser } from "~/utils/auth.server";
import { Toaster } from "~/components/ui/toaster";
import { AUTH_WHITE_ROUTES } from "./constants";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const lang = getLang();
  if (AUTH_WHITE_ROUTES.some((path) => request.url.includes(path))) {
    return lang;
  }
  await requireUser(request);
  return lang;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Notebook" },
    { name: "description", content: "Welcome to Notebook!" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const lang = useLoaderData<typeof loader>();
  return (
    <I18nContext.Provider value={lang}>
      <html lang={lang}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          {children}
          <Toaster />
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </I18nContext.Provider>
  );
}

export default function App() {
  return <Outlet />;
}
