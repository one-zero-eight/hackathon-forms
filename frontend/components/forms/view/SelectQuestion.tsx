import { SelectFormNode } from "@/components/forms/view/FormContext";
import { useFormResponse } from "@/components/forms/view/FormResponsesContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectQuestion({ node }: { node: SelectFormNode }) {
  const { response, setResponse } = useFormResponse<string>(node.id);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{node.title}</h3>
      <Select value={response} onValueChange={setResponse}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {node.options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
