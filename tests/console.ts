import { afterEach, beforeEach, vi } from 'vitest';

export const consoleMessages: string[] = [];

const record = (level: string) => (...args: unknown[]) => {
  consoleMessages.push(`${level}: ${args.map(String).join(' ')}`);
};

export function watchConsole(): void {
  beforeEach(() => {
    consoleMessages.length = 0;
    vi.spyOn(console, 'warn').mockImplementation(record('warn'));
    vi.spyOn(console, 'error').mockImplementation(record('error'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
}
