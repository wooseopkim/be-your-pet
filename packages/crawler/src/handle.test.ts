import { type PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import sampleResponse from '../tests/sample-response.json';
import handle from './handle';
import { mock, type Mock } from 'node:test';
import assert from 'node:assert';

describe(handle, () => {
	let supabase: SupabaseClient;

	beforeEach(() => {
		supabase = {
			rpc: () =>
				Promise.resolve({
					count: 20,
					error: null,
				}),
		} as unknown as SupabaseClient;
		mockFetch(JSON.stringify(sampleResponse));
	});

	afterEach(() => {
		mock.restoreAll();
	});

	describe('calling public API', () => {
		it('passes default page parameters', async () => {
			await handle(supabase, { open_api_service_key: 'foobar' });

			const { calls } = (fetch as Mock<typeof fetch>).mock;
			assert.equal(1, calls.length);
			const url = calls[calls.length - 1].arguments[0];
			assert.ok(url instanceof URL);
			assert.equal(url.searchParams.get('pageNo'), '1');
			assert.equal(url.searchParams.get('numOfRows'), '100');
		});

		it('passes given parameters', async () => {
			await handle(supabase, {
				open_api_service_key: 'foobar',
				page: 12,
				size: 34,
			});

			const { calls } = (fetch as Mock<typeof fetch>).mock;
			assert.equal(1, calls.length);
			const url = calls[calls.length - 1].arguments[0];
			assert.ok(url instanceof URL);
			assert.equal(url.searchParams.get('pageNo'), '12');
			assert.equal(url.searchParams.get('numOfRows'), '34');
		});

		it('limits size maximum', async () => {
			await handle(supabase, {
				open_api_service_key: 'foobar',
				size: 20230513,
			});

			const { calls } = (fetch as Mock<typeof fetch>).mock;
			assert.equal(1, calls.length);
			const url = calls[calls.length - 1].arguments[0];
			assert.ok(url instanceof URL);
			assert.equal(url.searchParams.get('numOfRows'), '1000');
		});
	});

	describe('handling public API response', () => {
		it('fails on XML response', async () => {
			mockFetch('', {
				headers: {
					'Content-Type': 'text/xml',
				},
			});

			const promise = handle(supabase, {
				open_api_service_key: 'foobar',
			});

			await assert.rejects(promise, (err) => {
				assert.ok(err instanceof Object && 'message' in err);
				assert.equal(err.message, 'Expected JSON but got non-JSON response');
			});
		});

		it('fails on bad response', async () => {
			mockFetch(JSON.stringify(sampleResponse), {
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const promise = handle(supabase, {
				open_api_service_key: 'foobar',
			});

			await assert.rejects(promise, (err) => {
				assert.ok(err instanceof Object && 'message' in err);
				assert.equal(err.message, 'Expected success but got abnormal response');
			});
		});

		it('fails on bad result code', async () => {
			mockFetch(
				JSON.stringify({
					...sampleResponse,
					response: {
						...sampleResponse.response,
						header: {
							...sampleResponse.response.header,
							resultCode: '44',
						},
					},
				})
			);

			const promise = handle(supabase, {
				open_api_service_key: 'foobar',
			});

			await assert.rejects(promise, (err) => {
				assert.ok(err instanceof Object && 'message' in err);
				assert.equal(err.message, 'Expected success but got abnormal response');
			});
		});
	});

	describe('handling Supabase response', () => {
		it('returns paginator for next page', async () => {
			const result = await handle(supabase, {
				open_api_service_key: 'foobar',
			});

			assert.deepStrictEqual(result?.next, {
				page: 2,
				size: 100,
			});
		});

		it('returns undefined when empty list is returned', async () => {
			mockFetch(
				JSON.stringify({
					...sampleResponse,
					response: {
						...sampleResponse.response,
						body: {
							...sampleResponse.response.body,
							items: [],
						},
					},
				})
			);

			const result = await handle(supabase, {
				open_api_service_key: 'foobar',
			});

			assert.strictEqual(result, undefined);
		});

		it('fails when db error occurs', async () => {
			supabase = {
				rpc: () =>
					Promise.resolve({
						count: null,
						error: {} as PostgrestError,
					}),
			} as unknown as SupabaseClient;

			const promise = handle(supabase, {
				open_api_service_key: 'foobar',
			});

			await assert.rejects(promise, (err) => {
				assert.ok(err instanceof Object && 'message' in err);
				assert.equal(err.message, 'Error inserting data into DB');
			});
		});
	});
});

function mockFetch(
	body?: BodyInit,
	init: ResponseInit = {
		headers: {
			'Content-Type': 'application/json',
		},
	}
) {
	jest.spyOn(global, 'fetch').mockImplementation(() => {
		return Promise.resolve(new Response(body, init));
	});
}
