import { MatchingFormNode } from "@/components/forms/view/FormContext";
import { useFormResponse } from "@/components/forms/view/FormResponsesContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function MatchingQuestion({ node }: { node: MatchingFormNode }) {
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
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{node.title}</h3>
      <div className="space-y-3">
        {node.left.map((left, i) => (
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
                {node.right.map((right) => (
                  <SelectItem key={right} value={right}>
                    {right}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
