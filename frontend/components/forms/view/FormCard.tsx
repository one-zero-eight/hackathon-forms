import { useForm } from "@/components/forms/view/FormContext";
import { FormNodeRenderer } from "@/components/forms/view/FormNodeRenderer";
import { Card } from "@/components/ui/card";

export function FormCard() {
  const form = useForm();

  if (!form) return null;

  return (
    <Card className="flex w-full max-w-2xl flex-col gap-2 p-4">
      <h1 className="mb-6 text-2xl font-bold">{form.title}</h1>
      {form.nodes.map((node) => (
        <FormNodeRenderer key={node.id} node={node} />
      ))}
    </Card>
  );
}
