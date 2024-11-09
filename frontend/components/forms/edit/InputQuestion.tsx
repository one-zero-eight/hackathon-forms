import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiTypes } from "@/lib/api";

export function InputQuestion({
  node,
  question,
}: {
  node: apiTypes.SchemaFormNodeOutput;
  question: apiTypes.SchemaInput;
}) {
  const { updateNodeQuestion } = useEditableForm();

  if (question.textarea) {
    return (
      <Textarea
        placeholder="Введите ответ"
        required={node.required}
        value={question.correct_answer ?? ""}
        onChange={(e) =>
          updateNodeQuestion(node.id, { correct_answer: e.target.value })
        }
      />
    );
  } else {
    return (
      <>
        <Label className="text-muted-foreground">Correct answer</Label>
        <Input
          placeholder="Введите ответ"
          required={node.required}
          type="text"
          value={question.correct_answer ?? ""}
          onChange={(e) =>
            updateNodeQuestion(node.id, { correct_answer: e.target.value })
          }
        />
      </>
    );
  }
}
