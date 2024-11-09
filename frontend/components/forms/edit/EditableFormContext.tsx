import { FormResponsesContext } from "@/components/forms/view/FormResponsesContext";
import { $api, apiTypes } from "@/lib/api";
import { InputQuestion_type } from "@/lib/api/types";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type EditableFormContextType = {
  editableForm: apiTypes.SchemaForm | undefined;
  replaceForm: (newForm: apiTypes.SchemaForm) => void;
  handleUpdateNode: (
    nodeId: number,
    updates: Partial<apiTypes.SchemaFormNodeOutput>,
  ) => void;
  handleAddNode: () => void;
  handleDeleteNode: (nodeId: number) => void;
  handleSaveForm: () => void;
};

export const EditableFormContext = createContext<
  EditableFormContextType | undefined
>(undefined);

export function EditableFormProvider({
  id,
  children,
}: PropsWithChildren<{ id: string }>) {
  const [editableForm, setEditableForm] = useState<apiTypes.SchemaForm>();

  const { data } = $api.useQuery(
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
    }
  }, [data]);

  const handleSaveForm = async () => {};

  const handleUpdateNode = (
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
  };

  const handleAddNode = () => {
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
  };

  const handleDeleteNode = (nodeId: number) => {
    if (!editableForm?.nodes) return;

    setEditableForm({
      ...editableForm,
      nodes: editableForm.nodes.filter((node) => node.id !== nodeId),
    });
  };

  const replaceForm = (newForm: apiTypes.SchemaForm) => {
    setEditableForm(newForm);
  };

  const contextData = {
    editableForm: editableForm,
    replaceForm,
    handleUpdateNode,
    handleAddNode,
    handleDeleteNode,
    handleSaveForm,
  };

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
