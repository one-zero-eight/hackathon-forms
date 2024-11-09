import { DateFormNode } from "@/components/forms/view/FormContext";
import { useState } from "react";

export function DateQuestion({ node }: { node: DateFormNode }) {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{node.title}</h3>
      <input
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2"
      />
    </div>
  );
}
