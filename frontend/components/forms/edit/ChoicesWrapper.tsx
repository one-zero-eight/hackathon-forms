import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiTypes } from "@/lib/api";
import { Trash2 } from "lucide-react";
import { PropsWithChildren } from "react";

export function ChoicesWrapper({
  children,
  node,
  question,
}: PropsWithChildren<{
  node: apiTypes.SchemaFormNodeOutput;
  question:
    | apiTypes.SchemaSingleChoice
    | apiTypes.SchemaMultipleChoice
    | apiTypes.SchemaRanking;
}>) {
  const { handleUpdateNode } = useEditableForm();
  return (
    <div className="space-y-2">
      {question.options?.map((option, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={option}
            onChange={(e) => {
              const newOptions = [...(question.options || [])];
              newOptions[index] = e.target.value;
              handleUpdateNode(node.id, {
                question: { ...question, options: newOptions },
              });
            }}
            placeholder={`Option ${index + 1}`}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const newOptions = question.options?.filter(
                (_, i) => i !== index,
              );
              handleUpdateNode(node.id, {
                question: { ...question, options: newOptions },
              });
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() => {
          const newOptions = [...(question.options || []), "New Option"];
          handleUpdateNode(node.id, {
            question: { ...question, options: newOptions },
          });
        }}
      >
        Add Option
      </Button>
      {children}
    </div>
  );
}
