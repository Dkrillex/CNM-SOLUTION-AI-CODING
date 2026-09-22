import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { ensureSchema, getPool } from "@/lib/db";

export type DbUser = {
  id: string;
  email: string;
  name: string | null;
  password_hash: string | null;
  image: string | null;
  google_id: string | null;
  provider: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function findUserByEmail(email: string) {
  await ensureSchema();
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT id, email, name, password_hash, image, google_id, provider
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [normalizeEmail(email)],
  );
  return (rows[0] as DbUser | undefined) ?? null;
}

export async function findUserByGoogleId(googleId: string) {
  await ensureSchema();
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT id, email, name, password_hash, image, google_id, provider
     FROM users
     WHERE google_id = ?
     LIMIT 1`,
    [googleId],
  );
  return (rows[0] as DbUser | undefined) ?? null;
}

export async function createCredentialsUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  await ensureSchema();
  const email = normalizeEmail(input.email);
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("EMAIL_TAKEN");
  }

  const id = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(input.password, 12);
  await getPool().query(
    `INSERT INTO users (id, email, name, password_hash, provider)
     VALUES (?, ?, ?, ?, 'credentials')`,
    [id, email, input.name.trim(), passwordHash],
  );

  return { id, email, name: input.name.trim(), image: null };
}

export async function verifyCredentials(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user?.password_hash) return null;

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return null;

  await touchLastLogin(user.id, "credentials");
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
  };
}

export async function upsertGoogleUser(input: {
  email: string;
  name?: string | null;
  image?: string | null;
  googleId: string;
}) {
  await ensureSchema();
  const email = normalizeEmail(input.email);
  const name = input.name?.trim() || null;
  const image = input.image?.trim() || null;

  const existing =
    (await findUserByGoogleId(input.googleId)) ?? (await findUserByEmail(email));

  if (existing) {
    await getPool().query(
      `UPDATE users
       SET google_id = COALESCE(google_id, ?),
           email = ?,
           name = COALESCE(?, name),
           image = COALESCE(?, image),
           provider = 'google',
           last_login_at = NOW()
       WHERE id = ?`,
      [input.googleId, email, name, image, existing.id],
    );
    return {
      id: existing.id,
      email,
      name: name ?? existing.name,
      image: image ?? existing.image,
    };
  }

  const id = crypto.randomUUID();
  await getPool().query(
    `INSERT INTO users (id, email, name, image, google_id, provider, last_login_at)
     VALUES (?, ?, ?, ?, ?, 'google', NOW())`,
    [id, email, name, image, input.googleId],
  );
  return { id, email, name, image };
}

async function touchLastLogin(userId: string, provider: string) {
  await getPool().query(
    `UPDATE users SET last_login_at = NOW(), provider = ? WHERE id = ?`,
    [provider, userId],
  );
}
