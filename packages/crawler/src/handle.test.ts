import { type PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import response from '../test/sample.json';
import handle from './handle';
import {
	afterEach,
	beforeEach,
	describe,
	it,
	mock,
	spyOn,
	type Mock,
	expect,
	jest,
} from 'bun:test';
import { Paginator } from './Paginator';

describe(handle.name, () => {
	let supabase: SupabaseClient;

	beforeEach(() => {
		supabase = {
			rpc: () =>
				Promise.resolve({
					count: 20,
					error: null,
				}),
		} as unknown as SupabaseClient;
		mockFetch(JSON.stringify(response));

		for (const method of [
			'log',
			'debug',
			'info',
			'warn',
			'error',
		] as const) {
			spyOn(console, method).mockImplementation(jest.fn());
		}
	});

	afterEach(() => {
		mock.restore();
	});

	describe('calling public API', () => {
		it('passes default page parameters', async () => {
			await handle(supabase, { open_api_service_key: 'foobar' });

			const { calls } = (fetch as Mock<typeof fetch>).mock;
			expect(calls).toHaveLength(1);
			const url = calls[calls.length - 1][0] as URL;
			expect(url.searchParams.get('pageNo')).toBe('1');
			expect(url.searchParams.get('numOfRows')).toBe('100');
		});

		it('passes given parameters', async () => {
			await handle(supabase, {
				open_api_service_key: 'foobar',
				page: 12,
				size: 34,
			});

			const { calls } = (fetch as Mock<typeof fetch>).mock;
			expect(calls).toHaveLength(1);
			const url = calls[calls.length - 1][0] as URL;
			expect(url.searchParams.get('pageNo')).toBe('12');
			expect(url.searchParams.get('numOfRows')).toBe('34');
		});

		it('limits size maximum', async () => {
			await handle(supabase, {
				open_api_service_key: 'foobar',
				size: 20230513,
			});

			const { calls } = (fetch as Mock<typeof fetch>).mock;
			expect(calls).toHaveLength(1);
			const url = calls[calls.length - 1][0] as URL;
			expect(url.searchParams.get('numOfRows')).toBe('1000');
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

			expect(promise).toEqual(expect.rejectsTo.objectContaining({
				message: 'Expected JSON but got non-JSON response',
			}));
		});

		it('fails on bad response', async () => {
			mockFetch(JSON.stringify(response), {
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const promise = handle(supabase, {
				open_api_service_key: 'foobar',
			});

			expect(promise).toEqual(expect.rejectsTo.objectContaining({
				message: 'Expected success but got abnormal response',
			}));
		});

		it('fails on bad result code', async () => {
			mockFetch(
				JSON.stringify({
					...response,
					response: {
						...response.response,
						header: {
							...response.response.header,
							resultCode: '44',
						},
					},
				})
			);

			const promise = handle(supabase, {
				open_api_service_key: 'foobar',
			});

			expect(promise).toEqual(expect.rejectsTo.objectContaining({
				message: 'Expected success but got abnormal response',
			}));
		});
	});

	describe('handling Supabase response', () => {
		it('returns paginator for next page', async () => {
			const result = await handle(supabase, {
				open_api_service_key: 'foobar',
			});

			expect(result?.next).toEqual(new Paginator({
				page: 2,
				size: 100,
			}));
		});

		it('returns undefined when empty list is returned', async () => {
			mockFetch(
				JSON.stringify({
					...response,
					response: {
						...response.response,
						body: {
							...response.response.body,
							items: [],
						},
					},
				})
			);

			const result = await handle(supabase, {
				open_api_service_key: 'foobar',
			});

			expect(result).toBeUndefined();
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

			expect(promise).toEqual(expect.rejectsTo.objectContaining({
				message: 'Error inserting data into DB',
			}));
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
	spyOn(global, 'fetch').mockImplementation(() => {
		return Promise.resolve(new Response(body, init));
	});
}
