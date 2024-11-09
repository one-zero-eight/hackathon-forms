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
  setResponse: (id: string, value: Response) => void;
  clearResponse: (id: string) => void;
};

export const FormResponsesContext = createContext<
  FormResponsesType | undefined
>(undefined);

export function FormResponsesProvider({ children }: PropsWithChildren) {
  const [responses, setResponses] = useState<Record<string, string | string[]>>(
    {},
  );

  const setResponse = (id: string, value: string | string[]) => {
    setResponses((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const clearResponse = (id: string) => {
    setResponses((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const data: FormResponsesType = useMemo(
    () => ({
      responses,
      setResponse,
      clearResponse,
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
  id: string,
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
