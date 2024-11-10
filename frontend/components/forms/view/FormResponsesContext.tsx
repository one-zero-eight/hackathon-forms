import { useForm } from "@/components/forms/view/FormContext";
import { useRouter } from "@/i18n/routing";
import { $api } from "@/lib/api";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

type Response = number | number[] | string | string[] | any;

export type FormResponsesType = {
  responses: Record<string, Response>;
  setResponse: (id: number, value: Response) => void;
  clearResponse: (id: number) => void;
  sendResponses: () => Promise<void>;
};

export const FormResponsesContext = createContext<
  FormResponsesType | undefined
>(undefined);

export function FormResponsesProvider({ children }: PropsWithChildren) {
  const [responses, setResponses] = useState<Record<number, string | string[]>>(
    {},
  );
  const router = useRouter();

  const form = useForm();

  const { mutate: putAnswers } = $api.useMutation(
    "put",
    "/as-respondee/form/{form_id}/answers/",
    {
      onSuccess: () => {
        router.push(`/forms/${form?.id}/thanks`);
      },
    },
  );

  const setResponse = (id: number, value: string | string[]) => {
    setResponses((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const clearResponse = (id: number) => {
    setResponses((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const sendResponses = async () => {
    if (!form) return;
    putAnswers({
      params: { path: { form_id: form.id } },
      body: { answers: responses as any },
    });
  };

  const data: FormResponsesType = useMemo(
    () => ({
      responses,
      setResponse,
      clearResponse,
      sendResponses,
    }),
    [responses],
  );

  return (
    <FormResponsesContext.Provider value={data}>
      {children}
    </FormResponsesContext.Provider>
  );
}

export function useFormResponse<T extends Response>(
  id: number,
): {
  response: T | undefined;
  setResponse: (value: T) => void;
  clearResponse: () => void;
} {
  const context = useContext(FormResponsesContext);
  if (!context) {
    throw new Error(
      "useFormResponse must be used within a FormResponsesProvider",
    );
  }

  return {
    response: context.responses[id] as T | undefined,
    setResponse: (value: T) => context.setResponse(id, value),
    clearResponse: () => context.clearResponse(id),
  };
}
