import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
import { apiTypes } from "@/lib/api";

export function ContactQuestion({
  node,
  question,
}: {
  node: apiTypes.SchemaFormNodeOutput;
  question: apiTypes.SchemaContact;
}) {
  const { updateNodeQuestion } = useEditableForm();

  const list: Record<keyof apiTypes.SchemaContact, string | undefined> = {
    address: "Collect address",
    date_of_birth: "Collect date of birth",
    email: "Collect email",
    fullname: "Collect full name",
    gender: "Collect gender",
    phone: "Collect phone number",
    github: "Collect GitHub username",
    linkedin: "Collect LinkedIn username",
    portfolio: "Collect portfolio URL",
    website: "Collect website URL",
    telegram_alias: "Collect Telegram alias",
    question_type: undefined,
  };

  return (
    <div className="space-y-2">
      {Object.entries(list).map(
        ([k, v]) =>
          v && (
            <label key={k} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  (question[k as keyof apiTypes.SchemaContact] as boolean) ??
                  false
                }
                onChange={() =>
                  updateNodeQuestion(node.id, {
                    [k]: !question[k as keyof apiTypes.SchemaContact],
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>{v}</span>
            </label>
          ),
      )}
    </div>
  );
}
