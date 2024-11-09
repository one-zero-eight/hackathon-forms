import createFetchClient from "openapi-fetch";
import createQueryClient from "openapi-react-query";
import * as apiTypes from "./types";

export type { apiTypes };

export const apiFetch = createFetchClient<apiTypes.paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});
export const $api = createQueryClient(apiFetch);
