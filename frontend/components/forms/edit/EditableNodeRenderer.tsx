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
import { Textarea } from "@/components/ui/textarea";
import { apiTypes } from "@/lib/api";
import { Trash2 } from "lucide-react";
import { ComponentType } from "react";
import { ContactQuestion } from "./ContactQuestion";
import { ContentEditor } from "./ContentEditor";
import { DateQuestion } from "./DateQuestion";
import { useEditableForm } from "./EditableFormContext";
import { InputQuestion } from "./InputQuestion";
import { ListOfLinksQuestion } from "./ListOfLinksQuestion";
import { MatchingQuestion } from "./MatchingQuestion";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { RankingQuestion } from "./RankingQuestion";
import { ScaleQuestion } from "./ScaleQuestion";
import { SingleChoiceQuestion } from "./SingleChoiceQuestion";

const nodeComponents: Record<
  apiTypes.SchemaFormNodeOutput["question"]["question_type"],
  ComponentType<{ node: apiTypes.SchemaFormNodeOutput; question: any }>
> = {
  input: InputQuestion,
  select: SingleChoiceQuestion,
  multiple_choice: MultipleChoiceQuestion,
  date: DateQuestion,
  scale: ScaleQuestion,
  ranking: RankingQuestion,
  matching: MatchingQuestion,
  contact: ContactQuestion,
  list_of_links: ListOfLinksQuestion,
};

const NODE_TYPES: {
  value: apiTypes.SchemaFormNodeOutput["question"]["question_type"];
  label: string;
}[] = [
  { value: "input", label: "Text answer" },
  { value: "select", label: "Single choice" },
  { value: "multiple_choice", label: "Multiple choice" },
  { value: "date", label: "Date input" },
  { value: "scale", label: "Scale" },
  { value: "ranking", label: "Ranking" },
  { value: "matching", label: "Matching" },
  { value: "contact", label: "Contacts" },
  { value: "list_of_links", label: "List of links" },
] as const;

export function EditableNodeRenderer({
  node,
}: {
  node: apiTypes.SchemaFormNodeOutput;
}) {
  const { updateNodeContent, updateNodeQuestion, deleteNode } =
    useEditableForm();
  const QuestionComponent = nodeComponents[node.question.question_type];
  if (!QuestionComponent) {
    console.error(
      `No component found for question type ${node.question.question_type}`,
    );
    return null;
  }
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center gap-4">
        <Input
          value={node.content.title || ""}
          onChange={(e) =>
            updateNodeContent(node.id, {
              title: e.target.value,
            })
          }
          placeholder="Question title"
          className="flex-1"
        />

        <Select
          value={node.question.question_type}
          onValueChange={(value) =>
            updateNodeQuestion(node.id, {
              question_type:
                value as apiTypes.SchemaFormNodeOutput["question"]["question_type"],
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NODE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteNode(node.id)}
          className="text-destructive"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <ContentEditor node={node} />

        <QuestionComponent node={node} question={node.question} />

        {node.question.question_type !== "list_of_links" &&
          node.question.question_type !== "contact" &&
          node.question.explanation && (
            <div>
              <Label className="text-muted-foreground">
                Answer Explanation
              </Label>
              <Textarea
                value={node.question.explanation.explanation || ""}
                onChange={(e) =>
                  updateNodeQuestion(node.id, {
                    explanation: {
                      explanation: e.target.value,
                      for_correct_answer_too: true,
                    },
                  })
                }
                placeholder="Add an explanation for this answer..."
                className="min-h-0"
                rows={1}
              />
            </div>
          )}
      </div>
    </div>
  );
}
