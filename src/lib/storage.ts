import fs from 'fs';
import path from 'path';

// Bypass Turbopack tracing for node-only modules
const getOs = () => eval("require('os')");
const getSpawnSync = () => eval("require('child_process').spawnSync");

const DATA_DIR = path.join(process.cwd(), 'public', 'data');

// Use a global variable to persist cache across hot-reloads in Next.js development
const globalForCache = globalThis as unknown as {
  storageCache?: Record<string, any>;
};

if (!globalForCache.storageCache) {
  globalForCache.storageCache = {};
}

const cache = globalForCache.storageCache;

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Write the database sync script to the temporary folder to guarantee it is bundled/available
function getSyncScriptPath(): string {
  const scriptPath = path.join(getOs().tmpdir(), 'vatan-db-sync.js');
  
  // Write the script if it doesn't exist
  if (!fs.existsSync(scriptPath)) {
    const scriptCode = `
const KV_URL = "${KV_URL ? KV_URL.replace(/\/$/, "") : ""}";
const KV_TOKEN = "${KV_TOKEN || ""}";
const action = process.argv[2];
const filename = process.argv[3];

if (!KV_URL || !KV_TOKEN) {
  process.exit(1);
}

async function main() {
  try {
    if (action === "read") {
      const response = await fetch(\`\${KV_URL}/get/\${filename}\`, {
        headers: { Authorization: \`Bearer \${KV_TOKEN}\` }
      });
      if (!response.ok) process.exit(1);
      const json = await response.json();
      if (json && json.result) {
        console.log(json.result);
      } else {
        console.log("");
      }
    } else if (action === "write") {
      let data = "";
      process.stdin.setEncoding("utf-8");
      for await (const chunk of process.stdin) {
        data += chunk;
      }
      const response = await fetch(\`\${KV_URL}/set/\${filename}\`, {
        method: "POST",
        headers: { Authorization: \`Bearer \${KV_TOKEN}\` },
        body: data
      });
      if (!response.ok) process.exit(1);
      const json = await response.json();
      if (json && json.result === "OK") {
        process.exit(0);
      } else {
        process.exit(1);
      }
    }
  } catch (err) {
    process.exit(1);
  }
}
main();
`;
    fs.writeFileSync(scriptPath, scriptCode, 'utf-8');
  }
  return scriptPath;
}

// Ensure data directory exists
export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Generic read function with cache and DB fallback
export function readData<T>(filename: string, defaultData: T): T {
  if (cache[filename] !== undefined) {
    return cache[filename] as T;
  }

  // 1. Try reading from Database if configured
  if (KV_URL && KV_TOKEN) {
    try {
      const scriptPath = getSyncScriptPath();
      const result = getSpawnSync()('node', [scriptPath, 'read', filename], {
        env: { ...process.env },
        encoding: 'utf-8'
      });
      
      if (result.status === 0 && result.stdout.trim()) {
        const parsed = JSON.parse(result.stdout.trim());
        cache[filename] = parsed;
        return parsed;
      }
    } catch (error) {
      console.error(`Error syncing read for ${filename} from database:`, error);
    }
  }

  // 2. Fallback to Local Filesystem
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    writeData(filename, defaultData);
    return defaultData;
  }
  
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    cache[filename] = parsed;
    return parsed;
  } catch (error) {
    console.error(`Error reading ${filename} from filesystem:`, error);
    return defaultData;
  }
}

// Generic write function with cache, DB and local filesystem update
export function writeData<T>(filename: string, data: T): void {
  // Update local cache
  cache[filename] = data;

  // 1. Try writing to Database if configured
  if (KV_URL && KV_TOKEN) {
    try {
      const scriptPath = getSyncScriptPath();
      getSpawnSync()('node', [scriptPath, 'write', filename], {
        input: JSON.stringify(data),
        env: { ...process.env },
        encoding: 'utf-8'
      });
    } catch (error) {
      console.error(`Error syncing write for ${filename} to database:`, error);
    }
  }

  // 2. Also write to Local Filesystem if possible (optional fallback)
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filename} to filesystem:`, error);
    // Do not throw if we successfully wrote to KV
    if (!KV_URL || !KV_TOKEN) {
      throw error;
    }
  }
}

