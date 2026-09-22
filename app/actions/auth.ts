"use server";

import { signOut } from "@/auth";
import { createCredentialsUser } from "@/lib/users";

export async function signOutNow() {
  await signOut({ redirectTo: "/" });
}

export async function registerAccount(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const name = input.name.trim();
  const email = input.email.trim();
  const password = input.password;
  const confirmPassword = input.confirmPassword;

  if (name.length < 2) {
    return { error: "Name must be at least 2 characters." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const user = await createCredentialsUser({ name, email, password });
    return { ok: true as const, email: user.email };
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_TAKEN") {
      return { error: "This email is already registered. Please sign in." };
    }
    console.error("registerAccount", error);
    return { error: "Sign up failed. Please try again." };
  }
}
