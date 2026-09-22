import { getAiConfig, isAiConfigured } from "@/lib/ai";
import { generateApp, deployApp, type GeneratedApp } from "@/lib/generate-app";
import type { BuildStreamEvent } from "@/lib/generate-app-ai";
import { writeGeneratedProject } from "@/lib/project-fs";
import { NextResponse } from "next/server";

export const maxDuration = 120;

export async function GET() {
  const config = getAiConfig();
  return NextResponse.json({
    configured: isAiConfigured(),
    model: config?.model ?? null,
  });
}

function encodeEvent(event: BuildStreamEvent) {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(req: Request) {
  const { prompt, deploy, app, stream = true } = (await req.json()) as {
    prompt?: string;
    deploy?: boolean;
    stream?: boolean;
    app?: GeneratedApp;
  };

  if (deploy && app) {
    try {
      const written = await writeGeneratedProject(app);
      return NextResponse.json(deployApp({ ...app, diskPath: written.diskPath }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Deploy failed";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  if (!stream) {
    try {
      const { generateAppAsync } = await import("@/lib/generate-app");
      return NextResponse.json(await generateAppAsync(prompt));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Build failed";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const send = (event: BuildStreamEvent) => {
        controller.enqueue(encoder.encode(encodeEvent(event)));
      };
      try {
        if (isAiConfigured()) {
          const { generateAppWithAiStream } = await import("@/lib/generate-app-ai");
          for await (const event of generateAppWithAiStream(prompt.trim())) {
            send(event);
          }
        } else {
          send({ type: "status", message: "ai not configured · using template" });
          send({ type: "done", app: generateApp(prompt.trim()) });
        }
      } catch (error) {
        send({
          type: "error",
          message: error instanceof Error ? error.message : "Build failed",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
