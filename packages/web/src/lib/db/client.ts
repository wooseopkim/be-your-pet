import { env } from "$env/dynamic/public";
import { createClient } from "@supabase/supabase-js";

function readOrThrow(key: keyof typeof env) {
  const value = env[key];
  if (!value) {
    throw new Error(
      `env[${key}] is ${String(key)} => ${JSON.stringify({ env })}`,
    );
  }
  return value;
}

const supabase = createClient(
  readOrThrow("PUBLIC_SUPABASE_URL"),
  readOrThrow("PUBLIC_SUPABASE_ANON_KEY"),
);

export default supabase;
