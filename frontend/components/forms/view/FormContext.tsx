import { $api, apiTypes } from "@/lib/api";
import { useMe } from "@/lib/api/auth";
import { createContext, PropsWithChildren, useContext } from "react";

export const FormContext = createContext<apiTypes.SchemaForm | undefined>(
  undefined,
);

export function FormProvider({
  id,
  children,
}: PropsWithChildren<{ id: string }>) {
  const me = useMe();
  const { data } = $api.useQuery(
    "get",
    me ? "/form/{form_id}" : "/as-respondee/form/{form_id}/",
    {
      params: { path: { form_id: id } },
    },
  );

  return <FormContext.Provider value={data}>{children}</FormContext.Provider>;
}

export function useForm(): apiTypes.SchemaForm | undefined {
  return useContext(FormContext);
}
