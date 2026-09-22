export type AiConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
};

export function getAiConfig(): AiConfig | null {
  const apiKey = (process.env.AI_API_KEY || process.env.OPENAI_API_KEY || "").trim();
  if (!apiKey) return null;
  return {
    apiKey,
    baseUrl: (process.env.AI_BASE_URL || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1")
      .trim()
      .replace(/\/$/, ""),
    model: (process.env.AI_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini").trim(),
  };
}

export function isAiConfigured() {
  return Boolean(getAiConfig());
}

async function complete(config: AiConfig, system: string, user: string, jsonMode: boolean) {
  const res = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.4,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  const payload = (await res.json()) as {
    error?: { message?: string };
    choices?: { message?: { content?: string } }[];
  };

  if (!res.ok) {
    throw new Error(payload.error?.message || `AI request failed (${res.status})`);
  }

  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("AI returned an empty response");
  return content;
}

export async function chatJson(system: string, user: string): Promise<string> {
  const config = getAiConfig();
  if (!config) throw new Error("AI API is not configured");
  try {
    return await complete(config, system, user, true);
  } catch {
    return complete(config, system, user, false);
  }
}

function extractBalancedObject(raw: string) {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  return raw.slice(start, end + 1);
}

export function parseJsonObject(raw: string) {
  const jsonFence = raw.match(/```json\s*([\s\S]*?)```/i)?.[1];
  const candidates = [jsonFence, extractBalancedObject(raw), raw].filter(
    (item): item is string => Boolean(item && item.trim()),
  );

  let lastError: Error | null = null;
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate.trim()) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  const preview = raw.slice(0, 96).replace(/\s+/g, " ");
  throw new Error(
    `AI returned non-JSON. ${lastError?.message ?? "Parse failed"} · ${preview}`,
  );
}

async function openStream(config: AiConfig, system: string, user: string, jsonMode: boolean) {
  const res = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.4,
      stream: true,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    const payload = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(payload.error?.message || `AI request failed (${res.status})`);
  }
  if (!res.body) throw new Error("AI stream was empty");
  return res.body;
}

export async function* chatJsonStream(
  system: string,
  user: string,
): AsyncGenerator<string> {
  const config = getAiConfig();
  if (!config) throw new Error("AI API is not configured");

  let body: ReadableStream<Uint8Array>;
  try {
    body = await openStream(config, system, user, true);
  } catch {
    body = await openStream(config, system, user, false);
  }

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const json = JSON.parse(data) as {
          choices?: { delta?: { content?: string } }[];
        };
        const piece = json.choices?.[0]?.delta?.content;
        if (piece) yield piece;
      } catch {
        /* ignore keep-alives */
      }
    }
  }
}
