import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiTypes } from "@/lib/api";

export function DateQuestion({
  node,
  question,
}: {
  node: apiTypes.SchemaFormNodeOutput;
  question: apiTypes.SchemaDateSelector;
}) {
  const { updateNodeQuestion } = useEditableForm();

  return (
    <>
      <Label className="text-muted-foreground">Correct answer</Label>
      <Input
        placeholder="Введите ответ"
        required={node.required}
        type="date"
        value={question.correct_answer ?? ""}
        onChange={(e) =>
          updateNodeQuestion(node.id, { correct_answer: e.target.value })
        }
      />
    </>
  );
}
