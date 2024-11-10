import { apiTypes } from "@/lib/api";
import { ComponentType } from "react";
import { ContactQuestion } from "./ContactQuestion";
import { ContentRenderer } from "./ContentRenderer";
import { DateQuestion } from "./DateQuestion";
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
  date: DateQuestion,
  scale: ScaleQuestion,
  multiple_choice: MultipleChoiceQuestion,
  ranking: RankingQuestion,
  matching: MatchingQuestion,
  contact: ContactQuestion,
  list_of_links: ListOfLinksQuestion,
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
