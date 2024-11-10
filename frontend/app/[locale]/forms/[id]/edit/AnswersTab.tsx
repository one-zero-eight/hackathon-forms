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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AnswersTab() {
  const t = useTranslations();
  const { editableForm } = useEditableForm();
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const { data: answers, isLoading: answersLoading, error: answersError } = $api.useQuery("get", "/form/{form_id}/answers", {
    params: { 
      path: { form_id: editableForm?.id ?? "" },
      query: {
        invite_id: inviteLink === "-" || !inviteLink ? undefined : inviteLink,
      }
    },
  });
  const { data: invites, isLoading: invitesLoading } = $api.useQuery("get", "/form/{form_id}/invite/", {
    params: { path: { form_id: editableForm?.id ?? "" } },
  });

  if (answersLoading || invitesLoading) {
    return <div>{t("common.loading")}</div>;
  }

  if (answersError) {
    return <div>{String(answersError)}</div>;
  }

  return (
    <div className="space-y-4 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{t("forms.edit.tabs.answers")}</h1>

      <Select value={inviteLink ?? ""} onValueChange={setInviteLink}>
        <SelectTrigger className="w-full max-w-md">
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
        <Card className="p-4 sm:p-6 md:p-8">
          <h2 className="mb-2 text-lg sm:text-xl font-semibold">{t("forms.answers.title")}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{t("forms.answers.noAnswers")}</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {answers?.map((answer) => (
            <Card key={answer.id} className="p-4 sm:p-6 md:p-8">
              <div className="space-y-2 sm:space-y-3">
                <p className="text-sm sm:text-base">
                  {t("forms.answers.submittedAt")}: {answer.updated_at}
                </p>
                <p className="text-sm sm:text-base">
                  {t("forms.answers.inviteLink")}: {answer.invite_id}
                </p>
                <p className="text-sm sm:text-base">
                  {t("forms.answers.sessionId")}: {answer.session_id}
                </p>
                <RenderAnswers responses={answer.answers} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function RenderAnswers({ responses }: { responses: Record<string, any> }) {
  const t = useTranslations();
  const { editableForm } = useEditableForm();

  const renderResponse = (node: any, response: any) => {
    switch (node.question.question_type) {
      case "input":
        return <p className="whitespace-pre-wrap">{response}</p>;
      
      case "select":
        return <p>{node.question.options[response] ?? response}</p>;
      
      case "multiple_choice":
        return Array.isArray(response) ? (
          <ul className="list-disc pl-4">
            {response.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">{t("forms.answers.invalidFormat")}</p>
        );
      
      case "date":
        return <p>{response}</p>;
      
      case "scale":
        return response !== undefined && response !== null ? (
          <p>{node.question.scale[response] ?? response}</p>
        ) : null;
      
      case "ranking":
        return Array.isArray(response) ? (
          <ol className="list-decimal pl-4">
            {response.map((index) => (
              <li key={index}>{node.question.options[index]}</li>
            ))}
          </ol>
        ) : (
          <p className="text-muted-foreground">{t("forms.answers.invalidFormat")}</p>
        );
      
      case "matching":
        return typeof response === 'object' && response !== null ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("forms.answers.matching.item")}</TableHead>
                <TableHead>{t("forms.answers.matching.matchedWith")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(response).map(([key, value], index) => (
                <TableRow key={index}>
                  <TableCell>{String(key)}</TableCell>
                  <TableCell>{String(value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">{t("forms.answers.invalidFormat")}</p>
        );
      
      case "contact":
        if (!response || typeof response !== 'object') {
          return <p className="text-muted-foreground">{t("forms.answers.invalidFormat")}</p>;
        }
        
        return (
          <div className="space-y-1">
            {Object.entries(response).map(([key, value]) => {
              if (!value) return null;
              const displayValue = String(value);
              
              return (
                <p key={key} className="text-sm">
                  {key}: {displayValue}
                </p>
              );
            })}
          </div>
        );
      
      case "list_of_links":
        return Array.isArray(response) ? (
          <ul className="list-disc pl-4">
            {response.map((link, index) => (
              <li key={index}>
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">{t("forms.answers.invalidFormat")}</p>
        );

      default:
        return <p className="text-muted-foreground">{t("forms.answers.unsupportedType")}</p>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {editableForm?.nodes?.map((node) => (
        <div key={node.id} className="space-y-2 sm:space-y-3">
          <h2 className="text-lg sm:text-xl font-semibold break-words">
            {node.content.title}
          </h2>
          <div className="text-sm sm:text-base break-words">
            {renderResponse(node, responses[node.id])}
          </div>
        </div>
      ))}
    </div>
  );
}
