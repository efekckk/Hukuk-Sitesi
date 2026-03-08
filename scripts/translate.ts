/**
 * Auto-translate messages/tr.json → messages/en.json using DeepL API.
 *
 * Usage:
 *   npm run translate
 *
 * Requires DEEPL_API_KEY in .env
 */

import fs from "fs";
import path from "path";

// Load .env manually (no extra dependency needed)
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
const BATCH_SIZE = 50;

// Full paths whose values should NOT be translated (phones, emails, real addresses)
// Use dot notation: "topBar.phone" matches path ["topBar", "phone"]
const SKIP_PATHS = new Set([
  "topBar.phone",
  "topBar.email",
  "topBar.address",
  "storyTabs.contact.address",
  "storyTabs.contact.phone",
  "storyTabs.contact.email",
]);

// Values that should NOT be translated (already universal)
function shouldSkipValue(value: string): boolean {
  return (
    /^[+\d\s()-]+$/.test(value) || // phone numbers
    /^[\w.+-]+@[\w.-]+$/.test(value) || // emails
    /^https?:\/\//.test(value) || // URLs
    /^Av\.\s/.test(value) || // names like "Av. Ahmet..."
    value === "Blog" ||
    value === "KVKK"
  );
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

interface TextEntry {
  path: string[];
  value: string;
}

function collectStrings(obj: JsonValue, currentPath: string[] = []): TextEntry[] {
  const entries: TextEntry[] = [];

  if (typeof obj === "string") {
    entries.push({ path: currentPath, value: obj });
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      entries.push(...collectStrings(item, [...currentPath, String(i)]));
    });
  } else if (obj && typeof obj === "object") {
    for (const [key, val] of Object.entries(obj)) {
      entries.push(...collectStrings(val, [...currentPath, key]));
    }
  }

  return entries;
}

function setNestedValue(obj: Record<string, unknown>, path: string[], value: string): void {
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    const nextKey = path[i + 1];
    const isNextArray = /^\d+$/.test(nextKey);

    if (!(key in current)) {
      current[key] = isNextArray ? [] : {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[path[path.length - 1]] = value;
}

async function translateBatch(texts: string[]): Promise<string[]> {
  const body = new URLSearchParams();
  body.append("source_lang", "TR");
  body.append("target_lang", "EN");
  for (const t of texts) {
    body.append("text", t);
  }

  const res = await fetch(DEEPL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepL API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.translations.map((t: { text: string }) => t.text);
}

async function main() {
  if (!DEEPL_API_KEY) {
    console.error("❌ DEEPL_API_KEY bulunamadı. .env dosyasına ekleyin:");
    console.error("   DEEPL_API_KEY=your-api-key-here");
    process.exit(1);
  }

  const trPath = path.resolve(process.cwd(), "messages/tr.json");
  const enPath = path.resolve(process.cwd(), "messages/en.json");

  const trJson = JSON.parse(fs.readFileSync(trPath, "utf-8"));

  // Collect all translatable strings
  const allEntries = collectStrings(trJson);
  const toTranslate: TextEntry[] = [];
  const skipped: TextEntry[] = [];

  for (const entry of allEntries) {
    const fullPath = entry.path.join(".");
    if (SKIP_PATHS.has(fullPath) || shouldSkipValue(entry.value)) {
      skipped.push(entry);
    } else {
      toTranslate.push(entry);
    }
  }

  console.log(`📝 Toplam: ${allEntries.length} metin`);
  console.log(`🔄 Çevrilecek: ${toTranslate.length}`);
  console.log(`⏭️  Atlanan: ${skipped.length}`);
  console.log();

  // Translate in batches
  const translated: string[] = [];
  for (let i = 0; i < toTranslate.length; i += BATCH_SIZE) {
    const batch = toTranslate.slice(i, i + BATCH_SIZE);
    const texts = batch.map((e) => e.value);

    process.stdout.write(`  Çevriliyor ${i + 1}-${Math.min(i + BATCH_SIZE, toTranslate.length)}/${toTranslate.length}...`);
    const results = await translateBatch(texts);
    translated.push(...results);
    console.log(" ✓");

    // Rate limit: small delay between batches
    if (i + BATCH_SIZE < toTranslate.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  // Build output JSON
  const enJson: Record<string, unknown> = {};

  // First, set skipped values (kept as-is)
  for (const entry of skipped) {
    setNestedValue(enJson, entry.path, entry.value);
  }

  // Then, set translated values
  for (let i = 0; i < toTranslate.length; i++) {
    setNestedValue(enJson, toTranslate[i].path, translated[i]);
  }

  fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2) + "\n", "utf-8");

  console.log();
  console.log(`✅ messages/en.json güncellendi!`);
}

main().catch((err) => {
  console.error("❌ Hata:", err.message);
  process.exit(1);
});
