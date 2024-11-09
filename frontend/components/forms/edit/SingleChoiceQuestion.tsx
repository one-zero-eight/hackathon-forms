import { ChoicesWrapper } from "@/components/forms/edit/ChoicesWrapper";
import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiTypes } from "@/lib/api";

export function SingleChoiceQuestion({
  node,
  question,
}: {
  node: apiTypes.SchemaFormNodeOutput;
  question: apiTypes.SchemaSingleChoice;
}) {
  const { updateNodeQuestion } = useEditableForm();
  return (
    <ChoicesWrapper node={node} question={question}>
      <Label className="text-muted-foreground">Correct answer</Label>
      <Select
        value={(question.correct_answer ?? "") as string}
        onValueChange={(value) => {
          updateNodeQuestion(node.id, { correct_answer: value });
        }}
      >
        <SelectTrigger className="mt-2">
          <SelectValue placeholder="Select correct answer" />
        </SelectTrigger>
        <SelectContent>
          {question.options
            ?.filter((option) => option.trim() !== "")
            .map((option, i) => (
              <SelectItem key={i} value={option}>
                {option}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </ChoicesWrapper>
  );
}
