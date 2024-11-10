import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiTypes } from "@/lib/api";
import { Trash2 } from "lucide-react";
import { PropsWithChildren } from "react";

export function ChoicesWrapper({
  children,
  node,
  questionOptions,
  optionsKey = "options",
}: PropsWithChildren<{
  node: apiTypes.SchemaFormNodeOutput;
  questionOptions: string[];
  optionsKey?: string;
}>) {
  const { updateNodeQuestion } = useEditableForm();
  return (
    <div className="flex flex-col space-y-2">
      <Label className="text-muted-foreground">Answer options</Label>
      {questionOptions.map((option, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={option}
            onChange={(e) => {
              const newOptions = [...(questionOptions || [])];
              newOptions[index] = e.target.value;
              updateNodeQuestion(node.id, { [optionsKey]: newOptions });
            }}
            placeholder={`Option ${index + 1}`}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const newOptions = questionOptions.filter((_, i) => i !== index);
              updateNodeQuestion(node.id, { [optionsKey]: newOptions });
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() => {
          const newOptions = [...(questionOptions || []), "New Option"];
          updateNodeQuestion(node.id, { [optionsKey]: newOptions });
        }}
        className="w-fit"
      >
        Add Option
      </Button>
      {children}
    </div>
  );
}
