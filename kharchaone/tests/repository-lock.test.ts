import { describe, expect, it } from "vitest";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createJsonRepository } from "../lib/json-db/repository";
import { writeCollection } from "../lib/json-db/fileStore";

interface DemoDoc {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
}

describe("json repository write queue", () => {
  it("handles concurrent inserts safely", async () => {
    const fileName = `test-temp-${Date.now()}.json`;
    const filePath = path.join(process.cwd(), "data", fileName);

    await writeCollection(fileName, [] as DemoDoc[]);
    const repo = createJsonRepository<DemoDoc>(fileName);

    await Promise.all(Array.from({ length: 20 }).map((_, i) => repo.insert({ name: `n${i}` })));

    const rows = await repo.getAll();
    expect(rows.length).toBe(20);
    expect(new Set(rows.map((r) => r.id)).size).toBe(20);

    await fs.unlink(filePath);
  });
});
