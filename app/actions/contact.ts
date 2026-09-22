"use server";

import { createContact, type ContactTopic } from "@/lib/contacts";

const topics = new Set<ContactTopic>([
  "general",
  "sales",
  "support",
  "compliance",
  "partnership",
]);

export async function submitContact(input: {
  name: string;
  email: string;
  topic: string;
  message: string;
}) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const topic = input.topic.trim() as ContactTopic;
  const message = input.message.trim();

  if (name.length < 2) return { error: "Please enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!topics.has(topic)) return { error: "Please choose a topic." };
  if (message.length < 10) {
    return { error: "Message should be at least 10 characters." };
  }
  if (message.length > 4000) {
    return { error: "Message is too long." };
  }

  try {
    await createContact({ name, email, topic, message });
    return { ok: true as const };
  } catch (error) {
    console.error("submitContact", error);
    return { error: "Could not send your message. Please try again." };
  }
}
