import { $api, apiTypes } from "@/lib/api";
import { createContext, PropsWithChildren, useContext } from "react";
import { formData } from "./mock";

export const FormContext = createContext<apiTypes.SchemaForm | undefined>(
  undefined,
);

export function FormProvider({
  id,
  children,
}: PropsWithChildren<{ id: string }>) {
  const { data } = $api.useQuery("get", "/form/{form_id}", {
    params: { path: { form_id: id } },
  });

  return (
    <FormContext.Provider value={formData}>{children}</FormContext.Provider>
  );
}

export function useForm(): apiTypes.SchemaForm | undefined {
  return useContext(FormContext);
}
