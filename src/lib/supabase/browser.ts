"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "./config";

let client: ReturnType<typeof createBrowserClient> | undefined;

export function createSupabaseBrowserClient() {
  if (!client) {
    const { url, anonKey } = getSupabasePublicConfig();
    client = createBrowserClient(url, anonKey);
  }
  return client;
}
