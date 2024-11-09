import { ChoicesWrapper } from "@/components/forms/edit/ChoicesWrapper";
import { apiTypes } from "@/lib/api";

export function MultipleChoiceQuestion({
  node,
  question,
}: {
  node: apiTypes.SchemaFormNodeOutput;
  question: apiTypes.SchemaMultipleChoice;
}) {
  return (
    <ChoicesWrapper node={node} question={question}>
      <div className="mt-2 space-y-2">
        {question.options?.map((option, index) => (
          <label key={index} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={
                Array.isArray(node.question.correct_answer) &&
                (node.question.correct_answer as string[]).includes(option)
              }
              onChange={(e) => {
                const currentAnswers = Array.isArray(
                  node.question.correct_answer,
                )
                  ? node.question.correct_answer
                  : [];
                const newAnswers = e.target.checked
                  ? [...currentAnswers, option]
                  : currentAnswers.filter((answer) => answer !== option);
                // @ts-expect-error error
                handleUpdateNode(node.id, {
                  question: { ...question, correct_answer: newAnswers },
                });
              }}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm">{option}</span>
          </label>
        ))}
      </div>
    </ChoicesWrapper>
  );
}
