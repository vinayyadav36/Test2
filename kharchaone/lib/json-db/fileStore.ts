import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { logger } from "@/lib/logger";

const DATA_DIR = path.join(process.cwd(), "data");
const queues = new Map<string, Promise<void>>();
const schemas = new Map<string, z.ZodTypeAny>();

function collectionPath(fileName: string): string {
  return path.join(DATA_DIR, fileName);
}

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function ensureFile(fileName: string): Promise<void> {
  await ensureDataDir();
  const filePath = collectionPath(fileName);
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]\n", "utf8");
  }
}

export function registerCollectionSchema(fileName: string, schema: z.ZodTypeAny): void {
  schemas.set(fileName, schema);
}

export async function readCollection<T>(fileName: string): Promise<T[]> {
  await ensureFile(fileName);
  const filePath = collectionPath(fileName);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    const schema = schemas.get(fileName);
    if (!schema) return parsed as T[];

    const result = z.array(schema).safeParse(parsed);
    if (result.success) return result.data as T[];

    logger.warn(`Schema validation failed for ${fileName}. Returning empty collection.`);
    return [];
  } catch (error) {
    logger.warn(`Failed to read/parse ${fileName}. Repairing with backup.`, error);
    try {
      const backupPath = `${filePath}.${Date.now()}.bak`;
      await fs.rename(filePath, backupPath);
    } catch {
      // ignore backup failure
    }
    await fs.writeFile(filePath, "[]\n", "utf8");
    return [];
  }
}

function enqueueWrite(fileName: string, action: () => Promise<void>): Promise<void> {
  const prev = queues.get(fileName) ?? Promise.resolve();
  const next = prev.then(action, action);
  queues.set(fileName, next.finally(() => {
    if (queues.get(fileName) === next) queues.delete(fileName);
  }));
  return next;
}

export async function writeCollection<T>(fileName: string, items: T[]): Promise<void> {
  await ensureFile(fileName);
  const filePath = collectionPath(fileName);

  return enqueueWrite(fileName, async () => {
    const tempPath = `${filePath}.tmp`;
    const content = `${JSON.stringify(items, null, 2)}\n`;
    await fs.writeFile(tempPath, content, "utf8");
    await fs.rename(tempPath, filePath);
  });
}

export async function bootstrapCollections(fileNames: string[]): Promise<void> {
  await Promise.all(fileNames.map((name) => readCollection(name)));
}
