import { FormTextField } from "@/components/forms/view/TextField";

export function FormComponent(formData: { type: "input" }) {
  if (formData.type === "input") {
    return <FormTextField type="text" label="Ваше имя" />;
  }

  return <div>Unknown form type</div>;
}
