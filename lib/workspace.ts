import type { ScreenResult } from "@/lib/screen";
import type { GeneratedApp } from "@/lib/generate-app";

const SCREEN_KEY = "xxai.screenings";
const BUILD_KEY = "xxai.builds";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadScreenings(): ScreenResult[] {
  return read<ScreenResult>(SCREEN_KEY);
}

export function saveScreening(record: ScreenResult) {
  const next = [record, ...loadScreenings().filter((item) => item.id !== record.id)].slice(
    0,
    80,
  );
  write(SCREEN_KEY, next);
  return next;
}

export function loadBuilds(): GeneratedApp[] {
  return read<GeneratedApp>(BUILD_KEY);
}

export function saveBuild(record: GeneratedApp) {
  const next = [record, ...loadBuilds().filter((item) => item.id !== record.id)].slice(0, 40);
  write(BUILD_KEY, next);
  return next;
}
