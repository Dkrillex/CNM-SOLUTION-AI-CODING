export const CLIENT_PLATFORMS = [
  {
    id: "mac-arm",
    label: "macOS",
    detail: "Apple silicon",
    file: "cnmsolution-Desktop.dmg",
  },
  {
    id: "mac-intel",
    label: "macOS",
    detail: "Intel",
    file: "cnmsolution-Desktop-Intel.dmg",
  },
  {
    id: "win-x64",
    label: "Windows",
    detail: "x64",
    file: "cnmsolution-Setup-x64.exe",
  },
  {
    id: "win-arm",
    label: "Windows",
    detail: "ARM64",
    file: "cnmsolution-Setup-arm64.exe",
  },
  {
    id: "linux",
    label: "Linux",
    detail: "Ubuntu / Debian",
    file: "cnmsolution-desktop.deb",
  },
] as const;

export type ClientPlatformId = (typeof CLIENT_PLATFORMS)[number]["id"];

const CLAUDE_DESKTOP: Record<ClientPlatformId, string> = {
  "mac-arm": "https://claude.ai/api/desktop/darwin/universal/dmg/latest/redirect",
  "mac-intel": "https://claude.ai/api/desktop/darwin/universal/dmg/latest/redirect",
  "win-x64": "https://claude.ai/api/desktop/win32/x64/exe/latest/redirect",
  "win-arm": "https://claude.ai/api/desktop/win32/arm64/exe/latest/redirect",
  linux: "https://claude.com/download",
};

export function isClientPlatformId(value: string | null): value is ClientPlatformId {
  return CLIENT_PLATFORMS.some((p) => p.id === value);
}

export function getClientDownloadUrl(platform: string | null): string {
  if (isClientPlatformId(platform)) return CLAUDE_DESKTOP[platform];
  return CLAUDE_DESKTOP["mac-arm"];
}

export function clientDownloadHref(platform: ClientPlatformId): string {
  return `/api/download/client?platform=${platform}`;
}

export function detectClientPlatform(): ClientPlatformId {
  if (typeof navigator === "undefined") return "mac-arm";

  const ua = navigator.userAgent;
  const platform = navigator.platform ?? "";
  const uaData = (
    navigator as Navigator & {
      userAgentData?: { platform?: string; architecture?: string };
    }
  ).userAgentData;

  const host = `${uaData?.platform ?? ""} ${platform} ${ua}`;
  const arch = `${uaData?.architecture ?? ""} ${ua}`;
  const isArm = /arm|aarch64/i.test(arch);

  if (/Win/i.test(host)) return isArm ? "win-arm" : "win-x64";
  if (/Linux/i.test(host) && !/Android/i.test(host)) return "linux";
  if (uaData?.architecture === "x86") return "mac-intel";
  return "mac-arm";
}

export function platformMeta(id: ClientPlatformId) {
  return CLIENT_PLATFORMS.find((p) => p.id === id) ?? CLIENT_PLATFORMS[0];
}
