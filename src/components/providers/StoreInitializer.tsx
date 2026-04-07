"use client";

import { useEffect, useRef } from "react";
import { useUserStore } from "@/stores";
import type { UserProfile } from "@/types";

interface StoreInitializerProps {
  profile: UserProfile | null;
}

/**
 * Client component that initializes Zustand store with server-fetched cookie data
 * This bridges the gap between server-side cookies and client-side state
 */
export function StoreInitializer({ profile }: StoreInitializerProps) {
  const initialized = useRef(false);
  const initializeFromCookie = useUserStore(
    (state) => state.initializeFromCookie
  );

  useEffect(() => {
    if (!initialized.current) {
      initializeFromCookie(profile);
      initialized.current = true;
    }
  }, [profile, initializeFromCookie]);

  return null;
}
