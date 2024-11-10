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

export function SettingsTab() {
  const { editableForm, updateForm } = useEditableForm();
  if (!editableForm) return;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="formTitle">Название формы</Label>
            <Input
              id="formTitle"
              placeholder="Введите название формы"
              value={editableForm?.title || ""}
              onChange={(e) => updateForm({ title: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="formDescription">Описание</Label>
            <Textarea
              id="formDescription"
              placeholder="Введите описание формы"
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
      <h1 className="text-2xl font-bold">Invite links</h1>
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
            Create new invite link
          </Button>
        </div>
      </Card>
    </div>
  );
}

function PermissionManager() {
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
      <h1 className="text-2xl font-bold">Other HRs permissions</h1>
      <Card className="p-6">
        <div className="space-y-4">
          {editableForm?.shared_with?.map((userId, i) => {
            const user = users?.find((u) => u.id === userId);
            return (
              <div key={i} className="flex flex-row items-center gap-4">
                <p className="font-medium">{user?.email}</p>
                <Button onClick={() => removeSharedWith(userId)}>Remove</Button>
              </div>
            );
          })}
        </div>
        <Select onValueChange={addSharedWith} value="">
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Add new user" />
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
