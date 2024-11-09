import { ChoicesWrapper } from "@/components/forms/edit/ChoicesWrapper";
import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
import { Label } from "@/components/ui/label";
import { apiTypes } from "@/lib/api";

export function MultipleChoiceQuestion({
  node,
  question,
}: {
  node: apiTypes.SchemaFormNodeOutput;
  question: apiTypes.SchemaMultipleChoice;
}) {
  const { updateNodeQuestion } = useEditableForm();
  return (
    <ChoicesWrapper node={node} question={question}>
      <Label className="text-muted-foreground">Correct answer</Label>
      <div className="mt-2 space-y-2">
        {question.options?.map((option, index) => (
          <label key={index} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={
                Array.isArray(question.correct_answer) &&
                question.correct_answer.includes(index)
              }
              onChange={(e) => {
                const currentAnswers = Array.isArray(question.correct_answer)
                  ? question.correct_answer
                  : [];
                const newAnswers = e.target.checked
                  ? [...currentAnswers, index]
                  : currentAnswers.filter((answer) => answer !== index);
                updateNodeQuestion(node.id, { correct_answer: newAnswers });
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
