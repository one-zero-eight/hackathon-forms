import { LikertFormNode } from "@/components/forms/view/FormContext";
import { useFormResponse } from "@/components/forms/view/FormResponsesContext";

export function LikertQuestion({ node }: { node: LikertFormNode }) {
  const { response, setResponse } = useFormResponse<number>(node.id);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{node.title}</h3>
      <div className="flex justify-between">
        {node.options.map((option, i) => (
          <label key={i} className="flex flex-col items-center space-y-2">
            <input
              type="radio"
              name={node.title}
              value={i}
              checked={response === i}
              onChange={() => setResponse(i)}
              className="h-4 w-4"
            />
            <span className="text-center text-sm">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
