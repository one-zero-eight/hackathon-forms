import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { $api, apiTypes } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export function SettingsTab() {
  const t = useTranslations("forms.edit");
  const { editableForm, updateForm } = useEditableForm();
  if (!editableForm) return;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("tabs.settings")}</h1>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="formTitle">{t("form.title.label")}</Label>
            <Input
              id="formTitle"
              placeholder={t("form.title.placeholder")}
              value={editableForm?.title || ""}
              onChange={(e) => updateForm({ title: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="formDescription">{t("form.description.label")}</Label>
            <Textarea
              id="formDescription"
              placeholder={t("form.description.placeholder")}
              value={editableForm?.description || ""}
              onChange={(e) => updateForm({ description: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      </Card>
      <InviteLinksManager />
      <PermissionManager />
    </div>
  );
}

function InviteLinksManager() {
  const t = useTranslations("forms.edit.invites");
  const { editableForm } = useEditableForm();

  const queryClient = useQueryClient();
  const { data: invites } = $api.useQuery("get", "/form/{form_id}/invite/", {
    params: { path: { form_id: editableForm?.id ?? "" } },
  });

  const { mutate: create } = $api.useMutation(
    "post",
    "/form/{form_id}/invite/",
    {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: $api.queryOptions("get", "/form/{form_id}/invite/", {
            params: { path: { form_id: editableForm?.id ?? "" } },
          }).queryKey,
        });
      },
    },
  );

  const getLink = (invite: apiTypes.SchemaInvite) => {
    return `${window.location.origin}/ru/forms/${editableForm?.id}?key=${invite.key}`;
  };

  if (!editableForm) return;

  return (
    <div>
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <Card className="p-6">
        <div className="space-y-4">
          {invites?.map((invite) => (
            <div key={invite.id} className="flex items-center space-x-4">
              <Input
                value={getLink(invite)}
                readOnly
                className="flex-1"
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
          ))}
          <Button
            onClick={() =>
              create({
                params: { path: { form_id: editableForm.id } },
                body: { one_time: false },
              })
            }
            className="btn btn-primary"
          >
            {t("createNew")}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function PermissionManager() {
  const t = useTranslations("forms.edit.permissions");
  const { editableForm, updateForm } = useEditableForm();
  const { data: users } = $api.useQuery("get", "/users/");

  const addSharedWith = (userId: string) => {
    updateForm({
      shared_with: [
        ...(editableForm?.shared_with?.filter((id) => id !== userId) || []),
        userId,
      ],
    });
  };

  const removeSharedWith = (userId: string) => {
    updateForm({
      shared_with: (editableForm?.shared_with || []).filter(
        (id) => id !== userId,
      ),
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <Card className="p-6">
        <div className="space-y-4">
          {editableForm?.shared_with?.map((userId, i) => {
            const user = users?.find((u) => u.id === userId);
            return (
              <div key={i} className="flex flex-row items-center gap-4">
                <p className="font-medium">{user?.email}</p>
                <Button onClick={() => removeSharedWith(userId)}>{t("remove")}</Button>
              </div>
            );
          })}
        </div>
        <Select onValueChange={addSharedWith} value="">
          <SelectTrigger className="w-fit">
            <SelectValue placeholder={t("addNewUser")} />
          </SelectTrigger>
          <SelectContent>
            {users?.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>
    </div>
  );
}
