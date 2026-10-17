import "server-only";

/**
 * Supabase の PostgREST を fetch で直接叩く最小クライアント。
 * SDK を入れずに済ませるため。環境変数が未設定なら「保存しない」で動く。
 *
 *   SUPABASE_URL              例: https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY サーバー専用。クライアントに出さない
 */

export function storageEnabled(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function insertRow<T extends Record<string, unknown>>(
  table: string,
  row: T,
): Promise<{ id: string } | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const res = await fetch(`${url}/rest/v1/${table}?select=id`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`supabase insert failed: ${res.status} ${text.slice(0, 300)}`);
  }
  const data = (await res.json()) as { id: string }[];
  return data[0] ?? null;
}
