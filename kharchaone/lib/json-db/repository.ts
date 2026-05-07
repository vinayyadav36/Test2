import { readCollection, writeCollection } from "@/lib/json-db/fileStore";

export interface JsonRepository<T extends { id: string; createdAt: string; updatedAt: string }> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  query(predicate: (item: T) => boolean): Promise<T[]>;
  insert(doc: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: string, patch: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<void>;
  replaceAll(items: T[]): Promise<void>;
}

const repoQueues = new Map<string, Promise<unknown>>();

function enqueue<T>(key: string, action: () => Promise<T>): Promise<T> {
  const prev = repoQueues.get(key) ?? Promise.resolve();
  const next = prev.then(action, action);
  repoQueues.set(key, next.finally(() => {
    if (repoQueues.get(key) === next) repoQueues.delete(key);
  }));
  return next;
}

function newId(): string {
  return crypto.randomUUID();
}

export function createJsonRepository<T extends { id: string; createdAt: string; updatedAt: string }>(
  fileName: string
): JsonRepository<T> {
  return {
    async getAll() {
      return readCollection<T>(fileName);
    },
    async getById(id: string) {
      const all = await readCollection<T>(fileName);
      return all.find((item) => item.id === id) ?? null;
    },
    async query(predicate: (item: T) => boolean) {
      const all = await readCollection<T>(fileName);
      return all.filter(predicate);
    },
    async insert(doc: Omit<T, "id" | "createdAt" | "updatedAt">) {
      return enqueue(fileName, async () => {
        const all = await readCollection<T>(fileName);
        const now = new Date().toISOString();
        const next = { ...doc, id: newId(), createdAt: now, updatedAt: now } as T;
        all.push(next);
        await writeCollection(fileName, all);
        return next;
      });
    },
    async update(id: string, patch: Partial<T>) {
      return enqueue(fileName, async () => {
        const all = await readCollection<T>(fileName);
        const idx = all.findIndex((item) => item.id === id);
        if (idx === -1) return null;
        const updated = { ...all[idx], ...patch, id, updatedAt: new Date().toISOString() } as T;
        all[idx] = updated;
        await writeCollection(fileName, all);
        return updated;
      });
    },
    async delete(id: string) {
      await enqueue(fileName, async () => {
        const all = await readCollection<T>(fileName);
        await writeCollection(fileName, all.filter((item) => item.id !== id));
      });
    },
    async replaceAll(items: T[]) {
      await enqueue(fileName, async () => {
        await writeCollection(fileName, items);
      });
    },
  };
}
