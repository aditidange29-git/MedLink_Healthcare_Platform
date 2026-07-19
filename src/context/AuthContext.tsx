"use client";

/**
 * context/AuthContext.tsx
 *
 * Replaces the old localStorage-based AuthContext.
 * Uses Firebase onAuthStateChanged as the single source of truth.
 *
 * On every auth state change:
 *   - Firebase fires the listener with the raw Firebase User (or null).
 *   - We fetch the Firestore profile to get role + phone.
 *   - We build a MedLinkUser and expose it via context.
 *
 * The context API is intentionally identical to the old one so every
 * consumer (Navbar, dashboards, etc.) works without changes:
 *   { user, login, logout, loading, isAuthenticated }
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  login as loginService,
  logout as logoutService,
  readUserProfile,
  type LoginData,
  type MedLinkUser,
} from "@/services/auth";

// ─── Context shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  /** The currently signed-in user, or null if not authenticated. */
  user: MedLinkUser | null;
  /** True while the initial auth state is being resolved. */
  loading: boolean;
  /** Convenience boolean — avoids null-checks in consumers. */
  isAuthenticated: boolean;
  /**
   * Sign in with email + password.
   * Returns the resolved MedLinkUser (useful for immediate redirect logic).
   */
  login: (data: LoginData) => Promise<MedLinkUser>;
  /** Sign out and clear the user from context. */
  logout: () => Promise<void>;
}

// ─── Context + hook ───────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MedLinkUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to Firebase auth state once on mount.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch Firestore profile for role + phone
        const profile = await readUserProfile(firebaseUser.uid);
        setUser({
          id: firebaseUser.uid,
          name: profile?.name ?? firebaseUser.displayName ?? "",
          email: firebaseUser.email ?? "",
          phone: profile?.phone ?? "",
          role: profile?.role ?? "patient",
          photoURL: firebaseUser.photoURL ?? undefined,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe; // cleans up the listener on unmount
  }, []);

  const login = useCallback(async (data: LoginData): Promise<MedLinkUser> => {
    const resolvedUser = await loginService(data);
    setUser(resolvedUser);
    return resolvedUser;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await logoutService();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
