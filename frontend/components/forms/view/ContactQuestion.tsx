import { useFormResponse } from "@/components/forms/view/FormResponsesContext";
import { Input } from "@/components/ui/input";
import { apiTypes } from "@/lib/api";

export function ContactQuestion({
  node,
  question,
}: {
  node: apiTypes.SchemaFormNodeOutput;
  question: apiTypes.SchemaContact;
}) {
  const { response, setResponse } = useFormResponse<string>(node.id);

  const list: Record<keyof apiTypes.SchemaContact, string | undefined> = {
    address: "Your address",
    date_of_birth: "Your date of birth",
    email: "Your email",
    fullname: "Your full name",
    gender: "Your gender",
    phone: "Your phone number",
    github: "Your GitHub username",
    linkedin: "Your LinkedIn username",
    portfolio: "Your portfolio URL",
    website: "Your website URL",
    telegram_alias: "Your Telegram alias",
    question_type: undefined,
  };

  return (
    <>
      {Object.entries(list).map(
        ([k, v]) =>
          v &&
          question[k as keyof apiTypes.SchemaContact] && (
            <Input
              key={k}
              placeholder={v}
              required={node.required}
              type="text"
              value={response ?? ""}
              onChange={(e) => setResponse(e.target.value)}
            />
          ),
      )}
    </>
  );
}
