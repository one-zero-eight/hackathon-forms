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
  contact: () => null,
  list_of_links: () => null,
  date: () => null,
};

export function EditableNodeRenderer({
  node,
}: {
  node: apiTypes.SchemaFormNodeOutput;
}) {
  const { updateNodeQuestion } = useEditableForm();
  const QuestionComponent = nodeComponents[node.question.question_type];
  return (
    <div className="mt-4 space-y-4 border-t pt-6">
      <ContentEditor node={node} />

      <div>
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
                className="mt-2"
              />
            </div>
          )}
      </div>
    </div>
  );
}
