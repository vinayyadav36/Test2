import { NextResponse } from "next/server";
import { DEFAULT_USER_EMAIL, DEFAULT_USER_ID } from "@/lib/auth";
import { bootstrapJsonDb, sessionsRepo, usersRepo } from "@/lib/json-db";
import type { Session, User } from "@/types";

function nowIso(): string {
  return new Date().toISOString();
}

async function ensureDefaultUser(): Promise<void> {
  const existing = await usersRepo.getById(DEFAULT_USER_ID);
  if (existing) return;

  const allUsers = await usersRepo.getAll();
  const now = nowIso();
  const user: User = {
    id: DEFAULT_USER_ID,
    name: "KharchaOne User",
    email: DEFAULT_USER_EMAIL,
    currency: "INR",
    darkMode: false,
    smallUpiThreshold: 200,
    createdAt: now,
    updatedAt: now,
  };

  await usersRepo.replaceAll([...allUsers, user]);
}

async function ensureDefaultSession(): Promise<void> {
  const allSessions = await sessionsRepo.getAll();
  const existing = allSessions.find((session) => session.userId === DEFAULT_USER_ID);
  if (existing) return;

  const now = nowIso();
  const session: Session = {
    id: `sess_${DEFAULT_USER_ID}`,
    userId: DEFAULT_USER_ID,
    lastSeenAt: now,
    userAgent: "local-app",
    ipHash: "local",
    createdAt: now,
    updatedAt: now,
  };

  await sessionsRepo.replaceAll([...allSessions, session]);
}

export async function POST() {
  await bootstrapJsonDb();
  await ensureDefaultUser();
  await ensureDefaultSession();
  return NextResponse.json({ ok: true, message: "Workspace initialized" });
}
