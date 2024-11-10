import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { $api } from "@/lib/api";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function AnswersTab() {
  const t = useTranslations();
  const { editableForm } = useEditableForm();
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const { data: answers } = $api.useQuery("post", "/form/{form_id}/answers", {
    params: { path: { form_id: editableForm?.id ?? "" } },
    body: {
      invite_id: inviteLink === "-" || !inviteLink ? undefined : inviteLink,
    },
  });
  const { data: invites } = $api.useQuery("get", "/form/{form_id}/invite/", {
    params: { path: { form_id: editableForm?.id ?? "" } },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("forms.edit.tabs.answers")}</h1>

      <Select value={inviteLink ?? ""} onValueChange={setInviteLink}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("common.actions.select")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-">{t("common.actions.all")}</SelectItem>
          {invites?.map((invite) => (
            <SelectItem key={invite.id} value={invite.id}>
              {invite.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {answers?.length === 0 ? (
        <Card className="p-6">
          <h2 className="mb-2 text-xl font-semibold">{t("forms.answers.title")}</h2>
          <p className="text-muted-foreground">{t("forms.answers.noAnswers")}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {answers?.map((answer) => (
            <Card key={answer.id} className="p-6">
              <p>{t("forms.answers.submittedAt")}: {answer.updated_at}</p>
              <p>{t("forms.answers.inviteLink")}: {answer.invite_id}</p>
              <RenderAnswers responses={answer.answers} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function RenderAnswers({ responses }: { responses: Record<number, any> }) {
  const { editableForm } = useEditableForm();

  return (
    <div className="space-y-4">
      {editableForm?.nodes?.map((node, index) => (
        <div key={node.id} className="space-y-2">
          <h2 className="text-xl font-semibold">{node.content.title}</h2>
          <div>
            {/* TODO: Render every type */}
            {node.question.question_type === "input" ? (
              <p>{responses[node.id]}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
