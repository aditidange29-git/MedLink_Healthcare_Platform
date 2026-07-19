/**
 * services/auth.ts
 *
 * Replaces the old Express-based auth service.
 * All calls now go directly to Firebase Auth SDK — no backend required.
 *
 * User profile extras (name, phone, role) that Firebase Auth doesn't
 * store natively are persisted in Firestore at users/{uid}.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "patient" | "doctor";
}

export interface LoginData {
  email: string;
  password: string;
}

/** The user shape exposed through AuthContext — mirrors the old Express shape. */
export interface MedLinkUser {
  id: string;       // Firebase uid
  name: string;
  email: string;
  phone: string;
  role: "patient" | "doctor";
  photoURL?: string;
}

// ─── Firestore profile helpers ────────────────────────────────────────────────

/** Write (or overwrite) the user profile document in Firestore. */
export async function writeUserProfile(
  uid: string,
  data: Omit<MedLinkUser, "id">
): Promise<void> {
  await setDoc(
    doc(db, "users", uid),
    { ...data, createdAt: serverTimestamp() },
    { merge: true }
  );
}

/** Read the Firestore profile for a given uid. Returns null if missing. */
export async function readUserProfile(
  uid: string
): Promise<Omit<MedLinkUser, "id"> | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as Omit<MedLinkUser, "id">;
}

// ─── Auth operations ──────────────────────────────────────────────────────────

/**
 * Register a new user.
 * 1. Creates the Firebase Auth account.
 * 2. Sets displayName on the Firebase user.
 * 3. Writes { name, phone, role } to Firestore users/{uid}.
 * Returns a MedLinkUser ready to store in AuthContext.
 */
export async function register(data: RegisterData): Promise<MedLinkUser> {
  const { name, email, password, phone = "", role = "patient" } = data;

  const cred: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Persist display name on the Firebase Auth profile
  await updateProfile(cred.user, { displayName: name });

  const profile: Omit<MedLinkUser, "id"> = {
    name,
    email,
    phone,
    role,
  };

  // Store extras in Firestore
  await writeUserProfile(cred.user.uid, profile);

  return { id: cred.user.uid, ...profile };
}

/**
 * Log in an existing user.
 * After signing in, fetches the Firestore profile to get role/phone.
 * Returns a MedLinkUser ready to store in AuthContext.
 */
export async function login(data: LoginData): Promise<MedLinkUser> {
  const { email, password } = data;

  const cred: UserCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const profile = await readUserProfile(cred.user.uid);

  return {
    id: cred.user.uid,
    name: profile?.name ?? cred.user.displayName ?? "",
    email: cred.user.email ?? email,
    phone: profile?.phone ?? "",
    role: profile?.role ?? "patient",
    photoURL: cred.user.photoURL ?? undefined,
  };
}

/**
 * Sign the current user out.
 * AuthContext's onAuthStateChanged listener will set user → null automatically.
 */
export async function logout(): Promise<void> {
  await signOut(auth);
}
