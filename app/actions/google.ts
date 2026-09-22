"use server";

import { isGoogleConfigured } from "@/lib/google";

export async function getGoogleConfigured() {
  return isGoogleConfigured();
}
