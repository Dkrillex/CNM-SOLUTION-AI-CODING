"use server";

import { signOut } from "@/auth";
import { createCredentialsUser } from "@/lib/users";

export async function isGoogleConfigured() {
  return Boolean(
    process.env.AUTH_GOOGLE_ID?.trim() && process.env.AUTH_GOOGLE_SECRET?.trim(),
  );
}

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
    return { error: "姓名至少需要 2 个字符" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "请输入有效的邮箱地址" };
  }
  if (password.length < 8) {
    return { error: "密码至少需要 8 个字符" };
  }
  if (password !== confirmPassword) {
    return { error: "两次输入的密码不一致" };
  }

  try {
    const user = await createCredentialsUser({ name, email, password });
    return { ok: true as const, email: user.email };
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_TAKEN") {
      return { error: "该邮箱已注册，请直接登录" };
    }
    console.error("registerAccount", error);
    return { error: "注册失败，请稍后重试" };
  }
}
