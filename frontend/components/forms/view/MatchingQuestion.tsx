import { useFormResponse } from "@/components/forms/view/FormResponsesContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiTypes } from "@/lib/api";

export function MatchingQuestion({
  node,
  question,
}: {
  node: apiTypes.SchemaFormNodeOutput;
  question: apiTypes.SchemaMatching;
}) {
  const { response, setResponse } = useFormResponse<Record<string, string>>(
    node.id,
  );

  const handleMatch = (left: string, right: string) => {
    setResponse({
      ...response,
      [left]: right,
    });
  };

  return (
    <div className="space-y-3">
      {question.options_first.map((left, i) => (
        <div key={i} className="flex items-center space-x-4">
          <span className="w-1/3">{left}</span>
          <Select
            value={response?.[left] ?? ""}
            onValueChange={(selected) => handleMatch(left, selected)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Match with..." />
            </SelectTrigger>
            <SelectContent>
              {question.options_second.map((right) => (
                <SelectItem key={right} value={right}>
                  {right}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
