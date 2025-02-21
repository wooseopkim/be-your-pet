import { mock, type Mock } from 'node:test';
import retry from './retry';
import assert from 'node:assert';

describe(retry, () => {
	beforeEach(() => {
		mock.timers.enable();
		mock.method(globalThis, 'setTimeout')
			.mock
			.mockImplementation(setTimeout);
	});

	afterEach(() => {
		mock.timers.reset();
		mock.restoreAll();
	});

	it('does not retry on success', async () => {
		const target = () => Promise.resolve();
		const generate = function* () {
			yield 100;
			return 10;
		};

		const p = retry(target, generate);

		assert.strictEqual(await p, undefined);
	});

	it('does not retry on immediate abort', async () => {
		const target = () => Promise.reject();
		// eslint-disable-next-line require-yield
		const generate = function* () {
			return 10;
		};

		const p = retry(target, generate);

		assert.strictEqual(await p, undefined);
	});

	it('triggers again on failures', async () => {
		const target = () => Promise.reject();
		const generate = function* () {
			yield 1000;
			yield 2000;
			yield 3000;
			return 10;
		};

		const p = retry(target, generate);
		mock.timers.tick(100_000);

		assert.rejects(p);
		const { calls } = (setTimeout as Mock<typeof setTimeout>).mock;
		assert.equal(calls.map((x) => x.arguments.slice(1)), [
			1000,
			2000,
			3000,
		]);
	});

	it('resolves when retry is successful', async () => {
		let retries = 0;
		const target = function partial() {
			retries++;
			if (retries <= 3) {
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
		mock.timers.tick(100_000);

		assert.strictEqual(await p, undefined);
		const { calls } = (setTimeout as Mock<typeof setTimeout>).mock;
		assert.equal(calls.map((x) => x.arguments.slice(1)), [
			1000,
			2000,
			3000,
		]);
	});
});
