export type GeneratedFile = {
  path: string;
  language: string;
  content: string;
};

export type GeneratedApp = {
  id: string;
  prompt: string;
  name: string;
  slug: string;
  summary: string;
  stack: string[];
  features: string[];
  schema: { table: string; columns: string[] }[];
  files: GeneratedFile[];
  previewHtml?: string;
  createdAt: string;
  status: "generated" | "deployed";
  source?: "ai" | "template";
  url?: string;
  diskPath?: string;
};

type Kind =
  | "course"
  | "shop"
  | "saas"
  | "booking"
  | "blog"
  | "crm"
  | "internal";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32) || "ea-app";
}

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

function detectKind(prompt: string): Kind {
  const p = prompt.toLowerCase();
  if (/course|lms|lesson|education|tutor|class/.test(p)) return "course";
  if (/shop|store|e-?comm|sku|cart|checkout|stripe/.test(p)) return "shop";
  if (/book|schedul|appoint|reserv|clinic|consult/.test(p)) return "booking";
  if (/blog|cms|content|docs|knowledge|newsletter/.test(p)) return "blog";
  if (/crm|lead|pipeline|sales desk/.test(p)) return "crm";
  if (/ticket|approv|internal|admin|ops|hr /.test(p)) return "internal";
  if (/saas|dashboard|subscription|workspace/.test(p)) return "saas";
  return "saas";
}

const KIND_META: Record<
  Kind,
  { noun: string; features: string[]; tables: { table: string; columns: string[] }[] }
> = {
  course: {
    noun: "Academy",
    features: [
      "Course catalog + lesson player",
      "Stripe checkout for enrollments",
      "Instructor dashboard",
      "Progress tracking",
    ],
    tables: [
      { table: "courses", columns: ["id", "title", "price_cents", "published"] },
      { table: "lessons", columns: ["id", "course_id", "title", "video_url"] },
      { table: "enrollments", columns: ["id", "user_id", "course_id", "status"] },
    ],
  },
  shop: {
    noun: "Store",
    features: [
      "Product catalog + cart",
      "Stripe / PayPal checkout",
      "Order management",
      "Inventory alerts",
    ],
    tables: [
      { table: "products", columns: ["id", "name", "price_cents", "stock"] },
      { table: "orders", columns: ["id", "user_id", "total_cents", "status"] },
      { table: "order_items", columns: ["id", "order_id", "product_id", "qty"] },
    ],
  },
  saas: {
    noun: "Cloud",
    features: [
      "Multi-tenant workspaces",
      "Billing + seat management",
      "Role-based access",
      "Usage analytics",
    ],
    tables: [
      { table: "workspaces", columns: ["id", "name", "plan", "owner_id"] },
      { table: "memberships", columns: ["id", "workspace_id", "user_id", "role"] },
      { table: "events", columns: ["id", "workspace_id", "name", "created_at"] },
    ],
  },
  booking: {
    noun: "Book",
    features: [
      "Calendar availability",
      "Customer booking flow",
      "Email / SMS reminders",
      "Provider dashboard",
    ],
    tables: [
      { table: "services", columns: ["id", "name", "duration_min", "price_cents"] },
      { table: "slots", columns: ["id", "service_id", "starts_at", "open"] },
      { table: "appointments", columns: ["id", "slot_id", "customer_id", "status"] },
    ],
  },
  blog: {
    noun: "Press",
    features: [
      "MDX posts + tags",
      "Editor role",
      "SEO metadata",
      "Newsletter capture",
    ],
    tables: [
      { table: "posts", columns: ["id", "slug", "title", "status"] },
      { table: "tags", columns: ["id", "name"] },
      { table: "subscribers", columns: ["id", "email", "confirmed"] },
    ],
  },
  crm: {
    noun: "Pipeline",
    features: [
      "Lead inbox",
      "Deal board",
      "Activity timeline",
      "Exportable reports",
    ],
    tables: [
      { table: "leads", columns: ["id", "name", "email", "stage"] },
      { table: "deals", columns: ["id", "lead_id", "value_cents", "status"] },
      { table: "activities", columns: ["id", "deal_id", "kind", "note"] },
    ],
  },
  internal: {
    noun: "Ops",
    features: [
      "Ticket queue",
      "Approval workflow",
      "Audit trail",
      "SLA timers",
    ],
    tables: [
      { table: "tickets", columns: ["id", "title", "priority", "status"] },
      { table: "approvals", columns: ["id", "ticket_id", "approver_id", "state"] },
      { table: "comments", columns: ["id", "ticket_id", "author_id", "body"] },
    ],
  },
};

export function generateApp(prompt: string): GeneratedApp {
  const clean = prompt.trim();
  if (!clean) throw new Error("Prompt is required");

  const kind = detectKind(clean);
  const meta = KIND_META[kind];
  const seed = titleCase(clean.replace(/^(a|an|the)\s+/i, "")).slice(0, 42) || "EA ESPORTES App";
  const name = seed.split(" ").length < 2 ? `${seed} ${meta.noun}` : seed;
  const slug = slugify(name);
  const id = `bld_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

  const schemaSql = meta.tables
    .map(
      (t) =>
        `create table ${t.table} (\n  ${t.columns.map((c) => `${c} text`).join(",\n  ")}\n);`,
    )
    .join("\n\n");

  const files: GeneratedFile[] = [
    {
      path: "README.md",
      language: "markdown",
      content: `# ${name}\n\n${clean}\n\nGenerated by EA ESPORTES Builder.\n\n## Stack\n- Next.js + TypeScript\n- PostgreSQL\n- Stripe\n- NextAuth\n`,
    },
    {
      path: "app/page.tsx",
      language: "tsx",
      content: `export default function Home() {\n  return (\n    <main className="mx-auto max-w-5xl px-6 py-20">\n      <p className="font-mono text-xs uppercase tracking-widest text-lime-400">EA ESPORTES · ${kind}</p>\n      <h1 className="mt-4 text-5xl font-semibold tracking-tight">${name}</h1>\n      <p className="mt-4 max-w-xl text-zinc-400">${clean}</p>\n    </main>\n  );\n}\n`,
    },
    {
      path: "app/api/health/route.ts",
      language: "ts",
      content: `export function GET() {\n  return Response.json({ ok: true, app: "${slug}", kind: "${kind}" });\n}\n`,
    },
    {
      path: "prisma/schema.prisma",
      language: "prisma",
      content: `generator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\n${meta.tables
        .map(
          (t) =>
            `model ${titleCase(t.table).replace(/\s/g, "")} {\n${t.columns
              .map((c) => `  ${c}  String${c === "id" ? "  @id @default(cuid())" : ""}`)
              .join("\n")}\n}`,
        )
        .join("\n\n")}\n`,
    },
    {
      path: "sql/init.sql",
      language: "sql",
      content: schemaSql + "\n",
    },
    {
      path: "lib/stripe.ts",
      language: "ts",
      content: `import Stripe from "stripe";\n\nexport const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);\n\nexport async function createCheckout(priceCents: number, name: string) {\n  return stripe.checkout.sessions.create({\n    mode: "payment",\n    line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: priceCents, product_data: { name } } }],\n    success_url: process.env.APP_URL + "/success",\n  });\n}\n`,
    },
  ];

  return {
    id,
    prompt: clean,
    name,
    slug,
    summary: `Full-stack ${kind} app generated from your brief. Includes schema, auth-ready Next.js shell, and payment hook.`,
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "NextAuth"],
    features: meta.features,
    schema: meta.tables,
    files,
    previewHtml: `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${name}</title><script src="https://cdn.tailwindcss.com"></script></head><body class="min-h-screen bg-zinc-950 text-zinc-50"><main class="mx-auto max-w-3xl px-6 py-20"><p class="font-mono text-xs uppercase tracking-widest text-lime-400">EA ESPORTES · ${kind}</p><h1 class="mt-4 text-5xl font-semibold">${name}</h1><p class="mt-4 text-zinc-400">${clean}</p></main></body></html>`,
    createdAt: new Date().toISOString(),
    status: "generated",
    source: "template",
  };
}

export async function generateAppAsync(prompt: string): Promise<GeneratedApp> {
  const clean = prompt.trim();
  if (!clean) throw new Error("Prompt is required");
  const { isAiConfigured } = await import("@/lib/ai");
  if (isAiConfigured()) {
    const { generateAppWithAi } = await import("@/lib/generate-app-ai");
    return generateAppWithAi(clean);
  }
  return generateApp(clean);
}

export function deployApp(app: GeneratedApp): GeneratedApp {
  return {
    ...app,
    status: "deployed",
    url: `/p/${app.slug}`,
  };
}
