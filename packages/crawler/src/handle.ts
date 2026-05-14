import type { SupabaseClient } from "@supabase/supabase-js";
import { Paginator } from "./Paginator.ts";
import { type OpenApiResponse, fetchAnimalList } from "./open_api.ts";
import {
  DatabaseInsertError,
  MalformedApiResponseError,
  NoOpenApiServiceKeyProvidedError,
  UnsuccessfulApiResponseError,
} from "./errors.ts";

const jsonContentTypeHeader = /^application\/json(;.+)?/;

export type Request = Partial<Paginator> & {
  totalCount?: number;
  openApiServiceKey: string;
};

export default async function handle(
  supabase: SupabaseClient,
  request: Request,
) {
  const paginator = new Paginator(request);
  const { openApiServiceKey } = request;

  if (!openApiServiceKey) {
    throw new NoOpenApiServiceKeyProvidedError();
  }
  console.info({ openApiServiceKey });

  const animalListResponse = await fetchAnimalList(
    openApiServiceKey,
    paginator,
  );
  const { status, headers, ok } = animalListResponse;

  const contentType = headers.get("Content-Type") ?? "";

  if (!jsonContentTypeHeader.test(contentType)) {
    const text = await animalListResponse.text();
    console.error(
      "wrong content type",
      JSON.stringify({
        status,
        headers,
        contentType,
        text,
      }),
    );
    throw new MalformedApiResponseError(text);
  }

  const animalListBody: OpenApiResponse = await animalListResponse.json();

  if (!ok || animalListBody.response.header.resultCode !== "00") {
    console.error(
      "abnormal response",
      JSON.stringify({
        status,
        headers,
        request,
      }),
    );
    throw new UnsuccessfulApiResponseError(
      status,
      JSON.stringify(animalListBody),
    );
  }

  const apiList =
    "body" in animalListBody.response
      ? animalListBody.response.body.items.item
      : ([] as never);
  const apiCount =
    "body" in animalListBody.response
      ? animalListBody.response.body.totalCount
      : (0 as never);
  const totalCount = request?.totalCount ?? apiCount;

  if (apiList === undefined || apiList.length === 0) {
    console.warn(
      "end of list",
      JSON.stringify({
        status,
        headers,
        request,
        animalListBody,
      }),
    );
    return undefined;
  }

  const records = apiList
    .map((x) => ({
      body: x,
    }))
    .filter(({ body: { desertionNo } }, index, array) => {
      return (
        array.findIndex((x) => x.body.desertionNo === desertionNo) === index
      );
    });

  const result = await supabase.rpc(
    "upsert_animals",
    { data: records },
    {
      count: "exact",
    },
  );
  const { count: upsertedCount, error } = result;

  if (error != null) {
    console.error(
      "error inserting data",
      JSON.stringify({
        error,
        records,
        upsertedCount,
      }),
    );
    throw new DatabaseInsertError(error);
  }

  console.debug(
    "successful response",
    JSON.stringify({
      status,
      headers,
      request,
      animalListBody,
      apiCount,
      totalCount,
      upsertedCount,
    }),
  );
  return {
    next: paginator.next(),
    totalCount,
  };
}
