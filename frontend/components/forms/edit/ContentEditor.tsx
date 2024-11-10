import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { $api, apiTypes } from "@/lib/api";

export function ContentEditor({
  node,
}: {
  node: apiTypes.SchemaFormNodeOutput;
}) {
  const { updateNodeContent } = useEditableForm();
  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Введите описание"
        required={false}
        className="min-h-0"
        rows={1}
        value={node.content.md_content ?? ""}
        onChange={(e) =>
          updateNodeContent(node.id, { md_content: e.target.value })
        }
      />
      <MediaContentList node={node} />
    </div>
  );
}

function MediaContentList({ node }: { node: apiTypes.SchemaFormNodeOutput }) {
  const { updateNodeContent } = useEditableForm();
  const { mutate: uploadFile } = $api.useMutation(
    "post",
    "/file_worker/upload",
    {
      onSuccess: (data) => {
        updateNodeContent(node.id, {
          medias: [...node.content.medias, data],
        });
      },
    },
  );

  return (
    <div className="flex flex-wrap gap-4">
      {node.content.medias.map((media, i) => (
        <Card key={i} className="relative h-48 w-48 overflow-clip">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/file_worker/download?url=${encodeURIComponent(media)}`}
            alt="media"
          />
          <Button
            className="absolute bottom-0 right-0"
            onClick={() =>
              updateNodeContent(node.id, {
                medias: node.content.medias.filter((_, j) => i !== j),
              })
            }
          >
            Delete
          </Button>
        </Card>
      ))}
      <Card className="flex h-48 w-48 items-center justify-center">
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const formData = new FormData();
            formData.append("file", file);
            // @ts-expect-error type is wrong
            uploadFile({ body: formData });
          }}
        />
      </Card>
    </div>
  );
}
