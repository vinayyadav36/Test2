export const logger = {
  info: (message: string, meta?: unknown) => console.info(`[kharchaone] ${message}`, meta ?? ""),
  warn: (message: string, meta?: unknown) => console.warn(`[kharchaone] ${message}`, meta ?? ""),
  error: (message: string, meta?: unknown) => console.error(`[kharchaone] ${message}`, meta ?? ""),
};
