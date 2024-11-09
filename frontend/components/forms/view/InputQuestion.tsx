import { InputFormNode } from "@/components/forms/view/FormContext";
import { useFormResponse } from "@/components/forms/view/FormResponsesContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InputQuestion({ node }: { node: InputFormNode }) {
  const { response, setResponse } = useFormResponse<string>(node.id);

  return (
    <div className="grid items-center gap-1.5">
      {node.label && <Label>{node.label}</Label>}
      <Input
        placeholder={node.placeholder}
        type="text"
        value={response ?? ""}
        onChange={(e) => setResponse(e.target.value)}
      />
    </div>
  );
}
