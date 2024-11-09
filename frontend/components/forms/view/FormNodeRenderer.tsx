import { DateQuestion } from "@/components/forms/view/DateQuestion";
import { FormNode } from "@/components/forms/view/FormContext";
import { InputQuestion } from "@/components/forms/view/InputQuestion";
import { LikertQuestion } from "@/components/forms/view/LikertQuestion";
import { MatchingQuestion } from "@/components/forms/view/MatchingQuestion";
import { MultipleChoiceQuestion } from "@/components/forms/view/MultipleChoiceQuestion";
import { RankingQuestion } from "@/components/forms/view/RankingQuestion";
import { SelectQuestion } from "@/components/forms/view/SelectQuestion";
import { ComponentType } from "react";

const nodeComponents: Record<
  FormNode["type"],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ComponentType<{ node: any }>
> = {
  input: InputQuestion,
  select: SelectQuestion,
  date: DateQuestion,
  likert: LikertQuestion,
  "multiple-choice": MultipleChoiceQuestion,
  ranking: RankingQuestion,
  matching: MatchingQuestion,
};

export function FormNodeRenderer({ node }: { node: FormNode }) {
  const Component = nodeComponents[node.type];
  return <Component node={node} />;
}
