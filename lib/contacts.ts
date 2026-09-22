import type { RowDataPacket } from "mysql2";
import { ensureSchema, getPool } from "@/lib/db";

export type ContactTopic = "general" | "sales" | "support" | "compliance" | "partnership";

export async function createContact(input: {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
}) {
  await ensureSchema();
  const id = crypto.randomUUID();
  await getPool().query(
    `INSERT INTO contacts (id, name, email, topic, message)
     VALUES (?, ?, ?, ?, ?)`,
    [id, input.name, input.email, input.topic, input.message],
  );
  return { id };
}

export async function listContacts(limit = 20) {
  await ensureSchema();
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT id, name, email, topic, message, created_at
     FROM contacts
     ORDER BY created_at DESC
     LIMIT ?`,
    [limit],
  );
  return rows as Array<{
    id: string;
    name: string;
    email: string;
    topic: ContactTopic;
    message: string;
    created_at: Date;
  }>;
}
