import type { SupabaseClient } from "@supabase/supabase-js";
import { CustomError } from "./CustomError.ts";
import { Paginator } from "./Paginator.ts";
import { type OpenApiResponse, fetchAnimalList } from "./open_api.ts";

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
    throw new CustomError("no open API service key provided");
  }
  console.info({ openApiServiceKey });

  const animalListResponse = await fetchAnimalList(
    openApiServiceKey,
    paginator,
  );
  const { status, headers, ok } = animalListResponse;

  const contentType = headers.get("Content-Type") ?? "";

  if (!jsonContentTypeHeader.test(contentType)) {
    console.error(
      "wrong content type",
      JSON.stringify({
        status,
        headers,
        contentType,
        text: await animalListResponse.text(),
      }),
    );
    throw new CustomError("Expected JSON but got non-JSON response");
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
    throw new CustomError("Expected success but got abnormal response");
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
    throw new CustomError("Error inserting data into DB");
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
