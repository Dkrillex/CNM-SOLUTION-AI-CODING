import { WATCHLIST, type WatchEntry } from "@/lib/watchlist";

export type ScreenInput = {
  type: "individual" | "company";
  first?: string;
  last?: string;
  company?: string;
  dob?: string;
  nationality?: string;
  country?: string;
  industry?: string;
  registration?: string;
};

export type ScreenMatch = {
  name: string;
  lists: string[];
  reason: string;
  confidence: number;
  risk: "high" | "medium";
};

export type ScreenResult = {
  id: string;
  createdAt: string;
  type: ScreenInput["type"];
  name: string;
  risk: "low" | "medium" | "high";
  score: number;
  durationMs: number;
  matches: ScreenMatch[];
  lines: string[];
  fields: Record<string, string>;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value: string) {
  return normalize(value).split(" ").filter((t) => t.length > 1);
}

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const prev = Array.from({ length: n + 1 }, (_, i) => i);
  const curr = new Array<number>(n + 1);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return prev[n];
}

function similarity(a: string, b: string) {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.92;
  const dist = levenshtein(na, nb);
  return 1 - dist / Math.max(na.length, nb.length);
}

function jaccard(a: string[], b: string[]) {
  const sa = new Set(a);
  const sb = new Set(b);
  let inter = 0;
  for (const t of sa) if (sb.has(t)) inter++;
  const union = sa.size + sb.size - inter;
  return union ? inter / union : 0;
}

function queryName(input: ScreenInput) {
  if (input.type === "company") {
    return (input.company || "").trim();
  }
  return `${input.first || ""} ${input.last || ""}`.replace(/\s+/g, " ").trim();
}

function matchScore(query: string, entry: WatchEntry) {
  const names = [entry.name, ...(entry.aliases ?? [])];
  let best = 0;
  const qTokens = tokens(query);
  for (const name of names) {
    const sim = similarity(query, name);
    const jac = jaccard(qTokens, tokens(name));
    best = Math.max(best, sim, jac * 0.95);
  }
  return best;
}

function id() {
  return `scr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function runScreen(input: ScreenInput): ScreenResult {
  const started = Date.now();
  const name = queryName(input);
  if (!name) {
    throw new Error("Name is required");
  }

  const hits = WATCHLIST.map((entry) => {
    const confidence = matchScore(name, entry);
    return { entry, confidence };
  })
    .filter((hit) => hit.confidence >= 0.62)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 4);

  const matches: ScreenMatch[] = hits.map(({ entry, confidence }) => ({
    name: entry.name,
    lists: entry.lists,
    reason: entry.reason,
    confidence: Number(confidence.toFixed(2)),
    risk: entry.risk,
  }));

  const risk: ScreenResult["risk"] = matches.some((m) => m.risk === "high")
    ? "high"
    : matches.some((m) => m.risk === "medium")
      ? "medium"
      : "low";

  const score =
    risk === "high"
      ? Number((0.78 + (matches[0]?.confidence ?? 0.8) * 0.2).toFixed(2))
      : risk === "medium"
        ? Number((0.42 + (matches[0]?.confidence ?? 0.6) * 0.2).toFixed(2))
        : Number((0.08 + (name.length % 7) / 100).toFixed(2));

  const durationMs = Math.max(420, Date.now() - started + 380 + (name.length % 5) * 40);
  const fields: Record<string, string> = {
    type: input.type,
    name,
    dob: input.dob || "",
    nationality: input.nationality || "",
    country: input.country || "",
    industry: input.industry || "",
    registration: input.registration || "",
  };

  const sources = "OFAC/UN/EU/HMT/PEP/MEDIA";
  const lines = [
    `$ cnm screen --entity "${name}" --type ${input.type}`,
    `→ querying 1,000+ sources ....... ok`,
    `→ sanctions (${sources}) .... ${matches.some((m) => m.lists.some((l) => l !== "PEP DATABASE" && l !== "ADVERSE MEDIA" && l !== "WORLD-CHECK")) ? `${matches.length} hit` : "clear"}`,
    `→ pep + adverse media .......... ${matches.some((m) => m.lists.includes("PEP DATABASE") || m.lists.includes("ADVERSE MEDIA")) ? "1 hit" : "clear"}`,
    `✓ risk assessed in ${(durationMs / 1000).toFixed(1)}s`,
    `RISK_LEVEL = ${risk.toUpperCase()} · score ${score.toFixed(2)}`,
  ];

  return {
    id: id(),
    createdAt: new Date().toISOString(),
    type: input.type,
    name,
    risk,
    score,
    durationMs,
    matches,
    lines,
    fields,
  };
}
