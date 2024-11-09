import { LikertFormNode } from "@/components/forms/view/FormContext";
import { useState } from "react";

export interface LikertQuestionProps {
  question: string;
  onChange: (value: number) => void;
  value?: number;
}

export function LikertQuestion({ node }: { node: LikertFormNode }) {
  const [value, setValue] = useState<number | undefined>(undefined);
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
              checked={value === i}
              onChange={() => setValue(i)}
              className="h-4 w-4"
            />
            <span className="text-center text-sm">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
