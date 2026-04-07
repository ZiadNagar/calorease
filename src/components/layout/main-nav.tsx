"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useUserStore } from "@/stores";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/types";

interface MainNavProps {
  profile: UserProfile | null;
}

const MainNav = ({ profile: serverProfile }: MainNavProps) => {
  const pathname = usePathname();
  const router = useRouter();
  // Use store profile for reactivity, fallback to server profile
  const storeProfile = useUserStore((state) => state.profile);
  const clearData = useUserStore((state) => state.clearData);
  const { theme, setTheme } = useTheme();

  // Prefer store profile (reactive) but use server profile initially
  const profile = storeProfile ?? serverProfile;

  // Hide navigation when user has no profile (onboarding/landing page)
  if (!profile) {
    return null;
  }

  const navItems = [
    { href: "/profile", label: "Profile" },
    { href: "/meal-planner", label: "Meals" },
  ];

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleClearData = () => {
    if (confirm("Reset all your metabolic data? This cannot be undone.")) {
      clearData();
      router.push("/");
    }
  };

  return (
    <>
      {/* Desktop Header - Minimal floating design */}
      <header className="fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between glass-morphism rounded-2xl px-6 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-primary to-accent opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="CalorEase"
                    width={28}
                    height={28}
                    className="rounded-lg"
                  />
                </div>
              </div>
              <span className="text-xl font-black tracking-tight">
                Calor<span className="text-gradient-nature">Ease</span>
              </span>
            </Link>

            {/* Center Nav */}
            <nav className="flex items-center gap-1 bg-secondary/30 rounded-full p-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleTheme}
                className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Toggle theme"
              >
                <svg
                  className="w-5 h-5 text-foreground dark:hidden"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
                <svg
                  className="w-5 h-5 text-foreground hidden dark:block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </button>

              {profile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearData}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header - Full nav in top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between glass-morphism rounded-xl px-3 py-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="CalorEase"
                width={24}
                height={24}
                className="rounded-md"
              />
              <span className="text-base font-black tracking-tight">
                Calor<span className="text-gradient-nature">Ease</span>
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="flex items-center gap-1 bg-secondary/30 rounded-full p-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleToggleTheme}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                aria-label="Toggle theme"
              >
                <svg
                  className="w-4 h-4 dark:hidden"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <svg
                  className="w-4 h-4 hidden dark:block"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              </button>
              <button
                onClick={handleClearData}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                aria-label="Reset data"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export { MainNav };
