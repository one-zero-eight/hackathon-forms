import { ChoicesWrapper } from "@/components/forms/edit/ChoicesWrapper";
import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
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
  const { handleUpdateNode } = useEditableForm();
  return (
    <ChoicesWrapper node={node} question={question}>
      <Select
        value={(question.correct_answer ?? "") as string}
        onValueChange={(value) => {
          handleUpdateNode(node.id, {
            // @ts-expect-error error
            question: { ...question, correct_answer: value },
          });
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
