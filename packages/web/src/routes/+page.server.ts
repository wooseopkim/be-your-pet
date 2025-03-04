import { Random } from "$lib/ui/random";
import { loadAnimalPage } from "../lib/db/animals";

const MINUTE_IN_MILLIS = 1000 * 60;

export const prerender = true;

export async function load() {
  const size = 5;
  const initialData = await loadAnimalPage({ size });

  const seed = Math.floor(Date.now() / MINUTE_IN_MILLIS);
  const random = new Random(seed);
  const backgroundColor = random.rgb({
    base: 216,
    diff: 32,
  });

  const firstPage = {
    id: "",
    loading: false,
    content: initialData.data,
    error: initialData.error,
  } as const;
  return {
    size,
    firstPage,
    backgroundColor,
  };
}
