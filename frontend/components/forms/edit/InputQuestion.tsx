import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiTypes } from "@/lib/api";

export function InputQuestion({
  node,
  question,
}: {
  node: apiTypes.SchemaFormNodeOutput;
  question: apiTypes.SchemaInput;
}) {
  const { handleUpdateNode } = useEditableForm();

  if (question.textarea) {
    return (
      <Textarea
        placeholder="Введите ответ"
        required={node.required}
        value={question.correct_answer ?? ""}
        onChange={(e) =>
          handleUpdateNode(node.id, {
            // @ts-expect-error error
            question: { ...question, correct_answer: e.target.value },
          })
        }
      />
    );
  } else {
    return (
      <Input
        placeholder="Введите ответ"
        required={node.required}
        type="text"
        value={question.correct_answer ?? ""}
        onChange={(e) =>
          handleUpdateNode(node.id, {
            // @ts-expect-error error
            question: { ...question, correct_answer: e.target.value },
          })
        }
      />
    );
  }
}
