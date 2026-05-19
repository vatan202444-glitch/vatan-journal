// scripts/db-sync.js
const fs = require('fs');

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const action = process.argv[2]; // "read" or "write"
const filename = process.argv[3]; // e.g. "articles.json"

if (!KV_URL || !KV_TOKEN) {
  console.error("Missing KV_REST_API_URL or KV_REST_API_TOKEN env variables");
  process.exit(1);
}

// Clean URL (remove trailing slash if any)
const baseUrl = KV_URL.replace(/\/$/, "");

async function main() {
  try {
    if (action === "read") {
      const response = await fetch(`${baseUrl}/get/${filename}`, {
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      if (json && json.result) {
        console.log(json.result);
      } else {
        // Output empty if key not found, caller will fallback to default data
        console.log("");
      }
    } else if (action === "write") {
      // Read JSON data from stdin
      let data = "";
      process.stdin.setEncoding("utf-8");
      
      for await (const chunk of process.stdin) {
        data += chunk;
      }
      
      if (!data.trim()) {
        console.error("No data provided on stdin");
        process.exit(1);
      }

      const response = await fetch(`${baseUrl}/set/${filename}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`
        },
        body: data
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      if (json && json.result === "OK") {
        console.error(`Successfully synced ${filename} to KV database`);
      } else {
        throw new Error(`Failed to set value: ${JSON.stringify(json)}`);
      }
    } else {
      console.error("Invalid action. Must be 'read' or 'write'");
      process.exit(1);
    }
  } catch (error) {
    console.error("Sync error:", error.message);
    process.exit(1);
  }
}

main();
