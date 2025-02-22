import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  setDefaultTimeout,
} from "bun:test";
import fakeTimers, { type InstalledClock } from "@sinonjs/fake-timers";
import retry from "./retry";

setDefaultTimeout(1000);

describe(retry.name, () => {
  let clock: InstalledClock;

  beforeEach(() => {
    clock = fakeTimers.install();
  });

  afterEach(() => {
    clock.uninstall();
    mock.restore();
  });

  it("does not retry on success", async () => {
    const target = () => Promise.resolve();
    const generate = function* () {
      yield 100;
      return 10;
    };

    const p = retry(target, generate);

    expect(p).resolves.toBeUndefined();
  });

  it("does not retry on immediate abort", async () => {
    const target = () => Promise.reject();
    // biome-ignore lint/correctness/useYield: no yields intended
    const generate = function* () {
      return 10;
    };

    const p = retry(target, generate);

    expect(p).rejects.toBeUndefined();
  });

  it("resolves when retry is successful", async () => {
    let tries = 0;
    const target = () => {
      if (tries++ < 3) {
        return Promise.reject();
      }
      return Promise.resolve();
    };
    const generate = function* () {
      yield 1000;
      yield 2000;
      yield 3000;
      yield 4000;
      yield 5000;
      return 10;
    };

    const p = retry(target, generate);
    await clock.tickAsync(100_000);

    expect(p).resolves.toBeUndefined();
  });
});
