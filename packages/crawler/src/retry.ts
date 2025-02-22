export default async function retry<T>(
  target: () => Promise<T>,
  generateDelays: () => Generator<number, number, number>,
): Promise<T> {
  try {
    return await target();
  } catch {
    const delays = generateDelays();
    return retryUntilDone(target, delays);
  }
}

async function retryUntilDone<T>(
  target: () => Promise<T>,
  delays: Generator<number, number, number>,
) {
  while (true) {
    const { done, value } = delays.next();
    if (done) {
      return Promise.reject();
    }
    try {
      return await retryAfter(target, value);
    } catch {
      // biome-ignore lint/correctness/noUnnecessaryContinue: intended no-op
      continue;
    }
  }
}

async function retryAfter<T>(target: () => Promise<T>, delay: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
  return await target();
}
