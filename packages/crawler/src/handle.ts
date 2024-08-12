import { createClient } from '@supabase/supabase-js';
import { CustomError } from './CustomError';
import { Paginator } from './Paginator';
import { supabaseKey, supabaseUrl } from './env';
import { fetchAnimalList, type PublicApiResponse } from './public-api';

const jsonContentTypeHeader = /^application\/json(;.+)?/;

export type Request = Partial<Paginator> & {
	totalCount?: number;
};

export default async function handle(request?: Request) {
	const paginator = new Paginator(request);
	const animalListResponse = await fetchAnimalList(paginator);
	const { status, headers, ok } = animalListResponse;

	const contentType = headers.get('Content-Type') ?? '';

	if (!jsonContentTypeHeader.test(contentType)) {
		console.error(
			'wrong content type',
			JSON.stringify({
				status,
				headers,
				contentType,
				text: await animalListResponse.text(),
			})
		);
		throw new CustomError('Expected JSON but got non-JSON response');
	}

	const animalListBody: PublicApiResponse = await animalListResponse.json();

	if (!ok || animalListBody.response.header.resultCode !== '00') {
		console.error(
			'abnormal response',
			JSON.stringify({
				status,
				headers,
				request,
			})
		);
		throw new CustomError('Expected success but got abnormal response');
	}

	const apiList =
		'body' in animalListBody.response ? animalListBody.response.body.items.item : ([] as never);
	const apiCount =
		'body' in animalListBody.response ? animalListBody.response.body.totalCount : (0 as never);
	const totalCount = request?.totalCount ?? apiCount;

	const supabase = createClient(supabaseUrl, supabaseKey);

	if (apiList === undefined || apiList.length === 0) {
		console.warn(
			'end of list',
			JSON.stringify({
				status,
				headers,
				request,
				animalListBody,
			})
		);
		return undefined;
	}

	const records = apiList
		.map((x) => ({
			body: x,
		}))
		.filter(({ body: { desertionNo } }, index, array) => {
			return array.findIndex((x) => x.body.desertionNo === desertionNo) === index;
		});

	const result = await supabase.rpc(
		'upsert_animals',
		{ data: records },
		{
			count: 'exact',
		}
	);
	const { count: upsertedCount, error } = result;

	if (error != null) {
		console.error(
			'error inserting data',
			JSON.stringify({
				error,
				records,
				upsertedCount,
			})
		);
		throw new CustomError('Error inserting data into DB');
	}

	console.debug(
		'successful response',
		JSON.stringify({
			status,
			headers,
			request,
			animalListBody,
			apiCount,
			totalCount,
			upsertedCount,
		})
	);
	return {
		next: paginator.next(),
		totalCount,
	};
}
