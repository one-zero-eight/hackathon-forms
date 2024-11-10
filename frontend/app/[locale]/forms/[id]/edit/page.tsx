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
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <p className="mb-4 text-destructive">{String(error)}</p>
        <Button onClick={() => window.location.reload()}>{commonT("error.tryAgain")}</Button>
      </div>
    );
  }

  if (!editableForm) {
    return (
      <Card className="mx-auto mt-8 max-w-md p-8 text-center">
        <p className="mb-4 text-muted-foreground">{t("formNotFound")}</p>
        <Button onClick={() => router.push("/forms")}>{commonT("actions.back")}</Button>
      </Card>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <TabsList className="grid w-[400px] grid-cols-3">
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              {t("tabs.questions")}
            </TabsTrigger>
            <TabsTrigger value="answers" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {t("tabs.answers")}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {t("tabs.settings")}
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/forms/${editableForm.id}`)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {t("preview")}
            </Button>

            {formIsEdited && (
              <Button onClick={saveForm} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
