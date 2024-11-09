import { $api } from "@/lib/api/index";

export function useMe() {
  const { data } = $api.useQuery(
    "get",
    "/users/me",
    {},
    {
      refetchInterval: 1000 * 60 * 5, // 5 minutes
    },
  );
  return data;
}
