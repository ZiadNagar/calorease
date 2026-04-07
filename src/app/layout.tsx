import type { Metadata } from "next";
import { Montserrat, Merriweather, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { ThemeProvider, ErrorBoundary } from "@/components/common";
import { MainNav, MainFooter } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import { StoreInitializer } from "@/components/providers/StoreInitializer";
import { getProfile } from "@/actions";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CalorEase - Metabolic Health Intelligence",
  description:
    "Premium metabolic health tracking and meal planning powered by clinical nutritional science.",
  icons: {
    icon: "/logo.png",
  },
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // Fetch profile from cookie on the server - no hydration mismatch!
  const profile = await getProfile();

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${montserrat.variable} ${merriweather.variable} ${sourceCodePro.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Initialize Zustand store with server-fetched profile */}
          <StoreInitializer profile={profile} />
          <div className="min-h-screen flex flex-col bg-background text-foreground">
            <MainNav profile={profile} />
            <main className={`flex-1 ${profile ? "pt-20 md:pt-24" : ""}`}>
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
            <MainFooter />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
