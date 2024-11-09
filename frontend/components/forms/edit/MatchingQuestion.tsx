import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiTypes } from "@/lib/api";
import { Trash2 } from "lucide-react";

export function MatchingQuestion({
  node,
  question,
}: {
  node: apiTypes.SchemaFormNodeOutput;
  question: apiTypes.SchemaMatching;
}) {
  const { updateNodeQuestion } = useEditableForm();
  return (
    <div className="space-y-4">
      <Label className="text-muted-foreground">Correct answer</Label>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Left Items</Label>
          {question.options_first?.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => {
                  const newLeft = [...(question.options_first || [])];
                  newLeft[index] = e.target.value;
                  updateNodeQuestion(node.id, { options_first: newLeft });
                }}
                placeholder={`Left ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newLeft = question.options_first?.filter(
                    (_, i) => i !== index,
                  );
                  updateNodeQuestion(node.id, { options_first: newLeft });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              const newLeft = [...(question.options_first || []), ""];
              updateNodeQuestion(node.id, { options_first: newLeft });
            }}
          >
            Add Left Item
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Right Items</Label>
          {question.options_second?.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => {
                  const newRight = [...(question.options_second || [])];
                  newRight[index] = e.target.value;
                  updateNodeQuestion(node.id, { options_second: newRight });
                }}
                placeholder={`Right ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newRight = question.options_second?.filter(
                    (_, i) => i !== index,
                  );
                  updateNodeQuestion(node.id, { options_second: newRight });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              const newRight = [...(question.options_second || []), ""];
              updateNodeQuestion(node.id, { options_second: newRight });
            }}
          >
            Add Right Item
          </Button>
        </div>
      </div>
      <div className="mt-2 space-y-2">
        {question.options_first?.map((leftItem, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-1/3 text-sm">{leftItem}</span>
            <Select
              value={
                Array.isArray(question.correct_answer)
                  ? question.correct_answer[index] || undefined
                  : undefined
              }
              onValueChange={(value) => {
                const currentAnswers = Array.isArray(question.correct_answer)
                  ? [...question.correct_answer]
                  : new Array(question.options_first?.length).fill(undefined);
                currentAnswers[index] = value;
                updateNodeQuestion(node.id, { correct_answer: currentAnswers });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select match" />
              </SelectTrigger>
              <SelectContent>
                {question.options_second
                  ?.filter((rightItem) => rightItem.trim() !== "")
                  .map((rightItem) => (
                    <SelectItem key={rightItem} value={rightItem}>
                      {rightItem}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
