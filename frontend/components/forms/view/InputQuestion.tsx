import { useFormResponse } from "@/components/forms/view/FormResponsesContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiTypes } from "@/lib/api";

export function InputQuestion({
  node,
  question,
}: {
  node: apiTypes.SchemaFormNodeOutput;
  question: apiTypes.SchemaInput;
}) {
  const { response, setResponse } = useFormResponse<string>(node.id);

  if (question.textarea) {
    return (
      <Textarea
        placeholder="Введите ответ"
        required={node.required}
        value={response ?? ""}
        onChange={(e) => setResponse(e.target.value)}
      />
    );
  } else {
    return (
      <Input
        placeholder="Введите ответ"
        required={node.required}
        type="text"
        value={response ?? ""}
        onChange={(e) => setResponse(e.target.value)}
      />
    );
  }
}
