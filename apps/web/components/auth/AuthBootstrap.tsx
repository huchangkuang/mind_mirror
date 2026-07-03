"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import type { AuthServerSnapshot } from "@/lib/auth/server-snapshot";

interface AuthBootstrapProps {
  snapshot: AuthServerSnapshot;
}

export function AuthBootstrap({ snapshot }: AuthBootstrapProps) {
  useState(() => {
    useAuthStore.setState({
      user: snapshot.user,
      isFeedbackModerator: snapshot.isFeedbackModerator,
      status: snapshot.authenticated ? "authenticated" : "guest",
      bootstrapped: false,
      error: null,
    });
    return 0;
  });

  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap().catch(() => {});
  }, [bootstrap]);

  return null;
}
