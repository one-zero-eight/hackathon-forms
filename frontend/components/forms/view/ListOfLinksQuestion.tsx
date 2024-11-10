import { useFormResponse } from "@/components/forms/view/FormResponsesContext";
import { apiTypes } from "@/lib/api";

export function ListOfLinksQuestion({
  node,
}: {
  node: apiTypes.SchemaFormNodeOutput;
  question: apiTypes.SchemaListOfLinks;
}) {
  const { response, setResponse } = useFormResponse<string>(node.id);

  return <div className="flex flex-col space-y-2"></div>;
}
