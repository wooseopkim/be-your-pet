import type { Paginator } from './Paginator';
import retry from './retry';

export type OpenApiResponse = {
	response:
	| {
		header: {
			reqNo: string;
			resultCode: never;
			resultMsg: string;
			errorMsg: string;
		};
	}
	| {
		header: {
			reqNo: string;
			resultCode: '00';
			resultMsg: string;
		};
		body: {
			items: {
				item: Record<string, unknown>[];
			};
			numOfRows: number;
			pageNo: number;
			totalCount: number;
		};
	};
};

const MAX_SIZE = 1000; // https://www.data.go.kr/data/15098931/openapi.do

export async function fetchAnimalList(openApiServiceKey: string, { page, size }: Paginator) {
	const url = new URL('http://apis.data.go.kr/1543061/abandonmentPublicSrvc/abandonmentPublic');
	const { searchParams } = url;
	searchParams.set('serviceKey', openApiServiceKey);
	searchParams.set('pageNo', String(page));
	searchParams.set('numOfRows', String(Math.min(size, MAX_SIZE)));
	searchParams.set('_type', 'json');
	return await retry(() => fetch(url), generateFetchAnimalListDelays);
}

function* generateFetchAnimalListDelays() {
	const second = 1 * 1000;
	const minute = 60 * second;
	yield 1 * second;
	yield 1 * minute;
	yield 10 * minute;
	return 0;
}
