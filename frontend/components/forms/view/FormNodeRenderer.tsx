import { ContentRenderer } from "@/components/forms/view/ContentRenderer";
import { InputQuestion } from "@/components/forms/view/InputQuestion";
import { MatchingQuestion } from "@/components/forms/view/MatchingQuestion";
import { MultipleChoiceQuestion } from "@/components/forms/view/MultipleChoiceQuestion";
import { RankingQuestion } from "@/components/forms/view/RankingQuestion";
import { ScaleQuestion } from "@/components/forms/view/ScaleQuestion";
import { SingleChoiceQuestion } from "@/components/forms/view/SingleChoiceQuestion";
import { apiTypes } from "@/lib/api";
import { ComponentType } from "react";

const nodeComponents: Record<
  apiTypes.SchemaFormNodeOutput["question"]["question_type"],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ComponentType<{ node: apiTypes.SchemaFormNodeOutput; question: any }>
> = {
  input: InputQuestion,
  select: SingleChoiceQuestion,
  // date: DateQuestion,
  scale: ScaleQuestion,
  multiple_choice: MultipleChoiceQuestion,
  ranking: RankingQuestion,
  matching: MatchingQuestion,
};

export function FormNodeRenderer({
  node,
}: {
  node: apiTypes.SchemaFormNodeOutput;
}) {
  const QuestionComponent = nodeComponents[node.question.question_type];
  return (
    <div className="space-y-3">
      <ContentRenderer node={node} />
      <QuestionComponent node={node} question={node.question} />
    </div>
  );
}
