import { useForm } from "@/components/forms/view/FormContext";
import { FormNodeRenderer } from "@/components/forms/view/FormNodeRenderer";
import { FormResponsesContext } from "@/components/forms/view/FormResponsesContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useContext } from "react";

export function FormCard() {
  const form = useForm();
  const formResponses = useContext(FormResponsesContext);
  if (!form || !formResponses) return null;

  return (
    <Card className="flex w-full max-w-2xl flex-col gap-2 p-4">
      <h1 className="mb-6 text-2xl font-bold">{form.title}</h1>
      {form.nodes.map((node, i) => (
        <FormNodeRenderer key={i} node={node} />
      ))}
      <Button onClick={() => formResponses.sendResponses()}>Закончить</Button>
    </Card>
  );
}
