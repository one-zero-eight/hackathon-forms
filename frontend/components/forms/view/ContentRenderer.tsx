import { apiTypes } from "@/lib/api";

export function ContentRenderer({
  node,
}: {
  node: apiTypes.SchemaFormNodeOutput;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{node.content.title}</h3>
      <p>{node.content.md_content}</p>
      {node.content.medias.map((media, i) => (
        <div key={i}>
          <img src={media} alt="media" />
        </div>
      ))}
    </div>
  );
}
