"use client";

import {
  EditableFormProvider,
  useEditableForm,
} from "@/components/forms/edit/EditableFormContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardList,
  Eye,
  Loader2,
  MessageSquare,
  Settings,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnswersTab } from "./AnswersTab";
import { QuestionsTab } from "./QuestionsTab";
import { SettingsTab } from "./SettingsTab";

export default function EditFormPage() {
  const params = useParams();
  return (
    <EditableFormProvider id={params.id as string}>
      <EditFormPage_ />
    </EditableFormProvider>
  );
}

function EditFormPage_() {
  const t = useTranslations("forms.edit");
  const commonT = useTranslations("common");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("questions");
  const { editableForm, formIsEdited, isPending, error, saveForm, isSaving } =
    useEditableForm();

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center px-4">
        <p className="mb-4 text-destructive">{String(error)}</p>
        <Button onClick={() => window.location.reload()}>{commonT("error.tryAgain")}</Button>
      </div>
    );
  }

  if (!editableForm) {
    return (
      <Card className="mx-auto mt-8 max-w-md p-4 sm:p-8 text-center">
        <p className="mb-4 text-muted-foreground">{t("formNotFound")}</p>
        <Button onClick={() => router.push("/forms")}>{commonT("actions.back")}</Button>
      </Card>
    );
  }

  return (
    <div className="container mx-auto space-y-4 sm:space-y-6 p-3 sm:p-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4 sm:space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-3">
            <TabsTrigger value="questions" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <ClipboardList className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">{t("tabs.questions")}</span>
            </TabsTrigger>
            <TabsTrigger value="answers" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">{t("tabs.answers")}</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">{t("tabs.settings")}</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => router.push(`/forms/${editableForm.id}`)}
              className="flex items-center gap-2 text-xs sm:text-sm flex-1 sm:flex-initial justify-center"
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              {t("preview")}
            </Button>

            {formIsEdited && (
              <Button 
                onClick={saveForm} 
                disabled={isSaving}
                className="text-xs sm:text-sm flex-1 sm:flex-initial justify-center"
              >
                {isSaving && <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />}
                {commonT("actions.save")}
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="questions" className="space-y-4">
          <QuestionsTab />
        </TabsContent>

        <TabsContent value="answers">
          <AnswersTab />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
