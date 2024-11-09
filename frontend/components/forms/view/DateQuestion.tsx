import { DateFormNode } from "@/components/forms/view/FormContext";
import { useFormResponse } from "@/components/forms/view/FormResponsesContext";

export function DateQuestion({ node }: { node: DateFormNode }) {
  const { response, setResponse } = useFormResponse<string>(node.id);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{node.title}</h3>
      <input
        type="date"
        value={response ?? ""}
        onChange={(e) => setResponse(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2"
      />
    </div>
  );
}
