// ---------------------------------------------------------------------------
// Storage Interface
// ---------------------------------------------------------------------------

/** Key-value storage abstraction for persisting project data. */
export interface Storage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  list(prefix: string): Promise<string[]>;
}

// ---------------------------------------------------------------------------
// MemoryStorage — volatile, suitable for MCP and testing
// ---------------------------------------------------------------------------

export class MemoryStorage implements Storage {
  private readonly data = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.data.get(key) ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.data.delete(key);
  }

  async list(prefix: string): Promise<string[]> {
    return Array.from(this.data.keys()).filter((k) => k.startsWith(prefix));
  }
}

// ---------------------------------------------------------------------------
// FileStorage — persists to ~/.mb-console/ on disk
// ---------------------------------------------------------------------------

export class FileStorage implements Storage {
  private readonly baseDir: string;

  constructor(baseDir?: string) {
    if (baseDir) {
      this.baseDir = baseDir;
    } else {
      const home =
        typeof process !== 'undefined'
          ? process.env['HOME'] || process.env['USERPROFILE'] || '.'
          : '.';
      this.baseDir = `${home}/.mb-console`;
    }
  }

  private async fs(): Promise<typeof import('node:fs/promises')> {
    return await import('node:fs/promises');
  }

  private async path(): Promise<typeof import('node:path')> {
    return await import('node:path');
  }

  /** Encode a key to a safe filename. */
  private encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  private decodeKey(filename: string): string {
    return decodeURIComponent(filename);
  }

  private async filePath(key: string): Promise<string> {
    const p = await this.path();
    const resolved = p.resolve(this.baseDir, this.encodeKey(key));
    const resolvedBase = p.resolve(this.baseDir);
    if (!resolved.startsWith(resolvedBase + p.sep) && resolved !== resolvedBase) {
      throw new Error('Path traversal detected: key escapes base directory');
    }
    return resolved;
  }

  private async ensureDir(): Promise<void> {
    const fsp = await this.fs();
    await fsp.mkdir(this.baseDir, { recursive: true, mode: 0o700 });
  }

  async get(key: string): Promise<string | null> {
    const fsp = await this.fs();
    try {
      const fp = await this.filePath(key);
      return await fsp.readFile(fp, 'utf-8');
    } catch (err: unknown) {
      if (isNodeError(err) && err.code === 'ENOENT') return null;
      throw err;
    }
  }

  async set(key: string, value: string): Promise<void> {
    await this.ensureDir();
    const fsp = await this.fs();
    const fp = await this.filePath(key);
    await fsp.writeFile(fp, value, { encoding: 'utf-8', mode: 0o600 });
  }

  async delete(key: string): Promise<void> {
    const fsp = await this.fs();
    try {
      const fp = await this.filePath(key);
      await fsp.unlink(fp);
    } catch (err: unknown) {
      if (isNodeError(err) && err.code === 'ENOENT') return;
      throw err;
    }
  }

  async list(prefix: string): Promise<string[]> {
    const fsp = await this.fs();
    try {
      const entries = await fsp.readdir(this.baseDir);
      const encodedPrefix = this.encodeKey(prefix);
      return entries
        .filter((e) => e.startsWith(encodedPrefix))
        .map((e) => this.decodeKey(e));
    } catch (err: unknown) {
      if (isNodeError(err) && err.code === 'ENOENT') return [];
      throw err;
    }
  }
}

// ---------------------------------------------------------------------------
// BrowserStorage — wraps localStorage with a key prefix
// ---------------------------------------------------------------------------

const BROWSER_PREFIX = 'mb-console:';

export class BrowserStorage implements Storage {
  private getLocalStorage(): globalThis.Storage {
    if (typeof localStorage === 'undefined') {
      throw new Error('BrowserStorage requires a browser environment with localStorage');
    }
    return localStorage;
  }

  async get(key: string): Promise<string | null> {
    const store = this.getLocalStorage();
    return store.getItem(BROWSER_PREFIX + key);
  }

  async set(key: string, value: string): Promise<void> {
    const store = this.getLocalStorage();
    store.setItem(BROWSER_PREFIX + key, value);
  }

  async delete(key: string): Promise<void> {
    const store = this.getLocalStorage();
    store.removeItem(BROWSER_PREFIX + key);
  }

  async list(prefix: string): Promise<string[]> {
    const store = this.getLocalStorage();
    const fullPrefix = BROWSER_PREFIX + prefix;
    const keys: string[] = [];
    for (let i = 0; i < store.length; i++) {
      const raw = store.key(i);
      if (raw && raw.startsWith(fullPrefix)) {
        // Strip the BROWSER_PREFIX, return the logical key
        keys.push(raw.slice(BROWSER_PREFIX.length));
      }
    }
    return keys;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface NodeError {
  code?: string;
}

function isNodeError(err: unknown): err is NodeError {
  return typeof err === 'object' && err !== null && 'code' in err;
}
