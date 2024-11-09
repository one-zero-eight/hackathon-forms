import { useFormResponse } from "@/components/forms/view/FormResponsesContext";
import { apiTypes } from "@/lib/api";

export function ScaleQuestion({
  node,
  question,
}: {
  node: apiTypes.SchemaFormNodeOutput;
  question: apiTypes.SchemaScale;
}) {
  const { response, setResponse } = useFormResponse<number>(node.id);

  return (
    <div className="flex justify-between">
      {question.scale.map((option, i) => (
        <label key={i} className="flex flex-col items-center space-y-2">
          <input
            type="radio"
            value={i}
            checked={response === i}
            onChange={() => setResponse(i)}
            className="h-4 w-4"
          />
          <span className="text-center text-sm">{option}</span>
        </label>
      ))}
    </div>
  );
}
