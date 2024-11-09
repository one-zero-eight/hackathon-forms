import { InputFormNode } from "@/components/forms/view/FormContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InputQuestion({ node }: { node: InputFormNode }) {
  return (
    <div className="grid items-center gap-1.5">
      {node.label && <Label>{node.label}</Label>}
      <Input placeholder={node.placeholder} type="text" />
    </div>
  );
}
