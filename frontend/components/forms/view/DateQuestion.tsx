import { useFormResponse } from "@/components/forms/view/FormResponsesContext";
import { apiTypes } from "@/lib/api";

export function DateQuestion({
  node,
}: {
  node: apiTypes.SchemaFormNodeOutput;
  question: apiTypes.SchemaInput;
}) {
  const { response, setResponse } = useFormResponse<string>(node.id);

  return (
    <input
      type="date"
      value={response ?? ""}
      onChange={(e) => setResponse(e.target.value)}
      className="w-full rounded-md border border-gray-300 px-3 py-2"
    />
  );
}
