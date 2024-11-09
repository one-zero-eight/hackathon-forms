import { useFormResponse } from "@/components/forms/view/FormResponsesContext";
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
  const { response, setResponse } = useFormResponse<string>(node.id);

  return (
    <Select value={response} onValueChange={setResponse}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {question.options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
