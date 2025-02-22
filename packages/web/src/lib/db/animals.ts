import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import type { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";
import type { AnimalRecord } from "./AnimalRecord";
import supabase from "./client";

type FilterBuilder = PostgrestFilterBuilder<
  GenericSchema,
  Record<string, unknown>,
  AnimalRecord[]
>;

type Paginator<T> = {
  size: number;
  after?: T;
};

type LoadParams = Paginator<AnimalRecord> & {
  readonly pred?: string | ((builder: FilterBuilder) => FilterBuilder);
};

export function loadAnimalPage({
  size,
  after,
  pred,
}: LoadParams): FilterBuilder {
  const base =
    typeof pred === "string"
      ? supabase.rpc("search_animals", { queries: buildQueryArray(pred) })
      : supabase.from("animals").select<string, AnimalRecord>();

  const filtered = typeof pred === "function" ? pred(base) : base;

  const sorted = filtered
    .order("body->>happenDt", { ascending: false })
    .order("body->>desertionNo", { ascending: false })
    .limit(size);

  if (after === undefined) {
    return sorted;
  }
  return sorted
    .lte("body->>happenDt", after.body.happenDt)
    .lt("body->>desertionNo", after.body.desertionNo);
}

function buildQueryArray(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => x.replaceAll("(", "\\\\("))
    .map((x) => x.replaceAll(")", "\\\\)"))
    .map((x) => x.replaceAll('"', '\\"'))
    .map((x) => x.replaceAll("'", "''"));
}
