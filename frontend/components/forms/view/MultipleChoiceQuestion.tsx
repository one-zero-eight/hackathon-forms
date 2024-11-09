import { MultipleChoiceFormNode } from "@/components/forms/view/FormContext";
import { useFormResponse } from "@/components/forms/view/FormResponsesContext";

export interface MultipleChoiceQuestionProps {
  question: string;
  options: string[];
  onChange: (values: string[]) => void;
  value?: string[];
}

export function MultipleChoiceQuestion({
  node,
}: {
  node: MultipleChoiceFormNode;
}) {
  const { response, setResponse } = useFormResponse<string[]>(node.id);

  const toggleOption = (option: string) => {
    if (response?.includes(option)) {
      setResponse(response.filter((value) => value !== option));
    } else {
      setResponse([...(response ?? []), option]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{node.title}</h3>
      <div className="space-y-2">
        {node.options.map((option) => (
          <label key={option} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={response?.includes(option) ?? false}
              onChange={() => toggleOption(option)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
