import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiTypes } from "@/lib/api";
import { ComponentType } from "react";
import { ContentEditor } from "./ContentEditor";
import { InputQuestion } from "./InputQuestion";
import { MatchingQuestion } from "./MatchingQuestion";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { RankingQuestion } from "./RankingQuestion";
import { SingleChoiceQuestion } from "./SingleChoiceQuestion";

const nodeComponents: Record<
  apiTypes.SchemaFormNodeOutput["question"]["question_type"],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ComponentType<{ node: apiTypes.SchemaFormNodeOutput; question: any }>
> = {
  input: InputQuestion,
  select: SingleChoiceQuestion,
  // date: DateQuestion,
  scale: SingleChoiceQuestion,
  multiple_choice: MultipleChoiceQuestion,
  ranking: RankingQuestion,
  matching: MatchingQuestion,
};

export function EditableNodeRenderer({
  node,
}: {
  node: apiTypes.SchemaFormNodeOutput;
}) {
  const { handleUpdateNode } = useEditableForm();
  const QuestionComponent = nodeComponents[node.question.question_type];
  return (
    <div className="mt-4 space-y-4 border-t pt-6">
      <ContentEditor node={node} />

      <div>
        <Label className="text-muted-foreground">Correct Answer</Label>
        <QuestionComponent node={node} question={node.question} />

        <div>
          <Label className="text-muted-foreground">Answer Explanation</Label>
          <Textarea
            value={node.question.explanation.explanation || ""}
            onChange={(e) =>
              handleUpdateNode(node.id, {
                question: {
                  ...node.question,
                  explanation: {
                    explanation: e.target.value,
                    for_correct_answer_too: true,
                  },
                },
              })
            }
            placeholder="Add an explanation for this answer..."
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}
