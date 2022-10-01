import * as React from "react";
import "the-new-css-reset";
import "styles/app.css";
import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@radix-ui/react-toast";
import SEO from "next-seo.config";
import { Banner } from "components/Banner";
import { CommandMenu } from "components/CommandMenu";
import { Toaster } from "components/Toast/Toast";

const composeProviders =
  (...providers: any[]) =>
  ({ children }: { children: React.ReactNode }) =>
    providers.reduceRight((acc, provider) => {
      const [Provider, props] = provider;
      return <Provider {...props}>{acc}</Provider>;
    }, children);

const Providers = composeProviders(
  [
    ThemeProvider,
    {
      attribute: "class",
      defaultTheme: "system",
      disableTransitionOnChange: true,
    },
  ],
  [ToastProvider]
);

function MyApp({ Component, pageProps }: AppProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Providers>
      <DefaultSeo {...SEO} />
      <div className="container">
        <Banner setOpen={setOpen} />
        <main>
          <Component {...pageProps} />
        </main>
        <CommandMenu open={open} setOpen={setOpen} />
        <Toaster />
      </div>
    </Providers>
  );
}

export default MyApp;
