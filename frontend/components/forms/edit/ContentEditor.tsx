import { useEditableForm } from "@/components/forms/edit/EditableFormContext";
import { Textarea } from "@/components/ui/textarea";
import { apiTypes } from "@/lib/api";

export function ContentEditor({
  node,
}: {
  node: apiTypes.SchemaFormNodeOutput;
}) {
  const { updateNodeContent } = useEditableForm();
  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Введите вопрос"
        required={true}
        value={node.content.title ?? ""}
        onChange={(e) => updateNodeContent(node.id, { title: e.target.value })}
      />
      <Textarea
        placeholder="Введите описание"
        required={false}
        value={node.content.md_content ?? ""}
        onChange={(e) =>
          updateNodeContent(node.id, { md_content: e.target.value })
        }
      />
      {node.content.medias.map((media, i) => (
        <div key={i}>
          <img src={media} alt="media" />
        </div>
      ))}
    </div>
  );
}
