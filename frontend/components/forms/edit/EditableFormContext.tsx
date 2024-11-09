import { FormResponsesContext } from "@/components/forms/view/FormResponsesContext";
import { $api, apiTypes } from "@/lib/api";
import { InputQuestion_type } from "@/lib/api/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type EditableFormContextType = {
  editableForm: apiTypes.SchemaForm | undefined;
  isPending: boolean;
  isSaving: boolean;
  error: unknown;
  formIsEdited: boolean;
  setEditableForm: (form: apiTypes.SchemaForm) => void;
  updateForm: (updates: Partial<apiTypes.SchemaForm>) => void;
  updateNode: (
    nodeId: number,
    updates: Partial<apiTypes.SchemaFormNodeOutput>,
  ) => void;
  updateNodeContent: (
    nodeId: number,
    updates: Partial<apiTypes.SchemaFormNodeOutput["content"]>,
  ) => void;
  updateNodeQuestion: (
    nodeId: number,
    updates: Partial<apiTypes.SchemaFormNodeOutput["question"]>,
  ) => void;
  addNode: () => void;
  deleteNode: (nodeId: number) => void;
  saveForm: () => void;
};

export const EditableFormContext = createContext<
  EditableFormContextType | undefined
>(undefined);

export function EditableFormProvider({
  id,
  children,
}: PropsWithChildren<{ id: string }>) {
  const [editableForm, setEditableForm] = useState<apiTypes.SchemaForm>();
  const [formIsEdited, setFormIsEdited] = useState(false);

  const queryClient = useQueryClient();
  const { data, isPending, error } = $api.useQuery(
    "get",
    "/form/{form_id}",
    { params: { path: { form_id: id } } },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    },
  );
  useEffect(() => {
    if (data) {
      setEditableForm(data);
      setFormIsEdited(false);
    }
  }, [data]);

  const { mutate: saveMutate, isPending: isSaving } = $api.useMutation(
    "put",
    "/form/{form_id}",
    {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: $api.queryOptions("put", "/form/{form_id}", {
            params: { path: { form_id: id } },
            body: {},
          }).queryKey,
        });
      },
    },
  );

  const saveForm = async () => {
    if (!editableForm) return;
    saveMutate({
      params: { path: { form_id: id } },
      body: editableForm,
    });
  };

  const updateForm = (updates: Partial<apiTypes.SchemaForm>) => {
    if (!editableForm) return;
    setEditableForm({ ...editableForm, ...updates });
    setFormIsEdited(true);
  };

  const updateNode = (
    nodeId: number,
    updates: Partial<apiTypes.SchemaFormNodeOutput>,
  ) => {
    if (!editableForm?.nodes) return;
    setEditableForm({
      ...editableForm,
      nodes: editableForm.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node,
      ),
    });
    setFormIsEdited(true);
  };

  const updateNodeContent = (
    nodeId: number,
    updates: Partial<apiTypes.SchemaFormNodeOutput["content"]>,
  ) => {
    if (!editableForm?.nodes) return;
    updateNode(nodeId, {
      content: { ...editableForm.nodes[nodeId].content, ...updates },
    });
  };

  const updateNodeQuestion = (
    nodeId: number,
    updates: Partial<apiTypes.SchemaFormNodeOutput["question"]>,
  ) => {
    if (!editableForm?.nodes) return;
    updateNode(nodeId, {
      // @ts-expect-error error
      question: { ...editableForm.nodes[nodeId].question, ...updates },
    });
  };

  const addNode = () => {
    if (!editableForm) return;

    const newNode: apiTypes.SchemaFormNodeOutput = {
      id: editableForm.nodes?.length || 0,
      content: {
        medias: [],
      },
      question: {
        question_type: InputQuestion_type.input,
        textarea: false,
        explanation: {
          explanation: "",
          for_correct_answer_too: true,
        },
      },
      required: false,
    };

    setEditableForm({
      ...editableForm,
      nodes: [...(editableForm.nodes || []), newNode],
    });
    setFormIsEdited(true);
  };

  const deleteNode = (nodeId: number) => {
    if (!editableForm?.nodes) return;

    setEditableForm({
      ...editableForm,
      nodes: editableForm.nodes.filter((node) => node.id !== nodeId),
    });
    setFormIsEdited(true);
  };

  const contextData = useMemo(
    () => ({
      editableForm,
      isPending,
      isSaving,
      error,
      formIsEdited,
      setEditableForm,
      updateForm,
      updateNode,
      updateNodeContent,
      updateNodeQuestion,
      addNode,
      deleteNode,
      saveForm,
    }),
    [editableForm, isSaving, isPending, error, formIsEdited],
  );

  return (
    <EditableFormContext.Provider value={contextData}>
      {children}
    </EditableFormContext.Provider>
  );
}

export function useEditableForm(): EditableFormContextType {
  const context = useContext(EditableFormContext);
  if (!context) {
    throw new Error(
      "useEditableForm must be used within a EditableFormProvider",
    );
  }
  return context;
}

export function useEditableNode<T extends apiTypes.SchemaFormNodeOutput>(
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
