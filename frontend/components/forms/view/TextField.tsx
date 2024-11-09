import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FormTextField({
  label,
  placeholder,
  type,
}: {
  label?: string;
  placeholder?: string;
  type: "text" | "email";
}) {
  const input = (
    <Input
      placeholder={placeholder}
      type={type === "email" ? "email" : "text"}
    />
  );

  if (label) {
    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>{label}</Label>
        {input}
      </div>
    );
  }

  return <>{input}</>;
}
